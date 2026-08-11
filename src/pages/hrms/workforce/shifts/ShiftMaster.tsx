import { useState, useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { useShifts } from '../hooks';
import { Clock, Edit2, Eye, Sun, Moon, Plus } from 'lucide-react';
import { Input as CustomInput } from '../../../../components/ui/input';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import type { Shift } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ShiftMaster() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading } = useShifts({ search: searchTerm });
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';

  const columns = useMemo(() => [
    { 
      key: 'shiftName', 
      label: 'Shift Name', 
      sortable: true,
      render: (val: string, row: Shift) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
            {row.nightShift ? <Moon size={14} className="text-purple-500" /> : <Sun size={14} className="text-orange-500" />}
            {val}
          </div>
          <div className="text-xs text-gray-500">{row.shiftCode}</div>
        </div>
      )
    },
    { 
      key: 'start', 
      label: 'Timings', 
      sortable: false,
      render: (_val: any, row: Shift) => (
        <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Clock size={14} className="text-primary dark:text-secondary" />
          {row.startTime} - {row.endTime}
        </span>
      )
    },
    { key: 'graceTime', label: 'Grace (Mins)', sortable: true },
    { key: 'halfDayHours', label: 'Half Day (Hrs)', sortable: true },
    { key: 'fullDayHours', label: 'Full Day (Hrs)', sortable: true },
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
      render: (_: any, row: Shift) => {
        const ActionCell = () => {
          const [isOpen, setIsOpen] = useState(false);
          return (
            <SmartActionMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
              <button onClick={() => { setIsOpen(false); navigate(`${basePath}/hrms/workforce/shift/${row.id}?mode=view`); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                <Eye size={14} /> View Details
              </button>
              <button onClick={() => { setIsOpen(false); navigate(`${basePath}/hrms/workforce/shift/${row.id}`); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                <Edit2 size={14} /> Edit Shift
              </button>
            </SmartActionMenu>
          );
        };
        return <ActionCell />;
      }
    }
  ], [navigate, basePath]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shift Master</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure standard working hours and shift timings</p>
        </div>
        <button 
          onClick={() => navigate(`${basePath}/hrms/workforce/shift/new`)}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors whitespace-nowrap"
        >
          <Plus size={16} className="mr-2" />
          Add Shift
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-72">
          <CustomInput 
            placeholder="Search shifts..." 
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
              <Clock size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No shifts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
