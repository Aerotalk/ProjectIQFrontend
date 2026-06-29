import { X, Sparkles, Bot, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"

export default function RightSidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  return (
    <aside className="absolute md:relative right-0 top-0 h-full w-80 bg-white border-l border-slate-200 shadow-2xl md:shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] flex flex-col z-50 transition-transform duration-300">
      <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50/50">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          ProjectIQ AI
        </div>
        <div className="flex items-center gap-2">
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Bot className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center text-center">
        <div className="relative w-40 h-40 mb-8 mt-4 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full animate-pulse blur-xl group-hover:blur-2xl transition-all duration-500" />
          <div className="relative w-full h-full bg-gradient-to-b from-indigo-50 to-white rounded-full shadow-inner border border-white/50 flex items-center justify-center">
            <Bot className="w-16 h-16 text-indigo-600 drop-shadow-md" />
            <Sparkles className="absolute top-4 right-4 w-6 h-6 text-amber-400 animate-bounce delay-100" />
            <Sparkles className="absolute bottom-8 left-4 w-4 h-4 text-purple-400 animate-bounce delay-300" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
          Get more done with powerful AI
        </h3>
        
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          ProjectIQ AI helps you work more efficiently with tools that enhance the power of your workspace data.
        </p>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Upgrade to advanced AI to chat with a conversational assistant that helps you search data, update records, and generate custom emails, all in one place.
        </p>

        <div className="w-full bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5 text-left shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
          
          <p className="text-sm font-medium text-indigo-900 mb-4 pr-4">
            Advanced AI features are available with the paid version of ProjectIQ.
          </p>
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 group-hover:translate-y-[-2px] transition-all">
            Upgrade Now <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
