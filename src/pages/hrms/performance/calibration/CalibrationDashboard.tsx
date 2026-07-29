import { useState } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { Search, Filter, CheckCircle, BarChart2 } from 'lucide-react';
import { mockCalibrationRecords } from '../mock/mockPerformanceData';
import type { CalibrationRecord } from '../types';

export default function CalibrationDashboard() {
  const [records, setRecords] = useState<CalibrationRecord[]>(mockCalibrationRecords);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(record => 
    record.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateProposedRating = (id: string, newRating: string) => {
    const val = parseFloat(newRating);
    if(isNaN(val) || val < 0 || val > 5) return;
    
    const updated = records.map(r => r.id === id ? { ...r, proposedRating: val, status: 'Calibrated' as const } : r);
    setRecords(updated);
  };

  const handleApprove = (id: string) => {
    const record = records.find(r => r.id === id);
    if(record) {
      const updated = records.map(r => r.id === id ? { ...r, finalRating: r.proposedRating, status: 'Finalized' as const } : r);
      setRecords(updated);
    }
  };

  const handleFinalizeAll = () => {
    setRecords(records.map(r => ({ ...r, finalRating: r.proposedRating, status: 'Finalized' as const })));
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Calibrated': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Finalized': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const columns = [
    { 
      key: 'employee', 
      label: 'Employee',
      render: (val: any) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{val.name}</p>
          <p className="text-xs text-gray-500">{val.designation} - {val.department}</p>
        </div>
      )
    },
    { 
      key: 'currentRating', 
      label: 'Manager Rating',
      render: (val: any) => <span className="font-semibold text-gray-700 dark:text-gray-300">{val.toFixed(1)}</span>
    },
    { 
      key: 'proposedRating', 
      label: 'Proposed Rating',
      render: (val: any, row: CalibrationRecord) => (
        row.status === 'Finalized' ? (
           <span className="font-semibold text-blue-600 dark:text-blue-400">{val.toFixed(1)}</span>
        ) : (
          <input 
            type="number"
            min="1"
            max="5"
            step="0.1"
            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-[#1f2229] focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
            value={val}
            onChange={(e) => handleUpdateProposedRating(row.id, e.target.value)}
          />
        )
      )
    },
    { 
      key: 'finalRating', 
      label: 'Final Rating',
      render: (val: any) => val ? (
        <span className="font-bold text-primary dark:text-secondary bg-primary/10 px-2 py-1 rounded-sm">{val.toFixed(1)}</span>
      ) : (
        <span className="text-gray-400">-</span>
      )
    },
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
      render: (_: any, row: CalibrationRecord) => (
        <div className="flex items-center gap-2">
          {row.status !== 'Finalized' && (
            <button 
              className="px-3 py-1.5 flex items-center bg-primary hover:bg-primary-dark text-white text-xs font-medium rounded-sm shadow-sm transition-colors" 
              onClick={() => handleApprove(row.id)}
            >
              <CheckCircle size={14} className="mr-1" /> Approve
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Rating Calibration</h2>
          <p className="text-sm text-gray-500">Normalize ratings across departments to ensure fairness.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-sm bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:text-white w-64"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          <button onClick={handleFinalizeAll} className="flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-sm shadow-sm transition-colors">
            <CheckCircle size={16} className="mr-2" />
            Finalize All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm col-span-1 lg:col-span-3">
          <h3 className="text-md font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart2 size={18} className="mr-2 text-primary" />
            Organization Bell Curve (Mock Visualization)
          </h3>
          <div className="h-32 flex items-end justify-between px-8">
            <div className="flex flex-col items-center w-1/5">
              <div className="w-full bg-red-200 rounded-t-sm" style={{ height: '20px' }}></div>
              <span className="text-xs mt-2 text-gray-500">1 (5%)</span>
            </div>
            <div className="flex flex-col items-center w-1/5">
              <div className="w-full bg-orange-200 rounded-t-sm" style={{ height: '60px' }}></div>
              <span className="text-xs mt-2 text-gray-500">2 (15%)</span>
            </div>
            <div className="flex flex-col items-center w-1/5">
              <div className="w-full bg-blue-300 rounded-t-sm border-t-2 border-blue-500" style={{ height: '100px' }}></div>
              <span className="text-xs mt-2 font-bold text-gray-700 dark:text-gray-300">3 (60%)</span>
            </div>
            <div className="flex flex-col items-center w-1/5">
              <div className="w-full bg-green-200 rounded-t-sm" style={{ height: '50px' }}></div>
              <span className="text-xs mt-2 text-gray-500">4 (15%)</span>
            </div>
            <div className="flex flex-col items-center w-1/5">
              <div className="w-full bg-purple-200 rounded-t-sm" style={{ height: '15px' }}></div>
              <span className="text-xs mt-2 text-gray-500">5 (5%)</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm flex flex-col justify-center">
          <p className="text-sm text-gray-500 text-center mb-2">Average Proposed Rating</p>
          <p className="text-4xl font-bold text-center text-primary dark:text-secondary">3.8</p>
          <div className="mt-4 text-xs text-gray-500 space-y-1 text-center border-t border-gray-100 dark:border-gray-800 pt-2">
            <p>Target: 3.5 - 4.0</p>
            <p className="text-green-500">Currently within bounds</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <CustomTable 
            columns={columns}
            data={filteredRecords}
          />
        </div>
      </div>
    </div>
  );
}
