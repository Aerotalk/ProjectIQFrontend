import { useEffect, useRef, useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import mustache from 'mustache';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface POPreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  templateContent: string;
  data: any;
  filename?: string;
}

export default function POPreviewPanel({ isOpen, onClose, templateContent, data, filename = 'Purchase_Order.pdf' }: POPreviewPanelProps) {
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

  useEffect(() => {
    if (iframeRef.current && compiledHtml) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(compiledHtml);
        doc.close();
      }
    }
  }, [compiledHtml, isOpen]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!iframeRef.current || !iframeRef.current.contentDocument) return;
    setIsGeneratingPdf(true);
    
    const parentStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
    const placeholders: { el: Element, parent: Node, nextSibling: Node | null }[] = [];
    
    parentStyles.forEach(style => {
      const isStyleSheet = style.tagName.toLowerCase() === 'style' || (style as HTMLLinkElement).href?.includes('.css');
      if (isStyleSheet) {
        placeholders.push({ el: style, parent: style.parentNode!, nextSibling: style.nextSibling });
        style.remove();
      }
    });

    try {
      const element = iframeRef.current.contentDocument.documentElement;
      const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      placeholders.forEach(({ el, parent, nextSibling }) => {
        parent.insertBefore(el, nextSibling);
      });
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#181a1f] w-full max-w-5xl h-[90vh] rounded-sm shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Purchase Order Preview</h2>
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
          <div className="bg-white shadow-md" style={{ width: '210mm', minHeight: '297mm' }}>
            <iframe 
              ref={iframeRef}
              title="Purchase Order Preview"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
