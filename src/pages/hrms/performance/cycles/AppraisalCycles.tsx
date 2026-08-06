import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import CycleDrawer from './CycleDrawer';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus, Search, Filter } from 'lucide-react';
import type { AppraisalCycle } from '../types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';

export default function AppraisalCycles() {
  const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedCycle, setSelectedCycle] = useState<AppraisalCycle | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiCycles = await api.get('/hrms/performance/cycles');
      if (Array.isArray(apiCycles)) {
        setCycles(apiCycles.map((c: any) => ({
          id: c.id,
          name: c.name,
          type: c.type || 'Annual',
          period: c.period || `${c.startDate || ''} - ${c.endDate || ''}`,
          startDate: c.startDate || '',
          endDate: c.endDate || '',
          selfReviewDeadline: c.selfReviewDeadline || '',
          managerReviewDeadline: c.managerReviewDeadline || '',
          hrReviewDeadline: c.hrReviewDeadline || '',
          departments: ['All'],
          locations: ['All'],
          grades: ['All'],
          eligibleCount: c.eligibleCount || 0,
          completionPercentage: c.completionPercentage || 0,
          status: c.status || 'Active',
          description: c.description || ''
        })));
      }
    } catch (e) {
      toast.error('Failed to load appraisal cycles');
      setCycles([]);
    }
    setLoading(false);
  };

  const handleSave = async (data: any) => {
    try {
      if (drawerMode === 'create') {
        await api.post('/hrms/performance/cycles', {
          name: data.name,
          type: data.type,
          period: `${data.startDate} - ${data.endDate}`,
          startDate: data.startDate,
          endDate: data.endDate,
          selfReviewDeadline: data.selfReviewDeadline,
          managerReviewDeadline: data.managerReviewDeadline,
          hrReviewDeadline: data.hrReviewDeadline,
          status: 'Active',
          description: data.description
        });
        toast.success('Appraisal cycle created');
      } else if (drawerMode === 'edit' && selectedCycle) {
        await api.put(`/hrms/performance/cycles/${selectedCycle.id}`, {
          name: data.name,
          type: data.type,
          period: `${data.startDate} - ${data.endDate}`,
          startDate: data.startDate,
          endDate: data.endDate,
          selfReviewDeadline: data.selfReviewDeadline,
          managerReviewDeadline: data.managerReviewDeadline,
          hrReviewDeadline: data.hrReviewDeadline,
          description: data.description
        });
        toast.success('Appraisal cycle updated');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Error saving cycle');
    }
  };

  const columns = [
    { key: 'name', label: 'Cycle Name' },
    { key: 'type', label: 'Type' },
    { key: 'period', label: 'Period' },
    { key: 'eligibleCount', label: 'Eligible Count' },
    { 
      key: 'completionPercentage', 
      label: 'Completion',
      render: (val: number) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${val || 0}%` }}></div>
          </div>
          <span className="text-xs">{val || 0}%</span>
        </div>
      )
    },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: AppraisalCycle) => (
        <TableRowActionMenu
          actions={[
            { label: 'View / Edit', onClick: () => { setSelectedCycle(row); setDrawerMode('edit'); setIsDrawerOpen(true); } }
          ]}
        />
      )
    }
  ];

  if (loading) {
    return <div className="p-4"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#181a1f] p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search cycles..." 
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-white/10 rounded-md bg-transparent text-sm w-64 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="p-2 border border-gray-200 dark:border-white/10 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
            <Filter size={16} />
          </button>
        </div>
        <button 
          onClick={() => { setDrawerMode('create'); setSelectedCycle(null); setIsDrawerOpen(true); }}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          New Appraisal Cycle
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={cycles} />
      </div>

      <CycleDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
        mode={drawerMode}
        initialData={selectedCycle || undefined}
      />
    </div>
  );
}
