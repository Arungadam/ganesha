'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';
import {
  X,
  Lock,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register' | 'forgot';
  onSuccessRedirect?: () => void;
}

export function AuthModal({ isOpen, onClose, initialTab = 'login', onSuccessRedirect }: AuthModalProps) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);

  // Login form state
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('arunkumar@ganeshseva.org');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot password state
  const [forgotEmailOrPhone, setForgotEmailOrPhone] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(loginEmailOrPhone, loginPassword);
      setIsLoading(false);
      onClose();
      if (onSuccessRedirect) onSuccessRedirect();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to login');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!regMobile.trim() || regMobile.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register(regName, regEmail, regMobile, regPassword);
      setIsLoading(false);
      onClose();
      if (onSuccessRedirect) onSuccessRedirect();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to register');
    }
  };

  const handleDemoLogin = (email: string) => {
    setLoginEmailOrPhone(email);
    login(email);
    onClose();
    if (onSuccessRedirect) onSuccessRedirect();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmailOrPhone) {
      setError('Please enter email or phone');
      return;
    }
    setForgotSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 text-white p-5 relative text-center">
          <button
            onClick={onClose}
            className="absolute right-3.5 top-3.5 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-black text-xl tracking-tight">GANESH SEVA</h3>
          <p className="text-xs text-amber-100 font-medium mt-0.5">
            {tab === 'login' && 'Sign In to Your Committee Portal'}
            {tab === 'register' && 'Create Your Committee Account'}
            {tab === 'forgot' && 'Reset Your Password'}
          </p>

          {/* Nav Tabs */}
          {tab !== 'forgot' && (
            <div className="flex bg-black/20 p-1 rounded-xl mt-4 max-w-xs mx-auto text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  tab === 'login' ? 'bg-white text-orange-700 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  tab === 'register' ? 'bg-white text-orange-700 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                New Committee
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* 1. LOGIN TAB */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email or Mobile Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={loginEmailOrPhone}
                    onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                    placeholder="arunkumar@ganeshseva.org or 9848012345"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot');
                      setError(null);
                    }}
                    className="text-[11px] text-orange-600 hover:text-orange-700 font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* One Click Demo Logins */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-500 mb-2 uppercase text-center">
                  Quick Demo Access (One-Click)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('arunkumar@ganeshseva.org')}
                    className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-left text-xs font-bold text-orange-950 flex flex-col"
                  >
                    <span>👑 Owner / Admin</span>
                    <span className="text-[10px] text-gray-500 font-normal truncate">Gadam ArunKumar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('suresh.kumar@ganeshseva.org')}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left text-xs font-bold text-amber-950 flex flex-col"
                  >
                    <span>🤝 Volunteer / Collector</span>
                    <span className="text-[10px] text-gray-500 font-normal truncate">Suresh Kumar</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 2. REGISTER TAB */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Gadam ArunKumar"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number (Primary Contact) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="9848012345"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address (Optional)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="organizer@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>{isLoading ? 'Creating Account...' : 'Register & Continue Setup'}</span>
                </button>
              </div>
            </form>
          )}

          {/* 3. FORGOT PASSWORD TAB */}
          {tab === 'forgot' && (
            <div className="space-y-4">
              {forgotSubmitted ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Password Reset OTP Sent</h4>
                  <p className="text-xs text-gray-600">
                    A secure 6-digit verification code has been dispatched to <b>{forgotEmailOrPhone}</b>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSubmitted(false);
                      setTab('login');
                    }}
                    className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Enter the registered mobile number or email address associated with your Ganesh Committee.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Registered Email or Mobile</label>
                    <input
                      type="text"
                      required
                      value={forgotEmailOrPhone}
                      onChange={(e) => setForgotEmailOrPhone(e.target.value)}
                      placeholder="9848012345 or email"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="flex-1 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-sm"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
