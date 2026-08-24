import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { FestivalProvider } from '@/lib/festival-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GANESH SEVA – Smart Ganesh Festival Management',
  description:
    'Manage Chanda collections, contributors, digital WhatsApp receipts, expenses and festival events for Ganesh Mandals and Utsav Samithis. Built by Gadam ArunKumar.',
  keywords: [
    'Ganesh Seva',
    'Ganesh Festival Management',
    'Chanda Collection App',
    'Ganesh Mandali Chanda Receipt',
    'Vinayaka Chavithi',
    'Gadam ArunKumar',
  ],
};

export const viewport: Viewport = {
  themeColor: '#EA580C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-slate-900">
        <AuthProvider>
          <FestivalProvider>{children}</FestivalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
