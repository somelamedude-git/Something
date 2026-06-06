"use client"

import type * as React from "react"
import Link from "next/link"
import { Suspense, useState } from "react"
import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppFounderSidebar } from "@/components/app-founder-sidebar"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { PostIdeaModal } from "@/components/post-idea-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Search, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

import RequireAuth from "@/components/require-auth"

export default function FounderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const seg = pathname?.split("/").filter(Boolean)[1]
  const section =
    {
      ideas: "Ideas",
      funding: "Community funding",
      chats: "Chats",
      mutiny: "Mutiny",
      profile: "Profile",
      settings: "Settings",
    }[seg ?? ""] ?? "Overview"

  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false)

  const handleIdeaSubmit = (ideaData: any) => {
    // In a real app, this would make an API call
    console.log("New idea submitted:", ideaData)
    // You could also trigger a refresh of the ideas page or show a success message
  }

  return (
    <SidebarProvider>
      <AppFounderSidebar />
      <SidebarInset className="bg-[#0b0b0c] text-white">
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[#1a1b1e] px-4 py-10">
            <SidebarTrigger className="-ml-1 text-white/80 hover:text-white" />
            <Separator orientation="vertical" className="mr-2 h-5 bg-[#1a1b1e]" />
            <nav className="flex items-center gap-2 sm:gap-3">
              <Link href="/founder" className="text-sm sm:text-base font-semibold tracking-tight">
                Founder
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white/70 text-sm">{section}</span>
            </nav>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-2 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Search ideas, investors, team…"
                  className="h-8 w-[260px] pl-8 bg-[#101113] border-[#1a1b1e] text-white placeholder:text-white/40"
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
              <div className="h-8 w-8 rounded-md ring-1 ring-[#1a1b1e] bg-[#101113]" />
            </div>
          </header>
        </Suspense>
        <div className="flex-1 p-4 sm:p-6">
          <RequireAuth>
            {children}
          </RequireAuth>
        </div>
      </SidebarInset>

      {/* Post Idea Modal */}
      <PostIdeaModal isOpen={isIdeaModalOpen} onClose={() => setIsIdeaModalOpen(false)} onSubmit={handleIdeaSubmit} />
    </SidebarProvider>
  )
}
