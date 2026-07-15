import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/ui/CustomSelect';

interface Props {
  readOnly?: boolean;
}

export default function TicketFormSection({ readOnly }: Props) {
  const { register, formState: { errors }, control } = useFormContext();
  const status = useWatch({ control, name: 'status' });

  const PROJECT_OPTIONS = [
    { label: 'Analytics Dashboard (PRJ-001)', value: 'PRJ-001' },
    { label: 'Mobile App Relaunch (PRJ-002)', value: 'PRJ-002' },
    { label: 'ERP Integration (PRJ-003)', value: 'PRJ-003' }
  ];

  const CATEGORY_OPTIONS = ['Complaint', 'Query', 'Service Request', 'Billing Issue', 'Technical Issue', 'Others'];
  const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];
  const STATUS_OPTIONS = ['Open', 'In Progress', 'Closed'];
  const USER_OPTIONS = ['Arjun Dev', 'Sneha Iyer', 'Rohit Singh', 'Amit Verma', 'Neha Patil'];

  const labelClass = 'block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1';
  const fieldClass = (hasError: boolean) => 
    `w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white ` +
    `focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors appearance-none ` +
    `disabled:opacity-60 disabled:cursor-not-allowed ` +
    (hasError ? 'border-red-500' : 'border-gray-300 dark:border-white/10');

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-2 mb-4">
          Ticket Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="md:col-span-2">
            <label className={labelClass}>Ticket Title *</label>
            <Input 
              type="text" 
              {...register('subject')} 
              disabled={readOnly}
              placeholder="One-line summary of the issue (Max 200 chars)"
              className={`${errors.subject ? 'border-red-500' : ''}`} 
            />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message as string}</p>}
          </div>

          <div>
            <label className={labelClass}>Project *</label>
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={PROJECT_OPTIONS}
                  />
                )}
              />
            </div>
            {errors.projectId && <p className="text-red-500 text-xs mt-1">{errors.projectId.message as string}</p>}
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={CATEGORY_OPTIONS}
                  />
                )}
              />
            </div>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message as string}</p>}
          </div>

          <div>
            <label className={labelClass}>Client Name</label>
            <Input 
              type="text" 
              {...register('client')} 
              disabled={true} 
              placeholder="Auto-filled from project"
            />
          </div>

          <div>
            <label className={labelClass}>Client Contact</label>
            <Input 
              type="text" 
              {...register('clientContact')} 
              disabled={true} 
              placeholder="Auto-filled from project"
            />
          </div>

          <div>
            <label className={labelClass}>Priority *</label>
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={PRIORITY_OPTIONS}
                  />
                )}
              />
            </div>
            {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority.message as string}</p>}
          </div>

          <div>
            <label className={labelClass}>Status *</label>
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={STATUS_OPTIONS}
                  />
                )}
              />
            </div>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message as string}</p>}
          </div>

          <div>
            <label className={labelClass}>Assigned To (Owner) *</label>
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="assigned"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={USER_OPTIONS}
                  />
                )}
              />
            </div>
            {errors.assigned && <p className="text-red-500 text-xs mt-1">{errors.assigned.message as string}</p>}
          </div>

          <div>
            <label className={labelClass}>Supporting Member</label>
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="supportingMember"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={USER_OPTIONS}
                  />
                )}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Description *</label>
            <textarea 
              {...register('description')} 
              disabled={readOnly}
              rows={4}
              placeholder="Provide detailed description of the issue..."
              className={fieldClass(!!errors.description)}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>}
          </div>

          {(status === 'Closed' || readOnly) && (
            <div className="md:col-span-2">
              <label className={labelClass}>Final Remarks {status === 'Closed' ? '*' : ''}</label>
              <textarea 
                {...register('finalRemarks')} 
                disabled={readOnly}
                rows={3}
                placeholder="Describe what was done to resolve..."
                className={fieldClass(!!errors.finalRemarks)}
              />
              {errors.finalRemarks && <p className="text-red-500 text-xs mt-1">{errors.finalRemarks.message as string}</p>}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
