import { useState, useEffect } from 'react';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import { formStyles } from '../../../ui/form-styles';
import { Loader2 } from 'lucide-react';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

interface Props {
  readOnly?: boolean;
}

export default function PayrollConfigurationTab({ readOnly }: Props) {
  const [templateName, setTemplateName] = useState('Standard Professional');
  const [layoutHTML, setLayoutHTML] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    // Fetch existing templates
    api.get('/hrms/payroll/payslip-templates').then(res => {
      const data = res.data || res;
      if (Array.isArray(data) && data.length > 0) {
        const t = data.find((d: any) => d.setAsDefault) || data[0];
        setTemplateName(t.templateName);
        setLayoutHTML(t.layoutHTML || '');
        setSetAsDefault(t.setAsDefault);
      }
    }).catch(err => console.error(err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/hrms/payroll/payslip-templates', {
        templateName,
        layoutHTML,
        setAsDefault
      });
      toast.success('Payslip template saved successfully');
    } catch (err) {
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Payslip Templates */}
      <FormSection title="Payslip Templates" description="Configure HTML layouts for employee payslips.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Template Name *
            </label>
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Standard Professional"
              disabled={readOnly}
            />
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <label className={formStyles.label}>
              Layout HTML *
            </label>
            <textarea
              value={layoutHTML}
              onChange={(e) => setLayoutHTML(e.target.value)}
              disabled={readOnly}
              className="w-full h-32 p-3 text-sm font-mono bg-gray-50 dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="<div>Payslip HTML goes here...</div>"
            />
          </div>

          <div className="space-y-2 sm:col-span-2 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={setAsDefault} 
                onChange={(e) => setSetAsDefault(e.target.checked)} 
                disabled={readOnly} 
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary dark:border-gray-600 dark:bg-gray-700" 
              />
              <span className={formStyles.label}>Set as Default Template</span>
            </label>
          </div>
        </FormGrid>
        
        {!readOnly && (
          <div className="mt-6 flex justify-end">
             <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary text-white rounded-sm flex items-center gap-2">
               {saving && <Loader2 size={16} className="animate-spin" />} Save Template
             </button>
          </div>
        )}
      </FormSection>
    </div>
  );
}
