"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, MessageSquare, Heart, Loader2, AlertTriangle } from "lucide-react"

// Backend API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

type Stage = "concept" | "prototype" | "mvp" | "launched"

interface Idea {
  id: string
  title: string
  author: string
  authorAvatar: string
  authorHeadline: string
  stage: Stage
  tags: string[]
  description: string
  lookingFor: string[]
  likes: number
  commentsCount: number
}

interface Comment {
  id: string
  author: string
  authorAvatar: string
  text: string
  timestamp: string
}

// API Service Layer
const ideaAPI = {
  async getIdeaDetails(id: string): Promise<Idea> {
    const response = await axios.get(`${API_BASE_URL}/ideas/${id}`)
    return response.data
  },

  async getIdeaComments(id: string): Promise<Comment[]> {
    const response = await axios.get(`${API_BASE_URL}/ideas/${id}/comments`)
    return response.data
  },

  async likeIdea(id: string): Promise<Idea> {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("User not authenticated")
    const response = await axios.post(
      `${API_BASE_URL}/ideas/${id}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },
}

export default function IdeaDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [idea, setIdea] = useState<Idea | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [ideaData, commentsData] = await Promise.all([
          ideaAPI.getIdeaDetails(id),
          ideaAPI.getIdeaComments(id),
        ])
        setIdea(ideaData)
        setComments(commentsData)
      } catch (err) {
        setError("Could not load the idea. It might not exist or there was a network error.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleLike = async () => {
    if (!idea || isLiking) return
    setIsLiking(true)
    try {
      const updatedIdea = await ideaAPI.likeIdea(idea.id)
      setIdea(updatedIdea)
    } catch (err) {
      console.error("Failed to like the idea:", err)
    } finally {
      setIsLiking(false)
    }
  }

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
        <p className="text-white/70 mb-4">{error}</p>
        <Button onClick={() => router.back()} variant="outline" className="border-white/20">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  if (!idea) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Button onClick={() => router.back()} variant="ghost" className="mb-4 text-white/80 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to ideas
        </Button>
      </div>

      {/* Idea Card */}
      <div className="rounded-xl bg-[#101113] border border-[#1a1b1e]">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-semibold">{idea.title}</h1>
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs"
            >
              {idea.stage.toUpperCase()}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {idea.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-white/[0.04] text-white border-white/10 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-white/80 whitespace-pre-line">{idea.description}</p>
        </div>

        <div className="border-t border-[#1a1b1e] p-6">
          <h3 className="font-semibold mb-3">Looking For</h3>
          <div className="flex flex-wrap gap-2">
            {idea.lookingFor.map((item) => (
              <Badge key={item} variant="outline" className="text-sm border-white/20">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Author & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-[#101113] border-[#1a1b1e]">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Author</h3>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={idea.authorAvatar} />
                <AvatarFallback>{idea.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{idea.author}</p>
                <p className="text-xs text-white/60">{idea.authorHeadline}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-[#101113] border-[#1a1b1e]">
          <CardContent className="p-4 flex items-center justify-around">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleLike}
                variant="outline"
                className="border-white/20"
                disabled={isLiking}
              >
                <Heart className="mr-2 h-4 w-4" /> Like ({idea.likes})
              </Button>
              <Button variant="outline" className="border-white/20">
                <MessageSquare className="mr-2 h-4 w-4" /> Comment ({idea.commentsCount})
              </Button>
            </div>
            <Button className="bg-white text-black hover:bg-white/90">Collaborate</Button>
          </CardContent>
        </Card>
      </div>

      {/* Comments Section */}
      <div className="rounded-xl bg-[#101113] border border-[#1a1b1e] p-6">
        <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.authorAvatar} />
                  <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="bg-[#0a0b0c] border border-[#1a1b1e] rounded-lg px-3 py-2 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm">{comment.author}</p>
                    <p className="text-xs text-white/50">{comment.timestamp}</p>
                  </div>
                  <p className="text-sm text-white/80">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/60 text-center py-4">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
