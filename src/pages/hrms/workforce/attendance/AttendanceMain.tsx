import { useState } from 'react';
import Tabs from '../../../../components/Tabs';
import DailyAttendance from './DailyAttendance';
import Exceptions from './Exceptions';
import Regularization from './Regularization';
import Permissions from './Permissions';

export default function AttendanceMain() {
  const [activeTab, setActiveTab] = useState('daily');

  const tabs = [
    { id: 'daily', label: 'Daily Attendance' },
    { id: 'exceptions', label: 'Exceptions' },
    { id: 'regularization', label: 'Regularization' },
    { id: 'permissions', label: 'Permissions' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'daily': return <DailyAttendance />;
      case 'exceptions': return <Exceptions />;
      case 'regularization': return <Regularization />;
      case 'permissions': return <Permissions />;
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
