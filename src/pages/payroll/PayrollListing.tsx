import { useState } from 'react';
import { Search, Plus, Filter, Eye, Edit } from 'lucide-react';
import PayrollDrawer from '../../components/payroll/PayrollDrawer';
import PayrollProfileView from '../../components/payroll/PayrollProfileView';
import type { PayrollFormValues } from '../../components/payroll/PayrollDrawer/validators/payrollValidation';

export default function PayrollListing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  
  // Dummy data
  const payrolls = [
    { id: '1', employee: 'John Doe', empId: 'EMP001', dept: 'Engineering', period: 'July 2026', gross: '₹1,50,000', net: '₹1,15,000', status: 'Processed', payout: 'Paid' },
    { id: '2', employee: 'Jane Smith', empId: 'EMP002', dept: 'Marketing', period: 'July 2026', gross: '₹1,20,000', net: '₹95,000', status: 'Processing', payout: 'Pending' },
  ];

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Payroll Records</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and view all employee payroll records</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#792359]/20 focus:border-[#792359] transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-medium shadow-sm shrink-0">
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

      <div className="flex-1 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
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
              {payrolls.map((payroll) => (
                <tr key={payroll.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#f0e4ec] dark:bg-[#792359]/20 text-[#792359] dark:text-[#e6a8d0] flex items-center justify-center font-bold text-xs">
                        {payroll.employee.substring(0, 2).toUpperCase()}
                      </div>
                      {payroll.employee}
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
                        : 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20'
                    }`}>
                      {payroll.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      payroll.payout === 'Paid' 
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
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
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">Showing <span className="font-medium text-gray-900 dark:text-white">1</span> to <span className="font-medium text-gray-900 dark:text-white">{payrolls.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{payrolls.length}</span> results</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-500 dark:text-gray-400 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-500 dark:text-gray-400 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
}
