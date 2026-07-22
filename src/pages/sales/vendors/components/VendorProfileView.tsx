import { useState, useEffect } from 'react';
import { 
  X, Edit, Building, MapPin, Activity, FileText, 
  MessageSquare, TrendingUp, CreditCard, User, Settings, Cpu, Mail, Phone
} from 'lucide-react';
import type { Vendor } from '../../../../types/vendor.types';
import { VendorService } from '../../../../services/vendor.service';
import { POService } from '../../../../services/po.service';
import { ChallanService } from '../../../../services/challan.service';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  vendor: Vendor;
  onClose: () => void;
  onEdit: () => void;
}

export default function VendorProfileView({ vendor: initialVendor, onClose, onEdit }: Props) {
  const navigate = useNavigate();
  const { selectedCompanyId } = useAuth();
  const [vendor, setVendor] = useState<Vendor>(initialVendor);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'comments'>('overview');
  
  // Transaction states
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [challans, setChallans] = useState<any[]>([]);

  // Local comments state
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  // Fetch complete vendor details
  useEffect(() => {
    if (initialVendor.id) {
      VendorService.getVendor(initialVendor.id)
        .then(data => setVendor(data))
        .catch(console.error);
    }
  }, [initialVendor.id]);

  // Fetch POs & Challans for the vendor
  useEffect(() => {
    if (!selectedCompanyId || !vendor.id) return;
    
    Promise.all([
      POService.getAll(selectedCompanyId).catch(() => []),
      ChallanService.getAll(selectedCompanyId).catch(() => [])
    ]).then(([pos, chals]) => {
      const filteredPOs = pos.filter(po => po.vendorId === vendor.id || po.vendorName === vendor.displayName);
      const filteredChallans = chals.filter(c => c.vendorId === vendor.id || c.vendorName === vendor.displayName);
      
      setPurchaseOrders(filteredPOs);
      setChallans(filteredChallans);
    }).catch(console.error);
  }, [selectedCompanyId, vendor.id, vendor.displayName]);

  // Load comments
  useEffect(() => {
    if (vendor.id) {
      const stored = localStorage.getItem(`comments_vendor_${vendor.id}`);
      if (stored) {
        setComments(JSON.parse(stored));
      } else {
        setComments(["Vendor successfully integrated into ProjectIQ supply chain.", "Verified billing and bank details."]);
      }
    }
  }, [vendor.id]);

  const handleAddComment = () => {
    if (!newComment.trim() || !vendor.id) return;
    const updated = [newComment.trim(), ...comments];
    setComments(updated);
    localStorage.setItem(`comments_vendor_${vendor.id}`, JSON.stringify(updated));
    setNewComment('');
  };

  // Finance calculations
  const totalPOsAmount = purchaseOrders.reduce((sum, po) => sum + (po.grandTotal || 0), 0);
  const totalChallansAmount = challans.reduce((sum, c) => sum + (c.grandTotal || 0), 0);
  
  // Outstanding payables (POs that are Ordered or Partially Received)
  const outstandingPayables = purchaseOrders
    .filter(po => po.status === 'Ordered' || po.status === 'Partially Received')
    .reduce((sum, po) => sum + (po.grandTotal || 0), 0);

  // SVG Chart: Expense History (Last 6 Months representation)
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const barHeights = [35, 60, 45, 80, 50, 90];

  return (
    <div className="w-full bg-[#fafbfd] dark:bg-[#0f1115] rounded-2xl shadow-xl border border-gray-200/80 dark:border-white/5 flex flex-col min-h-[calc(100vh-8rem)] overflow-hidden select-none transition-colors duration-300">
      
      {/* ── 1. Brand Header Banner ── */}
      <div className="px-8 py-6 bg-white dark:bg-[#181a1f] border-b border-gray-200/60 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#792359] to-pink-600 text-white flex items-center justify-center rounded-2xl shadow-md text-3xl font-black shrink-0 animate-pulse-glow">
            {(vendor.companyName || vendor.displayName || 'V').charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              {vendor.companyName || vendor.displayName}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-white/10">
                {vendor.vendorNo || 'No Vendor ID'}
              </span>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#792359]/10 text-[#792359] dark:bg-[#e6a8d0]/10 dark:text-[#e6a8d0] border border-[#792359]/20 dark:border-white/5">
                {vendor.vendorType}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${
                vendor.status === 'Active' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                  : 'bg-red-50 text-red-700 border-red-200/30 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {vendor.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-xs"
          >
            <Edit size={15} className="text-[#792359] dark:text-[#e6a8d0]" /> 
            <span>Edit Profile</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── 2. Navigation Tabs ── */}
      <div className="px-8 bg-white dark:bg-[#181a1f] border-b border-gray-200/60 dark:border-white/5 flex items-center gap-6">
        {[
          { id: 'overview', label: 'Overview', icon: <Activity size={14} /> },
          { id: 'transactions', label: 'Transactions', icon: <FileText size={14} /> },
          { id: 'comments', label: 'Comments Timeline', icon: <MessageSquare size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-4 text-sm font-semibold border-b-2 transition-all relative ${
              activeTab === tab.id 
                ? 'border-[#792359] text-[#792359] dark:border-[#c43890] dark:text-[#e6a8d0] font-bold' 
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── 3. Profile Content Workspace ── */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        
        {/* ── TABS CORE CONTENT: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT PROFILE CARD (33% WIDTH) */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Primary Contact Person Box */}
              <div className="bg-white dark:bg-[#181a1f] border border-gray-200/60 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-3">
                  <User className="text-[#792359] dark:text-[#e6a8d0]" size={18} />
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Primary Contact</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Contact Name</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{vendor.primaryContactPerson || '—'}</span>
                  </div>
                  {vendor.designation && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Designation</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{vendor.designation}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Email Address</span>
                    <a href={`mailto:${vendor.email}`} className="text-sm text-[#792359] dark:text-[#e6a8d0] hover:underline font-semibold flex items-center gap-1.5 mt-0.5">
                      <Mail size={13} />
                      <span className="truncate max-w-[200px]">{vendor.email || '—'}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Phone Number</span>
                    <span className="text-sm text-gray-900 dark:text-white font-bold flex items-center gap-1.5 mt-0.5">
                      <Phone size={13} className="text-gray-400" />
                      <span>{vendor.phone || '—'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank details card if available */}
              {vendor.bankDetails && (
                <div className="bg-white dark:bg-[#181a1f] border border-gray-200/60 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-3">
                    <Cpu className="text-[#792359] dark:text-[#e6a8d0]" size={18} />
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Bank Details</h4>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Bank Name</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{vendor.bankDetails.bankName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Account Name</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{vendor.bankDetails.accountName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Account Number</span>
                      <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">{vendor.bankDetails.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">IFSC Code</span>
                      <span className="text-sm font-mono font-bold text-[#792359] dark:text-[#e6a8d0]">{vendor.bankDetails.ifscCode}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Address card */}
              <div className="bg-white dark:bg-[#181a1f] border border-gray-200/60 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-3">
                  <MapPin className="text-[#792359] dark:text-[#e6a8d0]" size={18} />
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Addresses</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Billing Address</span>
                    <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.01] p-3.5 rounded-xl border border-gray-200/50 dark:border-white/5 leading-relaxed font-medium">
                      {vendor.billingAttention && <div className="font-bold text-gray-800 dark:text-gray-200 mb-1">Attn: {vendor.billingAttention}</div>}
                      <div>
                        {vendor.billingAddressLine1}<br />
                        {vendor.billingAddressLine2 && <>{vendor.billingAddressLine2}<br /></>}
                        {vendor.billingCity}, {vendor.billingState} {vendor.billingPinCode}<br />
                        {vendor.billingCountry || 'India'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Shipping Address</span>
                    {vendor.shippingAddressLine1 ? (
                      <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.01] p-3.5 rounded-xl border border-gray-200/50 dark:border-white/5 leading-relaxed font-medium">
                        {vendor.shippingAttention && <div className="font-bold text-gray-800 dark:text-gray-200 mb-1">Attn: {vendor.shippingAttention}</div>}
                        <div>
                          {vendor.shippingAddressLine1}<br />
                          {vendor.shippingAddressLine2 && <>{vendor.shippingAddressLine2}<br /></>}
                          {vendor.shippingCity}, {vendor.shippingState} {vendor.shippingPinCode}<br />
                          {vendor.shippingCountry || 'India'}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium italic block bg-gray-50/50 dark:bg-white/[0.01] p-3 rounded-lg border border-dashed border-gray-200/80 dark:border-white/5">
                        Same as billing address
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE PANEL (67% WIDTH) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Callout box - What's Next? */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/10 via-pink-600/5 to-transparent border border-purple-200/40 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-purple-900 dark:text-[#e6a8d0] flex items-center gap-1.5 uppercase tracking-wider">
                    <TrendingUp size={16} />
                    <span>Purchase Actions</span>
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 font-medium leading-relaxed">
                    Create purchase orders and record payments to balance the accounts payable with this supplier.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => navigate('/companydashboard/finance/pos')}
                    className="px-4 py-2 bg-gradient-to-r from-[#792359] to-pink-600 hover:opacity-95 text-white text-xs font-semibold rounded-lg shadow-sm transition-all uppercase tracking-wider"
                  >
                    New PO
                  </button>
                </div>
              </div>

              {/* Payables Table Box */}
              <div className="bg-white dark:bg-[#181a1f] border border-gray-200/60 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-[#792359] dark:text-[#e6a8d0]" size={18} />
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Financial Summary</h4>
                  </div>
                  <span className="text-[10px] bg-[#792359]/10 text-[#792359] dark:text-[#e6a8d0] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    Accounts Payable
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-150 dark:border-white/5 text-xs text-gray-450">
                        <th className="py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Currency</th>
                        <th className="py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Outstanding Payables</th>
                        <th className="py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Unused Credits</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-none font-medium">
                        <td className="py-3 text-gray-900 dark:text-white font-bold">INR — Indian Rupee</td>
                        <td className="py-3 text-right text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-500 font-extrabold text-base">
                          ₹{outstandingPayables.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-right text-gray-500 dark:text-gray-400">
                          ₹0.00
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tax & Commercial Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Tax details card */}
                <div className="bg-white dark:bg-[#181a1f] border border-gray-200/60 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-3">
                    <Building className="text-[#792359] dark:text-[#e6a8d0]" size={18} />
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Tax & Compliance</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3.5 text-xs font-medium">
                    <div className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">GST Treatment</div>
                    <div className="text-gray-950 dark:text-gray-200 text-right">
                      {vendor.gstTreatment === 'business_gst' ? 'Registered Business' :
                        vendor.gstTreatment === 'business_none' ? 'Unregistered Business' :
                          vendor.gstTreatment === 'consumer' ? 'Consumer' :
                            vendor.gstTreatment === 'sez' ? 'SEZ' : 'Overseas'}
                    </div>

                    {vendor.gstin && (
                      <>
                        <div className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">GSTIN</div>
                        <div className="text-gray-950 dark:text-gray-200 text-right font-mono font-bold">{vendor.gstin}</div>
                      </>
                    )}
                    {vendor.panNumber && (
                      <>
                        <div className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">PAN Number</div>
                        <div className="text-gray-950 dark:text-gray-200 text-right font-mono font-bold">{vendor.panNumber}</div>
                      </>
                    )}
                    {vendor.placeOfSupply && (
                      <>
                        <div className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Place of Supply</div>
                        <div className="text-gray-950 dark:text-gray-200 text-right">{vendor.placeOfSupply}</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Commercial settings */}
                <div className="bg-white dark:bg-[#181a1f] border border-gray-200/60 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-3">
                    <Settings className="text-[#792359] dark:text-[#e6a8d0]" size={18} />
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Commercial Settings</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3.5 text-xs font-medium">
                    <div className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Payment Terms</div>
                    <div className="text-gray-950 dark:text-gray-200 text-right">{vendor.paymentTerms || 'Due on Receipt'}</div>

                    <div className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Credit Limit</div>
                    <div className="text-gray-950 dark:text-gray-200 text-right font-bold">
                      {vendor.creditLimit ? `₹${vendor.creditLimit.toLocaleString('en-IN')}` : 'No Limit'}
                    </div>

                    <div className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">TDS Percentage</div>
                    <div className="text-gray-950 dark:text-gray-200 text-right">{vendor.tdsPercentage ? `${vendor.tdsPercentage}%` : '0%'}</div>

                    <div className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Reverse Charge</div>
                    <div className="text-gray-950 dark:text-gray-200 text-right font-bold">
                      {vendor.reverseCharge ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                </div>

              </div>

              {/* Monthly expense chart */}
              <div className="bg-white dark:bg-[#181a1f] border border-gray-200/60 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-[#792359] dark:text-[#e6a8d0]" size={18} />
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Purchase Analytics (Last 6 Months)</h4>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">Organization Base Currency</span>
                </div>

                <div className="flex items-end justify-between gap-4 h-36 pt-4 px-2">
                  {months.map((m, idx) => (
                    <div key={m} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-full relative bg-gray-100 dark:bg-white/5 rounded-t-lg overflow-hidden h-28 flex items-end">
                        <div 
                          className="w-full bg-gradient-to-t from-[#792359] to-pink-500 group-hover:from-pink-500 group-hover:to-pink-400 transition-all duration-300 rounded-t-lg"
                          style={{ height: `${barHeights[idx]}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{m}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-white/5">
                  <span>Total Purchase Orders: <strong>{purchaseOrders.length} documents</strong></span>
                  <span>Total Expenses Incurred: <strong>₹{(totalPOsAmount + totalChallansAmount).toLocaleString('en-IN')}</strong></span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ── TABS CORE CONTENT: TRANSACTIONS ── */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            
            {/* Purchase Orders */}
            <div className="bg-white dark:bg-[#181a1f] border border-gray-200/60 dark:border-white/5 rounded-2xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/[0.01] border-b border-gray-150 dark:border-white/5 flex justify-between items-center">
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText size={16} className="text-[#792359]" />
                  <span>Purchase Orders (PO)</span>
                </h4>
                <span className="text-xs font-semibold bg-[#792359]/10 text-[#792359] px-2.5 py-0.5 rounded-full">{purchaseOrders.length} records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 font-bold text-xs uppercase text-gray-500">PO Number</th>
                      <th className="px-6 py-3 font-bold text-xs uppercase text-gray-500">Project</th>
                      <th className="px-6 py-3 font-bold text-xs uppercase text-gray-500">Date</th>
                      <th className="px-6 py-3 font-bold text-xs text-right uppercase text-gray-500">Amount (₹)</th>
                      <th className="px-6 py-3 font-bold text-xs uppercase text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrders.map(po => (
                      <tr 
                        key={po.id} 
                        onClick={() => navigate(`/companydashboard/finance/pos`)}
                        className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all cursor-pointer group"
                      >
                        <td className="px-6 py-4 font-semibold text-[#792359] dark:text-[#e6a8d0] group-hover:underline">
                          {po.poNumber}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                          {po.projectName || '—'}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                          {new Date(po.poDate).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-950 dark:text-gray-100">
                          {po.grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            po.status === 'Completed' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                            po.status === 'Ordered' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            {po.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {purchaseOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">No purchase orders logged for this supplier.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delivery Challans */}
            <div className="bg-white dark:bg-[#181a1f] border border-gray-200/60 dark:border-white/5 rounded-2xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/[0.01] border-b border-gray-150 dark:border-white/5 flex justify-between items-center">
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity size={16} className="text-pink-600" />
                  <span>Delivery Challans (DC)</span>
                </h4>
                <span className="text-xs font-semibold bg-pink-100 text-pink-600 dark:bg-pink-500/10 px-2.5 py-0.5 rounded-full">{challans.length} records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 font-bold text-xs uppercase text-gray-500">Challan No</th>
                      <th className="px-6 py-3 font-bold text-xs uppercase text-gray-500">Date</th>
                      <th className="px-6 py-3 font-bold text-xs uppercase text-gray-500">Project</th>
                      <th className="px-6 py-3 font-bold text-xs uppercase text-gray-500">E-way Bill No</th>
                      <th className="px-6 py-3 font-bold text-xs uppercase text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {challans.map(c => (
                      <tr 
                        key={c.id} 
                        onClick={() => navigate(`/companydashboard/finance/challans`)}
                        className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all cursor-pointer group"
                      >
                        <td className="px-6 py-4 font-semibold text-[#792359] dark:text-[#e6a8d0] group-hover:underline">
                          {c.challanNumber}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                          {new Date(c.challanDate).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                          {c.projectName || '—'}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium font-mono">
                          {c.ewayBillNo || '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            c.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            c.status === 'Dispatched' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            {c.status || 'Draft'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {challans.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">No delivery challans logged for this supplier.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ── TABS CORE CONTENT: COMMENTS ── */}
        {activeTab === 'comments' && (
          <div className="bg-white dark:bg-[#181a1f] border border-gray-200/60 dark:border-white/5 rounded-2xl p-8 shadow-xs max-w-3xl mx-auto space-y-6">
            <h4 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/5 pb-3 flex items-center gap-2">
              <MessageSquare size={18} className="text-[#792359]" />
              <span>Notes & Comments Board</span>
            </h4>
            
            {/* Input form */}
            <div className="space-y-3">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Type a new comment or supplier memo..."
                rows={3}
                className="w-full p-4 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white outline-none focus:bg-white dark:focus:bg-[#0f1115] focus:ring-2 focus:ring-[#792359]/20 focus:border-[#792359] transition-all resize-none"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-[#792359] hover:bg-[#52173c] text-white text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors shadow-sm self-end"
              >
                Post Note
              </button>
            </div>

            {/* Comment Timeline */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
              {comments.map((comm, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-gray-50/30 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 text-sm">
                  <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400 flex items-center justify-center font-bold text-xs shrink-0">
                    SA
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 dark:text-gray-200">System Admin</span>
                      <span className="text-[10px] text-gray-400">Just now</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{comm}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
