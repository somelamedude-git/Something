"use client"

import React from "react"
import { MutinyResponse } from "@/lib/mock-mutiny"
import { Button } from "@/components/ui/button"
import { logFeedback } from "@/lib/mutiny-feedback"
import { toast } from "@/components/ui/use-toast"

export default function MutinyResults({ data }: { data: MutinyResponse | null }) {
  if (!data) return <div className="p-6 text-center text-white/60">Run the composer to see matches.</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white/3 border border-white/6 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold">People</h4>
          <div className="text-xs text-white/60">Top matches</div>
        </div>
        <div className="space-y-3">
          {data.people.map((p) => (
            <div key={p.id} className="p-3 bg-white/4 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/30 transition-shadow hover:shadow-lg" tabIndex={0} role="article" aria-label={p.name} onKeyDown={(e) => { if (e.key === 'Enter') logFeedback({ id: Date.now().toString(), type: 'introduce', targetType: 'person', targetId: p.id, timestamp: new Date().toISOString() }) }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-white/60">{p.role} • {p.headline}</div>
                </div>
                <div className="text-sm font-semibold">
                  <span className={`inline-block rounded-md px-2 py-0.5 text-xs ${p.similarityScore > 0.8 ? 'bg-emerald-500 text-black' : p.similarityScore > 0.65 ? 'bg-amber-400 text-black' : 'bg-white/6 text-white'}`}>{Math.round(p.similarityScore * 100)}%</span>
                </div>
              </div>
              <div className="text-xs text-white/70 mt-2">{p.reasons.join(' • ')}</div>
              <div className="mt-3 flex gap-2">
                <Button aria-label={`Connect ${p.name}`} size="sm" onClick={() => { logFeedback({ id: Date.now().toString(), type: 'introduce', targetType: 'person', targetId: p.id, timestamp: new Date().toISOString() }); toast({ title: 'Feedback saved', description: `Requested intro to ${p.name}` }) }}>Connect</Button>
                <Button aria-label={`Accept ${p.name}`} size="sm" variant="ghost" onClick={() => { logFeedback({ id: Date.now().toString(), type: 'accept', targetType: 'person', targetId: p.id, timestamp: new Date().toISOString() }); toast({ title: 'Accepted', description: `Accepted ${p.name}` }) }}>Accept</Button>
                <Button aria-label={`Flag ${p.name}`} size="sm" variant="destructive" onClick={() => { logFeedback({ id: Date.now().toString(), type: 'flag', targetType: 'person', targetId: p.id, timestamp: new Date().toISOString() }); toast({ title: 'Flagged', description: `Flagged ${p.name}` }) }}>Flag</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/3 border border-white/6 rounded-lg p-4">
        <h4 className="text-sm font-semibold mb-3">Investors</h4>
        <div className="space-y-3">
          {data.investors.map((i) => (
            <div key={i.id} className="p-3 bg-white/4 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/30 transition-shadow hover:shadow-lg" tabIndex={0} role="article" aria-label={i.name} onKeyDown={(e) => { if (e.key === 'Enter') logFeedback({ id: Date.now().toString(), type: 'introduce', targetType: 'investor', targetId: i.id, timestamp: new Date().toISOString() }) }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{i.name}</div>
                  <div className="text-xs text-white/60">{i.stage} • {i.sectors.join(', ')}</div>
                </div>
                <div className="text-sm font-semibold">{Math.round(i.matchScore * 100)}%</div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button aria-label={`Introduce ${i.name}`} size="sm" onClick={() => { logFeedback({ id: Date.now().toString(), type: 'introduce', targetType: 'investor', targetId: i.id, timestamp: new Date().toISOString() }); toast({ title: 'Intro requested', description: `Requested intro to ${i.name}` }) }}>Introduce</Button>
                <Button aria-label={`Accept ${i.name}`} size="sm" variant="ghost" onClick={() => { logFeedback({ id: Date.now().toString(), type: 'accept', targetType: 'investor', targetId: i.id, timestamp: new Date().toISOString() }); toast({ title: 'Accepted', description: `Accepted ${i.name}` }) }}>Accept</Button>
                <Button aria-label={`Flag ${i.name}`} size="sm" variant="destructive" onClick={() => { logFeedback({ id: Date.now().toString(), type: 'flag', targetType: 'investor', targetId: i.id, timestamp: new Date().toISOString() }); toast({ title: 'Flagged', description: `Flagged ${i.name}` }) }}>Flag</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/3 border border-white/6 rounded-lg p-4">
        <h4 className="text-sm font-semibold mb-3">Similar Ideas</h4>
        <div className="space-y-3">
          {data.ideas.map((it) => (
            <div key={it.id} className="p-3 bg-white/4 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/30 transition-shadow hover:shadow-lg" tabIndex={0} role="article" aria-label={it.title} onKeyDown={(e) => { if (e.key === 'Enter') logFeedback({ id: Date.now().toString(), type: 'accept', targetType: 'idea', targetId: it.id, timestamp: new Date().toISOString() }) }}>
              <div className="font-medium">{it.title}</div>
              <div className="text-xs text-white/60">by {it.ownerName} — {Math.round(it.similarityScore * 100)}%</div>
              <div className="text-sm text-white/70 mt-2">{it.summary}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-white/60">Rationale</div>
        <div className="mt-1 text-sm text-white/70 p-3 bg-white/2 rounded-md">{data.rationale}</div>
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => logFeedback({ id: Date.now().toString(), type: 'accept', targetType: 'idea', targetId: data.ideas[0]?.id || 'n/a', timestamp: new Date().toISOString() })}>Accept selection</Button>
          <Button size="sm" variant="destructive" onClick={() => logFeedback({ id: Date.now().toString(), type: 'flag', targetType: 'idea', targetId: data.ideas[0]?.id || 'n/a', timestamp: new Date().toISOString() })}>Flag results</Button>
        </div>
      </div>
    </div>
  )
}
