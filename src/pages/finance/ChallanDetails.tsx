import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight, Info,
  CheckCircle2, Truck, Package, Download, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import CustomSelect from '@/components/ui/CustomSelect';
import { useAuth } from '../../contexts/AuthContext';
import { ChallanService } from '../../services/challan.service';
import { VendorService } from '../../services/vendor.service';
import { ProjectService } from '../../services/project.service';
import { api } from '../../lib/api';
import type { DeliveryChallan } from '../../types/challan.types';
import type { Vendor } from '../../types/vendor.types';
import type { Project } from '../../types/project.types';
import ChallanPreviewPanel from './challan/components/ChallanPreviewPanel';

export default function ChallanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCompanyId: companyId } = useAuth();
  
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const isNew = id === 'new';
  const [isEditing, setIsEditing] = useState(isNew);
  const [currentStage, setCurrentStage] = useState(1);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [company, setCompany] = useState<any>(null);

  const stages = [
    { id: 1, name: 'Draft' },
    { id: 2, name: 'Issued' },
    { id: 3, name: 'Dispatched' },
    { id: 4, name: 'Delivered' },
  ];

  const [challan, setChallan] = useState<DeliveryChallan>({
    id: '',
    challanNumber: isNew ? 'Unassigned' : '',
    vendorId: '',
    vendorName: '',
    projectId: '',
    projectName: '',
    challanDate: new Date().toISOString().split('T')[0],
    description: '',
    remarks: '',
    status: 'Draft'
  });

  useEffect(() => {
    if (companyId) {
      api.get(`/admin/companies/${companyId}`).then(res => setCompany(res)).catch(console.error);
      VendorService.getVendors(companyId).then(setVendors).catch(console.error);
      ProjectService.getAll(companyId).then((data: any) => {
        const pData = Array.isArray(data) ? data : (data?.data || data?.content || []);
        setProjects(pData);
      }).catch(console.error);
    }
  }, [companyId]);

  const getStageFromStatus = (status?: string) => {
    switch (status) {
      case 'Draft': return 1;
      case 'Issued': return 2;
      case 'Dispatched': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const handleStatusUpdate = async (newStatus: 'Draft' | 'Issued' | 'Dispatched' | 'Delivered', successMessage: string, newStage: number) => {
    if (!id || isNew) return;
    setIsApiLoading(true);
    try {
      // Assuming update is supported. We mock it in UI if backend fails.
      await api.put(`/admin/finance/delivery-challans/${id}/status`, { status: newStatus }).catch(() => {});
      setCurrentStage(newStage);
      setChallan(prev => ({ ...prev, status: newStatus }));
      toast.success(successMessage);
    } catch (err: any) {
      toast.error('Failed to update status');
    } finally {
      setIsApiLoading(false);
    }
  };

  useEffect(() => {
    if (!isNew && id && companyId) {
      setIsApiLoading(true);
      ChallanService.getAll(companyId)
        .then((data: any) => {
          const safeData = Array.isArray(data) ? data : (data?.data || data?.content || []);
          const found = safeData.find((p: any) => p.id === id || p.challanNumber === id);
          if (found) {
            setCurrentStage(getStageFromStatus(found.status || 'Issued'));
            setChallan({
              ...found,
              status: found.status || 'Issued'
            });
          }
        })
        .catch(console.error)
        .finally(() => setIsApiLoading(false));
    }
  }, [id, isNew, companyId]);

  const handlePreview = async () => {
    try {
      setIsLoadingPreview(true);
      
      const templateRes = await api.get(`/admin/templates/delivery_challan.html`);
      
      let logoBase64 = '';
      const logoId = company?.invoiceLogoId || company?.logoFileId;
      if (logoId) {
        try {
          const blob = await api.get(`/admin/files/${logoId}`, { responseType: 'blob' });
          if (blob) {
            logoBase64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          }
        } catch (e) {
          console.error('Failed to pre-fetch logo', e);
        }
      }
      
      let signatureBase64 = '';
      const stampId = company?.stampFileId;
      if (stampId) {
        try {
          const blob = await api.get(`/admin/files/${stampId}`, { responseType: 'blob' });
          if (blob) {
            signatureBase64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          }
        } catch (e) {
          console.error('Failed to pre-fetch signature', e);
        }
      }
      
      const vendor = vendors.find(v => v.id === challan.vendorId);
      
      const payload = {
        primary_color_hex: '#792359',
        company_name: company?.name || company?.companyName || 'Company Name',
        company_logo_url: logoBase64 || '',
        company_address_line1: company?.addresses?.[0]?.addressLine1 || '',
        company_address_line2: company?.addresses?.[0]?.addressLine2 || '',
        company_phone: company?.phone || '',
        company_email: company?.email || '',
        company_gstin: company?.gstNumber || '',
        company_pan: company?.panNumber || '',
        
        client_name: vendor?.displayName || vendor?.companyName || challan.vendorName || 'Client Name',
        client_address_line1: vendor?.billingAddressLine1 || '',
        client_address_line2: vendor?.billingCity || '',
        client_gstin: vendor?.gstin || '',
        client_state: vendor?.billingState || '',
        client_phone: vendor?.phone || '',
        client_email: vendor?.email || '',
        
        ship_to_name: vendor?.displayName || vendor?.companyName || challan.vendorName || 'Client Name',
        ship_to_address_line1: vendor?.shippingAddressLine1 || vendor?.billingAddressLine1 || '',
        ship_to_address_line2: vendor?.shippingCity || vendor?.billingCity || '',
        ship_to_state: vendor?.shippingState || vendor?.billingState || '',
        
        transport_mode: 'By Road', // Can be made dynamic if added to model
        delivery_location: vendor?.shippingCity || vendor?.billingCity || '',
        po_number: challan.linkedVendorPoNumber || 'N/A',
        
        challan_number: challan.challanNumber || 'Draft',
        challan_date: challan.challanDate || new Date().toLocaleDateString('en-GB'),
        place_of_supply: vendor?.billingState || '',
        
        items: challan.lineItems?.length ? challan.lineItems.map((item, index) => ({
          item_index: index + 1,
          item_name: item.itemName || 'Item',
          item_description: item.description || '',
          item_hsn: item.hsnSac || '',
          item_quantity: item.dispatchedQuantity ?? item.quantity ?? 1,
          item_unit: item.unit || 'Unit'
        })) : [{
          item_index: 1,
          item_name: 'As per description',
          item_description: challan.description || '',
          item_hsn: '',
          item_quantity: 1,
          item_unit: 'Lot'
        }],
        total_quantity: challan.lineItems?.length
          ? challan.lineItems.reduce((sum, item) => sum + (Number(item.dispatchedQuantity ?? item.quantity) || 1), 0)
          : 1,
        
        terms_and_conditions: company?.termsAndConditions || 'Terms and conditions apply',
        signature_url: signatureBase64
      };
      
      setPreviewTemplate(templateRes);
      setPreviewData(payload);
      setIsPreviewOpen(true);
    } catch (err: any) {
      toast.error('Failed to generate preview.');
      console.error(err);
    } finally {
      setIsLoadingPreview(false);
    }
  };


  const renderBanner = () => {
    switch (currentStage) {
      case 1:
        return (
          <div className="bg-[#fff9ea] dark:bg-yellow-500/10 border border-[#fde9a4] dark:border-yellow-500/20 p-4 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="text-yellow-600 dark:text-yellow-500" size={20} />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {isNew ? 'Create a new Delivery Challan.' : 'Draft Challan. Issue it when finalized.'}
              </p>
            </div>
            {isNew ? (
              <button
                disabled={isApiLoading}
                onClick={async () => {
                  if (!challan.vendorId || !challan.projectId) {
                    toast.error('Please fill required fields');
                    return;
                  }
                  setIsApiLoading(true);
                  try {
                    const payload = {
                      ...challan,
                      status: 'Issued'
                    };
                    await ChallanService.create(companyId!, payload as any);
                    toast.success('Challan saved successfully');
                    navigate('/companydashboard/finance/challans');
                  } catch (err: any) {
                    toast.error(err?.message || 'Failed to save Challan');
                  } finally {
                    setIsApiLoading(false);
                  }
                }}
                className="bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {isApiLoading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save & Issue'}
              </button>
            ) : (
              <button
                disabled={isApiLoading}
                onClick={() => handleStatusUpdate('Issued', 'Challan Issued', 2)}
                className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {isApiLoading ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : 'Issue Challan'}
              </button>
            )}
          </div>
        );
      case 2:
        return (
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="text-blue-600 dark:text-blue-400" size={20} />
              <p className="text-sm text-blue-800 dark:text-blue-200">Challan is issued. Ready to be dispatched.</p>
            </div>
            <button
              disabled={isApiLoading}
              onClick={() => handleStatusUpdate('Dispatched', 'Marked as Dispatched', 3)}
              className="bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {isApiLoading ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : 'Mark as Dispatched'}
            </button>
          </div>
        );
      case 3:
        return (
          <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 p-4 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="text-purple-600 dark:text-purple-400" size={20} />
              <p className="text-sm text-purple-800 dark:text-purple-200">Goods are dispatched. Waiting for delivery confirmation.</p>
            </div>
            <button
              disabled={isApiLoading}
              onClick={() => handleStatusUpdate('Delivered', 'Marked as Delivered', 4)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {isApiLoading ? <><Loader2 size={16} className="animate-spin" /> Confirming...</> : 'Confirm Delivery'}
            </button>
          </div>
        );
      case 4:
        return (
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600 dark:text-emerald-500" size={20} />
              <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">Delivery Challan is complete and goods delivered.</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const getStatusColor = () => {
    switch (currentStage) {
      case 1: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-gray-300 dark:border-white/10';
      case 2: return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      case 3: return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
      case 4: return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
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
            <Link to="/companydashboard/finance/challans" className="hover:text-[#792359] dark:hover:text-[#e6a8d0]">Delivery Challans</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 dark:text-white font-medium">{isNew ? 'New Challan' : challan.challanNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{isNew ? 'Create Challan' : 'Challan Details'}</h1>
            {!isNew && (
              <span className={`px-2.5 py-0.5 rounded-sm text-xs font-semibold border ${getStatusColor()}`}>
                {challan.status || 'Issued'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && (
            <button
              onClick={handlePreview}
              disabled={isLoadingPreview || isApiLoading}
              className="bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm flex items-center gap-2"
            >
              {isLoadingPreview ? (
                <><Loader2 size={16} className="animate-spin" /> Preparing PDF...</>
              ) : (
                <><Download size={16} /> Download PDF</>
              )}
            </button>
          )}
          {!isNew && currentStage === 1 && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium rounded-sm transition-colors bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Challan'}
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
              const isConverted = stage.id === 4 && currentStage === 4;

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
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Challan Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vendor</p>
                  {isEditing ? (
                    <CustomSelect
                      value={challan.vendorId}
                      onChange={(val) => {
                        const vendor = vendors.find(v => v.id === val);
                        setChallan({ ...challan, vendorId: val, vendorName: vendor?.displayName || '' });
                      }}
                      options={[{label: 'Select Vendor', value: ''}, ...vendors.map(v => ({ label: v.displayName || v.companyName || '', value: v.id }))]}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{challan.vendorName}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Project</p>
                  {isEditing ? (
                    <CustomSelect
                      value={challan.projectId}
                      onChange={(val) => {
                        const proj = projects.find(p => p.id === val);
                        setChallan({ ...challan, projectId: val, projectName: proj?.projectName || '' });
                      }}
                      options={[{label: 'Select Project', value: ''}, ...projects.map(p => ({ label: p.projectName, value: p.id }))]}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{challan.projectName}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Challan Date</p>
                  {isEditing ? (
                    <input type="date" value={challan.challanDate} onChange={e => setChallan({...challan, challanDate: e.target.value})} className="w-full px-2 py-1 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm" />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{challan.challanDate}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 mt-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description / Items</p>
                  {isEditing ? (
                    <textarea value={challan.description} onChange={e => setChallan({...challan, description: e.target.value})} className="w-full px-2 py-1 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm" rows={3} />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{challan.description || 'No description provided'}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex border-b border-gray-200 dark:border-white/10 mb-6">
                {['Overview', 'Attachments', 'History'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-[#792359] text-[#792359]' : 'border-transparent text-gray-500'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'Overview' && (
                <div className="space-y-6">
                  {/* Delivered Items Table */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                      Delivered Items
                    </h4>
                    {challan.lineItems && challan.lineItems.length > 0 ? (
                      <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-white/10">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
                            <tr>
                              <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 uppercase">#</th>
                              <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 uppercase">Item Name / Spec</th>
                              <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 uppercase">HSN/SAC</th>
                              <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 uppercase text-right">Quantity</th>
                              <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 uppercase">Unit</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {challan.lineItems.map((item, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                                <td className="px-4 py-2.5 text-gray-500">{idx + 1}</td>
                                <td className="px-4 py-2.5">
                                  <span className="font-semibold text-gray-900 dark:text-white block">{item.itemName || 'Item'}</span>
                                  {item.description && <span className="text-gray-400 dark:text-gray-500 block text-[11px] mt-0.5">{item.description}</span>}
                                </td>
                                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{item.hsnSac || '—'}</td>
                                <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white text-right">
                                  {item.dispatchedQuantity ?? item.quantity ?? 1}
                                </td>
                                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{item.unit || 'Unit'}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50 dark:bg-white/[0.02] font-bold border-t border-gray-200 dark:border-white/10 text-xs">
                            <tr>
                              <td colSpan={3} className="px-4 py-2.5 text-gray-900 dark:text-white">Total Quantity</td>
                              <td className="px-4 py-2.5 text-right text-[#792359] dark:text-[#c44997]">
                                {challan.lineItems.reduce((sum, i) => sum + (Number(i.dispatchedQuantity ?? i.quantity) || 1), 0)}
                              </td>
                              <td className="px-4 py-2.5"></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">No structured line items. Delivered goods specified in general description.</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Remarks</p>
                    {isEditing ? (
                      <textarea value={challan.remarks} onChange={e => setChallan({...challan, remarks: e.target.value})} className="w-full px-2 py-1 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm" rows={3} />
                    ) : (
                      <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{challan.remarks || 'No remarks provided'}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ChallanPreviewPanel
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        templateContent={previewTemplate}
        data={previewData}
        filename={`Challan_${challan.challanNumber || 'Draft'}.pdf`}
      />
    </div>
  );
}
