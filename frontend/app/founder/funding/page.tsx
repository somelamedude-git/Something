"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PostIdeaModal } from "@/components/post-idea-modal"
import { Search, Plus, Filter, Eye, MessageSquare, Heart, Edit, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// #TODO: Backend - Update this with your actual API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

type Tab = "yours" | "discover"

type Stage = "concept" | "prototype" | "mvp" | "launched"

interface Idea {
  id: string
  title: string
  author: string
  desc: string
  tags: string[]
  stage: Stage
  funding?: string
  likes: number
  comments: number
  views: number
  isYours?: boolean
  lookingFor?: string[]
  description?: string
  isDraft?: boolean
  createdAt?: string
}

interface IdeaFormData {
  title: string
  description: string
  tags: string[]
  stage: Stage
  lookingFor: string[]
  isDraft: boolean
}

// API Service Layer
const ideasAPI = {
  // #TODO: Backend - GET /api/ideas/user - Fetch user's ideas
  async fetchYourIdeas(): Promise<Idea[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ideas/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // #TODO: Backend - Update auth method
        },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching your ideas:", error)
      throw error
    }
  },

  // #TODO: Backend - GET /api/ideas/discover - Fetch all public ideas
  async fetchDiscoverIdeas(): Promise<Idea[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ideas/discover`)
      return response.data
    } catch (error) {
      console.error("Error fetching discover ideas:", error)
      throw error
    }
  },

  // #TODO: Backend - POST /api/ideas - Create new idea
  async createIdea(data: IdeaFormData): Promise<Idea> {
    try {
      const response = await axios.post(`${API_BASE_URL}/ideas`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error creating idea:", error)
      throw error
    }
  },

  // #TODO: Backend - PUT /api/ideas/:id - Update idea
  async updateIdea(id: string, data: IdeaFormData): Promise<Idea> {
    try {
      const response = await axios.put(`${API_BASE_URL}/ideas/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error updating idea:", error)
      throw error
    }
  },

  // #TODO: Backend - DELETE /api/ideas/:id - Delete idea
  async deleteIdea(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/ideas/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    } catch (error) {
      console.error("Error deleting idea:", error)
      throw error
    }
  },

  // #TODO: Backend - POST /api/ideas/:id/like - Like/unlike idea
  async likeIdea(id: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/ideas/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
    } catch (error) {
      console.error("Error liking idea:", error)
      throw error
    }
  },

  // #TODO: Backend - GET /api/ideas/:id - Get single idea details
  async getIdeaById(id: string): Promise<Idea> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ideas/${id}`)
      return response.data
    } catch (error) {
      console.error("Error fetching idea:", error)
      throw error
    }
  },
}

export default function FounderIdeasPage() {
  const [tab, setTab] = useState<Tab>("yours")
  const [query, setQuery] = useState("")
  const [yourIdeas, setYourIdeas] = useState<Idea[]>([])
  const [discoverIdeas, setDiscoverIdeas] = useState<Idea[]>([])
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // #TODO: Backend - Remove this mock data function once API is ready
  const loadMockData = useCallback(() => {
    if (tab === "yours") {
      setYourIdeas([
        {
          id: "y1",
          title: "Edge Vision Kit",
          author: "You",
          desc: "Low‑power on‑device vision kit with local models. Shipping v0 sensors to early adopters.",
          description:
            "Low‑power on‑device vision kit with local models. Shipping v0 sensors to early adopters. This system enables real-time computer vision processing without cloud dependency, perfect for robotics and IoT applications.",
          tags: ["Edge AI", "Robotics", "Hardware"],
          stage: "mvp",
          funding: "$8,000 raised",
          likes: 24,
          comments: 8,
          views: 156,
          isYours: true,
          lookingFor: ["Hardware engineer", "Go-to-market lead"],
          isDraft: false,
          createdAt: "2024-01-15",
        },
        {
          id: "y2",
          title: "Local‑first Creator Analytics",
          author: "You",
          desc: "Privacy‑first analytics with CRDT sync across devices. No data leaves your control.",
          description:
            "Privacy‑first analytics with CRDT sync across devices. No data leaves your control. Built for creators who want to understand their audience without compromising privacy.",
          tags: ["Creator infra", "Privacy", "Local‑first"],
          stage: "prototype",
          funding: "$4,400 / $12,000",
          likes: 18,
          comments: 12,
          views: 89,
          isYours: true,
          lookingFor: ["Frontend developer", "Marketing advisor"],
          isDraft: false,
          createdAt: "2024-01-12",
        },
      ])
    } else {
      setDiscoverIdeas([
        {
          id: "d1",
          title: "Neurotech IDE",
          author: "Sam K.",
          desc: "Local‑only IDE and toolchain for neural interfaces. Privacy‑first development environment.",
          tags: ["Bio tooling", "Privacy", "Dev tools"],
          stage: "prototype",
          likes: 42,
          comments: 15,
          views: 234,
          lookingFor: ["Frontend developer", "Neuroscientist"],
        },
        {
          id: "d2",
          title: "DePIN Sensor Mesh",
          author: "Riley M.",
          desc: "Community-powered sensor mesh with provable data lineage and token incentives.",
          tags: ["DePIN", "Edge AI", "Crypto"],
          stage: "mvp",
          funding: "Seeking $60k",
          likes: 67,
          comments: 23,
          views: 445,
          lookingFor: ["Blockchain developer", "Hardware engineer"],
        },
      ])
    }
  }, [tab])

  // Fetch ideas on component mount and tab change
  const loadIdeas = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (tab === "yours") {
        const ideas = await ideasAPI.fetchYourIdeas()
        setYourIdeas(ideas)
      } else {
        const ideas = await ideasAPI.fetchDiscoverIdeas()
        setDiscoverIdeas(ideas)
      }
    } catch (err) {
      setError("Failed to load ideas. Please try again.")
      console.error(err)
      // #TODO: Backend - Remove mock data once API is ready
      loadMockData()
    } finally {
      setIsLoading(false)
    }
  }, [tab, loadMockData])

  useEffect(() => {
    loadIdeas()
  }, [loadIdeas])

  const ideas = tab === "yours" ? yourIdeas : discoverIdeas
  const filtered = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(query.toLowerCase()) ||
      idea.desc.toLowerCase().includes(query.toLowerCase()) ||
      idea.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
  )

  async function handleIdeaSubmit(data: IdeaFormData) {
    try {
      const newIdea = await ideasAPI.createIdea(data)
      setYourIdeas((prev) => [newIdea, ...prev])
      setIsModalOpen(false)
    } catch (err) {
      console.error("Failed to create idea:", err)
      // #TODO: Backend - Add proper error handling/toast notification
      alert("Failed to create idea. Please try again.")
    }
  }

  async function handleIdeaUpdate(ideaData: IdeaFormData) {
    if (!editingIdea) return

    try {
      const updatedIdea = await ideasAPI.updateIdea(editingIdea.id, ideaData)
      setYourIdeas((prev) => prev.map((idea) => (idea.id === editingIdea.id ? updatedIdea : idea)))
      setEditingIdea(null)
      setIsModalOpen(false)
    } catch (err) {
      console.error("Failed to update idea:", err)
      // #TODO: Backend - Add proper error handling/toast notification
      alert("Failed to update idea. Please try again.")
    }
  }

  function handleModalSubmit(data: IdeaFormData) {
    if (editingIdea) {
      handleIdeaUpdate(data)
    } else {
      handleIdeaSubmit(data)
    }
  }

  async function handleModalDelete() {
    if (!editingIdea) return
    await handleIdeaDelete(editingIdea.id)
  }

  async function handleIdeaDelete(id: string) {
    try {
      await ideasAPI.deleteIdea(id)
      setYourIdeas((prev) => prev.filter((idea) => idea.id !== id))
      setEditingIdea(null)
      setIsModalOpen(false)
    } catch (err) {
      console.error("Failed to delete idea:", err)
      // #TODO: Backend - Add proper error handling/toast notification
      alert("Failed to delete idea. Please try again.")
    }
  }

  function handleEditClick(idea: Idea) {
    setEditingIdea(idea)
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setEditingIdea(null)
    setIsModalOpen(false)
  }

  function handleViewClick(idea: Idea) {
    if (idea.isYours) {
      // For your own ideas, just show them in the same view
      return
    } else {
      // For discover ideas, navigate to detail page
      router.push(`/founder/ideas/${idea.id}`)
    }
  }

  async function handleLikeIdea(ideaId: string) {
    try {
      await ideasAPI.likeIdea(ideaId)
      // Optimistically update UI
      const updateIdeas = (ideas: Idea[]) =>
        ideas.map((idea) => (idea.id === ideaId ? { ...idea, likes: idea.likes + 1 } : idea))

      if (tab === "yours") {
        setYourIdeas(updateIdeas)
      } else {
        setDiscoverIdeas(updateIdeas)
      }
    } catch (err) {
      console.error("Failed to like idea:", err)
      // #TODO: Backend - Add proper error handling
    }
  }

  function IdeaCard({ idea }: { idea: Idea }) {
    return (
      <Card className="bg-[#101113] border-[#1a1b1e] hover:bg-[#101113]/80 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-base leading-tight">{idea.title}</h3>
                {idea.isDraft && (
                  <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs">
                    Draft
                  </Badge>
                )}
              </div>
              <p className="text-xs text-white/60">by {idea.author}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs shrink-0",
                  idea.stage === "launched"
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                    : idea.stage === "mvp"
                      ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                      : idea.stage === "prototype"
                        ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/20"
                        : "bg-white/[0.04] text-white border-white/10",
                )}
              >
                {idea.stage.toUpperCase()}
              </Badge>
              {idea.isYours && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditClick(idea)}
                  className="h-7 w-7 text-white/60 hover:text-white"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          <p className="text-sm text-white/70 mb-3 line-clamp-3">{idea.desc}</p>

          <div className="flex flex-wrap gap-1 mb-3">
            {idea.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-white/[0.04] text-white border-white/10 text-xs">
                {tag}
              </Badge>
            ))}
            {idea.tags.length > 3 && (
              <Badge variant="secondary" className="bg-white/[0.04] text-white border-white/10 text-xs">
                +{idea.tags.length - 3}
              </Badge>
            )}
          </div>

          {idea.lookingFor && idea.lookingFor.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-white/60 mb-1">Looking for:</div>
              <div className="flex flex-wrap gap-1">
                {idea.lookingFor.slice(0, 2).map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="bg-white/[0.02] text-white/80 border-white/5 text-xs"
                  >
                    {item}
                  </Badge>
                ))}
                {idea.lookingFor.length > 2 && (
                  <Badge variant="secondary" className="bg-white/[0.02] text-white/80 border-white/5 text-xs">
                    +{idea.lookingFor.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {idea.funding && <div className="text-xs text-white/60 mb-3">{idea.funding}</div>}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-white/60">
              <button
                onClick={() => handleLikeIdea(idea.id)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Heart className="h-3.5 w-3.5" />
                {idea.likes}
              </button>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {idea.comments}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {idea.views}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => handleViewClick(idea)}
              className="h-7 text-xs border-[#1a1b1e] text-white hover:bg-white/[0.06] bg-transparent"
            >
              {idea.isYours ? "Share" : "View"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-[#101113] p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Ideas</h1>
            <p className="text-sm text-white/70 mt-1">Share your concepts and discover what others are building.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="rounded-md bg-white text-[#0b0b0c] hover:bg-white/90">
            <Plus className="mr-2 h-4 w-4" />
            Post new idea
          </Button>
        </div>
      </div>

      {/* Tabs and search */}
      <div className="rounded-xl bg-[#101113] p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex rounded-lg border border-[#1a1b1e] bg-[#0f1012] p-1">
            <button
              onClick={() => setTab("yours")}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition",
                tab === "yours" ? "bg-white text-[#0b0b0c]" : "text-white/80 hover:text-white",
              )}
            >
              Your ideas ({yourIdeas.length})
            </button>
            <button
              onClick={() => setTab("discover")}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition",
                tab === "discover" ? "bg-white text-[#0b0b0c]" : "text-white/80 hover:text-white",
              )}
            >
              Discover
            </button>
          </div>

          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Search ideas, tags, authors…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 bg-[#0f1012] border-[#1a1b1e] text-white placeholder:text-white/40"
              />
            </div>
            <Button variant="outline" className="border-[#1a1b1e] text-white hover:bg-white/[0.06] bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      ) : (
        <>
          {/* Ideas grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/60">No ideas found matching your search.</div>
            </div>
          )}
        </>
      )}

      {/* Post/Edit Idea Modal */}
      <PostIdeaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        onDelete={editingIdea ? handleModalDelete : undefined}
        editingIdea={editingIdea}
      />
    </div>
  )
}