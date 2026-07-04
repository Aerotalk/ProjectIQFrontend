import { useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';

const steps = [
  'Select Project',
  'Client Details',
  'Ticket Details',
  'Assignment',
  'Review & Submit'
];

export default function CreateTicket() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Create Ticket</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Log a new support ticket and assign it to a team.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between relative max-w-3xl mx-auto">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 dark:bg-gray-800 -z-10"></div>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isPast = index < currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center gap-2 bg-[#f8f9fc] dark:bg-[#0f1115] px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                isActive ? 'bg-[#792359] text-white ring-4 ring-[#792359]/20' :
                isPast ? 'bg-[#792359] text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
              }`}>
                {isPast ? <CheckCircle2 size={16} /> : index + 1}
              </div>
              <span className={`text-xs font-medium ${isActive || isPast ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Form Area */}
        <div className="flex-1 p-8">
          
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Project Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Select Project <span className="text-red-500">*</span></label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white">
                    <option value="">Choose a project...</option>
                    <option value="analytics">Analytics Platform</option>
                    <option value="portal">Customer Portal</option>
                    <option value="mobile">Mobile App</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Client Details</h2>
               <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Select Client <span className="text-red-500">*</span></label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white">
                    <option value="">TechNova Pvt Ltd</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ticket Information</h2>
               <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Ticket Title <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g., Unable to access analytics dashboard" className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Category <span className="text-red-500">*</span></label>
                    <select className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white">
                      <option>Technical Issue</option>
                      <option>Billing</option>
                      <option>Feature Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Sub Category <span className="text-red-500">*</span></label>
                    <select className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white">
                      <option>Dashboard / Reporting</option>
                      <option>API Gateway</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Priority <span className="text-red-500">*</span></label>
                    <select className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white text-red-700 font-medium">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Impact <span className="text-red-500">*</span></label>
                    <select className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white">
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Urgency <span className="text-red-500">*</span></label>
                    <select className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white text-red-700 font-medium">
                      <option>High</option>
                      <option>Medium</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Description <span className="text-red-500">*</span></label>
                  <textarea rows={5} className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white" defaultValue="We are unable to load the analytics dashboard since this morning. Getting error 'Failed to load data' on the dashboard widget. Please check and resolve this at the earliest." />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Assignment</h2>
               <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Assign To Team</label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white">
                    <option>L2 Support Team</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Assign To Engineer</label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white">
                    <option>Rohit Singh</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Review & Submit</h2>
               <p className="text-sm text-gray-500">Please review the ticket details before submitting.</p>
               
               <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-md space-y-3 text-sm">
                 <div className="grid grid-cols-3"><span className="text-gray-500 font-medium">Title:</span> <span className="col-span-2 font-medium">Unable to access analytics dashboard</span></div>
                 <div className="grid grid-cols-3"><span className="text-gray-500 font-medium">Client:</span> <span className="col-span-2">TechNova Pvt Ltd</span></div>
                 <div className="grid grid-cols-3"><span className="text-gray-500 font-medium">Priority:</span> <span className="col-span-2 text-red-600 font-medium">High</span></div>
                 <div className="grid grid-cols-3"><span className="text-gray-500 font-medium">Assigned:</span> <span className="col-span-2">Rohit Singh</span></div>
               </div>
            </div>
          )}

        </div>

        {/* Right Info Panel (Contextual based on step) */}
        <div className="w-full md:w-[320px] bg-gray-50 dark:bg-black/20 border-l border-gray-100 dark:border-white/5 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Client Summary</h3>
          <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 p-4 rounded-md shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm">TechNova Pvt Ltd</span>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">Active</span>
            </div>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between"><span>Client ID:</span> <span className="font-medium text-gray-900 dark:text-gray-200">CL-10024</span></div>
              <div className="flex justify-between"><span>Email:</span> <span className="font-medium text-gray-900 dark:text-gray-200">admin@technova.com</span></div>
              <div className="flex justify-between"><span>Phone:</span> <span className="font-medium text-gray-900 dark:text-gray-200">+91 98765 43210</span></div>
            </div>
          </div>
          
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 mt-6">Active Services</h3>
          <div className="space-y-3">
            <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 p-3 rounded-md shadow-sm flex justify-between items-center text-xs">
              <span className="font-medium text-gray-800 dark:text-gray-200">Analytics Platform</span>
              <span className="text-gray-500">Since 12 Jan 2024</span>
            </div>
            <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 p-3 rounded-md shadow-sm flex justify-between items-center text-xs">
              <span className="font-medium text-gray-800 dark:text-gray-200">Support Plan</span>
              <span className="text-gray-500">Valid till 12 Jan 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-4">
        <button 
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-sm transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 dark:bg-[#181a1f] dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
        >
          <ArrowLeft size={16} /> Previous
        </button>

        {currentStep < steps.length - 1 ? (
          <button 
            onClick={nextStep}
            className="px-5 py-2 text-sm font-medium text-white bg-[#792359] hover:bg-[#52173c] rounded-sm transition-colors shadow-sm flex items-center gap-2"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button 
            className="px-6 py-2 text-sm font-medium text-white bg-[#792359] hover:bg-[#52173c] rounded-sm transition-colors shadow-sm flex items-center gap-2"
          >
            Submit Ticket <CheckCircle2 size={16} />
          </button>
        )}
      </div>

    </div>
  );
}
