import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, Plus, Trash2, Edit3, CheckCircle2, Clock, MapPin, Phone, Filter, Sparkles, Activity } from 'lucide-react';
import { CampusResource, IncidentReport, QueryLog, ResourceCategory } from '../types';

interface AdminDashboardProps {
  resources: CampusResource[];
  incidents: IncidentReport[];
  queries: QueryLog[];
  onAddResource: (resource: Omit<CampusResource, 'id'>) => void;
  onDeleteResource: (id: string) => void;
  onUpdateIncidentStatus: (id: string, status: 'Reported' | 'Contacted' | 'Resolved') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  resources,
  incidents,
  queries,
  onAddResource,
  onDeleteResource,
  onUpdateIncidentStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'incidents' | 'queries' | 'resources'>('incidents');
  const [showAddModal, setShowAddModal] = useState(false);

  // New resource form state
  const [newResName, setNewResName] = useState('');
  const [newResCat, setNewResCat] = useState<ResourceCategory>('security');
  const [newResPhone, setNewResPhone] = useState('');
  const [newResAddress, setNewResAddress] = useState('');
  const [newResHours, setNewResHours] = useState('9:00 AM - 5:00 PM');
  const [newResContact, setNewResContact] = useState('');
  const [newResEmergency, setNewResEmergency] = useState(true);

  // Campus safety statistics calculation
  const totalIncidents = incidents.length;
  const resolvedIncidents = incidents.filter((i) => i.status === 'Resolved').length;
  const emergencyQueries = queries.filter((q) => q.is_emergency).length;
  const resolutionRate = totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 100;
  const safetyScore = Math.min(100, Math.max(70, Math.round(98 - emergencyQueries * 1.5 + resolutionRate * 0.1)));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResName || !newResPhone) return;

    onAddResource({
      name: newResName,
      category: newResCat,
      lat: 28.7183,
      long: 77.4812,
      phone: newResPhone,
      address: newResAddress || 'RKGIT Campus',
      office_hours: newResHours,
      contact_person: newResContact || 'Campus In-charge',
      is_emergency_hub: newResEmergency,
    });

    setNewResName('');
    setNewResPhone('');
    setNewResAddress('');
    setNewResContact('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Hero with Safety Analytics */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Staff &amp; Proctor Control Room
              </span>
              <span className="text-xs text-slate-400">RKGIT Campus Administrative Portal</span>
            </div>
            <h2 className="text-2xl font-black text-white">Campus Safety &amp; Emergency Dispatch Console</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Live triaged queries, incident response status, and verified emergency hub directory.
            </p>
          </div>

          {/* Campus Safety Score Widget */}
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-4">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90">
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" className="text-slate-700" fill="transparent" />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-emerald-400"
                  fill="transparent"
                  strokeDasharray={150}
                  strokeDashoffset={150 - (150 * safetyScore) / 100}
                />
              </svg>
              <span className="absolute font-black text-base text-white">{safetyScore}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus Safety Score</p>
              <p className="text-sm font-black text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Zone Rating: Optimal</span>
              </p>
              <p className="text-[11px] text-slate-400">{resolutionRate}% incidents addressed</p>
            </div>
          </div>
        </div>

        {/* Metric Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <p className="text-xs text-slate-400 font-semibold">Active Incidents</p>
            <p className="text-xl font-black text-rose-400">{incidents.filter((i) => i.status !== 'Resolved').length}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <p className="text-xs text-slate-400 font-semibold">Resolved Cases</p>
            <p className="text-xl font-black text-emerald-400">{resolvedIncidents}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <p className="text-xs text-slate-400 font-semibold">AI Triage Queries</p>
            <p className="text-xl font-black text-amber-400">{queries.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <p className="text-xs text-slate-400 font-semibold">Active Resources</p>
            <p className="text-xl font-black text-blue-400">{resources.length}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'incidents'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600'
            }`}
          >
            Incident Queue ({incidents.length})
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'queries'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600'
            }`}
          >
            Anonymized Query Logs ({queries.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'resources'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600'
            }`}
          >
            Resource Directory ({resources.length})
          </button>
        </div>

        {activeTab === 'resources' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resource</span>
          </button>
        )}
      </div>

      {/* Tab Content 1: Incidents Queue */}
      {activeTab === 'incidents' && (
        <div className="space-y-3">
          {incidents.length === 0 ? (
            <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-500 text-sm">
              No reported incidents currently. Campus status is normal.
            </div>
          ) : (
            incidents.map((inc) => (
              <div
                key={inc.id}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider ${
                        inc.urgency === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : inc.urgency === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {inc.urgency} Urgency
                    </span>
                    <span className="text-xs font-bold text-slate-700">Category: {inc.category}</span>
                    <span className="text-xs text-slate-400">• {inc.created_at}</span>
                  </div>

                  <p className="text-sm font-medium text-slate-800 leading-relaxed">{inc.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inc.location_name}</span>
                    </span>
                    {inc.contact_number && (
                      <span className="flex items-center gap-1 font-mono text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{inc.contact_number}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      inc.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inc.status === 'Contacted'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800 animate-pulse'
                    }`}
                  >
                    {inc.status}
                  </span>

                  {inc.status !== 'Contacted' && inc.status !== 'Resolved' && (
                    <button
                      onClick={() => onUpdateIncidentStatus(inc.id, 'Contacted')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                    >
                      Mark Contacted
                    </button>
                  )}

                  {inc.status !== 'Resolved' && (
                    <button
                      onClick={() => onUpdateIncidentStatus(inc.id, 'Resolved')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content 2: Anonymized Query Logs */}
      {activeTab === 'queries' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Query Text</th>
                  <th className="p-3">Detected Intent</th>
                  <th className="p-3">Language</th>
                  <th className="p-3">Emergency</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {queries.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-slate-900 font-semibold max-w-xs truncate">{q.text}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                        {q.detected_intent}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{q.language}</td>
                    <td className="p-3">
                      {q.is_emergency ? (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-extrabold">YES</span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-500">{q.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Resource Directory Management */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {resources.map((res) => (
            <div key={res.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {res.category}
                  </span>
                  {res.is_emergency_hub && (
                    <span className="text-[10px] font-bold text-rose-600">★ Emergency Hub</span>
                  )}
                </div>
                <h5 className="text-sm font-bold text-slate-900">{res.name}</h5>
                <p className="text-xs text-slate-500">{res.address}</p>
                <p className="text-xs font-mono font-bold text-slate-700 mt-1">{res.phone}</p>
              </div>
              <button
                onClick={() => onDeleteResource(res.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete resource"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Campus Emergency Resource</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resource / Desk Name</label>
                <input
                  type="text"
                  required
                  value={newResName}
                  onChange={(e) => setNewResName(e.target.value)}
                  placeholder="e.g. Campus Ambulance Unit 2"
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newResCat}
                  onChange={(e) => setNewResCat(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                >
                  <option value="security">Security & QRT</option>
                  <option value="women_safety">Women's Safety / ICC</option>
                  <option value="medical">Medical / Hospital</option>
                  <option value="counseling">Counseling / Wellness</option>
                  <option value="admin">Administration / Academic</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newResPhone}
                  onChange={(e) => setNewResPhone(e.target.value)}
                  placeholder="+91-9876543210"
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campus Address / Location</label>
                <input
                  type="text"
                  value={newResAddress}
                  onChange={(e) => setNewResAddress(e.target.value)}
                  placeholder="e.g. Block C, Room 102"
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Incharge Person</label>
                <input
                  type="text"
                  value={newResContact}
                  onChange={(e) => setNewResContact(e.target.value)}
                  placeholder="e.g. Dr. A. K. Verma"
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="emgHub"
                  checked={newResEmergency}
                  onChange={(e) => setNewResEmergency(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="emgHub" className="font-semibold text-slate-800">
                  Mark as High-Priority Emergency Hub
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
