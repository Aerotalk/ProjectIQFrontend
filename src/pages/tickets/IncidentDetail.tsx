import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TicketService, type TicketFormValues } from '../../services/ticket.service';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, CheckCircle2, Paperclip, 
  Clock, User, Info, 
  Send, Briefcase, Plus,
  FileText
} from 'lucide-react';

const STAGES = ['New', 'Assigned', 'In Progress', 'Waiting for Client', 'Resolved', 'Closed'];

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCompanyId: companyId } = useAuth();
  
  const [ticket, setTicket] = useState<TicketFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'notes' | 'closure'>('notes');
  const [timeline, setTimeline] = useState<any[]>([
    {
      id: 1,
      user: 'Rahul Sharma',
      action: 'changed state to',
      state: 'In Progress',
      time: 'Today at 09:45 AM',
      note: 'I am currently investigating the logs on the production server. The issue seems to be related to the recent auth token expiration changes.',
      color: 'bg-[#792359]'
    },
    {
      id: 2,
      user: 'System',
      action: 'assigned incident to',
      target: 'Rahul Sharma',
      time: 'Today at 09:20 AM',
      color: 'bg-gray-300'
    },
    {
      id: 3,
      user: 'System',
      action: 'created incident',
      time: 'Today at 09:10 AM',
      color: 'bg-gray-300'
    }
  ]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        if (!id) return;
        const data = await TicketService.getById(id);
        setTicket(data || null);
      } catch (err) {
        toast.error('Failed to load incident details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#792359]"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20 text-gray-500">
        <h2 className="text-xl font-semibold mb-2">Incident not found</h2>
        <button onClick={() => navigate('/companydashboard/tickets')} className="text-[#792359] hover:underline">
          Return to list
        </button>
      </div>
    );
  }

  const currentStageIndex = STAGES.indexOf(ticket.state || 'New');
  const isCancelled = ticket.state === 'Cancelled';

  const getPriorityBadge = (priority?: string | null) => {
    switch (priority) {
      case 'Critical': return <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-sm text-red-700 bg-red-50 border border-red-200">Critical</span>;
      case 'High': return <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-sm text-orange-700 bg-orange-50 border border-orange-200">High</span>;
      case 'Medium': return <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-sm text-yellow-700 bg-yellow-50 border border-yellow-200">Medium</span>;
      case 'Low': default: return <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-sm text-gray-700 bg-gray-50 border border-gray-200">Low</span>;
    }
  };

  const handlePostNote = () => {
    if (!newNote.trim()) return;
    const newEntry = {
      id: Date.now(),
      user: 'You',
      action: 'added a note',
      time: 'Just now',
      note: newNote,
      color: 'bg-[#792359]'
    };
    setTimeline([newEntry, ...timeline]);
    toast.success('Note posted successfully');
    setNewNote('');
  };

  const handleSaveClosure = () => {
    toast.loading('Saving closure details...', { id: 'closure' });
    setTimeout(() => {
      handleStageChange('Closed');
      toast.success('Closure details saved successfully', { id: 'closure' });
    }, 500);
  };

  const handleAttach = () => {
    toast.success('File selection dialog opened (Mock)');
  };

  const handleStageChange = async (newStage: string) => {
    if (!ticket || !companyId || !ticket.id || newStage === ticket.state) return;
    
    // Optimistic update
    const previousState = ticket.state;
    setTicket({ ...ticket, state: newStage });
    toast.loading(`Moving to ${newStage}...`, { id: 'stageUpdate' });
    
    try {
      // @ts-ignore
      await TicketService.update(ticket.id, { ...ticket, state: newStage });
      toast.success(`Incident moved to ${newStage}`, { id: 'stageUpdate' });
    } catch (err) {
      setTicket({ ...ticket, state: previousState });
      toast.error('Failed to update stage', { id: 'stageUpdate' });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/companydashboard/tickets')}
            className="w-8 h-8 shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 mb-0.5">
              <span>Support</span>
              <span className="text-gray-300">/</span>
              <span>Tickets</span>
              <span className="text-gray-300">/</span>
              <span className="text-[#792359]">{ticket.ticketNo || ticket.id?.substring(0,8).toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{ticket.shortDescription || 'Untitled Incident'}</h1>
              {getPriorityBadge(ticket.priority)}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleStageChange('Resolved')}
            className="px-4 py-2 bg-[#792359] hover:bg-[#52173c] text-white rounded-sm text-sm font-medium transition-colors shadow-sm"
          >
            Resolve Incident
          </button>
        </div>
      </div>

      {/* Lifecycle Ribbon */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-6 p-1 overflow-x-auto">
        <div className="flex min-w-[700px]">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex && !isCancelled;
            const isCurrent = idx === currentStageIndex && !isCancelled;
            return (
              <div 
                key={stage} 
                onClick={() => handleStageChange(stage)}
                className={`flex-1 relative flex items-center justify-center py-2 text-sm font-medium transition-colors cursor-pointer hover:brightness-95 ${
                isCompleted ? 'bg-[#792359]/10 text-[#792359]' :
                isCurrent ? 'bg-[#792359] text-white' :
                'bg-gray-50 text-gray-400 hover:text-gray-600'
              } ${idx === 0 ? 'rounded-l-sm' : ''} ${idx === STAGES.length - 1 ? 'rounded-r-sm' : ''} mr-0.5`}
                title={`Click to move to ${stage}`}
              >
                {isCompleted && <CheckCircle2 size={14} className="mr-1.5" />}
                {stage}
                {/* Chevron effect */}
                {idx !== STAGES.length - 1 && (
                  <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-[18px] border-y-transparent border-l-[10px] border-l-inherit z-10"
                       style={{ borderLeftColor: isCurrent ? '#792359' : isCompleted ? '#f9ebf4' : '#f9fafb' }}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column (70%) */}
        <div className="flex-1 space-y-6">
          
          {/* Incident Information */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Info size={18} className="text-[#792359]" /> Incident Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <span className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Category</span>
                <span className="text-sm text-gray-900">{ticket.category || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Subcategory</span>
                <span className="text-sm text-gray-900">{ticket.subCategory || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Impact</span>
                <span className="text-sm text-gray-900">{ticket.impact || 'Low'}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Urgency</span>
                <span className="text-sm text-gray-900">{ticket.urgency || 'Low'}</span>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</span>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-sm text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {ticket.description || 'No detailed description provided.'}
                </div>
              </div>
            </div>
          </div>

          {/* Connected ERP Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Info */}
            <div className="bg-white border border-[#792359]/20 rounded-sm shadow-sm overflow-hidden col-span-1 md:col-span-2">
              <div className="bg-[#792359]/5 px-4 py-3 border-b border-[#792359]/10">
                <h3 className="font-semibold text-[#792359] text-sm flex items-center gap-2">
                  <Briefcase size={15} /> Linked Project (Auto-fetched)
                </h3>
              </div>
              <div className="p-4 space-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Project</span>
                  <span className="font-medium text-gray-900 text-right max-w-[300px] truncate">{ticket.projectId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Client</span>
                  <span className="font-medium text-gray-900">{ticket.customerCompany || 'Acme Corp Ltd'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            <div className="flex items-center border-b border-gray-100 bg-[#F8F9FC] px-2">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'notes' ? 'text-[#792359] border-[#792359]' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
              >
                Worknotes / Activities
              </button>
              <button
                onClick={() => setActiveTab('closure')}
                className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'closure' ? 'text-[#792359] border-[#792359]' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
              >
                Closure Information
              </button>
            </div>

            {activeTab === 'notes' && (
              <>
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Type your work notes, @mention users, or paste screenshots..."
                className="w-full p-3 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#792359]/50 min-h-[100px] resize-y"
              ></textarea>
              <div className="flex items-center justify-between mt-3">
                <button 
                  onClick={handleAttach}
                  className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 text-sm font-medium"
                >
                  <Paperclip size={16} /> Attach File
                </button>
                <button 
                  onClick={handlePostNote}
                  className="px-4 py-1.5 bg-[#792359] hover:bg-[#52173c] text-white rounded-sm text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                  <Send size={14} /> Post Note
                </button>
              </div>
            </div>

            {/* ServiceNow Style Timeline */}
            <div className="p-6">
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-4">
                
                {timeline.map((item) => (
                  <div key={item.id} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${item.color} border-2 border-white`}></div>
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{item.user}</span>
                        <span className="text-gray-500 text-xs">{item.action} </span>
                        {item.state && (
                          <span className="inline-flex px-1.5 py-0.5 text-[10px] font-semibold rounded-sm text-purple-700 bg-purple-50 border border-purple-200">{item.state}</span>
                        )}
                        {item.target && (
                          <span className="font-medium text-gray-700 text-sm">{item.target}</span>
                        )}
                      </div>
                      <span className="text-gray-400 text-xs flex items-center gap-1"><Clock size={12}/> {item.time}</span>
                    </div>
                    {item.note && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-sm border border-gray-100 mt-2">
                        {item.note}
                      </p>
                    )}
                  </div>
                ))}

              </div>
            </div>
            </>
            )}

            {activeTab === 'closure' && (
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                  {/* Left Closure Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      <label className="w-1/3 text-xs font-medium text-gray-600">Resolving Party</label>
                      <select className="w-2/3 p-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#792359]">
                        <option>Support Team</option>
                        <option>Development</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      <label className="w-1/3 text-xs font-medium text-gray-600">Resolving Action</label>
                      <select className="w-2/3 p-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#792359]">
                        <option>Bug Fix</option>
                        <option>Configuration Change</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      <label className="w-1/3 text-xs font-medium text-gray-600">Customer Experience</label>
                      <select className="w-2/3 p-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#792359]">
                        <option>Degraded Experience</option>
                        <option>Outage</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      <label className="w-1/3 text-xs font-medium text-gray-600">Caused By</label>
                      <select className="w-2/3 p-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#792359]">
                        <option>External</option>
                        <option>Internal</option>
                      </select>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500">*</span>
                      <label className="w-1/3 text-xs font-medium text-gray-600 pt-2">Resolution Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Provide detailed closure notes here..."
                        className="w-2/3 p-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#792359] resize-none"
                      />
                    </div>
                  </div>

                  {/* Right Closure Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <label className="w-1/3 text-xs font-medium text-gray-600">Closed By</label>
                      <input disabled type="text" value={ticket.closedBy || 'System Admin'} className="w-2/3 p-2 bg-gray-100 border border-gray-200 rounded-sm text-sm text-gray-500 cursor-not-allowed" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-1/3 text-xs font-medium text-gray-600">Closed</label>
                      <input disabled type="text" value={ticket.closedOn || 'Pending'} className="w-2/3 p-2 bg-gray-100 border border-gray-200 rounded-sm text-sm text-gray-500 cursor-not-allowed" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-1/3 text-xs font-medium text-gray-600">Root Cause Category</label>
                      <select className="w-2/3 p-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#792359]">
                        <option>-- None --</option>
                        <option>Code Defect</option>
                        <option>Infrastructure</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={handleSaveClosure}
                    className="px-4 py-2 bg-[#792359] hover:bg-[#52173c] text-white rounded-sm text-sm font-medium transition-colors shadow-sm"
                  >
                    Save Closure Details
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Right Column (30%) */}
        <div className="w-full lg:w-[350px] shrink-0 space-y-6">
          
          {/* Ticket Summary */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Ticket Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">SLA Remaining</span>
                <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                  <Clock size={14} /> 4h 30m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Due Date</span>
                <span className="text-sm font-medium text-gray-900">
                  {ticket.dueDate ? new Date(ticket.dueDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Assignment Group</span>
                <span className="text-sm font-medium text-gray-900">{ticket.assignmentGroup || 'L2 Support'}</span>
              </div>
            </div>
          </div>

          {/* Assigned Team */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Assigned Team</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#792359]/10 text-[#792359] flex items-center justify-center font-bold text-xs">RS</div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{ticket.assignedTo || 'Rahul Sharma'}</div>
                  <div className="text-xs text-gray-500">Support Engineer</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">SJ</div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Sarah Jenkins</div>
                  <div className="text-xs text-gray-500">Project Manager</div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
              <User size={14} /> Contact Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block text-xs">Contact Person</span>
                <span className="font-medium text-gray-900">{ticket.reportedBy || 'John Doe'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Email</span>
                <a href="#" className="font-medium text-[#792359] hover:underline">{ticket.contactEmail || 'john.doe@example.com'}</a>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Phone</span>
                <span className="font-medium text-gray-900">{ticket.contactNumber || '+1 (555) 123-4567'}</span>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Attachments</h3>
              <button onClick={handleAttach} className="text-[#792359] hover:bg-[#792359]/10 p-1 rounded-sm"><Plus size={14}/></button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-sm cursor-pointer border border-transparent hover:border-gray-200 transition-colors">
                <FileText size={16} className="text-blue-500" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">error_logs.txt</div>
                  <div className="text-xs text-gray-500">12 KB</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-sm cursor-pointer border border-transparent hover:border-gray-200 transition-colors">
                <FileText size={16} className="text-red-500" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">screenshot_ui.png</div>
                  <div className="text-xs text-gray-500">1.2 MB</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
