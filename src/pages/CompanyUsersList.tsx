import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Search, Loader2, User as UserIcon, Edit2 } from 'lucide-react';
import UserDrawer from '../components/users/UserDrawer';

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

export default function CompanyUsersList() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response: any = await api.get(`/admin/users`);
      const data = Array.isArray(response) ? response : (response.content || []);
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: UserData) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedUser(null), 300); // Wait for transition
  };

  const handleSaveSuccess = () => {
    fetchUsers();
  };

  const filteredUsers = users.filter(user => 
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isDrawerOpen) {
    return (
      <div className="max-w-[1400px] mx-auto animate-in fade-in zoom-in-95 duration-300">
        <UserDrawer 
          isOpen={isDrawerOpen} 
          onClose={handleDrawerClose} 
          user={selectedUser} 
          onSuccess={handleSaveSuccess} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Users & Access</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage system access, roles, and status for your company users.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#181a1f] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-800 dark:text-gray-200"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm">
           <Loader2 className="animate-spin text-[#792359] mb-4" size={32} />
           <p className="text-gray-500 font-medium">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#181a1f] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Roles</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#792359] to-[#b8458f] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {user.username?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">{user.username}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${
                        user.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400'
                      }`}>
                        {user.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map(r => (
                            <span key={r.id} className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-[#792359]/10 text-[#792359] dark:text-[#e6a8d0]">
                              {r.roleName}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No roles</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#792359] dark:hover:text-[#e6a8d0] hover:bg-gray-50 dark:hover:bg-white/5 rounded-sm transition-colors"
                      >
                        <Edit2 size={14} />
                        Manage Access
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <UserIcon size={32} className="mb-3 opacity-30" />
                        <p className="text-sm font-medium">No users found</p>
                        <p className="text-xs mt-1">Users appear here when HR adds an employee.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
