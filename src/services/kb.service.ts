import { z } from 'zod';

export const kbSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().optional(),
  status: z.enum(['Draft', 'Published']),
  tags: z.array(z.string()).optional(),
});

export type KBFormValues = z.infer<typeof kbSchema>;

export const MOCK_KB_ARTICLES = [
  { id: 'KB001', title: 'How to reset your password', category: 'General', status: 'Published', author: 'System Admin', updated: '2 days ago', content: 'Go to settings and click reset password.' },
  { id: 'KB002', title: 'Troubleshooting API Errors', category: 'Technical', status: 'Published', author: 'Dev Team', updated: '1 week ago', content: 'Check your API token and rate limits.' },
  { id: 'KB003', title: 'Setting up SSO Integration', category: 'Security', status: 'Draft', author: 'Security Team', updated: '3 hours ago', content: 'Navigate to Security > SSO and follow the wizard.' }
];
