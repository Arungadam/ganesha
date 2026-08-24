'use client';

import React, { useState } from 'react';
import { Contribution } from '@/types';
import { useFestival } from '@/lib/festival-context';
import {
  numberToIndianWords,
  formatIndianCurrency,
  generateWhatsAppMessage,
  downloadReceiptPDF,
} from '@/lib/receipt-generator';
import {
  Download,
  Printer,
  Share2,
  CheckCircle2,
  X,
  Copy,
  Check,
  Send,
  Sparkles,
} from 'lucide-react';

interface DigitalReceiptModalProps {
  contribution: Contribution | null;
  onClose: () => void;
}

export function DigitalReceiptModal({ contribution, onClose }: DigitalReceiptModalProps) {
  const { organization } = useFestival();
  const [copied, setCopied] = useState(false);

  if (!contribution) return null;

  const { text: whatsappText, encodedUrl: whatsappUrl } = generateWhatsAppMessage(contribution, organization);

  const handleCopyText = () => {
    navigator.clipboard.writeText(whatsappText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    downloadReceiptPDF(contribution, organization);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 text-white p-4 text-center relative">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 mb-1 ring-4 ring-white/10">
            <CheckCircle2 className="w-6 h-6 text-amber-200" />
          </div>
          <h3 className="text-lg font-black tracking-tight">Contribution Successful 🎉</h3>
          <p className="text-xs text-amber-100 font-medium">Digital Chanda Receipt Generated</p>
        </div>

        {/* The Printable / Viewable Receipt Card */}
        <div className="p-5 sm:p-6" id="printable-receipt">
          <div className="bg-amber-50/50 rounded-2xl border-2 border-amber-300/80 p-4 sm:p-5 relative shadow-inner">
            {/* Sacred Vedic Header */}
            <div className="text-center border-b border-amber-200 pb-3 mb-3">
              <p className="text-[10.5px] font-bold tracking-widest text-amber-900 uppercase">
                ॥ ॐ శ్రీ గణేశాయ నమః ॥
              </p>
              <h2 className="text-lg sm:text-xl font-extrabold text-amber-950 uppercase tracking-tight mt-0.5">
                {organization.name}
              </h2>
              <p className="text-xs text-amber-800 font-medium mt-0.5">
                📍 {contribution.galli || organization.location.galli}, {organization.location.village} - {contribution.year}
              </p>

              <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-orange-600 text-white text-[11px] font-bold tracking-wide shadow-xs">
                OFFICIAL CHANDA RECEIPT
              </div>
            </div>

            {/* Receipt Meta */}
            <div className="flex justify-between items-center text-xs text-amber-950 font-bold border-b border-dashed border-amber-300 pb-2 mb-3">
              <span className="bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300/60 font-mono text-orange-900">
                {contribution.receiptNumber}
              </span>
              <span className="text-gray-600 font-medium">
                {contribution.date} {contribution.time ? `• ${contribution.time}` : ''}
              </span>
            </div>

            {/* Donor & Amount Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-amber-100">
                <span className="text-gray-600 font-medium">Contributor:</span>
                <span className="font-bold text-gray-900 text-right">{contribution.contributorName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-100">
                <span className="text-gray-600 font-medium">Mobile Number:</span>
                <span className="font-semibold text-gray-800 font-mono">+91 {contribution.contributorPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-100">
                <span className="text-gray-600 font-medium">Payment Method:</span>
                <span className="font-bold text-gray-800 flex items-center gap-1">
                  {contribution.paymentMethod}
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      contribution.paymentStatus === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {contribution.paymentStatus}
                  </span>
                </span>
              </div>
              {contribution.notes && (
                <div className="flex justify-between py-1 border-b border-amber-100">
                  <span className="text-gray-600 font-medium">Seva / Notes:</span>
                  <span className="font-medium text-gray-800 text-right italic">{contribution.notes}</span>
                </div>
              )}
            </div>

            {/* Highlight Amount Box */}
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border border-amber-300/80 text-center">
              <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">Amount Received</p>
              <p className="text-2xl font-black text-orange-700 tracking-tight my-0.5">
                {formatIndianCurrency(contribution.amount)}
              </p>
              <p className="text-[11px] font-semibold text-amber-950 italic">
                {numberToIndianWords(contribution.amount)}
              </p>
            </div>

            {/* Collector Stamp & Blessings */}
            <div className="mt-4 pt-3 border-t border-dashed border-amber-300 flex items-end justify-between">
              <div>
                <p className="text-[10px] text-gray-500 font-medium">Received with thanks by:</p>
                <p className="text-xs font-bold text-gray-900">{contribution.collectorName}</p>
                <span className="inline-flex items-center gap-0.5 text-[9px] text-green-700 font-semibold">
                  <Sparkles className="w-2.5 h-2.5" /> Verified Collector
                </span>
              </div>
              <div className="text-right">
                <div className="h-7 w-20 border-b border-amber-800/40 ml-auto"></div>
                <p className="text-[9.5px] font-semibold text-amber-900 mt-0.5">Authorized Sign</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-2.5">
          <div className="grid grid-cols-3 gap-2">
            {/* WhatsApp Share */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Download PDF */}
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>

          {/* Copy WhatsApp Text shortcut */}
          <div className="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs">
            <span className="text-gray-600 font-medium truncate mr-2">WhatsApp message ready to copy & send</span>
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 text-center"
          >
            Close & Done
          </button>
        </div>
      </div>
    </div>
  );
}
