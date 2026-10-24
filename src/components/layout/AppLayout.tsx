import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import AppSidebar from "./AppSidebar"
import Header from "./Header"
import MobileBottomNav from "./MobileBottomNav"

export default function AppLayout() {
  const defaultOpen = !document.cookie.includes("sidebar_state=false")

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />

      <SidebarInset>
        <Header />

        {/* Bottom padding = bar height + iPhone home indicator, so nothing hides behind the bar */}
        <main className="flex-1 px-4 pt-5 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-6 md:pb-8 lg:px-8 lg:pt-8">
          <div className="mx-auto w-full max-w-screen-2xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>

      <MobileBottomNav />
    </SidebarProvider>
  )
}
