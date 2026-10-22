import { PainManagementCase } from '../types';
import { ASSETS } from './seedData';

export const INITIAL_PAIN_CASES: PainManagementCase[] = [
  {
    id: 'pain_low_back',
    title: 'Low Back Pain (LBP) & Lumbar Disc Irritation',
    affectedArea: 'Lumbar Spine (L4-L5, L5-S1) & Sacroiliac Joint',
    conditionSummary:
      'A very common condition marked by dull or sharp aching across the lower back, often aggravated by prolonged sitting, slouching, or loaded flexion. The vast majority of cases respond favorably to decompression breathing and core stiffness.',
    biomechanicalCause:
      'Excessive spinal flexion and pelvic retroversion during sitting creates posterior migration shear on intervertebral discs. Weak gluteals and inhibited transverse abdominis force lumbar erectors to overcompensate.',
    redFlags: [
      'Numbness or tingling spreading down both legs (saddle anesthesia)',
      'Sudden loss of bowel or bladder control (seek ER immediately)',
      'Progressive muscle weakness such as foot drop (inability to lift toes)',
      'Unexplained fever, chills, or sudden night sweats associated with back pain',
    ],
    dos: [
      'Maintain frequent walking intervals (5-10 minutes every hour) to hydrate disc matrices.',
      'Perform McGill Big 3 stabilization drills daily to build spinal stiffness.',
      'Practice diaphragmatic belly breathing to reduce protective paraspinal muscle spasms.',
      'Hinge through hips and knees when picking objects off the ground.',
    ],
    donts: [
      'Do not perform traditional sit-ups, crunches, or heavy toe touches during flare-ups.',
      'Avoid high-impact jumping or loaded spinal compression (e.g. heavy axial barbell squats).',
      'Do not sit continuously for longer than 45 minutes without standing.',
    ],
    biomechanicsUrl: 'https://exrx.net/Kinesiology/LowBackPain',
    youtubeGuideUrl: 'https://www.youtube.com/watch?v=0_yYxZ0i9d8',
    anatomyImageUrl: ASSETS.biomechanicsSpine,
    phases: [
      {
        phase: 1,
        title: 'Phase 1: Acute Pain Relief & Decompression',
        objective: 'Reduce protective muscle spasms, eliminate flexion intolerance, and re-establish neural relaxation.',
        durationWeeks: 'Days 1–7 (Acute Flare)',
        drills: [
          {
            name: 'Prone On Elbows (McKenzie Extension)',
            setsReps: '3 sets of 2 mins',
            cues: 'Lie on stomach, relax glutes and lower back completely. Rest on forearms and breathe slow, deep belly breaths.',
            breathing: 'Inhale deep into abdomen (4s), hold gently (2s), long relaxed exhale (6s).',
            youtubeId: 'bEv6CCg2BC8',
          },
          {
            name: '90/90 Psoas Decompression on Floor',
            setsReps: '10 mins daily',
            cues: 'Lie flat on back with calves elevated on a chair or couch at 90-degree angle. Allows lumbar lordosis to neutralize.',
            breathing: 'Slow rhythmic diaphragmatic breathing, feeling ribcage expand 360 degrees.',
            youtubeId: 'Oqsq820y4g0',
          },
          {
            name: 'Cat-Camel Spinal Flossing (Pain-Free Arc)',
            setsReps: '2 sets of 8 cycles',
            cues: 'Move strictly within painless range. Focus on gentle thoracic articulation rather than forced lumbar end ranges.',
            breathing: 'Inhale chest forward, exhale push floor away gently.',
            youtubeId: 'bEv6CCg2BC8',
          },
        ],
      },
      {
        phase: 2,
        title: 'Phase 2: Subacute Isometric Core Stability',
        objective: 'Construct a muscular corset around the lumbar vertebrae using Dr. Stuart McGill’s evidence-based stabilization protocols.',
        durationWeeks: 'Weeks 2–4',
        drills: [
          {
            name: 'Bird-Dog with Fisted Isometric Reach',
            setsReps: '3 sets of 6 reps each (5s hold)',
            cues: 'Neutral spine. Extend opposite arm and leg without letting hips rotate or lumbar spine dip.',
            breathing: 'Maintain abdominal wall stiffness while breathing shallowly over the brace.',
            youtubeId: '0_yYxZ0i9d8',
          },
          {
            name: 'Modified Side Plank on Knees',
            setsReps: '3 sets of 20-30s each side',
            cues: 'Elbow directly under shoulder. Lift hips so thighs, torso, and head form a straight line. Squeeze glutes.',
            breathing: 'Steady rhythmic nostril breathing.',
            youtubeId: 'pSHjTRCQxIw',
          },
          {
            name: 'Glute Bridge with 3s Lockout Hold',
            setsReps: '3 sets of 10 reps',
            cues: 'Drive through heels. Extend hips until straight line from knees to shoulders without hyperextending back.',
            breathing: 'Exhale forcefully at peak contraction, locking glute fibers.',
            youtubeId: 'Oqsq820y4g0',
          },
        ],
      },
      {
        phase: 3,
        title: 'Phase 3: Functional Hip Hinge & Loading Tolerance',
        objective: 'Restore full everyday lifting mechanics and build posterior chain capacity to prevent recurrent episodes.',
        durationWeeks: 'Weeks 4–8+',
        drills: [
          {
            name: 'Dowel-Rod Hip Hinge against Wall',
            setsReps: '3 sets of 10 reps',
            cues: 'Hold dowel behind spine touching head, thoracic spine, and sacrum. Hinge back until glutes touch wall.',
            breathing: 'Inhale on descent, exhale on drive.',
            youtubeId: '0_yYxZ0i9d8',
          },
          {
            name: 'Suitcase Carry (Unilateral Loaded March)',
            setsReps: '3 sets of 30 meters per arm',
            cues: 'Hold moderate dumbbell in one hand. Walk tall without tilting toward or away from the weight.',
            breathing: 'Continuous calm nasal breathing.',
            youtubeId: 'MeIiIdhvXT4',
          },
          {
            name: 'Goblet Squat to Box',
            setsReps: '3 sets of 8-10 reps',
            cues: 'Hold weight at chest. Sit back softly to high box or chair, stand up pushing floor away.',
            breathing: 'Inhale down, powerful exhale on upward push.',
            youtubeId: 'MeIiIdhvXT4',
          },
        ],
      },
    ],
  },
  {
    id: 'pain_tech_neck',
    title: 'Tech Neck & Cervical Kyphosis / Forward Head Posture',
    affectedArea: 'Cervical Spine (C1-C7), Upper Trapezius & Levator Scapulae',
    conditionSummary:
      'Chronic cervical strain caused by downward screen tilt. For every inch the head tilts forward, the effective weight on cervical vertebrae increases dramatically (up to 27kg at 60 degrees tilt).',
    biomechanicalCause:
      'Prolonged forward head translation lengthens and inhibits deep cervical flexors (Longus Colli, Longus Capitis) while hyper-activating suboccipital extensors and upper traps in an Upper Crossed Syndrome pattern.',
    redFlags: [
      'Shooting electric pain or numbness traveling down arm into fingers',
      'Loss of fine motor skills in hands (e.g. difficulty buttoning a shirt)',
      'Severe dizziness, nausea, or visual disturbances when turning neck',
      'Sudden onset of thunderclap headache',
    ],
    dos: [
      'Elevate computer monitors and phone displays so eyes meet the top third of screen.',
      'Perform chin tucks every 45 minutes to re-educate deep cervical flexors.',
      'Incorporate mid-back thoracic extension foam rolling and open book drills.',
      'Use a supportive ergonomic pillow that keeps cervical spine aligned horizontally.',
    ],
    donts: [
      'Do not vigorously crack or wrench your neck side to side.',
      'Avoid looking down at smartphone on lap for continuous extended periods.',
      'Do not sleep on stomach with neck rotated 90 degrees.',
    ],
    biomechanicsUrl: 'https://exrx.net/Kinesiology/Posture',
    youtubeGuideUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    anatomyImageUrl: ASSETS.physioMobility,
    phases: [
      {
        phase: 1,
        title: 'Phase 1: Suboccipital Release & Postural Reset',
        objective: 'Relieve acute spasm in upper trapezius and restore axial head alignment.',
        durationWeeks: 'Weeks 1–2',
        drills: [
          {
            name: 'Supine Double-Chin Retractions',
            setsReps: '3 sets of 10 reps (5s hold)',
            cues: 'Lie flat without pillow. Draw chin straight back into throat as if making a double chin. Feel back of neck elongate.',
            breathing: 'Inhale relaxed, exhale smoothly during 5-second chin tuck hold.',
            youtubeId: 'bEv6CCg2BC8',
          },
          {
            name: 'Levator Scapulae & Upper Trap Gentle Stretch',
            setsReps: '3 sets of 30s each side',
            cues: 'Turn head 45 degrees, gently lower nose toward armpit using light hand touch on head.',
            breathing: 'Long calming exhalations to facilitate neuromuscular release.',
            youtubeId: 'IODxDxX7oi4',
          },
          {
            name: 'Seated Doorway Thoracic Expansion',
            setsReps: '3 sets of 30s',
            cues: 'Hands on doorframe at shoulder level. Step through gently to expand tight pectorals.',
            breathing: 'Inhale into upper ribcage.',
            youtubeId: 'IODxDxX7oi4',
          },
        ],
      },
      {
        phase: 2,
        title: 'Phase 2: Deep Flexor Strengthening & Scapular Anchoring',
        objective: 'Strengthen the posture-holding musculature of the upper back and deep anterior neck.',
        durationWeeks: 'Weeks 2–4',
        drills: [
          {
            name: 'Wall Angels with Chin Retraction',
            setsReps: '3 sets of 8 slow reps',
            cues: 'Stand with heels, sacrum, mid-back, and head against wall. Slide arms up and down keeping elbows and wrists flat.',
            breathing: 'Exhale as hands slide overhead, inhale as elbows return to ribs.',
            youtubeId: 'IODxDxX7oi4',
          },
          {
            name: 'Prone Cobra (Y-T Scapular Retractions)',
            setsReps: '3 sets of 10 reps (3s hold)',
            cues: 'Lie face down. Lift chest 2 inches off mat, rotate thumbs toward ceiling, squeeze shoulder blades down and back.',
            breathing: 'Exhale on lift, steady nostril breaths during hold.',
            youtubeId: 'pYcpY20QaE8',
          },
        ],
      },
      {
        phase: 3,
        title: 'Phase 3: Ergonomic Conditioning & Pulling Endurance',
        objective: 'Solidify posture under resistance so back muscles hold optimal alignment effortlessly all day.',
        durationWeeks: 'Weeks 4–8+',
        drills: [
          {
            name: 'Band Pull-Aparts at Eye Level',
            setsReps: '3 sets of 15 reps',
            cues: 'Hold light resistance band. Pull apart till band touches sternum while keeping neck tall and relaxed.',
            breathing: 'Exhale on pull, inhale on controlled 2-second return.',
            youtubeId: 'pYcpY20QaE8',
          },
          {
            name: 'Face Pulls with External Shoulder Rotation',
            setsReps: '3 sets of 12 reps',
            cues: 'Pull cable or band toward bridge of nose, ending with thumbs pointing behind ears.',
            breathing: 'Exhale smoothly as elbows drive back and wrists rotate.',
            youtubeId: 'qEwKCR5JCog',
          },
        ],
      },
    ],
  },
  {
    id: 'pain_runners_knee',
    title: "Runner’s Knee & Patellofemoral Pain Syndrome (PFPS)",
    affectedArea: 'Patellofemoral Joint & Anterior Knee',
    conditionSummary:
      'Peripatellar or retropatellar aching brought on by stairs, squatting, kneeling, or running. Typically caused by improper tracking of the patella within the femoral trochlear groove.',
    biomechanicalCause:
      'Weakness in hip abductors (Gluteus Medius) and Vastus Medialis Oblique (VMO) combined with tight IT band or calf tissues causes dynamic knee valgus (caving inward) during loading.',
    redFlags: [
      'Rapid hot joint swelling within 2 hours of injury',
      'Inability to bear weight or walk 4 steps',
      'Knee giving way, catching, or locking in bent position (possible meniscus tear)',
      'Visible deformity or fever over the joint',
    ],
    dos: [
      'Incorporate isometric Spanish squats or wall sits at 45-60 degrees to calm patellar tendon nociceptors.',
      'Strengthen hip stabilizers (Gluteus Medius) with side planks and clamshells.',
      'Foam roll lateral quadriceps and calves to reduce lateral patellar pull.',
      'Wear supportive footwear with adequate arch support.',
    ],
    donts: [
      'Do not perform heavy deep knee flexion squats past 90 degrees during the acute flare.',
      'Avoid high-impact plyometric jumping and steep downhill running.',
      'Do not allow knees to cave inward during any lower-body exercise.',
    ],
    biomechanicsUrl: 'https://exrx.net/Kinesiology/KneePain',
    youtubeGuideUrl: 'https://www.youtube.com/watch?v=MeIiIdhvXT4',
    anatomyImageUrl: ASSETS.heroWorkout,
    phases: [
      {
        phase: 1,
        title: 'Phase 1: Analgesic Isometric Loading',
        objective: 'Leverage tendon isometric holds to achieve immediate pain reduction and normalize neuromuscular drive.',
        durationWeeks: 'Weeks 1–2',
        drills: [
          {
            name: 'Isometric Wall Sit with Yoga Block Squeeze',
            setsReps: '4 sets of 45s holds',
            cues: 'Back against wall, knees at 60 degrees. Squeeze yoga block between knees to activate VMO and glutes.',
            breathing: 'Deep steady nasal inhalations and relaxed pursed-lip exhalations.',
            youtubeId: 'MeIiIdhvXT4',
          },
          {
            name: 'Side-Lying Hip Clamshells with Slow Eccentric',
            setsReps: '3 sets of 15 reps each side',
            cues: 'Keep feet glued together, rotate top knee skyward without rolling pelvis backward.',
            breathing: 'Exhale on lift, inhale on 2-second lowering.',
            youtubeId: 'Oqsq820y4g0',
          },
          {
            name: 'Straight Leg Raise with Locked Quad',
            setsReps: '3 sets of 12 reps (3s top hold)',
            cues: 'Lock knee completely straight, pull toes toward shin, raise leg 12 inches.',
            breathing: 'Inhale down, exhale up.',
            youtubeId: 'MeIiIdhvXT4',
          },
        ],
      },
      {
        phase: 2,
        title: 'Phase 2: Closed-Kinetic Chain Tracking Drills',
        objective: 'Progress from isometrics to controlled eccentric loading and hip-hinge synergy.',
        durationWeeks: 'Weeks 2–5',
        drills: [
          {
            name: 'Poliquin Step-Down (4-Inch Box)',
            setsReps: '3 sets of 10 reps each leg',
            cues: 'Stand on low step. Tap heel of non-working leg to floor by pushing knee forward over toes in line with 2nd toe.',
            breathing: 'Controlled inhale down (3s), smooth exhale up (1s).',
            youtubeId: 'MeIiIdhvXT4',
          },
          {
            name: 'Banded Monster Walks (Knee-Level Band)',
            setsReps: '3 sets of 15 steps left and right',
            cues: 'Quarter squat position. Step diagonally forward keeping knees pushed out against band tension.',
            breathing: 'Rhythmic breath matching stride.',
            youtubeId: 'Oqsq820y4g0',
          },
        ],
      },
      {
        phase: 3,
        title: 'Phase 3: High-Capacity Squatting & Deceleration',
        objective: 'Rebuild full athletic knee resilience and load tolerance for running, jumping, and deep squats.',
        durationWeeks: 'Weeks 5–8+',
        drills: [
          {
            name: 'Tempo Goblet Squats (3s Eccentric)',
            setsReps: '3 sets of 10-12 reps',
            cues: 'Dumbbell at sternum. Lower for 3 seconds with knees tracking over pinky toes.',
            breathing: 'Inhale on 3-second descent, powerful exhale past sticking point.',
            youtubeId: 'MeIiIdhvXT4',
          },
          {
            name: 'Single-Leg Romanian Deadlift (RDL)',
            setsReps: '3 sets of 8 reps per leg',
            cues: 'Hinge back on single leg, stabilizing knee with glutes and hamstrings.',
            breathing: 'Inhale back, exhale upright.',
            youtubeId: '0_yYxZ0i9d8',
          },
        ],
      },
    ],
  },
  {
    id: 'pain_shoulder_impingement',
    title: 'Shoulder Impingement & Rotator Cuff Tendinopathy',
    affectedArea: 'Glenohumeral Joint, Supraspinatus & Subacromial Bursa',
    conditionSummary:
      'Pain or pinching felt at the top or lateral side of the shoulder, particularly during overhead pressing, reaching behind the back, or side sleeping. Caused by narrowing of the subacromial space.',
    biomechanicalCause:
      'Superior migration of the humeral head due to weak rotator cuff depressors (Infraspinatus, Teres Minor, Subscapularis) and poor upward scapular rotation by Serratus Anterior.',
    redFlags: [
      'Inability to raise arm actively at all (Drop Arm Test positive - suspect full tear)',
      'Deep, throbbing, unrelenting night ache that awakens you from sleep constantly',
      'Shoulder dislocation or sudden traumatic deformity',
      'Chest pain or radiating numbness (rule out cardiac etiology)',
    ],
    dos: [
      'Press strictly in the scapular plane (elbows angled 30 degrees forward of torso).',
      'Strengthen Serratus Anterior with wall slides and push-up plus protractions.',
      'Perform light high-rep external rotations with a towel roll under armpit.',
      'Sleep on unaffected side or on back with arm supported on a soft pillow.',
    ],
    donts: [
      'Avoid upright barbell rows with flared elbows and internal rotation.',
      'Do not bench press with elbows flared 90 degrees out perpendicular to torso.',
      'Do not push through sharp anterior shoulder pinching.',
    ],
    biomechanicsUrl: 'https://exrx.net/Kinesiology/ShoulderPain',
    youtubeGuideUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    anatomyImageUrl: ASSETS.physioMobility,
    phases: [
      {
        phase: 1,
        title: 'Phase 1: Subacromial Decompression & Rotator Activation',
        objective: 'Centralize humeral head in glenoid fossa and open up subacromial space.',
        durationWeeks: 'Weeks 1–2',
        drills: [
          {
            name: 'Side-Lying External Rotation with Towel Roll',
            setsReps: '3 sets of 15 reps (1-2kg or light band)',
            cues: 'Place rolled towel between elbow and ribs. Rotate forearm upward without hiking shoulder.',
            breathing: 'Inhale down, smooth exhale as wrist rotates up.',
            youtubeId: 'qEwKCR5JCog',
          },
          {
            name: 'Foam Roller Serratus Wall Slides',
            setsReps: '3 sets of 10 slow upward slides',
            cues: 'Forearms on roller against wall. Push into roller engaging serratus as arms glide upward into a V.',
            breathing: 'Exhale reaching up, inhale returning to 90 degrees.',
            youtubeId: 'IODxDxX7oi4',
          },
          {
            name: 'Sleeper Stretch / Cross-Body Posterior Capsule Mobilization',
            setsReps: '2 sets of 30s gentle holds',
            cues: 'Lie on side, gently guide wrist downward or pull arm across chest without pain.',
            breathing: 'Calm relaxed breathing.',
            youtubeId: 'qEwKCR5JCog',
          },
        ],
      },
      {
        phase: 2,
        title: 'Phase 2: Scapular Upward Rotation & Dynamic Stability',
        objective: 'Coordinate rotator cuff firing with scapular movement during pressing and pulling.',
        durationWeeks: 'Weeks 2–4',
        drills: [
          {
            name: 'Prone Y-T-W Raises on Incline Bench',
            setsReps: '2 sets of 8 reps per position',
            cues: 'Thumbs pointing toward ceiling. Squeeze lower traps and mid-back to initiate movement.',
            breathing: 'Exhale on lift, 1s peak squeeze, inhale down.',
            youtubeId: 'pYcpY20QaE8',
          },
          {
            name: 'Kettlebell Bottoms-Up Carry',
            setsReps: '3 sets of 20 meters each arm',
            cues: 'Hold kettlebell upside down with elbow at 90 degrees. Demands constant rotator cuff micro-adjustments.',
            breathing: 'Braced steady breathing.',
            youtubeId: 'MeIiIdhvXT4',
          },
        ],
      },
      {
        phase: 3,
        title: 'Phase 3: Scapular Plane Overhead Strength',
        objective: 'Restore full overhead pressing power and bulletproof the rotator cuff against athletic fatigue.',
        durationWeeks: 'Weeks 4–8+',
        drills: [
          {
            name: 'Neutral Grip Dumbbell Overhead Press',
            setsReps: '3 sets of 8-10 reps',
            cues: 'Palms facing each other in scapular plane. Press overhead without arching lower back.',
            breathing: 'Inhale at chest, powerful exhale overhead.',
            youtubeId: 'qEwKCR5JCog',
          },
          {
            name: 'Single-Arm Dumbbell Row with Strict Retraction',
            setsReps: '3 sets of 10-12 reps',
            cues: 'Pull elbow towards hip pocket, retracting shoulder blade without shrugging.',
            breathing: 'Exhale row, inhale lower.',
            youtubeId: 'pYcpY20QaE8',
          },
        ],
      },
    ],
  },
  {
    id: 'pain_plantar_fasciitis',
    title: 'Plantar Fasciitis & Heel Spur Discomfort',
    affectedArea: 'Plantar Aponeurosis, Medial Calcaneus & Achilles Tendon',
    conditionSummary:
      'Sharp, stabbing pain at the base of the heel, characteristically excruciating during the first few steps in the morning or after resting, which temporarily loosens with walking.',
    biomechanicalCause:
      'Repetitive micro-tearing and degenerative thickening of the plantar fascia where it attaches to the calcaneus, exacerbated by tight gastrocnemius-soleus complex and rigid/flat foot arches.',
    redFlags: [
      'Numbness or pins-and-needles across sole of foot (tarsal tunnel syndrome)',
      'Sudden loud pop or snap in heel accompanied by inability to bear weight',
      'Visible redness, warmth, or systemic fever (rule out septic arthritis or gout)',
    ],
    dos: [
      'Roll sole of foot over a frozen water bottle or lacrosse ball for 5 minutes morning and night.',
      'Perform eccentric calf heel-drops off a step with a towel roll under toes (Rathleff protocol).',
      'Stretch calf muscles with straight-knee and bent-knee variations.',
      'Wear cushioned footwear or supportive orthotics rather than walking barefoot on hard tile floors.',
    ],
    donts: [
      'Do not walk barefoot on hard ceramic or hardwood floors, especially first thing in the morning.',
      'Avoid sudden spikes in running mileage or transitioning abruptly to minimalist zero-drop shoes.',
      'Do not ignore heel pain until it becomes a chronic calcification.',
    ],
    biomechanicsUrl: 'https://exrx.net/Kinesiology/PlantarFasciitis',
    youtubeGuideUrl: 'https://www.youtube.com/watch?v=MeIiIdhvXT4',
    anatomyImageUrl: ASSETS.heroWorkout,
    phases: [
      {
        phase: 1,
        title: 'Phase 1: Morning De-Sensitization & Ice Massage',
        objective: 'Reduce acute fascial irritation and stretch the windlass mechanism before weight-bearing.',
        durationWeeks: 'Weeks 1–2',
        drills: [
          {
            name: 'Frozen Bottle Arch Roll',
            setsReps: '5 mins twice daily',
            cues: 'Roll foot slowly from heel to ball of foot over frozen bottle applying moderate, comfortable pressure.',
            breathing: 'Slow relaxed nasal breathing.',
            youtubeId: 'bEv6CCg2BC8',
          },
          {
            name: 'Great Toe Dorsiflexion Stretch (Windlass)',
            setsReps: '3 sets of 30s holds before getting out of bed',
            cues: 'Cross ankle over opposite knee. Pull big toe back towards shin until gentle stretch is felt in arch.',
            breathing: 'Gentle, calm breaths.',
            youtubeId: 'bEv6CCg2BC8',
          },
        ],
      },
      {
        phase: 2,
        title: 'Phase 2: Rathleff High-Load Strength Protocol',
        objective: 'Stimulate collagen remodeling and tensile capacity of the plantar fascia tendon fibers.',
        durationWeeks: 'Weeks 2–6',
        drills: [
          {
            name: 'Eccentric Heel Drops with Rolled Towel under Toes',
            setsReps: '3 sets of 12 reps (every other day)',
            cues: 'Stand on step with rolled towel under toes to engage windlass. Rise up on 2 feet (3s), lower on affected foot (3s).',
            breathing: 'Exhale on rise, inhale on slow 3-second descent.',
            youtubeId: 'MeIiIdhvXT4',
          },
          {
            name: 'Seated Towel Scrunches with Toes',
            setsReps: '3 sets of 2 mins',
            cues: 'Place towel on smooth floor. Use toes to scrunch and pull towel towards you, strengthening foot intrinsics.',
            breathing: 'Even relaxed breathing.',
            youtubeId: 'bEv6CCg2BC8',
          },
        ],
      },
      {
        phase: 3,
        title: 'Phase 3: Kinetic Chain & Ankle Plyometric Capacity',
        objective: 'Restore calf, ankle, and arch shock absorption during walking and running gait.',
        durationWeeks: 'Weeks 6–10+',
        drills: [
          {
            name: 'Single-Leg Standing Balance on Foam / Cushion',
            setsReps: '3 sets of 45s each leg',
            cues: 'Stand tall with knee slightly soft. Engage foot tripod (big toe, pinky toe, heel).',
            breathing: 'Calm rhythm.',
            youtubeId: 'MeIiIdhvXT4',
          },
          {
            name: 'Tibialis Anterior Wall Raises',
            setsReps: '3 sets of 20 reps',
            cues: 'Lean back against wall, heels 12 inches out. Pull toes up toward ceiling to strengthen shin muscles.',
            breathing: 'Exhale on toe lift, inhale down.',
            youtubeId: 'MeIiIdhvXT4',
          },
        ],
      },
    ],
  },
  {
    id: 'pain_anterior_pelvic_tilt',
    title: 'Anterior Pelvic Tilt (APT) & Chronic Hip Flexor Tightness',
    affectedArea: 'Pelvis, Iliopsoas, Rectus Femoris & Lower Lumbar',
    conditionSummary:
      'A postural alignment where the front of the pelvis rotates forward and downward, accentuating the lower back curve (hyperlordosis) and making the lower abdomen protrude even at low body fat.',
    biomechanicalCause:
      'Reciprocal inhibition caused by chronic sitting: short, hypertonic hip flexors (Psoas, Rectus Femoris) inhibit Gluteus Maximus and Transverse Abdominis, locking the pelvis into forward rotation.',
    redFlags: [
      'Groin clicking accompanied by sharp catching sensation (possible hip labral tear)',
      'Sharp radiating numbness into front of thigh (meralgia paresthetica)',
    ],
    dos: [
      'Perform deep couch stretch or half-kneeling hip flexor stretch with active posterior pelvic tilt.',
      'Focus on glute bridges with posterior pelvic scoop (flattening back against mat at start).',
      'Incorporate deadbugs and hollow body holds to restore abdominal anti-extension control.',
    ],
    donts: [
      'Do not stretch hip flexors by overarching your lumbar spine.',
      'Avoid heavy leg presses or leg extensions without core stabilization.',
      'Do not sleep on stomach which forces lumbar spine into sustained hyperextension.',
    ],
    biomechanicsUrl: 'https://exrx.net/Kinesiology/Posture',
    youtubeGuideUrl: 'https://www.youtube.com/watch?v=Oqsq820y4g0',
    anatomyImageUrl: ASSETS.physioMobility,
    phases: [
      {
        phase: 1,
        title: 'Phase 1: Hip Flexor Downregulation & Posterior Tilt Reset',
        objective: 'Inhibit hyperactive psoas and teach conscious posterior pelvic tilt control.',
        durationWeeks: 'Weeks 1–2',
        drills: [
          {
            name: 'Half-Kneeling Posterior Tilt Psoas Stretch',
            setsReps: '3 sets of 45s each side',
            cues: 'Half-kneeling. Tuck pelvis under (tailbone between legs) and squeeze glute of rear leg. Shift forward only 1-2 inches.',
            breathing: 'Inhale tall, exhale deepening the glute squeeze.',
            youtubeId: 'bEv6CCg2BC8',
          },
          {
            name: 'Supine Posterior Pelvic Tilts on Mat',
            setsReps: '3 sets of 15 reps (3s hold)',
            cues: 'Lie flat with knees bent. Contract lower abs to press lumbar spine completely flush against mat.',
            breathing: 'Exhale forcefully flattening back into floor.',
            youtubeId: 'Oqsq820y4g0',
          },
        ],
      },
      {
        phase: 2,
        title: 'Phase 2: Gluteal Activation & Anti-Extension Core',
        objective: 'Strengthen the anterior-posterior force couple (Glutes + Rectus/Transverse Abdominis).',
        durationWeeks: 'Weeks 2–4',
        drills: [
          {
            name: 'Deadbug with Lumbar Floor Contact',
            setsReps: '3 sets of 8 reps per side',
            cues: 'Maintain absolute contact between lower back and floor as opposite arm and leg extend outward.',
            breathing: 'Inhale center, exhale forcefully extending limbs without letting lower back arch off mat.',
            youtubeId: 'IODxDxX7oi4',
          },
          {
            name: 'Glute Bridge with 3s Squeeze & Core Brace',
            setsReps: '3 sets of 12 reps',
            cues: 'Tuck pelvis, drive heels, lock out at top strictly using gluteal contraction.',
            breathing: 'Exhale top, inhale descent.',
            youtubeId: 'Oqsq820y4g0',
          },
        ],
      },
      {
        phase: 3,
        title: 'Phase 3: Upright Dynamic Hinge & Squat Integration',
        objective: 'Anchor neutral pelvis during functional loaded movements.',
        durationWeeks: 'Weeks 4–8+',
        drills: [
          {
            name: 'Romanian Deadlift with Neutral Pelvic Lock',
            setsReps: '3 sets of 10 reps',
            cues: 'Hinge back with ribs down. Lock out at top by squeezing glutes into neutral without leaning back.',
            breathing: 'Inhale down, exhale up.',
            youtubeId: '0_yYxZ0i9d8',
          },
          {
            name: 'Split Squat with Vertical Torso',
            setsReps: '3 sets of 8 reps per leg',
            cues: 'Keep pelvis tucked in posterior neutral throughout descent and ascent.',
            breathing: 'Inhale down, exhale up.',
            youtubeId: 'MeIiIdhvXT4',
          },
        ],
      },
    ],
  },
];
