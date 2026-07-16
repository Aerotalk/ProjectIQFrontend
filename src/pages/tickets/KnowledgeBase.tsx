import { Search, Filter, Plus, MoreHorizontal, BookOpen } from 'lucide-react';
import { useState } from 'react';
import KBDrawer from './components/KBDrawer';
import { KBService, type KBFormValues } from '../../services/kb.service';
import toast from 'react-hot-toast';

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<KBFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  // Click outside to close action menu
  if (typeof window !== 'undefined') {
    window.onclick = (e: any) => {
      if (!e.target.closest('.action-menu-btn') && !e.target.closest('.action-menu-dropdown')) {
        setOpenActionId(null);
      }
    };
  }

  // Fetch articles from backend
  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const companyId = localStorage.getItem('selectedCompanyId');
      if (companyId) {
        const data = await KBService.getAll(companyId);
        setArticles(data);
      }
    } catch (err) {
      toast.error('Failed to load articles');
    } finally {
      setIsLoading(false);
    }
  };

  import { useEffect } from 'react';
  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCreate = () => {
    setDrawerMode('create');
    setSelectedArticle(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (article: any) => {
    setDrawerMode('edit');
    setSelectedArticle(article);
    setIsDrawerOpen(true);
  };

  const handleView = (article: any) => {
    setDrawerMode('view');
    setSelectedArticle(article);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await KBService.delete(id);
      setArticles(articles.filter(a => a.id !== id));
      toast.success('Article deleted successfully');
    } catch (err) {
      toast.error('Failed to delete article');
    }
  };

  const handleSaveArticle = async (data: KBFormValues) => {
    try {
      const companyId = localStorage.getItem('selectedCompanyId') || '';
      
      if (drawerMode === 'create') {
        data.author = 'System Admin'; // Hardcoded for now, can be dynamically fetched later
        const newArticle = await KBService.create(companyId, data);
        setArticles([newArticle, ...articles]);
        toast.success('Article created successfully');
      } else {
        const updated = await KBService.update(selectedArticle.id, data);
        setArticles(articles.map(a => a.id === selectedArticle.id ? updated : a));
        toast.success('Article updated successfully');
      }
      setIsDrawerOpen(false);
    } catch (err) {
      toast.error('Failed to save article');
    }
  };

  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === 'All' || a.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen size={24} className="text-[#792359] dark:text-[#e6a8d0]" />
            Knowledge Base
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage articles, guides, and documentation.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-56 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white" 
            />
          </div>
          <div className="relative shrink-0">
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none px-4 py-2 pl-9 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 cursor-pointer outline-none focus:border-[#792359]"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <button 
            onClick={handleCreate}
            className="shrink-0 px-3 py-2 bg-[#792359] hover:bg-[#52173c] text-white rounded-sm text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> New Article
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">ID</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">Title</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">Category</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">Status</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">Author</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">Updated</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredArticles.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{a.id?.substring(0,8)}</td>
                  <td onClick={() => handleView(a)} className="px-6 py-4 font-medium text-[#792359] dark:text-[#e6a8d0] cursor-pointer hover:underline">{a.title}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{a.category}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                      a.status === 'Published' ? 'text-green-700 bg-green-50 dark:bg-green-500/10' :
                      'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-800'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{a.author || 'System'}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : 'Just now'}</td>
                  <td className="px-6 py-4 text-center relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setOpenActionId(openActionId === a.id ? null : a.id); }}
                      className="action-menu-btn text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/10 rounded-sm transition-colors p-1"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openActionId === a.id && (
                      <div className="action-menu-dropdown absolute right-12 top-10 w-40 bg-white dark:bg-[#1f2229] border border-gray-100 dark:border-white/10 shadow-xl py-1 z-50 rounded-sm">
                        <button onClick={(e) => { e.stopPropagation(); handleView(a); setOpenActionId(null); }} className="w-full text-left px-4 py-2 text-sm text-[#792359] dark:text-[#e6a8d0] font-medium hover:bg-gray-50 dark:hover:bg-white/5">
                          Read Article
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(a); setOpenActionId(null); }} className="w-full text-left px-4 py-2 text-sm text-[#792359] dark:text-[#e6a8d0] font-medium hover:bg-gray-50 dark:hover:bg-white/5">
                          Edit Article
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(a.id); setOpenActionId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-500/10">
                          Delete Article
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredArticles.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No articles found.
            </div>
          )}
        </div>
      </div>

      <KBDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveArticle}
        mode={drawerMode}
        initialData={selectedArticle}
      />
    </div>
  );
}
