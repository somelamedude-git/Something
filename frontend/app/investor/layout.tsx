"use client"

import type * as React from "react"
import Link from "next/link"
import { Suspense, useState } from "react"
import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppInvestorSidebar } from "@/components/app-investor-sidebar"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { PostIdeaModal } from "@/components/post-idea-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Search, Plus, LogOut, UserRound, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"

// Define the shape of an idea
export type IdeaData = {
  title: string
  description: string
}

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const seg = pathname?.split("/").filter(Boolean)[1]
  const section =
    {
      ideas: "Ideas",
      funding: "Community funding",
      chats: "Chats",
      profile: "Profile",
      settings: "Settings",
    }[seg ?? ""] ?? "Overview"

  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false)

  // Properly typed idea submit handler
  const handleIdeaSubmit = (ideaData: IdeaData) => {
    console.log("New idea submitted:", ideaData)
  }

  return (
    <SidebarProvider>
      <AppInvestorSidebar />
      <SidebarInset className="bg-[#0b0b0c] text-white">
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/5 bg-black/40 px-6 backdrop-blur-md">
            <SidebarTrigger className="-ml-1 text-white/80 hover:text-white" />
            <Separator orientation="vertical" className="mr-2 h-5 bg-white/5" />
            <nav className="flex items-center gap-2 sm:gap-3">
              <Link href="/investor" className="text-sm sm:text-base font-semibold tracking-tight text-white/90 hover:text-white transition-colors" style={{ fontFamily: "var(--font-outfit)" }}>
                Investor
              </Link>
              <span className="text-white/30">/</span>
              <span className="text-white/60 text-xs sm:text-sm font-mono uppercase tracking-wide">{section}</span>
            </nav>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
                <Input
                  placeholder="Search ideas, investors, team…"
                  className="h-8 w-[260px] pl-9 bg-black/40 border-white/5 text-white placeholder:text-white/30 rounded-lg focus-visible:ring-[#34D399] focus-visible:border-[#34D399]/20"
                />
              </div>
              <Button
                size="sm"
                onClick={() => setIsIdeaModalOpen(true)}
                className={cn(
                  "h-8 rounded-md bg-white text-[#0b0b0c] hover:bg-white/90",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.10)_inset]",
                )}
              >
                <Plus className="mr-2 h-4 w-4" />
                New idea
              </Button>
              <NotificationsDropdown />
            </div>
          </header>
        </Suspense>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </SidebarInset>

      {/* Post Idea Modal */}
      <PostIdeaModal
        isOpen={isIdeaModalOpen}
        onClose={() => setIsIdeaModalOpen(false)}
        onSubmit={handleIdeaSubmit}
      />
    </SidebarProvider>
  )
}
