import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Camera, Save, Key, User, Mail, Phone, Bell, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import CustomSelect from '../components/ui/CustomSelect';
import { api } from '../lib/api';
import PermissionGate from '../components/PermissionGate';
import SharedPhoneInput from '../components/shared/SharedPhoneInput';
import { useAuth } from '../contexts/AuthContext';

export default function EmployeeProfile() {
  const { refetchUser } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: 'Test',
    lastName: 'User',
    email: 'test9999@example.com',
    phone: '+1 (555) 000-0000',
    employeeCode: 'EMP-9999',
    designation: 'QA Engineer',
    department: 'Quality Assurance',
    gender: 'Male',
    bio: 'Software QA Engineer focused on automated testing.'
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/admin/employees/me');
        setProfileData({
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          email: response.user?.email || '',
          phone: response.user?.mobile || '',
          employeeCode: response.employeeCode || '',
          designation: response.designation?.designationName || '',
          department: response.department?.departmentName || '',
          gender: response.gender || 'Male',
          bio: response.bio || ''
        });
        if (response.profilePicture) {
          setAvatarUrl(response.profilePicture);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    security: true
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // In a real app, this would be an API call:
      // await api.put('/admin/employees/me', profileData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      await refetchUser();
      
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="employee">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#792359]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employee">
      <div className="max-w-6xl mx-auto space-y-6 relative">
        
        {/* Toast Notification */}
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 px-4 py-3 rounded-sm shadow-lg transition-all duration-300 transform z-50 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
          <CheckCircle2 size={20} />
          <span className="text-sm font-medium">Profile updated successfully!</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Profile Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your personal information and security preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Information Card */}
            <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
                  Employee Information
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Update your basic profile details and public avatar.</p>
              </div>
              
              <div className="p-6">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-black/20 rounded-sm flex items-center justify-center border border-gray-200 dark:border-white/10 overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Company Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-[#792359] dark:text-[#e6a8d0]">AT</span>
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm"
                    >
                      <Camera size={20} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Profile Picture</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Recommended size is 256x256px. Max file size 2MB.</p>
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const url = URL.createObjectURL(e.target.files[0]);
                            setAvatarUrl(url);
                          }
                        }}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-sm transition-colors border border-gray-200 dark:border-white/5"
                      >
                        Change Logo
                      </button>
                      <button 
                        onClick={() => setAvatarUrl(null)}
                        className="px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs font-medium rounded-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" onSubmit={handleSave}>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">First Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Last Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" disabled value={profileData.email} className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Phone Number</label>
                    <SharedPhoneInput
                      value={profileData.phone}
                      onChange={(val) => setProfileData({...profileData, phone: val})}
                      defaultCountry="IN"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Employee Code</label>
                    <input type="text" disabled value={profileData.employeeCode} className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Department</label>
                    <input type="text" disabled value={profileData.department} className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Designation</label>
                    <input type="text" disabled value={profileData.designation} className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Gender</label>
                    <CustomSelect 
                      options={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                        { value: 'Other', label: 'Other' }
                      ]}
                      value={profileData.gender}
                      onChange={(val) => setProfileData({...profileData, gender: val})}
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Employee Bio</label>
                    <textarea 
                      rows={3} 
                      value={profileData.bio} 
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors resize-none" 
                    />
                  </div>

                  <div className="md:col-span-2 pt-4 flex justify-end border-t border-gray-100 dark:border-white/5 mt-2">
                    <PermissionGate permission="employee.edit" fallback={
                      <button type="button" disabled className="flex items-center justify-center gap-2 bg-gray-300 dark:bg-gray-700 text-gray-500 px-5 py-2 w-40 text-sm font-medium rounded-sm cursor-not-allowed">
                        <Save size={16} />
                        View Only
                      </button>
                    }>
                      <button 
                        type="submit" 
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 bg-[#792359] hover:bg-[#52173c] disabled:bg-[#792359]/70 disabled:cursor-not-allowed text-white px-5 py-2 w-40 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </PermissionGate>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Security & Notifications */}
          <div className="space-y-6">
            
            {/* Password Section */}
            <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Key size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
                  Security
                </h2>
              </div>
              <div className="p-6">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showPasswords.current ? "text" : "password"} 
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        placeholder="••••••••" 
                        className="w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">New Password</label>
                    <div className="relative">
                      <input 
                        type={showPasswords.new ? "text" : "password"} 
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        placeholder="••••••••" 
                        className="w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white transition-colors" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Confirm New Password</label>
                    <div className="relative">
                      <input 
                        type={showPasswords.confirm ? "text" : "password"} 
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        placeholder="••••••••" 
                        className={`w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-black/20 border rounded-sm text-sm focus:outline-none text-gray-900 dark:text-white transition-colors ${
                          passwords.confirm && passwords.new !== passwords.confirm 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-200 dark:border-white/10 focus:border-[#792359] dark:focus:border-[#792359]'
                        }`} 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passwords.confirm && passwords.new !== passwords.confirm && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 dark:bg-white/10 dark:hover:bg-white/20 text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors border border-transparent dark:border-white/5">
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
                  Notifications
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { key: 'email', title: 'Email Alerts', desc: 'Receive daily summary emails.' },
                  { key: 'push', title: 'Push Notifications', desc: 'Real-time alerts for active sessions.' },
                  { key: 'security', title: 'Security Alerts', desc: 'New logins from unknown devices.' }
                ].map((item, idx) => {
                  const isChecked = notifications[item.key as keyof typeof notifications];
                  return (
                    <div key={idx} className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setNotifications({...notifications, [item.key]: !isChecked})}
                        className={`w-8 h-4 rounded-full relative transition-colors ${isChecked ? 'bg-[#792359]' : 'bg-gray-200 dark:bg-gray-700'}`}
                      >
                        <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isChecked ? 'left-4' : 'left-0.5'}`}></span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
