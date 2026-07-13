import type { GSTTreatment } from '../../../../types/client.types';

export const shouldShowGSTIN = (treatment: GSTTreatment) => {
  return treatment === 'business_gst' || treatment === 'sez';
};

export const shouldShowPAN = (treatment: GSTTreatment) => {
  return treatment === 'business_gst' || treatment === 'business_none' || treatment === 'sez';
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

export const isRequiredGSTIN = (treatment: GSTTreatment) => {
  return treatment === 'business_gst' || treatment === 'sez';
};

export const isRequiredPAN = (treatment: GSTTreatment) => {
  // PAN is Auto for business_gst and sez (extracted from GSTIN), Optional for business_none
  // But required to be present basically if GSTIN is there. We can mark it required internally.
  return treatment === 'business_gst' || treatment === 'sez';
};

export const isRequiredPlaceOfSupply = (treatment: GSTTreatment) => {
  return treatment === 'business_gst' || treatment === 'business_none' || treatment === 'consumer' || treatment === 'sez';
};

export const isRequiredOverseasFields = (treatment: GSTTreatment) => {
  return treatment === 'overseas';
};
