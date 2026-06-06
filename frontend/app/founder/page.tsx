"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  Users,
  Coins,
  MessageSquareText,
  LucideIcon,
  Loader2,
  AlertTriangle,
} from "lucide-react"

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// --- Types ---
interface KpiData {
  ideas: number
  teamMembers: number
  fundsRaised: string
  unreadChats: number
}

interface Idea {
  id: string
  title: string
  status: "Funded" | "Seeking" | "Draft"
  funding: string
  stage: string
  tags: string[]
}

interface TeamMember {
  id: string
  initials: string
  name: string
  role: string
}

interface Activity {
  id: string
  text: string
  timestamp: string
}

interface OverviewData {
  kpis: KpiData
  ideas: Idea[]
  team: TeamMember[]
  activity: Activity[]
}

// --- API Service ---
const overviewAPI = {
  async getOverviewData(): Promise<OverviewData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/founder/overview`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching overview data:", error)
      throw new Error("Failed to fetch overview data.")
    }
  },
}

// --- Main Page ---
export default function FounderOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const overviewData = await overviewAPI.getOverviewData()
        setData(overviewData)
      } catch (err) {
        setError("Could not load your overview. Please refresh.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-white/60" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">An Error Occurred</h2>
        <p className="text-white/70">{error}</p>
      </div>
    )
  }

  if (!data) return null

  const { kpis, ideas, team, activity } = data

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Welcome */}
      <WelcomeSection />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Active ideas" value={kpis.ideas.toString()} icon={Lightbulb} />
        <Kpi title="Team members" value={kpis.teamMembers.toString()} icon={Users} />
        <Kpi title="Funds raised" value={kpis.fundsRaised} icon={Coins} />
        <Kpi title="Unread chats" value={kpis.unreadChats.toString()} icon={MessageSquareText} />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <IdeasSection ideas={ideas} />
        <TeamActivitySection team={team} activity={activity} />
      </div>
    </div>
  )
}

// --- Components ---
function WelcomeSection() {
  return (
    <div className="rounded-lg border border-[#1a1b1e] bg-[#101113] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <div>
          <div className="text-sm text-white/60">Welcome back</div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Founder overview</h1>
          <p className="text-white/70 text-sm mt-1">Your ideas, team, and funding in one clean workspace.</p>
        </div>
        <div className="sm:ml-auto flex items-center gap-2">
          <Button className="rounded-md bg-white text-[#0b0b0c] hover:bg-white/90">
            <Lightbulb className="mr-2 h-4 w-4" /> Post idea
          </Button>
        </div>
      </div>
    </div>
  )
}

function Kpi({ title, value, icon: Icon }: { title: string; value: string; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-[#1a1b1e] bg-[#101113] p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-white/60" />
        <div className="text-xs text-white/60">{title}</div>
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  )
}

function IdeasSection({ ideas }: { ideas: Idea[] }) {
  return (
    <Card className="bg-[#101113] border-[#1a1b1e] lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Your ideas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} {...idea} />
        ))}
      </CardContent>
    </Card>
  )
}

function IdeaCard({ title, status, funding, stage, tags }: Idea) {
  const statusColor =
    status === "Funded" ? "text-emerald-300" : status === "Seeking" ? "text-yellow-300" : "text-white/60"

  return (
    <div className="rounded-lg border border-[#1a1b1e] bg-[#0f1012] p-3 flex justify-between items-start gap-2">
      <div className="min-w-0 flex-1">
        <div className="font-medium">{title}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs ${statusColor}`}>{status}</span>
          <span className="text-xs text-white/60">• {funding}</span>
        </div>
        <div className="text-xs text-white/60 mt-1">{stage}</div>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-white/[0.04] text-white border-white/10 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <Button variant="outline" className="h-8 border-[#1a1b1e] text-white hover:bg-white/[0.06] bg-transparent">
        View
      </Button>
    </div>
  )
}

function TeamActivitySection({ team, activity }: { team: TeamMember[]; activity: Activity[] }) {
  return (
    <div className="space-y-6">
      <Card className="bg-[#101113] border-[#1a1b1e]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {team.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#0f1012] grid place-items-center text-xs font-medium">
                {member.initials}
              </div>
              <div>
                <div className="text-sm font-medium">{member.name}</div>
                <div className="text-xs text-white/60">{member.role}</div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full h-8 mt-2 border-[#1a1b1e] text-white hover:bg-white/[0.06] bg-transparent"
          >
            Invite team member
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#101113] border-[#1a1b1e]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {activity.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
                <div>
                  <div>{item.text}</div>
                  <div className="text-white/50 text-xs">{item.timestamp}</div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
