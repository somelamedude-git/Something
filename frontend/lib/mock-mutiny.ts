type Person = { id: string; name: string; role: string; headline?: string; similarityScore: number; reasons: string[] }
type Investor = { id: string; name: string; stage: string; sectors: string[]; matchScore: number }
type Idea = { id: string; title: string; summary: string; ownerName: string; similarityScore: number }

export type MutinyResponse = {
  people: Person[]
  investors: Investor[]
  ideas: Idea[]
  rationale: string
}

export async function queryMutiny(_idea: string, mode: "mut" | "iny" | "mutiny") {
  // Simulate server latency
  await new Promise((r) => setTimeout(r, 700))

  const basePeople: Person[] = [
    { id: 'p1', name: 'Ava Reynolds', role: 'CTO @ Nimbus', headline: 'Built scalable infra for ML teams', similarityScore: 0.88, reasons: ['AI/ML overlap','Previous product in climate AI'] },
    { id: 'p2', name: 'Marco Liu', role: 'Product Lead', headline: 'Focused on developer tools', similarityScore: 0.74, reasons: ['Product fit','Similar UX challenge'] },
    { id: 'p3', name: 'Lena Ortiz', role: 'Founder', headline: 'Ex-founder in fintech', similarityScore: 0.62, reasons: ['Payments experience'] },
  ]

  const baseInvestors: Investor[] = [
    { id: 'i1', name: 'Copper Ventures', stage: 'Seed', sectors: ['AI/ML','Fintech'], matchScore: 0.91 },
    { id: 'i2', name: 'North Ridge', stage: 'Series A', sectors: ['Enterprise','DevTools'], matchScore: 0.72 },
  ]

  const baseIdeas: Idea[] = [
    { id: 'idea1', title: 'Auto ML tuning assistant', summary: 'Tool to recommend hyperparameters automatically', ownerName: 'Sam', similarityScore: 0.84 },
    { id: 'idea2', title: 'Paywall micro-insights', summary: 'Analytics for subscription churn', ownerName: 'Dana', similarityScore: 0.58 },
  ]

  let rationale = ''
  if (mode === 'mut') rationale = 'Mut thinks the idea may have product-market-fit gaps around monetization and suggests re-evaluating the pricing model.'
  else if (mode === 'iny') rationale = 'Iny suggests simplifying the MVP and focusing on early user acquisition channels like developer communities.'
  else rationale = 'Mutiny aggregates matches from people and investors based on topical similarity and past experience.'

  return {
    people: basePeople,
    investors: baseInvestors,
    ideas: baseIdeas,
    rationale,
  } as MutinyResponse
}
