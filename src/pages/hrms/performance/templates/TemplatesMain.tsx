import { useState } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { Button } from '../../../../components/ui/button';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { mockCompetencies } from '../mock/mockPerformanceData';
import Drawer from '../../../../components/ui/Drawer';
import { FormLayout } from '../../../../components/ui/FormLayout';
import CustomInput from '../../../../components/ui/CustomInput';
import CustomSelect from '../../../../components/ui/CustomSelect';

function CompetencyDrawer({ isOpen, onClose, competency }: any) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={competency ? 'Edit Competency' : 'New Competency'}
      footer={
        <div className="flex justify-end gap-3 w-full">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">Cancel</button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-[#792359] rounded-sm hover:bg-[#b8458f]">Save</button>
        </div>
      }
    >
      <FormLayout>
        <CustomInput label="Competency Name" defaultValue={competency?.name} required />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <CustomSelect 
            options={[
              {value: 'Core', label: 'Core'}, 
              {value: 'Leadership', label: 'Leadership'},
              {value: 'Technical', label: 'Technical'}
            ]}
            value={competency?.category || 'Core'}
            onChange={() => {}}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea className="w-full px-3 py-2 border border-gray-300 rounded-sm" rows={3} defaultValue={competency?.description}></textarea>
        </div>
        <CustomInput label="Default Weightage (%)" type="number" defaultValue={competency?.weightage || 10} />
      </FormLayout>
    </Drawer>
  );
}

export default function TemplatesMain() {
  const [activeTab, setActiveTab] = useState('competencies');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const columns = [
    { key: 'name', label: 'Competency Name' },
    { key: 'category', label: 'Category' },
    { key: 'weightage', label: 'Weightage', render: (v: any) => `${v}%` },
    { 
      key: 'active', 
      label: 'Status',
      render: (v: any) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${v ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {v ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-500 hover:text-[#792359]"><Edit size={16} /></button>
          <button className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Internal Tabs */}
      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm p-1 flex gap-1 flex-shrink-0">
        <button 
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${activeTab === 'templates' ? 'bg-[#792359]/10 text-[#792359]' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Review Templates
        </button>
        <button 
          onClick={() => setActiveTab('competencies')}
          className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${activeTab === 'competencies' ? 'bg-[#792359]/10 text-[#792359]' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Competencies Library
        </button>
        <button 
          onClick={() => setActiveTab('scales')}
          className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${activeTab === 'scales' ? 'bg-[#792359]/10 text-[#792359]' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Rating Scales
        </button>
      </div>

      <div className="flex justify-between items-center bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-sm bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-1 focus:ring-[#792359] dark:text-white w-64"
          />
        </div>
        <Button variant="default" onClick={() => setIsDrawerOpen(true)} className="bg-[#792359] hover:bg-[#b8458f] text-white">
          <Plus size={16} className="mr-2" />
          Add New
        </Button>
      </div>

      {/* Main Table Area (Showing Competencies for brevity) */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'competencies' && (
            <CustomTable columns={columns} data={mockCompetencies} />
          )}
          {activeTab !== 'competencies' && (
            <div className="flex items-center justify-center h-full text-gray-500">
              Mock content for {activeTab}. Structure mirrors Competencies list.
            </div>
          )}
        </div>
      </div>

      <CompetencyDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
