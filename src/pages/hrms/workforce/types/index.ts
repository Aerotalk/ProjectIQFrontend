// Common Enums
export const AttendanceStatus = {
  Present: 'PRESENT',
  Absent: 'ABSENT',
  Leave: 'LEAVE',
  Holiday: 'HOLIDAY',
  Weekend: 'WEEKEND',
  HalfDay: 'HALF_DAY'
} as const;
export type AttendanceStatus = typeof AttendanceStatus[keyof typeof AttendanceStatus];

export const LeaveStatus = {
  Pending: 'PENDING',
  Approved: 'APPROVED',
  Rejected: 'REJECTED',
  Cancelled: 'CANCELLED',
  Withdrawn: 'WITHDRAWN',
  PartiallyApproved: 'PARTIALLY_APPROVED'
} as const;
export type LeaveStatus = typeof LeaveStatus[keyof typeof LeaveStatus];

export const ApprovalStatus = {
  Pending: 'PENDING',
  Approved: 'APPROVED',
  Rejected: 'REJECTED',
  Cancelled: 'CANCELLED'
} as const;
export type ApprovalStatus = typeof ApprovalStatus[keyof typeof ApprovalStatus];

export const AttendanceSource = {
  Biometric: 'BIOMETRIC',
  Mobile: 'MOBILE',
  Manual: 'MANUAL',
  Web: 'WEB',
  Import: 'IMPORT'
} as const;
export type AttendanceSource = typeof AttendanceSource[keyof typeof AttendanceSource];

export const PermissionStatus = {
  Pending: 'PENDING',
  Approved: 'APPROVED',
  Rejected: 'REJECTED',
  Cancelled: 'CANCELLED'
} as const;
export type PermissionStatus = typeof PermissionStatus[keyof typeof PermissionStatus];

export const ExceptionType = {
  MissingSwipe: 'MISSING_SWIPE',
  LateIn: 'LATE_IN',
  EarlyOut: 'EARLY_OUT',
  LessHours: 'LESS_HOURS',
  UnauthorizedAbsence: 'UNAUTHORIZED_ABSENCE'
} as const;
export type ExceptionType = typeof ExceptionType[keyof typeof ExceptionType];

export const ShiftType = {
  Fixed: 'FIXED',
  Flexible: 'FLEXIBLE',
  Open: 'OPEN'
} as const;
export type ShiftType = typeof ShiftType[keyof typeof ShiftType];

export const ProcessingStatus = {
  Open: 'OPEN',
  Locked: 'LOCKED',
  Processed: 'PROCESSED',
  InProgress: 'IN_PROGRESS'
} as const;
export type ProcessingStatus = typeof ProcessingStatus[keyof typeof ProcessingStatus];

// Base Interfaces
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalEntity {
  status: ApprovalStatus | LeaveStatus | PermissionStatus;
  approverId?: string;
  approverName?: string;
  approvedAt?: string;
  approvedOn?: string;
  approvalRemarks?: string;
}

// Entities

export interface LeaveType extends BaseEntity {
  name: string;
  code: string;
  category: 'Paid' | 'Unpaid' | 'Comp Off';
  description?: string;
  active: boolean;
  color: string;
  icon: string;
  requiresApproval: boolean;
  requiresAttachment: boolean;
  minimumDays: number;
  maximumDays: number;
  genderRestriction?: string;
  probationAllowed: boolean;
  noticePeriodRequired: number;
  allowHalfDay: boolean;
  allowHourlyLeave: boolean;
}

export interface LeaveSchemeRule extends BaseEntity {
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

export interface LeaveScheme extends BaseEntity {
  schemeName: string;
  defaultScheme: boolean;
  description?: string;
  rulesCount: number;
  openingLeaveRules?: LeaveSchemeRule[];
}

export interface LeaveBalance extends BaseEntity {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  leaveTypeId: string;
  leaveTypeName: string;
  year: number;
  openingBalance: number;
  granted: number;
  availed: number;
  encashed: number;
  lapsed: number;
  available: number;
}

export interface LeaveApplication extends BaseEntity, ApprovalEntity {
  leaveNumber: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  leaveTypeId: string;
  leaveTypeName: string;
  leaveCategory: string;
  fromDate: string;
  fromSession: 'Session 1' | 'Session 2';
  toDate: string;
  toSession: 'Session 1' | 'Session 2';
  reason: string;
  medicalCertificate?: string;
  attachment?: string;
  attachments?: string[];
  appliedOn: string;
  duration: number;
  cancelReason?: string;
}

export interface AttendanceRecord extends BaseEntity {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentId: string;
  designationId: string;
  locationId: string;
  attendanceDate: string;
  date: string; // Keep for backward compatibility with mock till refactor
  shiftId: string;
  shiftName: string;
  checkIn?: string;
  checkInLatitude?: number;
  checkInLongitude?: number;
  checkInLocation?: string;
  checkOut?: string;
  checkOutLatitude?: number;
  checkOutLongitude?: number;
  checkOutLocation?: string;
  workingHours?: number;
  hours?: number; // Keep for backward compatibility
  breakHours?: number;
  overtimeHours?: number;
  lateBy?: number;
  earlyExit?: number;
  status: AttendanceStatus;
  attendanceSource: AttendanceSource;
  regularizationStatus: ApprovalStatus;
  approvalStatus: ApprovalStatus;
  exceptionType?: ExceptionType;
  remarks?: string;
  approvedBy?: string;
  approvedAt?: string;
  regularized: boolean; // Keep for backward compatibility
}

export interface Shift extends BaseEntity {
  shiftName: string;
  shiftCode: string;
  description: string;
  startTime: string;
  endTime: string;
  graceTime: number;
  lateGraceMinutes: number;
  earlyExitGraceMinutes: number;
  halfDayHours: number;
  fullDayHours: number;
  weeklyHours: number;
  breakStart: string;
  breakEnd: string;
  flexibleShift: boolean;
  overtimeAllowed: boolean;
  nightShift: boolean;
  active: boolean;
}

export interface ShiftRotationPattern extends BaseEntity {
  patternName: string;
  rotationDays: number;
  patternSequence: string[]; // Shift IDs
}

export interface ShiftRoster extends BaseEntity {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  rosterDate: string;
  weekNumber: number;
  month: number;
  year: number;
  assignedShiftId: string;
  overridden: boolean;
  updatedBy?: string;
  published: boolean;
  publishedBy?: string;
  publishedOn?: string;
}

export interface Holiday extends BaseEntity {
  holidayListId: string;
  holidayDate: string;
  holidayName: string;
  holidayType: string;
  location: string;
  state: string;
  country: string;
  optional: boolean;
  restrictedHoliday: boolean;
  description: string;
  active: boolean;
}

export interface HolidayList extends BaseEntity {
  holidayList: string;
  year: number;
  locationId: string;
}

export interface AttendanceScheme extends BaseEntity {
  schemeName: string;
  schemeDescription: string;
  defaultShiftId: string;
  holidayListId: string;
  weekendConfiguration: Record<string, boolean>; // e.g. { M: true, T: true, ... }
  requireLiveValidation: boolean;
  latePolicy: string;
  overtimePolicy: string;
  minimumHours: number;
  halfDayHours: number;
  graceMinutes: number;
  autoRegularization: boolean;
  allowMobileAttendance: boolean;
}

export interface IPMapping extends BaseEntity {
  locationId: string;
  ipAddress: string;
  description?: string;
}

export interface AttendancePeriod extends BaseEntity {
  periodName: string;
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  status: ProcessingStatus;
  processingStatus: ProcessingStatus;
  lockedAt?: string;
  lockedBy?: string;
  processedBy?: string;
  processedOn?: string;
  employeeCount: number;
  attendanceCount: number;
  remarks: string;
}

export interface ProcessedAttendance extends BaseEntity {
  employeeId: string;
  periodId: string;
  grossWorkingDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  lateDays: number;
  halfDays: number;
  weeklyOffs: number;
  weekendCount: number;
  holidays: number;
  holidayCount: number;
  lopDays: number;
  overtimeHours: number;
  payableDays: number;
  finalPayableDays: number;
  status: 'Draft' | 'Finalized';
  processedBy?: string;
  processedOn?: string;
}

export interface LockConfiguration extends BaseEntity {
  feature: string;
  lockDays: number;
  active: boolean;
}

export interface RegularizationRequest extends BaseEntity, ApprovalEntity {
  requestNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  shift: string;
  date: string;
  requestedCheckIn?: string;
  requestedCheckOut?: string;
  actualCheckIn?: string;
  actualCheckOut?: string;
  inTime?: string; // Kept for compatibility
  outTime?: string; // Kept for compatibility
  reason: string;
  attachment?: string;
}

export interface PermissionRequest extends BaseEntity, ApprovalEntity {
  permissionNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  permissionType: string;
  permissionDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  reason: string;
  attachment?: string;
}

// New Entities

export interface AttendanceException extends BaseEntity {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  exceptionType: ExceptionType;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface AttendanceDevice extends BaseEntity {
  deviceName: string;
  deviceType: string;
  location: string;
  ipAddress: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
}

export interface AttendanceLog extends BaseEntity {
  employeeId: string;
  timestamp: string;
  direction: 'In' | 'Out';
  device: string;
  source: AttendanceSource;
}

export interface ApprovalHistory extends BaseEntity {
  referenceId: string;
  module: string;
  action: string;
  performedBy: string;
  performedOn: string;
  remarks: string;
}

export interface EmployeeAttendanceSummary {
  id: string;
  employeeId: string;
  present: number;
  absent: number;
  leave: number;
  late: number;
  halfDay: number;
  overtime: number;
  payableDays: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
