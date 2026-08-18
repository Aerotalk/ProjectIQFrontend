import { api } from '@/lib/api';

import type { 
  LeaveType, LeaveScheme, LeaveApplication, 
  AttendanceRecord, Shift, RegularizationRequest, PermissionRequest
} from '../types';

export const WorkforceService = {
  // Leave Types
  getLeaveTypes: (params?: any) => api.get('/hrms/leave/types', { params }),
  getLeaveTypeById: (id: string) => api.get(`/hrms/leave/types/${id}`),
  createLeaveType: (data: Omit<LeaveType, 'id'>) => api.post('/hrms/leave/types', data),
  updateLeaveType: (id: string, data: Partial<LeaveType>) => api.put(`/hrms/leave/types/${id}`, data),
  deleteLeaveType: (id: string) => api.delete(`/hrms/leave/types/${id}`),

  // Leave Schemes
  getLeaveSchemes: (params?: any) => api.get('/hrms/leave/schemes', { params }),
  getLeaveSchemeById: (id: string) => api.get(`/hrms/leave/schemes/${id}`),
  createLeaveScheme: (data: Omit<LeaveScheme, 'id'>) => api.post('/hrms/leave/schemes', data),
  updateLeaveScheme: (id: string, data: Partial<LeaveScheme>) => api.put(`/hrms/leave/schemes/${id}`, data),
  deleteLeaveScheme: (id: string) => api.delete(`/hrms/leave/schemes/${id}`),

  // Leave Balances
  getLeaveBalances: (params?: any) => api.get('/hrms/leave/balances', { params }),
  getLeaveBalanceById: (id: string) => api.get(`/hrms/leave/balances?employeeId=${id}`),

  // Leave Applications
  getLeaveApplications: (params?: any) => api.get('/hrms/leave/applications', { params }),
  getLeaveApplicationById: (id: string) => api.get(`/hrms/leave/applications/${id}`),
  createLeaveApplication: (data: Omit<LeaveApplication, 'id'>) => {
    const payload = {
      ...data,
      employee: data.employeeId ? { id: data.employeeId } : null,
      leaveType: data.leaveTypeId ? { id: data.leaveTypeId } : null,
      approver: data.approverId ? { id: data.approverId } : null
    };
    return api.post('/hrms/leave/applications', payload);
  },
  updateLeaveApplication: (id: string, data: Partial<LeaveApplication>) => api.put(`/hrms/leave/applications/${id}`, data),
  deleteLeaveApplication: (id: string) => api.delete(`/hrms/leave/applications/${id}`),
  approveLeaveApplication: (id: string, remarks?: string) => api.put(`/hrms/leave/applications/${id}/approve`, { remarks }),
  rejectLeaveApplication: (id: string, remarks?: string) => api.put(`/hrms/leave/applications/${id}/reject`, { remarks }),
  cancelLeaveApplication: (id: string, reason?: string) => api.put(`/hrms/leave/applications/${id}/cancel`, { reason }),

  // Dashboard
  getDashboardKPIs: () => api.get('/hrms/attendance/dashboard/kpis'),

  // Attendance
  getAttendanceRecords: (params?: any) => {
    const cleanParams: any = {};
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          cleanParams[key] = params[key];
        }
      });
      if (cleanParams.monthYear) {
        const date = new Date(cleanParams.monthYear);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        cleanParams.startDate = `${year}-${month}-01`;
        const lastDay = new Date(year, date.getMonth() + 1, 0).getDate();
        cleanParams.endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
        delete cleanParams.monthYear;
      }
    }
    return api.get('/hrms/attendance/records', { params: cleanParams });
  },
  getAttendanceRecordById: (id: string) => api.get(`/hrms/attendance/records/${id}`),
  getAttendanceLogsForRecord: (id: string) => api.get(`/hrms/attendance/${id}/logs`),
  createAttendanceRecord: (data: Omit<AttendanceRecord, 'id'>) => {
    const payload = {
      ...data,
      employee: data.employeeId ? { id: data.employeeId } : null,
      department: data.departmentId ? { id: data.departmentId } : null,
      designation: data.designationId ? { id: data.designationId } : null,
      location: data.locationId ? { id: data.locationId } : null,
      shift: data.shiftId ? { id: data.shiftId } : null
    };
    return api.post('/hrms/attendance/records', payload);
  },
  updateAttendanceRecord: (id: string, data: Partial<AttendanceRecord>) => api.put(`/hrms/attendance/records/${id}`, data),
  deleteAttendanceRecord: (id: string) => api.delete(`/hrms/attendance/records/${id}`),
  checkIn: (employeeId: string, source?: string) => api.post('/hrms/attendance/records/check-in', { employeeId, source }),
  checkOut: (employeeId: string) => api.post('/hrms/attendance/records/check-out', { employeeId }),

  // Shifts
  getShifts: (params?: any) => api.get('/hrms/shifts', { params }),
  getShiftById: (id: string) => api.get(`/hrms/shifts/${id}`),
  createShift: (data: Omit<Shift, 'id'>) => api.post('/hrms/shifts', data),
  updateShift: (id: string, data: Partial<Shift>) => api.put(`/hrms/shifts/${id}`, data),
  deleteShift: (id: string) => api.delete(`/hrms/shifts/${id}`),

  // Regularization
  getRegularizations: (params?: any) => api.get('/hrms/attendance/regularizations', { params }),
  getRegularizationById: (id: string) => api.get(`/hrms/attendance/regularizations/${id}`),
  createRegularization: (data: Omit<RegularizationRequest, 'id'>) => {
    const payload = {
      ...data,
      employee: data.employeeId ? { id: data.employeeId } : null,
      shift: data.shift ? { id: data.shift } : null
    };
    return api.post('/hrms/attendance/regularizations', payload);
  },
  updateRegularization: (id: string, data: Partial<RegularizationRequest>) => api.put(`/hrms/attendance/regularizations/${id}`, data),
  deleteRegularization: (id: string) => api.delete(`/hrms/attendance/regularizations/${id}`),
  approveRegularization: (id: string, remarks?: string) => api.put(`/hrms/attendance/regularizations/${id}/approve`, { remarks }),
  rejectRegularization: (id: string, remarks?: string) => api.put(`/hrms/attendance/regularizations/${id}/reject`, { remarks }),

  // Permissions
  getPermissions: (params?: any) => api.get('/hrms/attendance/permissions', { params }),
  getPermissionById: (id: string) => api.get(`/hrms/attendance/permissions/${id}`),
  createPermission: (data: Omit<PermissionRequest, 'id'>) => {
    const payload = {
      ...data,
      employee: data.employeeId ? { id: data.employeeId } : null
    };
    return api.post('/hrms/attendance/permissions', payload);
  },
  updatePermission: (id: string, data: Partial<PermissionRequest>) => api.put(`/hrms/attendance/permissions/${id}`, data),
  deletePermission: (id: string) => api.delete(`/hrms/attendance/permissions/${id}`),
  approvePermission: (id: string, remarks?: string) => api.put(`/hrms/attendance/permissions/${id}/approve`, { remarks }),
  rejectPermission: (id: string, remarks?: string) => api.put(`/hrms/attendance/permissions/${id}/reject`, { remarks }),

  // Shift Rotation
  getShiftRotations: (params?: any) => api.get('/hrms/shifts/rotations', { params }),
  getShiftRotationById: (id: string) => api.get(`/hrms/shifts/rotations/${id}`),
  createShiftRotation: (data: Omit<any, 'id'>) => api.post('/hrms/shifts/rotations', data),
  updateShiftRotation: (id: string, data: Partial<any>) => api.put(`/hrms/shifts/rotations/${id}`, data),
  deleteShiftRotation: (id: string) => api.delete(`/hrms/shifts/rotations/${id}`),

  // Holiday List
  getHolidayLists: (params?: any) => api.get('/hrms/holidays/lists', { params }),
  getHolidayListById: (id: string) => api.get(`/hrms/holidays/lists/${id}`),
  createHolidayList: (data: Omit<any, 'id'>) => api.post('/hrms/holidays/lists', data),
  updateHolidayList: (id: string, data: Partial<any>) => api.put(`/hrms/holidays/lists/${id}`, data),
  deleteHolidayList: (id: string) => api.delete(`/hrms/holidays/lists/${id}`),

  // Attendance Scheme
  getAttendanceSchemes: (params?: any) => api.get('/hrms/attendance-config/schemes', { params }),
  getAttendanceSchemeById: (id: string) => api.get(`/hrms/attendance-config/schemes/${id}`),
  createAttendanceScheme: (data: Omit<any, 'id'>) => api.post('/hrms/attendance-config/schemes', data),
  updateAttendanceScheme: (id: string, data: Partial<any>) => api.put(`/hrms/attendance-config/schemes/${id}`, data),
  deleteAttendanceScheme: (id: string) => api.delete(`/hrms/attendance-config/schemes/${id}`),

  // IP Mapping
  getIPMappings: (params?: any) => api.get('/hrms/attendance-config/ip-mappings', { params }),
  getIPMappingById: (id: string) => api.get(`/hrms/attendance-config/ip-mappings/${id}`),
  createIPMapping: (data: Omit<any, 'id'>) => api.post('/hrms/attendance-config/ip-mappings', data),
  updateIPMapping: (id: string, data: Partial<any>) => api.put(`/hrms/attendance-config/ip-mappings/${id}`, data),
  deleteIPMapping: (id: string) => api.delete(`/hrms/attendance-config/ip-mappings/${id}`),

  // Lock Config
  getLockConfigs: (params?: any) => api.get('/hrms/attendance-config/lock-config', { params }),
  getLockConfigById: (id: string) => api.get(`/hrms/attendance-config/lock-config/${id}`),
  createLockConfig: (data: Omit<any, 'id'>) => api.post('/hrms/attendance-config/lock-config', data),
  updateLockConfig: (id: string, data: Partial<any>) => api.put(`/hrms/attendance-config/lock-config/${id}`, data),
  deleteLockConfig: (id: string) => api.delete(`/hrms/attendance-config/lock-config/${id}`),

  // Shift Roster
  getShiftRosters: (params?: any) => api.get('/hrms/shifts/roster', { params }),
  getShiftRosterById: (id: string) => api.get(`/hrms/shifts/roster/${id}`),
  createShiftRoster: (data: Omit<any, 'id'>) => api.post('/hrms/shifts/roster', data),
  updateShiftRoster: (id: string, data: Partial<any>) => api.put(`/hrms/shifts/roster/${id}`, data),
  deleteShiftRoster: (id: string) => api.delete(`/hrms/shifts/roster/${id}`),

  // Holiday
  getHolidays: (params?: any) => api.get('/hrms/holidays', { params }),
  getHolidayById: (id: string) => api.get(`/hrms/holidays/${id}`),
  createHoliday: (data: Omit<any, 'id'>) => api.post('/hrms/holidays', data),
  updateHoliday: (id: string, data: Partial<any>) => api.put(`/hrms/holidays/${id}`, data),
  deleteHoliday: (id: string) => api.delete(`/hrms/holidays/${id}`),

  // Attendance Period
  getAttendancePeriods: (params?: any) => api.get('/hrms/attendance/processing/periods', { params }),
  getAttendancePeriodById: (id: string) => api.get(`/hrms/attendance/processing/periods/${id}`),
  createAttendancePeriod: (data: Omit<any, 'id'>) => api.post('/hrms/attendance/processing/periods', data),
  updateAttendancePeriod: (id: string, data: Partial<any>) => api.put(`/hrms/attendance/processing/periods/${id}`, data),
  deleteAttendancePeriod: (id: string) => api.delete(`/hrms/attendance/processing/periods/${id}`),
  lockAttendancePeriod: (id: string) => api.put(`/hrms/attendance/processing/periods/${id}/lock`),
  processAttendancePeriod: (id: string) => api.post(`/hrms/attendance/processing/periods/${id}/process`),

  // Processed Attendance
  getProcessedAttendances: (periodId?: string) => api.get(`/hrms/attendance/processing/periods/${periodId || ''}/processed`),
  getProcessedAttendanceById: (id: string) => api.get(`/hrms/attendance/processing/processed/${id}`),
  createProcessedAttendance: (data: Omit<any, 'id'>) => api.post('/hrms/attendance/processing/processed', data),
  updateProcessedAttendance: (id: string, data: Partial<any>) => api.put(`/hrms/attendance/processing/processed/${id}`, data),
  deleteProcessedAttendance: (id: string) => api.delete(`/hrms/attendance/processing/processed/${id}`),

  // Attendance Exception
  getAttendanceExceptions: (params?: any) => api.get('/hrms/attendance/exceptions', { params }),
  getAttendanceExceptionById: (id: string) => api.get(`/hrms/attendance/exceptions/${id}`),
  createAttendanceException: (data: Omit<any, 'id'>) => api.post('/hrms/attendance/exceptions', data),
  updateAttendanceException: (id: string, data: Partial<any>) => api.put(`/hrms/attendance/exceptions/${id}`, data),
  deleteAttendanceException: (id: string) => api.delete(`/hrms/attendance/exceptions/${id}`),
  resolveAttendanceException: (id: string) => api.put(`/hrms/attendance/exceptions/${id}/resolve`),

  // Attendance Device
  getAttendanceDevices: (params?: any) => api.get('/hrms/attendance/devices', { params }),
  getAttendanceDeviceById: (id: string) => api.get(`/hrms/attendance/devices/${id}`),
  createAttendanceDevice: (data: Omit<any, 'id'>) => api.post('/hrms/attendance/devices', data),
  updateAttendanceDevice: (id: string, data: Partial<any>) => api.put(`/hrms/attendance/devices/${id}`, data),
  deleteAttendanceDevice: (id: string) => api.delete(`/hrms/attendance/devices/${id}`),

  // Attendance Log
  getAttendanceLogs: (params?: any) => api.get('/hrms/attendance/logs', { params }),
  getAttendanceLogById: (id: string) => api.get(`/hrms/attendance/logs/${id}`),
  createAttendanceLog: (data: Omit<any, 'id'>) => api.post('/hrms/attendance/logs', data),
  updateAttendanceLog: (id: string, data: Partial<any>) => api.put(`/hrms/attendance/logs/${id}`, data),
  deleteAttendanceLog: (id: string) => api.delete(`/hrms/attendance/logs/${id}`),

  // Approval History
  getApprovalHistories: (params?: any) => api.get('/hrms/approval-history', { params }),
  getApprovalHistoryById: (id: string) => api.get(`/hrms/approval-history/${id}`),
  createApprovalHistory: (data: Omit<any, 'id'>) => api.post('/hrms/approval-history', data),
  updateApprovalHistory: (id: string, data: Partial<any>) => api.put(`/hrms/approval-history/${id}`, data),
  deleteApprovalHistory: (id: string) => api.delete(`/hrms/approval-history/${id}`),

  // Employee Attendance Summary
  getEmployeeAttendanceSummaries: (params?: any) => api.get('/hrms/attendance/summaries', { params }),
  getEmployeeAttendanceSummaryById: (id: string) => api.get(`/hrms/attendance/summaries/${id}`),
  createEmployeeAttendanceSummary: (data: Omit<any, 'id'>) => api.post('/hrms/attendance/summaries', data),
  updateEmployeeAttendanceSummary: (id: string, data: Partial<any>) => api.put(`/hrms/attendance/summaries/${id}`, data),
  deleteEmployeeAttendanceSummary: (id: string) => api.delete(`/hrms/attendance/summaries/${id}`),
};
