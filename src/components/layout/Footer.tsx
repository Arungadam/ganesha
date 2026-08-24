import React from 'react';
import Link from 'next/link';
import { GaneshLogo } from '@/components/common/GaneshLogo';
import { Heart, Shield, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-amber-50 to-amber-100/70 border-t border-amber-200/80 text-amber-950 pt-10 pb-20 lg:pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and mission */}
          <div className="md:col-span-2 space-y-3">
            <GaneshLogo size={42} />
            <p className="text-sm text-amber-900/80 max-w-md leading-relaxed">
              Empowering villages, colonies, streets, and Ganesh Utsav Samithis across India to digitally manage
              chanda collection receipts, track expenditures, coordinate events, and ensure transparent festival seva.
            </p>
            <div className="flex items-center gap-3 text-xs text-amber-800 font-semibold pt-1">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-orange-600" /> 100% Secure
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Instant WhatsApp Receipts
              </span>
              <span>•</span>
              <span>Multi-Year Archival</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3">Festival Modules</h4>
            <ul className="space-y-2 text-sm font-medium text-amber-900/80">
              <li>
                <Link href="/dashboard" className="hover:text-orange-600 transition-colors">
                  Festival Dashboard
                </Link>
              </li>
              <li>
                <Link href="/chanda" className="hover:text-orange-600 transition-colors">
                  Chanda Collection & Receipts
                </Link>
              </li>
              <li>
                <Link href="/contributors" className="hover:text-orange-600 transition-colors">
                  Donor Directory
                </Link>
              </li>
              <li>
                <Link href="/expenses" className="hover:text-orange-600 transition-colors">
                  12-Category Expense Sheet
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-orange-600 transition-colors">
                  Festival Event Schedule
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Setup */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3">Committee Setup</h4>
            <ul className="space-y-2 text-sm font-medium text-amber-900/80">
              <li>
                <Link href="/setup" className="hover:text-orange-600 transition-colors">
                  + Setup New Committee
                </Link>
              </li>
              <li>
                <Link href="/members" className="hover:text-orange-600 transition-colors">
                  Volunteer & Collector Roles
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-orange-600 transition-colors">
                  Audit & PDF Reports
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-amber-300/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-900/90 font-medium">
          <p>© {new Date().getFullYear()} GANESH SEVA. All rights reserved.</p>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-200/60 border border-amber-300 text-amber-950 font-bold text-xs shadow-xs">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600 animate-pulse" />
            <span>by</span>
            <span className="text-orange-700 font-extrabold">Gadam ArunKumar</span>
          </div>

          <p className="text-[11px] text-amber-800/80">
            Dedicated to Lord Vighnaharta Ganesh Seva
          </p>
        </div>
      </div>
    </footer>
  );
}
