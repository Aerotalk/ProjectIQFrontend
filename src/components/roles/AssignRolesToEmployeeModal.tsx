import { useState, useEffect } from 'react';
import { type Role } from '../../services/roles.service';
import { X, Shield, Save, CheckCircle2, Building2, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { rolesService } from '../../services/roles.service';

interface Props {
  employee: any;
  onClose: () => void;
  onSuccess?: () => void;
}

const ORG_LEVEL = '__ORG_LEVEL__';

export default function AssignRolesToEmployeeModal({ employee, onClose, onSuccess }: Props) {
  const [scope, setScope] = useState(ORG_LEVEL);
  const [companies, setCompanies] = useState<any[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  
  const { user } = useAuth();

  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        if (user?.organizationId) {
          const companiesRes: any = await api.get(`/admin/companies`);
          setCompanies(Array.isArray(companiesRes) ? companiesRes : (companiesRes.content || []));
        }
      } catch (error) {
        console.error('Failed to fetch companies', error);
      }
    };
    fetchCompanies();
  }, [user]);

  // Fetch roles and assigned roles whenever scope changes
  useEffect(() => {
    const fetchRolesForScope = async () => {
      setIsLoading(true);
      try {
        const rolesRes = await rolesService.getAllRoles();
        
        // Filter roles based on scope
        const isOrgLevel = scope === ORG_LEVEL;
        const filteredRoles = rolesRes.filter((r: Role) => {
          if (isOrgLevel) {
            // Org-level: show org admin roles
            return r.roleName === 'ROLE_ORG_ADMIN' || r.roleName === 'ROLE_EMPLOYEE';
          } else {
            // Company-level: show company-scoped roles (exclude org admin)
            return r.roleName !== 'ROLE_ORG_ADMIN' && r.roleName !== 'ROLE_SUPER_ADMIN';
          }
        });
        setAllRoles(filteredRoles);

        // Fetch already-assigned roles for this scope
        const companyId = isOrgLevel ? undefined : scope;
        try {
          const assignedRoles = await rolesService.getAssignedRolesForEmployee(employee.id, companyId);
          const assignedIds = assignedRoles.map((r: Role) => r.id);

          // Auto-select ROLE_EMPLOYEE for company-level scope if not already assigned
          if (!isOrgLevel) {
            const employeeRole = filteredRoles.find((r: Role) => r.roleName === 'ROLE_EMPLOYEE');
            if (employeeRole && !assignedIds.includes(employeeRole.id)) {
              assignedIds.push(employeeRole.id);
            }
          }

          setSelectedRoleIds(assignedIds);
        } catch (error) {
          console.error('Failed to fetch assigned roles', error);
          // On error, auto-select ROLE_EMPLOYEE for company-level
          if (!isOrgLevel) {
            const employeeRole = filteredRoles.find((r: Role) => r.roleName === 'ROLE_EMPLOYEE');
            setSelectedRoleIds(employeeRole ? [employeeRole.id] : []);
          } else {
            setSelectedRoleIds([]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch roles', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRolesForScope();
  }, [employee, scope]);

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const companyId = scope === ORG_LEVEL ? undefined : scope;
      await rolesService.assignRolesToEmployee(employee.id, selectedRoleIds, companyId);
      
      const scopeLabel = scope === ORG_LEVEL ? 'organization' : 'selected company';
      setSuccessMsg(`Roles successfully assigned at the ${scopeLabel} level!`);
      setTimeout(() => {
        setSuccessMsg('');
        onSuccess?.();
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
          {/* Scope Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Role Scope</label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white appearance-none"
              >
                <option value={ORG_LEVEL}>🌐 Organization Level</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>🏢 {c.companyName}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              {scope === ORG_LEVEL ? (
                <><Globe size={12} /> Assign org-wide roles like Organization Admin</>
              ) : (
                <><Building2 size={12} /> Assign company-level roles for the selected company</>
              )}
            </p>
          </div>

          {/* Roles List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#792359] border-t-transparent"></div>
              <span className="ml-3 text-sm text-gray-500">Loading roles...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {scope === ORG_LEVEL ? 'Organization Roles' : 'Company Roles'}
              </label>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                {allRoles.length === 0 ? (
                  <p className="text-sm text-gray-500">No roles available for this scope.</p>
                ) : (
                  allRoles.map(role => {
                    const isSelected = selectedRoleIds.includes(role.id);
                    return (
                      <label 
                        key={role.id} 
                        className={`flex items-start gap-3 p-3 border rounded-sm cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#792359]/30 bg-[#792359]/5 dark:bg-[#792359]/10'
                            : 'border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleRole(role.id)}
                          className="mt-1 shrink-0 text-[#792359] focus:ring-[#792359] border-gray-300 rounded"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{role.roleName}</div>
                          {role.description && <div className="text-xs text-gray-500 mt-0.5">{role.description}</div>}
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 rounded-sm transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving || selectedRoleIds.length === 0 || isLoading}
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
