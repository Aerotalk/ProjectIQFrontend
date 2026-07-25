import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Half Day' | 'Holiday' | 'Weekend' | 'Late' | 'Permission' | 'Regularized';

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  className?: string;
}

export default function AttendanceStatusBadge({ status, className }: AttendanceStatusBadgeProps) {
  const getBadgeVariant = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
      case 'Regularized':
        return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80';
      case 'Absent':
        return 'bg-red-100 text-red-700 hover:bg-red-100/80';
      case 'Leave':
      case 'Permission':
      case 'Half Day':
      case 'Late':
        return 'bg-amber-100 text-amber-700 hover:bg-amber-100/80';
      case 'Holiday':
      case 'Weekend':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100/80 dark:bg-white/10 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100/80 dark:bg-white/10 dark:text-gray-300';
    }
  };

  return (
    <Badge className={cn("px-2 py-0.5 text-xs font-medium rounded-sm border-0", getBadgeVariant(status), className)}>
      {status}
    </Badge>
  );
}
