import type { GSTTreatment } from '../../../../types/client.types';

export const shouldShowGSTIN = (treatment: GSTTreatment) => {
  return treatment === 'business_gst' || treatment === 'sez';
};

export const shouldShowPAN = (treatment: GSTTreatment) => {
  return treatment === 'business_gst' || treatment === 'business_none' || treatment === 'sez' || treatment === 'overseas';
};

export const shouldShowPlaceOfSupply = (treatment: GSTTreatment) => {
  return treatment === 'business_gst' || treatment === 'business_none' || treatment === 'consumer' || treatment === 'sez';
};

export const shouldShowSEZFields = (treatment: GSTTreatment) => {
  return treatment === 'sez';
};

export const shouldShowOverseasFields = (treatment: GSTTreatment) => {
  return treatment === 'overseas';
};

export const shouldShowRegisteredGstAddress = (treatment: GSTTreatment) => {
  return treatment === 'business_gst';
};

export const isRequiredGSTIN = (treatment: GSTTreatment) => {
  return treatment === 'business_gst' || treatment === 'sez';
};

export const isRequiredPAN = (treatment: GSTTreatment) => {
  return treatment === 'business_gst' || treatment === 'sez';
};

export const isRequiredPlaceOfSupply = (treatment: GSTTreatment) => {
  return treatment === 'business_gst' || treatment === 'business_none' || treatment === 'consumer' || treatment === 'sez';
};

export const isRequiredOverseasFields = (treatment: GSTTreatment) => {
  return treatment === 'overseas';
};

export const GSTIN_STATE_CODES: Record<string, string> = {
  '01': 'Jammu and Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '25': 'Daman and Diu',
  '26': 'Dadra and Nagar Haveli',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh', // Old
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman and Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh', // New
  '38': 'Ladakh'
};

export const getStateFromGSTIN = (gstin: string): string | null => {
  if (!gstin || gstin.length < 2) return null;
  const code = gstin.substring(0, 2);
  return GSTIN_STATE_CODES[code] || null;
};
