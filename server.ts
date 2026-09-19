import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_RESOURCES,
  INITIAL_QUERIES,
  INITIAL_INCIDENTS,
  PROCESS_GUIDES,
  NATIONAL_HELPLINES,
} from './src/data/mockCampusData';
import { CampusResource, IncidentReport, QueryLog } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for live demo interaction
let resources: CampusResource[] = [...INITIAL_RESOURCES];
let queries: QueryLog[] = [...INITIAL_QUERIES];
let incidents: IncidentReport[] = [...INITIAL_INCIDENTS];

// Initialize Google GenAI client lazily
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

// Haversine formula to compute great-circle distance in meters
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Heuristic fallback classifier for 100% offline & instant resilience
function heuristicClassify(userQuery: string) {
  const q = userQuery.toLowerCase();

  // Emergency triggers
  const emergencyKeywords = [
    'harassment', 'threat', 'unconscious', 'rape', 'suicide', 'unsafe',
    'chhedchhad', 'attack', 'bleeding', 'fracture', 'ambulance', 'picha',
    'following me', 'bachao', 'help me', 'danger', 'gun', 'knife', 'marpeet',
    'ragging', 'violence', 'accident', 'fainted'
  ];

  const isEmergency = emergencyKeywords.some((kw) => q.includes(kw));

  // Language detection heuristic
  const hindiWords = ['mujhe', 'chahiye', 'kahan', 'paas', 'karein', 'kare', 'batao', 'madad', 'lag', 'raha', 'hai', 'kaise', 'likhun', 'bachao', 'chhedchhad'];
  const hasHindiWord = hindiWords.some((hw) => q.includes(hw)) || /[\u0900-\u097F]/.test(userQuery);
  const hasEnglishWord = /[a-zA-Z]/.test(userQuery);
  const detectedLang = hasHindiWord && hasEnglishWord ? 'Hinglish' : hasHindiWord ? 'Hindi' : 'English';

  let detectedIntent: 'Medical' | 'Security' | 'Counseling' | 'Admin' | 'Other' = 'Other';
  let suggestedCategory: 'security' | 'medical' | 'women_safety' | 'counseling' | 'admin' = 'security';
  let processGuideId: string | undefined = undefined;

  if (q.includes('medic') || q.includes('doctor') || q.includes('health') || q.includes('dispensary') || q.includes('hospital') || q.includes('ambulance') || q.includes('faint') || q.includes('chot')) {
    detectedIntent = 'Medical';
    suggestedCategory = 'medical';
    if (q.includes('leave') || q.includes('attendance') || q.includes('waiver')) {
      processGuideId = 'proc-medical-leave';
    }
  } else if (q.includes('women') || q.includes('girl') || q.includes('icc') || q.includes('harass') || q.includes('unsafe') || q.includes('posh') || q.includes('warden')) {
    detectedIntent = 'Security';
    suggestedCategory = 'women_safety';
    processGuideId = 'proc-posh-grievance';
  } else if (q.includes('ragging') || q.includes('senior') || q.includes('threat') || q.includes('security') || q.includes('guard') || q.includes('police') || q.includes('gate')) {
    detectedIntent = 'Security';
    suggestedCategory = 'security';
    if (q.includes('ragging') || q.includes('complain')) {
      processGuideId = 'proc-anti-ragging';
    }
  } else if (q.includes('depress') || q.includes('stress') || q.includes('anxiety') || q.includes('counsel') || q.includes('suicide') || q.includes('mental') || q.includes('manas')) {
    detectedIntent = 'Counseling';
    suggestedCategory = 'counseling';
  } else if (q.includes('id') || q.includes('card') || q.includes('leave') || q.includes('exam') || q.includes('fee') || q.includes('dsw') || q.includes('hostel') || q.includes('library')) {
    detectedIntent = 'Admin';
    suggestedCategory = 'admin';
    if (q.includes('id') || q.includes('card')) {
      processGuideId = 'proc-lost-id';
    }
  }

  let responseEn = '';
  let responseHi = '';

  if (isEmergency) {
    responseEn = `EMERGENCY ALERT: Immediate security & emergency response hubs have been activated. Please stay in a well-lit area. Tap the SOS call or WhatsApp live location below.`;
    responseHi = `आपातकालीन सूचना: तत्काल सुरक्षा और मेडिकल सहायता केंद्र सक्रिय कर दिए गए हैं। सुरक्षित स्थान पर रहें, नीचे दिए गए SOS कॉल या लाइव लोकेशन शेयर का उपयोग करें।`;
  } else if (detectedIntent === 'Medical') {
    responseEn = `Found campus Health Center & Dispensary behind Cafeteria (Doctor on duty) and Sushila Hospital emergency desk.`;
    responseHi = `कैंपस हेल्थ सेंटर (कैफेटेरिया के पीछे) और सुशीला हॉस्पिटल इमरजेंसी डेस्क उपलब्ध हैं।`;
  } else if (suggestedCategory === 'women_safety') {
    responseEn = `Connected to ICC Women's Grievance Cell (Block B Room 104) and UP Women Powerline 1090.`;
    responseHi = `आईसीसी विमेंस सेल (ब्लॉक बी रूम 104) और यूपी विमेन पावर लाइन 1090 से कनेक्ट किया जा रहा है।`;
  } else if (processGuideId) {
    responseEn = `Step-by-step procedural guidelines and document checklist are ready for you.`;
    responseHi = `प्रक्रिया के चरण और आवश्यक दस्तावेजों की चेकलिस्ट नीचे तैयार है।`;
  } else {
    responseEn = `Here are the nearest campus contact desks and verified officers for your request.`;
    responseHi = `आपके अनुरोध के लिए निकटतम कैंपस संपर्क केंद्र और अधिकृत अधिकारी नीचे उपलब्ध हैं।`;
  }

  return {
    detected_intent: detectedIntent,
    is_emergency: isEmergency,
    language: detectedLang,
    confidence: 0.94,
    response_en: responseEn,
    response_hi: responseHi,
    action_type: isEmergency ? 'emergency_sos' : processGuideId ? 'show_process_guide' : 'show_resources',
    suggested_category: suggestedCategory,
    process_guide_id: processGuideId,
    incident_draft: isEmergency ? {
      category: detectedIntent === 'Medical' ? 'Medical' : q.includes('ragging') ? 'Ragging' : q.includes('harass') ? 'Harassment' : 'Security',
      urgency: 'Critical',
      description: `Immediate alert triggered by user query: "${userQuery}". User urgently requires on-site campus response.`,
      suggested_action: 'Dispatch Quick Response Team / Notify Chief Warden & Campus Control Room'
    } : undefined
  };
}

// ---------------- API ROUTES ----------------

// 1. Classify Intent & Triage with Gemini or Resilient Heuristic
app.post('/api/classify-intent', async (req, res) => {
  const { query: userQuery, lat, long } = req.body;

  if (!userQuery || typeof userQuery !== 'string') {
    return res.status(400).json({ error: 'Query text is required.' });
  }

  const userLat = typeof lat === 'number' ? lat : 28.7183;
  const userLong = typeof long === 'number' ? long : 77.4812;

  // Check with GenAI if key is present
  const ai = getGenAI();

  let classificationResult;

  if (ai) {
    try {
      const prompt = `You are "Sahayata", an AI-powered emergency & campus assistant for college campuses in India (RKGIT Ghaziabad).
Analyze this student query:
"${userQuery}"

Task:
1. Detect Intent: 'Medical' | 'Security' | 'Counseling' | 'Admin' | 'Other'
2. Emergency Detection: If query mentions harassment, stalking, threat, physical fight, sexual abuse, severe accident, suicide, unconsciousness, bleeding, unsafe feeling, set is_emergency = true.
3. Detect Language: 'Hindi' | 'English' | 'Hinglish'
4. Provide concise reassuring response in English (response_en) and in Hindi (response_hi).
5. Suggested category: 'security' | 'medical' | 'women_safety' | 'counseling' | 'admin'
6. Action type: 'emergency_sos' (if emergency), 'show_process_guide' (if query asks how-to/process for ID, ragging, leave, complaint), or 'show_resources'.
7. If process related, check if it matches: 'proc-lost-id', 'proc-anti-ragging', 'proc-posh-grievance', or 'proc-medical-leave'.
8. If emergency, provide an incident draft.

Return ONLY valid JSON matching this exact structure:
{
  "detected_intent": "Medical" | "Security" | "Counseling" | "Admin" | "Other",
  "is_emergency": boolean,
  "language": "Hindi" | "English" | "Hinglish",
  "confidence": number,
  "response_en": "string",
  "response_hi": "string",
  "action_type": "emergency_sos" | "show_resources" | "show_process_guide" | "general_info",
  "suggested_category": "security" | "medical" | "women_safety" | "counseling" | "admin",
  "process_guide_id": "proc-lost-id" | "proc-anti-ragging" | "proc-posh-grievance" | "proc-medical-leave" | null,
  "incident_draft": {
    "category": "Security" | "Medical" | "Harassment" | "Ragging" | "Other",
    "urgency": "Low" | "Medium" | "Critical",
    "description": "string",
    "suggested_action": "string"
  } | null
}`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const responseText = aiResponse.text?.trim();
      if (responseText) {
        classificationResult = JSON.parse(responseText);
      }
    } catch (error) {
      console.warn('Gemini API call failed, falling back to local heuristic:', error);
    }
  }

  // Fallback if AI not initialized or errored
  if (!classificationResult) {
    classificationResult = heuristicClassify(userQuery);
  }

  // Automatically log query to query history
  const newLog: QueryLog = {
    id: `q-${Date.now()}`,
    text: userQuery,
    detected_intent: classificationResult.detected_intent,
    is_emergency: classificationResult.is_emergency,
    language: classificationResult.language,
    timestamp: 'Just now',
    lat: userLat,
    long: userLong,
  };
  queries.unshift(newLog);

  // Return classification result
  res.json(classificationResult);
});

// 2. Get Nearby Resources with dynamic distance calculation
app.get('/api/resources', (req, res) => {
  const { lat, long, category } = req.query;

  const userLat = lat ? parseFloat(lat as string) : 28.7183;
  const userLong = long ? parseFloat(long as string) : 77.4812;
  const filterCat = category as string | undefined;

  let results = resources.map((r) => {
    const dist = calculateDistanceMeters(userLat, userLong, r.lat, r.long);
    return {
      ...r,
      distance_meters: dist,
    };
  });

  if (filterCat && filterCat !== 'all') {
    results = results.filter((r) => r.category === filterCat);
  }

  // Sort by nearest distance
  results.sort((a, b) => (a.distance_meters || 0) - (b.distance_meters || 0));

  res.json({
    user_location: { lat: userLat, long: userLong },
    total: results.length,
    resources: results,
  });
});

// 3. Admin: Add New Resource
app.post('/api/admin/resources', (req, res) => {
  const { name, category, lat, long, phone, address, office_hours, contact_person, is_emergency_hub } = req.body;

  if (!name || !phone || !category) {
    return res.status(400).json({ error: 'Name, phone, and category are required.' });
  }

  const newResource: CampusResource = {
    id: `res-${Date.now()}`,
    name,
    category,
    lat: Number(lat) || 28.7183,
    long: Number(long) || 77.4812,
    phone,
    address: address || 'RKGIT Campus',
    office_hours: office_hours || '9:00 AM - 5:00 PM',
    contact_person: contact_person || 'Campus Coordinator',
    is_emergency_hub: Boolean(is_emergency_hub),
  };

  resources.push(newResource);
  res.status(201).json(newResource);
});

// 4. Admin: Edit Resource
app.put('/api/admin/resources/:id', (req, res) => {
  const { id } = req.params;
  const idx = resources.findIndex((r) => r.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Resource not found.' });
  }

  resources[idx] = {
    ...resources[idx],
    ...req.body,
    id, // protect id
  };

  res.json(resources[idx]);
});

// 5. Admin: Delete Resource
app.delete('/api/admin/resources/:id', (req, res) => {
  const { id } = req.params;
  resources = resources.filter((r) => r.id !== id);
  res.json({ success: true, message: `Resource ${id} deleted.` });
});

// 6. Incidents: List
app.get('/api/incidents', (req, res) => {
  res.json({ incidents });
});

// 7. Incidents: Create / Report
app.post('/api/incidents', (req, res) => {
  const { category, description, lat, long, location_name, urgency, contact_number } = req.body;

  const newIncident: IncidentReport = {
    id: `inc-${Date.now()}`,
    category: category || 'Security',
    description: description || 'Urgent campus incident reported via Sahayata quick-action.',
    lat: Number(lat) || 28.7183,
    long: Number(long) || 77.4812,
    location_name: location_name || 'Near RKGIT Campus',
    status: 'Reported',
    urgency: urgency || 'Critical',
    created_at: 'Just now',
    contact_number: contact_number || '+91-XXXXXXXXXX',
  };

  incidents.unshift(newIncident);
  res.status(201).json(newIncident);
});

// 8. Incidents: Update Status (Contacted, Resolved)
app.patch('/api/incidents/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const incident = incidents.find((i) => i.id === id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found.' });
  }

  if (status) {
    incident.status = status;
  }

  res.json(incident);
});

// 9. Admin: Query Logs
app.get('/api/queries', (req, res) => {
  res.json({ queries });
});

// 10. Process Guides & Helplines
app.get('/api/processes', (req, res) => {
  res.json({
    processes: PROCESS_GUIDES,
    national_helplines: NATIONAL_HELPLINES,
  });
});

// 11. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Sahayata Campus Assistant',
    version: '1.0.0-hackathon-mvp',
    has_gemini_key: Boolean(process.env.GEMINI_API_KEY),
  });
});

// ---------------- VITE & STATIC SERVING ----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sahayata backend server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
