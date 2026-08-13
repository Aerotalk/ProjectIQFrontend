import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus } from 'lucide-react';
import type { Competency, RatingScale } from './../types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';
import { performanceService } from '../../../../services/performance.service';

export default function TemplatesMain() {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [ratingScales, setRatingScales] = useState<RatingScale[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompetency, setNewCompetency] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apiCompetencies, apiScales] = await Promise.all([
        performanceService.getCompetencies(),
        performanceService.getRatingScales()
      ]);

      setCompetencies(Array.isArray(apiCompetencies) ? apiCompetencies : []);
      setRatingScales(Array.isArray(apiScales) ? apiScales : []);
    } catch (e) {
      toast.error('Failed to load performance templates');
      setCompetencies([]);
      setRatingScales([]);
    }
    setLoading(false);
  };

  const handleAddCompetency = async () => {
    if (!newCompetency.name.trim()) {
      toast.error('Competency name is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await performanceService.createCompetency({
        name: newCompetency.name,
        description: newCompetency.description,
        category: 'Core',
        weightage: 20,
        active: true
      });
      toast.success('Competency added');
      setIsModalOpen(false);
      setNewCompetency({ name: '', description: '' });
      fetchData();
    } catch (e) {
      toast.error('Error adding competency');
    } finally {
      setIsSubmitting(false);
    }
  };

  const compColumns = [
    { key: 'name', label: 'Competency Name' },
    { key: 'category', label: 'Category' },
    { key: 'weightage', label: 'Weightage', render: (val: number) => `${val}%` },
    { key: 'description', label: 'Description' },
    { key: 'active', label: 'Status', render: (val: boolean) => val ? 'Active' : 'Inactive' }
  ];

  const scaleColumns = [
    { key: 'name', label: 'Scale Name' },
    { key: 'minRating', label: 'Min' },
    { key: 'maxRating', label: 'Max' },
    { key: 'description', label: 'Description' }
  ];

  if (loading) {
    return <div className="p-4"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#181a1f] p-4 space-y-6 overflow-auto">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Core Competencies</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Add Competency
          </button>
        </div>
        <CustomTable columns={compColumns} data={competencies} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rating Scales</h3>
        </div>
        <CustomTable columns={scaleColumns} data={ratingScales} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1f2229] p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-white/10 mx-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Competency</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Competency Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#121212] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  value={newCompetency.name}
                  onChange={(e) => setNewCompetency({...newCompetency, name: e.target.value})}
                  placeholder="e.g. Communication Skills"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#121212] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-h-[100px] resize-y"
                  value={newCompetency.description}
                  onChange={(e) => setNewCompetency({...newCompetency, description: e.target.value})}
                  placeholder="Detailed description of this competency..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setNewCompetency({ name: '', description: '' });
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCompetency}
                disabled={isSubmitting || !newCompetency.name.trim()}
                className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-dark rounded-md transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? 'Saving...' : 'Save Competency'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
