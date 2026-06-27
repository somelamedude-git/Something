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
import Image from "next/image"
import { Home, Search, Coins, MessageSquareText, UserRound, Settings, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuAction } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const NAV = [
  { title: "Overview",    url: "/investor",             icon: Home },
  { title: "Search",      url: "/investor/search",      icon: Search },
  { title: "Investments", url: "/investor/investments", icon: Coins },
  { title: "Chats",       url: "/investor/chats",       icon: MessageSquareText },
  { title: "Profile",     url: "/investor/profile",     icon: UserRound },
  { title: "Settings",    url: "/investor/settings",    icon: Settings },
]

interface AppInvestorSidebarProps {
  accentKey?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AppInvestorSidebar({ accentKey: _accentKey }: AppInvestorSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon">
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="justify-between h-14 hover:bg-sidebar-accent transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-5 w-5 shrink-0 overflow-hidden flex items-center justify-center">
                      <Image
                        src="/TheThing.png"
                        alt="Something Logo"
                        fill
                        className="object-contain"
                        sizes="20px"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold tracking-tight text-sidebar-foreground leading-tight">
                        Something
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground leading-tight">
                        Investor
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 opacity-40" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-(--radix-popper-anchor-width) bg-popover border border-border text-popover-foreground shadow-xl rounded-xl">
                <DropdownMenuItem asChild className="hover:bg-accent cursor-pointer text-xs rounded-lg py-2">
                  <Link href="/founder" className="w-full flex items-center gap-2">
                    <span className="text-muted-foreground">↩</span>
                    Switch to Founder
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground px-2 mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active = pathname === item.url || pathname?.startsWith(item.url + "/")
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-200 rounded-lg",
                        active
                          ? "font-semibold"
                          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <Link href={item.url} prefetch>
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            active
                              ? "text-[var(--brand-accent)]"
                              : "text-sidebar-foreground/40"
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.title === "Search" && (
                      <SidebarMenuAction asChild showOnHover>
                        <button
                          title="Quick search"
                          className="text-[9px] font-mono text-muted-foreground px-1 py-0.5 rounded border border-border bg-accent/30"
                        >
                          ⌘K
                        </button>
                      </SidebarMenuAction>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="rounded-lg bg-sidebar-accent/60 px-2.5 py-2 text-[10px] leading-tight text-muted-foreground font-mono">
          Press <kbd className="font-semibold text-foreground/60">⌘B</kbd> to toggle sidebar
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}