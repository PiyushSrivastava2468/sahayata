import React from 'react';
import {
  Compass,
  MessageSquareText,
  Briefcase,
  GraduationCap,
  FileText,
  ShieldCheck,
  User,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  activeTab: 'opportunities' | 'chat' | 'roadmap' | 'resume' | 'admin';
  setActiveTab: (tab: 'opportunities' | 'chat' | 'roadmap' | 'resume' | 'admin') => void;
  profile: StudentProfile;
  onOpenProfile: () => void;
  onOpenJudgeGuide: () => void;
  language: 'hinglish' | 'english';
  setLanguage: (lang: 'hinglish' | 'english') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenProfile,
  onOpenJudgeGuide,
  language,
  setLanguage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('opportunities')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">Sahayak</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  सहायक
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                AI Career & Opportunity Navigator for Bharat
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'opportunities'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{language === 'hinglish' ? 'Mauke (मौके)' : 'Opportunities'}</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition relative ${
                activeTab === 'chat'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              <span>{language === 'hinglish' ? 'Sahayak Bhaiya (AI)' : 'AI Career Chat'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'roadmap'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{language === 'hinglish' ? 'Roadmap (रोडमैप)' : 'Skill Roadmap'}</span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'resume'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'hinglish' ? 'Resume STAR' : 'Resume Helper'}</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'admin'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>TPO Admin</span>
            </button>
          </nav>

          {/* Right Controls: Profile pill, Language toggle & Judge Guide */}
          <div className="flex items-center gap-2">
            {/* Language Switch */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-medium">
              <button
                onClick={() => setLanguage('hinglish')}
                className={`px-2 py-1 rounded-md transition ${
                  language === 'hinglish' ? 'bg-white text-indigo-700 font-semibold shadow-xs' : 'text-slate-500'
                }`}
              >
                Hinglish
              </button>
              <button
                onClick={() => setLanguage('english')}
                className={`px-2 py-1 rounded-md transition ${
                  language === 'english' ? 'bg-white text-indigo-700 font-semibold shadow-xs' : 'text-slate-500'
                }`}
              >
                English
              </button>
            </div>

            {/* Profile Quick Pill */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/80 rounded-xl transition text-left"
              title="Edit Student Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {profile.name.charAt(0)}
              </div>
              <div className="hidden lg:block">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {profile.name}
                </div>
                <div className="text-[10px] text-indigo-700 font-medium leading-tight">
                  {profile.year} • {profile.branch}
                </div>
              </div>
            </button>

            {/* Hackathon Judge Guide */}
            <button
              onClick={onOpenJudgeGuide}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              title="2-Minute Judge Pitch Flow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Judge Pitch Flow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200/80 bg-slate-50/90 py-2 px-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-3 py-1 rounded-lg ${activeTab === 'opportunities' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600'}`}
        >
          Mauke
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3 py-1 rounded-lg ${activeTab === 'chat' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600'}`}
        >
          AI Bhaiya
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-3 py-1 rounded-lg ${activeTab === 'roadmap' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600'}`}
        >
          Roadmap
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`px-3 py-1 rounded-lg ${activeTab === 'resume' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600'}`}
        >
          Resume
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-3 py-1 rounded-lg ${activeTab === 'admin' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600'}`}
        >
          TPO
        </button>
      </div>
    </header>
  );
};
