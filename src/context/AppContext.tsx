import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Exercise,
  WorkoutProgram,
  WorkoutLog,
  FoodItem,
  MealLog,
  WaterLog,
  ProgressMetric,
  PersonalRecord,
  MobilityRoutine,
  AchievementBadge,
  AdminFeedback,
  LoggedExercise,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_ADMIN,
  INITIAL_EXERCISES,
  INITIAL_PROGRAMS,
  INITIAL_FOOD_DATABASE,
  INITIAL_MOBILITY_ROUTINES,
  INITIAL_BADGES,
  INITIAL_ADMIN_FEEDBACK,
} from '../data/seedData';
import {
  calculateStreak,
  calculateTargetNutrition,
  calculateWaterRecommendation,
  calculateEstimated1RM,
  calculateWorkoutVolume,
} from '../utils/fitnessLogic';

interface ActiveWorkoutState {
  programId?: string;
  programTitle: string;
  startTime: number;
  exercises: LoggedExercise[];
  currentExerciseIndex: number;
  restTimer: {
    active: boolean;
    remainingSeconds: number;
    totalSeconds: number;
  };
}

interface AppContextType {
  // Navigation & User
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  usersList: UserProfile[];
  login: (email: string, password?: string) => { success: boolean; error?: string };
  signup: (userData: Partial<UserProfile>) => { success: boolean; error?: string };
  logout: () => void;
  switchUserRole: (role: 'user' | 'admin') => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Global Library Data
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  programs: WorkoutProgram[];
  addProgram: (program: Omit<WorkoutProgram, 'id'>) => void;
  mobilityRoutines: MobilityRoutine[];
  addMobilityRoutine: (routine: Omit<MobilityRoutine, 'id'>) => void;

  // Active Workout Session
  activeWorkout: ActiveWorkoutState | null;
  startWorkout: (program: WorkoutProgram) => void;
  updateActiveSet: (
    exerciseIndex: number,
    setIndex: number,
    reps: number,
    weightKg: number,
    completed: boolean
  ) => void;
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  addRestTime: (seconds: number) => void;
  nextExercise: () => void;
  prevExercise: () => void;
  cancelWorkout: () => void;
  finishWorkout: () => WorkoutLog | null;

  // Workout Logs & Records
  workoutLogs: WorkoutLog[];
  personalRecords: PersonalRecord[];
  streak: number;

  // Nutrition & Water
  foodDatabase: FoodItem[];
  addCustomFood: (food: Omit<FoodItem, 'id'>) => void;
  mealLogs: MealLog[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  addMealLog: (meal: Omit<MealLog, 'id' | 'userId'>) => void;
  deleteMealLog: (id: string) => void;
  waterLogs: WaterLog[];
  todayWaterAmount: number;
  logWater: (amountMl: number) => void;
  resetWater: () => void;

  // Progress Metrics
  progressMetrics: ProgressMetric[];
  addProgressMetric: (metric: Omit<ProgressMetric, 'id' | 'userId'>) => void;
  updateProgressMetric: (id: string, updates: Partial<ProgressMetric>) => void;
  deleteProgressMetric: (id: string) => void;

  // Motivation & Badges
  badges: AchievementBadge[];
  dailyMotivation: string;

  // Admin Feedback & Issues
  adminFeedback: AdminFeedback[];
  submitFeedback: (subject: string, message: string, category: AdminFeedback['category']) => void;
  resolveFeedback: (id: string) => void;

  // Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Available users in storage
  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('physiofit_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserProfile[];
        return parsed.map((u) => ({
          ...u,
          name: u.name.replace(/^(Dr\.?|Admin)\s+/i, '').replace(/,\s*MPT/i, '').trim(),
        }));
      } catch {
        // fallback
      }
    }
    return [INITIAL_USER, INITIAL_ADMIN];
  });

  // Current active user - defaults cleanly to standard user Rahul Sharma
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedId = localStorage.getItem('physiofit_current_user_id');
    if (savedId && savedId !== 'admin_ananya') {
      const found = usersList.find((u) => u.id === savedId);
      if (found) {
        return {
          ...found,
          name: found.name.replace(/^(Dr\.?|Admin)\s+/i, '').replace(/,\s*MPT/i, '').trim(),
        };
      }
    }
    return INITIAL_USER;
  });

  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Sync users list to localStorage
  useEffect(() => {
    localStorage.setItem('physiofit_users', JSON.stringify(usersList));
  }, [usersList]);

  // Sync current user ID
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('physiofit_current_user_id', currentUser.id);
    } else {
      localStorage.removeItem('physiofit_current_user_id');
    }
  }, [currentUser]);

  // Global Exercise Library
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('physiofit_exercises');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_EXERCISES;
  });

  useEffect(() => {
    localStorage.setItem('physiofit_exercises', JSON.stringify(exercises));
  }, [exercises]);

  // Workout Programs
  const [programs, setPrograms] = useState<WorkoutProgram[]>(() => {
    const saved = localStorage.getItem('physiofit_programs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_PROGRAMS;
  });

  useEffect(() => {
    localStorage.setItem('physiofit_programs', JSON.stringify(programs));
  }, [programs]);

  // Mobility Routines
  const [mobilityRoutines, setMobilityRoutines] = useState<MobilityRoutine[]>(() => {
    const saved = localStorage.getItem('physiofit_mobility');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_MOBILITY_ROUTINES;
  });

  useEffect(() => {
    localStorage.setItem('physiofit_mobility', JSON.stringify(mobilityRoutines));
  }, [mobilityRoutines]);

  // Food Database
  const [foodDatabase, setFoodDatabase] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('physiofit_foods');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_FOOD_DATABASE;
  });

  useEffect(() => {
    localStorage.setItem('physiofit_foods', JSON.stringify(foodDatabase));
  }, [foodDatabase]);

  // User-specific data loading helper
  const userId = currentUser ? currentUser.id : 'guest';

  // Workout Logs for current user
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(() => {
    const saved = localStorage.getItem(`physiofit_logs_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    // Seed initial workout for Rahul
    if (userId === 'user_rahul') {
      return [
        {
          id: 'log_seed_1',
          userId: 'user_rahul',
          programId: 'prog_foundation_strength',
          programName: 'Functional Strength & Posture (Full Body)',
          date: '2026-10-18',
          durationMinutes: 42,
          volumeKg: 1250,
          notes: 'Felt solid on goblet squats. Hamstrings responded well to RDLs.',
          exercisesCompleted: [
            {
              exerciseId: 'ex_goblet_squat',
              exerciseName: 'Goblet Squat',
              targetMuscles: ['Quadriceps', 'Glutes'],
              sets: [
                { setNumber: 1, reps: 12, weightKg: 16, completed: true },
                { setNumber: 2, reps: 10, weightKg: 20, completed: true },
                { setNumber: 3, reps: 10, weightKg: 20, completed: true },
              ],
            },
            {
              exerciseId: 'ex_pushups',
              exerciseName: 'Push-up',
              targetMuscles: ['Chest', 'Triceps'],
              sets: [
                { setNumber: 1, reps: 15, weightKg: 0, completed: true },
                { setNumber: 2, reps: 12, weightKg: 0, completed: true },
                { setNumber: 3, reps: 10, weightKg: 0, completed: true },
              ],
            },
          ],
        },
        {
          id: 'log_seed_2',
          userId: 'user_rahul',
          programId: 'prog_home_mobility_tone',
          programName: 'Home Core, Mobility & Conditioning',
          date: '2026-10-19',
          durationMinutes: 30,
          volumeKg: 400,
          notes: 'Great thoracic spine relief after long workday.',
          exercisesCompleted: [
            {
              exerciseId: 'ex_cat_camel',
              exerciseName: 'Cat-Camel Spinal Decompression',
              targetMuscles: ['Spine'],
              sets: [
                { setNumber: 1, reps: 10, weightKg: 0, completed: true },
                { setNumber: 2, reps: 10, weightKg: 0, completed: true },
              ],
            },
          ],
        },
      ];
    }
    return [];
  });

  // Reload user data when user changes
  useEffect(() => {
    const saved = localStorage.getItem(`physiofit_logs_${userId}`);
    if (saved) {
      try {
        setWorkoutLogs(JSON.parse(saved));
      } catch {
        setWorkoutLogs([]);
      }
    } else if (userId === 'user_rahul') {
      // Keep seeded logs
    } else {
      setWorkoutLogs([]);
    }

    const savedProgress = localStorage.getItem(`physiofit_progress_${userId}`);
    if (savedProgress) {
      try {
        setProgressMetrics(JSON.parse(savedProgress));
      } catch {
        setProgressMetrics([]);
      }
    } else if (userId === 'user_rahul') {
      // Keep seeded progress
    } else {
      setProgressMetrics([]);
    }

    const savedMeals = localStorage.getItem(`physiofit_meals_${userId}`);
    if (savedMeals) {
      try {
        setMealLogs(JSON.parse(savedMeals));
      } catch {
        setMealLogs([]);
      }
    } else {
      setMealLogs([]);
    }

    const savedWater = localStorage.getItem(`physiofit_water_${userId}`);
    if (savedWater) {
      try {
        setWaterLogs(JSON.parse(savedWater));
      } catch {
        setWaterLogs([]);
      }
    } else {
      const today = new Date().toISOString().split('T')[0];
      setWaterLogs([
        {
          id: `water_${today}`,
          userId,
          date: today,
          amountMl: 0,
          goalMl: currentUser ? calculateWaterRecommendation(currentUser.weightKg, currentUser.activityLevel) : 3000,
        },
      ]);
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(`physiofit_logs_${userId}`, JSON.stringify(workoutLogs));
  }, [workoutLogs, userId]);

  // Personal Records
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>(() => {
    const saved = localStorage.getItem(`physiofit_prs_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    if (userId === 'user_rahul') {
      return [
        {
          id: 'pr_1',
          userId: 'user_rahul',
          exerciseName: 'Goblet Squat',
          weightKg: 20,
          reps: 10,
          estimated1RM: 26.7,
          date: '2026-10-18',
        },
        {
          id: 'pr_2',
          userId: 'user_rahul',
          exerciseName: 'Barbell Flat Bench Press',
          weightKg: 65,
          reps: 8,
          estimated1RM: 82.3,
          date: '2026-10-14',
        },
      ];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(`physiofit_prs_${userId}`, JSON.stringify(personalRecords));
  }, [personalRecords, userId]);

  // Meal Logs
  const [mealLogs, setMealLogs] = useState<MealLog[]>(() => {
    const saved = localStorage.getItem(`physiofit_meals_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    if (userId === 'user_rahul') {
      const today = new Date().toISOString().split('T')[0];
      return [
        {
          id: 'meal_1',
          userId: 'user_rahul',
          date: today,
          mealType: 'breakfast',
          foodId: 'food_steamed_idli',
          foodName: 'Steamed Rice & Urad Dal Idli',
          servings: 1,
          calories: 135,
          proteinG: 4.2,
          carbsG: 28.0,
          fatG: 0.6,
        },
        {
          id: 'meal_2',
          userId: 'user_rahul',
          date: today,
          mealType: 'breakfast',
          foodId: 'food_sambar',
          foodName: 'Vegetable Sambar',
          servings: 1,
          calories: 90,
          proteinG: 3.8,
          carbsG: 14.5,
          fatG: 2.1,
        },
        {
          id: 'meal_3',
          userId: 'user_rahul',
          date: today,
          mealType: 'lunch',
          foodId: 'food_roti_plain',
          foodName: 'Whole Wheat Roti / Chapati (Without Ghee)',
          servings: 3,
          calories: 255,
          proteinG: 9.3,
          carbsG: 52.5,
          fatG: 1.5,
        },
        {
          id: 'meal_4',
          userId: 'user_rahul',
          date: today,
          mealType: 'lunch',
          foodId: 'food_dal_tadka',
          foodName: 'Yellow Moong / Toor Dal Tadka',
          servings: 1.5,
          calories: 218,
          proteinG: 12.3,
          carbsG: 29.3,
          fatG: 6.3,
        },
        {
          id: 'meal_5',
          userId: 'user_rahul',
          date: today,
          mealType: 'lunch',
          foodId: 'food_paneer_raw',
          foodName: 'Fresh Cow Milk Paneer (Low Fat / Standard)',
          servings: 1,
          calories: 265,
          proteinG: 18.3,
          carbsG: 3.6,
          fatG: 19.5,
        },
      ];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(`physiofit_meals_${userId}`, JSON.stringify(mealLogs));
  }, [mealLogs, userId]);

  // Water Logs
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => {
    const saved = localStorage.getItem(`physiofit_water_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: `water_${today}`,
        userId,
        date: today,
        amountMl: 1750,
        goalMl: currentUser
          ? calculateWaterRecommendation(currentUser.weightKg, currentUser.activityLevel)
          : 3000,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(`physiofit_water_${userId}`, JSON.stringify(waterLogs));
  }, [waterLogs, userId]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayWaterLog = waterLogs.find((w) => w.date === todayStr);
  const todayWaterAmount = todayWaterLog ? todayWaterLog.amountMl : 0;

  const logWater = (amountMl: number) => {
    const goal = currentUser
      ? calculateWaterRecommendation(currentUser.weightKg, currentUser.activityLevel)
      : 3000;

    setWaterLogs((prev) => {
      const idx = prev.findIndex((w) => w.date === todayStr);
      if (idx >= 0) {
        const updated = [...prev];
        const newAmount = Math.max(0, updated[idx].amountMl + amountMl);
        updated[idx] = { ...updated[idx], amountMl: newAmount };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `water_${todayStr}_${Date.now()}`,
            userId,
            date: todayStr,
            amountMl: Math.max(0, amountMl),
            goalMl: goal,
          },
        ];
      }
    });

    showToast(`Logged ${amountMl > 0 ? `+${amountMl}ml` : `${amountMl}ml`} water!`);
  };

  const resetWater = () => {
    setWaterLogs((prev) =>
      prev.map((w) => (w.date === todayStr ? { ...w, amountMl: 0 } : w))
    );
    showToast('Daily water reset to 0ml.');
  };

  // Progress Metrics
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>(() => {
    const saved = localStorage.getItem(`physiofit_progress_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    if (userId === 'user_rahul') {
      return [
        {
          id: 'prog_1',
          userId: 'user_rahul',
          date: '2026-09-15',
          weightKg: 76.5,
          chestCm: 98,
          waistCm: 84,
          armsCm: 34,
          notes: 'Initial check-in at start of program',
        },
        {
          id: 'prog_2',
          userId: 'user_rahul',
          date: '2026-09-30',
          weightKg: 75.8,
          chestCm: 99,
          waistCm: 83,
          armsCm: 34.5,
          notes: 'Good energy, waist down by 1cm',
        },
        {
          id: 'prog_3',
          userId: 'user_rahul',
          date: '2026-10-15',
          weightKg: 74.2,
          chestCm: 100,
          waistCm: 81.5,
          armsCm: 35.2,
          notes: 'Noticeable upper body definition and posture improvement',
        },
      ];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(`physiofit_progress_${userId}`, JSON.stringify(progressMetrics));
  }, [progressMetrics, userId]);

  // Badges
  const [badges, setBadges] = useState<AchievementBadge[]>(() => {
    const saved = localStorage.getItem(`physiofit_badges_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_BADGES;
  });

  useEffect(() => {
    localStorage.setItem(`physiofit_badges_${userId}`, JSON.stringify(badges));
  }, [badges, userId]);

  // Admin Feedback & Issues
  const [adminFeedback, setAdminFeedback] = useState<AdminFeedback[]>(() => {
    const saved = localStorage.getItem('physiofit_feedback');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_ADMIN_FEEDBACK;
  });

  useEffect(() => {
    localStorage.setItem('physiofit_feedback', JSON.stringify(adminFeedback));
  }, [adminFeedback]);

  // Dynamic Streak Calculation
  const streak = calculateStreak(
    workoutLogs.map((l) => l.date),
    todayStr
  );

  // Active Workout Session State
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(null);

  // Rest Timer Interval
  useEffect(() => {
    if (!activeWorkout?.restTimer.active) return;
    const interval = setInterval(() => {
      setActiveWorkout((prev) => {
        if (!prev || !prev.restTimer.active) return prev;
        if (prev.restTimer.remainingSeconds <= 1) {
          // Play a small beep using Web Audio API if available
          try {
            const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
          } catch {}
          return {
            ...prev,
            restTimer: { ...prev.restTimer, active: false, remainingSeconds: 0 },
          };
        }
        return {
          ...prev,
          restTimer: {
            ...prev.restTimer,
            remainingSeconds: prev.restTimer.remainingSeconds - 1,
          },
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout?.restTimer.active]);

  const startWorkout = (program: WorkoutProgram) => {
    const plannedExercises: LoggedExercise[] = program.exercises.map((pe) => {
      const exerciseDef = exercises.find((e) => e.id === pe.exerciseId);
      const setsCount = pe.sets || exerciseDef?.defaultSets || 3;
      const parsedReps = parseInt(pe.reps) || 10;

      const sets = Array.from({ length: setsCount }).map((_, i) => ({
        setNumber: i + 1,
        reps: parsedReps,
        weightKg: 0,
        completed: false,
      }));

      return {
        exerciseId: pe.exerciseId,
        exerciseName: exerciseDef?.name || 'Exercise',
        targetMuscles: exerciseDef?.targetMuscles || [],
        sets,
      };
    });

    setActiveWorkout({
      programId: program.id,
      programTitle: program.title,
      startTime: Date.now(),
      exercises: plannedExercises,
      currentExerciseIndex: 0,
      restTimer: {
        active: false,
        remainingSeconds: 0,
        totalSeconds: 60,
      },
    });

    showToast(`Started "${program.title}" workout!`);
  };

  const updateActiveSet = (
    exerciseIndex: number,
    setIndex: number,
    reps: number,
    weightKg: number,
    completed: boolean
  ) => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const updatedExercises = [...prev.exercises];
      const ex = { ...updatedExercises[exerciseIndex] };
      const sets = [...ex.sets];
      sets[setIndex] = {
        ...sets[setIndex],
        reps,
        weightKg,
        completed,
      };
      ex.sets = sets;
      updatedExercises[exerciseIndex] = ex;

      return {
        ...prev,
        exercises: updatedExercises,
      };
    });

    // If marked completed, trigger rest timer
    if (completed) {
      const currentExId = activeWorkout?.exercises[exerciseIndex]?.exerciseId;
      const exDef = exercises.find((e) => e.id === currentExId);
      const restSec = exDef?.defaultRestSeconds || 60;
      startRestTimer(restSec);
    }
  };

  const startRestTimer = (seconds: number) => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        restTimer: {
          active: true,
          remainingSeconds: seconds,
          totalSeconds: seconds,
        },
      };
    });
  };

  const stopRestTimer = () => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        restTimer: {
          ...prev.restTimer,
          active: false,
          remainingSeconds: 0,
        },
      };
    });
  };

  const addRestTime = (seconds: number) => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        restTimer: {
          ...prev.restTimer,
          remainingSeconds: prev.restTimer.remainingSeconds + seconds,
          totalSeconds: prev.restTimer.totalSeconds + seconds,
        },
      };
    });
  };

  const nextExercise = () => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const nextIdx = Math.min(prev.exercises.length - 1, prev.currentExerciseIndex + 1);
      return {
        ...prev,
        currentExerciseIndex: nextIdx,
        restTimer: { active: false, remainingSeconds: 0, totalSeconds: 60 },
      };
    });
  };

  const prevExercise = () => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const prevIdx = Math.max(0, prev.currentExerciseIndex - 1);
      return {
        ...prev,
        currentExerciseIndex: prevIdx,
        restTimer: { active: false, remainingSeconds: 0, totalSeconds: 60 },
      };
    });
  };

  const cancelWorkout = () => {
    setActiveWorkout(null);
    showToast('Workout cancelled.');
  };

  const finishWorkout = (): WorkoutLog | null => {
    if (!activeWorkout) return null;
    const durationMinutes = Math.max(
      1,
      Math.round((Date.now() - activeWorkout.startTime) / 60000)
    );

    // Calculate volume
    const allSets = activeWorkout.exercises.flatMap((e) => e.sets);
    const volumeKg = calculateWorkoutVolume(allSets);

    const newLog: WorkoutLog = {
      id: `log_${Date.now()}`,
      userId,
      programId: activeWorkout.programId,
      programName: activeWorkout.programTitle,
      date: todayStr,
      durationMinutes,
      volumeKg,
      exercisesCompleted: activeWorkout.exercises.filter((e) =>
        e.sets.some((s) => s.completed)
      ),
    };

    setWorkoutLogs((prev) => [newLog, ...prev]);

    // Check for new Personal Records
    activeWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.completed && set.weightKg > 0) {
          const est1RM = calculateEstimated1RM(set.weightKg, set.reps);
          setPersonalRecords((currentPRs) => {
            const existing = currentPRs.find((pr) => pr.exerciseName === ex.exerciseName);
            if (!existing || est1RM > existing.estimated1RM) {
              const updatedPRs = currentPRs.filter((pr) => pr.exerciseName !== ex.exerciseName);
              return [
                ...updatedPRs,
                {
                  id: `pr_${Date.now()}_${ex.exerciseId}`,
                  userId,
                  exerciseName: ex.exerciseName,
                  weightKg: set.weightKg,
                  reps: set.reps,
                  estimated1RM: est1RM,
                  date: todayStr,
                },
              ];
            }
            return currentPRs;
          });
        }
      });
    });

    // Check unlock badges
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === 'badge_first_workout') return { ...b, isUnlocked: true, unlockedAt: new Date().toISOString() };
        if (b.id === 'badge_century_club' && volumeKg >= 1000) return { ...b, isUnlocked: true, unlockedAt: new Date().toISOString() };
        return b;
      })
    );

    setActiveWorkout(null);
    showToast(`Great work! Finished ${activeWorkout.programTitle} (${volumeKg.toLocaleString()}kg volume)`);
    return newLog;
  };

  // Auth Operations
  const login = (email: string, password?: string) => {
    const normalized = email.trim().toLowerCase();
    const user = usersList.find((u) => u.email.toLowerCase() === normalized);
    if (!user) {
      return { success: false, error: 'No account found with this email. Please sign up.' };
    }
    // Simulation: accept any password for convenience or standard check
    if (password && password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
    return { success: true };
  };

  const signup = (userData: Partial<UserProfile>) => {
    if (!userData.email || !userData.name) {
      return { success: false, error: 'Name and email are required.' };
    }
    const exists = usersList.some(
      (u) => u.email.toLowerCase() === userData.email!.trim().toLowerCase()
    );
    if (exists) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email: userData.email.trim().toLowerCase(),
      name: userData.name.trim(),
      role: 'user',
      age: userData.age || 25,
      gender: userData.gender || 'male',
      heightCm: userData.heightCm || 172,
      weightKg: userData.weightKg || 70,
      fitnessExperience: userData.fitnessExperience || 'beginner',
      fitnessGoal: userData.fitnessGoal || 'general_fitness',
      preferredLocation: userData.preferredLocation || 'home',
      daysPerWeek: userData.daysPerWeek || 3,
      equipment: userData.equipment || ['Bodyweight'],
      activityLevel: userData.activityLevel || 'moderately_active',
      dietaryPreference: userData.dietaryPreference || 'vegetarian',
      reminderSettings: {
        workoutReminders: true,
        workoutTime: '07:30',
        waterReminders: true,
        waterIntervalHours: 2,
        mobilityBreakReminders: true,
      },
      createdAt: new Date().toISOString(),
    };

    setUsersList((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Welcome to PhysioFit, ${newUser.name}!`);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully.');
  };

  const switchUserRole = (targetRole: 'user' | 'admin') => {
    if (targetRole === 'admin') {
      const admin = usersList.find((u) => u.role === 'admin') || INITIAL_ADMIN;
      setCurrentUser(admin);
      showToast(`Switched to Administrator (${admin.name})`);
    } else {
      const user = usersList.find((u) => u.role === 'user') || INITIAL_USER;
      setCurrentUser(user);
      showToast(`Switched to User profile (${user.name})`);
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsersList((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast('Profile updated successfully.');
  };

  // Exercise Library CRUD
  const addExercise = (item: Omit<Exercise, 'id'>) => {
    const newEx: Exercise = {
      ...item,
      id: `ex_custom_${Date.now()}`,
      isCustom: true,
    };
    setExercises((prev) => [newEx, ...prev]);
    showToast(`Exercise "${item.name}" added to library!`);
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    showToast('Exercise details updated.');
  };

  const deleteExercise = (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
    showToast('Exercise removed.');
  };

  const addProgram = (prog: Omit<WorkoutProgram, 'id'>) => {
    const newProg: WorkoutProgram = {
      ...prog,
      id: `prog_${Date.now()}`,
    };
    setPrograms((prev) => [newProg, ...prev]);
    showToast(`Program "${prog.title}" published!`);
  };

  const addMobilityRoutine = (routine: Omit<MobilityRoutine, 'id'>) => {
    const newRoutine: MobilityRoutine = {
      ...routine,
      id: `mob_${Date.now()}`,
    };
    setMobilityRoutines((prev) => [newRoutine, ...prev]);
    showToast(`Mobility routine "${routine.title}" published!`);
  };

  // Nutrition Operations
  const addCustomFood = (food: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = {
      ...food,
      id: `food_${Date.now()}`,
      isCustom: true,
    };
    setFoodDatabase((prev) => [newFood, ...prev]);
    showToast(`Added "${food.name}" to food database!`);
  };

  const addMealLog = (meal: Omit<MealLog, 'id' | 'userId'>) => {
    const newMeal: MealLog = {
      ...meal,
      id: `meal_${Date.now()}`,
      userId,
    };
    setMealLogs((prev) => [newMeal, ...prev]);
    showToast(`Logged ${meal.foodName} (${meal.calories} kcal)`);
  };

  const deleteMealLog = (id: string) => {
    setMealLogs((prev) => prev.filter((m) => m.id !== id));
    showToast('Meal log entry removed.');
  };

  // Progress Metrics Operations
  const addProgressMetric = (metric: Omit<ProgressMetric, 'id' | 'userId'>) => {
    const newMetric: ProgressMetric = {
      ...metric,
      id: `metric_${Date.now()}`,
      userId,
    };
    // Also update user's current weight in profile
    if (currentUser && metric.weightKg) {
      updateUserProfile({ weightKg: metric.weightKg });
    }
    setProgressMetrics((prev) => [newMetric, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
    showToast(`Logged weight ${metric.weightKg} kg on ${metric.date}`);
  };

  const updateProgressMetric = (id: string, updates: Partial<ProgressMetric>) => {
    setProgressMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    showToast('Measurement entry updated.');
  };

  const deleteProgressMetric = (id: string) => {
    setProgressMetrics((prev) => prev.filter((m) => m.id !== id));
    showToast('Measurement entry removed.');
  };

  // Feedback Submission
  const submitFeedback = (
    subject: string,
    message: string,
    category: AdminFeedback['category']
  ) => {
    const fb: AdminFeedback = {
      id: `fb_${Date.now()}`,
      userId,
      userName: currentUser ? currentUser.name : 'Guest User',
      userEmail: currentUser ? currentUser.email : 'guest@physiofit.in',
      category,
      subject,
      message,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setAdminFeedback((prev) => [fb, ...prev]);
    showToast('Thank you! Your feedback has been sent to our physiotherapists.');
  };

  const resolveFeedback = (id: string) => {
    setAdminFeedback((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'resolved' } : f))
    );
    showToast('Issue marked as resolved.');
  };

  const dailyMotivation =
    'Train smart today so you can move pain-free for decades. Consistency beats intensity.';

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        setCurrentUser,
        usersList,
        login,
        signup,
        logout,
        switchUserRole,
        updateUserProfile,

        exercises,
        addExercise,
        updateExercise,
        deleteExercise,
        programs,
        addProgram,
        mobilityRoutines,
        addMobilityRoutine,

        activeWorkout,
        startWorkout,
        updateActiveSet,
        startRestTimer,
        stopRestTimer,
        addRestTime,
        nextExercise,
        prevExercise,
        cancelWorkout,
        finishWorkout,

        workoutLogs,
        personalRecords,
        streak,

        foodDatabase,
        addCustomFood,
        mealLogs,
        selectedDate,
        setSelectedDate,
        addMealLog,
        deleteMealLog,
        waterLogs,
        todayWaterAmount,
        logWater,
        resetWater,

        progressMetrics,
        addProgressMetric,
        updateProgressMetric,
        deleteProgressMetric,

        badges,
        dailyMotivation,

        adminFeedback,
        submitFeedback,
        resolveFeedback,

        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
