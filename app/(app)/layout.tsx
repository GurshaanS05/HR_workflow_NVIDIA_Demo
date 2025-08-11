import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import TopNav from "@/components/top-nav"
import { Toaster } from "@/components/ui/toaster"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <SidebarProvider>
            <AppSidebar />
            <div className="flex min-h-svh w-full flex-col">
              <header className="sticky top-0 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
                <div className="mx-auto max-w-7xl px-3 sm:px-6">
                  <div className="flex h-14 items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <TopNav />
                  </div>
                </div>
              </header>
              <main className="mx-auto w-full max-w-7xl p-3 sm:p-6">{children}</main>
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
