import { useState, useEffect } from 'react';
import { X, Edit, User, Phone, Mail, MapPin, Building2, FileText, MessageSquare, Activity, AlertCircle, FileStack, Settings } from 'lucide-react';
import type { Client } from '../../../../types/client.types';
import { QuotationService } from '../../../../services/quotation.service';
import type { Quotation } from '../../../../types/quotation.types';
import { useAuth } from '../../../../contexts/AuthContext';

interface Props {
  client: Client;
  onClose: () => void;
  onEdit: () => void;
}

export default function ClientProfileView({ client, onClose, onEdit }: Props) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'comments'>('overview');
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  
  // Example tickets linked to client
  const tickets = [
    { id: 'TKT-001', subject: 'Server Installation', status: 'Open', date: '2024-03-01' }
  ];

  useEffect(() => {
    // Fetch quotations for this client
    const loadData = async () => {
      try {
        const allQuots = await QuotationService.getQuotations(client.id);
        const clientQuots = allQuots.filter((q: any) => q.clientId === client.id || q.clientName === client.companyName);
        setQuotations(clientQuots);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [client.id, client.companyName]);

  // Load comments
  useEffect(() => {
    if (client.id) {
      const stored = localStorage.getItem(`comments_client_${client.id}`);
      if (stored) {
        setComments(JSON.parse(stored));
      } else {
        setComments(["Client onboarding completed.", "Verified contact details."]);
      }
    }
  }, [client.id]);

  const handleAddComment = () => {
    if (!newComment.trim() || !client.id) return;
    const updated = [newComment.trim(), ...comments];
    setComments(updated);
    localStorage.setItem(`comments_client_${client.id}`, JSON.stringify(updated));
    setNewComment('');
  };

  const totalQuotationsAmount = quotations.reduce((sum, q) => sum + (q.grandTotal || 0), 0);
  const pendingQuotations = quotations.filter((q: any) => q.status === 'Draft' || q.status === 'Sent');

  return (
    <div className="w-full bg-gray-50 dark:bg-[#0a0a0a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col min-h-[calc(100vh-8rem)] overflow-hidden transition-colors duration-300">
      
      {/* ── 1. Header Section ── */}
      <div className="px-6 py-5 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#792359] text-white flex items-center justify-center rounded-lg text-2xl font-bold shrink-0 shadow-sm">
            {(client.companyName || client.primaryContactPerson || 'C').charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              {client.companyName || client.primaryContactPerson}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {client.clientNo || 'No ID'}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                {client.customerType || 'Client'}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${
                client.status === 'Active' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' 
                  : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {client.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
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
          { id: 'transactions', label: 'Transactions & Tickets', icon: <FileText size={16} /> },
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6">
              
              {/* Contacts Box */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <User className="text-gray-400" size={18} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Contact Details</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Primary Contact Name</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{client.primaryContactPerson || '—'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Email Address</span>
                      <a href={`mailto:${client.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5">
                        <Mail size={14} />
                        <span className="truncate">{client.email || '—'}</span>
                      </a>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Phone Number</span>
                      <span className="text-sm text-gray-800 dark:text-gray-300 flex items-center gap-1.5">
                        <Phone size={14} className="text-gray-400" />
                        <span>{client.phone || '—'}</span>
                      </span>
                    </div>
                  </div>
                  {client.alternatePhone && (
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Alternate Phone</span>
                      <span className="text-sm text-gray-800 dark:text-gray-300 flex items-center gap-1.5">
                        <Phone size={14} className="text-gray-400" />
                        <span>{client.alternatePhone}</span>
                      </span>
                    </div>
                  )}

                  {client.additionalContacts && client.additionalContacts.length > 0 && (
                    <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 space-y-4">
                      {client.additionalContacts.map((contact, i) => (
                        <div key={i} className="space-y-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block">
                            {contact.role} Contact
                          </span>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{contact.name}</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5">
                              <Mail size={14} />
                              <span className="truncate">{contact.email || '—'}</span>
                            </div>
                            <div className="text-sm text-gray-800 dark:text-gray-300 flex items-center gap-1.5">
                              <Phone size={14} className="text-gray-400" />
                              <span>{contact.phone || '—'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Address card */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-gray-400" size={18} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Addresses</h4>
                </div>
                
                <div className="space-y-5 flex flex-col">
                  <div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">Billing Address</span>
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-100 dark:border-gray-800">
                      <div>
                        {client.billingAddressLine1}<br />
                        {client.billingAddressLine2 && <>{client.billingAddressLine2}<br /></>}
                        {client.billingCity}, {client.billingState} {client.billingPinCode}<br />
                        {client.billingCountry || 'India'}
                        {client.billingPhone && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-1.5 text-gray-800 dark:text-gray-300">
                            <Phone size={12} className="text-gray-400" />
                            <span>{client.billingPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">Shipping Address</span>
                    {client.shippingAddressLine1 ? (
                      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-100 dark:border-gray-800">
                        <div>
                          {client.shippingAddressLine1}<br />
                          {client.shippingAddressLine2 && <>{client.shippingAddressLine2}<br /></>}
                          {client.shippingCity}, {client.shippingState} {client.shippingPinCode}<br />
                          {client.shippingCountry || 'India'}
                          {client.shippingPhone && (
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-1.5 text-gray-800 dark:text-gray-300">
                              <Phone size={12} className="text-gray-400" />
                              <span>{client.shippingPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-dashed border-gray-200 dark:border-gray-700">
                        Same as billing address
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </div>
            
            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-6">

              {/* Financial Summary */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="text-[#792359] dark:text-[#e6a8d0]" size={20} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Financial Summary</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/50">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Quotations Amount</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{totalQuotationsAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30">
                    <div className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">Pending Quotations</div>
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {pendingQuotations.length}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 sm:col-span-2">
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Total Tickets</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {tickets.length}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tax & Compliance card */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="text-gray-400" size={18} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tax & Compliance</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">GST Treatment</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{client.gstTreatment || '—'}</span>
                  </div>
                  {client.gstin && (
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">GSTIN</span>
                      <span className="text-sm text-gray-800 dark:text-gray-300">{client.gstin}</span>
                    </div>
                  )}
                  {client.panNumber && (
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">PAN Number</span>
                      <span className="text-sm text-gray-800 dark:text-gray-300">{client.panNumber}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Commercial settings */}
              {(client.paymentTerms || client.creditLimit) ? (
                <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="text-gray-400" size={18} />
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Commercial Settings</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Payment Terms</span>
                      <span className="text-sm text-gray-900 dark:text-gray-200 font-medium">{client.paymentTerms || 'Due on Receipt'}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Credit Limit</span>
                      <span className="text-sm text-gray-900 dark:text-gray-200 font-medium">
                        {client.creditLimit ? `₹${client.creditLimit.toLocaleString('en-IN')}` : 'No Limit'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm flex flex-col items-center justify-center text-center space-y-3 py-6">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
                    <Settings className="text-gray-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">No Commercial Settings</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Set credit limits and terms.</p>
                  </div>
                  <button onClick={() => onEdit && onEdit()} className="mt-2 px-4 py-1.5 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md text-xs font-medium transition-colors">
                    Configure Settings
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── TABS CORE CONTENT: TRANSACTIONS & TICKETS ── */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileStack className="text-gray-400" size={18} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Linked Quotations</h4>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full">
                  {quotations.length} total
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                    <tr>
                      <th className="px-5 py-3 font-medium">Quote No</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium text-right">Amount (₹)</th>
                      <th className="px-5 py-3 font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {quotations.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                          No quotations found for this client
                        </td>
                      </tr>
                    ) : (
                      quotations.map(q => (
                        <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-5 py-3 font-medium text-[#792359] dark:text-[#e6a8d0]">
                            {q.quotationNo}
                          </td>
                          <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                            {new Date(q.date).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                            {q.grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                              {q.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-gray-400" size={18} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Linked Tickets</h4>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full">
                  {tickets.length} total
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                    <tr>
                      <th className="px-5 py-3 font-medium">Ticket No</th>
                      <th className="px-5 py-3 font-medium">Subject</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {tickets.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                          No tickets found for this client
                        </td>
                      </tr>
                    ) : (
                      tickets.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-5 py-3 font-medium text-gray-900 dark:text-gray-100">
                            {t.id}
                          </td>
                          <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                            {t.subject}
                          </td>
                          <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                            {t.date}
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400">
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))
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
            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Add a Comment</h4>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Type your comment here..." 
                  className="flex-1 px-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:border-[#792359]"
                  onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                />
                <button 
                  onClick={handleAddComment}
                  className="px-4 py-2 bg-[#792359] hover:bg-[#52173c] text-white text-sm font-medium rounded-md transition-colors"
                >
                  Post
                </button>
              </div>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-800 before:to-transparent">
              {comments.map((comment, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0a0a0a] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <User size={16} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{user?.username || 'System Admin'}</h5>
                      <time className="text-xs text-gray-500">Just now</time>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{comment}</p>
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
