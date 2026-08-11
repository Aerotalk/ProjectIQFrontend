import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';
import { useState } from 'react';
import { api } from '../../../../lib/api';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  readOnly?: boolean;
}

export default function EmploymentContractTab({ readOnly }: Props) {
  const { register, control, setValue, watch } = useFormContext();
  const [contractUploading, setContractUploading] = useState(false);
  const signedContractValue = watch('signedContractUpload');

  const handleContractUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setContractUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('module', 'employee_contracts');
      const res = await api.request('/admin/files/upload', { method: 'POST', data: formData });
      if (res?.id) setValue('signedContractUpload', res.id);
    } catch (err) {
      console.warn('Contract upload failed', err);
    } finally {
      setContractUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormSection title="Employment Contract" className="pt-0 border-t-0">
        <FormGrid>
          {/* Row: Contract Type | (spacer — type is a full-concept field) */}
          <div>
            <label className={formStyles.label}>Contract Type</label>
            <Controller
              name={'contractType'}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: 'Select Type', value: '' },
                    { label: 'Permanent', value: 'Permanent' },
                    { label: 'Fixed Term', value: 'Fixed Term' },
                    { label: 'Consultant', value: 'Consultant' },
                    { label: 'Internship', value: 'Internship' }
                  ]}
                  disabled={readOnly}
                />
              )}
            />
          </div>
          <div /> {/* intentional spacer */}

          {/* Row: Start Date | End Date */}
          <div>
            <label className={formStyles.label}>Start Date</label>
            <CustomDatePicker name="contractStartDate" disabled={readOnly} />
          </div>
          <div>
            <label className={formStyles.label}>End Date</label>
            <CustomDatePicker name="contractEndDate" disabled={readOnly} />
          </div>

          {/* Row: Annual CTC | Notice Period */}
          <div>
            <label className={formStyles.label}>Annual CTC</label>
            <Input type="number" step="0.01" {...register('contractAnnualCTC', { setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v) })} disabled={readOnly} />
          </div>
          <div>
            <label className={formStyles.label}>Notice Period (Days)</label>
            <Input type="number" {...register('contractNoticePeriod', { setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v) })} disabled={readOnly} />
          </div>

          {/* Contract Terms — full width */}
          <FormRow>
            <label className={formStyles.label}>Contract Terms</label>
            <textarea
              {...register('contractTerms')}
              disabled={readOnly}
              rows={3}
              className={formStyles.textarea(false, readOnly)}
            />
          </FormRow>

          {/* Signed Contract Upload — full width */}
          <FormRow>
            <label className={formStyles.label}>Signed Contract Upload</label>
            {!readOnly && (
              <div className="space-y-1">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleContractUpload}
                  disabled={contractUploading}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                />
                {contractUploading && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Loader2 size={10} className="animate-spin" /> Uploading...
                  </p>
                )}
                {signedContractValue && typeof signedContractValue === 'string' && !contractUploading && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 size={10} /> Contract uploaded
                  </p>
                )}
              </div>
            )}
            {readOnly && signedContractValue && (
              <p className="text-xs text-gray-500">Contract file attached</p>
            )}
          </FormRow>
        </FormGrid>
      </FormSection>
    </div>
  );
}
