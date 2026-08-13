import { useState } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';

import { Download, FileText, PieChart, BarChart2 } from 'lucide-react';
import { useEffect } from 'react';
import { performanceService } from '../../../../services/performance.service';
export default function PerformanceReports() {
  const [activeReport, setActiveReport] = useState('department');
  const [selectedCycle, setSelectedCycle] = useState('');
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [promotionsData, setPromotionsData] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const apiCycles = await performanceService.getCycles();
        const fetchedCycles = Array.isArray(apiCycles) ? apiCycles : (apiCycles?.data || []);
        setCycles(fetchedCycles);
        if (fetchedCycles.length > 0) {
          setSelectedCycle(fetchedCycles[0].id);
        }
      } catch (e) {
        console.error('Failed to load cycles', e);
      }
    };
    fetchCycles();
  }, []);

  useEffect(() => {
    if (!selectedCycle) return;
    const fetchReports = async () => {
      try {
        const [apiDeptData, apiPromoData] = await Promise.all([
          performanceService.getDepartmentRatings(selectedCycle).catch(() => []),
          performanceService.getPromotionRecommendations(selectedCycle).catch(() => [])
        ]);
        setDepartmentData(Array.isArray(apiDeptData) ? apiDeptData : (apiDeptData?.data || []));
        setPromotionsData(Array.isArray(apiPromoData) ? apiPromoData : (apiPromoData?.data || []));
      } catch (e) {
        console.error('Failed to load reports', e);
      }
    };
    fetchReports();
  }, [selectedCycle]);

  const deptColumns = [
    { key: 'department', label: 'Department' },
    { key: 'totalEmployees', label: 'Headcount' },
    { key: 'avgRating', label: 'Avg. Rating', render: (v: any) => <span className="font-bold text-primary dark:text-secondary">{v ? Number(v).toFixed(1) : '0.0'}</span> },
    { key: 'topPerformers', label: 'Top Performers', render: (v: any) => <span className="text-green-600">{v}</span> },
    { key: 'needsImprovement', label: 'Needs Improvement', render: (v: any) => <span className="text-orange-600">{v}</span> }
  ];

  const handleExport = (format: string) => {
    if (departmentData.length === 0 && activeReport !== 'promotions') {
      alert(`No data available to export for ${activeReport.replace('-', ' ')} report.`);
      return;
    }
    if (activeReport === 'promotions' && promotionsData.length === 0) {
      alert(`No promotion data available to export.`);
      return;
    }

    if (format === 'PDF') {
      window.print();
    } else if (format === 'Excel') {
      let headers = '';
      let rows = '';
      
      if (activeReport === 'department') {
        headers = ['Department', 'Headcount', 'Avg. Rating', 'Top Performers', 'Needs Improvement'].join(',');
        rows = departmentData.map(d => 
          `"${d.department}",${d.totalEmployees},${d.avgRating ? Number(d.avgRating).toFixed(1) : '0.0'},${d.topPerformers},${d.needsImprovement}`
        ).join('\n');
      } else if (activeReport === 'goals') {
        headers = ['Department', 'Goals Completed', 'Goals Behind'].join(',');
        rows = departmentData.map(d => 
          `"${d.department}",${d.topPerformers},${d.needsImprovement}`
        ).join('\n');
      } else if (activeReport === 'promotions') {
        headers = ['Employee Name', 'Department', 'Recommendation', 'Manager'].join(',');
        rows = promotionsData.map(d => 
          `"${d.employeeName}","${d.department}","${d.recommendation}","${d.managerName}"`
        ).join('\n');
      } else {
        return;
      }
      
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeReport}-report.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
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
            <select 
              value={selectedCycle}
              onChange={(e) => setSelectedCycle(e.target.value)}
              className="border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-[#1f2229] text-sm py-1.5 px-3 focus:outline-none focus:border-primary"
            >
              {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-sm p-1">
            <button 
              onClick={() => handleExport('PDF')} 
              disabled={activeReport === 'promotions' ? promotionsData.length === 0 : departmentData.length === 0}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center ${(activeReport === 'promotions' ? promotionsData.length > 0 : departmentData.length > 0) ? 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700' : 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'}`}
            >
              <FileText size={14} className="mr-1" /> PDF
            </button>
            <button 
              onClick={() => handleExport('Excel')} 
              disabled={activeReport === 'promotions' ? promotionsData.length === 0 : departmentData.length === 0}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center ${(activeReport === 'promotions' ? promotionsData.length > 0 : departmentData.length > 0) ? 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700' : 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'}`}
            >
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
            {activeReport === 'goals' && (
              <CustomTable 
                columns={[
                  { key: 'department', label: 'Department' },
                  { key: 'topPerformers', label: 'Goals Completed' },
                  { key: 'needsImprovement', label: 'Goals Behind' }
                ]} 
                data={departmentData} 
              />
            )}
            {activeReport === 'promotions' && (
              promotionsData.length > 0 ? (
                <CustomTable 
                  columns={[
                    { key: 'employeeName', label: 'Employee Name' },
                    { key: 'department', label: 'Department' },
                    { key: 'recommendation', label: 'Recommendation' },
                    { key: 'managerName', label: 'Manager' }
                  ]} 
                  data={promotionsData} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                  <BarChart2 size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
                  <p>No promotion recommendation data available yet.</p>
                  <p className="text-sm mt-2">Data will appear once manager reviews with recommendations are finalized.</p>
                </div>
              )
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
