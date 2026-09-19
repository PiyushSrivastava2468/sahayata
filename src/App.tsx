import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DailyMaukaBanner } from './components/DailyMaukaBanner';
import { OpportunityCard } from './components/OpportunityCard';
import { OnboardingModal } from './components/OnboardingModal';
import { CareerChatView } from './components/CareerChatView';
import { RoadmapView } from './components/RoadmapView';
import { ResumeHelperView } from './components/ResumeHelperView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { HackathonJudgeGuideModal } from './components/HackathonJudgeGuideModal';
import { Opportunity, StudentProfile } from './types';
import { INITIAL_OPPORTUNITIES, DEFAULT_STUDENT_PROFILE } from './data/seedOpportunities';
import { evaluateEligibility } from './utils/matcher';
import {
  Search,
  Filter,
  Bookmark,
  Sparkles,
  SlidersHorizontal,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'chat' | 'roadmap' | 'resume' | 'admin'>('opportunities');
  const [language, setLanguage] = useState<'hinglish' | 'english'>('hinglish');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showJudgeGuide, setShowJudgeGuide] = useState(false);

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('sahayata_student_profile') || localStorage.getItem('sahayak_student_profile') || localStorage.getItem('udaan_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return DEFAULT_STUDENT_PROFILE;
  });

  // Opportunities state
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sahayata_saved_opps') || localStorage.getItem('sahayak_saved_opps') || localStorage.getItem('udaan_saved_opps');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['opp-reliance'];
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [showOnlyEligible, setShowOnlyEligible] = useState(false);

  // Fetch opportunities from backend
  const fetchOpportunities = async () => {
    try {
      const res = await fetch(`/api/opportunities?userId=${profile.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.opportunities && data.opportunities.length > 0) {
          setOpportunities(data.opportunities);
        }
      }
    } catch (err) {
      console.warn('Could not fetch from backend, using local seed opportunities:', err);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [profile.id]);

  const handleSaveProfile = async (updated: StudentProfile) => {
    setProfile(updated);
    try {
      localStorage.setItem('sahayata_student_profile', JSON.stringify(updated));
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      fetchOpportunities();
    } catch (err) {
      console.warn('Sync profile error:', err);
    }
  };

  const toggleSaveOpp = (id: string) => {
    let next: string[];
    if (savedIds.includes(id)) {
      next = savedIds.filter((item) => item !== id);
    } else {
      next = [...savedIds, id];
    }
    setSavedIds(next);
    try {
      localStorage.setItem('sahayata_saved_opps', JSON.stringify(next));
    } catch (e) {
      console.warn('Could not save bookmark', e);
    }
  };

  // Find featured opportunity
  const featuredOpp = opportunities.find((o) => o.is_featured) || opportunities[0];

  // Filtering opportunities logic
  const filteredOpportunities = opportunities.filter((opp) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        opp.title.toLowerCase().includes(q) ||
        opp.organization.toLowerCase().includes(q) ||
        opp.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Type filter
    if (selectedType !== 'all' && opp.type !== selectedType) {
      return false;
    }

    // Year filter
    if (yearFilter !== 'All') {
      const matchesYear = opp.eligible_years.includes('All') || opp.eligible_years.includes(yearFilter);
      if (!matchesYear) return false;
    }

    // Saved only
    if (showOnlySaved && !savedIds.includes(opp.id)) {
      return false;
    }

    // Eligible only
    if (showOnlyEligible) {
      const eligibility = evaluateEligibility(profile, opp);
      if (eligibility.eligible !== 'yes') return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenJudgeGuide={() => setShowJudgeGuide(true)}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab 1: Opportunities Feed */}
        {activeTab === 'opportunities' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Featured Hero Banner: Daily Mauka */}
            <DailyMaukaBanner
              featuredOpp={featuredOpp}
              profile={profile}
              onSelectOpp={(opp) => {
                window.open(opp.link, '_blank');
              }}
              language={language}
            />

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      language === 'hinglish'
                        ? "Mauke search karein (e.g. 'Scholarship', 'Amazon', 'Flipkart', 'AICTE')"
                        : "Search opportunities by title, company, or skills..."
                    }
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>

                {/* Eligibility and Saved Quick Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowOnlyEligible(!showOnlyEligible)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                      showOnlyEligible
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'hinglish' ? 'Mere Liye 100% Eligible' : 'Eligible for Me'}</span>
                  </button>

                  <button
                    onClick={() => setShowOnlySaved(!showOnlySaved)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                      showOnlySaved
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Saved ({savedIds.length})</span>
                  </button>
                </div>
              </div>

              {/* Category Badges & Year Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                {/* Type pills */}
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: 'All Opportunities' },
                    { id: 'scholarship', label: 'Scholarships' },
                    { id: 'internship', label: 'Internships' },
                    { id: 'hackathon', label: 'Hackathons' },
                    { id: 'campus_program', label: 'Campus Ambassador' },
                    { id: 'fellowship', label: 'Fellowships' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedType(cat.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                        selectedType === cat.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* College Year Filter Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-500 font-medium">Eligible Year:</span>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-hidden"
                  >
                    <option value="All">All Years</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Opportunities Count & Grid */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-bold text-slate-700">
                  {filteredOpportunities.length} Verified Opportunities Found
                </h3>
                <span className="text-xs text-slate-500">
                  Matched for <strong className="text-slate-700">{profile.year} ({profile.branch})</strong>
                </span>
              </div>

              {filteredOpportunities.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                  <Compass className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-base">Koi opportunity match nahi hui</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Filters reset karein ya search query change karein taaki aur mauke display ho sakein.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedType('all');
                      setYearFilter('All');
                      setShowOnlyEligible(false);
                      setShowOnlySaved(false);
                    }}
                    className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredOpportunities.map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opp={opp}
                      eligibility={evaluateEligibility(profile, opp)}
                      isSaved={savedIds.includes(opp.id)}
                      onToggleSave={() => toggleSaveOpp(opp.id)}
                      language={language}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: AI Career Chat */}
        {activeTab === 'chat' && (
          <div className="animate-in fade-in duration-200">
            <CareerChatView
              profile={profile}
              opportunities={opportunities}
              onSelectOpp={(opp) => {
                setActiveTab('opportunities');
                setSearchQuery(opp.title);
              }}
              language={language}
            />
          </div>
        )}

        {/* Tab 3: Skill Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="animate-in fade-in duration-200">
            <RoadmapView profile={profile} language={language} />
          </div>
        )}

        {/* Tab 4: Resume Helper */}
        {activeTab === 'resume' && (
          <div className="animate-in fade-in duration-200">
            <ResumeHelperView profile={profile} language={language} />
          </div>
        )}

        {/* Tab 5: Admin TPO Dashboard */}
        {activeTab === 'admin' && (
          <div className="animate-in fade-in duration-200">
            <AdminDashboardView
              opportunities={opportunities}
              onRefreshOpportunities={fetchOpportunities}
              language={language}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
              स
            </div>
            <span className="font-bold text-slate-800">Sahayata Career Navigator</span>
            <span className="text-slate-400">• Built for Bharat's Tier-2/3 Colleges</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Free & Open Source for Students</span>
            <button
              onClick={() => setShowJudgeGuide(true)}
              className="text-indigo-600 hover:underline font-semibold"
            >
              Hackathon Pitch Notes
            </button>
          </div>
        </div>
      </footer>

      {/* Profile Onboarding Modal */}
      <OnboardingModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        language={language}
      />

      {/* Judge Pitch Guide Modal */}
      <HackathonJudgeGuideModal
        isOpen={showJudgeGuide}
        onClose={() => setShowJudgeGuide(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
