import { StudentProfile, Opportunity, EligibilityResult } from '../types';

export function evaluateEligibility(
  profile: StudentProfile,
  opp: Opportunity
): EligibilityResult {
  const studentYear = profile.year || '2nd Year';
  const studentBranch = (profile.branch || 'CSE').toUpperCase();
  const studentSkills = (profile.skills || []).map((s) => s.toLowerCase());

  const eligibleYears = opp.eligible_years || ['All'];
  const eligibleBranches = opp.eligible_branches || ['All'];
  const reqText = (opp.eligibility_text || '').toLowerCase();

  // 1. Year Verification
  const yearMatch =
    eligibleYears.includes('All') || eligibleYears.includes(studentYear);
  if (!yearMatch) {
    return {
      eligible: 'no',
      reason: `Yeh opportunity sirf ${eligibleYears.join(', ')} ke students ke liye eligible hai (Aapka profile: ${studentYear}).`,
    };
  }

  // 2. Branch Verification
  const branchMatch =
    eligibleBranches.includes('All') ||
    eligibleBranches.some(
      (b) => studentBranch.includes(b.toUpperCase()) || b.toUpperCase().includes(studentBranch)
    );

  if (!branchMatch) {
    return {
      eligible: 'maybe',
      reason: `Preferred branches ${eligibleBranches.join(', ')} hain, par agar projects aur skills strong hain toh apply kar sakte hain!`,
    };
  }

  // 3. Skill check
  const matchedSkills = studentSkills.filter(
    (skill) =>
      reqText.includes(skill) ||
      opp.tags.some((tag) => tag.toLowerCase().includes(skill))
  );

  if (matchedSkills.length > 0) {
    return {
      eligible: 'yes',
      reason: `Badhai ho! Aapka year (${studentYear}), branch (${studentBranch}), aur skills (${matchedSkills.slice(0, 2).join(', ')}) match karte hain!`,
    };
  }

  return {
    eligible: 'yes',
    reason: `Aapka academic criteria (${studentYear} & ${studentBranch}) 100% qualify karta hai. Criteria fully satisfied!`,
  };
}
