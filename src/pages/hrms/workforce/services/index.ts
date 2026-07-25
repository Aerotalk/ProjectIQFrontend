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
};
