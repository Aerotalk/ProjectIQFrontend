import { formStyles } from '@/components/ui/form-styles';
import { Search, Info, Paperclip, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import CustomSelect from '@/components/ui/CustomSelect';
import { useAuth } from '@/contexts/AuthContext';
import { ClientService } from '@/services/client.service';
import type { Client } from '@/types/client.types';
import { api } from '@/lib/api';
import { rolesService, type Role } from '@/services/roles.service';

interface CreateTicketProps {
  onCancel?: () => void;
  onSubmit?: (ticket: any) => void;
}

export default function CreateTicket({ onCancel, onSubmit }: CreateTicketProps) {
  const { selectedCompanyId } = useAuth();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [assignmentGroup, setAssignmentGroup] = useState('');

  useEffect(() => {
    if (!selectedCompanyId) return;
    ClientService.getClients(selectedCompanyId).then(data => setClients(data));
    api.get('/admin/users').then((data: any) => {
      setUsers(Array.isArray(data) ? data : (data?.content || []));
    });
    rolesService.getAllRoles().then((data: any) => {
      setRoles(Array.isArray(data) ? data : (data?.content || []));
    }).catch(console.error);
  }, [selectedCompanyId]);

  const CLIENT_OPTIONS = [{ label: '-- Select Caller --', value: '' }, ...clients.map(c => ({ label: c.displayName, value: c.id }))];
  
  const ROLE_OPTIONS = roles.map(r => {
    const rawName = r.roleName || r.description || '';
    const cleanLabel = rawName.replace(/^ROLE_/, '').replace(/_/g, ' ');
    return { label: cleanLabel, value: rawName };
  });

  const ASSIGNMENT_GROUP_OPTIONS = ROLE_OPTIONS.length > 0 ? ROLE_OPTIONS : [
    { label: 'L1 Support', value: 'L1 Support' },
    { label: 'L2 Support', value: 'L2 Support' },
    { label: 'Development', value: 'Development' },
    { label: 'Database Admin', value: 'Database Admin' }
  ];

  const filteredUsers = users.filter(u => {
    if (!assignmentGroup) return true;
    const userRoles = u.userRoles || u.roles || [];
    return userRoles.some((ur: any) => {
      const rName = typeof ur === 'string' ? ur : (ur.role?.roleName || ur.roleName || ur.name || '');
      const rId = typeof ur === 'object' ? (ur.role?.id || ur.id) : '';
      return rName === assignmentGroup || 
             rId === assignmentGroup ||
             rName.replace(/^ROLE_/, '') === assignmentGroup ||
             rName.replace(/^ROLE_/, '').replace(/_/g, ' ').toLowerCase() === assignmentGroup.toLowerCase();
    });
  });

  const targetUsers = (assignmentGroup && filteredUsers.length > 0) ? filteredUsers : users;
  const USER_OPTIONS = [{ label: '-- Unassigned --', value: '' }, ...targetUsers.map(u => ({ label: u.username || u.email, value: u.id }))];

  const [caller, setCaller] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [priority, setPriority] = useState('P4');
  const [urgency, setUrgency] = useState('3 - Low');
  const [state, setState] = useState('New');
  const [assignedTo, setAssignedTo] = useState('');
  const [category, setCategory] = useState('-- None --');
  const [subcategory, setSubcategory] = useState('-- None --');
  const [contactType, setContactType] = useState('Phone');

  const randomId = `INC${Math.floor(Math.random() * 90000) + 10000}`;

  const handleSubmit = () => {
    if (onSubmit) {
      const clientName = clients.find(c => c.id === caller)?.displayName || 'Unknown Client';
      const assignedName = users.find(u => u.id === assignedTo)?.username || users.find(u => u.id === assignedTo)?.email || 'Unassigned';

      onSubmit({
        id: randomId,
        subject: shortDesc || 'New Incident without description',
        client: clientName,
        priority: priority.includes('1') ? 'High' : priority.includes('2') ? 'Medium' : 'Low',
        status: state,
        assigned: assignedName,
        updated: 'Just now'
      });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 pb-12 text-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-4">
          {onCancel && (
            <button onClick={onCancel} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm text-gray-500 transition-colors">
              <ArrowLeft size={18} />
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-gray-500 font-normal">Incident</span>
            <span>New record [Default view]</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm text-gray-600 dark:text-gray-300 transition-colors">
            <Paperclip size={18} />
          </button>
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm text-gray-600 dark:text-gray-300 transition-colors">
            <MoreHorizontal size={18} />
          </button>
          <button onClick={handleSubmit} className="px-4 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 rounded-sm font-medium transition-colors border border-gray-200 dark:border-white/10 text-xs">
            Submit
          </button>
          <button onClick={onCancel} className="px-4 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 rounded-sm font-medium transition-colors border border-gray-200 dark:border-white/10 text-xs">
            Resolve Incident
          </button>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-[#181a1f] p-6 rounded-sm shadow-sm border border-gray-200 dark:border-white/10">
        
        {/* Top 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <label className={formStyles.label}>Number</label>
              <div className="flex-1 flex">
                <input type="text" readOnly value={randomId} className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 px-2 py-1 outline-none rounded-sm text-gray-800 dark:text-gray-300" />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className={formStyles.label}>Caller</label>
              <div className="flex-1 relative flex">
                <CustomSelect value={caller} onChange={setCaller} options={CLIENT_OPTIONS} />
              </div>
            </div>

            <div className="flex items-center">
              <label className={formStyles.label}>Location</label>
              <div className="flex-1 relative flex">
                <input type="text" className="flex-1 border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-l-sm" />
                <button className="border border-l-0 border-gray-300 dark:border-white/10 px-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 rounded-r-sm text-gray-500"><Search size={14}/></button>
              </div>
            </div>

            <div className="flex items-center">
              <label className={formStyles.label}><span className="text-red-500 mr-1">*</span>Category</label>
              <div className="flex-1">
                <CustomSelect
                  value={category}
                  onChange={setCategory}
                  options={[
                    { label: '-- None --', value: '-- None --' },
                    { label: 'Hardware', value: 'Hardware' },
                    { label: 'Software', value: 'Software' },
                    { label: 'Network', value: 'Network' }
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className={formStyles.label}>Subcategory</label>
              <div className="flex-1">
                <CustomSelect
                  value={subcategory}
                  onChange={setSubcategory}
                  options={[
                    { label: '-- None --', value: '-- None --' }
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className={formStyles.label}>Priority</label>
              <div className="flex-1">
                <CustomSelect
                  value={priority}
                  onChange={setPriority}
                  options={[
                    { label: 'P1 - Critical', value: 'P1' },
                    { label: 'P2', value: 'P2' },
                    { label: 'P3', value: 'P3' },
                    { label: 'P4', value: 'P4' }
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className={formStyles.label}>Urgency</label>
              <div className="flex-1">
                <CustomSelect
                  value={urgency}
                  onChange={setUrgency}
                  options={[
                    { label: '1 - High', value: '1 - High' },
                    { label: '2 - Medium', value: '2 - Medium' },
                    { label: '3 - Low', value: '3 - Low' }
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className={formStyles.label}>Business Application</label>
              <div className="flex-1 relative flex">
                <input type="text" className="flex-1 border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-l-sm" />
                <button className="border border-l-0 border-gray-300 dark:border-white/10 px-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 rounded-r-sm text-gray-500"><Search size={14}/></button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <label className={formStyles.label}>Opened</label>
              <div className="flex-1 flex">
                <input type="text" value={new Date().toISOString().replace('T', ' ').substring(0, 19)} readOnly className="flex-1 border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-2 py-1 outline-none rounded-sm text-gray-800 dark:text-gray-300" />
              </div>
            </div>

            <div className="flex items-center">
              <label className={formStyles.label}>Opened by</label>
              <div className="flex-1 flex">
                <div className="flex-1 flex">
                  <input type="text" className="flex-1 border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-l-sm text-gray-800 dark:text-gray-200" defaultValue="System User" />
                  <button className="border border-l-0 border-gray-300 dark:border-white/10 px-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 text-gray-500"><Search size={14}/></button>
                </div>
                <button className="ml-1 border border-gray-300 dark:border-white/10 px-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 rounded-sm text-gray-500"><Info size={14}/></button>
              </div>
            </div>

            <div className="flex items-center">
              <label className={formStyles.label}>Contact type</label>
              <div className="flex-1">
                <CustomSelect
                  value={contactType}
                  onChange={setContactType}
                  options={[
                    { label: 'Email', value: 'Email' },
                    { label: 'Phone', value: 'Phone' },
                    { label: 'Self-service', value: 'Self-service' },
                    { label: 'Walk-in', value: 'Walk-in' }
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className={formStyles.label}>State</label>
              <div className="flex-1">
                <CustomSelect
                  value={state}
                  onChange={setState}
                  options={[
                    { label: 'New', value: 'New' },
                    { label: 'In Progress', value: 'In Progress' },
                    { label: 'On Hold', value: 'On Hold' },
                    { label: 'Resolved', value: 'Resolved' },
                    { label: 'Closed', value: 'Closed' },
                    { label: 'Canceled', value: 'Canceled' }
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className={formStyles.label}>Assignment group</label>
              <div className="flex-1 flex">
                <CustomSelect 
                  value={assignmentGroup} 
                  onChange={setAssignmentGroup} 
                  options={[{label: '-- Select Role / Group --', value: ''}, ...ASSIGNMENT_GROUP_OPTIONS]} 
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className={formStyles.label}>Assigned to</label>
              <div className="flex-1 flex">
                <CustomSelect value={assignedTo} onChange={setAssignedTo} options={USER_OPTIONS} />
              </div>
            </div>

          </div>
        </div>

        {/* Full Width Fields */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <label className={formStyles.label}><span className="text-red-500 mr-1">*</span>Short description</label>
            <div className="flex-1">
              <input type="text" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className="w-full border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-sm" />
            </div>
          </div>

          <div className="flex items-start">
            <label className="w-40 text-right pr-4 pt-1.5 text-gray-600 dark:text-gray-400 text-xs">
              Additional comments<br />
              <span className="text-[10px] opacity-70">(Customer visible)</span>
            </label>
            <div className="flex-1">
              <textarea rows={3} className="w-full border border-gray-300 dark:border-white/10 px-2 py-1.5 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-sm resize-y" />
            </div>
          </div>

          <div className="flex items-start">
            <label className="w-40 text-right pr-4 pt-1.5 text-gray-600 dark:text-gray-400 text-xs">Work notes</label>
            <div className="flex-1">
              <textarea rows={3} className="w-full border border-gray-300 dark:border-white/10 px-2 py-1.5 outline-none focus:border-[#792359] bg-[#fffdef] dark:bg-yellow-900/10 rounded-sm resize-y" />
            </div>
          </div>

          <div className="flex items-center">
            <label className={formStyles.label}>Active</label>
            <div className="flex-1">
              <input type="checkbox" defaultChecked className="rounded border-gray-400 text-[#792359] focus:ring-[#792359]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
