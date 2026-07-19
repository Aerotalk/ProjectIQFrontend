import { useState, useEffect } from 'react';
import { type Role, rolesService } from '../../services/roles.service';
import { X, Users, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import CustomSelect from '@/components/ui/CustomSelect';

interface Props {
  role: Role;
  onClose: () => void;
}

export default function AssignUsersModal({ role, onClose }: Props) {
  const [employeeId, setEmployeeId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companies, setCompanies] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    const fetchCompanies = async () => {
      if (user?.organizationId) {
        try {
          const res: any = await api.get(`/admin/companies`);
          setCompanies(Array.isArray(res) ? res : (res.content || []));
        } catch (error) {
          console.error('Failed to fetch companies', error);
        }
      }
    };
    fetchCompanies();
  }, [user]);

  const handleSave = async () => {
    if (!employeeId || !companyId) return;
    try {
      setIsSaving(true);
      await rolesService.assignRolesToEmployee(employeeId, [role.id], companyId);
      
      setSuccessMsg('Role successfully assigned to employee for the selected company!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to assign user', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#181a1f] rounded-lg shadow-xl w-full max-w-md flex flex-col border border-gray-200 dark:border-white/10">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-blue-600 dark:text-blue-400" />
              Assign Role to Employee
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mx-6 mt-4 flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-sm text-sm border border-green-200">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Assign the <span className="font-semibold text-gray-900 dark:text-white">{role.roleName}</span> role to an existing employee for a specific company.
          </p>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Target Company</label>
            <div className="relative z-50">
              <CustomSelect
                value={companyId}
                onChange={(val) => setCompanyId(val)}
                options={[
                  { label: 'Select a company', value: '' },
                  ...companies.map(c => ({ label: c.companyName, value: c.id }))
                ]}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Employee ID</label>
            <input 
              type="text" 
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter Employee ID" 
              className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white" 
            />
          </div>
          <p className="text-xs text-gray-400">Note: In a full implementation, this would be a searchable dropdown of employees.</p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 rounded-sm transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving || !employeeId || !companyId}
            className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-6 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isSaving ? 'Assigning...' : 'Assign Role'}
          </button>
        </div>

      </div>
    </div>
  );
}
