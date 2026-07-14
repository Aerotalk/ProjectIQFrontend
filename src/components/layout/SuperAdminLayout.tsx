import { useState, useEffect } from 'react';
import logo from '../../assets/BumbleERPLogo.png';
import {
  LogOut,
  Sun,
  Moon,
  Building,
  ChevronRight,
  Bell,
  Search,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

export default function SuperAdminLayout({ children }: { children?: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const location = useLocation();
  const { can } = usePermissions();

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }

    if (sessionStorage.getItem('showWelcomeToast') === 'true') {
      setShowWelcome(true);
      sessionStorage.removeItem('showWelcomeToast');
      setTimeout(() => setShowWelcome(false), 4000);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navConfig = [
    {
      name: 'Organizations',
      icon: Building,
      path: '/superadmin/organizations'
    },
    {
      name: 'Roles',
      icon: Shield,
      path: '/superadmin/roles',
      permission: 'role.view'
    }
  ];

  const navItems = navConfig.filter(item => !item.permission || can(item.permission));

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0f1115] flex transition-colors duration-200 font-sans">

      {/* Welcome Toast Notification */}
      <div className={`fixed top-20 right-8 flex items-center gap-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 px-5 py-3.5 rounded-sm shadow-xl transition-all duration-500 transform z-50 ${showWelcome ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>
        <CheckCircle2 size={20} />
        <div>
          <span className="block text-sm font-bold">Welcome back, Super Admin!</span>
          <span className="block text-xs mt-0.5 opacity-90">You have successfully logged in.</span>
        </div>
      </div>

      {/* Sidebar - Using a deep, rich premium tone based on #792359 */}
      <aside className="w-[220px] xl:w-[260px] bg-[#3a112b] dark:bg-[#1a0813] text-gray-300 flex flex-col fixed h-full z-20 border-r border-[#792359]/20 shadow-xl shadow-[#792359]/5">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 bg-black/10">
          <img src={logo} alt="BumbleERP Logo" className="h-10 w-auto mr-3 rounded-sm shadow-sm" />
          <span className="font-bold text-lg tracking-wide text-white">BumbleERP</span>
          <span className="ml-2 text-[10px] font-semibold bg-[#792359]/20 text-[#e6a8d0] px-1.5 py-0.5 rounded-sm border border-[#792359]/30">ADMIN</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 flex flex-col gap-1 px-4 overflow-y-auto custom-scrollbar">
          <div className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2 px-2">
            Main Menu
          </div>

          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 rounded-sm
                  ${isActive ? 'bg-white/5 text-white border-l-2 border-[#b8458f]' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}
                `}
              >
                <item.icon size={18} className={isActive ? 'text-[#e6a8d0]' : 'text-gray-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#792359] flex items-center justify-center text-white font-bold text-xs">
              SA
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white truncate max-w-[130px]" title="Super Admin">Super Admin</span>
              <span className="text-[10px] text-gray-400">System Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-[220px] xl:ml-[260px] flex flex-col min-h-screen min-w-0">

        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 lg:px-6 xl:px-8 sticky top-0 z-10 transition-colors duration-200 shadow-sm">

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-medium min-w-0 mr-4">
            <span className="hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer shrink-0">Super Admin</span>
            <ChevronRight size={14} className="mx-2 shrink-0" />
            <span className="text-[#792359] dark:text-[#e6a8d0] truncate">Organizations</span>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 relative shrink-0">
            <div className="relative mr-2 hidden lg:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" placeholder="Search..." className="pl-8 pr-4 py-1.5 text-sm bg-gray-100 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-[#181a1f] focus:border-[#792359] dark:focus:border-[#792359] rounded-sm transition-all outline-none w-36 focus:w-48 xl:w-48 xl:focus:w-64 border" />
            </div>

            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#792359] rounded-full border-2 border-white dark:border-[#181a1f]"></span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 p-1.5 rounded-sm transition-colors"
              >
                <div className="w-7 h-7 bg-[#f0e4ec] dark:bg-[#792359]/20 text-[#792359] dark:text-[#e6a8d0] flex items-center justify-center font-bold text-xs rounded-sm">
                  SA
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1f2229] border border-gray-100 dark:border-white/10 shadow-xl py-1 z-50 rounded-sm origin-top-right animate-in fade-in zoom-in duration-150">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Super Admin</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">superadmin@aerotalk.in</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      to="/login" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      onClick={() => {
                        localStorage.clear();
                        setIsProfileOpen(false);
                      }}
                    >
                      <LogOut size={15} />
                      Log Out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8">
          {children || <Outlet />}
        </main>

      </div>
    </div>
  );
}
