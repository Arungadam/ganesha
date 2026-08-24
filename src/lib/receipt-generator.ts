import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Contribution, Organization } from '@/types';

/**
 * Convert number to Indian Currency Words
 * e.g. 5001 -> "Rupees Five Thousand One Only"
 */
export function numberToIndianWords(amount: number): string {
  if (amount === 0) return 'Rupees Zero Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const twoDigits = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tensMultiple = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n: number): string {
    if (n === 0) return '';
    if (n < 10) return singleDigits[n];
    if (n >= 10 && n < 20) return twoDigits[n - 10];
    const tens = Math.floor(n / 10);
    const units = n % 10;
    return tensMultiple[tens] + (units !== 0 ? ' ' + singleDigits[units] : '');
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let str = '';
    if (hundred !== 0) {
      str += singleDigits[hundred] + ' Hundred';
      if (rest !== 0) str += ' and ';
    }
    if (rest !== 0) {
      str += convertTwoDigits(rest);
    }
    return str;
  }

  let num = Math.floor(amount);
  let words = '';

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundreds = num;

  if (crore > 0) {
    words += convertTwoDigits(crore) + ' Crore ';
  }
  if (lakh > 0) {
    words += convertTwoDigits(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    words += convertTwoDigits(thousand) + ' Thousand ';
  }
  if (hundreds > 0) {
    words += convertThreeDigits(hundreds);
  }

  return `Rupees ${words.trim()} Only`;
}

/**
 * Format currency with Indian Comma System
 * e.g. 125450 -> "₹1,25,450"
 */
export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate formatted WhatsApp message for Chanda Receipt
 */
export function generateWhatsAppMessage(
  contribution: Contribution,
  org: Organization
): { text: string; encodedUrl: string } {
  const words = numberToIndianWords(contribution.amount);
  const location = `${org.location.galli}, ${org.location.village} (${org.location.district})`;

  const message = `🙏 *శ్రీ గణేశాయ నమః | SRI GANESHAY NAMAHA* 🙏

✨ *${org.name}* (${contribution.year})
📍 ${location}

━━━━━━━━━━━━━━━━━━━━━━━━━━
📜 *CHANDA RECEIPT / చందా రసీదు*
━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 *Receipt No:* ${contribution.receiptNumber}
👤 *Contributor:* ${contribution.contributorName}
📱 *Phone:* ${contribution.contributorPhone}
💰 *Amount:* ₹${contribution.amount.toLocaleString('en-IN')}
📝 *In Words:* ${words}
🗓️ *Date:* ${contribution.date}
💳 *Payment Mode:* ${contribution.paymentMethod}
✅ *Status:* ${contribution.paymentStatus}
🤝 *Received By:* ${contribution.collectorName}
━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 *May Lord Vighnaharta Ganesha shower peace, health, and prosperity upon you and your family!*

_Powered by Ganesh Seva Festival Management_
_Built with ❤️ by Gadam ArunKumar_`;

  const encodedUrl = `https://wa.me/91${contribution.contributorPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
    message
  )}`;

  return { text: message, encodedUrl };
}

/**
 * Download Receipt as standard PDF
 */
export function downloadReceiptPDF(contribution: Contribution, org: Organization) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5',
  });

  // Background tint
  doc.setFillColor(254, 250, 242);
  doc.rect(0, 0, 148, 210, 'F');

  // Decorative border
  doc.setDrawColor(217, 119, 6); // Gold border
  doc.setLineWidth(1.2);
  doc.roundedRect(6, 6, 136, 198, 4, 4);
  doc.setDrawColor(153, 27, 27); // Inner Maroon border
  doc.setLineWidth(0.4);
  doc.roundedRect(8, 8, 132, 194, 3, 3);

  // Header Banner
  doc.setFillColor(153, 27, 27);
  doc.rect(8, 8, 132, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('|| OM SHREE GANESHAYA NAMAHA ||', 74, 15, { align: 'center' });

  doc.setFontSize(14);
  doc.text(org.name.toUpperCase(), 74, 23, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `${org.location.galli}, ${org.location.area}, ${org.location.village}, ${org.location.district} - Year ${contribution.year}`,
    74,
    29,
    { align: 'center' }
  );

  // Receipt Badge
  doc.setFillColor(234, 88, 12); // Saffron
  doc.roundedRect(45, 36, 58, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL CHANDA RECEIPT', 74, 41.5, { align: 'center' });

  // Receipt Metadata
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Receipt No: ${contribution.receiptNumber}`, 14, 52);
  doc.text(`Date: ${contribution.date}  ${contribution.time || ''}`, 134, 52, { align: 'right' });

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 55, 134, 55);

  // Details Table / Key-values
  autoTable(doc, {
    startY: 58,
    margin: { left: 14, right: 14 },
    theme: 'plain',
    styles: { fontSize: 9.5, cellPadding: 3, textColor: [30, 30, 30] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40, textColor: [100, 30, 22] },
      1: { cellWidth: 80 },
    },
    body: [
      ['Donor Name:', contribution.contributorName],
      ['Mobile Number:', `+91 ${contribution.contributorPhone}`],
      ['Street / Galli:', contribution.galli || org.location.galli],
      ['Contribution Amount:', `INR ${contribution.amount.toLocaleString('en-IN')} /-`],
      ['Amount in Words:', numberToIndianWords(contribution.amount)],
      ['Payment Method:', `${contribution.paymentMethod} (${contribution.paymentStatus})`],
      ['Notes / Remarks:', contribution.notes || 'Devotional Contribution for Festival Seva'],
      ['Collected By:', contribution.collectorName],
    ],
  });

  // Highlight Box for Amount
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(14, 132, 120, 16, 2, 2, 'FD');

  doc.setTextColor(153, 27, 27);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('AMOUNT RECEIVED:', 20, 142);
  doc.setFontSize(14);
  doc.text(`Rs. ${contribution.amount.toLocaleString('en-IN')} /-`, 128, 142, { align: 'right' });

  // Blessings & Signatures
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(90, 90, 90);
  doc.text(
    'May Lord Vigneshwara bless you and your family with boundless joy, happiness, and prosperity.',
    74,
    158,
    { align: 'center' }
  );

  // Signatures
  doc.setDrawColor(150, 150, 150);
  doc.line(20, 185, 55, 185);
  doc.line(95, 185, 130, 185);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Collector Signature', 37.5, 190, { align: 'center' });
  doc.text('President / Secretary', 112.5, 190, { align: 'center' });

  // Footer stamp
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  doc.text('Ganesh Seva - Smart Festival Management | Built with love by Gadam ArunKumar', 74, 199, {
    align: 'center',
  });

  doc.save(`${org.slug || 'ganesh-seva'}-receipt-${contribution.receiptNumber}.pdf`);
}
