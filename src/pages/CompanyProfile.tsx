import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Save, Trash2, CheckCircle2, Loader2, Eye } from 'lucide-react';
import { api } from '../lib/api';
import { Country, State } from 'country-state-city';
import CustomSelect from '@/components/ui/CustomSelect';
import SharedPhoneInput from '@/components/shared/SharedPhoneInput';
import { useAuth } from '../contexts/AuthContext';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';

interface BankData {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  swiftCode: string;
  upiId: string;
  isPrimaryBank: boolean;
}

interface AccountData {
  id: string;
  companyName: string;
  legalName: string;
  gstNumber: string;
  panNumber: string;
  tanNumber: string;
  cinNumber: string;
  msmeNumber: string;
  iecCode: string;
  email: string;
  phone: string;
  website: string;
  primaryColor: string;
  secondaryColor: string;
  logoFileId?: string;
  invoiceLogoId?: string;
  stampFileId?: string;
  
  addressType: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  
  banks: BankData[];
}



const InputField = ({ 
  label, 
  type = "text", 
  required = false, 
  value, 
  onChange 
}: { 
  label: string, 
  type?: string, 
  required?: boolean, 
  value: string, 
  onChange: (val: string) => void 
}) => (
  <FormRow>
    <label className={formStyles.label}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={formStyles.field()}
    />
  </FormRow>
);

export default function CompanyProfile() {
  const { refetchUser } = useAuth();
  const [formData, setFormData] = useState<Partial<AccountData>>({});
  const [banks, setBanks] = useState<BankData[]>([]);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [invoiceLogoFile, setInvoiceLogoFile] = useState<File | null>(null);
  const [stampFile, setStampFile] = useState<File | null>(null);

  const countries = Country.getAllCountries();
  const selectedCountryCode = countries.find(c => c.name === (formData.country || 'India'))?.isoCode || 'IN';
  const statesList = State.getStatesOfCountry(selectedCountryCode);
  
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.get('/admin/company/profile');
      setFormData({
        ...data,
        addressType: data.addresses?.[0]?.addressType || 'Registered',
        addressLine1: data.addresses?.[0]?.addressLine1 || '',
        addressLine2: data.addresses?.[0]?.addressLine2 || '',
        city: data.addresses?.[0]?.city || '',
        state: data.addresses?.[0]?.state || '',
        country: data.addresses?.[0]?.country || 'India',
        postalCode: data.addresses?.[0]?.postalCode || ''
      });
      if (data.bankAccounts && data.bankAccounts.length > 0) {
        setBanks(data.bankAccounts.map((b: any) => ({
          ...b,
          isPrimaryBank: b.isPrimary || false
        })));
      } else {
        setBanks([{
          id: Date.now().toString(),
          bankName: '',
          accountHolderName: '',
          accountNumber: '',
          ifscCode: '',
          swiftCode: '',
          upiId: '',
          isPrimaryBank: true
        }]);
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  };

  useEffect(() => {
    if (formData.gstNumber && formData.gstNumber.length === 15) {
      const fetchGstInfo = async () => {
        try {
          const res = await api.get(`/admin/utils/gst-info?gstNumber=${formData.gstNumber}`);
          if (res) {
            setFormData(prev => ({
              ...prev,
              panNumber: res.pan || prev.panNumber,
              state: res.stateName || prev.state
            }));
          }
        } catch (err) {
          console.error("Failed to fetch GST info", err);
        }
      };
      fetchGstInfo();
    }
  }, [formData.gstNumber]);

  const addBank = () => {
    setBanks([...banks, {
      id: Date.now().toString(),
      bankName: '',
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      swiftCode: '',
      upiId: '',
      isPrimaryBank: banks.length === 0
    }]);
  };

  const removeBank = (id: string) => {
    setBanks(banks.filter(b => b.id !== id));
  };

  const handleBankChange = (id: string, field: keyof BankData, value: string | boolean) => {
    setBanks(banks.map(b => {
      if (b.id === id) {
        if (field === 'isPrimaryBank' && value === true) {
          return { ...b, [field]: value };
        }
        return { ...b, [field]: value };
      }
      if (field === 'isPrimaryBank' && value === true) {
        return { ...b, isPrimaryBank: false };
      }
      return b;
    }));
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await api.post('/admin/files/upload', formData);
      return res.id || null;
    } catch (err) {
      console.error('Failed to upload file', err);
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let { logoFileId, invoiceLogoId, stampFileId } = formData;

      if (logoFile) {
        const id = await uploadFile(logoFile);
        if (id) logoFileId = id;
      }
      if (invoiceLogoFile) {
        const id = await uploadFile(invoiceLogoFile);
        if (id) invoiceLogoId = id;
      }
      if (stampFile) {
        const id = await uploadFile(stampFile);
        if (id) stampFileId = id;
      }

      const payload = {
        ...formData,
        logoFileId,
        invoiceLogoId,
        stampFileId,
        addresses: [{
          addressType: formData.addressType || 'Registered',
          addressLine1: formData.addressLine1 || '',
          addressLine2: formData.addressLine2 || '',
          city: formData.city || '',
          state: formData.state || '',
          country: formData.country || 'India',
          postalCode: formData.postalCode || ''
        }],
        bankAccounts: banks.map(b => ({
          bankName: b.bankName,
          accountHolderName: b.accountHolderName,
          accountNumber: b.accountNumber,
          ifscCode: b.ifscCode,
          swiftCode: b.swiftCode || '',
          upiId: b.upiId || '',
          isPrimary: !!b.isPrimaryBank
        }))
      };
      
      await api.put('/admin/company/profile', payload);
      await refetchUser();
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to update company profile', err);
      alert('Failed to update company profile');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof AccountData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      
      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 flex items-center gap-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 px-4 py-3 rounded-sm shadow-lg transition-all duration-300 transform z-50 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
        <CheckCircle2 size={20} />
        <span className="text-sm font-medium">Company profile updated successfully!</span>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Company Profile
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your company details, addresses, and banking information.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            form="profile-form"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#792359] hover:bg-[#52173c] rounded-sm transition-colors shadow-sm disabled:opacity-80 disabled:cursor-not-allowed min-w-[140px] justify-center"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      <form id="profile-form" onSubmit={handleSubmit} className="space-y-6 pb-12">
        
        {/* Basic Details */}
        <FormSection title="Company Details" >
          <FormGrid className="md:grid-cols-2 lg:grid-cols-3">
              <InputField label="Company Name" required value={formData.companyName as string || ''} onChange={(val) => updateField('companyName', val)} />
              <InputField label="Legal Name" value={formData.legalName as string || ''} onChange={(val) => updateField('legalName', val)} />
              <InputField label="GST Number" value={formData.gstNumber as string || ''} onChange={(val) => updateField('gstNumber', val)} />
              
              <InputField label="PAN Number" required value={formData.panNumber as string || ''} onChange={(val) => updateField('panNumber', val)} />
              <InputField label="TAN Number" value={formData.tanNumber as string || ''} onChange={(val) => updateField('tanNumber', val)} />
              <InputField label="CIN Number" value={formData.cinNumber as string || ''} onChange={(val) => updateField('cinNumber', val)} />
              
              <InputField label="MSME Number" value={formData.msmeNumber as string || ''} onChange={(val) => updateField('msmeNumber', val)} />
              <InputField label="IEC Code" value={formData.iecCode as string || ''} onChange={(val) => updateField('iecCode', val)} />
              <InputField label="Email Address" type="email" required value={formData.email as string || ''} onChange={(val) => updateField('email', val)} />
              
              <FormRow>
                <label className={formStyles.label}>
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <SharedPhoneInput
                  value={formData.phone as string || ''}
                  onChange={(val) => updateField('phone', val)}
                  defaultCountry="IN"
                />
              </FormRow>
              <InputField label="Website URL" type="url" value={formData.website as string || ''} onChange={(val) => updateField('website', val)} />
              <div className="col-span-1 hidden lg:block"></div>
              
              <FormRow>
                <label className={`${formStyles.label} flex items-center justify-between`}>
                  <span>Company Logo</span>
                  {formData.logoFileId && (
                    <a href={`${API_BASE_URL}/admin/files/${formData.logoFileId}`} target="_blank" rel="noreferrer" className="text-[10px] text-[#792359] dark:text-[#e6a8d0] hover:underline flex items-center gap-1">
                      <Eye size={12} /> View Current
                    </a>
                  )}
                </label>
                <div className="flex flex-col gap-2">
                  {logoFile ? (
                    <div className="h-14 w-auto max-w-[120px] bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm p-1.5 flex items-center justify-center">
                      <img src={URL.createObjectURL(logoFile)} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : formData.logoFileId && (
                    <div className="h-14 w-auto max-w-[120px] bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm p-1.5 flex items-center justify-center">
                      <img src={`${API_BASE_URL}/admin/files/${formData.logoFileId}`} alt="Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="w-full px-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-gray-200 dark:file:bg-white/10 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-300 dark:hover:file:bg-white/20 transition-all cursor-pointer" />
                </div>
              </FormRow>
              <FormRow>
                <label className={`${formStyles.label} flex items-center justify-between`}>
                  <span>Invoice Logo</span>
                  {formData.invoiceLogoId && (
                    <a href={`${API_BASE_URL}/admin/files/${formData.invoiceLogoId}`} target="_blank" rel="noreferrer" className="text-[10px] text-[#792359] dark:text-[#e6a8d0] hover:underline flex items-center gap-1">
                      <Eye size={12} /> View Current
                    </a>
                  )}
                </label>
                <div className="flex flex-col gap-2">
                  {invoiceLogoFile ? (
                    <div className="h-14 w-auto max-w-[120px] bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm p-1.5 flex items-center justify-center">
                      <img src={URL.createObjectURL(invoiceLogoFile)} alt="Invoice Logo Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : formData.invoiceLogoId && (
                    <div className="h-14 w-auto max-w-[120px] bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm p-1.5 flex items-center justify-center">
                      <img src={`${API_BASE_URL}/admin/files/${formData.invoiceLogoId}`} alt="Invoice Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => setInvoiceLogoFile(e.target.files?.[0] || null)} className="w-full px-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-gray-200 dark:file:bg-white/10 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-300 dark:hover:file:bg-white/20 transition-all cursor-pointer" />
                </div>
              </FormRow>
              <FormRow>
                <label className={`${formStyles.label} flex items-center justify-between`}>
                  <span>Company Stamp</span>
                  {formData.stampFileId && (
                    <a href={`${API_BASE_URL}/admin/files/${formData.stampFileId}`} target="_blank" rel="noreferrer" className="text-[10px] text-[#792359] dark:text-[#e6a8d0] hover:underline flex items-center gap-1">
                      <Eye size={12} /> View Current
                    </a>
                  )}
                </label>
                <div className="flex flex-col gap-2">
                  {stampFile ? (
                    <div className="h-14 w-auto max-w-[120px] bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm p-1.5 flex items-center justify-center">
                      <img src={URL.createObjectURL(stampFile)} alt="Stamp Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : formData.stampFileId && (
                    <div className="h-14 w-auto max-w-[120px] bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm p-1.5 flex items-center justify-center">
                      <img src={`${API_BASE_URL}/admin/files/${formData.stampFileId}`} alt="Stamp" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => setStampFile(e.target.files?.[0] || null)} className="w-full px-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-gray-200 dark:file:bg-white/10 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-300 dark:hover:file:bg-white/20 transition-all cursor-pointer" />
                </div>
              </FormRow>
              
              <FormRow>
                <label className={formStyles.label}>Primary Color</label>
                <div className="flex items-center gap-3 w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm">
                  <input type="color" value={formData.primaryColor || '#792359'} onChange={(e) => updateField('primaryColor', e.target.value)} className="h-6 w-6 rounded cursor-pointer border-0 p-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">{formData.primaryColor || '#792359'}</span>
                </div>
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>Secondary Color</label>
                <div className="flex items-center gap-3 w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm">
                  <input type="color" value={formData.secondaryColor || '#E6A8D0'} onChange={(e) => updateField('secondaryColor', e.target.value)} className="h-6 w-6 rounded cursor-pointer border-0 p-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">{formData.secondaryColor || '#E6A8D0'}</span>
                </div>
              </FormRow>
          </FormGrid>
        </FormSection>

        {/* Address Details */}
        <FormSection title="Address Details" >
          <FormGrid className="md:grid-cols-2 lg:grid-cols-3">
              <FormRow>
                <label className={formStyles.label}>Address Type</label>
                <CustomSelect
                  value={formData.addressType || 'Registered'}
                  onChange={(val) => updateField('addressType', val)}
                  options={[
                    { label: 'Registered', value: 'Registered' },
                    { label: 'Corporate', value: 'Corporate' }
                  ]}
                />
              </FormRow>
              
              <div className="md:col-span-2">
                <InputField label="Address Line 1" required value={formData.addressLine1 as string || ''} onChange={(val) => updateField('addressLine1', val)} />
              </div>
              
              <div className="md:col-span-1 lg:col-span-1">
                <InputField label="Address Line 2" value={formData.addressLine2 as string || ''} onChange={(val) => updateField('addressLine2', val)} />
              </div>
              
              <div className="md:col-span-1 lg:col-span-1">
                <InputField label="City" required value={formData.city as string || ''} onChange={(val) => updateField('city', val)} />
              </div>
              
              <FormRow className="md:col-span-1 lg:col-span-1">
                <label className={formStyles.label}>State <span className="text-red-500">*</span></label>
                <CustomSelect
                  value={formData.state || ''}
                  onChange={(val) => updateField('state', val)}
                  options={statesList.map((s: any) => ({ label: s.name, value: s.name }))}
                />
              </FormRow>
              
              <FormRow>
                <label className={formStyles.label}>Country <span className="text-red-500">*</span></label>
                <CustomSelect
                  value={formData.country || ''}
                  onChange={(val) => {
                    updateField('country', val);
                    updateField('state', '');
                  }}
                  options={countries.map((c: any) => ({ label: c.name, value: c.name }))}
                />
              </FormRow>
              <div className="md:col-span-1">
                <InputField label="Postal Code" required value={formData.postalCode as string || ''} onChange={(val) => updateField('postalCode', val)} />
              </div>
          </FormGrid>
        </FormSection>

        {/* Bank Details */}
        <FormSection title="Bank Details">
          <div className="mb-4 text-right">
            <button 
              type="button" 
              onClick={addBank}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#792359] bg-[#792359]/10 hover:bg-[#792359]/20 rounded-sm transition-colors"
            >
              <Plus size={14} /> Add Another Bank
            </button>
          </div>
          <div className="space-y-8">
            {banks.map((bank, index) => (
              <div key={bank.id} className="pb-4">
                
                <div className="flex justify-between items-center mb-5">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Bank Account {index + 1}
                  </h4>
                  {banks.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeBank(bank.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-sm transition-colors dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  )}
                </div>
                
                <FormGrid className="md:grid-cols-2 lg:grid-cols-3">
                  <FormRow>
                    <label className={formStyles.label}>Bank Name <span className="text-red-500">*</span></label>
                    <input type="text" value={bank.bankName} onChange={(e) => handleBankChange(bank.id, 'bankName', e.target.value)} required className={formStyles.field()} />
                  </FormRow>
                  <FormRow>
                    <label className={formStyles.label}>Account Holder Name <span className="text-red-500">*</span></label>
                    <input type="text" value={bank.accountHolderName} onChange={(e) => handleBankChange(bank.id, 'accountHolderName', e.target.value)} required className={formStyles.field()} />
                  </FormRow>
                  <FormRow>
                    <label className={formStyles.label}>Account Number <span className="text-red-500">*</span></label>
                    <input type="text" value={bank.accountNumber} onChange={(e) => handleBankChange(bank.id, 'accountNumber', e.target.value)} required className={formStyles.field()} />
                  </FormRow>
                  <FormRow>
                    <label className={formStyles.label}>IFSC Code <span className="text-red-500">*</span></label>
                    <input type="text" value={bank.ifscCode} onChange={(e) => handleBankChange(bank.id, 'ifscCode', e.target.value)} required className={formStyles.field()} />
                  </FormRow>
                  <FormRow>
                    <label className={formStyles.label}>SWIFT Code</label>
                    <input type="text" value={bank.swiftCode} onChange={(e) => handleBankChange(bank.id, 'swiftCode', e.target.value)} className={formStyles.field()} />
                  </FormRow>
                  <FormRow>
                    <label className={formStyles.label}>UPI ID</label>
                    <input type="text" value={bank.upiId} onChange={(e) => handleBankChange(bank.id, 'upiId', e.target.value)} className={formStyles.field()} />
                  </FormRow>
                  
                  <div className="flex items-center pt-4 lg:col-span-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name={`primaryBank-${index}`}
                        checked={bank.isPrimaryBank}
                        onChange={() => handleBankChange(bank.id, 'isPrimaryBank', true)}
                        className="w-4 h-4 text-[#792359] border-gray-300 rounded-full focus:ring-[#792359] dark:bg-black/20 dark:border-white/10" 
                      />
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Set as Primary Bank</span>
                    </label>
                  </div>
                </FormGrid>
              </div>
            ))}
          </div>
        </FormSection>

      </form>
    </div>
  );
}
