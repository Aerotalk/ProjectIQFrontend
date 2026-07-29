import { cn } from "@/lib/utils";

export const formStyles = {
  label: "block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1",
  field: (hasError?: boolean, disabled?: boolean) => 
    cn(
      "w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white",
      "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors appearance-none",
      disabled ? "opacity-60 cursor-not-allowed" : "",
      hasError ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-white/10"
    ),
    // sectionTitle: "text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-2",
  sectionTitle: "text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-b-gray-200 dark:border-b-white/10 pb-2 border-l-4 border-l-primary pl-3 mb-4 flex items-center",
  textarea: (hasError?: boolean, disabled?: boolean) => 
    cn(
      "w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white resize-none",
      "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors",
      disabled ? "opacity-60 cursor-not-allowed" : "",
      hasError ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-white/10"
    ),
};
