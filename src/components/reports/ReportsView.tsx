'use client';

import React, { useState } from 'react';
import { useFestival } from '@/lib/festival-context';
import { formatIndianCurrency } from '@/lib/receipt-generator';
import { storage } from '@/lib/storage';
import {
  FileSpreadsheet,
  Download,
  Printer,
  TrendingUp,
  Users,
  IndianRupee,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export function ReportsView() {
  const { organization, activeYear, yearConfig, metrics, contributions, expenses, members, auditLogs } = useFestival();
  const [activeTab, setActiveTab] = useState<
    'summary' | 'daily' | 'collectors' | 'expenses' | 'pending' | 'audit'
  >('summary');

  // Pending contributions
  const pendingContributions = contributions.filter(
    (c) => c.paymentStatus === 'Pending' || c.paymentStatus === 'Partially Paid'
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Festival Financial & Audit Reports</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Official income-expenditure statement and transparency reports for {organization.name} ({activeYear})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => storage.exportContributorsCSV(activeYear)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span>Donations CSV</span>
          </button>

          <button
            onClick={() => storage.exportExpensesCSV(activeYear)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span>Expenses CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-amber-200" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-amber-200/80 shadow-xs overflow-x-auto text-xs font-bold gap-1">
        {[
          { id: 'summary', label: '📊 Financial Summary' },
          { id: 'daily', label: '🗓️ Daily Collection' },
          { id: 'collectors', label: '🤝 Collector Performance' },
          { id: 'expenses', label: '🧾 12-Category Expenses' },
          { id: 'pending', label: `⚠️ Pending Dues (${pendingContributions.length})` },
          { id: 'audit', label: '🛡️ Audit Logs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'festival-saffron-gradient text-white shadow-xs font-extrabold'
                : 'text-gray-600 hover:bg-amber-50 hover:text-amber-950'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: 1. SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Printable Statement Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xs space-y-6">
            {/* Header info */}
            <div className="text-center border-b border-amber-200 pb-4">
              <p className="text-xs font-bold text-amber-900 uppercase">॥ శ్రీ గణేశాయ నమః ॥</p>
              <h2 className="text-2xl font-black text-amber-950 uppercase mt-1">{organization.name}</h2>
              <p className="text-xs text-gray-600">
                {organization.location.galli}, {organization.location.village}, {organization.location.district} - Year {activeYear}
              </p>
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-bold text-xs">
                OFFICIAL FESTIVAL BALANCE SHEET & AUDIT STATEMENT
              </div>
            </div>

            {/* Income vs Expenses Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income Column */}
              <div className="space-y-3">
                <h3 className="font-black text-sm text-green-800 uppercase flex items-center gap-1.5 pb-2 border-b-2 border-green-600">
                  <span>A. Chanda Inflows (ఆదాయం)</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Cash Collections:</span>
                    <span className="font-bold text-gray-900">
                      ₹
                      {(
                        metrics.paymentMethodStats.find((m) => m.method === 'Cash')?.amount || 0
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">UPI / QR Collections:</span>
                    <span className="font-bold text-gray-900">
                      ₹
                      {(
                        metrics.paymentMethodStats.find((m) => m.method === 'UPI')?.amount || 0
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Bank Transfer / Cheques:</span>
                    <span className="font-bold text-gray-900">
                      ₹
                      {(
                        metrics.paymentMethodStats.find((m) => m.method === 'Bank Transfer')?.amount || 0
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 bg-green-50 px-3 rounded-xl font-black text-green-900 text-sm">
                    <span>Total Inflow (A):</span>
                    <span>{formatIndianCurrency(metrics.totalCollection)}</span>
                  </div>
                </div>
              </div>

              {/* Expense Column */}
              <div className="space-y-3">
                <h3 className="font-black text-sm text-red-800 uppercase flex items-center gap-1.5 pb-2 border-b-2 border-red-600">
                  <span>B. Festival Expenditures (ఖర్చులు)</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {metrics.categoryExpenses.slice(0, 4).map((c) => (
                    <div key={c.category} className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-gray-600">{c.category}:</span>
                      <span className="font-bold text-gray-900">₹{c.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 bg-red-50 px-3 rounded-xl font-black text-red-900 text-sm">
                    <span>Total Outflow (B):</span>
                    <span>{formatIndianCurrency(metrics.totalExpenses)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Balance Result Banner */}
            <div
              className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${
                metrics.remainingBalance >= 0
                  ? 'bg-green-50 border-green-300 text-green-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Festival Net Cash Balance (A - B)</p>
                <p className="text-2xl sm:text-3xl font-black mt-0.5">
                  {formatIndianCurrency(metrics.remainingBalance)}
                </p>
              </div>
              <div className="text-xs font-semibold text-gray-600">
                Target: ₹{yearConfig.chandaTarget.toLocaleString('en-IN')} ({metrics.collectionProgressPercent}% Complete)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. DAILY */}
      {activeTab === 'daily' && (
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs overflow-hidden">
          <h3 className="font-extrabold text-gray-900 text-sm mb-3">Daily Collection Ledger</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-amber-50 text-amber-950 font-bold border-b border-amber-200">
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Donations Count</th>
                <th className="py-2.5 px-4">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {metrics.dailyCollections.map((d) => (
                <tr key={d.date} className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-4 font-mono font-bold text-gray-900">{d.date}</td>
                  <td className="py-2.5 px-4 text-gray-700">{d.count} contributors</td>
                  <td className="py-2.5 px-4 font-black text-orange-700">₹{d.amount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: 3. COLLECTORS */}
      {activeTab === 'collectors' && (
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs overflow-hidden">
          <h3 className="font-extrabold text-gray-900 text-sm mb-3">Collector Audit & Performance</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-amber-50 text-amber-950 font-bold border-b border-amber-200">
                <th className="py-2.5 px-4">Collector Name</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Receipts Issued</th>
                <th className="py-2.5 px-4">Total Funds Collected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-4 font-bold text-gray-900">{m.name}</td>
                  <td className="py-2.5 px-4 capitalize font-semibold text-gray-600">{m.role}</td>
                  <td className="py-2.5 px-4 text-gray-700">{m.collectionCount} donors</td>
                  <td className="py-2.5 px-4 font-black text-orange-700">₹{m.totalCollected.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: 4. EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs overflow-hidden">
          <h3 className="font-extrabold text-gray-900 text-sm mb-3">Category-wise Expenditure Summary</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-red-50 text-red-950 font-bold border-b border-red-200">
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Spent Amount</th>
                <th className="py-2.5 px-4">% of Total Expenses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {metrics.categoryExpenses.map((c) => (
                <tr key={c.category} className="hover:bg-red-50/30">
                  <td className="py-2.5 px-4 font-bold text-gray-900">{c.category}</td>
                  <td className="py-2.5 px-4 font-black text-red-700">₹{c.amount.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-4 text-gray-600 font-bold">{c.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: 5. PENDING */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs overflow-hidden">
          <h3 className="font-extrabold text-gray-900 text-sm mb-1">Pending Chanda & Dues List</h3>
          <p className="text-xs text-gray-500 mb-3">Follow-up list for promised contributions</p>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-amber-50 text-amber-950 font-bold border-b border-amber-200">
                <th className="py-2.5 px-4">Receipt</th>
                <th className="py-2.5 px-4">Contributor</th>
                <th className="py-2.5 px-4">Phone</th>
                <th className="py-2.5 px-4">Total Amount</th>
                <th className="py-2.5 px-4">Paid</th>
                <th className="py-2.5 px-4">Pending Due</th>
                <th className="py-2.5 px-4">Collector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {pendingContributions.map((p) => {
                const due = p.amount - (p.paidAmount || 0);
                return (
                  <tr key={p.id} className="hover:bg-amber-50/40">
                    <td className="py-2.5 px-4 font-mono font-bold text-orange-700">{p.receiptNumber}</td>
                    <td className="py-2.5 px-4 font-bold text-gray-900">{p.contributorName}</td>
                    <td className="py-2.5 px-4 font-mono text-gray-700">+91 {p.contributorPhone}</td>
                    <td className="py-2.5 px-4 font-bold">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-4 text-green-700 font-bold">₹{(p.paidAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-4 font-black text-red-600">₹{due.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-4 text-gray-600">{p.collectorName}</td>
                  </tr>
                );
              })}

              {pendingContributions.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-gray-400">
                    🎉 All contributions are fully paid! No pending dues.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: 6. AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs overflow-hidden">
          <h3 className="font-extrabold text-gray-900 text-sm mb-3">Security & Financial Audit Trail</h3>
          <div className="space-y-2.5">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-orange-950">{log.action}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/60 font-mono text-amber-900 uppercase">
                      {log.actorRole}
                    </span>
                  </div>
                  <p className="text-gray-700 text-[11px] mt-0.5">{log.details}</p>
                </div>
                <div className="text-right text-[10px] text-gray-400 whitespace-nowrap">
                  <div>{log.actorName}</div>
                  <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
