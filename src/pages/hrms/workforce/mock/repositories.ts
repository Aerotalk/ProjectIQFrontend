import type { 
  LeaveType, LeaveScheme, LeaveBalance, LeaveApplication,
  AttendanceRecord, Shift, ShiftRotationPattern, ShiftRoster,
  Holiday, HolidayList, AttendanceScheme, IPMapping, AttendancePeriod, ProcessedAttendance, LockConfiguration,
  RegularizationRequest, PermissionRequest, PaginatedResponse,
  AttendanceException, AttendanceDevice, AttendanceLog, ApprovalHistory, EmployeeAttendanceSummary
} from '../types';
import { AttendanceStatus, ApprovalStatus, AttendanceSource } from '../types';

// Helper for artificial delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

const now = new Date().toISOString();

// Mock Data Stores
let leaveTypes: LeaveType[] = [
  { id: '1', name: 'Casual Leave', code: 'CL', category: 'Paid', active: true, color: '#4CAF50', icon: 'Sun', requiresApproval: true, requiresAttachment: false, minimumDays: 0.5, maximumDays: 5, probationAllowed: true, noticePeriodRequired: 0, allowHalfDay: true, allowHourlyLeave: false, createdAt: now, updatedAt: now },
  { id: '2', name: 'Sick Leave', code: 'SL', category: 'Paid', active: true, color: '#F44336', icon: 'Thermometer', requiresApproval: true, requiresAttachment: true, minimumDays: 0.5, maximumDays: 10, probationAllowed: true, noticePeriodRequired: 0, allowHalfDay: true, allowHourlyLeave: false, createdAt: now, updatedAt: now },
  { id: '3', name: 'Loss of Pay', code: 'LOP', category: 'Unpaid', active: true, color: '#9E9E9E', icon: 'MinusCircle', requiresApproval: true, requiresAttachment: false, minimumDays: 0.5, maximumDays: 365, probationAllowed: true, noticePeriodRequired: 0, allowHalfDay: true, allowHourlyLeave: true, createdAt: now, updatedAt: now },
];

let leaveSchemes: LeaveScheme[] = [
  { id: '1', schemeName: 'Standard India Scheme', defaultScheme: true, rulesCount: 2, createdAt: now, updatedAt: now },
];

let leaveBalances: LeaveBalance[] = [
  { id: '1', employeeId: 'emp-1', employeeName: 'John Doe', employeeCode: 'EMP001', department: 'IT', leaveTypeId: '1', leaveTypeName: 'Casual Leave', year: 2026, openingBalance: 12, granted: 0, availed: 2, encashed: 0, lapsed: 0, available: 10, createdAt: now, updatedAt: now },
];

let leaveApplications: LeaveApplication[] = [];

let attendanceRecords: AttendanceRecord[] = [
  { id: '1', employeeId: 'emp-1', employeeCode: 'EMP001', employeeName: 'John Doe', departmentId: 'dept-1', designationId: 'desig-1', locationId: 'loc-1', attendanceDate: new Date().toISOString().split('T')[0], date: new Date().toISOString().split('T')[0], shiftId: 'shift-1', shiftName: 'General Shift', status: AttendanceStatus.Present, checkIn: '09:00', checkOut: '18:00', workingHours: 9, hours: 9, breakHours: 1, overtimeHours: 0, lateBy: 0, earlyExit: 0, attendanceSource: AttendanceSource.Biometric, regularizationStatus: ApprovalStatus.Approved, approvalStatus: ApprovalStatus.Approved, regularized: false, createdAt: now, updatedAt: now }
];

let shifts: Shift[] = [
  { id: 'shift-1', shiftName: 'General Shift', shiftCode: 'GS', description: 'Standard 9 to 6 shift', startTime: '09:00', endTime: '18:00', graceTime: 15, lateGraceMinutes: 15, earlyExitGraceMinutes: 10, halfDayHours: 4.5, fullDayHours: 9, weeklyHours: 45, breakStart: '13:00', breakEnd: '14:00', flexibleShift: false, overtimeAllowed: true, nightShift: false, active: true, createdAt: now, updatedAt: now },
];

let regularizationRequests: RegularizationRequest[] = [];
let permissionRequests: PermissionRequest[] = [];

let shiftRotations: ShiftRotationPattern[] = [];
let shiftRosters: ShiftRoster[] = [];
let holidayLists: HolidayList[] = [];
let holidays: Holiday[] = [];
let attendanceSchemes: AttendanceScheme[] = [];
let ipMappings: IPMapping[] = [];
let lockConfigs: LockConfiguration[] = [];
let attendancePeriods: AttendancePeriod[] = [];
let processedAttendances: ProcessedAttendance[] = [];
let attendanceExceptions: AttendanceException[] = [];
let attendanceDevices: AttendanceDevice[] = [];
let attendanceLogs: AttendanceLog[] = [];
let approvalHistories: ApprovalHistory[] = [];
let employeeAttendanceSummaries: EmployeeAttendanceSummary[] = [];

// Generic CRUD Mock Repository Generator
function createRepository<T extends { id: string }>(
  store: T[],
  storeName: string
) {
  return {
    async getAll(params?: { search?: string, page?: number, limit?: number, sortBy?: string, order?: 'asc' | 'desc', [key: string]: any }): Promise<PaginatedResponse<T>> {
      await delay();
      let result = [...store];

      if (params) {
        // Search
        if (params.search) {
          const lowerSearch = params.search.toLowerCase();
          result = result.filter(item => 
            Object.values(item).some(val => 
              String(val).toLowerCase().includes(lowerSearch)
            )
          );
        }

        // Generic field filtering
        const ignoredKeys = ['search', 'page', 'limit', 'sortBy', 'order'];
        for (const key of Object.keys(params)) {
          if (!ignoredKeys.includes(key) && params[key] !== undefined && params[key] !== '') {
            result = result.filter(item => {
              const itemVal = (item as any)[key];
              // Support array matching if itemVal is array, or direct equality
              return String(itemVal) === String(params[key]);
            });
          }
        }
      }

      if (params?.sortBy) {
        result.sort((a, b) => {
          const aVal = (a as any)[params.sortBy!];
          const bVal = (b as any)[params.sortBy!];
          if (aVal < bVal) return params.order === 'desc' ? 1 : -1;
          if (aVal > bVal) return params.order === 'desc' ? -1 : 1;
          return 0;
        });
      }

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const totalCount = result.length;
      const totalPages = Math.ceil(totalCount / limit) || 1;
      
      const startIndex = (page - 1) * limit;
      result = result.slice(startIndex, startIndex + limit);

      return { data: result, totalCount, totalPages, currentPage: page };
    },

    async getById(id: string): Promise<T | undefined> {
      await delay();
      return store.find(item => item.id === id);
    },

    async create(data: Omit<T, 'id'>): Promise<T> {
      await delay();
      const newItem = { ...data, id: Math.random().toString(36).substring(2, 9) } as T;
      store.push(newItem);
      return newItem;
    },

    async update(id: string, data: Partial<T>): Promise<T> {
      await delay();
      const index = store.findIndex(item => item.id === id);
      if (index === -1) throw new Error(`${storeName} not found`);
      store[index] = { ...store[index], ...data };
      return store[index];
    },

    async delete(id: string): Promise<void> {
      await delay();
      const index = store.findIndex(item => item.id === id);
      if (index > -1) {
        store.splice(index, 1);
      }
    }
  };
}

// Export Repositories
export const LeaveTypeRepo = createRepository<LeaveType>(leaveTypes, 'LeaveType');
export const LeaveSchemeRepo = createRepository<LeaveScheme>(leaveSchemes, 'LeaveScheme');
export const LeaveBalanceRepo = createRepository<LeaveBalance>(leaveBalances, 'LeaveBalance');
export const LeaveApplicationRepo = createRepository<LeaveApplication>(leaveApplications, 'LeaveApplication');
export const AttendanceRecordRepo = createRepository<AttendanceRecord>(attendanceRecords, 'AttendanceRecord');
export const ShiftRepo = createRepository<Shift>(shifts, 'Shift');
export const RegularizationRepo = createRepository<RegularizationRequest>(regularizationRequests, 'RegularizationRequest');
export const PermissionRepo = createRepository<PermissionRequest>(permissionRequests, 'PermissionRequest');
export const ShiftRotationRepo = createRepository<ShiftRotationPattern>(shiftRotations, 'ShiftRotationPattern');
export const HolidayListRepo = createRepository<HolidayList>(holidayLists, 'HolidayList');
export const AttendanceSchemeRepo = createRepository<AttendanceScheme>(attendanceSchemes, 'AttendanceScheme');
export const IPMappingRepo = createRepository<IPMapping>(ipMappings, 'IPMapping');
export const LockConfigRepo = createRepository<LockConfiguration>(lockConfigs, 'LockConfiguration');

export const ShiftRosterRepo = createRepository<ShiftRoster>(shiftRosters, 'ShiftRoster');
export const HolidayRepo = createRepository<Holiday>(holidays, 'Holiday');
export const AttendancePeriodRepo = createRepository<AttendancePeriod>(attendancePeriods, 'AttendancePeriod');
export const ProcessedAttendanceRepo = createRepository<ProcessedAttendance>(processedAttendances, 'ProcessedAttendance');
export const AttendanceExceptionRepo = createRepository<AttendanceException>(attendanceExceptions, 'AttendanceException');
export const AttendanceDeviceRepo = createRepository<AttendanceDevice>(attendanceDevices, 'AttendanceDevice');
export const AttendanceLogRepo = createRepository<AttendanceLog>(attendanceLogs, 'AttendanceLog');
export const ApprovalHistoryRepo = createRepository<ApprovalHistory>(approvalHistories, 'ApprovalHistory');
export const EmployeeAttendanceSummaryRepo = createRepository<EmployeeAttendanceSummary>(employeeAttendanceSummaries, 'EmployeeAttendanceSummary');

// Custom repositories that need specialized queries can be added here
export const DashboardRepo = {
  async getKPIs() {
    await delay();
    return {
      present: 120,
      absent: 5,
      late: 12,
      onLeave: 8,
      pendingRequests: 3,
      regularization: 2
    };
  }
};
