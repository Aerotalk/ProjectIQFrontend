import { useState } from 'react';
import Tabs from '../../../../components/Tabs';
import LeaveApplications from './LeaveApplications';
import LeaveBalances from './LeaveBalances';
import LeaveTypes from './LeaveTypes';
import LeaveSchemes from './LeaveSchemes';
import ApprovalQueue from './ApprovalQueue';

export default function LeaveMain() {
  const [activeTab, setActiveTab] = useState('applications');

  const tabs = [
    { id: 'applications', label: 'Applications' },
    { id: 'balances', label: 'Balances' },
    { id: 'types', label: 'Leave Types' },
    { id: 'schemes', label: 'Leave Schemes' },
    { id: 'approvals', label: 'Approvals' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'applications': return <LeaveApplications />;
      case 'balances': return <LeaveBalances />;
      case 'types': return <LeaveTypes />;
      case 'schemes': return <LeaveSchemes />;
      case 'approvals': return <ApprovalQueue />;
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
