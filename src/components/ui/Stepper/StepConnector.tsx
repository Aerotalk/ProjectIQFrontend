import React from 'react';
import type { StepConnectorProps } from './stepper.types';
import { stepperTokens } from './stepper.tokens';

export const StepConnector: React.FC<StepConnectorProps> = ({ isCompleted, orientation, animated }) => {
  const isHorizontal = orientation === 'horizontal';
  const sizeClass = isHorizontal ? stepperTokens.sizes.md.connectorHorizontal : stepperTokens.sizes.md.connectorVertical;
  
  // Base classes for the track
  const baseClasses = `relative ${sizeClass} ${stepperTokens.colors.connectorBg}`;
  
  // Classes for the filled portion
  const fillClasses = `absolute ${stepperTokens.colors.connectorFill} ${animated ? stepperTokens.animation.transition : ''}`;
  
  // Style for the fill based on orientation
  const fillStyle = isHorizontal
    ? {
        top: 0,
        bottom: 0,
        left: 0,
        width: isCompleted ? '100%' : '0%',
      }
    : {
        top: 0,
        left: 0,
        right: 0,
        height: isCompleted ? '100%' : '0%',
      };

  return (
    <div
      className={`${baseClasses} ${isHorizontal ? 'flex-1 mx-2' : 'flex-1 my-2'}`}
      aria-hidden="true"
    >
      <div className={fillClasses} style={fillStyle} />
    </div>
  );
};
