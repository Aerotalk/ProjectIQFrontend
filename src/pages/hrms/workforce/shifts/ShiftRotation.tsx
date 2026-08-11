import { useState, useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { useShiftRotations } from '../hooks';
import { Edit2, Eye, Repeat, Plus } from 'lucide-react';
import { Input as CustomInput } from '../../../../components/ui/input';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import type { ShiftRotationPattern } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ShiftRotation() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading } = useShiftRotations({ search: searchTerm });
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';

  const columns = useMemo(() => [
    { 
      key: 'patternName', 
      label: 'Pattern Name', 
      sortable: true,
      render: (val: string, row: ShiftRotationPattern) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
            <Repeat size={14} className="text-blue-500" />
            {val}
          </div>
          <div className="text-xs text-gray-500">{row.rotationDays} Days Cycle</div>
        </div>
      )
    },
    { 
      key: 'patternSequence', 
      label: 'Sequence', 
      sortable: false,
      render: (val: string[]) => (
        <div className="flex gap-1 flex-wrap">
          {val.map((shift, i) => (
            <span key={i} className="px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300 text-[10px] font-medium tracking-wide">
               {shift}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: ShiftRotationPattern) => {
        const ActionCell = () => {
          const [isOpen, setIsOpen] = useState(false);
          return (
            <SmartActionMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
              <button onClick={() => { setIsOpen(false); navigate(`${basePath}/hrms/workforce/shift-rotation/${row.id}?mode=view`); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                <Eye size={14} /> View Details
              </button>
              <button onClick={() => { setIsOpen(false); navigate(`${basePath}/hrms/workforce/shift-rotation/${row.id}`); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                <Edit2 size={14} /> Edit Pattern
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shift Rotation</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage shift rotation patterns</p>
        </div>
        <button 
          onClick={() => navigate(`${basePath}/hrms/workforce/shift-rotation/new`)}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors whitespace-nowrap"
        >
          <Plus size={16} className="mr-2" />
          Add Pattern
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-72">
          <CustomInput 
            placeholder="Search patterns..." 
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
              <Repeat size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No rotation patterns found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
