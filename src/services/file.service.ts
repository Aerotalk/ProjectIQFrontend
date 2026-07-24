import { api } from '../lib/api';

export interface FileMetadata {
  id: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  uploadedBy?: string;
  uploadedAt: string;
  module?: string;
}

export const FileService = {
  /**
   * Uploads a file to the backend
   */
  async uploadFile(file: File, module?: string): Promise<FileMetadata> {
    const formData = new FormData();
    formData.append('file', file);
    if (module) {
      formData.append('module', module);
    }
    
    // We send FormData directly, api.ts handles Content-Type automatically
    return api.post('/admin/files/upload', formData);
  },

  /**
   * Downloads a file from the backend and prompts the user to save it
   */
  async downloadFile(fileId: string, originalName: string): Promise<void> {
    try {
      const blob = await api.get(`/admin/files/${fileId}`, { responseType: 'blob' });
      
      // If the response is actually a JSON error message, throw it
      if (blob.type === 'application/json') {
        const text = await blob.text();
        let errorMessage = 'Download failed';
        try {
          const errData = JSON.parse(text);
          errorMessage = errData.message || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      // Create a temporary object URL and link to trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }
};
