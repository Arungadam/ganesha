'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFestival } from '@/lib/festival-context';
import { useAuth } from '@/lib/auth-context';
import {
  MapPin,
  Building2,
  Calendar,
  IndianRupee,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  QrCode,
} from 'lucide-react';

export function CommitteeSetupWizard() {
  const router = useRouter();
  const { updateOrganization } = useFestival();
  const { user } = useAuth();

  const [step, setStep] = useState(1);

  // Step 1: Location
  const [state, setState] = useState('Telangana');
  const [district, setDistrict] = useState('Komaram Bheem Asifabad');
  const [village, setVillage] = useState('Asifabad');
  const [area, setArea] = useState('Main Town');
  const [galli, setGalli] = useState('Gandhi Chowk');

  // Step 2: Committee
  const [committeeName, setCommitteeName] = useState('Sri Ganesh Utsav Committee');
  const [organizerName, setOrganizerName] = useState(user?.name || 'Gadam ArunKumar');
  const [contactNumber, setContactNumber] = useState(user?.mobile || '9848012345');
  const [festivalYear, setFestivalYear] = useState<number>(2026);

  // Step 3: Festival
  const [startDate, setStartDate] = useState('2026-09-14');
  const [endDate, setEndDate] = useState('2026-09-24');
  const [visarjanDate, setVisarjanDate] = useState('2026-09-24');
  const [chandaTarget, setChandaTarget] = useState<number>(200000);
  const [upiId, setUpiId] = useState('ganeshseva.asifabad@upi');

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    const slug = committeeName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + village.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    updateOrganization({
      id: `org-${Date.now()}`,
      name: committeeName,
      slug,
      organizerName,
      contactNumber,
      location: {
        state,
        district,
        village,
        area,
        galli,
      },
      currentYear: festivalYear,
      years: [
        {
          id: `year-${festivalYear}`,
          year: festivalYear,
          startDate,
          endDate,
          visarjanDate,
          chandaTarget,
          upiId,
          isActive: true,
        },
      ],
      createdAt: new Date().toISOString(),
    });

    router.push('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Stepper Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-amber-200 overflow-hidden">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 text-white p-6 text-center">
          <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-100 text-xs font-bold px-3 py-1 rounded-full border border-amber-300/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Committee Onboarding Wizard
          </span>
          <h2 className="text-2xl font-black tracking-tight">Setup Your Ganesh Committee</h2>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-md mx-auto">
            Digitize your chanda collection, receipts, and accounts in just 2 minutes.
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6">
            {[
              { num: 1, label: '1. Location' },
              { num: 2, label: '2. Committee' },
              { num: 3, label: '3. Festival & Target' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-1.5 text-xs font-bold">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    step >= s.num ? 'bg-amber-300 text-amber-950 shadow-xs' : 'bg-white/20 text-white/70'
                  }`}
                >
                  {step > s.num ? <CheckCircle className="w-4 h-4 text-amber-950" /> : s.num}
                </div>
                <span className={step >= s.num ? 'text-white' : 'text-white/60'}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: LOCATION */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <MapPin className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-gray-900 text-base">Step 1: Mandal Location & Territory</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Telangana, Andhra Pradesh, Maharashtra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Komaram Bheem Asifabad, Hyderabad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Village / Town / City *</label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Asifabad, Kagaznagar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Area / Colony *</label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Main Town, Teachers Colony"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Galli / Street / Pandal Spot *</label>
                  <input
                    type="text"
                    required
                    value={galli}
                    onChange={(e) => setGalli(e.target.value)}
                    placeholder="e.g. Gandhi Chowk, Temple Street"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Breadcrumb Preview */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold flex items-center gap-1">
                <span>Location Chain:</span>
                <span className="text-orange-700">
                  {state} → {district} → {village} → {area} → {galli}
                </span>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>Next: Committee Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: COMMITTEE */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Building2 className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-gray-900 text-base">Step 2: Committee & Organizer Identity</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Official Committee / Mandal Name *</label>
                  <input
                    type="text"
                    required
                    value={committeeName}
                    onChange={(e) => setCommitteeName(e.target.value)}
                    placeholder="e.g. Sri Ganesh Utsav Committee, Lalbaug Yuva Sena"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">President / Organizer Name *</label>
                  <input
                    type="text"
                    required
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    placeholder="e.g. Gadam ArunKumar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Organizer Contact Mobile *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="9848012345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Festival Year *</label>
                  <select
                    value={festivalYear}
                    onChange={(e) => setFestivalYear(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value={2026}>2026 (Current Season)</option>
                    <option value={2027}>2027</option>
                    <option value={2028}>2028</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>Next: Dates & Target</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FESTIVAL & TARGET */}
          {step === 3 && (
            <form onSubmit={handleFinish} className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-gray-900 text-base">Step 3: Festival Schedule & Chanda Target</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Start Date (Sthapana) *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Visarjan Date *</label>
                  <input
                    type="date"
                    required
                    value={visarjanDate}
                    onChange={(e) => setVisarjanDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-orange-600" />
                    Chanda Collection Target (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={chandaTarget}
                    onChange={(e) => setChandaTarget(parseFloat(e.target.value) || 0)}
                    placeholder="200000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-black text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-orange-600" />
                    Committee UPI ID (For Digital QR Receipts)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="ganeshseva@upi or phone@ybl"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Final Summary Card */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5 text-xs text-amber-950">
                <p className="font-extrabold text-orange-800 text-sm">{committeeName} ({festivalYear})</p>
                <p>📍 {galli}, {area}, {village}, {district} ({state})</p>
                <p>👤 Organizer: {organizerName} (+91 {contactNumber})</p>
                <p>🎯 Target: ₹{chandaTarget.toLocaleString('en-IN')} | Visarjan: {visarjanDate}</p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl festival-saffron-gradient text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Launch Committee & Open Dashboard</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
