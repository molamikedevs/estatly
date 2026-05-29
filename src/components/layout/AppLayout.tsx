import { Outlet } from "react-router-dom"
import AppSidebar from "./AppSidebar"
import Header from "./Header"
import MobileBottomNav from "./MobileBottomNav"

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar — desktop only */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 scrollbar-thin overflow-y-auto">
          <div className="mx-auto max-w-screen-2xl px-4 py-5 pb-24 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:pb-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav — mobile only */}
      <MobileBottomNav />
    </div>
  )
}
