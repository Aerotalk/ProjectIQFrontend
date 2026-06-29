import { useState, useEffect } from "react"
import { Sparkles, Calendar, Briefcase, Filter, ChevronDown, ListTodo, FileText, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="max-w-6xl mx-auto animate-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center gap-3 shadow-sm hover-lift">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <p className="text-blue-900 font-medium">Psst! You have more to discover here. 🌟</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Leads */}
        <DashboardCard 
          title="My Leads" 
          icon={Calendar} 
          loading={loading}
          iconColor="bg-blue-100 text-blue-600"
          emptyStateTitle="Track progress as you qualify leads."
          emptyStateIllustration={<CircleIllustration color="bg-blue-200" />}
        />

        {/* My Opportunities */}
        <DashboardCard 
          title="My Opportunities" 
          icon={Briefcase} 
          loading={loading}
          iconColor="bg-orange-100 text-orange-600"
          emptyStateTitle="View your deals to keep them moving."
          emptyStateIllustration={<CircleIllustration color="bg-orange-200" />}
        />

        {/* My Contacts */}
        <DashboardCard 
          title="My Contacts" 
          icon={Filter} 
          loading={loading}
          iconColor="bg-purple-100 text-purple-600"
          emptyStateTitle="Add contacts and see who is new."
          emptyStateIllustration={<CircleIllustration color="bg-purple-200" />}
        />

        {/* Recent Records */}
        <Card className="shadow-sm border-slate-200 hover-lift flex flex-col">
          <CardHeader className="pb-2 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium text-slate-800">Recent Records</CardTitle>
              <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-4">
                <RecentRecordItem title="Open Cases for Accounts I Own" icon={FileText} />
                <RecentRecordItem title="Open Cases" icon={FileText} />
                <RecentRecordItem title="My Open Cases by Priority" icon={FileText} />
                <RecentRecordItem title="My Closed Cases by Close Date" icon={FileText} />
                <RecentRecordItem title="My Cases Closed MTD" icon={FileText} />
              </ul>
            )}
          </CardContent>
          <div className="p-3 border-t border-slate-100 text-center mt-auto">
            <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
          </div>
        </Card>

        {/* New Cases */}
        <DashboardCard 
          title="All New Cases By Priority" 
          icon={ListTodo} 
          loading={loading}
          iconColor="bg-pink-100 text-pink-600"
          emptyStateTitle="Tackle service issues when cases come in."
          emptyStateIllustration={<CircleIllustration color="bg-pink-200" />}
        />

        {/* Make It Your Home */}
        <Card className="shadow-sm border-slate-200 hover-lift bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium text-slate-800">Make It Your Home</CardTitle>
              <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col items-center text-center">
            <p className="text-sm text-slate-500 mb-8 max-w-md">
              To replace a card, click its action menu and select <strong>Change Home Card</strong>. Use the filters on cards to personalize your view even more.
            </p>
            <div className="relative w-72 h-32 bg-white border-2 border-slate-100 rounded-xl shadow-sm p-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500" />
                <div className="flex-1 h-6 rounded-full bg-slate-100" />
                <div className="w-12 h-6 rounded-full bg-slate-200" />
              </div>
              <div className="ml-auto w-32 h-16 rounded-lg bg-slate-50 border border-slate-100 p-2 flex flex-col gap-2 mt-2">
                <div className="w-full h-3 bg-slate-200 rounded" />
                <div className="w-3/4 h-3 bg-slate-200 rounded" />
              </div>
              {/* Pointer Icon overlay */}
              <div className="absolute right-6 bottom-4 w-6 h-6 text-orange-500 -rotate-12">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="2"><path d="M11 2L2 21l8-4 4 8 3-2-4-8 8-4L11 2z" /></svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardCard({ 
  title, icon: Icon, loading, iconColor, emptyStateTitle, emptyStateIllustration 
}: { 
  title: string, icon: any, loading: boolean, iconColor: string, emptyStateTitle: string, emptyStateIllustration: React.ReactNode 
}) {
  return (
    <Card className="shadow-sm border-slate-200 hover-lift flex flex-col h-80">
      <CardHeader className="pb-2 border-b border-slate-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder={title} className="pl-7 pr-2 py-1 text-sm border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48" />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50">New</button>
            <button className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col items-center justify-center relative">
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center space-y-6">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center animate-in">
            {emptyStateIllustration}
            <p className="text-sm text-slate-500 mt-4">{emptyStateTitle}</p>
          </div>
        )}
      </CardContent>

      <div className="p-3 border-t border-slate-100 flex justify-between items-center text-sm">
        <button className="text-blue-600 font-medium hover:underline">View Report</button>
        <button className="text-slate-400 hover:text-slate-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </Card>
  )
}

function CircleIllustration({ color }: { color: string }) {
  return (
    <div className={`w-32 h-32 rounded-full ${color} relative flex items-center justify-center mt-4`}>
      <div className="absolute inset-0 m-auto w-24 h-16 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/40 flex flex-col justify-between p-2">
        <div className="w-full h-3 bg-slate-200 rounded-sm" />
        <div className="flex gap-1 h-8">
          <div className="flex-1 bg-slate-100 rounded-sm" />
          <div className="flex-1 bg-slate-100 rounded-sm" />
          <div className="flex-1 bg-slate-100 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

function RecentRecordItem({ title, icon: Icon }: { title: string, icon: any }) {
  return (
    <li className="flex items-center gap-3 hover:bg-slate-50 p-2 -mx-2 rounded-lg cursor-pointer transition-colors group">
      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-4 h-4" />
      </div>
      <a href="#" className="text-sm text-blue-600 hover:underline">{title}</a>
    </li>
  )
}
