import DashboardLayout from '../components/layout/DashboardLayout';
import { LayoutGrid } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import CompanyProfile from './CompanyProfile';
import TicketDashboard from './tickets/TicketDashboard';
import TicketList from './tickets/TicketList';
import CreateTicket from './tickets/CreateTicket';
import TicketDetails from './tickets/TicketDetails';
import TicketReport from './tickets/TicketReport';
import TicketAdmin from './tickets/TicketAdmin';
import RolesList from './RolesList';
import PermissionGate from '../components/PermissionGate';
import SalesDashboard from './sales/SalesDashboard';
import ClientsList from './sales/ClientsList';
import VendorsList from './sales/VendorsList';
import ProductsList from './sales/ProductsList';
import QuotationsList from './sales/QuotationsList';
import QuotationDetails from './sales/QuotationDetails';

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

export default function CompanyDashboard() {
  return (
    <DashboardLayout role="company">
      <Routes>
        <Route path="/" element={<TicketDashboard />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/create" element={<CreateTicket />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        <Route path="/tickets/:id/report" element={<TicketReport />} />
        <Route path="/admin" element={<TicketAdmin />} />
        <Route path="/sales" element={
          <PermissionGate permission="sales.view">
            <SalesDashboard />
          </PermissionGate>
        } />
        <Route path="/sales/clients" element={
          <PermissionGate permission="sales.clients.view">
            <ClientsList />
          </PermissionGate>
        } />
        <Route path="/sales/vendors" element={
          <PermissionGate permission="sales.vendors.view">
            <VendorsList />
          </PermissionGate>
        } />
        <Route path="/sales/products" element={
          <PermissionGate permission="sales.products.view">
            <ProductsList />
          </PermissionGate>
        } />
        <Route path="/sales/quotations" element={
          <PermissionGate permission="sales.quotations.view">
            <QuotationsList />
          </PermissionGate>
        } />
        <Route path="/sales/quotations/:id" element={
          <PermissionGate permission="sales.quotations.view">
            <QuotationDetails />
          </PermissionGate>
        } />
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
