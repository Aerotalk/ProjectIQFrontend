import { useState, useRef, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import { usePayrollForm } from './hooks/usePayrollForm';
import type { PayrollFormValues } from './validators/payrollValidation';

// Tabs
import SalaryInputsTab from './sections/SalaryInputsTab';
import EmployeeLOPTab from './sections/EmployeeLOPTab';
import ITDeclarationTab from './sections/ITDeclarationTab';
import ReimbursementClaimTab from './sections/ReimbursementClaimTab';
import FBPDeclarationTab from './sections/FBPDeclarationTab';
import PayrollProcessingTab from './sections/PayrollProcessingTab';
import PayrollVerificationTab from './sections/PayrollVerificationTab';
import SalaryHoldTab from './sections/SalaryHoldTab';
import StopSalaryProcessingTab from './sections/StopSalaryProcessingTab';
import PayoutTab from './sections/PayoutTab';
import FinalSettlementTab from './sections/FinalSettlementTab';
import PayrollConfigurationTab from './sections/PayrollConfigurationTab';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PayrollFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<PayrollFormValues>;
  isSubmitting?: boolean;
}

const STEPS = [
  { id: 'salary_inputs',      label: 'Salary Inputs' },
  { id: 'employee_lop',       label: 'Employee LOP' },
  { id: 'it_declaration',     label: 'IT Declaration' },
  { id: 'reimbursement',      label: 'Reimbursement' },
  { id: 'fbp_declaration',    label: 'FBP Declaration' },
  { id: 'processing',         label: 'Processing' },
  { id: 'verification',       label: 'Verification' },
  { id: 'salary_hold',        label: 'Salary Hold' },
  { id: 'stop_salary',        label: 'Stop Salary' },
  { id: 'payout',             label: 'Payout' },
  { id: 'final_settlement',   label: 'Final Settlement' },
  { id: 'configuration',      label: 'Configuration' },
];

export default function PayrollDrawer({ isOpen, onClose, onSave, mode, initialData, isSubmitting }: Props) {
  const form = usePayrollForm(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const stepperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        form.reset(initialData);
      } else {
        form.reset();
      }
      setCurrentStep(0);
    }
  }, [isOpen, initialData, mode]);

  useEffect(() => {
    if (stepperRef.current) {
      const activeNode = stepperRef.current.querySelector('[data-active="true"]');
      if (activeNode) {
        activeNode.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentStep]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const onSubmit = async (data: PayrollFormValues) => {
    try {
      await onSave(data);
    } catch (err: any) {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error(err.message || 'An error occurred while saving.');
      });
    }
  };

  const onError = (errors: any) => {
    console.error('Form validation errors:', errors);
    import('react-hot-toast').then(({ default: toast }) => {
      toast.error('Please fix the validation errors before proceeding.');
    });
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'salary_inputs':    return <SalaryInputsTab readOnly={readOnly} />;
      case 'employee_lop':     return <EmployeeLOPTab readOnly={readOnly} />;
      case 'it_declaration':   return <ITDeclarationTab readOnly={readOnly} />;
      case 'reimbursement':    return <ReimbursementClaimTab readOnly={readOnly} />;
      case 'fbp_declaration':  return <FBPDeclarationTab readOnly={readOnly} />;
      case 'processing':       return <PayrollProcessingTab readOnly={readOnly} />;
      case 'verification':     return <PayrollVerificationTab readOnly={readOnly} />;
      case 'salary_hold':      return <SalaryHoldTab readOnly={readOnly} />;
      case 'stop_salary':      return <StopSalaryProcessingTab readOnly={readOnly} />;
      case 'payout':           return <PayoutTab readOnly={readOnly} />;
      case 'final_settlement': return <FinalSettlementTab readOnly={readOnly} />;
      case 'configuration':    return <PayrollConfigurationTab readOnly={readOnly} />;
      default:                 return null;
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02] shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'New Payroll Action' : mode === 'edit' ? 'Edit Payroll Action' : 'View Payroll Action'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Section Selector ────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 shrink-0 px-6 py-3">
        <div className="relative max-w-xs">
          <label className="sr-only">Select Section</label>
          <select
            value={currentStep}
            onChange={(e) => setCurrentStep(Number(e.target.value))}
            className="w-full appearance-none bg-gray-50 dark:bg-[#1f2229] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-sm rounded-md pl-4 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#792359] focus:border-[#792359] transition-all cursor-pointer font-medium shadow-sm hover:border-gray-300 dark:hover:border-gray-700"
          >
            {STEPS.map((step, index) => (
              <option key={step.id} value={index}>
                {index + 1}. {step.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      {/* ── Tab Content ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <FormProvider {...form}>
          <form id="payroll-drawer-form" onSubmit={form.handleSubmit(onSubmit as any, onError)} className="pb-8">
            <div key={currentStep} className="animate-in fade-in slide-in-from-right-4 duration-300">
              {renderStep()}
            </div>
          </form>
        </FormProvider>
      </div>

      {/* ── Footer Navigation ──────────────────────────────────────────── */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
        
        {/* Left side: Cancel */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-sm transition-colors"
          >
            {readOnly ? 'Close' : 'Cancel'}
          </button>
        </div>

        {/* Right side: Save */}
        <div className="flex items-center gap-2">
          {!readOnly ? (
            <button
              type="submit"
              form="payroll-drawer-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-[#792359] hover:bg-[#52173c] disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Action
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-sm transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
