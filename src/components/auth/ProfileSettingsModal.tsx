import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Sparkles, 
  Save, 
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const { user, profile, updateUserProfile } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [occupation, setOccupation] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('Intermediate');
  const [financialGoal, setFinancialGoal] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Prepopulate form when profile changes or modal opens
  useEffect(() => {
    if (isOpen && (profile || user)) {
      setDisplayName(profile?.displayName || user?.displayName || '');
      setEmail(profile?.email || user?.email || '');
      setAge(profile?.age ? String(profile.age) : '');
      setGender(profile?.gender || '');
      setOccupation(profile?.occupation || '');
      setExperienceLevel(profile?.experienceLevel || 'Intermediate');
      setFinancialGoal(profile?.financialGoal || '');
      setCity(profile?.city || '');
      setPhone(profile?.phone || '');
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [isOpen, profile, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (!displayName.trim()) {
        throw new Error('Please provide your name.');
      }

      await updateUserProfile({
        displayName: displayName.trim(),
        email: email.trim() || user?.email || '',
        age: age.trim() ? Number(age) : '',
        gender: gender || '',
        occupation: occupation || '',
        experienceLevel: experienceLevel || 'Intermediate',
        financialGoal: financialGoal || '',
        city: city.trim() || '',
        phone: phone.trim() || '',
      });

      setSuccessMsg('Profile and details updated successfully!');
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setErrorMsg(err.message || 'Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
  const OCCUPATIONS = [
    'Student',
    'Salaried Employee',
    'Business Owner / Entrepreneur',
    'Financial Analyst / Trader',
    'Doctor / Healthcare',
    'Software Engineer / Tech',
    'Freelancer / Consultant',
    'Retired / Investor',
    'Other'
  ];

  const FINANCIAL_GOALS = [
    'Master Stock & Options Trading',
    'Build Long-Term Wealth & Mutual Funds',
    'Financial Literacy & Budgeting',
    'Pass CFA / NISM / Financial Certification',
    'Retirement Planning & FI/RE',
    'Tax Saving & Portfolio Optimization'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-[#0D121F] border border-white/10 rounded-3xl shadow-2xl shadow-black overflow-hidden z-10 flex flex-col"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-60 h-60 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="p-6 md:p-7 border-b border-white/5 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center border border-brand-primary/20">
                <UserCheck size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Customer Profile & Settings</h2>
                <p className="text-xs text-white/50">Manage your personal identification, demographics, and learning preferences.</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Form Scroll Area */}
          <div className="p-6 md:p-7 overflow-y-auto flex-1 space-y-6">
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2"
              >
                <CheckCircle2 size={16} className="flex-shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
              >
                {errorMsg}
              </motion.div>
            )}

            <form id="profile-settings-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Account Credentials */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
                  <UserIcon size={13} />
                  Basic Account Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1.5">
                      Customer Full Name <span className="text-brand-primary">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Sam Sarvesh"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1.5">
                      Email Address <span className="text-white/30">(Primary ID)</span>
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="samsarvesh23@gmail.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Personal Demographics (Age, Gender, Phone, Location) */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
                  <Calendar size={13} />
                  Personal Demographics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Age */}
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1.5">Age</label>
                    <input
                      type="number"
                      min="12"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-primary transition-all"
                    />
                  </div>

                  {/* Gender Selection */}
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1.5">Gender</label>
                    <div className="grid grid-cols-2 gap-2">
                      {GENDERS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`py-2 px-3 rounded-xl text-xs font-mono transition-all border text-center ${
                            gender === g
                              ? 'bg-brand-primary text-bg-deep font-bold border-brand-primary shadow-sm'
                              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* City / Location */}
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1.5">City / Location</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai, New York, Bangalore"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1.5">Phone Number (Optional)</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Financial Background & Goals */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
                  <Briefcase size={13} />
                  Professional & Financial Profile
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Occupation */}
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1.5">Occupation</label>
                    <select
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full bg-[#111728] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary transition-all"
                    >
                      <option value="">Select Occupation</option>
                      {OCCUPATIONS.map((occ) => (
                        <option key={occ} value={occ} className="bg-[#0D121F] text-white">
                          {occ}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1.5">Investment Experience</label>
                    <div className="flex gap-2">
                      {EXPERIENCE_LEVELS.map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setExperienceLevel(lvl)}
                          className={`flex-1 py-2 rounded-xl text-xs font-mono transition-all border text-center ${
                            experienceLevel === lvl
                              ? 'bg-brand-primary text-bg-deep font-bold border-brand-primary shadow-sm'
                              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Financial Goal */}
                <div>
                  <label className="block text-[11px] font-mono text-white/60 mb-1.5">Primary Financial Goal</label>
                  <select
                    value={financialGoal}
                    onChange={(e) => setFinancialGoal(e.target.value)}
                    className="w-full bg-[#111728] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary transition-all"
                  >
                    <option value="">Select Financial Focus</option>
                    {FINANCIAL_GOALS.map((goal) => (
                      <option key={goal} value={goal} className="bg-[#0D121F] text-white">
                        {goal}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="p-5 md:p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-mono text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="profile-settings-form"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-bg-deep font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Save size={15} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
