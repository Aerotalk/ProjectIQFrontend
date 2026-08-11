import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AlertCircle, CheckCircle2, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';

const STEPS = [
  { id: 'select_period', label: 'Select Period' },
  { id: 'resolve_exceptions', label: 'Resolve Exceptions' },
  { id: 'finalize', label: 'Finalize & Lock' },
];

export default function AttendanceWizardPage() {
  const navigate = useNavigate();
  const form = useForm();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleNext = () => {
    if (currentStep === 0 && (!fromDate || !toDate)) {
      toast.error('Please select both from and to dates.');
      return;
    }
    if (currentStep < STEPS.length - 1) setCurrentStep(curr => curr + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
    else navigate('/companydashboard/hrms/workforce/processing');
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    // Simulate backend call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    toast.success('Attendance processed successfully!');
    navigate('/companydashboard/hrms/workforce/processing');
  };

  const renderStep = () => {
    switch (STEPS[currentStep]?.id) {
      case 'select_period':
        return (
          <div className="space-y-8 bg-white dark:bg-[#181a1f] p-8 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processing Period</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select the date range to process attendance for.</p>
            </div>
            <div className="grid grid-cols-2 gap-6 max-w-xl">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">From Date *</label>
                <CustomDatePicker value={fromDate} onChange={setFromDate} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">To Date *</label>
                <CustomDatePicker value={toDate} onChange={setToDate} />
              </div>
            </div>
          </div>
        );
      case 'resolve_exceptions':
        return (
          <div className="space-y-8 bg-white dark:bg-[#181a1f] p-8 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
             <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resolve Exceptions</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Decide how to handle missing swipes or incomplete attendance records.</p>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/10 p-5 rounded-lg border border-orange-200 dark:border-orange-800/30 flex items-start gap-4">
              <AlertCircle size={24} className="text-orange-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-base font-semibold text-orange-800 dark:text-orange-400 mb-1">Action Required</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">There are 12 unresolved exceptions in the selected period. You can choose to automatically resolve them as 'Loss of Pay' (LOP) or skip them.</p>
              </div>
            </div>
            
            <div className="space-y-4 max-w-2xl">
              <label className="flex items-start gap-4 p-5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors shadow-sm">
                <input type="radio" name="resolveAction" value="lop" className="text-primary focus:ring-primary mt-1 w-4 h-4" defaultChecked />
                <div>
                  <p className="text-base font-medium text-gray-900 dark:text-white mb-1">Convert to LOP</p>
                  <p className="text-sm text-gray-500">Unresolved missing swipes will be automatically marked as Loss of Pay (LOP) for the affected employees.</p>
                </div>
              </label>
              <label className="flex items-start gap-4 p-5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors shadow-sm">
                <input type="radio" name="resolveAction" value="skip" className="text-primary focus:ring-primary mt-1 w-4 h-4" />
                <div>
                  <p className="text-base font-medium text-gray-900 dark:text-white mb-1">Skip Processing</p>
                  <p className="text-sm text-gray-500">Employees with unresolved exceptions will be skipped during this processing run.</p>
                </div>
              </label>
            </div>
          </div>
        );
      case 'finalize':
        return (
          <div className="space-y-8 bg-white dark:bg-[#181a1f] p-8 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Finalize & Lock</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review the processed summary before finalizing.</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-[#1f2229] p-6 rounded-lg border border-gray-200 dark:border-white/5 space-y-4 max-w-2xl">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-white/10">
                <span className="text-base text-gray-600 dark:text-gray-400">Total Employees Processed</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">142</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-white/10">
                <span className="text-base text-gray-600 dark:text-gray-400">Total LOP Days Calculated</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">14.5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base text-gray-600 dark:text-gray-400">Employees Skipped</span>
                <span className="text-lg font-semibold text-red-600">0</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-base text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-lg border border-emerald-200 dark:border-emerald-800/30 max-w-2xl">
              <CheckCircle2 size={24} className="shrink-0" />
              Attendance processing complete. Data is ready to be locked and synced with Payroll.
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Process Attendance</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Calculate work hours, overtime, and LOP for the payroll period.</p>
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
            <form id="attendance-wizard-form" onSubmit={form.handleSubmit(onSubmit)}>
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
          <ArrowLeft size={16} /> {currentStep === 0 ? 'Cancel' : 'Previous'}
        </button>

        <div className="flex items-center gap-3">
          {currentStep === STEPS.length - 1 ? (
            <button
              type="submit"
              form="attendance-wizard-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-[#5d1944] text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              Finalize & Lock <CheckCircle2 size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-[#5d1944] text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95"
            >
              Next <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
