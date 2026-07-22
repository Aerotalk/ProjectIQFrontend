import React from 'react';
import type { StepConnectorProps } from './stepper.types';
import { stepperTokens } from './stepper.tokens';

export const StepConnector: React.FC<StepConnectorProps> = ({ isCompleted, orientation, animated, size }) => {
  const isHorizontal = orientation === 'horizontal';
  const sizeClass = isHorizontal ? stepperTokens.sizes[size].connectorHorizontal : stepperTokens.sizes[size].connectorVertical;
  
  // Calculate center offsets based on the size
  const centerOffset = size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px';
  
  // Base classes for the track
  const baseClasses = `absolute z-0 ${sizeClass} ${stepperTokens.colors.connectorBg}`;
  
  // Classes for the filled portion
  const fillClasses = `absolute top-0 left-0 ${stepperTokens.colors.connectorFill} ${animated ? stepperTokens.animation.transition : ''}`;
  
  if (isHorizontal) {
    return (
      <div 
        className={baseClasses} 
        style={{ top: `calc(${centerOffset} - ${size === 'sm' ? '1.5px' : '2px'})`, left: '50%', right: '-50%', width: '100%' }}
        aria-hidden="true"
      >
         <div className={`${fillClasses} h-full`} style={{ width: isCompleted ? '100%' : '0%' }} />
      </div>
    );
  }

  // Vertical orientation
  return (
    <div 
      className={baseClasses} 
      style={{ left: `calc(${centerOffset} - ${size === 'sm' ? '1.5px' : '2px'})`, top: '50%', bottom: '-50%', height: '100%' }}
      aria-hidden="true"
    >
       <div className={`${fillClasses} w-full`} style={{ height: isCompleted ? '100%' : '0%' }} />
    </div>
  );
};
