import { ArrowLeft, Save, RefreshCw, MessageSquare, UserPlus, FileText } from 'lucide-react';
import { useState } from 'react';
import CustomSelect from '@/components/ui/CustomSelect';

const STATES = ['Open', 'In Progress', 'Closed'];

interface ViewTicketProps {
  ticket: any;
  onClose: () => void;
  onSave: (updatedTicket: any) => void;
}

export default function ViewTicket({ ticket, onClose, onSave }: ViewTicketProps) {
  const [formData, setFormData] = useState(ticket);
  const [impact, setImpact] = useState('2 - Significant/Large');
  const [urgency, setUrgency] = useState('2 - High');
  const [method, setMethod] = useState('Automated Alerting');
  const [majorState, setMajorState] = useState('-- None --');
  const [gtoc, setGtoc] = useState('No');

  const handleStateChange = (newState: string) => {
    setFormData({ ...formData, status: newState });
  };

  const activeIndex = STATES.indexOf(formData.status) === -1 ? 0 : STATES.indexOf(formData.status);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      {/* Header Actions */}
      <div className="flex items-center justify-between bg-white dark:bg-[#181a1f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Incident - {formData.id}</h1>
            <p className="text-sm text-gray-500">View: Incident with Outages</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 flex items-center gap-2 transition-colors">
            <MessageSquare size={14} /> Discuss
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 flex items-center gap-2 transition-colors">
            <UserPlus size={14} /> Follow
          </button>
          {formData.status === 'Closed' ? (
            <button 
              onClick={() => handleStateChange('Open')}
              className="px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium hover:bg-[#52173c] flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={14} /> Reopen
            </button>
          ) : (
            <>
              <button 
                onClick={() => onSave(formData)}
                className="px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                Update
              </button>
              <button 
                onClick={() => onSave(formData)}
                className="px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium hover:bg-[#52173c] flex items-center gap-2 shadow-sm transition-colors"
              >
                <Save size={14} /> Save
              </button>
            </>
          )}
        </div>
      </div>

      {/* Chevron Progress Bar */}
      <div className="bg-white dark:bg-[#181a1f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
        <div className="flex w-full h-10 bg-gray-50 dark:bg-white/5 rounded-sm overflow-hidden relative border border-gray-200 dark:border-white/10">
          {STATES.map((state, index) => {
            const isActive = state === formData.status;
            const isPassed = index < activeIndex;
            return (
              <div 
                key={state}
                onClick={() => handleStateChange(state)}
                className={`flex-1 flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-300 relative z-10 select-none
                  ${isActive ? 'bg-[#792359] text-white shadow-inner scale-105 z-20' : 
                    isPassed ? 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-white/20' : 
                    'text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                style={{
                  clipPath: index === 0 ? 'polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%)' : 
                            index === STATES.length - 1 ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 8% 50%)' :
                            'polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%, 8% 50%)',
                  marginLeft: index > 0 ? '-2%' : '0'
                }}
              >
                {state} {isPassed && <span className="ml-2">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Details */}
      <div className="bg-white dark:bg-[#181a1f] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 py-3 px-4 rounded-sm mb-6 flex items-center gap-2 border border-gray-200 dark:border-white/10">
          <FileText size={16} className="text-[#792359] dark:text-[#e6a8d0]" /> General Summary - descriptions, priorities and assignments
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Left Column */}
          <div className="space-y-5 text-sm">
            <div className="flex items-center gap-4">
              <label className="w-40 text-right text-gray-600 dark:text-gray-400 font-medium shrink-0">Number</label>
              <input type="text" disabled value={formData.id} className="flex-1 px-3 py-2 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-gray-500 cursor-not-allowed" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right text-[#792359] dark:text-[#e6a8d0] font-medium shrink-0">* Impact</label>
              <div className="flex-1">
                <CustomSelect
                  value={impact}
                  onChange={setImpact}
                  options={['2 - Significant/Large', '1 - High', '3 - Moderate/Limited']}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right text-[#792359] dark:text-[#e6a8d0] font-medium shrink-0">* Urgency</label>
              <div className="flex-1">
                <CustomSelect
                  value={urgency}
                  onChange={setUrgency}
                  options={['2 - High', '1 - Critical', '3 - Medium']}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right text-gray-600 dark:text-gray-400 font-medium shrink-0">Priority</label>
              <input type="text" disabled value={formData.priority} className="flex-1 px-3 py-2 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-gray-500 cursor-not-allowed" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right text-[#792359] dark:text-[#e6a8d0] font-medium shrink-0">* Requester</label>
              <div className="flex-1 flex gap-2">
                <input type="text" value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} className="flex-1 px-3 py-2 bg-white dark:bg-[#1f2229] border border-gray-300 dark:border-white/20 rounded-sm text-gray-900 dark:text-white focus:border-[#792359] focus:outline-none focus:ring-1 focus:ring-[#792359]" />
                <button className="px-3 py-2 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-sm hover:bg-gray-200 dark:hover:bg-white/20">🔍</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right text-[#792359] dark:text-[#e6a8d0] font-medium shrink-0">* Method of Awareness</label>
              <div className="flex-1">
                <CustomSelect
                  value={method}
                  onChange={setMethod}
                  options={['Automated Alerting', 'User Reported']}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5 text-sm">
            <div className="flex items-center gap-4">
              <label className="w-40 text-right text-gray-600 dark:text-gray-400 font-medium shrink-0">State</label>
              <div className="flex-1">
                <CustomSelect
                  value={formData.status}
                  onChange={handleStateChange}
                  options={STATES}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right text-gray-600 dark:text-gray-400 font-medium shrink-0">Opened</label>
              <input type="text" disabled value={formData.updated} className="flex-1 px-3 py-2 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-gray-500 cursor-not-allowed" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right text-gray-600 dark:text-gray-400 font-medium shrink-0">Major incident state</label>
              <div className="flex-1 opacity-80 pointer-events-none">
                <CustomSelect
                  value={majorState}
                  onChange={setMajorState}
                  options={['-- None --']}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right text-[#792359] dark:text-[#e6a8d0] font-medium shrink-0">* Assignment group</label>
              <div className="flex-1 flex gap-2">
                <input type="text" defaultValue="IT DTV-ENGA" className="flex-1 px-3 py-2 bg-white dark:bg-[#1f2229] border border-gray-300 dark:border-white/20 rounded-sm text-gray-900 dark:text-white focus:border-[#792359] focus:outline-none focus:ring-1 focus:ring-[#792359]" />
                <button className="px-3 py-2 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-sm hover:bg-gray-200 dark:hover:bg-white/20">🔍</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right text-[#792359] dark:text-[#e6a8d0] font-medium shrink-0">* Assigned to</label>
              <div className="flex-1 flex gap-2">
                <input type="text" value={formData.assigned} onChange={(e) => setFormData({...formData, assigned: e.target.value})} className="flex-1 px-3 py-2 bg-white dark:bg-[#1f2229] border border-gray-300 dark:border-white/20 rounded-sm text-gray-900 dark:text-white focus:border-[#792359] focus:outline-none focus:ring-1 focus:ring-[#792359]" />
                <button className="px-3 py-2 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-sm hover:bg-gray-200 dark:hover:bg-white/20">🔍</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right text-[#792359] dark:text-[#e6a8d0] font-medium shrink-0">* GTOC Engaged?</label>
              <div className="flex-1">
                <CustomSelect
                  value={gtoc}
                  onChange={setGtoc}
                  options={['No', 'Yes']}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Fields */}
        <div className="mt-8 space-y-5 text-sm">
          <div className="flex items-start gap-4">
            <label className="w-40 text-right text-[#792359] dark:text-[#e6a8d0] font-medium pt-2 shrink-0">* Short description</label>
            <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="flex-1 px-3 py-2 bg-white dark:bg-[#1f2229] border border-gray-300 dark:border-white/20 rounded-sm text-gray-900 dark:text-white focus:border-[#792359] focus:outline-none focus:ring-1 focus:ring-[#792359]" />
          </div>
          <div className="flex items-start gap-4">
            <label className="w-40 text-right text-gray-600 dark:text-gray-400 font-medium pt-2 shrink-0">Detailed description</label>
            <textarea rows={6} className="flex-1 px-3 py-2 bg-white dark:bg-[#1f2229] border border-gray-300 dark:border-white/20 rounded-sm text-gray-900 dark:text-white focus:border-[#792359] focus:outline-none focus:ring-1 focus:ring-[#792359]" defaultValue="Ciroos Investigation: 1 alert correlated to this investigation. Failure rate increase | CLOSED"></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
