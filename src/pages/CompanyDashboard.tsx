import DashboardLayout from '../components/layout/DashboardLayout';
import { LayoutGrid } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import CompanyProfile from './CompanyProfile';
import AdminProfile from './AdminProfile';
import TicketDashboard from './tickets/TicketDashboard';
import TicketList from './tickets/TicketList';
import CreateIncident from './tickets/CreateIncident';
import IncidentDetail from './tickets/IncidentDetail';
import TicketReport from './tickets/TicketReport';
import TicketAdmin from './tickets/TicketAdmin';
import KnowledgeBase from './tickets/KnowledgeBase';
import RolesList from './RolesList';
import CompanyUsersList from './CompanyUsersList';
import PermissionGate from '../components/PermissionGate';
import SalesDashboard from './sales/SalesDashboard';
import ClientsList from './sales/ClientsList';
import VendorsList from './sales/VendorsList';
import ProductsList from './sales/ProductsList';
import QuotationsList from './sales/QuotationsList';
import QuotationDetails from './sales/QuotationDetails';
import FinanceDashboard from './finance/FinanceDashboard';
import POManagement from './finance/POManagement';
import PODetails from './finance/PODetails';
import ChallanManagement from './finance/ChallanManagement';
import ChallanDetails from './finance/ChallanDetails';
import PaymentManagement from './finance/PaymentManagement';
import ExpenseManagement from './projects/ExpenseManagement';
import ProjectFinanceDetails from './finance/ProjectFinanceDetails';
import ProjectDashboard from './projects/ProjectDashboard';
import EmployeeDirectory from './EmployeeDirectory';
import DepartmentDirectory from './DepartmentDirectory';
import DesignationDirectory from './DesignationDirectory';
import LoadersShowcase from './LoadersShowcase';

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
        <Route path="/tickets/kb" element={<KnowledgeBase />} />
        <Route path="/tickets/create" element={<CreateIncident />} />
        <Route path="/tickets/:id" element={<IncidentDetail />} />
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
        <Route path="/finance" element={
          <PermissionGate permission="finance.view">
            <FinanceDashboard />
          </PermissionGate>
        } />
        <Route path="/finance/pos" element={
          <PermissionGate permission="finance.pos.view">
            <POManagement />
          </PermissionGate>
        } />
        <Route path="/finance/pos/:id" element={
          <PermissionGate permission="finance.pos.view">
            <PODetails />
          </PermissionGate>
        } />
        <Route path="/finance/challans" element={
          <PermissionGate permission="finance.challans.view">
            <ChallanManagement />
          </PermissionGate>
        } />
        <Route path="/finance/challans/:id" element={
          <PermissionGate permission="finance.challans.view">
            <ChallanDetails />
          </PermissionGate>
        } />
        <Route path="/finance/payments" element={
          <PermissionGate permission="finance.payments.view">
            <PaymentManagement />
          </PermissionGate>
        } />
        <Route path="/projects" element={
          <PermissionGate permission="ticket.projects.view">
            <ProjectDashboard />
          </PermissionGate>
        } />
        <Route path="/projects/expenses" element={
          <PermissionGate permission="finance.expenses.view">
            <ExpenseManagement />
          </PermissionGate>
        } />
        <Route path="/finance/projects/:id" element={
          <PermissionGate permission="finance.projects.view">
            <ProjectFinanceDetails />
          </PermissionGate>
        } />
        <Route path="/loaders-showcase" element={<LoadersShowcase />} />
        <Route path="/account" element={<CompanyProfile />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/roles" element={
          <PermissionGate permission="role.view">
            <RolesList />
          </PermissionGate>
        } />
        <Route path="/users" element={
          <PermissionGate permission="user.view">
            <CompanyUsersList />
          </PermissionGate>
        } />
        <Route path="/employees" element={
          <PermissionGate permission="employee.view">
            <EmployeeDirectory />
          </PermissionGate>
        } />
        <Route path="/departments" element={
          <PermissionGate permission="department.view">
            <DepartmentDirectory />
          </PermissionGate>
        } />
        <Route path="/designations" element={
          <PermissionGate permission="designation.view">
            <DesignationDirectory />
          </PermissionGate>
        } />
        <Route path="*" element={<DefaultView />} />
      </Routes>
    </DashboardLayout>
  );
}
