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
import { Home, MessageSquareText, Settings, UserRound, Lightbulb, Coins, Sparkles, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const NAV = [
  { title: "Overview", url: "/founder", icon: Home },
  { title: "Ideas", url: "/founder/ideas", icon: Lightbulb },
  { title: "Community funding", url: "/founder/funding", icon: Coins },
  { title: "Chats", url: "/founder/chats", icon: MessageSquareText },
  { title: "Mutiny", url: "/founder/mutiny", icon: Sparkles },
  { title: "Profile", url: "/founder/profile", icon: UserRound },
  { title: "Settings", url: "/founder/settings", icon: Settings },
]

export function AppFounderSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon" className="bg-[#0b0b0c] text-white">
      <SidebarHeader className="border-b border-[#1a1b1e]">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="justify-between py-9 h-14">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-sm bg-gradient-to-br from-white/70 to-white/30" />
                    <span>Mutiny • Founder</span>
                  </div>
                  <ChevronDown className="opacity-60" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
                <DropdownMenuItem>Switch account type</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active = pathname === item.url || pathname?.startsWith(item.url + "/")
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link href={item.url}>
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

        <SidebarGroup>
          <SidebarGroupLabel>Quick</SidebarGroupLabel>
          <SidebarGroupContent>
            <Button className="w-full h-8 text-sm bg-white text-black hover:bg-white/90">Post new idea</Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#1a1b1e]">
        <div className="rounded-md bg-white/[0.03] px-2 py-2 text-[11px] leading-tight text-white/70">
          Tip: Press Ctrl/Cmd + B to toggle the sidebar.
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
