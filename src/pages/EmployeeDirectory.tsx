import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Search, Plus, User, Mail, Briefcase, Trash2, Edit2, Loader2, MapPin } from 'lucide-react';
import AddEmployeeModal from '../components/modals/AddEmployeeModal';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Employee Directory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and view all members of your organization.</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
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
           <select className="flex-1 sm:flex-none text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm px-3 py-2 outline-none focus:border-[#792359] text-gray-700 dark:text-gray-300">
             <option value="">All Departments</option>
           </select>
           <select className="flex-1 sm:flex-none text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm px-3 py-2 outline-none focus:border-[#792359] text-gray-700 dark:text-gray-300">
             <option value="">All Statuses</option>
             <option value="ACTIVE">Active</option>
             <option value="INACTIVE">Inactive</option>
           </select>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredEmployees.map((emp) => (
            <div key={emp.id} className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden flex flex-col hover:-translate-y-1">
              <div className="h-20 bg-gradient-to-r from-[#792359]/10 to-[#e6a8d0]/10 dark:from-[#792359]/20 dark:to-transparent w-full"></div>
              
              <div className="px-5 pb-5 flex-1 flex flex-col">
                <div className="relative -mt-10 mb-3 flex justify-between items-start">
                  <div className="w-20 h-20 bg-white dark:bg-[#181a1f] rounded-full p-1 shadow-sm">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#792359] to-[#b8458f] flex items-center justify-center text-white text-xl font-bold border border-white/10">
                      {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                    </div>
                  </div>
                  
                  <div className={`px-2 py-0.5 mt-10 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                    emp.employmentStatus === 'ACTIVE' || !emp.employmentStatus
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {emp.employmentStatus || 'Active'}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                  {emp.firstName} {emp.middleName ? emp.middleName + ' ' : ''}{emp.lastName}
                </h3>
                
                <p className="text-sm font-medium text-[#792359] dark:text-[#e6a8d0] mb-4">
                  {emp.designation?.designationName || 'No Designation'}
                </p>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Briefcase size={14} className="text-gray-400" />
                    <span className="truncate">{emp.department?.departmentName || 'No Department'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate">EMP: {emp.employeeCode || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Mail size={14} className="text-gray-400" />
                    <span className="truncate" title={emp.user?.email}>{emp.user?.email || 'No Email Linked'}</span>
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5 flex gap-2">
                  <button className="flex-1 py-1.5 flex justify-center items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#792359] hover:bg-[#792359]/5 dark:hover:bg-white/5 rounded-sm transition-colors">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button className="flex-1 py-1.5 flex justify-center items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-sm transition-colors">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddEmployeeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchEmployees}
      />
    </div>
  );
}
