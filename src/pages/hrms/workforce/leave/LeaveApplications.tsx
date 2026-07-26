import { useState, useMemo } from 'react';
import { Plus, FileText, Eye, Edit2, CheckCircle, XCircle } from 'lucide-react';
import { useLeaveApplications, useMutation } from '../hooks';
import { WorkforceService } from '../services';
import CustomTable from '../../../../components/ui/CustomTable';
import { Input as CustomInput } from '../../../../components/ui/input';
import CustomSelect from '../../../../components/ui/CustomSelect';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import LeaveApplicationDrawer from './LeaveApplicationDrawer';
import { Skeleton } from '../../../../components/ui/skeleton';
import { LeaveStatus } from '../types';
import type { LeaveApplication } from '../types';

export default function LeaveApplications() {
  const { data, loading, params, setParams, refresh } = useLeaveApplications();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedApp, setSelectedApp] = useState<LeaveApplication | null>(null);

  const createMutation = useMutation(
    (newData: any) => WorkforceService.createLeaveApplication(newData),
    {
      successMessage: 'Leave application submitted successfully',
      onSuccess: () => {
        refresh();
        setIsDrawerOpen(false);
      }
    }
  );

  const updateMutation = useMutation(
    (newData: any) => WorkforceService.updateLeaveApplication(selectedApp?.id as string, newData),
    {
      successMessage: 'Leave application updated successfully',
      onSuccess: () => {
        refresh();
        setIsDrawerOpen(false);
      }
    }
  );

  const handleAction = (item: LeaveApplication | null, mode: 'create' | 'edit' | 'view') => {
    setDrawerMode(mode);
    setSelectedApp(item);
    setIsDrawerOpen(true);
  };

  const handleSave = async (formData: any) => {
    if (drawerMode === 'create') {
      await createMutation.mutate(formData);
    } else {
      await updateMutation.mutate(formData);
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
      key: 'period', 
      label: 'Duration', 
      render: (_: any, row: LeaveApplication) => (
        <div className="text-sm">
          <div>{row.fromDate} to {row.toDate}</div>
          <div className="text-xs text-gray-500">{row.duration} Days</div>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val: LeaveStatus) => (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${
          val === LeaveStatus.Approved ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
          val === LeaveStatus.Rejected ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
          val === LeaveStatus.Cancelled ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
        }`}>
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
              <button onClick={() => { setIsOpen(false); handleAction(row, 'view'); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                <Eye size={14} /> View Details
              </button>
              {row.status === LeaveStatus.Pending && (
                <>
                  <button onClick={() => { setIsOpen(false); handleAction(row, 'edit'); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                    <Edit2 size={14} /> Edit Request
                  </button>
                  <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
                  <button onClick={() => { setIsOpen(false); /* Hook up approve */ }} className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 flex items-center gap-2">
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button onClick={() => { setIsOpen(false); /* Hook up reject */ }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                    <XCircle size={14} /> Reject
                  </button>
                </>
              )}
            </SmartActionMenu>
          );
        };
        return <ActionCell />;
      }
    }
  ], []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Applications</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and view employee leave requests</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="w-64">
            <CustomInput 
              placeholder="Search applications..." 
              value={params.search || ''}
              onChange={(e: any) => setParams({ ...params, search: e.target.value })}
            />
          </div>
          <div className="w-40">
            <CustomSelect
              options={[
                { value: '', label: 'All Statuses' },
                { value: LeaveStatus.Pending, label: 'Pending' },
                { value: LeaveStatus.Approved, label: 'Approved' },
                { value: LeaveStatus.Rejected, label: 'Rejected' },
              ]}
              value={params.status || ''}
              onChange={(val) => setParams({ ...params, status: val })}
            />
          </div>
          <button 
            onClick={() => handleAction(null, 'create')}
            className="flex items-center gap-2 px-4 py-2 bg-[#792359] text-white rounded-sm hover:bg-[#52173c] transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
          >
            <Plus size={16} />
            Apply Leave
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 relative border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#181a1f]">
            {data.length > 0 ? (
              <CustomTable 
                columns={columns}
                data={data}
                sortColumn={params.sortBy}
                sortDirection={params.order}
                onSort={(col, dir) => setParams({ ...params, sortBy: col, order: dir })}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <FileText size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No leave applications yet</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                  There are currently no leave requests to display. Click "Apply Leave" to create your first request.
                </p>
                <button 
                  onClick={() => handleAction(null, 'create')}
                  className="mt-6 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-sm text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  Apply Leave
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <LeaveApplicationDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        mode={drawerMode}
        initialData={selectedApp}
        onSave={handleSave}
      />
    </div>
  );
}


