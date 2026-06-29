import { Search, Bell, Settings, HelpCircle, Grid, User, Sparkles, Menu } from "lucide-react"

export default function TopNav({ onToggleAi }: { onToggleAi?: () => void }) {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 z-10 shadow-sm relative">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-50/50 to-blue-50/50 pointer-events-none" />
      
      <div className="flex items-center gap-3 md:gap-6 relative z-10 w-full md:w-auto">
        <button className="md:hidden text-slate-500 hover:text-slate-800">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          ProjectIQ
        </h1>
        
        <div className="relative group flex-1 md:w-96 ml-2 md:ml-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full h-9 md:h-10 pl-9 md:pl-10 pr-4 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-white"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3 relative z-10 ml-4">
        <div className="hidden xl:flex items-center gap-2 text-sm text-slate-600 mr-2">
          <span>Don't wait: <strong className="text-slate-900">Save 70%</strong> now with code <strong className="text-slate-900">STARTER70</strong></span>
          <a href="#" className="text-blue-600 hover:underline">Terms apply.</a>
          <button className="ml-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-1.5 rounded-full font-medium hover:shadow-lg hover:shadow-emerald-500/20 transition-all hover:-translate-y-0.5">
            Upgrade
          </button>
        </div>

        <div className="flex items-center gap-1 border-l border-slate-200 pl-2 md:pl-4">
          <div className="hidden md:flex items-center gap-1">
            <IconButton icon={Grid} />
            <IconButton icon={HelpCircle} />
            <IconButton icon={Settings} />
          </div>
          <IconButton icon={Bell} />
          <button 
            onClick={onToggleAi}
            className="w-8 h-8 rounded-full flex items-center justify-center text-amber-500 hover:bg-amber-50 hover:text-amber-600 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button className="ml-1 md:ml-2 w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all hover:scale-105 shrink-0">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}

function IconButton({ icon: Icon }: { icon: any }) {
  return (
    <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
      <Icon className="w-5 h-5" />
    </button>
  )
}
