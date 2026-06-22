"use client"

import type React from "react"
import { cn } from "@/lib/utils"

export type PageHeaderAccentColor = "emerald" | "amber" | "indigo" | "pink" | "violet" | "blue"

interface PageHeaderProps {
  category: string
  title: string
  description: string
  icon?: React.ComponentType<any>
  accentColor?: PageHeaderAccentColor
  action?: React.ReactNode
  className?: string
}

export function PageHeader({
  category,
  title,
  description,
  icon: Icon,
  accentColor = "emerald",
  action,
  className,
}: PageHeaderProps) {
  
  // Theme colors mapping for background blurs & top indicator lines
  const theme = {
    emerald: {
      bulletBg: "bg-[#34D399]",
      textAccent: "text-[#34D399]",
      glowColor: "before:via-[#34D399]/40",
      radialBg: "radial-gradient(circle, #34D399, transparent)",
      blurOpacity: "opacity-[0.15] sm:opacity-[0.2]",
    },
    amber: {
      bulletBg: "bg-[#E3C27A]",
      textAccent: "text-[#E3C27A]",
      glowColor: "before:via-[#E3C27A]/40",
      radialBg: "radial-gradient(circle, #E3C27A, transparent)",
      blurOpacity: "opacity-[0.12] sm:opacity-[0.18]",
    },
    indigo: {
      bulletBg: "bg-[#818CF8]",
      textAccent: "text-[#818CF8]",
      glowColor: "before:via-[#818CF8]/40",
      radialBg: "radial-gradient(circle, #818CF8, transparent)",
      blurOpacity: "opacity-[0.15] sm:opacity-[0.2]",
    },
    pink: {
      bulletBg: "bg-[#F472B6]",
      textAccent: "text-[#F472B6]",
      glowColor: "before:via-[#F472B6]/40",
      radialBg: "radial-gradient(circle, #F472B6, transparent)",
      blurOpacity: "opacity-[0.12] sm:opacity-[0.18]",
    },
    violet: {
      bulletBg: "bg-[#A78BFA]",
      textAccent: "text-[#A78BFA]",
      glowColor: "before:via-[#A78BFA]/40",
      radialBg: "radial-gradient(circle, #A78BFA, transparent)",
      blurOpacity: "opacity-[0.12] sm:opacity-[0.18]",
    },
    blue: {
      bulletBg: "bg-blue-500",
      textAccent: "text-blue-400",
      glowColor: "before:via-blue-500/40",
      radialBg: "radial-gradient(circle, #3b82f6, transparent)",
      blurOpacity: "opacity-[0.12] sm:opacity-[0.18]",
    },
  }[accentColor]

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015] backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-black/10 transition-all duration-300",
        "before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:to-transparent",
        theme.glowColor,
        className
      )}
    >
      {/* Background Glow */}
      <div
        className={cn(
          "absolute -top-32 -right-32 w-64 h-64 rounded-full pointer-events-none blur-3xl transition-opacity duration-500",
          theme.blurOpacity
        )}
        style={{ background: theme.radialBg }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1">
          {/* Tag Category */}
          <div className="flex items-center gap-2">
            <span className={cn("h-1.5 w-1.5 rounded-full", theme.bulletBg)} />
            <span className={cn("text-[9px] uppercase tracking-widest font-mono font-bold", theme.textAccent)}>
              {category}
            </span>
          </div>

          {/* Title Header */}
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-white/90 shrink-0 hidden sm:block">
                <Icon className="h-[18px] w-[18px]" />
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-outfit" style={{ fontFamily: "var(--font-outfit)" }}>
              {title}
            </h1>
          </div>

          {/* Description */}
          <p className="text-white/45 text-xs sm:text-[13px] leading-relaxed max-w-2xl font-sans pt-0.5">
            {description}
          </p>
        </div>

        {/* Action button container */}
        {action && (
          <div className="flex flex-wrap gap-2 shrink-0 md:ml-auto items-center">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}
