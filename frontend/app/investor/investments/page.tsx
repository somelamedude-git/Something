"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { ConciergeRail } from "@/components/concierge-rail"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FounderDialog, type Founder } from "@/components/founder-dialog"
import { cn } from "@/lib/utils"

type Row = {
  id: string
  name: string
  stage: "Pre‑seed" | "Seed" | "Angel"
  location: string
  trustPoints: number
  committed: number
  released: number
  perf: string
  next: string
  founders: Founder[]
}

type PortfolioResponse = {
  data: Row[]
  totalCommitted: number
  totalReleased: number
}

const BASELINE = 75

export default function InvestorInvestmentsPage() {
  const [portfolio, setPortfolio] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCommitted, setTotalCommitted] = useState<number>(0)
  const [totalReleased, setTotalReleased] = useState<number>(0)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // GET request to fetch portfolio data
      const response = await axios.get<PortfolioResponse>("#/api/investor/portfolio")
      
      setPortfolio(response.data.data || [])
      setTotalCommitted(response.data.totalCommitted || 0)
      setTotalReleased(response.data.totalReleased || 0)
    } catch (err) {
      console.error("Error fetching portfolio:", err)
      setError("Failed to load portfolio data. Please try again.")
      // Set empty/default values on error
      setPortfolio([])
      setTotalCommitted(0)
      setTotalReleased(0)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestRelease = async (projectId: string) => {
    try {
      // POST request to request fund release
      await axios.post("#/api/investor/release-request", {
        projectId,
        timestamp: new Date().toISOString()
      })
      
      alert("Release request submitted successfully")
      // Optionally refresh data
      fetchPortfolio()
    } catch (err) {
      console.error("Error requesting release:", err)
      alert("Failed to submit release request")
    }
  }

  const unallocated = Math.max(0, (totalCommitted || 0) - (totalReleased || 0))

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px]">
        <div className="flex gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-center py-20">
              <div className="text-muted-foreground font-mono text-sm animate-pulse">Loading portfolio…</div>
            </div>
          </div>
          <ConciergeRail />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1400px]">
        <div className="flex gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="text-rose-500 text-sm font-mono">{error}</div>
              <Button onClick={fetchPortfolio} className="bg-primary text-primary-foreground hover:opacity-90">
                Retry
              </Button>
            </div>
          </div>
          <ConciergeRail />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] pb-16">
      <div className="flex gap-8">
        {/* Main */}
        <div className="min-w-0 flex-1 space-y-8">

          {/* Page header */}
          <div className="space-y-1 pt-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-accent)" }} />
              Portfolio
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-foreground leading-tight">
              My Investments
            </h1>
            <p className="text-sm text-muted-foreground font-sans max-w-lg mt-1">
              Active commitments, fund deployment status, and trust performance.
            </p>
          </div>

          {/* Summary strip */}
          <div className="grid gap-px sm:grid-cols-3 border border-border rounded-xl overflow-hidden">
            <Metric label="Committed"  value={`$${totalCommitted.toLocaleString()}`} />
            <Metric label="Released"   value={`$${totalReleased.toLocaleString()}`} />
            <Metric label="Unreleased" value={`$${unallocated.toLocaleString()}`} />
          </div>

          {/* Portfolio list */}
          <div className="rounded-xl border border-border overflow-hidden">
            {portfolio.length === 0 ? (
              <div className="px-6 py-16 text-center text-muted-foreground font-mono text-sm">
                No investments found
              </div>
            ) : (
              portfolio.map((p, idx) => {
                const pct = pctClamp((p.released / p.committed) * 100)
                const delta = p.trustPoints - BASELINE
                const deltaStr = delta === 0 ? "0" : delta > 0 ? `+${delta}` : `${delta}`

                return (
                  <div
                    key={p.id}
                    className={cn(
                      "px-5 py-5 hover:bg-accent/20 transition-colors",
                      idx !== 0 && "border-t border-border/60",
                    )}
                  >
                    {/* Top line */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-semibold text-foreground">{p.name}</span>
                          <Badge variant="secondary" className="bg-accent text-foreground/70 border-border text-[10px] font-mono">
                            {p.stage}
                          </Badge>
                          <span className="text-xs text-muted-foreground">&middot; {p.location}</span>
                          <span className="text-sm text-foreground/70">
                            Trust <span className="font-semibold text-foreground">{p.trustPoints}</span>
                            <span className={cn("ml-1 text-xs", delta > 0 ? "text-emerald-500" : delta < 0 ? "text-rose-500" : "text-muted-foreground")}>
                              ({deltaStr})
                            </span>
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">{p.next}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button asChild size="sm" className="h-8 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-xs">
                          <Link href={`/investor/search/${p.id}`}>View brief</Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg border-border/60 text-foreground/60 hover:bg-accent hover:text-foreground bg-transparent text-xs"
                          onClick={() => handleRequestRelease(p.id)}
                        >
                          Request release
                        </Button>
                      </div>
                    </div>

                    {/* Progress + numbers */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
                          <span className="font-mono uppercase tracking-wider">Released / Committed</span>
                          <span className="font-mono">{pct}%</span>
                        </div>
                        <div className="h-1 rounded-full bg-border overflow-hidden">
                          <div
                            className="h-1 rounded-full transition-all"
                            style={{ width: `${pct}%`, background: "var(--brand-accent)" }}
                            aria-label="Funding progress"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <SmallStat label="Committed" value={`$${p.committed.toLocaleString()}`} />
                        <SmallStat label="Released"  value={`$${p.released.toLocaleString()}`} />
                        <SmallStat label="Perf"      value={p.perf} />
                      </div>
                    </div>

                    {/* Founders */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Founders</span>
                      {p.founders.map((f) => (
                        <FounderDialog key={f.id} founder={f} />
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Concierge rail */}
        <ConciergeRail />
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background p-5 group hover:bg-accent/30 transition-colors">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">{label}</div>
      <div className="text-2xl font-serif font-light text-foreground tracking-tight">{value}</div>
    </div>
  )
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-accent/30 px-3 py-2">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  )
}

function pctClamp(n: number) {
  const p = Math.round(n)
  return Math.max(0, Math.min(100, p))
}