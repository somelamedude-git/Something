import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileText, ExternalLink, ShieldCheck } from "lucide-react"

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

// Minimal mock; ids match search page
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
      { type: "deck", label: "Pitch Deck.pdf", href: "#" },
      { type: "link", label: "Website", href: "#" },
      { type: "image", label: "Sensor Module", src: "/sensor-module.png" },
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
      { type: "link", label: "Data Room", href: "#" },
    ],
  },
]

export default function ProjectBriefPage({ params }: { params: { id: string } }) {
  const p = MOCK.find((x) => x.id === params.id)
  if (!p) return notFound()

  const baseline = 75
  const tp = clamp(p.trustPoints, 1, 100)
  const delta = tp - baseline
  const deltaStr = delta === 0 ? "0" : delta > 0 ? `+${delta}` : `${delta}`
  const progress = Math.max(0, Math.min(100, Math.round((p.fundsSpent / Math.max(1, p.fundsGained)) * 100)))

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="outline"
          className="h-8 rounded-md border-white/10 text-white hover:bg-white/10 bg-transparent"
        >
          <Link href="/investor/search">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to search
          </Link>
        </Button>
      </div>

      {/* Header */}
      <section className="rounded-xl border border-[#1a1b1e] bg-[#101113] p-4">
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold">{p.name}</h1>
              <Badge variant="secondary" className="bg-white/[0.05] text-white border-[#1a1b1e]">
                {p.stage}
              </Badge>
              {p.domains.map((d) => (
                <Badge key={d} variant="secondary" className="bg-white/[0.05] text-white border-[#1a1b1e]">
                  {d}
                </Badge>
              ))}
              <span className="text-xs text-white/60">• {p.location}</span>
            </div>
            <p className="mt-2 text-sm text-white/70">{p.desc}</p>
          </div>

          <div className="lg:justify-self-end">
            <div className="text-sm">
              Trust <span className="font-semibold">{tp}</span>
              <span className={cnDelta(delta)}>{` (${deltaStr})`}</span>
            </div>
            <div className="mt-2 h-2 w-full max-w-[220px] rounded bg-white/10">
              <div
                className="h-2 rounded bg-white"
                style={{ width: `${Math.max(2, (tp / 100) * 100)}%`, opacity: 0.8 }}
                aria-label="Trust meter"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Funds */}
      <section className="rounded-xl border border-[#1a1b1e] bg-[#101113] p-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Funds gained" value={`$${p.fundsGained.toLocaleString()}`} />
          <Stat label="Spent" value={`$${p.fundsSpent.toLocaleString()}`} />
          <Stat label="Needed" value={`$${p.investmentNeeded.toLocaleString()}`} />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Progress</span>
            <span>{progress}% of gained spent</span>
          </div>
          <div className="mt-2 h-2 rounded bg-white/10">
            <div className="h-2 rounded bg-white" style={{ width: `${progress}%`, opacity: 0.8 }} />
          </div>
        </div>
      </section>

      {/* Uploads */}
      <section className="rounded-xl border border-[#1a1b1e] bg-[#101113] p-4">
        <h2 className="text-base font-medium">Founder uploads</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {p.uploads.map((u, i) => {
            if (u.type === "deck" || u.type === "link") {
              return (
                <Card key={i} className="border-[#1a1b1e] bg-[#0f1012]">
                  <CardContent className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      {u.type === "deck" ? (
                        <FileText className="h-4 w-4 opacity-70" />
                      ) : (
                        <ExternalLink className="h-4 w-4 opacity-70" />
                      )}
                      <span className="truncate">{u.label}</span>
                    </div>
                    <Button
                      variant="outline"
                      className="h-8 rounded-md border-white/10 text-white hover:bg-white/10 bg-transparent"
                      asChild
                    >
                      <Link href={u.href || "#"}>Open</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            }
            return (
              <Card key={i} className="border-[#1a1b1e] bg-[#0f1012]">
                <CardContent className="p-3">
                  <img
                    alt={u.label}
                    src={u.src || "/placeholder.svg?height=120&width=200&query=project%20image"}
                    className="h-28 w-full rounded-md object-cover"
                  />
                  <div className="mt-2 text-sm text-white/80">{u.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Founders */}
      <section className="rounded-xl border border-[#1a1b1e] bg-[#101113] p-4">
        <h2 className="text-base font-medium">Founders</h2>
        <div className="mt-3 divide-y divide-white/5 rounded-lg border border-white/10 bg-black/30">
          {p.founders.map((f) => (
            <div key={f.id} className="px-3 py-3 flex items-center justify-between gap-2">
              <div>
                <div className="font-medium">{f.name}</div>
                <div className="text-xs text-white/60">{f.role}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-8 rounded-md border-white/10 text-white hover:bg-white/10 bg-transparent"
                >
                  View profile
                </Button>
                <Button className="h-8 rounded-md bg-white text-[#0b0b0c] hover:bg-white/90">Start chat</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <section className="rounded-xl border border-[#1a1b1e] bg-[#101113] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button className="rounded-md bg-white text-[#0b0b0c] hover:bg-white/90">Commit funds</Button>
          <Button variant="outline" className="rounded-md border-white/10 text-white hover:bg-white/10 bg-transparent">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Request NDA
          </Button>
          <Button variant="outline" className="rounded-md border-white/10 text-white hover:bg-white/10 bg-transparent">
            Request update
          </Button>
        </div>
      </section>

      <Separator className="bg-white/10" />

      <div className="text-xs text-white/50">
        Verified projects show an additional badge provided by Mutiny after review.
      </div>
    </div>
  )
}

/* Local components */
function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/30 p-3">
      <div className="text-[11px] text-white/60">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">
        {value} {hint ? <span className="ml-1 text-xs text-white/60">{hint}</span> : null}
      </div>
    </div>
  )
}

/* Utils */
function cnDelta(delta: number) {
  return `ml-1 text-xs ${delta > 0 ? "text-emerald-300" : delta < 0 ? "text-rose-300" : "text-white/70"}`
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
