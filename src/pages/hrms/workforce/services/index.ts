import * as Repositories from '../mock/repositories';
import type { 
  LeaveType, LeaveScheme, LeaveApplication, 
  AttendanceRecord, Shift, RegularizationRequest, PermissionRequest
} from '../types';

// Service Layer abstracts the repository implementation.
// Currently it delegates to the mock repositories, but later we will
// swap these with actual API calls (e.g. axios.get('/api/workforce/leave-types'))

export const WorkforceService = {
  // Leave Types
  getLeaveTypes: (params?: any) => Repositories.LeaveTypeRepo.getAll(params),
  getLeaveTypeById: (id: string) => Repositories.LeaveTypeRepo.getById(id),
  createLeaveType: (data: Omit<LeaveType, 'id'>) => Repositories.LeaveTypeRepo.create(data),
  updateLeaveType: (id: string, data: Partial<LeaveType>) => Repositories.LeaveTypeRepo.update(id, data),
  deleteLeaveType: (id: string) => Repositories.LeaveTypeRepo.delete(id),

  // Leave Schemes
  getLeaveSchemes: (params?: any) => Repositories.LeaveSchemeRepo.getAll(params),
  getLeaveSchemeById: (id: string) => Repositories.LeaveSchemeRepo.getById(id),
  createLeaveScheme: (data: Omit<LeaveScheme, 'id'>) => Repositories.LeaveSchemeRepo.create(data),
  updateLeaveScheme: (id: string, data: Partial<LeaveScheme>) => Repositories.LeaveSchemeRepo.update(id, data),
  deleteLeaveScheme: (id: string) => Repositories.LeaveSchemeRepo.delete(id),

  // Leave Balances
  getLeaveBalances: (params?: any) => Repositories.LeaveBalanceRepo.getAll(params),
  getLeaveBalanceById: (id: string) => Repositories.LeaveBalanceRepo.getById(id),

  // Leave Applications
  getLeaveApplications: (params?: any) => Repositories.LeaveApplicationRepo.getAll(params),
  getLeaveApplicationById: (id: string) => Repositories.LeaveApplicationRepo.getById(id),
  createLeaveApplication: (data: Omit<LeaveApplication, 'id'>) => Repositories.LeaveApplicationRepo.create(data),
  updateLeaveApplication: (id: string, data: Partial<LeaveApplication>) => Repositories.LeaveApplicationRepo.update(id, data),
  deleteLeaveApplication: (id: string) => Repositories.LeaveApplicationRepo.delete(id),
  
  // Dashboard
  getDashboardKPIs: () => Repositories.DashboardRepo.getKPIs(),
  
  // Attendance
  getAttendanceRecords: (params?: any) => Repositories.AttendanceRecordRepo.getAll(params),
  getAttendanceRecordById: (id: string) => Repositories.AttendanceRecordRepo.getById(id),
  createAttendanceRecord: (data: Omit<AttendanceRecord, 'id'>) => Repositories.AttendanceRecordRepo.create(data),
  updateAttendanceRecord: (id: string, data: Partial<AttendanceRecord>) => Repositories.AttendanceRecordRepo.update(id, data),
  deleteAttendanceRecord: (id: string) => Repositories.AttendanceRecordRepo.delete(id),
  
  // Shifts
  getShifts: (params?: any) => Repositories.ShiftRepo.getAll(params),
  getShiftById: (id: string) => Repositories.ShiftRepo.getById(id),
  createShift: (data: Omit<Shift, 'id'>) => Repositories.ShiftRepo.create(data),
  updateShift: (id: string, data: Partial<Shift>) => Repositories.ShiftRepo.update(id, data),
  deleteShift: (id: string) => Repositories.ShiftRepo.delete(id),
  
  // Regularization
  getRegularizations: (params?: any) => Repositories.RegularizationRepo.getAll(params),
  getRegularizationById: (id: string) => Repositories.RegularizationRepo.getById(id),
  createRegularization: (data: Omit<RegularizationRequest, 'id'>) => Repositories.RegularizationRepo.create(data),
  updateRegularization: (id: string, data: Partial<RegularizationRequest>) => Repositories.RegularizationRepo.update(id, data),
  deleteRegularization: (id: string) => Repositories.RegularizationRepo.delete(id),
  
  // Permissions
  getPermissions: (params?: any) => Repositories.PermissionRepo.getAll(params),
  getPermissionById: (id: string) => Repositories.PermissionRepo.getById(id),
  createPermission: (data: Omit<PermissionRequest, 'id'>) => Repositories.PermissionRepo.create(data),
  updatePermission: (id: string, data: Partial<PermissionRequest>) => Repositories.PermissionRepo.update(id, data),
  deletePermission: (id: string) => Repositories.PermissionRepo.delete(id),

  // Shift Rotation
  getShiftRotations: (params?: any) => Repositories.ShiftRotationRepo.getAll(params),
  getShiftRotationById: (id: string) => Repositories.ShiftRotationRepo.getById(id),
  createShiftRotation: (data: Omit<any, 'id'>) => Repositories.ShiftRotationRepo.create(data),
  updateShiftRotation: (id: string, data: Partial<any>) => Repositories.ShiftRotationRepo.update(id, data),
  deleteShiftRotation: (id: string) => Repositories.ShiftRotationRepo.delete(id),

  // Holiday List
  getHolidayLists: (params?: any) => Repositories.HolidayListRepo.getAll(params),
  getHolidayListById: (id: string) => Repositories.HolidayListRepo.getById(id),
  createHolidayList: (data: Omit<any, 'id'>) => Repositories.HolidayListRepo.create(data),
  updateHolidayList: (id: string, data: Partial<any>) => Repositories.HolidayListRepo.update(id, data),
  deleteHolidayList: (id: string) => Repositories.HolidayListRepo.delete(id),

  // Attendance Scheme
  getAttendanceSchemes: (params?: any) => Repositories.AttendanceSchemeRepo.getAll(params),
  getAttendanceSchemeById: (id: string) => Repositories.AttendanceSchemeRepo.getById(id),
  createAttendanceScheme: (data: Omit<any, 'id'>) => Repositories.AttendanceSchemeRepo.create(data),
  updateAttendanceScheme: (id: string, data: Partial<any>) => Repositories.AttendanceSchemeRepo.update(id, data),
  deleteAttendanceScheme: (id: string) => Repositories.AttendanceSchemeRepo.delete(id),

  // IP Mapping
  getIPMappings: (params?: any) => Repositories.IPMappingRepo.getAll(params),
  getIPMappingById: (id: string) => Repositories.IPMappingRepo.getById(id),
  createIPMapping: (data: Omit<any, 'id'>) => Repositories.IPMappingRepo.create(data),
  updateIPMapping: (id: string, data: Partial<any>) => Repositories.IPMappingRepo.update(id, data),
  deleteIPMapping: (id: string) => Repositories.IPMappingRepo.delete(id),

  // Lock Config
  getLockConfigs: (params?: any) => Repositories.LockConfigRepo.getAll(params),
  getLockConfigById: (id: string) => Repositories.LockConfigRepo.getById(id),
  createLockConfig: (data: Omit<any, 'id'>) => Repositories.LockConfigRepo.create(data),
  updateLockConfig: (id: string, data: Partial<any>) => Repositories.LockConfigRepo.update(id, data),
  deleteLockConfig: (id: string) => Repositories.LockConfigRepo.delete(id),
  // Shift Roster
  getShiftRosters: (params?: any) => Repositories.ShiftRosterRepo.getAll(params),
  getShiftRosterById: (id: string) => Repositories.ShiftRosterRepo.getById(id),
  createShiftRoster: (data: Omit<any, 'id'>) => Repositories.ShiftRosterRepo.create(data),
  updateShiftRoster: (id: string, data: Partial<any>) => Repositories.ShiftRosterRepo.update(id, data),
  deleteShiftRoster: (id: string) => Repositories.ShiftRosterRepo.delete(id),

  // Holiday
  getHolidays: (params?: any) => Repositories.HolidayRepo.getAll(params),
  getHolidayById: (id: string) => Repositories.HolidayRepo.getById(id),
  createHoliday: (data: Omit<any, 'id'>) => Repositories.HolidayRepo.create(data),
  updateHoliday: (id: string, data: Partial<any>) => Repositories.HolidayRepo.update(id, data),
  deleteHoliday: (id: string) => Repositories.HolidayRepo.delete(id),

  // Attendance Period
  getAttendancePeriods: (params?: any) => Repositories.AttendancePeriodRepo.getAll(params),
  getAttendancePeriodById: (id: string) => Repositories.AttendancePeriodRepo.getById(id),
  createAttendancePeriod: (data: Omit<any, 'id'>) => Repositories.AttendancePeriodRepo.create(data),
  updateAttendancePeriod: (id: string, data: Partial<any>) => Repositories.AttendancePeriodRepo.update(id, data),
  deleteAttendancePeriod: (id: string) => Repositories.AttendancePeriodRepo.delete(id),

  // Processed Attendance
  getProcessedAttendances: (params?: any) => Repositories.ProcessedAttendanceRepo.getAll(params),
  getProcessedAttendanceById: (id: string) => Repositories.ProcessedAttendanceRepo.getById(id),
  createProcessedAttendance: (data: Omit<any, 'id'>) => Repositories.ProcessedAttendanceRepo.create(data),
  updateProcessedAttendance: (id: string, data: Partial<any>) => Repositories.ProcessedAttendanceRepo.update(id, data),
  deleteProcessedAttendance: (id: string) => Repositories.ProcessedAttendanceRepo.delete(id),

  // Attendance Exception
  getAttendanceExceptions: (params?: any) => Repositories.AttendanceExceptionRepo.getAll(params),
  getAttendanceExceptionById: (id: string) => Repositories.AttendanceExceptionRepo.getById(id),
  createAttendanceException: (data: Omit<any, 'id'>) => Repositories.AttendanceExceptionRepo.create(data),
  updateAttendanceException: (id: string, data: Partial<any>) => Repositories.AttendanceExceptionRepo.update(id, data),
  deleteAttendanceException: (id: string) => Repositories.AttendanceExceptionRepo.delete(id),

  // Attendance Device
  getAttendanceDevices: (params?: any) => Repositories.AttendanceDeviceRepo.getAll(params),
  getAttendanceDeviceById: (id: string) => Repositories.AttendanceDeviceRepo.getById(id),
  createAttendanceDevice: (data: Omit<any, 'id'>) => Repositories.AttendanceDeviceRepo.create(data),
  updateAttendanceDevice: (id: string, data: Partial<any>) => Repositories.AttendanceDeviceRepo.update(id, data),
  deleteAttendanceDevice: (id: string) => Repositories.AttendanceDeviceRepo.delete(id),

  // Attendance Log
  getAttendanceLogs: (params?: any) => Repositories.AttendanceLogRepo.getAll(params),
  getAttendanceLogById: (id: string) => Repositories.AttendanceLogRepo.getById(id),
  createAttendanceLog: (data: Omit<any, 'id'>) => Repositories.AttendanceLogRepo.create(data),
  updateAttendanceLog: (id: string, data: Partial<any>) => Repositories.AttendanceLogRepo.update(id, data),
  deleteAttendanceLog: (id: string) => Repositories.AttendanceLogRepo.delete(id),

  // Approval History
  getApprovalHistories: (params?: any) => Repositories.ApprovalHistoryRepo.getAll(params),
  getApprovalHistoryById: (id: string) => Repositories.ApprovalHistoryRepo.getById(id),
  createApprovalHistory: (data: Omit<any, 'id'>) => Repositories.ApprovalHistoryRepo.create(data),
  updateApprovalHistory: (id: string, data: Partial<any>) => Repositories.ApprovalHistoryRepo.update(id, data),
  deleteApprovalHistory: (id: string) => Repositories.ApprovalHistoryRepo.delete(id),

  // Employee Attendance Summary
  getEmployeeAttendanceSummaries: (params?: any) => Repositories.EmployeeAttendanceSummaryRepo.getAll(params),
  getEmployeeAttendanceSummaryById: (id: string) => Repositories.EmployeeAttendanceSummaryRepo.getById(id),
  createEmployeeAttendanceSummary: (data: Omit<any, 'id'>) => Repositories.EmployeeAttendanceSummaryRepo.create(data),
  updateEmployeeAttendanceSummary: (id: string, data: Partial<any>) => Repositories.EmployeeAttendanceSummaryRepo.update(id, data),
  deleteEmployeeAttendanceSummary: (id: string) => Repositories.EmployeeAttendanceSummaryRepo.delete(id),
};
