import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight, Edit, Download, Info,
  CheckCircle2, FileText, Send, MessageSquare, Plus, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import CustomSelect from '@/components/ui/CustomSelect';
import { useAuth } from '../../contexts/AuthContext';
import { QuotationService } from '../../services/quotation.service';
import { ClientService } from '../../services/client.service';
import { ProductService } from '../../services/product.service';
import { api } from '../../lib/api';
import type { Quotation, QuotationStatus } from '../../types/quotation.types';
import type { Client } from '../../types/client.types';
import { formatQuotationId } from '../../lib/utils';
import QuotationPreviewPanel from './quotations/components/QuotationPreviewPanel';

interface UserData {
  id: string;
  username: string;
  email: string;
}

export default function QuotationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCompanyId: companyId, user } = useAuth();
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);

  const isNew = id === 'new';
  const [isEditing, setIsEditing] = useState(isNew);
  const [currentStage, setCurrentStage] = useState(1);
  const [activeTab, setActiveTab] = useState('Products & Services');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);


  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!companyId) return;
    ClientService.getClients(companyId).then(data => setClients(data));
    api.get('/admin/users').then((data: any) => {
      setUsers(Array.isArray(data) ? data : (data?.content || []));
    });
    ProductService.getProducts(companyId).then(data => {
      setProducts(data.map(p => ({
        id: p.id,
        name: p.itemName,
        category: p.type || 'Product',
        rate: p.standardRate || 0,
        gst: Number(p.gstRate?.replace('%', '')) || 18
      })));
    });
  }, [companyId]);


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

  const availableProducts = products.length > 0 ? products : [
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

  const [quotation, setQuotation] = useState({
    qtnNo: isNew ? 'Unassigned' : '',
    clientId: isNew ? '' : '',
    client: isNew ? '' : '',
    project: isNew ? '' : '',
    amount: isNew ? '' : '',
    validTill: isNew ? '' : '',
    owner: user?.username || user?.email || 'Unassigned',
    discount: 0,
    deliveryCost: 0,
    createdOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    currency: 'INR',
    notes: ''
  });

  const [tempNotes, setTempNotes] = useState('');

  const parsedCommunications = (() => {
    try {
      if (!quotation.notes) return [];
      const parsed = JSON.parse(quotation.notes);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch (e) {
      if (quotation.notes) {
        return [{
          id: 'old-note',
          text: quotation.notes,
          timestamp: new Date().toISOString(),
          user: quotation.owner || 'System'
        }];
      }
      return [];
    }
  })();

  const handleAddCommunication = () => {
    if (!tempNotes.trim() || !id) return;
    
    const newNote = {
      id: Math.random().toString(36).substr(2, 9),
      text: tempNotes.trim(),
      timestamp: new Date().toISOString(),
      user: user?.username || user?.email || 'User'
    };
    
    const updatedNotesList = [...parsedCommunications, newNote];
    const newNotesStr = JSON.stringify(updatedNotesList);
    
    // Optimistic UI update
    setQuotation({ ...quotation, notes: newNotesStr });
    setTempNotes('');

    // Fire and forget backend update
    (async () => {
      try {
        const fullQuotation = await QuotationService.getQuotation(id);
        await QuotationService.updateQuotation(id, { ...fullQuotation, notes: newNotesStr });
      } catch (err: any) {
        toast.error('Failed to sync note to server');
      }
    })();
  };

  useEffect(() => {
    if (companyId) {
      ClientService.getClients(companyId).then(setClients).catch(console.error);
      api.get('/admin/users').then((res: any) => {
        setUsers(Array.isArray(res) ? res : (res.content || []));
      }).catch(console.error);
    }
  }, [companyId]);

  const getStageFromStatus = (status?: string) => {
    switch (status) {
      case 'Draft': return 1;
      case 'Pending Approval': return 2;
      case 'Sent for Approval': return 2;
      case 'Approved': return 3;
      case 'Sent to Client': return 3;
      case 'Changes Requested': return 4;
      case 'Under Negotiation': return 4;
      case 'Rejected': return 1;
      case 'Accepted': return 5;
      case 'Converted': return 6;
      default: return 1;
    }
  };

  const handleStatusUpdate = async (newStatus: QuotationStatus, successMessage: string, newStage: number) => {
    if (!id || isNew) return;
    setIsApiLoading(true);
    try {
      let approvedBy;
      if (newStatus === 'Approved' || newStatus === 'Rejected') {
        approvedBy = user?.username || user?.email;
      }
      await QuotationService.updateQuotationStatus(id, newStatus, approvedBy);
      setCurrentStage(newStage);
      toast.success(successMessage);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update quotation status');
    } finally {
      setIsApiLoading(false);
    }
  };

  // Fetch existing quotation from backend API
  useEffect(() => {
    if (!isNew && id && clients.length > 0 && users.length > 0) {
      setIsApiLoading(true);
      QuotationService.getQuotation(id)
        .then((data: Quotation) => {
          setCurrentStage(getStageFromStatus(data.status));

          let clientName = data.clientName || '';
          if (!clientName && data.clientId) {
            const foundClient = clients.find(c => c.id === data.clientId);
            if (foundClient) clientName = foundClient.displayName || foundClient.companyName || '';
          }

          let ownerName = data.salesperson || data.approvedBy;
          if (!ownerName) {
            ownerName = user?.username || user?.email || 'Unassigned';
          }

          setQuotation({
            qtnNo: formatQuotationId(data.quotationNo || data.id),
            clientId: data.clientId || '',
            client: clientName,
            project: data.subject || '',
            amount: String(data.grandTotal || ''),
            validTill: data.validUntil ? data.validUntil.split('T')[0] : '',
            owner: ownerName,
            discount: data.totalDiscount || 0,
            deliveryCost: data.deliveryCost || 0,
            createdOn: data.date ? new Date(data.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            currency: 'INR',
            notes: data.notes || ''
          });
          if (data.lineItems && data.lineItems.length > 0) {
            setLineItems(data.lineItems.map(item => ({
              id: item.id || item.productId || Math.random().toString(),
              name: item.itemName || 'Unknown Item',
              category: 'Service', // Fallback for UI
              qty: item.quantity || 1,
              rate: item.rate || 0,
              gst: item.gstRate || 0,
              amount: item.totalAmount || 0
            })));
          } else {
            setLineItems([]); // Clear dummy data if no items
          }
        })
        .catch((err: any) => {
          console.error('Failed to fetch quotation', err);
          toast.error('Failed to load quotation details');
        })
        .finally(() => setIsApiLoading(false));
    }
  }, [id, isNew, clients.length, users.length]);

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
  const grandTotal = subTotal + totalGst - (Number(quotation.discount) || 0) + (Number(quotation.deliveryCost) || 0);

  const handlePreview = async () => {
    try {
      setIsLoadingPreview(true);
      const data = quotation;
      
      const templateName = (data as any).templateName || 'quotation.html';
      const templateRes = await api.get(`/admin/templates/${templateName}`);
      let company = null;
      if (companyId) {
        const companyRes = await api.get(`/admin/companies/${companyId}`);
        company = companyRes.data;
      }
      
      let client = null;
      if (data.clientId && companyId) {
        const clientsList = await ClientService.getClients(companyId);
        client = clientsList.find(c => c.id === data.clientId);
      }

      const previewPayload = {
        primary_color_hex: '#792359',
        company_name: company?.name || 'Company Name',
        company_logo_url: company?.logoUrl || '',
        company_address_line1: company?.addressLine1 || '',
        company_address_line2: company?.addressLine2 || '',
        company_phone: company?.phone || '',
        company_email: company?.email || '',
        company_gstin: company?.gstin || '',
        company_pan: company?.pan || '',
        client_name: client?.companyName || client?.displayName || data.client || 'Client Name',
        client_address_line1: (data as any).billingAddress ? (data as any).billingAddress.split('\n')[0] : (client?.billingAddressLine1 || ''),
        client_address_line2: (data as any).billingAddress ? (data as any).billingAddress.split('\n').slice(1).join(', ') : (client?.billingAddressLine2 || ''),
        client_phone: client?.phone || '',
        client_state: client?.billingState || '',
        client_email: client?.email || '',
        estimate_number: data.qtnNo,
        estimate_date: data.createdOn,
        place_of_supply: (data as any).shippingAddress ? (data as any).shippingAddress.split('\n').join(', ') : (client?.shippingState || client?.billingState || ''),
        items: lineItems.map((item, idx) => ({
          item_index: idx + 1,
          item_name: item.name,
          item_description: item.name,
          item_quantity: item.qty,
          item_unit: 'Unit',
          item_price: item.rate.toFixed(2),
          item_amount: item.amount.toFixed(2)
        })),
        sub_total: subTotal.toFixed(2),
        total_tax: totalGst.toFixed(2),
        grand_total: grandTotal.toFixed(2),
        amount_in_words: 'Amount in words not calculated',
        terms_and_conditions: 'Terms and conditions apply',
        bank_name: company?.bankName || '',
        bank_account_no: company?.bankAccountNumber || '',
        bank_ifsc: company?.bankIfscCode || '',
        bank_account_holder: company?.bankAccountName || '',
        has_taxes: totalGst > 0,
        taxes: totalGst > 0 ? [{ tax_type: 'GST', taxable_amount: subTotal.toFixed(2), tax_rate: 'VARIOUS', tax_amount: totalGst.toFixed(2) }] : []
      };

      setPreviewTemplate(templateRes.data);
      setPreviewData(previewPayload);
      setIsPreviewOpen(true);
    } catch (err: any) {
      toast.error('Failed to generate preview.');
    } finally {
      setIsLoadingPreview(false);
    }
  };

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
                disabled={isApiLoading}
                onClick={async () => {
                  if (!quotation.client || !quotation.project || !quotation.amount || !quotation.validTill) {
                    toast.error('Please fill all mandatory fields before saving draft');
                    return;
                  }
                  if (!companyId) {
                    toast.error('No company selected');
                    return;
                  }

                  setIsApiLoading(true);
                  try {
                    // Save via backend API
                    const newQuotationData: Omit<Quotation, 'id'> = {
                      quotationNo: '',
                      clientId: '',
                      clientName: quotation.client,
                      date: new Date().toISOString().split('T')[0],
                      validUntil: quotation.validTill,
                      subject: quotation.project,
                      lineItems: lineItems.map(item => ({
                        productId: item.id,
                        itemName: item.name,
                        quantity: item.qty,
                        unit: 'Unit',
                        rate: item.rate,
                        discount: 0,
                        gstRate: item.gst,
                        taxableAmount: item.rate * item.qty,
                        gstAmount: item.rate * item.qty * item.gst / 100,
                        totalAmount: item.rate * item.qty * (1 + item.gst / 100)
                      })),
                      subTotal: subTotal,
                      totalDiscount: Number(quotation.discount) || 0,
                      deliveryCost: Number(quotation.deliveryCost) || 0,
                      totalTaxableAmount: subTotal - (Number(quotation.discount) || 0),
                      totalGstAmount: totalGst,
                      grandTotal: grandTotal,
                      status: 'Draft'
                    };

                    await QuotationService.createQuotation(companyId, newQuotationData);
                    toast.success('Quotation draft saved successfully');
                    navigate('/companydashboard/sales/quotations');
                  } catch (err: any) {
                    toast.error(err?.message || 'Failed to save quotation');
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
                onClick={() => {
                  if (!quotation.client || !quotation.project || !quotation.amount || !quotation.validTill) {
                    toast.error('Please fill all mandatory fields before sending for approval');
                    return;
                  }
                  handleStatusUpdate('Pending Approval', 'Sent for approval', 2);
                }}
                className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
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
                disabled={isApiLoading}
                onClick={() => handleStatusUpdate('Rejected', 'Quotation rejected internally', 1)}
                className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
              <button
                disabled={isApiLoading}
                onClick={() => handleStatusUpdate('Approved', 'Approved internally', 3)}
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
              <Info className="text-blue-600 dark:text-blue-400" size={20} />
              <p className="text-sm text-blue-800 dark:text-blue-200">Quotation has been sent to the client. You can track client view and follow-up.</p>
            </div>
            <div className="flex gap-2">
              <button
                disabled={isApiLoading}
                onClick={() => handleStatusUpdate('Changes Requested', 'Marked as Under Negotiation', 4)}
                className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Client Requested Changes
              </button>
              <button
                disabled={isApiLoading}
                onClick={() => handleStatusUpdate('Accepted', 'Client Accepted Quotation!', 5)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-sm font-medium rounded-sm transition-colors disabled:opacity-50"
              >
                Client Accepted
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
              disabled={isApiLoading}
              onClick={() => handleStatusUpdate('Pending Approval', 'Revision sent for internal approval.', 2)}
              className="bg-[#792359] text-white px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-[#52173c] transition-colors disabled:opacity-50"
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
              disabled={isApiLoading}
              onClick={() => handleStatusUpdate('Converted', 'Quotation converted to project!', 6)}
              className="bg-[#792359] text-white px-4 py-1.5 text-sm font-medium rounded-sm hover:bg-[#52173c] transition-colors disabled:opacity-50"
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
              disabled={isApiLoading}
              onClick={async () => {
                if (isEditing) {
                  if (!isNew && id) {
                    setIsApiLoading(true);
                    try {
                      await QuotationService.updateQuotation(id, {
                        clientId: quotation.clientId,
                        clientName: quotation.client,
                        subject: quotation.project,
                        salesperson: quotation.owner,
                        grandTotal: Number(quotation.amount) || 0,
                        validUntil: quotation.validTill,
                        totalDiscount: Number(quotation.discount) || 0,
                        deliveryCost: Number(quotation.deliveryCost) || 0
                      });
                      toast.success('Changes saved successfully');
                    } catch (err: any) {
                      toast.error(err?.message || 'Failed to save changes');
                    } finally {
                      setIsApiLoading(false);
                    }
                  } else {
                    toast.success('Changes saved successfully');
                  }
                }
                setIsEditing(!isEditing);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors flex items-center gap-2 ${isEditing
                  ? 'bg-[#792359] hover:bg-[#52173c] text-white shadow-sm'
                  : 'bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
            >
              {isEditing ? 'Save Changes' : <><Edit size={16} /> Edit</>}
            </button>
          )}
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                if (!isNew && id) {
                  setIsApiLoading(true);
                  QuotationService.getQuotation(id).then((data) => {
                    let clientName = data.clientName || '';
                    if (!clientName && data.clientId) {
                      const foundClient = clients.find(c => c.id === data.clientId);
                      if (foundClient) clientName = foundClient.displayName || foundClient.companyName || '';
                    }
                    let ownerName = data.salesperson || data.approvedBy;
                    if (!ownerName) {
                      ownerName = user?.username || user?.email || 'Unassigned';
                    }
                    setQuotation({
                      qtnNo: formatQuotationId(data.quotationNo || data.id),
                      clientId: data.clientId || '',
                      client: clientName,
                      project: data.subject || '',
                      amount: String(data.grandTotal || ''),
                      validTill: data.validUntil ? data.validUntil.split('T')[0] : '',
                      owner: ownerName,
                      discount: data.totalDiscount || 0,
                      deliveryCost: data.deliveryCost || 0,
                      createdOn: data.date ? new Date(data.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
                      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                      currency: 'INR'
                    });
                    if (data.lineItems && data.lineItems.length > 0) {
                      setLineItems(data.lineItems.map(item => ({
                        id: item.id || item.productId || Math.random().toString(),
                        name: item.itemName || 'Unknown Item',
                        category: 'Service',
                        qty: item.quantity || 1,
                        rate: item.rate || 0,
                        gst: item.gstRate || 0,
                        amount: item.totalAmount || 0
                      })));
                    }
                  }).finally(() => setIsApiLoading(false));
                }
              }}
              className="px-4 py-2 text-sm font-medium rounded-sm transition-colors bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              Cancel
            </button>
          )}
          <button 
            disabled={isLoadingPreview}
            onClick={handlePreview}
            className="bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm flex items-center gap-2"
          >
            <Download size={16} /> Download PDF
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
                    <CustomSelect
                      value={quotation.clientId}
                      onChange={(val) => {
                        const client = clients.find(c => c.id === val);
                        setQuotation({ ...quotation, clientId: val, client: client ? (client.displayName || client.companyName || '') : '' });
                      }}
                      options={[{label: 'Select Client', value: ''}, ...clients.map(c => ({ label: c.displayName || c.companyName || '', value: c.id }))]}
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
                      onChange={(e) => setQuotation({ ...quotation, project: e.target.value })}
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
                      onChange={(e) => setQuotation({ ...quotation, amount: e.target.value })}
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
                      onChange={(e) => setQuotation({ ...quotation, validTill: e.target.value })}
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
                      onChange={(val) => setQuotation({ ...quotation, owner: val })}
                      options={[{label: 'Select Owner', value: ''}, ...users.map(u => ({ label: u.username || u.email, value: u.username || u.email }))]}
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
                      onChange={(val) => setQuotation({ ...quotation, currency: val })}
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
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
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
                            onChange={(e) => setQuotation({ ...quotation, discount: Number(e.target.value) })}
                            className="w-24 px-2 py-1 text-right text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#792359]"
                            min="0"
                          />
                        ) : (
                          <span className="font-medium text-gray-900 dark:text-white text-red-500">-{Number(quotation.discount || 0).toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-500">Delivery Cost</span>
                        {isEditing ? (
                          <input
                            type="number"
                            value={quotation.deliveryCost}
                            onChange={(e) => setQuotation({ ...quotation, deliveryCost: Number(e.target.value) })}
                            className="w-24 px-2 py-1 text-right text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#792359]"
                            min="0"
                          />
                        ) : (
                          <span className="font-medium text-gray-900 dark:text-white">{Number(quotation.deliveryCost || 0).toLocaleString('en-IN')}</span>
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

            {/* Communication & Notes Chain */}
            <div className="border-t border-gray-200 dark:border-white/5 pt-6 mt-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">Communication & Internal Notes</h4>
              </div>
              
              <div className="bg-gray-50/50 dark:bg-white/[0.02] p-4 rounded-sm border border-gray-200 dark:border-white/5 mb-4">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {parsedCommunications.length === 0 ? (
                    <div className="text-sm text-gray-500 italic py-4 text-center">No notes or communication yet.</div>
                  ) : parsedCommunications.map((comm: any) => (
                    <div key={comm.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-1">
                        <MessageSquare size={14} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">{comm.user}</span>
                          <span className="text-xs text-gray-500">{new Date(comm.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comm.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Add a new note or communication..."
                  className="w-full pl-3 pr-12 py-3 border border-gray-200 dark:border-white/10 rounded-sm text-sm bg-gray-50 dark:bg-[#0f1115] min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-[#792359]"
                />
                <button
                  disabled={!tempNotes.trim()}
                  onClick={handleAddCommunication}
                  className="absolute right-3 bottom-3 text-gray-400 hover:text-[#792359] dark:hover:text-[#e6a8d0] transition-colors disabled:opacity-50 bg-white dark:bg-[#0f1115] rounded-full p-1"
                  title="Send Note"
                >
                  <Send size={18} />
                </button>
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
                    {quotation.lastUpdated || quotation.createdOn || 'N/A'}
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
      
      <QuotationPreviewPanel
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        templateContent={previewTemplate}
        data={previewData}
        filename={`Quotation_${quotation.qtnNo}.pdf`}
      />
    </div>
  );
}
