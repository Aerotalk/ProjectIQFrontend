import React, { useState, useEffect } from 'react';
import { Plus, Building2, MapPin, CreditCard, Save, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

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
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors"
    />
  </div>
);

export default function CompanyProfile() {
  const [formData, setFormData] = useState<Partial<AccountData>>({});
  const [banks, setBanks] = useState<BankData[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
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
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
              Company Details
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              <InputField label="Company Name" required value={formData.companyName as string || ''} onChange={(val) => updateField('companyName', val)} />
              <InputField label="Legal Name" value={formData.legalName as string || ''} onChange={(val) => updateField('legalName', val)} />
              <InputField label="GST Number" value={formData.gstNumber as string || ''} onChange={(val) => updateField('gstNumber', val)} />
              
              <InputField label="PAN Number" required value={formData.panNumber as string || ''} onChange={(val) => updateField('panNumber', val)} />
              <InputField label="TAN Number" value={formData.tanNumber as string || ''} onChange={(val) => updateField('tanNumber', val)} />
              <InputField label="CIN Number" value={formData.cinNumber as string || ''} onChange={(val) => updateField('cinNumber', val)} />
              
              <InputField label="MSME Number" value={formData.msmeNumber as string || ''} onChange={(val) => updateField('msmeNumber', val)} />
              <InputField label="IEC Code" value={formData.iecCode as string || ''} onChange={(val) => updateField('iecCode', val)} />
              <InputField label="Email Address" type="email" required value={formData.email as string || ''} onChange={(val) => updateField('email', val)} />
              
              <InputField label="Phone Number" type="tel" required value={formData.phone as string || ''} onChange={(val) => updateField('phone', val)} />
              <InputField label="Website URL" type="url" value={formData.website as string || ''} onChange={(val) => updateField('website', val)} />
              <div className="col-span-1 hidden lg:block"></div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Company Logo</label>
                <input type="file" className="w-full px-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-gray-200 dark:file:bg-white/10 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-300 dark:hover:file:bg-white/20 transition-all cursor-pointer" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Invoice Logo</label>
                <input type="file" className="w-full px-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-gray-200 dark:file:bg-white/10 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-300 dark:hover:file:bg-white/20 transition-all cursor-pointer" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Company Stamp</label>
                <input type="file" className="w-full px-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-gray-200 dark:file:bg-white/10 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-300 dark:hover:file:bg-white/20 transition-all cursor-pointer" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Primary Color</label>
                <div className="flex items-center gap-3 w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm">
                  <input type="color" value={formData.primaryColor || '#792359'} onChange={(e) => updateField('primaryColor', e.target.value)} className="h-6 w-6 rounded cursor-pointer border-0 p-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">{formData.primaryColor || '#792359'}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Secondary Color</label>
                <div className="flex items-center gap-3 w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm">
                  <input type="color" value={formData.secondaryColor || '#E6A8D0'} onChange={(e) => updateField('secondaryColor', e.target.value)} className="h-6 w-6 rounded cursor-pointer border-0 p-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">{formData.secondaryColor || '#E6A8D0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
              Address Details
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Address Type</label>
                <select 
                  value={formData.addressType}
                  onChange={(e) => updateField('addressType', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors"
                >
                  <option value="Registered">Registered</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <InputField label="Address Line 1" required value={formData.addressLine1 as string || ''} onChange={(val) => updateField('addressLine1', val)} />
              </div>
              
              <div className="md:col-span-1 lg:col-span-1">
                <InputField label="Address Line 2" value={formData.addressLine2 as string || ''} onChange={(val) => updateField('addressLine2', val)} />
              </div>
              
              <div className="md:col-span-1 lg:col-span-1">
                <InputField label="City" required value={formData.city as string || ''} onChange={(val) => updateField('city', val)} />
              </div>
              
              <div className="md:col-span-1 lg:col-span-1 space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">State <span className="text-red-500">*</span></label>
                <select 
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors"
                >
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Country <span className="text-red-500">*</span></label>
                <select 
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors"
                >
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <InputField label="Postal Code" required value={formData.postalCode as string || ''} onChange={(val) => updateField('postalCode', val)} />
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
              Bank Details
            </h2>
            <button 
              type="button" 
              onClick={addBank}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#792359] bg-[#792359]/10 hover:bg-[#792359]/20 rounded-sm transition-colors"
            >
              <Plus size={14} /> Add Another Bank
            </button>
          </div>
          
          <div className="p-6 space-y-8">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Bank Name <span className="text-red-500">*</span></label>
                    <input type="text" value={bank.bankName} onChange={(e) => handleBankChange(bank.id, 'bankName', e.target.value)} required className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Account Holder Name <span className="text-red-500">*</span></label>
                    <input type="text" value={bank.accountHolderName} onChange={(e) => handleBankChange(bank.id, 'accountHolderName', e.target.value)} required className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Account Number <span className="text-red-500">*</span></label>
                    <input type="text" value={bank.accountNumber} onChange={(e) => handleBankChange(bank.id, 'accountNumber', e.target.value)} required className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">IFSC Code <span className="text-red-500">*</span></label>
                    <input type="text" value={bank.ifscCode} onChange={(e) => handleBankChange(bank.id, 'ifscCode', e.target.value)} required className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">SWIFT Code</label>
                    <input type="text" value={bank.swiftCode} onChange={(e) => handleBankChange(bank.id, 'swiftCode', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">UPI ID</label>
                    <input type="text" value={bank.upiId} onChange={(e) => handleBankChange(bank.id, 'upiId', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" />
                  </div>
                  
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
                </div>
              </div>
            ))}
          </div>
        </div>

      </form>
    </div>
  );
}
