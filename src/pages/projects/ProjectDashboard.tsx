import { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, FolderKanban, Filter } from 'lucide-react';
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

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
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
        <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">Project Code</th>
                  <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">Project Name</th>
                  <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">Status</th>
                  <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">Description</th>
                  <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                    <td onClick={() => handleView(p)} className="px-6 py-4 font-medium text-[#792359] dark:text-[#e6a8d0] cursor-pointer hover:underline">{p.projectCode}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.projectName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                        p.status === 'Completed' ? 'text-green-700 bg-green-50 dark:bg-green-500/10' :
                        p.status === 'In Progress' ? 'text-blue-700 bg-blue-50 dark:bg-blue-500/10' :
                        'text-orange-700 bg-orange-50 dark:bg-orange-500/10'
                      }`}>
                        {p.status || 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-[200px] truncate" title={p.description}>
                      {p.description || 'N/A'}
                    </td>
                    <td className={`px-6 py-4 text-center ${openActionId === p.id ? 'relative z-50' : 'relative z-10'}`}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); if (p.id) setOpenActionId(openActionId === p.id ? null : p.id); }}
                        className="action-menu-btn text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/10 rounded-sm transition-colors p-1"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openActionId === p.id && (
                        <div className="action-menu-dropdown absolute right-12 top-10 w-40 bg-white dark:bg-[#1f2229] border border-gray-100 dark:border-white/10 shadow-xl py-1 z-50 rounded-sm">
                          <button onClick={(e) => { e.stopPropagation(); handleView(p); setOpenActionId(null); }} className="w-full text-left px-4 py-2 text-sm text-[#792359] dark:text-[#e6a8d0] font-medium hover:bg-gray-50 dark:hover:bg-white/5">
                            View Details
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(p); setOpenActionId(null); }} className="w-full text-left px-4 py-2 text-sm text-[#792359] dark:text-[#e6a8d0] font-medium hover:bg-gray-50 dark:hover:bg-white/5">
                            Edit Project
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); if (p.id) handleDelete(p.id); setOpenActionId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-500/10">
                            Delete Project
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProjects.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No projects found.
              </div>
            )}
          </div>
        </div>
      )}

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
