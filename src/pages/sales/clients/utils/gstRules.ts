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
