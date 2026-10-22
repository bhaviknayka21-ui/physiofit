import React, { useState } from 'react';
import {
  Utensils,
  Plus,
  Search,
  Trash2,
  AlertCircle,
  Calendar,
  PieChart,
  Droplet,
  ChevronRight,
  Info,
  X,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodItem, MealLog } from '../types';
import {
  calculateTargetNutrition,
  calculateMacroPercentages,
  calculateWaterRecommendation,
} from '../utils/fitnessLogic';
import { ASSETS } from '../data/seedData';

export const NutritionView: React.FC = () => {
  const {
    currentUser,
    foodDatabase,
    addCustomFood,
    mealLogs,
    selectedDate,
    setSelectedDate,
    addMealLog,
    deleteMealLog,
    todayWaterAmount,
    logWater,
    showToast,
  } = useApp();

  const [activeMealType, setActiveMealType] = useState<MealLog['mealType']>('breakfast');
  const [showLogModal, setShowLogModal] = useState(false);
  const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servingMultiplier, setServingMultiplier] = useState<number>(1);

  // New Custom Food Form State
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodHindi, setNewFoodHindi] = useState('');
  const [newFoodCategory, setNewFoodCategory] = useState<FoodItem['category']>('lunch');
  const [newFoodServing, setNewFoodServing] = useState('1 bowl (150g)');
  const [newFoodCalories, setNewFoodCalories] = useState<number>(150);
  const [newFoodProtein, setNewFoodProtein] = useState<number>(8);
  const [newFoodCarbs, setNewFoodCarbs] = useState<number>(20);
  const [newFoodFat, setNewFoodFat] = useState<number>(4);

  // Target macros for current user
  const targetNutrition = currentUser
    ? calculateTargetNutrition({
        weightKg: currentUser.weightKg,
        heightCm: currentUser.heightCm,
        age: currentUser.age,
        gender: currentUser.gender,
        activityLevel: currentUser.activityLevel,
        fitnessGoal: currentUser.fitnessGoal,
      })
    : { calories: 2200, proteinGrams: 140, carbsGrams: 240, fatGrams: 60 };

  // Target water
  const targetWater = currentUser
    ? calculateWaterRecommendation(currentUser.weightKg, currentUser.activityLevel)
    : 3000;

  // Filter logs for selected date
  const dayMealLogs = mealLogs.filter((m) => m.date === selectedDate);

  // Totals consumed today
  const totalCalories = dayMealLogs.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = Math.round(dayMealLogs.reduce((sum, m) => sum + m.proteinG, 0) * 10) / 10;
  const totalCarbs = Math.round(dayMealLogs.reduce((sum, m) => sum + m.carbsG, 0) * 10) / 10;
  const totalFat = Math.round(dayMealLogs.reduce((sum, m) => sum + m.fatG, 0) * 10) / 10;

  const macroPct = calculateMacroPercentages(totalProtein, totalCarbs, totalFat);
  const caloriesPercent = Math.min(100, Math.round((totalCalories / (targetNutrition.calories || 1)) * 100));

  // Categorized logs
  const mealsByType: Record<MealLog['mealType'], MealLog[]> = {
    breakfast: dayMealLogs.filter((m) => m.mealType === 'breakfast'),
    lunch: dayMealLogs.filter((m) => m.mealType === 'lunch'),
    dinner: dayMealLogs.filter((m) => m.mealType === 'dinner'),
    snack: dayMealLogs.filter((m) => m.mealType === 'snack'),
  };

  const filteredFoods = foodDatabase.filter((f) => {
    return (
      f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
      (f.hindiName && f.hindiName.toLowerCase().includes(foodSearch.toLowerCase()))
    );
  });

  const handleOpenAddMeal = (type: MealLog['mealType']) => {
    setActiveMealType(type);
    setSelectedFood(null);
    setServingMultiplier(1);
    setFoodSearch('');
    setShowLogModal(true);
  };

  const handleConfirmLogMeal = () => {
    if (!selectedFood) return;

    const mult = Math.max(0.1, servingMultiplier);
    addMealLog({
      date: selectedDate,
      mealType: activeMealType,
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      servings: mult,
      calories: Math.round(selectedFood.calories * mult),
      proteinG: Math.round(selectedFood.proteinG * mult * 10) / 10,
      carbsG: Math.round(selectedFood.carbsG * mult * 10) / 10,
      fatG: Math.round(selectedFood.fatG * mult * 10) / 10,
    });

    setShowLogModal(false);
  };

  const handleCreateCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName.trim()) {
      showToast('Food name is required');
      return;
    }

    addCustomFood({
      name: newFoodName.trim(),
      hindiName: newFoodHindi.trim() || undefined,
      category: newFoodCategory,
      servingSize: newFoodServing.trim() || '1 serving',
      servingGrams: 100,
      calories: Number(newFoodCalories),
      proteinG: Number(newFoodProtein),
      carbsG: Number(newFoodCarbs),
      fatG: Number(newFoodFat),
      isIndian: true,
    });

    setShowCustomFoodModal(false);
    setNewFoodName('');
    setNewFoodHindi('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header and Hero Split */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-[#141a22] to-[#1c232f] p-6 border border-[#252f3d] shadow-sm">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Utensils className="h-4 w-4" />
            <span>INDIAN FITNESS NUTRITION ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Daily Nutrition & Macro Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Tailored specifically for Indian dietary habits with rotis, dal tadka, fresh paneer,
            curd, eggs, and regional home-cooked meals with editable portion sizes.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-300">Selected Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-[#2d3848] bg-[#11161d] px-3 py-1.5 text-xs font-semibold text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="shrink-0 hidden lg:block">
          <img
            src={ASSETS.healthyMeal}
            alt="Healthy Indian Fitness Meal"
            referrerPolicy="no-referrer"
            className="h-28 w-44 rounded-xl object-cover border border-[#2e3e52] shadow-md"
          />
        </div>
      </div>

      {/* Mandatory Dietary & Clinical Notice */}
      <div className="rounded-xl border border-slate-700 bg-[#161c24] p-4 flex items-start gap-3">
        <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white font-semibold">Nutritional Information Notice:</strong> All
          food macro values are reliable evidence-informed estimates based on standard Indian culinary
          preparations. Actual calorie and macronutrient counts vary based on specific cooking oils,
          ghee, and ingredient portions. PhysioFit is not a substitute for clinical dietetic care or
          medical diagnosis.
        </p>
      </div>

      {/* Daily Macro & Calorie Ring Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="rounded-2xl bg-[#141a22] p-5 border border-[#252f3d] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Energy</span>
            <div className="mt-1 text-2xl font-black text-white tabular-nums">
              {totalCalories}{' '}
              <span className="text-xs font-normal text-slate-400">
                / {targetNutrition.calories} kcal
              </span>
            </div>
            <div className="text-xs text-emerald-400 font-medium mt-0.5">
              {caloriesPercent}% of target
            </div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-[#1f2835] overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${caloriesPercent}%` }}
            />
          </div>
        </div>

        {/* Protein Card */}
        <div className="rounded-2xl bg-[#141a22] p-5 border border-[#252f3d] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Protein (g)</span>
              <span className="text-[11px] font-bold text-emerald-400 tabular-nums">
                {macroPct.proteinPct}%
              </span>
            </div>
            <div className="mt-1 text-2xl font-black text-white tabular-nums">
              {totalProtein}{' '}
              <span className="text-xs font-normal text-slate-400">
                / {targetNutrition.proteinGrams}g
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {targetNutrition.proteinGrams - totalProtein > 0
                ? `${Math.round(targetNutrition.proteinGrams - totalProtein)}g remaining`
                : 'Target achieved!'}
            </div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-[#1f2835] overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{
                width: `${Math.min(100, (totalProtein / (targetNutrition.proteinGrams || 1)) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Carbohydrates Card */}
        <div className="rounded-2xl bg-[#141a22] p-5 border border-[#252f3d] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Carbohydrates (g)</span>
              <span className="text-[11px] font-bold text-cyan-400 tabular-nums">
                {macroPct.carbsPct}%
              </span>
            </div>
            <div className="mt-1 text-2xl font-black text-white tabular-nums">
              {totalCarbs}{' '}
              <span className="text-xs font-normal text-slate-400">
                / {targetNutrition.carbsGrams}g
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {Math.round((totalCarbs / (targetNutrition.carbsGrams || 1)) * 100)}% of target
            </div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-[#1f2835] overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{
                width: `${Math.min(100, (totalCarbs / (targetNutrition.carbsGrams || 1)) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Dietary Fats Card */}
        <div className="rounded-2xl bg-[#141a22] p-5 border border-[#252f3d] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Healthy Fats (g)</span>
              <span className="text-[11px] font-bold text-amber-400 tabular-nums">
                {macroPct.fatPct}%
              </span>
            </div>
            <div className="mt-1 text-2xl font-black text-white tabular-nums">
              {totalFat}{' '}
              <span className="text-xs font-normal text-slate-400">
                / {targetNutrition.fatGrams}g
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {Math.round((totalFat / (targetNutrition.fatGrams || 1)) * 100)}% of target
            </div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-[#1f2835] overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{
                width: `${Math.min(100, (totalFat / (targetNutrition.fatGrams || 1)) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Meals Sections: Breakfast, Lunch, Dinner, Snacks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Daily Meals Breakdown</h2>
          <button
            onClick={() => setShowCustomFoodModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#2e3745] bg-[#171e27] px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Custom Recipe / Dish</span>
          </button>
        </div>

        {(['breakfast', 'lunch', 'dinner', 'snack'] as MealLog['mealType'][]).map((mealType) => {
          const logs = mealsByType[mealType];
          const mealCals = logs.reduce((sum, l) => sum + l.calories, 0);
          const mealProtein = Math.round(logs.reduce((sum, l) => sum + l.proteinG, 0) * 10) / 10;

          return (
            <div
              key={mealType}
              className="rounded-2xl bg-[#141a22] border border-[#252f3d] overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 bg-[#161c25] border-b border-[#232b36]">
                <div className="flex items-center gap-3">
                  <div className="capitalize font-bold text-white text-sm">
                    {mealType}
                  </div>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {logs.length} items logged
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-xs text-slate-300 tabular-nums hidden sm:block">
                    <span className="font-bold text-white">{mealCals}</span> kcal ·{' '}
                    <span className="font-bold text-emerald-400">{mealProtein}g</span> protein
                  </div>

                  <button
                    onClick={() => handleOpenAddMeal(mealType)}
                    className="flex items-center gap-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/25 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Log Food</span>
                  </button>
                </div>
              </div>

              {logs.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No items logged for {mealType} yet.
                </div>
              ) : (
                <div className="divide-y divide-[#202733]">
                  {logs.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 flex items-center justify-between gap-3 text-xs text-slate-200 hover:bg-[#161d27] transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-white">{item.foodName}</div>
                        <div className="text-[11px] text-slate-400">
                          {item.servings} serving(s) · {item.proteinG}g P · {item.carbsG}g C ·{' '}
                          {item.fatG}g F
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-white tabular-nums">
                          {item.calories} kcal
                        </span>
                        <button
                          onClick={() => deleteMealLog(item.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                          aria-label={`Delete ${item.foodName}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Log Food from Database */}
      {showLogModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-xl rounded-2xl bg-[#131821] border border-[#283241] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#242c38] pb-3">
              <h2 className="text-base font-bold text-white capitalize">
                Log Food to {activeMealType}
              </h2>
              <button
                onClick={() => setShowLogModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white border border-[#2b3544]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                placeholder="Search roti, dal tadka, paneer, eggs, chicken..."
                className="w-full rounded-xl border border-[#283241] bg-[#161d26] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Foods List */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 rounded-xl border border-[#26303e] bg-[#151c25] p-2">
              {filteredFoods.map((food) => {
                const isSelected = selectedFood?.id === food.id;
                return (
                  <div
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-white'
                        : 'hover:bg-[#1b2330] text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white text-xs">{food.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {food.servingSize} · {food.proteinG}g P · {food.carbsG}g C · {food.fatG}g F
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-emerald-400 text-xs tabular-nums">
                        {food.calories} kcal
                      </div>
                      {food.hindiName && (
                        <div className="text-[10px] text-slate-400">{food.hindiName}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Serving Multiplier Selector */}
            {selectedFood && (
              <div className="p-3.5 rounded-xl bg-[#171f2a] border border-[#263140] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Serving Size:</span>
                  <span className="text-slate-400">{selectedFood.servingSize}</span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs text-slate-300">Number of Servings:</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    value={servingMultiplier}
                    onChange={(e) => setServingMultiplier(parseFloat(e.target.value) || 1)}
                    className="w-24 rounded-lg border border-[#2d3848] bg-[#11161d] px-2.5 py-1 text-xs font-bold text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                  <div className="text-xs text-emerald-400 font-bold tabular-nums">
                    = {Math.round(selectedFood.calories * servingMultiplier)} kcal (
                    {Math.round(selectedFood.proteinG * servingMultiplier * 10) / 10}g protein)
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="rounded-xl border border-[#2d3848] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedFood}
                onClick={handleConfirmLogMeal}
                className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm & Log Meal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Food */}
      {showCustomFoodModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-[#131821] border border-[#283241] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#242c38] pb-3">
              <h2 className="text-base font-bold text-white">Add Custom Dish / Recipe</h2>
              <button
                onClick={() => setShowCustomFoodModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white border border-[#2b3544]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomFood} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Dish / Food Name *
                </label>
                <input
                  type="text"
                  required
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  placeholder="e.g. Grandma's Moong Dal Chilla"
                  className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Standard Serving Portion (e.g. 2 pieces, 1 bowl)
                </label>
                <input
                  type="text"
                  value={newFoodServing}
                  onChange={(e) => setNewFoodServing(e.target.value)}
                  placeholder="1 bowl (150g)"
                  className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Calories</label>
                  <input
                    type="number"
                    min="0"
                    value={newFoodCalories}
                    onChange={(e) => setNewFoodCalories(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-2.5 py-1.5 text-xs text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={newFoodProtein}
                    onChange={(e) => setNewFoodProtein(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-2.5 py-1.5 text-xs text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={newFoodCarbs}
                    onChange={(e) => setNewFoodCarbs(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-2.5 py-1.5 text-xs text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={newFoodFat}
                    onChange={(e) => setNewFoodFat(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-2.5 py-1.5 text-xs text-white tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#242c38]">
                <button
                  type="button"
                  onClick={() => setShowCustomFoodModal(false)}
                  className="rounded-xl border border-[#2d3848] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
