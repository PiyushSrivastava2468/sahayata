import { IntentClassificationResponse, ResourceCategory } from '../types';

// Haversine formula to compute great-circle distance in meters
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
export function heuristicClassify(
  userQuery: string,
  userLat: number = 28.7183,
  userLong: number = 77.4812
): IntentClassificationResponse {
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
  let suggestedCategory: ResourceCategory = 'security';
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
    responseHi = `विस्तृत प्रक्रिया और दस्तावेज़ चेकलिस्ट तैयार है।`;
  } else {
    responseEn = `Here are the nearest campus contact centers and support offices for RKGIT Ghaziabad.`;
    responseHi = `आरकेजीआईटी गाजियाबाद के निकटतम सहायता केंद्र और संपर्क विवरण नीचे उपलब्ध हैं।`;
  }

  return {
    detected_intent: detectedIntent,
    is_emergency: isEmergency,
    language: detectedLang,
    confidence: 0.94,
    response_en: responseEn,
    response_hi: responseHi,
    action_type: isEmergency
      ? 'emergency_sos'
      : processGuideId
      ? 'show_process_guide'
      : 'show_resources',
    suggested_category: suggestedCategory,
    process_guide_id: processGuideId,
    incident_draft: isEmergency
      ? {
          category: detectedIntent === 'Medical' ? 'Medical' : 'Security',
          urgency: 'Critical',
          description: `Immediate alert triggered by user query: "${userQuery}". User urgently requires on-site campus response.`,
          suggested_action: 'Dispatch Quick Response Team / Notify Chief Warden & Campus Control Room',
        }
      : undefined,
  };
}
