import React from 'react';
import { Sparkles, Calendar, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { Opportunity, StudentProfile } from '../types';
import { evaluateEligibility } from '../utils/matcher';

interface DailyMaukaBannerProps {
  featuredOpp?: Opportunity;
  profile: StudentProfile;
  onSelectOpp: (opp: Opportunity) => void;
  language: 'hinglish' | 'english';
}

export const DailyMaukaBanner: React.FC<DailyMaukaBannerProps> = ({
  featuredOpp,
  profile,
  onSelectOpp,
  language,
}) => {
  if (!featuredOpp) return null;

  const eligibility = evaluateEligibility(profile, featuredOpp);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-7 shadow-lg border border-indigo-700/40 mb-8">
      {/* Background Decorative Rings */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-40 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hinglish' ? 'Aaj Ka Featured Mauka' : "Today's Featured Opportunity"}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            {featuredOpp.title}
          </h2>
          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {featuredOpp.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold bg-white/10 px-2.5 py-1 rounded-md">
              <Award className="w-3.5 h-3.5" />
              <span>{featuredOpp.stipend_or_amount}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Deadline: {featuredOpp.deadline}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{eligibility.eligible === 'yes' ? 'Aap Eligible Hain!' : 'Eligibility Check Available'}</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-3">
          <button
            onClick={() => onSelectOpp(featuredOpp)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-md hover:shadow-amber-400/20"
          >
            <span>{language === 'hinglish' ? 'Kholkar Apply Karein' : 'View & Apply'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-slate-400 text-center sm:text-right">
            Verified by College TPO Cell
          </span>
        </div>
      </div>
    </div>
  );
};
