import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import TopNav from "./TopNav"
import RightSidebar from "./RightSidebar"

export default function AppLayout() {
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 relative">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full min-w-0">
        <TopNav onToggleAi={() => setIsAiPanelOpen(!isAiPanelOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
          <Outlet />
        </main>
      </div>
      {isAiPanelOpen && (
        <RightSidebar isOpen={isAiPanelOpen} onClose={() => setIsAiPanelOpen(false)} />
      )}
    </div>
  )
}
