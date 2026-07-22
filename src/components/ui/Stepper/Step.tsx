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
  let textWeight = 'font-medium';
  let circleRing = '';
  let circleScale = '';
  let circleShadow = '';
  
  if (isCompleted) {
    circleColor = `${stepperTokens.colors.brand} text-white`;
    textColor = stepperTokens.colors.textCompleted;
    textWeight = 'font-medium';
  } else if (isCurrent) {
    circleColor = `${stepperTokens.colors.brand} text-white`;
    textColor = stepperTokens.colors.textActive;
    textWeight = 'font-semibold';
    circleRing = 'ring-4 ring-[#792359]/10';
    circleShadow = 'shadow-sm';
  } else if (interactive) {
    // If interactive and upcoming, it can be clickable
    circleColor = `hover:border-[#792359]/50 hover:bg-[#792359]/5 ${stepperTokens.colors.neutral}`;
    textWeight = 'font-medium';
  } else {
    // Upcoming
    textWeight = 'font-medium';
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
          ${sizeTokens.circle} ${circleColor} ${transitionClass} ${circleRing} ${circleShadow} ${circleScale}
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
          className={`capitalize ${textWeight} ${sizeTokens.label} ${textColor} ${transitionClass}`}
          style={{ 
            maxWidth: isHorizontal ? '96px' : 'none', 
            lineHeight: 1.3,
          }}
        >
          {label}
        </span>
        
        {showDescriptions && description && (
          <span 
            className={`mt-1 text-gray-500 ${sizeTokens.description} ${transitionClass}`}
            style={{ 
              maxWidth: isHorizontal ? '120px' : 'none',
              lineHeight: 1.4,
            }}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
