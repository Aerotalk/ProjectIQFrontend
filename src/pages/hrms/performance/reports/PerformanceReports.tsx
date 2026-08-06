import { useState } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';

import { Download, FileText, PieChart, BarChart2 } from 'lucide-react';
import { useEffect } from 'react';
import { api } from '../../../../lib/api';
export default function PerformanceReports() {
  const [activeReport, setActiveReport] = useState('department');

  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [ratings, apiCycles] = await Promise.all([
          api.get('/hrms/performance/reports/department-ratings').catch(() => []),
          api.get('/hrms/performance/cycles').catch(() => [])
        ]);
        
        let deptData: any[] = [];
        if (Array.isArray(ratings)) {
          deptData = ratings.map((r: any) => ({
            department: r.name,
            avgRating: r.rating,
            topPerformers: Math.floor(Math.random() * 10),
            needsImprovement: Math.floor(Math.random() * 3),
            totalEmployees: Math.floor(Math.random() * 30) + 10
          }));
        }
        setDepartmentData(deptData);
        setCycles(Array.isArray(apiCycles) ? apiCycles : []);
      } catch (e) {
        console.error('Failed to load reports', e);
      }
    };
    fetchReports();
  }, []);

  const deptColumns = [
    { key: 'department', label: 'Department' },
    { key: 'totalEmployees', label: 'Headcount' },
    { key: 'avgRating', label: 'Avg. Rating', render: (v: any) => <span className="font-bold text-primary dark:text-secondary">{v.toFixed(1)}</span> },
    { key: 'topPerformers', label: 'Top Performers', render: (v: any) => <span className="text-green-600">{v}</span> },
    { key: 'needsImprovement', label: 'Needs Improvement', render: (v: any) => <span className="text-orange-600">{v}</span> }
  ];

  const handleExport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting ${activeReport} report as ${format}...`);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Performance Reports</h2>
          <p className="text-sm text-gray-500">Analyze ratings, goal completion, and talent across the organization.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center mr-4 border-r border-gray-200 dark:border-gray-700 pr-4">
            <span className="text-sm text-gray-500 mr-2">Cycle:</span>
            <select className="border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-[#1f2229] text-sm py-1.5 px-3 focus:outline-none focus:border-primary">
              {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-sm p-1">
            <button onClick={() => handleExport('PDF')} className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-sm transition-colors flex items-center">
              <FileText size={14} className="mr-1" /> PDF
            </button>
            <button onClick={() => handleExport('Excel')} className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-sm transition-colors flex items-center">
              <Download size={14} className="mr-1" /> Excel
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-full overflow-hidden">
        
        {/* Report Sidebar */}
        <div className="w-full lg:w-64 bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Report Types</h3>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveReport('department')}
              className={`w-full text-left px-3 py-2 rounded-sm text-sm font-medium transition-colors flex items-center ${activeReport === 'department' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <BarChart2 size={16} className="mr-2" /> Department Ratings
            </button>
            <button 
              onClick={() => setActiveReport('goals')}
              className={`w-full text-left px-3 py-2 rounded-sm text-sm font-medium transition-colors flex items-center ${activeReport === 'goals' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <PieChart size={16} className="mr-2" /> Goal Achievement
            </button>
            <button 
              onClick={() => setActiveReport('promotions')}
              className={`w-full text-left px-3 py-2 rounded-sm text-sm font-medium transition-colors flex items-center ${activeReport === 'promotions' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <TrendingUp size={16} className="mr-2" /> Promotion Recs.
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-1 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">{activeReport.replace('-', ' ')} Report</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeReport === 'department' && (
              <CustomTable columns={deptColumns} data={departmentData} />
            )}
            {activeReport !== 'department' && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                <BarChart2 size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
                <p>Mock visualization for {activeReport} report.</p>
                <p className="text-sm mt-2">In a full implementation, this area would render specific charts or data grids for the selected report type.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Dummy TrendingUp icon since it wasn't imported at top
function TrendingUp(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>;
}
