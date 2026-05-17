import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Account from "./pages/Account"
import Agent from "./pages/Agent"
import Agents from "./pages/Agents"
import AppLayout from "./pages/AppLayout"
import Client from "./pages/Client"
import Clients from "./pages/Clients"
import { default as Dashboard, default as Login } from "./pages/Login"
import NewProperty from "./pages/NewProperty"
import PageNotFound from "./pages/PageNotFound"
import Properties from "./pages/Properties"
import Property from "./pages/Property"
import Settings from "./pages/Settings"
import Viewings from "./pages/Viewings"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/new" element={<NewProperty />} />
          <Route path="properties/:propertyId" element={<Property />} />
          <Route path="agents" element={<Agents />} />
          <Route path="agents/:agentId" element={<Agent />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:clientId" element={<Client />} />
          <Route path="viewings" element={<Viewings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="account" element={<Account />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
