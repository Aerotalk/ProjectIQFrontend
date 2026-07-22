"use no memo";
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/ui/CustomSelect';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2, 
  Cpu, 
  Tag, 
  Activity,
  Calendar,
  User,
  Settings
} from 'lucide-react';

interface Props {
  readOnly?: boolean;
}

export default function KBFormSection({ readOnly }: Props) {
  const { register, control, watch, formState: { errors } } = useFormContext();

  const labelClass = 'block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5';
  
  const symptomsVal = watch('symptoms');
  const causeVal = watch('cause');
  const workaroundVal = watch('workaround');
  const ciVal = watch('ci');
  const errorCodeVal = watch('errorCode');
  const titleVal = watch('title');
  const categoryVal = watch('category');
  const statusVal = watch('status');
  const authorVal = watch('author') || 'System Admin';
  const updatedAtVal = watch('updatedAt');

  // ── READ ONLY MODE (BLOG ARTICLE POST VIEWER) ──
  if (readOnly) {
    return (
      <div className="max-w-4xl mx-auto py-4 space-y-8 select-text">
        {/* Article Header */}
        <div className="space-y-4 border-b border-gray-200 dark:border-white/10 pb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            {titleVal || 'Untitled KEDB Article'}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-gray-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">{authorVal}</span>
            </div>
            
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/10" />
            
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>{updatedAtVal ? new Date(updatedAtVal).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Just now'}</span>
            </div>

            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/10" />

            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-2.5 py-0.5 rounded-full font-semibold text-gray-700 dark:text-gray-300 text-[10px] uppercase tracking-widest">
              <Tag size={10} className="text-[#792359] dark:text-[#e6a8d0]" />
              <span>{categoryVal || 'General'}</span>
            </div>

            <div className="ml-auto">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                statusVal === 'Published' 
                  ? 'text-green-700 bg-green-50 dark:bg-green-500/10 border border-green-200/30' 
                  : 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-800'
              }`}>
                {statusVal || 'Draft'}
              </span>
            </div>
          </div>
        </div>

        {/* Affected Hardware/Software System callout banner */}
        {(ciVal || errorCodeVal) && (
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 dark:from-white/[0.01] dark:to-white/[0.03] border border-gray-200/60 dark:border-white/5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
            {ciVal && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#792359]/10 text-[#792359] dark:bg-[#792359]/20 dark:text-[#e6a8d0] flex items-center justify-center shrink-0">
                  <Cpu size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Affected Configuration Item</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{ciVal}</span>
                </div>
              </div>
            )}
            
            {errorCodeVal && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 flex items-center justify-center shrink-0">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Identified Error Code</span>
                  <span className="text-sm font-mono font-bold text-pink-600 dark:text-pink-400">{errorCodeVal}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Body Content Sections */}
        <div className="space-y-8">
          {/* Symptoms Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              <span>1. Symptoms & Problem Description</span>
            </h3>
            <div className="p-6 rounded-2xl bg-blue-50/20 dark:bg-blue-500/[0.02] border border-blue-100/50 dark:border-blue-500/10 leading-relaxed text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
              {symptomsVal || 'No symptom description provided.'}
            </div>
          </div>

          {/* Root Cause Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle size={18} className="text-amber-500" />
              <span>2. Root Cause Analysis (RCA)</span>
            </h3>
            <div className="p-6 rounded-2xl bg-amber-50/20 dark:bg-amber-500/[0.02] border border-amber-100/50 dark:border-amber-500/10 leading-relaxed text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
              {causeVal || 'No root cause analysis documented.'}
            </div>
          </div>

          {/* Workaround Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>3. Workaround & Resolution</span>
            </h3>
            <div className="p-6 rounded-2xl bg-emerald-50/20 dark:bg-emerald-500/[0.02] border border-emerald-100/50 dark:border-emerald-500/10 leading-relaxed text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
              {workaroundVal || 'No workaround or resolution documented.'}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // ── EDIT / CREATE MODE (SPLIT BLOG PUBLISHING SPACE) ──
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* LEFT COLUMN: The Document Writing Canvas */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Title Input (Borderless Headline style) */}
        <div className="space-y-1">
          <input 
            type="text"
            {...register('title')}
            placeholder="KEDB Title: e.g., Gateway 504 Timeout during checkout transaction"
            className="w-full bg-transparent border-none border-b border-transparent focus:border-[#792359] dark:focus:border-[#c44997] focus:ring-0 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white px-0 py-2 focus:outline-none transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
          />
          {errors.title && <p className="text-red-500 text-xs font-semibold">{errors.title.message as string}</p>}
        </div>

        {/* Symptoms Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Activity size={16} className="text-blue-500" />
            <span>1. Symptoms & Description *</span>
          </label>
          <textarea
            {...register('symptoms')}
            rows={6}
            placeholder="Describe the issue symptoms. What does the user see? What are the logs or screens showing? (e.g. users see infinite spinner on checkout)"
            className={cn(
              "w-full p-4 rounded-2xl bg-gray-50/50 dark:bg-black/20 border text-sm text-gray-900 dark:text-white transition-all outline-none resize-y placeholder:text-gray-400 focus:bg-white dark:focus:bg-[#0f1115] focus:ring-2 focus:ring-[#792359]/20 focus:border-[#792359]",
              errors.symptoms ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 dark:border-white/5'
            )}
          />
          {errors.symptoms && <p className="text-red-500 text-xs font-semibold">{errors.symptoms.message as string}</p>}
        </div>

        {/* Root Cause Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <HelpCircle size={16} className="text-amber-500" />
            <span>2. Root Cause Analysis (RCA)</span>
          </label>
          <textarea
            {...register('cause')}
            rows={5}
            placeholder="What is the root cause? Why did this error take place? Document the database block, network disconnect, memory leak, or invalid parameter..."
            className="w-full p-4 rounded-2xl bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/5 text-sm text-gray-900 dark:text-white transition-all outline-none resize-y placeholder:text-gray-400 focus:bg-white dark:focus:bg-[#0f1115] focus:ring-2 focus:ring-[#792359]/20 focus:border-[#792359]"
          />
        </div>

        {/* Workaround / Resolution Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>3. Workaround & Resolution</span>
          </label>
          <textarea
            {...register('workaround')}
            rows={6}
            placeholder="What is the workaround or solution? Document step-by-step instructions for support agents or users to restore operations (e.g. restart service, run script)..."
            className="w-full p-4 rounded-2xl bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/5 text-sm text-gray-900 dark:text-white transition-all outline-none resize-y placeholder:text-gray-400 focus:bg-white dark:focus:bg-[#0f1115] focus:ring-2 focus:ring-[#792359]/20 focus:border-[#792359]"
          />
        </div>

      </div>

      {/* RIGHT COLUMN: The Publication sidebar panel */}
      <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-white/10 lg:pl-6 space-y-6">
        
        <div className="bg-gray-50/40 dark:bg-white/[0.01] border border-gray-200/50 dark:border-white/5 rounded-2xl p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/5 pb-2.5">
            <Settings size={14} className="text-[#792359] dark:text-[#e6a8d0]" />
            <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Publish Options</h4>
          </div>

          {/* Status Select */}
          <div>
            <label className={labelClass}>Status *</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || 'Draft'}
                  onChange={field.onChange}
                  options={['Draft', 'Published']}
                />
              )}
            />
          </div>

          {/* Category Input */}
          <div>
            <label className={labelClass}>Category *</label>
            <Input 
              type="text"
              {...register('category')}
              placeholder="e.g. Network, Database"
              className={cn(errors.category ? 'border-red-500' : '')}
            />
            {errors.category && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.category.message as string}</p>}
          </div>

          {/* Configuration Item */}
          <div>
            <label className={labelClass}>Configuration Item (CI)</label>
            <Input 
              type="text"
              {...register('ci')}
              placeholder="e.g. pg-checkout-service"
            />
          </div>

          {/* Error Code */}
          <div>
            <label className={labelClass}>Error Code / Pattern</label>
            <Input 
              type="text"
              {...register('errorCode')}
              placeholder="e.g. HTTP 504 Gateway"
            />
          </div>

          {/* Author Badge */}
          <div className="pt-2 border-t border-gray-200 dark:border-white/5 text-xs text-gray-400 space-y-2">
            <div className="flex justify-between">
              <span>Author:</span>
              <span className="font-semibold text-gray-600 dark:text-gray-300">{authorVal}</span>
            </div>
            <div className="flex justify-between">
              <span>Last updated:</span>
              <span>{updatedAtVal ? new Date(updatedAtVal).toLocaleDateString() : 'Just now'}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
