import { ArrowLeft, Download, Send, CheckCircle2, Building, Calendar, DollarSign, Briefcase } from 'lucide-react';

interface PayrollProfileViewProps {
  payroll: any;
  onClose: () => void;
}

export default function PayrollProfileView({ payroll, onClose }: PayrollProfileViewProps) {
  const handleDownloadPayslip = async () => {
    try {
      // Use the detail ID if available, otherwise fallback (assuming payroll.id is the PayrollRunDetail ID)
      const detailId = payroll.id || payroll.detailId;
      if (!detailId) {
        alert("Cannot download payslip: Detail ID not found.");
        return;
      }
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/hrms/payroll/runs/details/${detailId}/payslip`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to download payslip");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip_${payroll.period}_${payroll.employee}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download payslip.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/30 dark:bg-[#121317]">
      {/* Header */}
      <div className="px-6 py-4 bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Payroll Summary
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                payroll.status === 'Processed' || payroll.status === 'Approved'
                  ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                  : 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20'
              }`}>
                {payroll.status}
              </span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Detailed view for {payroll.period}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={handleDownloadPayslip}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-medium shadow-sm"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Payslip</span>
          </button>
          {payroll.payout !== 'Paid' ? (
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-sm hover:bg-[#5d1944] transition-colors text-sm font-medium shadow-sm">
              <Send size={16} />
              Process Payout
            </button>
          ) : (
            <button disabled className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50 rounded-sm text-sm font-medium shadow-sm cursor-not-allowed">
              <CheckCircle2 size={16} />
              Payout Completed
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Employee Info Card */}
          <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
            
            <div className="w-20 h-20 rounded-full bg-[#f0e4ec] dark:bg-primary/20 text-primary dark:text-secondary flex items-center justify-center font-bold text-2xl shrink-0 z-10 border-4 border-white dark:border-[#181a1f] shadow-sm">
              {payroll.employee.substring(0, 2).toUpperCase()}
            </div>
            
            <div className="flex-1 text-center md:text-left z-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{payroll.employee}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-gray-400" /> {payroll.empId}</span>
                <span className="hidden md:inline text-gray-300 dark:text-gray-600">•</span>
                <span className="flex items-center gap-1.5"><Building size={14} className="text-gray-400" /> {payroll.dept}</span>
                <span className="hidden md:inline text-gray-300 dark:text-gray-600">•</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> {payroll.period}</span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#181a1f] p-5 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-green-50 dark:to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 relative z-10">Gross Salary</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 relative z-10">{payroll.gross}</h3>
            </div>
            <div className="bg-white dark:bg-[#181a1f] p-5 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-red-50 dark:to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 relative z-10">Total Deductions</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 relative z-10">₹35,000</h3>
            </div>
            <div className="bg-white dark:bg-[#181a1f] p-5 rounded-sm border border-primary/30 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-sm font-medium text-primary dark:text-secondary relative z-10">Net Payable</p>
              <h3 className="text-3xl font-bold text-primary dark:text-secondary mt-1 relative z-10">{payroll.net}</h3>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="bg-white dark:bg-[#181a1f] rounded-sm border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <DollarSign size={16} className="text-green-500" /> Earnings
                </h3>
              </div>
              <div className="p-0">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">Basic Pay</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">₹75,000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">House Rent Allowance (HRA)</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">₹30,000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">Special Allowance</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">₹25,000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">Leave Travel Allowance</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">₹10,000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">Reimbursements</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">₹10,000</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-white/[0.02] border-t border-gray-200 dark:border-white/10">
                    <tr>
                      <td className="px-5 py-3 font-bold text-gray-900 dark:text-white">Total Gross</td>
                      <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">{payroll.gross}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-white dark:bg-[#181a1f] rounded-sm border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <DollarSign size={16} className="text-red-500" /> Deductions
                </h3>
              </div>
              <div className="p-0">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">Income Tax (TDS)</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">₹25,000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">Provident Fund (PF)</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">₹4,800</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">Professional Tax (PT)</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">₹200</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">LOP (Loss of Pay)</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">₹5,000</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-white/[0.02] border-t border-gray-200 dark:border-white/10 mt-auto">
                    <tr>
                      <td className="px-5 py-3 font-bold text-gray-900 dark:text-white">Total Deductions</td>
                      <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">₹35,000</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
