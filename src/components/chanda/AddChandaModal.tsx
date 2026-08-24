'use client';

import React, { useState, useEffect } from 'react';
import { useFestival } from '@/lib/festival-context';
import { useAuth } from '@/lib/auth-context';
import { PaymentMethod, PaymentStatus, Contributor } from '@/types';
import confetti from 'canvas-confetti';
import {
  X,
  PlusCircle,
  AlertCircle,
  CheckCircle,
  Phone,
  User,
  IndianRupee,
  Calendar,
  CreditCard,
  UserCheck,
  FileText,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface AddChandaModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillPhone?: string;
  prefillName?: string;
}

export function AddChandaModal({ isOpen, onClose, prefillPhone = '', prefillName = '' }: AddChandaModalProps) {
  const { addContribution, checkDuplicatePhone, organization, members } = useFestival();
  const { user } = useAuth();

  const [name, setName] = useState(prefillName);
  const [phone, setPhone] = useState(prefillPhone);
  const [amount, setAmount] = useState<string>('1001');
  const [paidAmount, setPaidAmount] = useState<string>('1001');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [collectorName, setCollectorName] = useState<string>(user?.name || 'Gadam ArunKumar');
  const [notes, setNotes] = useState<string>('Devotional Chanda for Vinayaka Chavithi');
  const [galli, setGalli] = useState<string>(organization.location.galli);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [duplicateContributor, setDuplicateContributor] = useState<Contributor | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Amount presets popular in Indian festivals
  const quickAmounts = [251, 501, 1001, 2116, 5001, 10001];

  useEffect(() => {
    if (user?.name) {
      setCollectorName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (prefillPhone) setPhone(prefillPhone);
    if (prefillName) setName(prefillName);
  }, [prefillPhone, prefillName]);

  // Realtime duplicate phone check
  useEffect(() => {
    if (phone.trim().length >= 10) {
      const existing = checkDuplicatePhone(phone);
      if (existing) {
        setDuplicateContributor(existing);
        if (!name) setName(existing.name);
      } else {
        setDuplicateContributor(null);
      }
    } else {
      setDuplicateContributor(null);
    }
  }, [phone, checkDuplicatePhone, name]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Contributor name is required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Valid 10-digit mobile number required';
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      errs.amount = 'Please enter a valid donation amount';
    }
    if (!collectorName.trim()) errs.collector = 'Collector name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const numAmount = parseFloat(amount);
    const numPaid = paymentStatus === 'Pending' ? 0 : parseFloat(paidAmount) || numAmount;

    try {
      addContribution({
        contributorName: name,
        contributorPhone: phone,
        amount: numAmount,
        paidAmount: numPaid,
        paymentMethod,
        paymentStatus,
        collectorName,
        notes,
        galli,
        date,
      });

      // Fire festive confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EA580C', '#D97706', '#F59E0B', '#DC2626', '#16A34A'],
        });
      } catch (err) {
        console.error(err);
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <PlusCircle className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Add Chanda / చందా నమోదు</h3>
              <p className="text-[11px] text-amber-100 font-medium">{organization.name} ({organization.currentYear})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate warning banner */}
        {duplicateContributor && (
          <div className="bg-amber-50 border-b border-amber-200 p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Existing Contributor Found: </span>
              {duplicateContributor.name} has already contributed ₹
              {duplicateContributor.totalDonated.toLocaleString('en-IN')} ({duplicateContributor.contributionCount} times).
              This entry will add another contribution to their record.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Contributor Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-orange-600" />
              Contributor / Donor Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. K. Balakrishna, M. Srinivasulu"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
            />
            {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-orange-600" />
              Mobile Number (10 Digits for WhatsApp Receipt) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">+91</span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9849012345"
                className="w-full pl-11 pr-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono font-semibold"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
          </div>

          {/* Amount and Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-orange-600" />
              Chanda Amount (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-base font-bold text-orange-600">₹</span>
              <input
                type="number"
                required
                min={1}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (paymentStatus === 'Paid') setPaidAmount(e.target.value);
                }}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border-2 border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg font-black text-gray-900"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickAmounts.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => {
                    setAmount(amt.toString());
                    if (paymentStatus === 'Paid') setPaidAmount(amt.toString());
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    amount === amt.toString()
                      ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            {errors.amount && <p className="text-red-500 text-[11px] mt-1">{errors.amount}</p>}
          </div>

          {/* Payment Method & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-orange-600" />
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-semibold"
              >
                <option value="Cash">Cash (నగదు)</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-orange-600" />
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => {
                  const st = e.target.value as PaymentStatus;
                  setPaymentStatus(st);
                  if (st === 'Paid') setPaidAmount(amount);
                  if (st === 'Pending') setPaidAmount('0');
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-semibold"
              >
                <option value="Paid">Paid (చెల్లించారు)</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Pending">Pending (బాకీ)</option>
              </select>
            </div>
          </div>

          {/* If Partially Paid, show Paid Amount input */}
          {paymentStatus === 'Partially Paid' && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <label className="block text-xs font-bold text-amber-950 mb-1">
                Amount Paid Right Now (₹)
              </label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-sm font-bold"
              />
              <p className="text-[11px] text-amber-800 mt-1">
                Remaining Due: ₹{Math.max(0, parseFloat(amount || '0') - parseFloat(paidAmount || '0')).toLocaleString('en-IN')}
              </p>
            </div>
          )}

          {/* Collector & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-orange-600" />
                Collector Name
              </label>
              <input
                type="text"
                value={collectorName}
                onChange={(e) => setCollectorName(e.target.value)}
                placeholder="Collector"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-orange-600" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Galli & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                Galli / Street
              </label>
              <input
                type="text"
                value={galli}
                onChange={(e) => setGalli(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-orange-600" />
                Notes / Seva Type
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Annadanam, Pooja"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl festival-saffron-gradient text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{isSubmitting ? 'Saving...' : 'Save & Generate Receipt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
