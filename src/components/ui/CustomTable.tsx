import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (val: any, row: any) => React.ReactNode;
}

interface CustomTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
}

export default function CustomTable({
  columns,
  data,
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
  loading
}: CustomTableProps) {
  const handleSort = (column: string) => {
    if (!onSort) return;
    if (sortColumn === column) {
      onSort(column, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(column, 'asc');
    }
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 text-xs font-semibold sticky top-0 z-10 border-b border-gray-200 dark:border-white/10">
        <tr>
          {columns.map((col, index) => (
            <th
              key={index}
              className={`px-4 py-3 font-semibold ${col.sortable && onSort ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5' : ''}`}
              onClick={() => col.sortable && handleSort(col.key)}
            >
              <div className="flex items-center gap-1">
                {col.label}
                {col.sortable && onSort && (
                  <ArrowUpDown size={12} className={sortColumn === col.key ? 'text-primary dark:text-secondary' : 'opacity-50'} />
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
        {loading ? (
          <tr>
            <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-500">
              Loading...
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-500">
              No records found
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr
              key={i}
              className={`transition-colors group ${onRowClick ? 'cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/[0.02]' : 'hover:bg-gray-50/50 dark:hover:bg-white/[0.02]'}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col, j) => (
                <td key={j} className="px-4 py-3 text-gray-900 dark:text-white">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
