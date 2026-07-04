import React, { useState, useEffect } from 'react';
import {
  User,
  LogOut,
  Sun,
  Moon,
  LineChart,
  PieChart,
  Ticket,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function DashboardLayout({ children, role = 'org' }: { children: React.ReactNode, role?: 'org' | 'company' }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Ticket System');
  const [showWelcome, setShowWelcome] = useState(false);
  const location = useLocation();

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

  const basePath = role === 'company' ? '/companydashboard' : '/orgdashboard';

  const navItems = [
    {
      name: 'Account',
      icon: User,
      subItems: [
        { name: 'Account Dashboard', path: `${basePath}/account` },
        ...(role === 'org' ? [{ name: 'My Accounts', path: `${basePath}/my-accounts` }] : [])
      ]
    },
    {
      name: 'Sales',
      icon: LineChart,
      subItems: [{ name: 'Sales Dashboard', path: `${basePath}/sales` }]
    },
    {
      name: 'Finance',
      icon: PieChart,
      subItems: [{ name: 'Finance Dashboard', path: `${basePath}/finance` }]
    },
    {
      name: 'Ticket System',
      icon: Ticket,
      subItems: role === 'company' ? [
        { name: 'Dashboard', path: `${basePath}` },
        { name: 'All Tickets', path: `${basePath}/tickets` },
        { name: 'Create Ticket', path: `${basePath}/tickets/create` },
        { name: 'Projects', path: `${basePath}/projects` },
        { name: 'Clients', path: `${basePath}/clients` },
        { name: 'Reports', path: `${basePath}/reports` },
        { name: 'Knowledge Base', path: `${basePath}/knowledge-base` },
        { name: 'Notifications', path: `${basePath}/notifications` },
        { name: 'Admin Settings', path: `${basePath}/admin` }
      ] : [
        { name: 'Ticket Dashboard', path: `${basePath}` }
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0f1115] flex transition-colors duration-200 font-sans">

      {/* Welcome Toast Notification */}
      <div className={`fixed top-20 right-8 flex items-center gap-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 px-5 py-3.5 rounded-sm shadow-xl transition-all duration-500 transform z-50 ${showWelcome ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>
        <CheckCircle2 size={20} />
        <div>
          <span className="block text-sm font-bold">Welcome back!</span>
          <span className="block text-xs mt-0.5 opacity-90">You have successfully logged in as {role === 'company' ? 'Client Company' : 'AeroTalk Solutions'}.</span>
        </div>
      </div>

      {/* Sidebar - Using a deep, rich premium tone based on #792359 */}
      <aside className="w-[260px] bg-[#3a112b] dark:bg-[#1a0813] text-gray-300 flex flex-col fixed h-full z-20 border-r border-[#792359]/20 shadow-xl shadow-[#792359]/5">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 bg-black/10">
          <div className="w-7 h-7 bg-gradient-to-br from-[#b8458f] to-[#792359] text-white flex items-center justify-center font-bold text-sm mr-3 rounded-sm shadow-sm">
            IQ
          </div>
          <span className="font-bold text-lg tracking-wide text-white">PROJECT IQ</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 flex flex-col gap-1 px-4 overflow-y-auto custom-scrollbar">
          <div className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2 px-2">
            Main Menu
          </div>

          {navItems.map((item) => {
            const isExpanded = expandedMenu === item.name;
            const hasActiveSub = item.subItems.some(sub => location.pathname === sub.path || (sub.path !== basePath && location.pathname.startsWith(sub.path)));

            return (
              <div key={item.name} className="mb-1">
                <button
                  onClick={() => setExpandedMenu(isExpanded ? null : item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-all duration-200 rounded-sm
                    ${hasActiveSub && !isExpanded ? 'bg-white/5 text-white border-l-2 border-[#b8458f]' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={hasActiveSub ? 'text-[#e6a8d0]' : 'text-gray-400'} />
                    {item.name}
                  </div>
                  <ChevronRight size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90 text-white' : 'text-gray-500'}`} />
                </button>

                {/* Dropdown Content */}
                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
                >
                  <div className="pl-9 pr-3 py-1 flex flex-col gap-1 border-l border-white/10 ml-5 relative">
                    {item.subItems.map(sub => {
                      const exactMatch = location.pathname === sub.path;
                      const hasExactMatch = item.subItems.some(s => location.pathname === s.path);
                      const isActive = exactMatch || (!hasExactMatch && sub.path !== basePath && location.pathname.startsWith(sub.path));
                      
                      return (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className={`block py-2 text-sm transition-colors rounded-sm px-3 relative
                            ${isActive ? 'text-white bg-white/10 font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                          `}
                        >
                          {isActive && <div className="absolute left-[-17px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#e6a8d0] border-2 border-[#3a112b]" />}
                          {sub.name}
                        </Link>
                       );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#792359] flex items-center justify-center text-white font-bold text-xs">
              {role === 'company' ? 'CC' : 'AT'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white truncate max-w-[130px]" title={role === 'company' ? "Client Company" : "AeroTalk Solutions"}>
                {role === 'company' ? 'Client Company' : 'AeroTalk Solutions'}
              </span>
              <span className="text-[10px] text-gray-400">{role === 'company' ? 'Company' : 'Admin'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">

        {/* Top Header - Clean, subtle border, highly professional */}
        <header className="h-16 bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-200">

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            <span className="hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer">Dashboard</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#792359] dark:text-[#e6a8d0]">{expandedMenu || 'Overview'}</span>
          </div>

          <div className="flex items-center gap-3 relative">
            <div className="relative mr-4 hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" placeholder="Search..." className="pl-8 pr-4 py-1.5 text-sm bg-gray-100 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-[#181a1f] focus:border-[#792359] dark:focus:border-[#792359] rounded-sm transition-all outline-none w-48 focus:w-64 border" />
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

            <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 p-1.5 rounded-sm transition-colors"
              >
                <div className="w-7 h-7 bg-[#f0e4ec] dark:bg-[#792359]/20 text-[#792359] dark:text-[#e6a8d0] flex items-center justify-center font-bold text-xs rounded-sm">
                  AT
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1f2229] border border-gray-100 dark:border-white/10 shadow-xl py-1 z-50 rounded-sm origin-top-right animate-in fade-in zoom-in duration-150">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={role === 'company' ? "Client Company" : "AeroTalk Solutions"}>
                      {role === 'company' ? 'Client Company' : 'AeroTalk Solutions'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{role === 'company' ? 'company@aerotalk.in' : 'admin@aerotalk.com'}</p>
                  </div>
                  <div className="py-1">
                    <Link to={`${basePath}/profile`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5" onClick={() => setIsProfileOpen(false)}>
                      <User size={15} className="text-gray-400" />
                      View Profile
                    </Link>

                  </div>
                  <div className="border-t border-gray-100 dark:border-white/5 py-1">
                    <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
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
        <main className="flex-1 p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
