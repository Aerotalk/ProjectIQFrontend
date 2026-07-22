import React from 'react';

export interface StepItem {
  id: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'completed' | 'current' | 'upcoming' | 'error' | 'success';
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showNumbers?: boolean;
  showCheckmarks?: boolean;
  showDescriptions?: boolean;
  interactive?: boolean;
  onStepClick?: (stepIndex: number, step: StepItem) => void;
  animated?: boolean;
  className?: string;
}

export interface StepProps extends Omit<StepItem, 'id'> {
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isUpcoming: boolean;
  size: NonNullable<StepperProps['size']>;
  orientation: NonNullable<StepperProps['orientation']>;
  showNumbers: boolean;
  showCheckmarks: boolean;
  showDescriptions: boolean;
  interactive: boolean;
  onClick?: () => void;
  animated: boolean;
}

export interface StepConnectorProps {
  isCompleted: boolean;
  orientation: NonNullable<StepperProps['orientation']>;
  animated: boolean;
}
