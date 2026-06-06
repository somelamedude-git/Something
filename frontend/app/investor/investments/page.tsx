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
            <div className="flex items-center justify-center py-12">
              <div className="text-white/60">Loading portfolio...</div>
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
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="text-rose-300">{error}</div>
              <Button onClick={fetchPortfolio} className="bg-white text-[#0b0b0c] hover:bg-white/90">
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
    <div className="mx-auto max-w-[1400px]">
      <div className="flex gap-6">
        {/* Main */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* Summary strip (calm) */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric label="Committed" value={`$${totalCommitted.toLocaleString()}`} />
            <Metric label="Released" value={`$${totalReleased.toLocaleString()}`} />
            <Metric label="Unreleased" value={`$${unallocated.toLocaleString()}`} />
          </div>

          {/* Portfolio list */}
          <div className="rounded-xl bg-[#101113]">
            {portfolio.length === 0 ? (
              <div className="px-4 py-12 text-center text-white/60">
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
                      "px-4 py-4 hover:bg-white/[0.03] transition-colors",
                      idx !== 0 && "border-t border-white/5",
                    )}
                  >
                    {/* Top line: name and tags */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="text-base font-semibold">{p.name}</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="bg-white/[0.04] text-white border-white/10">
                          {p.stage}
                        </Badge>
                        <span className="text-xs text-white/60">• {p.location}</span>
                        <span className="text-sm">
                          Trust <span className="font-semibold">{p.trustPoints}</span>
                          <span
                            className={cn(
                              "ml-1 text-xs",
                              delta > 0 ? "text-emerald-300" : delta < 0 ? "text-rose-300" : "text-white/70",
                            )}
                          >
                            ({deltaStr})
                          </span>
                        </span>
                      </div>
                      <div className="sm:ml-auto flex items-center gap-2">
                        <Button asChild className="h-8 rounded-md bg-white text-[#0b0b0c] hover:bg-white/90">
                          <Link href={`/investor/search/${p.id}`}>View brief</Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-8 rounded-md border-white/10 text-white hover:bg-white/[0.06] bg-transparent"
                          onClick={() => handleRequestRelease(p.id)}
                        >
                          Request release
                        </Button>
                      </div>
                    </div>

                    {/* Progress + numbers */}
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between text-xs text-white/60">
                          <span>Progress (released / committed)</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-[#0f1012]">
                          <div
                            className="h-2 rounded-full bg-white"
                            style={{ width: `${pct}%` }}
                            aria-label="Funding progress"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <SmallStat label="Committed" value={`$${p.committed.toLocaleString()}`} />
                        <SmallStat label="Released" value={`$${p.released.toLocaleString()}`} />
                        <SmallStat label="Perf" value={p.perf} />
                      </div>
                    </div>

                    {/* Founders */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-white/60">Founders</span>
                      {p.founders.map((f) => (
                        <FounderDialog key={f.id} founder={f} />
                      ))}
                    </div>

                    {/* Next step */}
                    <div className="mt-2 text-xs text-white/60">{p.next}</div>
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
    <div className="rounded-lg border border-[#1a1b1e] bg-[#101113] p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  )
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-[#0f1012] px-3 py-2">
      <div className="text-[11px] text-white/60">{label}</div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  )
}

function pctClamp(n: number) {
  const p = Math.round(n)
  return Math.max(0, Math.min(100, p))
}