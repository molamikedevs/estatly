import ProtectedRoute from "@/components/layout/ProtectedRoute"
import RoleProtected from "@/components/layout/RoleProtected"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import AppLayout from "@/components/layout/AppLayout"
import Spinner from "@/components/Spinner"

// ── Lazy-loaded pages — each becomes its own chunk ──
const Login = lazy(() => import("@/pages/Login"))
const UpdatePasswordForm = lazy(
  () => import("@/features/auth/UpdatePasswordForm")
)
const Dashboard = lazy(() => import("@/pages/Dashboard"))
const Properties = lazy(() => import("@/pages/Properties"))
const Property = lazy(() => import("@/pages/Property"))
const Clients = lazy(() => import("@/pages/Clients"))
const Client = lazy(() => import("@/pages/Client"))
const Viewings = lazy(() => import("@/pages/Viewings"))
const ProfilePage = lazy(() => import("@/pages/ProfilePage"))
const Agents = lazy(() => import("@/pages/Agents"))
const Agent = lazy(() => import("@/pages/Agent"))
const Settings = lazy(() => import("@/pages/Settings"))
const PageNotFound = lazy(() => import("@/pages/PageNotFound"))

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
        <Suspense fallback={<Spinner />}>
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
              <Route index element={<Navigate replace to="/dashboard" />} />

              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:propertyId" element={<Property />} />

              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:clientId" element={<Client />} />

              <Route path="/viewings" element={<Viewings />} />

              <Route path="/profile/:profileId" element={<ProfilePage />} />

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
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
