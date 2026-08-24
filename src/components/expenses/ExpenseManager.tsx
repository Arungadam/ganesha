'use client';

import React, { useState, useMemo } from 'react';
import { useFestival } from '@/lib/festival-context';
import { useAuth } from '@/lib/auth-context';
import { ExpenseCategory, PaymentMethod, Expense } from '@/types';
import { formatIndianCurrency } from '@/lib/receipt-generator';
import { storage } from '@/lib/storage';
import {
  PlusCircle,
  FileSpreadsheet,
  Download,
  Trash2,
  Tag,
  IndianRupee,
  Calendar,
  User,
  CreditCard,
  FileText,
  X,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

const CATEGORIES: ExpenseCategory[] = [
  'Decoration',
  'Ganesh Idol',
  'Sound',
  'Lighting',
  'Food',
  'Transportation',
  'Pandal',
  'Electrical',
  'Cultural Programs',
  'Puja Materials',
  'Cleaning',
  'Other',
];

export function ExpenseManager() {
  const { expenses, addExpense, deleteExpense, metrics, activeYear } = useFestival();
  const { canManageExpenses, user } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Form State
  const [expenseName, setExpenseName] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Decoration');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState(user?.name || 'Gadam ArunKumar');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');

  const filteredExpenses = useMemo(() => {
    if (selectedCategoryFilter === 'ALL') return expenses;
    return expenses.filter((e) => e.category === selectedCategoryFilter);
  }, [expenses, selectedCategoryFilter]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!expenseName.trim() || isNaN(num) || num <= 0) return;

    addExpense({
      expenseName,
      category,
      amount: num,
      date,
      paidBy,
      paymentMethod,
      notes,
    });

    setIsAddModalOpen(false);
    setExpenseName('');
    setAmount('');
    setNotes('');
  };

  const handleExportCSV = () => {
    storage.exportExpensesCSV(activeYear);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Festival Expenses & Accounts</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Track and verify all pandal expenditures with transparent billing
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

          {canManageExpenses && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-red-200" />
              <span>+ Add Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase">Total Collection</span>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {formatIndianCurrency(metrics.totalCollection)}
          </p>
          <span className="text-[11px] text-green-700 font-bold">From {metrics.totalContributors} contributors</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase">Total Spent</span>
          <p className="text-2xl font-black text-red-600 mt-1">
            {formatIndianCurrency(totalExpenses)}
          </p>
          <span className="text-[11px] text-gray-500 font-medium">{expenses.length} bills recorded</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase">Remaining Cash Balance</span>
          <p
            className={`text-2xl font-black mt-1 ${
              metrics.remainingBalance >= 0 ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {formatIndianCurrency(metrics.remainingBalance)}
          </p>
          <span className="text-[11px] text-gray-500 font-medium">Collection - Total Expenses</span>
        </div>
      </div>

      {/* 12 Category Filter Chips */}
      <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-2">
        <span className="text-xs font-bold text-gray-700 block">Filter by Festival Category:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategoryFilter('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              selectedCategoryFilter === 'ALL'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories ({expenses.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = expenses.filter((e) => e.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedCategoryFilter === cat
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>{cat}</span>
                {count > 0 && <span className="opacity-75 text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-red-50/60 border-b border-red-200/80 text-red-950 font-bold uppercase text-[10.5px]">
                <th className="py-3 px-4">Expense Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Paid By</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Notes</th>
                {canManageExpenses && <th className="py-3 px-4 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-red-50/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-gray-900">{exp.expenseName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10.5px] font-bold">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-red-700 text-sm">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{exp.date}</td>
                  <td className="py-3 px-4 text-gray-800">{exp.paidBy}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-semibold">
                      {exp.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 italic max-w-xs truncate">{exp.notes || '—'}</td>
                  {canManageExpenses && (
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Expense Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-xs">
                    No expense records found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-red-700 to-orange-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-red-200" />
                <h3 className="font-extrabold text-base">Add Festival Expense</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  placeholder="e.g. 11-ft Ganesh Clay Idol, Flower Decoration, Sound Set"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="5000"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-black text-red-700 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Paid By</label>
                  <input
                    type="text"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    placeholder="Organizer Name"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / QR</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bill Notes / Vendor Details</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Bill receipt #452, Paid via Google Pay"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
