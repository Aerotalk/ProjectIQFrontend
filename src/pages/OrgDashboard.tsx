import DashboardLayout from '../components/layout/DashboardLayout';
import { LayoutGrid } from 'lucide-react';

export default function OrgDashboard() {
  return (
    <DashboardLayout>
      <div className="w-full h-[calc(100vh-8rem)] bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm flex flex-col items-center justify-center p-8 text-center">
        
        <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <LayoutGrid size={28} className="text-[#792359] dark:text-[#e6a8d0]" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight mb-2">
          Ticket Dashboard
        </h2>
        
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
          The ticket system module is currently being configured. Select an option from the sidebar menu to navigate, or check back later to view your analytics and data.
        </p>
        
      </div>
    </DashboardLayout>
  );
}

