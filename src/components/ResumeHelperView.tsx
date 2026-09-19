import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Share2,
  Send,
  RefreshCw,
  Award,
  MessageSquare
} from 'lucide-react';
import { StudentProfile, ResumeBulletsResult } from '../types';

interface ResumeHelperViewProps {
  profile: StudentProfile;
  language: 'hinglish' | 'english';
}

export const ResumeHelperView: React.FC<ResumeHelperViewProps> = ({ profile, language }) => {
  const [projectName, setProjectName] = useState('Campus Resource & Notes Portal');
  const [techStack, setTechStack] = useState('React, Tailwind CSS, Express, PostgreSQL');
  const [description, setDescription] = useState(
    'A web app for college students to upload and search past exam question papers (PYQs) and share lab manuals with branch-wise filters.'
  );
  const [targetRole, setTargetRole] = useState('Software Engineering Intern');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeBulletsResult | null>({
    bullets: [
      'Architected a responsive campus notes repository using React and PostgreSQL, serving 350+ tier-2 engineering students across 4 semesters.',
      'Engineered optimized SQL search queries with indexing, cutting query response time by 48% across 1,200+ uploaded PDF manuals.',
      'Implemented JWT session security and role-based access control (RBAC), preventing unauthorized document deletion and tampering.',
      'Containerized backend services and deployed on cloud infrastructure with 99.8% uptime during mid-semester examination rush.'
    ],
    cold_dm:
      `Subject: Seeking Guidance & Referral - SDE Intern Aspirant (${profile.name})\n\n` +
      `Hi [Senior Name],\n\n` +
      `I hope you are doing well. I came across your engineering profile and really admire your work at [Company Name].\n\n` +
      `I am a ${profile.year} engineering student from ${profile.college || 'AKGEC'}, deeply passionate about software engineering and backend systems. I recently built a full-stack project utilizing ${techStack} that handled real traffic for our campus peers.\n\n` +
      `Could I request 5 minutes of your time for quick feedback on my portfolio, or if you would be open to referring me for upcoming ${targetRole} positions at [Company Name]?\n\n` +
      `Portfolio / GitHub: [Link]\n\n` +
      `Thank you very much for your time and mentorship,\n` +
      `${profile.name}`
  });

  const [copiedBullets, setCopiedBullets] = useState(false);
  const [copiedDm, setCopiedDm] = useState(false);

  const handleGenerate = async () => {
    if (!projectName.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/resume/bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          techStack,
          description,
          targetRole,
        }),
      });

      const data = await response.json();
      if (data.result) {
        setResult(data.result);
      }
    } catch (err) {
      console.error('Resume helper error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyBulletsText = () => {
    if (!result) return;
    const text = result.bullets.map((b) => `• ${b}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedBullets(true);
    setTimeout(() => setCopiedBullets(false), 2000);
  };

  const copyDmText = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.cold_dm);
    setCopiedDm(true);
    setTimeout(() => setCopiedDm(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>Google XYZ / STAR Format Bullet Generator</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Project to Resume & Cold Outreach Converter
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {language === 'hinglish'
            ? 'Apne college project ki raw details daaliye—Sahayata AI unhe ATS-friendly STAR bullet points aur alumni cold message me transform kar dega.'
            : 'Convert raw college project notes into quantified STAR resume bullets and polite LinkedIn cold messages.'}
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Project Name / Title
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Campus Placement Tracker"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Job / Internship Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. SDE Intern, Frontend Engineer"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Tech Stack (Languages, Frameworks, DBs)
          </label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="e.g. React, C++, Node.js, SQLite"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            What does your project do? (Simple everyday language)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Ek website banayi thi jisme college seniors notes aur purane papers upload karte hain taaki 1st year walo ko exams me aasani ho..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={!projectName.trim() || isLoading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Generating STAR Bullets...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate STAR Bullets & Cold Outreach</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Result Output */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {/* STAR Resume Bullets Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    ATS-Optimized Resume Bullets (Google XYZ)
                  </h3>
                </div>
                <button
                  onClick={copyBulletsText}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold flex items-center gap-1 transition"
                >
                  {copiedBullets ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBullets ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {result.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <span className="text-indigo-600 font-bold shrink-0">•</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Paste these bullet points directly under the Projects section in your single-page resume!
            </div>
          </div>

          {/* Cold Outreach Message Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    LinkedIn / Email Cold Outreach Message
                  </h3>
                </div>
                <button
                  onClick={copyDmText}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold flex items-center gap-1 transition"
                >
                  {copiedDm ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDm ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                {result.cold_dm}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Send this message to tier-2 college alumni on LinkedIn who are currently working at your dream company.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
