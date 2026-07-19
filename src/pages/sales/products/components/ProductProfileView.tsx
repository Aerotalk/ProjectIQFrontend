import { useState, useEffect } from 'react';
import { X, Edit } from 'lucide-react';
import type { Product } from '../../../../types/product.types';
import { ProductService } from '../../../../services/product.service';

interface Props {
  product: Product;
  onClose: () => void;
  onEdit: () => void;
}

export default function ProductProfileView({ product: initialProduct, onClose, onEdit }: Props) {
  const [product, setProduct] = useState<Product>(initialProduct);

  useEffect(() => {
    if (initialProduct.id) {
      ProductService.getProduct(initialProduct.id)
        .then(data => setProduct(data))
        .catch(console.error);
    }
  }, [initialProduct.id]);

  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#792359]/10 text-[#792359] dark:bg-[#e6a8d0]/10 dark:text-[#e6a8d0] flex items-center justify-center rounded-sm border border-[#792359]/10 dark:border-[#e6a8d0]/10 text-3xl font-bold">
            {(product.itemName || 'P').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {product.itemName}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-white border border-gray-200 text-gray-800 dark:bg-transparent dark:text-gray-300 dark:border-white/20 shadow-sm">
                {product.itemCode || product.id}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-[#792359]/10 text-[#792359] dark:bg-[#e6a8d0]/10 dark:text-[#e6a8d0] border border-[#792359]/20 dark:border-[#e6a8d0]/20 shadow-sm">
                {product.type}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium border shadow-sm ${product.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                {product.status}
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
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 border-b border-gray-200 dark:border-white/10 pb-3">
                  Identity Details
                </h3>
                <div className="grid grid-cols-[1fr_2fr] gap-y-5 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Item Type</div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">{product.type}</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Item Name</div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">{product.itemName}</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Unit</div>
                  <div className="text-gray-900 dark:text-gray-100">{product.unit}</div>

                  {product.description && (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">Description</div>
                      <div className="text-gray-900 dark:text-gray-100">{product.description}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Pricing Details */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 border-b border-gray-200 dark:border-white/10 pb-3">
                  Pricing Details
                </h3>
                <div className="grid grid-cols-[1fr_2fr] gap-y-5 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Standard Rate</div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium tracking-wide">₹ {product.standardRate?.toLocaleString('en-IN') || 0}</div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* Taxation Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 border-b border-gray-200 dark:border-white/10 pb-3">
                  Taxation Details
                </h3>
                <div className="grid grid-cols-[1fr_2fr] gap-y-5 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">GST Rate</div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium tracking-wide">{product.gstRate}</div>
                  
                  {product.hsnSac && (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">HSN/SAC Code</div>
                      <div className="text-gray-900 dark:text-gray-100 tracking-wide">{product.hsnSac}</div>
                    </>
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
