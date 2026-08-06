import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import GoalDrawer from './GoalDrawer';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus, Search, Filter } from 'lucide-react';
import type { Goal, AppraisalCycle } from '../types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';

export default function GoalsList() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apiGoals, apiCycles] = await Promise.all([
        api.get('/hrms/performance/goals').catch(() => []),
        api.get('/hrms/performance/cycles').catch(() => [])
      ]);

      if (Array.isArray(apiGoals)) {
        setGoals(apiGoals.map((g: any) => ({
          id: g.id,
          title: g.title,
          description: g.description || '',
          employee: {
            id: g.employee?.id || 'EMP-01',
            name: g.employee?.firstName ? `${g.employee.firstName} ${g.employee.lastName}` : 'Employee',
            designation: g.employee?.designation?.designationName || 'Staff',
            department: g.employee?.department?.departmentName || 'General'
          },
          cycleId: g.cycle?.id || g.cycleId || 'C-2026-01',
          category: g.category || 'Productivity',
          weightage: g.weightage || 20,
          kpi: g.kpi || '',
          targetValue: g.targetValue || 100,
          currentValue: g.currentValue || 0,
          unit: g.unit || '%',
          dueDate: g.dueDate || '',
          priority: g.priority || 'Medium',
          status: g.status || 'In Progress',
          progress: g.progress || 0
        })));
      }

      if (Array.isArray(apiCycles)) {
        setCycles(apiCycles.map((c: any) => ({
          id: c.id,
          name: c.name,
          type: c.type || 'Annual',
          period: c.period || '',
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
      toast.error('Failed to load goals');
      setGoals([]);
      setCycles([]);
    }
    setLoading(false);
  };

  const handleSave = async (data: any) => {
    try {
      if (drawerMode === 'create') {
        await api.post('/hrms/performance/goals', {
          title: data.title,
          description: data.description,
          category: data.category,
          weightage: data.weightage,
          kpi: data.kpi,
          targetValue: data.targetValue,
          currentValue: data.currentValue,
          unit: data.unit,
          dueDate: data.dueDate,
          priority: data.priority,
          status: 'In Progress'
        });
        toast.success('Goal created');
      } else if (drawerMode === 'edit' && selectedGoal) {
        await api.put(`/hrms/performance/goals/${selectedGoal.id}`, {
          title: data.title,
          description: data.description,
          category: data.category,
          weightage: data.weightage,
          kpi: data.kpi,
          targetValue: data.targetValue,
          currentValue: data.currentValue,
          unit: data.unit,
          dueDate: data.dueDate,
          priority: data.priority
        });
        toast.success('Goal updated');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Error saving goal');
    }
  };

  const columns = [
    { key: 'title', label: 'Goal Title' },
    { key: 'category', label: 'Category' },
    { key: 'weightage', label: 'Weightage', render: (val: number) => `${val}%` },
    { key: 'priority', label: 'Priority' },
    { 
      key: 'progress', 
      label: 'Progress',
      render: (val: number) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="bg-green-500 h-full rounded-full" style={{ width: `${val || 0}%` }}></div>
          </div>
          <span className="text-xs">{val || 0}%</span>
        </div>
      )
    },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Goal) => (
        <TableRowActionMenu
          actions={[
            { label: 'View / Edit', onClick: () => { setSelectedGoal(row); setDrawerMode('edit'); setIsDrawerOpen(true); } }
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
              placeholder="Search goals..." 
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-white/10 rounded-md bg-transparent text-sm w-64 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="p-2 border border-gray-200 dark:border-white/10 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
            <Filter size={16} />
          </button>
        </div>
        <button 
          onClick={() => { setDrawerMode('create'); setSelectedGoal(null); setIsDrawerOpen(true); }}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Goal / KRA
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={goals} />
      </div>

      <GoalDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
        mode={drawerMode}
        cycles={cycles}
        initialData={selectedGoal || undefined}
      />
    </div>
  );
}
