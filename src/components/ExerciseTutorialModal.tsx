import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Wind,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Youtube,
  BookOpen,
  Info,
} from 'lucide-react';
import { Exercise } from '../types';
import { InteractiveMuscleAnatomy } from './InteractiveMuscleAnatomy';
import { useApp } from '../context/AppContext';

interface ExerciseTutorialModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export const ExerciseTutorialModal: React.FC<ExerciseTutorialModalProps> = ({
  exercise,
  onClose,
}) => {
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'anatomy' | 'video' | 'breathing' | 'technique'>('anatomy');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBreathingTimerActive, setIsBreathingTimerActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'brace' | 'exhale'>('inhale');
  const [breathingSeconds, setBreathingSeconds] = useState(0);

  // Sync favorites with localStorage
  useEffect(() => {
    if (!exercise) return;
    const favs = JSON.parse(localStorage.getItem('physiofit_favorite_exercises') || '[]');
    setIsFavorite(favs.includes(exercise.id));
  }, [exercise]);

  const toggleFavorite = () => {
    if (!exercise) return;
    const favs: string[] = JSON.parse(localStorage.getItem('physiofit_favorite_exercises') || '[]');
    let updated: string[];
    if (favs.includes(exercise.id)) {
      updated = favs.filter((id) => id !== exercise.id);
      setIsFavorite(false);
      showToast(`Removed "${exercise.name}" from favorites`);
    } else {
      updated = [...favs, exercise.id];
      setIsFavorite(true);
      showToast(`Saved "${exercise.name}" to favorites!`);
    }
    localStorage.setItem('physiofit_favorite_exercises', JSON.stringify(updated));
  };

  // Breathing Guide Timer Loop (Tempo pacing)
  useEffect(() => {
    if (!isBreathingTimerActive) {
      setBreathingSeconds(0);
      setBreathingPhase('inhale');
      return;
    }

    const interval = setInterval(() => {
      setBreathingSeconds((prev) => {
        const next = (prev + 1) % 6; // 6-second cadence: 3s Inhale, 1s Brace, 2s Exhale
        if (next < 3) {
          setBreathingPhase('inhale');
        } else if (next === 3) {
          setBreathingPhase('brace');
        } else {
          setBreathingPhase('exhale');
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingTimerActive]);

  if (!exercise) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#11161f] border border-[#263142] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto p-4 sm:p-6 text-white">
        {/* Header Strip */}
        <div className="flex items-start justify-between gap-3 border-b border-[#202937] pb-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5">
                {exercise.category} · {exercise.difficulty}
              </span>
              <span className="text-[10px] text-slate-400 rounded-md bg-[#19212c] border border-[#2b3749] px-2 py-0.5">
                {exercise.equipment.join(', ') || 'Bodyweight'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {exercise.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFavorite}
              className={`rounded-xl border p-2 transition-all ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#18202b] text-slate-400 border-[#2b3749] hover:text-white'
              }`}
              title={isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
              aria-label="Toggle favorite"
            >
              <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#2b3749] bg-[#18202b] p-2 text-slate-400 hover:text-white hover:bg-[#202b3a] transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#1f2837] scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('anatomy')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'anatomy'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-[#161d27] text-slate-300 hover:text-white border border-[#242e3f]'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Interactive D3 Anatomy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'video'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-[#161d27] text-slate-300 hover:text-white border border-[#242e3f]'
            }`}
          >
            <Youtube className="h-3.5 w-3.5" />
            <span>Video Tutorial & Setup</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('breathing')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'breathing'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-[#161d27] text-slate-300 hover:text-white border border-[#242e3f]'
            }`}
          >
            <Wind className="h-3.5 w-3.5" />
            <span>Breathing & Cadence</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('technique')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'technique'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-[#161d27] text-slate-300 hover:text-white border border-[#242e3f]'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Form Cues & Safety</span>
          </button>
        </div>

        {/* Tab 1: Interactive D3 Muscle Anatomy Overlay */}
        {activeTab === 'anatomy' && (
          <div className="space-y-4">
            <InteractiveMuscleAnatomy exercise={exercise} />

            {/* Quick Summary Strip */}
            <div className="rounded-xl bg-[#141b24] p-3 border border-[#222c3c] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="text-slate-300">
                <span className="font-semibold text-white">Recommended Loading: </span>
                <span>
                  {exercise.defaultSets} sets × {exercise.defaultReps} reps · Rest {exercise.defaultRestSeconds}s
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('video')}
                className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Watch full movement video</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: High-Quality Video Tutorial & Step-by-Step Execution */}
        {activeTab === 'video' && (
          <div className="space-y-4">
            {/* Embedded Responsive YouTube Video Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#2b3749] bg-black shadow-lg">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${exercise.youtubeVideoId}?rel=0&modestbranding=1`}
                title={`${exercise.name} Tutorial Demonstration`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Step-by-Step Movement Phases */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <span>3-Phase Biomechanical Execution</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Starting Position */}
                <div className="rounded-xl bg-[#151c27] p-3.5 border border-[#253142] space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Phase 1: Setup & Starting
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {exercise.setupPosition?.starting ||
                      'Position body with stable base of support, neutral spinal alignment, and joint stacking.'}
                  </p>
                </div>

                {/* Movement Initiation & Execution */}
                <div className="rounded-xl bg-[#151c27] p-3.5 border border-[#253142] space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Phase 2: Execution & Eccentric
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {exercise.setupPosition?.execution ||
                      'Initiate movement through primary joint fulcrum maintaining constant time under tension.'}
                  </p>
                </div>

                {/* Lockout & Controlled Reset */}
                <div className="rounded-xl bg-[#151c27] p-3.5 border border-[#253142] space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Phase 3: Concentric Lockout
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {exercise.setupPosition?.lockout ||
                      'Finish rep with terminal joint stabilization and peak agonist contraction without hyperextension.'}
                  </p>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={exercise.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#2b3648] bg-[#161d27] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <Youtube className="h-3.5 w-3.5 text-rose-500" />
                <span>Open in YouTube App</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
              {exercise.biomechanicsUrl && (
                <a
                  href={exercise.biomechanicsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#2b3648] bg-[#161d27] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <Activity className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Google Anatomy & Biomechanics Resource</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Breathing & Cadence Guide */}
        {activeTab === 'breathing' && (
          <div className="space-y-4">
            {/* Interactive Breathing Rhythm Gauge */}
            <div className="rounded-2xl bg-[#141b25] p-5 border border-[#253040] flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Diaphragmatic Cadence Trainer
              </span>

              {/* Animated Pulsing Circle */}
              <div className="relative flex items-center justify-center">
                <div
                  className={`h-28 w-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-700 ${
                    breathingPhase === 'inhale'
                      ? 'border-emerald-400 scale-110 bg-emerald-500/15 shadow-xl shadow-emerald-500/30'
                      : breathingPhase === 'brace'
                      ? 'border-amber-400 scale-105 bg-amber-500/15 shadow-xl shadow-amber-500/30'
                      : 'border-cyan-400 scale-95 bg-cyan-500/15 shadow-xl shadow-cyan-500/30'
                  }`}
                >
                  <Wind className="h-6 w-6 text-white mb-1" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {breathingPhase === 'inhale' && 'Inhale'}
                    {breathingPhase === 'brace' && 'Brace'}
                    {breathingPhase === 'exhale' && 'Exhale'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  Tempo: {exercise.breathing?.tempo || '2-0-1-0'} (
                  {exercise.breathing?.cadenceDescription || 'Controlled eccentric · Power concentric'})
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Synchronize intra-abdominal pressure (IAP) with movement phases to protect spinal vertebrae and maximize power output.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsBreathingTimerActive(!isBreathingTimerActive)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-md ${
                  isBreathingTimerActive
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                }`}
              >
                {isBreathingTimerActive ? 'Stop Breathing Cadence' : 'Start Paced Breathing Rhythm'}
              </button>
            </div>

            {/* Inhale vs Exhale Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-[#161d26] p-3.5 border border-[#273243] space-y-1.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Inhale Phase (Eccentric Lowering)</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {exercise.breathing?.inhalePhase ||
                    'Inhale deeply into lower ribcage expanding 360 degrees as weight lowers.'}
                </p>
              </div>

              <div className="rounded-xl bg-[#161d26] p-3.5 border border-[#273243] space-y-1.5">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span>Exhale Phase (Concentric Press/Pull)</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {exercise.breathing?.exhalePhase ||
                    'Exhale smoothly through pursed lips past the sticking point of movement.'}
                </p>
              </div>
            </div>

            {/* Valsalva & Core Brace Notice */}
            {exercise.breathing?.valsalvaNotice && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 flex items-start gap-2.5 text-xs">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">Intra-Abdominal Stabilization Notice:</span>
                  <p className="text-amber-100/90 mt-0.5 leading-relaxed">
                    {exercise.breathing.valsalvaNotice}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Physiotherapist Form Cues & Safety */}
        {activeTab === 'technique' && (
          <div className="space-y-4">
            {/* Correct Form vs Common Mistakes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Correct Form Cues */}
              <div className="rounded-xl bg-[#141c26] p-4 border border-emerald-500/30 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Correct Technique & Form Cues</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {exercise.cues.map((cue, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✔</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Form Mistakes to Avoid */}
              <div className="rounded-xl bg-[#1a161b] p-4 border border-rose-500/30 space-y-2">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <X className="h-4 w-4" />
                  <span>Common Mistakes to Avoid</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {exercise.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">✖</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Safety & Joint Precautions */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" />
                <span>Clinical Joint & Spinal Safety Guidance</span>
              </h4>
              <ul className="space-y-1 text-xs text-amber-100/90">
                {exercise.safetyInstructions.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
              <p className="text-[11px] text-amber-200/70 pt-1 border-t border-amber-500/20">
                Note: If experiencing acute or sharp joint pain, discontinue immediately and consult our clinical consultant team.
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1f2837]">
          <span className="text-xs text-slate-400">
            PhysioFit Movement Sciences · <span className="text-emerald-400 font-semibold">“Train Smart. Move Better.”</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#1c2432] px-5 py-2 text-xs font-bold text-white hover:bg-[#253041] transition-colors"
          >
            Close Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};
