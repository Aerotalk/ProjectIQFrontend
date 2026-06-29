import { useState, useEffect } from "react"
import { ChevronDown, Filter, Settings, RefreshCw, ArrowUpDown, Edit, PieChart, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

export default function Contacts() {
  const [loading, setLoading] = useState(true)
  const [data] = useState([]) // Empty by default to show empty state

  useEffect(() => {
    // Simulate loading for skeleton
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden animate-in">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Contacts</span>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">All Contacts</h2>
              <button className="text-slate-400 hover:text-slate-600">
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="ml-2 w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">
                <span className="text-[10px]">📌</span>
              </button>
            </div>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">Import</Button>
            <Button variant="outline" size="sm" className="h-8">Add to Campaign</Button>
            <Button variant="outline" size="sm" className="h-8">Send Email</Button>
            <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">New</Button>
            <Button variant="outline" size="sm" className="h-8">Assign Label</Button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-500">
            0 items • Sorted by Name • Filtered by All contacts • Updated a few seconds ago
          </p>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search this list..." 
                className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
              />
            </div>
            
            <div className="flex border border-slate-200 rounded-md overflow-hidden bg-white">
              <IconButton icon={Settings} />
              <div className="w-px bg-slate-200" />
              <IconButton icon={ChevronDown} />
              <div className="w-px bg-slate-200" />
              <IconButton icon={RefreshCw} />
              <div className="w-px bg-slate-200" />
              <IconButton icon={ArrowUpDown} />
              <div className="w-px bg-slate-200" />
              <IconButton icon={Edit} />
              <div className="w-px bg-slate-200" />
              <IconButton icon={PieChart} />
              <div className="w-px bg-slate-200" />
              <IconButton icon={Filter} />
            </div>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto bg-slate-50/30 relative">
        <Table>
          <TableHeader className="bg-white sticky top-0 z-10 shadow-sm">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-center border-r border-slate-100">
                <CheckSquare className="w-4 h-4 text-slate-300 mx-auto" />
              </TableHead>
              <TableHead className="min-w-[150px] font-semibold text-slate-700 border-r border-slate-100">Name <span className="text-blue-500 ml-1">↑</span></TableHead>
              <TableHead className="min-w-[150px] font-semibold text-slate-700 border-r border-slate-100 flex justify-between items-center">
                Account Name <ChevronDown className="w-3 h-3 text-slate-400" />
              </TableHead>
              <TableHead className="min-w-[150px] font-semibold text-slate-700 border-r border-slate-100 flex justify-between items-center">
                Title <ChevronDown className="w-3 h-3 text-slate-400" />
              </TableHead>
              <TableHead className="min-w-[150px] font-semibold text-slate-700 border-r border-slate-100 flex justify-between items-center">
                Phone <ChevronDown className="w-3 h-3 text-slate-400" />
              </TableHead>
              <TableHead className="min-w-[150px] font-semibold text-slate-700 border-r border-slate-100 flex justify-between items-center">
                Email <ChevronDown className="w-3 h-3 text-slate-400" />
              </TableHead>
              <TableHead className="min-w-[150px] font-semibold text-slate-700 flex justify-between items-center">
                Contact Owner Alias <ChevronDown className="w-3 h-3 text-slate-400" />
              </TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {loading ? (
              // Skeleton loading rows
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="border-r border-slate-100"><Skeleton className="w-4 h-4 mx-auto" /></TableCell>
                  <TableCell className="border-r border-slate-100"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="border-r border-slate-100"><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="border-r border-slate-100"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="border-r border-slate-100"><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell className="border-r border-slate-100"><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell colSpan={7} className="h-[400px]">
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="w-40 h-40 rounded-full bg-purple-100 flex items-center justify-center relative mb-6">
                      <div className="absolute inset-0 bg-white/40 rounded-full m-4 shadow-sm border border-purple-200/50 flex flex-col justify-between p-4">
                        <div className="w-16 h-4 bg-purple-200 rounded-sm" />
                        <div className="flex gap-2 h-10">
                           <div className="flex-1 bg-purple-100 rounded-sm" />
                           <div className="flex-1 bg-purple-100 rounded-sm" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 text-purple-600 animate-bounce">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-medium text-slate-800 mb-2">Top sellers add their contacts first</h3>
                    <p className="text-slate-500 mb-6 text-sm">It's the fastest way to win more deals.</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
                      Add a Contact
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function IconButton({ icon: Icon }: { icon: any }) {
  return (
    <button className="px-3 py-1.5 hover:bg-slate-50 text-slate-500 transition-colors">
      <Icon className="w-4 h-4" />
    </button>
  )
}

function SearchIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}
