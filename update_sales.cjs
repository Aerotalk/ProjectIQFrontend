const fs = require('fs');

let content = fs.readFileSync('src/pages/sales/SalesDashboard.tsx', 'utf-8');

// Imports
content = content.replace(
  "import { useNavigate } from 'react-router-dom';",
  `import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { QuotationService } from '../../services/quotation.service';
import { ClientService } from '../../services/client.service';`
);

// State hooks and useEffect
content = content.replace(
  "export default function SalesDashboard() {",
  `export default function SalesDashboard() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quots, clis] = await Promise.all([
          QuotationService.getQuotations(),
          ClientService.getClients()
        ]);
        setQuotations(quots);
        setClients(clis);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);
`
);

// Replace static recentQuotations with mapped state
// Find "const recentQuotations = [" and replace the whole block until "];"
content = content.replace(
  /const recentQuotations = \[[^\]]*\];/s,
  `const recentQuotations = quotations.slice(0, 5).map(q => ({
    id: q.id,
    no: q.quotationNo,
    client: q.clientName,
    project: q.subject,
    amount: \`₹ \${(q.grandTotal || 0).toLocaleString('en-IN')}\`,
    status: q.status,
    statusColor: q.status === 'Approved' ? 'bg-green-100 text-green-600' : (q.status === 'Draft' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'),
    validTill: new Date(q.validUntil).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    owner: 'System'
  }));`
);

// Replace topClients
content = content.replace(
  /const topClients = \[[^\]]*\];/s,
  `const topClients = clients.slice(0, 5).map((c, i) => ({
    rank: i + 1,
    name: c.companyName,
    amount: \`₹ \${(Math.random() * 1000000).toLocaleString('en-IN')}\` // Mock value since client doesn't store total sales yet
  }));`
);

// Update stats dynamic count
content = content.replace(
  /const stats = \[[^\]]*\];/s,
  `const stats = [
    { label: 'Total Quotations', value: quotations.length.toString(), trend: '+12.5%', icon: FileText, color: 'text-[#b8458f]', bgColor: 'bg-pink-50 dark:bg-[#b8458f]/10' },
    { label: 'Draft', value: quotations.filter(q => q.status === 'Draft').length.toString(), trend: '+8.4%', icon: Edit, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-500/10' },
    { label: 'Sent for Approval', value: quotations.filter(q => q.status === 'Pending Approval' || q.status === 'Sent for Approval').length.toString(), trend: '+15.3%', icon: UserCheck, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Approved', value: quotations.filter(q => q.status === 'Approved').length.toString(), trend: '+10.2%', icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-500/10' },
    { label: 'Sent to Client', value: quotations.filter(q => q.status === 'Sent to Client').length.toString(), trend: '+12.1%', icon: Send, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-500/10' },
    { label: 'Converted', value: quotations.filter(q => q.status === 'Accepted').length.toString(), trend: '+16.7%', icon: Trophy, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10' },
  ];`
);

// Update pipeline stages dynamic count
content = content.replace(
  /const pipelineStages = \[[^\]]*\];/s,
  `const pipelineStages = [
    { label: 'Draft', count: quotations.filter(q => q.status === 'Draft').length, amount: '₹ 18,45,000', color: 'bg-blue-100/50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' },
    { label: 'Sent for Approval', count: quotations.filter(q => q.status === 'Pending Approval' || q.status === 'Sent for Approval').length, amount: '₹ 12,41,000', color: 'bg-purple-100/50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200' },
    { label: 'Approved', count: quotations.filter(q => q.status === 'Approved').length, amount: '₹ 10,30,000', color: 'bg-orange-100/50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200' },
    { label: 'Sent to Client', count: quotations.filter(q => q.status === 'Sent to Client').length, amount: '₹ 8,40,000', color: 'bg-emerald-100/50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200' },
    { label: 'Client Asked for Changes', count: quotations.filter(q => q.status === 'Rejected' || q.status === 'Changes Requested').length, amount: '₹ 4,81,000', color: 'bg-fuchsia-100/50 text-fuchsia-800 dark:bg-fuchsia-900/20 dark:text-fuchsia-200' },
    { label: 'Converted', count: quotations.filter(q => q.status === 'Accepted').length, amount: '₹ 7,23,000', color: 'bg-green-100/50 text-green-800 dark:bg-green-900/20 dark:text-green-200' },
  ];`
);

fs.writeFileSync('src/pages/sales/SalesDashboard.tsx', content);
