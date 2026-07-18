import { z } from 'zod';
import { api } from '../lib/api';

export const ticketSchema = z.object({
  id: z.string().nullable().optional(),
  ticketNo: z.string().nullable().optional(),
  projectId: z.string().min(1, 'Project is required'),
  shortDescription: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  module: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  subCategory: z.string().nullable().optional(),
  assignmentGroup: z.string().nullable().optional(),
  assignedTo: z.string().nullable().optional(),
  reportedBy: z.string().nullable().optional(),
  contactEmail: z.string().nullable().optional(),
  contactNumber: z.string().nullable().optional(),
  customerCompany: z.string().nullable().optional(),
  organization: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  environment: z.string().nullable().optional(),
  impact: z.string().nullable().optional(),
  urgency: z.string().nullable().optional(),
  priority: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  incidentType: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  severity: z.string().nullable().optional(),
  slaPolicy: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  resolutionCode: z.string().nullable().optional(),
  resolutionNotes: z.string().nullable().optional(),
  rootCause: z.string().nullable().optional(),
  workNotes: z.string().nullable().optional(),
  customerComments: z.string().nullable().optional(),
  relatedChange: z.string().nullable().optional(),
  relatedProblem: z.string().nullable().optional(),
  parentIncident: z.string().nullable().optional(),
  duplicateOf: z.string().nullable().optional(),
  watchList: z.string().nullable().optional(),
  browser: z.string().nullable().optional(),
  operatingSystem: z.string().nullable().optional(),
  deviceType: z.string().nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  resolvedOn: z.string().nullable().optional(),
  closedOn: z.string().nullable().optional(),
  closedBy: z.string().nullable().optional(),
  reopenCount: z.number().nullable().optional(),
  escalationLevel: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
  knowledgeArticle: z.string().nullable().optional(),
  businessService: z.string().nullable().optional(),
  configurationItem: z.string().nullable().optional(),
  isMajorIncident: z.boolean().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  attachments: z.array(z.any()).nullable().optional(),
  workNotesHistory: z.array(z.any()).nullable().optional(),
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
