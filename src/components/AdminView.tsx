import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  Activity,
  HeartPulse,
  Utensils,
  Users,
  Globe,
  Smartphone,
  MessageSquare,
  History,
  Settings,
  LogOut,
  ShieldCheck,
  Lock,
  Search,
  Plus,
  Trash2,
  Edit2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Save,
  Eye,
  RefreshCw,
  Clock,
  Sparkles,
  Key,
  Shield,
  FileText,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const AdminView: React.FC = () => {
  const { showToast, setCurrentView } = useApp();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [login2FA, setLogin2FA] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Active Menu Tab (12 sidebar sections)
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'workouts'
    | 'exercises'
    | 'mobility'
    | 'nutrition'
    | 'users'
    | 'website'
    | 'apk'
    | 'feedback'
    | 'logs'
    | 'settings'
  >('dashboard');

  // Loading & Data States
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [exercisesList, setExercisesList] = useState<any[]>([]);
  const [mobilityList, setMobilityList] = useState<any[]>([]);
  const [nutritionList, setNutritionList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [websiteContent, setWebsiteContent] = useState<any>(null);
  const [apkReleases, setApkReleases] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for CRUD
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<any>(null);

  // Password Change State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Check existing session token on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const result = await adminApi.verifyToken();
      if (result.valid) {
        setIsAuthenticated(true);
        setAdminUser(result.admin);
        loadAllData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmittingLogin(true);

    try {
      const data = await adminApi.login(loginEmail, loginPassword, login2FA || undefined);
      setIsAuthenticated(true);
      setAdminUser(data.admin);
      showToast('Welcome, Administrator! Secure session established.');
      loadAllData();
    } catch (err: any) {
      setLoginError(err.message || 'Authentication rejected. Access denied.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setAdminUser(null);
    showToast('Administrator session closed.');
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [s, w, e, m, n, u, web, apk, fb, logs] = await Promise.all([
        adminApi.getStats(),
        adminApi.getWorkouts(),
        adminApi.getExercises(),
        adminApi.getMobility(),
        adminApi.getNutrition(),
        adminApi.getUsers(),
        adminApi.getWebsiteContent(),
        adminApi.getApkReleases(),
        adminApi.getFeedback(),
        adminApi.getAuditLogs(),
      ]);

      setStats(s);
      setWorkouts(w);
      setExercisesList(e);
      setMobilityList(m);
      setNutritionList(n);
      setUsersList(u);
      setWebsiteContent(web);
      setApkReleases(apk);
      setFeedbackList(fb);
      setAuditLogs(logs);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      showToast('Error syncing CMS data with server.');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------------
  // CRUD Actions
  // -----------------------------------------------------------------------

  // Workouts
  const handleSaveWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem?.id && !isAddingNew) {
        await adminApi.updateWorkout(editingItem.id, editingItem);
        showToast(`Workout "${editingItem.title}" updated.`);
      } else {
        await adminApi.createWorkout(editingItem);
        showToast(`New workout "${editingItem.title}" published.`);
      }
      setEditingItem(null);
      setIsAddingNew(false);
      const updated = await adminApi.getWorkouts();
      setWorkouts(updated);
    } catch (err: any) {
      showToast(err.message || 'Failed to save workout.');
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await adminApi.deleteWorkout(id);
      showToast('Workout plan removed.');
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      setDeleteConfirmId(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete workout.');
    }
  };

  const handleDuplicateWorkout = async (workout: any) => {
    const dup = {
      ...workout,
      id: `prog_${Date.now()}`,
      title: `${workout.title} (Copy)`,
      status: 'draft',
    };
    try {
      await adminApi.createWorkout(dup);
      showToast(`Duplicated "${workout.title}" as draft.`);
      const updated = await adminApi.getWorkouts();
      setWorkouts(updated);
    } catch (err: any) {
      showToast('Failed to duplicate workout.');
    }
  };

  // Exercises
  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem?.id && !isAddingNew) {
        await adminApi.updateExercise(editingItem.id, editingItem);
        showToast(`Exercise "${editingItem.name}" updated.`);
      } else {
        await adminApi.createExercise(editingItem);
        showToast(`Exercise "${editingItem.name}" added to library.`);
      }
      setEditingItem(null);
      setIsAddingNew(false);
      const updated = await adminApi.getExercises();
      setExercisesList(updated);
    } catch (err: any) {
      showToast(err.message || 'Failed to save exercise.');
    }
  };

  const handleDeleteExercise = async (id: string) => {
    try {
      await adminApi.deleteExercise(id);
      showToast('Exercise removed.');
      setExercisesList((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirmId(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete exercise.');
    }
  };

  // Mobility
  const handleSaveMobility = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem?.id && !isAddingNew) {
        await adminApi.updateMobility(editingItem.id, editingItem);
        showToast(`Mobility routine "${editingItem.title}" updated.`);
      } else {
        await adminApi.createMobility(editingItem);
        showToast(`Mobility routine "${editingItem.title}" created.`);
      }
      setEditingItem(null);
      setIsAddingNew(false);
      const updated = await adminApi.getMobility();
      setMobilityList(updated);
    } catch (err: any) {
      showToast('Failed to save mobility routine.');
    }
  };

  // Nutrition
  const handleSaveNutrition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem?.id && !isAddingNew) {
        await adminApi.updateNutrition(editingItem.id, editingItem);
        showToast(`Nutrition article "${editingItem.title}" updated.`);
      } else {
        await adminApi.createNutrition(editingItem);
        showToast(`Nutrition article "${editingItem.title}" created.`);
      }
      setEditingItem(null);
      setIsAddingNew(false);
      const updated = await adminApi.getNutrition();
      setNutritionList(updated);
    } catch (err: any) {
      showToast('Failed to save nutrition article.');
    }
  };

  // User Status Toggle
  const handleToggleUserStatus = async (user: any) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await adminApi.updateUserStatus(user.id, nextStatus);
      setUsersList((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      );
      showToast(`User ${user.email} marked as ${nextStatus}.`);
    } catch {
      showToast('Failed to change user status.');
    }
  };

  // Website Content Save
  const handleSaveWebsiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.updateWebsiteContent(websiteContent);
      showToast('Website content published! Changes are live on public site.');
    } catch {
      showToast('Failed to update website content.');
    }
  };

  // APK Releases
  const handleSaveApkRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createApkRelease(editingItem);
      showToast(`Uploaded APK release ${editingItem.version}!`);
      setEditingItem(null);
      setIsAddingNew(false);
      const updated = await adminApi.getApkReleases();
      setApkReleases(updated);
    } catch {
      showToast('Failed to create APK release.');
    }
  };

  const handleActivateApkRelease = async (id: string) => {
    try {
      await adminApi.activateApkRelease(id);
      showToast('APK release activated as live public download.');
      const updated = await adminApi.getApkReleases();
      setApkReleases(updated);
      const web = await adminApi.getWebsiteContent();
      setWebsiteContent(web);
    } catch {
      showToast('Failed to activate APK release.');
    }
  };

  // Feedback status update
  const handleUpdateFeedbackStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateFeedbackStatus(id, status);
      setFeedbackList((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status } : f))
      );
      showToast(`Feedback updated to ${status}.`);
    } catch {
      showToast('Failed to update feedback status.');
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setPasswordMsg({ text: 'New passwords do not match.', error: true });
      return;
    }
    try {
      await adminApi.changePassword(currentPass, newPass);
      setPasswordMsg({ text: 'Password successfully changed and verified on server!' });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      setPasswordMsg({ text: err.message || 'Failed to change password.', error: true });
    }
  };

  // -----------------------------------------------------------------------
  // Render: Loading Screen
  // -----------------------------------------------------------------------
  if (loading && isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 animate-spin text-emerald-400" />
          <span className="text-sm font-semibold">Verifying Administrator Authorization...</span>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render: Private Admin Login Gate
  // -----------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo variant="compact" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400">
            <Lock className="h-3.5 w-3.5" />
            <span>Private Administrative Portal</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Administrator Authentication
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Restricted access. Only the authorized app owner administrator account can log in and manage PhysioFit content and APK releases.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-emerald-500/5 space-y-5">
            {loginError && (
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 flex items-start gap-3 text-xs text-rose-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block text-rose-200">Access Denied</strong>
                  <span>{loginError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Owner Administrator Email *
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@physiofit.in"
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Administrator Password *
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Optional 2FA Code (if enabled)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={login2FA}
                  onChange={(e) => setLogin2FA(e.target.value)}
                  placeholder="6-digit authenticator code (optional)"
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono tracking-widest focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingLogin}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-400 py-3 text-center text-xs font-black text-slate-950 shadow-xl shadow-emerald-500/20 hover:from-emerald-400 hover:to-lime-300 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
                  <span>{isSubmittingLogin ? 'Verifying Authorization...' : 'Authenticate & Open Dashboard'}</span>
                </button>
              </div>
            </form>

            <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-emerald-400" />
                <span>Default Owner Admin Account:</span>
              </div>
              <p>Email: <strong className="text-white">admin@physiofit.in</strong></p>
              <p>Password: <strong className="text-white">PhysioFit@Admin2026!</strong></p>
              <p className="text-[10px] text-slate-500 pt-1">
                You can change this password or configure 2FA anytime directly from the Settings tab once logged in.
              </p>
            </div>

            <div className="text-center pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentView('website')}
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
              >
                ← Return to PhysioFit Public Website
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render: Authenticated Private Admin CMS Dashboard
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex font-sans">
      {/* Sidebar Navigation (12 Sections) */}
      <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0">
        {/* Brand header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-base">PhysioFit CMS</span>
            <span className="rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 border border-emerald-500/30">
              Admin
            </span>
          </div>
        </div>

        {/* Admin profile snippet */}
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800 text-xs">
          <div className="font-bold text-white truncate">{adminUser?.name || 'Administrator'}</div>
          <div className="text-slate-400 text-[11px] truncate">{adminUser?.email || 'admin@physiofit.in'}</div>
        </div>

        {/* Menu list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-semibold">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'workouts', label: 'Workouts', icon: Dumbbell, count: workouts.length },
            { id: 'exercises', label: 'Exercise Library', icon: Activity, count: exercisesList.length },
            { id: 'mobility', label: 'Physiotherapy & Mobility', icon: HeartPulse, count: mobilityList.length },
            { id: 'nutrition', label: 'Nutrition Content', icon: Utensils, count: nutritionList.length },
            { id: 'users', label: 'Users', icon: Users, count: usersList.length },
            { id: 'website', label: 'Website Content', icon: Globe },
            { id: 'apk', label: 'APK Releases', icon: Smartphone, count: apkReleases.length },
            { id: 'feedback', label: 'Feedback & Inquiries', icon: MessageSquare, count: feedbackList.filter(f => f.status === 'in_review').length },
            { id: 'logs', label: 'Activity Logs', icon: History, count: auditLogs.length },
            { id: 'settings', label: 'Settings & Security', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id as any);
                  setSearchQuery('');
                  setEditingItem(null);
                }}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 transition-all text-left ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/15'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                      isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 12. Logout Item */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <button
            type="button"
            onClick={() => setCurrentView('website')}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>Public Website</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900 capitalize">
              {activeTab === 'dashboard' && 'Admin Overview & Metrics'}
              {activeTab === 'workouts' && 'Workout Plans CMS'}
              {activeTab === 'exercises' && 'Exercise Library & Biomechanics'}
              {activeTab === 'mobility' && 'Physiotherapy & Mobility Manager'}
              {activeTab === 'nutrition' && 'Nutrition & Habit Education'}
              {activeTab === 'users' && 'Registered Users Management'}
              {activeTab === 'website' && 'Live Website & Landing Page CMS'}
              {activeTab === 'apk' && 'Android APK Release Pipeline'}
              {activeTab === 'feedback' && 'User Feedback & Support Desk'}
              {activeTab === 'logs' && 'Administrative Audit Activity Logs'}
              {activeTab === 'settings' && 'Security & Account Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={loadAllData}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-600 hover:text-slate-900 shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white shadow-sm hover:bg-emerald-500 transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Launch App</span>
            </button>
          </div>
        </header>

        {/* Body content based on activeTab */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Total Registered Users</span>
                    <Users className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{stats?.totalUsers ?? usersList.length}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">
                    {stats?.activeUsers ?? usersList.filter(u => u.status === 'active').length} Active Accounts
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Exercise Tutorials</span>
                    <Activity className="h-4 w-4 text-cyan-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{stats?.totalExercises ?? exercisesList.length}</div>
                  <div className="text-[11px] text-slate-500">
                    {stats?.publishedExercises ?? exercisesList.filter(e => e.status === 'published').length} Published · {stats?.draftExercises ?? 0} Drafts
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Workout Programs</span>
                    <Dumbbell className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{stats?.totalWorkouts ?? workouts.length}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">
                    {stats?.publishedWorkouts ?? workouts.length} Live in App
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Current Android APK</span>
                    <Smartphone className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-xl font-black text-slate-900">{stats?.currentApk?.version || 'v2.4.0'}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">
                    Build {stats?.currentApk?.build || 108} · Live Signed
                  </div>
                </div>
              </div>

              {/* Quick Jump Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Admin Audit Activity */}
                <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <History className="h-4 w-4 text-emerald-600" />
                      <span>Recent Administrative Actions</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('logs')}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      View All Logs →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">{log.action}</span>
                          <span className="text-slate-600 text-[11px]">{log.details}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Quick Publishing Status */}
                <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span>Live Content Architecture</span>
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-semibold text-slate-700">Workout Plans:</span>
                      <strong className="text-slate-900">{workouts.length} Active Plans</strong>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-semibold text-slate-700">Mobility & Rehab Routines:</span>
                      <strong className="text-slate-900">{mobilityList.length} Protocols</strong>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-semibold text-slate-700">Nutrition & Habit Articles:</span>
                      <strong className="text-slate-900">{nutritionList.length} Educational Pieces</strong>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-semibold text-slate-700">Pending User Inquiries:</span>
                      <strong className="text-amber-600 font-bold">{feedbackList.filter(f => f.status === 'in_review').length} Under Review</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORKOUTS MANAGEMENT */}
          {activeTab === 'workouts' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search workout plans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingItem({
                      title: '',
                      subtitle: '',
                      level: 'intermediate',
                      location: 'gym',
                      category: 'strength',
                      durationWeeks: 6,
                      daysPerWeek: 4,
                      status: 'published',
                      description: '',
                      warmupSummary: '',
                      cooldownSummary: '',
                      videoUrl: '',
                    });
                    setIsAddingNew(true);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create New Workout</span>
                </button>
              </div>

              {/* Workouts Table */}
              <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Title & Subtitle</th>
                      <th className="p-4">Level / Category</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workouts
                      .filter((w) => w.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((w) => (
                        <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{w.title}</div>
                            <div className="text-slate-500 text-[11px] truncate max-w-xs">{w.subtitle}</div>
                          </td>
                          <td className="p-4 capitalize">
                            <span className="font-semibold text-slate-800">{w.level}</span> · <span className="text-slate-500">{w.category}</span>
                          </td>
                          <td className="p-4 capitalize text-slate-600">{w.location}</td>
                          <td className="p-4 text-slate-600">{w.durationWeeks} weeks ({w.daysPerWeek}d/wk)</td>
                          <td className="p-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                w.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {w.status || 'published'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1">
                            <button
                              type="button"
                              onClick={() => handleDuplicateWorkout(w)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                              title="Duplicate as draft"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(w);
                                setIsAddingNew(false);
                              }}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                              title="Edit Workout"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(w.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                              title="Delete Workout"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: EXERCISE LIBRARY */}
          {activeTab === 'exercises' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search exercise tutorials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingItem({
                      name: '',
                      category: 'strength',
                      targetMuscles: ['Chest'],
                      equipment: ['Dumbbells'],
                      difficulty: 'beginner',
                      location: 'both',
                      defaultSets: 3,
                      defaultReps: '10-12',
                      defaultRestSeconds: 60,
                      description: '',
                      youtubeVideoId: 'IODxDxX7oi4',
                      youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
                      startingPosition: '',
                      cues: ['Core tight'],
                      commonMistakes: ['Rushing tempo'],
                      safetyInstructions: ['Warm up joints properly'],
                      status: 'published',
                    });
                    setIsAddingNew(true);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Exercise</span>
                </button>
              </div>

              {/* Exercises Table */}
              <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Exercise Name</th>
                      <th className="p-4">Target Muscles</th>
                      <th className="p-4">Category / Level</th>
                      <th className="p-4">Equipment</th>
                      <th className="p-4">Video Link</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {exercisesList
                      .filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((ex) => (
                        <tr key={ex.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-bold text-slate-900">{ex.name}</td>
                          <td className="p-4 text-slate-600">{Array.isArray(ex.targetMuscles) ? ex.targetMuscles.join(', ') : ex.targetMuscles}</td>
                          <td className="p-4 capitalize">
                            <span className="font-semibold text-slate-800">{ex.category}</span> · <span className="text-slate-500">{ex.difficulty}</span>
                          </td>
                          <td className="p-4 text-slate-600">{Array.isArray(ex.equipment) ? ex.equipment.join(', ') : ex.equipment}</td>
                          <td className="p-4">
                            {ex.youtubeVideoId ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600">
                                <span>YT: {ex.youtubeVideoId}</span>
                              </span>
                            ) : (
                              <span className="text-slate-400">None</span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(ex);
                                setIsAddingNew(false);
                              }}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                              title="Edit Exercise"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(ex.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                              title="Delete Exercise"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PHYSIOTHERAPY & MOBILITY */}
          {activeTab === 'mobility' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Clinical Mobility & Rehabilitation Routines</h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem({
                      title: '',
                      durationMins: 8,
                      category: 'posture',
                      targetArea: '',
                      status: 'published',
                      description: '',
                      precautions: '',
                      medicalDisclaimer: 'General educational routine.',
                      drillsCount: 4,
                    });
                    setIsAddingNew(true);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Mobility Protocol</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mobilityList.map((m) => (
                  <div key={m.id} className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-600">{m.category} · {m.durationMins} mins</span>
                        <h4 className="text-base font-bold text-slate-900">{m.title}</h4>
                      </div>
                      <div className="space-x-1">
                        <button
                          onClick={() => {
                            setEditingItem(m);
                            setIsAddingNew(false);
                          }}
                          className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>
                    <div className="text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-500">
                      <strong>Precautions: </strong>{m.precautions || 'None listed'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NUTRITION CONTENT */}
          {activeTab === 'nutrition' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Nutrition & Healthy Habit Articles</h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem({
                      title: '',
                      category: 'macronutrients',
                      readTimeMins: 4,
                      status: 'published',
                      summary: '',
                      content: '',
                    });
                    setIsAddingNew(true);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Nutrition Article</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nutritionList.map((n) => (
                  <div key={n.id} className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-600">{n.category} · {n.readTimeMins} min read</span>
                        <h4 className="text-base font-bold text-slate-900">{n.title}</h4>
                      </div>
                      <button
                        onClick={() => {
                          setEditingItem(n);
                          setIsAddingNew(false);
                        }}
                        className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Registered Users Directory (Privacy Protected)</h3>
                <span className="text-xs text-slate-500 font-semibold">{usersList.length} Accounts Registered</span>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">User Name & ID</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Tier</th>
                      <th className="p-4">Joined</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-slate-400 font-mono text-[10px]">{u.id}</div>
                        </td>
                        <td className="p-4 text-slate-700">{u.email}</td>
                        <td className="p-4">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-[10px] text-emerald-700 border border-emerald-200 uppercase">
                            {u.membershipTier || 'free'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                              u.status === 'active'
                                ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: WEBSITE CONTENT (CMS) */}
          {activeTab === 'website' && websiteContent && (
            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Live Website Content Management</h3>
                <p className="text-xs text-slate-500">
                  Changes published here immediately update headings, about copy, and announcements on the public website.
                </p>
              </div>

              <form onSubmit={handleSaveWebsiteContent} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Homepage Hero Main Heading *
                  </label>
                  <input
                    type="text"
                    required
                    value={websiteContent.heroHeading}
                    onChange={(e) => setWebsiteContent({ ...websiteContent, heroHeading: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Homepage Hero Supporting Text *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={websiteContent.heroSubhead}
                    onChange={(e) => setWebsiteContent({ ...websiteContent, heroSubhead: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      About Us Section Heading *
                    </label>
                    <input
                      type="text"
                      required
                      value={websiteContent.aboutHeading}
                      onChange={(e) => setWebsiteContent({ ...websiteContent, aboutHeading: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Public Support Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={websiteContent.contactPhone}
                      onChange={(e) => setWebsiteContent({ ...websiteContent, contactPhone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    About Us Mission Statement *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={websiteContent.aboutText}
                    onChange={(e) => setWebsiteContent({ ...websiteContent, aboutText: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-6 py-2.5 font-bold text-white hover:bg-emerald-500 shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Save className="h-4 w-4" />
                    <span>Publish Changes to Live Website</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: APK RELEASES */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Signed Android APK Releases</h3>
                  <p className="text-xs text-slate-500">Manage release builds, verify SHA-256 checksums, and publish download links.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingItem({
                      version: 'v2.5.0',
                      buildNumber: 110,
                      fileSize: '29.1 MB',
                      minAndroid: 'Android 8.0 (API 26)',
                      releaseNotes: '',
                      sha256: '',
                      makeCurrent: true,
                    });
                    setIsAddingNew(true);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Upload / Add APK Release</span>
                </button>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Version & Build</th>
                      <th className="p-4">File Size</th>
                      <th className="p-4">Compatibility</th>
                      <th className="p-4">SHA-256 Checksum</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {apkReleases.map((rel) => (
                      <tr key={rel.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-900">
                          {rel.version} (Build {rel.buildNumber})
                          {rel.isCurrent && (
                            <span className="ml-2 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-extrabold border border-emerald-200">
                              Active Live
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-600">{rel.fileSize}</td>
                        <td className="p-4 text-slate-600">{rel.minAndroid}</td>
                        <td className="p-4 font-mono text-[10px] text-slate-500 max-w-xs truncate" title={rel.sha256}>
                          {rel.sha256}
                        </td>
                        <td className="p-4 capitalize text-slate-700">{rel.status}</td>
                        <td className="p-4 text-right">
                          {!rel.isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleActivateApkRelease(rel.id)}
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                            >
                              Activate on Website
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: FEEDBACK & INQUIRIES */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">User Inquiries & Exercise Feedback</h3>

              <div className="space-y-3">
                {feedbackList.map((fb) => (
                  <div key={fb.id} className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-600">{fb.category}</span>
                        <h4 className="text-base font-bold text-slate-900">{fb.subject}</h4>
                        <div className="text-xs text-slate-500">From: {fb.name} ({fb.email})</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            fb.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {fb.status}
                        </span>
                        {fb.status !== 'resolved' && (
                          <button
                            onClick={() => handleUpdateFeedbackStatus(fb.id, 'resolved')}
                            className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-500"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      "{fb.message}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: AUDIT ACTIVITY LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tamper-Evident Administrative Audit Logs</h3>
                  <p className="text-xs text-slate-500">Records logins, content updates, APK releases, and security events.</p>
                </div>
                <span className="text-xs font-semibold text-slate-500">{auditLogs.length} Events Logged</span>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Action Type</th>
                      <th className="p-4">Admin Account</th>
                      <th className="p-4">Target / Entity</th>
                      <th className="p-4">Details</th>
                      <th className="p-4">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-slate-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 font-bold text-slate-900">{log.action}</td>
                        <td className="p-4 text-slate-700">{log.adminEmail}</td>
                        <td className="p-4 text-slate-700">{log.target || '—'}</td>
                        <td className="p-4 text-slate-600 font-sans text-xs">{log.details}</td>
                        <td className="p-4 text-slate-400">{log.ip || '127.0.0.1'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 11: SETTINGS & SECURITY */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Key className="h-4 w-4 text-emerald-600" />
                  <span>Update Administrator Credentials</span>
                </h3>

                {passwordMsg && (
                  <div
                    className={`rounded-xl p-3 text-xs ${
                      passwordMsg.error
                        ? 'bg-rose-50 border border-rose-200 text-rose-700'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    }`}
                  >
                    {passwordMsg.text}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Current Password *</label>
                    <input
                      type="password"
                      required
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">New Password (Min 8 chars) *</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-sm"
                  >
                    Update Server Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: Add / Edit Workout */}
      {editingItem && activeTab === 'workouts' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                {isAddingNew ? 'Create New Workout Plan' : 'Edit Workout Plan'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-1 rounded text-slate-400 hover:text-slate-900">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkout} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Goal *</label>
                <input
                  type="text"
                  required
                  value={editingItem.subtitle}
                  onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience Level</label>
                  <select
                    value={editingItem.level}
                    onChange={(e) => setEditingItem({ ...editingItem, level: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <select
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  >
                    <option value="gym">Gym</option>
                    <option value="home">Home</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500"
                >
                  Save Workout Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Exercise */}
      {editingItem && activeTab === 'exercises' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                {isAddingNew ? 'Add New Exercise Tutorial' : 'Edit Exercise Tutorial'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-1 rounded text-slate-400 hover:text-slate-900">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExercise} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exercise Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  >
                    <option value="strength">Strength</option>
                    <option value="mobility">Mobility</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="cardio">Cardio</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={editingItem.difficulty}
                    onChange={(e) => setEditingItem({ ...editingItem, difficulty: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">YouTube Video ID or Full URL *</label>
                <input
                  type="text"
                  required
                  value={editingItem.youtubeVideoId || editingItem.youtubeUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    let vidId = val;
                    if (val.includes('v=')) vidId = val.split('v=')[1].split('&')[0];
                    if (val.includes('youtu.be/')) vidId = val.split('youtu.be/')[1].split('?')[0];
                    setEditingItem({
                      ...editingItem,
                      youtubeVideoId: vidId,
                      youtubeUrl: `https://www.youtube.com/watch?v=${vidId}`,
                    });
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                  placeholder="e.g. IODxDxX7oi4"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Starting Position & Setup</label>
                <textarea
                  rows={2}
                  value={editingItem.startingPosition || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, startingPosition: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500"
                >
                  Save Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Destructive Actions */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4 text-xs text-center">
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Confirm Permanent Deletion</h4>
              <p className="text-slate-500 mt-1">
                Are you sure you want to remove this item? This action will immediately remove it from all user apps.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'workouts') handleDeleteWorkout(deleteConfirmId);
                  if (activeTab === 'exercises') handleDeleteExercise(deleteConfirmId);
                }}
                className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-500 shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
