'use client';

import React, { useState } from 'react';
import { useFestival } from '@/lib/festival-context';
import { useAuth } from '@/lib/auth-context';
import { Zap, X, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RapidEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RapidEntryModal({ isOpen, onClose }: RapidEntryModalProps) {
  const { addContribution, organization } = useFestival();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('501');
  const [method, setMethod] = useState<'Cash' | 'UPI'>('Cash');
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleRapidSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    addContribution({
      contributorName: name,
      contributorPhone: phone || '9999999999',
      amount: parseFloat(amount),
      paymentMethod: method,
      paymentStatus: 'Paid',
      collectorName: user?.name || 'Street Volunteer',
      notes: 'Rapid Street Collection',
    });

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}

    setSuccessToast(true);
    setName('');
    setPhone('');
    setAmount('501');

    setTimeout(() => {
      setSuccessToast(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border-2 border-orange-400 overflow-hidden animate-in zoom-in-95">
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <h3 className="font-black text-sm">Rapid Street Entry (3-Sec Mode)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-black/20 hover:bg-black/40">
            <X className="w-4 h-4" />
          </button>
        </div>

        {successToast && (
          <div className="bg-green-600 text-white text-xs font-bold py-2 px-3 text-center flex items-center justify-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4" />
            Chanda Added & Receipt Created! Next...
          </div>
        )}

        <form onSubmit={handleRapidSave} className="p-4 space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-0.5">1. Contributor Name *</label>
            <input
              type="text"
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-0.5">2. Mobile (WhatsApp) *</label>
            <input
              type="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="10 digit mobile"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono font-bold focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-0.5">3. Amount (₹) *</label>
            <div className="grid grid-cols-4 gap-1.5 mb-1.5">
              {[251, 501, 1001, 2116].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className={`py-1 rounded-lg text-xs font-bold border ${
                    amount === amt.toString() ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-orange-300 text-base font-black text-orange-700 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMethod('Cash')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${
                method === 'Cash' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Cash
            </button>
            <button
              type="button"
              onClick={() => setMethod('UPI')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${
                method === 'UPI' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              UPI / QR
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl festival-saffron-gradient text-white text-sm font-black shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all mt-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-200" />
            Instant Save & Next
          </button>
        </form>
      </div>
    </div>
  );
}
