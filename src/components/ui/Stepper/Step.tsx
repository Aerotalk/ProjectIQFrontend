import React from 'react';
import { Check } from 'lucide-react';
import type { StepProps } from './stepper.types';
import { stepperTokens } from './stepper.tokens';

export const Step: React.FC<StepProps> = ({
  index,
  label,
  description,
  icon,
  isCompleted,
  isCurrent,
  isUpcoming,
  size,
  orientation,
  showNumbers,
  showCheckmarks,
  showDescriptions,
  interactive,
  onClick,
  animated,
}) => {
  const isHorizontal = orientation === 'horizontal';
  const sizeTokens = stepperTokens.sizes[size];

  // Determine colors based on state
  let circleColor = stepperTokens.colors.neutral;
  let textColor = stepperTokens.colors.neutralText;
  
  if (isCompleted) {
    circleColor = `${stepperTokens.colors.brand} text-white shadow-sm shadow-[#792359]/20`;
    textColor = stepperTokens.colors.textCompleted;
  } else if (isCurrent) {
    circleColor = `${stepperTokens.colors.brand} text-white shadow-md shadow-[#792359]/30 ${animated ? stepperTokens.animation.scale : ''}`;
    textColor = stepperTokens.colors.brandText;
  } else if (interactive) {
    // If interactive and upcoming, it can be clickable
    circleColor = `hover:border-[#792359]/50 hover:bg-[#792359]/5 ${stepperTokens.colors.neutral}`;
  }

  // Animation classes
  const transitionClass = animated ? stepperTokens.animation.transition : '';

  const ariaLabel = isCompleted ? 'Completed' : isUpcoming ? 'Upcoming' : 'Current step';

  return (
    <div 
      className={`flex ${isHorizontal ? 'flex-col items-center text-center' : 'flex-row items-start text-left'} ${sizeTokens.gap}`}
      style={isHorizontal ? { minWidth: '72px', flexShrink: 0 } : {}}
    >
      <button
        type="button"
        onClick={interactive ? onClick : undefined}
        disabled={!interactive}
        aria-current={isCurrent ? 'step' : undefined}
        aria-label={`${label} - ${ariaLabel}`}
        title={label}
        className={`
          relative flex items-center justify-center font-bold rounded-full
          ${sizeTokens.circle} ${circleColor} ${transitionClass}
          ${interactive ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#792359] focus-visible:ring-offset-2' : 'cursor-default'}
        `}
      >
        {isCompleted && showCheckmarks ? (
          <Check size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} strokeWidth={3} />
        ) : icon ? (
          icon
        ) : showNumbers ? (
          <span>{index + 1}</span>
        ) : null}
      </button>

      <div className={`flex flex-col ${isHorizontal ? 'items-center' : 'items-start pt-1'}`}>
        <span 
          className={`font-medium capitalize ${sizeTokens.label} ${textColor} ${transitionClass}`}
          style={{ 
            maxWidth: isHorizontal ? '80px' : 'none', 
            lineHeight: 1.2,
          }}
        >
          {label}
        </span>
        
        {showDescriptions && description && (
          <span 
            className={`mt-1 text-gray-500 ${sizeTokens.description} ${transitionClass}`}
            style={{ 
              maxWidth: isHorizontal ? '100px' : 'none',
              lineHeight: 1.3,
            }}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
