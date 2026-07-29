export const stepperTokens = {
  colors: {
    brand: 'bg-primary border-primary',
    brandText: 'text-gray-900 dark:text-white',
    brandLight: 'bg-primary/10 border-primary/20 text-primary dark:bg-secondary/10 dark:border-secondary/20 dark:text-secondary',
    neutral: 'bg-white dark:bg-[#181a1f] border-gray-200 dark:border-gray-700',
    neutralText: 'text-gray-400 dark:text-gray-500',
    textActive: 'text-gray-900 dark:text-white',
    textCompleted: 'text-gray-600 dark:text-gray-400',
    connectorBg: 'bg-gray-200 dark:bg-gray-700',
    connectorFill: 'bg-primary dark:bg-secondary',
  },
  sizes: {
    sm: {
      circle: 'w-8 h-8 text-xs border-[2px]',
      label: 'text-[13px]',
      description: 'text-[11px]',
      connectorHorizontal: 'h-[3px]',
      connectorVertical: 'w-[3px]',
      gap: 'gap-3',
      containerHorizontal: 'min-w-[64px]',
    },
    md: {
      circle: 'w-10 h-10 text-sm border-[2.5px]',
      label: 'text-[14px]',
      description: 'text-xs',
      connectorHorizontal: 'h-[4px]',
      connectorVertical: 'w-[4px]',
      gap: 'gap-4',
      containerHorizontal: 'min-w-[80px]',
    },
    lg: {
      circle: 'w-12 h-12 text-base border-[3px]',
      label: 'text-[15px]',
      description: 'text-sm',
      connectorHorizontal: 'h-[4px]',
      connectorVertical: 'w-[4px]',
      gap: 'gap-5',
      containerHorizontal: 'min-w-[96px]',
    }
  },
  animation: {
    transition: 'transition-all duration-300 ease-out',
    scale: 'scale-[1.15]',
  }
};
