import React, { useState } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  Activity,
  Utensils,
  TrendingUp,
  ShieldAlert,
  User,
  LogOut,
  SlidersHorizontal,
  Phone,
  Crown,
  Smartphone,
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { ConsultationModal } from './ConsultationModal';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenSettings: (tab?: 'profile' | 'reminders' | 'membership') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenSettings }) => {
  const { currentView, setCurrentView, currentUser, logout } = useApp();
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  const cleanUserName = currentUser
    ? currentUser.name.replace(/^(Dr\.?|Admin|Dr)\s+/i, '').replace(/,\s*[A-Z]+$/i, '').trim()
    : '';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'physio', label: 'Mobility & Rehab', icon: Activity },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin CMS', icon: ShieldAlert });
  }

  return (
    <>
      {/* Desktop Top Navigation Bar (Adhering to strict 3-zone contract) */}
      <header className="sticky top-0 z-30 w-full border-b border-[#262d38] bg-[#0e1217]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand Logo & Tagline */}
          <div className="shrink-0">
            <BrandLogo
              variant="compact"
              onClick={() => setCurrentView('dashboard')}
            />
          </div>

          {/* Zone 2: Single-line clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs lg:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'text-slate-400 hover:bg-[#1a212c] hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary action & Profile controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Website & APK Download Button */}
            <button
              onClick={() => setCurrentView('website')}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-all ${
                currentView === 'website'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                  : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 active:scale-95'
              }`}
              title="Official PhysioFit Website & Android APK"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Website & APK</span>
            </button>

            {/* Quick Consultant Helpline Button */}
            <button
              onClick={() => setIsConsultModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition-all"
              title="Contact Clinical Consultant / Admin Hotline"
            >
              <Phone className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Consultant</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Membership Plan Tier Badge */}
                <button
                  type="button"
                  onClick={() => onOpenSettings('membership')}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold border transition-all ${
                    currentUser.subscription?.planTier === 'elite'
                      ? 'bg-amber-400/15 text-amber-300 border-amber-400/40 hover:bg-amber-400/25'
                      : currentUser.subscription?.isPro ||
                        currentUser.subscription?.planTier?.startsWith('pro')
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500/30'
                  }`}
                  title="PhysioFit Subscription Tier - Click to manage"
                >
                  <Crown className="h-3 w-3" />
                  <span className="uppercase">
                    {currentUser.subscription?.planTier === 'elite'
                      ? 'Elite'
                      : currentUser.subscription?.isPro ||
                        currentUser.subscription?.planTier?.startsWith('pro')
                      ? 'Pro'
                      : 'Free'}
                  </span>
                </button>

                <button
                  onClick={() => onOpenSettings('profile')}
                  className="flex items-center gap-2 rounded-lg border border-[#2d3542] bg-[#181f2a] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-500/40 hover:text-white transition-colors"
                  aria-label="User Settings"
                >
                  <User className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="hidden lg:inline max-w-[120px] truncate">{cleanUserName}</span>
                </button>

                <button
                  onClick={logout}
                  className="rounded-lg border border-[#2d3542] p-2 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-colors"
                  aria-label="Sign Out"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/15 whitespace-nowrap shrink-0"
              >
                Sign In / Join
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Consultant & Admin Helpline Modal */}
      <ConsultationModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
      />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-[#242b36] bg-[#0e1217]/95 backdrop-blur-lg pb-safe"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 items-center h-16 px-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-label={item.label}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="mt-1 text-[10px] font-medium tracking-tight truncate max-w-[64px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
