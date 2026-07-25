export interface LeaveType {
  id: string;
  name: string;
  code: string;
  category: 'Paid' | 'Unpaid' | 'Comp Off';
  description?: string;
  active: boolean;
}

export interface LeaveSchemeRule {
  id: string;
  schemeId: string;
  leaveTypeId: string;
  annualQuota: number;
  accrualFrequency: 'Monthly' | 'Yearly' | 'Half-Yearly';
  carryForward: number;
  encashable: boolean;
  minimumNotice: number;
  maximumConsecutiveDays: number;
  medicalCertificateRequired: boolean;
}

export interface LeaveScheme {
  id: string;
  schemeName: string;
  defaultScheme: boolean;
  description?: string;
  rulesCount: number;
  openingLeaveRules?: LeaveSchemeRule[];
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  openingBalance: number;
  granted: number;
  availed: number;
  encashed: number;
  available: number;
  closingBalance: number;
  updatedOn: string;
}

export interface LeaveApplication {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  fromDate: string;
  fromSession: 'Session 1' | 'Session 2';
  toDate: string;
  toSession: 'Session 1' | 'Session 2';
  reason: string;
  medicalCertificate?: string;
  approverId?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  attachment?: string;
  appliedOn: string;
  duration: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  shiftId: string;
  checkIn?: string;
  checkOut?: string;
  hours?: number;
  status: 'Present' | 'Absent' | 'Leave' | 'Holiday' | 'Weekend' | 'Half Day';
  exception?: 'Missing Swipe' | 'Late In' | 'Early Out' | 'Less Hours';
  regularized: boolean;
}

export interface Shift {
  id: string;
  shiftName: string;
  shiftCode: string;
  startTime: string;
  endTime: string;
  graceTime: number;
  halfDayHours: number;
  fullDayHours: number;
  nightShift: boolean;
}

export interface ShiftRotationPattern {
  id: string;
  patternName: string;
  rotationDays: number;
  patternSequence: string[]; // Shift IDs
}

export interface ShiftRoster {
  id: string;
  employeeId: string;
  rosterDate: string;
  assignedShiftId: string;
  overridden: boolean;
  updatedBy?: string;
}

export interface Holiday {
  id: string;
  holidayListId: string;
  holidayDate: string;
  holidayName: string;
  restrictedHoliday: boolean;
}

export interface HolidayList {
  id: string;
  holidayList: string;
  year: number;
  locationId: string;
}

export interface AttendanceScheme {
  id: string;
  schemeName: string;
  defaultShiftId: string;
  holidayListId: string;
  weekendConfiguration: Record<string, boolean>; // e.g. { M: true, T: true, ... }
  requireLiveValidation: boolean;
}

export interface IPMapping {
  id: string;
  locationId: string;
  ipAddress: string;
  description?: string;
}

export interface AttendancePeriod {
  id: string;
  periodName: string;
  startDate: string;
  endDate: string;
  status: 'Open' | 'Locked' | 'Processed';
  lockedAt?: string;
}

export interface ProcessedAttendance {
  id: string;
  employeeId: string;
  periodId: string;
  presentDays: number;
  leaveDays: number;
  weeklyOffs: number;
  holidays: number;
  lopDays: number;
  payableDays: number;
  status: 'Draft' | 'Finalized';
}

export interface LockConfiguration {
  id: string;
  feature: string;
  lockDays: number;
  active: boolean;
}

export interface RegularizationRequest {
  id: string;
  employeeId: string;
  date: string;
  inTime?: string;
  outTime?: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approverId?: string;
}

export interface PermissionRequest {
  id: string;
  employeeId: string;
  permissionDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approverId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

