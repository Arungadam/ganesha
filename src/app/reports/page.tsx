import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Footer } from '@/components/layout/Footer';
import { ReportsView } from '@/components/reports/ReportsView';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-festival-pattern flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <ReportsView />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
