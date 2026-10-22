import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { WorkoutsView } from './components/WorkoutsView';
import { PhysioMobilityView } from './components/PhysioMobilityView';
import { NutritionView } from './components/NutritionView';
import { ProgressView } from './components/ProgressView';
import { AdminView } from './components/AdminView';
import { WebsiteView } from './components/WebsiteView';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { AuthOnboardingModal } from './components/AuthOnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { FeedbackModal } from './components/FeedbackModal';
import { HeartPulse, ShieldCheck, MessageSquare, AlertCircle, Smartphone, Lock } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, toast } = useApp();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'reminders' | 'membership'>('profile');

  // Check URL pathname or hash on load to support direct /download and /admin/login navigation
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/download' || hash === '#download') {
      setCurrentView('download');
    } else if (path === '/admin' || path === '/admin/login' || hash === '#admin' || hash === '#admin/login') {
      setCurrentView('admin');
    }
  }, [setCurrentView]);

  const handleOpenSettings = (tab: 'profile' | 'reminders' | 'membership' = 'profile') => {
    setSettingsTab(tab);
    setShowSettingsModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300 pb-20 md:pb-8">
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenSettings={handleOpenSettings}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {(currentView === 'website' || currentView === 'download') && (
          <WebsiteView
            onLaunchApp={() => setCurrentView('dashboard')}
            initialSection={currentView === 'download' ? 'download' : undefined}
          />
        )}
        {currentView === 'dashboard' && (
          <DashboardView
            onOpenFeedback={() => setShowFeedbackModal(true)}
            onOpenSettings={handleOpenSettings}
          />
        )}
        {currentView === 'workouts' && <WorkoutsView />}
        {currentView === 'physio' && <PhysioMobilityView />}
        {currentView === 'nutrition' && <NutritionView />}
        {currentView === 'progress' && <ProgressView />}
        {currentView === 'admin' && <AdminView />}
      </main>

      {/* Web App Footer (Only shown when browsing app views) */}
      {currentView !== 'website' && currentView !== 'download' && (
        <footer className="mt-auto border-t border-[#222a36] bg-[#0b0e13] py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white">PhysioFit</span>
              <span aria-hidden="true">·</span>
              <span>Train Smart. Move Better.</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <button
                onClick={() => setCurrentView('website')}
                className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-semibold"
              >
                <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
                <span>Official Website & APK</span>
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Contact Clinicians</span>
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setCurrentView('admin')}
                className="text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
                title="Authorized Administrator Login"
              >
                <Lock className="h-3 w-3" />
                <span>Admin</span>
              </button>
              <span aria-hidden="true">·</span>
              <span>Evidence-Based Biomechanics & Movement</span>
            </div>
          </div>
        </footer>
      )}

      {/* Modals & Overlays */}
      <ActiveWorkoutModal />
      <AuthOnboardingModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        initialTab={settingsTab}
      />
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />

      {/* Tactile Notification Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 rounded-xl bg-gradient-to-r from-slate-900 to-[#141a22] border border-emerald-500/40 px-4 py-3 text-xs font-semibold text-white shadow-xl shadow-black/50 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            ✓
          </div>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
