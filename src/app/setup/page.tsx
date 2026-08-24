import { CommitteeSetupWizard } from '@/components/setup/CommitteeSetupWizard';
import { GaneshLogo } from '@/components/common/GaneshLogo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-festival-pattern py-8 px-4 sm:px-6 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full mb-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-orange-700">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <GaneshLogo size={32} />
      </div>

      <CommitteeSetupWizard />

      <div className="text-center py-6 text-xs text-gray-500">
        Ganesh Seva • Built with ❤️ by Gadam ArunKumar
      </div>
    </div>
  );
}
