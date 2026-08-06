import { api } from '../../../../lib/api';

/**
 * Uploads a single file to /api/admin/files/upload and returns the file UUID.
 * Returns null if no file is provided or upload fails.
 */
export async function uploadFile(file: File | null | undefined, module: string): Promise<string | null> {
  if (!file || !(file instanceof File)) return null;
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('module', module);
    const res = await api.request('/admin/files/upload', {
      method: 'POST',
      data: formData,
    });
    return res?.id ?? null;
  } catch (err) {
    console.warn(`File upload failed for module=${module}`, err);
    return null;
  }
}
