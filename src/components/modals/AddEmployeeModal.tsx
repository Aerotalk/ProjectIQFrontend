import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Lock, Briefcase } from 'lucide-react';
import { api } from '../../lib/api';
import CustomSelect from '@/components/ui/CustomSelect';
import SharedPhoneInput from '@/components/shared/SharedPhoneInput';

import { useAuth } from '../../contexts/AuthContext';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }: AddEmployeeModalProps) {
  const { user } = useAuth();
  const isCompanyScopedUser = !!user?.companyId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(user?.companyId || '');
  
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    departmentId: '',
    designationId: '',
    gender: 'MALE',
    employmentStatus: 'ACTIVE'
  });

  useEffect(() => {
    if (isOpen && !isCompanyScopedUser) {
      api.get('/org/companies')
        .then((res: any[]) => {
          setCompanies(res);
          if (res.length > 0 && !selectedCompanyId) {
            setSelectedCompanyId(res[0].id);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, isCompanyScopedUser]);

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen, selectedCompanyId]);

  const fetchDropdownData = async () => {
    try {
      const query = selectedCompanyId ? `?companyId=${selectedCompanyId}` : '';
      const [deptRes, desigRes] = await Promise.all([
        api.get(`/admin/departments${query}`),
        api.get(`/admin/designations${query}`)
      ]);

      setDepartments(deptRes);
      setDesignations(desigRes);
    } catch (err) {
      console.error("Failed to load departments/designations", err);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create the User account
      const userPayload = {
        username: formData.email,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        status: 'ACTIVE',
        role: 'ROLE_EMPLOYEE',
        companyId: selectedCompanyId || null
      };

      const userRes = await api.post('/admin/users', userPayload);
      const userId = userRes.id;

      // 2. Create the Employee profile linked to the User
      const empPayload = {
        userId: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        departmentId: formData.departmentId || null,
        designationId: formData.designationId || null,
        employmentStatus: formData.employmentStatus
      };

      await api.post(`/admin/employees`, empPayload);

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#181a1f] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-white/10">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Employee</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Create a user account and employee profile.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto custom-scrollbar pb-32">
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-md flex items-center gap-2">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          <form id="add-emp-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Personal Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={16} className="text-[#792359] dark:text-[#e6a8d0]" /> Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                  <CustomSelect
                    value={formData.gender}
                    onChange={(val) => setFormData({ ...formData, gender: val })}
                    options={[
                      { label: 'Male', value: 'MALE' },
                      { label: 'Female', value: 'FEMALE' },
                      { label: 'Other', value: 'OTHER' }
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100 dark:bg-white/5"></div>

            {/* Account Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lock size={16} className="text-[#792359] dark:text-[#e6a8d0]" /> Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white" />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
                  <SharedPhoneInput
                    value={formData.mobile}
                    onChange={(val) => setFormData({ ...formData, mobile: val })}
                    defaultCountry="IN"
                  />
                </div>
                <div className="relative md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Temporary Password *</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input required type="text" name="password" value={formData.password} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Employee will use this to log in initially.</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100 dark:bg-white/5"></div>

            {/* Employment Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Briefcase size={16} className="text-[#792359] dark:text-[#e6a8d0]" /> Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {!isCompanyScopedUser && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company (For Department & Designation)</label>
                    <select
                      value={selectedCompanyId}
                      onChange={(e) => {
                        setSelectedCompanyId(e.target.value);
                        setFormData({ ...formData, departmentId: '', designationId: '' });
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white"
                    >
                      <option value="">Select Company</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>{c.companyName}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                  <CustomSelect
                    value={formData.departmentId}
                    onChange={(val) => setFormData({ ...formData, departmentId: val })}
                    options={[
                      { label: '-- Select Department --', value: '' },
                      ...departments.map(d => ({ label: d.departmentName, value: d.id }))
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Designation</label>
                  <CustomSelect
                    value={formData.designationId}
                    onChange={(val) => setFormData({ ...formData, designationId: val })}
                    options={[
                      { label: '-- Select Designation --', value: '' },
                      ...designations.map(d => ({ label: d.designationName, value: d.id }))
                    ]}
                  />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-emp-form"
            disabled={loading}
            className="px-6 py-2 bg-[#792359] hover:bg-[#5d1944] disabled:opacity-70 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2"
          >
            {loading ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : null}
            {loading ? 'Creating...' : 'Create Employee'}
          </button>
        </div>

      </div>
    </div>
  );
}
