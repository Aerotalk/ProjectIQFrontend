import type { Vendor } from '../types/vendor.types';

// Mock data initialization
let mockVendors: Vendor[] = [
  {
    id: 'VEND-0001',
    vendorType: 'Business',
    companyName: 'CloudServe Pvt Ltd',
    displayName: 'CloudServe Pvt Ltd',
    gstTreatment: 'business_gst',
    gstin: '27AADCB2230M1Z2',
    panNumber: 'AADCB2230M',
    placeOfSupply: 'Maharashtra',
    primaryContactPerson: 'Amit Joshi',
    email: 'amit@cloudserve.com',
    phone: '+91 98765 11111',
    billingAddressLine1: '123 Cloud Park',
    billingCity: 'Mumbai',
    billingState: 'Maharashtra',
    billingPinCode: '400001',
    billingCountry: 'India',
    sameAsBillingAddress: true,
    status: 'Active',
    bankDetails: {
      accountName: 'CloudServe Pvt Ltd',
      accountNumber: '123456789012',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank'
    }
  },
  {
    id: 'VEND-0002',
    vendorType: 'Business',
    companyName: 'SMSProvider Ltd',
    displayName: 'SMSProvider Ltd',
    gstTreatment: 'business_gst',
    gstin: '07BBDCB2230M1Z2',
    panNumber: 'BBDCB2230M',
    placeOfSupply: 'Delhi',
    primaryContactPerson: 'Riya Malhotra',
    email: 'riya@smsprovider.com',
    phone: '+91 91234 22222',
    billingAddressLine1: '456 Tech Ave',
    billingCity: 'Delhi',
    billingState: 'Delhi',
    billingPinCode: '110001',
    billingCountry: 'India',
    sameAsBillingAddress: true,
    status: 'Active',
    tdsPercentage: 2,
    reverseCharge: false
  }
];

let nextId = 3;

export const VendorService = {
  getVendors: async (): Promise<Vendor[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockVendors];
  },

  createVendor: async (data: Omit<Vendor, 'id'>): Promise<Vendor> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newVendor: Vendor = {
      ...data,
      id: `VEND-${String(nextId++).padStart(4, '0')}`
    };
    mockVendors = [newVendor, ...mockVendors];
    return newVendor;
  },

  updateVendor: async (id: string, data: Omit<Vendor, 'id'>): Promise<Vendor> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockVendors.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vendor not found');
    
    const updatedVendor = { ...data, id };
    mockVendors[index] = updatedVendor;
    return updatedVendor;
  },

  deleteVendor: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    mockVendors = mockVendors.filter(v => v.id !== id);
  }
};
