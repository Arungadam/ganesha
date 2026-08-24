import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Footer } from '@/components/layout/Footer';
import { MemberManager } from '@/components/members/MemberManager';

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-festival-pattern flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <MemberManager />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
