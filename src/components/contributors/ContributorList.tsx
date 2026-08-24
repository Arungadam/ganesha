'use client';

import React, { useState, useMemo } from 'react';
import { useFestival } from '@/lib/festival-context';
import { useAuth } from '@/lib/auth-context';
import { Contribution, PaymentMethod, PaymentStatus } from '@/types';
import { DigitalReceiptModal } from '@/components/receipt/DigitalReceiptModal';
import { AddChandaModal } from '@/components/chanda/AddChandaModal';
import { storage } from '@/lib/storage';
import {
  Search,
  Filter,
  Download,
  PlusCircle,
  Phone,
  User,
  Calendar,
  CreditCard,
  UserCheck,
  CheckCircle,
  Clock,
  ArrowUpDown,
  FileSpreadsheet,
  Share2,
} from 'lucide-react';

export function ContributorList() {
  const { contributions, organization, activeYear, setIsAddChandaOpen } = useFestival();
  const { canAddChanda } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [collectorFilter, setCollectorFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [selectedReceipt, setSelectedReceipt] = useState<Contribution | null>(null);
  const [addChandaPrefill, setAddChandaPrefill] = useState<{ phone: string; name: string } | null>(null);

  // Extract unique collectors
  const collectors = useMemo(() => {
    const set = new Set<string>();
    contributions.forEach((c) => {
      if (c.collectorName) set.add(c.collectorName);
    });
    return Array.from(set);
  }, [contributions]);

  // Filtered & Sorted contributions
  const filteredContributions = useMemo(() => {
    return contributions
      .filter((c) => {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          !q ||
          c.contributorName.toLowerCase().includes(q) ||
          c.contributorPhone.includes(q) ||
          c.receiptNumber.toLowerCase().includes(q);

        const matchesStatus = statusFilter === 'ALL' || c.paymentStatus === statusFilter;
        const matchesMethod = methodFilter === 'ALL' || c.paymentMethod === methodFilter;
        const matchesCollector = collectorFilter === 'ALL' || c.collectorName === collectorFilter;

        return matchesQuery && matchesStatus && matchesMethod && matchesCollector;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'amount') {
          diff = a.amount - b.amount;
        } else if (sortBy === 'name') {
          diff = a.contributorName.localeCompare(b.contributorName);
        } else {
          diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return sortOrder === 'desc' ? -diff : diff;
      });
  }, [contributions, searchQuery, statusFilter, methodFilter, collectorFilter, sortBy, sortOrder]);

  const totalFilteredAmount = useMemo(() => {
    return filteredContributions.reduce((sum, c) => sum + (c.paidAmount || c.amount), 0);
  }, [filteredContributions]);

  const handleExportCSV = () => {
    storage.exportContributorsCSV(activeYear);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Contributors & Chanda Book</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {filteredContributions.length} contributions • Total ₹{totalFilteredAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span>Export CSV</span>
          </button>

          {canAddChanda && (
            <button
              onClick={() => setIsAddChandaOpen(true)}
              className="px-4 py-2 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-amber-200" />
              <span>+ Add Chanda</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search donor name, phone, or receipt ID..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="ALL">All Payment Status</option>
              <option value="Paid">Paid (చెల్లించారు)</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending">Pending (బాకీ)</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="ALL">All Payment Methods</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Collector Filter */}
          <div>
            <select
              value={collectorFilter}
              onChange={(e) => setCollectorFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="ALL">All Collectors</option>
              {collectors.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-gray-100 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-bold flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
            </span>
            {(['date', 'amount', 'name'] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  if (sortBy === s) {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy(s);
                    setSortOrder('desc');
                  }
                }}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors ${
                  sortBy === s ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {s} {sortBy === s && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            ))}
          </div>

          <div className="text-gray-400 font-medium">Showing {filteredContributions.length} records</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-amber-50/70 border-b border-amber-200/80 text-amber-950 font-bold uppercase text-[10.5px]">
                <th className="py-3 px-4">Receipt ID</th>
                <th className="py-3 px-4">Contributor / Donor</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Collector</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredContributions.map((c) => (
                <tr key={c.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-orange-700">{c.receiptNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900">{c.contributorName}</div>
                    {c.notes && <div className="text-[10.5px] text-gray-500 italic max-w-xs truncate">{c.notes}</div>}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-700">+91 {c.contributorPhone}</td>
                  <td className="py-3 px-4 font-black text-gray-900 text-sm">
                    ₹{c.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{c.date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-bold">
                      {c.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.paymentStatus === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : c.paymentStatus === 'Partially Paid'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {c.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{c.collectorName}</td>
                  <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                    <button
                      onClick={() => setSelectedReceipt(c)}
                      title="View Official Receipt & WhatsApp Share"
                      className="px-2.5 py-1 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold text-[11px] transition-colors"
                    >
                      Receipt 📜
                    </button>
                    {canAddChanda && (
                      <button
                        onClick={() =>
                          setAddChandaPrefill({ phone: c.contributorPhone, name: c.contributorName })
                        }
                        title="Add another donation for this donor"
                        className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] transition-colors"
                      >
                        + Add More
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredContributions.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400 text-xs">
                    No contributions match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      <DigitalReceiptModal contribution={selectedReceipt} onClose={() => setSelectedReceipt(null)} />

      {/* Add Chanda prefill Modal */}
      {addChandaPrefill && (
        <AddChandaModal
          isOpen={true}
          onClose={() => setAddChandaPrefill(null)}
          prefillPhone={addChandaPrefill.phone}
          prefillName={addChandaPrefill.name}
        />
      )}
    </div>
  );
}
