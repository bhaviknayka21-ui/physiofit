import React from 'react';
import {
  X,
  Play,
  CheckCircle2,
  Timer,
  Plus,
  ArrowRight,
  ArrowLeft,
  Flame,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ActiveWorkoutModal: React.FC = () => {
  const {
    activeWorkout,
    updateActiveSet,
    startRestTimer,
    stopRestTimer,
    addRestTime,
    nextExercise,
    prevExercise,
    cancelWorkout,
    finishWorkout,
    exercises,
  } = useApp();

  if (!activeWorkout) return null;

  const currentExercise = activeWorkout.exercises[activeWorkout.currentExerciseIndex];
  const currentDef = exercises.find((e) => e.id === currentExercise.exerciseId);

  // Calculate session volume so far
  const totalVolume = activeWorkout.exercises.reduce((sum, ex) => {
    return (
      sum +
      ex.sets.reduce((setSum, s) => {
        return setSum + (s.completed && s.weightKg > 0 ? s.reps * s.weightKg : 0);
      }, 0)
    );
  }, 0);

  const completedSetsCount = activeWorkout.exercises.reduce((count, ex) => {
    return count + ex.sets.filter((s) => s.completed).length;
  }, 0);

  const totalSetsCount = activeWorkout.exercises.reduce((count, ex) => count + ex.sets.length, 0);
  const progressPercent = Math.round((completedSetsCount / (totalSetsCount || 1)) * 100);

  const isLastExercise =
    activeWorkout.currentExerciseIndex === activeWorkout.exercises.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Active Workout Player"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#12161c] border border-[#273241] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#242c38] px-5 py-4 bg-[#161c24]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE WORKOUT SESSION</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white truncate max-w-md">
              {activeWorkout.programTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={cancelWorkout}
              className="rounded-lg border border-[#2e3745] p-2 text-slate-400 hover:text-white hover:bg-[#202733] transition-colors"
              aria-label="Cancel Workout"
              title="Cancel Workout"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Workout Progress Bar */}
        <div className="h-1.5 w-full bg-[#1b222c]">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Floating Rest Timer Bar (When timer is running) */}
        {activeWorkout.restTimer.active && (
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-950/80 to-slate-900 border-b border-emerald-500/30 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Timer className="h-4 w-4 animate-spin" />
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Rest Timer
                </div>
                <div className="text-xl font-black text-white tabular-nums">
                  {Math.floor(activeWorkout.restTimer.remainingSeconds / 60)}:
                  {String(activeWorkout.restTimer.remainingSeconds % 60).padStart(2, '0')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => addRestTime(30)}
                className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
              >
                +30s
              </button>
              <button
                onClick={stopRestTimer}
                className="rounded-lg border border-[#323d4e] bg-[#1a222d] px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-all"
              >
                Skip Rest
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Workout Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Current Exercise Header */}
          <div className="rounded-xl bg-[#161d26] p-4 border border-[#273241]">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-emerald-400">
                EXERCISE {activeWorkout.currentExerciseIndex + 1} OF{' '}
                {activeWorkout.exercises.length}
              </div>
              <div className="text-xs text-slate-400">
                Target: {currentExercise.targetMuscles.join(', ')}
              </div>
            </div>

            <h3 className="mt-1 text-xl font-extrabold text-white">
              {currentExercise.exerciseName}
            </h3>

            {currentDef?.cues && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {currentDef.cues.map((cue, idx) => (
                  <span
                    key={idx}
                    className="inline-block rounded-md bg-[#1f2835] px-2 py-0.5 text-[11px] text-slate-300 border border-[#2c3848]"
                  >
                    💡 {cue}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sets Table */}
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider">
              <span className="col-span-2">Set</span>
              <span className="col-span-4">Weight (kg)</span>
              <span className="col-span-4">Reps</span>
              <span className="col-span-2 text-right">Done</span>
            </div>

            <div className="space-y-2">
              {currentExercise.sets.map((set, setIndex) => (
                <div
                  key={set.setNumber}
                  className={`grid grid-cols-12 gap-2 items-center rounded-xl p-3 border transition-colors ${
                    set.completed
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-[#263140] bg-[#161c24]'
                  }`}
                >
                  <span className="col-span-2 text-sm font-bold text-white tabular-nums">
                    #{set.setNumber}
                  </span>

                  {/* Weight Input */}
                  <div className="col-span-4 flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={set.weightKg === 0 ? '' : set.weightKg}
                      placeholder="0 (BW)"
                      onChange={(e) =>
                        updateActiveSet(
                          activeWorkout.currentExerciseIndex,
                          setIndex,
                          set.reps,
                          parseFloat(e.target.value) || 0,
                          set.completed
                        )
                      }
                      className="w-full rounded-lg border border-[#2d3848] bg-[#11161d] px-2.5 py-1.5 text-sm font-semibold text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                      aria-label={`Weight in kg for set ${set.setNumber}`}
                    />
                  </div>

                  {/* Reps Input */}
                  <div className="col-span-4 flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      value={set.reps}
                      onChange={(e) =>
                        updateActiveSet(
                          activeWorkout.currentExerciseIndex,
                          setIndex,
                          parseInt(e.target.value) || 0,
                          set.weightKg,
                          set.completed
                        )
                      }
                      className="w-full rounded-lg border border-[#2d3848] bg-[#11161d] px-2.5 py-1.5 text-sm font-semibold text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                      aria-label={`Reps for set ${set.setNumber}`}
                    />
                  </div>

                  {/* Done Toggle */}
                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={() =>
                        updateActiveSet(
                          activeWorkout.currentExerciseIndex,
                          setIndex,
                          set.reps,
                          set.weightKg,
                          !set.completed
                        )
                      }
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                        set.completed
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'border border-[#323d4e] bg-[#1a222d] text-slate-400 hover:text-white'
                      }`}
                      aria-label={`Toggle completion for set ${set.setNumber}`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center justify-between rounded-xl bg-[#161c24] p-3 text-xs text-slate-300 border border-[#263140]">
            <div>
              Total Volume Lifted:{' '}
              <strong className="text-emerald-400 tabular-nums">
                {totalVolume.toLocaleString()} kg
              </strong>
            </div>
            <div>
              Completed Sets:{' '}
              <strong className="text-white tabular-nums">
                {completedSetsCount} / {totalSetsCount}
              </strong>
            </div>
          </div>
        </div>

        {/* Footer Navigation & Finish Actions */}
        <div className="border-t border-[#242c38] p-4 bg-[#141a22] flex items-center justify-between gap-3">
          <button
            onClick={prevExercise}
            disabled={activeWorkout.currentExerciseIndex === 0}
            className="flex items-center gap-1.5 rounded-xl border border-[#2d3848] px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {!isLastExercise ? (
            <button
              onClick={nextExercise}
              className="flex items-center gap-1.5 rounded-xl border border-[#2d3848] bg-[#1a222d] px-4 py-2.5 text-xs font-bold text-slate-200 hover:text-white hover:border-emerald-500/40 transition-colors"
            >
              <span>Next Exercise</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : null}

          <button
            onClick={finishWorkout}
            className="flex-1 max-w-[220px] flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Finish Workout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
