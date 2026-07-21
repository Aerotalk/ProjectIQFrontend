import { useState, useEffect, useRef } from 'react';
import { Search, Plus, MoreVertical, FolderKanban, Filter, Briefcase, Calendar, Users, AlertCircle } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import { ProjectService } from '../../services/project.service';
import type { Project, ProjectFormValues } from '../../types/project.types';
import ProjectDrawer from './components/ProjectDrawer';
import ProjectQuickGlance from './components/ProjectQuickGlance';
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
  
  // Quick Glance state
  const [isQuickGlanceOpen, setIsQuickGlanceOpen] = useState(false);
  const [glanceProject, setGlanceProject] = useState<Project | undefined>();
  
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
        setProjects([{ ...data, ...newProject }, ...projects]);
        toast.success('Project created successfully');
      } else if (selectedProject) {
        const updated = await ProjectService.update(selectedProject.id, data);
        setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, ...data, ...updated } : p));
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

  const handleQuickGlance = (project: Project) => {
    setGlanceProject(project);
    setIsQuickGlanceOpen(true);
  };

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
            <div 
              key={p.id} 
              onClick={() => handleQuickGlance(p)}
              className="bg-white dark:bg-[#181a1f] border border-[#792359]/30 dark:border-[#e6a8d0]/30 hover:border-[#792359] dark:hover:border-[#e6a8d0] rounded-sm hover:shadow-md transition-all flex flex-col group relative cursor-pointer"
            >
              <div className="p-5 flex flex-col h-full relative space-y-4">
                
                {/* Top row: Project Name & Status & Action */}
                <div className="flex justify-between items-start">
                  <h3 
                    onClick={(e) => { e.stopPropagation(); handleQuickGlance(p); }}
                    className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide cursor-pointer hover:text-[#792359] dark:hover:text-[#e6a8d0] transition-colors line-clamp-2 pr-2"
                  >
                    {p.projectName || p.projectCode || 'Unnamed Project'}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                     <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                       p.status === 'Completed' ? 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20 text-green-700 dark:text-green-400' :
                       p.status === 'In Progress' || p.status === 'Active' ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400' :
                       'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20 text-orange-700 dark:text-orange-400'
                     }`}>
                       <span className={`w-1.5 h-1.5 rounded-full ${
                         p.status === 'Completed' ? 'bg-green-500' :
                         p.status === 'In Progress' || p.status === 'Active' ? 'bg-blue-500' :
                         'bg-orange-500'
                       }`}></span>
                       <span className="text-[10px] font-medium">{p.status || 'Draft'}</span>
                     </div>
                     <div className="relative" ref={openActionId === p.id ? dropdownRef : undefined}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenActionId(openActionId === p.id ? null : p.id || null); }}
                          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors -mr-2 p-1"
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
                </div>

                {/* Client & Vendors */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    <Briefcase size={14} className="text-gray-400" />
                    CLIENT: <span className="text-gray-800 dark:text-gray-200 ml-1">{p.client || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    <FolderKanban size={14} className="text-gray-400" />
                    VENDORS: <span className="text-gray-800 dark:text-gray-200 ml-1">{p.assignedVendors?.length ? `${p.assignedVendors.length} Assigned` : 'None'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    <Users size={14} className="text-gray-400" />
                    ENTITIES (EMPLOYEES): <span className="text-gray-800 dark:text-gray-200 ml-1">{p.assignedEntities?.length ? `${p.assignedEntities.length} Assigned` : 'None'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    <AlertCircle size={14} className="text-gray-400" />
                    INCIDENTS: <span className="text-gray-800 dark:text-gray-200 ml-1">{p.linkedIncidents?.length ? `${p.linkedIncidents.length} Reported` : 'None'}</span>
                  </div>
                </div>

                <hr className="border-gray-100 dark:border-white/5" />

                {/* Project Scope & Avatars */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Budget</div>
                    <div className="text-base font-bold text-gray-900 dark:text-white">
                      ₹{(p.expectedRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                     <div title={p.projectManager || 'Unassigned'} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-[#181a1f] flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                       {p.projectManager ? p.projectManager.substring(0, 2).toUpperCase() : 'U'}
                     </div>
                  </div>
                </div>

                <hr className="border-gray-100 dark:border-white/5" />

                {/* Due Date & View Details */}
                <div className="flex justify-between items-center pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <Calendar size={14} className="text-gray-400" />
                    <span>Due: {p.expectedEndDate ? new Date(p.expectedEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleQuickGlance(p); }} className="text-xs font-semibold text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    Quick Glance
                  </button>
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

      {glanceProject && selectedCompanyId && (
        <ProjectQuickGlance
          project={glanceProject}
          companyId={selectedCompanyId}
          isOpen={isQuickGlanceOpen}
          onClose={() => setIsQuickGlanceOpen(false)}
        />
      )}
    </div>
  );
}
