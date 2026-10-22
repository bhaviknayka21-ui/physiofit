import React, { useState } from 'react';
import {
  Flame,
  Droplet,
  Dumbbell,
  TrendingDown,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  Play,
  RotateCcw,
  Activity,
  HeartPulse,
  Phone,
  Mail,
  MessageCircle,
  Crown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateTargetNutrition, calculateWaterRecommendation } from '../utils/fitnessLogic';
import { ASSETS, CONSULTANT_CONTACT } from '../data/seedData';
import { ConsultationModal } from './ConsultationModal';

interface DashboardViewProps {
  onOpenFeedback: () => void;
  onOpenSettings?: (tab?: 'profile' | 'reminders' | 'membership') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenFeedback,
  onOpenSettings,
}) => {
  const {
    currentUser,
    setCurrentView,
    programs,
    startWorkout,
    workoutLogs,
    streak,
    todayWaterAmount,
    logWater,
    resetWater,
    mobilityRoutines,
    progressMetrics,
    dailyMotivation,
  } = useApp();

  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Clean user name ensuring no "Dr." or "Admin" title is used
  const cleanUserName = currentUser?.name
    ? currentUser.name.replace(/^(Dr\.?|Admin|Dr)\s+/i, '').replace(/,\s*[A-Z]+$/i, '').trim()
    : 'Rahul';

  // Pick today's recommended program based on user's preference
  const recommendedProgram =
    programs.find((p) => {
      if (currentUser?.preferredLocation === 'home') return p.location === 'home' || p.location === 'both';
      if (currentUser?.preferredLocation === 'gym') return p.location === 'gym' || p.location === 'both';
      return true;
    }) || programs[0];

  // Daily target water
  const targetWater = currentUser
    ? calculateWaterRecommendation(currentUser.weightKg, currentUser.activityLevel)
    : 3000;
  const waterPercent = Math.min(100, Math.round((todayWaterAmount / targetWater) * 100));

  // Daily target nutrition
  const targetNutrition = currentUser
    ? calculateTargetNutrition({
        weightKg: currentUser.weightKg,
        heightCm: currentUser.heightCm,
        age: currentUser.age,
        gender: currentUser.gender,
        activityLevel: currentUser.activityLevel,
        fitnessGoal: currentUser.fitnessGoal,
      })
    : { calories: 2200, proteinGrams: 140, carbsGrams: 240, fatGrams: 60 };

  // Weight trend calculation
  const latestWeight = progressMetrics[0]?.weightKg || currentUser?.weightKg || 74;
  const oldestWeight = progressMetrics[progressMetrics.length - 1]?.weightKg || latestWeight;
  const weightDiff = Math.round((latestWeight - oldestWeight) * 10) / 10;

  // Daily mobility spotlight
  const dailyMobility = mobilityRoutines[0];

  // Weekly consistency (Last 7 days)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const past7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const iso = d.toISOString().split('T')[0];
    const isCompleted = workoutLogs.some((l) => l.date === iso);
    return {
      dayName: daysOfWeek[d.getDay()],
      dateNum: d.getDate(),
      iso,
      isCompleted,
      isToday: iso === today.toISOString().split('T')[0],
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Top Welcome Strip */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#141a22] to-[#1a222e] p-6 border border-[#252f3d] shadow-sm">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-semibold text-emerald-400">
            <span>Dynamic Performance Engine</span>
            <span aria-hidden="true">·</span>
            <span>Evidence-Based Training</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {cleanUserName}!
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {dailyMotivation}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-400">Current Plan:</span>
            <button
              type="button"
              onClick={() => onOpenSettings?.('membership')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold border transition-all ${
                currentUser?.subscription?.planTier === 'elite'
                  ? 'bg-amber-400/15 text-amber-300 border-amber-400/40 hover:bg-amber-400/25'
                  : currentUser?.subscription?.isPro ||
                    currentUser?.subscription?.planTier?.startsWith('pro')
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                  : 'bg-[#18202c] text-slate-300 border-[#2d3a4d] hover:border-emerald-500/40'
              }`}
            >
              <Crown className="h-3.5 w-3.5" />
              <span className="uppercase font-extrabold">
                {currentUser?.subscription?.planTier === 'elite'
                  ? 'Elite Tier'
                  : currentUser?.subscription?.isPro ||
                    currentUser?.subscription?.planTier?.startsWith('pro')
                  ? 'Pro Tier'
                  : 'Free Tier'}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold underline ml-1">
                {currentUser?.subscription?.isPro ? 'Manage' : 'Upgrade'}
              </span>
            </button>
          </div>
        </div>

        {/* Current Streak & Quick Stat */}
        <div className="flex items-center gap-4 bg-[#0e1217]/80 rounded-xl p-3 border border-[#273241] shrink-0 self-start md:self-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tabular-nums">
              {streak} <span className="text-xs font-medium text-slate-400">Days</span>
            </div>
            <div className="text-[11px] font-medium text-slate-400">
              Active Workout Streak
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Consultant & Admin Direct Contact Strip */}
      <section className="rounded-2xl bg-gradient-to-r from-[#151d28] via-[#182230] to-[#131b26] p-5 border border-emerald-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Direct Consultant & Admin Support
              </h3>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                Live Hotline
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Have questions about your pain, biomechanics, or routine? Reach our clinical consultant directly.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs">
              <a
                href={`tel:${CONSULTANT_CONTACT.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 text-emerald-400 font-bold hover:underline"
              >
                <Phone className="h-3 w-3" />
                <span>Call: {CONSULTANT_CONTACT.phone}</span>
              </a>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <a
                href={`mailto:${CONSULTANT_CONTACT.email}`}
                className="flex items-center gap-1.5 text-cyan-400 font-medium hover:underline"
              >
                <Mail className="h-3 w-3" />
                <span>Email: {CONSULTANT_CONTACT.email}</span>
              </a>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="text-slate-400 text-[11px]">
                {CONSULTANT_CONTACT.availableHours}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <a
            href={`tel:${CONSULTANT_CONTACT.phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition-all"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Call Now</span>
          </a>
          <button
            onClick={() => setIsConsultationOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Book Consultation</span>
          </button>
        </div>
      </section>

      {/* Main 2-Column Split: Today's Workout Hero & Daily Vitalls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Today's Workout Plan Hero Card (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-[#141a22] border border-[#252f3d] overflow-hidden shadow-sm relative group">
          <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
            <img
              src={ASSETS.heroWorkout}
              alt="Today's Workout Preview"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141a22] via-[#141a22]/60 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
              <span className="rounded-md bg-emerald-500/20 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                Recommended For Today
              </span>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                <span>{recommendedProgram.durationWeeks} Weeks</span>
                <span aria-hidden="true">·</span>
                <span>{recommendedProgram.daysPerWeek} Days/Wk</span>
              </div>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {recommendedProgram.title}
              </h2>
              <p className="mt-1 text-xs font-medium text-emerald-400">
                {recommendedProgram.subtitle}
              </p>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed line-clamp-2">
                {recommendedProgram.description}
              </p>
            </div>

            {/* Exercise preview list */}
            <div className="space-y-1.5 pt-2 border-t border-[#232b36]">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Planned Exercises ({recommendedProgram.exercises.length})
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                {recommendedProgram.exercises.slice(0, 4).map((ex, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#1d2531] px-2.5 py-1 border border-[#2d3847]"
                  >
                    <Dumbbell className="h-3 w-3 text-emerald-400" />
                    <span>Exercise #{idx + 1}</span>
                    <span className="text-slate-400 tabular-nums">({ex.sets} sets)</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => startWorkout(recommendedProgram)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 px-5 text-sm font-bold text-slate-950 hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-md shadow-emerald-500/20"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Start Today's Workout</span>
              </button>
              <button
                onClick={() => setCurrentView('workouts')}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#2d3847] bg-[#1a212c] py-3 px-4 text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#202936] transition-colors"
              >
                <span>Browse All Plans</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Weekly Consistency & Water & Weight (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Weekly Consistency Tracker */}
          <section className="rounded-2xl bg-[#141a22] p-5 border border-[#252f3d] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Weekly Consistency</h3>
              </div>
              <span className="text-xs text-slate-400">Past 7 Days</span>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {past7Days.map((d, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                    d.isToday
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-[#222a36] bg-[#1a212b]'
                  }`}
                >
                  <span className="text-[11px] font-medium text-slate-400">{d.dayName}</span>
                  <span className="text-sm font-bold text-white tabular-nums my-1">{d.dateNum}</span>
                  {d.isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-600 bg-slate-800/40" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Interactive Water Intake Card */}
          <section className="rounded-2xl bg-[#141a22] p-5 border border-[#252f3d] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Hydration Tracker</h3>
              </div>
              <div className="text-xs text-slate-400">
                Target:{' '}
                <span className="text-slate-200 font-bold tabular-nums">
                  {targetWater.toLocaleString()} ml
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-2xl font-black text-white tabular-nums">
                  {todayWaterAmount.toLocaleString()}{' '}
                  <span className="text-xs font-semibold text-slate-400">ml</span>
                </div>
                <div className="text-xs text-cyan-400 font-medium">
                  {waterPercent}% of daily goal
                </div>
              </div>

              {/* Quick Add Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => logWater(250)}
                  className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all"
                  aria-label="Add 250ml water"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>250ml</span>
                </button>
                <button
                  onClick={() => logWater(500)}
                  className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all"
                  aria-label="Add 500ml water"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>500ml</span>
                </button>
                <button
                  onClick={resetWater}
                  className="rounded-lg border border-[#2d3542] p-2 text-slate-400 hover:text-white transition-colors"
                  aria-label="Reset today water"
                  title="Reset daily water"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Visual water progress bar */}
            <div className="mt-3 h-2 w-full rounded-full bg-[#1e2632] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </section>

          {/* Current Weight & Body Metric Snippet */}
          <section className="rounded-2xl bg-[#141a22] p-5 border border-[#252f3d] shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">Body Weight</h3>
              </div>
              <div className="mt-1 text-2xl font-black text-white tabular-nums">
                {latestWeight}{' '}
                <span className="text-xs font-semibold text-slate-400">kg</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className={weightDiff <= 0 ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                  {weightDiff > 0 ? `+${weightDiff}` : `${weightDiff}`} kg
                </span>
                <span>overall trend</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('progress')}
              className="rounded-xl border border-[#2f3948] bg-[#1a212c] px-4 py-2.5 text-xs font-bold text-slate-200 hover:border-emerald-500/50 hover:text-white transition-all flex items-center gap-1.5"
            >
              <span>View Progress</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </section>
        </div>
      </div>

      {/* Secondary Row: Mobility Suggestion & Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Daily Physiotherapy Mobility Spotlight (6 Cols) */}
        <section className="md:col-span-6 rounded-2xl bg-[#141a22] p-6 border border-[#252f3d] flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Daily Mobility Suggestion</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {dailyMobility.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {dailyMobility.description}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 shrink-0">
              {dailyMobility.durationMin} Min
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#232b36]">
            <span className="text-xs text-slate-400">
              Focus: <span className="text-slate-200 font-medium">{dailyMobility.targetArea}</span>
            </span>
            <button
              onClick={() => setCurrentView('physio')}
              className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Start Mobility Routine</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        {/* Nutrition Target Spotlight & Quick Meal Log CTA (6 Cols) */}
        <section className="md:col-span-6 rounded-2xl bg-[#141a22] p-6 border border-[#252f3d] flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Activity className="h-3.5 w-3.5" />
                <span>Personalized Daily Nutrition Plan</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Target: {targetNutrition.calories.toLocaleString()} kcal
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                <span>
                  Protein: <strong className="text-emerald-400 tabular-nums">{targetNutrition.proteinGrams}g</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Carbs: <strong className="text-cyan-400 tabular-nums">{targetNutrition.carbsGrams}g</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Fats: <strong className="text-amber-400 tabular-nums">{targetNutrition.fatGrams}g</strong>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Goal:</span>
              <div className="text-xs font-bold text-white capitalize">
                {currentUser?.fitnessGoal.replace('_', ' ') || 'General Fitness'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#232b36]">
            <span className="text-xs text-slate-400">
              Diet:{' '}
              <span className="text-slate-200 font-medium capitalize">
                {currentUser?.dietaryPreference || 'Vegetarian'} (Indian Cuisine)
              </span>
            </span>
            <button
              onClick={() => setCurrentView('nutrition')}
              className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Log Meals</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      </div>

      {/* Direct Consultant Booking & Helpline Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  );
};
