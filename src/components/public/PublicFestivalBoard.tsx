'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFestival } from '@/lib/festival-context';
import { GaneshLogo } from '@/components/common/GaneshLogo';
import { DigitalReceiptModal } from '@/components/receipt/DigitalReceiptModal';
import { Contribution } from '@/types';
import {
  Sparkles,
  Search,
  CheckCircle2,
  CalendarDays,
  IndianRupee,
  Users,
  Shield,
  ArrowRight,
} from 'lucide-react';

export function PublicFestivalBoard() {
  const { organization, activeYear, yearConfig, metrics, contributions, events } = useFestival();
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookedUpReceipt, setLookedUpReceipt] = useState<Contribution | null>(null);
  const [lookupError, setLookupError] = useState(false);

  const handleSearchReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(false);
    const clean = lookupQuery.trim().toLowerCase();
    if (!clean) return;

    const matched = contributions.find(
      (c) =>
        c.receiptNumber.toLowerCase() === clean ||
        c.contributorPhone.replace(/\D/g, '') === clean.replace(/\D/g, '')
    );

    if (matched) {
      setLookedUpReceipt(matched);
    } else {
      setLookupError(true);
    }
  };

  return (
    <div className="min-h-screen bg-festival-pattern flex flex-col">
      {/* Top Header */}
      <header className="glass-header py-4 px-4 sm:px-6 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/">
            <GaneshLogo size={36} />
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Committee Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
        {/* Mandal Hero Banner */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white text-center shadow-xl relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 bg-black/20 text-amber-200 px-3 py-1 rounded-full text-xs font-bold border border-amber-300/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Official Public Transparency Board • Year {activeYear}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">{organization.name}</h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-lg mx-auto font-medium">
            📍 {organization.location.galli}, {organization.location.village}, {organization.location.district} ({organization.location.state})
          </p>

          {/* Target Progress */}
          <div className="mt-6 max-w-xl mx-auto bg-black/20 p-4 rounded-2xl border border-white/20">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span>Festival Collection Progress</span>
              <span className="text-amber-200">
                ₹{metrics.totalCollection.toLocaleString('en-IN')} / ₹{yearConfig.chandaTarget.toLocaleString('en-IN')} ({metrics.collectionProgressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-300 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(3, metrics.collectionProgressPercent))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Receipt Verification Tool */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
          <div className="text-center max-w-md mx-auto">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mx-auto mb-2">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-gray-900">Verify Your Chanda Receipt</h2>
            <p className="text-xs text-gray-500">
              Enter your Receipt ID (e.g. <b>GS26-000248</b>) or 10-digit mobile number to view and download your authentic digital certificate.
            </p>
          </div>

          <form onSubmit={handleSearchReceipt} className="max-w-md mx-auto flex gap-2">
            <input
              type="text"
              required
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Enter GS26-000248 or 9849012345"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-xs hover:shadow-md active:scale-95 transition-all"
            >
              Verify
            </button>
          </form>

          {lookupError && (
            <p className="text-center text-xs font-semibold text-red-600">
              No contribution receipt found for this number. Please check the spelling or ask your collector.
            </p>
          )}
        </div>

        {/* Top Devotees & Patrons */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-600" />
            Recent Devotional Patrons & Contributors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {contributions.slice(0, 9).map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-xs text-gray-900">{c.contributorName}</p>
                  <p className="text-[10px] text-gray-500">{c.galli || organization.location.galli}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-xs text-orange-700">₹{c.amount.toLocaleString('en-IN')}</span>
                  <p className="text-[9.5px] font-mono text-gray-400">{c.receiptNumber}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Festival Events Program */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-orange-600" />
            Festival Program Schedule
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {events.map((evt) => (
              <div key={evt.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-xs text-gray-900">{evt.eventName}</h3>
                  <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded">
                    {evt.date}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">{evt.description}</p>
                <p className="text-[10px] text-gray-500 font-medium">⏰ {evt.time} • 📍 {evt.location}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Digital Receipt Modal if user verifies */}
      <DigitalReceiptModal contribution={lookedUpReceipt} onClose={() => setLookedUpReceipt(null)} />
    </div>
  );
}
