import React, { useState } from 'react';
import {
  Dumbbell,
  Search,
  Filter,
  Play,
  Plus,
  Info,
  Calendar,
  Clock,
  Flame,
  Award,
  ChevronRight,
  X,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Exercise, WorkoutProgram } from '../types';
import { ExerciseTutorialModal } from './ExerciseTutorialModal';

export const WorkoutsView: React.FC = () => {
  const {
    programs,
    exercises,
    startWorkout,
    workoutLogs,
    personalRecords,
    addProgram,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'programs' | 'exercises' | 'history' | 'prs'>(
    'programs'
  );
  const [programFilter, setProgramFilter] = useState<'all' | 'beginner' | 'intermediate' | 'home' | 'gym'>('all');
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [inspectExercise, setInspectExercise] = useState<Exercise | null>(null);

  // Custom Workout Creator modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [customLevel, setCustomLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [customLocation, setCustomLocation] = useState<'home' | 'gym' | 'both'>('both');
  const [customCategory, setCustomCategory] = useState<'strength' | 'cardio' | 'mobility'>('strength');
  const [selectedExercisesForCustom, setSelectedExercisesForCustom] = useState<
    { exerciseId: string; sets: number; reps: string; restSeconds: number }[]
  >([]);

  // Filter programs
  const filteredPrograms = programs.filter((p) => {
    if (programFilter === 'beginner') return p.level === 'beginner';
    if (programFilter === 'intermediate') return p.level === 'intermediate';
    if (programFilter === 'home') return p.location === 'home' || p.location === 'both';
    if (programFilter === 'gym') return p.location === 'gym' || p.location === 'both';
    return true;
  });

  // Unique muscles for filtering
  const allMuscles = Array.from(new Set(exercises.flatMap((e) => e.targetMuscles))).sort();

  // Filter exercises
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.targetMuscles.some((m) => m.toLowerCase().includes(exerciseSearch.toLowerCase()));
    const matchesMuscle =
      selectedMuscle === 'all' || ex.targetMuscles.includes(selectedMuscle);
    return matchesSearch && matchesMuscle;
  });

  const handleSaveCustomProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) {
      showToast('Please enter a routine title');
      return;
    }
    if (selectedExercisesForCustom.length === 0) {
      showToast('Please select at least 1 exercise for the routine');
      return;
    }

    addProgram({
      title: customTitle.trim(),
      subtitle: customSubtitle.trim() || 'Custom User Routine',
      level: customLevel,
      location: customLocation,
      durationWeeks: 4,
      daysPerWeek: 3,
      category: customCategory,
      description: 'Customized training plan tailored to individual fitness preferences and available gear.',
      exercises: selectedExercisesForCustom,
      tags: ['Custom Routine', customLevel, customLocation],
    });

    setShowCreateModal(false);
    setCustomTitle('');
    setCustomSubtitle('');
    setSelectedExercisesForCustom([]);
  };

  const toggleSelectExerciseForCustom = (exId: string) => {
    const exists = selectedExercisesForCustom.some((i) => i.exerciseId === exId);
    if (exists) {
      setSelectedExercisesForCustom((prev) => prev.filter((i) => i.exerciseId !== exId));
    } else {
      setSelectedExercisesForCustom((prev) => [
        ...prev,
        { exerciseId: exId, sets: 3, reps: '10-12', restSeconds: 60 },
      ]);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header and Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232b36] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Workout Planner & Library
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Intelligent exercise library, structured starter programs, live set tracker, and PR logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/15"
          >
            <Plus className="h-4 w-4" />
            <span>Create Custom Workout</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#222a36] pb-1 overflow-x-auto">
        {[
          { id: 'programs', label: 'Workout Programs' },
          { id: 'exercises', label: `Exercise Library (${exercises.length})` },
          { id: 'history', label: `Workout History (${workoutLogs.length})` },
          { id: 'prs', label: `Personal Records (${personalRecords.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-[#1a212b]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Important Medical / Clinical Disclaimer */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/90 leading-relaxed">
          <strong className="font-semibold text-amber-300">Physiotherapy Notice:</strong> Workout
          plans provided are evidence-informed starter templates. No single workout routine fits all
          bodies identically. Always begin with a warm-up, scale resistance to your current biomechanics,
          and pause if you experience joint discomfort or sharp pain.
        </p>
      </div>

      {/* TAB 1: WORKOUT PROGRAMS */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-400">Filter:</span>
            {[
              { id: 'all', label: 'All Programs' },
              { id: 'beginner', label: 'Beginner' },
              { id: 'intermediate', label: 'Intermediate' },
              { id: 'home', label: 'Home Routines' },
              { id: 'gym', label: 'Gym Routines' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setProgramFilter(f.id as typeof programFilter)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  programFilter === f.id
                    ? 'bg-slate-200 text-slate-900 shadow-sm'
                    : 'border border-[#2d3848] bg-[#141b24] text-slate-300 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="flex flex-col justify-between rounded-2xl bg-[#141a22] border border-[#252f3d] overflow-hidden hover:border-emerald-500/40 transition-all shadow-sm group"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[10px]">
                      {prog.level} · {prog.location}
                    </span>
                    <span>{prog.daysPerWeek} Days / Week</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {prog.description}
                  </p>

                  <div className="pt-2 border-t border-[#232b36] space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400">
                      Routine Structure ({prog.exercises.length} exercises):
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {prog.exercises.slice(0, 4).map((pe, idx) => {
                        const exDef = exercises.find((e) => e.id === pe.exerciseId);
                        return (
                          <li key={idx} className="flex items-center justify-between">
                            <span className="truncate max-w-[180px]">
                              • {exDef?.name || 'Exercise'}
                            </span>
                            <span className="text-slate-400 tabular-nums">
                              {pe.sets} × {pe.reps}
                            </span>
                          </li>
                        );
                      })}
                      {prog.exercises.length > 4 && (
                        <li className="text-[11px] text-slate-400">
                          + {prog.exercises.length - 4} more exercises
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-[#11161d] border-t border-[#232b36]">
                  <button
                    onClick={() => startWorkout(prog)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 px-4 text-xs font-bold text-slate-950 hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/15"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Start Workout Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EXERCISE LIBRARY */}
      {activeTab === 'exercises' && (
        <div className="space-y-6">
          {/* Search and Muscle Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder="Search exercises by name or target muscle..."
                className="w-full rounded-xl border border-[#283241] bg-[#141a22] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                className="rounded-xl border border-[#283241] bg-[#141a22] px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">All Muscles ({exercises.length})</option>
                {allMuscles.map((muscle) => (
                  <option key={muscle} value={muscle}>
                    {muscle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Exercise Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => setInspectExercise(ex)}
                className="cursor-pointer rounded-2xl bg-[#141a22] p-5 border border-[#252f3d] hover:border-emerald-500/50 hover:bg-[#171f2a] transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-emerald-400 capitalize">
                      {ex.category} · {ex.difficulty}
                    </span>
                    <span className="capitalize">{ex.location}</span>
                  </div>

                  <h3 className="mt-1 text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {ex.name}
                  </h3>

                  <div className="mt-2 text-xs text-slate-400">
                    Targets:{' '}
                    <span className="text-slate-200 font-medium">
                      {ex.targetMuscles.join(', ')}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {ex.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#232b36] flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>View Technique & Safety</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WORKOUT HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {workoutLogs.length === 0 ? (
            <div className="rounded-2xl bg-[#141a22] p-12 text-center border border-[#252f3d] space-y-3">
              <Dumbbell className="h-8 w-8 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Completed Workouts Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Select any program or start an active session to log your completed sets and volume.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {workoutLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-2xl bg-[#141a22] p-5 border border-[#252f3d] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232b36] pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{log.programName}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{log.date}</span>
                        <span aria-hidden="true">·</span>
                        <Clock className="h-3.5 w-3.5" />
                        <span>{log.durationMinutes} min</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20 text-xs font-bold text-emerald-400 tabular-nums">
                        {log.volumeKg.toLocaleString()} kg Total Volume
                      </div>
                    </div>
                  </div>

                  {log.notes && (
                    <p className="text-xs text-slate-300 italic bg-[#171e28] p-2.5 rounded-lg border border-[#273241]">
                      "{log.notes}"
                    </p>
                  )}

                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Completed Exercises ({log.exercisesCompleted.length}):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {log.exercisesCompleted.map((ex, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl bg-[#171e28] p-3 text-xs text-slate-200 border border-[#252f3d]"
                        >
                          <div className="font-bold text-white">{ex.exerciseName}</div>
                          <div className="text-slate-400 text-[11px] mt-1">
                            {ex.sets.filter((s) => s.completed).length} completed sets ·{' '}
                            {ex.sets
                              .filter((s) => s.completed)
                              .map((s) => `${s.weightKg}kg × ${s.reps}`)
                              .join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PERSONAL RECORDS (PRs) */}
      {activeTab === 'prs' && (
        <div className="space-y-4">
          {personalRecords.length === 0 ? (
            <div className="rounded-2xl bg-[#141a22] p-12 text-center border border-[#252f3d] space-y-3">
              <Award className="h-8 w-8 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Personal Records Logged Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                As you complete weighted exercises in active workouts, your maximum lifts and
                estimated 1-rep maximums will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalRecords.map((pr) => (
                <div
                  key={pr.id}
                  className="rounded-2xl bg-[#141a22] p-5 border border-[#252f3d] space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400">Personal Record</span>
                    <span className="text-[11px] text-slate-400">{pr.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{pr.exerciseName}</h3>

                  <div className="pt-2 flex items-baseline justify-between border-t border-[#232b36]">
                    <div>
                      <div className="text-2xl font-black text-white tabular-nums">
                        {pr.weightKg} <span className="text-xs font-medium text-slate-400">kg</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{pr.reps} Reps Logged</div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400 tabular-nums">
                        {pr.estimated1RM} kg
                      </div>
                      <div className="text-[10px] text-slate-400">Est. 1RM (Epley)</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Exercise Detail / Tutorial Modal with Interactive D3 Anatomy */}
      <ExerciseTutorialModal
        exercise={inspectExercise}
        onClose={() => setInspectExercise(null)}
      />

      {/* Create Custom Workout Modal */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#131821] border border-[#283241] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#252f3d] pb-3">
              <h2 className="text-lg font-bold text-white">Create Custom Workout Routine</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white border border-[#2d3848]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomProgram} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Routine Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Upper Body Hypertrophy & Posture"
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subtitle / Focus
                  </label>
                  <input
                    type="text"
                    value={customSubtitle}
                    onChange={(e) => setCustomSubtitle(e.target.value)}
                    placeholder="e.g. 45 Mins · Strength & Joint Stability"
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Level</label>
                  <select
                    value={customLevel}
                    onChange={(e) => setCustomLevel(e.target.value as typeof customLevel)}
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <select
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value as typeof customLocation)}
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="home">Home</option>
                    <option value="gym">Gym</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as typeof customCategory)}
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="mobility">Mobility</option>
                  </select>
                </div>
              </div>

              {/* Select Exercises Checklist */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select Exercises ({selectedExercisesForCustom.length} chosen) *
                </label>
                <div className="max-h-56 overflow-y-auto space-y-1.5 rounded-xl border border-[#283241] bg-[#161d26] p-2.5">
                  {exercises.map((ex) => {
                    const isSelected = selectedExercisesForCustom.some(
                      (item) => item.exerciseId === ex.id
                    );
                    return (
                      <div
                        key={ex.id}
                        onClick={() => toggleSelectExerciseForCustom(ex.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-white'
                            : 'hover:bg-[#1e2735] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <div
                            className={`h-4 w-4 rounded flex items-center justify-center border ${
                              isSelected
                                ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                                : 'border-[#364254]'
                            }`}
                          >
                            {isSelected && <CheckCircle className="h-3.5 w-3.5" />}
                          </div>
                          <span className="font-semibold">{ex.name}</span>
                          <span className="text-slate-400 text-[11px]">
                            ({ex.targetMuscles.join(', ')})
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{ex.defaultSets} sets</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#252f3d]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-[#2d3848] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
