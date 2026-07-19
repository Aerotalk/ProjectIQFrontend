import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight, Info,
  CheckCircle2, Send, Truck
} from 'lucide-react';
import toast from 'react-hot-toast';
import CustomSelect from '@/components/ui/CustomSelect';
import { useAuth } from '../../contexts/AuthContext';
import { POService } from '../../services/po.service';
import { VendorService } from '../../services/vendor.service';
import { ProjectService } from '../../services/project.service';
import { api } from '../../lib/api';
import type { POStatus } from '../../types/po.types';
import type { Vendor } from '../../types/vendor.types';
import type { Project } from '../../types/project.types';

export default function PODetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCompanyId: companyId } = useAuth();
  
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const isNew = id === 'new';
  const [isEditing, setIsEditing] = useState(isNew);
  const [currentStage, setCurrentStage] = useState(1);
  const [activeTab, setActiveTab] = useState('Products & Services');

  const stages = [
    { id: 1, name: 'Draft' },
    { id: 2, name: 'Pending Approval' },
    { id: 3, name: 'Approved' },
    { id: 4, name: 'Ordered' },
    { id: 5, name: 'Partially Received' },
    { id: 6, name: 'Completed' },
  ];

  interface LineItem {
    id: string;
    description: string;
    qty: number;
    unit: string;
    unitPrice: number;
    amount: number;
  }

  const [lineItems, setLineItems] = useState<LineItem[]>(isNew ? [{
    id: '1', description: '', qty: 1, unit: 'PCS', unitPrice: 0, amount: 0
  }] : []);

  const [po, setPo] = useState({
    poNumber: isNew ? 'Unassigned' : '',
    vendorId: '',
    vendorName: '',
    projectId: '',
    projectName: '',
    poDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    description: '',
    discount: 0,
    grandTotal: 0,
    status: 'Draft' as POStatus,
    internalNotes: ''
  });

  useEffect(() => {
    if (companyId) {
      VendorService.getVendors(companyId).then(setVendors).catch(console.error);
      ProjectService.getAll(companyId).then((data: any) => {
        const pData = Array.isArray(data) ? data : (data?.data || data?.content || []);
        setProjects(pData);
      }).catch(console.error);
    }
  }, [companyId]);

  const getStageFromStatus = (status: POStatus) => {
    switch (status) {
      case 'Draft': return 1;
      case 'Pending Approval': return 2;
      case 'Approved': return 3;
      case 'Ordered': return 4;
      case 'Partially Received': return 5;
      case 'Completed': return 6;
      case 'Cancelled': return 1; // Fallback
      default: return 1;
    }
  };

  const handleStatusUpdate = async (newStatus: POStatus, successMessage: string, newStage: number) => {
    if (!id || isNew) return;
    setIsApiLoading(true);
    try {
      await api.put(`/admin/finance/purchase-orders/${id}/status`, { status: newStatus }).catch(() => {});
      setCurrentStage(newStage);
      setPo(prev => ({ ...prev, status: newStatus }));
      toast.success(successMessage);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update PO status');
    } finally {
      setIsApiLoading(false);
    }
  };

  useEffect(() => {
    if (!isNew && id && companyId) {
      setIsApiLoading(true);
      POService.getAll(companyId)
        .then((data: any) => {
          const safeData = Array.isArray(data) ? data : (data?.data || data?.content || []);
          const foundPo = safeData.find((p: any) => p.id === id || p.poNumber === id);
          if (foundPo) {
            setCurrentStage(getStageFromStatus(foundPo.status));
            setPo({
              poNumber: foundPo.poNumber || foundPo.id,
              vendorId: foundPo.vendorId || '',
              vendorName: foundPo.vendorName || '',
              projectId: foundPo.projectId || '',
              projectName: foundPo.projectName || '',
              poDate: foundPo.poDate ? foundPo.poDate.split('T')[0] : '',
              expectedDelivery: foundPo.expectedDelivery ? foundPo.expectedDelivery.split('T')[0] : '',
              description: foundPo.description || '',
              discount: foundPo.discountPercentage || 0,
              grandTotal: foundPo.grandTotal || 0,
              status: foundPo.status || 'Draft',
              internalNotes: foundPo.internalNotes || ''
            });
            if (foundPo.lineItems) {
              setLineItems(foundPo.lineItems.map((item: any) => ({
                id: Math.random().toString(),
                description: item.description,
                qty: item.quantity,
                unit: item.unit,
                unitPrice: item.unitPrice,
                amount: item.totalAmount
              })));
            }
          }
        })
        .catch(console.error)
        .finally(() => setIsApiLoading(false));
    }
  }, [id, isNew, companyId]);

  const subTotal = lineItems.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
  const calculatedGrandTotal = subTotal - (subTotal * (Number(po.discount) / 100));

  const renderBanner = () => {
    switch (currentStage) {
      case 1:
        return (
          <div className="bg-[#fff9ea] dark:bg-yellow-500/10 border border-[#fde9a4] dark:border-yellow-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="text-yellow-600 dark:text-yellow-500" size={20} />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {isNew ? 'Create a new Purchase Order.' : 'Draft PO. Send for internal approval when ready.'}
              </p>
            </div>
            {isNew ? (
              <button
                disabled={isApiLoading}
                onClick={async () => {
                  if (!po.vendorId || !po.projectId || lineItems.length === 0) {
                    toast.error('Please fill required fields');
                    return;
                  }
                  setIsApiLoading(true);
                  try {
                    const payload = {
                      ...po,
                      companyId: companyId,
                      lineItems: lineItems.map(item => ({
                        description: item.description,
                        quantity: item.qty,
                        unit: item.unit,
                        unitPrice: item.unitPrice,
                        totalAmount: item.unitPrice * item.qty
                      })),
                      grandTotal: calculatedGrandTotal
                    };
                    await POService.create(companyId!, payload as any);
                    toast.success('PO saved successfully');
                    navigate('/companydashboard/finance/pos');
                  } catch (err: any) {
                    toast.error(err?.message || 'Failed to save PO');
                  } finally {
                    setIsApiLoading(false);
                  }
                }}
                className="bg-[#792359] text-white px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-[#52173c] transition-colors"
              >
                Save Draft
              </button>
            ) : (
              <button
                disabled={isApiLoading}
                onClick={() => handleStatusUpdate('Pending Approval', 'Sent for approval', 2)}
                className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Send for Approval
              </button>
            )}
          </div>
        );
      case 2:
        return (
          <div className="bg-[#fff9ea] dark:bg-yellow-500/10 border border-[#fde9a4] dark:border-yellow-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="text-yellow-600 dark:text-yellow-500" size={20} />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">PO is pending internal approval.</p>
            </div>
            <div className="flex gap-2">
              <button
                disabled={isApiLoading}
                onClick={() => handleStatusUpdate('Draft', 'PO Rejected', 1)}
                className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
              <button
                disabled={isApiLoading}
                onClick={() => handleStatusUpdate('Approved', 'PO Approved', 3)}
                className="bg-[#792359] text-white px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-[#52173c] transition-colors disabled:opacity-50"
              >
                Approve
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Send className="text-blue-600 dark:text-blue-400" size={20} />
              <p className="text-sm text-blue-800 dark:text-blue-200">PO is approved. Ready to be sent to the vendor.</p>
            </div>
            <button
              disabled={isApiLoading}
              onClick={() => handleStatusUpdate('Ordered', 'Marked as Ordered', 4)}
              className="bg-[#792359] text-white px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-[#52173c] transition-colors disabled:opacity-50"
            >
              Mark as Ordered
            </button>
          </div>
        );
      case 4:
        return (
          <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="text-purple-600 dark:text-purple-400" size={20} />
              <p className="text-sm text-purple-800 dark:text-purple-200">PO ordered. Waiting for delivery.</p>
            </div>
            <div className="flex gap-2">
              <button
                disabled={isApiLoading}
                onClick={() => handleStatusUpdate('Partially Received', 'Marked Partially Received', 5)}
                className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Partial Delivery
              </button>
              <button
                disabled={isApiLoading}
                onClick={() => handleStatusUpdate('Completed', 'PO Completed', 6)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-sm font-medium rounded-sm transition-colors disabled:opacity-50"
              >
                Mark Full Delivery
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="text-purple-600 dark:text-purple-400" size={20} />
              <p className="text-sm text-purple-800 dark:text-purple-200">Partially received. Waiting for remaining items.</p>
            </div>
            <button
              disabled={isApiLoading}
              onClick={() => handleStatusUpdate('Completed', 'PO Completed', 6)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-sm font-medium rounded-sm transition-colors disabled:opacity-50"
            >
              Mark Full Delivery
            </button>
          </div>
        );
      case 6:
        return (
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600 dark:text-emerald-500" size={20} />
              <p className="text-sm text-emerald-800 dark:text-emerald-200">PO is complete and fully received.</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const getStatusColor = () => {
    switch (currentStage) {
      case 1: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-gray-300 dark:border-white/10';
      case 2: return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20';
      case 3: return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      case 4: 
      case 5: return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
      case 6: return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      default: return '';
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Link to="/companydashboard/finance" className="hover:text-[#792359] dark:hover:text-[#e6a8d0]">Finance</Link>
            <ChevronRight size={14} />
            <Link to="/companydashboard/finance/pos" className="hover:text-[#792359] dark:hover:text-[#e6a8d0]">Purchase Orders</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 dark:text-white font-medium">{isNew ? 'New PO' : po.poNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{isNew ? 'Create PO' : 'PO Details'}</h1>
            {!isNew && (
              <span className={`px-2.5 py-0.5 rounded-sm text-xs font-semibold border ${getStatusColor()}`}>
                {po.status}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && currentStage === 1 && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium rounded-sm transition-colors bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              {isEditing ? 'Cancel Edit' : 'Edit PO'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm overflow-hidden">
        {/* Stepper */}
        <div className="p-8 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="relative flex justify-between">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 dark:bg-white/10 -translate-y-1/2 z-0"></div>
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
                      ${isPast || isActive ? 'bg-[#792359] border-[#792359] text-white' : 'bg-white dark:bg-[#181a1f] border-gray-300 dark:border-gray-600 text-gray-400'}
                      ${isConverted ? 'bg-emerald-500 border-emerald-500 text-white' : ''}
                    `}
                  >
                    {(isPast || isConverted) ? <CheckCircle2 size={16} /> : stage.id}
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wider
                    ${isActive ? 'text-[#792359] dark:text-[#e6a8d0]' : isPast || isConverted ? 'text-gray-900 dark:text-gray-300' : 'text-gray-400'}
                  `}>
                    {stage.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-white/5">
          {renderBanner()}
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">PO Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vendor</p>
                  {isEditing ? (
                    <CustomSelect
                      value={po.vendorId}
                      onChange={(val) => {
                        const vendor = vendors.find(v => v.id === val);
                        setPo({ ...po, vendorId: val, vendorName: vendor?.displayName || '' });
                      }}
                      options={[{label: 'Select Vendor', value: ''}, ...vendors.map(v => ({ label: v.displayName || v.companyName || '', value: v.id }))]}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{po.vendorName}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Project</p>
                  {isEditing ? (
                    <CustomSelect
                      value={po.projectId}
                      onChange={(val) => {
                        const proj = projects.find(p => p.id === val);
                        setPo({ ...po, projectId: val, projectName: proj?.projectName || '' });
                      }}
                      options={[{label: 'Select Project', value: ''}, ...projects.map(p => ({ label: p.projectName, value: p.id }))]}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{po.projectName}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                  {isEditing ? (
                    <input type="date" value={po.poDate} onChange={e => setPo({...po, poDate: e.target.value})} className="w-full px-2 py-1 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm" />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{po.poDate}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                  <p className="text-sm font-bold text-[#792359] dark:text-[#e6a8d0]">₹ {isEditing ? calculatedGrandTotal.toLocaleString('en-IN') : (po.grandTotal || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex border-b border-gray-200 dark:border-white/10 mb-6">
                {['Products & Services', 'Commercials', 'History'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-[#792359] text-[#792359]' : 'border-transparent text-gray-500'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'Products & Services' && (
                <div className="space-y-4">
                  {lineItems.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-gray-50 dark:bg-white/5 p-4 rounded-sm border border-gray-200 dark:border-white/10">
                      <div className="col-span-5">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Item Description</p>
                        {isEditing ? (
                          <input type="text" value={item.description} onChange={e => {
                            const newItems = [...lineItems];
                            newItems[idx].description = e.target.value;
                            setLineItems(newItems);
                          }} className="w-full px-2 py-1 text-sm bg-white border rounded-sm dark:bg-[#0f1115] dark:border-white/10" />
                        ) : (
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.description}</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Qty</p>
                        {isEditing ? (
                          <input type="number" value={item.qty} onChange={e => {
                            const newItems = [...lineItems];
                            newItems[idx].qty = Number(e.target.value);
                            setLineItems(newItems);
                          }} className="w-full px-2 py-1 text-sm bg-white border rounded-sm dark:bg-[#0f1115] dark:border-white/10" />
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-white">{item.qty}</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</p>
                        {isEditing ? (
                          <input type="number" value={item.unitPrice} onChange={e => {
                            const newItems = [...lineItems];
                            newItems[idx].unitPrice = Number(e.target.value);
                            setLineItems(newItems);
                          }} className="w-full px-2 py-1 text-sm bg-white border rounded-sm dark:bg-[#0f1115] dark:border-white/10" />
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-white">₹ {item.unitPrice}</p>
                        )}
                      </div>
                      <div className="col-span-3 text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">₹ {(item.qty * item.unitPrice).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                  {isEditing && (
                    <button onClick={() => setLineItems([...lineItems, { id: Math.random().toString(), description: '', qty: 1, unit: 'PCS', unitPrice: 0, amount: 0 }])} className="text-[#792359] text-sm font-medium hover:underline">+ Add Item</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
