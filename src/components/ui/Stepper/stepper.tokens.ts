export const stepperTokens = {
  colors: {
    brand: 'bg-[#792359] border-[#792359]',
    brandText: 'text-[#792359] dark:text-[#e6a8d0]',
    brandLight: 'bg-[#792359]/10 border-[#792359]/20 text-[#792359] dark:bg-[#e6a8d0]/10 dark:border-[#e6a8d0]/20 dark:text-[#e6a8d0]',
    neutral: 'bg-white dark:bg-[#181a1f] border-gray-300 dark:border-gray-600',
    neutralText: 'text-gray-400 dark:text-gray-500',
    textActive: 'text-gray-900 dark:text-white',
    textCompleted: 'text-gray-700 dark:text-gray-300',
    connectorBg: 'bg-gray-200 dark:bg-white/10',
    connectorFill: 'bg-[#792359] dark:bg-[#e6a8d0]',
  },
  sizes: {
    sm: {
      circle: 'w-6 h-6 text-xs border-[1.5px]',
      label: 'text-xs',
      description: 'text-[10px]',
      connectorHorizontal: 'h-[1.5px] min-w-[24px]',
      connectorVertical: 'w-[1.5px] min-h-[24px]',
      gap: 'gap-2',
      containerHorizontal: 'min-w-[48px]',
    },
    md: {
      circle: 'w-8 h-8 text-sm border-2',
      label: 'text-[13px]',
      description: 'text-[11px]',
      connectorHorizontal: 'h-[2px] min-w-[32px]',
      connectorVertical: 'w-[2px] min-h-[32px]',
      gap: 'gap-3',
      containerHorizontal: 'min-w-[64px]',
    },
    lg: {
      circle: 'w-10 h-10 text-base border-2',
      label: 'text-sm',
      description: 'text-xs',
      connectorHorizontal: 'h-[2px] min-w-[48px]',
      connectorVertical: 'w-[2px] min-h-[48px]',
      gap: 'gap-4',
      containerHorizontal: 'min-w-[80px]',
    }
  },
  animation: {
    transition: 'transition-all duration-300 ease-in-out',
    scale: 'scale-110',
  }
};
