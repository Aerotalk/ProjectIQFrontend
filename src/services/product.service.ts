import type { Product } from '../types/product.types';

// Mock data initialization
let mockProducts: Product[] = [
  {
    id: 'PROD-0001',
    itemCode: 'ITEM-001',
    itemName: 'Premium SaaS Subscription',
    description: 'Monthly enterprise subscription',
    type: 'Service',
    unit: 'Months',
    standardRate: 50000,
    hsnSac: '9983',
    gstRate: '18%',
    status: 'Active'
  },
  {
    id: 'PROD-0002',
    itemCode: 'ITEM-002',
    itemName: 'Consulting Hours',
    description: 'Technical consulting per hour',
    type: 'Service',
    unit: 'Hours',
    standardRate: 2500,
    hsnSac: '998311',
    gstRate: '18%',
    status: 'Active'
  },
  {
    id: 'PROD-0003',
    itemCode: 'ITEM-003',
    itemName: 'Server Hardware Type A',
    description: 'Rackmount server',
    type: 'Product',
    unit: 'Pieces',
    standardRate: 150000,
    hsnSac: '8471',
    gstRate: '18%',
    status: 'Active'
  }
];

let nextId = 4;

export const ProductService = {
  getProducts: async (): Promise<Product[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockProducts];
  },

  createProduct: async (data: Omit<Product, 'id'>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newProduct: Product = {
      ...data,
      id: `PROD-${String(nextId++).padStart(4, '0')}`
    };
    mockProducts = [newProduct, ...mockProducts];
    return newProduct;
  },

  updateProduct: async (id: string, data: Omit<Product, 'id'>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    const updatedProduct = { ...data, id };
    mockProducts[index] = updatedProduct;
    return updatedProduct;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    mockProducts = mockProducts.filter(p => p.id !== id);
  }
};
