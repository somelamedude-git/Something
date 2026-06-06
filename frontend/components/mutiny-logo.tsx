"use client"

export function WaveLogo() {
  return (
    
 
    <div className="flex items-center gap-2 space-x-10">
      <div className="relative h-8 w-8">
        {/* Subtle outer glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 210deg, #e3c27a, #34d399 35%, #f472b6 60%, #e3c27a 100%)",
            filter: "blur(8px)",
            opacity: 0.3,
          }}
          aria-hidden="true"
        />

        {/* Main circle container */}
        <div className="absolute inset-0 rounded-full ring-1 ring-white/20 bg-black overflow-hidden">
          {/* Premium liquid wave effect */}
          <div className="absolute inset-0">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
              <defs>
                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e3c27a" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#34d399" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f472b6" stopOpacity="0.5" />
                </linearGradient>
                <mask id="circle-mask">
                  <circle cx="16" cy="16" r="16" fill="white" />
                </mask>
              </defs>

              {/* Flowing liquid wave */}
              <path
                d="M0,16 Q8,8 16,16 T32,16 L32,32 L0,32 Z"
                fill="url(#wave-gradient)"
                mask="url(#circle-mask)"
                style={{
                  animation: "liquid-flow 4s ease-in-out infinite",
                  transformOrigin: "center",
                }}
              />

              {/* Secondary wave layer */}
              <path
                d="M0,20 Q12,12 24,20 T48,20 L48,32 L0,32 Z"
                fill="rgba(244, 114, 182, 0.3)"
                mask="url(#circle-mask)"
                style={{
                  animation: "liquid-flow-2 3.5s ease-in-out infinite reverse",
                  transformOrigin: "center",
                }}
              />
            </svg>
          </div>

          {/* Subtle shimmer effect */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
              animation: "shimmer 3s linear infinite",
            }}
          />
        </div>

        {/* Inner glass effect */}
        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-white/5 to-transparent" />
      </div>

      <div className="leading-tight">
        <div className="text-base font-semibold tracking-[0.04em] text-white">Mutiny</div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/60">{"Mut • Iny"}</div>
      </div>

      <style jsx>{`
        @keyframes liquid-flow {
          0%, 100% {
            transform: translateX(0px) scaleY(1);
          }
          50% {
            transform: translateX(-4px) scaleY(1.1);
          }
        }
        
        @keyframes liquid-flow-2 {
          0%, 100% {
            transform: translateX(0px) scaleY(0.9);
          }
          50% {
            transform: translateX(6px) scaleY(1.2);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) rotate(45deg);
          }
        }
      `}</style>
    </div>
  
  )
}
