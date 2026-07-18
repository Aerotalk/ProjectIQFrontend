import { useState, useEffect } from 'react';
import { X, Edit, User, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import type { Client } from '../../../../types/client.types';
import { ClientService } from '../../../../services/client.service';

interface Props {
  client: Client;
  onClose: () => void;
  onEdit: () => void;
}

export default function ClientProfileView({ client: initialClient, onClose, onEdit }: Props) {
  const [client, setClient] = useState<Client>(initialClient);

  useEffect(() => {
    if (initialClient.id) {
      ClientService.getClient(initialClient.id)
        .then(data => setClient(data))
        .catch(console.error);
    }
  }, [initialClient.id]);

  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#792359]/10 text-[#792359] dark:bg-[#e6a8d0]/10 dark:text-[#e6a8d0] flex items-center justify-center rounded-sm border border-[#792359]/10 dark:border-[#e6a8d0]/10 text-3xl font-bold">
            {(client.displayName || client.companyName || client.firstName || 'C').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {client.displayName}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-white border border-gray-200 text-gray-800 dark:bg-transparent dark:text-gray-300 dark:border-white/20 shadow-sm">
                {client.clientNo || client.id}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-[#792359]/10 text-[#792359] dark:bg-[#e6a8d0]/10 dark:text-[#e6a8d0] border border-[#792359]/20 dark:border-[#e6a8d0]/20 shadow-sm">
                {client.customerType}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium border shadow-sm ${client.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                {client.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 dark:bg-transparent dark:border-white/20 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm"
          >
            <Edit size={16} className="text-[#792359] dark:text-[#e6a8d0]" /> Edit Profile
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-sm transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Identity & Contact Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Identity Details</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-gray-500 dark:text-gray-400">Customer Type</div>
                <div className="text-gray-900 dark:text-gray-100 font-medium">{client.customerType}</div>

                {client.customerType === 'Business' && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">Company Name</div>
                    <div className="text-gray-900 dark:text-gray-100 font-medium">{client.companyName || '-'}</div>
                  </>
                )}
                {client.customerType === 'Individual' && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">First Name</div>
                    <div className="text-gray-900 dark:text-gray-100 font-medium">{client.firstName || '-'}</div>
                    <div className="text-gray-500 dark:text-gray-400">Last Name</div>
                    <div className="text-gray-900 dark:text-gray-100 font-medium">{client.lastName || '-'}</div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Primary Contact</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><User size={14} /> Contact Person</div>
                <div className="text-gray-900 dark:text-gray-100 font-medium">{client.primaryContactPerson || '-'}</div>

                <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Briefcase size={14} /> Designation</div>
                <div className="text-gray-900 dark:text-gray-100">{client.designation || '-'}</div>

                <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Mail size={14} /> Email</div>
                <div className="text-gray-900 dark:text-gray-100">{client.email || '-'}</div>

                <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Phone size={14} /> Phone</div>
                <div className="text-gray-900 dark:text-gray-100">{client.phone || '-'}</div>

                {client.alternatePhone && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Phone size={14} /> Alt Phone</div>
                    <div className="text-gray-900 dark:text-gray-100">{client.alternatePhone}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tax & Commercial Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Tax & Compliance</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-gray-500 dark:text-gray-400">GST Treatment</div>
                <div className="text-gray-900 dark:text-gray-100 font-medium">
                  {client.gstTreatment === 'business_gst' ? 'Registered Business' :
                    client.gstTreatment === 'business_none' ? 'Unregistered Business' :
                      client.gstTreatment === 'consumer' ? 'Consumer' :
                        client.gstTreatment === 'sez' ? 'SEZ' : 'Overseas'}
                </div>

                {client.gstin && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">GSTIN</div>
                    <div className="text-gray-900 dark:text-gray-100 font-medium">{client.gstin}</div>
                  </>
                )}
                {client.panNumber && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">PAN Number</div>
                    <div className="text-gray-900 dark:text-gray-100 font-medium">{client.panNumber}</div>
                  </>
                )}
                {client.placeOfSupply && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">Place of Supply</div>
                    <div className="text-gray-900 dark:text-gray-100">{client.placeOfSupply}</div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Address</h3>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <MapPin size={14} className="text-[#792359]" /> Billing Address
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-3 rounded-sm border border-gray-100 dark:border-white/10">
                  {client.billingAttention && <div>Attn: {client.billingAttention}</div>}
                  <div>{client.billingAddressLine1}</div>
                  {client.billingAddressLine2 && <div>{client.billingAddressLine2}</div>}
                  <div>{client.billingCity}, {client.billingState} {client.billingPinCode}</div>
                  <div>{client.billingCountry}</div>
                  {client.billingPhone && <div>Phone: {client.billingPhone}</div>}
                </div>
              </div>

              {(client.shippingAddressLine1 || client.shippingCity) && (
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Shipping Address
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.02] p-4 rounded-sm border border-gray-200 dark:border-white/10">
                    {client.shippingAttention && <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">Attn: {client.shippingAttention}</div>}
                    <div className="leading-relaxed">
                      {client.shippingAddressLine1}<br />
                      {client.shippingAddressLine2 && <>{client.shippingAddressLine2}<br /></>}
                      {client.shippingCity}, {client.shippingState} {client.shippingPinCode}<br />
                      {client.shippingCountry}
                    </div>
                    {client.shippingPhone && <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10 flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {client.shippingPhone}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
      </div >
    </div >
  );
}

