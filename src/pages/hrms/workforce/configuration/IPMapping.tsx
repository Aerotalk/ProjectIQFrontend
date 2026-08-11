import { useState, useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { WorkforceService } from '../services';
import { useIPMappings, useMutation } from '../hooks';
import { Edit2, Trash2, Globe, MapPin, Plus } from 'lucide-react';
import { Input as CustomInput } from '../../../../components/ui/input';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import type { IPMapping } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

export default function IPMappingComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, refresh } = useIPMappings({ search: searchTerm });
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';

  const deleteMutation = useMutation(
    (id: string) => WorkforceService.deleteIPMapping(id),
    {
      successMessage: 'IP mapping deleted successfully',
      onSuccess: () => {
        refresh();
      }
    }
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this IP Mapping?')) {
      await deleteMutation.mutate(id);
    }
  };

  const columns = useMemo(() => [
    { 
      key: 'ipAddress', 
      label: 'IP Address / CIDR', 
      sortable: true,
      render: (val: string, row: IPMapping) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
            <Globe size={14} className="text-blue-500" />
            {val}
          </div>
          <div className="text-xs text-gray-500 truncate">{row.description || 'No description'}</div>
        </div>
      )
    },
    { 
      key: 'locationId', 
      label: 'Location', 
      sortable: true,
      render: (val: string) => (
        <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
          <MapPin size={14} className="text-gray-400" />
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: IPMapping) => {
        const ActionCell = () => {
          const [isOpen, setIsOpen] = useState(false);
          return (
            <SmartActionMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
              <button onClick={() => { setIsOpen(false); navigate(`${basePath}/hrms/workforce/ip-mapping/${row.id}`); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                <Edit2 size={14} /> Edit Mapping
              </button>
              <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
              <button onClick={() => { setIsOpen(false); handleDelete(row.id); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                <Trash2 size={14} /> Delete Mapping
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">IP Mapping</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure allowed IP ranges for web check-in</p>
        </div>
        <button 
          onClick={() => navigate(`${basePath}/hrms/workforce/ip-mapping/new`)}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors whitespace-nowrap"
        >
          <Plus size={16} className="mr-2" />
          Add IP Address
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-72">
          <CustomInput 
            placeholder="Search IP mappings..." 
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
              <Globe size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No IP mappings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
