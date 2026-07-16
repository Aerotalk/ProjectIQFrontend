import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, Edit, Download, Info, 
  CheckCircle2, FileText, Send, MessageSquare, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import CustomSelect from '@/components/ui/CustomSelect';

export default function QuotationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isNew = id === 'new';
  const [isEditing, setIsEditing] = useState(isNew);
  const [currentStage, setCurrentStage] = useState(1);
  const [activeTab, setActiveTab] = useState('Products & Services');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  interface LineItem {
    id: string;
    name: string;
    category: string;
    qty: number;
    rate: number;
    gst: number;
    amount: number;
  }

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', name: 'Web Application Development', category: 'Development', qty: 1, rate: 150000, gst: 18, amount: 150000 },
    { id: '2', name: 'Data Integration Service', category: 'Integration', qty: 1, rate: 60000, gst: 18, amount: 60000 }
  ]);

  const availableProducts = [
    { id: '1', name: 'Web Application Development', category: 'Development', rate: 150000, gst: 18 },
    { id: '2', name: 'Mobile App Development', category: 'Development', rate: 200000, gst: 18 },
    { id: '3', name: 'Data Integration Service', category: 'Integration', rate: 60000, gst: 18 },
    { id: '4', name: 'Cloud Hosting (Monthly)', category: 'Hosting', rate: 8000, gst: 18 },
    { id: '5', name: 'Training & Documentation', category: 'Service', rate: 20000, gst: 18 },
    { id: '6', name: 'Support & Maintenance', category: 'Support', rate: 15000, gst: 18 },
    { id: '7', name: 'UI/UX Design', category: 'Development', rate: 75000, gst: 18 },
  ];

  const stages = [
    { id: 1, name: 'Draft' },
    { id: 2, name: 'Pending Approval' },
    { id: 3, name: 'Sent to Client' },
    { id: 4, name: 'Under Negotiation' },
    { id: 5, name: 'Accepted' },
    { id: 6, name: 'Converted' },
  ];

  const [quotation, setQuotation] = useState(() => {
    if (!isNew) {
      const saved = localStorage.getItem('demo_quotations');
      if (saved) {
        const parsed = JSON.parse(saved);
        const found = parsed.find((q: any) => q.id === id);
        if (found) {
          return {
            qtnNo: found.qtnNo,
            client: found.client,
            project: found.project,
            amount: found.amount,
            validTill: found.validTill,
            owner: found.owner,
            discount: found.discount || 0,
            createdOn: '09 May 2025',
            lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            currency: 'INR'
          };
        }
      }
    }
    return {
      qtnNo: isNew ? 'Unassigned' : 'QTN-100245',
      client: isNew ? '' : 'TechNova Pvt Ltd',
      project: isNew ? '' : 'Analytics Dashboard',
      amount: isNew ? '' : '271400',
      validTill: isNew ? '' : '2025-05-20',
      owner: isNew ? 'Arjun Dev' : 'Arjun Dev',
      discount: 0,
      createdOn: isNew ? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '09 May 2025',
      lastUpdated: isNew ? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '09 May 2025',
      currency: 'INR'
    };
  });

  // Helper to format date nicely when not editing
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const subTotal = lineItems.reduce((sum, item) => sum + (item.rate * item.qty), 0);
  const totalGst = lineItems.reduce((sum, item) => sum + (item.rate * item.qty * item.gst / 100), 0);
  const grandTotal = subTotal + totalGst - (Number(quotation.discount) || 0);

  const renderBanner = () => {
    switch (currentStage) {
      case 1:
        return (
          <div className="bg-[#fff9ea] dark:bg-yellow-500/10 border border-[#fde9a4] dark:border-yellow-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="text-yellow-600 dark:text-yellow-500" size={20} />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {isNew ? 'You are creating a new quotation. Add details and save as draft.' : 'You are preparing the quotation. Add products/services and send for approval.'}
              </p>
            </div>
            {isNew ? (
              <button 
                onClick={() => {
                  if (!quotation.client || !quotation.project || !quotation.amount || !quotation.validTill) {
                    toast.error('Please fill all mandatory fields before saving draft');
                    return;
                  }
                  
                  // Save to localStorage
                  const saved = localStorage.getItem('demo_quotations');
                  let allQtns = saved ? JSON.parse(saved) : [];
                  const newId = String(allQtns.length + 1);
                  const newQtnNo = `QTN-100${244 + allQtns.length + 1}`;
                  
                  const newEntry = {
                    id: newId,
                    qtnNo: newQtnNo,
                    client: quotation.client,
                    project: quotation.project,
                    amount: quotation.amount,
                    discount: quotation.discount,
                    status: 'Draft',
                    validTill: quotation.validTill,
                    owner: quotation.owner || 'Unassigned'
                  };
                  
                  allQtns.unshift(newEntry); // Add to beginning so it shows first
                  localStorage.setItem('demo_quotations', JSON.stringify(allQtns));
                  
                  toast.success('Quotation draft saved successfully'); 
                  navigate('/companydashboard/sales/quotations'); 
                }}
                className="bg-[#792359] text-white px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-[#52173c] transition-colors"
              >
                Save Draft
              </button>
            ) : (
              <button 
                onClick={() => {
                  if (!quotation.client || !quotation.project || !quotation.amount || !quotation.validTill) {
                    toast.error('Please fill all mandatory fields before sending for approval');
                    return;
                  }
                  setCurrentStage(2); 
                  toast.success('Sent for approval'); 
                }}
                className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Send for approval
              </button>
            )}
          </div>
        );
      case 2:
        return (
          <div className="bg-[#fff9ea] dark:bg-yellow-500/10 border border-[#fde9a4] dark:border-yellow-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="text-yellow-600 dark:text-yellow-500" size={20} />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">Quotation is sent for internal approval. You will be notified once it is approved or rejected.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => { setCurrentStage(1); toast.error('Quotation rejected internally'); }}
                className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Reject (Demo)
              </button>
              <button 
                onClick={() => { setCurrentStage(3); toast.success('Approved internally'); }}
                className="bg-[#792359] text-white px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-[#52173c] transition-colors"
              >
                Approve (Demo)
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="text-blue-600 dark:text-blue-400" size={20} />
              <p className="text-sm text-blue-800 dark:text-blue-200">Quotation has been sent to the client. You can track client view and follow-up.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => { setCurrentStage(4); toast.success('Marked as Under Negotiation'); }}
                className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Client Requested Changes
              </button>
              <button 
                onClick={() => { setCurrentStage(5); toast.success('Client Accepted Quotation!'); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-sm font-medium rounded-sm transition-colors"
              >
                Simulate Client Acceptance
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="text-purple-600 dark:text-purple-400" size={20} />
              <p className="text-sm text-purple-800 dark:text-purple-200">Client has requested changes. Edit the quotation to create a revision, then send it back for internal approval.</p>
            </div>
            <button 
              onClick={() => { setCurrentStage(2); toast.success('Revision sent for internal approval.'); }}
              className="bg-[#792359] text-white px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-[#52173c] transition-colors"
            >
              Send Revision for Approval
            </button>
          </div>
        );
      case 5:
        return (
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600 dark:text-emerald-500" size={20} />
              <p className="text-sm text-emerald-800 dark:text-emerald-200">Great! The quotation is accepted by the client. Please upload the WO/PO to convert.</p>
            </div>
            <button 
              onClick={() => { setCurrentStage(6); toast.success('Quotation converted to project!'); }}
              className="bg-[#792359] text-white px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-[#52173c] transition-colors"
            >
              Upload WO / PO
            </button>
          </div>
        );
      case 6:
        return (
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600 dark:text-emerald-500" size={20} />
              <p className="text-sm text-emerald-800 dark:text-emerald-200">Quotation has been converted into project. You can view the project or go to finance module.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    const stageName = stages.find(s => s.id === currentStage)?.name;
    return stageName;
  };

  const getStatusColor = () => {
    switch (currentStage) {
      case 1: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-gray-300 dark:border-white/10';
      case 2: return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20';
      case 3: return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      case 4: return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
      case 5: 
      case 6: return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      default: return '';
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Link to="/companydashboard/sales" className="hover:text-[#792359] dark:hover:text-[#e6a8d0]">Sales</Link>
            <ChevronRight size={14} />
            <Link to="/companydashboard/sales/quotations" className="hover:text-[#792359] dark:hover:text-[#e6a8d0]">Quotations</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 dark:text-white font-medium">{isNew ? 'New Quotation' : quotation.qtnNo}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{isNew ? 'Create Quotation' : 'Quotation Details'}</h1>
            {!isNew && (
              <span className="bg-[#792359]/10 text-[#792359] dark:bg-[#792359]/20 dark:text-[#e6a8d0] px-2.5 py-0.5 rounded-sm text-xs font-semibold">
                {quotation.qtnNo}
              </span>
            )}
            {!isNew && (
              <span className={`px-2.5 py-0.5 rounded-sm text-xs font-semibold border ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {currentStage === 6 && (
            <button className="bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm flex items-center gap-2">
              View Project
            </button>
          )}
          {(currentStage === 1 || currentStage === 4) && (
            <button 
              onClick={() => {
                if (isEditing) {
                  if (!isNew) {
                    const saved = localStorage.getItem('demo_quotations');
                    if (saved) {
                      let allQtns = JSON.parse(saved);
                      const index = allQtns.findIndex((q: any) => q.id === id);
                      if (index !== -1) {
                        allQtns[index] = {
                          ...allQtns[index],
                          client: quotation.client,
                          project: quotation.project,
                          amount: quotation.amount,
                          validTill: quotation.validTill,
                          owner: quotation.owner,
                          discount: quotation.discount
                        };
                        localStorage.setItem('demo_quotations', JSON.stringify(allQtns));
                      }
                    }
                  }
                  toast.success('Changes saved successfully');
                }
                setIsEditing(!isEditing);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors flex items-center gap-2 ${
                isEditing 
                  ? 'bg-[#792359] hover:bg-[#52173c] text-white shadow-sm' 
                  : 'bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {isEditing ? 'Save Changes' : <><Edit size={16} /> Edit</>}
            </button>
          )}
          <button className="bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm flex items-center gap-2">
            <Download size={16} /> Download PDF
          </button>
          <button className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 p-2 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 text-sm font-medium">
            More <ChevronRight size={16} className="rotate-90" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm overflow-hidden">
        {/* Stepper */}
        <div className="p-8 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="relative flex justify-between">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 dark:bg-white/10 -translate-y-1/2 z-0"></div>
            
            {/* Progress Line */}
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-[#792359] dark:bg-[#e6a8d0] -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
            ></div>

            {stages.map((stage) => {
              const isActive = stage.id === currentStage;
              const isPast = stage.id < currentStage;
              const isConverted = stage.id === 6 && currentStage === 6;

              return (
                <div key={stage.id} className="relative z-10 flex flex-col items-center gap-3 bg-gray-50/50 dark:bg-transparent px-2">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 border-2
                      ${isPast || isActive 
                        ? 'bg-[#792359] border-[#792359] text-white' 
                        : 'bg-white dark:bg-[#181a1f] border-gray-300 dark:border-gray-600 text-gray-400'
                      }
                      ${isConverted ? 'bg-emerald-500 border-emerald-500 text-white' : ''}
                    `}
                  >
                    {(isPast || isConverted) ? <CheckCircle2 size={16} /> : stage.id}
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wider
                    ${isActive 
                      ? 'text-[#792359] dark:text-[#e6a8d0]' 
                      : isPast || isConverted 
                        ? 'text-gray-900 dark:text-gray-300' 
                        : 'text-gray-400'
                    }
                  `}>
                    {stage.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Banner */}
        <div className="p-6 border-b border-gray-200 dark:border-white/5">
          {renderBanner()}
        </div>

        {/* Content Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column (Overview) */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Quotation Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Client</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={quotation.client} 
                      onChange={(e) => setQuotation({...quotation, client: e.target.value})} 
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#792359]" 
                      placeholder="Enter Client Name"
                    />
                  ) : (
                    <p className="text-sm font-bold text-[#792359] dark:text-[#e6a8d0]">{quotation.client}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Project / Opportunity</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={quotation.project} 
                      onChange={(e) => setQuotation({...quotation, project: e.target.value})} 
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#792359]" 
                      placeholder="Enter Project Name"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{quotation.project}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Quotation Value</p>
                  {isEditing ? (
                    <input 
                      type="number" 
                      value={quotation.amount} 
                      onChange={(e) => setQuotation({...quotation, amount: e.target.value})} 
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#792359]" 
                      placeholder="e.g. 100000"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {quotation.amount ? `${quotation.currency === 'INR' ? '₹' : quotation.currency === 'USD' ? '$' : quotation.currency === 'EUR' ? '€' : '£'} ${Number(quotation.amount).toLocaleString('en-IN')}` : ''}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Valid Till</p>
                  {isEditing ? (
                    <input 
                      type="date" 
                      value={quotation.validTill} 
                      onChange={(e) => setQuotation({...quotation, validTill: e.target.value})} 
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#792359]" 
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(quotation.validTill)}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Owner</p>
                  {isEditing ? (
                    <CustomSelect 
                      value={quotation.owner} 
                      onChange={(val) => setQuotation({...quotation, owner: val})}
                      options={[
                        { label: 'Arjun Dev', value: 'Arjun Dev' },
                        { label: 'Sneha Iyer', value: 'Sneha Iyer' },
                        { label: 'Rohit Singh', value: 'Rohit Singh' },
                        { label: 'Anita Desai', value: 'Anita Desai' }
                      ]}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{quotation.owner}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Created On</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{quotation.createdOn}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{quotation.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Currency</p>
                  {isEditing ? (
                    <CustomSelect 
                      value={quotation.currency} 
                      onChange={(val) => setQuotation({...quotation, currency: val})}
                      options={[
                        { label: 'INR', value: 'INR' },
                        { label: 'USD', value: 'USD' },
                        { label: 'EUR', value: 'EUR' },
                        { label: 'GBP', value: 'GBP' }
                      ]}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{quotation.currency}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-gray-200 dark:border-white/10 mb-6">
                {['Products & Services', 'Commercials', 'Terms & Conditions', 'Attachments', 'History'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab 
                        ? 'border-[#792359] text-[#792359] dark:border-[#e6a8d0] dark:text-[#e6a8d0]' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'Products & Services' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-gray-200 dark:border-white/10 rounded-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
                          <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">#</th>
                          <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Product / Service</th>
                          <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Category</th>
                          <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                          <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-right">Rate (₹)</th>
                          <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">GST %</th>
                          <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                        {lineItems.map((item, idx) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-xs text-gray-500">{idx + 1}</td>
                            <td className="px-4 py-3 text-xs font-medium text-gray-900 dark:text-white">{item.name}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">{item.category}</td>
                            <td className="px-4 py-3 text-xs text-gray-900 dark:text-white">{item.qty}</td>
                            <td className="px-4 py-3 text-xs text-gray-900 dark:text-white text-right">{item.rate.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3 text-xs text-gray-900 dark:text-white">{item.gst}%</td>
                            <td className="px-4 py-3 text-xs text-gray-900 dark:text-white text-right">{item.amount.toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-start">
                    {isEditing || currentStage === 1 ? (
                      <button 
                        onClick={() => setIsProductModalOpen(true)}
                        className="flex items-center gap-2 text-sm text-[#792359] dark:text-[#e6a8d0] font-medium border border-[#792359]/20 px-3 py-1.5 rounded-sm hover:bg-[#792359]/5 transition-colors"
                      >
                        <Plus size={16} /> Add Item
                      </button>
                    ) : (
                      <div></div>
                    )}

                    <div className="w-64 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Sub Total</span>
                        <span className="font-medium text-gray-900 dark:text-white">{subTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">GST (18%)</span>
                        <span className="font-medium text-gray-900 dark:text-white">{totalGst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-500">Discount</span>
                        {isEditing ? (
                          <input 
                            type="number"
                            value={quotation.discount}
                            onChange={(e) => setQuotation({...quotation, discount: Number(e.target.value)})}
                            className="w-24 px-2 py-1 text-right text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#792359]"
                            min="0"
                          />
                        ) : (
                          <span className="font-medium text-gray-900 dark:text-white text-red-500">-{Number(quotation.discount || 0).toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <div className="border-t border-gray-200 dark:border-white/10 pt-2 flex justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">Grand Total</span>
                        <span className="font-bold text-[#792359] dark:text-[#e6a8d0]">₹ {grandTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab !== 'Products & Services' && (
                <div className="py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-sm border-dashed">
                  <FileText size={32} className="mb-3 opacity-50" />
                  <p className="text-sm">Information for {activeTab} will be displayed here.</p>
                </div>
              )}
            </div>

            {/* Communication & Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 dark:border-white/5 pt-6 mt-8">
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-3">Client Communication</h4>
                {currentStage === 1 ? (
                  <div className="text-sm text-gray-500 py-4 text-center border border-gray-100 dark:border-white/5 rounded-sm bg-gray-50 dark:bg-transparent">
                    No communication yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <Send size={14} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">Quotation sent for approval</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">10 May 2025, 11:05 AM</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Sent to Rohit Singh (Sales Manager)</p>
                      </div>
                    </div>
                    {currentStage >= 3 && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#792359]/10 flex items-center justify-center shrink-0">
                          <Send size={14} className="text-[#792359] dark:text-[#e6a8d0]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">Quotation sent to client</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">12 May 2025, 04:30 PM</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">Sent to raj.mehta@technova.com</p>
                        </div>
                      </div>
                    )}
                    {currentStage >= 4 && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                          <MessageSquare size={14} className="text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">Client requested changes</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">16 May 2025, 11:00 AM</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">Reduce training cost and extend support</p>
                        </div>
                      </div>
                    )}
                    {currentStage >= 5 && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">Client accepted the quotation</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">18 May 2025, 11:30 AM</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">Thanks, we are happy with the proposal.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-4 relative">
                  <input type="text" placeholder="Add communication note..." className="w-full pl-3 pr-10 py-2 border border-gray-200 dark:border-white/10 rounded-sm text-sm bg-gray-50 dark:bg-[#0f1115]" />
                  <button 
                    onClick={() => toast.success('Note added successfully')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#792359] transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-3">Notes</h4>
                <div className="p-3 border border-gray-200 dark:border-white/10 rounded-sm bg-yellow-50/50 dark:bg-yellow-500/5 min-h-[120px] text-sm text-gray-700 dark:text-gray-300">
                  {currentStage >= 4 ? (
                    "Client wants 10% discount on training and support extended to 6 months. Preparing revised quotation."
                  ) : currentStage >= 6 ? (
                    "Project and finance record created automatically."
                  ) : (
                    <span className="text-gray-400 italic">Add internal notes here...</span>
                  )}
                </div>
                <div className="mt-2 flex justify-end">
                  <button className="text-xs text-gray-500 hover:text-[#792359] dark:hover:text-[#e6a8d0] flex items-center gap-1 font-medium transition-colors">
                    <Edit size={12} /> Edit Notes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Status & Revision) */}
          <div className="space-y-6">
            <div className="bg-gray-50/50 dark:bg-white/[0.02] p-5 rounded-sm border border-gray-200 dark:border-white/5">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Status Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-semibold border ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status Since</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentStage === 1 ? '09 May 2025' : 
                     currentStage === 2 ? '10 May 2025' : 
                     currentStage === 3 ? '12 May 2025' :
                     currentStage === 4 ? '16 May 2025' :
                     currentStage === 5 ? '18 May 2025' : '19 May 2025'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next Step</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentStage === 1 ? 'Send for approval' : 
                     currentStage === 2 ? 'Awaiting approval' : 
                     currentStage === 3 ? 'Awaiting client response' :
                     currentStage === 4 ? 'Share revised quotation' :
                     currentStage === 5 ? 'Upload WO / PO' : 'Project & Finance created'}
                  </p>
                </div>
              </div>
            </div>

            {currentStage >= 4 && (
              <div className="bg-gray-50/50 dark:bg-white/[0.02] p-5 rounded-sm border border-gray-200 dark:border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Revision History</h3>
                  <button className="text-xs text-[#792359] dark:text-[#e6a8d0] font-medium hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Version 2.0</p>
                      <p className="text-[10px] text-gray-500">16 May 2025</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold border ${currentStage >= 5 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                      {currentStage >= 5 ? 'Accepted' : 'Under Negotiation'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Version 1.0</p>
                      <p className="text-[10px] text-gray-500">12 May 2025</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold border bg-blue-50 text-blue-700 border-blue-200">
                      Sent to Client
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Version 0.1</p>
                      <p className="text-[10px] text-gray-500">09 May 2025</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold border bg-gray-100 text-gray-700 border-gray-200">
                      Draft
                    </span>
                  </div>
                </div>
              </div>
            )}

            {currentStage >= 4 && (
              <div className="bg-gray-50/50 dark:bg-white/[0.02] p-5 rounded-sm border border-gray-200 dark:border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Related Documents</h3>
                  <button className="text-xs text-[#792359] dark:text-[#e6a8d0] font-medium hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs group cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-red-500" />
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#792359] transition-colors">QTN-100245_v2.pdf</span>
                    </div>
                    <span className="text-gray-400">125 KB</span>
                  </div>
                  <div className="flex items-center justify-between text-xs group cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-red-500" />
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#792359] transition-colors">QTN-100245_v1.pdf</span>
                    </div>
                    <span className="text-gray-400">120 KB</span>
                  </div>
                  {currentStage >= 6 && (
                    <div className="flex items-center justify-between text-xs group cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#792359] transition-colors">Acceptance Mail.pdf</span>
                      </div>
                      <span className="text-gray-400">76 KB</span>
                    </div>
                  )}
                  {currentStage >= 6 && (
                    <div className="flex items-center justify-between text-xs mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">Project Created</span>
                      </div>
                      <span className="font-semibold text-[#792359] dark:text-[#e6a8d0]">PRJ-100245</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Product Selection Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181a1f] w-full max-w-2xl rounded-sm shadow-xl flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Product / Service</h2>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="space-y-3">
                {availableProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-white/10 rounded-sm hover:border-[#792359]/50 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category} • Rate: ₹ {product.rate.toLocaleString('en-IN')} (GST: {product.gst}%)</p>
                    </div>
                    <button 
                      onClick={() => {
                        setLineItems([...lineItems, { ...product, id: Math.random().toString(36).substr(2, 9), qty: 1, amount: product.rate }]);
                        setIsProductModalOpen(false);
                        toast.success('Product added successfully');
                      }}
                      className="bg-[#792359] text-white px-3 py-1.5 text-xs font-medium rounded-sm hover:bg-[#52173c] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
