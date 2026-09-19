import React, { useState } from 'react';
import { WifiOff, PhoneCall, MessageSquare, Copy, Check, ShieldAlert, Navigation, RefreshCw } from 'lucide-react';
import { CampusResource } from '../types';

interface OfflineFallbackViewProps {
  onDisableOffline: () => void;
  cachedResources: CampusResource[];
  userCoords: { lat: number; long: number };
}

export const OfflineFallbackView: React.FC<OfflineFallbackViewProps> = ({
  onDisableOffline,
  cachedResources,
  userCoords,
}) => {
  const [copiedSMS, setCopiedSMS] = useState(false);
  const [selectedIncidentType, setSelectedIncidentType] = useState('medical assistance');
  const [landmark, setLandmark] = useState('Library, RKGIT');

  const emergencyHelplines = [
    { name: 'National Emergency Helpline', number: '112', badge: 'Police & Medical', speed: 'Immediate' },
    { name: 'UP Women Power Line', number: '1090', badge: 'Women Harassment', speed: '24x7 Direct' },
    { name: 'RKGIT Campus Security Desk', number: '+91-9810555210', badge: 'Main Gate QRT', speed: 'On-Campus' },
    { name: 'Campus Health Dispensary', number: '+91-9871112233', badge: 'First Aid & Doctor', speed: 'On-Campus' },
    { name: 'National Anti-Ragging Cell', number: '1800-180-5522', badge: 'Toll-Free UGC', speed: 'Confidential' },
    { name: 'Emergency Ambulance Service', number: '108', badge: 'Govt. Trauma', speed: 'Rapid' },
  ];

  const sampleSMSText = `HELP: I need ${selectedIncidentType} near ${landmark}. My location: [${userCoords.lat.toFixed(4)}, ${userCoords.long.toFixed(4)}]. Please dispatch help immediately.`;

  const copySMS = () => {
    navigator.clipboard.writeText(sampleSMSText);
    setCopiedSMS(true);
    setTimeout(() => setCopiedSMS(false), 2000);
  };

  const triggerNativeSMS = () => {
    window.open(`sms:112?body=${encodeURIComponent(sampleSMSText)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Offline Alert Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-red-700 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0 text-white border border-white/20">
              <WifiOff className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white text-amber-900 shadow-xs">
                  Zero-Data / Offline Mode Active
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Instant Offline Emergency Directory &amp; SMS Fallback
              </h3>
              <p className="text-xs sm:text-sm text-amber-100 mt-1">
                No active internet required. Helplines and SMS dispatch work over GSM cellular networks anywhere in Ghaziabad.
              </p>
            </div>
          </div>

          <button
            onClick={onDisableOffline}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>Switch to Online (AI Live)</span>
          </button>
        </div>
      </div>

      {/* Simulated SMS Generator Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">One-Tap Offline SMS SOS Generator</h4>
              <p className="text-xs text-slate-500">Auto-formats emergency text with GPS for 112 / Security</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Works without Data Pack
          </span>
        </div>

        {/* Quick parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Assistance Type</label>
            <select
              value={selectedIncidentType}
              onChange={(e) => setSelectedIncidentType(e.target.value)}
              className="w-full text-xs font-medium p-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
            >
              <option value="medical assistance">Medical Assistance (Doctor / Stretcher)</option>
              <option value="immediate security presence">Security Presence (Harassment / Unsafe)</option>
              <option value="anti-ragging intervention">Anti-Ragging Flying Squad</option>
              <option value="ambulance transport">Ambulance Transport</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Campus Spot / Landmark</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Library, Main Gate, Girls Hostel"
              className="w-full text-xs font-medium p-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>
        </div>

        {/* SMS Preview Box */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm relative mb-4 leading-relaxed">
          <p className="text-slate-400 text-[11px] uppercase mb-1">Simulated SMS Message Body:</p>
          <p className="text-emerald-400 font-semibold">{sampleSMSText}</p>
        </div>

        {/* SMS action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={triggerNativeSMS}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open in SMS App (Dial 112)</span>
          </button>

          <button
            onClick={copySMS}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold border border-slate-300 transition-colors"
          >
            {copiedSMS ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSMS ? 'Copied to Clipboard!' : 'Copy SMS Body'}</span>
          </button>
        </div>
      </div>

      {/* Emergency Helpline Grid */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Local &amp; National Emergency Helplines (Cached)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {emergencyHelplines.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {item.badge}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.speed}</span>
                </div>
                <h5 className="text-sm font-bold text-slate-900 mb-1">{item.name}</h5>
                <p className="text-lg font-black font-mono text-slate-900">{item.number}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100">
                <a
                  href={`tel:${item.number}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {item.number}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
