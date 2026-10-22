import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetNutrition,
  calculateWaterRecommendation,
  calculateEstimated1RM,
  calculateWorkoutVolume,
  calculateStreak,
  calculateMacroPercentages,
  canAccessProgram,
  calculateSubscriptionDiscount,
  parseBreathingCadence,
  type UserStats,
} from './fitnessLogic.ts';

test('calculateBMR correctly handles male and female Mifflin-St Jeor', () => {
  // Male: 10*75 + 6.25*175 - 5*28 + 5 = 750 + 1093.75 - 140 + 5 = 1708.75 -> 1709
  const maleBMR = calculateBMR({
    weightKg: 75,
    heightCm: 175,
    age: 28,
    gender: 'male',
  });
  assert.equal(maleBMR, 1709);

  // Female: 10*60 + 6.25*162 - 5*26 - 161 = 600 + 1012.5 - 130 - 161 = 1321.5 -> 1322
  const femaleBMR = calculateBMR({
    weightKg: 60,
    heightCm: 162,
    age: 26,
    gender: 'female',
  });
  assert.equal(femaleBMR, 1322);
});

test('calculateTDEE applies appropriate activity multipliers', () => {
  const stats: UserStats = {
    weightKg: 70,
    heightCm: 170,
    age: 25,
    gender: 'male',
    activityLevel: 'moderately_active',
    fitnessGoal: 'general_fitness',
  };
  // BMR = 10*70 + 6.25*170 - 5*25 + 5 = 700 + 1062.5 - 125 + 5 = 1642.5 -> 1643
  // TDEE = 1643 * 1.55 = 2546.65 -> 2547
  const tdee = calculateTDEE(stats);
  assert.equal(tdee, 2547);
});

test('calculateTargetNutrition adapts calorie and macro targets for fat loss and muscle gain', () => {
  const fatLossStats: UserStats = {
    weightKg: 80,
    heightCm: 175,
    age: 30,
    gender: 'male',
    activityLevel: 'moderately_active',
    fitnessGoal: 'fat_loss',
  };
  const target = calculateTargetNutrition(fatLossStats);
  assert.ok(target.calories > 1200, 'Calories should exceed minimum baseline');
  assert.equal(target.proteinGrams, 80 * 2.0); // 160g protein
  assert.ok(target.fatGrams > 0);
  assert.ok(target.carbsGrams > 0);
});

test('calculateWaterRecommendation accounts for bodyweight and activity', () => {
  const waterModerate = calculateWaterRecommendation(70, 'moderately_active');
  // 70 * 35 = 2450 + 650 = 3100
  assert.equal(waterModerate, 3100);

  const waterSedentary = calculateWaterRecommendation(60, 'sedentary');
  // 60 * 35 = 2100 + 0 = 2100
  assert.equal(waterSedentary, 2100);
});

test('calculateEstimated1RM uses Epley formula correctly', () => {
  // 100kg for 1 rep = 100kg
  assert.equal(calculateEstimated1RM(100, 1), 100);

  // 80kg for 10 reps = 80 * (1 + 10/30) = 80 * 1.3333 = 106.7
  const est10 = calculateEstimated1RM(80, 10);
  assert.equal(est10, 106.7);
});

test('calculateWorkoutVolume calculates sum of weight * reps for completed sets only', () => {
  const sets = [
    { reps: 10, weightKg: 50, completed: true },
    { reps: 10, weightKg: 50, completed: true },
    { reps: 8, weightKg: 50, completed: false }, // not completed
  ];
  assert.equal(calculateWorkoutVolume(sets), 1000);
});

test('calculateStreak accurately tracks consecutive workout days', () => {
  const today = '2026-10-20';
  const historyConsecutive = ['2026-10-20', '2026-10-19', '2026-10-18'];
  assert.equal(calculateStreak(historyConsecutive, today), 3);

  // Yesterday completed, today not yet logged -> streak remains 2
  const historyYesterday = ['2026-10-19', '2026-10-18'];
  assert.equal(calculateStreak(historyYesterday, today), 2);

  // Missed yesterday and today -> streak resets to 0
  const historyBroken = ['2026-10-17', '2026-10-16'];
  assert.equal(calculateStreak(historyBroken, today), 0);
});

test('calculateMacroPercentages computes valid distribution summing near 100%', () => {
  const pct = calculateMacroPercentages(150, 200, 50);
  // 150*4 = 600, 200*4 = 800, 50*9 = 450. Total = 1850.
  // Protein: 600/1850 = 32%, Carbs: 800/1850 = 43%, Fat: 450/1850 = 24%
  assert.equal(pct.proteinPct + pct.carbsPct + pct.fatPct, 99); // due to rounding
});

test('canAccessProgram verifies free vs pro access correctly', () => {
  assert.equal(canAccessProgram(false, false), true);
  assert.equal(canAccessProgram(undefined, false), true);
  assert.equal(canAccessProgram(true, false), false);
  assert.equal(canAccessProgram(true, true), true);
});

test('calculateSubscriptionDiscount calculates annual savings accurately', () => {
  // Monthly = 799 * 12 = 9588. Annual = 4999. Savings = 4589. 4589/9588 = 47.86% -> 48%
  const discount = calculateSubscriptionDiscount(799, 4999);
  assert.equal(discount, 48);
});

test('parseBreathingCadence parses tempo notation cleanly', () => {
  const cadence = parseBreathingCadence('3-1-1-0');
  assert.equal(cadence.eccentricSec, 3);
  assert.equal(cadence.pauseBottomSec, 1);
  assert.equal(cadence.concentricSec, 1);
  assert.equal(cadence.lockoutSec, 0);
  assert.equal(cadence.totalRepDurationSec, 5);
});

