import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/ui/CustomSelect';

interface Props {
  readOnly?: boolean;
}

export default function TicketFormSection({ readOnly }: Props) {
  const { register, formState: { errors }, control } = useFormContext();
  const [activeTab, setActiveTab] = useState('General');

  const PROJECT_OPTIONS = [
    { label: 'Analytics Dashboard (PRJ-001)', value: 'PRJ-001' },
    { label: 'Mobile App Relaunch (PRJ-002)', value: 'PRJ-002' },
    { label: 'ERP Integration (PRJ-003)', value: 'PRJ-003' }
  ];

  const tabs = ['General', 'Categorization', 'Resolution', 'System Info'];

  const labelClass = 'block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1';
  const fieldClass = (hasError: boolean) => 
    `w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white ` +
    `focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors appearance-none ` +
    `disabled:opacity-60 disabled:cursor-not-allowed ` +
    (hasError ? 'border-red-500' : 'border-gray-300 dark:border-white/10');

  return (
    <div className="space-y-6">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-white/10 gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-semibold uppercase tracking-wider transition-colors relative ${
              activeTab === tab ? 'text-[#792359] dark:text-[#e6a8d0]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#792359] dark:bg-[#e6a8d0]" />
            )}
          </button>
        ))}
      </div>
      
      {/* Tab Contents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {activeTab === 'General' && (
          <>
            <div className="md:col-span-2">
              <label className={labelClass}>Short Description</label>
              <Input type="text" {...register('shortDescription')} disabled={readOnly} />
            </div>

            <div>
              <label className={labelClass}>Project *</label>
              <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
                <Controller
                  name="projectId"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect value={field.value || ''} onChange={field.onChange} options={PROJECT_OPTIONS} />
                  )}
                />
              </div>
              {errors.projectId && <p className="text-red-500 text-xs mt-1">{errors.projectId.message as string}</p>}
            </div>

            <div>
              <label className={labelClass}>State</label>
              <Input type="text" {...register('state')} disabled={readOnly} placeholder="e.g. Open, In Progress" />
            </div>

            <div>
              <label className={labelClass}>Reported By</label>
              <Input type="text" {...register('reportedBy')} disabled={readOnly} />
            </div>

            <div>
              <label className={labelClass}>Contact Email</label>
              <Input type="email" {...register('contactEmail')} disabled={readOnly} />
            </div>

            <div>
              <label className={labelClass}>Contact Number</label>
              <Input type="text" {...register('contactNumber')} disabled={readOnly} />
            </div>

            <div>
              <label className={labelClass}>Customer Company</label>
              <Input type="text" {...register('customerCompany')} disabled={readOnly} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea {...register('description')} disabled={readOnly} rows={4} className={fieldClass(!!errors.description)} />
            </div>
          </>
        )}

        {activeTab === 'Categorization' && (
          <>
            <div><label className={labelClass}>Module</label><Input type="text" {...register('module')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Category</label><Input type="text" {...register('category')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Sub Category</label><Input type="text" {...register('subCategory')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Assignment Group</label><Input type="text" {...register('assignmentGroup')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Assigned To</label><Input type="text" {...register('assignedTo')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Impact</label><Input type="text" {...register('impact')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Urgency</label><Input type="text" {...register('urgency')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Priority</label><Input type="text" {...register('priority')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Incident Type</label><Input type="text" {...register('incidentType')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Severity</label><Input type="text" {...register('severity')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Business Service</label><Input type="text" {...register('businessService')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Configuration Item (CI)</label><Input type="text" {...register('configurationItem')} disabled={readOnly} /></div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" {...register('isMajorIncident')} disabled={readOnly} id="major-incident" className="w-4 h-4 text-[#792359] focus:ring-[#792359]" />
              <label htmlFor="major-incident" className="text-sm font-medium text-gray-700 dark:text-gray-300">Is Major Incident</label>
            </div>
          </>
        )}

        {activeTab === 'Resolution' && (
          <>
            <div><label className={labelClass}>SLA Policy</label><Input type="text" {...register('slaPolicy')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Resolution Code</label><Input type="text" {...register('resolutionCode')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Escalation Level</label><Input type="text" {...register('escalationLevel')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Duplicate Of</label><Input type="text" {...register('duplicateOf')} disabled={readOnly} /></div>
            
            <div className="md:col-span-2">
              <label className={labelClass}>Resolution Notes</label>
              <textarea {...register('resolutionNotes')} disabled={readOnly} rows={3} className={fieldClass(false)} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Root Cause</label>
              <textarea {...register('rootCause')} disabled={readOnly} rows={3} className={fieldClass(false)} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Work Notes (Internal)</label>
              <textarea {...register('workNotes')} disabled={readOnly} rows={3} className={fieldClass(false)} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Customer Comments</label>
              <textarea {...register('customerComments')} disabled={readOnly} rows={3} className={fieldClass(false)} />
            </div>
          </>
        )}

        {activeTab === 'System Info' && (
          <>
            <div><label className={labelClass}>Browser</label><Input type="text" {...register('browser')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Operating System</label><Input type="text" {...register('operatingSystem')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Device Type</label><Input type="text" {...register('deviceType')} disabled={readOnly} /></div>
            <div><label className={labelClass}>IP Address</label><Input type="text" {...register('ipAddress')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Environment</label><Input type="text" {...register('environment')} disabled={readOnly} /></div>
            <div><label className={labelClass}>Location</label><Input type="text" {...register('location')} disabled={readOnly} /></div>
          </>
        )}

      </div>
    </div>
  );
}
