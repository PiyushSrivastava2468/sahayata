import React, { useState } from 'react';
import { X, Check, User, School, MapPin, Sparkles, BookOpen, Target } from 'lucide-react';
import { StudentProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  language: 'hinglish' | 'english';
}

const POPULAR_SKILLS = [
  'C++',
  'Java',
  'Python',
  'Basics of DSA',
  'React / Web Dev',
  'SQL & Database',
  'Machine Learning',
  'Git & GitHub',
  'Circuit Simulation (EEE/ECE)',
  'Embedded Systems',
];

const POPULAR_INTERESTS = [
  'Software Placements',
  'Government Scholarships',
  'Virtual Internships',
  'Hackathons & Competitions',
  'Open Source Contributions',
  'Core Branch Roles',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  language,
}) => {
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [customSkill, setCustomSkill] = useState('');

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, customSkill.trim()] });
      setCustomSkill('');
    }
  };

  const toggleInterest = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({ ...formData, interests: formData.interests.filter((i) => i !== interest) });
    } else {
      setFormData({ ...formData, interests: [...formData.interests, interest] });
    }
  };

  const handleSave = () => {
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {language === 'hinglish' ? 'Aapka Student Profile' : 'Student Profile'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hinglish'
                  ? 'Isi ke aadhar par opportunities aur roadmap tailor honge'
                  : 'Tailors opportunity eligibility and personalized roadmaps'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 pt-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-800"
              placeholder="e.g. Amit Sharma"
            />
          </div>

          {/* Year & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                College Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-800 bg-white"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Pre-final)</option>
                <option value="4th Year">4th Year (Final Year)</option>
                <option value="Graduate">Recent Graduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Branch / Stream
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-800"
                placeholder="e.g. EEE, CSE, MECH, Civil, BCA"
              />
            </div>
          </div>

          {/* College & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                College Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-800"
                  placeholder="e.g. AKGEC Ghaziabad"
                />
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                City / Town
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-800"
                  placeholder="e.g. Ghaziabad, Kanpur, Patna"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Current Skills Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Skills & Technologies
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {POPULAR_SKILLS.map((skill) => {
                const selected = formData.skills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                      selected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>

            {/* Add custom skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                placeholder="Custom skill (e.g. Flutter, Next.js)"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Primary Career Goal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Current Target Goal
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.targetGoal || ''}
                onChange={(e) => setFormData({ ...formData, targetGoal: e.target.value })}
                placeholder="e.g. Crack Campus Placement in 3rd Year"
                className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
              />
              <Target className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Opportunities You Want To See
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_INTERESTS.map((interest) => {
                const selected = formData.interests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                      selected
                        ? 'bg-amber-500 text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-6 border-t border-slate-100 mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            {language === 'hinglish' ? 'Profile Save Karein' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};
