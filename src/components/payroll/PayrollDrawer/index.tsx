import { useState, useEffect } from 'react';
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
  initialStep?: number;
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

import WorkflowStepper from '../../WorkflowStepper';

export default function PayrollDrawer({ isOpen, onClose, onSave, mode, initialData, isSubmitting, initialStep = 0 }: Props) {
  const form = usePayrollForm(initialData);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        form.reset(initialData);
      } else {
        form.reset();
      }
      setCurrentStep(initialStep);
    }
  }, [isOpen, initialData, mode, initialStep]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';
  const title = mode === 'create' ? 'New Payroll Action' : mode === 'edit' ? 'Edit Payroll Action' : 'View Payroll Action';

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
    <WorkflowStepper
      steps={STEPS}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      title={title}
      onClose={onClose}
      isSubmitting={isSubmitting}
      readOnly={readOnly}
      inline={true}
      form={form}
      onSubmit={onSubmit}
      onError={onError}
    >
      {renderStep()}
    </WorkflowStepper>
  );
}
