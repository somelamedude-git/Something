"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { TrendingUp, MessageSquare, DollarSign, Layers, ArrowRight, RefreshCw } from "lucide-react"
import { ConciergeRail } from "@/components/concierge-rail"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────
interface KpiData {
  availableBalance: string
  committedCapital: string
  activeProjects:   number
  unreadChats:      number
}

interface PipelineProject {
  id:    string
  name:  string
  stage: "assess" | "match" | "mobilize"
}

interface Activity {
  id:          string
  description: string
  timestamp:   string
}

interface InvestorDashboardData {
  kpis:           KpiData
  pipeline:       PipelineProject[]
  recentActivity: Activity[]
}

// ── Config ────────────────────────────────────────────────────────────────

const MOCK_DATA: InvestorDashboardData = {
  kpis: {
    availableBalance: "$128,400",
    committedCapital: "$86,200",
    activeProjects:   9,
    unreadChats:      5,
  },
  pipeline: [
    { id: "1", name: "Local‑first notes app",     stage: "assess"   },
    { id: "2", name: "DePIN sensor mesh",          stage: "assess"   },
    { id: "3", name: "Neurotech IDE",              stage: "assess"   },
    { id: "4", name: "Edge AI vision kit",         stage: "match"    },
    { id: "5", name: "Climate hardware v1",        stage: "match"    },
    { id: "6", name: "Creator infra sync",         stage: "mobilize" },
    { id: "7", name: "Robotics firmware co‑pilot", stage: "mobilize" },
  ],
  recentActivity: [
    { id: "1", description: "Milestone #2 accepted — Edge AI vision kit",          timestamp: "2h ago"  },
    { id: "2", description: "New project suggested in Climate Hardware founders",   timestamp: "1d ago"  },
    { id: "3", description: "Funds released — $4,000 to Engineering",              timestamp: "3d ago"  },
    { id: "4", description: "Signed mutual NDA — Neurotech IDE",                   timestamp: "5d ago"  },
  ],
}

// ── KPI metadata ──────────────────────────────────────────────────────────
const KPI_META = [
  { key: "availableBalance", label: "Available balance", icon: DollarSign,    suffix: "" },
  { key: "committedCapital", label: "Committed capital", icon: TrendingUp,    suffix: "" },
  { key: "activeProjects",   label: "Active projects",   icon: Layers,        suffix: "" },
  { key: "unreadChats",      label: "Unread messages",   icon: MessageSquare, suffix: "" },
]

// ── Pipeline stage config ─────────────────────────────────────────────────
const STAGE_CONFIG = [
  { key: "assess",   label: "Assess",   desc: "Evaluating fit"   },
  { key: "match",    label: "Match",    desc: "Terms in review"  },
  { key: "mobilize", label: "Mobilize", desc: "Capital moving"   },
] as const

// ─────────────────────────────────────────────────────────────────────────
export default function InvestorOverviewPage() {
  const [data,    setData]    = useState<InvestorDashboardData>(MOCK_DATA)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(r => setTimeout(r, 400))
      setData(MOCK_DATA)
    } catch {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const byStage = {
    assess:   data.pipeline.filter(p => p.stage === "assess"),
    match:    data.pipeline.filter(p => p.stage === "match"),
    mobilize: data.pipeline.filter(p => p.stage === "mobilize"),
  }

  return (
    <div className="mx-auto max-w-[1400px] pb-16">
      <div className="flex gap-8">
        {/* ── Main column ── */}
        <div className="min-w-0 flex-1 space-y-10">

          {/* Page header */}
          <div className="space-y-1 pt-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--brand-accent)" }}
              />
              Investor Dashboard
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-foreground leading-tight">
              Capital Overview
            </h1>
            <p className="text-sm text-muted-foreground font-sans max-w-lg mt-1">
              Your capital allocation, active pipeline, and recent activity at a glance.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500 font-mono">
              {error}{" "}
              <button onClick={fetchData} className="underline underline-offset-2 ml-2 inline-flex items-center gap-1">
                <RefreshCw className="h-3 w-3" /> Retry
              </button>
            </div>
          )}

          {/* ── KPIs ── */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-4">
              Capital metrics
            </p>
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 border border-border rounded-xl overflow-hidden">
              {KPI_META.map(({ key, label, icon: Icon }) => {
                const raw = data.kpis[key as keyof KpiData]
                return (
                  <div
                    key={key}
                    className="bg-background p-5 group hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        {label}
                      </span>
                    </div>
                    <div className="text-2xl font-serif font-light text-foreground tracking-tight">
                      {loading ? (
                        <span className="inline-block h-7 w-24 bg-foreground/5 rounded animate-pulse" />
                      ) : (
                        raw.toString()
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Pipeline ── */}
          <div>
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                Investment pipeline
              </p>
              <Link
                href="/investor/investments"
                className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {STAGE_CONFIG.map(({ key, label, desc }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ background: "var(--brand-accent)" }}
                    />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/70">
                      {label}
                    </span>
                    <span className="text-[9px] text-muted-foreground ml-auto">
                      {desc}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {byStage[key].map(p => (
                      <li key={p.id}>
                        <Link
                          href={`/investor/search/${p.id}`}
                          className="block px-3 py-2.5 text-xs text-foreground/70 hover:text-foreground rounded-lg border border-border/60 hover:border-border bg-background hover:bg-accent/20 transition-all duration-150 font-sans"
                        >
                          {p.name}
                        </Link>
                      </li>
                    ))}
                    {byStage[key].length === 0 && (
                      <li className="px-3 py-3 text-xs text-muted-foreground italic font-mono">
                        Nothing here yet.
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ── Activity ── */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-4">
              Recent activity
            </p>
            <ul className="space-y-0 border border-border rounded-xl overflow-hidden">
              {data.recentActivity.map((act, i) => (
                <li
                  key={act.id}
                  className={cn(
                    "flex items-start gap-4 px-5 py-4 hover:bg-accent/20 transition-colors",
                    i !== data.recentActivity.length - 1 && "border-b border-border/60"
                  )}
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ background: "var(--brand-accent)", opacity: 0.7 }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80 font-sans leading-snug">
                      {act.description}
                    </p>
                    <span className="text-[10px] font-mono text-muted-foreground mt-0.5 block">
                      {act.timestamp}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Concierge rail ── */}
        <ConciergeRail />
      </div>
    </div>
  )
}