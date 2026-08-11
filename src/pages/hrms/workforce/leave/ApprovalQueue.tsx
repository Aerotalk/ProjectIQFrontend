import { useState, useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { useLeaveApplications, useMutation } from '../hooks';
import { WorkforceService } from '../services';
import { LeaveStatus } from '../types';
import type { LeaveApplication } from '../types';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import { Input as CustomInput } from '../../../../components/ui/input';

export default function ApprovalQueue() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, refresh } = useLeaveApplications({ status: LeaveStatus.Pending, search: searchTerm });

  const approveMutation = useMutation(
    (id: string) => WorkforceService.approveLeaveApplication(id),
    {
      successMessage: 'Leave application approved',
      onSuccess: () => refresh()
    }
  );

  const rejectMutation = useMutation(
    (id: string) => WorkforceService.rejectLeaveApplication(id),
    {
      successMessage: 'Leave application rejected',
      onSuccess: () => refresh()
    }
  );

  const handleAction = (id: string, status: LeaveStatus) => {
    if (status === LeaveStatus.Approved) {
      approveMutation.mutate(id);
    } else if (status === LeaveStatus.Rejected) {
      rejectMutation.mutate(id);
    }
  };

  const columns = useMemo(() => [
    { key: 'leaveNumber', label: 'Leave #', sortable: true },
    { 
      key: 'employeeName', 
      label: 'Employee', 
      sortable: true,
      render: (_: any, row: LeaveApplication) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.employeeName}</div>
          <div className="text-xs text-gray-500">{row.department}</div>
        </div>
      )
    },
    { 
      key: 'leaveTypeName', 
      label: 'Leave Type', 
      sortable: true,
      render: (val: string, row: LeaveApplication) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{val}</div>
          <div className="text-xs text-gray-500">{row.leaveCategory}</div>
        </div>
      )
    },
    { 
      key: 'duration', 
      label: 'Duration', 
      render: (_: any, row: LeaveApplication) => (
        <div className="text-sm">
          <div>{row.duration} Days</div>
          <div className="text-xs text-gray-500">{row.fromDate} - {row.toDate}</div>
        </div>
      )
    },
    { key: 'appliedOn', label: 'Applied On', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val: string) => (
        <span className="px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: LeaveApplication) => {
        const ActionCell = () => {
          const [isOpen, setIsOpen] = useState(false);
          return (
            <SmartActionMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
              <button onClick={() => { setIsOpen(false); /* view logic */ }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                <Eye size={14} /> View Details
              </button>
              <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
              <button onClick={() => { setIsOpen(false); handleAction(row.id, LeaveStatus.Approved); }} className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 flex items-center gap-2">
                <CheckCircle size={14} /> Approve
              </button>
              <button onClick={() => { setIsOpen(false); handleAction(row.id, LeaveStatus.Rejected); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                <XCircle size={14} /> Reject
              </button>
            </SmartActionMenu>
          );
        };
        return <ActionCell />;
      }
    }
  ], []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Approval Queue</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending leave requests awaiting your approval</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-72">
          <CustomInput 
            placeholder="Search pending requests..." 
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#181a1f]">
          {data.length > 0 ? (
            <CustomTable 
              columns={columns} 
              data={data} 
              loading={loading}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 py-12">
              <Clock size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No pending approvals found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
