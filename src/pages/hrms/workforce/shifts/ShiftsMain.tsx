import { useState } from 'react';
import Tabs from '../../../../components/Tabs';
import ShiftMaster from './ShiftMaster';
import ShiftRotation from './ShiftRotation';
import ShiftRoster from './ShiftRoster';

export default function ShiftsMain() {
  const [activeTab, setActiveTab] = useState('roster');

  const tabs = [
    { id: 'roster', label: 'Shift Roster' },
    { id: 'master', label: 'Shift Master' },
    { id: 'rotation', label: 'Shift Rotation' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'master': return <ShiftMaster />;
      case 'rotation': return <ShiftRotation />;
      case 'roster': return <ShiftRoster />;
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
