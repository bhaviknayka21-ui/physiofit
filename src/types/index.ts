/**
 * TypeScript type definitions for PhysioFit
 */

export type FitnessGoal =
  | 'fat_loss'
  | 'muscle_gain'
  | 'strength'
  | 'general_fitness'
  | 'mobility'
  | 'flexibility';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type TrainingLocation = 'home' | 'gym' | 'both';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active';

export type DietaryPreference =
  | 'vegetarian'
  | 'non_vegetarian'
  | 'eggetarian'
  | 'vegan'
  | 'jain';

export type UserRole = 'user' | 'admin';

export type MembershipTier = 'free' | 'pro' | 'elite';

export interface UserSubscription {
  isPro: boolean;
  planTier: 'free' | 'pro' | 'elite' | 'pro_monthly' | 'pro_annual';
  validUntil?: string;
  autoRenew: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  fitnessExperience: ExperienceLevel;
  fitnessGoal: FitnessGoal;
  preferredLocation: TrainingLocation;
  daysPerWeek: number;
  equipment: string[];
  activityLevel: ActivityLevel;
  dietaryPreference: DietaryPreference;
  subscription?: UserSubscription;
  reminderSettings: {
    workoutReminders: boolean;
    workoutTime: string;
    waterReminders: boolean;
    waterIntervalHours: number;
    mobilityBreakReminders: boolean;
  };
  createdAt: string;
}

export interface BreathingPattern {
  inhalePhase: string;
  exhalePhase: string;
  tempo: string; // e.g. "3-1-1-0"
  cadenceDescription: string;
  valsalvaNotice?: string;
}

export interface TargetMuscleAnatomy {
  primary: string[];
  secondary: string[];
  stabilizers: string[];
  jointAction: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'mobility' | 'flexibility' | 'bodyweight';
  targetMuscles: string[];
  equipment: string[];
  difficulty: ExperienceLevel;
  location: TrainingLocation;
  defaultSets: number;
  defaultReps: string;
  defaultRestSeconds: number;
  description: string;
  setupPosition: {
    starting: string;
    execution: string;
    lockout: string;
  };
  breathing: BreathingPattern;
  youtubeVideoId: string;
  youtubeUrl: string;
  biomechanicsUrl: string;
  anatomy: TargetMuscleAnatomy;
  safetyInstructions: string[];
  cues: string[];
  commonMistakes: string[];
  image?: string;
  videoUrl?: string;
  isCustom?: boolean;
}

export interface ProgramExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  subtitle: string;
  level: ExperienceLevel;
  location: TrainingLocation;
  durationWeeks: number;
  daysPerWeek: number;
  description: string;
  category: 'strength' | 'cardio' | 'mobility' | 'flexibility' | 'hybrid';
  exercises: ProgramExercise[];
  tags: string[];
  image?: string;
  isPremiumOnly?: boolean;
}

export interface PainCasePhase {
  phase: number;
  title: string;
  objective: string;
  durationWeeks: string;
  drills: {
    name: string;
    setsReps: string;
    cues: string;
    breathing: string;
    youtubeId?: string;
  }[];
}

export interface PainManagementCase {
  id: string;
  title: string;
  affectedArea: string;
  conditionSummary: string;
  biomechanicalCause: string;
  redFlags: string[];
  dos: string[];
  donts: string[];
  phases: PainCasePhase[];
  biomechanicsUrl: string;
  youtubeGuideUrl: string;
  anatomyImageUrl?: string;
}

export interface LoggedSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface LoggedExercise {
  exerciseId: string;
  exerciseName: string;
  targetMuscles: string[];
  sets: LoggedSet[];
}

export interface WorkoutLog {
  id: string;
  userId: string;
  programId?: string;
  programName: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  volumeKg: number;
  notes?: string;
  exercisesCompleted: LoggedExercise[];
}

export interface FoodItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servingSize: string;
  servingGrams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  isIndian: boolean;
  isCustom?: boolean;
}

export interface MealLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodId: string;
  foodName: string;
  servings: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface WaterLog {
  id: string;
  userId: string;
  date: string;
  amountMl: number;
  goalMl: number;
}

export interface ProgressMetric {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  armsCm?: number;
  thighsCm?: number;
  notes?: string;
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  estimated1RM: number;
  date: string;
}

export interface MobilityStep {
  name: string;
  durationOrReps: string;
  cues: string;
  image?: string;
}

export interface MobilityRoutine {
  id: string;
  title: string;
  category:
    | 'warmup'
    | 'cooldown'
    | 'general_mobility'
    | 'posture_education'
    | 'technique'
    | 'rehab_guidance';
  durationMin: number;
  targetArea: string;
  description: string;
  precautions: string;
  steps: MobilityStep[];
  clinicianPrescribedOnly?: boolean;
  image?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface AdminFeedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'issue' | 'exercise_request' | 'general_feedback';
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
}
