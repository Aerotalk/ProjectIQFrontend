import { Search, Info, Paperclip, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface CreateTicketProps {
  onCancel?: () => void;
  onSubmit?: (ticket: any) => void;
}

export default function CreateTicket({ onCancel, onSubmit }: CreateTicketProps) {
  const [caller, setCaller] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [priority, setPriority] = useState('3 - Low');
  const [state, setState] = useState('New');
  const [assignedTo, setAssignedTo] = useState('');

  const randomId = `INC${Math.floor(Math.random() * 90000) + 10000}`;

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        id: randomId,
        subject: shortDesc || 'New Incident without description',
        client: caller || 'Unknown Client',
        priority: priority.includes('1') ? 'High' : priority.includes('2') ? 'Medium' : 'Low',
        status: state,
        assigned: assignedTo || 'Unassigned',
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
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">Number</label>
              <div className="flex-1 flex">
                <input type="text" readOnly value={randomId} className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 px-2 py-1 outline-none rounded-sm text-gray-800 dark:text-gray-300" />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">Caller</label>
              <div className="flex-1 relative flex">
                <input type="text" value={caller} onChange={(e) => setCaller(e.target.value)} className="flex-1 border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-l-sm" />
                <button className="border border-l-0 border-gray-300 dark:border-white/10 px-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 rounded-r-sm text-gray-500"><Search size={14}/></button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">Location</label>
              <div className="flex-1 relative flex">
                <input type="text" className="flex-1 border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-l-sm" />
                <button className="border border-l-0 border-gray-300 dark:border-white/10 px-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 rounded-r-sm text-gray-500"><Search size={14}/></button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs"><span className="text-red-500 mr-1">*</span>Category</label>
              <div className="flex-1">
                <select className="w-full border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-sm text-gray-800 dark:text-gray-200">
                  <option>-- None --</option>
                  <option>Hardware</option>
                  <option>Software</option>
                  <option>Network</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">Subcategory</label>
              <div className="flex-1">
                <select className="w-full border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-sm text-gray-800 dark:text-gray-200">
                  <option>-- None --</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">Impact</label>
              <div className="flex-1">
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-sm text-gray-800 dark:text-gray-200">
                  <option value="1 - High">1 - High</option>
                  <option value="2 - Medium">2 - Medium</option>
                  <option value="3 - Low">3 - Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">Urgency</label>
              <div className="flex-1">
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-sm text-gray-800 dark:text-gray-200">
                  <option value="1 - High">1 - High</option>
                  <option value="2 - Medium">2 - Medium</option>
                  <option value="3 - Low">3 - Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">Business Application</label>
              <div className="flex-1 relative flex">
                <input type="text" className="flex-1 border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-l-sm" />
                <button className="border border-l-0 border-gray-300 dark:border-white/10 px-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 rounded-r-sm text-gray-500"><Search size={14}/></button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">Opened</label>
              <div className="flex-1 flex">
                <input type="text" value={new Date().toISOString().replace('T', ' ').substring(0, 19)} readOnly className="flex-1 border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-2 py-1 outline-none rounded-sm text-gray-800 dark:text-gray-300" />
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">Opened by</label>
              <div className="flex-1 flex">
                <div className="flex-1 flex">
                  <input type="text" className="flex-1 border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-l-sm text-gray-800 dark:text-gray-200" defaultValue="System User" />
                  <button className="border border-l-0 border-gray-300 dark:border-white/10 px-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 text-gray-500"><Search size={14}/></button>
                </div>
                <button className="ml-1 border border-gray-300 dark:border-white/10 px-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 rounded-sm text-gray-500"><Info size={14}/></button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">Contact type</label>
              <div className="flex-1">
                <select className="w-full border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-sm text-gray-800 dark:text-gray-200" defaultValue="Phone">
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="Self-service">Self-service</option>
                  <option value="Walk-in">Walk-in</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">State</label>
              <div className="flex-1">
                <select value={state} onChange={(e) => setState(e.target.value)} className="w-full border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-sm text-gray-800 dark:text-gray-200">
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">Assignment group</label>
              <div className="flex-1 flex">
                <input type="text" className="flex-1 border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-l-sm" />
                <button className="border border-l-0 border-gray-300 dark:border-white/10 px-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 rounded-r-sm text-gray-500"><Search size={14}/></button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">Assigned to</label>
              <div className="flex-1 flex">
                <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="flex-1 border border-gray-300 dark:border-white/10 px-2 py-1 outline-none focus:border-[#792359] bg-white dark:bg-[#181a1f] rounded-l-sm" />
                <button className="border border-l-0 border-gray-300 dark:border-white/10 px-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 rounded-r-sm text-gray-500"><Search size={14}/></button>
              </div>
            </div>

          </div>
        </div>

        {/* Full Width Fields */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs"><span className="text-red-500 mr-1">*</span>Short description</label>
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
            <label className="w-40 text-right pr-4 text-gray-600 dark:text-gray-400 text-xs">Active</label>
            <div className="flex-1">
              <input type="checkbox" defaultChecked className="rounded border-gray-400 text-[#792359] focus:ring-[#792359]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
