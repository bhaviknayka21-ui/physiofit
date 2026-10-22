import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  User,
  Droplet,
  Dumbbell,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  Sliders,
  Crown,
  Check,
  ShieldCheck,
  Zap,
  Phone,
  ArrowRight,
  Star,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FitnessGoal, TrainingLocation, DietaryPreference, ActivityLevel, MembershipTier } from '../types';
import { ConsultationModal } from './ConsultationModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'reminders' | 'membership';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile',
}) => {
  const { currentUser, updateUserProfile, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'reminders' | 'membership'>(initialTab);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Profile fields
  const [name, setName] = useState(currentUser?.name || '');
  const [age, setAge] = useState(currentUser?.age || 28);
  const [heightCm, setHeightCm] = useState(currentUser?.heightCm || 175);
  const [weightKg, setWeightKg] = useState(currentUser?.weightKg || 72);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(currentUser?.fitnessGoal || 'general_fitness');
  const [preferredLocation, setPreferredLocation] = useState<TrainingLocation>(
    currentUser?.preferredLocation || 'both'
  );
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(
    currentUser?.dietaryPreference || 'vegetarian'
  );
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    currentUser?.activityLevel || 'moderately_active'
  );

  // Reminder toggles
  const [workoutReminders, setWorkoutReminders] = useState(
    currentUser?.reminderSettings.workoutReminders ?? true
  );
  const [workoutTime, setWorkoutTime] = useState(currentUser?.reminderSettings.workoutTime || '07:00');
  const [waterReminders, setWaterReminders] = useState(
    currentUser?.reminderSettings.waterReminders ?? true
  );
  const [waterIntervalHours, setWaterIntervalHours] = useState(
    currentUser?.reminderSettings.waterIntervalHours || 2
  );
  const [mobilityBreakReminders, setMobilityBreakReminders] = useState(
    currentUser?.reminderSettings.mobilityBreakReminders ?? true
  );

  if (!isOpen || !currentUser) return null;

  // Determine normalized active tier
  const activePlanTier: MembershipTier =
    currentUser.subscription?.planTier === 'elite'
      ? 'elite'
      : currentUser.subscription?.isPro ||
        currentUser.subscription?.planTier === 'pro_monthly' ||
        currentUser.subscription?.planTier === 'pro_annual' ||
        currentUser.subscription?.planTier === 'pro'
      ? 'pro'
      : 'free';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      fitnessGoal,
      preferredLocation,
      dietaryPreference,
      activityLevel,
      reminderSettings: {
        workoutReminders,
        workoutTime,
        waterReminders,
        waterIntervalHours: Number(waterIntervalHours),
        mobilityBreakReminders,
      },
    });
    onClose();
  };

  const handleSelectTier = (tier: MembershipTier) => {
    if (tier === activePlanTier) {
      showToast(`You are already on the ${tier.toUpperCase()} tier.`);
      return;
    }

    const isPro = tier !== 'free';
    updateUserProfile({
      subscription: {
        isPro,
        planTier: tier,
        validUntil: isPro ? '2027-10-21T00:00:00Z' : undefined,
        autoRenew: isPro,
      },
    });

    if (tier === 'free') {
      showToast('Switched to Free tier.');
    } else if (tier === 'pro') {
      showToast('✨ Welcome to PhysioFit Pro! Advanced workout plans and physiotherapy analysis unlocked.');
    } else if (tier === 'elite') {
      showToast('🌟 Welcome to PhysioFit Elite! Priority clinical consultations and bespoke rehab unlocked.');
    }
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
      >
        <div className="relative w-full max-w-2xl rounded-2xl bg-[#121720] border border-[#273242] p-4 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-white">
          {/* Header Strip with Close Button */}
          <div className="flex items-center justify-between border-b border-[#232c3a] pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Settings & Membership</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white border border-[#2a3545] bg-[#171e28]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-[#171f2a] p-1 border border-[#263141]">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reminders')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                activeTab === 'reminders'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="h-3.5 w-3.5" />
              <span>Reminders</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('membership')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all relative ${
                activeTab === 'membership'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="h-3.5 w-3.5" />
              <span>Membership</span>
              <span
                className={`ml-1 text-[9px] uppercase px-1.5 py-0.2 rounded-full font-extrabold ${
                  activePlanTier === 'elite'
                    ? 'bg-amber-400 text-slate-950'
                    : activePlanTier === 'pro'
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {activePlanTier}
              </span>
            </button>
          </div>

          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Personal Health & Metric Profile</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Fitness Goal</label>
                    <select
                      value={fitnessGoal}
                      onChange={(e) => setFitnessGoal(e.target.value as FitnessGoal)}
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="fat_loss">Fat Loss & Conditioning</option>
                      <option value="muscle_gain">Hypertrophy & Muscle Gain</option>
                      <option value="strength">Pure Strength & Power</option>
                      <option value="general_fitness">General Fitness & Health</option>
                      <option value="mobility">Mobility & Posture Rehab</option>
                      <option value="flexibility">Flexibility & Joint Health</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Diet Preference</label>
                    <select
                      value={dietaryPreference}
                      onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="vegetarian">Vegetarian</option>
                      <option value="eggetarian">Eggetarian</option>
                      <option value="non_vegetarian">Non-Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="jain">Jain</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Training Location</label>
                    <select
                      value={preferredLocation}
                      onChange={(e) => setPreferredLocation(e.target.value as TrainingLocation)}
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="gym">Commercial Gym (Full Equipment)</option>
                      <option value="home">Home Workouts (Dumbbells / Bands)</option>
                      <option value="both">Hybrid (Gym & Home)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Activity Level</label>
                    <select
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="sedentary">Sedentary (Desk Job)</option>
                      <option value="lightly_active">Lightly Active</option>
                      <option value="moderately_active">Moderately Active</option>
                      <option value="very_active">Very Active</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#242c38]">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#2d3848] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  Save Profile
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REMINDERS & HABITS */}
          {activeTab === 'reminders' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Smart Habit & Recovery Reminders</span>
                </h3>

                {/* Workout Reminder */}
                <div className="rounded-xl bg-[#161d26] p-3.5 border border-[#263140] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Dumbbell className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Daily Workout Reminder</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Scheduled nudge at {workoutTime} to keep your daily streak alive
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={workoutTime}
                      onChange={(e) => setWorkoutTime(e.target.value)}
                      className="rounded-lg border border-[#2d3848] bg-[#11161d] px-2 py-1 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setWorkoutReminders(!workoutReminders)}
                      className={`h-6 w-11 rounded-full transition-colors relative ${
                        workoutReminders ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                      aria-label="Toggle workout reminders"
                    >
                      <span
                        className={`h-5 w-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                          workoutReminders ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Water Reminder */}
                <div className="rounded-xl bg-[#161d26] p-3.5 border border-[#263140] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Droplet className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Hydration Notification</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Nudge to drink 250ml water every {waterIntervalHours} hours
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={waterIntervalHours}
                      onChange={(e) => setWaterIntervalHours(Number(e.target.value))}
                      className="rounded-lg border border-[#2d3848] bg-[#11161d] px-2 py-1 text-xs text-white"
                    >
                      <option value={1}>Every 1 hr</option>
                      <option value={2}>Every 2 hrs</option>
                      <option value={3}>Every 3 hrs</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setWaterReminders(!waterReminders)}
                      className={`h-6 w-11 rounded-full transition-colors relative ${
                        waterReminders ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                      aria-label="Toggle water reminders"
                    >
                      <span
                        className={`h-5 w-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                          waterReminders ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Mobility Break Reminder */}
                <div className="rounded-xl bg-[#161d26] p-3.5 border border-[#263140] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      <span>Desk Worker Posture & Mobility Break</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Gentle 2-minute thoracic decompression & cervical spine relief
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobilityBreakReminders(!mobilityBreakReminders)}
                    className={`h-6 w-11 rounded-full transition-colors relative shrink-0 ${
                      mobilityBreakReminders ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                    aria-label="Toggle mobility reminders"
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        mobilityBreakReminders ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#242c38]">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MEMBERSHIP & SUBSCRIPTION TIERS (Free, Pro, Elite) */}
          {activeTab === 'membership' && (
            <div className="space-y-5">
              {/* Membership Title & Tagline */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                  <Crown className="h-3.5 w-3.5" />
                  <span>PhysioFit Membership Plans</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Train Smart. Move Better. Accelerate Recovery.
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Select the tier engineered for your fitness level, clinical rehabilitation needs, and personal goals.
                </p>
              </div>

              {/* Billing Cycle Switcher */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-1 rounded-xl bg-[#171f2b] p-1 border border-[#273243]">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                      billingCycle === 'annual'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="rounded-full bg-lime-400/90 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2">
                      Save 33%
                    </span>
                  </button>
                </div>
              </div>

              {/* Three Tier Cards Grid (Free, Pro, Elite) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 1. FREE TIER (Starter) */}
                <div
                  className={`rounded-2xl p-4 flex flex-col justify-between transition-all border ${
                    activePlanTier === 'free'
                      ? 'bg-[#151c27] border-slate-500 shadow-md ring-1 ring-slate-400'
                      : 'bg-[#131922] border-[#222b3a] hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Tier 01
                        </span>
                        <h4 className="text-base font-bold text-white">Free Starter</h4>
                      </div>
                      {activePlanTier === 'free' && (
                        <span className="rounded-full bg-slate-700 text-slate-200 text-[10px] font-bold px-2 py-0.5 border border-slate-600">
                          Current Tier
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-xl font-extrabold text-white">₹0 / $0</div>
                      <div className="text-[10px] text-slate-400">Free forever · No credit card</div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 pt-2 border-t border-[#1e2736] text-xs">
                      <div className="flex items-start gap-2 text-slate-300">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Core Exercise Library & Form Cues</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-300">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Daily Workout Logging & Streak</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-300">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Hydration & Posture Reminders</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-400 text-[11px]">
                        <span className="text-slate-600">✖</span>
                        <span>Advanced Workout Plans (Locked)</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-400 text-[11px]">
                        <span className="text-slate-600">✖</span>
                        <span>Physiotherapy Analysis (Locked)</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-400 text-[11px]">
                        <span className="text-slate-600">✖</span>
                        <span>Priority Clinical Consult (Locked)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    <button
                      type="button"
                      onClick={() => handleSelectTier('free')}
                      disabled={activePlanTier === 'free'}
                      className={`w-full rounded-xl py-2 text-xs font-bold transition-all ${
                        activePlanTier === 'free'
                          ? 'bg-[#1b222d] text-slate-400 cursor-default'
                          : 'bg-[#222c3b] text-white hover:bg-[#2b3749]'
                      }`}
                    >
                      {activePlanTier === 'free' ? 'Active Plan' : 'Switch to Free'}
                    </button>
                  </div>
                </div>

                {/* 2. PRO TIER (Most Popular) */}
                <div
                  className={`rounded-2xl p-4 flex flex-col justify-between transition-all relative border ${
                    activePlanTier === 'pro'
                      ? 'bg-[#142220] border-emerald-400 shadow-xl shadow-emerald-500/15 ring-2 ring-emerald-400/50'
                      : 'bg-[#131d25] border-emerald-500/40 hover:border-emerald-400'
                  }`}
                >
                  {/* Most Popular Floating Badge */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 px-2.5 py-0.5 text-[9px] font-extrabold text-slate-950 uppercase tracking-wider shadow-md">
                      Most Popular
                    </span>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          Tier 02 · Athlete & Rehab
                        </span>
                        <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                          <span>PhysioFit Pro</span>
                          <Sparkles className="h-3.5 w-3.5 text-lime-400" />
                        </h4>
                      </div>
                      {activePlanTier === 'pro' && (
                        <span className="rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5">
                          Active Pro
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-extrabold text-emerald-400">
                          {billingCycle === 'annual' ? '₹375 / $9.99' : '₹499 / $14.99'}
                        </span>
                        <span className="text-[10px] text-slate-400">/ month</span>
                      </div>
                      <div className="text-[10px] text-emerald-300/80">
                        {billingCycle === 'annual' ? 'Billed ₹4,499 annually (Save 33%)' : 'Flexible monthly billing'}
                      </div>
                    </div>

                    {/* Features List with Visual Emerald Indicators */}
                    <div className="space-y-2 pt-2 border-t border-[#1f2d34] text-xs">
                      <div className="flex items-start gap-2 text-white font-semibold bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/25">
                        <Star className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5 fill-emerald-400" />
                        <span>Advanced Workout Plans (Periodized Strength, Hypertrophy & Splits)</span>
                      </div>
                      <div className="flex items-start gap-2 text-white font-semibold bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/25">
                        <Activity className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Detailed Physiotherapy Analysis (Joint Angles, Injury Screening)</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-200">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Interactive D3 Muscle Anatomy & Contraction Simulation</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-200">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Unlimited Custom Routine Builder & 1RM Calculator</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-200">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Full HD Video Tutorials & Paced Breathing Gauges</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    <button
                      type="button"
                      onClick={() => handleSelectTier('pro')}
                      className={`w-full rounded-xl py-2 text-xs font-bold transition-all shadow-md ${
                        activePlanTier === 'pro'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/25'
                      }`}
                    >
                      {activePlanTier === 'pro' ? 'Current Plan (Pro)' : 'Upgrade to Pro'}
                    </button>
                  </div>
                </div>

                {/* 3. ELITE TIER (Clinical Concierge & 1-on-1 Physiotherapy) */}
                <div
                  className={`rounded-2xl p-4 flex flex-col justify-between transition-all border ${
                    activePlanTier === 'elite'
                      ? 'bg-[#1f1b2b] border-amber-400 shadow-xl shadow-amber-500/15 ring-2 ring-amber-400/50'
                      : 'bg-[#181523] border-[#382b4a] hover:border-amber-400/60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          Tier 03 · Concierge
                        </span>
                        <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                          <span>PhysioFit Elite</span>
                          <Crown className="h-3.5 w-3.5 text-amber-400" />
                        </h4>
                      </div>
                      {activePlanTier === 'elite' && (
                        <span className="rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5">
                          Active Elite
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-extrabold text-amber-400">
                          {billingCycle === 'annual' ? '₹1,199 / $29.99' : '₹1,499 / $39.99'}
                        </span>
                        <span className="text-[10px] text-slate-400">/ month</span>
                      </div>
                      <div className="text-[10px] text-amber-300/80">
                        {billingCycle === 'annual' ? 'Billed annually · Max savings' : 'Cancel anytime with 1 click'}
                      </div>
                    </div>

                    {/* Features List with Visual Gold Indicators */}
                    <div className="space-y-2 pt-2 border-t border-[#2d223f] text-xs">
                      <div className="text-[11px] font-bold text-slate-300">
                        Everything in Pro, plus:
                      </div>
                      <div className="flex items-start gap-2 text-white font-semibold bg-amber-500/15 p-1.5 rounded-lg border border-amber-500/30">
                        <Crown className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>Priority Clinical Consultations (1-on-1 Video & Direct Support)</span>
                      </div>
                      <div className="flex items-start gap-2 text-white font-semibold bg-amber-500/15 p-1.5 rounded-lg border border-amber-500/30">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>Bespoke Pain Management Treatment & Injury Recovery Plan</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-200">
                        <Check className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>Personal Video Form Check Review by Clinician Team</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-200">
                        <Check className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>24/7 Dedicated WhatsApp Clinical Triage Helpline</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    <button
                      type="button"
                      onClick={() => handleSelectTier('elite')}
                      className={`w-full rounded-xl py-2 text-xs font-bold transition-all shadow-md ${
                        activePlanTier === 'elite'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default'
                          : 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-amber-500/25'
                      }`}
                    >
                      {activePlanTier === 'elite' ? 'Current Plan (Elite)' : 'Upgrade to Elite'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Clinical Consultant Direct Helpline Action Banner */}
              <div className="rounded-xl bg-[#141b25] p-3.5 border border-[#232f3f] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Need Clinical Guidance or Custom Rehabilitation?</span>
                    <span className="text-[11px] text-slate-400">
                      Speak directly with Lead Physiotherapist Ananya Roy and clinical staff.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsConsultModalOpen(true)}
                  className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition-all self-start sm:self-auto shrink-0 flex items-center gap-1.5"
                >
                  <span>Contact Consultant</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#232c3a] text-xs">
                <span className="text-slate-400">
                  Backed by scientific biomechanics · 30-day money-back guarantee
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-[#1d2532] px-4 py-2 text-xs font-bold text-slate-300 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Direct Consultant Modal */}
      <ConsultationModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
      />
    </>
  );
};
