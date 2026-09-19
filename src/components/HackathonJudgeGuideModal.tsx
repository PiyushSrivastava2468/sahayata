import React from 'react';
import { X, CheckCircle2, Sparkles, Target, Compass, MessageSquare, Award, ArrowRight } from 'lucide-react';

interface HackathonJudgeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'opportunities' | 'chat' | 'roadmap' | 'resume' | 'admin') => void;
}

export const HackathonJudgeGuideModal: React.FC<HackathonJudgeGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Sahayak (सहायक) – 2-Minute Hackathon Demo Guide
              </h2>
              <p className="text-xs text-slate-500">
                AI Career & Opportunity Navigator for Tier-2/3 College Students
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 pt-4 text-xs sm:text-sm text-slate-700">
          {/* Problem & Target Demographic */}
          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>The Problem in Bharat's Colleges:</span>
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed">
              Over <strong>85% of Indian engineering students</strong> study in tier-2 and tier-3 colleges. They face high information asymmetry: scholarships (Reliance, NSP) and prestigious programs (SIH, Flipkart GRiD, Amazon ML) go unnoticed, while generic advice ignores their busy semester lab schedules and non-CS branch constraints.
            </p>
          </div>

          {/* 4 Interactive Feature Highlights */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Recommended 4-Step Judge Evaluation Walkthrough:
            </div>

            {/* Step 1 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  1. Real-time "Am I Eligible?" Matching Engine
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Filter opportunities by Type, Year, and Branch. Click on any card to see instant green/amber/gray rule-based verdicts with clear explanations.
                </p>
              </div>
              <button
                onClick={() => {
                  onNavigateTab('opportunities');
                  onClose();
                }}
                className="shrink-0 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 flex items-center gap-1"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  2. AI Career Mentor in Hinglish ("Sahayak Bhaiya")
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Ask questions like <em>"1st year EEE internship ideas"</em> or <em>"Non-CS branch se DSA kaise karein?"</em>. Notice the 3-step pragmatic advice grounded in free Indian resources (Striver, Babbar, Chai aur Code).
                </p>
              </div>
              <button
                onClick={() => {
                  onNavigateTab('chat');
                  onClose();
                }}
                className="shrink-0 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 flex items-center gap-1"
              >
                <span>Chat</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  3. Structured Skill Roadmap & Interactive Progress
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Explore the 6-Week Placement Roadmap. Check off tasks to watch the progress bar update dynamically, or input a custom goal to trigger AI roadmap generation.
                </p>
              </div>
              <button
                onClick={() => {
                  onNavigateTab('roadmap');
                  onClose();
                }}
                className="shrink-0 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 flex items-center gap-1"
              >
                <span>Roadmap</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  4. STAR Resume Bullets & Cold LinkedIn Outreach
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Turns unstructured student coursework into Google XYZ quantified bullet points and a humble LinkedIn message with 1-click copy & WhatsApp sharing.
                </p>
              </div>
              <button
                onClick={() => {
                  onNavigateTab('resume');
                  onClose();
                }}
                className="shrink-0 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 flex items-center gap-1"
              >
                <span>Resume</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Closing call to action */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Start Exploring Sahayak
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
