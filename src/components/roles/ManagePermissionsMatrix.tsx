import { useState, useEffect } from 'react';
import { type Role } from '../../services/roles.service';
import { permissionsService, type PermissionMatrix } from '../../services/permissions.service';
import { X, Save, CheckCircle2, Shield } from 'lucide-react';

interface Props {
  role: Role;
  onClose: () => void;
}

export default function ManagePermissionsMatrix({ role, onClose }: Props) {
  const [matrix, setMatrix] = useState<PermissionMatrix>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch full matrix
        const matrixData = await permissionsService.getPermissionMatrix();
        setMatrix(matrixData);

        // Fetch currently assigned permissions for role.
        // Wait, the getRoleById returns a role which might have permissions?
        // Let's assume there's an endpoint to get permissions for a role OR the role object has it.
        // If not, we might need a specific endpoint or to check role.permissions if the API returns them.
        
        // As a placeholder, we'll try to extract them if role.permissions exists.
        const roleWithPerms: any = role; // Replace with actual backend fetch if needed
        if (roleWithPerms.permissions) {
          const ids = roleWithPerms.permissions.map((p: any) => p.id);
          setSelectedIds(new Set(ids));
        }

      } catch (error) {
        console.error('Failed to load permissions matrix', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [role.id]);

  const handleToggle = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await permissionsService.updateRolePermissions(role.id, Array.from(selectedIds));
      setSuccessMsg('Permissions updated successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to save permissions', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#181a1f] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-white/10">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield size={20} className="text-[#792359] dark:text-[#e6a8d0]" />
              Manage Permissions
            </h2>
            <p className="text-sm text-gray-500 mt-1">Configuring access for <span className="font-semibold text-gray-700 dark:text-gray-300">{role.roleName}</span></p>
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

        {/* Body / Matrix */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#792359]"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(matrix).map(([moduleName, permissions]) => (
                <div key={moduleName} className="bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-sm p-5">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-gray-200 dark:border-white/5">
                    {moduleName}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {permissions.map((perm) => (
                      <label key={perm.id} className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(perm.id)}
                            onChange={() => handleToggle(perm.id)}
                            className="peer sr-only"
                          />
                          <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-sm peer-checked:bg-[#792359] peer-checked:border-[#792359] transition-all flex items-center justify-center">
                            <CheckCircle2 size={12} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#792359] dark:group-hover:text-[#e6a8d0] transition-colors">{perm.permissionName}</span>
                          <span className="text-[10px] text-gray-400 max-w-[120px] truncate" title={perm.description}>{perm.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 rounded-sm transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-6 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>

      </div>
    </div>
  );
}
