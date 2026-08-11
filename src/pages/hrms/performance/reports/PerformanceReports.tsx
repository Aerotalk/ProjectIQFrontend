import { useState } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';

import { Download, FileText, PieChart, BarChart2 } from 'lucide-react';
import { useEffect } from 'react';
import { api } from '../../../../lib/api';
export default function PerformanceReports() {
  const [activeReport, setActiveReport] = useState('department');
  const [selectedCycle, setSelectedCycle] = useState('');
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [apiGoals, apiCycles] = await Promise.all([
          api.get('/hrms/performance/goals').catch(() => []),
          api.get('/hrms/performance/cycles').catch(() => [])
        ]);
        
        let deptData: any[] = [];
        if (Array.isArray(apiGoals)) {
          // Aggregate goals by department
          const deptMap = new Map<string, { totalEmployees: Set<string>, completed: number, needsImprovement: number, totalRating: number }>();
          
          apiGoals.forEach(g => {
            const dept = g.employee?.department?.departmentName || 'Unknown';
            const empId = g.employee?.id || 'Unknown';
            if (!deptMap.has(dept)) {
              deptMap.set(dept, { totalEmployees: new Set(), completed: 0, needsImprovement: 0, totalRating: 0 });
            }
            const data = deptMap.get(dept)!;
            data.totalEmployees.add(empId);
            if (g.status === 'Completed' || g.progress >= 100) {
              data.completed++;
              data.totalRating += (g.rating || (g.progress / 20)); // scale 100 to 5
            } else if (g.progress < 50 && g.status !== 'Draft') {
              data.needsImprovement++;
              data.totalRating += (g.rating || (g.progress / 20)); 
            } else {
              data.totalRating += (g.rating || (g.progress / 20) || 3.5); 
            }
          });

          deptData = Array.from(deptMap.entries()).map(([department, data]) => ({
            department,
            avgRating: (data.totalRating / Math.max(1, data.completed + data.needsImprovement + data.totalEmployees.size)) || 3.0,
            topPerformers: data.completed,
            needsImprovement: data.needsImprovement,
            totalEmployees: data.totalEmployees.size
          }));
        }
        setDepartmentData(deptData);
        const fetchedCycles = Array.isArray(apiCycles) ? apiCycles : [];
        setCycles(fetchedCycles);
        if (fetchedCycles.length > 0) {
          setSelectedCycle(fetchedCycles[0].id);
        }
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
    if (departmentData.length === 0 || activeReport === 'promotions') {
      alert(`No data available to export for ${activeReport.replace('-', ' ')} report.`);
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
          `"${d.department}",${d.totalEmployees},${d.avgRating.toFixed(1)},${d.topPerformers},${d.needsImprovement}`
        ).join('\n');
      } else if (activeReport === 'goals') {
        headers = ['Department', 'Goals Completed', 'Goals Behind'].join(',');
        rows = departmentData.map(d => 
          `"${d.department}",${d.topPerformers},${d.needsImprovement}`
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
              disabled={departmentData.length === 0 || activeReport === 'promotions'}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center ${departmentData.length > 0 && activeReport !== 'promotions' ? 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700' : 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'}`}
            >
              <FileText size={14} className="mr-1" /> PDF
            </button>
            <button 
              onClick={() => handleExport('Excel')} 
              disabled={departmentData.length === 0 || activeReport === 'promotions'}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center ${departmentData.length > 0 && activeReport !== 'promotions' ? 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700' : 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'}`}
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
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                <BarChart2 size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
                <p>No promotion recommendation data available yet.</p>
                <p className="text-sm mt-2">Data will appear once reviews are finalized.</p>
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
