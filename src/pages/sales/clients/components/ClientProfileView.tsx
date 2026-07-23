import { X, Edit } from 'lucide-react';
import type { Client } from '../../../../types/client.types';

interface Props {
  client: Client;
  onClose: () => void;
  onEdit: () => void;
}

export default function ClientProfileView({ client, onClose, onEdit }: Props) {
  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-lg shadow-sm border border-gray-200 dark:border-white/5 flex flex-col h-full select-none">
      
      {/* ── Header ── */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-pink-50 text-[#792359] dark:bg-[#792359]/20 dark:text-[#e6a8d0] flex items-center justify-center rounded-md text-2xl font-bold shrink-0">
            {(client.companyName || client.displayName || 'C').charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase">
              {client.companyName || client.displayName}
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300 font-medium">
                {client.clientNo || 'N/A'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 font-medium">
                {client.customerType}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-medium ${
                client.status === 'Active' 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                  : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
              }`}>
                {client.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <Edit size={16} /> 
            <span>Edit Profile</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10 max-w-5xl">
          
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            
            {/* Identity Details */}
            <div className="space-y-4">
              <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide border-b border-gray-100 dark:border-white/5 pb-2">
                IDENTITY DETAILS
              </h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Customer Type</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.customerType}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Company Name</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.companyName || client.displayName}</span>
                </div>
              </div>
            </div>

            {/* Primary Contact */}
            <div className="space-y-4">
              <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide border-b border-gray-100 dark:border-white/5 pb-2">
                PRIMARY CONTACT
              </h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Contact Person</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.primaryContactPerson || '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Designation</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.designation || '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Email</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.email || '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Phone</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.phone || '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Alt Phone</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.alternatePhone || '—'}</span>
                </div>
              </div>
            </div>

            {/* Additional Contacts */}
            {client.additionalContacts && client.additionalContacts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide border-b border-gray-100 dark:border-white/5 pb-2">
                  ADDITIONAL CONTACTS
                </h3>
                <div className="space-y-4">
                  {client.additionalContacts.map((contact, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-white/5 p-4 rounded-md text-sm">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white block">{contact.name}</span>
                            {contact.designation && <span className="text-gray-500 dark:text-gray-400 text-xs">{contact.designation}</span>}
                          </div>
                          {contact.role && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-300 text-[10px] font-medium uppercase tracking-wider">
                              {contact.role}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1.5 pt-2 border-t border-gray-200 dark:border-white/10">
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-gray-500 dark:text-gray-400">Email</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100 col-span-2">{contact.email || '—'}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-gray-500 dark:text-gray-400">Phone</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100 col-span-2">{contact.phone || '—'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            
            {/* Tax & Compliance */}
            <div className="space-y-4">
              <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide border-b border-gray-100 dark:border-white/5 pb-2">
                TAX & COMPLIANCE
              </h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">GST Treatment</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {client.gstTreatment === 'business_gst' ? 'Registered Business' :
                     client.gstTreatment === 'business_none' ? 'Unregistered Business' :
                     client.gstTreatment === 'consumer' ? 'Consumer' :
                     client.gstTreatment === 'sez' ? 'SEZ' : 'Overseas'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">GSTIN</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.gstin || '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">PAN Number</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.panNumber || '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Place of Supply</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.placeOfSupply || '—'}</span>
                </div>
              </div>
            </div>

            {/* Commercial Details */}
            <div className="space-y-4">
              <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide border-b border-gray-100 dark:border-white/5 pb-2">
                COMMERCIAL DETAILS
              </h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Industry</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.industry || '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Payment Terms</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.paymentTerms || '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Credit Limit</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.creditLimit || '—'}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide border-b border-gray-100 dark:border-white/5 pb-2">
                ADDRESS
              </h3>
              <div className="space-y-4">
                
                {/* Billing Address Card */}
                <div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block mb-2">Billing Address</span>
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-md text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                    {client.billingAttention && <div className="text-gray-900 dark:text-white mb-1">Attn: {client.billingAttention}</div>}
                    <div>
                      {client.billingAddressLine1}<br />
                      {client.billingAddressLine2 && <>{client.billingAddressLine2}<br /></>}
                      {client.billingCity}, {client.billingState} {client.billingPinCode}<br />
                      {client.billingCountry || 'IN'}
                    </div>
                    {client.phone && <div className="mt-4">Phone: {client.phone}</div>}
                  </div>
                </div>

                {/* Shipping Address Card */}
                <div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block mb-2">Shipping Address</span>
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-md text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                    {client.shippingAddressLine1 ? (
                      <>
                        {client.shippingAttention && <div className="text-gray-900 dark:text-white mb-1">Attn: {client.shippingAttention}</div>}
                        <div className="border-b border-gray-200 dark:border-white/10 pb-4 mb-4">
                          {client.shippingAddressLine1}<br />
                          {client.shippingAddressLine2 && <>{client.shippingAddressLine2}<br /></>}
                          {client.shippingCity}, {client.shippingState} {client.shippingPinCode}<br />
                          {client.shippingCountry || 'IN'}
                        </div>
                        {client.phone && <div>Phone: {client.phone}</div>}
                      </>
                    ) : (
                      <span className="italic text-gray-400">Same as billing address</span>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
