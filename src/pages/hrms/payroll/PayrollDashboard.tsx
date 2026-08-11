import { useState, useMemo } from 'react';
import { 
 Users, DollarSign, Clock, FileText, CheckCircle, AlertTriangle, 
 Search, Plus, FileInput, Upload, Settings, Calculator, RefreshCw, FileImage, Loader2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePayroll } from '../../../hooks/usePayroll';
import PayrollDrawer from '../../../components/payroll/PayrollDrawer';

export default function PayrollDashboard() {
 const navigate = useNavigate();
 const location = useLocation();
 const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
 const [searchTerm, setSearchTerm] = useState('');
 
 const { payrollRuns, allPayrolls, isLoading } = usePayroll();

 const currentPeriod = useMemo(() => {
   if (!payrollRuns || payrollRuns.length === 0) return 'No Active Runs';
   return payrollRuns[0]?.payrollPeriod || 'Unknown';
 }, [payrollRuns]);

 const employeesProcessed = useMemo(() => {
   return allPayrolls.length;
 }, [allPayrolls]);

 const pendingPayroll = useMemo(() => {
   return allPayrolls.filter(p => p.status === 'Draft' || p.status === 'Processing').length;
 }, [allPayrolls]);

 const totalPayrollAmount = useMemo(() => {
   let sum = 0;
   allPayrolls.forEach(p => {
     if (p.gross) {
       const num = parseFloat(p.gross.replace(/[^0-9.-]+/g,""));
       if (!isNaN(num)) sum += num;
     }
   });
   return `₹${sum.toLocaleString('en-IN')}`;
 }, [allPayrolls]);

 const stats = [
 { title: 'Current Payroll Period', value: isLoading ? '...' : currentPeriod, icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10' },
 { title: 'Employees Processed', value: isLoading ? '...' : employeesProcessed.toString(), icon: Users, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-500/10' },
 { title: 'Pending Payroll', value: isLoading ? '...' : pendingPayroll.toString(), icon: AlertTriangle, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-500/10' },
 { title: 'Total Payroll Amount', value: isLoading ? '...' : totalPayrollAmount, icon: DollarSign, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-500/10' },
 { title: 'Held Salaries', value: '₹0', icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-500/10' },
 { title: 'Final Settlements', value: '0 Pending', icon: FileText, color: 'text-primary', bgColor: 'bg-primary/10' },
 ];

 const filteredRuns = payrollRuns?.filter((r: any) => 
   (r.payrollPeriod || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
   (r.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
   (r.runType || '').toLowerCase().includes(searchTerm.toLowerCase())
 ) || [];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerStep, setDrawerStep] = useState(0);

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'Salary Inputs':
        navigate(`${basePath}/hrms/payroll/list?tab=salary_inputs`);
        break;
      case 'IT Declaration':
        navigate(`${basePath}/hrms/payroll/list?tab=it_declarations`);
        break;
      case 'Reimbursement':
        navigate(`${basePath}/hrms/payroll/list?tab=reimbursement`);
        break;
      case 'Final Settlement':
        navigate(`${basePath}/hrms/payroll/list?tab=actions`);
        break;
      case 'Process Payroll':
        setDrawerStep(5); // processing
        setIsDrawerOpen(true);
        break;
      case 'Pay Components':
      case 'Payslip Templates':
      case 'Configuration':
        setDrawerStep(11); // configuration
        setIsDrawerOpen(true);
        break;
      default:
        navigate(`${basePath}/hrms/payroll/list`);
    }
  };

  const quickActions = [
    { label: 'Salary Inputs', icon: FileInput, color: 'text-blue-500' },
    { label: 'IT Declaration', icon: FileText, color: 'text-purple-500' },
    { label: 'Reimbursement', icon: Upload, color: 'text-green-500' },
    { label: 'Process Payroll', icon: RefreshCw, color: 'text-orange-500' },
    { label: 'Final Settlement', icon: CheckCircle, color: 'text-red-500' },
    { label: 'Pay Components', icon: Calculator, color: 'text-gray-500' },
    { label: 'Payslip Templates', icon: FileImage, color: 'text-indigo-500' },
    { label: 'Configuration', icon: Settings, color: 'text-teal-500' }
  ];

  return (
  <div className="flex flex-col gap-6">
    <PayrollDrawer 
      isOpen={isDrawerOpen} 
      onClose={() => setIsDrawerOpen(false)} 
      onSave={async () => { setIsDrawerOpen(false); }} 
      mode="create" 
      initialStep={drawerStep} 
    />
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  <div>
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll Dashboard</h1>
  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage employee salaries, claims, and settlements</p>
  </div>
  
  <div className="flex flex-wrap items-center gap-2">
  <button 
  onClick={() => navigate(`${basePath}/hrms/payroll/list`)}
  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-medium shadow-sm"
  >
  <Users size={16} />
  View All Payrolls
  </button>
  <button onClick={() => { setDrawerStep(5); setIsDrawerOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-[#5d1944] transition-colors text-sm font-medium shadow-sm">
  <Plus size={16} />
  New Payroll Run
  </button>
  </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {stats.map((stat, i) => (
  <div key={i} className="bg-white dark:bg-[#181a1f] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group flex items-center gap-4 cursor-default">
  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor} ${stat.color} group-hover:scale-105 transition-transform`}>
  <stat.icon size={24} />
  </div>
  <div>
  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1 group-hover:text-primary dark:group-hover:text-secondary transition-colors">{stat.value}</h3>
  </div>
  </div>
  ))}
  </div>

  <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
  </div>
  <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {quickActions.map((action, i) => (
  <button key={i} onClick={() => handleQuickAction(action.label)} className="flex flex-col items-center justify-center gap-3 p-4 rounded-md border border-gray-200 dark:border-gray-800 hover:border-primary/30 hover:bg-primary/5 transition-all group">
  <div className={`w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-[#1f2229] shadow-sm ${action.color}`}>
  <action.icon size={20} />
  </div>
  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-secondary">{action.label}</span>
  </button>
  ))}
  </div>
  </div>

 <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
 <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-transparent">
 <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payroll Runs</h2>
 
 <div className="flex items-center gap-3">
 <div className="relative group">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary" size={16} />
 <input
 type="text"
 placeholder="Search runs..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="pl-9 pr-4 py-2 w-64 text-sm bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-primary transition-all"
 />
 </div>
 </div>
 </div>

 <div className="overflow-x-auto custom-scrollbar">
 <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 border-collapse">
 <thead className="bg-gray-50/80 dark:bg-[#1f2229] border-b border-gray-200 dark:border-gray-800">
 <tr>
 <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payroll Period</th>
 <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Run Type</th>
 <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
 <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100 dark:divide-white/5">
 {isLoading ? (
 <tr>
 <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
 <div className="flex flex-col items-center justify-center gap-2">
 <Loader2 size={24} className="animate-spin text-primary" />
 <span>Loading payroll runs...</span>
 </div>
 </td>
 </tr>
 ) : filteredRuns.length === 0 ? (
 <tr>
 <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No payroll runs found.</td>
 </tr>
 ) : filteredRuns.map((run: any) => {
   const isProcessed = run.status === 'Processed';
   return (
     <tr key={run.id || run.payrollPeriod} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
       <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{run.payrollPeriod || 'Unknown'}</td>
       <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{run.runType || 'Regular'}</td>
       <td className="px-6 py-4">
         <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border uppercase tracking-wider ${
           isProcessed 
             ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400'
             : 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400'
         }`}>
           {run.status || 'Processing'}
         </span>
       </td>
       <td className="px-6 py-4 text-right ">
         <button onClick={() => navigate(`${basePath}/hrms/payroll/list`)} className="text-primary dark:text-secondary hover:underline font-medium text-xs bg-primary/5 px-3 py-1.5 rounded-md">View Details</button>
       </td>
     </tr>
   );
 })}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
