import ProtectedRoute from "@/components/layout/ProtectedRoute"
import RoleProtected from "@/components/layout/RoleProtected"
import UpdatePasswordForm from "@/features/auth/UpdatePasswordForm"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import AppLayout from "@/components/layout/AppLayout"
import Agent from "@/pages/Agent"
import Agents from "@/pages/Agents"
import Client from "@/pages/Client"
import Clients from "@/pages/Clients"
import Dashboard from "@/pages/Dashboard"
import Login from "@/pages/Login"
import NewProperty from "@/pages/NewProperty"
import PageNotFound from "@/pages/PageNotFound"
import ProfilePage from "@/pages/ProfilePage"
import Properties from "@/pages/Properties"
import Property from "@/pages/Property"
import Settings from "@/pages/Settings"
import Viewings from "@/pages/Viewings"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<UpdatePasswordForm />} />

          {/* PROTECTED ROUTES (require authentication) */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Default redirect */}
            <Route index element={<Navigate replace to="/dashboard" />} />

            {/* Dashboard — all authenticated users */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Properties — all authenticated users */}
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/new" element={<NewProperty />} />
            <Route path="/properties/:propertyId" element={<Property />} />

            {/* Clients — all authenticated users (RLS filters per role) */}
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:clientId" element={<Client />} />

            {/* Viewings — all authenticated users (RLS filters per role) */}
            <Route path="/viewings" element={<Viewings />} />

            {/* Profile — current user's own profile */}
            <Route path="/profile/:profileId" element={<ProfilePage />} />

            {/* Agents — admin and manager only */}
            <Route
              path="/agents"
              element={
                <RoleProtected allowed={["admin", "manager"]}>
                  <Agents />
                </RoleProtected>
              }
            />
            <Route
              path="/agents/:agentId"
              element={
                <RoleProtected allowed={["admin", "manager"]}>
                  <Agent />
                </RoleProtected>
              }
            />

            {/* Settings — admin only */}
            <Route
              path="/settings"
              element={
                <RoleProtected allowed={["admin"]}>
                  <Settings />
                </RoleProtected>
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
