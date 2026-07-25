import { useState, useEffect } from 'react';
import { 
 X, Edit, MapPin, Activity, FileText, 
 MessageSquare, TrendingUp, CreditCard, User, Settings, Cpu, Mail, Phone, ExternalLink, Plus, Building2
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
 onEdit: (section?: string) => void;
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
 <div className="w-full bg-gray-50 dark:bg-[#0a0a0a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col min-h-[calc(100vh-8rem)] overflow-hidden transition-colors duration-300">
 
 {/* ── 1. Header Section ── */}
 <div className="px-6 py-5 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 bg-[#792359] text-white flex items-center justify-center rounded-lg text-2xl font-bold shrink-0 shadow-sm">
 {(vendor.companyName || vendor.displayName || 'V').charAt(0).toUpperCase()}
 </div>
 <div className="space-y-1">
 <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
 {vendor.companyName || vendor.displayName}
 </h2>
 <div className="flex flex-wrap items-center gap-2">
 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
 {vendor.vendorNo || 'No ID'}
 </span>
 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
 {vendor.vendorType}
 </span>
 <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${
 vendor.status === 'Active' 
 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' 
 : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50'
 }`}>
 <span className={`w-1.5 h-1.5 rounded-full ${vendor.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
 {vendor.status}
 </span>
 </div>
 </div>
 </div>

 {/* Action Controls */}
 <div className="flex items-center gap-3">
 <button
 onClick={() => onEdit()}
 className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
 >
 <Edit size={16} className="text-gray-500" /> 
 <span>Edit Profile</span>
 </button>
 <button
 onClick={onClose}
 className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
 title="Close"
 >
 <X size={20} />
 </button>
 </div>
 </div>

 {/* ── 2. Navigation Tabs ── */}
 <div className="px-6 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 flex items-center gap-8">
 {[
 { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
 { id: 'transactions', label: 'Transactions', icon: <FileText size={16} /> },
 { id: 'comments', label: 'Comments Timeline', icon: <MessageSquare size={16} /> }
 ].map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id as any)}
 className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
 activeTab === tab.id 
 ? 'border-[#792359] text-[#792359] dark:text-[#e6a8d0] dark:border-[#e6a8d0]' 
 : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
 }`}
 >
 {tab.icon}
 {tab.label}
 </button>
 ))}
 </div>

 {/* ── 3. Profile Content Workspace ── */}
 <div className="flex-1 p-6 overflow-y-auto">
 
 {/* ── TABS CORE CONTENT: OVERVIEW ── */}
 {activeTab === 'overview' && (
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* LEFT PROFILE COLUMN */}
 <div className="lg:col-span-1 flex flex-col gap-6">
 
 {/* Primary Contact Person Box */}
 <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
 <div className="flex items-center gap-2 mb-4">
 <User className="text-gray-400" size={18} />
 <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Primary Contact</h4>
 </div>
 <div className="space-y-4">
 <div>
 <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Contact Name</span>
 <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{vendor.primaryContactPerson || '—'}</span>
 </div>
 {vendor.designation && (
 <div>
 <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Designation</span>
 <span className="text-sm text-gray-800 dark:text-gray-300">{vendor.designation}</span>
 </div>
 )}
 <div>
 <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Email Address</span>
 <a href={`mailto:${vendor.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5">
 <Mail size={14} />
 <span className="truncate">{vendor.email || '—'}</span>
 </a>
 </div>
 <div>
 <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Phone Number</span>
 <span className="text-sm text-gray-800 dark:text-gray-300 flex items-center gap-1.5">
 <Phone size={14} className="text-gray-400" />
 <span>{vendor.phone || '—'}</span>
 </span>
 </div>
 </div>
 </div>

 {/* Bank details card */}
 {vendor.bankDetails ? (
 <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
 <div className="flex items-center gap-2 mb-4">
 <Cpu className="text-gray-400" size={18} />
 <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Bank Details</h4>
 </div>
 <div className="space-y-3">
 <div>
 <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Bank Name</span>
 <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{vendor.bankDetails.bankName}</span>
 </div>
 <div>
 <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Account Name</span>
 <span className="text-sm text-gray-800 dark:text-gray-300">{vendor.bankDetails.accountName}</span>
 </div>
 <div>
 <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Account Number</span>
 <span className="text-sm font-mono text-gray-900 dark:text-gray-200">{vendor.bankDetails.accountNumber}</span>
 </div>
 <div>
 <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">IFSC Code</span>
 <span className="text-sm font-mono text-gray-800 dark:text-gray-300">{vendor.bankDetails.ifscCode}</span>
 </div>
 </div>
 </div>
 ) : (
 <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm flex flex-col items-center justify-center text-center space-y-3 py-8">
 <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
 <Cpu className="text-gray-400" size={20} />
 </div>
 <div>
 <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">No Bank Details</h4>
 <p className="text-xs text-gray-500 dark:text-gray-400">Add bank details to process payments.</p>
 </div>
 <button onClick={() => onEdit('bank-details')} className="mt-2 px-4 py-1.5 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md text-xs font-medium transition-colors">
 Add Details
 </button>
 </div>
 )}

 {/* Address card */}
 <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm flex-1 flex flex-col">
 <div className="flex items-center gap-2 mb-4">
 <MapPin className="text-gray-400" size={18} />
 <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Addresses</h4>
 </div>
 
 <div className="space-y-5 flex-1 flex flex-col">
 <div>
 <span className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">Billing Address</span>
 <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-100 dark:border-gray-800">
 {vendor.billingAttention && <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">Attn: {vendor.billingAttention}</div>}
 <div>
 {vendor.billingAddressLine1}<br />
 {vendor.billingAddressLine2 && <>{vendor.billingAddressLine2}<br /></>}
 {vendor.billingCity}, {vendor.billingState} {vendor.billingPinCode}<br />
 {vendor.billingCountry || 'India'}
 </div>
 </div>
 </div>

 <div className="flex-1 flex flex-col">
 <span className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">Shipping Address</span>
 {vendor.shippingAddressLine1 ? (
 <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-100 dark:border-gray-800 flex-1">
 {vendor.shippingAttention && <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">Attn: {vendor.shippingAttention}</div>}
 <div>
 {vendor.shippingAddressLine1}<br />
 {vendor.shippingAddressLine2 && <>{vendor.shippingAddressLine2}<br /></>}
 {vendor.shippingCity}, {vendor.shippingState} {vendor.shippingPinCode}<br />
 {vendor.shippingCountry || 'India'}
 </div>
 </div>
 ) : (
 <span className="text-sm text-gray-500 italic flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-dashed border-gray-200 dark:border-gray-700">
 Same as billing address
 </span>
 )}
 </div>
 </div>
 </div>

 </div>

 {/* RIGHT COLUMN */}
 <div className="lg:col-span-2 flex flex-col gap-6">
 
 {/* Purchase Actions Callout */}
 <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 flex items-center justify-between shadow-sm">
 <div>
 <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Create Purchase Document</h4>
 <p className="text-xs text-gray-500 dark:text-gray-400">Quickly generate a new PO or Challan for this vendor.</p>
 </div>
 <div className="flex items-center gap-3">
 <button onClick={() => navigate('/companydashboard/finance/challans')} className="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium transition-colors shadow-sm">
 New Challan
 </button>
 <button onClick={() => navigate('/companydashboard/finance/pos')} className="px-4 py-1.5 bg-[#792359] hover:bg-[#52173c] text-white rounded-md text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5 focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#1a1a1a]">
 <Plus size={14} /> New PO
 </button>
 </div>
 </div>

 {/* Financial Summary */}
 <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
 <div className="flex items-center gap-2 mb-4">
 <CreditCard className="text-gray-400" size={18} />
 <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Financial Summary</h4>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
 <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Outstanding Payables</span>
 <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{outstandingPayables.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
 </div>
 <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
 <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Unused Credits</span>
 <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹0.00</span>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Tax & Compliance */}
 <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
 <div className="flex items-center gap-2 mb-4">
 <Building2 className="text-gray-400" size={18} />
 <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tax & Compliance</h4>
 </div>
 <div className="space-y-3">
 <div className="flex justify-between items-center">
 <span className="text-xs text-gray-500 dark:text-gray-400">GST Treatment</span>
 <span className="text-sm text-gray-900 dark:text-gray-200 font-medium">
 {vendor.gstTreatment === 'business_gst' ? 'Registered Business' :
 vendor.gstTreatment === 'business_none' ? 'Unregistered Business' :
 vendor.gstTreatment === 'consumer' ? 'Consumer' :
 vendor.gstTreatment === 'sez' ? 'SEZ' : 'Overseas'}
 </span>
 </div>

 {vendor.gstin && (
 <div className="flex justify-between items-center">
 <span className="text-xs text-gray-500 dark:text-gray-400">GSTIN</span>
 <span className="text-sm text-gray-900 dark:text-gray-200 font-mono font-medium">{vendor.gstin}</span>
 </div>
 )}
 {vendor.panNumber && (
 <div className="flex justify-between items-center">
 <span className="text-xs text-gray-500 dark:text-gray-400">PAN Number</span>
 <span className="text-sm text-gray-900 dark:text-gray-200 font-mono font-medium">{vendor.panNumber}</span>
 </div>
 )}
 {vendor.placeOfSupply && (
 <div className="flex justify-between items-center">
 <span className="text-xs text-gray-500 dark:text-gray-400">Place of Supply</span>
 <span className="text-sm text-gray-900 dark:text-gray-200 font-medium">{vendor.placeOfSupply}</span>
 </div>
 )}
 </div>
 </div>

 {/* Commercial settings */}
 {(vendor.paymentTerms || vendor.creditLimit || vendor.tdsPercentage || vendor.reverseCharge) ? (
 <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
 <div className="flex items-center gap-2 mb-4">
 <Settings className="text-gray-400" size={18} />
 <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Commercial Settings</h4>
 </div>
 <div className="space-y-3">
 <div className="flex justify-between items-center">
 <span className="text-xs text-gray-500 dark:text-gray-400">Payment Terms</span>
 <span className="text-sm text-gray-900 dark:text-gray-200 font-medium">{vendor.paymentTerms || 'Due on Receipt'}</span>
 </div>

 <div className="flex justify-between items-center">
 <span className="text-xs text-gray-500 dark:text-gray-400">Credit Limit</span>
 <span className="text-sm text-gray-900 dark:text-gray-200 font-medium">
 {vendor.creditLimit ? `₹${vendor.creditLimit.toLocaleString('en-IN')}` : 'No Limit'}
 </span>
 </div>

 <div className="flex justify-between items-center">
 <span className="text-xs text-gray-500 dark:text-gray-400">TDS Percentage</span>
 <span className="text-sm text-gray-900 dark:text-gray-200 font-medium">{vendor.tdsPercentage ? `${vendor.tdsPercentage}%` : '0%'}</span>
 </div>

 <div className="flex justify-between items-center">
 <span className="text-xs text-gray-500 dark:text-gray-400">Reverse Charge</span>
 <span className="text-sm text-gray-900 dark:text-gray-200 font-medium">
 {vendor.reverseCharge ? 'Enabled' : 'Disabled'}
 </span>
 </div>
 </div>
 </div>
 ) : (
 <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm flex flex-col items-center justify-center text-center space-y-3 py-8">
 <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
 <Settings className="text-gray-400" size={20} />
 </div>
 <div>
 <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">No Commercial Settings</h4>
 <p className="text-xs text-gray-500 dark:text-gray-400">Set credit limits and terms.</p>
 </div>
 <button onClick={() => onEdit()} className="mt-2 px-4 py-1.5 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md text-xs font-medium transition-colors">
 Configure Settings
 </button>
 </div>
 )}
 </div>

 {/* Purchase Analytics Placeholder */}
 <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm flex-1 flex flex-col">
 <div className="flex items-center gap-2 mb-6">
 <TrendingUp className="text-gray-400" size={18} />
 <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Purchase Analytics (Last 6 Months)</h4>
 </div>
 
 {/* Mock Chart Area */}
 <div className="h-48 flex items-end gap-3 px-8 mt-auto relative">
 {/* Y-axis grid lines */}
 <div className="absolute inset-0 px-8 flex flex-col justify-between pointer-events-none pb-6">
 {[3, 2, 1, 0].map(i => (
 <div key={i} className="w-full border-b border-gray-100 dark:border-gray-800/60 border-dashed relative">
 {i > 0 && <span className="absolute -left-6 -top-2 text-[9px] font-medium text-gray-400">{(i * 40)}k</span>}
 </div>
 ))}
 </div>

 {[
 { month: 'Feb', value: 45000, label: '₹45k', pos: 2, height: 40 },
 { month: 'Mar', value: 72000, label: '₹72k', pos: 3, height: 65 },
 { month: 'Apr', value: 50000, label: '₹50k', pos: 1, height: 45 },
 { month: 'May', value: 95000, label: '₹95k', pos: 4, height: 80 },
 { month: 'Jun', value: 60000, label: '₹60k', pos: 2, height: 55 },
 { month: 'Jul', value: 120000, label: '₹1.2L', pos: 5, height: 90 },
 ].map((data, i) => (
 <div key={i} className="h-full flex-1 flex flex-col justify-end group relative z-10 pt-8">
 {/* Tooltip */}
 <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap z-20 shadow-lg flex flex-col items-center">
 <span className="font-bold">{data.label}</span>
 <span className="text-[8px] opacity-80">{data.pos} Orders</span>
 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-white"></div>
 </div>
 
 {/* Bar */}
 <div 
 className="w-full bg-[#792359]/20 dark:bg-[#792359]/30 group-hover:bg-[#792359] rounded-t-md transition-all duration-300 ease-in-out relative overflow-hidden"
 style={{ height: `${data.height}%` }}
 >
 {/* Subtle gradient inside active bar */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100"></div>
 </div>
 <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-center mt-2 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
 {data.month}
 </span>
 </div>
 ))}
 </div>

 <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
 <div className="text-xs text-gray-500 dark:text-gray-400">
 Total Purchase Orders: <span className="font-semibold text-gray-900 dark:text-gray-200">{purchaseOrders.length} documents</span>
 </div>
 <div className="text-xs text-gray-500 dark:text-gray-400">
 Total Expenses Incurred: <span className="font-semibold text-gray-900 dark:text-gray-200">₹{(totalPOsAmount + totalChallansAmount).toLocaleString('en-IN')}</span>
 </div>
 </div>
 </div>
 </div>

 </div>
 )}

 {/* ── TABS CORE CONTENT: TRANSACTIONS ── */}
 {activeTab === 'transactions' && (
 <div className="space-y-6">
 
 {/* Purchase Orders Table */}
 <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
 <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#121212]">
 <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
 <FileText size={16} className="text-gray-500" />
 Purchase Orders
 </h4>
 <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">
 {purchaseOrders.length} records
 </span>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm whitespace-nowrap">
 <thead className="bg-gray-50 dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
 <tr>
 <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">PO Number</th>
 <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
 <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
 <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Amount (₹)</th>
 <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
 {purchaseOrders.map(po => (
 <tr 
 key={po.id} 
 onClick={() => navigate(`/companydashboard/finance/pos`)}
 className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
 >
 <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-2">
 {po.poNumber} <ExternalLink size={14} className="text-gray-400" />
 </td>
 <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
 {po.projectName || '—'}
 </td>
 <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
 {new Date(po.poDate).toLocaleDateString('en-GB')}
 </td>
 <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
 {po.grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
 </td>
 <td className="px-6 py-4">
 <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
 po.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' :
 po.status === 'Ordered' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50' :
 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
 }`}>
 {po.status}
 </span>
 </td>
 </tr>
 ))}
 {purchaseOrders.length === 0 && (
 <tr>
 <td colSpan={5} className="px-6 py-8 text-center text-gray-500 bg-gray-50/50 dark:bg-transparent">
 No purchase orders logged for this vendor.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Delivery Challans Table */}
 <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
 <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#121212]">
 <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
 <Activity size={16} className="text-gray-500" />
 Delivery Challans
 </h4>
 <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">
 {challans.length} records
 </span>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm whitespace-nowrap">
 <thead className="bg-gray-50 dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
 <tr>
 <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Challan No</th>
 <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
 <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
 <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">E-way Bill No</th>
 <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
 {challans.map(c => (
 <tr 
 key={c.id} 
 onClick={() => navigate(`/companydashboard/finance/challans`)}
 className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
 >
 <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-2">
 {c.challanNumber} <ExternalLink size={14} className="text-gray-400" />
 </td>
 <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
 {new Date(c.challanDate).toLocaleDateString('en-GB')}
 </td>
 <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
 {c.projectName || '—'}
 </td>
 <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono text-xs">
 {c.ewayBillNo || '—'}
 </td>
 <td className="px-6 py-4">
 <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
 c.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' :
 c.status === 'Dispatched' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50' :
 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
 }`}>
 {c.status || 'Draft'}
 </span>
 </td>
 </tr>
 ))}
 {challans.length === 0 && (
 <tr>
 <td colSpan={5} className="px-6 py-8 text-center text-gray-500 bg-gray-50/50 dark:bg-transparent">
 No delivery challans logged for this vendor.
 </td>
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
 <div className="max-w-3xl mx-auto space-y-6">
 <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm">
 <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 flex items-center gap-2">
 <MessageSquare size={18} className="text-gray-500" />
 Notes & Comments Timeline
 </h4>
 
 {/* Input form */}
 <div className="space-y-4">
 <textarea
 value={newComment}
 onChange={e => setNewComment(e.target.value)}
 placeholder="Type a new comment or vendor memo..."
 rows={3}
 className="w-full p-3 rounded-lg bg-gray-50 dark:bg-[#121212] border border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#792359]/20 focus:border-[#792359] transition-all resize-y"
 />
 <div className="flex justify-end">
 <button
 onClick={handleAddComment}
 disabled={!newComment.trim()}
 className="px-4 py-2 bg-[#792359] hover:bg-[#611b47] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
 >
 Post Note
 </button>
 </div>
 </div>

 {/* Comment Timeline */}
 <div className="mt-8 space-y-4">
 {comments.map((comm, idx) => (
 <div key={idx} className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-gray-800 text-sm">
 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center font-semibold text-xs shrink-0">
 SA
 </div>
 <div className="space-y-1.5 flex-1">
 <div className="flex justify-between items-center">
 <span className="font-semibold text-gray-900 dark:text-gray-100">System Admin</span>
 <span className="text-xs text-gray-500 dark:text-gray-400">Just now</span>
 </div>
 <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comm}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 </div>
 </div>
 );
}
