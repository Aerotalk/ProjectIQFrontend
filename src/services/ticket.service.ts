import { z } from 'zod';

export const ticketSchema = z.object({
  id: z.string().optional(),
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
  updated: z.string().optional()
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

export const MOCK_TICKETS = [
  { id: 'TKT-0001', subject: 'Issue with login to portal', client: 'TechNova Pvt Ltd', projectId: 'PRJ-001', category: 'Technical Issue', priority: 'Critical', status: 'Open', assigned: 'Arjun Dev', updated: '10m ago', description: 'User cannot login.' },
  { id: 'TKT-0002', subject: 'Unable to access reports', client: 'Globex Corporation', projectId: 'PRJ-002', category: 'Technical Issue', priority: 'Medium', status: 'In Progress', assigned: 'Sneha Iyer', updated: '35m ago', description: 'Reports page is throwing 500 error.' },
  { id: 'TKT-0003', subject: 'API integration failure', client: 'Hexa Finance', projectId: 'PRJ-003', category: 'Technical Issue', priority: 'High', status: 'Open', assigned: 'Rohit Singh', updated: '1h ago', description: 'Payment gateway API not responding.' },
  { id: 'TKT-0004', subject: 'Data sync not working', client: 'NextGen Retail', projectId: 'PRJ-004', category: 'Query', priority: 'Low', status: 'Closed', assigned: 'Amit Verma', updated: '2h ago', description: 'Offline data not syncing to cloud.', finalRemarks: 'Restarted sync service.' },
  { id: 'TKT-0005', subject: 'Payment gateway error', client: 'BlueStone Ltd', projectId: 'PRJ-005', category: 'Billing Issue', priority: 'Medium', status: 'In Progress', assigned: 'Neha Patil', updated: '3h ago', description: 'Getting invalid token error on checkout.' }
];
