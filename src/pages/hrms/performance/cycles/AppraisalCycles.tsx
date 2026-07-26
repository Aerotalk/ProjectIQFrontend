import { useState } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { Plus, Search, Filter, Play, Archive, Edit } from 'lucide-react';
import { mockCycles } from '../mock/mockPerformanceData';
import type { AppraisalCycle } from '../types';
import CycleDrawer from './CycleDrawer';

export default function AppraisalCycles() {
  const [cycles, setCycles] = useState<AppraisalCycle[]>(mockCycles);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<AppraisalCycle | null>(null);

  const handleOpenDrawer = (cycle?: AppraisalCycle) => {
    setSelectedCycle(cycle || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedCycle(null);
  };

  const handleLaunchCycle = (id: string) => {
    setCycles(cycles.map(c => c.id === id ? { ...c, status: 'Active' } : c));
  };

  const handleArchiveCycle = (id: string) => {
    setCycles(cycles.map(c => c.id === id ? { ...c, status: 'Completed' } : c));
  };

  const filteredCycles = cycles.filter(cycle => 
    cycle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cycle.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'Review Phase': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Cycle Name',
      render: (_: any, row: AppraisalCycle) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
          <p className="text-xs text-gray-500">{row.type}</p>
        </div>
      )
    },
    { key: 'period', label: 'Review Period' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { 
      key: 'completionPercentage', 
      label: 'Completion %',
      render: (val: any) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div className="bg-[#792359] dark:bg-[#e6a8d0] h-1.5 rounded-full" style={{ width: `${val}%` }}></div>
          </div>
          <span className="text-xs text-gray-500">{val}%</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val: any) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(val)}`}>
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: AppraisalCycle) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenDrawer(row)} className="p-1 text-gray-500 hover:text-[#792359] dark:hover:text-[#e6a8d0] transition-colors" title="View/Edit">
            <Edit size={16} />
          </button>
          {row.status === 'Draft' && (
            <button 
              className="p-1 text-gray-500 hover:text-green-600 transition-colors" 
              title="Launch Cycle"
              onClick={() => handleLaunchCycle(row.id)}
            >
              <Play size={16} />
            </button>
          )}
          {row.status === 'Completed' && (
            <button 
              className="p-1 text-gray-500 hover:text-orange-600 transition-colors" 
              title="Archive"
              onClick={() => handleArchiveCycle(row.id)}
            >
              <Archive size={16} />
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appraisal Cycles</h2>
          <p className="text-sm text-gray-500">Manage performance review cycles and timelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search cycles..."
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
            New Cycle
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <CustomTable 
            columns={columns}
            data={filteredCycles}
          />
        </div>
      </div>

      {/* Drawer */}
      <CycleDrawer 
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        cycle={selectedCycle}
      />
    </div>
  );
}
