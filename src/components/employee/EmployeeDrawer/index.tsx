import React, { useState, useRef, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import { useEmployeeForm } from './hooks/useEmployeeForm';
import type { EmployeeFormValues } from './validators/employeeValidation';
import BasicInfoTab from './sections/BasicInfoTab';
import AddressTab from './sections/AddressTab';
import EmergencyContactTab from './sections/EmergencyContactTab';
import StatutoryDetailsTab from './sections/StatutoryDetailsTab';
import EmploymentContractTab from './sections/EmploymentContractTab';
import BankDetailsTab from './sections/BankDetailsTab';
import DocumentsTab from './sections/DocumentsTab';
import EducationTab from './sections/EducationTab';
import FamilyNomineeTab from './sections/FamilyNomineeTab';
// import PositionChangeTab from './sections/PositionChangeTab';
import SalaryRevisionTab from './sections/SalaryRevisionTab';
// import SeparationExitTab from './sections/SeparationExitTab';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmployeeFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<EmployeeFormValues>;
  employeeId?: string;
  isSubmitting?: boolean;
}

const STEPS = [
  { id: 'basic',      label: 'Basic Info' },
  { id: 'address',    label: 'Address' },
  { id: 'emergency',  label: 'Emergency' },
  { id: 'statutory',  label: 'Statutory' },
  { id: 'bank',       label: 'Bank Details' },
  { id: 'documents',  label: 'Documents' },
//   { id: 'position',   label: 'Position' },
//   { id: 'separation', label: 'Separation' },
  { id: 'salary',     label: 'Salary' },
  { id: 'education',  label: 'Education' },
  { id: 'family',     label: 'Family' },
  { id: 'contract',   label: 'Contract' },
];

export default function EmployeeDrawer({ isOpen, onClose, onSave, mode, initialData, employeeId, isSubmitting }: Props) {
  const form = useEmployeeForm(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const stepperRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      await onSave(data);
    } catch (err: any) {
      if (err?.message && typeof err.message === 'object') {
        Object.keys(err.message).forEach((key) => {
          form.setError(key as any, { type: 'server', message: err.message[key] });
        });
      } else if (err?.message && typeof err.message === 'string') {
        import('react-hot-toast').then(({ default: toast }) => {
          toast.error(err.message);
        });
      }
    }
  };

  const onError = (errors: any) => {
    console.error('Form validation errors:', errors);
    const firstKey = Object.keys(errors)[0];
    const firstError = errors[firstKey] as any;
    const msg = firstError?.message;
    import('react-hot-toast').then(({ default: toast }) => {
      toast.error(`${firstKey}: ${msg || 'Please fix the validation errors.'}`);
    });
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'basic':      return <BasicInfoTab readOnly={readOnly} />;
      case 'address':    return <AddressTab readOnly={readOnly} />;
      case 'emergency':  return <EmergencyContactTab readOnly={readOnly} />;
      case 'statutory':  return <StatutoryDetailsTab readOnly={readOnly} />;
      case 'bank':       return <BankDetailsTab readOnly={readOnly} />;
      case 'documents':  return <DocumentsTab readOnly={readOnly} />;
//       case 'position':   return <PositionChangeTab readOnly={readOnly} />;
//       case 'separation': return <SeparationExitTab readOnly={readOnly} />;
      case 'salary':     return <SalaryRevisionTab readOnly={readOnly} />;
      case 'education':  return <EducationTab readOnly={readOnly} />;
      case 'family':     return <FamilyNomineeTab readOnly={readOnly} />;
      case 'contract':   return <EmploymentContractTab readOnly={readOnly} />;
      default:           return null;
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02] shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Add New Employee' : mode === 'edit' ? 'Edit Employee Details' : 'View Employee Details'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {mode === 'create'
              ? `Step ${currentStep + 1} of ${STEPS.length} — ${STEPS[currentStep].label}`
              : `Employee ID: ${employeeId || '—'}`}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 shrink-0">
        <div
          ref={stepperRef}
          className="overflow-x-auto custom-scrollbar flex items-center px-6"
        >
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;

            return (
              <button
                key={step.id}
                type="button"
                data-active={isActive}
                onClick={() => setCurrentStep(index)}
                className={`
                  flex items-center gap-2 py-3 px-1 mr-8 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${isActive 
                    ? 'border-primary text-primary dark:text-secondary dark:border-secondary' 
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}
                `}
              >
                {step.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <FormProvider {...form}>
          <form
            id="employee-drawer-form"
            onSubmit={form.handleSubmit(onSubmit as any, onError)}
            className="pb-8"
          >
            {/* Animate content change */}
            <div key={currentStep} className="animate-in fade-in slide-in-from-right-4 duration-300">
              {renderStep()}
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Footer Navigation */}
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
              form="employee-drawer-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-dark disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {mode === 'edit' ? 'Update Employee' : 'Save Employee'}
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
