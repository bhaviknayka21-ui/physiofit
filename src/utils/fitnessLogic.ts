/**
 * Pure calculation logic for PhysioFit fitness and nutrition engine.
 * Fully decoupled from UI for reliable testing and deterministic execution.
 */

export interface UserStats {
  weightKg: number;
  heightCm: number;
  age: number;
  gender?: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  fitnessGoal: 'fat_loss' | 'muscle_gain' | 'strength' | 'general_fitness' | 'mobility' | 'flexibility';
}

export interface MacroTarget {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.
 */
export function calculateBMR(stats: Pick<UserStats, 'weightKg' | 'heightCm' | 'age' | 'gender'>): number {
  const { weightKg, heightCm, age, gender = 'male' } = stats;
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 1600;

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'female') {
    return Math.round(base - 161);
  }
  return Math.round(base + 5);
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 */
export function calculateTDEE(stats: UserStats): number {
  const bmr = calculateBMR(stats);
  const multipliers: Record<UserStats['activityLevel'], number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };
  const multiplier = multipliers[stats.activityLevel] || 1.375;
  return Math.round(bmr * multiplier);
}

/**
 * Computes targeted daily macros based on user statistics and fitness goal.
 */
export function calculateTargetNutrition(stats: UserStats): MacroTarget {
  const tdee = calculateTDEE(stats);
  let targetCalories = tdee;
  let proteinMultiplier = 1.6; // g per kg of bodyweight

  switch (stats.fitnessGoal) {
    case 'fat_loss':
      targetCalories = Math.max(1200, Math.round(tdee - 450));
      proteinMultiplier = 2.0;
      break;
    case 'muscle_gain':
      targetCalories = Math.round(tdee + 350);
      proteinMultiplier = 2.0;
      break;
    case 'strength':
      targetCalories = Math.round(tdee + 150);
      proteinMultiplier = 1.8;
      break;
    case 'mobility':
    case 'flexibility':
    case 'general_fitness':
    default:
      targetCalories = tdee;
      proteinMultiplier = 1.6;
      break;
  }

  const proteinGrams = Math.round(stats.weightKg * proteinMultiplier);
  const proteinCals = proteinGrams * 4;

  // 25% of calories from healthy fats
  const fatCals = targetCalories * 0.25;
  const fatGrams = Math.round(fatCals / 9);

  // Remainder from carbohydrates
  const remainingCals = Math.max(0, targetCalories - proteinCals - fatCals);
  const carbsGrams = Math.round(remainingCals / 4);

  return {
    calories: targetCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
  };
}

/**
 * Recommended water intake in milliliters based on bodyweight and activity level.
 */
export function calculateWaterRecommendation(weightKg: number, activityLevel: UserStats['activityLevel']): number {
  if (weightKg <= 0) return 2500;
  const baseMl = weightKg * 35;
  const activityBonus: Record<UserStats['activityLevel'], number> = {
    sedentary: 0,
    lightly_active: 350,
    moderately_active: 650,
    very_active: 1000,
  };
  const total = baseMl + (activityBonus[activityLevel] ?? 400);
  // Round to nearest 50ml
  return Math.round(total / 50) * 50;
}

/**
 * Calculates Estimated 1-Repetition Maximum (1RM) using Epley's formula.
 * Formula: Weight * (1 + Reps / 30)
 */
export function calculateEstimated1RM(weightKg: number, reps: number): number {
  if (weightKg <= 0 || reps <= 0) return 0;
  if (reps === 1) return weightKg;
  const est1RM = weightKg * (1 + reps / 30);
  return Math.round(est1RM * 10) / 10;
}

/**
 * Calculates workout volume: sum of (reps * weight) for all completed sets.
 */
export interface CompletedSetData {
  reps: number;
  weightKg: number;
  completed: boolean;
}

export function calculateWorkoutVolume(sets: CompletedSetData[]): number {
  return sets.reduce((sum, set) => {
    if (!set.completed) return sum;
    const load = set.weightKg > 0 ? set.weightKg : 0;
    return sum + set.reps * load;
  }, 0);
}

/**
 * Computes active consecutive day streak from a list of completed workout dates (ISO YYYY-MM-DD strings).
 */
export function calculateStreak(completedDates: string[], referenceDateIso: string): number {
  if (!completedDates || completedDates.length === 0) return 0;

  const uniqueDates = Array.from(new Set(completedDates)).sort().reverse();
  const ref = new Date(referenceDateIso);
  ref.setHours(0, 0, 0, 0);

  let currentCheck = new Date(ref);
  const refDateStr = currentCheck.toISOString().split('T')[0];

  // If user completed today, streak starts from today.
  // If not completed today, check if completed yesterday. If so, streak continues.
  let startIndex = 0;
  if (uniqueDates.includes(refDateStr)) {
    startIndex = 0;
  } else {
    currentCheck.setDate(currentCheck.getDate() - 1);
    const yesterdayStr = currentCheck.toISOString().split('T')[0];
    if (uniqueDates.includes(yesterdayStr)) {
      startIndex = 0;
    } else {
      return 0; // Streak broken
    }
  }

  let streak = 0;
  while (true) {
    const checkStr = currentCheck.toISOString().split('T')[0];
    if (uniqueDates.includes(checkStr)) {
      streak += 1;
      currentCheck.setDate(currentCheck.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Computes percentage breakdown of macronutrients from consumed totals.
 */
export function calculateMacroPercentages(proteinG: number, carbsG: number, fatG: number): {
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
} {
  const proteinCals = proteinG * 4;
  const carbsCals = carbsG * 4;
  const fatCals = fatG * 9;
  const totalCals = proteinCals + carbsCals + fatCals;
  if (totalCals <= 0) {
    return { proteinPct: 0, carbsPct: 0, fatPct: 0 };
  }

  return {
    proteinPct: Math.round((proteinCals / totalCals) * 100),
    carbsPct: Math.round((carbsCals / totalCals) * 100),
    fatPct: Math.round((fatCals / totalCals) * 100),
  };
}

/**
 * Checks whether the current user is permitted to start a given program.
 * Free programs are accessible to all; premium programs require active Pro subscription.
 */
export function canAccessProgram(
  isProgramPremium: boolean | undefined,
  userIsPro: boolean | undefined
): boolean {
  if (!isProgramPremium) return true;
  return Boolean(userIsPro);
}

/**
 * Computes discount percentage for annual billing vs monthly billing.
 */
export function calculateSubscriptionDiscount(
  monthlyPrice: number,
  annualPrice: number
): number {
  if (monthlyPrice <= 0) return 0;
  const annualEquivalentAtMonthly = monthlyPrice * 12;
  const savings = annualEquivalentAtMonthly - annualPrice;
  if (savings <= 0) return 0;
  return Math.round((savings / annualEquivalentAtMonthly) * 100);
}

/**
 * Parses lifting tempo string (e.g. "3-1-1-0" = 3s lowering, 1s pause, 1s lift, 0s top).
 */
export function parseBreathingCadence(tempoStr: string): {
  eccentricSec: number;
  pauseBottomSec: number;
  concentricSec: number;
  lockoutSec: number;
  totalRepDurationSec: number;
} {
  const parts = (tempoStr || '3-1-1-0').split('-').map((n) => parseInt(n) || 0);
  const eccentricSec = parts[0] ?? 3;
  const pauseBottomSec = parts[1] ?? 1;
  const concentricSec = parts[2] ?? 1;
  const lockoutSec = parts[3] ?? 0;
  const totalRepDurationSec = Math.max(
    1,
    eccentricSec + pauseBottomSec + concentricSec + lockoutSec
  );

  return {
    eccentricSec,
    pauseBottomSec,
    concentricSec,
    lockoutSec,
    totalRepDurationSec,
  };
}

