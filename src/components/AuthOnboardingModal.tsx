import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FitnessGoal, ExperienceLevel, TrainingLocation, DietaryPreference, ActivityLevel } from '../types';
import { BrandLogo } from './BrandLogo';

interface AuthOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthOnboardingModal: React.FC<AuthOnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { login, signup, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [step, setStep] = useState<number>(1); // For multi-step onboarding
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [heightCm, setHeightCm] = useState<number>(174);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [fitnessExperience, setFitnessExperience] = useState<ExperienceLevel>('beginner');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('fat_loss');
  const [preferredLocation, setPreferredLocation] = useState<TrainingLocation>('home');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('vegetarian');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['Bodyweight']);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = login(email, password);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Login failed');
    }
  };

  const handleQuickDemoLogin = (demoRole: 'user' | 'admin') => {
    setErrorMsg(null);
    if (demoRole === 'admin') {
      login('admin@physiofit.in', 'admin123');
    } else {
      login('rahul@physiofit.in', 'fitness123');
    }
    onClose();
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your account email');
      return;
    }
    showToast(`Password recovery link simulated to ${email}. Check your inbox!`);
    setMode('login');
  };

  const handleSignupComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = signup({
      email,
      name,
      age: Number(age),
      gender,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      fitnessExperience,
      fitnessGoal,
      preferredLocation,
      daysPerWeek: Number(daysPerWeek),
      dietaryPreference,
      activityLevel,
      equipment: selectedEquipment,
    });

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Signup failed');
    }
  };

  const toggleEquipment = (eq: string) => {
    if (selectedEquipment.includes(eq)) {
      setSelectedEquipment((prev) => prev.filter((i) => i !== eq));
    } else {
      setSelectedEquipment((prev) => [...prev, eq]);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-[#131821] border border-[#283241] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#242c38] pb-4">
          <div className="flex items-center gap-3">
            <BrandLogo variant="icon" className="h-10 w-10 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-white">
                {mode === 'login'
                  ? 'Sign in to PhysioFit'
                  : mode === 'signup'
                  ? `Onboarding (Step ${step} of 3)`
                  : 'Recover Account'}
              </h2>
              <span className="text-xs font-semibold text-emerald-400">Train Smart. Move Better.</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white border border-[#2b3544]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* 1. LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@physiofit.in"
                  className="w-full rounded-xl border border-[#283241] bg-[#161d26] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot_password')}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#283241] bg-[#161d26] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
            >
              Sign In
            </button>

            {/* Quick Demo Logins for instant evaluation */}
            <div className="pt-2 border-t border-[#232b36] space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block text-center uppercase tracking-wider">
                Instant Demo Access:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('user')}
                  className="rounded-xl border border-[#2d3848] bg-[#171f2a] p-2.5 text-left hover:border-emerald-500/50 hover:bg-[#1a2330] transition-colors"
                >
                  <div className="text-xs font-bold text-white">Rahul Sharma</div>
                  <div className="text-[10px] text-emerald-400 font-medium">Athlete Profile</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="rounded-xl border border-[#2d3848] bg-[#171f2a] p-2.5 text-left hover:border-emerald-500/50 hover:bg-[#1a2330] transition-colors"
                >
                  <div className="text-xs font-bold text-white">Ananya Roy</div>
                  <div className="text-[10px] text-emerald-400 font-medium">Clinical Consultant</div>
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">New to PhysioFit? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setStep(1);
                }}
                className="text-xs font-bold text-emerald-400 hover:underline"
              >
                Create an account
              </button>
            </div>
          </form>
        )}

        {/* 2. FORGOT PASSWORD MODE */}
        {mode === 'forgot_password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your email address and we'll send you a secure password reset link to get back to
              your workouts.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@physiofit.in"
                  className="w-full rounded-xl border border-[#283241] bg-[#161d26] pl-10 pr-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="flex-1 rounded-xl border border-[#2d3848] py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Back to Login
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        )}

        {/* 3. SIGNUP & MULTI-STEP ONBOARDING */}
        {mode === 'signup' && (
          <div className="space-y-4">
            {/* Step 1: Basics & Physical Stats */}
            {step === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rohan Verma"
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rohan@example.com"
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
                    <input
                      type="number"
                      min="14"
                      max="90"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-2.5 py-1.5 text-xs text-white tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      min="100"
                      max="230"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-2.5 py-1.5 text-xs text-white tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      min="35"
                      max="220"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-2.5 py-1.5 text-xs text-white tabular-nums"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!name.trim() || !email.trim()) {
                        setErrorMsg('Please provide name and email');
                        return;
                      }
                      setErrorMsg(null);
                      setStep(2);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                  >
                    <span>Next: Goals & Experience</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Goal, Experience & Location */}
            {step === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Fitness Goal
                  </label>
                  <select
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value as FitnessGoal)}
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="fat_loss">Fat Loss & Conditioning</option>
                    <option value="muscle_gain">Muscle Gain & Hypertrophy</option>
                    <option value="strength">Raw Strength Foundation</option>
                    <option value="general_fitness">General Health & Longevity</option>
                    <option value="mobility">Joint Mobility & Flexibility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Fitness Experience
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['beginner', 'intermediate', 'advanced'] as ExperienceLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFitnessExperience(lvl)}
                        className={`rounded-xl py-2 px-3 text-xs font-semibold capitalize border transition-all ${
                          fitnessExperience === lvl
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'border-[#2d3848] text-slate-400 hover:text-white'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Training Location
                    </label>
                    <select
                      value={preferredLocation}
                      onChange={(e) => setPreferredLocation(e.target.value as TrainingLocation)}
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="home">Home (Bodyweight/Bands)</option>
                      <option value="gym">Gym (Barbells/Machines)</option>
                      <option value="both">Both (Hybrid)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Days per Week
                    </label>
                    <select
                      value={daysPerWeek}
                      onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value={2}>2 Days / Week</option>
                      <option value={3}>3 Days / Week</option>
                      <option value={4}>4 Days / Week</option>
                      <option value={5}>5 Days / Week</option>
                      <option value={6}>6 Days / Week</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                  >
                    <span>Next: Diet & Equipment</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Equipment & Dietary Preference */}
            {step === 3 && (
              <form onSubmit={handleSignupComplete} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Dietary Preference (Indian Cuisine Context)
                  </label>
                  <select
                    value={dietaryPreference}
                    onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="vegetarian">Vegetarian (Lacto-Veg: Paneer, Milk, Dal)</option>
                    <option value="eggetarian">Eggetarian (Veg + Eggs)</option>
                    <option value="non_vegetarian">Non-Vegetarian (Chicken, Fish, Eggs)</option>
                    <option value="vegan">Vegan (Plant-based, Soya, Pulses)</option>
                    <option value="jain">Jain Vegetarian (No root veggies)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Daily Activity Level
                  </label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="sedentary">Sedentary (Desk work, minimal walking)</option>
                    <option value="lightly_active">Lightly Active (1-3 days light movement)</option>
                    <option value="moderately_active">Moderately Active (3-5 days workouts)</option>
                    <option value="very_active">Very Active (Daily physical training/labor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Available Workout Equipment
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Bodyweight',
                      'Dumbbells',
                      'Resistance Bands',
                      'Kettlebell',
                      'Pull-up Bar',
                      'Full Gym',
                      'Bench',
                    ].map((eq) => {
                      const isSel = selectedEquipment.includes(eq);
                      return (
                        <button
                          key={eq}
                          type="button"
                          onClick={() => toggleEquipment(eq)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium border transition-colors ${
                            isSel
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'border-[#2d3848] text-slate-400 hover:text-white'
                          }`}
                        >
                          {eq}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#232b36] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Complete Onboarding</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
