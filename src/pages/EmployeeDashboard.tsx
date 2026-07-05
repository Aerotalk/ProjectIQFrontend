import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TicketDashboard from './tickets/TicketDashboard';
import CreateTicket from './tickets/CreateTicket';

function DefaultView() {
  return (
    <div className="bg-white dark:bg-[#181a1f] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Employee Portal</h2>
      <p className="text-gray-500 dark:text-gray-400">Welcome to your employee dashboard. Select an option from the sidebar to begin.</p>
    </div>
  );
}

export default function EmployeeDashboard() {
  // Simple check for employee role token/session could go here
  return (
    <DashboardLayout role="employee">
      <Routes>
        <Route path="/" element={<TicketDashboard />} />
        <Route path="/tickets/*" element={<TicketDashboard />} />
        <Route path="/tickets/create" element={<CreateTicket />} />
        <Route path="*" element={<DefaultView />} />
      </Routes>
    </DashboardLayout>
  );
}
