"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { SearchIcon, SlidersHorizontal } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConciergeRail } from "@/components/concierge-rail"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

type Project = {
  id: string
  name: string
  domains: string[]
  desc: string
  stage: "Pre‑seed" | "Seed" | "Angel" | "Series A"
  launchedAt: string | null
  trustPoints: number // 1–100 (baseline 75)
  location: string
  investmentNeeded: number
}

const ALL_DOMAINS = [
  "Climate hardware",
  "Edge AI",
  "Local‑first",
  "Bio tooling",
  "DePIN",
  "Robotics",
  "Creator infra",
  "Privacy",
]
const ALL_LOCATIONS = ["Remote", "SF Bay", "NYC", "Berlin", "London", "Bengaluru", "Singapore"]

const MOCK: Project[] = [
  {
    id: "p1",
    name: "Edge Vision Kit",
    domains: ["Edge AI", "Robotics"],
    desc: "Low‑power on‑device vision kit with local models. Shipping v0 sensors.",
    stage: "Seed",
    launchedAt: isoDaysAgo(20),
    trustPoints: 82,
    location: "SF Bay",
    investmentNeeded: 18000,
  },
  {
    id: "p2",
    name: "Climate Hardware v1",
    domains: ["Climate hardware"],
    desc: "Modular capture component; open test data with independent validation.",
    stage: "Pre‑seed",
    launchedAt: isoDaysAgo(120),
    trustPoints: 74,
    location: "Berlin",
    investmentNeeded: 40000,
  },
  {
    id: "p3",
    name: "Local‑first Creator Analytics",
    domains: ["Creator infra", "Local-first", "Privacy"],
    desc: "Privacy‑first analytics with CRDT sync across devices.",
    stage: "Angel",
    launchedAt: isoDaysAgo(10),
    trustPoints: 65,
    location: "Remote",
    investmentNeeded: 12000,
  },
  {
    id: "p4",
    name: "Neurotech IDE",
    domains: ["Bio tooling"],
    desc: "Local‑only IDE and toolchain for neural interfaces.",
    stage: "Pre‑seed",
    launchedAt: null,
    trustPoints: 58,
    location: "London",
    investmentNeeded: 25000,
  },
  {
    id: "p5",
    name: "DePIN Sensor Mesh",
    domains: ["DePIN", "Edge AI"],
    desc: "Community-powered sensor mesh with provable data lineage.",
    stage: "Seed",
    launchedAt: isoDaysAgo(500),
    trustPoints: 88,
    location: "Singapore",
    investmentNeeded: 60000,
  },
]

type WhenKey = "any" | "30d" | "90d" | "1y" | "pre"

export default function InvestorSearchPage() {
  // Top search
  const [q, setQ] = useState("")

  // Filters in sheet
  const [open, setOpen] = useState(false)
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [launchedWhen, setLaunchedWhen] = useState<WhenKey>("any")
  const [minTrust, setMinTrust] = useState<number>(75)
  const [investMin, setInvestMin] = useState<number>(0)
  const [investMax, setInvestMax] = useState<number>(60000)

  const params = useSearchParams()

  // Open filters if URL has filters=1 or openFilters=true; seed q if present
  useEffect(() => {
    const shouldOpen = params.get("filters") === "1" || params.get("openFilters") === "true"
    if (shouldOpen) setOpen(true)
    const initialQ = params.get("q")
    if (initialQ) setQ(initialQ)
  }, [params])

  // Keep min/max consistent
  useEffect(() => {
    if (investMin > investMax) setInvestMax(investMin)
  }, [investMin])
  useEffect(() => {
    if (investMax < investMin) setInvestMin(investMax)
  }, [investMax])

  // Active filter count (exclude defaults)
  const activeCount = useMemo(() => {
    let c = 0
    if (selectedDomains.length) c++
    if (selectedLocations.length) c++
    if (launchedWhen !== "any") c++
    if (minTrust !== 75) c++
    if (investMin > 0) c++
    if (investMax < 100000) c++
    return c
  }, [selectedDomains.length, selectedLocations.length, launchedWhen, minTrust, investMin, investMax])

  // Results
  const results = useMemo(() => {
    return MOCK.filter((p) => {
      const s = q.trim().toLowerCase()
      if (s) {
        const hay = `${p.name} ${p.desc} ${p.domains.join(" ")} ${p.location}`.toLowerCase()
        if (!hay.includes(s)) return false
      }
      if (selectedDomains.length > 0 && !p.domains.some((d) => selectedDomains.includes(d))) return false
      if (selectedLocations.length > 0 && !selectedLocations.includes(p.location)) return false
      if (!matchesWhen(p, launchedWhen)) return false
      if (p.trustPoints < minTrust) return false
      if (p.investmentNeeded < investMin || p.investmentNeeded > investMax) return false
      return true
    })
  }, [q, selectedDomains, selectedLocations, launchedWhen, minTrust, investMin, investMax])

  function resetFilters() {
    setSelectedDomains([])
    setSelectedLocations([])
    setLaunchedWhen("any")
    setMinTrust(75)
    setInvestMin(0)
    setInvestMax(60000)
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex gap-6">
        {/* Main column */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* Top bar */}
          <div className="rounded-xl border border-border bg-background p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-foreground/30" />
                <Input
                  placeholder="Domains, founders, keywords…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="h-9 w-full pl-9 bg-accent/30 border-border/60 text-foreground placeholder:text-foreground/30 rounded-lg"
                />
              </div>

              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 rounded-md border-border/40 text-foreground/60 hover:bg-accent hover:text-foreground bg-transparent transition-all",
                      activeCount > 0 && "border-border text-foreground",
                    )}
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters{activeCount > 0 ? ` (${activeCount})` : ""}
                  </Button>
                </SheetTrigger>
                <FiltersSheet
                  onReset={resetFilters}
                  state={{
                    selectedDomains,
                    setSelectedDomains,
                    selectedLocations,
                    setSelectedLocations,
                    launchedWhen,
                    setLaunchedWhen,
                    minTrust,
                    setMinTrust,
                    investMin,
                    setInvestMin,
                    investMax,
                    setInvestMax,
                  }}
                />
              </Sheet>
            </div>
          </div>

          {/* Minimal results list */}
          <div className="rounded-xl border border-border overflow-hidden">
            {results.length === 0 && (
              <div className="p-6 text-sm text-muted-foreground font-mono text-center">No projects match your filters. Try broadening.</div>
            )}

            {results.map((r, idx) => (
              <div
                key={r.id}
                className={cn(
                  "px-5 py-4 hover:bg-accent/20 transition-colors",
                  idx !== 0 && "border-t border-border/60",
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold text-foreground">{r.name}</span>
                      <Badge variant="secondary" className="bg-accent text-foreground/70 border-border text-[10px] font-mono">
                        {r.stage}
                      </Badge>
                      {r.domains.map((d) => (
                        <Badge key={d} variant="secondary" className="bg-accent/60 text-foreground/60 border-border/60 text-[10px]">
                          {d}
                        </Badge>
                      ))}
                      <span className="text-xs text-muted-foreground">· {r.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-sans leading-snug">{r.desc}</p>
                    <div className="text-xs text-muted-foreground">
                      {launchedLabel(r.launchedAt)} · Needs{" "}
                      <span className="text-foreground font-medium">{formatUSD(r.investmentNeeded)}</span>
                    </div>
                  </div>
                  <div className="sm:ml-4 flex items-center gap-3 shrink-0">
                    {(() => {
                      const tp = clamp(r.trustPoints, 1, 100)
                      const delta = tp - 75
                      const deltaStr = delta === 0 ? "0" : delta > 0 ? `+${delta}` : `${delta}`
                      return (
                        <span className="text-sm text-foreground/70">
                          Trust <span className="font-semibold text-foreground">{tp}</span>
                          <span
                            className={cn(
                              "ml-1 text-xs",
                              delta > 0 ? "text-emerald-500" : delta < 0 ? "text-rose-500" : "text-muted-foreground",
                            )}
                          >
                            ({deltaStr})
                          </span>
                        </span>
                      )
                    })()}
                    <Button asChild size="sm" className="h-8 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-xs">
                      <Link href={`/investor/search/${r.id}`}>View brief</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Concierge rail (right) */}
        <ConciergeRail />
      </div>
    </div>
  )
}

/* Filters sheet component */
function FiltersSheet({
  onReset,
  state,
}: {
  onReset: () => void
  state: {
    selectedDomains: string[]
    setSelectedDomains: (v: string[]) => void
    selectedLocations: string[]
    setSelectedLocations: (v: string[]) => void
    launchedWhen: WhenKey
    setLaunchedWhen: (v: WhenKey) => void
    minTrust: number
    setMinTrust: (v: number) => void
    investMin: number
    setInvestMin: (v: number) => void
    investMax: number
    setInvestMax: (v: number) => void
  }
}) {
  const {
    selectedDomains,
    setSelectedDomains,
    selectedLocations,
    setSelectedLocations,
    launchedWhen,
    setLaunchedWhen,
    minTrust,
    setMinTrust,
    investMin,
    setInvestMin,
    investMax,
    setInvestMax,
  } = state

  return (
    <SheetContent side="right" className="w-full sm:max-w-md bg-popover border-l border-border text-popover-foreground">
      <SheetHeader>
        <SheetTitle className="font-serif font-light text-xl">Filters</SheetTitle>
        <SheetDescription className="text-muted-foreground text-xs font-mono">Narrow your search to the right opportunities.</SheetDescription>
      </SheetHeader>

      <div className="mt-6 grid gap-7">
        <FacetBlock title="Domain(s)">
          <div className="flex flex-wrap gap-2">
            {ALL_DOMAINS.map((d) => {
              const on = selectedDomains.includes(d)
              return (
                <button
                  key={d}
                  onClick={() =>
                    setSelectedDomains(on ? selectedDomains.filter((x) => x !== d) : [...selectedDomains, d])
                  }
                  className={cn(
                    "text-xs rounded-full px-3 py-1.5 border transition-all",
                    on
                      ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]/10 text-foreground"
                      : "border-border/60 text-foreground/60 hover:bg-accent",
                  )}
                  aria-pressed={on}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </FacetBlock>

        <FacetBlock title="Location">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ALL_LOCATIONS.map((loc) => {
              const on = selectedLocations.includes(loc)
              return (
                <label
                  key={loc}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-all",
                    on ? "border-[var(--brand-accent)]/40 bg-accent text-foreground" : "border-border/60 text-foreground/60 hover:bg-accent",
                  )}
                >
                  <input
                    type="checkbox"
                    className="accent-[var(--brand-accent)]"
                    checked={on}
                    onChange={() =>
                      setSelectedLocations(
                        on ? selectedLocations.filter((x) => x !== loc) : [...selectedLocations, loc],
                      )
                    }
                  />
                  <span>{loc}</span>
                </label>
              )
            })}
          </div>
        </FacetBlock>

        <FacetBlock title="Launched">
          <div className="flex flex-wrap gap-2">
            {[
              { k: "any", label: "Any" },
              { k: "30d", label: "Last 30d" },
              { k: "90d", label: "Last 90d" },
              { k: "1y",  label: "Older than 1y" },
              { k: "pre", label: "Pre‑launch" },
            ].map((o) => (
              <button
                key={o.k}
                onClick={() => setLaunchedWhen(o.k as WhenKey)}
                className={cn(
                  "text-xs rounded-full px-3 py-1.5 border transition-all",
                  launchedWhen === o.k
                    ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]/10 text-foreground"
                    : "border-border/60 text-foreground/60 hover:bg-accent",
                )}
                aria-pressed={launchedWhen === o.k}
              >
                {o.label}
              </button>
            ))}
          </div>
        </FacetBlock>

        <FacetBlock title="Trust points (min)">
          <div className="grid gap-2">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={100}
                step={1}
                value={minTrust}
                onChange={(e) => setMinTrust(Number.parseInt(e.target.value))}
                aria-label="Minimum trust points"
                className="w-full accent-[var(--brand-accent)]"
              />
              <div className="w-16 text-right text-sm text-foreground/70 font-mono">{minTrust} / 100</div>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">Baseline 75 — signals raise or lower this.</div>
          </div>
        </FacetBlock>

        <FacetBlock title="Investment needed (USD)">
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono w-6">Min</span>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={investMin}
                  onChange={(e) => setInvestMin(safeInt(e.target.value, investMin))}
                  className="h-8 bg-accent/30 border-border/60 text-foreground text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono w-6">Max</span>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={investMax}
                  onChange={(e) => setInvestMax(safeInt(e.target.value, investMax))}
                  className="h-8 bg-accent/30 border-border/60 text-foreground text-xs"
                />
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              Range: ${investMin.toLocaleString()} – ${investMax.toLocaleString()}
            </div>
          </div>
        </FacetBlock>
      </div>

      <SheetFooter className="mt-8 flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onReset}
          className="rounded-lg border-border/60 text-foreground/60 hover:bg-accent bg-transparent"
        >
          Reset
        </Button>
        <SheetClose asChild>
          <Button className="rounded-lg bg-primary text-primary-foreground hover:opacity-90">Apply</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  )
}

/* Helpers */
function isoDaysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}
function diffDaysFromNow(iso: string) {
  const then = new Date(iso).getTime()
  const now = Date.now()
  return Math.floor((now - then) / (1000 * 60 * 60 * 24))
}
function matchesWhen(p: Project, w: WhenKey) {
  if (w === "any") return true
  if (w === "pre") return p.launchedAt == null
  if (!p.launchedAt) return false
  const d = diffDaysFromNow(p.launchedAt)
  if (w === "30d") return d <= 30
  if (w === "90d") return d <= 90
  if (w === "1y") return d > 365
  return true
}
function launchedLabel(iso: string | null) {
  if (!iso) return "Pre‑launch"
  const d = diffDaysFromNow(iso)
  if (d <= 30) return "Launched recently"
  if (d <= 90) return "Launched last 90d"
  if (d > 365) return "Launched 1y+ ago"
  return "Launched"
}
function formatUSD(n: number) {
  return `$${n.toLocaleString()}`
}
function safeInt(v: string, fallback: number) {
  const n = Number.parseInt(v)
  return Number.isFinite(n) ? n : fallback
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
function FacetBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  )
}
