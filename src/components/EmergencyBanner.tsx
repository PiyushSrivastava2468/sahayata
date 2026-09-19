import React, { useState } from 'react';
import { PhoneCall, Navigation, Share2, AlertOctagon, FileText, Bell, VolumeX, Volume2, ShieldCheck, X } from 'lucide-react';

interface EmergencyBannerProps {
  onOpenIncidentDraft: () => void;
  onDeactivate: () => void;
  userCoords: { lat: number; long: number };
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  onOpenIncidentDraft,
  onDeactivate,
  userCoords,
}) => {
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);

  // Toggle alarm audio using native Web Audio API synthesis
  const toggleSirenSound = () => {
    if (isSirenActive) {
      if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
      }
      setIsSirenActive(false);
      setOscillator(null);
    } else {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        // Modulate frequency to create an emergency siren wave
        osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.3);
        osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.6);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        setAudioCtx(ctx);
        setOscillator(osc);
        setIsSirenActive(true);
      } catch (err) {
        console.warn('Web Audio siren error:', err);
      }
    }
  };

  const shareEmergencyLocationWhatsApp = () => {
    const mapUrl = `https://maps.google.com/?q=${userCoords.lat},${userCoords.long}`;
    const text = `🚨 *EMERGENCY SOS - SAHAYATA CAMPUS ALERT* 🚨\nI need urgent help at RKGIT Campus, Ghaziabad!\nMy live GPS Coordinates: ${mapUrl}\nPlease dispatch security or contact campus control: +91-9810555210`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-rose-600 text-white p-5 sm:p-7 shadow-2xl border-4 border-rose-500 animate-in fade-in duration-300">
      
      {/* Background pulsing glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-500 via-rose-600 to-red-800 opacity-90 pointer-events-none" />

      <div className="relative z-10">
        
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-400/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white text-rose-600 flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white text-rose-700 shadow-xs">
                  Active Emergency Mode
                </span>
                <span className="text-xs text-rose-100 font-semibold">
                  हाई-अलर्ट सुरक्षा सक्रिय
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Priority Dispatch &amp; Campus Immediate Assistance
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Siren audio toggle */}
            <button
              onClick={toggleSirenSound}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isSirenActive
                  ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-md animate-bounce'
                  : 'bg-rose-700/80 hover:bg-rose-700 text-white border-rose-500'
              }`}
            >
              {isSirenActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{isSirenActive ? 'Alarm Sound: ON' : 'Audible Siren'}</span>
            </button>

            {/* Deactivate button */}
            <button
              onClick={onDeactivate}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-800/80 hover:bg-rose-900 text-rose-100 border border-rose-600 transition-colors"
              title="Deactivate emergency mode"
            >
              <X className="w-4 h-4" />
              <span>Dismiss</span>
            </button>
          </div>
        </div>

        {/* Immediate Emergency Action Buttons */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Action 1: UP Women Power Line 1090 */}
          <a
            href="tel:1090"
            className="flex items-center justify-between p-3.5 rounded-xl bg-white text-rose-900 hover:bg-rose-50 shadow-md transition-transform active:scale-98 font-sans"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg">
                1090
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">UP Women Powerline</p>
                <p className="text-sm font-extrabold text-slate-900">Call 1090 (24x7)</p>
              </div>
            </div>
            <PhoneCall className="w-5 h-5 text-rose-600 animate-bounce" />
          </a>

          {/* Action 2: National Emergency 112 */}
          <a
            href="tel:112"
            className="flex items-center justify-between p-3.5 rounded-xl bg-white text-rose-900 hover:bg-rose-50 shadow-md transition-transform active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-lg">
                112
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">National Police/Ambulance</p>
                <p className="text-sm font-extrabold text-slate-900">Dial 112 Immediate</p>
              </div>
            </div>
            <PhoneCall className="w-5 h-5 text-red-600" />
          </a>

          {/* Action 3: Campus Quick Response Team */}
          <a
            href="tel:+919810555210"
            className="flex items-center justify-between p-3.5 rounded-xl bg-white text-rose-900 hover:bg-rose-50 shadow-md transition-transform active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                QRT
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">RKGIT Campus Security</p>
                <p className="text-sm font-extrabold text-slate-900">Main Gate Post</p>
              </div>
            </div>
            <PhoneCall className="w-5 h-5 text-amber-700" />
          </a>

          {/* Action 4: Share Location on WhatsApp */}
          <button
            onClick={shareEmergencyLocationWhatsApp}
            className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white shadow-md transition-transform active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center font-bold text-sm">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Trusted Contact</p>
                <p className="text-sm font-extrabold text-white">Share Live GPS</p>
              </div>
            </div>
            <Navigation className="w-5 h-5 text-emerald-200" />
          </button>

        </div>

        {/* Incident Draft Bar */}
        <div className="mt-4 pt-3 border-t border-rose-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-rose-100 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-rose-200 flex-shrink-0" />
            <span>Pre-filled Incident Statement ready for official university records &amp; police reference.</span>
          </p>
          <button
            onClick={onOpenIncidentDraft}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-white text-rose-800 font-bold hover:bg-rose-50 shadow-sm transition-all"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span>Open &amp; Submit Incident Draft</span>
          </button>
        </div>

      </div>
    </div>
  );
};
