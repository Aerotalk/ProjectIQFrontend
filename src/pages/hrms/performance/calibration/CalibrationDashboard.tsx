import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import { Skeleton } from '../../../../components/ui/skeleton';
import type { CalibrationRecord } from './../types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';
import { performanceService } from '../../../../services/performance.service';

export default function CalibrationDashboard() {
  const [records, setRecords] = useState<CalibrationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiRecords = await performanceService.getCalibrationRecords();
      if (Array.isArray(apiRecords)) {
        setRecords(apiRecords.map((r: any) => ({
          id: r.id,
          employee: {
            id: r.employee?.id || 'EMP-01',
            name: r.employee?.firstName ? `${r.employee.firstName} ${r.employee.lastName}` : 'Employee',
            designation: r.employee?.designation?.designationName || 'Staff',
            department: r.employee?.department?.departmentName || 'General'
          },
          cycleId: r.cycle?.id || 'C-2026-01',
          currentRating: r.currentRating || 0,
          proposedRating: r.proposedRating || 0,
          finalRating: r.finalRating,
          reviewer: r.reviewer || 'HR Committee',
          status: r.status || 'Pending'
        })));
      }
    } catch (e) {
      toast.error('Failed to load calibration records');
      setRecords([]);
    }
    setLoading(false);
  };

  const handleUpdateRating = async (id: string, proposedRating: number) => {
    try {
      await performanceService.updateCalibration(id, { proposedRating, status: 'Pending' });
      toast.success('Calibration rating updated');
      fetchData();
    } catch (e) {
      toast.error('Error updating calibration');
    }
  };

  const handleFinalize = async (id: string) => {
    try {
      await performanceService.finalizeCalibration(id);
      toast.success('Rating finalized');
      fetchData();
    } catch (e) {
      toast.error('Error finalizing rating');
    }
  };

  const columns = [
    { key: 'employee', label: 'Employee', render: (val: any) => val?.name || '-' },
    { key: 'currentRating', label: 'Manager Rating', render: (val: number) => val ? val.toFixed(1) : '-' },
    { key: 'proposedRating', label: 'Calibrated Rating', render: (val: number) => val ? val.toFixed(1) : '-' },
    { key: 'finalRating', label: 'Final Rating', render: (val: number) => val ? val.toFixed(1) : 'Not Set' },
    { key: 'reviewer', label: 'Reviewer' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: CalibrationRecord) => (
        <TableRowActionMenu
          actions={[
            { label: 'Adjust Rating (+0.2)', onClick: () => handleUpdateRating(row.id, row.currentRating + 0.2) },
            { label: 'Adjust Rating (-0.2)', onClick: () => handleUpdateRating(row.id, Math.max(1, row.currentRating - 0.2)) },
            ...(row.status !== 'Finalized' ? [{ label: 'Finalize Rating', onClick: () => handleFinalize(row.id) }] : [])
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Calibration</h3>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={records} />
      </div>
    </div>
  );
}
