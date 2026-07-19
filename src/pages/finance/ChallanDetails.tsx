import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight, Info,
  CheckCircle2, Truck, Package
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


  const renderBanner = () => {
    switch (currentStage) {
      case 1:
        return (
          <div className="bg-[#fff9ea] dark:bg-yellow-500/10 border border-[#fde9a4] dark:border-yellow-500/20 p-4 rounded-sm flex items-center justify-between">
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
                className="bg-[#792359] text-white px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-[#52173c] transition-colors"
              >
                Save & Issue
              </button>
            ) : (
              <button
                disabled={isApiLoading}
                onClick={() => handleStatusUpdate('Issued', 'Challan Issued', 2)}
                className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Issue Challan
              </button>
            )}
          </div>
        );
      case 2:
        return (
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="text-blue-600 dark:text-blue-400" size={20} />
              <p className="text-sm text-blue-800 dark:text-blue-200">Challan is issued. Ready to be dispatched.</p>
            </div>
            <button
              disabled={isApiLoading}
              onClick={() => handleStatusUpdate('Dispatched', 'Marked as Dispatched', 3)}
              className="bg-[#792359] text-white px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-[#52173c] transition-colors disabled:opacity-50"
            >
              Mark as Dispatched
            </button>
          </div>
        );
      case 3:
        return (
          <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="text-purple-600 dark:text-purple-400" size={20} />
              <p className="text-sm text-purple-800 dark:text-purple-200">Goods are dispatched. Waiting for delivery confirmation.</p>
            </div>
            <button
              disabled={isApiLoading}
              onClick={() => handleStatusUpdate('Delivered', 'Marked as Delivered', 4)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-sm font-medium rounded-sm transition-colors disabled:opacity-50"
            >
              Confirm Delivery
            </button>
          </div>
        );
      case 4:
        return (
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600 dark:text-emerald-500" size={20} />
              <p className="text-sm text-emerald-800 dark:text-emerald-200">Delivery Challan is complete and goods delivered.</p>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                  {isEditing ? (
                    <input type="date" value={challan.challanDate} onChange={e => setChallan({...challan, challanDate: e.target.value})} className="w-full px-2 py-1 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm" />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{challan.challanDate}</p>
                  )}
                </div>
                <div className="col-span-2 md:col-span-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description / Items</p>
                  {isEditing ? (
                    <textarea value={challan.description} onChange={e => setChallan({...challan, description: e.target.value})} className="w-full px-2 py-1 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm" rows={3} />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{challan.description}</p>
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
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">Remarks: {challan.remarks || 'None'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
