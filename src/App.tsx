import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceQuerySection } from './components/VoiceQuerySection';
import { EmergencyBanner } from './components/EmergencyBanner';
import { ResourceCard } from './components/ResourceCard';
import { ProcessGuideModal } from './components/ProcessGuideModal';
import { IncidentModal } from './components/IncidentModal';
import { OfflineFallbackView } from './components/OfflineFallbackView';
import { AdminDashboard } from './components/AdminDashboard';
import { HackathonJudgeGuideModal } from './components/HackathonJudgeGuideModal';
import {
  INITIAL_RESOURCES,
  INITIAL_INCIDENTS,
  INITIAL_QUERIES,
  PROCESS_GUIDES,
  DEFAULT_CAMPUS_COORDS,
} from './data/mockCampusData';
import {
  CampusResource,
  IncidentReport,
  QueryLog,
  ProcessGuide,
  IntentClassificationResponse,
  ResourceCategory,
} from './types';
import { Shield, MapPin, HeartPulse, AlertTriangle, Sparkles, BookOpen, FileCheck, PhoneCall, ExternalLink, ChevronRight } from 'lucide-react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [hasActiveEmergency, setHasActiveEmergency] = useState(false);
  const [showPitchGuide, setShowPitchGuide] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [activeProcessGuide, setActiveProcessGuide] = useState<ProcessGuide | null>(null);

  const [userCoords, setUserCoords] = useState(DEFAULT_CAMPUS_COORDS);
  const [resources, setResources] = useState<CampusResource[]>(INITIAL_RESOURCES);
  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_INCIDENTS);
  const [queries, setQueries] = useState<QueryLog[]>(INITIAL_QUERIES);
  const [processGuides] = useState<ProcessGuide[]>(PROCESS_GUIDES);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastClassification, setLastClassification] = useState<IntentClassificationResponse | undefined>(undefined);
  const [currentIncidentDraft, setCurrentIncidentDraft] = useState<any | null>(null);

  // Attempt real browser geolocation with fallback to RKGIT coordinates
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // If in India or local coords, record coordinates
          setUserCoords({
            lat: pos.coords.latitude,
            long: pos.coords.longitude,
            campus_name: 'Current GPS Location (Simulated RKGIT Campus)',
          });
        },
        (err) => {
          // Keep RKGIT defaults
          console.log('Using default mock campus coordinates (RKGIT Ghaziabad):', err.message);
        },
        { timeout: 5000 }
      );
    }
  }, []);

  // Fetch initial resources from server
  useEffect(() => {
    fetch(`/api/resources?lat=${userCoords.lat}&long=${userCoords.long}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.resources && Array.isArray(data.resources)) {
          setResources(data.resources);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch server resources, using seeded campus data:', err);
      });
  }, [userCoords]);

  // Handle Voice or Text Triage
  const handleQuerySearch = async (queryText: string) => {
    setIsLoading(true);

    try {
      const resp = await fetch('/api/classify-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          lat: userCoords.lat,
          long: userCoords.long,
        }),
      });

      if (!resp.ok) {
        throw new Error(`Server returned ${resp.status}`);
      }

      const result: IntentClassificationResponse = await resp.json();
      setLastClassification(result);

      // Add to queries state for instant feedback
      const newQueryItem: QueryLog = {
        id: `q-${Date.now()}`,
        text: queryText,
        detected_intent: result.detected_intent,
        is_emergency: result.is_emergency,
        language: result.language,
        timestamp: 'Just now',
        lat: userCoords.lat,
        long: userCoords.long,
      };
      setQueries((prev) => [newQueryItem, ...prev]);

      // Check if emergency triggered
      if (result.is_emergency) {
        setHasActiveEmergency(true);
        if (result.incident_draft) {
          setCurrentIncidentDraft(result.incident_draft);
        }
      }

      // Check if procedural guide matched
      if (result.process_guide_id) {
        const matched = processGuides.find((p) => p.id === result.process_guide_id);
        if (matched) {
          setActiveProcessGuide(matched);
        }
      }

      // Auto filter resources if suggested
      if (result.suggested_category) {
        setSelectedCategory(result.suggested_category);
      }
    } catch (err) {
      console.warn('Triage request failed, handling locally:', err);
      // Fallback local check
      const isEmg = queryText.toLowerCase().includes('unsafe') || queryText.toLowerCase().includes('medical') || queryText.toLowerCase().includes('harass');
      if (isEmg) {
        setHasActiveEmergency(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // SOS Panic button handler
  const handleTriggerSOS = () => {
    setHasActiveEmergency(true);
    setCurrentIncidentDraft({
      category: 'Security',
      urgency: 'Critical',
      description: 'Urgent SOS panic button triggered by student at RKGIT Campus. Immediate assistance required.',
      suggested_action: 'Dispatch Main Gate QRT and alert UP Women Power Line 1090',
    });
  };

  // Submit Incident Handler
  const handleSubmitIncident = async (incidentData: Partial<IncidentReport>) => {
    try {
      const resp = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidentData),
      });
      if (resp.ok) {
        const created = await resp.json();
        setIncidents((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.warn('Incident submit fallback:', err);
      const fallbackItem: IncidentReport = {
        id: `inc-${Date.now()}`,
        category: (incidentData.category as any) || 'Security',
        description: incidentData.description || 'Emergency alert logged',
        lat: userCoords.lat,
        long: userCoords.long,
        location_name: incidentData.location_name || 'RKGIT Campus',
        status: 'Reported',
        urgency: incidentData.urgency || 'Critical',
        created_at: 'Just now',
        contact_number: incidentData.contact_number,
      };
      setIncidents((prev) => [fallbackItem, ...prev]);
    }
  };

  // Admin Resource Actions
  const handleAddResource = async (newRes: Omit<CampusResource, 'id'>) => {
    try {
      const resp = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRes),
      });
      if (resp.ok) {
        const created = await resp.json();
        setResources((prev) => [...prev, created]);
      }
    } catch (err) {
      console.warn('Add resource fallback:', err);
      const fallback: CampusResource = {
        ...newRes,
        id: `res-${Date.now()}`,
      };
      setResources((prev) => [...prev, fallback]);
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      await fetch(`/api/admin/resources/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Delete resource error:', err);
    }
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateIncidentStatus = async (id: string, status: 'Reported' | 'Contacted' | 'Resolved') => {
    try {
      await fetch(`/api/incidents/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn('Update incident error:', err);
    }
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status } : inc))
    );
  };

  // Filtered resources
  const filteredResources = resources.filter((res) => {
    if (selectedCategory === 'all') return true;
    return res.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Global Header */}
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        onTriggerSOS={handleTriggerSOS}
        onOpenPitchGuide={() => setShowPitchGuide(true)}
        hasActiveEmergency={hasActiveEmergency}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Offline Fallback View (when simulated toggle is ON) */}
        {isOffline ? (
          <OfflineFallbackView
            onDisableOffline={() => setIsOffline(false)}
            cachedResources={resources.filter((r) => r.is_emergency_hub)}
            userCoords={userCoords}
          />
        ) : isAdmin ? (
          /* Admin / Proctor Console View */
          <AdminDashboard
            resources={resources}
            incidents={incidents}
            queries={queries}
            onAddResource={handleAddResource}
            onDeleteResource={handleDeleteResource}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
          />
        ) : (
          /* Student Front-Facing View */
          <>
            {/* Active Emergency Banner (Shows when triggered) */}
            {hasActiveEmergency && (
              <EmergencyBanner
                onOpenIncidentDraft={() => setShowIncidentModal(true)}
                onDeactivate={() => setHasActiveEmergency(false)}
                userCoords={userCoords}
              />
            )}

            {/* Voice & Text Multilingual Query Hero */}
            <VoiceQuerySection
              onSearch={handleQuerySearch}
              isLoading={isLoading}
              activeLanguage="Hindi + English"
              lastResponse={lastClassification}
            />

            {/* Quick Process Guides Strip (Duplicate ID, Anti-ragging, Medical Leave, POSH) */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Step-by-Step Campus Guides &amp; Procedures
                    </h3>
                    <p className="text-xs text-slate-500">
                      Clear action steps, required documents, and office windows
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 self-start sm:self-auto">
                  Interactive Checklists
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {processGuides.map((guide) => (
                  <button
                    key={guide.id}
                    onClick={() => setActiveProcessGuide(guide)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 text-left transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
                        {guide.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-900 line-clamp-1">
                        {guide.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 font-sans mt-0.5">
                        {guide.title_hi}
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-600 group-hover:text-indigo-700">
                      <span>View Steps</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Campus Safety Hubs & Nearby Resources */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-600" />
                    <span>Location-Aware Campus Resources ({filteredResources.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verified support desks, medical emergency hubs, and security posts for RKGIT Ghaziabad
                  </p>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    All Hubs
                  </button>

                  <button
                    onClick={() => setSelectedCategory('women_safety')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === 'women_safety'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    Women's Safety
                  </button>

                  <button
                    onClick={() => setSelectedCategory('security')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === 'security'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white hover:bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    Security &amp; QRT
                  </button>

                  <button
                    onClick={() => setSelectedCategory('medical')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === 'medical'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    Medical &amp; Clinic
                  </button>

                  <button
                    onClick={() => setSelectedCategory('counseling')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === 'counseling'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white hover:bg-purple-50 text-purple-800 border border-purple-200'
                    }`}
                  >
                    Counseling
                  </button>

                  <button
                    onClick={() => setSelectedCategory('admin')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Resource Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    userCoords={userCoords}
                  />
                ))}
              </div>
            </div>

            {/* Quick Emergency Helplines Strip */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-white">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct National Helplines</p>
                  <p className="text-sm font-semibold text-slate-100">
                    Emergency: <strong className="text-white">112</strong> • Women Powerline: <strong className="text-rose-400">1090</strong> • Anti-Ragging: <strong className="text-amber-400">1800-180-5522</strong> • Medical: <strong className="text-emerald-400">108</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIncidentModal(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
              >
                Log Campus Incident Report
              </button>
            </div>
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-800">Sahayata (सहायता)</span> — 24-Hour Hackathon Edition • Designed for RKGIT Campus, Ghaziabad.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPitchGuide(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Hackathon Pitch &amp; Tech Kit</span>
            </button>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-400">UP Police 112 &amp; 1090 Compatible</span>
          </div>
        </div>
      </footer>

      {/* Process Guide Modal */}
      {activeProcessGuide && (
        <ProcessGuideModal
          guide={activeProcessGuide}
          onClose={() => setActiveProcessGuide(null)}
        />
      )}

      {/* Incident Modal */}
      {showIncidentModal && (
        <IncidentModal
          draft={currentIncidentDraft}
          userCoords={userCoords}
          onClose={() => setShowIncidentModal(false)}
          onSubmitIncident={handleSubmitIncident}
        />
      )}

      {/* Hackathon Judge & Mentor Presentation Kit Modal */}
      {showPitchGuide && (
        <HackathonJudgeGuideModal onClose={() => setShowPitchGuide(false)} />
      )}

    </div>
  );
}
