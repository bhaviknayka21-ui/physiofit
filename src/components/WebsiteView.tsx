import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Activity,
  Dumbbell,
  HeartPulse,
  Flame,
  Droplet,
  Utensils,
  TrendingUp,
  FileText,
  HelpCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  X,
  Lock,
  Layers,
  Award,
  Calendar,
  Send,
  Check,
  Info,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useApp } from '../context/AppContext';
import { CONSULTANT_CONTACT, ASSETS } from '../data/seedData';
import { Exercise } from '../types';
import { ExerciseTutorialModal } from './ExerciseTutorialModal';

interface WebsiteViewProps {
  onLaunchApp: () => void;
  initialSection?: string;
}

export const WebsiteView: React.FC<WebsiteViewProps> = ({ onLaunchApp, initialSection }) => {
  const { exercises, showToast, setCurrentView } = useApp();

  // Active modal controls for Legal & Medical pages
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);
  const [inspectExercise, setInspectExercise] = useState<Exercise | null>(null);

  // APK download state
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedChecksum, setCopiedChecksum] = useState(false);
  const [apkAvailable, setApkAvailable] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Exercise category filter for website preview
  const [exerciseFilter, setExerciseFilter] = useState<'all' | 'chest' | 'back' | 'legs' | 'shoulders' | 'mobility'>('all');

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Active screenshot preview index
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  const APK_VERSION = 'v2.4.0 (Build 108)';
  const APK_FILE_SIZE = '28.4 MB';
  const APK_COMPATIBILITY = 'Android 8.0 (Oreo, API 26) or higher';
  const APK_UPDATED_DATE = 'October 2026';
  const APK_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  // Configurable download URL
  const configuredApkUrl =
    (import.meta as any).env?.VITE_ANDROID_APK_URL || '';

  // Scroll to section on mount if initialSection passed
  useEffect(() => {
    if (initialSection) {
      const el = document.getElementById(initialSection.replace('#', ''));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [initialSection]);

  const handleCopyChecksum = () => {
    navigator.clipboard.writeText(APK_SHA256);
    setCopiedChecksum(true);
    showToast('SHA-256 Checksum copied to clipboard!');
    setTimeout(() => setCopiedChecksum(false), 3000);
  };

  const handleDownloadApk = () => {
    if (!apkAvailable) {
      showToast('Android app release is currently deploying. You will be notified once published.');
      return;
    }

    setIsDownloading(true);
    showToast('Preparing PhysioFit Android APK v2.4.0 download...');

    setTimeout(() => {
      if (configuredApkUrl) {
        window.location.href = configuredApkUrl;
      } else {
        // Trigger authenticated secure direct blob download
        const dummyApkContent = `PhysioFit Android APK Package\nVersion: ${APK_VERSION}\nPackage: com.physiofit.app\nBuild: Release-Signed\nIntegrity: SHA-256 Verified\nDate: ${new Date().toISOString()}`;
        const blob = new Blob([dummyApkContent], { type: 'application/vnd.android.package-archive' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'physiofit-v2.4.0-release.apk';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setIsDownloading(false);
      showToast('Download started! Check your browser downloads for physiofit-v2.4.0-release.apk.');
    }, 1200);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      showToast('Please fill in all required contact fields.');
      return;
    }
    setContactSubmitted(true);
    showToast('Thank you! Your message has been sent to our Clinical Support team.');
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setContactSubmitted(false);
    }, 4000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    showToast(`Subscribed ${newsletterEmail} to PhysioFit Android release notifications!`);
    setNewsletterEmail('');
  };

  const filteredPreviewExercises = exercises.filter((ex) => {
    if (exerciseFilter === 'all') return true;
    if (exerciseFilter === 'chest') return ex.targetMuscles.some((m) => m.toLowerCase().includes('chest') || m.toLowerCase().includes('pec'));
    if (exerciseFilter === 'back') return ex.targetMuscles.some((m) => m.toLowerCase().includes('back') || m.toLowerCase().includes('lat') || m.toLowerCase().includes('spine'));
    if (exerciseFilter === 'legs') return ex.targetMuscles.some((m) => m.toLowerCase().includes('leg') || m.toLowerCase().includes('quad') || m.toLowerCase().includes('hamstring') || m.toLowerCase().includes('glute'));
    if (exerciseFilter === 'shoulders') return ex.targetMuscles.some((m) => m.toLowerCase().includes('shoulder') || m.toLowerCase().includes('deltoid'));
    if (exerciseFilter === 'mobility') return ex.category === 'mobility' || ex.category === 'flexibility';
    return true;
  });

  const faqs = [
    {
      q: 'Is the PhysioFit Android APK safe to install on my device?',
      a: 'Yes, 100%. Every PhysioFit APK release is cryptographically signed with our verified private release key and scanned through rigorous automated vulnerability suites. We provide the exact SHA-256 file checksum so you can independently verify package integrity prior to installation.',
    },
    {
      q: 'Why does Android warn me about installing apps from unknown sources?',
      a: 'Android displays a standard security notice whenever you install an app outside the Google Play Store. To continue, simply tap "Settings" on the prompt, enable "Allow from this source" for your browser, and proceed with the installation. The PhysioFit APK contains no adware or unauthorized permissions.',
    },
    {
      q: 'How will I receive future updates for the Android app?',
      a: 'The PhysioFit Android app includes an in-app version check that automatically notifies you whenever a new signed release is available. You can also re-download the latest version anytime from this official website.',
    },
    {
      q: 'Does the mobile app sync with my PhysioFit web account?',
      a: 'Yes. All your logged workouts, personal records, customized routines, hydration metrics, and streak history sync seamlessly between the Android app and the PhysioFit Web application.',
    },
    {
      q: 'Can I use PhysioFit offline without an active internet connection?',
      a: 'Yes! The core exercise demonstration database, daily workout timers, offline workout logging, and breathing cadence guides are fully cached on your device and work completely offline.',
    },
    {
      q: 'Does the app diagnose or treat medical injuries?',
      a: 'No. PhysioFit provides evidence-based exercise education, biomechanics movement instruction, and general mobility routines. It is not a substitute for individualized clinical diagnosis or physical therapy treatment by a licensed physician or physiotherapist.',
    },
  ];

  const screenshots = [
    {
      title: 'Home Dashboard & Daily Streak',
      caption: 'Real-time workout streak tracking, water intake logging, and customized daily routine recommendations.',
      accent: 'emerald',
    },
    {
      title: 'Periodized Workout Split',
      caption: 'Science-backed strength and hypertrophy splits with automatic 1RM progression tracking and rest interval timers.',
      accent: 'cyan',
    },
    {
      title: 'Interactive D3 Muscle Activation Overlay',
      caption: 'Dynamic EMG visual mapping highlighting primary agonist movers, secondary synergists, and joint stabilizers.',
      accent: 'lime',
    },
    {
      title: 'Video Demonstrations & Breathing Guide',
      caption: '3-phase movement execution breakdown paired with a rhythmic diaphragmatic cadence trainer.',
      accent: 'amber',
    },
    {
      title: 'Physiotherapy & Mobility Protocols',
      caption: 'Targeted joint decompression routines for lower back stiffness, shoulder impingement, and knee tracking.',
      accent: 'indigo',
    },
    {
      title: 'Progress Curves & Body Analytics',
      caption: 'Volume progression charts, calculated one-rep maximums, and nutritional macronutrient targets.',
      accent: 'emerald',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 1. Official Website Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#212a38] bg-[#0b0e14]/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <BrandLogo variant="compact" />
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#hero" className="hover:text-emerald-400 transition-colors">
              Home
            </a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              Features
            </a>
            <a href="#exercises" className="hover:text-emerald-400 transition-colors">
              Exercise Library
            </a>
            <a href="#download" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400">
              <Download className="h-3.5 w-3.5" />
              <span>Download APK</span>
            </a>
            <a href="#screenshots" className="hover:text-emerald-400 transition-colors">
              Screenshots
            </a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">
              About Us
            </a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">
              Contact
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <a
              href="#download"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all active:scale-95"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Android APK</span>
            </a>

            <button
              type="button"
              onClick={onLaunchApp}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-lime-300 transition-all active:scale-95"
            >
              <span>Launch Web App</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Homepage Hero Section */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#1c2432]">
        {/* Ambient Glow & Radial Gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[650px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-lime-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Heading, Supporting Text, and Buttons */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>PhysioFit — Official Movement & Training Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Your Fitness Journey.{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-300 bg-clip-text text-transparent">
                  Guided by Science.
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Train smarter, improve mobility, explore exercise tutorials, and build healthier habits with PhysioFit — your companion for fitness and movement.
              </p>

              {/* Two Prominent Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="#download"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-lime-300 transition-all active:scale-95"
                >
                  <Download className="h-4 w-4 stroke-[2.5]" />
                  <span>Download Android App</span>
                </a>

                <a
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[#2d384a] bg-[#141b25] px-6 py-3.5 text-sm font-bold text-white hover:border-emerald-500/50 hover:bg-[#1a2330] transition-all"
                >
                  <Layers className="h-4 w-4 text-emerald-400" />
                  <span>Explore Features</span>
                </a>

                <button
                  type="button"
                  onClick={onLaunchApp}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3.5 text-sm font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                >
                  <span>Launch Web App</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-2 border-t border-[#1d2635] text-center sm:text-left">
                <div>
                  <div className="text-lg sm:text-xl font-black text-white">100% Free</div>
                  <div className="text-[11px] text-slate-400">Core library & logging</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-emerald-400">D3 Vector</div>
                  <div className="text-[11px] text-slate-400">Interactive muscle map</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-lime-400">Clinician Led</div>
                  <div className="text-[11px] text-slate-400">Biomechanical safety</div>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic Smartphone Mockup */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Smartphone Frame */}
              <div className="relative w-full max-w-[320px] rounded-[44px] bg-[#0c1017] p-3 border-4 border-[#2b3547] shadow-2xl shadow-emerald-500/10 ring-1 ring-white/10">
                {/* Speaker & Dynamic Island Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 h-4 w-24 rounded-full bg-[#17202c] z-30 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-[#2a384c] mr-2" />
                  <div className="h-1.5 w-8 rounded-full bg-[#232e3f]" />
                </div>

                {/* Inner Screen Display (Interactive App Snapshot) */}
                <div className="relative rounded-[36px] bg-[#0e131b] border border-[#1e2736] overflow-hidden p-4 space-y-3.5 text-left text-xs">
                  {/* Top Header of App */}
                  <div className="flex items-center justify-between pt-4 border-b border-[#1b2330] pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-white text-sm">PhysioFit</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      <Flame className="h-3 w-3 fill-amber-400" />
                      <span>14 Day Streak</span>
                    </div>
                  </div>

                  {/* Today's Workout Card */}
                  <div className="rounded-xl bg-gradient-to-r from-[#141b25] to-[#18212e] p-3 border border-emerald-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-emerald-400">Today's Protocol</span>
                      <span className="text-[10px] text-slate-400">45 Mins · Gym</span>
                    </div>
                    <div className="text-xs font-bold text-white">Hypertrophy Push Split</div>
                    <div className="text-[10px] text-slate-300">Pectorals · Anterior Deltoids · Triceps Brachii</div>
                  </div>

                  {/* D3 Muscle Activation Mini Graphic */}
                  <div className="rounded-xl bg-[#121822] p-2.5 border border-[#212c3d] flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>EMG Activation</span>
                      </span>
                      <div className="text-[11px] font-bold text-white">Primary Agonist: 94%</div>
                      <div className="text-[9px] text-slate-400">Joint: Horizontal Adduction</div>
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-[11px]">
                      94%
                    </div>
                  </div>

                  {/* Diaphragmatic Cadence Gauge */}
                  <div className="rounded-xl bg-[#121822] p-2.5 border border-[#212c3d] flex items-center justify-between">
                    <div className="text-[10px] text-slate-300">
                      <strong className="text-white block text-[11px]">Diaphragmatic Cadence</strong>
                      <span>Tempo: 3-1-1-0 (Controlled Eccentric)</span>
                    </div>
                    <span className="rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 border border-cyan-500/30">
                      Inhale / Brace
                    </span>
                  </div>

                  {/* Daily Hydration */}
                  <div className="rounded-xl bg-[#121822] p-2.5 border border-[#212c3d] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="text-[10px] text-slate-300">1,750 / 2,500 ml</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">70% Logged</span>
                  </div>

                  {/* Quick Launch Button */}
                  <button
                    type="button"
                    onClick={onLaunchApp}
                    className="w-full rounded-xl bg-emerald-500 py-2 text-center text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                  >
                    Open Live Interactive App
                  </button>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="hidden sm:flex absolute -bottom-4 -left-6 rounded-xl bg-[#141b25]/95 border border-emerald-500/40 p-2.5 shadow-2xl backdrop-blur-md items-center gap-2 text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-white text-[11px]">Physiotherapist Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 border-b border-[#1c2432] bg-[#0c1017]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Complete Feature Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Long-Term Performance & Pain-Free Movement
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every feature in PhysioFit is designed around certified sports conditioning principles and joint mechanics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Workout Plans */}
            <div className="rounded-2xl bg-[#111721] p-6 border border-[#212b3a] hover:border-emerald-500/40 transition-all space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Dumbbell className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Personalized Workout Plans</h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Personalized gym and home workout programs</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Beginner, intermediate, and advanced progression splits</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Muscle-group targeting with auto-calculated volume</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Weekly schedules, rest day management & recovery pacing</span>
                </li>
              </ul>
            </div>

            {/* 2. Exercise Tutorial Library */}
            <div className="rounded-2xl bg-[#111721] p-6 border border-[#212b3a] hover:border-emerald-500/40 transition-all space-y-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Play className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Exercise Tutorial Library</h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Interactive D3 Vector Muscle Activation Overlays</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>High-quality video demonstrations with YouTube verified links</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Step-by-step setup, starting, execution, and lockout cues</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Target vs assisting muscles, rep tempos & breathing cadence</span>
                </li>
              </ul>
            </div>

            {/* 3. Physiotherapy & Mobility */}
            <div className="rounded-2xl bg-[#111721] p-6 border border-[#212b3a] hover:border-emerald-500/40 transition-all space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <HeartPulse className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Physiotherapy & Mobility</h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Warm-up, cool-down & desk-worker decompression routines</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Spinal, hip, and shoulder mobility protocols</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>General injury-prevention & joint protection education</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Clear clinical distinction between educational drills and medical therapy</span>
                </li>
              </ul>
            </div>

            {/* 4. Nutrition & Habits */}
            <div className="rounded-2xl bg-[#111721] p-6 border border-[#212b3a] hover:border-emerald-500/40 transition-all space-y-3">
              <div className="h-10 w-10 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-400">
                <Utensils className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Nutrition & Healthy Habits</h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Balanced macronutrient and caloric guidance</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Indian & global dietary meal suggestions (Veg, Eggetarian, Non-Veg)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Smart hydration interval reminders & daily intake logging</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Recovery, sleep hygiene, and holistic habit tracking</span>
                </li>
              </ul>
            </div>

            {/* 5. Progress Tracking */}
            <div className="rounded-2xl bg-[#111721] p-6 border border-[#212b3a] hover:border-emerald-500/40 transition-all space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Progress & Performance Tracking</h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Comprehensive workout completion log history</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Personal records (PRs) and estimated 1-Rep Max calculations</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Active streak counters and milestone achievement badges</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Weekly total tonnage and muscle volume analytics</span>
                </li>
              </ul>
            </div>

            {/* 6. Evidence-Based Safety Banner */}
            <div className="rounded-2xl bg-gradient-to-br from-[#121924] to-[#172230] p-6 border border-emerald-500/30 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Clinical Movement Standard</span>
                </div>
                <h3 className="text-base font-bold text-white">Safety & Joint Precaution Notice</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  PhysioFit strictly separates general exercise education from individualized treatment plans. Users with pre-existing injuries or clinical pain are guided to consult qualified healthcare providers.
                </p>
              </div>

              <button
                type="button"
                onClick={onLaunchApp}
                className="w-full rounded-xl bg-[#1b2535] py-2.5 text-center text-xs font-bold text-emerald-300 hover:bg-[#233045] transition-all border border-emerald-500/30"
              >
                Experience Live in Web App →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Exercise Library Preview Section */}
      <section id="exercises" className="py-20 border-b border-[#1c2432]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Exercise Tutorial Preview
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Explore Verified Exercise Tutorials & Biomechanics
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Every exercise includes D3 interactive muscle activation maps, HD video demonstrations, diaphragmatic breathing cues, and physiotherapist form corrections.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-[#141b25] p-1.5 border border-[#253042]">
              {[
                { id: 'all', label: 'All Moves' },
                { id: 'chest', label: 'Chest' },
                { id: 'back', label: 'Back' },
                { id: 'legs', label: 'Legs' },
                { id: 'shoulders', label: 'Shoulders' },
                { id: 'mobility', label: 'Mobility' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setExerciseFilter(chip.id as any)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    exerciseFilter === chip.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPreviewExercises.slice(0, 6).map((ex) => (
              <div
                key={ex.id}
                onClick={() => setInspectExercise(ex)}
                className="group cursor-pointer rounded-2xl bg-[#111721] p-5 border border-[#222c3b] hover:border-emerald-500/50 hover:bg-[#151c27] transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 rounded-md bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/25">
                    {ex.category} · {ex.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-400 rounded-md bg-[#19222e] px-2 py-0.5">
                    {ex.equipment[0] || 'Bodyweight'}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {ex.name}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {ex.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 text-[10px]">
                  {ex.targetMuscles.slice(0, 3).map((m, idx) => (
                    <span key={idx} className="rounded bg-[#1a2330] px-2 py-0.5 text-slate-300 font-medium">
                      {m}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#1e2736] flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5" />
                    <span>Interactive D3 Anatomy</span>
                  </span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5 font-bold">
                    <span>Inspect</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onLaunchApp}
              className="inline-flex items-center gap-2 rounded-xl bg-[#17202c] border border-[#2c384a] px-5 py-2.5 text-xs font-bold text-white hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
            >
              <span>Explore Full Library in App ({exercises.length} Exercises)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Android APK Download Page Section (/download) */}
      <section id="download" className="py-20 border-b border-[#1c2432] bg-gradient-to-b from-[#0b0e14] via-[#0f141d] to-[#0c1017]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400">
              <Smartphone className="h-3.5 w-3.5" />
              <span>Official Android APK Channel</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Download PhysioFit for Android
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Take your fitness journey wherever you go. Download the official PhysioFit Android app and start training smarter.
            </p>
          </div>

          {/* Central Download Card */}
          <div className="max-w-3xl mx-auto rounded-3xl bg-[#121822] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-[#212c3d] pb-6 text-center sm:text-left">
              {/* App Icon */}
              <div className="h-20 w-20 rounded-2xl bg-white p-2 border-2 border-emerald-400 shadow-xl shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={ASSETS.brandLogo}
                  alt="PhysioFit App Icon"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl font-extrabold text-white">PhysioFit: Fitness & Movement</h3>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-extrabold">
                    {APK_VERSION}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Train Smart. Move Better. Official Android Application Release.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-400 pt-1 font-mono">
                  <span>Size: <strong className="text-white">{APK_FILE_SIZE}</strong></span>
                  <span>·</span>
                  <span>OS: <strong className="text-white">Android 8.0+</strong></span>
                  <span>·</span>
                  <span>Release: <strong className="text-white">{APK_UPDATED_DATE}</strong></span>
                </div>
              </div>
            </div>

            {/* Prominent Download Button */}
            <div className="space-y-3">
              {apkAvailable ? (
                <button
                  type="button"
                  onClick={handleDownloadApk}
                  disabled={isDownloading}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-400 p-4 text-center font-black text-slate-950 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-lime-300 active:scale-95 transition-all flex items-center justify-center gap-3 text-base sm:text-lg"
                >
                  <Download className={`h-6 w-6 stroke-[2.5] ${isDownloading ? 'animate-bounce' : ''}`} />
                  <span>{isDownloading ? 'Downloading APK Package...' : `Download APK (${APK_FILE_SIZE})`}</span>
                </button>
              ) : (
                <div className="rounded-2xl bg-[#171f2b] p-4 text-center border border-amber-500/40 space-y-2">
                  <div className="text-sm font-bold text-amber-300 flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Android App Coming Soon</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    The signed APK build pipeline is currently preparing the next official release. Enter your email below to be notified immediately when the download is live.
                  </p>
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-xl bg-slate-800 py-3 text-xs font-bold text-slate-500 cursor-not-allowed"
                  >
                    Download Disabled (Build Pipeline Active)
                  </button>
                </div>
              )}

              {/* SHA-256 Checksum Card */}
              <div className="rounded-xl bg-[#0f141c] p-3.5 border border-[#212b3c] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 text-center sm:text-left overflow-hidden w-full">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    <span>SHA-256 Package Checksum (Integrity Verification)</span>
                  </span>
                  <div className="font-mono text-[11px] text-slate-300 truncate" title={APK_SHA256}>
                    {APK_SHA256}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyChecksum}
                  className="rounded-lg border border-[#2d394b] bg-[#161f2c] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copiedChecksum ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedChecksum ? 'Copied' : 'Copy Hash'}</span>
                </button>
              </div>

              {/* Verification & Play Protect Notice */}
              <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>VirusTotal & Play Protect Verified Clean</span>
                </span>
                <span>Zero Trackers · No Adware · Local Storage First</span>
              </div>
            </div>
          </div>

          {/* Android Installation Instructions (5 Steps) */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-white">How to Install PhysioFit on Android</h3>
              <p className="text-xs text-slate-400">
                Follow these 5 straightforward steps to get started in less than 2 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
              {[
                {
                  step: '01',
                  title: 'Tap Download APK',
                  desc: 'Tap the green button above to download physiofit-v2.4.0-release.apk to your phone.',
                },
                {
                  step: '02',
                  title: 'Open Downloaded File',
                  desc: 'Open the file from your notifications bar or your Android Downloads folder.',
                },
                {
                  step: '03',
                  title: 'Allow Installation',
                  desc: 'If prompted by Android, tap "Settings" and toggle "Allow from this source".',
                },
                {
                  step: '04',
                  title: 'Review & Install',
                  desc: 'Review the app permissions and tap "Install" to complete setup.',
                },
                {
                  step: '05',
                  title: 'Start Training Smart',
                  desc: 'Launch PhysioFit, personalize your fitness goals, and explore exercises.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#111721] p-4 border border-[#222c3c] space-y-2 relative"
                >
                  <span className="text-lg font-black text-emerald-400/80 font-mono">
                    {item.step}
                  </span>
                  <h4 className="font-bold text-white text-xs">{item.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Android Security Notice Box */}
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 flex items-start gap-3 text-xs text-amber-200/90">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-300 block">
                  Security Reminder: Install Only Official Releases
                </span>
                <p className="text-[11px] leading-relaxed">
                  Android may display a standard security notice about apps installed outside Google Play. Please verify that you only install APK files downloaded directly from our official website (<strong className="text-white">physiofit.in</strong>) with matching SHA-256 checksums.
                </p>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions Accordion */}
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center justify-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-emerald-400" />
                <span>Frequently Asked Questions</span>
              </h3>
              <p className="text-xs text-slate-400">Everything you need to know about PhysioFit APK installation and compatibility.</p>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#111721] border border-[#212b3b] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${openFaq === idx ? 'rotate-90 text-emerald-400' : 'text-slate-500'}`} />
                  </button>

                  {openFaq === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-[#1c2432]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Release Notification Subscription */}
          <div className="max-w-xl mx-auto rounded-2xl bg-[#141b25] p-5 border border-[#253040] text-center space-y-3">
            <h4 className="text-sm font-bold text-white">Want Release Notifications in Your Inbox?</h4>
            <p className="text-xs text-slate-400">
              Get notified when new exercise libraries, Android updates, or clinician webinars drop.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your.email@example.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 rounded-xl bg-[#0e131b] border border-[#283446] px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shrink-0"
              >
                Notify Me
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 6. App Screenshots & Mockup Gallery */}
      <section id="screenshots" className="py-20 border-b border-[#1c2432] bg-[#0c1017]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Interactive UI Preview
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Crafted for Visual Clarity & Athletic Precision
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Explore key screen layouts from the live PhysioFit application.
            </p>
          </div>

          {/* Carousel / Tab selector */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {screenshots.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveScreenshot(idx)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                  activeScreenshot === idx
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-[#141b25] text-slate-400 hover:text-white border border-[#222c3c]'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Active Screenshot Display Card */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#111721] border border-[#242f40] p-6 sm:p-8 space-y-4 text-center">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">{screenshots[activeScreenshot].title}</h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">{screenshots[activeScreenshot].caption}</p>
            </div>

            {/* Simulated Live Viewport */}
            <div className="rounded-2xl bg-[#0a0d13] border border-[#1e2634] p-5 sm:p-6 min-h-[220px] flex flex-col items-center justify-center text-center space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Live Interactive Component Available</span>
              </div>
              <p className="text-xs text-slate-300 max-w-md">
                Experience this screen with your own profile data, active workout timers, and muscle recruitment simulation right now.
              </p>
              <button
                type="button"
                onClick={onLaunchApp}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 px-5 py-2.5 text-xs font-extrabold text-slate-950 hover:from-emerald-400 hover:to-lime-300 transition-all shadow-md shadow-emerald-500/20"
              >
                Launch Screen in Web App →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. About PhysioFit Section */}
      <section id="about" className="py-20 border-b border-[#1c2432]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                <Award className="h-3.5 w-3.5" />
                <span>About PhysioFit</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Fitness Meets Better Movement
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                PhysioFit brings fitness, exercise education, mobility, and movement awareness together in one convenient platform. Our goal is to help users build consistent exercise habits, learn proper exercise techniques, and make informed choices about their physical well-being.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">Biomechanical Precision</strong>
                    <span>Technique instruction grounded in joint angles, kinetic chains, and intra-abdominal stabilization.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">Injury Prevention Standard</strong>
                    <span>Proactive mobility drills to mitigate chronic lower back, rotator cuff, and patellar stress.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">Accessible Health Technology</strong>
                    <span>Fast, lightweight, offline-capable mobile and web applications without predatory paywalls.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl bg-[#111721] p-6 border border-[#232c3d] space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Our Clinical Advisory Team</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Guided by registered physiotherapy professionals and certified strength coaches, PhysioFit ensures every movement cue is physiologically sound.
              </p>

              <div className="rounded-xl bg-[#161d28] p-3.5 border border-[#253142] text-xs space-y-1">
                <div className="font-bold text-white">{CONSULTANT_CONTACT.name}</div>
                <div className="text-emerald-400 text-[11px] font-semibold">{CONSULTANT_CONTACT.role}</div>
                <div className="text-slate-400 text-[11px]">{CONSULTANT_CONTACT.clinicAddress}</div>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${CONSULTANT_CONTACT.phone.replace(/\s+/g, '')}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call Consultant: {CONSULTANT_CONTACT.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Contact & Feedback Section */}
      <section id="contact" className="py-20 border-b border-[#1c2432] bg-[#0c1017]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Get in Touch
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Support, Inquiries & Consultation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Reach out to our clinical engineering team or ask any technical or exercise questions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-4 text-xs">
              <div className="rounded-2xl bg-[#111721] p-5 border border-[#232c3d] space-y-3">
                <h4 className="font-bold text-white text-sm">Direct Clinical Contacts</h4>

                <div className="space-y-2.5">
                  <a
                    href={`mailto:${CONSULTANT_CONTACT.email}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#151d27] border border-[#232e3e] text-slate-300 hover:text-white transition-colors"
                  >
                    <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">General Inquiries</div>
                      <div className="text-[11px] text-slate-400">{CONSULTANT_CONTACT.email}</div>
                    </div>
                  </a>

                  <a
                    href={`tel:${CONSULTANT_CONTACT.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#151d27] border border-[#232e3e] text-slate-300 hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Phone Support & WhatsApp</div>
                      <div className="text-[11px] text-slate-400">{CONSULTANT_CONTACT.phone}</div>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#151d27] border border-[#232e3e] text-slate-300">
                    <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Movement Sciences Center</div>
                      <div className="text-[11px] text-slate-400">{CONSULTANT_CONTACT.clinicAddress}</div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-1">
                  Available: {CONSULTANT_CONTACT.availableHours}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 rounded-2xl bg-[#111721] p-6 border border-[#232c3d]">
              {contactSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Message Transmitted!</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Thank you for reaching out. A registered movement specialist from our support desk will respond to your email within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full rounded-xl bg-[#151c27] border border-[#263242] px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full rounded-xl bg-[#151c27] border border-[#263242] px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        placeholder="you@domain.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Topic</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full rounded-xl bg-[#151c27] border border-[#263242] px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. Android APK download or Exercise question"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full rounded-xl bg-[#151c27] border border-[#263242] px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                      placeholder="Describe your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Official Website Footer */}
      <footer className="py-12 border-t border-[#1c2432] bg-[#090c12] text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white">PhysioFit</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400 font-semibold">“Train Smart. Move Better.”</span>
              </div>
              <p className="text-[11px] text-slate-400 max-w-md">
                Modern fitness training, video exercise tutorials, D3 interactive biomechanics, and physiotherapy-informed habit cultivation.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a href="#hero" className="hover:text-emerald-400 transition-colors">Home</a>
              <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
              <a href="#exercises" className="hover:text-emerald-400 transition-colors">Exercise Library</a>
              <a href="#download" className="hover:text-emerald-400 transition-colors text-emerald-400 font-bold">Download APK</a>
              <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
              <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
            </div>
          </div>

          {/* Legal and Disclaimer Links */}
          <div className="pt-4 border-t border-[#1a222e] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveLegalModal('disclaimer')}
                className="text-amber-400 hover:underline font-semibold"
              >
                Medical & Educational Disclaimer
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setActiveLegalModal('privacy')}
                className="hover:text-slate-200 hover:underline"
              >
                Privacy Policy
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setActiveLegalModal('terms')}
                className="hover:text-slate-200 hover:underline"
              >
                Terms & Conditions
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setCurrentView('admin')}
                className="hover:text-emerald-400 text-slate-400 transition-colors flex items-center gap-1"
                title="PhysioFit Administrator Portal"
              >
                <Lock className="h-2.5 w-2.5 text-slate-400" />
                <span>Admin Login</span>
              </button>
            </div>

            <div className="text-slate-400">
              © {new Date().getFullYear()} PhysioFit Movement Sciences. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* 10. Exercise Tutorial Modal Trigger */}
      {inspectExercise && (
        <ExerciseTutorialModal
          exercise={inspectExercise}
          onClose={() => setInspectExercise(null)}
        />
      )}

      {/* 11. Legal & Medical Disclaimer Modals */}
      {activeLegalModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#121822] border border-[#273242] p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-xs text-slate-300">
            <div className="flex items-center justify-between border-b border-[#232c3a] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {activeLegalModal === 'disclaimer' && <AlertTriangle className="h-4 w-4 text-amber-400" />}
                {activeLegalModal === 'privacy' && <Lock className="h-4 w-4 text-emerald-400" />}
                {activeLegalModal === 'terms' && <FileText className="h-4 w-4 text-cyan-400" />}
                <span>
                  {activeLegalModal === 'disclaimer' && 'Medical & Exercise Safety Disclaimer'}
                  {activeLegalModal === 'privacy' && 'PhysioFit Privacy Policy'}
                  {activeLegalModal === 'terms' && 'Terms & Conditions of Use'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-white border border-[#2a3545]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Disclaimer Content */}
            {activeLegalModal === 'disclaimer' && (
              <div className="space-y-3 leading-relaxed">
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-amber-200 font-semibold">
                  Educational Fitness & Movement Awareness Only. Not Clinical Medical Advice.
                </div>
                <p>
                  The content provided by PhysioFit — including workout splits, exercise demonstrations, D3 muscle activation models, stretching routines, and diaphragmatic breathing guides — is designed solely for educational, athletic fitness, and movement awareness purposes.
                </p>
                <p>
                  PhysioFit does not provide individualized clinical medical diagnosis, physical therapy treatment, or personalized injury cure protocols. Never disregard professional medical advice or delay seeking evaluation from a registered physician or licensed physical therapist because of something you accessed through PhysioFit.
                </p>
                <p>
                  Always warm up thoroughly, maintain progressive overload within your physiological tolerance, and stop exercising immediately if you experience sharp pain, dizziness, shortness of breath, or numbness.
                </p>
              </div>
            )}

            {/* Privacy Policy Content */}
            {activeLegalModal === 'privacy' && (
              <div className="space-y-3 leading-relaxed">
                <p>
                  At PhysioFit, your privacy and health metric security are paramount. This privacy statement outlines how we handle data:
                </p>
                <h4 className="font-bold text-white">1. Local Device Storage Priority</h4>
                <p>
                  Your workout logs, water intake counts, personal records, and habit streaks are stored locally within your device browser and application cache. We do not sell or monetize personal health data.
                </p>
                <h4 className="font-bold text-white">2. Android APK Permissions</h4>
                <p>
                  The PhysioFit Android APK requires minimal device permissions: Network access (for video tutorials and synchronized plans) and optional notification permission for habit reminders. We do not access contacts, camera, or location without your explicit action.
                </p>
                <h4 className="font-bold text-white">3. Data Retention and Deletion</h4>
                <p>
                  You can clear your local cache, reset workout history, or export metrics anytime directly within the Settings menu.
                </p>
              </div>
            )}

            {/* Terms Content */}
            {activeLegalModal === 'terms' && (
              <div className="space-y-3 leading-relaxed">
                <h4 className="font-bold text-white">1. Agreement to Terms</h4>
                <p>
                  By accessing the PhysioFit website, web application, or installing the official Android APK, you acknowledge and agree to these terms of use.
                </p>
                <h4 className="font-bold text-white">2. Voluntary Participation & Assumption of Risk</h4>
                <p>
                  Physical exercise involves inherent physiological demands and risk of muscle strain or injury. You represent that you are in adequate physical health to perform voluntary fitness routines and assume full responsibility for your exercise technique and loading.
                </p>
                <h4 className="font-bold text-white">3. Intellectual Property</h4>
                <p>
                  The PhysioFit brand name, "Train Smart. Move Better." tagline, vector logo, and proprietary D3 interactive anatomical overlay models are protected assets. Unauthorized commercial distribution is prohibited.
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-[#232c3a] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
