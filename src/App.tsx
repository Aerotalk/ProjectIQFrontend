import { BrowserRouter, Routes, Route } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import Home from "./pages/Home"
import Contacts from "./pages/Contacts"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="contacts" element={<Contacts />} />
          {/* Add placeholder routes for other navigation items to prevent 404s during demo */}
          <Route path="accounts" element={<div className="p-6">Accounts Page (Coming Soon)</div>} />
          <Route path="sales" element={<div className="p-6">Sales Page (Coming Soon)</div>} />
          <Route path="service" element={<div className="p-6">Service Page (Coming Soon)</div>} />
          <Route path="marketing" element={<div className="p-6">Marketing Page (Coming Soon)</div>} />
          <Route path="account" element={<div className="p-6">Account Settings (Coming Soon)</div>} />
          <Route path="devops" element={<div className="p-6">DevOps Center (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
