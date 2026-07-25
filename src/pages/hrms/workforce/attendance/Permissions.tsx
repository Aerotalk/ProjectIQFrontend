import { useState, useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { WorkforceService } from '../services';
import { usePermissions, useMutation } from '../hooks';
import PermissionDrawer from './PermissionDrawer';
import { Edit2, Search } from 'lucide-react';
import { Input } from '../../../../components/ui/input';

export default function Permissions() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading, refresh } = usePermissions({ search: searchTerm });

  const createMutation = useMutation(
    (newData: any) => WorkforceService.createPermission(newData),
    {
      onSuccess: () => {
        refresh();
        setIsDrawerOpen(false);
      }
    }
  );

  const updateMutation = useMutation(
    (newData: any) => WorkforceService.updatePermission(selectedItem?.id, newData),
    {
      onSuccess: () => {
        refresh();
        setIsDrawerOpen(false);
      }
    }
  );

  const handleCreate = () => {
    setDrawerMode('create');
    setSelectedItem(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (item: any) => {
    setDrawerMode('edit');
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
    { key: 'employeeId', label: 'Employee', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'startTime', label: 'Start Time', sortable: true },
    { key: 'endTime', label: 'End Time', sortable: true },
    { key: 'reason', label: 'Reason', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: any) => (
        <button 
          onClick={() => handleEdit(row)}
          className="p-1.5 text-gray-400 hover:text-[#792359] hover:bg-[#792359]/10 rounded-sm transition-colors"
        >
          <Edit2 size={16} />
        </button>
      )
    }
  ], []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Short Permissions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage short leaves (1-2 hours) for employees</p>
        </div>
        <button 
          onClick={handleCreate}
          className="px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium hover:bg-[#52173c] transition-colors"
        >
          Request Permission
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            placeholder="Search permissions..." 
            className="pl-9 bg-gray-50 dark:bg-white/[0.02] border-gray-200 dark:border-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#181a1f]">
          <CustomTable 
            columns={columns} 
            data={data} 
            loading={loading}
          />
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
