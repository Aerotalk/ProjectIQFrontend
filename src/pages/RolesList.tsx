import { useState, useEffect } from 'react';
import { rolesService, type Role } from '../services/roles.service';
import PermissionGate from '../components/PermissionGate';
import { Shield, Plus, Edit2, Users, Trash2, Key } from 'lucide-react';
import ManagePermissionsMatrix from '../components/roles/ManagePermissionsMatrix';
import AssignUsersModal from '../components/roles/AssignUsersModal';
import CreateRoleModal from '../components/roles/CreateRoleModal';
import EditRoleModal from '../components/roles/EditRoleModal';

export default function RolesList() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<Role | null>(null);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<Role | null>(null);
  const [selectedRoleForUsers, setSelectedRoleForUsers] = useState<Role | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const data = await rolesService.getAllRoles();
      setRoles((data as any).content || data);
    } catch (err) {
      console.error('Failed to fetch roles', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        await rolesService.deleteRole(id);
        fetchRoles();
      } catch (err: any) {
        console.error('Failed to delete role', err);
        alert(err.response?.data?.error || err.response?.data?.message || 'Failed to delete role');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Roles Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage system roles, permissions, and user assignments.</p>
        </div>
        <PermissionGate permission="role.create">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
          >
            <Plus size={16} />
            Create Role
          </button>
        </PermissionGate>
      </div>

      {/* Roles List */}
      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
            Available Roles
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/5 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-3 font-medium">Role Name</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">Loading roles...</td></tr>
              ) : roles.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">No roles found.</td></tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{role.roleName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{role.description || 'No description provided.'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        role.systemRole 
                          ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20'
                          : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                      }`}>
                        {role.systemRole ? 'System' : 'Custom'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                        <PermissionGate permission="role.edit">
                          <button 
                            onClick={() => setSelectedRoleForEdit(role)}
                            className="p-1.5 text-gray-400 hover:text-[#792359] dark:hover:text-[#e6a8d0] transition-colors rounded-sm hover:bg-gray-100 dark:hover:bg-white/5" 
                            title="Edit Role"
                          >
                            <Edit2 size={16} />
                          </button>
                        </PermissionGate>
                        
                        <PermissionGate permission="role.assign">
                          <button 
                            onClick={() => setSelectedRoleForPermissions(role)}
                            className="p-1.5 text-gray-400 hover:text-[#792359] dark:hover:text-[#e6a8d0] transition-colors rounded-sm hover:bg-gray-100 dark:hover:bg-white/5" 
                            title="Manage Permissions"
                          >
                            <Key size={16} />
                          </button>
                        </PermissionGate>
                        
                        <PermissionGate permission="role.assign">
                          <button 
                            onClick={() => setSelectedRoleForUsers(role)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-sm hover:bg-gray-100 dark:hover:bg-white/5" 
                            title="Assign Users"
                          >
                            <Users size={16} />
                          </button>
                        </PermissionGate>

                        <PermissionGate permission="role.delete">
                          <button 
                            onClick={() => handleDelete(role.id)}
                            disabled={role.systemRole}
                            className={`p-1.5 transition-colors rounded-sm ${role.systemRole ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10'}`}
                            title={role.systemRole ? "Cannot delete system role" : "Delete Role"}
                          >
                            <Trash2 size={16} />
                          </button>
                        </PermissionGate>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedRoleForEdit && (
        <EditRoleModal
          role={selectedRoleForEdit}
          onClose={() => setSelectedRoleForEdit(null)}
          onSuccess={() => {
            setSelectedRoleForEdit(null);
            fetchRoles();
          }}
        />
      )}

      {selectedRoleForPermissions && (
        <ManagePermissionsMatrix 
          role={selectedRoleForPermissions} 
          onClose={() => setSelectedRoleForPermissions(null)} 
        />
      )}

      {selectedRoleForUsers && (
        <AssignUsersModal 
          role={selectedRoleForUsers} 
          onClose={() => setSelectedRoleForUsers(null)} 
        />
      )}

      {isCreateModalOpen && (
        <CreateRoleModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchRoles();
          }}
        />
      )}

    </div>
  );
}
