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
  user?: {
    email: string;
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

  const openDrawer = (mode: 'create' | 'edit' | 'view', emp?: Employee) => {
    setDrawerMode(mode);
    setSelectedEmployee(emp || null);
    setIsDrawerOpen(true);
  };

  const handleSaveEmployee = async (data: EmployeeFormValues) => {
    try {
      setIsSubmitting(true);
      if (drawerMode === 'create') {
        // Create user account first
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
        
        // Create employee profile
        const empPayload = {
          userId: userRes.id,
          ...data
        };
        await api.post(`/admin/employees`, empPayload);
        toast.success('Employee created successfully');
      } else if (drawerMode === 'edit' && selectedEmployee) {
        // Update employee
        await api.put(`/admin/employees/${selectedEmployee.id}`, data);
        toast.success('Employee updated successfully');
      }
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
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSaveEmployee}
          mode={drawerMode}
          initialData={selectedEmployee as any}
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
          className="flex items-center gap-2 bg-[#792359] hover:bg-[#5d1944] text-white px-4 py-2.5 rounded-sm font-medium text-sm transition-colors shadow-sm hover:shadow-md"
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
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:bg-white dark:focus:bg-[#181a1f] focus:border-[#792359] dark:focus:border-[#792359] transition-all outline-none text-gray-800 dark:text-gray-200"
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
          <Loader2 className="animate-spin text-[#792359] mb-4" size={32} />
          <p className="text-gray-500 font-medium">Loading employees...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm text-center px-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <p className="text-red-500 font-semibold">{error}</p>
          <button onClick={fetchEmployees} className="mt-4 text-sm font-medium text-[#792359] hover:underline">Try Again</button>
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#792359] to-[#b8458f] flex items-center justify-center text-white text-base font-bold shadow-sm shrink-0">
                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {emp.firstName} {emp.middleName ? emp.middleName + ' ' : ''}{emp.lastName}
                    </h3>
                    <p className="text-xs font-medium text-[#792359] dark:text-[#e6a8d0] truncate">
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
                  className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-[#792359] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <Eye size={14} /> View
                </button>
                <button 
                  onClick={() => openDrawer('edit', emp)}
                  className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-[#792359] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
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
