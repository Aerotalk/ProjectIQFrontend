import type { Client } from '../types/client.types';

// Mock data initialization
let mockClients: Client[] = [
  {
    id: 'CUST-0001',
    customerType: 'Business',
    companyName: 'TechNova Pvt Ltd',
    displayName: 'TechNova Pvt Ltd',
    gstTreatment: 'business_gst',
    gstin: '27AADCB2230M1Z2',
    panNumber: 'AADCB2230M',
    placeOfSupply: 'Maharashtra',
    primaryContactPerson: 'Raj Mehta',
    email: 'raj.mehta@technova.com',
    phone: '+91 98765 43210',
    billingAddressLine1: '123 Tech Park',
    billingCity: 'Mumbai',
    billingState: 'Maharashtra',
    billingPinCode: '400001',
    billingCountry: 'India',
    sameAsBillingAddress: true,
    status: 'Active'
  },
  {
    id: 'CUST-0002',
    customerType: 'Business',
    companyName: 'Glober Corporation',
    displayName: 'Glober Corporation',
    gstTreatment: 'overseas',
    country: 'United States',
    currency: 'USD',
    primaryContactPerson: 'Neha Verma',
    email: 'neha.verma@glober.com',
    phone: '+1 555 123 4567',
    billingAddressLine1: '456 Global Ave',
    billingCity: 'New York',
    billingCountry: 'United States',
    sameAsBillingAddress: true,
    status: 'Active'
  }
];

let nextId = 3;

export const ClientService = {
  getClients: async (): Promise<Client[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockClients];
  },

  createClient: async (data: Omit<Client, 'id'>): Promise<Client> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newClient: Client = {
      ...data,
      id: `CUST-${String(nextId++).padStart(4, '0')}`
    };
    mockClients = [newClient, ...mockClients];
    return newClient;
  },

  updateClient: async (id: string, data: Omit<Client, 'id'>): Promise<Client> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Client not found');
    
    const updatedClient = { ...data, id };
    mockClients[index] = updatedClient;
    return updatedClient;
  },

  deleteClient: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    mockClients = mockClients.filter(c => c.id !== id);
  }
};
