"use client"

import { useEffect, useRef } from "react"

/**
 * Creative "Nothing & Something" Parallax Particle Background.
 * - Nothing particles (Gold): Repelled by the mouse cursor, representing deconstruction/void.
 * - Something particles (Emerald/Rose): Attracted by the mouse, representing cohesion/cooperation.
 * - Faint geometric networks (constellations) form between Something particles when they cluster.
 * - Three depth layers drifting at different scroll parallax speeds.
 * - Smooth dampening physics.
 */
export function LandingBg() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf: number
    const mouse = { x: -9999, y: -9999 }
    let scrollY = 0
    let W = 0
    let H = 0
    let pageH = 1

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      pageH = Math.max(document.documentElement.scrollHeight, H)
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = W + "px"
      canvas.style.height = H + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const onResize = () => resize()
    const onScroll = () => {
      scrollY = window.scrollY
      pageH = Math.max(document.documentElement.scrollHeight, H)
    }
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseleave", onLeave)

    // ── Particle System Definition ─────────────────────────────────
    type Particle = {
      x: number // original page X
      y: number // original page Y
      vx: number
      vy: number
      baseR: number
      depth: number // scroll parallax multiplier
      type: "nothing" | "something" | "star"
      color: string
      phase: number
      pulseSpeed: number
      baseAlpha: number
    }

    const particles: Particle[] = []

    // 1. Static Far Stars (background anchor)
    const STAR_COUNT = 90
    for (let i = 0; i < STAR_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * pageH,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        baseR: 0.3 + Math.random() * 0.6,
        depth: 0.12, // moves very slowly
        type: "star",
        color: "rgba(255, 255, 255, 0.4)",
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.01,
        baseAlpha: 0.15 + Math.random() * 0.3,
      })
    }

    // 2. Nothing Particles (Gold - Repelled by cursor)
    const NOTHING_COUNT = 55
    for (let i = 0; i < NOTHING_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * pageH,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        baseR: 0.8 + Math.random() * 1.2,
        depth: 0.35, // medium parallax
        type: "nothing",
        color: "rgba(227, 194, 122, ", // partial string for opacity injection
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        baseAlpha: 0.2 + Math.random() * 0.4,
      })
    }

    // 3. Something Particles (Emerald/Rose - Attracted to cursor & linkable)
    const SOMETHING_COUNT = 45
    for (let i = 0; i < SOMETHING_COUNT; i++) {
      const isEmerald = Math.random() > 0.4
      particles.push({
        x: Math.random() * W,
        y: Math.random() * pageH,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        baseR: 1.2 + Math.random() * 1.5,
        depth: 0.6, // fast parallax
        type: "something",
        color: isEmerald ? "rgba(52, 211, 153, " : "rgba(244, 114, 182, ",
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.025,
        baseAlpha: 0.25 + Math.random() * 0.45,
      })
    }

    // Nebula background spots
    const nebulae = [
      { xFrac: 0.15, yAbs: 300, r: 450, color: [227, 194, 122], a: 0.025, parallax: 0.1 },
      { xFrac: 0.85, yAbs: 800, r: 400, color: [244, 114, 182], a: 0.018, parallax: 0.15 },
      { xFrac: 0.35, yAbs: 1500, r: 500, color: [52, 211, 153], a: 0.022, parallax: 0.08 },
      { xFrac: 0.75, yAbs: 2400, r: 420, color: [227, 194, 122], a: 0.015, parallax: 0.12 },
      { xFrac: 0.25, yAbs: 3400, r: 380, color: [244, 114, 182], a: 0.012, parallax: 0.18 },
    ]

    const MOUSE_RADIUS = 220

    const tick = () => {
      ctx.clearRect(0, 0, W, H)

      // ── Draw nebulae with parallax ────────────────────────────────
      for (const n of nebulae) {
        const px = n.xFrac * W
        const py = n.yAbs - scrollY * (1 - n.parallax)
        if (py > -n.r && py < H + n.r) {
          const grd = ctx.createRadialGradient(px, py, 0, px, py, n.r)
          grd.addColorStop(0, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.a})`)
          grd.addColorStop(1, "transparent")
          ctx.beginPath()
          ctx.arc(px, py, n.r, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()
        }
      }

      // ── Update & Draw Particles ──────────────────────────────────
      const renderedSomething: { x: number; y: number; color: string; alpha: number }[] = []

      for (const p of particles) {
        p.phase += p.pulseSpeed

        // 1. Natural Wind / Drift
        p.x += p.vx + 0.04
        p.y += p.vy + 0.02

        // 2. Parallax Screen-Space Coordinates
        const visualY = p.y - scrollY * p.depth
        // Wrap screen Y to keep it looping on view
        let screenY = ((visualY % H) + H) % H

        // 3. Mouse Physics (in screen space)
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = p.x - mouse.x
          const dy = screenY - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < MOUSE_RADIUS) {
            const force = (1 - dist / MOUSE_RADIUS) * 0.35

            if (p.type === "nothing") {
              // Doubt Repels
              const pushX = (dx / (dist || 1)) * force * 1.5
              const pushY = (dy / (dist || 1)) * force * 1.5
              p.vx += pushX
              p.vy += pushY
            } else if (p.type === "something") {
              // Belief Attracts
              const pullX = (dx / (dist || 1)) * force * 1.2
              const pullY = (dy / (dist || 1)) * force * 1.2
              p.vx -= pullX
              p.vy -= pullY

              // Add a soft orbit/swirl effect
              p.vx += (-dy / (dist || 1)) * force * 0.6
              p.vy += (dx / (dist || 1)) * force * 0.6
            }
          }
        }

        // Apply friction/dampening
        p.vx *= 0.94
        p.vy *= 0.94

        // 4. Wrap Page-Space Boundaries
        if (p.x < -20) p.x = W + 20
        if (p.x > W + 20) p.x = -20
        if (p.y < -20) p.y = pageH + 20
        if (p.y > pageH + 20) p.y = -20

        // Twinkle/Pulse Opacity
        const pulse = 0.6 + 0.4 * Math.sin(p.phase)
        let alpha = p.baseAlpha * pulse

        // Mouse proximity glow boost
        const dx = p.x - mouse.x
        const dy = screenY - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS) {
          const proximity = 1 - dist / MOUSE_RADIUS
          alpha = Math.min(alpha + proximity * 0.4, 0.95)
        }

        // 5. Draw Particle
        ctx.beginPath()
        const colorStr = p.type === "star" ? p.color : `${p.color}${alpha})`
        ctx.fillStyle = colorStr
        const r = p.type === "star" ? p.baseR : p.baseR * (1 + (hoveredFactor(p, dist) * 0.4))
        ctx.arc(p.x, screenY, r, 0, Math.PI * 2)
        ctx.fill()

        // Cache coordinates for link drawing
        if (p.type === "something") {
          renderedSomething.push({ x: p.x, y: screenY, color: p.color, alpha })
        }
      }

      // ── Draw Constellation Links (Something networks) ────────────
      const LINK_DIST = 95
      for (let i = 0; i < renderedSomething.length; i++) {
        const p1 = renderedSomething[i]
        for (let j = i + 1; j < renderedSomething.length; j++) {
          const p2 = renderedSomething[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < LINK_DIST) {
            const opacity = (1 - dist / LINK_DIST) * 0.08 * Math.min(p1.alpha, p2.alpha)
            ctx.beginPath()
            ctx.strokeStyle = `${p1.color}${opacity})`
            ctx.lineWidth = 0.5 + (1 - dist / LINK_DIST) * 0.5
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(tick)
    }

    const hoveredFactor = (p: Particle, dist: number): number => {
      if (mouse.x < 0 || p.type === "star") return 0
      return dist < MOUSE_RADIUS ? 1 - dist / MOUSE_RADIUS : 0
    }

    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
