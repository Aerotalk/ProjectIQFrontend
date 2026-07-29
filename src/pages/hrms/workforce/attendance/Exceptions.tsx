import { useState, useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { ShieldAlert, Clock, CheckCircle, Eye, AlertCircle } from 'lucide-react';
import { useAttendanceExceptions, useMutation } from '../hooks';
import { WorkforceService } from '../services';
import { Input as CustomInput } from '../../../../components/ui/input';
import CustomSelect from '../../../../components/ui/CustomSelect';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import type { AttendanceException } from '../types';

export default function Exceptions() {
  const [filters, setFilters] = useState({ search: '', resolved: '' });
  const { data, loading, refresh } = useAttendanceExceptions(filters);

  const resolveMutation = useMutation(
    (id: string) => WorkforceService.updateAttendanceException(id, { resolved: true }),
    {
      successMessage: 'Exception resolved successfully',
      onSuccess: () => refresh()
    }
  );

  const columns = useMemo(() => [
    { 
      key: 'employeeName', 
      label: 'Employee', 
      sortable: true,
      render: (_: any, row: AttendanceException) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.employeeName}</div>
          <div className="text-xs text-gray-500">{row.employeeCode}</div>
        </div>
      )
    },
    { key: 'createdAt', label: 'Date', sortable: true, render: (val: string) => new Date(val).toLocaleDateString() },
    { 
      key: 'exceptionType', 
      label: 'Exception Type', 
      sortable: true,
      render: (val: string, row: AttendanceException) => (
        <span className={`flex items-center gap-1.5 font-medium text-xs ${row.severity === 'High' ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
          <ShieldAlert size={12} />
          {val}
        </span>
      )
    },
    { key: 'description', label: 'Description', sortable: true },
    { 
      key: 'resolved', 
      label: 'Status', 
      sortable: true,
      render: (val: boolean) => (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${val ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'}`}>
          {val ? 'Resolved' : 'Pending'}
        </span>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: AttendanceException) => {
        const ActionCell = () => {
          const [isOpen, setIsOpen] = useState(false);
          return (
            <SmartActionMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
              <button onClick={() => { setIsOpen(false); /* view */ }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                <Eye size={14} /> View Details
              </button>
              {!row.resolved && (
                <>
                  <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
                  <button onClick={() => { setIsOpen(false); resolveMutation.mutate(row.id); }} className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 flex items-center gap-2">
                    <CheckCircle size={14} /> Mark Resolved
                  </button>
                  <button onClick={() => { setIsOpen(false); /* trigger regularization modal */ }} className="w-full text-left px-4 py-2 text-sm text-primary dark:text-secondary hover:bg-primary/5 flex items-center gap-2">
                    <AlertCircle size={14} /> Request Regularization
                  </button>
                </>
              )}
            </SmartActionMenu>
          );
        };
        return <ActionCell />;
      }
    }
  ], []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Exceptions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage late arrivals, missing swipes, and early outs</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="w-64">
          <CustomInput 
            placeholder="Search exceptions..." 
            value={filters.search}
            onChange={(e: any) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <div className="w-48">
          <CustomSelect
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'false', label: 'Pending' },
              { value: 'true', label: 'Resolved' },
            ]}
            value={filters.resolved}
            onChange={(val) => setFilters(prev => ({ ...prev, resolved: val }))}
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
              <p className="text-sm font-medium">No exceptions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
