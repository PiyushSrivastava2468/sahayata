import React from 'react';
import { ShieldAlert, Radio, Wifi, WifiOff, UserCog, UserCheck, BookOpen, PhoneCall } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  onTriggerSOS: () => void;
  onOpenPitchGuide: () => void;
  hasActiveEmergency: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isAdmin,
  setIsAdmin,
  isOffline,
  setIsOffline,
  onTriggerSOS,
  onOpenPitchGuide,
  hasActiveEmergency,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center shadow-md text-white">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${hasActiveEmergency ? 'bg-rose-400' : 'bg-emerald-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${hasActiveEmergency ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
                  Sahayata <span className="text-xs sm:text-sm font-semibold text-rose-600 uppercase tracking-wider px-2 py-0.5 bg-rose-50 rounded-full border border-rose-200">सहायता</span>
                </h1>
                <span className="hidden md:inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  RKGIT Campus • Ghaziabad
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                AI Multilingual Panic & Resource Assistant for Women & Students
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Hackathon Pitch / Mentor Kit Button */}
            <button
              onClick={onOpenPitchGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-xs"
              title="View Hackathon Architecture, Schema, Pitch Deck & 2-Min Demo Script"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hackathon Pitch &amp; Tech Kit</span>
              <span className="sm:hidden">Judge Kit</span>
            </button>

            {/* Offline Simulation Toggle */}
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold border transition-all ${
                isOffline
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
              }`}
              title="Simulate low connectivity or internet blackout"
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Offline Mode: ON</span>
                  <span className="sm:hidden">Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Online (AI Live)</span>
                  <span className="sm:hidden">Online</span>
                </>
              )}
            </button>

            {/* Role Switcher: Student vs Admin */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold border transition-colors ${
                isAdmin
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              {isAdmin ? (
                <>
                  <UserCog className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Mode</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Student View</span>
                  <span className="sm:hidden">Student</span>
                </>
              )}
            </button>

            {/* Instant SOS Siren Button */}
            <button
              onClick={onTriggerSOS}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-md transition-all animate-pulse"
              title="One-Tap Emergency Panic Protocol"
            >
              <PhoneCall className="w-4 h-4" />
              <span>SOS PANIC</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
