import type { 
  LeaveType, LeaveScheme, LeaveBalance, LeaveApplication,
  AttendanceRecord, Shift, ShiftRotationPattern,
  HolidayList, AttendanceScheme, IPMapping, LockConfiguration,
  RegularizationRequest, PermissionRequest, PaginatedResponse
} from '../types';

// Helper for artificial delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data Stores
let leaveTypes: LeaveType[] = [
  { id: '1', name: 'Casual Leave', code: 'CL', category: 'Paid', active: true },
  { id: '2', name: 'Sick Leave', code: 'SL', category: 'Paid', active: true },
  { id: '3', name: 'Loss of Pay', code: 'LOP', category: 'Unpaid', active: true },
];

let leaveSchemes: LeaveScheme[] = [
  { id: '1', schemeName: 'Standard India Scheme', defaultScheme: true, rulesCount: 2 },
];

let leaveBalances: LeaveBalance[] = [
  { id: '1', employeeId: 'emp-1', leaveTypeId: '1', openingBalance: 12, granted: 0, availed: 2, encashed: 0, available: 10, closingBalance: 10, updatedOn: '2026-07-25' },
];

let leaveApplications: LeaveApplication[] = [];

let attendanceRecords: AttendanceRecord[] = [
  { id: '1', employeeId: 'emp-1', date: new Date().toISOString().split('T')[0], shiftId: 'shift-1', status: 'Present', checkIn: '09:00', checkOut: '18:00', hours: 9, regularized: false }
];

let shifts: Shift[] = [
  { id: 'shift-1', shiftName: 'General Shift', shiftCode: 'GS', startTime: '09:00', endTime: '18:00', graceTime: 15, halfDayHours: 4.5, fullDayHours: 9, nightShift: false },
];

let regularizationRequests: RegularizationRequest[] = [];
let permissionRequests: PermissionRequest[] = [];

let shiftRotations: ShiftRotationPattern[] = [];
let holidayLists: HolidayList[] = [];
let attendanceSchemes: AttendanceScheme[] = [];
let ipMappings: IPMapping[] = [];
let lockConfigs: LockConfiguration[] = [];

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
