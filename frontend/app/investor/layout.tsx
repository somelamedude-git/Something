"use client"

import type * as React from "react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppInvestorSidebar } from "@/components/app-investor-sidebar"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Search, Sun, Moon, Plus } from "lucide-react"

const SECTION_MAP: Record<string, string> = {
  search:      "Search",
  investments: "Investments",
  chats:       "Chats",
  profile:     "Profile",
  settings:    "Settings",
}

export type IdeaData = {
  title: string
  description: string
}

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [accentKey, setAccentKey] = useState("emerald")

  const seg     = pathname?.split("/").filter(Boolean)[1]
  const section = SECTION_MAP[seg ?? ""] ?? "Overview"

  // ── Mount + read accent from localStorage ─────────────────────────────
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("founder_settings_accent")
    if (saved) setAccentKey(saved)

    const handleAccentUpdate = (e: Event) => {
      const ce = e as CustomEvent<{ accent: string }>
      if (ce.detail?.accent) setAccentKey(ce.detail.accent)
    }
    const handleStorageChange = () => {
      const s = localStorage.getItem("founder_settings_accent")
      if (s) setAccentKey(s)
    }
    window.addEventListener("founder-accent-update", handleAccentUpdate)
    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("founder-accent-update", handleAccentUpdate)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // ── Full CSS token injection (mirrors founder layout exactly) ──────────
  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return
    const isDark = theme !== "light"
    const root   = document.documentElement

    type ThemeTokens = {
      brand: string; bg: string; bgOklch: string; fg: string; fgOklch: string
      sidebar: string; sidebarFg: string; sidebarBorder: string; border: string
      muted: string; mutedFg: string; accent: string; fontWeight: string; letterSpacing: string
    }

    const darkPalettes: Record<string, ThemeTokens> = {
      emerald: { brand:"#8EA38E", bg:"#0b0d0b", bgOklch:"oklch(0.07 0.004 140)", fg:"#E8EDE8", fgOklch:"oklch(0.94 0.006 140)", sidebar:"#090b09", sidebarFg:"#D4DDD4", sidebarBorder:"#181e18", border:"#1a201a", muted:"#141814", mutedFg:"oklch(0.58 0.008 140)", accent:"#141814", fontWeight:"380", letterSpacing:"-0.01em" },
      indigo:  { brand:"#D4CFC4", bg:"#0e0d0c", bgOklch:"oklch(0.08 0.003 60)",  fg:"#F0EDE6", fgOklch:"oklch(0.96 0.005 60)",  sidebar:"#0b0a09", sidebarFg:"#DDD9D0", sidebarBorder:"#1c1a18", border:"#1e1c19", muted:"#161411", mutedFg:"oklch(0.6 0.006 60)",  accent:"#161411", fontWeight:"350", letterSpacing:"0.005em" },
      violet:  { brand:"#8293A4", bg:"#0b0d0f", bgOklch:"oklch(0.07 0.005 240)", fg:"#E2E8EE", fgOklch:"oklch(0.93 0.007 240)", sidebar:"#090b0d", sidebarFg:"#CDD7E2", sidebarBorder:"#161e26", border:"#18202a", muted:"#121820", mutedFg:"oklch(0.58 0.01 240)", accent:"#121820", fontWeight:"400", letterSpacing:"0em" },
      amber:   { brand:"#C88E72", bg:"#100c0b", bgOklch:"oklch(0.075 0.008 30)", fg:"#EDE7E2", fgOklch:"oklch(0.94 0.006 30)",  sidebar:"#0d0909", sidebarFg:"#DDD4CC", sidebarBorder:"#211a18", border:"#231c19", muted:"#181210", mutedFg:"oklch(0.58 0.01 30)",  accent:"#181210", fontWeight:"420", letterSpacing:"0.01em" },
    }

    const lightPalettes: Record<string, ThemeTokens> = {
      emerald: { brand:"#5C725E", bg:"#F5F6F3", bgOklch:"oklch(0.97 0.005 140)", fg:"#1A2B1A", fgOklch:"oklch(0.16 0.01 140)",  sidebar:"#EAEEE8", sidebarFg:"#263226", sidebarBorder:"#D4DAD2", border:"#D0D8CE", muted:"#E4EAE2", mutedFg:"oklch(0.42 0.012 140)", accent:"#DCE4DA", fontWeight:"400", letterSpacing:"-0.01em" },
      indigo:  { brand:"#7C7A72", bg:"#FAF9F6", bgOklch:"oklch(0.99 0.003 70)",  fg:"#28261E", fgOklch:"oklch(0.17 0.008 70)",  sidebar:"#F0EDE6", sidebarFg:"#32302A", sidebarBorder:"#DDD9D0", border:"#D8D4C8", muted:"#EBE8E0", mutedFg:"oklch(0.44 0.008 70)",  accent:"#E4E0D6", fontWeight:"350", letterSpacing:"0.005em" },
      violet:  { brand:"#5C6C7C", bg:"#F3F5F7", bgOklch:"oklch(0.97 0.005 240)", fg:"#1A2230", fgOklch:"oklch(0.16 0.014 240)", sidebar:"#E8ECF0", sidebarFg:"#263040", sidebarBorder:"#CDD6DF", border:"#C8D2DC", muted:"#E0E6EE", mutedFg:"oklch(0.42 0.014 240)", accent:"#D8E0EA", fontWeight:"400", letterSpacing:"0em" },
      amber:   { brand:"#A56B4E", bg:"#FAF6F5", bgOklch:"oklch(0.985 0.006 30)", fg:"#2E1A14", fgOklch:"oklch(0.17 0.018 30)",  sidebar:"#F0E8E4", sidebarFg:"#3C2A22", sidebarBorder:"#DDD0C8", border:"#D8C8C0", muted:"#EAE0DA", mutedFg:"oklch(0.44 0.016 30)",  accent:"#E2D4CC", fontWeight:"420", letterSpacing:"0.01em" },
    }

    const palettes = isDark ? darkPalettes : lightPalettes
    const t = palettes[accentKey] || palettes.emerald

    root.style.setProperty("--brand-accent",              t.brand)
    root.style.setProperty("--background-color",          t.bg)
    root.style.setProperty("--background",                t.bgOklch)
    root.style.setProperty("--foreground",                t.fgOklch)
    root.style.setProperty("--card",                      t.bgOklch)
    root.style.setProperty("--card-foreground",           t.fgOklch)
    root.style.setProperty("--popover",                   t.bgOklch)
    root.style.setProperty("--popover-foreground",        t.fgOklch)
    root.style.setProperty("--primary",                   t.fgOklch)
    root.style.setProperty("--primary-foreground",        t.bgOklch)
    root.style.setProperty("--sidebar",                   t.sidebar)
    root.style.setProperty("--sidebar-foreground",        t.sidebarFg)
    root.style.setProperty("--sidebar-border",            t.sidebarBorder)
    root.style.setProperty("--sidebar-accent",            t.accent)
    root.style.setProperty("--sidebar-accent-foreground", t.fg)
    root.style.setProperty("--border",                    t.border)
    root.style.setProperty("--input",                     t.border)
    root.style.setProperty("--muted",                     t.muted)
    root.style.setProperty("--muted-foreground",          t.mutedFg)
    root.style.setProperty("--accent",                    t.accent)
    root.style.setProperty("--accent-foreground",         t.fgOklch)
    root.style.setProperty("--theme-font-weight",         t.fontWeight)
    root.style.setProperty("--theme-letter-spacing",      t.letterSpacing)
  }, [accentKey, theme, mounted])

  return (
    <SidebarProvider>
      <AppInvestorSidebar accentKey={accentKey} />
      <SidebarInset className="bg-[var(--background-color)] text-foreground relative overflow-x-hidden">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-sidebar px-6 relative z-50">
          <SidebarTrigger className="-ml-1 text-foreground/80 hover:text-foreground transition-colors" />
          <Separator orientation="vertical" className="mr-2 h-5 bg-border" />

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/investor"
              className="text-sm sm:text-base font-semibold tracking-tight text-foreground/90 hover:text-foreground transition-colors font-sans"
            >
              Investor
            </Link>
            <span className="text-foreground/30 text-sm">/</span>
            <span className="text-foreground/50 text-xs sm:text-sm font-mono uppercase tracking-wide">
              {section}
            </span>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-foreground/30" />
              <Input
                placeholder="Search ideas, founders, domains…"
                className="h-8 w-[240px] pl-9 bg-accent/40 border-border/40 text-foreground placeholder:text-foreground/30 rounded-lg focus-visible:ring-1 focus-visible:ring-[var(--brand-accent)] focus-visible:border-[var(--brand-accent)]/20 text-xs"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-4.5 select-none items-center gap-0.5 rounded border border-border bg-foreground/5 px-1.5 font-mono text-[9px] font-medium text-foreground/40">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            </div>

            {/* New Idea button */}
            <Button
              size="sm"
              onClick={() => router.push("/investor/search")}
              className="h-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold tracking-wide transition-all active:scale-[0.98] cursor-pointer shrink-0 px-3"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5 shrink-0" />
              Discover
            </Button>

            {/* Notifications */}
            <NotificationsDropdown />

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 w-8 rounded-full text-foreground/60 hover:text-foreground hover:bg-accent transition-all"
                aria-label="Toggle theme"
              >
                {theme === "dark"
                  ? <Sun className="h-4 w-4" />
                  : <Moon className="h-4 w-4" />
                }
              </Button>
            )}
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 animate-fade-up">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
