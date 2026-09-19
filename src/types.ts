export type OpportunityType = 'internship' | 'scholarship' | 'hackathon' | 'fellowship' | 'campus_program';

export interface EligibilityResult {
  eligible: 'yes' | 'no' | 'maybe';
  reason: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  type: OpportunityType;
  eligibility_text: string;
  eligible_years: string[];
  eligible_branches: string[];
  stipend_or_amount: string;
  deadline: string;
  link: string;
  tags: string[];
  is_featured?: boolean;
  apply_steps: string[];
  eligibility?: EligibilityResult;
}

export interface StudentProfile {
  id: string;
  name: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Graduate';
  branch: string;
  college: string;
  city: string;
  skills: string[];
  interests: string[];
  preferredLanguage: 'hinglish' | 'english' | 'hindi';
  targetGoal?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedChips?: string[];
  relevantOpportunityIds?: string[];
}

export interface RoadmapResource {
  title: string;
  url: string;
  type?: 'video' | 'practice' | 'article';
}

export interface RoadmapWeek {
  week_number: number;
  theme: string;
  topics: string[];
  tasks: string[];
  resources: RoadmapResource[];
}

export interface Roadmap {
  id: string;
  title: string;
  targetGoal: string;
  totalWeeks: number;
  weeks: RoadmapWeek[];
  completedTasks: string[]; // week_number-taskIndex e.g. "1-0"
}

export interface ResumeBulletsResult {
  bullets: string[];
  cold_dm: string;
}

export interface AdminAnalytics {
  totalStudents: number;
  totalOpportunities: number;
  topSearchedSkills: { skill: string; count: number }[];
  mostViewedOpportunities: { title: string; views: number }[];
}
