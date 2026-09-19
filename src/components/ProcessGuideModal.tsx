import React, { useState } from 'react';
import { X, CheckSquare, Square, FileText, Clock, Phone, MapPin, AlertCircle, Copy, Check } from 'lucide-react';
import { ProcessGuide } from '../types';

interface ProcessGuideModalProps {
  guide: ProcessGuide | null;
  onClose: () => void;
}

export const ProcessGuideModal: React.FC<ProcessGuideModalProps> = ({ guide, onClose }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  if (!guide) return null;

  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter((i) => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const copyGuideSummary = () => {
    const text = `📋 *${guide.title} (${guide.title_hi})*\nOffice: ${guide.office}\nTimings: ${guide.office_hours}\nContact: ${guide.contact}\n\nRequired Documents:\n${guide.documents_required.map((d) => `- ${d}`).join('\n')}\n\nSteps:\n${guide.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}\n\nCampus Tip: ${guide.tips}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Official Campus Workflow
              </span>
            </div>
            <h3 className="text-xl font-black text-white">{guide.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">{guide.title_hi}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Office & Contact Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div>
              <p className="text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Office Location</span>
              </p>
              <p className="font-bold text-slate-900">{guide.office}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Operating Timings</span>
              </p>
              <p className="font-bold text-slate-900">{guide.office_hours}</p>
            </div>
            <div className="sm:col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-slate-500">Authorized Contact:</span>
              <span className="font-mono font-bold text-slate-800">{guide.contact}</span>
            </div>
          </div>

          {/* Required Documents */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-600" />
              <span>Required Documents &amp; Pre-requisites</span>
            </h4>
            <div className="space-y-1.5">
              {guide.documents_required.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 text-xs sm:text-sm text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Action Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Step-by-Step Checklist (Tap to mark done)</span>
              </h4>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {completedSteps.length} of {guide.steps.length} completed
              </span>
            </div>

            <div className="space-y-2">
              {guide.steps.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleStep(idx)}
                    className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-300 text-slate-900'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0 text-emerald-600">
                      {isDone ? <CheckSquare className="w-5 h-5 fill-emerald-100" /> : <Square className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div className="text-xs sm:text-sm leading-relaxed">
                      <span className="font-bold text-slate-900 mr-2">Step {idx + 1}:</span>
                      <span className={isDone ? 'line-through text-slate-500' : ''}>{step}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pro-Tip Box */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              <strong>Campus Advice:</strong> {guide.tips}
            </p>
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={copyGuideSummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Guide!' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
