'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GaneshLogo } from '@/components/common/GaneshLogo';
import { AuthModal } from '@/components/auth/AuthModal';
import { Footer } from '@/components/layout/Footer';
import { useFestival } from '@/lib/festival-context';
import { useAuth } from '@/lib/auth-context';
import {
  Sparkles,
  CreditCard,
  Share2,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle,
  IndianRupee,
  CalendarDays,
  Download,
  Flame,
} from 'lucide-react';

export function LandingPage() {
  const router = useRouter();
  const { organization, metrics } = useFestival();
  const { login } = useAuth();
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | null>(null);

  const handleOpenLogin = () => setAuthModalTab('login');
  const handleOpenRegister = () => setAuthModalTab('register');

  const handleExploreDemo = () => {
    login('arunkumar@ganeshseva.org');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-festival-pattern flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="glass-header sticky top-0 z-40 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <GaneshLogo size={42} />

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenLogin}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:text-orange-700 hover:bg-orange-50 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={handleOpenRegister}
              className="px-4 py-2 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Create Your Committee</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Decorative Golden Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          {/* Sacred Festive Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-950 text-xs font-extrabold shadow-xs">
            <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
            <span>Digital Seva Platform for Ganesh Mandals & Utsav Samithis</span>
          </div>

          {/* Main Requested Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-amber-950 tracking-tight leading-tight">
            Manage Your Ganesh Chaturthi <span className="text-orange-600 underline decoration-amber-400 decoration-wavy decoration-2">Digitally</span>
          </h1>

          {/* Main Requested Subtitle */}
          <p className="text-base sm:text-xl text-amber-900/85 max-w-2xl mx-auto font-medium leading-relaxed">
            Collect Chanda, manage contributors, track expenses and organize your festival in one place.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <button
              onClick={handleOpenRegister}
              className="px-7 py-3.5 rounded-2xl festival-saffron-gradient text-white text-sm font-black shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Create Your Committee</span>
            </button>

            <button
              onClick={handleOpenLogin}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 border border-amber-300 text-sm font-bold shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Login</span>
            </button>

            <button
              onClick={handleExploreDemo}
              className="px-5 py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-sm font-bold transition-all flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-orange-600 fill-orange-600" />
              <span>Live Asifabad Demo</span>
            </button>
          </div>

          {/* Live Preview Sample Badge */}
          <p className="text-xs text-amber-800 font-semibold pt-2">
            ✨ Sample Mandal: <span className="font-extrabold text-amber-950">Asifabad → Gandhi Chowk → Sri Ganesh Utsav Committee → 2026</span>
          </p>
        </div>

        {/* Hero Interactive App Mockup Card */}
        <div className="max-w-5xl mx-auto mt-12">
          <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-2xl border-2 border-amber-300/80 relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-xs font-bold text-gray-700 ml-2 font-mono">
                  ganesh-seva.app • {organization.name} (2026)
                </span>
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                🟢 Live Campaign: ₹1,25,450 / ₹2,00,000 (62.7%)
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-left">
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Collection</span>
                <p className="text-lg font-black text-gray-900 mt-1">₹1,25,450</p>
              </div>
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Target</span>
                <p className="text-lg font-black text-orange-700 mt-1">₹2,00,000</p>
              </div>
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Expenses</span>
                <p className="text-lg font-black text-red-600 mt-1">₹85,500</p>
              </div>
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Net Balance</span>
                <p className="text-lg font-black text-green-700 mt-1">₹39,950</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black tracking-wider text-orange-700 uppercase">
            Purpose-Built for Indian Ganesh Mandals
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-amber-950">
            Everything Your Utsav Samithi Needs
          </h2>
          <p className="text-sm text-gray-600">
            Replaces old paper books, eliminates lost receipt stubs, and stops financial disputes with 100% transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900">Instant WhatsApp Receipts</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Auto-generate official receipts like <b>GS26-000248</b> with amount in words and send devotional receipts directly to donor WhatsApp with one click.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900">3-Second Street Entry Mode</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Designed for volunteers walking through gallis: <b>Name → Mobile → Amount → Save</b> with quick preset chips (₹501, ₹1001, ₹2116).
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900">12-Category Expense Sheet</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Track idol maker advances, pandal fabrications, DJ sound, serial lighting, and Annadanam catering. Auto calculates <b>Collection - Expense = Balance</b>.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900">Role-Based Collector Access</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Assign roles for Owner, Admin, Street Collectors, and Viewers. Track collector-wise funds and preserve complete audit trails.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900">Multi-Year Archival (2026-2028)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Never lose past festival records. Switch seamlessly between 2026, 2027, and 2028 without mixing historical collections and expenses.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900">Public Village Board</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Share a public transparency URL with colony residents to view live festival progress, upcoming Aarti timings, and verify official receipts.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl festival-maroon-gradient p-8 sm:p-10 text-white text-center shadow-xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black">
            Ready to Digitize Your Ganesh Festival?
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl mx-auto font-medium">
            Join hundreds of streets, colonies, and mandals organizing transparent and blessed Ganesh Chaturthi celebrations.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleOpenRegister}
              className="px-6 py-3 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              Get Started Free
            </button>
            <button
              onClick={handleExploreDemo}
              className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
            >
              Try Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer with Gadam ArunKumar Attribution */}
      <Footer />

      {/* Auth Modal */}
      {authModalTab && (
        <AuthModal
          isOpen={true}
          initialTab={authModalTab}
          onClose={() => setAuthModalTab(null)}
          onSuccessRedirect={() => router.push('/dashboard')}
        />
      )}
    </div>
  );
}
