import { useEffect, useRef, useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import mustache from 'mustache';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface QuotationPreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  templateContent: string;
  data: any;
  filename?: string;
}

export default function QuotationPreviewPanel({ isOpen, onClose, templateContent, data, filename = 'Quotation.pdf' }: QuotationPreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [compiledHtml, setCompiledHtml] = useState<string>('');

  useEffect(() => {
    if (isOpen && templateContent && data) {
      try {
        const rendered = mustache.render(templateContent, data);
        setCompiledHtml(rendered);
      } catch (error) {
        console.error('Error rendering template:', error);
        setCompiledHtml('<div style="padding:1rem; color:red;">Error rendering template. Please check the template format.</div>');
      }
    }
  }, [isOpen, templateContent, data]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!iframeRef.current || !iframeRef.current.contentDocument) return;
    setIsGeneratingPdf(true);
    
    // Inject style to fix html2canvas oklch crash from Tailwind v4 without breaking template CSS
    const style = document.createElement('style');
    style.innerHTML = `
      :where(.html2pdf__container *) {
        border-color: transparent;
        outline-color: transparent;
        text-decoration-color: transparent;
        background-color: transparent;
      }
      .html2pdf__container {
        background-color: #ffffff;
        color: #000000;
      }
    `;
    document.head.appendChild(style);

    try {
      const doc = iframeRef.current.contentDocument;
      
      // Create a generic wrapper DIV instead of passing the BODY tag.
      // This prevents Tailwind's 'body' selector from applying oklch background-color.
      const wrapper = document.createElement('div');
      
      // Copy all styles from the template's <head>
      const styles = doc.head.querySelectorAll('style, link[rel="stylesheet"]');
      styles.forEach(s => wrapper.appendChild(s.cloneNode(true)));
      
      // Copy all content from the template's <body>
      Array.from(doc.body.childNodes).forEach(node => {
        wrapper.appendChild(node.cloneNode(true));
      });
      
      // Copy inline styles from body (like --primary-color)
      wrapper.style.cssText = doc.body.style.cssText;
      wrapper.style.backgroundColor = '#ffffff'; // Ensure valid background
      wrapper.style.color = '#1e293b';

      const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      await html2pdf().set(opt).from(wrapper).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#181a1f] w-full max-w-5xl h-[90vh] rounded-sm shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quotation Preview</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={isGeneratingPdf || !compiledHtml}
              className="px-4 py-2 bg-[#792359] hover:bg-[#52173c] disabled:opacity-70 text-white text-sm font-medium rounded-sm transition-colors flex items-center gap-2"
            >
              {isGeneratingPdf ? (
                <><Loader2 size={16} className="animate-spin" /> Generating PDF...</>
              ) : (
                <><Download size={16} /> Download PDF</>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-black/20 p-8 flex justify-center">
          <div className="bg-white shadow-md overflow-hidden" style={{ width: '210mm', minHeight: '297mm' }}>
            <iframe 
              ref={iframeRef}
              srcDoc={compiledHtml}
              className="w-full h-full border-none pointer-events-none"
              title="Quotation Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
