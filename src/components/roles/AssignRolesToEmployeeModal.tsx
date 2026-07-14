import { useState, useEffect } from 'react';
import { type Role } from '../../services/roles.service';
import { X, Shield, Save, CheckCircle2, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { rolesService } from '../../services/roles.service';

interface Props {
  employee: any;
  onClose: () => void;
}

export default function AssignRolesToEmployeeModal({ employee, onClose }: Props) {
  const [companyId, setCompanyId] = useState('');
  const [companies, setCompanies] = useState<any[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.organizationId) {
          const companiesRes: any = await api.get(`/admin/companies?organizationId=${user.organizationId}`);
          setCompanies(Array.isArray(companiesRes) ? companiesRes : (companiesRes.content || []));
        }
        const rolesRes = await rolesService.getAllRoles();
        setAllRoles(rolesRes);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchAssignedRoles = async () => {
      if (companyId && employee?.id) {
        try {
          const assignedRoles = await rolesService.getAssignedRolesForEmployee(employee.id, companyId);
          setSelectedRoleIds(assignedRoles.map((r: Role) => r.id));
        } catch (error) {
          console.error('Failed to fetch assigned roles', error);
          setSelectedRoleIds([]);
        }
      } else {
        setSelectedRoleIds([]);
      }
    };
    fetchAssignedRoles();
  }, [companyId, employee]);

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSave = async () => {
    if (!companyId) return;
    try {
      setIsSaving(true);
      
      // Ensure ROLE_EMPLOYEE is always included to prevent accidental removal
      const employeeRole = allRoles.find(r => r.roleName === 'ROLE_EMPLOYEE');
      const finalRoleIds = [...selectedRoleIds];
      if (employeeRole && !finalRoleIds.includes(employeeRole.id)) {
        finalRoleIds.push(employeeRole.id);
      }
      
      await rolesService.assignRolesToEmployee(employee.id, companyId, finalRoleIds);
      
      setSuccessMsg('Roles successfully assigned to the employee for the selected company!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to assign roles', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#181a1f] rounded-lg shadow-xl w-full max-w-md flex flex-col border border-gray-200 dark:border-white/10 max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield size={18} className="text-blue-600 dark:text-blue-400" />
              Assign Roles
            </h2>
            <p className="text-xs text-gray-500 mt-1">For {employee.firstName} {employee.lastName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mx-6 mt-4 flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-sm text-sm border border-green-200 shrink-0">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Target Company</label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white appearance-none"
              >
                <option value="" disabled>Select a company</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Available Roles</label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {allRoles.length === 0 ? (
                <p className="text-sm text-gray-500">No roles found.</p>
              ) : (
                allRoles.map(role => {
                  const isEmployeeRole = role.roleName === 'ROLE_EMPLOYEE';
                  return (
                  <label key={role.id} className={`flex items-start gap-3 p-3 border border-gray-100 dark:border-white/5 rounded-sm hover:bg-gray-50 dark:hover:bg-white/[0.02] ${isEmployeeRole ? 'cursor-not-allowed opacity-75 bg-gray-50 dark:bg-white/[0.02]' : 'cursor-pointer'} transition-colors`}>
                    <input 
                      type="checkbox" 
                      checked={isEmployeeRole || selectedRoleIds.includes(role.id)}
                      disabled={isEmployeeRole}
                      onChange={() => toggleRole(role.id)}
                      className="mt-1 shrink-0 text-[#792359] focus:ring-[#792359] border-gray-300 rounded disabled:opacity-50"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        {role.roleName}
                        {isEmployeeRole && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-sm font-bold tracking-wider">LOCKED</span>}
                      </div>
                      {role.description && <div className="text-xs text-gray-500 mt-0.5">{role.description}</div>}
                    </div>
                  </label>
                )})
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 rounded-sm transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving || !companyId || selectedRoleIds.length === 0}
            className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-6 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Assign Roles'}
          </button>
        </div>

      </div>
    </div>
  );
}
