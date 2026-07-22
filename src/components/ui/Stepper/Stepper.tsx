import React, { useRef, useEffect } from 'react';
import type { StepperProps } from './stepper.types';
import { Step } from './Step';
import { StepConnector } from './StepConnector';

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  size = 'md',
  showNumbers = true,
  showCheckmarks = true,
  showDescriptions = true,
  interactive = false,
  onStepClick,
  animated = true,
  className = '',
}) => {
  const isHorizontal = orientation === 'horizontal';
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active step node into view in horizontal mode
  useEffect(() => {
    if (isHorizontal && containerRef.current) {
      const activeNode = containerRef.current.querySelector('[aria-current="step"]');
      if (activeNode) {
        // Scroll the parent container, not the window
        activeNode.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentStep, isHorizontal]);

  if (!steps || steps.length === 0) return null;

  return (
    <div
      className={`w-full ${className}`}
      aria-label="Progress Stepper"
    >
      <div 
        ref={containerRef}
        className={`
          flex ${isHorizontal ? 'flex-row overflow-x-auto custom-scrollbar pb-2 pt-2 items-start px-2' : 'flex-col items-stretch'}
        `}
      >
        {steps.map((step, index) => {
          // A step's status can be overridden by its individual `status` prop
          const isCompleted = step.status === 'completed' || index < currentStep;
          const isCurrent = step.status === 'current' || index === currentStep;
          const isUpcoming = step.status === 'upcoming' || index > currentStep;
          const isLastStep = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <Step
                index={index}
                label={step.label}
                description={step.description}
                icon={step.icon}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                isUpcoming={isUpcoming}
                size={size}
                orientation={orientation}
                showNumbers={showNumbers}
                showCheckmarks={showCheckmarks}
                showDescriptions={showDescriptions}
                interactive={interactive}
                onClick={() => onStepClick?.(index, step)}
                animated={animated}
              />

              {/* Connector Line (Not after the last step) */}
              {!isLastStep && (
                <StepConnector
                  isCompleted={index < currentStep}
                  orientation={orientation}
                  animated={animated}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
