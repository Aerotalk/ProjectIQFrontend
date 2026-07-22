import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight, Edit, Download, Info,
  CheckCircle2, FileText, Send, MessageSquare, Plus
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
import { formatQuotationId, numberToWords } from '../../lib/utils';
import QuotationPreviewPanel from './quotations/components/QuotationPreviewPanel';
import { Stepper } from '@/components/ui/Stepper';
import { calculateQuotationTotals } from '@/utils/quotationCalculations';
import FunkyLoader from '@/components/ui/FunkyLoader';

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
  const isAdmin = user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_MANAGER', 'quotation.approve'].includes(r)) || false;
  const [isEditing, setIsEditing] = useState(isNew);
  const [currentStage, setCurrentStage] = useState(1);
  const [activeTab, setActiveTab] = useState('Products & Services');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);


  const [products, setProducts] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (!companyId) return;
    api.get(`/admin/companies/${companyId}`).then(res => setCompany(res)).catch(console.error);
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
    productId?: string;
    name: string;
    category: string;
    hsn?: string;
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
    { id: 6, name: 'Confirmed Lead' },
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
    notes: '',
    termsAndConditions: '',
    taxType: 'CGST_SGST' as 'CGST_SGST' | 'IGST'
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

  const handleUpdateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'qty' || field === 'rate') {
          updated.amount = updated.qty * updated.rate;
        }
        return updated;
      }
      return item;
    }));
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
      case 'Confirmed Lead': return 6;
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
            notes: data.notes || '',
            termsAndConditions: data.termsAndConditions || '',
            taxType: data.taxType || 'CGST_SGST'
          });
          if (data.lineItems && data.lineItems.length > 0) {
            setLineItems(data.lineItems.map(item => ({
              id: item.id || item.productId || Math.random().toString(),
              productId: item.productId,
              name: item.itemName || 'Unknown Item',
              category: 'Service', // Fallback for UI
              hsn: item.hsnSac || '',
              qty: item.quantity || 1,
              rate: item.rate || 0,
              gst: item.gstRate || 0,
              amount: item.taxableAmount ?? ((item.rate || 0) * (item.quantity || 1))
            })));
          } else {
            setLineItems([]); // Clear dummy data if no items
          }
        })
        .catch((err: any) => {
          console.error('Failed to fetch quotation', err);
        })
        .finally(() => {
          setIsApiLoading(false);
        });
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

  const { 
    subTotal, 
    totalGstAmount: totalGst, 
    grandTotal, 
    calculatedLines,
    taxGroups,
    totalDiscount,
    deliveryCost
  } = calculateQuotationTotals(
    lineItems,
    Number(quotation.discount) || 0,
    Number(quotation.deliveryCost) || 0
  );

  const companyState = company?.addresses?.[0]?.state?.trim().toLowerCase() || '';
  const selectedClient = clients.find(c => c.id === quotation.clientId);
  const clientState = selectedClient?.billingState?.trim().toLowerCase() || '';
  const isSameState = companyState && clientState && companyState === clientState;
  const isIgst = quotation.taxType === 'IGST' || (!isSameState);

  const uiTaxBreakdown: { type: string, rate: number, amount: number }[] = [];
  Object.keys(taxGroups).forEach(rateStr => {
    const rate = Number(rateStr);
    const group = taxGroups[rate];
    if (isIgst) {
      uiTaxBreakdown.push({ type: 'IGST', rate: rate, amount: group.taxAmount });
    } else {
      const halfRate = rate / 2;
      const halfAmount = group.taxAmount / 2;
      uiTaxBreakdown.push({ type: 'CGST', rate: halfRate, amount: halfAmount });
      uiTaxBreakdown.push({ type: 'SGST', rate: halfRate, amount: halfAmount });
    }
  });

  const handlePreview = async () => {
    try {
      setIsLoadingPreview(true);
      const data = quotation;

      const templateName = (data as any).templateName || 'quotation.html';
      const templateRes = await api.get(`/admin/templates/${templateName}`);
      let company = null;
      if (companyId) {
        const companyRes = await api.get(`/admin/companies/${companyId}`);
        company = companyRes;
      }

      let client = null;
      if (data.clientId && companyId) {
        const clientsList = await ClientService.getClients(companyId);
        client = clientsList.find(c => c.id === data.clientId);
      }

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

      const companyState = company?.addresses?.[0]?.state?.trim().toLowerCase() || '';
      const clientState = client?.billingState?.trim().toLowerCase() || '';
      const isSameState = companyState && clientState && companyState === clientState;

      const isIgstPreview = quotation.taxType === 'IGST' || (!isSameState);

      const taxBreakdown: any[] = [];
      Object.keys(taxGroups).forEach(rateStr => {
        const rate = Number(rateStr);
        const group = taxGroups[rate];
        if (isIgstPreview) {
          taxBreakdown.push({
            tax_type: 'IGST',
            taxable_amount: group.taxable.toFixed(2),
            tax_rate: rate,
            tax_amount: group.taxAmount.toFixed(2)
          });
        } else {
          const halfRate = rate / 2;
          const halfAmount = (group.taxAmount / 2).toFixed(2);
          taxBreakdown.push({
            tax_type: 'CGST',
            taxable_amount: group.taxable.toFixed(2),
            tax_rate: halfRate,
            tax_amount: halfAmount
          });
          taxBreakdown.push({
            tax_type: 'SGST',
            taxable_amount: group.taxable.toFixed(2),
            tax_rate: halfRate,
            tax_amount: halfAmount
          });
        }
      });

      const previewPayload = {
        primary_color_hex: '#792359',
        company_name: company?.name || company?.companyName || 'Company Name',
        company_logo_url: logoBase64 || '',
        company_address_line1: company?.addresses?.[0]?.addressLine1 || '',
        company_address_line2: company?.addresses?.[0]?.addressLine2 || '',
        company_phone: company?.phone || '',
        company_email: company?.email || '',
        company_gstin: company?.gstNumber || '',
        company_pan: company?.panNumber || '',
        client_name: client?.displayName || quotation.client || 'Client Name',
        client_address_line1: client?.billingAddressLine1 || '',
        client_address_line2: client?.billingCity || '',
        client_phone: client?.phone || '',
        client_state: client?.billingState || '',
        client_email: client?.email || '',
        estimate_number: quotation.qtnNo || 'Draft',
        estimate_date: quotation.createdOn || new Date().toLocaleDateString('en-GB'),
        place_of_supply: client?.billingState || '',
        items: lineItems.map((item, index) => {
          const product = products.find(p => p.id === item.productId || p.id === item.id);
          const calcLine = calculatedLines[index];
          const lineTaxable = calcLine ? calcLine.rowTaxableAmount : (item.rate * item.qty);
          return {
            item_index: index + 1,
            item_name: item.name,
            item_description: '',
            item_hsn: (item as any).hsnSac || (item as any).hsn || product?.hsnSac || (product as any)?.hsn || '',
            item_quantity: item.qty,
            item_unit: 'Unit',
            item_price: item.rate.toFixed(2),
            item_amount: lineTaxable.toFixed(2)
          };
        }),
        sub_total: subTotal.toFixed(2),
        discount: totalDiscount.toFixed(2),
        has_discount: totalDiscount > 0,
        taxable_amount: (subTotal - totalDiscount).toFixed(2),
        total_tax: totalGst.toFixed(2),
        delivery_cost: (Number(quotation.deliveryCost) || 0).toFixed(2),
        has_delivery_cost: Number(quotation.deliveryCost) > 0,
        grand_total: grandTotal.toFixed(2),
        amount_in_words: numberToWords(grandTotal),
        terms_and_conditions: quotation.termsAndConditions || company?.termsAndConditions || 'Terms and conditions apply',
        company_signature_url: signatureBase64,
        bank_name: company?.bankAccounts?.[0]?.bankName || '',
        bank_account_no: company?.bankAccounts?.[0]?.accountNumber || '',
        bank_ifsc: company?.bankAccounts?.[0]?.ifscCode || '',
        bank_account_holder: company?.bankAccounts?.[0]?.accountHolderName || company?.bankAccounts?.[0]?.accountName || '',
        has_taxes: totalGst > 0,
        taxes: taxBreakdown
      };

      setPreviewTemplate(templateRes);
      setPreviewData(previewPayload);
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
                {isNew ? 'You are creating a new quotation. Add details and save as draft.' : 'You are preparing the quotation. Add products/services and send for approval.'}
              </p>
            </div>
            {isNew ? (
              <button
                disabled={isApiLoading}
                onClick={async () => {
                  if (!quotation.client || !quotation.project || !grandTotal || !quotation.validTill) {
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
                      salesperson: quotation.owner || user?.username || user?.email || '',
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
                      status: 'Draft',
                      taxType: quotation.taxType as 'CGST_SGST' | 'IGST'
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
                className="bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {isApiLoading ? <><FunkyLoader variant="inline" className="mr-2" /> Saving...</> : 'Save Draft'}
              </button>
            ) : (
              <button
                disabled={isApiLoading}
                onClick={() => {
                  if (!quotation.client || !grandTotal || !quotation.validTill) {
                    toast.error('Please fill all mandatory fields before sending for approval');
                    return;
                  }
                  handleStatusUpdate('Pending Approval', 'Sent for approval', 2);
                }}
                className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {isApiLoading ? <><FunkyLoader variant="inline" className="mr-2" /> Sending...</> : 'Send for approval'}
              </button>
            )}
          </div>
        );
      case 2:
        return (
          <div className="bg-[#fff9ea] dark:bg-yellow-500/10 border border-[#fde9a4] dark:border-yellow-500/20 p-4 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="text-yellow-600 dark:text-yellow-500" size={20} />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">Quotation is sent for internal approval. You will be notified once it is approved or rejected.</p>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  disabled={isApiLoading}
                  onClick={() => handleStatusUpdate('Rejected', 'Quotation rejected internally', 1)}
                  className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  {isApiLoading ? <><FunkyLoader variant="inline" className="mr-2" /> Rejecting...</> : 'Reject'}
                </button>
                <button
                  disabled={isApiLoading}
                  onClick={() => handleStatusUpdate('Approved', 'Approved internally', 3)}
                  className="bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  {isApiLoading ? <><FunkyLoader variant="inline" className="mr-2" /> Approving...</> : 'Approve'}
                </button>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="text-blue-600 dark:text-blue-400" size={20} />
              <p className="text-sm text-blue-800 dark:text-blue-200">Quotation has been sent to the client. You can track client view and follow-up.</p>
            </div>
            <div className="flex gap-2">
              <button
                disabled={isApiLoading}
                onClick={() => handleStatusUpdate('Changes Requested', 'Marked as Under Negotiation', 4)}
                className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {isApiLoading ? <><FunkyLoader variant="inline" className="mr-2" /> Updating...</> : 'Client Requested Changes'}
              </button>
              <button
                disabled={isApiLoading}
                onClick={() => handleStatusUpdate('Accepted', 'Client Accepted Quotation!', 5)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {isApiLoading ? <><FunkyLoader variant="inline" className="mr-2" /> Updating...</> : 'Client Accepted'}
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 p-4 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="text-purple-600 dark:text-purple-400" size={20} />
              <p className="text-sm text-purple-800 dark:text-purple-200">Client has requested changes. Edit the quotation to create a revision, then send it back for internal approval.</p>
            </div>
            <button
              disabled={isApiLoading}
              onClick={() => handleStatusUpdate('Pending Approval', 'Revision sent for internal approval.', 2)}
              className="bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {isApiLoading ? <><FunkyLoader variant="inline" className="mr-2" /> Sending...</> : 'Send Revision for Approval'}
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
              onClick={() => handleStatusUpdate('Confirmed Lead', 'Lead confirmed, finance team will proceed with project creation', 6)}
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
              <p className="text-sm text-emerald-800 dark:text-emerald-200">Lead confirmed, finance team will proceed with project creation.</p>
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
                      const subTotal = lineItems.reduce((acc, item) => acc + (item.rate * item.qty), 0);
                      const totalGst = lineItems.reduce((acc, item) => acc + (item.rate * item.qty * item.gst / 100), 0);
                      const grandTotal = subTotal + totalGst - (Number(quotation.discount) || 0) + (Number(quotation.deliveryCost) || 0);

                      const fullQuotation = await QuotationService.getQuotation(id);
                      await QuotationService.updateQuotation(id, {
                        ...fullQuotation,
                        clientId: quotation.clientId,
                        clientName: quotation.client,
                        salesperson: quotation.owner,
                        validUntil: quotation.validTill,
                        totalDiscount: Number(quotation.discount) || 0,
                        deliveryCost: Number(quotation.deliveryCost) || 0,
                        taxType: quotation.taxType,
                        subTotal: subTotal,
                        totalTaxableAmount: subTotal - (Number(quotation.discount) || 0),
                        totalGstAmount: totalGst,
                        grandTotal: grandTotal,
                        lineItems: lineItems.map(item => ({
                          productId: item.productId || item.id,
                          itemName: item.name,
                          quantity: item.qty,
                          unit: 'Unit',
                          rate: item.rate,
                          discount: 0,
                          gstRate: item.gst,
                          taxableAmount: item.rate * item.qty,
                          gstAmount: item.rate * item.qty * item.gst / 100,
                          totalAmount: item.rate * item.qty * (1 + item.gst / 100)
                        }))
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
                      currency: 'INR',
                      notes: data.notes || '',
                      termsAndConditions: data.termsAndConditions || '',
                      taxType: data.taxType || 'CGST_SGST'
                    });
                    if (data.lineItems && data.lineItems.length > 0) {
                      setLineItems(data.lineItems.map(item => ({
                        id: item.id || item.productId || Math.random().toString(),
                        productId: item.productId,
                        name: item.itemName || 'Unknown Item',
                        category: 'Service',
                        hsn: item.hsnSac || '',
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
          {!isNew && (
            <button
              onClick={handlePreview}
              disabled={isLoadingPreview || isApiLoading}
              className="bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm flex items-center gap-2"
            >
              {isLoadingPreview ? (
                <><FunkyLoader variant="inline" className="mr-2" /> Preparing PDF...</>
              ) : (
                <><Download size={16} /> Download PDF</>
              )}
            </button>
          )}

        </div>
      </div>

      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm overflow-hidden">
        {/* Stepper */}
        <div className="p-8 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
          <Stepper 
            steps={stages.map(stage => ({
              id: stage.id,
              label: stage.name,
              // Convert stage ID to 0-indexed for the stepper comparison (or we can just let Stepper handle it based on currentStep which is 0-indexed in the prop)
            }))}
            currentStep={currentStage - 1} // currentStage is 1-indexed, Stepper expects 0-indexed
            size="md"
          />
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
                      options={[{ label: 'Select Client', value: '' }, ...clients.map(c => ({ label: c.displayName || c.companyName || '', value: c.id }))]}
                    />
                  ) : (
                    <p className="text-sm font-bold text-[#792359] dark:text-[#e6a8d0]">{quotation.client}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Quotation Value</p>
                  {isEditing ? (
                    <div className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm text-gray-500">
                      {`${quotation.currency === 'INR' ? '₹' : quotation.currency === 'USD' ? '$' : quotation.currency === 'EUR' ? '€' : '£'} ${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {`${quotation.currency === 'INR' ? '₹' : quotation.currency === 'USD' ? '$' : quotation.currency === 'EUR' ? '€' : '£'} ${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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
                      options={[{ label: 'Select Owner', value: '' }, ...users.map(u => ({ label: u.username || u.email, value: u.username || u.email }))]}
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
                            <td className="px-4 py-3 text-xs text-gray-900 dark:text-white">
                              {isEditing ? (
                                <input
                                  type="number"
                                  min="1"
                                  value={item.qty}
                                  onChange={(e) => handleUpdateLineItem(item.id, 'qty', Number(e.target.value))}
                                  className="w-16 px-2 py-1 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#792359]"
                                />
                              ) : (
                                item.qty
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-900 dark:text-white text-right">
                              {isEditing ? (
                                <input
                                  type="number"
                                  min="0"
                                  value={item.rate}
                                  onChange={(e) => handleUpdateLineItem(item.id, 'rate', Number(e.target.value))}
                                  className="w-24 px-2 py-1 text-right text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#792359]"
                                />
                              ) : (
                                item.rate.toLocaleString('en-IN')
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-900 dark:text-white">
                              {isEditing ? (
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={item.gst}
                                  onChange={(e) => handleUpdateLineItem(item.id, 'gst', Number(e.target.value))}
                                  className="w-16 px-2 py-1 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#792359]"
                                />
                              ) : (
                                `${item.gst}%`
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-900 dark:text-white text-right">
                              {calculatedLines[idx]?.rowSubTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-start">
                    {isEditing ? (
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
                        <span className="font-medium text-gray-900 dark:text-white">{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>

                      {uiTaxBreakdown.length > 0 ? (
                        uiTaxBreakdown.map((tax, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-500">{tax.type} ({tax.rate}%)</span>
                            <span className="font-medium text-gray-900 dark:text-white">{tax.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">GST</span>
                          <span className="font-medium text-gray-900 dark:text-white">0.00</span>
                        </div>
                      )}

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
                          <span className="font-medium text-gray-900 dark:text-white text-red-500">-{totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                          <span className="font-medium text-gray-900 dark:text-white">{deliveryCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                </div>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">No revisions yet.</p>
                </div>
              </div>
            )}

            {currentStage >= 4 && (
              <div className="bg-gray-50/50 dark:bg-white/[0.02] p-5 rounded-sm border border-gray-200 dark:border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Related Documents</h3>
                </div>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <FileText size={28} className="text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">No documents attached yet.</p>
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
                        setLineItems([...lineItems, { 
                          ...product, 
                          id: Math.random().toString(36).substr(2, 9), 
                          productId: product.id,
                          qty: 1, 
                          amount: product.rate 
                        }]);
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
