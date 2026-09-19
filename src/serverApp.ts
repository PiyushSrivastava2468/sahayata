import express, { Router } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_RESOURCES,
  INITIAL_QUERIES,
  INITIAL_INCIDENTS,
  PROCESS_GUIDES,
  NATIONAL_HELPLINES,
} from './data/mockCampusData';
import { CampusResource, IncidentReport, QueryLog } from './types';
import { calculateDistanceMeters, heuristicClassify } from './utils/triageFallback';

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

const apiRouter = Router();

// 1. Natural Language Intent Classifier & Emergency Triage
apiRouter.post('/classify-intent', async (req, res) => {
  const { query, lat, long } = req.body;
  const userQuery = (query || '').trim();

  if (!userQuery) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const userLat = lat || 28.7183;
  const userLong = long || 77.4812;

  const ai = getGenAI();
  let classificationResult = null;

  if (ai) {
    try {
      const prompt = `
You are "Sahayata" (सहायता), an empathetic, lightning-fast campus emergency, women's safety, and resource triage assistant for college campuses in India (specifically RKGIT Campus, Ghaziabad, Uttar Pradesh).

The student sent this query:
"${userQuery}"

Current User Coordinates: lat ${userLat}, long ${userLong}.

Analyze this query and return valid JSON with these EXACT keys:
{
  "detected_intent": "Medical" | "Security" | "Counseling" | "Admin" | "Other",
  "is_emergency": boolean, // TRUE if the user mentions any physical danger, harassment, stalking, violence, suicide, sexual harassment, ragging with threats, severe bleeding, unconsciousness, or feels unsafe.
  "language": "Hindi" | "English" | "Hinglish",
  "confidence": number (between 0.70 and 0.99),
  "translated_query": string (English translation if query was Hindi/Hinglish),
  "response_en": string (concise, reassuring 1-2 sentences in English explaining immediate action, nearby resource, or helpline),
  "response_hi": string (clear, reassuring 1-2 sentences in Hindi / Devanagari script explaining the same),
  "action_type": "emergency_sos" | "show_resources" | "show_process_guide" | "general_info",
  "suggested_category": "security" | "medical" | "women_safety" | "counseling" | "admin",
  "process_guide_id": "proc-lost-id" | "proc-anti-ragging" | "proc-posh-grievance" | "proc-medical-leave" | null,
  "incident_draft": {
    "category": "Security" | "Medical" | "Harassment" | "Ragging" | "Other",
    "urgency": "Critical" | "Medium" | "Low",
    "description": string (formal summary of the incident for the proctor / police report),
    "suggested_action": string
  } // only include if is_emergency is true, else null
}
`;

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
    classificationResult = heuristicClassify(userQuery, userLat, userLong);
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

  res.json(classificationResult);
});

// 2. Get Nearby Resources with dynamic distance calculation
apiRouter.get('/resources', (req, res) => {
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
apiRouter.post('/admin/resources', (req, res) => {
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
apiRouter.put('/admin/resources/:id', (req, res) => {
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
apiRouter.delete('/admin/resources/:id', (req, res) => {
  const { id } = req.params;
  resources = resources.filter((r) => r.id !== id);
  res.json({ success: true, message: `Resource ${id} deleted.` });
});

// 6. Incidents: List
apiRouter.get('/incidents', (req, res) => {
  res.json({ incidents });
});

// 7. Incidents: Create / Report
apiRouter.post('/incidents', (req, res) => {
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
apiRouter.patch('/incidents/:id/status', (req, res) => {
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
apiRouter.get('/queries', (req, res) => {
  res.json({ queries });
});

// 10. Process Guides & Helplines
apiRouter.get('/processes', (req, res) => {
  res.json({
    processes: PROCESS_GUIDES,
    national_helplines: NATIONAL_HELPLINES,
  });
});

// 11. Health Check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Sahayata Campus Assistant',
    version: '1.0.0-hackathon-mvp',
    has_gemini_key: Boolean(process.env.GEMINI_API_KEY),
    environment: process.env.VERCEL ? 'vercel-serverless' : 'node-server',
  });
});

apiRouter.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'Sahayata Campus Assistant',
    version: '1.0.0-hackathon-mvp',
    has_gemini_key: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Mount exclusively on '/api' so root ('/') routes cleanly pass through to Vite frontend
app.use('/api', apiRouter);

export default app;
