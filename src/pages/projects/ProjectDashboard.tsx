import { useState, useEffect, useRef } from 'react';
import { Search, Plus, MoreVertical, FolderKanban, Filter } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import { ProjectService } from '../../services/project.service';
import type { Project, ProjectFormValues } from '../../types/project.types';
import ProjectDrawer from './components/ProjectDrawer';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export default function ProjectDashboard() {
  const { selectedCompanyId } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  
  // Dropdown ref
  const dropdownRef = useRef<HTMLTableCellElement>(null);

  // Click outside to close action menu
  if (typeof window !== 'undefined') {
    window.onclick = (e: any) => {
      if (!e.target.closest('.action-menu-btn') && !e.target.closest('.action-menu-dropdown')) {
        setOpenActionId(null);
      }
    };
  }

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      if (selectedCompanyId) {
        const data = await ProjectService.getAll(selectedCompanyId);
        setProjects(data);
      }
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCompanyId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenActionId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreate = () => {
    setDrawerMode('create');
    setSelectedProject(undefined);
    setIsDrawerOpen(true);
  };

  const handleEdit = (project: Project) => {
    setDrawerMode('edit');
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const handleView = (project: Project) => {
    setDrawerMode('view');
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await ProjectService.delete(id);
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const handleSaveProject = async (data: ProjectFormValues) => {
    try {
      if (!selectedCompanyId) throw new Error('No company selected');

      if (drawerMode === 'create') {
        const newProject = await ProjectService.create(selectedCompanyId, data);
        setProjects([newProject, ...projects]);
        toast.success('Project created successfully');
      } else if (selectedProject) {
        const updated = await ProjectService.update(selectedProject.id, data);
        setProjects(projects.map(p => p.id === selectedProject.id ? updated : p));
        toast.success('Project updated successfully');
      }
      setIsDrawerOpen(false);
    } catch (err) {
      toast.error('Failed to save project');
    }
  };

  const filteredProjects = projects.filter(p => {
    const searchTarget = (p.projectCode || '') + ' ' + (p.projectName || '');
    const matchesSearch = searchTarget.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ---------- Render ----------

  if (isDrawerOpen) {
    return (
      <div className="max-w-[1400px] mx-auto pb-12">
        <ProjectDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSaveProject}
          mode={drawerMode}
          initialData={selectedProject}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <FolderKanban size={24} className="text-[#792359] dark:text-[#e6a8d0]" />
            Projects
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage client projects, budgets, and status.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-56 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white" 
            />
          </div>
          <div className="relative shrink-0 w-40">
            <CustomSelect
              value={filterStatus}
              onChange={setFilterStatus}
              icon={<Filter size={16} />}
              options={[
                { label: 'All Statuses', value: 'All' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' },
                { label: 'On Hold', value: 'On Hold' }
              ]}
            />
          </div>
          <button 
            onClick={handleCreate}
            className="shrink-0 px-3 py-2 bg-[#792359] hover:bg-[#52173c] text-white rounded-sm text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> Create Project
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#792359]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProjects.map((p) => (
            <div key={p.id} className="bg-white dark:bg-[#181a1f] border border-[#792359]/30 dark:border-[#e6a8d0]/30 hover:border-[#792359] dark:hover:border-[#e6a8d0] rounded-sm hover:shadow-md transition-all flex flex-col group relative">
              <div className="p-5 flex flex-col h-full relative">
                 {/* Top row: Project Code & Action Menu */}
                 <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-2">
                     <span 
                       onClick={() => handleView(p)}
                       className="text-xs font-semibold text-[#792359] dark:text-[#e6a8d0] bg-[#792359]/5 dark:bg-[#792359]/20 px-2 py-1 rounded-sm cursor-pointer hover:underline"
                     >
                       {p.projectCode}
                     </span>
                   </div>
                   
                   <div className="relative" ref={openActionId === p.id ? dropdownRef : undefined}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenActionId(openActionId === p.id ? null : p.id || null); }}
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openActionId === p.id && (
                        <div className="absolute right-0 top-6 w-36 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm z-20 py-1 text-left">
                          <button onClick={(e) => { e.stopPropagation(); handleView(p); setOpenActionId(null); }} className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2">View Details</button>
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(p); setOpenActionId(null); }} className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2">Edit Project</button>
                          <div className="border-t border-gray-100 dark:border-white/5 my-1" />
                          <button onClick={(e) => { e.stopPropagation(); if (p.id) handleDelete(p.id); setOpenActionId(null); }} className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">Delete</button>
                        </div>
                      )}
                   </div>
                 </div>

                 {/* Project Name & Description */}
                 <div className="mb-5 flex-1">
                   <h3 
                     onClick={() => handleView(p)}
                     className="text-base font-medium text-gray-900 dark:text-white leading-snug mb-1.5 cursor-pointer hover:text-[#792359] dark:hover:text-[#e6a8d0] transition-colors line-clamp-2"
                   >
                     {p.projectName}
                   </h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                     {p.description || 'No description provided'}
                   </p>
                 </div>

                 {/* Bottom row: Status */}
                 <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${
                        p.status === 'Completed' ? 'bg-green-500' :
                        p.status === 'In Progress' ? 'bg-blue-500' :
                        'bg-orange-500'
                     }`}></span>
                     <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                       {p.status || 'Draft'}
                     </span>
                   </div>
                 </div>
              </div>
            </div>
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#181a1f] border border-dashed border-gray-300 dark:border-white/10 rounded-xl">
              No projects found.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
