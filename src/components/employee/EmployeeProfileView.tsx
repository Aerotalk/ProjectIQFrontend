import { useState } from 'react';
import { 
  X, Edit, User, Phone, Mail, MapPin, Briefcase, 
  CreditCard, FileText, Shield
} from 'lucide-react';

interface EmployeeProfileViewProps {
  employee: any;
  onClose: () => void;
  onEdit: () => void;
}

export default function EmployeeProfileView({ employee, onClose, onEdit }: EmployeeProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bank' | 'documents'>('overview');

  const fullName = `${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`;
  const avatarInitials = `${employee.firstName?.charAt(0) || ''}${employee.lastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="w-full bg-gray-50 dark:bg-[#0a0a0a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col min-h-[calc(100vh-8rem)] overflow-hidden transition-colors duration-300">
      
      {/* ── Header Section ── */}
      <div className="px-6 py-5 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary text-white flex items-center justify-center rounded-lg text-2xl font-bold shrink-0 shadow-sm">
            {avatarInitials || 'E'}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              {fullName}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {employee.employeeCode || 'No ID'}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                employee.employmentStatus === 'ACTIVE'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
              }`}>
                {employee.employmentStatus || 'Active'}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 ml-2">
                <Briefcase size={14} className="text-primary dark:text-secondary" />
                {employee.designation?.designationName || 'No Designation'} 
                {employee.department?.departmentName && ` • ${employee.department.departmentName}`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-[#121212] transition-colors"
          >
            <Edit size={16} className="text-gray-500 dark:text-gray-400" />
            Edit Profile
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Close Profile"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="px-6 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 shrink-0">
        <nav className="flex space-x-8" aria-label="Tabs">
          {[
            { id: 'overview', name: 'Overview', icon: User },
            { id: 'bank', name: 'Bank & Statutory', icon: CreditCard },
            { id: 'documents', name: 'Documents', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive 
                    ? 'border-primary text-primary dark:text-secondary dark:border-secondary' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <Icon size={16} className={isActive ? 'text-primary dark:text-secondary' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'} />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Tab Content Area ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="mx-auto space-y-6">
          
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Personal Details */}
              <div className="bg-white dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <User size={18} className="text-primary dark:text-secondary" />
                    Personal Details
                  </h3>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  {[
                    { label: 'Date of Birth', value: employee.dateOfBirth },
                    { label: 'Gender', value: employee.gender },
                    { label: 'Marital Status', value: employee.maritalStatus },
                    { label: 'Blood Group', value: employee.bloodGroup },
                    { label: 'Nationality', value: employee.nationality },
                    { label: 'Date of Joining', value: employee.dateOfJoining }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-200">{item.value || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Phone size={18} className="text-primary dark:text-secondary" />
                    Contact Information
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{employee.workEmail || employee.user?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{employee.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-2">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Present Address</p>
                      <p className="text-sm text-gray-900 dark:text-gray-200 leading-relaxed">
                        {[employee.presentAddressLine1, employee.presentAddressLine2, employee.presentCity, employee.presentState, employee.presentCountry, employee.presentPinCode]
                          .filter(Boolean)
                          .join(', ') || 'Address not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'bank' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bank Details */}
              <div className="bg-white dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <CreditCard size={18} className="text-primary dark:text-secondary" />
                    Bank Details
                  </h3>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  {[
                    { label: 'Bank Name', value: employee.bankName },
                    { label: 'Account Number', value: employee.accountNumber },
                    { label: 'IFSC Code', value: employee.ifscCode },
                    { label: 'Account Type', value: employee.accountType },
                    { label: 'Payment Mode', value: employee.paymentMode }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-200">{item.value || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statutory Details */}
              <div className="bg-white dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Shield size={18} className="text-primary dark:text-secondary" />
                    Statutory Details
                  </h3>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  {[
                    { label: 'PAN Number', value: employee.panNumber },
                    { label: 'Aadhaar Number', value: employee.aadhaarNumber },
                    { label: 'UAN', value: employee.uan },
                    { label: 'PF Number', value: employee.pfNumber },
                    { label: 'ESI Number', value: employee.esiNumber }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-200">{item.value || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FileText size={18} className="text-primary dark:text-secondary" />
                  Uploaded Documents
                </h3>
              </div>
              <div className="p-8 text-center">
                <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No documents found for this employee.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
