import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ticketSchema, type TicketFormValues, TicketService } from '../../services/ticket.service';
import { ProjectService } from '../../services/project.service';
import type { Project } from '../../types/project.types';
import { useAuth } from '../../contexts/AuthContext';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Building2, UserCircle, Briefcase, FileText, IndianRupee } from 'lucide-react';
import { rolesService, type Role } from '../../services/roles.service';
import { api } from '../../lib/api';
import CustomSelect from '@/components/ui/CustomSelect';

export default function CreateIncident() {
  const navigate = useNavigate();
  const { selectedCompanyId: companyId } = useAuth();
  
  useBreadcrumbs([
    { label: 'Support', path: '/companydashboard/tickets' },
    { label: 'New Incident' }
  ]);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectData, setSelectedProjectData] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      state: 'New',
      priority: 'P4',
      impact: 'Low',
      urgency: 'Low'
    }
  });

  const watchProjectId = watch('projectId');
  const watchImpact = watch('impact');
  const watchUrgency = watch('urgency');
  const watchAssignmentGroup = watch('assignmentGroup');

  useEffect(() => {
    if (companyId) {
      ProjectService.getAll(companyId).then(data => setProjects(data)).catch(console.error);
    }
    rolesService.getAllRoles().then((data: any) => {
      setRoles(Array.isArray(data) ? data : (data?.content || []));
    }).catch(console.error);
    api.get('/admin/users').then((data: any) => {
      setUsers(Array.isArray(data) ? data : (data?.content || []));
    }).catch(console.error);
  }, [companyId]);

  useEffect(() => {
    if (watchProjectId) {
      const proj = projects.find(p => p.id === watchProjectId);
      setSelectedProjectData(proj || null);
    } else {
      setSelectedProjectData(null);
    }
  }, [watchProjectId, projects]);

  // Auto-calculate priority based on impact and urgency
  useEffect(() => {
    if (watchImpact === 'High' && watchUrgency === 'High') setValue('priority', 'P1');
    else if (watchImpact === 'High' || watchUrgency === 'High') setValue('priority', 'P2');
    else if (watchImpact === 'Medium' || watchUrgency === 'Medium') setValue('priority', 'P3');
    else setValue('priority', 'P4');
  }, [watchImpact, watchUrgency, setValue]);

  const onSubmit = async (data: TicketFormValues) => {
    try {
      setIsSubmitting(true);
      if (!companyId) throw new Error('No company ID');
      
      const newTicket = await TicketService.create(companyId, data);
      toast.success('Incident created successfully');
      navigate(`/companydashboard/tickets/${newTicket.id}`);
    } catch (err) {
      toast.error('Failed to create incident');
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectOptions = projects.map(p => ({ label: `${p.projectCode} - ${p.projectName}`, value: p.id }));

  const roleOptions = roles.map(r => {
    const rawName = r.roleName || r.description || '';
    const cleanLabel = rawName.replace(/^ROLE_/, '').replace(/_/g, ' ');
    return { label: cleanLabel, value: rawName };
  });

  const assignmentGroupOptions = roleOptions.length > 0 ? roleOptions : [
    { label: 'L1 Support', value: 'L1 Support' },
    { label: 'L2 Support', value: 'L2 Support' },
    { label: 'Development', value: 'Development' },
    { label: 'Database Admin', value: 'Database Admin' }
  ];

  const filteredUsers = users.filter(u => {
    if (!watchAssignmentGroup) return true;
    const userRoles = u.userRoles || u.roles || [];
    return userRoles.some((ur: any) => {
      const rName = typeof ur === 'string' ? ur : (ur.role?.roleName || ur.roleName || ur.name || '');
      const rId = typeof ur === 'object' ? (ur.role?.id || ur.id) : '';
      return rName === watchAssignmentGroup || 
             rId === watchAssignmentGroup ||
             rName.replace(/^ROLE_/, '') === watchAssignmentGroup ||
             rName.replace(/^ROLE_/, '').replace(/_/g, ' ').toLowerCase() === watchAssignmentGroup.toLowerCase();
    });
  });

  const targetUsers = (watchAssignmentGroup && filteredUsers.length > 0) ? filteredUsers : users;
  const assignToOptions = targetUsers.map(u => ({ label: u.username || u.email, value: u.username || u.id }));

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/companydashboard/tickets')}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Incident</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/companydashboard/tickets')}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-sm text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#792359] hover:bg-[#52173c] text-white rounded-sm text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : <Save size={16} />}
            Create Incident
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Form Area (70%) */}
        <div className="flex-1 space-y-6">
          
          {/* Step 1: Project Selection */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-[#F8F9FC] rounded-t-sm">
              <h2 className="text-[15px] font-semibold text-gray-800">1. Select Project</h2>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project <span className="text-red-500">*</span></label>
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={projectOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projectId && <p className="text-red-500 text-xs mt-1">{errors.projectId.message}</p>}
            </div>
          </div>

          {/* Step 2: Incident Information */}
          <div className={`bg-white border border-gray-200 rounded-sm shadow-sm transition-opacity duration-300 ${!watchProjectId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="px-6 py-4 border-b border-gray-100 bg-[#F8F9FC] rounded-t-sm">
              <h2 className="text-[15px] font-semibold text-gray-800">2. Incident Information</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        options={[
                          { label: 'Software', value: 'Software' },
                          { label: 'Hardware', value: 'Hardware' },
                          { label: 'Network', value: 'Network' },
                          { label: 'Database', value: 'Database' }
                        ]}
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                  <Controller
                    name="subCategory"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        options={[
                          { label: 'Login Issue', value: 'Login Issue' },
                          { label: 'Performance', value: 'Performance' },
                          { label: 'Bug/Error', value: 'Bug/Error' },
                          { label: 'Feature Request', value: 'Feature Request' }
                        ]}
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Impact</label>
                  <Controller
                    name="impact"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        options={[
                          { label: 'Low', value: 'Low' },
                          { label: 'Medium', value: 'Medium' },
                          { label: 'High', value: 'High' }
                        ]}
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <Controller
                    name="urgency"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        options={[
                          { label: 'Low', value: 'Low' },
                          { label: 'Medium', value: 'Medium' },
                          { label: 'High', value: 'High' }
                        ]}
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority (Auto-calculated)</label>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        options={[
                          { label: 'P1', value: 'P1' },
                          { label: 'P2', value: 'P2' },
                          { label: 'P3', value: 'P3' },
                          { label: 'P4', value: 'P4' }
                        ]}
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register('shortDescription')}
                  placeholder="Brief summary of the issue"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#792359] focus:border-[#792359]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                <textarea
                  {...register('description')}
                  rows={5}
                  placeholder="Provide all necessary details to reproduce or investigate the issue..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#792359] focus:border-[#792359] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Assignment */}
          <div className={`bg-white border border-gray-200 rounded-sm shadow-sm transition-opacity duration-300 ${!watchProjectId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="px-6 py-4 border-b border-gray-100 bg-[#F8F9FC] rounded-t-sm">
              <h2 className="text-[15px] font-semibold text-gray-800">3. Assignment & SLA</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Group (Role)</label>
                  <Controller
                    name="assignmentGroup"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        options={[{ label: 'Select Group / Role', value: '' }, ...assignmentGroupOptions]}
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                  <Controller
                    name="assignedTo"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        options={[{ label: 'Unassigned', value: '' }, ...assignToOptions]}
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="datetime-local"
                    {...register('dueDate')}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#792359] focus:border-[#792359]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Dynamic Data (30%) */}
        <div className="w-full lg:w-[350px] shrink-0 space-y-4">
          {!watchProjectId ? (
            <div className="bg-gray-50 border border-gray-200 border-dashed rounded-sm p-8 text-center text-gray-500">
              <Briefcase className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <p className="text-sm">Select a project to automatically load client, project, and ERP finance details.</p>
            </div>
          ) : (
            <>
              {/* Project & Client Card */}
              <div className="bg-white border border-[#792359]/20 rounded-sm shadow-sm overflow-hidden">
                <div className="bg-[#792359]/5 px-4 py-3 border-b border-[#792359]/10">
                  <h3 className="font-semibold text-[#792359] text-sm flex items-center gap-2">
                    <Briefcase size={15} /> Project Details
                  </h3>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs">Project</span>
                    <span className="font-medium text-gray-900">{selectedProjectData?.projectCode} - {selectedProjectData?.projectName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Client</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Building2 size={14} className="text-gray-400" />
                      <span className="font-medium text-gray-900">{selectedProjectData?.client || 'Not Assigned'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Project Manager</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <UserCircle size={14} className="text-gray-400" />
                      <span className="text-gray-900">
                        {(() => {
                          const pmId = selectedProjectData?.projectManager;
                          if (!pmId) return 'Not Assigned';
                          const pmUser = users.find(u => u.id === pmId);
                          return pmUser ? (pmUser.username || pmUser.email) : pmId;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Finance Data Card */}
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <div className="bg-[#F8F9FC] px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <IndianRupee size={15} /> Finance & Billing
                  </h3>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Quotation</span>
                    <span className="font-medium text-[#792359] cursor-pointer hover:underline">QT-2025-089</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Purchase Order</span>
                    <span className="font-medium text-[#792359] cursor-pointer hover:underline">PO-99234</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-gray-500">Latest Invoice</span>
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-sm text-green-700 bg-green-50 border border-green-200">Paid</span>
                  </div>
                </div>
              </div>

              {/* Previous History */}
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <div className="bg-[#F8F9FC] px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <FileText size={15} /> Previous Incidents
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="text-sm pb-2 border-b border-gray-50">
                    <div className="font-medium text-[#792359] cursor-pointer hover:underline">INC-2024099</div>
                    <div className="text-gray-600 truncate mt-0.5">Database connectivity timeout</div>
                    <div className="text-xs text-gray-400 mt-1">Closed on 12 Dec 2024</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-[#792359] cursor-pointer hover:underline">INC-2024045</div>
                    <div className="text-gray-600 truncate mt-0.5">SSO Login failing for external users</div>
                    <div className="text-xs text-gray-400 mt-1">Closed on 05 Nov 2024</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
