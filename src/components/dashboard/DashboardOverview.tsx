'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFestival } from '@/lib/festival-context';
import { useAuth } from '@/lib/auth-context';
import { formatIndianCurrency } from '@/lib/receipt-generator';
import { AddChandaModal } from '@/components/chanda/AddChandaModal';
import { RapidEntryModal } from '@/components/chanda/RapidEntryModal';
import { DigitalReceiptModal } from '@/components/receipt/DigitalReceiptModal';
import { Contribution } from '@/types';
import {
  IndianRupee,
  Users,
  TrendingUp,
  CreditCard,
  PlusCircle,
  Zap,
  ArrowUpRight,
  FileSpreadsheet,
  Calendar,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Share2,
  Download,
} from 'lucide-react';

export function DashboardOverview() {
  const { organization, activeYear, yearConfig, metrics, isAddChandaOpen, setIsAddChandaOpen } = useFestival();
  const { role, canAddChanda, canManageExpenses } = useAuth();

  const [isRapidModalOpen, setIsRapidModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Contribution | null>(null);

  // Math metrics
  const target = metrics.collectionTarget || 200000;
  const collected = metrics.totalCollection;
  const expenses = metrics.totalExpenses;
  const balance = metrics.remainingBalance;
  const progress = metrics.collectionProgressPercent;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome Card */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 -mb-10 w-40 h-40 rounded-full bg-amber-400/10 blur-lg pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-black/20 text-amber-200 px-3 py-1 rounded-full text-xs font-bold border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ganesh Chaturthi {activeYear} Campaign</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{organization.name}</h1>
            <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-xl">
              📍 {organization.location.galli}, {organization.location.village}, {organization.location.district}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {canAddChanda && (
              <>
                <button
                  onClick={() => setIsAddChandaOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white text-orange-700 hover:bg-amber-50 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-orange-600" />
                  + Add Chanda
                </button>
                <button
                  onClick={() => setIsRapidModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-400/25 hover:bg-amber-400/40 text-amber-100 border border-amber-300/40 font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  Rapid 3-Sec Entry
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Collection */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Collection</span>
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
            {formatIndianCurrency(collected)}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-green-700 font-bold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{progress}% of target achieved</span>
          </div>
        </div>

        {/* 2. Total Contributors */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contributors</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-gray-900 mt-2">{metrics.totalContributors}</p>
          <p className="text-[11px] text-gray-500 font-medium mt-1">
            {metrics.recentContributions.length} chanda receipts issued
          </p>
        </div>

        {/* 3. Total Expenses */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Expenses</span>
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-red-700 mt-2">
            {formatIndianCurrency(expenses)}
          </p>
          <p className="text-[11px] text-gray-500 font-medium mt-1">Across 12 festival categories</p>
        </div>

        {/* 4. Net Remaining Balance */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Net Balance</span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                balance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-xl sm:text-2xl font-black mt-2 ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {formatIndianCurrency(balance)}
          </p>
          <p className="text-[11px] text-gray-500 font-medium mt-1">Total Collection - Expenses</p>
        </div>
      </div>

      {/* Target Progress Bar Card */}
      <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2.5">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <span>Festival Collection Goal</span>
              <span className="text-xs font-bold text-orange-600">({progress}% Complete)</span>
            </h3>
            <p className="text-xs text-gray-500">
              ₹{collected.toLocaleString('en-IN')} collected out of ₹{target.toLocaleString('en-IN')} target
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-gray-700">
              ₹{Math.max(0, target - collected).toLocaleString('en-IN')} needed to reach target
            </span>
          </div>
        </div>

        {/* Bar */}
        <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
          <div
            className="h-full rounded-full transition-all duration-700 festival-saffron-gradient"
            style={{ width: `${Math.min(100, Math.max(2, progress))}%` }}
          />
        </div>
      </div>

      {/* Charts and Financial Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Collection History */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm">Daily Chanda Collection Trend</h3>
              <p className="text-xs text-gray-500">Day-by-day funds collected</p>
            </div>
            <Link href="/reports" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5">
              <span>Full Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {metrics.dailyCollections.length > 0 ? (
            <div className="space-y-2.5 pt-2">
              {metrics.dailyCollections.slice(-6).map((d) => {
                const maxDaily = Math.max(...metrics.dailyCollections.map((m) => m.amount), 1);
                const pct = Math.round((d.amount / maxDaily) * 100);
                return (
                  <div key={d.date} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-700 font-mono">{d.date}</span>
                      <span className="font-bold text-gray-900">
                        ₹{d.amount.toLocaleString('en-IN')} <span className="text-gray-400 font-normal">({d.count} entries)</span>
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-amber-50 rounded-full overflow-hidden border border-amber-100">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-gray-400">No collections recorded for this year yet.</div>
          )}
        </div>

        {/* Payment Methods Split */}
        <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-gray-900 text-sm">Payment Methods</h3>
            <p className="text-xs text-gray-500 mb-4">Cash vs UPI vs Bank Transfer</p>

            <div className="space-y-3">
              {metrics.paymentMethodStats.map((p) => {
                const totalAmt = collected || 1;
                const pct = Math.round((p.amount / totalAmt) * 100);
                return (
                  <div key={p.method} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-800">{p.method}</span>
                      <span className="text-orange-700">₹{p.amount.toLocaleString('en-IN')} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4">
            <Link
              href="/chanda"
              className="w-full py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <span>Manage All Collections</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Expenses Breakdown & Recent Contributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Chanda Contributions Table */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm">Recent Chanda Contributions</h3>
              <p className="text-xs text-gray-500">Live donor stream & receipts</p>
            </div>
            <Link
              href="/contributors"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
            >
              <span>View All Donors</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {metrics.recentContributions.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                    <th className="pb-2">Receipt</th>
                    <th className="pb-2">Contributor</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Method</th>
                    <th className="pb-2">Collector</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {metrics.recentContributions.slice(0, 6).map((c) => (
                    <tr key={c.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-2.5 font-mono font-bold text-orange-800">{c.receiptNumber}</td>
                      <td className="py-2.5">
                        <div className="font-bold text-gray-900">{c.contributorName}</div>
                        <div className="text-[10px] text-gray-400 font-mono">+91 {c.contributorPhone}</div>
                      </td>
                      <td className="py-2.5 font-extrabold text-gray-900">
                        ₹{c.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-semibold">
                          {c.paymentMethod}
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-600">{c.collectorName}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => setSelectedReceipt(c)}
                          className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition-colors"
                        >
                          Receipt 📜
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-orange-600 flex items-center justify-center mx-auto">
                  <CreditCard className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-800">No chanda collections recorded yet</p>
                <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                  Click below to record your first donor contribution and automatically generate an official digital receipt.
                </p>
                {canAddChanda && (
                  <button
                    onClick={() => setIsAddChandaOpen(true)}
                    className="mt-2 px-4 py-1.5 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-xs hover:shadow-md transition-all inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Add First Chanda</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expenses Category Top Spends */}
        <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm">Top Expense Categories</h3>
              <p className="text-xs text-gray-500">Mandal budget breakdown</p>
            </div>
            <Link
              href="/expenses"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
            >
              <span>+ Add</span>
            </Link>
          </div>

          {metrics.categoryExpenses.length > 0 ? (
            <div className="space-y-3">
              {metrics.categoryExpenses.slice(0, 5).map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-800">{cat.category}</span>
                    <span className="font-bold text-red-700">₹{cat.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-2 bg-red-50 rounded-full overflow-hidden border border-red-100">
                    <div
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-gray-400 space-y-1">
              <p className="font-semibold text-gray-600">No festival expenses logged yet.</p>
              <p className="text-[11px] text-gray-400">Track pandal, sound, lighting, and prasadam bills.</p>
            </div>
          )}

          <div className="mt-5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
            <div className="flex justify-between font-bold">
              <span>Festival Net Balance:</span>
              <span className={balance >= 0 ? 'text-green-700' : 'text-red-700'}>
                ₹{balance.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddChandaModal isOpen={isAddChandaOpen} onClose={() => setIsAddChandaOpen(false)} />
      <RapidEntryModal isOpen={isRapidModalOpen} onClose={() => setIsRapidModalOpen(false)} />
      <DigitalReceiptModal contribution={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
    </div>
  );
}
