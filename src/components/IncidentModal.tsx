import React, { useState } from 'react';
import { X, Send, Share2, Copy, Check, ShieldAlert, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { IncidentReport } from '../types';

interface IncidentModalProps {
  draft?: {
    category: 'Security' | 'Medical' | 'Harassment' | 'Ragging' | 'Other';
    urgency: 'Low' | 'Medium' | 'Critical';
    description: string;
    suggested_action?: string;
  } | null;
  userCoords: { lat: number; long: number; campus_name?: string };
  onClose: () => void;
  onSubmitIncident: (incident: Partial<IncidentReport>) => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  draft,
  userCoords,
  onClose,
  onSubmitIncident,
}) => {
  const [category, setCategory] = useState<'Security' | 'Medical' | 'Harassment' | 'Ragging' | 'Other'>(
    draft?.category || 'Security'
  );
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'Critical'>(
    draft?.urgency || 'Critical'
  );
  const [locationName, setLocationName] = useState(
    userCoords.campus_name || 'RKGIT Campus, Delhi-Meerut Road, Ghaziabad'
  );
  const [description, setDescription] = useState(
    draft?.description || 'Immediate campus assistance requested. Need security/medical staff present.'
  );
  const [contactNumber, setContactNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const mapLink = `https://maps.google.com/?q=${userCoords.lat},${userCoords.long}`;
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getFullIncidentText = () => {
    return `🚨 *OFFICIAL INCIDENT REPORT - SAHAYATA APP*\n• Category: ${category}\n• Urgency: ${urgency}\n• Time: ${nowStr} (Today)\n• Location: ${locationName}\n• GPS: ${mapLink}\n• Contact: ${contactNumber || 'Confidential Student'}\n\n• Details:\n${description}\n\n*Assistance Requested immediately.*`;
  };

  const shareViaWhatsApp = () => {
    const text = getFullIncidentText();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaSMS = () => {
    const text = `HELP: ${category} alert at ${locationName}. GPS: ${userCoords.lat},${userCoords.long}. Details: ${description}`;
    window.open(`sms:?body=${encodeURIComponent(text)}`, '_blank');
  };

  const copyIncidentReport = () => {
    navigator.clipboard.writeText(getFullIncidentText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    onSubmitIncident({
      category,
      urgency,
      location_name: locationName,
      description,
      contact_number: contactNumber || '+91-XXXXXXXXXX',
      lat: userCoords.lat,
      long: userCoords.long,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1600);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-lg font-bold leading-tight">Pre-filled Incident Draft</h3>
              <p className="text-xs text-rose-100">आपातकालीन घटना रिपोर्ट (Auto-Generated)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-900">Incident Transmitted!</h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Incident report has been logged with the Campus Proctor &amp; Control Desk. A notification ticket has been queued.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Category & Urgency Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Incident Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs sm:text-sm font-semibold p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:border-rose-500 outline-none"
                >
                  <option value="Security">Security / Threat</option>
                  <option value="Harassment">Harassment / POSH</option>
                  <option value="Medical">Medical Emergency</option>
                  <option value="Ragging">Ragging / Bullying</option>
                  <option value="Other">Other Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full text-xs sm:text-sm font-semibold p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:border-rose-500 outline-none"
                >
                  <option value="Critical">Critical (Immediate Help)</option>
                  <option value="Medium">Medium (Attention required)</option>
                  <option value="Low">Low (Informational report)</option>
                </select>
              </div>
            </div>

            {/* Time & GPS Info */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <strong>Timestamp:</strong>
                </span>
                <span>{nowStr} (Auto-recorded)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <strong>GPS Coordinates:</strong>
                </span>
                <span className="font-mono">{userCoords.lat.toFixed(4)}, {userCoords.long.toFixed(4)}</span>
              </div>
            </div>

            {/* Location Spot */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Specific Location on Campus
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Near Central Library / Main Gate No 1 / Block B"
                className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-rose-500 outline-none font-medium"
              />
            </div>

            {/* Incident Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Incident Description &amp; Details
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is happening..."
                className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-rose-500 outline-none font-medium"
              />
            </div>

            {/* Contact number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Contact Number (Optional / Confidential)
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91-XXXXXXXXXX (Keep empty for anonymous report)"
                className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-rose-500 outline-none font-mono"
              />
            </div>

            {/* External Dispatch Buttons */}
            <div className="pt-2 border-t border-slate-200">
              <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                External Channels (Immediate student dispatch):
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={shareViaWhatsApp}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={shareViaSMS}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send SMS</span>
                </button>

                <button
                  type="button"
                  onClick={copyIncidentReport}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            {/* Submit to Campus Admin */}
            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>Logging Incident...</span>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Submit to Campus Control Desk</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
