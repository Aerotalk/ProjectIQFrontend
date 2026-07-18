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
