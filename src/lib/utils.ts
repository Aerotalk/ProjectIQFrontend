import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatQuotationId(rawId: string | undefined): string {
  if (!rawId) return 'QT/2026/0001';
  if (rawId.startsWith('QT/2026/')) return rawId;
  const numMatch = rawId.match(/\d+$/);
  if (numMatch) {
    return `QT/2026/${numMatch[0].padStart(4, '0')}`;
  }
  return `QT/2026/0001`;
}

export function numberToWords(num: number): string {
  if (!num || num === 0) return 'Zero Rupees Only';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convertNumber = (nStr: string) => {
    const n = ('000000000' + nStr).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != '00') ? (a[Number(n[1])] || b[n[1][0] as any] + ' ' + a[n[1][1] as any]) + 'Crore ' : '';
    str += (n[2] != '00') ? (a[Number(n[2])] || b[n[2][0] as any] + ' ' + a[n[2][1] as any]) + 'Lakh ' : '';
    str += (n[3] != '00') ? (a[Number(n[3])] || b[n[3][0] as any] + ' ' + a[n[3][1] as any]) + 'Thousand ' : '';
    str += (n[4] != '0') ? (a[Number(n[4])] || b[n[4][0] as any] + ' ' + a[n[4][1] as any]) + 'Hundred ' : '';
    str += (n[5] != '00') ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0] as any] + ' ' + a[n[5][1] as any]) : '';
    return str.trim();
  };

  const parts = num.toFixed(2).split('.');
  const rupees = parseInt(parts[0], 10);
  const paise = parseInt(parts[1], 10);

  let result = '';
  if (rupees > 0) {
    if (rupees.toString().length > 9) return 'Amount too large';
    result += convertNumber(rupees.toString()) + ' Rupees';
  }

  if (paise > 0) {
    const paiseStr = convertNumber(paise.toString());
    if (result) {
      result += ' and ' + paiseStr + ' Paise';
    } else {
      result += paiseStr + ' Paise';
    }
  }

  return result ? result + ' Only' : 'Zero Rupees Only';
}
