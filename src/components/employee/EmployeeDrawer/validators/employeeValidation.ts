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

export const employeeFormSchema = z.object({
  // Tab 1 - Basic Info - Personal
  firstName: z.string().min(1, 'First Name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last Name is required'),
  workEmail: z.string().email('Invalid email format').min(1, 'Work Email is required'),
  phone: z.string().min(1, 'Phone is required'),
  alternatePhone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  bloodGroup: z.string().optional(),
  nationality: z.string().optional(),
  profilePhoto: z.any().optional(),
  
  // Tab 1 - Basic Info - Employment
  dateOfJoining: z.string().optional(),
  employmentType: z.string().optional(),
  companyId: z.string().min(1, 'Company is required'),
  departmentId: z.string().optional(),
  designationId: z.string().optional(),
  location: z.string().optional(),
  grade: z.string().optional(),
  reportingManagerId: z.string().optional(),
  hrManagerId: z.string().optional(),
  weeklyOff: z.string().optional(),
  fatherName: z.string().optional(),
  noticePeriodDays: z.number().optional(),

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
  exitNoticePeriod: z.number().optional(),
  separationReason: z.string().optional(),
  exitInterview: z.boolean().default(false),
  separationRemarks: z.string().optional(),

  // Tab 9 - Salary Revision
  revisionType: z.string().optional(),
  revisionEffectiveDate: z.string().optional(),
  revisionAnnualCTC: z.number().optional(),
  revisionIncrementPercentage: z.number().optional(),
  revisionSalaryComponents: z.string().optional(),
  revisionReason: z.string().optional(),

  // Tab 10 - Education
  educations: z.array(educationSchema).optional(),

  // Tab 11 - Family / Nominee
  families: z.array(familySchema).optional(),

  // Tab 12 - Employment Contract
  contractType: z.string().optional(),
  contractStartDate: z.string().optional(),
  contractEndDate: z.string().optional(),
  contractAnnualCTC: z.number().optional(),
  contractNoticePeriod: z.number().optional(),
  contractTerms: z.string().optional(),
  signedContractUpload: z.any().optional(),

  // Meta fields
  employmentStatus: z.string().default('ACTIVE'),
}).refine(data => !data.confirmAccountNumber || data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ["confirmAccountNumber"]
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
