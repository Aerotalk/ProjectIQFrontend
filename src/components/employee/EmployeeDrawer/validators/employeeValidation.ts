import { z } from 'zod';

export const documentSchema = z.object({
  id: z.string().optional(),
  documentCategory: z.string().min(1, 'Category is required'),
  documentName: z.string().min(1, 'Document name is required'),
  fileUrl: z.any().optional(), // Using any for File/Blob upload objects for now
  expiryDate: z.string().optional(),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().optional(),
  qualification: z.string().optional(),
  institution: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  grade: z.string().optional(),
});

export const familySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  relationship: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  dependent: z.boolean().optional(),
  nominee: z.boolean().optional(),
  nomineePercentage: z.number().optional(),
  phone: z.string().optional(),
});

const baseEmployeeFormSchema = z.object({
  // Tab 1 - Basic Info - Personal
  firstName: z.string().min(1, 'First Name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last Name is required'),
  workEmail: z.string().email('Invalid email format').min(1, 'Work Email is required'),
  phone: z.string().min(1, 'Phone is required'),
  alternatePhone: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of Birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  maritalStatus: z.string().min(1, 'Marital Status is required'),
  bloodGroup: z.string().min(1, 'Blood Group is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  profilePhoto: z.any().refine((val) => val !== undefined && val !== null && val !== '', 'Profile Photo is required'),
  
  // Tab 1 - Basic Info - Employment
  dateOfJoining: z.string().min(1, 'Date of Joining is required'),
  employmentType: z.string().min(1, 'Employment Type is required'),
  companyId: z.string().min(1, 'Company is required'),
  departmentId: z.string().min(1, 'Department is required'),
  designationId: z.string().min(1, 'Designation is required'),
  location: z.string().min(1, 'Location is required'),
  grade: z.string().min(1, 'Grade/Band is required'),
  reportingManagerId: z.string().min(1, 'Reporting Manager is required'),
  hrManagerId: z.string().min(1, 'HR Manager is required'),
  weeklyOff: z.string().min(1, 'Weekly Off is required'),
  fatherName: z.string().optional(),
  noticePeriodDays: z.number().min(0, 'Notice Period is required'),

  // Tab 2 - Address
  sameAsPresentAddress: z.boolean().default(false),
  
  presentCountry: z.string().optional(),
  presentState: z.string().optional(),
  presentCity: z.string().optional(),
  presentAddressLine1: z.string().optional(),
  presentAddressLine2: z.string().optional(),
  presentPinCode: z.string().optional(),
  presentPhone: z.string().optional(),

  permanentCountry: z.string().optional(),
  permanentState: z.string().optional(),
  permanentCity: z.string().optional(),
  permanentAddressLine1: z.string().optional(),
  permanentAddressLine2: z.string().optional(),
  permanentPinCode: z.string().optional(),
  permanentPhone: z.string().optional(),

  // Tab 3 - Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyRelationship: z.string().optional(),
  emergencyPhone: z.string().optional(),
  emergencyAlternatePhone: z.string().optional(),
  emergencyEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  emergencyAddress: z.string().optional(),
  emergencyPrimaryContact: z.boolean().default(true),

  // Tab 4 - Statutory Details
  panNumber: z.string().optional(),
  aadhaarNumber: z.string().optional(),
  uan: z.string().optional(),
  pfNumber: z.string().optional(),
  esiNumber: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().optional(),
  voterId: z.string().optional(),
  drivingLicense: z.string().optional(),
  drivingLicenseExpiry: z.string().optional(),
  pfApplicable: z.boolean().default(false),
  esiApplicable: z.boolean().default(false),
  taxRegime: z.string().optional(),

  // Tab 5 - Bank Details
  bankName: z.string().optional(),
  branchName: z.string().optional(),
  accountNumber: z.string().optional(),
  confirmAccountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  accountType: z.string().optional(),
  accountHolderName: z.string().optional(),
  paymentMode: z.string().optional(),
  primaryAccount: z.boolean().default(true),

  // Tab 6 - Documents
  documents: z.array(documentSchema).optional(),

  // Tab 7 - Position Change
  positionChangeType: z.string().optional(),
  positionChangeEffectiveDate: z.string().optional(),
  positionChangeDepartmentId: z.string().optional(),
  positionChangeDesignationId: z.string().optional(),
  positionChangeGrade: z.string().optional(),
  positionChangeLocation: z.string().optional(),
  positionChangeReportingManagerId: z.string().optional(),
  positionChangeRemarks: z.string().optional(),

  // Tab 8 - Separation / Exit
  separationType: z.string().optional(),
  resignationDate: z.string().optional(),
  lastWorkingDate: z.string().optional(),
  exitNoticePeriod: z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)), z.number().optional()),
  separationReason: z.string().optional(),
  exitInterview: z.boolean().default(false),
  separationRemarks: z.string().optional(),

  // Tab 9 - Salary Revision
  revisionType: z.string().optional(),
  revisionEffectiveDate: z.string().optional(),
  revisionAnnualCTC: z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)), z.number().optional()),
  revisionIncrementPercentage: z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)), z.number().optional()),
  revisionSalaryComponents: z.array(z.object({
    componentName: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    percentage: z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)), z.number().optional()),
    amount: z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)), z.number().optional())
  })).optional(),
  revisionReason: z.string().optional(),

  // Tab 10 - Education
  educations: z.array(educationSchema).optional(),

  // Tab 11 - Family / Nominee
  families: z.array(familySchema).optional(),

  // Tab 12 - Employment Contract
  contractType: z.string().optional(),
  contractStartDate: z.string().optional(),
  contractEndDate: z.string().optional(),
  contractAnnualCTC: z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)), z.number().optional()),
  contractNoticePeriod: z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)), z.number().optional()),
  contractTerms: z.string().optional(),
  signedContractUpload: z.any().optional(),

  // Meta fields
  employmentStatus: z.string().default('ACTIVE'),
});

export const employeeFormSchema = baseEmployeeFormSchema.refine(data => !data.confirmAccountNumber || data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ["confirmAccountNumber"]
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
export const editEmployeeFormSchema = baseEmployeeFormSchema.partial();
