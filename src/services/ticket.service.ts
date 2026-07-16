import { z } from 'zod';
import { api } from '../lib/api';

export const ticketSchema = z.object({
  id: z.string().optional(),
  ticketNo: z.string().optional(),
  subject: z.string().min(1, 'Ticket Title is required').max(200, 'Max 200 characters'),
  description: z.string().min(1, 'Description is required'),
  client: z.string().optional(),
  clientContact: z.string().optional(),
  projectId: z.string().min(1, 'Project is required'),
  category: z.enum(['Complaint', 'Query', 'Service Request', 'Billing Issue', 'Technical Issue', 'Others']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  status: z.enum(['Open', 'In Progress', 'Closed']),
  assigned: z.string().min(1, 'Assigned Owner is required'),
  supportingMember: z.string().optional(),
  finalRemarks: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.status === 'Closed' && (!data.finalRemarks || data.finalRemarks.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Final Remarks are required to close a ticket",
      path: ["finalRemarks"]
    });
  }
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
