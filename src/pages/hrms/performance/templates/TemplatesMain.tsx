import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus } from 'lucide-react';
import type { Competency, RatingScale } from './../types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';

export default function TemplatesMain() {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [ratingScales, setRatingScales] = useState<RatingScale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apiCompetencies, apiScales] = await Promise.all([
        api.get('/hrms/performance/competencies'),
        api.get('/hrms/performance/rating-scales')
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
    try {
      const name = prompt('Enter Competency Name:');
      if (!name) return;
      const description = prompt('Enter Competency Description:') || '';
      await api.post('/hrms/performance/competencies', {
        name,
        description,
        category: 'Core',
        weightage: 20,
        active: true
      }).catch(() => {});
      toast.success('Competency added');
      fetchData();
    } catch (e) {
      toast.error('Error adding competency');
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
            onClick={handleAddCompetency}
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
    </div>
  );
}
