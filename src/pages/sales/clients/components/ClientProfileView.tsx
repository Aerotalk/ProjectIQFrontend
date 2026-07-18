import { X, Edit, Building2, User, Phone, Mail, MapPin, Briefcase, FileText, CreditCard, DollarSign } from 'lucide-react';
import type { Client } from '../../../../types/client.types';

interface Props {
  client: Client;
  onClose: () => void;
  onEdit: () => void;
}

export default function ClientProfileView({ client, onClose, onEdit }: Props) {
  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#792359]/10 text-[#792359] dark:bg-[#e6a8d0]/10 dark:text-[#e6a8d0] flex items-center justify-center rounded-sm">
            {client.customerType === 'Business' ? <Building2 size={24} /> : <User size={24} />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {client.displayName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {client.clientNo || client.id} • {client.customerType} • <span className={client.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>{client.status}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <Edit size={16} /> Edit Profile
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
          
          {/* Left Column */}
          <div className="space-y-8">
            {/* Identity & Contact Section */}
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
                
                {client.industry && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">Industry</div>
                    <div className="text-gray-900 dark:text-gray-100 font-medium">{client.industry}</div>
                  </>
                )}
                
                {client.country && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">Country</div>
                    <div className="text-gray-900 dark:text-gray-100 font-medium">{client.country}</div>
                  </>
                )}
              </div>
            </div>

            {/* Primary Contact */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Primary Contact</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><User size={14}/> Contact Person</div>
                <div className="text-gray-900 dark:text-gray-100 font-medium">{client.primaryContactPerson || '-'}</div>
                
                <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Briefcase size={14}/> Designation</div>
                <div className="text-gray-900 dark:text-gray-100">{client.designation || '-'}</div>
                
                <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Mail size={14}/> Email</div>
                <div className="text-gray-900 dark:text-gray-100 break-all">{client.email || '-'}</div>
                
                <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Phone size={14}/> Phone</div>
                <div className="text-gray-900 dark:text-gray-100">{client.phone || '-'}</div>
                
                {client.alternatePhone && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Phone size={14}/> Alt Phone</div>
                    <div className="text-gray-900 dark:text-gray-100">{client.alternatePhone}</div>
                  </>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Address</h3>
              
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <MapPin size={14} className="text-[#792359]" /> Billing Address
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-3 rounded-sm border border-gray-100 dark:border-white/10">
                  {client.billingAttention && <div className="font-medium text-gray-800 dark:text-gray-200">Attn: {client.billingAttention}</div>}
                  <div>{client.billingAddressLine1}</div>
                  {client.billingAddressLine2 && <div>{client.billingAddressLine2}</div>}
                  <div>{client.billingCity}, {client.billingState} {client.billingPinCode}</div>
                  <div>{client.billingCountry}</div>
                  {client.billingPhone && <div className="mt-1">Phone: {client.billingPhone}</div>}
                </div>
              </div>

              {!client.sameAsBillingAddress && client.shippingAddressLine1 && (
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <MapPin size={14} className="text-[#792359]" /> Shipping Address
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-3 rounded-sm border border-gray-100 dark:border-white/10">
                    {client.shippingAttention && <div className="font-medium text-gray-800 dark:text-gray-200">Attn: {client.shippingAttention}</div>}
                    <div>{client.shippingAddressLine1}</div>
                    {client.shippingAddressLine2 && <div>{client.shippingAddressLine2}</div>}
                    <div>{client.shippingCity}, {client.shippingState} {client.shippingPinCode}</div>
                    <div>{client.shippingCountry}</div>
                    {client.shippingPhone && <div className="mt-1">Phone: {client.shippingPhone}</div>}
                  </div>
                </div>
              )}
              {client.sameAsBillingAddress && (
                <div className="text-xs text-gray-500 italic mt-2">Shipping address is same as billing address.</div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Tax & Compliance Section */}
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
                {client.sezUnitName && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">SEZ Unit Name</div>
                    <div className="text-gray-900 dark:text-gray-100">{client.sezUnitName}</div>
                  </>
                )}
                {client.lutBondNo && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">LUT/Bond No</div>
                    <div className="text-gray-900 dark:text-gray-100">{client.lutBondNo}</div>
                  </>
                )}
                {client.foreignTaxId && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">Foreign Tax ID</div>
                    <div className="text-gray-900 dark:text-gray-100">{client.foreignTaxId}</div>
                  </>
                )}
              </div>
            </div>

            {/* Commercial & Financial */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Commercial Details</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><DollarSign size={14}/> Currency</div>
                <div className="text-gray-900 dark:text-gray-100 font-medium">{client.currency || 'INR'}</div>

                <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><FileText size={14}/> Payment Terms</div>
                <div className="text-gray-900 dark:text-gray-100 font-medium">{client.paymentTerms || '-'}</div>

                <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><CreditCard size={14}/> Credit Limit</div>
                <div className="text-gray-900 dark:text-gray-100 font-medium">
                  {client.creditLimit ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: client.currency || 'INR' }).format(client.creditLimit) : '-'}
                </div>
              </div>
            </div>

            {/* Notes */}
            {client.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Notes</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-3 rounded-sm border border-gray-100 dark:border-white/10 whitespace-pre-wrap">
                  {client.notes}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
