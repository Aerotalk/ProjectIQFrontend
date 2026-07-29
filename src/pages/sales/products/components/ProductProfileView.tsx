import { useState, useEffect } from 'react';
import { 
  X, Edit, Box, DollarSign, Info
} from 'lucide-react';
import type { Product } from '../../../../types/product.types';
import { ProductService } from '../../../../services/product.service';

interface Props {
  product: Product;
  onClose: () => void;
  onEdit: () => void;
}

export default function ProductProfileView({ product: initialProduct, onClose, onEdit }: Props) {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [activeTab, setActiveTab] = useState<'overview'>('overview');

  useEffect(() => {
    if (initialProduct.id) {
      ProductService.getProduct(initialProduct.id)
        .then(data => setProduct(data))
        .catch(console.error);
    }
  }, [initialProduct.id]);

  return (
    <div className="w-full bg-gray-50 dark:bg-[#0a0a0a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col min-h-[calc(100vh-8rem)] overflow-hidden transition-colors duration-300">
      
      {/* ── 1. Header Section ── */}
      <div className="px-6 py-5 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary text-white flex items-center justify-center rounded-lg text-2xl font-bold shrink-0 shadow-sm">
            {(product.itemName || 'P').charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              {product.itemName}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {product.itemCode || product.id}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50">
                {product.type}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${
                product.status === 'Active' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' 
                  : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {product.status}
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
          { id: 'overview', label: 'Product Details', icon: <Box size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-primary text-primary dark:text-secondary dark:border-secondary' 
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT PROFILE COLUMN */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* Identity Details Box */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="text-gray-400" size={18} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Identity Details</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Product Type</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{product.type}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Item Code</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{product.itemCode || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Unit of Measure</span>
                    <span className="text-sm text-gray-800 dark:text-gray-300">{product.unit}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Pricing & Taxation */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="text-gray-400" size={18} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Pricing & Taxation</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Selling Price</span>
                      <span className="text-xl font-bold text-primary dark:text-secondary">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.standardRate)}
                      </span>
                    </div>
                    {product.description && (
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Description</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{product.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-4 md:pt-0 md:pl-8">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Tax Preference</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{product.gstRate !== '0' ? 'Taxable' : 'Non-Taxable'}</span>
                    </div>
                    
                    {product.gstRate !== '0' && product.hsnSac && (
                      <>
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">HSN/SAC Code</span>
                          <span className="text-sm font-mono text-gray-800 dark:text-gray-300">{product.hsnSac}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Applicable Tax</span>
                          <span className="text-sm text-gray-800 dark:text-gray-300">
                            GST {product.gstRate}%
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
