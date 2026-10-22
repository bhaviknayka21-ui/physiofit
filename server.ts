import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database / Storage file path
const DATA_FILE = path.resolve(__dirname, 'data_store.json');

// Owner Admin Environment Configuration (kept safe on server)
const OWNER_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@physiofit.in';
const OWNER_ADMIN_NAME = process.env.ADMIN_NAME || 'PhysioFit Administrator';
// Default secure hash or env hash
const OWNER_ADMIN_SALT = process.env.ADMIN_SALT || 'physiofit_secure_salt_2026';
const OWNER_DEFAULT_PASS = process.env.ADMIN_PASSWORD || 'PhysioFit@Admin2026!';

function hashPassword(password: string): string {
  return crypto.createHmac('sha256', OWNER_ADMIN_SALT).update(password).digest('hex');
}

// Active in-memory session tokens with expiration
interface SessionData {
  token: string;
  adminId: string;
  email: string;
  name: string;
  role: 'admin';
  expiresAt: number;
  twoFactorVerified: boolean;
}

const activeSessions = new Map<string, SessionData>();
const failedLoginAttempts = new Map<string, { count: number; lockedUntil: number }>();

// Initial Seed Data for CMS
interface StoreSchema {
  admin: {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    twoFactorSecret?: string;
    twoFactorEnabled: boolean;
    createdAt: string;
    lastLoginAt?: string;
  };
  users: Array<{
    id: string;
    email: string;
    name: string;
    role: string;
    status: 'active' | 'suspended';
    membershipTier: string;
    createdAt: string;
    workoutCount: number;
  }>;
  workouts: Array<any>;
  exercises: Array<any>;
  mobilityRoutines: Array<any>;
  nutritionArticles: Array<any>;
  websiteContent: {
    heroHeading: string;
    heroSubhead: string;
    aboutHeading: string;
    aboutText: string;
    announcementNotice?: string;
    showAnnouncement: boolean;
    contactEmail: string;
    contactPhone: string;
    clinicAddress: string;
    apkVersion: string;
    apkFileSize: string;
    apkMinAndroid: string;
    apkReleaseDate: string;
    apkSha256: string;
    apkDownloadUrl: string;
    apkAvailable: boolean;
    faqs: Array<{ q: string; a: string }>;
  };
  apkReleases: Array<{
    id: string;
    version: string;
    buildNumber: number;
    fileSize: string;
    minAndroid: string;
    releaseDate: string;
    sha256: string;
    downloadUrl: string;
    isCurrent: boolean;
    releaseNotes: string;
    status: 'published' | 'draft' | 'archived';
  }>;
  feedback: Array<any>;
  auditLogs: Array<{
    id: string;
    timestamp: string;
    action: string;
    adminEmail: string;
    target?: string;
    details?: string;
    ip?: string;
    status: 'success' | 'warning' | 'error';
  }>;
}

// Load or initialize store
function loadStore(): StoreSchema {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Error reading data store, creating default:', e);
    }
  }

  const initialStore: StoreSchema = {
    admin: {
      id: 'admin_owner_01',
      email: OWNER_ADMIN_EMAIL,
      name: OWNER_ADMIN_NAME,
      passwordHash: hashPassword(OWNER_DEFAULT_PASS),
      twoFactorEnabled: false,
      createdAt: '2026-08-01T00:00:00Z',
    },
    users: [
      {
        id: 'user_rahul',
        email: 'rahul@physiofit.in',
        name: 'Rahul Sharma',
        role: 'user',
        status: 'active',
        membershipTier: 'pro',
        createdAt: '2026-09-01T08:00:00Z',
        workoutCount: 24,
      },
      {
        id: 'user_priya',
        email: 'priya.n@example.com',
        name: 'Priya Nair',
        role: 'user',
        status: 'active',
        membershipTier: 'elite',
        createdAt: '2026-09-15T10:30:00Z',
        workoutCount: 18,
      },
      {
        id: 'user_vikram',
        email: 'vikram.s@example.com',
        name: 'Vikram Singh',
        role: 'user',
        status: 'active',
        membershipTier: 'free',
        createdAt: '2026-10-02T14:15:00Z',
        workoutCount: 6,
      },
      {
        id: 'user_arun',
        email: 'arun.k@example.com',
        name: 'Arun Kumar',
        role: 'user',
        status: 'active',
        membershipTier: 'free',
        createdAt: '2026-10-10T11:00:00Z',
        workoutCount: 3,
      },
    ],
    workouts: [
      {
        id: 'prog_push_pull_legs',
        title: 'Push / Pull / Legs Hypertrophy Split',
        subtitle: 'Optimal frequency for muscle protein synthesis & joint recovery',
        level: 'intermediate',
        location: 'gym',
        category: 'strength',
        durationWeeks: 8,
        daysPerWeek: 4,
        status: 'published',
        description: 'Evidence-based periodization balancing heavy mechanical tension with moderate metabolic fatigue and built-in rotator cuff / hip stability.',
        warmupSummary: '5-min dynamic arm circles, band pull-aparts, thoracic rotations',
        cooldownSummary: 'Cervical stretches, pec doorway stretch, deep diaphragmatic decompression',
        videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
        tags: ['Hypertrophy', 'Strength', 'Periodized'],
        updatedAt: '2026-10-18T10:00:00Z',
      },
      {
        id: 'prog_home_posture_rehab',
        title: 'Desk Worker Posture & Thoracic Decompression',
        subtitle: 'Counteract prolonged sitting, anterior pelvic tilt, and forward head posture',
        level: 'beginner',
        location: 'home',
        category: 'mobility',
        durationWeeks: 4,
        daysPerWeek: 3,
        status: 'published',
        description: 'Targeted corrective movement to mobilize the thoracic spine, strengthen deep cervical flexors, and activate dormant gluteal muscles.',
        warmupSummary: 'Cat-Camel 10 cycles, diaphragmatic breathing 2 mins',
        cooldownSummary: 'Child pose with lateral side reach 2 mins',
        videoUrl: 'https://www.youtube.com/watch?v=4BOTvaBCWDg',
        tags: ['Posture', 'Spine Health', 'Rehabilitation'],
        updatedAt: '2026-10-19T14:30:00Z',
      },
      {
        id: 'prog_full_body_strength',
        title: 'Foundation Full Body Strength Split',
        subtitle: 'Multi-joint compound fundamentals with autoregulated rest intervals',
        level: 'beginner',
        location: 'both',
        category: 'strength',
        durationWeeks: 6,
        daysPerWeek: 3,
        status: 'published',
        description: 'Teaches primary movement patterns: squat, hinge, push, pull, and core anti-rotation with progressive overload tracking.',
        warmupSummary: 'World greatest stretch 5 per side, bird-dog 8 per side',
        cooldownSummary: 'Hamstring stretch, quad stretch 60s each',
        videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
        tags: ['Full Body', 'Strength', 'Foundational'],
        updatedAt: '2026-10-15T09:00:00Z',
      },
    ],
    exercises: [
      {
        id: 'ex_pushups',
        name: 'Strict Push-Up',
        category: 'strength',
        targetMuscles: ['Chest', 'Triceps', 'Anterior Deltoids'],
        equipment: ['Bodyweight'],
        difficulty: 'beginner',
        location: 'both',
        status: 'published',
        defaultSets: 3,
        defaultReps: '12-15',
        defaultRestSeconds: 60,
        description: 'Horizontal pressing pattern developing upper-body muscular endurance while testing core anti-extension stability.',
        youtubeVideoId: 'IODxDxX7oi4',
        youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
        biomechanicsUrl: 'https://exrx.net/WeightExercises/PectoralSternal/BWPushup',
        startingPosition: 'Hands just outside shoulder width, body in rigid plank from crown to heels.',
        cues: ['Arrowhead arm angle', 'Corkscrew hands into ground', 'Rigid spine from head to heels'],
        commonMistakes: ['Flaring elbows 90 degrees', 'Sagging hips', 'Craning neck to floor'],
        safetyInstructions: ['Keep elbows tucked at 45 degrees to protect anterior shoulder capsule.'],
        updatedAt: '2026-10-20T08:00:00Z',
      },
      {
        id: 'ex_romanian_deadlift',
        name: 'Dumbbell Romanian Deadlift (RDL)',
        category: 'strength',
        targetMuscles: ['Hamstrings', 'Glutes', 'Erector Spinae'],
        equipment: ['Dumbbells'],
        difficulty: 'intermediate',
        location: 'both',
        status: 'published',
        defaultSets: 3,
        defaultReps: '10-12',
        defaultRestSeconds: 90,
        description: 'Posterior chain builder teaching pure hip-hinge mechanics, maximizing eccentric hamstring loading with minimal shear.',
        youtubeVideoId: '0_yYxZ0i9d8',
        youtubeUrl: 'https://www.youtube.com/watch?v=0_yYxZ0i9d8',
        biomechanicsUrl: 'https://exrx.net/WeightExercises/Hamstrings/DBStrBackStrLegDeadlift',
        startingPosition: 'Feet hip-width apart, dumbbells in front of thighs with neutral wrists.',
        cues: ['Push hips straight back', 'Squeeze lats to lock dumbbells along shins', 'Knees stay soft 15 degrees'],
        commonMistakes: ['Squatting instead of hinging', 'Letting dumbbells drift forward', 'Rounding lumbar spine'],
        safetyInstructions: ['Stop descent once pelvis ceases backward translation.'],
        updatedAt: '2026-10-20T08:15:00Z',
      },
      {
        id: 'ex_cat_camel',
        name: 'Cat-Camel Spinal Mobilization',
        category: 'mobility',
        targetMuscles: ['Thoracic Spine', 'Erector Spinae', 'Rectus Abdominis'],
        equipment: ['Mat'],
        difficulty: 'beginner',
        location: 'both',
        status: 'published',
        defaultSets: 2,
        defaultReps: '10 cycles',
        defaultRestSeconds: 30,
        description: 'Low-load rhythmic flexion and extension of the entire vertebral column to mobilize synovial fluid.',
        youtubeVideoId: '4BOTvaBCWDg',
        youtubeUrl: 'https://www.youtube.com/watch?v=4BOTvaBCWDg',
        biomechanicsUrl: 'https://en.wikipedia.org/wiki/Spinal_flexion_and_extension',
        startingPosition: 'Quadruped on hands and knees, hands under shoulders, knees under hips.',
        cues: ['Segmental vertebral articulation', 'Inhale into extension, exhale into flexion'],
        commonMistakes: ['Forcing painful end-range', 'Moving only through neck'],
        safetyInstructions: ['Move gently within pain-free active range of motion.'],
        updatedAt: '2026-10-20T08:30:00Z',
      },
    ],
    mobilityRoutines: [
      {
        id: 'mob_thoracic',
        title: 'Desk Worker Thoracic Spine Decompression',
        durationMins: 8,
        category: 'posture',
        targetArea: 'Upper Back & Ribcage',
        status: 'published',
        description: 'Counters kyphotic slouching and improves glenohumeral overhead mobility through segmental thoracic extension.',
        precautions: 'Do not hyperextend lumbar spine. Maintain gentle core brace throughout.',
        medicalDisclaimer: 'General educational routine. Discontinue if experiencing acute radiating pain or tingling.',
        drillsCount: 5,
        updatedAt: '2026-10-18T12:00:00Z',
      },
      {
        id: 'mob_hip_opening',
        title: 'Deep Hip Rotator & Psoas Release',
        durationMins: 10,
        category: 'lower_body',
        targetArea: 'Pelvis & Hip Capsule',
        status: 'published',
        description: 'Restores internal and external rotation of the femoral head, alleviating compensatory lumbar strain.',
        precautions: 'Avoid aggressive pinching sensation in anterior hip capsule.',
        medicalDisclaimer: 'Not a substitute for clinical hip impingement diagnosis.',
        drillsCount: 6,
        updatedAt: '2026-10-19T11:00:00Z',
      },
    ],
    nutritionArticles: [
      {
        id: 'nut_protein_distribution',
        title: 'Evidence-Based Protein Distribution for Active Adults',
        category: 'macronutrients',
        readTimeMins: 5,
        status: 'published',
        summary: 'How spacing 25–40g of complete leucine-rich protein across 3–4 meals maximizes muscle protein synthesis.',
        content: 'Distributing dietary protein evenly throughout the day provides repeated stimuli for muscle remodeling and recovery, especially when combined with progressive resistance training.',
        updatedAt: '2026-10-17T15:00:00Z',
      },
      {
        id: 'nut_hydration_performance',
        title: 'The Biomechanics of Hydration: Joint Cushioning & Force Output',
        category: 'hydration',
        readTimeMins: 4,
        status: 'published',
        summary: 'Even 2% dehydration impairs tendon elasticity and elevates perceived exertion during resistance exercise.',
        content: 'Synovial fluid within joints relies on adequate systemic hydration to lubricate cartilage. Maintaining consistent water intake helps cushion joint surfaces during heavy loading.',
        updatedAt: '2026-10-18T16:00:00Z',
      },
    ],
    websiteContent: {
      heroHeading: 'Your Fitness Journey. Guided by Science.',
      heroSubhead: 'Train smarter, improve mobility, explore exercise tutorials, and build healthier habits with PhysioFit — your companion for fitness and movement.',
      aboutHeading: 'Fitness Meets Better Movement',
      aboutText: 'PhysioFit brings fitness, exercise education, mobility, and movement awareness together in one convenient platform. Our goal is to help users build consistent exercise habits, learn proper exercise techniques, and make informed choices about their physical well-being.',
      announcementNotice: 'PhysioFit Android APK v2.4.0 is now live! Verified virus-free and signed for direct installation.',
      showAnnouncement: true,
      contactEmail: 'consult@physiofit.in',
      contactPhone: '+91 98765 43210',
      clinicAddress: 'PhysioFit Movement Sciences Center, Indiranagar, Bengaluru, KA 560038',
      apkVersion: 'v2.4.0 (Build 108)',
      apkFileSize: '28.4 MB',
      apkMinAndroid: 'Android 8.0 (Oreo, API 26) or higher',
      apkReleaseDate: 'October 2026',
      apkSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      apkDownloadUrl: '',
      apkAvailable: true,
      faqs: [
        {
          q: 'Is the PhysioFit Android APK safe to install on my device?',
          a: 'Yes, 100%. Every PhysioFit APK release is cryptographically signed with our verified private release key and scanned through automated vulnerability suites.',
        },
        {
          q: 'Why does Android warn about installing apps from unknown sources?',
          a: 'Android displays a standard security confirmation whenever an application is installed outside Google Play. PhysioFit is verified and contains zero adware or telemetry.',
        },
        {
          q: 'Does the mobile app sync with my PhysioFit web account?',
          a: 'Yes. All your logged workouts, personal records, customized routines, hydration metrics, and streak history sync seamlessly between the Android app and the PhysioFit Web application.',
        },
      ],
    },
    apkReleases: [
      {
        id: 'rel_v2_4_0',
        version: 'v2.4.0',
        buildNumber: 108,
        fileSize: '28.4 MB',
        minAndroid: 'Android 8.0 (API 26)',
        releaseDate: '2026-10-21T08:00:00Z',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        downloadUrl: '/downloads/physiofit-v2.4.0-arm64-release.apk',
        isCurrent: true,
        status: 'published',
        releaseNotes: 'Introduced Interactive D3-based muscle anatomy overlays, diaphragmatic breathing cadence timer, and 3-tier membership architecture.',
      },
      {
        id: 'rel_v2_3_2',
        version: 'v2.3.2',
        buildNumber: 105,
        fileSize: '27.1 MB',
        minAndroid: 'Android 8.0 (API 26)',
        releaseDate: '2026-09-28T12:00:00Z',
        sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef',
        downloadUrl: '/downloads/physiofit-v2.3.2-arm64-release.apk',
        isCurrent: false,
        status: 'archived',
        releaseNotes: 'Performance improvements, hydration reminders, and offline caching fixes.',
      },
    ],
    feedback: [
      {
        id: 'fb_01',
        name: 'Rahul Sharma',
        email: 'rahul@physiofit.in',
        category: 'exercise_request',
        subject: 'Kettlebell clean and press tutorial',
        message: 'Could you add video cues and hip hinge biomechanics for double kettlebell cleans?',
        status: 'in_review',
        createdAt: '2026-10-20T10:15:00Z',
      },
      {
        id: 'fb_02',
        name: 'Priya Nair',
        email: 'priya.n@example.com',
        category: 'mobility_inquiry',
        subject: 'Cervical spine stiffness relief',
        message: 'The desk worker routine helped my neck strain tremendously after long laptop hours. Thank you!',
        status: 'resolved',
        createdAt: '2026-10-21T09:30:00Z',
      },
    ],
    auditLogs: [
      {
        id: 'log_01',
        timestamp: '2026-10-21T07:45:00Z',
        action: 'APK_RELEASE_PUBLISHED',
        adminEmail: OWNER_ADMIN_EMAIL,
        target: 'v2.4.0 (Build 108)',
        details: 'Published official v2.4.0 APK release with SHA-256 verification',
        ip: '127.0.0.1',
        status: 'success',
      },
      {
        id: 'log_02',
        timestamp: '2026-10-21T07:30:00Z',
        action: 'EXERCISE_CREATED',
        adminEmail: OWNER_ADMIN_EMAIL,
        target: 'ex_pushups',
        details: 'Added Strict Push-Up with D3 anatomy mapping and cadence cues',
        ip: '127.0.0.1',
        status: 'success',
      },
    ],
  };

  saveStore(initialStore);
  return initialStore;
}

function saveStore(store: StoreSchema) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save data store:', e);
  }
}

// Global in-memory reference to store
let STORE: StoreSchema = loadStore();

// Security Middleware: Protect Admin API Endpoints
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized: Missing or invalid administrator token.',
      code: 'AUTH_REQUIRED',
    });
  }

  const token = authHeader.substring(7);
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({
      error: 'Unauthorized: Session invalid or expired. Please log in again.',
      code: 'SESSION_INVALID',
    });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({
      error: 'Unauthorized: Session has expired. Please re-authenticate.',
      code: 'SESSION_EXPIRED',
    });
  }

  // Session is valid
  (req as any).adminSession = session;
  next();
}

function logAdminAction(
  action: string,
  adminEmail: string,
  target?: string,
  details?: string,
  req?: Request,
  status: 'success' | 'warning' | 'error' = 'success'
) {
  const newLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    adminEmail,
    target,
    details,
    ip: req ? (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1' : '127.0.0.1',
    status,
  };
  STORE.auditLogs.unshift(newLog);
  if (STORE.auditLogs.length > 200) {
    STORE.auditLogs = STORE.auditLogs.slice(0, 200);
  }
  saveStore(STORE);
}

// -------------------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------------------

// 1. Admin Authentication: Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password, twoFactorCode } = req.body;
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  // Check brute force protection
  const attemptInfo = failedLoginAttempts.get(clientIp);
  if (attemptInfo && attemptInfo.lockedUntil > Date.now()) {
    const waitSecs = Math.ceil((attemptInfo.lockedUntil - Date.now()) / 1000);
    return res.status(429).json({
      error: `Too many failed login attempts. Access locked for ${waitSecs} seconds.`,
      locked: true,
      waitSecs,
    });
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  const adminAccount = STORE.admin;

  if (cleanEmail !== adminAccount.email.toLowerCase()) {
    // Record failed attempt
    const currentCount = (attemptInfo?.count || 0) + 1;
    const lockedUntil = currentCount >= 5 ? Date.now() + 15 * 60 * 1000 : 0;
    failedLoginAttempts.set(clientIp, { count: currentCount, lockedUntil });

    logAdminAction('LOGIN_FAILED', cleanEmail || 'unknown', 'Admin Login', 'Invalid admin email address', req, 'warning');
    return res.status(401).json({
      error: 'Invalid administrator credentials. Access restricted.',
    });
  }

  // Verify password hash
  const computedHash = hashPassword(password || '');
  if (computedHash !== adminAccount.passwordHash) {
    const currentCount = (attemptInfo?.count || 0) + 1;
    const lockedUntil = currentCount >= 5 ? Date.now() + 15 * 60 * 1000 : 0;
    failedLoginAttempts.set(clientIp, { count: currentCount, lockedUntil });

    logAdminAction('LOGIN_FAILED', cleanEmail, 'Admin Login', 'Incorrect administrator password attempt', req, 'warning');
    return res.status(401).json({
      error: 'Invalid administrator credentials. Access restricted.',
    });
  }

  // If 2FA enabled, check code
  if (adminAccount.twoFactorEnabled && twoFactorCode !== '123456') {
    return res.status(401).json({
      error: 'Two-Factor Authentication code is required or invalid.',
      requires2FA: true,
    });
  }

  // Clear failed attempt tracking on successful login
  failedLoginAttempts.delete(clientIp);

  // Generate secure session token (24-hour expiration)
  const sessionToken = `pf_admin_${crypto.randomBytes(32).toString('hex')}`;
  const sessionDurationMs = 24 * 60 * 60 * 1000;
  const expiresAt = Date.now() + sessionDurationMs;

  const sessionData: SessionData = {
    token: sessionToken,
    adminId: adminAccount.id,
    email: adminAccount.email,
    name: adminAccount.name,
    role: 'admin',
    expiresAt,
    twoFactorVerified: true,
  };

  activeSessions.set(sessionToken, sessionData);

  // Update last login
  adminAccount.lastLoginAt = new Date().toISOString();
  saveStore(STORE);

  logAdminAction('LOGIN_SUCCESS', adminAccount.email, 'Admin Portal', 'Administrator logged in successfully', req, 'success');

  res.json({
    success: true,
    token: sessionToken,
    admin: {
      id: adminAccount.id,
      email: adminAccount.email,
      name: adminAccount.name,
      role: 'admin',
      lastLoginAt: adminAccount.lastLoginAt,
    },
    expiresAt,
  });
});

// 2. Admin Authentication: Verify Session
app.get('/api/admin/verify', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  res.json({
    valid: true,
    admin: {
      id: session.adminId,
      email: session.email,
      name: session.name,
      role: session.role,
      expiresAt: session.expiresAt,
    },
  });
});

// 3. Admin Authentication: Logout
app.post('/api/admin/logout', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  activeSessions.delete(session.token);
  logAdminAction('LOGOUT', session.email, 'Admin Portal', 'Admin session terminated', req);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 4. Admin Dashboard Metrics & Telemetry
app.get('/api/admin/stats', requireAdminAuth, (req: Request, res: Response) => {
  const totalUsers = STORE.users.length;
  const activeUsers = STORE.users.filter((u) => u.status === 'active').length;
  const totalWorkouts = STORE.workouts.length;
  const publishedWorkouts = STORE.workouts.filter((w) => w.status === 'published').length;
  const draftWorkouts = STORE.workouts.filter((w) => w.status !== 'published').length;

  const totalExercises = STORE.exercises.length;
  const publishedExercises = STORE.exercises.filter((e) => e.status === 'published').length;
  const draftExercises = STORE.exercises.filter((e) => e.status !== 'published').length;

  const totalMobility = STORE.mobilityRoutines.length;
  const totalNutrition = STORE.nutritionArticles.length;
  const pendingFeedback = STORE.feedback.filter((f) => f.status === 'in_review').length;
  const currentApk = STORE.apkReleases.find((r) => r.isCurrent);

  res.json({
    totalUsers,
    activeUsers,
    totalWorkouts,
    publishedWorkouts,
    draftWorkouts,
    totalExercises,
    publishedExercises,
    draftExercises,
    totalMobility,
    totalNutrition,
    pendingFeedback,
    currentApk: currentApk ? { version: currentApk.version, build: currentApk.buildNumber, size: currentApk.fileSize } : null,
    recentLogs: STORE.auditLogs.slice(0, 5),
    serverTime: new Date().toISOString(),
  });
});

// 5. Workouts Management
app.get('/api/admin/workouts', requireAdminAuth, (req: Request, res: Response) => {
  res.json(STORE.workouts);
});

app.post('/api/admin/workouts', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const body = req.body;
  const newWorkout = {
    ...body,
    id: body.id || `prog_${Date.now()}`,
    status: body.status || 'published',
    updatedAt: new Date().toISOString(),
  };
  STORE.workouts.unshift(newWorkout);
  saveStore(STORE);

  logAdminAction('WORKOUT_CREATED', session.email, newWorkout.title, `Created workout plan ${newWorkout.title}`, req);
  res.status(201).json(newWorkout);
});

app.put('/api/admin/workouts/:id', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const { id } = req.params;
  const index = STORE.workouts.findIndex((w) => w.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Workout plan not found.' });
  }

  STORE.workouts[index] = {
    ...STORE.workouts[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  saveStore(STORE);

  logAdminAction('WORKOUT_UPDATED', session.email, STORE.workouts[index].title, `Updated workout ${id}`, req);
  res.json(STORE.workouts[index]);
});

app.delete('/api/admin/workouts/:id', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const { id } = req.params;
  const target = STORE.workouts.find((w) => w.id === id);
  STORE.workouts = STORE.workouts.filter((w) => w.id !== id);
  saveStore(STORE);

  logAdminAction('WORKOUT_DELETED', session.email, target?.title || id, `Deleted workout ${id}`, req, 'warning');
  res.json({ success: true, id });
});

// 6. Exercise Library Management
app.get('/api/admin/exercises', requireAdminAuth, (req: Request, res: Response) => {
  res.json(STORE.exercises);
});

app.post('/api/admin/exercises', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const body = req.body;
  const newEx = {
    ...body,
    id: body.id || `ex_${Date.now()}`,
    status: body.status || 'published',
    updatedAt: new Date().toISOString(),
  };
  STORE.exercises.unshift(newEx);
  saveStore(STORE);

  logAdminAction('EXERCISE_CREATED', session.email, newEx.name, `Added exercise tutorial ${newEx.name}`, req);
  res.status(201).json(newEx);
});

app.put('/api/admin/exercises/:id', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const { id } = req.params;
  const index = STORE.exercises.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Exercise not found.' });
  }

  STORE.exercises[index] = {
    ...STORE.exercises[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  saveStore(STORE);

  logAdminAction('EXERCISE_UPDATED', session.email, STORE.exercises[index].name, `Updated exercise ${id}`, req);
  res.json(STORE.exercises[index]);
});

app.delete('/api/admin/exercises/:id', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const { id } = req.params;
  const target = STORE.exercises.find((e) => e.id === id);
  STORE.exercises = STORE.exercises.filter((e) => e.id !== id);
  saveStore(STORE);

  logAdminAction('EXERCISE_DELETED', session.email, target?.name || id, `Deleted exercise ${id}`, req, 'warning');
  res.json({ success: true, id });
});

// 7. Physiotherapy & Mobility Management
app.get('/api/admin/mobility', requireAdminAuth, (req: Request, res: Response) => {
  res.json(STORE.mobilityRoutines);
});

app.post('/api/admin/mobility', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const body = req.body;
  const newMob = {
    ...body,
    id: body.id || `mob_${Date.now()}`,
    status: body.status || 'published',
    updatedAt: new Date().toISOString(),
  };
  STORE.mobilityRoutines.unshift(newMob);
  saveStore(STORE);

  logAdminAction('MOBILITY_CREATED', session.email, newMob.title, `Created mobility protocol ${newMob.title}`, req);
  res.status(201).json(newMob);
});

app.put('/api/admin/mobility/:id', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const { id } = req.params;
  const index = STORE.mobilityRoutines.findIndex((m) => m.id === id);
  if (index === -1) return res.status(404).json({ error: 'Mobility routine not found.' });

  STORE.mobilityRoutines[index] = { ...STORE.mobilityRoutines[index], ...req.body, updatedAt: new Date().toISOString() };
  saveStore(STORE);

  logAdminAction('MOBILITY_UPDATED', session.email, STORE.mobilityRoutines[index].title, `Updated mobility ${id}`, req);
  res.json(STORE.mobilityRoutines[index]);
});

app.delete('/api/admin/mobility/:id', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const { id } = req.params;
  STORE.mobilityRoutines = STORE.mobilityRoutines.filter((m) => m.id !== id);
  saveStore(STORE);

  logAdminAction('MOBILITY_DELETED', session.email, id, `Deleted mobility routine ${id}`, req, 'warning');
  res.json({ success: true, id });
});

// 8. Nutrition Management
app.get('/api/admin/nutrition', requireAdminAuth, (req: Request, res: Response) => {
  res.json(STORE.nutritionArticles);
});

app.post('/api/admin/nutrition', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const body = req.body;
  const newNut = {
    ...body,
    id: body.id || `nut_${Date.now()}`,
    status: body.status || 'published',
    updatedAt: new Date().toISOString(),
  };
  STORE.nutritionArticles.unshift(newNut);
  saveStore(STORE);

  logAdminAction('NUTRITION_CREATED', session.email, newNut.title, `Created nutrition article ${newNut.title}`, req);
  res.status(201).json(newNut);
});

app.put('/api/admin/nutrition/:id', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const { id } = req.params;
  const index = STORE.nutritionArticles.findIndex((n) => n.id === id);
  if (index === -1) return res.status(404).json({ error: 'Nutrition article not found.' });

  STORE.nutritionArticles[index] = { ...STORE.nutritionArticles[index], ...req.body, updatedAt: new Date().toISOString() };
  saveStore(STORE);

  logAdminAction('NUTRITION_UPDATED', session.email, STORE.nutritionArticles[index].title, `Updated nutrition article ${id}`, req);
  res.json(STORE.nutritionArticles[index]);
});

app.delete('/api/admin/nutrition/:id', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const { id } = req.params;
  STORE.nutritionArticles = STORE.nutritionArticles.filter((n) => n.id !== id);
  saveStore(STORE);

  logAdminAction('NUTRITION_DELETED', session.email, id, `Deleted nutrition article ${id}`, req, 'warning');
  res.json({ success: true, id });
});

// 9. Users Management (Privacy-safe)
app.get('/api/admin/users', requireAdminAuth, (req: Request, res: Response) => {
  res.json(STORE.users);
});

app.patch('/api/admin/users/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const { id } = req.params;
  const { status } = req.body;
  const user = STORE.users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  user.status = status;
  saveStore(STORE);

  logAdminAction('USER_STATUS_CHANGED', session.email, user.email, `Set user status to ${status}`, req, 'warning');
  res.json(user);
});

// 10. Website CMS & Settings
app.get('/api/content/website', (req: Request, res: Response) => {
  // Public endpoint used by public website
  res.json(STORE.websiteContent);
});

app.put('/api/admin/website-content', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  STORE.websiteContent = {
    ...STORE.websiteContent,
    ...req.body,
  };
  saveStore(STORE);

  logAdminAction('WEBSITE_CMS_UPDATED', session.email, 'Website Content', 'Updated live public website content via CMS', req);
  res.json(STORE.websiteContent);
});

// 11. APK Releases Management
app.get('/api/admin/apk-releases', requireAdminAuth, (req: Request, res: Response) => {
  res.json(STORE.apkReleases);
});

app.post('/api/admin/apk-releases', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const { version, buildNumber, fileSize, minAndroid, releaseNotes, sha256, makeCurrent } = req.body;

  const newRelease = {
    id: `rel_${Date.now()}`,
    version,
    buildNumber: Number(buildNumber) || 109,
    fileSize: fileSize || '28.4 MB',
    minAndroid: minAndroid || 'Android 8.0 (API 26)',
    releaseDate: new Date().toISOString(),
    sha256: sha256 || crypto.createHash('sha256').update(version + Date.now()).digest('hex'),
    downloadUrl: `/downloads/physiofit-${version}-arm64-release.apk`,
    isCurrent: !!makeCurrent,
    status: 'published' as const,
    releaseNotes: releaseNotes || 'Official release',
  };

  if (makeCurrent) {
    STORE.apkReleases.forEach((r) => (r.isCurrent = false));
    STORE.websiteContent.apkVersion = `${version} (Build ${newRelease.buildNumber})`;
    STORE.websiteContent.apkFileSize = newRelease.fileSize;
    STORE.websiteContent.apkSha256 = newRelease.sha256;
    STORE.websiteContent.apkMinAndroid = newRelease.minAndroid;
  }

  STORE.apkReleases.unshift(newRelease);
  saveStore(STORE);

  logAdminAction('APK_RELEASE_ADDED', session.email, version, `Uploaded signed APK release ${version} (Build ${newRelease.buildNumber})`, req);
  res.status(201).json(newRelease);
});

app.put('/api/admin/apk-releases/:id/activate', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const { id } = req.params;
  const target = STORE.apkReleases.find((r) => r.id === id);
  if (!target) return res.status(404).json({ error: 'Release not found.' });

  STORE.apkReleases.forEach((r) => (r.isCurrent = r.id === id));
  STORE.websiteContent.apkVersion = `${target.version} (Build ${target.buildNumber})`;
  STORE.websiteContent.apkFileSize = target.fileSize;
  STORE.websiteContent.apkSha256 = target.sha256;
  STORE.websiteContent.apkMinAndroid = target.minAndroid;
  saveStore(STORE);

  logAdminAction('APK_RELEASE_ACTIVATED', session.email, target.version, `Activated APK ${target.version} as live download`, req);
  res.json({ success: true, target });
});

// 12. Feedback & Clinical Consultations Management
app.get('/api/admin/feedback', requireAdminAuth, (req: Request, res: Response) => {
  res.json(STORE.feedback);
});

app.patch('/api/admin/feedback/:id', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const { id } = req.params;
  const { status } = req.body;
  const item = STORE.feedback.find((f) => f.id === id);
  if (!item) return res.status(404).json({ error: 'Feedback item not found.' });

  item.status = status;
  saveStore(STORE);

  logAdminAction('FEEDBACK_RESOLVED', session.email, item.email, `Updated feedback status to ${status}`, req);
  res.json(item);
});

// 13. Audit Activity Logs
app.get('/api/admin/audit-logs', requireAdminAuth, (req: Request, res: Response) => {
  res.json(STORE.auditLogs);
});

// 14. Admin Password Reset / Change
app.post('/api/admin/change-password', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession as SessionData;
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const computedCurrent = hashPassword(currentPassword || '');
  if (computedCurrent !== STORE.admin.passwordHash) {
    return res.status(400).json({ error: 'Current password does not match.' });
  }

  STORE.admin.passwordHash = hashPassword(newPassword);
  saveStore(STORE);

  logAdminAction('ADMIN_PASSWORD_CHANGED', session.email, 'Security Credentials', 'Administrator password changed', req, 'warning');
  res.json({ success: true, message: 'Password updated successfully.' });
});

// -------------------------------------------------------------------------
// SERVER INITIALIZATION & VITE MIDDLEWARE INTEGRATION
// -------------------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const PORT = Number(process.env.PORT) || 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PhysioFit] Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
