import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileText, ExternalLink, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

type Project = {
  id: string
  name: string
  domains: string[]
  desc: string
  stage: "Pre‑seed" | "Seed" | "Angel" | "Series A"
  launchedAt: string | null
  trustPoints: number
  location: string
  investmentNeeded: number
  fundsGained: number
  fundsSpent: number
  founders: { id: string; name: string; role: string }[]
  uploads: { type: "deck" | "link" | "image"; label: string; href?: string; src?: string }[]
}

const MOCK: Project[] = [
  {
    id: "p1",
    name: "Edge Vision Kit",
    domains: ["Edge AI", "Robotics"],
    desc: "Low‑power on‑device vision kit with local models. Shipping v0 sensors.",
    stage: "Seed",
    launchedAt: new Date().toISOString(),
    trustPoints: 82,
    location: "SF Bay",
    investmentNeeded: 18000,
    fundsGained: 12000,
    fundsSpent: 5000,
    founders: [
      { id: "f-ava", name: "Ava D.", role: "Founder, Hardware" },
      { id: "f-ian", name: "Ian R.", role: "ML/Edge" },
    ],
    uploads: [
      { type: "deck",  label: "Pitch Deck.pdf",  href: "#" },
      { type: "link",  label: "Website",          href: "#" },
      { type: "image", label: "Sensor Module",    src: "/sensor-module.png" },
    ],
  },
  {
    id: "p2",
    name: "Climate Hardware v1",
    domains: ["Climate hardware"],
    desc: "Modular capture component; open test data with independent validation.",
    stage: "Pre‑seed",
    launchedAt: null,
    trustPoints: 74,
    location: "Berlin",
    investmentNeeded: 40000,
    fundsGained: 15000,
    fundsSpent: 3000,
    founders: [{ id: "f-lee", name: "Lee K.", role: "Founder" }],
    uploads: [
      { type: "deck", label: "Intro Deck.pdf", href: "#" },
      { type: "link", label: "Data Room",      href: "#" },
    ],
  },
]

export default function ProjectBriefPage({ params }: { params: { id: string } }) {
  const p = MOCK.find((x) => x.id === params.id)
  if (!p) return notFound()

  const tp       = clamp(p.trustPoints, 1, 100)
  const delta    = tp - 75
  const deltaStr = delta === 0 ? "0" : delta > 0 ? `+${delta}` : `${delta}`
  const progress = Math.max(0, Math.min(100, Math.round((p.fundsSpent / Math.max(1, p.fundsGained)) * 100)))

  return (
    <div className="mx-auto max-w-[1100px] space-y-8 pb-16">

      {/* Back button */}
      <div className="pt-2">
        <Button
          asChild
          variant="ghost"
          className="h-8 rounded-lg text-foreground/60 hover:text-foreground hover:bg-accent -ml-2 text-sm"
        >
          <Link href="/investor/search">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to search
          </Link>
        </Button>
      </div>

      {/* ── Header ── */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2 mb-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-accent)" }} />
          Project Brief
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-serif font-light tracking-tight text-foreground">{p.name}</h1>
              <Badge variant="secondary" className="bg-accent text-foreground/70 border-border font-mono text-[10px]">
                {p.stage}
              </Badge>
              {p.domains.map((d) => (
                <Badge key={d} variant="secondary" className="bg-accent/60 text-foreground/60 border-border/60 text-[10px]">
                  {d}
                </Badge>
              ))}
              <span className="text-xs text-muted-foreground">&middot; {p.location}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">{p.desc}</p>
          </div>

          <div className="lg:shrink-0 space-y-2">
            <div className="text-sm text-foreground/70">
              Trust <span className="font-semibold text-foreground">{tp}</span>
              <span className={cn("ml-1 text-xs", delta > 0 ? "text-emerald-500" : delta < 0 ? "text-rose-500" : "text-muted-foreground")}>
                ({deltaStr})
              </span>
            </div>
            <div className="h-1 w-48 rounded-full bg-border overflow-hidden">
              <div
                className="h-1 rounded-full transition-all"
                style={{ width: `${Math.max(2, (tp / 100) * 100)}%`, background: "var(--brand-accent)" }}
                aria-label="Trust meter"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Funds ── */}
      <div>
        <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">Capital</p>
        <div className="grid gap-px sm:grid-cols-3 border border-border rounded-xl overflow-hidden">
          <Stat label="Funds gained" value={`$${p.fundsGained.toLocaleString()}`} />
          <Stat label="Spent"        value={`$${p.fundsSpent.toLocaleString()}`} />
          <Stat label="Needed"       value={`$${p.investmentNeeded.toLocaleString()}`} />
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono mb-1.5">
            <span className="uppercase tracking-wider">Burn rate (spent / gained)</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 rounded-full bg-border overflow-hidden">
            <div
              className="h-1 rounded-full transition-all"
              style={{ width: `${progress}%`, background: "var(--brand-accent)" }}
            />
          </div>
        </div>
      </div>

      {/* ── Uploads ── */}
      <div>
        <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">Founder Uploads</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {p.uploads.map((u, i) => {
            if (u.type === "deck" || u.type === "link") {
              return (
                <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4 hover:bg-accent/20 transition-colors">
                  <div className="flex items-center gap-2 text-sm text-foreground/70 min-w-0">
                    {u.type === "deck"
                      ? <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      : <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                    }
                    <span className="truncate">{u.label}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-lg border-border/60 text-foreground/60 hover:bg-accent hover:text-foreground bg-transparent text-xs shrink-0"
                    asChild
                  >
                    <Link href={u.href || "#"}>Open</Link>
                  </Button>
                </div>
              )
            }
            return (
              <div key={i} className="rounded-xl border border-border overflow-hidden bg-accent/20">
                <img
                  alt={u.label}
                  src={u.src || "/placeholder.svg?height=120&width=200&query=project%20image"}
                  className="h-28 w-full object-cover"
                />
                <div className="px-4 py-2.5 text-sm text-foreground/70">{u.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Founders ── */}
      <div>
        <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">Founders</p>
        <div className="rounded-xl border border-border overflow-hidden">
          {p.founders.map((f, i) => (
            <div
              key={f.id}
              className={cn(
                "px-5 py-4 flex items-center justify-between gap-3 hover:bg-accent/20 transition-colors",
                i !== 0 && "border-t border-border/60"
              )}
            >
              <div>
                <div className="font-medium text-sm text-foreground">{f.name}</div>
                <div className="text-xs text-muted-foreground font-mono">{f.role}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg border-border/60 text-foreground/60 hover:bg-accent hover:text-foreground bg-transparent text-xs"
                >
                  View profile
                </Button>
                <Button
                  size="sm"
                  className="h-8 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-xs"
                >
                  Start chat
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Actions ── */}
      <div>
        <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">Actions</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button className="rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-medium">
            Commit funds
          </Button>
          <Button
            variant="outline"
            className="rounded-lg border-border/60 text-foreground/60 hover:bg-accent hover:text-foreground bg-transparent"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Request NDA
          </Button>
          <Button
            variant="outline"
            className="rounded-lg border-border/60 text-foreground/60 hover:bg-accent hover:text-foreground bg-transparent"
          >
            Request update
          </Button>
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div className="text-xs text-muted-foreground font-mono">
        Verified projects display an additional badge after Something review.
      </div>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-background p-5 hover:bg-accent/30 transition-colors">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      <div className="text-lg font-serif font-light text-foreground tracking-tight">
        {value}{hint ? <span className="ml-1 text-xs text-muted-foreground">{hint}</span> : null}
      </div>
    </div>
  )
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
