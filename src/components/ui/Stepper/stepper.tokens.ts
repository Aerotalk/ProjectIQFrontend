export const stepperTokens = {
  colors: {
    brand: 'bg-[#792359] border-[#792359]',
    brandText: 'text-gray-900 dark:text-white',
    brandLight: 'bg-[#792359]/10 border-[#792359]/20 text-[#792359] dark:bg-[#e6a8d0]/10 dark:border-[#e6a8d0]/20 dark:text-[#e6a8d0]',
    neutral: 'bg-white dark:bg-[#181a1f] border-gray-200 dark:border-gray-700',
    neutralText: 'text-gray-400 dark:text-gray-500',
    textActive: 'text-gray-900 dark:text-white',
    textCompleted: 'text-gray-600 dark:text-gray-400',
    connectorBg: 'bg-gray-200 dark:bg-gray-700',
    connectorFill: 'bg-[#792359] dark:bg-[#e6a8d0]',
  },
  sizes: {
    sm: {
      circle: 'w-6 h-6 text-[11px] border-[2px]',
      label: 'text-xs',
      description: 'text-[10px]',
      connectorHorizontal: 'h-[3px]',
      connectorVertical: 'w-[3px]',
      gap: 'gap-3',
      containerHorizontal: 'min-w-[48px]',
    },
    md: {
      circle: 'w-8 h-8 text-xs border-[2px]',
      label: 'text-[13px]',
      description: 'text-[11px]',
      connectorHorizontal: 'h-[3px]',
      connectorVertical: 'w-[3px]',
      gap: 'gap-3',
      containerHorizontal: 'min-w-[64px]',
    },
    lg: {
      circle: 'w-10 h-10 text-sm border-[2px]',
      label: 'text-sm',
      description: 'text-xs',
      connectorHorizontal: 'h-[3px]',
      connectorVertical: 'w-[3px]',
      gap: 'gap-4',
      containerHorizontal: 'min-w-[80px]',
    }
  },
  animation: {
    transition: 'transition-all duration-300 ease-out',
    scale: 'scale-[1.15]',
  }
};
