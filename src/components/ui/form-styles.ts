import { cn } from "@/lib/utils";

export const formStyles = {
  label: "block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5",
  field: (hasError?: boolean, disabled?: boolean) => 
    cn(
      "w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-md text-sm text-gray-900 dark:text-white hover:bg-gray-50/50 dark:hover:bg-[#13151a]",
      "focus:outline-none focus:ring-4 focus:ring-[#792359]/15 focus:border-[#792359] transition-all appearance-none",
      disabled ? "opacity-60 cursor-not-allowed" : "",
      hasError ? "border-red-500 dark:border-red-500" : "border-gray-200 dark:border-white/10"
    ),
  sectionTitle: "text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-4 border-[#792359] pl-3 mt-6 mb-4 flex items-center",
  textarea: (hasError?: boolean, disabled?: boolean) => 
    cn(
      "w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-md text-sm text-gray-900 dark:text-white resize-none hover:bg-gray-50/50 dark:hover:bg-[#13151a]",
      "focus:outline-none focus:ring-4 focus:ring-[#792359]/15 focus:border-[#792359] transition-all",
      disabled ? "opacity-60 cursor-not-allowed" : "",
      hasError ? "border-red-500 dark:border-red-500" : "border-gray-200 dark:border-white/10"
    ),
};
