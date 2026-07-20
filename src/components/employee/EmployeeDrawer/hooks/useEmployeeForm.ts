import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema, type EmployeeFormValues } from '../validators/employeeValidation';

export const useEmployeeForm = (initialData?: Partial<EmployeeFormValues>) => {
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
      ...initialData
    }
  });
};
