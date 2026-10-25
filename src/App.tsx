import ProtectedRoute from "@/components/layout/ProtectedRoute"
import RoleProtected from "@/components/layout/RoleProtected"
import { shouldRetry } from "@/lib/errors"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import Loader from "@/components/common/Loader"
import AppLayout from "@/components/layout/AppLayout"

// ── Lazy-loaded pages: each becomes its own chunk ──
const Login = lazy(() => import("@/pages/Login"))
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"))
const ResetPassword = lazy(() => import("@/pages/ResetPassword"))
const Dashboard = lazy(() => import("@/pages/Dashboard"))
const Properties = lazy(() => import("@/pages/Properties"))
const Property = lazy(() => import("@/pages/Property"))
const Clients = lazy(() => import("@/pages/Clients"))
const Viewings = lazy(() => import("@/pages/Viewings"))
const Profile = lazy(() => import("@/pages/Profile"))
const Agents = lazy(() => import("@/pages/Agents"))
const Settings = lazy(() => import("@/pages/Settings"))
const PageNotFound = lazy(() => import("@/pages/PageNotFound"))
const Managers = lazy(() => import("./pages/Managers"))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: shouldRetry,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* PROTECTED ROUTES (require authentication) */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="/dashboard" />} />

              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:propertyId" element={<Property />} />

              <Route path="/clients" element={<Clients />} />

              <Route path="/viewings" element={<Viewings />} />

              <Route path="/profile" element={<Profile />} />

              <Route
                path="/agents"
                element={
                  <RoleProtected allowed={["admin", "manager"]}>
                    <Agents />
                  </RoleProtected>
                }
              />

              <Route
                path="/settings"
                element={
                  <RoleProtected allowed={["admin"]}>
                    <Settings />
                  </RoleProtected>
                }
              />
              <Route
                path="/managers"
                element={
                  <RoleProtected allowed={["admin"]}>
                    <Managers />
                  </RoleProtected>
                }
              />
            </Route>

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
