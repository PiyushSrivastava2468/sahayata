import React, { useState } from 'react';
import {
  Calendar,
  ExternalLink,
  Share2,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Check,
  Building
} from 'lucide-react';
import { Opportunity, EligibilityResult } from '../types';

interface OpportunityCardProps {
  opp: Opportunity;
  eligibility: EligibilityResult;
  isSaved?: boolean;
  onToggleSave?: () => void;
  language: 'hinglish' | 'english';
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opp,
  eligibility,
  isSaved,
  onToggleSave,
  language,
}) => {
  const [showSteps, setShowSteps] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const getBadgeVisuals = () => {
    switch (eligibility.eligible) {
      case 'yes':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
          label: language === 'hinglish' ? 'Aap 100% Eligible Hain' : 'Eligible to Apply',
        };
      case 'maybe':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          icon: <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
          label: language === 'hinglish' ? 'Criteria Check Karein' : 'Partial / Portfolio Match',
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200 text-slate-700',
          icon: <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />,
          label: language === 'hinglish' ? 'Year / Branch Mismatch' : 'Not Eligible for Current Year/Branch',
        };
    }
  };

  const badge = getBadgeVisuals();

  const handleWhatsAppShare = () => {
    const text = `Check out this ${opp.type} on Sahayata: "${opp.title}" by ${opp.organization}.\nStipend/Grant: ${opp.stipend_or_amount}\nDeadline: ${opp.deadline}\nApply here: ${opp.link}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');

    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-5 sm:p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Top meta & save/share controls */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
              {opp.type.replace('_', ' ')}
            </span>
            {opp.is_featured && (
              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                Featured
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleWhatsAppShare}
              className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition border border-slate-100"
              title="Share with college WhatsApp group"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggleSave}
              className={`p-2 rounded-lg transition border border-slate-100 ${
                isSaved ? 'text-indigo-600 bg-indigo-50 border-indigo-200' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title="Bookmark this opportunity"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Organization */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-1">
          {opp.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-3">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          <span>{opp.organization}</span>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
          {opp.description}
        </p>

        {/* Eligibility Verdict Badge */}
        <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs mb-4 ${badge.bg}`}>
          {badge.icon}
          <div>
            <div className="font-bold tracking-tight mb-0.5">{badge.label}</div>
            <div className="text-[11px] leading-relaxed opacity-90">{eligibility.reason}</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {opp.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div>
        {/* Deadline & Stipend Info Row */}
        <div className="flex items-center justify-between text-xs py-3 border-t border-slate-100 text-slate-500 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Deadline: <strong className="text-slate-700">{opp.deadline}</strong></span>
          </div>
          <span className="font-bold text-slate-800 text-right">{opp.stipend_or_amount}</span>
        </div>

        {/* Apply Steps Accordion */}
        {opp.apply_steps && opp.apply_steps.length > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
            >
              <span>{language === 'hinglish' ? 'Kaise Apply Karein? (Steps)' : 'How to Apply (Steps)'}</span>
              {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showSteps && (
              <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5 text-slate-700 animate-in fade-in duration-200">
                {opp.apply_steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <a
          href={opp.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs hover:shadow-md"
        >
          <span>{language === 'hinglish' ? 'Official Link Par Apply Karein' : 'Apply on Official Site'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
