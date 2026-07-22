export interface CalcLineItem {
  qty: number;
  rate: number;
  discount?: number;
  discountType?: 'FLAT' | 'PERCENTAGE';
  gstRate?: number;
}

export function calculateQuotationTotals(
  lineItems: CalcLineItem[],
  globalDiscount: number = 0, // Used ONLY if applying an overall post-tax discount, though typically 0.
  deliveryCost: number = 0
) {
  let subTotal = 0; // Sum of Qty * Rate
  let totalLineDiscount = 0;
  let totalTaxableAmount = 0;
  let totalGstAmount = 0;
  let grandTotal = 0;

  const calculatedLines = lineItems.map((item) => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const discountValue = Number(item.discount) || 0;
    const gstRate = Number(item.gstRate ?? (item as any).gst) || 0;

    const rowSubTotal = qty * rate; // pre-discount amount
    const itemDiscountAmount =
      item.discountType === 'PERCENTAGE'
        ? (rowSubTotal * discountValue) / 100
        : discountValue;

    const rowTaxableAmount = Math.max(0, rowSubTotal - itemDiscountAmount);
    const rowGstAmount = rowTaxableAmount * (gstRate / 100);
    const rowTotalAmount = rowTaxableAmount + rowGstAmount;

    return {
      ...item,
      rowSubTotal,
      itemDiscountAmount,
      rowTaxableAmount,
      rowGstAmount,
      rowTotalAmount,
    };
  });

  calculatedLines.forEach((line) => {
    subTotal += line.rowSubTotal;
    totalLineDiscount += line.itemDiscountAmount;
    totalTaxableAmount += line.rowTaxableAmount;
    totalGstAmount += line.rowGstAmount;
  });

  const totalDiscount = totalLineDiscount + (Number(globalDiscount) || 0);
  
  // Grand total applies delivery cost (taxable independently if needed, but here simple addition)
  // and subtracts global discount at the end (if any).
  grandTotal = totalTaxableAmount + totalGstAmount + (Number(deliveryCost) || 0) - (Number(globalDiscount) || 0);

  // Generate tax breakdown
  const taxGroups: Record<number, { taxable: number; taxAmount: number }> = {};
  calculatedLines.forEach((line) => {
    const gstRate = line.gstRate || 0;
    if (gstRate > 0) {
      if (!taxGroups[gstRate]) taxGroups[gstRate] = { taxable: 0, taxAmount: 0 };
      taxGroups[gstRate].taxable += line.rowTaxableAmount;
      taxGroups[gstRate].taxAmount += line.rowGstAmount;
    }
  });

  return {
    calculatedLines,
    subTotal,
    totalLineDiscount,
    totalDiscount,
    totalTaxableAmount,
    totalGstAmount,
    deliveryCost: Number(deliveryCost) || 0,
    globalDiscount: Number(globalDiscount) || 0,
    grandTotal,
    taxGroups
  };
}
