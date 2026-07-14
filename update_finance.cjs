const fs = require('fs');

let content = fs.readFileSync('src/pages/finance/FinanceDashboard.tsx', 'utf-8');

// The basic idea is to replace the hardcoded RECENT_POS, RECENT_EXPENSES, RECENT_CHALLANS
// with state from the services.

content = content.replace(
  "import { useNavigate } from 'react-router-dom';",
  `import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { POService } from '../../services/po.service';
import { ExpenseService } from '../../services/expense.service';
import { ChallanService } from '../../services/challan.service';`
);

content = content.replace(
  "export default function FinanceDashboard() {",
  `export default function FinanceDashboard() {
  const [recentPOs, setRecentPOs] = useState<any[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [recentChallans, setRecentChallans] = useState<any[]>([]);
  const [poTotal, setPoTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [pos, expenses, challans] = await Promise.all([
          POService.getAll(),
          ExpenseService.getAll(),
          ChallanService.getAll()
        ]);

        // POs
        const poSum = pos.reduce((acc, po) => acc + (po.grandTotal || 0), 0);
        setPoTotal(poSum);
        
        const formattedPOs = pos.slice(0, 5).map(po => ({
          id: po.poNumber || po.id,
          vendor: po.vendorName,
          project: po.projectId,
          amount: \`₹ \${(po.grandTotal || 0).toLocaleString('en-IN')}\`,
          status: po.status,
          statusColor: po.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
        }));
        setRecentPOs(formattedPOs);

        // Expenses
        const expSum = expenses.reduce((acc, ex) => acc + (ex.amount || 0), 0);
        setExpenseTotal(expSum);

        const formattedExpenses = expenses.slice(0, 5).map(ex => ({
          date: new Date(ex.expenseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: ex.category,
          project: ex.projectId,
          amount: \`₹ \${(ex.amount || 0).toLocaleString('en-IN')}\`
        }));
        setRecentExpenses(formattedExpenses);

        // Challans
        const formattedChallans = challans.slice(0, 5).map(ch => ({
          id: ch.challanNumber || ch.id,
          vendor: ch.vendorName || 'Vendor',
          project: ch.projectId,
          date: new Date(ch.challanDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          status: 'Received', // Assuming mock status
          statusColor: 'bg-green-100 text-green-700'
        }));
        setRecentChallans(formattedChallans);

      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    
    fetchDashboardData();
  }, []);
`
);

// We need to replace the usage of RECENT_POS with recentPOs
content = content.replace(/RECENT_POS/g, "recentPOs");
content = content.replace(/RECENT_EXPENSES/g, "recentExpenses");
content = content.replace(/RECENT_CHALLANS/g, "recentChallans");

// Update KPI_DATA dynamically inside the component instead of static
content = content.replace(
  "const KPI_DATA = [",
  `const KPI_DATA = [`
);
// We can actually intercept the render of KPI cards to inject dynamic data
content = content.replace(
  "{KPI_DATA.map((kpi, i) => (",
  `{KPI_DATA.map((kpi, i) => {
    let displayValue = kpi.value;
    if (kpi.label === 'PO Value') displayValue = \`₹ \${poTotal.toLocaleString('en-IN')}\`;
    if (kpi.label === 'Expenses') displayValue = \`₹ \${expenseTotal.toLocaleString('en-IN')}\`;
    
    return (
`
);

content = content.replace(
  "<div className=\"text-2xl font-bold text-gray-900 dark:text-white leading-none\">{kpi.value}</div>",
  "<div className=\"text-2xl font-bold text-gray-900 dark:text-white leading-none\">{displayValue}</div>"
);

// close the return statement
content = content.replace(
  "</div>\n        ))}",
  "</div>\n        );\n        })}"
);

fs.writeFileSync('src/pages/finance/FinanceDashboard.tsx', content);
