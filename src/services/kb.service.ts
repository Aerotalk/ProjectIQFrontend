import { z } from 'zod';
import { api } from '../lib/api';

export const kbSchema = z.object({
  id: z.string().nullable().optional(),
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().nullable().optional(),
  symptoms: z.string().min(1, 'Symptoms / Description is required'),
  cause: z.string().optional(),
  workaround: z.string().optional(),
  ci: z.string().optional(),
  errorCode: z.string().optional(),
  author: z.string().nullable().optional(),
  status: z.enum(['Draft', 'Published']),
  tags: z.array(z.string()).nullable().optional(),
  updatedAt: z.string().nullable().optional()
});

export type KBFormValues = z.infer<typeof kbSchema>;

const unpackArticle = (art: any): KBFormValues => {
  let symptoms = art.content || '';
  let cause = '';
  let workaround = '';
  let ci = '';
  let errorCode = '';

  try {
    if (art.content && art.content.startsWith('{')) {
      const parsed = JSON.parse(art.content);
      symptoms = parsed.symptoms || '';
      cause = parsed.cause || '';
      workaround = parsed.workaround || '';
      ci = parsed.ci || '';
      errorCode = parsed.errorCode || '';
    }
  } catch (e) {
    console.error("Error parsing content as JSON", e);
  }

  return {
    ...art,
    symptoms,
    cause,
    workaround,
    ci,
    errorCode,
    content: art.content || ''
  };
};

const packArticle = (data: KBFormValues) => {
  const serializedContent = JSON.stringify({
    symptoms: data.symptoms || '',
    cause: data.cause || '',
    workaround: data.workaround || '',
    ci: data.ci || '',
    errorCode: data.errorCode || ''
  });

  return {
    title: data.title,
    category: data.category,
    status: data.status,
    content: serializedContent,
    author: data.author || 'System Admin'
  };
};

export const KBService = {
  getAll: async (companyId: string): Promise<KBFormValues[]> => {
    if (!companyId) return [];
    const list: any[] = await api.get(`/admin/kb?companyId=${companyId}`);
    return list.map(unpackArticle);
  },

  getById: async (id: string): Promise<KBFormValues | undefined> => {
    const art = await api.get(`/admin/kb/${id}`);
    return art ? unpackArticle(art) : undefined;
  },

  create: async (companyId: string, data: Omit<KBFormValues, 'id' | 'updatedAt'>): Promise<KBFormValues> => {
    const payload = packArticle(data as KBFormValues);
    const result = await api.post(`/admin/kb?companyId=${companyId}`, payload);
    return unpackArticle(result);
  },

  update: async (id: string, data: Omit<KBFormValues, 'id' | 'updatedAt'>): Promise<KBFormValues> => {
    const payload = packArticle(data as KBFormValues);
    const result = await api.put(`/admin/kb/${id}`, payload);
    return unpackArticle(result);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/kb/${id}`);
  }
};
