import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema, type EmployeeFormValues } from '../validators/employeeValidation';

const removeNulls = (obj: any): any => {
  if (obj === null) return undefined;
  if (Array.isArray(obj)) return obj.map(removeNulls);
  if (typeof obj === 'object' && obj !== undefined) {
    const newObj: any = {};
    for (const key in obj) {
      const val = removeNulls(obj[key]);
      if (val !== undefined) {
        newObj[key] = val;
      }
    }
    return newObj;
  }
  return obj;
};

export const useEmployeeForm = (initialData?: Partial<EmployeeFormValues>) => {
  const sanitizedData = initialData ? removeNulls(initialData) : {};
  
  return useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      workEmail: '',
      phone: '',
      alternatePhone: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      bloodGroup: '',
      nationality: '',
      
      dateOfJoining: '',
      employmentType: '',
      companyId: '',
      departmentId: '',
      designationId: '',
      location: '',
      grade: '',
      reportingManagerId: '',
      hrManagerId: '',
      weeklyOff: '',
      fatherName: '',
      noticePeriodDays: 30,

      sameAsPresentAddress: false,
      presentCountry: 'IN',
      presentState: '',
      presentCity: '',
      presentAddressLine1: '',
      presentAddressLine2: '',
      presentPinCode: '',
      presentPhone: '',

      permanentCountry: 'IN',
      permanentState: '',
      permanentCity: '',
      permanentAddressLine1: '',
      permanentAddressLine2: '',
      permanentPinCode: '',
      permanentPhone: '',

      emergencyContactName: '',
      emergencyRelationship: '',
      emergencyPhone: '',
      emergencyAlternatePhone: '',
      emergencyEmail: '',
      emergencyAddress: '',
      emergencyPrimaryContact: true,

      panNumber: '',
      aadhaarNumber: '',
      uan: '',
      pfNumber: '',
      esiNumber: '',
      passportNumber: '',
      passportExpiry: '',
      voterId: '',
      drivingLicense: '',
      drivingLicenseExpiry: '',
      pfApplicable: false,
      esiApplicable: false,
      taxRegime: '',

      bankName: '',
      branchName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      accountType: 'Savings',
      accountHolderName: '',
      paymentMode: 'Bank Transfer',
      primaryAccount: true,

      documents: [],
      educations: [],
      families: [],

      employmentStatus: 'ACTIVE',
      ...sanitizedData
    }
  });
};
