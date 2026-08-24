import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Footer } from '@/components/layout/Footer';
import { ContributorList } from '@/components/contributors/ContributorList';

export default function ContributorsPage() {
  return (
    <div className="min-h-screen bg-festival-pattern flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <ContributorList />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
