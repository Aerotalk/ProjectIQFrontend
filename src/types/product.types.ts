export type ProductType = 'Product' | 'Service';

export interface Product {
  id: string; // generated, e.g., PROD-0001
  itemCode: string;
  itemName: string;
  description?: string;
  type: ProductType;
  unit: string;
  standardRate: number;
  hsnSac?: string;
  gstRate: string;
  status: 'Active' | 'Inactive';
}
