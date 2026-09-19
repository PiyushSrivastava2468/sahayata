import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  PlusCircle,
  Trash2,
  TrendingUp,
  Users,
  Briefcase,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';
import { Opportunity, AdminAnalytics } from '../types';

interface AdminDashboardViewProps {
  opportunities: Opportunity[];
  onRefreshOpportunities: () => void;
  language: 'hinglish' | 'english';
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  opportunities,
  onRefreshOpportunities,
  language,
}) => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New opportunity form state
  const [newTitle, setNewTitle] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newType, setNewType] = useState<any>('internship');
  const [newStipend, setNewStipend] = useState('₹15,000 / month');
  const [newDeadline, setNewDeadline] = useState('2026-08-15');
  const [newLink, setNewLink] = useState('https://internshala.com');
  const [newEligibility, setNewEligibility] = useState('2nd and 3rd year engineering students');
  const [newIsFeatured, setNewIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((data) => setAnalytics(data))
      .catch((e) => console.warn('Analytics fetch failed:', e));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Kya aap is opportunity ko delete karna chahte hain?')) return;
    try {
      await fetch(`/api/opportunities/${id}`, { method: 'DELETE' });
      onRefreshOpportunities();
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newOrg.trim()) return;
    setIsSubmitting(true);

    try {
      await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          organization: newOrg,
          type: newType,
          stipend_or_amount: newStipend,
          deadline: newDeadline,
          link: newLink,
          eligibility_text: newEligibility,
          eligible_years: ['All'],
          eligible_branches: ['All'],
          is_featured: newIsFeatured,
          tags: ['campus-tpo', newType],
        }),
      });

      setShowAddModal(false);
      setNewTitle('');
      setNewOrg('');
      onRefreshOpportunities();
    } catch (err) {
      console.error('Create error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>College TPO & Placement Cell Admin</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Campus Opportunity & Analytics Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'hinglish'
              ? 'TPO officers verified opportunities add kar sakte hain aur students ke demand trends dekh sakte hain.'
              : 'Placement officers can publish verified opportunities and monitor tier-2/3 student skill demands.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add New Opportunity</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {analytics?.totalStudents || 1420}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            ↑ 18% new signups this month
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Mauke</span>
            <Briefcase className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {opportunities.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Internships, SIH & Scholarships
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            7,100+
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Across 14 affiliated colleges
          </div>
        </div>
      </div>

      {/* Top Demand Trends */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Most Demanded Skills by Students</span>
            </h3>
            <div className="space-y-2.5">
              {analytics.topSearchedSkills.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.skill}</span>
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {item.count} searches
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-500" />
              <span>Most Viewed Student Opportunities</span>
            </h3>
            <div className="space-y-2.5">
              {analytics.mostViewedOpportunities.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 truncate max-w-[240px]">{item.title}</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    {item.views} clicks
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manage Active Opportunities Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          All Active Opportunities ({opportunities.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Stipend / Award</th>
                <th className="py-3 px-3">Deadline</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    <div>{opp.title}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{opp.organization}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {opp.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{opp.stipend_or_amount}</td>
                  <td className="py-3 px-3 text-slate-600">{opp.deadline}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDelete(opp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete opportunity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Opportunity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Post Verified Opportunity</h3>
            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Opportunity Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. DRDO Summer Research Intern"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organization</label>
                  <input
                    type="text"
                    required
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    placeholder="e.g. DRDO Labs"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="internship">Internship</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="campus_program">Campus Program</option>
                    <option value="fellowship">Fellowship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stipend / Prize</label>
                  <input
                    type="text"
                    value={newStipend}
                    onChange={(e) => setNewStipend(e.target.value)}
                    placeholder="e.g. ₹20,000/month"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Apply Link</label>
                <input
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={newEligibility}
                  onChange={(e) => setNewEligibility(e.target.value)}
                  placeholder="e.g. 2nd & 3rd Year B.Tech students"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={newIsFeatured}
                  onChange={(e) => setNewIsFeatured(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="featuredCheck" className="text-slate-700 font-medium">
                  Set as "Daily Mauka" Featured Banner on Homepage
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-xs"
                >
                  {isSubmitting ? 'Posting...' : 'Publish to Feed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
