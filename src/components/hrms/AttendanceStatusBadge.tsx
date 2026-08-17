import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

export type AttendanceStatus = string;

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  className?: string;
}

export default function AttendanceStatusBadge({ status, className }: AttendanceStatusBadgeProps) {
  const normalizedStatus = (status || '').toUpperCase();
  const getBadgeVariant = (s: string) => {
    switch (s) {
      case 'PRESENT':
      case 'REGULARIZED':
        return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80';
      case 'ABSENT':
        return 'bg-red-100 text-red-700 hover:bg-red-100/80';
      case 'LEAVE':
      case 'PERMISSION':
      case 'HALF_DAY':
      case 'LATE':
        return 'bg-amber-100 text-amber-700 hover:bg-amber-100/80';
      case 'HOLIDAY':
      case 'WEEKEND':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100/80 dark:bg-white/10 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100/80 dark:bg-white/10 dark:text-gray-300';
    }
  };

  const formatStatusText = (s: string) => {
    if (!s) return '';
    return s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <Badge className={cn("px-2 py-0.5 text-xs font-medium rounded-sm border-0", getBadgeVariant(normalizedStatus), className)}>
      {formatStatusText(status)}
    </Badge>
  );
}
