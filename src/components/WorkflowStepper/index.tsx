import React from 'react';
import { FormProvider } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';

export interface Step {
  id: string;
  label: string;
}

export interface WorkflowStepperProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  title: string;
  onClose: () => void;
  onSave?: () => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
  form?: UseFormReturn<any>;
  onSubmit?: (data: any) => void;
  onError?: (errors: any) => void;
  children: React.ReactNode;
}

export default function WorkflowStepper({
  steps,
  currentStep,
  onStepChange,
  title,
  onClose,
  onSave,
  isSubmitting,
  readOnly,
  form,
  onSubmit,
  onError,
  children
}: WorkflowStepperProps) {

  const renderContent = () => (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
      {form ? (
        <FormProvider {...form}>
          <form id="workflow-stepper-form" onSubmit={onSubmit ? form.handleSubmit(onSubmit, onError) : (e) => e.preventDefault()} className="pb-8">
            <div key={currentStep} className="animate-in fade-in slide-in-from-right-4 duration-300">
              {children}
            </div>
          </form>
        </FormProvider>
      ) : (
        <div key={currentStep} className="animate-in fade-in slide-in-from-right-4 duration-300 pb-8">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/20 dark:bg-black/40 transition-opacity">
      <div className="w-full max-w-xl bg-white dark:bg-[#181a1f] h-full shadow-2xl border-l border-gray-200 dark:border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02] shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Step Selector */}
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 shrink-0 px-6 py-3">
        <div className="relative max-w-xs">
          <label className="sr-only">Select Step</label>
          <CustomSelect
            value={currentStep.toString()}
            onChange={(val) => onStepChange(Number(val))}
            options={steps.map((step, index) => ({ value: index.toString(), label: `${index + 1}. ${step.label}` }))}
          />
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Footer Navigation */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-sm transition-colors"
          >
            {readOnly ? 'Close' : 'Cancel'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!readOnly && onSave ? (
            <button
              type="submit"
              form={form ? "workflow-stepper-form" : undefined}
              onClick={!form ? onSave : undefined}
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
    </div>
  );
}
