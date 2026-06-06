"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, CheckCircle2, Compass, Lightbulb } from "lucide-react"

export function ConciergeRail() {
  return (
    <aside className="hidden xl:block w-[320px] shrink-0 space-y-4">
      <Card className="bg-[#101113] border-[#1a1b1e]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Concierge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="text-xs text-white/60">Today</div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300 mt-0.5" />
              <div>Milestone #2 accepted • Edge Vision Kit</div>
            </li>
            <li className="flex items-start gap-2">
              <Bell className="h-4 w-4 text-white/60 mt-0.5" />
              <div>Follow up on receipts • Climate Hardware v1</div>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-[#101113] border-[#1a1b1e]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-2">
            {["Climate hardware", "Edge AI", "Local‑first"].map((t) => (
              <Badge key={t} variant="secondary" className="bg-white/[0.04] text-white border-[#1a1b1e]">
                {t}
              </Badge>
            ))}
          </div>
          <div className="rounded-md border border-[#1a1b1e] bg-[#0f1012] p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-white/50">Because you backed</div>
            <div className="mt-1 text-sm">Edge Vision Kit</div>
            <div className="text-xs text-white/60">Robotics firmware co‑pilot is trending in your circle.</div>
          </div>
          <Button className="w-full bg-white text-[#0b0b0c] hover:bg-white/90">
            <Compass className="mr-2 h-4 w-4" />
            Explore curated
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#101113] border-[#1a1b1e]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Next steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {[
            "Review NDA draft • Neurotech IDE",
            "Approve escrow release • Creator Analytics",
            "Shortlist climate tests",
          ].map((t) => (
            <div key={t} className="rounded-md border border-[#1a1b1e] bg-[#0f1012] px-3 py-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-white/60" />
                <span>{t}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  )
}
