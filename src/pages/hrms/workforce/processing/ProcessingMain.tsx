import { useState } from 'react';
import Tabs from '../../../../components/Tabs';
import ProcessingPeriods from './ProcessingPeriods';
import LockConfig from './LockConfig';

export default function ProcessingMain() {
  const [activeTab, setActiveTab] = useState('periods');

  const tabs = [
    { id: 'periods', label: 'Processing Periods' },
    { id: 'lock', label: 'Lock Configurations' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'periods': return <ProcessingPeriods />;
      case 'lock': return <LockConfig />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm overflow-hidden">
      <div className="shrink-0 border-b border-gray-200 dark:border-white/10 px-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
