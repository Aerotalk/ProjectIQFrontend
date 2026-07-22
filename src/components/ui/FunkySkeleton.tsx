import { cn } from "@/lib/utils";

interface FunkySkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle' | 'card' | 'tableRow';
  count?: number;
}

export function FunkySkeleton({ className, variant = 'rect', count = 1 }: FunkySkeletonProps) {
  const renderItem = (index: number) => {
    switch (variant) {
      case 'circle':
        return (
          <div
            key={index}
            className={cn(
              "rounded-full bg-gray-200 dark:bg-white/5 animate-shimmer relative overflow-hidden shrink-0",
              className
            )}
          />
        );
      case 'text':
        return (
          <div
            key={index}
            className={cn(
              "h-3 rounded-sm bg-gray-200 dark:bg-white/5 animate-shimmer relative overflow-hidden w-3/4 my-1.5",
              className
            )}
          />
        );
      case 'card':
        return (
          <div
            key={index}
            className={cn(
              "border border-gray-200 dark:border-white/5 rounded-xl p-5 bg-white dark:bg-[#181a1f] space-y-4 shadow-xs relative overflow-hidden",
              className
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-white/5 animate-shimmer shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-white/5 rounded-sm animate-shimmer" />
                <div className="h-3 w-1/4 bg-gray-200 dark:bg-white/5 rounded-sm animate-shimmer" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full bg-gray-200 dark:bg-white/5 rounded-sm animate-shimmer" />
              <div className="h-3 w-5/6 bg-gray-200 dark:bg-white/5 rounded-sm animate-shimmer" />
            </div>
          </div>
        );
      case 'tableRow':
        return (
          <div
            key={index}
            className={cn(
              "flex items-center gap-4 py-4 px-2 border-b border-gray-100 dark:border-white/5 w-full relative overflow-hidden",
              className
            )}
          >
            <div className="w-8 h-4 bg-gray-200 dark:bg-white/5 rounded-sm animate-shimmer shrink-0" />
            <div className="w-28 h-4 bg-gray-200 dark:bg-white/5 rounded-sm animate-shimmer shrink-0" />
            <div className="flex-1 h-4 bg-gray-200 dark:bg-white/5 rounded-sm animate-shimmer min-w-[120px]" />
            <div className="w-20 h-4 bg-gray-200 dark:bg-white/5 rounded-sm animate-shimmer shrink-0" />
            <div className="w-24 h-4 bg-gray-200 dark:bg-white/5 rounded-sm animate-shimmer shrink-0" />
            <div className="w-16 h-4 bg-gray-200 dark:bg-white/5 rounded-sm animate-shimmer shrink-0" />
          </div>
        );
      case 'rect':
      default:
        return (
          <div
            key={index}
            className={cn(
              "rounded-md bg-gray-200 dark:bg-white/5 animate-shimmer relative overflow-hidden",
              className
            )}
          />
        );
    }
  };

  if (count > 1) {
    return (
      <div className="w-full space-y-3">
        {Array.from({ length: count }).map((_, i) => renderItem(i))}
      </div>
    );
  }

  return renderItem(0);
}
