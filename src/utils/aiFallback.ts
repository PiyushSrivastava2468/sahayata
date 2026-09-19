import { StudentProfile, ResumeBulletsResult, Roadmap } from '../types';

export function getFallbackChatResponse(query: string, profile: StudentProfile): { text: string; suggestedChips: string[]; relevantOpportunityIds?: string[] } {
  const q = query.toLowerCase();

  if (q.includes('1st year') || q.includes('first year') || q.includes('1st yr')) {
    return {
      text: `Namaste ${profile.name}! 1st year engineering me hona sabse bada advantage hai kyunki aapke paas 3 saal ka clean runway hai:\n\n` +
        `1. **Core Language Master Karein**: C++ ya Java me se ek language chuniye. Loops, functions, arrays, aur basic pointers clear kar lijiye.\n` +
        `2. **Campus Programs Join Karein**: Microsoft Learn Student Ambassador (MLSA) ya GitHub Campus Expert join karein. Isme placement interviews nahi, community participation dekhte hain aur free Azure/swags milte hain!\n` +
        `3. **1st-Year Scholarships**: Agar aapki family income under ₹15 Lakhs hai, toh **Reliance Foundation Undergraduate Scholarship** (₹2 Lakhs) me zaroor apply karein—iski deadline October me aati hai!\n\n` +
        `Bataiye, abhi college me C language padha rahe hain ya kuch aur?`,
      suggestedChips: [
        'Reliance Scholarship details',
        'C++ basics roadmap',
        'College vs Coding balance'
      ],
      relevantOpportunityIds: ['opp-reliance', 'opp-microsoft-mlsa', 'opp-github-campus']
    };
  }

  if (q.includes('dsa') || q.includes('coding') || q.includes('leetcode') || q.includes('placement')) {
    return {
      text: `Bilkul, tier-2/3 colleges ke liye DSA sabse solid ticket hai campus aur off-campus placements crack karne ka!\n\n` +
        `Roz 1.5 - 2 ghante ka realistic schedule banaiye:\n` +
        `1. **STL / Collections (Hafta 1)**: Vector, Map, Set, Queue ka time complexity yaad kar lijiye.\n` +
        `2. **Standard Patterns (Hafte 2-4)**: Two Pointers, Sliding Window, aur Binary Search par 30 standard questions practice karein (Striver ki A2Z sheet follow karein).\n` +
        `3. **Consistency over Quantity**: Roz 10 question solve karne ki zaroorat nahi hai. Roz **2 ache questions** bina solution dekhe 30 minutes try karein.\n\n` +
        `Maine aapke profile ke liye ek 6-week DSA roadmap ready kiya hai. Kya aap use timeline me dekhna chahte hain?`,
      suggestedChips: [
        '6-week DSA Roadmap kholo',
        'Non-CS branch se DSA kaise karein?',
        'LeetCode easy solve nahi ho raha'
      ]
    };
  }

  if (q.includes('eee') || q.includes('mech') || q.includes('civil') || q.includes('electrical') || q.includes('non-cs') || q.includes('non cs')) {
    return {
      text: `Yeh sawaal hazaaron students ka hota hai! Tension bilkul mat lijiye—top product aur service companies 40%+ hires core branches (EEE, MECH, ECE) se leti hain:\n\n` +
        `1. **Semester Labs vs Coding Balance**: Weekdays par lab files college library me hi nipta lein. Evening 8pm - 10pm sirf coding ko de.\n` +
        `2. **Core CS Subjects**: 3rd year aane tak DBMS (SQL queries), OOPs, aur OS ke top 50 interview questions zaroor padh lein.\n` +
        `3. **1 Solid Live Project**: Resume me prove karna padega ki aapko building aati hai. Ek live hosted full-stack project bana lein jiska demo recruiter dekh sake.\n\n` +
        `Aap abhi kaunse year me hain aur daily kitna time nikal paate hain?`,
      suggestedChips: [
        'Core branch project ideas',
        'Top 50 SQL interview questions',
        'Flipkart GRiD hackathon details'
      ],
      relevantOpportunityIds: ['opp-flipkart-grid', 'opp-cisco-aicte', 'opp-isro-internship']
    };
  }

  if (q.includes('scholarship') || q.includes('paisa') || q.includes('fees') || q.includes('financial') || q.includes('grant')) {
    return {
      text: `Tier-2/3 college students ke liye kai verified scholarships hain jinke forms students miss kar dete hain:\n\n` +
        `1. **Reliance Foundation Undergraduate Scholarship**: Har saal 5,000 students ko milti hai (₹2,00,000 grant).\n` +
        `2. **NSP Post-Matric Central Scheme**: Annual income < 2.5 LPA walo ko poori college tuition fee + hostel allowance direct bank account (DBT) me aati hai.\n` +
        `3. **Women in Tech Grants**: Google Generation Scholarship ($2,500) aur Adobe WIT Scholarship female students ke liye tuition cover karti hain!\n\n` +
        `Aap Opportunity Feed me 'Scholarship' filter laga kar check kar sakte hain!`,
      suggestedChips: [
        'Reliance Scholarship eligibility',
        'NSP document checklist',
        'Women tech scholarships'
      ],
      relevantOpportunityIds: ['opp-reliance', 'opp-nsp-postmatric', 'opp-adobe-wit', 'opp-google-generation']
    };
  }

  if (q.includes('project') || q.includes('resume') || q.includes('web dev') || q.includes('mern')) {
    return {
      text: `Generic To-Do List ya Weather app banana band karein—recruiters unhe dekhte hi skip kar dete hain! Yeh 3 high-impact project ideas try karein:\n\n` +
        `1. **Local Kirana Billing / Ledger Web App**: React + Supabase use karke QR receipt generation aur monthly khata ledger banayein.\n` +
        `2. **Campus Peer Notes & PyQ Repository**: AKTU/UPTU ke previous year questions aur student notes sharing platform with upvote system.\n` +
        `3. **Hostel Mess Food Waste Tracker**: Weekly menu analytics aur student headcount voting system.\n\n` +
        `Aapne abhi tak koi project banaya hai? Agar haan, toh Sahayata ke 'Resume Helper' tool me details daaliye, main turant STAR bullet points bana dunga!`,
      suggestedChips: [
        'Resume bullets generate karein',
        'Cold DM template for alumni',
        'GitHub profile kaise sajayein'
      ]
    };
  }

  // General default fallback
  return {
    text: `Aapka sawaal bohot sahi hai, ${profile.name}! Sahayata Bhaiya yahan aapke tier-2/3 college journey ko empower karne ke liye hain.\n\n` +
      `Aapke profile ke mutabiq (${profile.year}, ${profile.branch} - ${profile.city}):\n` +
      `1. **Right Opportunities**: Opportunity feed me check karein, humne aapke branch ke mutabiq verified internships aur hackathons filter kiye hain.\n` +
      `2. **Structured Roadmap**: Bina bhatke 6 hafte ka study plan follow karein.\n` +
      `3. **Portfolio & Outreach**: Apne projects ko resume me strong bullets aur seniors ko respectful cold outreach karke refer karwayein.\n\n` +
      `Mujhse kuch bhi poochein: "Internship kaise dhundhein", "DSA roadmap", ya "Scholarship criteria"!`,
    suggestedChips: [
      'Top 3 internships for my branch',
      'DSA 6-week roadmap',
      'Resume bullet points generate karo'
    ]
  };
}

export function getFallbackResumeBullets(
  projectName: string,
  techStack: string,
  rawDetails: string,
  targetRole: string
): ResumeBulletsResult {
  const pName = projectName || 'Campus Portal Application';
  const stack = techStack || 'React, Node.js, Express, PostgreSQL';
  const role = targetRole || 'Software Engineering Intern';

  return {
    bullets: [
      `Engineered a responsive full-stack ${pName} utilizing ${stack}, reducing user lookup latency by 42% through optimized database indexing.`,
      `Architected RESTful API endpoints and role-based authentication securing data for 250+ active campus peers.`,
      `Designed an intuitive mobile-first interface adhering to modern responsive standards, achieving 98% positive usability feedback in local beta testing.`,
      `Implemented automated state caching and edge error fallbacks, ensuring zero downtime and resilient offline session recovery.`
    ],
    cold_dm:
      `Subject: Seeking Guidance & Referral for ${role} - ${pName}\n\n` +
      `Hi [Name],\n\n` +
      `I came across your inspiring engineering journey on LinkedIn and admire your work at [Company Name].\n\n` +
      `I am currently a student from tier-2 college pursuing my degree, with strong foundations in ${stack.split(',')[0] || 'C++'} and algorithmic problem solving. I recently built ${pName} to solve real-world student workflows.\n\n` +
      `I would be deeply grateful for 5 minutes of your advice on preparing for ${role} roles at [Company Name], or if you would be open to reviewing my resume for potential openings.\n\n` +
      `Portfolio/GitHub: [Link]\n\n` +
      `Thank you for your time and guidance,\n` +
      `[Your Name]`
  };
}
