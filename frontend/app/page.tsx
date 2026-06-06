import { Suspense, lazy } from "react"
import { NavAvant } from "@/components/nav-avant"

const HeroConstellation = lazy(() => import("@/components/hero-constellation").then(module => ({ default: module.HeroConstellation })))
const MatchCabinet = lazy(() => import("@/components/match-cabinet").then(module => ({ default: module.MatchCabinet })))
const DuoSynth = lazy(() => import("@/components/duo-synth").then(module => ({ default: module.DuoSynth })))
const FundingOrbit = lazy(() => import("@/components/funding-orbit").then(module => ({ default: module.FundingOrbit })))
const FooterAvant = lazy(() => import("@/components/footer-avant").then(module => ({ default: module.FooterAvant })))
import Link from "next/link"

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
  </div>
)

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white">
      <Link href="/investor">Investor</Link>
      <Link href="/founder">Founder</Link>
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-30 opacity-40"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% 20%, rgba(234,191,95,0.06), transparent 65%), radial-gradient(900px 600px at 90% 15%, rgba(248,113,113,0.06), transparent 60%), radial-gradient(600px 600px at 50% 100%, rgba(52,211,153,0.07), transparent 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-40"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.02) 0deg 15deg, rgba(0,0,0,0.02) 15deg 30deg)",
          mixBlendMode: "overlay",
        }}
      />
      
      <NavAvant />
      
      <Suspense fallback={<LoadingSpinner />}>
        <HeroConstellation />
      </Suspense>

      <section className="mx-auto max-w-6xl px-6 sm:px-8 py-10 sm:py-16">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            MutinyTask connects people with aligned conviction. Community funding with milestone-based releases. Job
            seekers find frontier startups. Founders find the complementary team. Your ideas are protected by mutual NDA
            flows and on-chain idea hashes to prove provenance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-8 py-10 sm:py-16">
        <Suspense fallback={<LoadingSpinner />}>
          <MatchCabinet />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-8 py-10 sm:py-16">
        <Suspense fallback={<LoadingSpinner />}>
          <DuoSynth />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-8 py-10 sm:py-16">
        <Suspense fallback={<LoadingSpinner />}>
          <FundingOrbit />
        </Suspense>
      </section>

      <Suspense fallback={<LoadingSpinner />}>
        <FooterAvant />
      </Suspense>
    </main>
  )
}
