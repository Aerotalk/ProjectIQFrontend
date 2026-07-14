const fs = require('fs');

let content = fs.readFileSync('src/pages/finance/FinanceDashboard.tsx', 'utf-8');

// Fix syntax error first (from update_finance.cjs)
content = content.replace(
  "</div>\n        ))}",
  "</div>\n        );\n        })}"
);

// Fix wrapping
content = content.replace(
  '<div className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{displayValue}</div>',
  '<div className="text-2xl font-bold text-gray-900 dark:text-white leading-none whitespace-nowrap">{displayValue}</div>'
);

// Fix flex layout and truncation in widgets
// Recent POs
let targetPO = `                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 w-12">{po.id}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-32 truncate">{po.vendor}</span>
                  <span className="text-[10px] font-semibold text-[#792359] dark:text-[#e6a8d0] bg-[#792359]/10 px-1.5 rounded-sm">{po.project}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{po.amount}</span>
                  <span className={\`text-[9px] font-semibold px-1.5 py-0.5 rounded-sm \${po.statusColor}\`}>{po.status}</span>
                </div>`;
let replPO = `                <div className="flex items-center gap-2 flex-1 min-w-0 mr-3">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 shrink-0 whitespace-nowrap">{po.id}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">{po.vendor}</span>
                  <span className="text-[10px] font-semibold text-[#792359] dark:text-[#e6a8d0] bg-[#792359]/10 px-1.5 rounded-sm shrink-0 whitespace-nowrap">{po.project}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-gray-900 dark:text-white whitespace-nowrap">{po.amount}</span>
                  <span className={\`text-[9px] font-semibold px-1.5 py-0.5 rounded-sm \${po.statusColor} whitespace-nowrap\`}>{po.status}</span>
                </div>`;
content = content.replace(targetPO, replPO);

// Recent Expenses
let targetEx = `                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 dark:text-gray-500 w-16">{ex.date}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 w-28 truncate">{ex.type}</span>
                  <span className="text-[10px] font-semibold text-[#792359] dark:text-[#e6a8d0] bg-[#792359]/10 px-1.5 rounded-sm">{ex.project}</span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{ex.amount}</span>`;
let replEx = `                <div className="flex items-center gap-2 flex-1 min-w-0 mr-3">
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 whitespace-nowrap">{ex.date}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 truncate flex-1">{ex.type}</span>
                  <span className="text-[10px] font-semibold text-[#792359] dark:text-[#e6a8d0] bg-[#792359]/10 px-1.5 rounded-sm shrink-0 whitespace-nowrap">{ex.project}</span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white whitespace-nowrap shrink-0">{ex.amount}</span>`;
content = content.replace(targetEx, replEx);

// Recent Challans
let targetCh = `                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 w-12">{ch.id}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-24 truncate">{ch.vendor}</span>
                  <span className="text-[10px] font-semibold text-[#792359] dark:text-[#e6a8d0] bg-[#792359]/10 px-1.5 rounded-sm">{ch.project}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{ch.date}</span>
                  <span className={\`text-[9px] font-semibold px-1.5 py-0.5 rounded-sm \${ch.statusColor}\`}>{ch.status}</span>
                </div>`;
let replCh = `                <div className="flex items-center gap-2 flex-1 min-w-0 mr-3">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 shrink-0 whitespace-nowrap">{ch.id}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">{ch.vendor}</span>
                  <span className="text-[10px] font-semibold text-[#792359] dark:text-[#e6a8d0] bg-[#792359]/10 px-1.5 rounded-sm shrink-0 whitespace-nowrap">{ch.project}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{ch.date}</span>
                  <span className={\`text-[9px] font-semibold px-1.5 py-0.5 rounded-sm \${ch.statusColor} whitespace-nowrap\`}>{ch.status}</span>
                </div>`;
content = content.replace(targetCh, replCh);

fs.writeFileSync('src/pages/finance/FinanceDashboard.tsx', content);
