'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFestival } from '@/lib/festival-context';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  CreditCard,
  Plus,
  FileSpreadsheet,
  CalendarDays,
  Menu,
} from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { setIsAddChandaOpen } = useFestival();
  const { canAddChanda } = useAuth();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-amber-200/70 shadow-2xl px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around relative">
        {/* Home */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/dashboard' ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        {/* Collections */}
        <Link
          href="/chanda"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/chanda' ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Collections</span>
        </Link>

        {/* Floating Add Button */}
        {canAddChanda && (
          <div className="relative -top-5 flex flex-col items-center">
            <button
              onClick={() => setIsAddChandaOpen(true)}
              aria-label="Add Chanda"
              className="w-13 h-13 rounded-full flex items-center justify-center text-white shadow-xl transform active:scale-90 transition-transform festival-saffron-gradient border-3 border-white ring-4 ring-orange-500/20"
            >
              <Plus className="w-7 h-7 text-white stroke-[2.5]" />
            </button>
            <span className="text-[10px] font-extrabold text-orange-600 mt-0.5">+ Add</span>
          </div>
        )}

        {/* Expenses */}
        <Link
          href="/expenses"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/expenses' ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Expenses</span>
        </Link>

        {/* Events */}
        <Link
          href="/events"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/events' ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Events</span>
        </Link>

        {/* More / Reports */}
        <Link
          href="/reports"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/reports' ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Reports</span>
        </Link>
      </div>
    </div>
  );
}
