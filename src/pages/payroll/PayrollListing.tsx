import { useState } from 'react';
import { Search, Plus, Filter, Eye, Edit, ArrowLeft, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PayrollDrawer from '../../components/payroll/PayrollDrawer';
import PayrollProfileView from '../../components/payroll/PayrollProfileView';
import type { PayrollFormValues } from '../../components/payroll/PayrollDrawer/validators/payrollValidation';
import { usePayroll } from '../../hooks/usePayroll';
import CustomSelect from '../../components/ui/CustomSelect';
import CustomMonthPicker from '../../components/ui/CustomMonthPicker';

export default function PayrollListing() {
  const navigate = useNavigate();
  const { payrolls, employees, departments, isLoading, filters, updateFilter, clearFilters } = usePayroll();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const employeeOptions = employees.map(e => ({ value: e.empId, label: e.name, subtitle: e.empId }));
  const departmentOptions = departments.map(d => ({ value: d.name, label: d.name }));
  const statusOptions = ['Draft', 'Processing', 'Processed'].map(s => ({ value: s, label: s }));
  const payoutOptions = ['Unpaid', 'Pending', 'Paid'].map(s => ({ value: s, label: s }));

  const handleSave = async (data: PayrollFormValues) => {
    console.log('Saved payroll data:', data);
    setIsDrawerOpen(false);
  };

  const openDrawer = (mode: 'create' | 'edit' | 'view', payroll?: any) => {
    setDrawerMode(mode);
    setSelectedPayroll(payroll || null);
    setIsDrawerOpen(true);
  };

  if (isDrawerOpen) {
    if (drawerMode === 'view' && selectedPayroll) {
      return (
        <div className="w-full h-full min-h-[calc(100vh-8rem)]">
          <PayrollProfileView 
            payroll={selectedPayroll}
            onClose={() => setIsDrawerOpen(false)}
          />
        </div>
      );
    }
    
    return (
      <div className="w-full h-full min-h-[calc(100vh-8rem)]">
        <PayrollDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSave}
          mode={drawerMode}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4 flex items-center gap-2 shrink-0">
        <button 
          onClick={() => navigate('/companydashboard/payroll')}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#792359] dark:hover:text-[#e6a8d0] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Payroll Dashboard
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Payroll Records</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and view all employee payroll records</p>
        </div>
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-64">
              <CustomSelect
                options={employeeOptions}
                value={filters.searchTerm}
                onChange={(val) => updateFilter('searchTerm', val)}
                icon={<Search size={16} />}
                placeholder="Search employee..."
              />
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-white/10 rounded-sm transition-colors text-sm font-medium shadow-sm shrink-0 ${showFilters ? 'bg-gray-100 dark:bg-white/10 text-[#792359] dark:text-[#e6a8d0]' : 'bg-white dark:bg-[#1f2229] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <button 
                onClick={() => openDrawer('create')}
                className="flex items-center gap-2 px-4 py-2 bg-[#792359] text-white rounded-sm hover:bg-[#5d1944] transition-colors text-sm font-medium shadow-sm shrink-0"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">New Record</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-sm border border-gray-100 dark:border-white/5 animate-in fade-in slide-in-from-top-2">
              <div className="w-full sm:w-48">
                <CustomSelect
                  options={departmentOptions}
                  value={filters.department}
                  onChange={(val) => updateFilter('department', val)}
                  placeholder="Department"
                  emptyText="No departments"
                />
              </div>
              <div className="w-full sm:w-48">
                <CustomMonthPicker
                  value={filters.period}
                  onChange={(val) => updateFilter('period', val)}
                  placeholder="Payroll Period"
                />
              </div>
              <div className="w-full sm:w-40">
                <CustomSelect
                  options={statusOptions}
                  value={filters.status}
                  onChange={(val) => updateFilter('status', val)}
                  placeholder="Status"
                />
              </div>
              <div className="w-full sm:w-40">
                <CustomSelect
                  options={payoutOptions}
                  value={filters.payout}
                  onChange={(val) => updateFilter('payout', val)}
                  placeholder="Payout Status"
                />
              </div>
              <button 
                onClick={clearFilters}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-sm transition-colors flex shrink-0"
                title="Clear Filters"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-x-auto custom-scrollbar relative">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10 sticky top-0 z-10 text-gray-600 dark:text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Payroll Period</th>
                <th className="px-6 py-4 text-right">Gross Salary</th>
                <th className="px-6 py-4 text-right">Net Salary</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Payout</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Loader2 size={24} className="animate-spin text-[#792359] mb-2" />
                      <p>Loading payrolls...</p>
                    </div>
                  </td>
                </tr>
              ) : payrolls.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <p>No payroll records found.</p>
                      <button onClick={clearFilters} className="text-[#792359] hover:underline mt-1">Clear filters</button>
                    </div>
                  </td>
                </tr>
              ) : (
                payrolls.map((payroll) => (
                  <tr key={payroll.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f0e4ec] dark:bg-[#792359]/20 text-[#792359] dark:text-[#e6a8d0] flex items-center justify-center font-bold text-xs shrink-0">
                          {payroll.employee.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="truncate">{payroll.employee}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{payroll.empId}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{payroll.dept}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-300 font-medium">{payroll.period}</td>
                    <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400">{payroll.gross}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">{payroll.net}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        payroll.status === 'Processed' 
                          ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                          : payroll.status === 'Processing'
                          ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20'
                          : 'bg-gray-50 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-500/20'
                      }`}>
                        {payroll.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        payroll.payout === 'Paid' 
                          ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                          : payroll.payout === 'Pending'
                          ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'
                          : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-white/10'
                      }`}>
                        {payroll.payout}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openDrawer('view', payroll)} className="p-1.5 text-gray-400 hover:text-[#792359] dark:hover:text-[#e6a8d0] hover:bg-[#792359]/10 rounded-sm transition-colors" title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openDrawer('edit', payroll)} className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-sm transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">Showing <span className="font-medium text-gray-900 dark:text-white">{payrolls.length > 0 ? 1 : 0}</span> to <span className="font-medium text-gray-900 dark:text-white">{payrolls.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{payrolls.length}</span> results</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-500 dark:text-gray-400 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-500 dark:text-gray-400 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>

    </div>
  );
}
