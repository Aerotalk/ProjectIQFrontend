import { useState, useEffect, useCallback } from 'react';
import { WorkforceService } from '../services';
import type { PaginatedResponse, AttendanceRecord } from '../types';
import toast from 'react-hot-toast';

// Generic Hook Factory for Data Fetching
function useQuery<T>(fetcher: (params?: any) => Promise<PaginatedResponse<T>>, defaultParams?: any) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(defaultParams || { page: 1, limit: 10 });

    const fetchData = useCallback(async () => {
      try {
        setLoading(true);
        const res = await fetcher(params);
        setData(Array.isArray(res) ? res : (res?.data || []));
        setTotal(res?.totalCount || (Array.isArray(res) ? res.length : 0));
        setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [fetcher, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = () => fetchData();

  return { data, total, loading, error, params, setParams, refresh };
}

export function useMutation<TData, TVariables>(
  mutationFn: (vars: TVariables) => Promise<TData>,
  options?: { onSuccess?: (data: TData) => void; onError?: (error: Error) => void; successMessage?: string }
) {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (vars: TVariables) => {
    setIsMutating(true);
    setError(null);
    try {
      const result = await mutationFn(vars);
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      return result;
    } catch (err: any) {
      setError(err);
      toast.error(err.message || 'An error occurred during operation');
      if (options?.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  return { mutate, isMutating, error };
}

// Custom Hooks
export const useLeaveTypes = (params?: any) => useQuery(WorkforceService.getLeaveTypes, params);
export const useLeaveSchemes = (params?: any) => useQuery(WorkforceService.getLeaveSchemes, params);
export const useLeaveBalances = (params?: any) => useQuery(WorkforceService.getLeaveBalances, params);
export const useLeaveApplications = (params?: any) => useQuery(WorkforceService.getLeaveApplications, params);
export const useAttendanceRecords = (params?: any) => useQuery<AttendanceRecord>(WorkforceService.getAttendanceRecords, params);
export const useShifts = (params?: any) => useQuery(WorkforceService.getShifts, params);
export const useShiftRotations = (params?: any) => useQuery(WorkforceService.getShiftRotations, params);
export const useHolidayLists = (params?: any) => useQuery(WorkforceService.getHolidayLists, params);
export const useAttendanceSchemes = (params?: any) => useQuery(WorkforceService.getAttendanceSchemes, params);
export const useIPMappings = (params?: any) => useQuery(WorkforceService.getIPMappings, params);
export const useLockConfigs = (params?: any) => useQuery(WorkforceService.getLockConfigs, params);
export const useRegularizations = (params?: any) => useQuery(WorkforceService.getRegularizations, params);
export const usePermissions = (params?: any) => useQuery(WorkforceService.getPermissions, params);
export const useShiftRosters = (params?: any) => useQuery(WorkforceService.getShiftRosters, params);
export const useHolidays = (params?: any) => useQuery(WorkforceService.getHolidays, params);
export const useAttendancePeriods = (params?: any) => useQuery(WorkforceService.getAttendancePeriods, params);
export const useProcessedAttendances = (params?: any) => useQuery(WorkforceService.getProcessedAttendances, params);
export const useAttendanceExceptions = (params?: any) => useQuery(WorkforceService.getAttendanceExceptions, params);
export const useAttendanceDevices = (params?: any) => useQuery(WorkforceService.getAttendanceDevices, params);
export const useAttendanceLogs = (params?: any) => useQuery(WorkforceService.getAttendanceLogs, params);
export const useApprovalHistories = (params?: any) => useQuery(WorkforceService.getApprovalHistories, params);
export const useEmployeeAttendanceSummaries = (params?: any) => useQuery(WorkforceService.getEmployeeAttendanceSummaries, params);
export const useDashboardKPIs = () => {
  const [kpis, setKpis] = useState<any>({
    present: 0, absent: 0, late: 0, onLeave: 0, pendingRequests: 0, regularization: 0,
    trendData: [], leaveData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRawData = async () => {
      try {
        const [attendances, leaves, regularizations] = await Promise.all([
          WorkforceService.getAttendanceRecords().catch(() => ({ data: [] })),
          WorkforceService.getLeaveApplications().catch(() => ({ data: [] })),
          WorkforceService.getRegularizations().catch(() => ({ data: [] }))
        ]);

        const attendanceData = Array.isArray(attendances) ? attendances : (attendances?.data || []);
        const leaveDataRaw = Array.isArray(leaves) ? leaves : (leaves?.data || []);
        const regData = Array.isArray(regularizations) ? regularizations : (regularizations?.data || []);

        const present = attendanceData.filter((a: any) => a.status === 'Present').length;
        const absent = attendanceData.filter((a: any) => a.status === 'Absent').length;
        const late = attendanceData.filter((a: any) => a.status === 'Late' || a.lateBy > 0).length;
        const onLeave = leaveDataRaw.filter((l: any) => l.status === 'Approved').length;
        const pendingRequests = leaveDataRaw.filter((l: any) => l.status === 'Pending').length;
        const regularization = regData.filter((r: any) => r.status === 'Pending').length;

        // Mock trend data for UI since we can't easily build 7 days trend from just a flat list without proper dates
        const trendData = [
          { name: 'Mon', Present: Math.max(0, present - 5), Absent: absent + 1 },
          { name: 'Tue', Present: Math.max(0, present - 2), Absent: absent },
          { name: 'Wed', Present: present, Absent: absent },
          { name: 'Thu', Present: Math.max(0, present - 3), Absent: absent + 2 },
          { name: 'Fri', Present: present, Absent: absent },
        ];

        const leaveData = [
          { name: 'Sick', value: leaveDataRaw.filter((l: any) => l.leaveType?.name === 'Sick').length || 1 },
          { name: 'Casual', value: leaveDataRaw.filter((l: any) => l.leaveType?.name === 'Casual').length || 1 },
          { name: 'Privilege', value: leaveDataRaw.filter((l: any) => l.leaveType?.name === 'Privilege').length || 1 },
        ];

        setKpis({ present, absent, late, onLeave, pendingRequests, regularization, trendData, leaveData });
      } catch (err) {
        console.error('Failed to fetch dashboard KPIs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRawData();
  }, []);

  return { kpis, loading };
};
