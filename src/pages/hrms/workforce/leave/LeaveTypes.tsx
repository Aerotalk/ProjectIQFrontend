import { useState, useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { WorkforceService } from '../services';
import { useLeaveTypes, useMutation } from '../hooks';
import LeaveTypeDrawer from './LeaveTypeDrawer';
import { Edit2, Eye, Briefcase } from 'lucide-react';
import { Input as CustomInput } from '../../../../components/ui/input';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import type { LeaveType } from '../types';

export default function LeaveTypes() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedItem, setSelectedItem] = useState<LeaveType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading, refresh } = useLeaveTypes({ search: searchTerm });

  const createMutation = useMutation(
    (newData: any) => WorkforceService.createLeaveType(newData),
    {
      successMessage: 'Leave type created successfully',
      onSuccess: () => {
        refresh();
        setIsDrawerOpen(false);
      }
    }
  );

  const updateMutation = useMutation(
    (newData: any) => WorkforceService.updateLeaveType(selectedItem?.id as string, newData),
    {
      successMessage: 'Leave type updated successfully',
      onSuccess: () => {
        refresh();
        setIsDrawerOpen(false);
      }
    }
  );

  const handleAction = (item: LeaveType | null, mode: 'create' | 'edit' | 'view') => {
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
    { 
      key: 'name', 
      label: 'Leave Type', 
      sortable: true,
      render: (val: string, row: LeaveType) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{val}</div>
          <div className="text-xs text-gray-500">{row.code}</div>
        </div>
      )
    },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'unit', label: 'Unit', sortable: true },
    { 
      key: 'active', 
      label: 'Status', 
      sortable: true,
      render: (val: boolean) => (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${val ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: LeaveType) => {
        const ActionCell = () => {
          const [isOpen, setIsOpen] = useState(false);
          return (
            <SmartActionMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
              <button onClick={() => { setIsOpen(false); handleAction(row, 'view'); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                <Eye size={14} /> View Details
              </button>
              <button onClick={() => { setIsOpen(false); handleAction(row, 'edit'); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                <Edit2 size={14} /> Edit Type
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Types</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage different types of leaves available</p>
        </div>
        <button 
          onClick={() => handleAction(null, 'create')}
          className="px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium hover:bg-[#52173c] transition-colors whitespace-nowrap"
        >
          Add Leave Type
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-72">
          <CustomInput 
            placeholder="Search leave types..." 
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
              <Briefcase size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No leave types found.</p>
            </div>
          )}
        </div>
      </div>

      <LeaveTypeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        mode={drawerMode}
        initialData={selectedItem}
        onSave={handleSave}
      />
    </div>
  );
}
