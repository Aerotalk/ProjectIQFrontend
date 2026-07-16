import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Shield, User as UserIcon, Mail } from 'lucide-react';
import { api } from '../../lib/api';
import CustomSelect from '../ui/CustomSelect';

interface Role {
  id: string;
  roleName: string;
  description: string;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  mobile: string;
  status: string;
  roles?: Role[];
}

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
  onSuccess: () => void;
}

export default function UserDrawer({ isOpen, onClose, user, onSuccess }: UserDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  
  const [status, setStatus] = useState('ACTIVE');
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      setStatus(user.status || 'ACTIVE');
      setSelectedRoleIds(user.roles?.map(r => r.id) || []);
    } else {
      setStatus('ACTIVE');
      setSelectedRoleIds([]);
    }
  }, [user]);

  const fetchRoles = async () => {
    try {
      const res = await api.get('/admin/roles/available');
      setAvailableRoles(res);
    } catch (err) {
      console.error('Failed to fetch available roles:', err);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      await api.put(`/admin/users/${user.id}`, {
        status,
        roleIds: selectedRoleIds
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId) 
        : [...prev, roleId]
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-[#181a1f] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-white/10 flex flex-col"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
              Manage User Access
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Edit roles and status for {user?.email}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-sm text-sm">
              {error}
            </div>
          )}

          {/* User Info Read-only */}
          <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-sm border border-gray-200 dark:border-white/10 space-y-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-2">User Details</h3>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <UserIcon size={16} className="text-gray-400" />
              <span className="font-medium">{user?.username}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <Mail size={16} className="text-gray-400" />
              <span>{user?.email}</span>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Account Status</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={status === 'ACTIVE'}
                  onChange={() => setStatus('ACTIVE')}
                  className="text-[#792359] focus:ring-[#792359]"
                />
                <span className="text-sm text-gray-900 dark:text-white">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={status === 'INACTIVE'}
                  onChange={() => setStatus('INACTIVE')}
                  className="text-[#792359] focus:ring-[#792359]"
                />
                <span className="text-sm text-gray-900 dark:text-white">Inactive</span>
              </label>
            </div>
          </div>

          {/* Roles Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Assigned Roles</label>
            <div className="space-y-2">
              {availableRoles.length === 0 ? (
                <p className="text-sm text-gray-500">Loading roles or no roles available.</p>
              ) : (
                availableRoles.map(role => {
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
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-[#792359] hover:bg-[#52173c] disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
