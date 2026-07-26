import { useState, useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { WorkforceService } from '../services';
import { usePermissions, useMutation } from '../hooks';
import PermissionDrawer from './PermissionDrawer';
import { Edit2, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Input as CustomInput } from '../../../../components/ui/input';
import CustomSelect from '../../../../components/ui/CustomSelect';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import { ApprovalStatus } from '../types';
import type { PermissionRequest } from '../types';

export default function Permissions() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedItem, setSelectedItem] = useState<PermissionRequest | null>(null);
  const [filters, setFilters] = useState({ search: '', status: '' });

  const { data, loading, refresh } = usePermissions(filters);

  const createMutation = useMutation(
    (newData: any) => WorkforceService.createPermission(newData),
    {
      successMessage: 'Permission request submitted successfully',
      onSuccess: () => {
        refresh();
        setIsDrawerOpen(false);
      }
    }
  );

  const updateMutation = useMutation(
    (newData: any) => WorkforceService.updatePermission(selectedItem?.id as string, newData),
    {
      successMessage: 'Permission request updated successfully',
      onSuccess: () => {
        refresh();
        setIsDrawerOpen(false);
      }
    }
  );

  const handleAction = (item: PermissionRequest | null, mode: 'create' | 'edit' | 'view') => {
    setDrawerMode(mode);
    setSelectedItem(item);
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
    { key: 'permissionNumber', label: 'Perm #', sortable: true },
    { 
      key: 'employeeName', 
      label: 'Employee', 
      sortable: true,
      render: (_: any, row: PermissionRequest) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.employeeName}</div>
          <div className="text-xs text-gray-500">{row.department}</div>
        </div>
      )
    },
    { 
      key: 'permissionDate', 
      label: 'Date & Type', 
      sortable: true,
      render: (_: any, row: PermissionRequest) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.permissionDate}</div>
          <div className="text-xs text-gray-500">{row.permissionType}</div>
        </div>
      )
    },
    { 
      key: 'timing', 
      label: 'Timing', 
      render: (_: any, row: PermissionRequest) => (
        <div className="text-sm">
          {row.startTime} - {row.endTime} <span className="text-gray-500 text-xs">({row.totalHours}h)</span>
        </div>
      )
    },
    { key: 'reason', label: 'Reason', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val: ApprovalStatus) => (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${
          val === ApprovalStatus.Approved ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 
          val === ApprovalStatus.Rejected ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
        }`}>
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: PermissionRequest) => {
        const ActionCell = () => {
          const [isOpen, setIsOpen] = useState(false);
          return (
            <SmartActionMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
              <button onClick={() => { setIsOpen(false); handleAction(row, 'view'); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                <Eye size={14} /> View Details
              </button>
              {row.status === ApprovalStatus.Pending && (
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Short Permissions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage short leaves and permissions for employees</p>
        </div>
        <button 
          onClick={() => handleAction(null, 'create')}
          className="px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium hover:bg-[#52173c] transition-colors whitespace-nowrap"
        >
          Request Permission
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="w-64">
          <CustomInput 
            placeholder="Search permissions..." 
            value={filters.search}
            onChange={(e: any) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <div className="w-48">
          <CustomSelect
            options={[
              { value: '', label: 'All Statuses' },
              { value: ApprovalStatus.Pending, label: 'Pending' },
              { value: ApprovalStatus.Approved, label: 'Approved' },
              { value: ApprovalStatus.Rejected, label: 'Rejected' },
            ]}
            value={filters.status}
            onChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
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
              <p className="text-sm font-medium">No permission requests found.</p>
            </div>
          )}
        </div>
      </div>

      <PermissionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        mode={drawerMode}
        initialData={selectedItem}
        onSave={handleSave}
      />
    </div>
  );
}
