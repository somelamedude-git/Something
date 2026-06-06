"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Pencil,
  MapPin,
  Linkedin,
  Twitter,
  Globe,
  Briefcase,
  GraduationCap,
  Sparkles,
  Loader2,
  AlertTriangle,
} from "lucide-react"

// API Base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// Types
interface Experience {
  role: string
  company: string
  duration: string
  description: string
}

interface Education {
  institution: string
  degree: string
  duration: string
}

interface ProfileData {
  name: string
  avatarUrl: string
  headline: string
  location: string
  isVerified: boolean
  about: string
  socials: {
    linkedin: string
    twitter: string
    website: string
  }
  skills: string[]
  experience: Experience[]
  education: Education[]
  interests: string[]
  profileCompletion: number
}

// API Service
const profileAPI = {
  async getProfile(): Promise<ProfileData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/founder/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching profile:", error)
      throw new Error("Failed to fetch profile data.")
    }
  },
  async updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
    try {
      const response = await axios.put(`${API_BASE_URL}/founder/profile`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error updating profile:", error)
      throw new Error("Failed to update profile data.")
    }
  },
}

export default function FounderProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await profileAPI.getProfile()
        setProfile(data)
      } catch (err) {
        setError("Could not load your profile. Please refresh the page.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfileData()
  }, [])

  const handleEdit = (section: string) => {
    alert(`Edit ${section} - implement your modal or page navigation here`)
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
        <p className="text-white/70">{error}</p>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-6 md:col-span-2">
        {/* Profile Header */}
        <Card className="bg-[#101113] border-[#1a1b1e]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-white/20">
                  <AvatarImage src={profile.avatarUrl} alt={`${profile.name} avatar`} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-white/80">{profile.headline}</p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-white/60">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-[#1a1b1e] text-white/80 hover:bg-white/10"
                aria-label="Edit profile header"
                onClick={() => handleEdit("Profile Header")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              {profile.isVerified && (
                <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20">Verified Founder</Badge>
              )}
              <div className="flex items-center gap-2">
                {profile.socials.linkedin && (
                  <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="icon" aria-label="LinkedIn profile">
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </a>
                )}
                {profile.socials.twitter && (
                  <a href={profile.socials.twitter} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="icon" aria-label="Twitter profile">
                      <Twitter className="h-5 w-5" />
                    </Button>
                  </a>
                )}
                {profile.socials.website && (
                  <a href={profile.socials.website} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="icon" aria-label="Website">
                      <Globe className="h-5 w-5" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        {profile.about && (
          <Card className="bg-[#101113] border-[#1a1b1e]">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>About</CardTitle>
              <Button variant="ghost" size="icon" aria-label="Edit about" onClick={() => handleEdit("About")}>
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">{profile.about}</p>
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {profile.skills.length > 0 && (
          <Card className="bg-[#101113] border-[#1a1b1e]">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Skills</CardTitle>
              <Button variant="ghost" size="icon" aria-label="Edit skills" onClick={() => handleEdit("Skills")}>
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-white/5 border-white/10">
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Experience */}
        {profile.experience.length > 0 && (
          <Card className="bg-[#101113] border-[#1a1b1e]">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" /> Experience
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit experience"
                onClick={() => handleEdit("Experience")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.experience.map((exp, i) => (
                <div key={i}>
                  <h3 className="font-semibold">{exp.role}</h3>
                  <p className="text-sm text-white/80">{exp.company}</p>
                  <p className="text-xs text-white/60">{exp.duration}</p>
                  <p className="mt-1 text-sm text-white/70">{exp.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Education */}
        {profile.education.length > 0 && (
          <Card className="bg-[#101113] border-[#1a1b1e]">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" /> Education
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit education"
                onClick={() => handleEdit("Education")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.education.map((edu, i) => (
                <div key={i}>
                  <h3 className="font-semibold">{edu.institution}</h3>
                  <p className="text-sm text-white/80">{edu.degree}</p>
                  <p className="text-xs text-white/60">{edu.duration}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Interests */}
        {profile.interests.length > 0 && (
          <Card className="bg-[#101113] border-[#1a1b1e]">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> Interests
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit interests"
                onClick={() => handleEdit("Interests")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="bg-white/5 border-white/10">
                  {interest}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Profile Completion */}
      <div className="space-y-6 md:col-span-1">
        <Card className="bg-[#101113] border-[#1a1b1e]">
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Complete your profile to attract more investors.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Progress value={profile.profileCompletion} className="w-full" />
              <span className="font-semibold">{profile.profileCompletion}%</span>
            </div>
            <Button className="mt-4 w-full bg-white text-black hover:bg-white/90">
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
