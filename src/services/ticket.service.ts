import { z } from 'zod';
import { api } from '../lib/api';

export const ticketSchema = z.object({
  id: z.string().optional(),
  ticketNo: z.string().optional(),
  projectId: z.string().min(1, 'Project is required'),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  module: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  assignmentGroup: z.string().optional(),
  assignedTo: z.string().optional(),
  reportedBy: z.string().optional(),
  contactEmail: z.string().optional(),
  contactNumber: z.string().optional(),
  customerCompany: z.string().optional(),
  organization: z.string().optional(),
  location: z.string().optional(),
  environment: z.string().optional(),
  impact: z.string().optional(),
  urgency: z.string().optional(),
  priority: z.string().optional(),
  state: z.string().optional(),
  incidentType: z.string().optional(),
  source: z.string().optional(),
  severity: z.string().optional(),
  slaPolicy: z.string().optional(),
  dueDate: z.string().optional(),
  resolutionCode: z.string().optional(),
  resolutionNotes: z.string().optional(),
  rootCause: z.string().optional(),
  workNotes: z.string().optional(),
  customerComments: z.string().optional(),
  relatedChange: z.string().optional(),
  relatedProblem: z.string().optional(),
  parentIncident: z.string().optional(),
  duplicateOf: z.string().optional(),
  watchList: z.string().optional(),
  browser: z.string().optional(),
  operatingSystem: z.string().optional(),
  deviceType: z.string().optional(),
  ipAddress: z.string().optional(),
  resolvedOn: z.string().optional(),
  closedOn: z.string().optional(),
  closedBy: z.string().optional(),
  reopenCount: z.number().optional(),
  escalationLevel: z.string().optional(),
  tags: z.string().optional(),
  knowledgeArticle: z.string().optional(),
  businessService: z.string().optional(),
  configurationItem: z.string().optional(),
  isMajorIncident: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  attachments: z.array(z.any()).optional(),
  workNotesHistory: z.array(z.any()).optional(),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;

export const TicketService = {
  getAll: async (companyId: string): Promise<TicketFormValues[]> => {
    if (!companyId) return [];
    return await api.get(`/admin/tickets?companyId=${companyId}`);
  },

  getById: async (id: string): Promise<TicketFormValues | undefined> => {
    return await api.get(`/admin/tickets/${id}`);
  },

  create: async (companyId: string, data: Omit<TicketFormValues, 'id' | 'ticketNo' | 'createdAt' | 'updatedAt'>): Promise<TicketFormValues> => {
    return await api.post(`/admin/tickets?companyId=${companyId}`, data);
  },

  update: async (id: string, data: Omit<TicketFormValues, 'id' | 'ticketNo' | 'createdAt'>): Promise<TicketFormValues> => {
    return await api.put(`/admin/tickets/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/tickets/${id}`);
  },
};
