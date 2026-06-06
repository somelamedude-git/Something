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
          <div className="rounded-xl bg-[#101113] p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-2 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Domains, founders, keywords…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="h-9 w-full pl-8 bg-[#0f1012] border-transparent text-white placeholder:text-white/40"
                />
              </div>

              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 rounded-md border-white/10 text-white hover:bg-white/[0.06] bg-transparent",
                      activeCount > 0 && "border-white/30",
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
          <div className="rounded-xl bg-[#101113]">
            {results.length === 0 && (
              <div className="p-4 text-sm text-white/70">No projects match your filters. Try broadening.</div>
            )}

            {results.map((r, idx) => (
              <div
                key={r.id}
                className={cn(
                  "px-4 py-4 hover:bg-white/[0.03] transition-colors",
                  idx !== 0 && "border-t border-white/5",
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="text-base font-semibold">{r.name}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="bg-white/[0.04] text-white border-white/10">
                      {r.stage}
                    </Badge>
                    {r.domains.map((d) => (
                      <Badge key={d} variant="secondary" className="bg-white/[0.04] text-white border-white/10">
                        {d}
                      </Badge>
                    ))}
                    <span className="text-xs text-white/60">• {r.location}</span>
                  </div>
                  <div className="sm:ml-auto flex items-center gap-3">
                    {(() => {
                      const baseline = 75
                      const tp = clamp(r.trustPoints, 1, 100)
                      const delta = tp - baseline
                      const deltaStr = delta === 0 ? "0" : delta > 0 ? `+${delta}` : `${delta}`
                      return (
                        <span className="text-sm">
                          Trust <span className="font-semibold">{tp}</span>
                          <span
                            className={cn(
                              "ml-1 text-xs",
                              delta > 0 ? "text-emerald-300" : delta < 0 ? "text-rose-300" : "text-white/70",
                            )}
                          >
                            ({deltaStr})
                          </span>
                        </span>
                      )
                    })()}
                    <Button asChild className="h-8 rounded-md bg-white text-[#0b0b0c] hover:bg-white/90">
                      <Link href={`/investor/search/${r.id}`}>View brief</Link>
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-white/70 mt-2">{r.desc}</p>
                <div className="mt-2 text-xs text-white/60">
                  {launchedLabel(r.launchedAt)} • Needs{" "}
                  <span className="text-white">{formatUSD(r.investmentNeeded)}</span>
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
    <SheetContent side="right" className="w-full sm:max-w-md bg-[#101113] text-white border-l-white/10">
      <SheetHeader>
        <SheetTitle>Filters</SheetTitle>
        <SheetDescription className="text-white/60">Keep it light, only what’s needed.</SheetDescription>
      </SheetHeader>

      <div className="mt-4 grid gap-6">
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
                    "text-xs rounded-md px-3 py-1.5 border transition",
                    on ? "border-white/30 bg-white/[0.06]" : "border-white/10 text-white/80 hover:bg-white/[0.03]",
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
                    "flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-xs",
                    on ? "border-white/30 bg-white/[0.06]" : "border-white/10 hover:bg-white/[0.03]",
                  )}
                >
                  <input
                    type="checkbox"
                    className="accent-white"
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
              { k: "1y", label: "Older than 1y" },
              { k: "pre", label: "Pre‑launch" },
            ].map((o) => (
              <button
                key={o.k}
                onClick={() => setLaunchedWhen(o.k as WhenKey)}
                className={cn(
                  "text-xs rounded-md px-3 py-1.5 border transition",
                  launchedWhen === o.k ? "border-white/30 bg-white/[0.06]" : "border-white/10 hover:bg-white/[0.03]",
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
                className="w-full"
              />
              <div className="w-16 text-right text-sm">{minTrust} / 100</div>
            </div>
            <div className="text-xs text-white/60">Baseline 75; signals raise or lower this.</div>
          </div>
        </FacetBlock>

        <FacetBlock title="Investment needed (USD)">
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60">Min</span>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={investMin}
                  onChange={(e) => setInvestMin(safeInt(e.target.value, investMin))}
                  className="h-8 bg-[#0f1012] border-white/10 text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60">Max</span>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={investMax}
                  onChange={(e) => setInvestMax(safeInt(e.target.value, investMax))}
                  className="h-8 bg-[#0f1012] border-white/10 text-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100000}
                step={1000}
                value={investMin}
                onChange={(e) => setInvestMin(Number.parseInt(e.target.value))}
                className="w-full"
                aria-label="Investment min"
              />
              <input
                type="range"
                min={0}
                max={100000}
                step={1000}
                value={investMax}
                onChange={(e) => setInvestMax(Number.parseInt(e.target.value))}
                className="w-full -ml-2"
                aria-label="Investment max"
              />
            </div>
            <div className="text-xs text-white/60">
              Range: ${investMin.toLocaleString()} – ${investMax.toLocaleString()}
            </div>
          </div>
        </FacetBlock>
      </div>

      <SheetFooter className="mt-6 flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onReset}
          className="rounded-md border-white/10 text-white hover:bg-white/[0.06] bg-transparent"
        >
          Reset
        </Button>
        <SheetClose asChild>
          <Button className="rounded-md bg-white text-[#0b0b0c] hover:bg-white/90">Apply</Button>
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
      <div className="text-xs text-white/60">{title}</div>
      {children}
    </div>
  )
}
