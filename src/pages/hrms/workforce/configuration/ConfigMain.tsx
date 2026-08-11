import { useState } from 'react';
import Tabs from '../../../../components/Tabs';
import HolidayLists from './HolidayLists';
import AttendanceSchemes from './AttendanceSchemes';
import WeekendRules from './WeekendRules';

export default function ConfigMain() {
  const [activeTab, setActiveTab] = useState('holidays');

  const tabs = [
    { id: 'holidays', label: 'Holiday Lists' },
    { id: 'schemes', label: 'Attendance Schemes' },
    { id: 'weekends', label: 'Weekend Rules' },
    // { id: 'ips', label: 'IP Mapping' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'holidays': return <HolidayLists />;
      case 'schemes': return <AttendanceSchemes />;
      case 'weekends': return <WeekendRules />;
      // case 'ips': return <IPMapping />;
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
