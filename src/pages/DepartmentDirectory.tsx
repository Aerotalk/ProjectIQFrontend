import CustomSelect from '@/components/ui/CustomSelect';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Search, Plus, Trash2, Edit2, Loader2, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Department {
 id: string;
 departmentCode: string;
 departmentName: string;
 description: string;
 createdAt: string;
}

interface Company {
 id: string;
 companyName: string;
}

export default function DepartmentDirectory() {
 const { user } = useAuth();

 // If user has a fixed companyId (company-level user), skip the dropdown
 const isCompanyScopedUser = !!user?.companyId;

 const [companies, setCompanies] = useState<Company[]>([]);
 const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
 user?.companyId || ''
 );

 const [departments, setDepartments] = useState<Department[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [error, setError] = useState<string | null>(null);

 // Add modal state
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [newDeptCode, setNewDeptCode] = useState('');
 const [newDeptName, setNewDeptName] = useState('');
 const [newDeptDesc, setNewDeptDesc] = useState('');
 const [submitting, setSubmitting] = useState(false);

 // Edit modal state
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
 const [editDeptCode, setEditDeptCode] = useState('');
 const [editDeptName, setEditDeptName] = useState('');
 const [editDeptDesc, setEditDeptDesc] = useState('');

 // Load company list for org-level users
 useEffect(() => {
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
 fetchDepartments();
 }
 }, [selectedCompanyId]);

 const fetchDepartments = async () => {
 try {
 setLoading(true);
 setError(null);
 const url = selectedCompanyId
 ? `/admin/departments?companyId=${selectedCompanyId}`
 : '/admin/departments';
 const response = await api.get(url);
 setDepartments(response);
 } catch (err: any) {
 setError(err.message || 'Failed to load departments');
 } finally {
 setLoading(false);
 }
 };

 const handleAddDepartment = async (e: React.FormEvent) => {
 e.preventDefault();
 try {
 setSubmitting(true);
 await api.post(`/admin/departments`, {
 departmentCode: newDeptCode,
 departmentName: newDeptName,
 description: newDeptDesc,
 companyId: selectedCompanyId || undefined,
 });
 setIsAddModalOpen(false);
 setNewDeptCode('');
 setNewDeptName('');
 setNewDeptDesc('');
 fetchDepartments();
 } catch (err: any) {
 alert(err.message || 'Failed to add department');
 } finally {
 setSubmitting(false);
 }
 };

 const handleEditClick = (dept: Department) => {
 setEditingDeptId(dept.id);
 setEditDeptCode(dept.departmentCode);
 setEditDeptName(dept.departmentName);
 setEditDeptDesc(dept.description || '');
 setIsEditModalOpen(true);
 };

 const handleUpdateDepartment = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!editingDeptId) return;
 try {
 setSubmitting(true);
 await api.put(`/admin/departments/${editingDeptId}`, {
 departmentCode: editDeptCode,
 departmentName: editDeptName,
 description: editDeptDesc,
 });
 setIsEditModalOpen(false);
 setEditingDeptId(null);
 fetchDepartments();
 } catch (err: any) {
 alert(err.message || 'Failed to update department');
 } finally {
 setSubmitting(false);
 }
 };

 const handleDelete = async (id: string) => {
 if (!window.confirm('Are you sure you want to delete this department?')) return;
 try {
 await api.delete(`/admin/departments/${id}`);
 fetchDepartments();
 } catch (err: any) {
 alert(err.message || 'Failed to delete department');
 }
 };

 const filteredDepartments = departments.filter(dept =>
 dept.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 dept.departmentCode?.toLowerCase().includes(searchTerm.toLowerCase())
 );


 return (
 <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
 <div>
 <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Department Directory</h1>
 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage organization departments and structural units.</p>
 </div>

 <button
 onClick={() => setIsAddModalOpen(true)}
 className="flex items-center gap-2 bg-[#792359] hover:bg-[#5d1944] text-white px-4 py-2.5 rounded-md font-medium text-sm transition-colors shadow-sm hover:shadow-md"
 >
 <Plus size={16} />
 Add Department
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
 className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-md focus:bg-white dark:focus:bg-[#181a1f] focus:border-[#792359] dark:focus:border-[#792359] transition-all outline-none text-gray-800 dark:text-gray-200"
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
 <Loader2 size={32} className="text-[#792359] dark:text-[#e6a8d0] animate-spin" />
 <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Loading departments...</p>
 </div>
 </div>
 ) : filteredDepartments.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-gray-800 text-center px-4">
 <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
 <Search size={24} className="text-gray-400" />
 </div>
 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No departments found</h3>
 <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
 {searchTerm ? `No results match "${searchTerm}".` : "You haven't added any departments yet."}
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
 {filteredDepartments.map((dept) => (
 <div key={dept.id} className="bg-white dark:bg-[#181a1f] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-[#792359]/30 transition-all group relative flex flex-col">
 <div className="flex justify-between items-start mb-3">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
 <Building2 size={18} />
 </div>
 <div className="overflow-hidden">
 <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{dept.departmentName}</h3>
 <div className="flex items-center gap-2 mt-0.5">
 <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
 {dept.departmentCode}
 </span>
 </div>
 </div>
 </div>
 </div>
 <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[40px] flex-grow">
 {dept.description || 'No description provided for this department.'}
 </p>
 
 <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2 ">
 <button
 onClick={() => handleEditClick(dept)}
 className="px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
 >
 <Edit2 size={14} /> Edit
 </button>
 <button
 onClick={() => handleDelete(dept.id)}
 className="px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
 >
 <Trash2 size={14} /> Delete
 </button>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* Add Department Modal */}
 {isAddModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
 <div className="bg-white dark:bg-[#1f2229] rounded-lg shadow-2xl w-full max-w-md border border-gray-100 dark:border-white/10 overflow-hidden">
 <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-[#1f2229] flex items-center justify-between">
 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Department</h3>
 <button
 onClick={() => setIsAddModalOpen(false)}
 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
 >
 &times;
 </button>
 </div>
 <form onSubmit={handleAddDepartment} className="p-6">
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department Code *</label>
 <input
 required
 type="text"
 value={newDeptCode}
 onChange={(e) => setNewDeptCode(e.target.value)}
 className="w-full px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-md focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white"
 placeholder="e.g. IT, HR, FIN"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department Name *</label>
 <input
 required
 type="text"
 value={newDeptName}
 onChange={(e) => setNewDeptName(e.target.value)}
 className="w-full px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-md focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white"
 placeholder="e.g. Information Technology"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
 <textarea
 value={newDeptDesc}
 onChange={(e) => setNewDeptDesc(e.target.value)}
 className="w-full px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-md focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white resize-none"
 placeholder="Brief description of the department..."
 rows={3}
 />
 </div>
 </div>
 <div className="mt-6 flex justify-end gap-3">
 <button
 type="button"
 onClick={() => setIsAddModalOpen(false)}
 className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={submitting}
 className="px-4 py-2 text-sm font-medium text-white bg-[#792359] rounded-md hover:bg-[#5d1944] transition-colors disabled:opacity-70 flex items-center gap-2"
 >
 {submitting && <Loader2 size={14} className="animate-spin" />}
 Save Department
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 {/* Edit Department Modal */}
 {isEditModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
 <div className="bg-white dark:bg-[#1f2229] rounded-lg shadow-2xl w-full max-w-md border border-gray-100 dark:border-white/10 overflow-hidden">
 <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-[#1f2229] flex items-center justify-between">
 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Department</h3>
 <button
 onClick={() => setIsEditModalOpen(false)}
 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
 >
 &times;
 </button>
 </div>
 <form onSubmit={handleUpdateDepartment} className="p-6">
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department Code *</label>
 <input
 required
 type="text"
 value={editDeptCode}
 onChange={(e) => setEditDeptCode(e.target.value)}
 className="w-full px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-md focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department Name *</label>
 <input
 required
 type="text"
 value={editDeptName}
 onChange={(e) => setEditDeptName(e.target.value)}
 className="w-full px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-md focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
 <textarea
 value={editDeptDesc}
 onChange={(e) => setEditDeptDesc(e.target.value)}
 className="w-full px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-md focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white resize-none"
 rows={3}
 />
 </div>
 </div>
 <div className="mt-6 flex justify-end gap-3">
 <button
 type="button"
 onClick={() => setIsEditModalOpen(false)}
 className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={submitting}
 className="px-4 py-2 text-sm font-medium text-white bg-[#792359] rounded-md hover:bg-[#5d1944] transition-colors disabled:opacity-70 flex items-center gap-2"
 >
 {submitting && <Loader2 size={14} className="animate-spin" />}
 Update Department
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
