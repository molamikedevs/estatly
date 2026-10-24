import Loader from "@/components/Loader"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Suspense, type CSSProperties } from "react"
import { Outlet } from "react-router-dom"
import AppSidebar from "./AppSidebar"
import Header from "./Header"
import MobileBottomNav from "./MobileBottomNav"

// Collapsed sidebar width: 64px gives 40px buttons with 12px on each side
const sidebarStyle = { "--sidebar-width-icon": "4rem" } as CSSProperties

export default function AppLayout() {
  // shadcn saves open/collapsed in a cookie. In Vite we read it ourselves.
  const defaultOpen = !document.cookie.includes("sidebar_state=false")

  return (
    <SidebarProvider defaultOpen={defaultOpen} style={sidebarStyle}>
      <AppSidebar />

      <SidebarInset>
        <Header />

        {/* Bottom padding = bar height + iPhone home indicator, so nothing hides behind the bar */}
        <main className="flex-1 px-4 pt-5 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-6 md:pb-8 lg:px-8 lg:pt-8">
          <div className="mx-auto w-full max-w-screen-2xl">
            {/* Page chunks load here, so the sidebar and header stay on screen */}
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
