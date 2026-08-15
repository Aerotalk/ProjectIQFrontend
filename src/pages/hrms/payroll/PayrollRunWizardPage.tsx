import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayroll } from '../../../hooks/usePayroll';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { payrollValidationSchema, type PayrollFormValues } from '../../../components/payroll/PayrollDrawer/validators/payrollValidation';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Loader2, PlayCircle } from 'lucide-react';

// Steps components
import PayrollProcessingTab from '../../../components/payroll/PayrollDrawer/sections/PayrollProcessingTab';
import PayrollVerificationTab from '../../../components/payroll/PayrollDrawer/sections/PayrollVerificationTab';
import PayoutTab from '../../../components/payroll/PayrollDrawer/sections/PayoutTab';

const STEPS = [
  { id: 'setup',         label: 'Batch Setup & Eligibility' },
  { id: 'verification',  label: 'Verification & Variances' },
  { id: 'payout',        label: 'Approve & Payout' },
];

export default function PayrollRunWizardPage() {
  const navigate = useNavigate();
  const { employees } = usePayroll();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  
  // Eligibility State
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [missingDataEmployees, setMissingDataEmployees] = useState<any[]>([]);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);

  const form = useForm<PayrollFormValues>({
    resolver: zodResolver(payrollValidationSchema),
    defaultValues: {
      payrollProcessing: {
        runType: 'Regular',
        employeeScope: 'All Employees'
      }
    }
  });

  const payrollPeriod = form.watch('payrollProcessing.payrollPeriod');

  // Edge Case: Check if employees have their payroll configurations before allowing run
  useEffect(() => {
    if (payrollPeriod && currentStep === 0) {
      checkEligibility();
    }
  }, [payrollPeriod, currentStep]);

  const checkEligibility = async () => {
    if (!employees || employees.length === 0) return;
    setIsCheckingEligibility(true);
    setEligibilityChecked(false);
    
    try {
      // Fetch eligibility checklist from backend (checks Salary, Bank, and Statutory configurations)
      const eligibilityRes = await api.get('/hrms/payroll/eligibility-check').catch(() => []);
      const missing = Array.isArray(eligibilityRes) ? eligibilityRes : (eligibilityRes.data || []);
      
      setMissingDataEmployees(missing);
      setEligibilityChecked(true);
      
    } catch (err) {
      console.error('Failed to check eligibility', err);
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(curr => curr + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
    else navigate('/companydashboard/hrms/payroll');
  };

  const handleRunEngine = async () => {
    const values = form.getValues();
    if (!values.payrollProcessing?.payrollPeriod) {
      toast.error('Please select a payroll period first.');
      return;
    }
    
    // Warn if missing data, but allow proceeding
    if (missingDataEmployees.length > 0) {
      toast.error('Some employees are missing setup steps and will be skipped.');
    }
    
    setIsProcessing(true);
    try {
      // 1. Create Run
      const runPayload = {
        payrollPeriod: values.payrollProcessing.payrollPeriod,
        runType: values.payrollProcessing.runType || 'Regular',
        employeeScope: 'All Employees'
      };
      const runRes = await api.post('/hrms/payroll/runs', runPayload);
      const newRunId = runRes.data?.id || runRes.id;
      setRunId(newRunId);
      
      // 2. Process Run
      if (newRunId) {
        await api.post(`/hrms/payroll/runs/${newRunId}/process`, {});
      }
      
      toast.success('Payroll Engine executed successfully!');
      handleNext(); // Move to Verification step
    } catch (err: any) {
      toast.error(err.message || 'Error processing payroll.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = async (_data: PayrollFormValues) => {
    try {
      if (runId) {
        await api.put(`/hrms/payroll/runs/${runId}/approve`, {});
      }
      toast.success('Payroll batch locked successfully!');
      navigate('/companydashboard/hrms/payroll');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while saving.');
    }
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'setup':        
        return (
          <div className="space-y-8">
            <PayrollProcessingTab readOnly={false} />
            
            {/* Eligibility Pre-Check Section */}
            {payrollPeriod && (
              <div className="bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Eligibility Pre-Check</h3>
                
                {isCheckingEligibility ? (
                  <div className="flex items-center gap-3 text-gray-500">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Scanning employee records...</span>
                  </div>
                ) : eligibilityChecked ? (
                  missingDataEmployees.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-lg text-red-800 dark:text-red-400">
                        <AlertTriangle size={24} className="shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-base mb-1">Payroll Run Warning</h4>
                          <p className="text-sm">
                            {missingDataEmployees.length} employee(s) are missing mandatory setup steps (Salary Configuration, Bank Details, or Statutory info). 
                            They will be skipped in this run. You can configure their details in the Employee Directory later.
                          </p>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400">
                            <tr>
                              <th className="px-4 py-3 font-medium">Employee Name</th>
                              <th className="px-4 py-3 font-medium">Employee ID</th>
                              <th className="px-4 py-3 font-medium">Issue</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {missingDataEmployees.slice(0, 5).map(emp => (
                              <tr key={emp.id} className="bg-white dark:bg-[#181a1f]">
                                <td className="px-4 py-3 text-gray-900 dark:text-white">{emp.name}</td>
                                <td className="px-4 py-3 text-gray-500">{emp.empId}</td>
                                <td className="px-4 py-3 text-red-600 dark:text-red-400">
                                  {emp.missingSteps?.join(', ')}
                                </td>
                              </tr>
                            ))}
                            {missingDataEmployees.length > 5 && (
                              <tr className="bg-gray-50 dark:bg-white/5">
                                <td colSpan={3} className="px-4 py-3 text-center text-gray-500 text-xs font-medium">
                                  + {missingDataEmployees.length - 5} more employees
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-4 rounded-lg text-green-800 dark:text-green-400">
                      <CheckCircle2 size={24} className="shrink-0" />
                      <div>
                        <h4 className="font-semibold text-base mb-1">All Clear!</h4>
                        <p className="text-sm">All active employees have valid salary configurations and are eligible for this payroll run.</p>
                      </div>
                    </div>
                  )
                ) : null}
              </div>
            )}
          </div>
        );
      case 'verification': return <PayrollVerificationTab readOnly={false} runId={runId} />;
      case 'payout':       return <PayoutTab readOnly={false} runId={runId} />;
      default:             return null;
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Global Payroll Run</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Process monthly salary for all eligible employees securely.</p>
        </div>
      </div>

      {/* Stepper Nav */}
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 px-8 py-4 shrink-0">
        <div className="flex items-center justify-between w-full relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-800 z-0"></div>
          {STEPS.map((step, idx) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-white dark:bg-[#181a1f] px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                currentStep === idx 
                  ? 'border-primary bg-primary text-white shadow-md' 
                  : currentStep > idx 
                    ? 'border-green-500 bg-green-500 text-white' 
                    : 'border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-[#1f2229]'
              }`}>
                {currentStep > idx ? <CheckCircle2 size={20} /> : idx + 1}
              </div>
              <span className={`text-xs font-semibold ${currentStep === idx ? 'text-primary dark:text-secondary' : currentStep > idx ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gray-50/30 dark:bg-[#121212]/50">
        <div className="w-full">
          <FormProvider {...form}>
            <form id="wizard-form" onSubmit={form.handleSubmit(onSubmit)}>
              <div key={currentStep} className="animate-in fade-in slide-in-from-right-4 duration-300">
                {renderStep()}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-5 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#181a1f] flex items-center justify-between shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={handlePrev}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> {currentStep === 0 ? 'Back to Dashboard' : 'Previous Step'}
        </button>

        <div className="flex items-center gap-3">
          {currentStep === 0 ? (
              <button
                type="button"
                onClick={handleRunEngine}
                disabled={isProcessing || !payrollPeriod}
                className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95"
              >
                {isProcessing ? <><Loader2 size={18} className="animate-spin" /> Processing Data...</> : <><PlayCircle size={18} /> Run Payroll Engine</>}
              </button>
          ) : currentStep === STEPS.length - 1 ? (
            <button
              type="submit"
              form="wizard-form"
              className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-[#5d1944] text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95"
            >
              Approve & Lock Batch <CheckCircle2 size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-[#5d1944] text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95"
            >
              Next Step <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
