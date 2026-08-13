import { useState, useEffect, useRef } from 'react';
import { Loader2, Upload, Paperclip, FileText, Download } from 'lucide-react';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function ReceiptsList() {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/files/my-files?module=expense_claims');
      setFiles(res || []);
    } catch (err) {
      toast.error('Failed to load receipts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('module', 'expense_claims');

    try {
      await api.post('/admin/files/upload', formData);
      toast.success('Receipt uploaded successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to upload receipt');
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileUrl = (id: string) => {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/admin/files/${id}`;
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f]">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Paperclip size={18} className="text-primary" />
            Receipts Inbox
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and view your uploaded expense receipts.</p>
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*,.pdf"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-[#5d1944] text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {isUploading ? 'Uploading...' : 'Upload Receipt'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        {files.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 flex items-center justify-center rounded-full mb-4">
              <FileText size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No receipts uploaded yet.</p>
            <p className="text-sm text-gray-400 mt-1">Upload receipts to attach them to your claims later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div key={file.id} className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-gray-50 dark:bg-white/5 flex flex-col group">
                <div className="h-32 bg-gray-200 dark:bg-white/10 flex items-center justify-center relative overflow-hidden">
                  {file.mimeType?.includes('image') ? (
                    <img 
                      src={getFileUrl(file.id)} 
                      alt={file.originalName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText size={40} className="text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <a 
                      href={getFileUrl(file.id)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-white text-gray-900 rounded-full hover:scale-110 transition-transform"
                      title="View / Download"
                    >
                      <Download size={20} />
                    </a>
                  </div>
                </div>
                <div className="p-4 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    <span>{formatFileSize(file.fileSize)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
