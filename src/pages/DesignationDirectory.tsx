import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Search, Plus, Trash2, Edit2, Loader2, Award, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formStyles } from '@/components/ui/form-styles';
import CustomSelect from '@/components/ui/CustomSelect';

interface Designation {
 id: string;
 designationCode: string;
 designationName: string;
 description: string;
 role?: { id: string; roleName: string; };
 createdAt: string;
}

interface Role {
 id: string;
 roleName: string;
}

interface Company {
 id: string;
 companyName: string;
}

export default function DesignationDirectory() {
 const { user } = useAuth();
 
 const isCompanyScopedUser = !!user?.companyId;

 const [companies, setCompanies] = useState<Company[]>([]);
 const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
 user?.companyId || ''
 );

 const [designations, setDesignations] = useState<Designation[]>([]);
 const [roles, setRoles] = useState<Role[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [error, setError] = useState<string | null>(null);
 
 // Add modal state
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [newDesigCode, setNewDesigCode] = useState('');
 const [newDesigName, setNewDesigName] = useState('');
 const [newDesigDesc, setNewDesigDesc] = useState('');
 const [newRoleId, setNewRoleId] = useState('');
 const [submitting, setSubmitting] = useState(false);

 // Edit modal state
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [editingDesigId, setEditingDesigId] = useState<string | null>(null);
 const [editDesigCode, setEditDesigCode] = useState('');
 const [editDesigName, setEditDesigName] = useState('');
 const [editDesigDesc, setEditDesigDesc] = useState('');
 const [editRoleId, setEditRoleId] = useState('');

 useEffect(() => {
  api.get('/admin/roles/available')
   .then((res: Role[]) => {
    // Filter out Admin roles
    const filteredRoles = res.filter(r => !['ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_ORG_ADMIN'].includes(r.roleName));
    setRoles(filteredRoles);
   })
   .catch(console.error);

  if (!isCompanyScopedUser) {
   api.get('/org/companies')
    .then((res: Company[]) => {
     setCompanies(res);
     if (res.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(res[0].id);
     }
    })
    .catch(console.error);
  }
 }, [isCompanyScopedUser]);

 useEffect(() => {
 if (selectedCompanyId) {
 fetchDesignations();
 }
 }, [selectedCompanyId]);

 const fetchDesignations = async () => {
 try {
 setLoading(true);
 setError(null);
 const url = selectedCompanyId 
 ? `/admin/designations?companyId=${selectedCompanyId}`
 : '/admin/designations';
 const response = await api.get(url);
 setDesignations(response);
 } catch (err: any) {
 setError(err.message || 'Failed to load designations');
 } finally {
 setLoading(false);
 }
 };

 const handleAddDesignation = async (e: React.FormEvent) => {
 e.preventDefault();
 try {
 setSubmitting(true);
   await api.post(`/admin/designations`, {
    designationCode: newDesigCode,
    designationName: newDesigName,
    description: newDesigDesc,
    roleId: newRoleId || undefined,
    companyId: selectedCompanyId || undefined,
   });
 setIsAddModalOpen(false);
   setNewDesigCode('');
   setNewDesigName('');
   setNewDesigDesc('');
   setNewRoleId('');
   fetchDesignations();
 } catch (err: any) {
 alert(err.message || 'Failed to add designation');
 } finally {
 setSubmitting(false);
 }
 };

 const handleEditClick = (desig: Designation) => {
 setEditingDesigId(desig.id);
  setEditDesigCode(desig.designationCode);
  setEditDesigName(desig.designationName);
  setEditDesigDesc(desig.description || '');
  setEditRoleId(desig.role?.id || '');
  setIsEditModalOpen(true);
 };

 const handleUpdateDesignation = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!editingDesigId) return;
 try {
 setSubmitting(true);
   await api.put(`/admin/designations/${editingDesigId}`, {
    designationCode: editDesigCode,
    designationName: editDesigName,
    description: editDesigDesc,
    roleId: editRoleId || undefined,
   });
 setIsEditModalOpen(false);
 setEditingDesigId(null);
 fetchDesignations();
 } catch (err: any) {
 alert(err.message || 'Failed to update designation');
 } finally {
 setSubmitting(false);
 }
 };

 const handleDelete = async (id: string) => {
 if (!window.confirm('Are you sure you want to delete this designation?')) return;
 try {
 await api.delete(`/admin/designations/${id}`);
 fetchDesignations();
 } catch (err: any) {
 alert(err.message || 'Failed to delete designation');
 }
 };

 const filteredDesignations = designations.filter(desig => 
 desig.designationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 desig.designationCode?.toLowerCase().includes(searchTerm.toLowerCase())
 );

 return (
 <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
 <div>
 <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Designation Directory</h1>
 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage organization job titles and hierarchy levels.</p>
 </div>
 
 <button 
 onClick={() => setIsAddModalOpen(true)}
 className="flex items-center gap-2 bg-primary hover:bg-[#5d1944] text-white px-4 py-2.5 rounded-md font-medium text-sm transition-colors shadow-sm hover:shadow-md"
 >
 <Plus size={16} />
 Add Designation
 </button>
 </div>

 <div className="bg-white dark:bg-[#181a1f] p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
 {!isCompanyScopedUser && (
 <div className="relative w-full sm:w-64">
 <CustomSelect
 value={selectedCompanyId}
 onChange={setSelectedCompanyId}
 options={companies.map((company) => ({ label: company.companyName, value: company.id }))}
 icon={<Building2 size={16} className="text-gray-400" />}
 />
 </div>
 )}

 <div className={`relative w-full ${!isCompanyScopedUser ? 'sm:w-80' : 'sm:w-96'}`}>
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
 <input 
 type="text" 
 placeholder="Search by code or name..." 
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-md focus:bg-white dark:focus:bg-[#181a1f] focus:border-primary dark:focus:border-primary transition-all outline-none text-gray-800 dark:text-gray-200"
 />
 </div>
 </div>

 {error ? (
 <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md border border-red-200 dark:border-red-800/30 text-sm flex items-center justify-center h-40">
 {error}
 </div>
 ) : loading ? (
 <div className="flex items-center justify-center h-64 bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-gray-800">
 <div className="flex flex-col items-center gap-3">
 <Loader2 size={32} className="text-primary dark:text-secondary animate-spin" />
 <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Loading designations...</p>
 </div>
 </div>
 ) : filteredDesignations.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-gray-800 text-center px-4">
 <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
 <Search size={24} className="text-gray-400" />
 </div>
 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No designations found</h3>
 <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
 {searchTerm ? `No results match "${searchTerm}".` : "You haven't added any designations yet."}
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
 {filteredDesignations.map((desig) => (
 <div key={desig.id} className="bg-white dark:bg-[#181a1f] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group relative flex flex-col">
 <div className="flex justify-between items-start mb-3">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
 <Award size={18} />
 </div>
 <div className="overflow-hidden">
 <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{desig.designationName}</h3>
 <div className="flex items-center gap-2 mt-0.5">
         <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
          {desig.designationCode}
         </span>
         {desig.role && (
          <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-md">
           {desig.role.roleName.replace('ROLE_', '').replace(/_/g, ' ')}
          </span>
         )}
        </div>
 </div>
 </div>
 </div>
 <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[40px] flex-grow">
 {desig.description || 'No description provided for this designation.'}
 </p>
 
 <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2 ">
 <button
 onClick={() => handleEditClick(desig)}
 className="px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
 >
 <Edit2 size={14} /> Edit
 </button>
 <button
 onClick={() => handleDelete(desig.id)}
 className="px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
 >
 <Trash2 size={14} /> Delete
 </button>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* Add Designation Modal */}
 {isAddModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
 <div className="bg-white dark:bg-[#1f2229] rounded-lg shadow-2xl w-full max-w-md border border-gray-100 dark:border-white/10 overflow-hidden">
 <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-[#1f2229] flex items-center justify-between">
 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Designation</h3>
 <button 
 onClick={() => setIsAddModalOpen(false)}
 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
 >
 &times;
 </button>
 </div>
 <form onSubmit={handleAddDesignation} className="p-6">
 <div className="space-y-4">
 <div>
 <label className={formStyles.label}>Designation Code *</label>
 <input
 required
 type="text"
 value={newDesigCode}
 onChange={(e) => setNewDesigCode(e.target.value)}
 className={formStyles.field()}
 placeholder="e.g. SDEV, MGR, DIR"
 />
 </div>
 <div>
 <label className={formStyles.label}>Designation Name *</label>
 <input
 required
 type="text"
 value={newDesigName}
 onChange={(e) => setNewDesigName(e.target.value)}
 className={formStyles.field()}
 placeholder="e.g. Senior Developer"
 />
 </div>
       <div>
        <label className={formStyles.label}>Role</label>
        <CustomSelect
         value={newRoleId}
         onChange={setNewRoleId}
         options={[{ label: 'Select a Role', value: '' }, ...roles.map(r => ({ label: r.roleName.replace('ROLE_', '').replace(/_/g, ' '), value: r.id }))]}
        />
       </div>
 <div>
 <label className={formStyles.label}>Description</label>
 <textarea
 value={newDesigDesc}
 onChange={(e) => setNewDesigDesc(e.target.value)}
 className={formStyles.field()}
 placeholder="Brief description of the designation..."
 rows={3}
 />
 </div>
 </div>
 <div className="mt-6 flex justify-end gap-3">
 <button
 type="button"
 onClick={() => setIsAddModalOpen(false)}
 className={formStyles.field()}
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={submitting}
 className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-[#5d1944] transition-colors disabled:opacity-70 flex items-center gap-2"
 >
 {submitting && <Loader2 size={14} className="animate-spin" />}
 Save Designation
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 {/* Edit Designation Modal */}
 {isEditModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
 <div className="bg-white dark:bg-[#1f2229] rounded-lg shadow-2xl w-full max-w-md border border-gray-100 dark:border-white/10 overflow-hidden">
 <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-[#1f2229] flex items-center justify-between">
 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Designation</h3>
 <button 
 onClick={() => setIsEditModalOpen(false)}
 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
 >
 &times;
 </button>
 </div>
 <form onSubmit={handleUpdateDesignation} className="p-6">
 <div className="space-y-4">
 <div>
 <label className={formStyles.label}>Designation Code *</label>
 <input
 required
 type="text"
 value={editDesigCode}
 onChange={(e) => setEditDesigCode(e.target.value)}
 className={formStyles.field()}
 />
 </div>
 <div>
 <label className={formStyles.label}>Designation Name *</label>
 <input
 required
 type="text"
 value={editDesigName}
 onChange={(e) => setEditDesigName(e.target.value)}
 className={formStyles.field()}
 />
 </div>
       <div>
        <label className={formStyles.label}>Role</label>
        <CustomSelect
         value={editRoleId}
         onChange={setEditRoleId}
         options={[{ label: 'Select a Role', value: '' }, ...roles.map(r => ({ label: r.roleName.replace('ROLE_', '').replace(/_/g, ' '), value: r.id }))]}
        />
       </div>
 <div>
 <label className={formStyles.label}>Description</label>
 <textarea
 value={editDesigDesc}
 onChange={(e) => setEditDesigDesc(e.target.value)}
 className={formStyles.field()}
 rows={3}
 />
 </div>
 </div>
 <div className="mt-6 flex justify-end gap-3">
 <button
 type="button"
 onClick={() => setIsEditModalOpen(false)}
 className={formStyles.field()}
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={submitting}
 className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-[#5d1944] transition-colors disabled:opacity-70 flex items-center gap-2"
 >
 {submitting && <Loader2 size={14} className="animate-spin" />}
 Update Designation
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
