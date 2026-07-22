import React, { useState, useRef, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { X, Loader2, Save, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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
import PositionChangeTab from './sections/PositionChangeTab';
import SalaryRevisionTab from './sections/SalaryRevisionTab';
import SeparationExitTab from './sections/SeparationExitTab';

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
  { id: 'position',   label: 'Position' },
  { id: 'separation', label: 'Separation' },
  { id: 'salary',     label: 'Salary' },
  { id: 'education',  label: 'Education' },
  { id: 'family',     label: 'Family' },
  { id: 'contract',   label: 'Contract' },
];

const LAST_STEP = STEPS.length - 1;

export default function EmployeeDrawer({ isOpen, onClose, onSave, mode, initialData, employeeId, isSubmitting }: Props) {
  const form = useEmployeeForm(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  // Tracks the furthest step the user has reached (for click-back navigation)
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const stepperRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        form.reset(initialData);
        // In edit/view mode, allow jumping to any step
        setMaxVisitedStep(LAST_STEP);
      } else {
        form.reset();
        setMaxVisitedStep(0);
      }
      setCurrentStep(0);
    }
  }, [isOpen, initialData, mode]);

  // Auto-scroll the active step node into view in the stepper bar
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

  const goToStep = (index: number) => {
    // Only allow navigating to already-visited steps (or current)
    if (index <= maxVisitedStep) {
      setCurrentStep(index);
    }
  };

  const handleNext = () => {
    if (currentStep < LAST_STEP) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setMaxVisitedStep((prev) => Math.max(prev, next));
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'basic':      return <BasicInfoTab readOnly={readOnly} />;
      case 'address':    return <AddressTab readOnly={readOnly} />;
      case 'emergency':  return <EmergencyContactTab readOnly={readOnly} />;
      case 'statutory':  return <StatutoryDetailsTab readOnly={readOnly} />;
      case 'bank':       return <BankDetailsTab readOnly={readOnly} />;
      case 'documents':  return <DocumentsTab readOnly={readOnly} />;
      case 'position':   return <PositionChangeTab readOnly={readOnly} />;
      case 'separation': return <SeparationExitTab readOnly={readOnly} />;
      case 'salary':     return <SalaryRevisionTab readOnly={readOnly} />;
      case 'education':  return <EducationTab readOnly={readOnly} />;
      case 'family':     return <FamilyNomineeTab readOnly={readOnly} />;
      case 'contract':   return <EmploymentContractTab readOnly={readOnly} />;
      default:           return null;
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep  = currentStep === LAST_STEP;

  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">

      {/* ── Header ─────────────────────────────────────────────────────── */}
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

      {/* ── Stepper Bar ────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 shrink-0">
        <div
          ref={stepperRef}
          className="overflow-x-auto custom-scrollbar"
        >
          {/* Extra horizontal padding so first/last nodes aren't flush to the edge */}
          <div className="flex items-start px-6 py-5 min-w-max gap-0">
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive    = index === currentStep;
              const isVisitable = index <= maxVisitedStep;
              const isFuture    = index > maxVisitedStep;

              return (
                <React.Fragment key={step.id}>
                  {/* ── Step Node ── */}
                  <div className="flex flex-col items-center" style={{ minWidth: 72 }}>
                    <button
                      type="button"
                      data-active={isActive}
                      disabled={isFuture}
                      onClick={() => goToStep(index)}
                      title={isFuture ? 'Complete previous steps first' : step.label}
                      className={`
                        relative w-9 h-9 rounded-full flex items-center justify-center
                        text-sm font-bold border-2 transition-all duration-300
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#792359] focus-visible:ring-offset-2
                        ${isCompleted
                          ? 'bg-[#792359] border-[#792359] text-white shadow-sm shadow-[#792359]/30 cursor-pointer hover:bg-[#5d1944] hover:border-[#5d1944]'
                          : isActive
                            ? 'bg-[#792359] border-[#792359] text-white shadow-md shadow-[#792359]/40 scale-110 cursor-default'
                            : isVisitable
                              ? 'bg-white dark:bg-[#1e2028] border-[#792359]/50 text-[#792359] dark:text-[#e6a8d0] cursor-pointer hover:border-[#792359] hover:bg-[#792359]/5'
                              : 'bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check size={16} strokeWidth={3} />
                      ) : (
                        <span>{index + 1}</span>
                      )}

                      {/* Pulse ring on active step */}
                      {isActive && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-[#792359]/20 pointer-events-none" />
                      )}
                    </button>

                    {/* Step label */}
                    <span
                      className={`
                        mt-2 text-[10px] font-semibold uppercase tracking-wider text-center leading-tight
                        max-w-[68px] transition-colors duration-200
                        ${isActive
                          ? 'text-[#792359] dark:text-[#e6a8d0]'
                          : isCompleted
                            ? 'text-[#792359]/70 dark:text-[#e6a8d0]/60'
                            : 'text-gray-400 dark:text-gray-600'
                        }
                      `}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* ── Connector Line (not after last step) ── */}
                  {index < LAST_STEP && (
                    <div className="relative flex-1 h-0.5 mt-[18px] mx-1" style={{ minWidth: 24 }}>
                      {/* Background track */}
                      <div className="absolute inset-0 bg-gray-200 dark:bg-white/10 rounded-full" />
                      {/* Filled progress */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out bg-[#792359]"
                        style={{ width: isCompleted ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Step Content ───────────────────────────────────────────────── */}
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

      {/* ── Footer Navigation ──────────────────────────────────────────── */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between shrink-0">

        {/* Left side: Cancel / Back */}
        <div className="flex items-center gap-2">
          {isFirstStep ? (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-sm transition-colors"
            >
              {readOnly ? 'Close' : 'Cancel'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-sm transition-colors border border-gray-200 dark:border-white/10"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
        </div>

        {/* Center: Step indicator */}
        <div className="hidden sm:flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-4 h-1.5 bg-[#792359]'
                  : i < currentStep
                    ? 'w-1.5 h-1.5 bg-[#792359]/40'
                    : 'w-1.5 h-1.5 bg-gray-200 dark:bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Right side: Next / Save */}
        <div className="flex items-center gap-2">
          {!isLastStep ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#792359] hover:bg-[#52173c] text-white text-sm font-medium rounded-sm shadow-sm transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : !readOnly ? (
            <button
              type="submit"
              form="employee-drawer-form"
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
