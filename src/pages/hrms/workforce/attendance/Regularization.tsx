import { useState, useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { WorkforceService } from '../services';
import { useRegularizations, useMutation } from '../hooks';
import RegularizationDrawer from './RegularizationDrawer';
import { Edit2, Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Input as CustomInput } from '../../../../components/ui/input';
import CustomSelect from '../../../../components/ui/CustomSelect';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import { ApprovalStatus } from '../types';
import type { RegularizationRequest } from '../types';

export default function Regularization() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedItem, setSelectedItem] = useState<RegularizationRequest | null>(null);
  const [filters, setFilters] = useState({ search: '', status: '' });

  const { data, loading, refresh } = useRegularizations(filters);

  const createMutation = useMutation(
    (newData: any) => WorkforceService.createRegularization(newData),
    {
      successMessage: 'Regularization request submitted successfully',
      onSuccess: () => {
        refresh();
        setIsDrawerOpen(false);
      }
    }
  );

  const updateMutation = useMutation(
    (newData: any) => WorkforceService.updateRegularization(selectedItem?.id as string, newData),
    {
      successMessage: 'Regularization request updated successfully',
      onSuccess: () => {
        refresh();
        setIsDrawerOpen(false);
      }
    }
  );

  const approveMutation = useMutation(
    (id: string) => WorkforceService.approveRegularization(id),
    {
      successMessage: 'Regularization request approved',
      onSuccess: () => refresh()
    }
  );

  const rejectMutation = useMutation(
    (id: string) => WorkforceService.rejectRegularization(id),
    {
      successMessage: 'Regularization request rejected',
      onSuccess: () => refresh()
    }
  );

  const handleAction = (item: RegularizationRequest | null, mode: 'create' | 'edit' | 'view') => {
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
    { key: 'requestNumber', label: 'Req #', sortable: true },
    { 
      key: 'employeeName', 
      label: 'Employee', 
      sortable: true,
      render: (_: any, row: RegularizationRequest) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.employeeName}</div>
          <div className="text-xs text-gray-500">{row.department}</div>
        </div>
      )
    },
    { key: 'date', label: 'Date', sortable: true },
    { 
      key: 'times', 
      label: 'Requested Times', 
      render: (_: any, row: RegularizationRequest) => (
        <div className="text-xs">
          <div><span className="text-gray-500">In:</span> {row.requestedCheckIn || row.inTime || '--:--'}</div>
          <div><span className="text-gray-500">Out:</span> {row.requestedCheckOut || row.outTime || '--:--'}</div>
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
      render: (_: any, row: RegularizationRequest) => {
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
                  <button onClick={() => { setIsOpen(false); approveMutation.mutate(row.id); }} className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 flex items-center gap-2">
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button onClick={() => { setIsOpen(false); rejectMutation.mutate(row.id); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
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
  ], [approveMutation, rejectMutation]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Regularization Requests</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Review and manage employee attendance regularizations</p>
        </div>
        <button 
          onClick={() => handleAction(null, 'create')}
          className="px-4 py-2 bg-primary text-white rounded-sm text-sm font-medium hover:bg-primary-dark transition-colors whitespace-nowrap"
        >
          Request Regularization
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="w-64">
          <CustomInput 
            placeholder="Search requests..." 
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
              <AlertCircle size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No regularization requests found.</p>
            </div>
          )}
        </div>
      </div>

      <RegularizationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        mode={drawerMode}
        initialData={selectedItem}
        onSave={handleSave}
      />
    </div>
  );
}
