import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Search, Plus, User, Mail, Briefcase, Trash2, Edit2, Loader2, MapPin, Eye } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import EmployeeDrawer from '../components/employee/EmployeeDrawer';
import EmployeeProfileView from '../components/employee/EmployeeProfileView';
import type { EmployeeFormValues } from '../components/employee/EmployeeDrawer/validators/employeeValidation';
import toast from 'react-hot-toast';

interface Employee {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  employeeCode: string;
  workEmail?: string;
  phone?: string;
  user?: {
    email: string;
    mobile?: string;
  };
  department?: {
    departmentName: string;
  };
  designation?: {
    designationName: string;
  };
  employmentStatus: string;
}

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editInitialData, setEditInitialData] = useState<Partial<EmployeeFormValues> | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/employees`);
      setEmployees(response);
    } catch (err: any) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Opens the employee drawer. For edit/view mode, first fetches all sub-resource
   * sections (address, statutory, bank, etc.) so every tab is pre-populated.
   */
  const openDrawer = async (mode: 'create' | 'edit' | 'view', emp?: Employee) => {
    setDrawerMode(mode);
    setSelectedEmployee(emp || null);

    if ((mode === 'edit' || mode === 'view') && emp?.id) {
      try {
        // Fetch core employee + all sub-resources in parallel
        const [
          address,
          emergency,
          statutory,
          bank,
          documents,
          salaryRevisions,
          educations,
          families,
          contract,
          positionChanges,
          separation,
        ] = await Promise.allSettled([
          api.get(`/admin/employees/${emp.id}/address`),
          api.get(`/admin/employees/${emp.id}/emergency-contact`),
          api.get(`/admin/employees/${emp.id}/statutory`),
          api.get(`/admin/employees/${emp.id}/bank-account`),
          api.get(`/admin/employees/${emp.id}/documents`),
          api.get(`/admin/employees/${emp.id}/salary-revision`),
          api.get(`/admin/employees/${emp.id}/educations`),
          api.get(`/admin/employees/${emp.id}/families`),
          api.get(`/admin/employees/${emp.id}/contract`),
          api.get(`/admin/employees/${emp.id}/position-change`),
          api.get(`/admin/employees/${emp.id}/separation`),
        ]);

        const val = <T,>(r: PromiseSettledResult<T>) =>
          r.status === 'fulfilled' ? r.value : null;

        // Parse address rows into flat present/permanent fields
        const addressRows: any[] = val(address) || [];
        const presentAddr = addressRows.find((a: any) => a.addressType === 'PRESENT') || {};
        const permanentAddr = addressRows.find((a: any) => a.addressType === 'PERMANENT') || {};

        // Emergency contact (first record)
        const emergencyRows: any[] = val(emergency) || [];
        const ec = emergencyRows[0] || {};

        const stat: any = val(statutory) || {};
        const bankRows: any[] = val(bank) || [];
        const bk = bankRows[0] || {};
        const docs: any[] = val(documents) || [];
        const edus: any[] = val(educations) || [];
        const fams: any[] = val(families) || [];
        const ctr: any = val(contract) || {};
        const salaries: any[] = val(salaryRevisions) || [];
        const latestSalary = salaries[0] || {}; // Most recent revision shown in form
        const posChanges: any[] = val(positionChanges) || [];
        const latestPos = posChanges[0] || {};
        const sep: any = val(separation) || {};

        const merged: Partial<EmployeeFormValues> = {
          // Core employee fields (already on emp)
          ...(emp as any),
          dateOfJoining: (emp as any).dateOfJoining || (emp as any).joiningDate || '',
          profilePhoto: (emp as any).profilePhoto || (emp as any).profilePicture || '',
          companyId: (emp as any).companyId || (emp as any).company?.id || '',
          departmentId: (emp as any).departmentId || (emp as any).department?.id || '',
          designationId: (emp as any).designationId || (emp as any).designation?.id || '',
          reportingManagerId: (emp as any).reportingManagerId || (emp as any).reportingManager?.id || '',
          hrManagerId: (emp as any).hrManagerId || (emp as any).hrManager?.id || '',
          // workEmail: prefer the column on Employee, fall back to linked User email
          workEmail: emp.workEmail || emp.user?.email || '',
          // phone: prefer the column on Employee, fall back to linked User mobile
          phone: emp.phone || emp.user?.mobile || '',

          // Address
          presentCountry: presentAddr.country || 'IN',
          presentState: presentAddr.state || '',
          presentCity: presentAddr.city || '',
          presentAddressLine1: presentAddr.addressLine1 || '',
          presentAddressLine2: presentAddr.addressLine2 || '',
          presentPinCode: presentAddr.pinCode || '',
          presentPhone: presentAddr.phone || '',
          permanentCountry: permanentAddr.country || 'IN',
          permanentState: permanentAddr.state || '',
          permanentCity: permanentAddr.city || '',
          permanentAddressLine1: permanentAddr.addressLine1 || '',
          permanentAddressLine2: permanentAddr.addressLine2 || '',
          permanentPinCode: permanentAddr.pinCode || '',
          permanentPhone: permanentAddr.phone || '',

          // Emergency contact
          emergencyContactName: ec.name || '',
          emergencyRelationship: ec.relationship || '',
          emergencyPhone: ec.phone || '',
          emergencyAlternatePhone: ec.alternatePhone || '',
          emergencyEmail: ec.email || '',
          emergencyAddress: ec.address || '',
          emergencyPrimaryContact: ec.primaryContact ?? true,

          // Statutory
          panNumber: stat.panNumber || '',
          aadhaarNumber: stat.aadhaarNumber || '',
          uan: stat.uan || '',
          pfNumber: stat.pfNumber || '',
          esiNumber: stat.esiNumber || '',
          passportNumber: stat.passportNumber || '',
          passportExpiry: stat.passportExpiry || '',
          voterId: stat.voterId || '',
          drivingLicense: stat.drivingLicense || '',
          drivingLicenseExpiry: stat.drivingLicenseExpiry || '',
          pfApplicable: stat.pfApplicable ?? false,
          esiApplicable: stat.esiApplicable ?? false,
          taxRegime: stat.taxRegime || '',

          // Bank
          bankName: bk.bankName || '',
          branchName: bk.branchName || '',
          accountNumber: bk.accountNumber || '',
          confirmAccountNumber: bk.accountNumber || '',
          ifscCode: bk.ifscCode || '',
          accountType: bk.accountType || 'Savings',
          accountHolderName: bk.accountHolderName || '',
          paymentMode: bk.paymentMode || 'Bank Transfer',
          primaryAccount: bk.primaryAccount ?? true,

          // Documents
          documents: docs.map((d: any) => ({
            documentCategory: d.documentCategory || '',
            documentName: d.documentName || '',
            fileUrl: d.fileId || null,
            expiryDate: d.expiryDate || '',
          })),

          // Salary (most recent shown)
          revisionType: latestSalary.revisionType || '',
          revisionEffectiveDate: latestSalary.effectiveDate || '',
          revisionAnnualCTC: latestSalary.annualCTC || '',
          revisionIncrementPercentage: latestSalary.incrementPercentage || '',
          revisionSalaryComponents: latestSalary.salaryComponents || '',
          revisionReason: latestSalary.reason || '',

          // Educations
          educations: edus.map((e: any) => ({
            degree: e.degree || '',
            qualification: e.qualification || '',
            institution: e.institution || '',
            fieldOfStudy: e.fieldOfStudy || '',
            startYear: e.startYear || '',
            endYear: e.endYear || '',
            grade: e.grade || '',
          })),

          // Families
          families: fams.map((f: any) => ({
            name: f.name || '',
            relationship: f.relationship || '',
            dateOfBirth: f.dateOfBirth || '',
            gender: f.gender || '',
            phone: f.phone || '',
            dependent: f.dependent ?? false,
            nominee: f.nominee ?? false,
            nomineePercentage: f.nomineePercentage || '',
          })),

          // Position Change
          positionChangeType: latestPos.changeType || '',
          positionChangeEffectiveDate: latestPos.effectiveDate || '',
          positionChangeDepartmentId: latestPos.departmentId || '',
          positionChangeDesignationId: latestPos.designationId || '',
          positionChangeGrade: latestPos.grade || '',
          positionChangeLocation: latestPos.location || '',
          positionChangeReportingManagerId: latestPos.reportingManagerId || '',
          positionChangeRemarks: latestPos.remarks || '',

          // Separation / Exit
          separationType: sep.separationType || '',
          resignationDate: sep.resignationDate || '',
          lastWorkingDate: sep.lastWorkingDate || '',
          exitNoticePeriod: sep.noticePeriodDays || '',
          separationReason: sep.separationReason || '',
          exitInterview: sep.exitInterview ?? false,
          separationRemarks: sep.separationRemarks || '',

          // Contract
          contractType: ctr.contractType || '',
          contractStartDate: ctr.startDate || '',
          contractEndDate: ctr.endDate || '',
          contractAnnualCTC: ctr.annualCTC || '',
          contractNoticePeriod: ctr.noticePeriodDays || '',
          contractTerms: ctr.contractTerms || '',
          signedContractUpload: ctr.signedContractFileId || null,
        };

        setEditInitialData(merged);
      } catch (err) {
        console.warn('Failed to load sub-resources for edit', err);
        setEditInitialData(emp as any);
      }
    } else {
      setEditInitialData(null);
    }

    setIsDrawerOpen(true);
  };

  const handleSaveEmployee = async (data: EmployeeFormValues) => {
    try {
      setIsSubmitting(true);
      let employeeId: string;

      if (drawerMode === 'create') {
        // Step 1 — Create user account first
        const userPayload = {
          username: data.workEmail,
          email: data.workEmail,
          mobile: data.phone,
          password: 'Password@123', // Default temporary password
          status: 'ACTIVE',
          role: 'ROLE_EMPLOYEE',
          companyId: data.companyId || null
        };
        const userRes = await api.post('/admin/users', userPayload);

        // Step 2 — Create core employee record
        const empPayload = {
          ...data,
          userId: userRes.id,
          companyId: data.companyId || null,
          departmentId: data.departmentId || null,
          designationId: data.designationId || null,
          reportingManagerId: data.reportingManagerId || null,
          hrManagerId: data.hrManagerId || null,
          joiningDate: data.dateOfJoining || null,
          dateOfBirth: data.dateOfBirth || null,
          profilePicture: data.profilePhoto || null,
        };
        const empRes = await api.post('/admin/employees', empPayload);
        employeeId = empRes.id;
        toast.success('Employee created successfully');
      } else if (drawerMode === 'edit' && selectedEmployee) {
        // Update core employee record
        const updatePayload = {
          ...data,
          companyId: data.companyId || null,
          departmentId: data.departmentId || null,
          designationId: data.designationId || null,
          reportingManagerId: data.reportingManagerId || null,
          hrManagerId: data.hrManagerId || null,
          joiningDate: data.dateOfJoining || null,
          dateOfBirth: data.dateOfBirth || null,
          profilePicture: data.profilePhoto || null,
        };
        await api.put(`/admin/employees/${selectedEmployee.id}`, updatePayload);
        employeeId = selectedEmployee.id;
        toast.success('Employee updated successfully');
      } else {
        return;
      }

      // Step 3 — Save sub-resource sections in parallel (failures are non-fatal per section)
      const subSaveTasks: Promise<any>[] = [];

      // Address (Tab 2)
      const hasAddress = data.presentAddressLine1 || data.permanentAddressLine1 ||
        data.presentCity || data.permanentCity;
      if (hasAddress) {
        subSaveTasks.push(
          api.put(`/admin/employees/${employeeId}/address`, {
            presentCountry: data.presentCountry,
            presentState: data.presentState,
            presentCity: data.presentCity,
            presentAddressLine1: data.presentAddressLine1,
            presentAddressLine2: data.presentAddressLine2,
            presentPinCode: data.presentPinCode,
            presentPhone: data.presentPhone,
            permanentCountry: data.permanentCountry,
            permanentState: data.permanentState,
            permanentCity: data.permanentCity,
            permanentAddressLine1: data.permanentAddressLine1,
            permanentAddressLine2: data.permanentAddressLine2,
            permanentPinCode: data.permanentPinCode,
            permanentPhone: data.permanentPhone,
          }).catch(e => console.warn('Address save failed', e))
        );
      }

      // Emergency Contact (Tab 3)
      if (data.emergencyContactName || data.emergencyPhone) {
        subSaveTasks.push(
          api.put(`/admin/employees/${employeeId}/emergency-contact`, {
            name: data.emergencyContactName,
            relationship: data.emergencyRelationship,
            phone: data.emergencyPhone,
            alternatePhone: data.emergencyAlternatePhone,
            email: data.emergencyEmail,
            address: data.emergencyAddress,
            primaryContact: data.emergencyPrimaryContact,
          }).catch(e => console.warn('Emergency contact save failed', e))
        );
      }

      // Statutory Details (Tab 4)
      if (data.panNumber || data.aadhaarNumber || data.uan) {
        subSaveTasks.push(
          api.put(`/admin/employees/${employeeId}/statutory`, {
            panNumber: data.panNumber,
            aadhaarNumber: data.aadhaarNumber,
            uan: data.uan,
            pfNumber: data.pfNumber,
            esiNumber: data.esiNumber,
            passportNumber: data.passportNumber,
            passportExpiry: data.passportExpiry,
            voterId: data.voterId,
            drivingLicense: data.drivingLicense,
            drivingLicenseExpiry: data.drivingLicenseExpiry,
            pfApplicable: data.pfApplicable,
            esiApplicable: data.esiApplicable,
            taxRegime: data.taxRegime,
          }).catch(e => console.warn('Statutory save failed', e))
        );
      }

      // Bank Account (Tab 5)
      if (data.bankName || data.accountNumber) {
        subSaveTasks.push(
          api.put(`/admin/employees/${employeeId}/bank-account`, {
            bankName: data.bankName,
            branchName: data.branchName,
            accountNumber: data.accountNumber,
            ifscCode: data.ifscCode,
            accountType: data.accountType,
            accountHolderName: data.accountHolderName,
            paymentMode: data.paymentMode,
            primaryAccount: data.primaryAccount,
          }).catch(e => console.warn('Bank account save failed', e))
        );
      }

      // Documents (Tab 6) — always send even if empty to clear server state
      if (data.documents && data.documents.length > 0) {
        const docPayload = data.documents.map((doc: any) => ({
          documentCategory: doc.documentCategory,
          documentName: doc.documentName,
          fileId: doc.fileUrl || null, // fileUrl holds UUID after upload
          expiryDate: doc.expiryDate,
        }));
        subSaveTasks.push(
          api.put(`/admin/employees/${employeeId}/documents`, docPayload)
            .catch(e => console.warn('Documents save failed', e))
        );
      }

      // Salary Revision (Tab 7) — POST (append) only if filled
      if (data.revisionType && data.revisionEffectiveDate) {
        subSaveTasks.push(
          api.post(`/admin/employees/${employeeId}/salary-revision`, {
            revisionType: data.revisionType,
            effectiveDate: data.revisionEffectiveDate,
            annualCTC: data.revisionAnnualCTC,
            incrementPercentage: data.revisionIncrementPercentage,
            salaryComponents: data.revisionSalaryComponents,
            reason: data.revisionReason,
          }).catch(e => console.warn('Salary revision save failed', e))
        );
      }

      // Education (Tab 8)
      if (data.educations && data.educations.length > 0) {
        subSaveTasks.push(
          api.put(`/admin/employees/${employeeId}/educations`, data.educations)
            .catch(e => console.warn('Educations save failed', e))
        );
      }

      // Family / Nominee (Tab 9)
      if (data.families && data.families.length > 0) {
        const familyPayload = (data.families as any[]).map(f => ({
          name: f.name,
          relationship: f.relationship,
          dateOfBirth: f.dateOfBirth,
          gender: f.gender,
          phone: f.phone,
          dependent: f.dependent,
          nominee: f.nominee,
          nomineePercentage: f.nomineePercentage,
        }));
        subSaveTasks.push(
          api.put(`/admin/employees/${employeeId}/families`, familyPayload)
            .catch(e => console.warn('Family save failed', e))
        );
      }

      // Contract (Tab 10)
      if (data.contractType || data.contractStartDate) {
        subSaveTasks.push(
          api.put(`/admin/employees/${employeeId}/contract`, {
            contractType: data.contractType,
            contractStartDate: data.contractStartDate,
            contractEndDate: data.contractEndDate,
            contractAnnualCTC: data.contractAnnualCTC,
            contractNoticePeriod: data.contractNoticePeriod,
            contractTerms: data.contractTerms,
            // signedContractUpload holds UUID after upload-on-select in the form
            signedContractFileId: data.signedContractUpload || null,
          }).catch(e => console.warn('Contract save failed', e))
        );
      }

      // Position Change
      if (data.positionChangeType || data.positionChangeEffectiveDate) {
        subSaveTasks.push(
          api.put(`/admin/employees/${employeeId}/position-change`, {
            positionChangeType: data.positionChangeType,
            positionChangeEffectiveDate: data.positionChangeEffectiveDate,
            positionChangeDepartmentId: data.positionChangeDepartmentId,
            positionChangeDesignationId: data.positionChangeDesignationId,
            positionChangeGrade: data.positionChangeGrade,
            positionChangeLocation: data.positionChangeLocation,
            positionChangeReportingManagerId: data.positionChangeReportingManagerId || null,
            positionChangeRemarks: data.positionChangeRemarks,
          }).catch(e => console.warn('Position change save failed', e))
        );
      }

      // Separation / Exit
      if (data.separationType || data.resignationDate || data.lastWorkingDate) {
        subSaveTasks.push(
          api.put(`/admin/employees/${employeeId}/separation`, {
            separationType: data.separationType,
            resignationDate: data.resignationDate,
            lastWorkingDate: data.lastWorkingDate,
            exitNoticePeriod: data.exitNoticePeriod,
            separationReason: data.separationReason,
            exitInterview: data.exitInterview,
            separationRemarks: data.separationRemarks,
          }).catch(e => console.warn('Separation save failed', e))
        );
      }

      await Promise.all(subSaveTasks);

      setIsDrawerOpen(false);
      fetchEmployees();
    } catch (err: any) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDrawerOpen) {
    return (
      <div className="max-w-[1400px] mx-auto">
        <EmployeeDrawer
          isOpen={isDrawerOpen}
          onClose={() => { setIsDrawerOpen(false); setEditInitialData(null); }}
          onSave={handleSaveEmployee}
          mode={drawerMode}
          initialData={(drawerMode === 'edit' || drawerMode === 'view') ? editInitialData as any : undefined}
          employeeId={selectedEmployee?.employeeCode}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  if (viewingEmployee) {
    return (
      <div className="max-w-[1400px] mx-auto animate-in fade-in zoom-in-95 duration-300">
        <EmployeeProfileView
          employee={viewingEmployee}
          onClose={() => setViewingEmployee(null)}
          onEdit={() => {
            setViewingEmployee(null);
            openDrawer('edit', viewingEmployee);
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Employee Directory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and view all members of your organization.</p>
        </div>

        <button
          onClick={() => openDrawer('create')}
          className="flex items-center gap-2 bg-primary hover:bg-[#5d1944] text-white px-4 py-2.5 rounded-sm font-medium text-sm transition-colors shadow-sm hover:shadow-md"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      <div className="bg-white dark:bg-[#181a1f] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:bg-white dark:focus:bg-[#181a1f] focus:border-primary dark:focus:border-primary transition-all outline-none text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="w-40 shrink-0">
            <CustomSelect
              value=""
              onChange={() => { }}
              options={[
                { label: 'All Departments', value: '' }
              ]}
            />
          </div>
          <div className="w-36 shrink-0">
            <CustomSelect
              value=""
              onChange={() => { }}
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' }
              ]}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm">
          <Loader2 className="animate-spin text-primary mb-4" size={32} />
          <p className="text-gray-500 font-medium">Loading employees...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm text-center px-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <p className="text-red-500 font-semibold">{error}</p>
          <button onClick={fetchEmployees} className="mt-4 text-sm font-medium text-primary hover:underline">Try Again</button>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm text-center px-4">
          <div className="w-16 h-16 bg-gray-50 dark:bg-black/20 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <User size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No employees found</h3>
          <p className="text-gray-500 max-w-sm">We couldn't find any employees matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => (
            <div key={emp.id} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden flex flex-col p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#b8458f] flex items-center justify-center text-white text-base font-bold shadow-sm shrink-0">
                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {emp.firstName} {emp.middleName ? emp.middleName + ' ' : ''}{emp.lastName}
                    </h3>
                    <p className="text-xs font-medium text-primary dark:text-secondary truncate">
                      {emp.designation?.designationName || 'No Designation'}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider shrink-0 ${emp.employmentStatus === 'ACTIVE' || !emp.employmentStatus
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                  {emp.employmentStatus || 'Active'}
                </div>
              </div>

              <div className="space-y-2 mb-5 flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Briefcase size={14} className="text-gray-400 shrink-0" />
                  <span className="truncate">{emp.department?.departmentName || 'No Department'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin size={14} className="text-gray-400 shrink-0" />
                  <span className="truncate">EMP: {emp.employeeCode || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Mail size={14} className="text-gray-400 shrink-0" />
                  <span className="truncate" title={emp.user?.email}>{emp.user?.email || 'No Email Linked'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                <button 
                  onClick={() => setViewingEmployee(emp)}
                  className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <Eye size={14} /> View
                </button>
                <button 
                  onClick={() => openDrawer('edit', emp)}
                  className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
