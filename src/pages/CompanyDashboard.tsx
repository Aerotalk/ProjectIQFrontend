import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { LayoutGrid, Loader2, Building2 } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import CompanyProfile from './CompanyProfile';
import TicketDashboard from './tickets/TicketDashboard';
import TicketList from './tickets/TicketList';
import CreateTicket from './tickets/CreateTicket';
import TicketDetails from './tickets/TicketDetails';
import TicketReport from './tickets/TicketReport';
import TicketAdmin from './tickets/TicketAdmin';
import RolesList from './RolesList';
import PermissionGate from '../components/PermissionGate';

function DefaultView() {
  return (
    <div className="w-full h-[calc(100vh-8rem)] bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm flex flex-col items-center justify-center p-8 text-center">

      <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
        <LayoutGrid size={28} className="text-[#792359] dark:text-[#e6a8d0]" />
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight mb-2">
        Company Dashboard
      </h2>

      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
        Welcome to your company dashboard. Select an option from the sidebar menu to navigate, or check back later to view your analytics and data.
      </p>

    </div>
  );
}

/**
 * Hook that fetches the companies this user has role assignments for
 * via GET /auth/my-companies, and manages the selectedCompanyId state.
 */
function useCompanySelector() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<{id: string; companyName: string}[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(localStorage.getItem('selectedCompanyId'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/my-companies')
      .then((res: any) => {
        const list = Array.isArray(res) ? res : [];
        setCompanies(list);

        // If we already have a valid selection, keep it
        const stored = localStorage.getItem('selectedCompanyId');
        if (stored && list.some((c: any) => c.id === stored)) {
          setSelectedId(stored);
        } else if (list.length === 1) {
          // Auto-select if there's exactly one company
          localStorage.setItem('selectedCompanyId', list[0].id);
          setSelectedId(list[0].id);
        } else {
          // Multiple or zero — force user to choose
          localStorage.removeItem('selectedCompanyId');
          setSelectedId(null);
        }
      })
      .catch((err: any) => {
        console.error('Failed to fetch my companies:', err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const selectCompany = (id: string) => {
    localStorage.setItem('selectedCompanyId', id);
    setSelectedId(id);
    window.dispatchEvent(new Event('storage'));
  };

  return { companies, selectedId, selectCompany, loading };
}

export default function CompanyDashboard() {
  const { companies, selectedId, selectCompany, loading } = useCompanySelector();

  if (loading) {
    return (
      <DashboardLayout role="company">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
          <Loader2 className="animate-spin text-[#792359] mb-4" size={32} />
          <p className="text-gray-500 font-medium">Loading company data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!selectedId) {
    return (
      <DashboardLayout role="company">
        <div className="w-full h-[calc(100vh-8rem)] bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#792359] to-[#b8458f] rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Building2 size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight mb-2">
            Select a Company
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed mb-6">
            You have access to multiple companies. Please select the one you'd like to work with.
          </p>

          {companies.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No companies have been assigned to your account yet. Contact your organization admin.</p>
          ) : (
            <div className="w-full max-w-sm space-y-2">
              {companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectCompany(c.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg hover:border-[#792359] hover:bg-[#792359]/5 dark:hover:bg-[#792359]/10 transition-all group text-left"
                >
                  <div className="w-8 h-8 rounded-md bg-[#792359]/10 flex items-center justify-center group-hover:bg-[#792359]/20 transition-colors">
                    <Building2 size={16} className="text-[#792359]" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#792359] transition-colors">
                    {c.companyName}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="company">
      {/* Company switcher bar */}
      {companies.length > 1 && (
        <div className="mb-4 flex items-center gap-3 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm px-4 py-2 shadow-sm">
          <Building2 size={16} className="text-[#792359] shrink-0" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0">Company:</span>
          <select
            value={selectedId}
            onChange={(e) => {
              selectCompany(e.target.value);
              window.location.reload(); // Reload to re-fetch all data for the new company
            }}
            className="text-sm font-medium text-gray-900 dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.companyName}</option>
            ))}
          </select>
        </div>
      )}

      <Routes>
        <Route path="/" element={<TicketDashboard />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/create" element={<CreateTicket />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        <Route path="/tickets/:id/report" element={<TicketReport />} />
        <Route path="/admin" element={<TicketAdmin />} />
        <Route path="/profile" element={<CompanyProfile />} />
        <Route path="/roles" element={
          <PermissionGate permission="role.view">
            <RolesList />
          </PermissionGate>
        } />
        <Route path="*" element={<DefaultView />} />
      </Routes>
    </DashboardLayout>
  );
}

