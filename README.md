<div align="center">
  <br/>

  <!-- Animated brand logo -->
  <svg width="220" height="220" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      @keyframes pulse {
        0%, 100% { opacity: 0.25; transform: scale(1); }
        50% { opacity: 0.45; transform: scale(1.06); }
      }
      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes core-pulse {
        0%, 100% { opacity: 0.75; }
        50% { opacity: 1; }
      }
      .glow-layer {
        transform-origin: 120px 120px;
        animation: pulse 8s ease-in-out infinite;
      }
      .orbit-line {
        transform-origin: 120px 120px;
        animation: rotate 28s linear infinite;
      }
      .core-element {
        animation: core-pulse 3.5s ease-in-out infinite;
      }
    </style>
    
    <!-- Glowing backdrop meshes -->
    <g class="glow-layer">
      <circle cx="120" cy="120" r="85" fill="url(#glowGradient)" filter="url(#blurFilter)" />
    </g>

    <!-- Rotating orbit marker -->
    <g class="orbit-line">
      <circle cx="120" cy="120" r="75" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
      <circle cx="45" cy="120" r="3" fill="#8B5CF6" />
      <circle cx="195" cy="120" r="3.5" fill="#34D399" />
    </g>

    <!-- Doubt / Nothing - Amber ring (dashed) -->
    <circle cx="95" cy="120" r="48" stroke="#F59E0B" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.65" />
    
    <!-- Belief / Something - Emerald ring (solid) -->
    <circle cx="145" cy="120" r="48" stroke="#34D399" stroke-width="1.5" opacity="0.85" />
    
    <!-- Intersection area gradient overlay -->
    <path d="M 120 78 A 48 48 0 0 1 120 162 A 48 48 0 0 1 120 78 Z" fill="url(#intersectionGradient)" opacity="0.5" />
    
    <!-- Balanced core alignment glyph -->
    <g class="core-element">
      <path d="M120 95 L120 145" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
      <path d="M110 120 L130 120" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
    </g>

    <defs>
      <filter id="blurFilter" x="-30" y="-30" width="300" height="300" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="25" />
      </filter>
      <radialGradient id="glowGradient" cx="120" cy="120" r="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#8B5CF6" />
        <stop offset="50%" stop-color="#34D399" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="intersectionGradient" x1="120" y1="78" x2="120" y2="162" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#34D399" />
        <stop offset="100%" stop-color="#F59E0B" />
      </linearGradient>
    </defs>
  </svg>

  <h1 style="font-size: 30px; font-weight: 500; letter-spacing: -0.04em; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin-top: 10px; border-bottom: none; margin-bottom: 0;">something</h1>
  <p style="font-size: 10.5px; font-family: monospace; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-top: 6px; margin-bottom: 30px;">ideas find their people • capital finds its purpose</p>
</div>

---

## 1. Ideology

```
        SOMETHING [Belief Resonance] ────────┐
                                            ├─► CLARITY
        NOTHING [Doubt Stress-Test]  ───────┘
```

The venture capital ecosystem is structurally optimized for **pitching**, not building. It values hyper-visibility over architectural truth. 

**Something** is an experimental development playground built to re-align this relationship. It introduces a dual-agent reasoning model that forces creators to challenge their conviction before requesting capital:

* **Something (The Operator / Belief)**: Maps emotional resonance, validates viral hooks, and maps lock-in loops using a local-first SQLite sync architecture.
* **Nothing (The Critic / Doubt)**: Stress-tests database scalability boundaries, computes adoption friction, and calculates user churn risks.

---

## 2. Technical Blueprint

The workspace is organized as a clean mono-repo separation between our Node reasoning core and the client interfaces:

```
Something/
├── backend/                  # Conviction API Core (Node.js & Express)
│   └── src/
│       ├── models/           # Mongoose schemas (Escrows, Users, Matches)
│       ├── utils/            # Calculation vectors for similarity indices
│       └── app.js            # Routing orchestration
│
├── frontend/                 # Client Workspace (Next.js 15 & React 19)
│   ├── app/
│   │   └── founder/          # Founder workspaces
│   │       ├── chats/        # Multi-turn peer coordination
│   │       ├── funding/      # Escrow milestone pipelines
│   │       ├── ideas/        # Compilation canvas
│   │       └── mutiny/       # Duality reasoning workspace
│   │
│   ├── components/           # Radix UI shared primitives
│   └── lib/                  # State definitions & queries
│
└── README.md
```

---

## 3. Trust Infrastructure

We replace standard milestones checklists with a secure **Milestone Escrow Pipeline**:

```
[ Idea Posted ] ──► [ Community Pledges ] ──► [ Escrow Locked ]
                                                    │
[ Funds Released ] ◄── [ Committee Review ] ◄── [ Proof Submitted ]
```

1. **Escrow Lock**: Project capital is secured in milestone pools.
2. **Deliverable Submission**: Founders request payout releases by providing structured evidence logs (GitHub tags, test suites, live links).
3. **Review Board Verification**: Releases require approval from ≥ 50% of the active review committee members.

---

## 4. Visual Directives

The platform employs a dark-mode minimalist style, prioritizing spacious layouts over card boxes and borders:

* **Open Space**: Page headers use typography alignment with thin borders rather than rigid container frames.
* **Translucent Surfaces**: Elements use high backdrop blurs (`backdrop-blur-xl bg-white/[0.015] border-white/5`) to float over ambient background glow layers.
* **Equilibrium Indicators**: Duality ratings are balanced through minimal inline logs and simple text-link actions instead of generic SaaS button grids.

---

## 5. Getting Started

### Backend Core
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run backend development server
npm run dev
```

### Frontend Workspace
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Next.js server
npm run dev
```

---

<div align="center">
  <p style="font-size: 10px; font-family: monospace; color: rgba(255,255,255,0.25);">ideas find their people.</p>
</div>
