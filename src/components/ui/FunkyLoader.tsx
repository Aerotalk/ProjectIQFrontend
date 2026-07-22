import { cn } from '@/lib/utils';

interface FunkyLoaderProps {
  message?: string;
  fullScreen?: boolean;
  variant?: 'fullscreen' | 'section' | 'inline';
  className?: string;
}

export default function FunkyLoader({
  message,
  fullScreen,
  variant = 'fullscreen',
  className,
}: FunkyLoaderProps) {
  // Map backward compatible fullScreen prop
  const activeVariant =
    fullScreen !== undefined ? (fullScreen ? 'fullscreen' : 'section') : variant;

  // ── INLINE VARIANT ── (used inside buttons)
  if (activeVariant === 'inline') {
    return (
      <span
        className={cn(
          'inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0 align-middle',
          className
        )}
      />
    );
  }

  // ── SECTION VARIANT ── (used inside page content areas)
  if (activeVariant === 'section') {
    return (
      <div className={cn('w-full py-16 flex flex-col items-center justify-center gap-3', className)}>
        <div className="w-8 h-8 border-2 border-gray-200 dark:border-white/10 border-t-[#792359] rounded-full animate-spin" />
        {message && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        )}
      </div>
    );
  }

  // ── FULLSCREEN VARIANT ── (used for initial page load / ProtectedRoute)
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f1115] gap-4',
        className
      )}
    >
      <div className="w-10 h-10 border-2 border-gray-200 dark:border-white/10 border-t-[#792359] rounded-full animate-spin" />
      {message && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
}
