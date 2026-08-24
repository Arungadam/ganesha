'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GaneshLogo } from '@/components/common/GaneshLogo';
import { useAuth } from '@/lib/auth-context';
import { useFestival } from '@/lib/festival-context';
import {
  PlusCircle,
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarDays,
  FileSpreadsheet,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Zap,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { UserRole } from '@/types';

interface NavbarProps {
  onOpenAuthModal?: () => void;
}

export function Navbar({ onOpenAuthModal }: NavbarProps) {
  const pathname = usePathname();
  const { user, role, switchRole, logout, canAddChanda } = useAuth();
  const { organization, activeYear, setActiveYear, setIsAddChandaOpen, resetDemo, clearToEmptyData } = useFestival();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Chanda', href: '/chanda', icon: CreditCard },
    { name: 'Contributors', href: '/contributors', icon: Users },
    { name: 'Expenses', href: '/expenses', icon: FileSpreadsheet },
    { name: 'Events', href: '/events', icon: CalendarDays },
    { name: 'Reports', href: '/reports', icon: FileSpreadsheet },
    { name: 'Committee', href: '/members', icon: Settings },
  ];

  const roles: { key: UserRole; label: string; badgeColor: string }[] = [
    { key: 'owner', label: 'Owner (Full Access)', badgeColor: 'bg-red-100 text-red-800' },
    { key: 'admin', label: 'Admin (Manage & Edit)', badgeColor: 'bg-orange-100 text-orange-800' },
    { key: 'collector', label: 'Collector (Add Chanda)', badgeColor: 'bg-blue-100 text-blue-800' },
    { key: 'viewer', label: 'Viewer (Read Only)', badgeColor: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-header">
      {/* Top Festival Ticker / Demo Bar */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-red-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium truncate">
            <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-100 px-2 py-0.5 rounded text-[11px] font-bold border border-amber-300/30">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {organization.name}
            </span>
            <span className="hidden sm:inline text-amber-100/90">
              📍 {organization.location.galli}, {organization.location.village} ({organization.location.district})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearToEmptyData}
              title="Start with 0 entries and clean placeholders"
              className="text-[11px] bg-black/20 hover:bg-black/40 px-2 py-0.5 rounded text-amber-100 flex items-center gap-1 font-semibold transition-colors"
            >
              🗑️ Clear to Empty Data
            </button>
            <button
              onClick={resetDemo}
              title="Reset to sample Asifabad dataset"
              className="text-[11px] bg-amber-400/20 hover:bg-amber-400/30 px-2 py-0.5 rounded text-amber-100 flex items-center gap-1 font-semibold transition-colors"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              Load Sample Demo
            </button>
            <Link
              href={`/public/${organization.slug}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded font-medium text-white transition-colors"
            >
              Public Board
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Mandal Selector */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <GaneshLogo size={40} />
            </Link>

            {/* Year Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 text-xs font-bold transition-colors"
              >
                <span>Year {activeYear}</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-800" />
              </button>

              {isYearDropdownOpen && (
                <div
                  className="absolute left-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-amber-200/80 py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setIsYearDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400">Festival Years</div>
                  {organization.years.map((y) => (
                    <button
                      key={y.id}
                      onClick={() => setActiveYear(y.year)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-amber-50 ${
                        activeYear === y.year ? 'text-orange-600 bg-amber-50/70 font-bold' : 'text-gray-700'
                      }`}
                    >
                      <span>{y.year}</span>
                      {activeYear === y.year && <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-1 text-[11px] text-amber-800 hover:text-amber-950 font-medium"
                  >
                    + Manage Years
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 font-bold shadow-xs border border-orange-200/60'
                      : 'text-gray-700 hover:text-orange-700 hover:bg-orange-50/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-gray-500'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions & Role Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Quick Add Chanda Button */}
            {canAddChanda && (
              <button
                onClick={() => setIsAddChandaOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg transition-all transform active:scale-95 festival-saffron-gradient"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>+ Add Chanda</span>
              </button>
            )}

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-xs transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                <span className="capitalize">{role}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {isRoleDropdownOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-gray-200/80 py-2 z-50"
                  onClick={() => setIsRoleDropdownOpen(false)}
                >
                  <div className="px-3.5 py-1.5 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900">{user?.name || 'Gadam ArunKumar'}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user?.email || 'arunkumar@ganeshseva.org'}</p>
                  </div>

                  <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Switch Test Role
                  </div>

                  {roles.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => switchRole(r.key)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-orange-50/60 ${
                        role === r.key ? 'text-orange-700 font-bold bg-orange-50' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${role === r.key ? 'bg-orange-600' : 'bg-gray-300'}`} />
                        <span>{r.label}</span>
                      </div>
                    </button>
                  ))}

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={logout}
                      className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-orange-50 border border-gray-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-200/60 bg-white/95 backdrop-blur-md px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive ? 'bg-orange-500 text-white font-bold' : 'text-gray-700 hover:bg-orange-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <Link
              href={`/public/${organization.slug}`}
              target="_blank"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs font-semibold text-orange-600 flex items-center gap-1 p-2"
            >
              View Public Board
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
