import Loader from "@/components/common/Loader"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Suspense, type CSSProperties } from "react"
import { Outlet } from "react-router-dom"
import AppSidebar from "./AppSidebar"
import Header from "./Header"
import MobileBottomNav from "./MobileBottomNav"

const sidebarStyle = { "--sidebar-width-icon": "4rem" } as CSSProperties

export default function AppLayout() {
  const defaultOpen = !document.cookie.includes("sidebar_state=false")

  return (
    <SidebarProvider defaultOpen={defaultOpen} style={sidebarStyle}>
      <AppSidebar />

      <SidebarInset className="min-w-0">
        <Header />

        <main className="min-w-0 flex-1 px-4 pt-5 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-6 md:pb-8 lg:px-8 lg:pt-8">
          <div className="mx-auto w-full max-w-screen-2xl">
            <Suspense fallback={<Loader fullScreen={false} />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </SidebarInset>

      <MobileBottomNav />
    </SidebarProvider>
  )
}
