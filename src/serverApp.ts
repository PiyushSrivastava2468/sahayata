import express, { Router } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_OPPORTUNITIES,
  DEFAULT_STUDENT_PROFILE,
  SAMPLE_ROADMAPS,
} from './data/seedOpportunities';
import { Opportunity, StudentProfile, Roadmap, AdminAnalytics } from './types';
import { evaluateEligibility } from './utils/matcher';
import { getFallbackChatResponse, getFallbackResumeBullets } from './utils/aiFallback';

dotenv.config();

export const app = express();

app.use(express.json());

// Enable CORS for API routes so Vercel preview and custom domains work smoothly
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// In-memory data store for live demo interaction
let opportunities: Opportunity[] = [...INITIAL_OPPORTUNITIES];
let studentProfiles: Record<string, StudentProfile> = {
  'student-demo': { ...DEFAULT_STUDENT_PROFILE },
};
let roadmaps: Record<string, Roadmap> = { ...SAMPLE_ROADMAPS };

// Lazy Gemini API client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }
  return genAIClient;
}

const apiRouter = Router();

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Sahayata Career Navigator API', version: '1.0.0' });
});

// 1. Student Profile API
apiRouter.post('/profile', (req, res) => {
  const profileData: Partial<StudentProfile> = req.body;
  const id = profileData.id || 'student-demo';

  const updatedProfile: StudentProfile = {
    id,
    name: profileData.name || 'Amit Sharma',
    year: profileData.year || '2nd Year',
    branch: profileData.branch || 'EEE',
    college: profileData.college || 'AKGEC Ghaziabad',
    city: profileData.city || 'Ghaziabad',
    skills: profileData.skills || ['C++', 'Basics of DSA'],
    interests: profileData.interests || ['Software Placements'],
    preferredLanguage: profileData.preferredLanguage || 'hinglish',
    targetGoal: profileData.targetGoal || 'DSA for Campus Placements',
  };

  studentProfiles[id] = updatedProfile;
  res.json({ status: 'success', profile: updatedProfile });
});

apiRouter.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const profile = studentProfiles[userId] || studentProfiles['student-demo'] || DEFAULT_STUDENT_PROFILE;
  res.json({ profile });
});

// 2. Opportunities Feed API (with computed eligibility)
apiRouter.get('/opportunities', (req, res) => {
  const { type, search, userId } = req.query;
  const profile = (userId && studentProfiles[String(userId)]) || studentProfiles['student-demo'] || DEFAULT_STUDENT_PROFILE;

  let filtered = [...opportunities];

  if (type && type !== 'all') {
    filtered = filtered.filter((opp) => opp.type === type);
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (opp) =>
        opp.title.toLowerCase().includes(q) ||
        opp.organization.toLowerCase().includes(q) ||
        opp.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // Calculate real-time eligibility for each opportunity
  const mapped = filtered.map((opp) => ({
    ...opp,
    eligibility: evaluateEligibility(profile, opp),
  }));

  res.json({
    opportunities: mapped,
    total: mapped.length,
    activeProfile: {
      name: profile.name,
      year: profile.year,
      branch: profile.branch,
    },
  });
});

// Admin: Add new opportunity
apiRouter.post('/opportunities', (req, res) => {
  const newOpp: Partial<Opportunity> = req.body;
  if (!newOpp.title || !newOpp.organization) {
    return res.status(400).json({ error: 'Title and organization are required' });
  }

  const created: Opportunity = {
    id: `opp-${Date.now()}`,
    title: newOpp.title,
    organization: newOpp.organization,
    description: newOpp.description || 'Verified student opportunity.',
    type: newOpp.type || 'internship',
    eligibility_text: newOpp.eligibility_text || 'Open to all students.',
    eligible_years: newOpp.eligible_years || ['All'],
    eligible_branches: newOpp.eligible_branches || ['All'],
    stipend_or_amount: newOpp.stipend_or_amount || 'Certificate / Stipend',
    deadline: newOpp.deadline || '2026-12-31',
    link: newOpp.link || 'https://udaan.in',
    tags: newOpp.tags || ['opportunity'],
    is_featured: Boolean(newOpp.is_featured),
    apply_steps: newOpp.apply_steps || ['Apply on official website', 'Verify eligibility with college TPO'],
  };

  opportunities.unshift(created);
  res.status(201).json({ status: 'created', opportunity: created });
});

// Admin: Delete opportunity
apiRouter.delete('/opportunities/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = opportunities.length;
  opportunities = opportunities.filter((o) => o.id !== id);
  res.json({ success: opportunities.length < initialLength });
});

// 3. AI Career Chat API (Hinglish Mentor)
apiRouter.post('/chat', async (req, res) => {
  const { message, userId } = req.body;
  const userMsg = (message || '').trim();

  if (!userMsg) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const profile = (userId && studentProfiles[String(userId)]) || studentProfiles['student-demo'] || DEFAULT_STUDENT_PROFILE;
  const ai = getGenAI();

  if (ai) {
    try {
      const systemInstruction = `
You are "Sahayata Bhaiya / Didi", an empathetic, street-smart, friendly career mentor for Indian students in tier-2 and tier-3 colleges (like AKTU, PTU, RGPV, and state universities in towns like Ghaziabad, Kanpur, Patna, Lucknow).

Student Profile:
- Name: ${profile.name}
- Year: ${profile.year}
- Branch: ${profile.branch}
- College/City: ${profile.college}, ${profile.city}
- Known Skills: ${profile.skills.join(', ')}
- Interests: ${profile.interests.join(', ')}

Guidelines:
1. Tone: Friendly, grounded, encouraging Hinglish (natural Hindi in English alphabet mixed with English technical terms).
2. Grounded in tier-2/3 realities: busy college lab files, semester schedules, lack of top campus recruitments, lack of seniors to guide.
3. Structure: Acknowledge the question with warm empathy, provide exactly 3 clear actionable steps (Step 1, Step 2, Step 3), and point to free Indian community resources (Striver takeUforward, Love Babbar, Chai aur Code, GFG, Internshala, National Scholarship Portal).
4. Keep response crisp (around 150-250 words). Avoid corporate buzzwords.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nStudent Query: "${userMsg}"` }] }
        ]
      });

      const responseText = response.text || '';
      if (responseText) {
        return res.json({
          response: responseText,
          suggestedChips: [
            'How to balance college labs & coding?',
            'Top 3 scholarships for my branch',
            'Generate a 6-week roadmap'
          ]
        });
      }
    } catch (err) {
      console.warn('Gemini chat generation failed, falling back to local guidance engine:', err);
    }
  }

  // Graceful high-quality fallback engine
  const fallback = getFallbackChatResponse(userMsg, profile);
  return res.json({
    response: fallback.text,
    suggestedChips: fallback.suggestedChips,
    relevantOpportunityIds: fallback.relevantOpportunityIds
  });
});

// 4. Skill Roadmap Generator API
apiRouter.post('/roadmap/generate', async (req, res) => {
  const { goal, weeks, userId } = req.body;
  const targetGoal = goal || 'DSA Foundation for Placements';
  const targetWeeks = Number(weeks) || 6;
  const profile = (userId && studentProfiles[String(userId)]) || studentProfiles['student-demo'] || DEFAULT_STUDENT_PROFILE;

  const ai = getGenAI();
  if (ai) {
    try {
      const prompt = `
Generate a ${targetWeeks}-week structured study and skill roadmap for an Indian engineering student (${profile.year}, ${profile.branch}) aiming for: "${targetGoal}".
Return strictly valid JSON with this schema:
{
  "title": "Roadmap Title",
  "targetGoal": "${targetGoal}",
  "totalWeeks": ${targetWeeks},
  "weeks": [
    {
      "week_number": 1,
      "theme": "Theme title",
      "topics": ["Topic 1", "Topic 2"],
      "tasks": ["Specific practice task 1", "Task 2"],
      "resources": [
        {"title": "Resource Name", "url": "https://takeuforward.org"}
      ]
    }
  ]
}
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.weeks && parsed.weeks.length > 0) {
        const roadmapObj: Roadmap = {
          id: `rm-${Date.now()}`,
          title: parsed.title || `${targetGoal} (${targetWeeks} Weeks)`,
          targetGoal,
          totalWeeks: targetWeeks,
          weeks: parsed.weeks,
          completedTasks: []
        };
        roadmaps[roadmapObj.id] = roadmapObj;
        return res.json({ status: 'success', roadmap: roadmapObj });
      }
    } catch (err) {
      console.warn('Gemini roadmap generation failed, using curated blueprint:', err);
    }
  }

  // Curated roadmap fallback
  const presetKey = targetGoal.toLowerCase().includes('web') ? 'webdev-freelance' : 'dsa-placements';
  const selectedRoadmap = SAMPLE_ROADMAPS[presetKey] || SAMPLE_ROADMAPS['dsa-placements'];
  res.json({ status: 'success', roadmap: selectedRoadmap });
});

// 5. Resume & Cold Outreach Generator API
apiRouter.post('/resume/bullets', async (req, res) => {
  const { projectName, techStack, description, targetRole } = req.body;
  const pName = projectName || 'Campus Project';
  const stack = techStack || 'React, Express, PostgreSQL';
  const rawDesc = description || 'Built a web application for students to search notes and internships.';
  const role = targetRole || 'Software Engineering Intern';

  const ai = getGenAI();
  if (ai) {
    try {
      const prompt = `
You are a senior tech recruiter and resume mentor helping tier-2/3 Indian college students land tech jobs.
Project Name: ${pName}
Technologies Used: ${stack}
Raw details: ${rawDesc}
Target Role: ${role}

Generate:
1. 3-4 high impact Google XYZ / STAR format resume bullet points (Action verb + technical context + quantified or clear impact).
2. 1 polite, humble, high-response rate Cold LinkedIn / Email message (under 120 words) to reach out to an alumnus or hiring manager.

Return strictly JSON:
{
  "bullets": ["bullet 1", "bullet 2", "bullet 3"],
  "cold_dm": "Subject: ...\\n\\nHi [Name], ..."
}
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.bullets && parsed.cold_dm) {
        return res.json({ status: 'success', result: parsed });
      }
    } catch (err) {
      console.warn('Gemini resume bullet generator failed, using fallback:', err);
    }
  }

  const fallback = getFallbackResumeBullets(pName, stack, rawDesc, role);
  res.json({ status: 'success', result: fallback });
});

// 6. Admin Analytics API
apiRouter.get('/admin/analytics', (req, res) => {
  const analytics: AdminAnalytics = {
    totalStudents: 1420,
    totalOpportunities: opportunities.length,
    topSearchedSkills: [
      { skill: 'Data Structures & Algorithms (C++)', count: 684 },
      { skill: 'Full-Stack Web Development', count: 512 },
      { skill: 'Python & Machine Learning', count: 390 },
      { skill: 'SQL & Database Design', count: 280 },
      { skill: 'Core Branch Tech Placement', count: 245 },
    ],
    mostViewedOpportunities: [
      { title: 'Reliance Foundation Undergraduate Scholarship', views: 2420 },
      { title: 'Smart India Hackathon (SIH) 2026', views: 1910 },
      { title: 'Amazon ML Summer School 2026', views: 1650 },
      { title: 'Flipkart GRiD 7.0 SDE Track', views: 1280 },
      { title: 'Cisco Virtual Internship Program 2026', views: 1120 },
    ],
  };

  res.json(analytics);
});

// Mount router under /api
app.use('/api', apiRouter);

export default app;
