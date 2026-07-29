import { useState } from 'react';
import { useForm } from 'react-hook-form';
import WorkflowStepper from '../../../../components/WorkflowStepper';
import toast from 'react-hot-toast';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';

const STEPS = [
  { id: 'select_period', label: 'Select Period' },
  { id: 'resolve_exceptions', label: 'Resolve Exceptions' },
  { id: 'finalize', label: 'Finalize & Lock' },
];

export default function AttendanceWizardDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const form = useForm();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  if (!isOpen) return null;

  const onSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    toast.success('Attendance processed successfully!');
    onClose();
    setCurrentStep(0);
  };

  const renderStep = () => {
    switch (STEPS[currentStep]?.id) {
      case 'select_period':
        return (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-white/10 text-xs">1</span>
              Select Processing Period
            </h3>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
                <CustomDatePicker value={fromDate} onChange={setFromDate} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
                <CustomDatePicker value={toDate} onChange={setToDate} />
              </div>
            </div>
          </div>
        );
      case 'resolve_exceptions':
        return (
          <div className="space-y-6">
             <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-white/10 text-xs">2</span>
              Resolve Pending Exceptions
            </h3>
            <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-sm border border-orange-100 dark:border-orange-800/30 flex items-start gap-3">
              <AlertCircle size={16} className="text-orange-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-orange-800 dark:text-orange-400">Action Required</h4>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">There are 12 unresolved exceptions in the selected period. You can choose to automatically resolve them as 'Loss of Pay' (LOP) or skip them.</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-white/10 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                <input type="radio" name="resolveAction" value="lop" className="text-primary focus:ring-primary" defaultChecked />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Convert to LOP</p>
                  <p className="text-xs text-gray-500">Unresolved missing swipes will be marked as Loss of Pay</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-white/10 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                <input type="radio" name="resolveAction" value="skip" className="text-primary focus:ring-primary" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Skip Processing</p>
                  <p className="text-xs text-gray-500">Do not finalize employees with unresolved exceptions</p>
                </div>
              </label>
            </div>
          </div>
        );
      case 'finalize':
        return (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-white/10 text-xs">3</span>
              Finalize & Lock
            </h3>
            
            <div className="bg-gray-50 dark:bg-[#1f2229] p-4 rounded-sm border border-gray-200 dark:border-white/5 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-white/10">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Employees Processed</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">142</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-white/10">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total LOP Days</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">14</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Employees Skipped</span>
                <span className="text-sm font-semibold text-red-600">0</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-sm">
              <CheckCircle2 size={16} />
              Attendance is ready to be locked and sent to Payroll.
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <WorkflowStepper
      steps={STEPS}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      title="Process Attendance"
      onClose={onClose}
      isSubmitting={isSubmitting}
      form={form}
      onSubmit={onSubmit}
    >
      {renderStep()}
    </WorkflowStepper>
  );
}
