import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { rolesService } from '../../services/roles.service';
import type { Role } from '../../types/role.types';

interface EditRoleModalProps {
  role: Role;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditRoleModal({ role, onClose, onSuccess }: EditRoleModalProps) {
  const [roleName, setRoleName] = useState(role.roleName);
  const [description, setDescription] = useState(role.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setError('Role name is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await rolesService.updateRole(role.id, { roleName, description });
      
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update role');
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
      
      <div className="relative bg-white dark:bg-[#1e2025] rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Role Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-md text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#792359] dark:focus:ring-[#e6a8d0] text-gray-900 dark:text-white sm:text-sm transition-colors"
                placeholder="e.g., HR Manager"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="mb-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#792359] dark:focus:ring-[#e6a8d0] text-gray-900 dark:text-white sm:text-sm transition-colors"
                placeholder="Brief description of this role's responsibilities"
                rows={3}
                disabled={isLoading}
              />
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
              disabled={isLoading || !roleName.trim()}
              className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-6 py-2 text-sm font-medium rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
