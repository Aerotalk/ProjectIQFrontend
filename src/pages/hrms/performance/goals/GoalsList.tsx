import { useState } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { Plus, Search, Filter, Edit, CheckCircle } from 'lucide-react';
import { mockGoals } from '../mock/mockPerformanceData';
import type { Goal } from '../types';
import GoalDrawer from './GoalDrawer';

export default function GoalsList() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const handleOpenDrawer = (goal?: Goal) => {
    setSelectedGoal(goal || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedGoal(null);
  };

  const handleCompleteGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, status: 'Completed', progress: 100 } : g));
  };

  const filteredGoals = goals.filter(goal => 
    goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Not Started': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'Under Review': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Goal',
      render: (_: any, row: Goal) => (
        <div className="max-w-xs">
          <p className="font-medium text-gray-900 dark:text-white truncate">{row.title}</p>
          <p className="text-xs text-gray-500 truncate">{row.category}</p>
        </div>
      )
    },
    { 
      key: 'employee', 
      label: 'Employee',
      render: (val: any) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{val.name}</p>
          <p className="text-xs text-gray-500">{val.department}</p>
        </div>
      )
    },
    { key: 'weightage', label: 'Weightage', render: (val: any) => `${val}%` },
    { 
      key: 'target', 
      label: 'Target / Current',
      render: (_: any, row: Goal) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {row.currentValue} / {row.targetValue} {row.unit}
        </div>
      )
    },
    { 
      key: 'progress', 
      label: 'Progress',
      render: (val: any) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${val >= 100 ? 'bg-green-500' : 'bg-[#792359] dark:bg-[#e6a8d0]'}`} 
              style={{ width: `${Math.min(val, 100)}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">{val}%</span>
        </div>
      )
    },
    { key: 'dueDate', label: 'Due Date' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val: any) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(val)}`}>
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Goal) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenDrawer(row)} className="p-1 text-gray-500 hover:text-[#792359] dark:hover:text-[#e6a8d0] transition-colors" title="View/Edit">
            <Edit size={16} />
          </button>
          {row.status !== 'Completed' && (
            <button 
              className="p-1 text-gray-500 hover:text-green-600 transition-colors" 
              title="Mark Complete"
              onClick={() => handleCompleteGoal(row.id)}
            >
              <CheckCircle size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Goals & KRAs</h2>
          <p className="text-sm text-gray-500">Track and update key results for the organization.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-sm bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-1 focus:ring-[#792359] dark:text-white w-64"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          <button onClick={() => handleOpenDrawer()} className="flex items-center px-4 py-2 bg-[#792359] hover:bg-[#52173c] text-white text-sm font-medium rounded-sm shadow-sm transition-colors">
            <Plus size={16} className="mr-2" />
            New Goal
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <CustomTable 
            columns={columns}
            data={filteredGoals}
          />
        </div>
      </div>

      {/* Drawer */}
      <GoalDrawer 
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        goal={selectedGoal}
      />
    </div>
  );
}
