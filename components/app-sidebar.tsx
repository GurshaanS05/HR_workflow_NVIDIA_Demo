"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Shuffle, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const pathname = usePathname()
  const items = [
    { title: "Dashboard", href: "/", icon: LayoutDashboard },
    { title: "Transfers", href: "/transfers", icon: Shuffle },
    { title: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-2 py-1 flex items-center gap-2">
          <span className="text-sm font-semibold">HR Mobility</span>
          <span className="text-xs text-muted-foreground font-normal">NVIDIA Demo</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.href
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} className={cn(active && "font-semibold")}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 text-xs text-muted-foreground">MVP</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
