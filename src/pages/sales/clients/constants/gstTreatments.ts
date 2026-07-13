import type { GSTTreatment } from '../../../../types/client.types';

export interface GSTTreatmentOption {
  value: GSTTreatment;
  label: string;
  description: string;
  badge?: string;
}

export const GST_TREATMENTS: GSTTreatmentOption[] = [
  {
    value: 'business_gst',
    label: 'Registered Business',
    description: 'Has a valid GSTIN. A company you buy from or sell to that files GST returns.',
  },
  {
    value: 'business_none',
    label: 'Unregistered Business',
    description: 'A business without GSTIN. No GST collected on sales; reverse charge may apply on purchases.',
  },
  {
    value: 'consumer',
    label: 'Consumer',
    description: 'Individual end consumer. No business, no GSTIN. GST is charged but no B2B invoice needed.',
  },
  {
    value: 'sez',
    label: 'SEZ / Deemed Export',
    description: 'Customer in a Special Economic Zone. Supply is zero-rated.',
  },
  {
    value: 'overseas',
    label: 'Overseas',
    description: 'Foreign customer or vendor. No Indian GST. Export/import rules apply.',
  }
];
