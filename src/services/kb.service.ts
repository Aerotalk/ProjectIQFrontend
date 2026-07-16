import { z } from 'zod';
import { api } from '../lib/api';

export const kbSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().optional(),
  status: z.enum(['Draft', 'Published']),
  tags: z.array(z.string()).optional(),
  updatedAt: z.string().optional()
});

export type KBFormValues = z.infer<typeof kbSchema>;

export const KBService = {
  getAll: async (companyId: string): Promise<KBFormValues[]> => {
    if (!companyId) return [];
    return await api.get(`/admin/kb?companyId=${companyId}`);
  },

  getById: async (id: string): Promise<KBFormValues | undefined> => {
    return await api.get(`/admin/kb/${id}`);
  },

  create: async (companyId: string, data: Omit<KBFormValues, 'id' | 'updatedAt'>): Promise<KBFormValues> => {
    return await api.post(`/admin/kb?companyId=${companyId}`, data);
  },

  update: async (id: string, data: Omit<KBFormValues, 'id' | 'updatedAt'>): Promise<KBFormValues> => {
    return await api.put(`/admin/kb/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/kb/${id}`);
  }
};
