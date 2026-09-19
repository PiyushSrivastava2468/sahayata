export type ResourceCategory = 'security' | 'medical' | 'women_safety' | 'counseling' | 'admin';

export interface CampusResource {
  id: string;
  name: string;
  category: ResourceCategory;
  lat: number;
  long: number;
  phone: string;
  address: string;
  office_hours: string;
  contact_person?: string;
  is_emergency_hub: boolean;
  distance_meters?: number;
}

export interface IncidentReport {
  id: string;
  user_id?: string;
  category: 'Security' | 'Medical' | 'Harassment' | 'Ragging' | 'Other';
  description: string;
  lat: number;
  long: number;
  location_name: string;
  status: 'Reported' | 'Contacted' | 'Resolved';
  urgency: 'Low' | 'Medium' | 'Critical';
  created_at: string;
  contact_number?: string;
}

export interface QueryLog {
  id: string;
  user_id?: string;
  text: string;
  detected_intent: 'Medical' | 'Security' | 'Counseling' | 'Admin' | 'Other';
  is_emergency: boolean;
  language: 'Hindi' | 'English' | 'Hinglish';
  timestamp: string;
  lat: number;
  long: number;
}

export interface ProcessGuide {
  id: string;
  title: string;
  title_hi: string;
  category: string;
  office: string;
  office_hours: string;
  contact: string;
  documents_required: string[];
  steps: string[];
  tips: string;
}

export interface IntentClassificationResponse {
  detected_intent: 'Medical' | 'Security' | 'Counseling' | 'Admin' | 'Other';
  is_emergency: boolean;
  language: 'Hindi' | 'English' | 'Hinglish';
  confidence: number;
  translated_query?: string;
  response_en: string;
  response_hi: string;
  action_type: 'emergency_sos' | 'show_resources' | 'show_process_guide' | 'general_info';
  suggested_category?: ResourceCategory;
  process_guide_id?: string;
  incident_draft?: {
    category: 'Security' | 'Medical' | 'Harassment' | 'Ragging' | 'Other';
    urgency: 'Low' | 'Medium' | 'Critical';
    description: string;
    suggested_action: string;
  };
}
