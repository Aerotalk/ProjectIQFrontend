import { Link, useLocation } from "react-router-dom"
import { Home, Users, Building2, TrendingUp, HeadphonesIcon, Megaphone, Settings, Cloud } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Contacts", path: "/contacts", icon: Users },
  { name: "Accounts", path: "/accounts", icon: Building2 },
  { name: "Sales", path: "/sales", icon: TrendingUp },
  { name: "Service", path: "/service", icon: HeadphonesIcon },
  { name: "Marketing", path: "/marketing", icon: Megaphone },
  { name: "Your Account", path: "/account", icon: Settings },
  { name: "DevOps Center", path: "/devops", icon: Cloud },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden md:flex w-[88px] bg-[#0c142c] text-slate-300 flex-col items-center py-4 border-r border-slate-800 shadow-xl z-20">
      <div className="mb-8 flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-xl hover:bg-blue-600/30 transition-colors cursor-pointer">
        <Cloud className="w-8 h-8 text-blue-400" />
      </div>
      
      <nav className="flex-1 w-full space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-3 px-2 mx-2 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-blue-600/20 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]" 
                  : "hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
              )}
              <item.icon className={cn(
                "w-6 h-6 mb-1 transition-transform duration-200",
                isActive ? "text-blue-400 scale-110" : "text-slate-400 group-hover:text-slate-200 group-hover:scale-110"
              )} />
              <span className="text-[10px] font-medium text-center leading-tight opacity-80 group-hover:opacity-100">
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
