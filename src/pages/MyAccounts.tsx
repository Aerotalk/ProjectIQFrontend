import React, { useState, useEffect } from 'react';
import { Plus, Building2, MapPin, CreditCard, ArrowLeft, Save, Trash2, Edit2, CheckCircle2, Loader2, Eye, EyeOff, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

type ViewState = 'list' | 'add' | 'edit';

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
  adminPassword?: string;
  companyCode?: string;
  
  addressType: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  
  banks: BankData[];
  addresses?: any[];
  bankAccounts?: any[];
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

const AccountForm = ({ 
  initialData, 
  onSave, 
  onCancel 
}: { 
  initialData?: AccountData; 
  onSave: (data: AccountData) => void; 
  onCancel: () => void;
}) => {
  const primaryAddress = initialData?.addresses?.[0];
  const mappedBanks = initialData?.bankAccounts?.map((b: any) => ({
    id: b.id || Date.now().toString() + Math.random().toString(),
    bankName: b.bankName || '',
    accountHolderName: b.accountHolderName || '',
    accountNumber: b.accountNumber || '',
    ifscCode: b.ifscCode || '',
    swiftCode: b.swiftCode || '',
    upiId: b.upiId || '',
    isPrimaryBank: !!b.isPrimary
  })) || [{
    id: Date.now().toString(),
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    swiftCode: '',
    upiId: '',
    isPrimaryBank: true
  }];

  const [formData, setFormData] = useState<Partial<AccountData>>({
    id: initialData?.id || '',
    companyName: initialData?.companyName || '',
    legalName: initialData?.legalName || '',
    gstNumber: initialData?.gstNumber || '',
    panNumber: initialData?.panNumber || '',
    tanNumber: initialData?.tanNumber || '',
    cinNumber: initialData?.cinNumber || '',
    msmeNumber: initialData?.msmeNumber || '',
    iecCode: initialData?.iecCode || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    primaryColor: initialData?.primaryColor || '#792359',
    secondaryColor: initialData?.secondaryColor || '#E6A8D0',
    adminPassword: '',
    addressType: primaryAddress?.addressType || 'Registered',
    addressLine1: primaryAddress?.addressLine1 || '',
    addressLine2: primaryAddress?.addressLine2 || '',
    city: primaryAddress?.city || '',
    state: primaryAddress?.state || '',
    country: primaryAddress?.country || 'India',
    postalCode: primaryAddress?.postalCode || '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const [banks, setBanks] = useState<BankData[]>(mappedBanks);

  const [isSaving, setIsSaving] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSave({ ...formData, banks } as AccountData);
    }, 800);
  };

  const isEditMode = !!initialData;

  const updateField = (field: keyof AccountData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isEditMode ? 'Edit Account Details' : 'Add New Account'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditMode ? 'Update the details for this organization account.' : 'Fill in the details below to create a new organization account.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-sm transition-colors shadow-sm dark:bg-[#181a1f] dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5 disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="account-form"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#792359] hover:bg-[#52173c] rounded-sm transition-colors shadow-sm disabled:opacity-80 disabled:cursor-not-allowed min-w-[140px] justify-center"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Save Account')}
          </button>
        </div>
      </div>

      <form id="account-form" onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Details */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
              Basic Details
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

              {/* Admin Login Password - only for new accounts */}
              {!isEditMode && (
                <div className="space-y-1.5 lg:col-span-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1">
                    <Lock size={12} className="text-[#792359]" />
                    Admin Login Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required={!isEditMode}
                      value={formData.adminPassword as string || ''}
                      onChange={(e) => updateField('adminPassword', e.target.value)}
                      placeholder="Set password for company admin login"
                      className="w-full px-3 pr-10 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400">This will be the login password for the company admin account ({formData.email || 'company email'}).</p>
                </div>
              )}


              
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
};

export default function MyAccounts() {
  const [viewState, setViewState] = useState<ViewState>('list');
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(null);
  
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const orgId = localStorage.getItem('organizationId');
      if (!orgId) return;
      const res = await api.get(`/admin/companies?organizationId=${orgId}`);
      const data = Array.isArray(res) ? res : (res.content || []);
      setAccounts(data);
    } catch (error) {
      console.error('Failed to fetch companies', error);
    }
  };

  const handleEditAccount = (account: AccountData) => {
    setSelectedAccount(account);
    setViewState('edit');
  };

  const handleSaveAccount = async (data: AccountData) => {
    try {
      const orgId = localStorage.getItem('organizationId');
      if (!orgId) return;
      
      const addresses = [
        {
          addressType: data.addressType || 'Registered',
          addressLine1: data.addressLine1 || '',
          addressLine2: data.addressLine2 || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || 'India',
          postalCode: data.postalCode || ''
        }
      ];

      const bankAccounts = (data.banks || []).map(b => ({
        bankName: b.bankName,
        accountHolderName: b.accountHolderName,
        accountNumber: b.accountNumber,
        ifscCode: b.ifscCode,
        swiftCode: b.swiftCode || '',
        upiId: b.upiId || '',
        isPrimary: !!b.isPrimaryBank
      }));

      const payload = {
        companyName: data.companyName,
        legalName: data.legalName,
        gstNumber: data.gstNumber,
        panNumber: data.panNumber,
        tanNumber: data.tanNumber,
        cinNumber: data.cinNumber,
        msmeNumber: data.msmeNumber,
        iecCode: data.iecCode,
        email: data.email,
        phone: data.phone,
        website: data.website,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        status: 'ACTIVE',
        organizationId: orgId,
        companyCode: viewState === 'add'
          ? `${data.companyName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
          : data.companyCode,
        adminPassword: data.adminPassword || undefined,
        addresses,
        bankAccounts
      };

      if (viewState === 'add') {
        await api.post(`/admin/companies`, payload);
      } else {
        // Don't send adminPassword on edit
        const { adminPassword: _, ...editPayload } = payload;
        await api.put(`/admin/companies/${data.id}?organizationId=${orgId}`, editPayload);
      }
      
      await fetchAccounts();
      setViewState('list');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save company', error);
      alert('Failed to save company');
    }
  };

  const renderList = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Accounts</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your organization's related accounts.</p>
          </div>
          <button
            onClick={() => { setSelectedAccount(null); setViewState('add'); }}
            className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-5 py-2 rounded-sm text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Account
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white dark:bg-black/20 text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-gray-200 dark:border-white/5">Company Name</th>
                <th className="px-6 py-4 border-b border-gray-200 dark:border-white/5">Email</th>
                <th className="px-6 py-4 border-b border-gray-200 dark:border-white/5">Phone</th>
                <th className="px-6 py-4 border-b border-gray-200 dark:border-white/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-4">
                    <div className="w-10 h-10 min-w-[40px] rounded-sm bg-gray-100 dark:bg-black/20 text-[#792359] border border-gray-200 dark:border-white/10 flex items-center justify-center font-bold text-sm">
                      {acc.companyName.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="truncate">{acc.companyName}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{acc.email || '-'}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{acc.phone || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEditAccount(acc)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-300 rounded-sm transition-colors border border-transparent"
                    >
                      <Edit2 size={14} />
                      View / Edit
                    </button>
                  </td>
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No accounts found. Click "Add Account" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full relative">
      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 flex items-center gap-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 px-4 py-3 rounded-sm shadow-lg transition-all duration-300 transform z-50 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
        <CheckCircle2 size={20} />
        <span className="text-sm font-medium">Account details saved successfully!</span>
      </div>
      
      {viewState === 'list' && renderList()}
      {viewState === 'add' && (
        <AccountForm 
          onSave={handleSaveAccount} 
          onCancel={() => setViewState('list')} 
        />
      )}
      {viewState === 'edit' && selectedAccount && (
        <AccountForm 
          initialData={selectedAccount} 
          onSave={handleSaveAccount} 
          onCancel={() => setViewState('list')} 
        />
      )}
    </div>
  );
}
