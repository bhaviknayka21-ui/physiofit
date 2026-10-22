import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  AlertOctagon,
  BookOpen,
  Play,
  Clock,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  X,
  RotateCcw,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MobilityRoutine, MobilityStep } from '../types';
import { ASSETS } from '../data/seedData';

export const PhysioMobilityView: React.FC = () => {
  const { mobilityRoutines, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<
    'all' | 'warmup' | 'posture_education' | 'general_mobility' | 'rehab_guidance'
  >('all');

  const [activeRoutineModal, setActiveRoutineModal] = useState<MobilityRoutine | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [routineTimer, setRoutineTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const filteredRoutines = mobilityRoutines.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'warmup') return r.category === 'warmup' || r.category === 'cooldown';
    return r.category === activeTab;
  });

  const startRoutineSession = (routine: MobilityRoutine) => {
    setActiveRoutineModal(routine);
    setCurrentStepIndex(0);
    setRoutineTimer(45);
    setIsTimerRunning(false);
  };

  // Educational Articles / Guides
  const educationalGuides = [
    {
      title: 'Biomechanics: The Hip Hinge vs. Lumbar Flexion',
      category: 'Spine Mechanics',
      readTime: '4 min',
      summary:
        'Why deadlifts and picking heavy groceries up must pivot at the femoroacetabular joints (hips) rather than through lumbar vertebrae. Learn the dowel test to verify 3-point spinal neutral.',
      keyTakeaways: [
        'The lumbar spine is designed for stiffness and load transfer, not high-range flexion under shear stress.',
        'Push the pelvis backward to initiate hip loading while keeping lats locked tight to suppress lumbar flexion.',
      ],
    },
    {
      title: 'Ergonomics: Overcoming Prolonged Sitting Stasis',
      category: 'Desk Workers',
      readTime: '3 min',
      summary:
        'Static flexion postures cause hip flexor shortening, gluteal amnesia, and forward head translation. Simple micro-breaks every 45 minutes prevent tendon creep and synovial drying.',
      keyTakeaways: [
        'Set an hourly mobility break timer to stand, extend hips, and retract shoulder blades.',
        'Position monitor top edge at eye level to prevent excessive cervical shear load.',
      ],
    },
    {
      title: 'Injury Prevention: The Acute-to-Chronic Workload Ratio',
      category: 'Programming Science',
      readTime: '5 min',
      summary:
        'Tendon and joint injuries rarely happen from one bad lift; they occur when weekly workload surges faster than connective tissue can adapt. The 10% volume progression rule.',
      keyTakeaways: [
        'Never increase both weight and total weekly sets simultaneously on major lifts.',
        'Joint connective tissue takes 3x longer to remodel than muscle contractile tissue.',
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#121922] via-[#15202c] to-[#121820] p-6 border border-[#233040] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Activity className="h-4 w-4" />
            <span>PHYSIOTHERAPY & MOVEMENT SCIENCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Mobility, Posture & Injury Prevention
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Move pain-free with clinician-informed mobility protocols, joint decompression,
            ergonomic posture education, and safe lifting biomechanics.
          </p>
        </div>

        <div className="shrink-0 hidden lg:block">
          <img
            src={ASSETS.physioMobility}
            alt="Physiotherapy Mobility Flow"
            referrerPolicy="no-referrer"
            className="h-28 w-44 rounded-xl object-cover border border-[#2e3e52] shadow-md"
          />
        </div>
      </div>

      {/* Prominent Mandatory Clinical Disclaimer */}
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 sm:p-5 flex items-start gap-3.5">
        <AlertOctagon className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-200/95 leading-relaxed">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Medical Disclaimer & Clinical Precaution
          </h3>
          <p>
            The educational content, mobility drills, and exercises contained in PhysioFit are
            designed for general wellness and fitness enhancement. They do not constitute medical
            diagnosis, treatment, or individualized clinical advice. PhysioFit does not automatically
            prescribe rehabilitation for undiagnosed injuries. If you experience severe, persistent,
            or radiating pain, joint instability, or post-traumatic swelling, seek evaluation from a
            licensed medical physician or registered physiotherapist immediately.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-[#222a36] pb-1 overflow-x-auto">
        {[
          { id: 'all', label: 'All Routines' },
          { id: 'posture_education', label: 'Posture & Spine' },
          { id: 'general_mobility', label: 'Hip & Joint Mobility' },
          { id: 'warmup', label: 'Warm-Ups & Cool-Downs' },
          { id: 'rehab_guidance', label: 'Clinician Rehab Guidance' },
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

      {/* Routines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutines.map((routine) => (
          <div
            key={routine.id}
            className={`flex flex-col justify-between rounded-2xl bg-[#141a22] border overflow-hidden shadow-sm transition-all group ${
              routine.clinicianPrescribedOnly
                ? 'border-cyan-500/30 hover:border-cyan-500/60'
                : 'border-[#252f3d] hover:border-emerald-500/40'
            }`}
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                {routine.clinicianPrescribedOnly ? (
                  <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Stethoscope className="h-3 w-3" />
                    Clinician Protocol
                  </span>
                ) : (
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                    {routine.category.replace('_', ' ')}
                  </span>
                )}
                <span className="text-slate-400 tabular-nums flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {routine.durationMin} Mins
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {routine.title}
              </h3>

              <div className="text-xs text-slate-400">
                Focus Area: <strong className="text-slate-200">{routine.targetArea}</strong>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {routine.description}
              </p>

              {/* Steps overview */}
              <div className="pt-2 border-t border-[#232b36] space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400">
                  Protocol Steps ({routine.steps.length}):
                </div>
                <ul className="text-xs text-slate-300 space-y-1">
                  {routine.steps.map((st, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span className="truncate max-w-[200px]">• {st.name}</span>
                      <span className="text-slate-400 text-[11px]">{st.durationOrReps}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Precaution note */}
              {routine.precautions && (
                <div className="rounded-lg bg-[#18202b] p-2.5 text-[11px] text-slate-300 border border-[#273342]">
                  <span className="text-amber-400 font-bold">Caution: </span>
                  {routine.precautions}
                </div>
              )}
            </div>

            <div className="p-4 bg-[#11161d] border-t border-[#232b36]">
              <button
                onClick={() => startRoutineSession(routine)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 px-4 text-xs font-bold text-slate-950 hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/15"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Start Guided Routine</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Movement Education & Biomechanics Library */}
      <section className="space-y-4 pt-4 border-t border-[#232b36]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Evidence-Based Movement Education
            </h2>
            <p className="text-xs text-slate-400">
              Understanding posture, joint kinematics, and injury prevention fundamentals.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <BookOpen className="h-4 w-4" />
            <span>Clinical Knowledge Base</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {educationalGuides.map((guide, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#141a22] p-5 border border-[#252f3d] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-emerald-400">{guide.category}</span>
                  <span>{guide.readTime} read</span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">{guide.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{guide.summary}</p>
              </div>

              <div className="pt-3 border-t border-[#232b36] space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Clinical Pearls
                </div>
                <ul className="text-xs text-slate-300 space-y-1">
                  {guide.keyTakeaways.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Guided Mobility Routine Follow-Along Modal */}
      {activeRoutineModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-xl rounded-2xl bg-[#12161c] border border-[#273241] p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-[#232b36] pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  GUIDED MOBILITY SESSION · STEP {currentStepIndex + 1} OF{' '}
                  {activeRoutineModal.steps.length}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {activeRoutineModal.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveRoutineModal(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white border border-[#2c3746]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Current Step Showcase */}
            {(() => {
              const step = activeRoutineModal.steps[currentStepIndex];
              return (
                <div className="rounded-xl bg-[#161d26] p-5 border border-[#263140] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white">{step.name}</h3>
                    <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 tabular-nums">
                      {step.durationOrReps}
                    </span>
                  </div>

                  <div className="rounded-lg bg-[#1a232f] p-3 text-xs text-slate-200 border border-[#2a3747] space-y-1">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      Physiotherapy Biomechanical Cues:
                    </div>
                    <p className="leading-relaxed">{step.cues}</p>
                  </div>
                </div>
              );
            })()}

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                className="rounded-xl border border-[#2d3848] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous Step
              </button>

              {currentStepIndex < activeRoutineModal.steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  <span>Next Step</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveRoutineModal(null);
                    showToast('Guided routine completed! Great work for your joint longevity.');
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Complete Routine</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
