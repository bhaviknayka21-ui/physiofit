import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Activity,
  Info,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Exercise } from '../types';

interface MuscleDefinition {
  id: string;
  name: string;
  commonName: string;
  view: 'anterior' | 'posterior' | 'both';
  keywords: string[];
  biomechanicsRole: string;
  side?: 'left' | 'right' | 'center';
  pathD: string;
}

// Precision SVG Anatomical Paths (Viewbox: 0 0 280 420)
// Scaled and centered for clear mobile and desktop viewing
const ANTERIOR_MUSCLES: MuscleDefinition[] = [
  // Shoulders (Anterior / Lateral Deltoids)
  {
    id: 'ant_deltoid_l',
    name: 'Anterior & Lateral Deltoid (Left)',
    commonName: 'Left Shoulder',
    view: 'anterior',
    keywords: ['deltoid', 'shoulder', 'shoulders', 'anterior deltoid', 'lateral deltoid'],
    biomechanicsRole: 'Glenohumeral abduction, flexion, and horizontal adduction',
    side: 'left',
    pathD: 'M 82 92 C 70 96 60 110 58 128 C 64 134 72 136 78 132 C 84 122 86 108 84 94 Z',
  },
  {
    id: 'ant_deltoid_r',
    name: 'Anterior & Lateral Deltoid (Right)',
    commonName: 'Right Shoulder',
    view: 'anterior',
    keywords: ['deltoid', 'shoulder', 'shoulders', 'anterior deltoid', 'lateral deltoid'],
    biomechanicsRole: 'Glenohumeral abduction, flexion, and horizontal adduction',
    side: 'right',
    pathD: 'M 198 92 C 210 96 220 110 222 128 C 216 134 208 136 202 132 C 196 122 194 108 196 94 Z',
  },
  // Pectoralis Major (Chest)
  {
    id: 'pectoralis_l',
    name: 'Pectoralis Major & Minor (Left)',
    commonName: 'Left Chest',
    view: 'anterior',
    keywords: ['pectoral', 'pectoralis', 'chest', 'pecs', 'pectoralis major', 'sternal', 'clavicular'],
    biomechanicsRole: 'Horizontal adduction, internal rotation, and flexion of the humerus',
    side: 'left',
    pathD: 'M 138 98 C 118 96 92 100 86 112 C 84 126 96 142 122 144 C 136 145 138 125 138 98 Z',
  },
  {
    id: 'pectoralis_r',
    name: 'Pectoralis Major & Minor (Right)',
    commonName: 'Right Chest',
    view: 'anterior',
    keywords: ['pectoral', 'pectoralis', 'chest', 'pecs', 'pectoralis major', 'sternal', 'clavicular'],
    biomechanicsRole: 'Horizontal adduction, internal rotation, and flexion of the humerus',
    side: 'right',
    pathD: 'M 142 98 C 162 96 188 100 194 112 C 196 126 184 142 158 144 C 144 145 142 125 142 98 Z',
  },
  // Biceps Brachii
  {
    id: 'biceps_l',
    name: 'Biceps Brachii & Brachialis (Left)',
    commonName: 'Left Biceps',
    view: 'anterior',
    keywords: ['bicep', 'biceps', 'biceps brachii', 'brachialis', 'arm'],
    biomechanicsRole: 'Elbow flexion and forearm supination; assists shoulder flexion',
    side: 'left',
    pathD: 'M 72 136 C 62 142 58 160 62 178 C 68 184 76 180 80 172 C 84 158 82 144 72 136 Z',
  },
  {
    id: 'biceps_r',
    name: 'Biceps Brachii & Brachialis (Right)',
    commonName: 'Right Biceps',
    view: 'anterior',
    keywords: ['bicep', 'biceps', 'biceps brachii', 'brachialis', 'arm'],
    biomechanicsRole: 'Elbow flexion and forearm supination; assists shoulder flexion',
    side: 'right',
    pathD: 'M 208 136 C 218 142 222 160 218 178 C 212 184 204 180 200 172 C 196 158 198 144 208 136 Z',
  },
  // Forearms (Anterior Flexors)
  {
    id: 'forearm_l',
    name: 'Brachioradialis & Forearm Flexors (Left)',
    commonName: 'Left Forearm',
    view: 'anterior',
    keywords: ['forearm', 'forearms', 'grip', 'brachioradialis', 'wrist flexors'],
    biomechanicsRole: 'Elbow flexion in neutral grip, wrist stabilization, and isometric grip force',
    side: 'left',
    pathD: 'M 60 184 C 52 196 46 220 50 236 C 56 240 62 238 66 226 C 72 210 74 192 68 184 Z',
  },
  {
    id: 'forearm_r',
    name: 'Brachioradialis & Forearm Flexors (Right)',
    commonName: 'Right Forearm',
    view: 'anterior',
    keywords: ['forearm', 'forearms', 'grip', 'brachioradialis', 'wrist flexors'],
    biomechanicsRole: 'Elbow flexion in neutral grip, wrist stabilization, and isometric grip force',
    side: 'right',
    pathD: 'M 220 184 C 228 196 234 220 230 236 C 224 240 218 238 214 226 C 208 210 206 192 212 184 Z',
  },
  // Rectus Abdominis (Core)
  {
    id: 'rectus_abdominis_upper',
    name: 'Upper Rectus Abdominis',
    commonName: 'Upper Abs',
    view: 'anterior',
    keywords: ['abs', 'abdominal', 'rectus abdominis', 'core', 'transverse abdominis'],
    biomechanicsRole: 'Spinal flexion, intra-abdominal pressure generation, and pelvic stabilization',
    side: 'center',
    pathD: 'M 124 148 L 156 148 C 158 162 158 174 156 182 L 124 182 C 122 174 122 162 124 148 Z',
  },
  {
    id: 'rectus_abdominis_lower',
    name: 'Lower Rectus Abdominis & Transverse',
    commonName: 'Lower Abs & Deep Core',
    view: 'anterior',
    keywords: ['abs', 'abdominal', 'lower abs', 'rectus abdominis', 'transverse abdominis', 'core'],
    biomechanicsRole: 'Posterior pelvic tilt, anti-extension spinal brace, and visceral support',
    side: 'center',
    pathD: 'M 124 186 L 156 186 C 154 200 152 214 146 224 L 134 224 C 128 214 126 200 124 186 Z',
  },
  // External Obliques & Serratus Anterior
  {
    id: 'obliques_l',
    name: 'External Oblique & Serratus Anterior (Left)',
    commonName: 'Left Obliques',
    view: 'anterior',
    keywords: ['obliques', 'serratus', 'core', 'transverse abdominis', 'serratus anterior'],
    biomechanicsRole: 'Lateral trunk flexion, contralateral trunk rotation, and ribcage depression',
    side: 'left',
    pathD: 'M 120 148 C 104 152 98 170 102 196 C 108 210 118 218 122 218 C 120 200 120 172 120 148 Z',
  },
  {
    id: 'obliques_r',
    name: 'External Oblique & Serratus Anterior (Right)',
    commonName: 'Right Obliques',
    view: 'anterior',
    keywords: ['obliques', 'serratus', 'core', 'transverse abdominis', 'serratus anterior'],
    biomechanicsRole: 'Lateral trunk flexion, contralateral trunk rotation, and ribcage depression',
    side: 'right',
    pathD: 'M 160 148 C 176 152 182 170 178 196 C 172 210 162 218 158 218 C 160 200 160 172 160 148 Z',
  },
  // Quadriceps (Rectus Femoris & Vastus Muscles)
  {
    id: 'quadriceps_l',
    name: 'Quadriceps Femoris (Left)',
    commonName: 'Left Quads',
    view: 'anterior',
    keywords: ['quad', 'quads', 'quadriceps', 'rectus femoris', 'vastus', 'thigh', 'legs'],
    biomechanicsRole: 'Knee extension (all 4 heads) and hip flexion (rectus femoris)',
    side: 'left',
    pathD: 'M 112 236 C 96 244 90 270 94 304 C 98 322 108 330 114 330 C 124 330 128 312 128 280 C 128 256 122 242 112 236 Z',
  },
  {
    id: 'quadriceps_r',
    name: 'Quadriceps Femoris (Right)',
    commonName: 'Right Quads',
    view: 'anterior',
    keywords: ['quad', 'quads', 'quadriceps', 'rectus femoris', 'vastus', 'thigh', 'legs'],
    biomechanicsRole: 'Knee extension (all 4 heads) and hip flexion (rectus femoris)',
    side: 'right',
    pathD: 'M 168 236 C 184 244 190 270 186 304 C 182 322 172 330 166 330 C 156 330 152 312 152 280 C 152 256 158 242 168 236 Z',
  },
  // Tibialis Anterior & Anterior Calves
  {
    id: 'tibialis_l',
    name: 'Tibialis Anterior & Lower Leg (Left)',
    commonName: 'Left Shin & Ankle Dorsiflexors',
    view: 'anterior',
    keywords: ['tibialis', 'calves', 'shin', 'dorsiflexor', 'lower leg'],
    biomechanicsRole: 'Ankle dorsiflexion and foot inversion; critical for gait clearance and decelerating foot drop',
    side: 'left',
    pathD: 'M 106 342 C 100 352 98 376 102 396 C 106 400 112 400 116 394 C 118 382 118 360 116 342 Z',
  },
  {
    id: 'tibialis_r',
    name: 'Tibialis Anterior & Lower Leg (Right)',
    commonName: 'Right Shin & Ankle Dorsiflexors',
    view: 'anterior',
    keywords: ['tibialis', 'calves', 'shin', 'dorsiflexor', 'lower leg'],
    biomechanicsRole: 'Ankle dorsiflexion and foot inversion; critical for gait clearance and decelerating foot drop',
    side: 'right',
    pathD: 'M 174 342 C 180 352 182 376 178 396 C 174 400 168 400 164 394 C 162 382 162 360 164 342 Z',
  },
];

const POSTERIOR_MUSCLES: MuscleDefinition[] = [
  // Upper Trapezius & Neck
  {
    id: 'trapezius_upper',
    name: 'Upper & Middle Trapezius',
    commonName: 'Upper Back / Traps',
    view: 'posterior',
    keywords: ['trapezius', 'traps', 'upper back', 'neck', 'rhomboids'],
    biomechanicsRole: 'Scapular elevation, upward rotation, and retraction',
    side: 'center',
    pathD: 'M 140 76 L 102 96 C 114 110 128 116 140 116 C 152 116 166 110 178 96 Z',
  },
  // Posterior Deltoid
  {
    id: 'post_deltoid_l',
    name: 'Posterior Deltoid & Infraspinatus (Left)',
    commonName: 'Left Rear Shoulder',
    view: 'posterior',
    keywords: ['deltoid', 'posterior deltoid', 'rear delt', 'rotator cuff', 'infraspinatus'],
    biomechanicsRole: 'Glenohumeral horizontal abduction and external rotation',
    side: 'left',
    pathD: 'M 84 94 C 70 98 62 112 60 128 C 66 134 74 136 80 130 C 86 120 88 106 84 94 Z',
  },
  {
    id: 'post_deltoid_r',
    name: 'Posterior Deltoid & Infraspinatus (Right)',
    commonName: 'Right Rear Shoulder',
    view: 'posterior',
    keywords: ['deltoid', 'posterior deltoid', 'rear delt', 'rotator cuff', 'infraspinatus'],
    biomechanicsRole: 'Glenohumeral horizontal abduction and external rotation',
    side: 'right',
    pathD: 'M 196 94 C 210 98 218 112 220 128 C 214 134 206 136 200 130 C 194 120 192 106 196 94 Z',
  },
  // Triceps Brachii
  {
    id: 'triceps_l',
    name: 'Triceps Brachii - Long & Lateral Heads (Left)',
    commonName: 'Left Triceps',
    view: 'posterior',
    keywords: ['tricep', 'triceps', 'triceps brachii', 'arms'],
    biomechanicsRole: 'Elbow extension; long head assists humeral extension and adduction',
    side: 'left',
    pathD: 'M 72 134 C 62 142 58 160 62 178 C 68 184 76 180 80 170 C 82 156 80 142 72 134 Z',
  },
  {
    id: 'triceps_r',
    name: 'Triceps Brachii - Long & Lateral Heads (Right)',
    commonName: 'Right Triceps',
    view: 'posterior',
    keywords: ['tricep', 'triceps', 'triceps brachii', 'arms'],
    biomechanicsRole: 'Elbow extension; long head assists humeral extension and adduction',
    side: 'right',
    pathD: 'M 208 134 C 218 142 222 160 218 178 C 212 184 204 180 200 170 C 198 156 200 142 208 134 Z',
  },
  // Latissimus Dorsi & Rhomboids
  {
    id: 'latissimus_l',
    name: 'Latissimus Dorsi & Rhomboid Major (Left)',
    commonName: 'Left Lat & Mid-Back',
    view: 'posterior',
    keywords: ['lat', 'lats', 'latissimus', 'latissimus dorsi', 'back', 'rhomboid', 'rhomboids'],
    biomechanicsRole: 'Glenohumeral adduction, extension, and internal rotation; scapular depression',
    side: 'left',
    pathD: 'M 136 120 C 116 122 96 134 94 164 C 98 188 112 210 134 216 C 136 186 136 150 136 120 Z',
  },
  {
    id: 'latissimus_r',
    name: 'Latissimus Dorsi & Rhomboid Major (Right)',
    commonName: 'Right Lat & Mid-Back',
    view: 'posterior',
    keywords: ['lat', 'lats', 'latissimus', 'latissimus dorsi', 'back', 'rhomboid', 'rhomboids'],
    biomechanicsRole: 'Glenohumeral adduction, extension, and internal rotation; scapular depression',
    side: 'right',
    pathD: 'M 144 120 C 164 122 184 134 186 164 C 182 188 168 210 146 216 C 144 186 144 150 144 120 Z',
  },
  // Erector Spinae (Lower Back / Posterior Chain)
  {
    id: 'erector_spinae',
    name: 'Erector Spinae & Thoracolumbar Fascia',
    commonName: 'Lower Back & Spinal Erectors',
    view: 'posterior',
    keywords: ['erector', 'erector spinae', 'lower back', 'spinal', 'posterior chain'],
    biomechanicsRole: 'Spinal extension, anti-shear stabilization, and lateral vertebral control',
    side: 'center',
    pathD: 'M 132 176 L 148 176 L 148 226 L 132 226 Z',
  },
  // Gluteus Maximus & Medius
  {
    id: 'gluteus_l',
    name: 'Gluteus Maximus & Medius (Left)',
    commonName: 'Left Glute',
    view: 'posterior',
    keywords: ['glute', 'glutes', 'gluteus', 'gluteus maximus', 'gluteus medius', 'buttocks', 'hips'],
    biomechanicsRole: 'Hip extension, external rotation, and pelvic abduction / coronal stabilization',
    side: 'left',
    pathD: 'M 138 228 C 114 226 98 240 100 266 C 104 282 120 286 136 280 C 138 262 138 244 138 228 Z',
  },
  {
    id: 'gluteus_r',
    name: 'Gluteus Maximus & Medius (Right)',
    commonName: 'Right Glute',
    view: 'posterior',
    keywords: ['glute', 'glutes', 'gluteus', 'gluteus maximus', 'gluteus medius', 'buttocks', 'hips'],
    biomechanicsRole: 'Hip extension, external rotation, and pelvic abduction / coronal stabilization',
    side: 'right',
    pathD: 'M 142 228 C 166 226 182 240 180 266 C 176 282 160 286 144 280 C 142 262 142 244 142 228 Z',
  },
  // Hamstrings (Biceps Femoris & Semitendinosus)
  {
    id: 'hamstrings_l',
    name: 'Hamstrings - Biceps Femoris & Semitendinosus (Left)',
    commonName: 'Left Hamstrings',
    view: 'posterior',
    keywords: ['hamstring', 'hamstrings', 'biceps femoris', 'semitendinosus', 'legs', 'posterior chain'],
    biomechanicsRole: 'Knee flexion and hip extension; decelerates forward tibial translation',
    side: 'left',
    pathD: 'M 110 284 C 98 290 94 310 98 334 C 102 340 110 340 114 336 C 122 328 126 308 126 284 Z',
  },
  {
    id: 'hamstrings_r',
    name: 'Hamstrings - Biceps Femoris & Semitendinosus (Right)',
    commonName: 'Right Hamstrings',
    view: 'posterior',
    keywords: ['hamstring', 'hamstrings', 'biceps femoris', 'semitendinosus', 'legs', 'posterior chain'],
    biomechanicsRole: 'Knee flexion and hip extension; decelerates forward tibial translation',
    side: 'right',
    pathD: 'M 170 284 C 182 290 186 310 182 334 C 178 340 170 340 166 336 C 158 328 154 308 154 284 Z',
  },
  // Calves (Gastrocnemius & Soleus)
  {
    id: 'calves_l',
    name: 'Gastrocnemius & Soleus (Left)',
    commonName: 'Left Calf Complex',
    view: 'posterior',
    keywords: ['calf', 'calves', 'gastrocnemius', 'soleus', 'achilles', 'lower leg'],
    biomechanicsRole: 'Ankle plantarflexion and propulsion; assists knee flexion stability',
    side: 'left',
    pathD: 'M 108 346 C 96 354 94 374 98 394 C 104 398 112 396 116 388 C 120 376 120 358 116 346 Z',
  },
  {
    id: 'calves_r',
    name: 'Gastrocnemius & Soleus (Right)',
    commonName: 'Right Calf Complex',
    view: 'posterior',
    keywords: ['calf', 'calves', 'gastrocnemius', 'soleus', 'achilles', 'lower leg'],
    biomechanicsRole: 'Ankle plantarflexion and propulsion; assists knee flexion stability',
    side: 'right',
    pathD: 'M 172 346 C 184 354 186 374 182 394 C 176 398 168 396 164 388 C 160 376 160 358 164 346 Z',
  },
];

export type ActivationTier = 'primary' | 'secondary' | 'stabilizer' | 'inactive';

export interface ActivationInfo {
  tier: ActivationTier;
  percentage: number;
  label: string;
  badgeColor: string;
}

export interface InteractiveMuscleAnatomyProps {
  exercise: Exercise;
  interactive?: boolean;
  className?: string;
}

export const InteractiveMuscleAnatomy: React.FC<InteractiveMuscleAnatomyProps> = ({
  exercise,
  interactive = true,
  className = '',
}) => {
  const [activeView, setActiveView] = useState<'anterior' | 'posterior'>('anterior');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleDefinition | null>(null);
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleDefinition | null>(null);
  const [filterTier, setFilterTier] = useState<ActivationTier | 'all'>('all');
  const [isSimulatingCycle, setIsSimulatingCycle] = useState(false);
  const [cyclePhase, setCyclePhase] = useState<'eccentric' | 'pause' | 'concentric'>('eccentric');
  const [cycleProgress, setCycleProgress] = useState(0);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Compute activation for every muscle based on exercise anatomy lists
  const muscleActivations = useMemo(() => {
    const primaryList = (exercise.anatomy?.primary || []).map((s) => s.toLowerCase());
    const secondaryList = (exercise.anatomy?.secondary || []).map((s) => s.toLowerCase());
    const stabilizerList = (exercise.anatomy?.stabilizers || []).map((s) => s.toLowerCase());
    const targetMusclesList = (exercise.targetMuscles || []).map((s) => s.toLowerCase());

    const map = new Map<string, ActivationInfo>();

    const allMuscles = [...ANTERIOR_MUSCLES, ...POSTERIOR_MUSCLES];
    allMuscles.forEach((m) => {
      let isPrimary = false;
      let isSecondary = false;
      let isStabilizer = false;

      m.keywords.forEach((kw) => {
        const kwLower = kw.toLowerCase();
        if (
          primaryList.some((p) => p.includes(kwLower) || kwLower.includes(p)) ||
          targetMusclesList.some((t) => t.includes(kwLower) || kwLower.includes(t))
        ) {
          isPrimary = true;
        } else if (secondaryList.some((s) => s.includes(kwLower) || kwLower.includes(s))) {
          isSecondary = true;
        } else if (stabilizerList.some((st) => st.includes(kwLower) || kwLower.includes(st))) {
          isStabilizer = true;
        }
      });

      if (isPrimary) {
        map.set(m.id, {
          tier: 'primary',
          percentage: 92 + Math.floor(Math.random() * 8), // 92-100%
          label: 'Primary Agonist (Prime Mover)',
          badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
        });
      } else if (isSecondary) {
        map.set(m.id, {
          tier: 'secondary',
          percentage: 65 + Math.floor(Math.random() * 12), // 65-77%
          label: 'Secondary Synergist (Assisting Muscle)',
          badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
        });
      } else if (isStabilizer) {
        map.set(m.id, {
          tier: 'stabilizer',
          percentage: 42 + Math.floor(Math.random() * 10), // 42-52%
          label: 'Dynamic Joint Stabilizer / Neutralizer',
          badgeColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
        });
      } else {
        map.set(m.id, {
          tier: 'inactive',
          percentage: 8 + Math.floor(Math.random() * 6), // Baseline tone
          label: 'Baseline Resting Muscle Tone',
          badgeColor: 'text-slate-400 bg-slate-800/40 border-slate-700',
        });
      }
    });

    return map;
  }, [exercise]);

  // If initial activeView has no primary muscles, auto-switch to view with primary muscles
  useEffect(() => {
    const hasPrimaryAnterior = ANTERIOR_MUSCLES.some(
      (m) => muscleActivations.get(m.id)?.tier === 'primary'
    );
    const hasPrimaryPosterior = POSTERIOR_MUSCLES.some(
      (m) => muscleActivations.get(m.id)?.tier === 'primary'
    );
    if (!hasPrimaryAnterior && hasPrimaryPosterior) {
      setActiveView('posterior');
    }
  }, [exercise, muscleActivations]);

  // Current view muscles
  const currentMuscles = activeView === 'anterior' ? ANTERIOR_MUSCLES : POSTERIOR_MUSCLES;

  // D3 Selection and Interactive Binding
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const muscleElements = svg.selectAll<SVGPathElement, unknown>('.muscle-node');

    muscleElements.each(function () {
      const el = d3.select(this);
      const muscleId = this.getAttribute('data-muscle-id') || '';
      const act = muscleActivations.get(muscleId);
      const tier = act?.tier || 'inactive';

      const isFilteredOut = filterTier !== 'all' && tier !== filterTier;
      const isSelected = selectedMuscle?.id === muscleId;
      const isHovered = hoveredMuscle?.id === muscleId;

      // Color grading according to tier
      let fillColor = '#1e293b'; // Slate 800 inactive
      let strokeColor = '#334155'; // Slate 700
      let strokeWidth = 1.2;
      let opacity = 0.85;

      if (tier === 'primary') {
        fillColor = '#10B981'; // Emerald 500
        strokeColor = '#80F52A'; // Lime accent
        strokeWidth = 2;
        opacity = 0.95;
      } else if (tier === 'secondary') {
        fillColor = '#F59E0B'; // Amber 500
        strokeColor = '#FBBF24'; // Amber 400
        strokeWidth = 1.6;
        opacity = 0.9;
      } else if (tier === 'stabilizer') {
        fillColor = '#6366F1'; // Indigo 500
        strokeColor = '#818CF8'; // Indigo 400
        strokeWidth = 1.4;
        opacity = 0.85;
      }

      if (isFilteredOut) {
        opacity = 0.18;
      }

      if (isSelected) {
        strokeColor = '#FFFFFF';
        strokeWidth = 2.8;
        opacity = 1;
      } else if (isHovered) {
        strokeWidth = 2.2;
        opacity = 1;
      }

      // Smooth D3 transition
      el.transition()
        .duration(260)
        .ease(d3.easeCubicOut)
        .attr('fill', fillColor)
        .attr('stroke', strokeColor)
        .attr('stroke-width', strokeWidth)
        .attr('opacity', opacity);
    });
  }, [currentMuscles, muscleActivations, filterTier, selectedMuscle, hoveredMuscle]);

  // Movement Simulation Cycle using requestAnimationFrame & D3 pulse
  useEffect(() => {
    if (!isSimulatingCycle) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setCycleProgress(0);
      setCyclePhase('eccentric');
      return;
    }

    let startTime = performance.now();
    const cycleDuration = 4000; // 4s total loop (2s eccentric, 0.5s pause, 1.5s concentric)

    const animateLoop = (now: number) => {
      const elapsed = (now - startTime) % cycleDuration;
      const progress = elapsed / cycleDuration;
      setCycleProgress(progress);

      let phase: 'eccentric' | 'pause' | 'concentric' = 'eccentric';
      let intensity = 0.8;

      if (elapsed < 2000) {
        phase = 'eccentric';
        intensity = 0.7 + (elapsed / 2000) * 0.3; // Stretches under tension
      } else if (elapsed < 2500) {
        phase = 'pause';
        intensity = 0.95; // Bottom isometric transition
      } else {
        phase = 'concentric';
        const concentricElapsed = elapsed - 2500;
        intensity = 1.0 - (concentricElapsed / 1500) * 0.25; // Peak contraction
      }
      setCyclePhase(phase);

      // Pulse primary muscle nodes via D3
      if (svgRef.current) {
        const svg = d3.select(svgRef.current);
        svg
          .selectAll<SVGPathElement, unknown>('.muscle-node')
          .filter(function () {
            const mId = this.getAttribute('data-muscle-id') || '';
            return muscleActivations.get(mId)?.tier === 'primary';
          })
          .attr('opacity', Math.min(1, intensity + 0.1))
          .attr('stroke-width', 2 + intensity * 1.5);
      }

      animFrameRef.current = requestAnimationFrame(animateLoop);
    };

    animFrameRef.current = requestAnimationFrame(animateLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isSimulatingCycle, muscleActivations]);

  // Primary and secondary count summary
  const primaryCount = useMemo(
    () => Array.from(muscleActivations.values()).filter((v) => v.tier === 'primary').length,
    [muscleActivations]
  );
  const secondaryCount = useMemo(
    () => Array.from(muscleActivations.values()).filter((v) => v.tier === 'secondary').length,
    [muscleActivations]
  );

  return (
    <div
      className={`rounded-2xl bg-[#0f141d] border border-[#232c3b] p-4 lg:p-6 shadow-xl space-y-4 ${className}`}
    >
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2837] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Interactive Muscle Activation Overlay</span>
              <span className="text-[10px] rounded-full bg-emerald-500/20 px-2 py-0.5 font-semibold text-emerald-400 border border-emerald-500/30">
                D3 Dynamic EMG
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Biomechanical agonist-antagonist mapping · Hover or tap to inspect recruitment
            </p>
          </div>
        </div>

        {/* View Switcher: Anterior (Front) vs Posterior (Back) */}
        <div className="flex items-center gap-1.5 rounded-xl bg-[#161d27] p-1 border border-[#273243] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveView('anterior');
              setSelectedMuscle(null);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeView === 'anterior'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Anterior (Front)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView('posterior');
              setSelectedMuscle(null);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeView === 'posterior'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Posterior (Back)
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive D3 Vector Anatomy Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center rounded-xl bg-[#121822] border border-[#222c3d] p-4 relative overflow-hidden">
          {/* Subtle Grid Ambient Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Repetition Cycle Floating Simulation Controls */}
          <div className="w-full flex items-center justify-between mb-2 z-10">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>{activeView === 'anterior' ? 'Frontal Plane' : 'Posterior Chain'}</span>
            </span>

            <button
              type="button"
              onClick={() => setIsSimulatingCycle(!isSimulatingCycle)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all border ${
                isSimulatingCycle
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : 'bg-[#1b2330] text-slate-300 hover:text-white border-[#2d3a4d]'
              }`}
              title="Animate contraction tempo across repetition"
            >
              {isSimulatingCycle ? (
                <>
                  <Pause className="h-3 w-3" />
                  <span>Pause Tempo</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  <span>Simulate Rep Cycle</span>
                </>
              )}
            </button>
          </div>

          {/* Active Rep Cycle Status Bar */}
          {isSimulatingCycle && (
            <div className="w-full mb-3 rounded-lg bg-[#18212e] p-2 border border-[#293548] z-10">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-white capitalize flex items-center gap-1">
                  <Zap className="h-3 w-3 text-emerald-400" />
                  <span>Phase: {cyclePhase}</span>
                </span>
                <span className="text-slate-400 font-mono">
                  {cyclePhase === 'eccentric' && 'Inhale & Lower (Tension Building)'}
                  {cyclePhase === 'pause' && 'Mid-rep Brace / Transition'}
                  {cyclePhase === 'concentric' && 'Exhale & Drive (Peak Recruitment)'}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-75"
                  style={{ width: `${Math.round(cycleProgress * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* SVG Anatomy Canvas */}
          <div className="relative w-full max-w-[280px] h-[380px] flex items-center justify-center z-10">
            <svg
              ref={svgRef}
              viewBox="0 0 280 420"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
            >
              {/* SVG Defs for Glow Filters and Gradients */}
              <defs>
                <filter id="emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <radialGradient id="head-gradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2c3748" />
                  <stop offset="100%" stopColor="#1a222f" />
                </radialGradient>
              </defs>

              {/* Head & Neck Base Structure */}
              <ellipse cx="140" cy="42" rx="22" ry="28" fill="url(#head-gradient)" stroke="#3a485e" strokeWidth="1.2" />
              <rect x="131" y="68" width="18" height="22" rx="4" fill="#253040" stroke="#3a485e" strokeWidth="1" />

              {/* Joint & Bone Landmarks for realism */}
              {/* Clavicle line */}
              <line x1="88" y1="92" x2="192" y2="92" stroke="#334155" strokeWidth="1.5" strokeDasharray="2,2" />
              {/* Sternum / Spine landmark */}
              <line x1="140" y1="92" x2="140" y2="226" stroke="#2a3547" strokeWidth="1.2" strokeDasharray="3,3" />

              {/* Anatomical Muscle Nodes */}
              {currentMuscles.map((muscle) => {
                const act = muscleActivations.get(muscle.id);
                const isSelected = selectedMuscle?.id === muscle.id;

                return (
                  <path
                    key={muscle.id}
                    data-muscle-id={muscle.id}
                    d={muscle.pathD}
                    className="muscle-node cursor-pointer transition-all duration-150"
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                    style={{
                      filter:
                        act?.tier === 'primary' ? 'drop-shadow(0 0 4px rgba(16,185,129,0.5))' : 'none',
                    }}
                    onMouseEnter={() => setHoveredMuscle(muscle)}
                    onMouseLeave={() => setHoveredMuscle(null)}
                    onClick={() => {
                      if (interactive) {
                        setSelectedMuscle(selectedMuscle?.id === muscle.id ? null : muscle);
                      }
                    }}
                  />
                );
              })}

              {/* Knee and Ankle Joint Anchors */}
              <circle cx="114" cy="336" r="4" fill="#242f40" stroke="#3b485d" strokeWidth="1" />
              <circle cx="166" cy="336" r="4" fill="#242f40" stroke="#3b485d" strokeWidth="1" />
              <ellipse cx="109" cy="404" rx="9" ry="4" fill="#1e2837" stroke="#334155" strokeWidth="1" />
              <ellipse cx="171" cy="404" rx="9" ry="4" fill="#1e2837" stroke="#334155" strokeWidth="1" />
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredMuscle && (
              <div
                ref={tooltipRef}
                className="absolute top-2 left-2 right-2 pointer-events-none rounded-xl bg-[#090d13]/95 border border-emerald-500/40 p-2.5 shadow-2xl backdrop-blur-md z-30 transition-all text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white truncate">
                    {hoveredMuscle.commonName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      muscleActivations.get(hoveredMuscle.id)?.badgeColor || ''
                    }`}
                  >
                    {muscleActivations.get(hoveredMuscle.id)?.percentage}% EMG
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-serif italic mt-0.5">
                  {hoveredMuscle.name}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                  {muscleActivations.get(hoveredMuscle.id)?.label}
                </div>
              </div>
            )}
          </div>

          {/* Color Legend & Filter Pills */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#1e2635] text-[11px] z-10">
            <button
              type="button"
              onClick={() => setFilterTier(filterTier === 'primary' ? 'all' : 'primary')}
              className={`flex items-center gap-1.5 rounded-lg p-1.5 border transition-all text-left ${
                filterTier === 'primary'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                  : 'border-[#263142] text-slate-300 hover:border-emerald-500/40'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="truncate">Primary Agonist</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterTier(filterTier === 'secondary' ? 'all' : 'secondary')}
              className={`flex items-center gap-1.5 rounded-lg p-1.5 border transition-all text-left ${
                filterTier === 'secondary'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                  : 'border-[#263142] text-slate-300 hover:border-amber-500/40'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <span className="truncate">Secondary</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterTier(filterTier === 'stabilizer' ? 'all' : 'stabilizer')}
              className={`flex items-center gap-1.5 rounded-lg p-1.5 border transition-all text-left ${
                filterTier === 'stabilizer'
                  ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold'
                  : 'border-[#263142] text-slate-300 hover:border-indigo-500/40'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
              <span className="truncate">Stabilizer</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterTier('all')}
              className={`flex items-center gap-1.5 rounded-lg p-1.5 border transition-all text-left ${
                filterTier === 'all'
                  ? 'bg-slate-700/50 border-slate-400 text-white font-bold'
                  : 'border-[#263142] text-slate-400 hover:text-white'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
              <span>Show All</span>
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Biomechanical & Muscle Breakdown Panel */}
        <div className="lg:col-span-6 space-y-4 text-xs">
          {/* Active Target Muscles Pill Summary */}
          <div className="rounded-xl bg-[#141b24] p-3.5 border border-[#242f40] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Primary Movers & Target Muscles</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {primaryCount} Primary · {secondaryCount} Synergists
              </span>
            </div>

            {/* Target Muscle Badges */}
            <div className="flex flex-wrap gap-1.5">
              {(exercise.anatomy?.primary || exercise.targetMuscles || []).map((m, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-300 flex items-center gap-1"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{m}</span>
                </span>
              ))}
            </div>

            {exercise.anatomy?.secondary && exercise.anatomy.secondary.length > 0 && (
              <div className="pt-2 border-t border-[#1f2837]">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Secondary Assisting Musculature:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {exercise.anatomy.secondary.map((s, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 text-[11px] font-medium text-amber-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Joint Kinematics & Biomechanical Action */}
          <div className="rounded-xl bg-[#141b24] p-3.5 border border-[#242f40] space-y-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-cyan-400" />
              <span>Joint Kinematics & Movement Action</span>
            </span>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              {exercise.anatomy?.jointAction ||
                'Multi-joint compound articulation providing functional movement pattern transfer.'}
            </p>
          </div>

          {/* Interactive Selected Muscle Deep-Dive Inspector */}
          {selectedMuscle ? (
            <div className="rounded-xl bg-[#16202c] p-4 border border-emerald-500/40 space-y-2.5 animate-fadeIn">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Selected Anatomical Structure
                  </span>
                  <h4 className="text-sm font-bold text-white">{selectedMuscle.commonName}</h4>
                  <div className="text-[11px] text-slate-400 italic">{selectedMuscle.name}</div>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg border ${
                    muscleActivations.get(selectedMuscle.id)?.badgeColor || ''
                  }`}
                >
                  {muscleActivations.get(selectedMuscle.id)?.percentage}% Recruitment
                </span>
              </div>

              <div className="space-y-1 pt-1 border-t border-[#232f42] text-xs">
                <span className="font-semibold text-slate-300">Biomechanical Role:</span>
                <p className="text-slate-300/90 leading-relaxed">
                  {selectedMuscle.biomechanicsRole}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-slate-400">
                  Role: <strong className="text-white">{muscleActivations.get(selectedMuscle.id)?.label}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMuscle(null)}
                  className="text-xs text-emerald-400 hover:underline font-semibold"
                >
                  Deselect
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-[#121822] p-4 border border-dashed border-[#293548] text-center space-y-1.5">
              <ShieldCheck className="h-5 w-5 text-emerald-400/80 mx-auto" />
              <p className="font-semibold text-slate-300 text-xs">
                Tap or click any muscle in the diagram
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Explore primary agonist drivers, joint stabilizers, and physiological recruitment ratios for {exercise.name}.
              </p>
            </div>
          )}

          {/* External Verified Biomechanics Site Links */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {exercise.biomechanicsUrl && (
              <a
                href={exercise.biomechanicsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#2c384a] bg-[#161d27] px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:border-emerald-500/50 hover:text-white transition-colors"
              >
                <span>Google Anatomy & Biomechanics Reference</span>
                <ChevronRight className="h-3 w-3 text-emerald-400" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
