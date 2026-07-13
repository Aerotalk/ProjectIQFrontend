import { useState } from 'react';
import SuperAdminLayout from '../components/layout/SuperAdminLayout';
import { Building2, Plus, Eye, EyeOff, Search, CheckCircle2, ArrowLeft } from 'lucide-react';
import CustomSelect from '../components/ui/CustomSelect';
import { api } from '../lib/api';
import { useEffect } from 'react';

interface Organization {
  id: string;
  organizationCode: string;
  organizationName: string;
  organizationEmail: string;
  organizationPassword?: string;
  legalName: string;
  organizationType: string;
  industry: string;
  status: string;
  createdAt?: string;
}

export default function SuperAdminDashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await api.get('/admin/organizations');
      const data = Array.isArray(res) ? res : (res.content || []);
      setOrganizations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const [formData, setFormData] = useState({
    organizationCode: '',
    organizationName: '',
    organizationEmail: '',
    organizationPassword: '',
    legalName: '',
    organizationType: 'Pvt Ltd',
    industry: 'Technology',
    status: 'ACTIVE'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Edit Modal State
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [editFormData, setEditFormData] = useState<Organization | null>(null);
  const [showEditToast, setShowEditToast] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const openEditModal = (org: Organization) => {
    setSelectedOrg(org);
    setEditFormData({ ...org });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;

    setOrganizations(organizations.map(org => 
      org.id === editFormData.id ? editFormData : org
    ));
    
    setSelectedOrg(null);
    setShowEditToast(true);
    setTimeout(() => setShowEditToast(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newOrg = await api.post('/admin/organizations', formData);
      setOrganizations([newOrg, ...organizations]);
      setShowToast(true);
      setIsFormVisible(false); // Hide the form after successful submission
      setTimeout(() => setShowToast(false), 3000);
      
      // Reset form
      setFormData({
        organizationCode: '',
        organizationName: '',
        organizationEmail: '',
        organizationPassword: '',
        legalName: '',
        organizationType: 'Pvt Ltd',
        industry: 'Technology',
        status: 'ACTIVE'
      });
    } catch (err) {
      console.error('Failed to create organization', err);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 relative">
        
        {/* Toast Notifications */}
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 px-4 py-3 rounded-sm shadow-lg transition-all duration-300 transform z-50 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
          <CheckCircle2 size={20} />
          <span className="text-sm font-medium">Organization added successfully!</span>
        </div>
        
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 px-4 py-3 rounded-sm shadow-lg transition-all duration-300 transform z-50 ${showEditToast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
          <CheckCircle2 size={20} />
          <span className="text-sm font-medium">Profile updated successfully!</span>
        </div>

        {/* -------------------- MAIN DASHBOARD VIEW -------------------- */}
        {!selectedOrg && (
          <div className="animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Organization Management</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Register new organizations and manage existing tenant accounts.</p>
              </div>
              {!isFormVisible && (
                <button 
                  onClick={() => setIsFormVisible(true)}
                  className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
                >
                  <Plus size={16} />
                  Add Organization
                </button>
              )}
            </div>

            {/* Add Organization Form */}
            {isFormVisible && (
              <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex justify-between items-center rounded-t-sm">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Building2 size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
                    Add New Organization
                  </h2>
                  <button 
                    onClick={() => setIsFormVisible(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Organization Code <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        value={formData.organizationCode}
                        onChange={(e) => setFormData({...formData, organizationCode: e.target.value})}
                        placeholder="e.g. ACME" 
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" 
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Organization Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        value={formData.organizationName}
                        onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                        placeholder="e.g. Acme Corp" 
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Registered Legal Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        value={formData.legalName}
                        onChange={(e) => setFormData({...formData, legalName: e.target.value})}
                        placeholder="e.g. Acme Corporation Pvt Ltd" 
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Company Email <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        required
                        value={formData.organizationEmail}
                        onChange={(e) => setFormData({...formData, organizationEmail: e.target.value})}
                        placeholder="admin@acme.com" 
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Company Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required
                          value={formData.organizationPassword}
                          onChange={(e) => setFormData({...formData, organizationPassword: e.target.value})}
                          placeholder="••••••••" 
                          className="w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Organization Type</label>
                      <CustomSelect 
                        value={formData.organizationType}
                        onChange={(val) => setFormData({...formData, organizationType: val})}
                        options={['Pvt Ltd', 'LLP', 'Government', 'Proprietorship', 'NGO / Non-Profit']}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Industry Category</label>
                      <CustomSelect 
                        value={formData.industry}
                        onChange={(val) => setFormData({...formData, industry: val})}
                        options={['Technology', 'Telecommunications', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Other']}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</label>
                      <CustomSelect 
                        value={formData.status}
                        onChange={(val) => setFormData({...formData, status: val})}
                        options={['ACTIVE', 'INACTIVE']}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-white/5 gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsFormVisible(false)}
                      className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex items-center justify-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-6 py-2.5 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
                    >
                      <Plus size={16} />
                      Register Organization
                    </button>
                  </div>

                </form>
                </div>
              </div>
            )}

            {/* Organizations List */}
            <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm overflow-hidden mt-8">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Registered Organizations</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="text" placeholder="Search orgs..." className="pl-9 pr-4 py-1.5 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-[#792359] rounded-sm transition-all outline-none w-48 xl:w-64" />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/5 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <th className="px-6 py-3 font-medium">Org Name</th>
                      <th className="px-6 py-3 font-medium">Legal Name</th>
                      <th className="px-6 py-3 font-medium">Email</th>
                      <th className="px-6 py-3 font-medium">Type</th>
                      <th className="px-6 py-3 font-medium">Industry</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {organizations.map((org) => (
                      <tr key={org.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#792359]/10 dark:bg-[#792359]/20 flex items-center justify-center text-[#792359] dark:text-[#e6a8d0] font-bold text-sm">
                              {org.organizationName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{org.organizationName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{org.legalName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-900 dark:text-white">{org.organizationEmail}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                            {org.organizationType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {org.industry}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                            org.status === 'ACTIVE' 
                              ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                              : org.status === 'INACTIVE'
                              ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                              : 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'
                          }`}>
                            {org.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(org.createdAt || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => openEditModal(org)}
                            className="text-xs font-medium text-[#792359] dark:text-[#e6a8d0] hover:text-[#52173c] dark:hover:text-white transition-colors bg-[#792359]/10 hover:bg-[#792359]/20 px-3 py-1.5 rounded-sm border border-[#792359]/20"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    {organizations.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                          No organizations registered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- EDIT ORGANIZATION VIEW -------------------- */}
        {selectedOrg && editFormData && (
          <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/80 dark:bg-white/[0.02] flex items-center gap-4 rounded-t-sm">
              <button 
                onClick={() => setSelectedOrg(null)}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#792359]"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Building2 size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
                  {selectedOrg.organizationName}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Edit organization profile details below.</p>
              </div>
            </div>

            {/* Edit Form */}
            <div className="p-6">
              <form id="edit-org-form" onSubmit={handleEditSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Organization Name</label>
                    <input 
                      type="text" 
                      required
                      value={editFormData.organizationName}
                      onChange={(e) => setEditFormData({...editFormData, organizationName: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Legal Name</label>
                    <input 
                      type="text" 
                      required
                      value={editFormData.legalName}
                      onChange={(e) => setEditFormData({...editFormData, legalName: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      required
                      value={editFormData.organizationEmail}
                      onChange={(e) => setEditFormData({...editFormData, organizationEmail: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Company Password</label>
                    <div className="relative">
                        <input 
                          type={showEditPassword ? "text" : "password"} 
                          value={editFormData.organizationPassword || ''}
                          onChange={(e) => setEditFormData({...editFormData, organizationPassword: e.target.value})}
                          placeholder="Leave blank to keep current"
                          className="w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white" 
                        />
                      <button 
                        type="button"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showEditPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Type</label>
                    <CustomSelect 
                      value={editFormData.organizationType}
                      onChange={(val) => setEditFormData({...editFormData, organizationType: val})}
                      options={['Pvt Ltd', 'LLP', 'Government', 'Proprietorship', 'NGO / Non-Profit']}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Industry Category</label>
                    <CustomSelect 
                      value={editFormData.industry}
                      onChange={(val) => setEditFormData({...editFormData, industry: val})}
                      options={['Technology', 'Telecommunications', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Other']}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</label>
                    <CustomSelect 
                      value={editFormData.status}
                      onChange={(val) => setEditFormData({...editFormData, status: val})}
                      options={['ACTIVE', 'INACTIVE']}
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex justify-end gap-4">
                  <button 
                    type="button" 
                    onClick={() => setSelectedOrg(null)}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm transition-colors"
                  >
                    Discard Changes
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#792359] hover:bg-[#52173c] text-white px-8 py-2.5 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </SuperAdminLayout>
  );
}
