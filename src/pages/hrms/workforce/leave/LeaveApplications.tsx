import { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useLeaveApplications, useMutation } from '../hooks';
import { WorkforceService } from '../services';
import CustomTable from '../../../../components/ui/CustomTable';
import LeaveApplicationDrawer from './LeaveApplicationDrawer';
import { Skeleton } from '../../../../components/ui/skeleton';

export default function LeaveApplications() {
  const { data, loading, params, setParams, refresh } = useLeaveApplications();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const columns = useMemo(() => [
    { key: 'employeeId', label: 'Employee', sortable: true },
    { key: 'leaveTypeId', label: 'Leave Type', sortable: true },
    { key: 'fromDate', label: 'From Date', sortable: true },
    { key: 'toDate', label: 'To Date', sortable: true },
    { key: 'duration', label: 'Duration (Days)', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val: string) => (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${
          val === 'Approved' ? 'bg-green-100 text-green-700' :
          val === 'Rejected' ? 'bg-red-100 text-red-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {val}
        </span>
      )
    },
  ], []);

  const handleRowClick = (app: any) => {
    setSelectedApp(app);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const createMutation = useMutation(
    (newData: any) => WorkforceService.createLeaveApplication(newData),
    {
      onSuccess: () => {
        refresh();
        setIsDrawerOpen(false);
      }
    }
  );

  const updateMutation = useMutation(
    (newData: any) => WorkforceService.updateLeaveApplication(selectedApp.id, newData),
    {
      onSuccess: () => {
        refresh();
        setIsDrawerOpen(false);
      }
    }
  );

  const handleCreate = () => {
    setSelectedApp(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleSave = async (formData: any) => {
    if (drawerMode === 'create') {
      await createMutation.mutate(formData);
    } else {
      await updateMutation.mutate(formData);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Applications</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and view employee leave requests</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search applications..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#792359] focus:border-[#792359]"
              value={params.search || ''}
              onChange={(e) => setParams({ ...params, search: e.target.value })}
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-sm font-medium">
            <Filter size={16} />
            Filters
          </button>
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#792359] text-white rounded-sm hover:bg-[#52173c] transition-colors text-sm font-medium shadow-sm"
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
            <CustomTable 
              columns={columns}
              data={data}
              onRowClick={handleRowClick}
              sortColumn={params.sortBy}
              sortDirection={params.order}
              onSort={(col, dir) => setParams({ ...params, sortBy: col, order: dir })}
            />
            {data.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <FileText size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No leave applications yet</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                  There are currently no leave requests to display. Click "Apply Leave" to create your first request.
                </p>
                <button 
                  onClick={handleCreate}
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

// Add FileText import as it was used in empty state
import { FileText } from 'lucide-react';
