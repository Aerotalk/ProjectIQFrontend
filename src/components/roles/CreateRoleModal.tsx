import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { rolesService } from '../../services/roles.service';
import { permissionsService, type PermissionMatrix } from '../../services/permissions.service';

interface CreateRoleModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRoleModal({ onClose, onSuccess }: CreateRoleModalProps) {
  const [roleName, setRoleName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMatrix, setIsFetchingMatrix] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [matrix, setMatrix] = useState<PermissionMatrix>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        setIsFetchingMatrix(true);
        const matrixData = await permissionsService.getPermissionMatrix();
        setMatrix(matrixData);
      } catch (err) {
        console.error('Failed to load permissions matrix', err);
        setError('Failed to load permissions. Please try again.');
      } finally {
        setIsFetchingMatrix(false);
      }
    };
    fetchMatrix();
  }, []);

  const handleToggle = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setError('Role name is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Step 1: Create Role
      const newRole = await rolesService.createRole({ roleName, description: '' });

      // Step 2: Assign Permissions
      if (selectedIds.size > 0 && newRole?.id) {
        await permissionsService.updateRolePermissions(newRole.id, Array.from(selectedIds));
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-[#1e2025] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Role</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-md text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full max-w-md px-3 py-2 bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#792359] dark:focus:ring-[#e6a8d0] text-gray-900 dark:text-white sm:text-sm transition-colors"
                placeholder="e.g., HR Manager"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="mt-8 border-t border-gray-100 dark:border-white/5 pt-6">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Select Permissions</h3>
              
              {isFetchingMatrix ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="animate-spin text-[#792359] w-8 h-8" />
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(matrix).map(([moduleName, permissions]) => (
                    <div key={moduleName} className="bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-sm p-4">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 pb-2 border-b border-gray-200 dark:border-white/5">
                        {moduleName}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {permissions.map((perm) => (
                          <label key={perm.id} className="flex items-start gap-2 cursor-pointer group">
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
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#792359] dark:group-hover:text-[#e6a8d0] transition-colors leading-snug">{perm.permissionName}</span>
                              <span className="text-[10px] text-gray-400 max-w-[120px] truncate mt-0.5" title={perm.description}>{perm.description}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/20 flex justify-end gap-3 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent border border-gray-300 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isFetchingMatrix}
              className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-6 py-2 text-sm font-medium rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Role'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
