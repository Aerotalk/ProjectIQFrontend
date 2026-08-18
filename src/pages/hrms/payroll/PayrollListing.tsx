import { useState, useEffect } from 'react';
import { Search, ChevronRight, Briefcase, User, Send, Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { usePayroll } from '../../../hooks/usePayroll';
import Tabs from '../../../components/Tabs';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { payrollValidationSchema, type PayrollFormValues } from '../../../components/payroll/PayrollDrawer/validators/payrollValidation';
import { api } from '../../../lib/api';

// Tab Sections
import SalaryInputsTab from '../../../components/payroll/PayrollDrawer/sections/SalaryInputsTab';
import ITDeclarationTab from '../../../components/payroll/PayrollDrawer/sections/ITDeclarationTab';
import FBPDeclarationTab from '../../../components/payroll/PayrollDrawer/sections/FBPDeclarationTab';
import EmployeeLOPTab from '../../../components/payroll/PayrollDrawer/sections/EmployeeLOPTab';
import ReimbursementClaimTab from '../../../components/payroll/PayrollDrawer/sections/ReimbursementClaimTab';
import SalaryHoldTab from '../../../components/payroll/PayrollDrawer/sections/SalaryHoldTab';
import StopSalaryProcessingTab from '../../../components/payroll/PayrollDrawer/sections/StopSalaryProcessingTab';
import FinalSettlementTab from '../../../components/payroll/PayrollDrawer/sections/FinalSettlementTab';
import FixedSalaryTab from '../../../components/payroll/PayrollDrawer/sections/FixedSalaryTab';

const TABS = [
  { id: 'fixed_salary', label: 'Fixed Salary' },
  { id: 'salary_inputs', label: 'Salary Inputs' },
  { id: 'employee_lop', label: 'LOP & Attendance' },
  { id: 'it_declarations', label: 'IT Declarations' },
  { id: 'fbp_declarations', label: 'FBP Declarations' },
  { id: 'reimbursement', label: 'Reimbursements' },
  { id: 'actions', label: 'Advanced Actions' },
];

// Tabs that manage their own state/API — no global save bar needed
const SELF_MANAGED_TABS = new Set(['fixed_salary', 'salary_inputs', 'employee_lop', 'it_declarations', 'reimbursement']);

export default function PayrollListing() {
  const { employees, allPayrolls, isLoading, refreshData } = usePayroll();
  const location = useLocation();
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(() => new URLSearchParams(location.search).get('tab') || 'fixed_salary');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // FBP state: tracks whether the employee already has a saved declaration
  const [existingFbpId, setExistingFbpId] = useState<string | null>(null);

  const filteredEmployees = employees.filter(e =>
    (e.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.empId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEmployee = employees.find(e => e.id === selectedEmpId || e.empId === selectedEmpId);
  const employeeData = selectedEmployee;
  const employeePayroll = allPayrolls.find(p => p.empId === employeeData?.empId);

  const methods = useForm<PayrollFormValues>({
    resolver: zodResolver(payrollValidationSchema),
    defaultValues: {
      salaryInputs: { employee: employeeData?.empId },
      salaryHold: { employee: employeeData?.empId },
      stopSalary: { employee: employeeData?.empId },
      finalSettlement: { employee: employeeData?.empId },
    }
  });

  // Reset form fields when employee changes
  useEffect(() => {
    if (employeeData) {
      methods.reset({
        salaryInputs: { employee: employeeData.empId, inputType: 'Addition' },
        fbpDeclarations: { financialYear: '', items: [] },
      });
      setExistingFbpId(null);
    }
  }, [employeeData?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-populate FBP form from existing backend record when the tab becomes active
  useEffect(() => {
    if (activeTab === 'actions' && employeeData?.empId) {
      methods.setValue('salaryHold.employee', employeeData.empId);
      methods.setValue('stopSalary.employee', employeeData.empId);
      methods.setValue('finalSettlement.employee', employeeData.empId);
    }
    
    if (activeTab !== 'fbp_declarations' || !employeeData?.id) return;
    let cancelled = false;
    const load = async () => {
      try {
        const raw = await api.get(`/hrms/payroll/fbp-declarations?employeeId=${employeeData.id}`);
        const list: any[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
        if (!cancelled && list.length > 0) {
          // Use the most recently updated record
          const decl = list.sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime())[0];
          setExistingFbpId(decl.id);
          const itemsRaw = await api.get(`/hrms/payroll/fbp-declarations/${decl.id}/items`);
          const items: any[] = Array.isArray(itemsRaw) ? itemsRaw : (itemsRaw?.data ?? []);
          if (!cancelled) {
            methods.setValue('fbpDeclarations', {
              financialYear: decl.financialYear ?? '',
              items: items.map((i: any) => ({
                reimbursementType: i.reimbursementType ?? '',
                annualAmount: String(i.annualAmount ?? ''),
              })),
            });
          }
        } else if (!cancelled) {
          setExistingFbpId(null);
          methods.setValue('fbpDeclarations', { financialYear: '', items: [] });
        }
      } catch {
        // silently ignore — user can still enter data manually
      }
    };
    load();
    return () => { cancelled = true; };
  }, [activeTab, employeeData?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const parseCurrency = (val: string | undefined): number => {
    if (!val) return 0;
    return Number(val.replace(/[^0-9.-]+/g, ''));
  };

  const onSubmit = async (data: PayrollFormValues) => {
    setIsSubmitting(true);
    try {
      const toast = (await import('react-hot-toast')).default;

      if (activeTab === 'salary_inputs' && data.salaryInputs) {
        const payload = {
          ...data.salaryInputs,
          employee: { id: data.salaryInputs.employee },
          amount: parseCurrency(data.salaryInputs.amount)
        };
        await api.post('/hrms/payroll/salary-inputs', payload);
        toast.success('Salary inputs saved successfully.');
      } else if (activeTab === 'actions') {
        if (data.salaryHold?.holdAmount) {
          await api.post('/hrms/payroll/salary-holds', {
            ...data.salaryHold,
            employee: { id: data.salaryHold.employee },
            holdAmount: parseCurrency(data.salaryHold.holdAmount)
          });
          toast.success('Salary hold saved successfully.');
        }
        if (data.stopSalary?.stopFromDate) {
          await api.post('/hrms/payroll/salary-stops', {
            ...data.stopSalary,
            employee: { id: data.stopSalary.employee }
          });
          toast.success('Stop salary saved successfully.');
        }
        if (data.finalSettlement?.settlementDate) {
          await api.post('/hrms/payroll/final-settlements', {
            ...data.finalSettlement,
            employee: { id: data.finalSettlement.employee },
            items: data.finalSettlement.items?.map(i => ({ ...i, amount: parseCurrency(i.amount) })) || []
          });
          toast.success('Final settlement saved successfully.');
        }
      } else if (activeTab === 'fbp_declarations' && data.fbpDeclarations) {
        const { financialYear, items } = data.fbpDeclarations;
        if (financialYear && employeeData?.id) {
          let declId = existingFbpId;
          const isUpdate = !!existingFbpId;

          if (isUpdate) {
            // Update existing declaration header
            await api.put(`/hrms/payroll/fbp-declarations/${existingFbpId}`, {
              employee: { id: employeeData.id },
              financialYear,
            });
            // Delete all current items so we can replace them cleanly
            const existingItemsRaw = await api.get(`/hrms/payroll/fbp-declarations/${existingFbpId}/items`);
            const existingItems: any[] = Array.isArray(existingItemsRaw) ? existingItemsRaw : (existingItemsRaw?.data ?? []);
            for (const ei of existingItems) {
              await api.delete(`/hrms/payroll/fbp-declarations/${existingFbpId}/items/${ei.id}`);
            }
          } else {
            // Create new declaration header
            const created = await api.post('/hrms/payroll/fbp-declarations', {
              employee: { id: employeeData.id },
              financialYear,
            });
            declId = created?.data?.id ?? created?.id ?? null;
            if (declId) setExistingFbpId(declId);
          }

          // Save (new) items
          if (declId && items && items.length > 0) {
            const validItems = items.filter((i: any) => i.reimbursementType && i.annualAmount);
            for (const item of validItems) {
              await api.post(`/hrms/payroll/fbp-declarations/${declId}/items`, {
                reimbursementType: item.reimbursementType,
                annualAmount: parseCurrency(item.annualAmount),
              });
            }
          }
          toast.success(isUpdate ? 'FBP Declarations updated successfully.' : 'FBP Declarations saved successfully.');
        }
      }

      await refreshData();
    } catch (err: any) {
      const toast = (await import('react-hot-toast')).default;
      toast.error(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPayslip = async () => {
    if (!employeePayroll || (!employeePayroll.id && !(employeePayroll as any).detailId)) {
      const toast = (await import('react-hot-toast')).default;
      toast.error("Cannot download payslip: Latest payroll detail not found.");
      return;
    }
    
    const detailId = employeePayroll.id || (employeePayroll as any).detailId;
    
    try {
      const toast = (await import('react-hot-toast')).default;
      toast.loading("Generating Payslip...", { id: 'payslip' });
      
      const blob = await api.get(`/hrms/payroll/runs/details/${detailId}/payslip`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(blob as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip_${employeePayroll.period || 'latest'}_${employeeData?.empId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Payslip downloaded successfully!", { id: 'payslip' });
    } catch (err) {
      console.error(err);
      const toast = (await import('react-hot-toast')).default;
      toast.error("Failed to download payslip.", { id: 'payslip' });
    }
  };

  const isSelfManaged = SELF_MANAGED_TABS.has(activeTab);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex h-full bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-lg shadow-sm overflow-hidden">

        {/* Left Pane (Master) */}
        <div className="w-80 border-r border-gray-200 dark:border-white/10 flex flex-col shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#1f2229]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Employee Directory</h2>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading directory...</div>
            ) : filteredEmployees.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No employees found.</div>
            ) : (
              filteredEmployees.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmpId(emp.id)}
                  className={`w-full text-left p-3 rounded-md transition-all flex items-center gap-3 group ${selectedEmpId === emp.id
                      ? 'bg-primary/10 border border-primary/20 shadow-sm'
                      : 'hover:bg-white dark:hover:bg-white/5 border border-transparent hover:shadow-sm'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${selectedEmpId === emp.id
                      ? 'bg-primary text-white shadow-md ring-2 ring-primary/20'
                      : 'bg-[#f0e4ec] dark:bg-primary/20 text-primary dark:text-secondary group-hover:bg-primary/20'
                    }`}>
                    {emp.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-sm font-semibold truncate transition-colors ${selectedEmpId === emp.id ? 'text-primary dark:text-secondary' : 'text-gray-900 dark:text-white'}`}>
                      {emp.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{emp.empId}</p>
                  </div>
                  <ChevronRight size={16} className={`shrink-0 transition-all ${selectedEmpId === emp.id ? 'text-primary dark:text-secondary translate-x-1' : 'text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Pane (Detail) */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#181a1f] relative">
          {!employeeData ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center animate-in fade-in duration-500">
              <div className="w-24 h-24 mb-6 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center shadow-inner">
                <User size={48} className="text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select an Employee</h3>
              <p className="max-w-md text-gray-500 dark:text-gray-400 text-sm">Choose an employee from the directory to view and manage their payroll details, tax declarations, and salary inputs.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Employee Header Card */}
              <div className="shrink-0 p-6 border-b border-gray-200 dark:border-white/10 relative overflow-hidden bg-gradient-to-r from-gray-50/80 to-white dark:from-[#181a1f] dark:to-[#1a1c23]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -z-0 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary/20 via-transparent to-transparent"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-[#8b2566] text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-lg ring-4 ring-white dark:ring-[#181a1f]">
                      {employeeData.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{employeeData.name}</h2>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1.5 font-medium bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md"><Briefcase size={14} className="text-gray-400" /> {employeeData.empId}</span>
                        {employeePayroll && (
                          <>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${employeePayroll.status === 'Processed'
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                                : 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20'
                              }`}>
                              {employeePayroll.status}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleDownloadPayslip}
                      disabled={!employeePayroll}
                      title={!employeePayroll ? "No payroll processed for this employee yet" : "Download Latest Payslip"}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors shadow-sm font-medium text-sm ${!employeePayroll ? 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'bg-white dark:bg-[#1f2229] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      <Download size={16} />
                      <span className="hidden sm:inline">Download Latest Payslip</span>
                    </button>
                  </div>
                </div>

                {employeePayroll && (
                    <div className="flex gap-6 bg-white dark:bg-[#121317] px-6 py-3 mt-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Gross Pay</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{employeePayroll.gross}</p>
                      </div>
                      <div className="w-px bg-gray-100 dark:bg-white/10"></div>
                      <div>
                        <p className="text-[10px] font-bold text-primary dark:text-secondary uppercase tracking-wider mb-1">Net Payable</p>
                        <p className="text-xl font-bold text-primary dark:text-secondary">{employeePayroll.net}</p>
                      </div>
                    </div>
                  )}
                </div>

              {/* Tabs Nav */}
              <div className="shrink-0 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#181a1f] sticky top-0 z-20">
                <div className="px-2">
                  <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
                </div>
              </div>

              {/* Tab Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50/50 dark:bg-[#121317]/50 relative">
                {isSelfManaged ? (
                  <div className="bg-white dark:bg-[#181a1f] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm animate-in fade-in duration-200">
                    {activeTab === 'fixed_salary' && (
                      <FixedSalaryTab
                        key={`fixed-${employeeData.id}`}
                        employeeDbId={employeeData.id}
                      />
                    )}
                    {activeTab === 'salary_inputs' && (
                      <SalaryInputsTab
                        key={`salary-${employeeData.id}`}
                        employeeDbId={employeeData.id}
                      />
                    )}
                    {activeTab === 'employee_lop' && (
                      <EmployeeLOPTab
                        key={`lop-${employeeData.id}`}
                        employeeDbId={employeeData.id}
                      />
                    )}
                    {activeTab === 'it_declarations' && (
                      <ITDeclarationTab
                        key={`it-${employeeData.id}`}
                        employeeDbId={employeeData.id}
                      />
                    )}

                    {activeTab === 'reimbursement' && (
                      <ReimbursementClaimTab
                        key={`reimb-${employeeData.id}`}
                        employeeDbId={employeeData.id}
                      />
                    )}
                  </div>
                ) : (
                  /* Form-managed tabs with global Save bar */
                  <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full space-y-6 pb-20">
                      <div className="bg-white dark:bg-[#181a1f] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
                        {activeTab === 'fbp_declarations' && (
                          <FBPDeclarationTab
                            readOnly={false}
                            employeeDbId={employeeData.id}
                          />
                        )}
                        {activeTab === 'actions' && (
                          <div className="space-y-8">
                            <SalaryHoldTab readOnly={false} />
                            <div className="h-px bg-gray-200 dark:bg-white/10"></div>
                            <StopSalaryProcessingTab readOnly={false} />
                            <div className="h-px bg-gray-200 dark:bg-white/10"></div>
                            <FinalSettlementTab readOnly={false} />
                          </div>
                        )}
                      </div>

                      {/* Fixed Bottom Save Bar */}
                      <div className="fixed bottom-6 right-8 left-[22rem] z-30 flex justify-end">
                        <div className="bg-white/90 dark:bg-[#1f2229]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => methods.reset()}
                            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors font-medium text-sm"
                          >
                            Reset
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-[#5d1944] transition-all font-medium text-sm shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 active:scale-95"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Send size={16} />
                                Save Changes
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </FormProvider>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
