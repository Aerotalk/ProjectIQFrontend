import type { Product } from '../../types/product.types';

export interface ProductDto {
  id: string;
  itemCode: string;
  itemName: string;
  description?: string;
  type: string;
  unit: string;
  standardRate: number;
  hsnSac?: string;
  gstRate: string;
  status: string;
}

export const mapToProduct = (dto: ProductDto): Product => {
  return {
    id: dto.id,
    itemCode: dto.itemCode,
    itemName: dto.itemName,
    description: dto.description,
    type: dto.type as 'Product' | 'Service',
    unit: dto.unit,
    standardRate: dto.standardRate,
    hsnSac: dto.hsnSac,
    gstRate: dto.gstRate,
    status: dto.status as 'Active' | 'Inactive',
  };
};

export const mapToProductDto = (product: Partial<Product>): Partial<ProductDto> => {
  const { ...restOfProduct } = product;
  return restOfProduct;
};
