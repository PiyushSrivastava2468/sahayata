import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  BookOpen,
  Calendar,
  Share2,
  Check,
  RefreshCw,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { Roadmap, StudentProfile } from '../types';
import { SAMPLE_ROADMAPS } from '../data/seedOpportunities';

interface RoadmapViewProps {
  profile: StudentProfile;
  language: 'hinglish' | 'english';
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ profile, language }) => {
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap>(SAMPLE_ROADMAPS['dsa-placements']);
  const [completedTasks, setCompletedTasks] = useState<string[]>(SAMPLE_ROADMAPS['dsa-placements'].completedTasks || []);
  const [customGoal, setCustomGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Load completed tasks from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`sahayata_tasks_${activeRoadmap.id}`) || localStorage.getItem(`sahayak_tasks_${activeRoadmap.id}`) || localStorage.getItem(`udaan_tasks_${activeRoadmap.id}`);
      if (saved) {
        setCompletedTasks(JSON.parse(saved));
      } else {
        setCompletedTasks(activeRoadmap.completedTasks || []);
      }
    } catch {
      setCompletedTasks(activeRoadmap.completedTasks || []);
    }
  }, [activeRoadmap.id]);

  const toggleTask = (taskId: string) => {
    let next: string[];
    if (completedTasks.includes(taskId)) {
      next = completedTasks.filter((id) => id !== taskId);
    } else {
      next = [...completedTasks, taskId];
    }
    setCompletedTasks(next);
    try {
      localStorage.setItem(`sahayata_tasks_${activeRoadmap.id}`, JSON.stringify(next));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  };

  // Calculate total tasks and progress percentage
  const allTaskIds: string[] = [];
  activeRoadmap.weeks.forEach((w) => {
    w.tasks.forEach((_, tIdx) => {
      allTaskIds.push(`${w.week_number}-${tIdx}`);
    });
  });

  const totalTasks = allTaskIds.length;
  const finishedCount = completedTasks.filter((id) => allTaskIds.includes(id)).length;
  const percentComplete = totalTasks > 0 ? Math.round((finishedCount / totalTasks) * 100) : 0;

  const handleGenerateCustom = async () => {
    if (!customGoal.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: customGoal.trim(),
          weeks: 6,
          userId: profile.id,
        }),
      });

      const data = await response.json();
      if (data.roadmap) {
        setActiveRoadmap(data.roadmap);
        setCompletedTasks([]);
      }
    } catch (err) {
      console.error('Roadmap error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `I'm following the "${activeRoadmap.title}" on Sahayata! Progress: ${percentComplete}% completed (${finishedCount}/${totalTasks} tasks).\nTarget: ${activeRoadmap.targetGoal}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Goal Selector */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Skill Blueprint</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {activeRoadmap.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {language === 'hinglish'
                ? `Tier-2/3 college schedule ke hisaab se designed: ${activeRoadmap.targetGoal}`
                : `Tailored for college schedules: ${activeRoadmap.targetGoal}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveRoadmap(SAMPLE_ROADMAPS['dsa-placements'])}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeRoadmap.id === 'rm-dsa'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              DSA (6 Weeks)
            </button>
            <button
              onClick={() => setActiveRoadmap(SAMPLE_ROADMAPS['webdev-freelance'])}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeRoadmap.id === 'rm-webdev'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Web Dev (6 Weeks)
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition"
              title="Share progress on WhatsApp"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress Metric Bar */}
        <div className="pt-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>
                {language === 'hinglish' ? 'Aapka Progress:' : 'Your Progress:'}{' '}
                {finishedCount} / {totalTasks} Tasks Completed
              </span>
            </div>
            <span className="text-indigo-600 font-extrabold text-sm">{percentComplete}%</span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Custom AI Goal Input */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="Custom Goal e.g. 'Python for AI & Data Science' ya 'Cybersecurity Basics'"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            onClick={handleGenerateCustom}
            disabled={!customGoal.trim() || isGenerating}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI se Naya Roadmap Banayein</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Weekly Breakdown Cards */}
      <div className="space-y-4">
        {activeRoadmap.weeks.map((week) => {
          return (
            <div
              key={week.week_number}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs"
            >
              {/* Week Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-extrabold uppercase">
                      Hafta {week.week_number}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {week.theme}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Topics Covered */}
              <div className="mt-3">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Core Topics to Master:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {week.topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actionable Practice Checklist */}
              <div className="mt-4">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Action Checklist (Mark as done):
                </div>
                <div className="space-y-2">
                  {week.tasks.map((task, tIdx) => {
                    const taskId = `${week.week_number}-${tIdx}`;
                    const isDone = completedTasks.includes(taskId);

                    return (
                      <div
                        key={tIdx}
                        onClick={() => toggleTask(taskId)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                          isDone
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                            : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70 text-slate-700'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <span className={`text-xs sm:text-sm leading-snug ${isDone ? 'line-through text-emerald-800 opacity-80' : ''}`}>
                          {task}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Free Indian Community Resources */}
              {week.resources && week.resources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Free Curated Resources:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {week.resources.map((res, rIdx) => (
                      <a
                        key={rIdx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-700 text-xs font-semibold transition"
                      >
                        <span>{res.title}</span>
                        <ExternalLink className="w-3 h-3 text-indigo-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
