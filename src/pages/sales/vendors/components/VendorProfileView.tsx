import { X, Edit, Building2, User, Phone, Mail, MapPin, Briefcase, FileText, Shield } from 'lucide-react';
import type { Vendor } from '../../../../types/vendor.types';

interface Props {
  vendor: Vendor;
  onClose: () => void;
  onEdit: () => void;
}

export default function VendorProfileView({ vendor, onClose, onEdit }: Props) {
  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#792359]/10 text-[#792359] dark:bg-[#e6a8d0]/10 dark:text-[#e6a8d0] flex items-center justify-center rounded-sm border border-[#792359]/10 dark:border-[#e6a8d0]/10 text-3xl font-bold">
            {(vendor.displayName || vendor.companyName || vendor.firstName || 'V').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {vendor.displayName}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-white border border-gray-200 text-gray-800 dark:bg-transparent dark:text-gray-300 dark:border-white/20 shadow-sm">
                {vendor.id}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-[#792359]/10 text-[#792359] dark:bg-[#e6a8d0]/10 dark:text-[#e6a8d0] border border-[#792359]/20 dark:border-[#e6a8d0]/20 shadow-sm">
                {vendor.vendorType}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium border shadow-sm ${vendor.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                {vendor.status}
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
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
            
            {/* Left Column */}
            <div className="space-y-12">
              {/* Identity Details */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-3">
                  <FileText size={16} className="text-[#792359] dark:text-[#e6a8d0]" /> Identity Details
                </h3>
                <div className="grid grid-cols-[1fr_2fr] gap-y-5 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Vendor Type</div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">{vendor.vendorType}</div>
                  
                  {vendor.vendorType === 'Business' && (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">Company Name</div>
                      <div className="text-gray-900 dark:text-gray-100 font-medium">{vendor.companyName || '-'}</div>
                    </>
                  )}
                  {vendor.vendorType === 'Individual' && (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">First Name</div>
                      <div className="text-gray-900 dark:text-gray-100 font-medium">{vendor.firstName || '-'}</div>
                      <div className="text-gray-500 dark:text-gray-400">Last Name</div>
                      <div className="text-gray-900 dark:text-gray-100 font-medium">{vendor.lastName || '-'}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Primary Contact */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-3">
                  <User size={16} className="text-[#792359] dark:text-[#e6a8d0]" /> Primary Contact
                </h3>
                <div className="grid grid-cols-[1fr_2fr] gap-y-5 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Person</div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">{vendor.primaryContactPerson || '-'}</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Designation</div>
                  <div className="text-gray-900 dark:text-gray-100">{vendor.designation || '-'}</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Email</div>
                  <div className="text-gray-900 dark:text-gray-100">{vendor.email || '-'}</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Phone</div>
                  <div className="text-gray-900 dark:text-gray-100">{vendor.phone || '-'}</div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* Tax & Compliance */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-3">
                  <Shield size={16} className="text-[#792359] dark:text-[#e6a8d0]" /> Tax & Compliance
                </h3>
                <div className="grid grid-cols-[1fr_2fr] gap-y-5 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">GST Treatment</div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {vendor.gstTreatment === 'business_gst' ? 'Registered Business' :
                     vendor.gstTreatment === 'business_none' ? 'Unregistered Business' :
                     vendor.gstTreatment === 'consumer' ? 'Consumer' :
                     vendor.gstTreatment === 'sez' ? 'SEZ' : 'Overseas'}
                  </div>
                  
                  {vendor.gstin && (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">GSTIN</div>
                      <div className="text-gray-900 dark:text-gray-100 font-medium tracking-wide">{vendor.gstin}</div>
                    </>
                  )}
                  {vendor.panNumber && (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">PAN Number</div>
                      <div className="text-gray-900 dark:text-gray-100 font-medium tracking-wide">{vendor.panNumber}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-3">
                  <MapPin size={16} className="text-[#792359] dark:text-[#e6a8d0]" /> Address Details
                </h3>
                <div className="space-y-6">
                  
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Billing Address
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.02] p-4 rounded-sm border border-gray-200 dark:border-white/10">
                      <div className="leading-relaxed">
                        {vendor.billingAddressLine1}<br/>
                        {vendor.billingAddressLine2 && <>{vendor.billingAddressLine2}<br/></>}
                        {vendor.billingCity}, {vendor.billingState} {vendor.billingPinCode}<br/>
                        {vendor.billingCountry}
                      </div>
                    </div>
                  </div>

                  {!vendor.sameAsBillingAddress && (vendor.shippingAddressLine1 || vendor.shippingCity) && (
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Shipping Address
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.02] p-4 rounded-sm border border-gray-200 dark:border-white/10">
                        <div className="leading-relaxed">
                          {vendor.shippingAddressLine1}<br/>
                          {vendor.shippingAddressLine2 && <>{vendor.shippingAddressLine2}<br/></>}
                          {vendor.shippingCity}, {vendor.shippingState} {vendor.shippingPinCode}<br/>
                          {vendor.shippingCountry}
                        </div>
                      </div>
                    </div>
                  )}
                  {vendor.sameAsBillingAddress && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Shipping address is same as billing address.
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
