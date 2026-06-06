"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, X, Trash2 } from "lucide-react"

// Type Definitions
type Stage = "concept" | "prototype" | "mvp" | "launched"

interface IdeaFormData {
  title: string
  description: string
  stage: Stage
  lookingFor: string[]
  tags: string[]
  isDraft: boolean
}

interface Idea {
  id: string
  title: string
  description?: string
  desc?: string
  stage: Stage
  lookingFor?: string[]
  tags: string[]
  isDraft?: boolean
}

interface PostIdeaModalProps {
  trigger?: React.ReactNode
  isOpen?: boolean
  onClose?: () => void
  onSubmit: (data: IdeaFormData) => void
  onDelete?: () => void
  editingIdea?: Idea | null
}

interface StageOption {
  value: Stage
  label: string
}

const STAGE_OPTIONS: StageOption[] = [
  { value: "concept", label: "Concept" },
  { value: "prototype", label: "Prototype" },
  { value: "mvp", label: "MVP" },
  { value: "launched", label: "Launched" },
]

const SUGGESTED_ROLES: readonly string[] = [
  "Co-founder",
  "CTO",
  "Frontend Developer",
  "Backend Developer",
  "Full-stack Developer",
  "Mobile Developer",
  "UI/UX Designer",
  "Product Manager",
  "Marketing Lead",
  "Sales Lead",
  "Business Development",
  "Data Scientist",
  "ML Engineer",
  "DevOps Engineer",
  "QA Engineer",
  "Technical Writer",
  "Community Manager",
  "Growth Hacker",
  "Advisor",
  "Mentor",
  "Investor",
] as const

const SUGGESTED_TAGS: readonly string[] = [
  "AI/ML",
  "Web3",
  "Blockchain",
  "DeFi",
  "NFT",
  "FinTech",
  "HealthTech",
  "EdTech",
  "ClimaTech",
  "AgriTech",
  "PropTech",
  "E-commerce",
  "SaaS",
  "Mobile App",
  "Web App",
  "API",
  "Developer Tools",
  "Productivity",
  "Social",
  "Gaming",
  "VR/AR",
  "IoT",
  "Hardware",
  "Robotics",
  "Sustainability",
  "Privacy",
  "Security",
  "Open Source",
] as const

export function PostIdeaModal({
  trigger,
  isOpen: controlledOpen,
  onClose,
  onSubmit,
  onDelete,
  editingIdea,
}: PostIdeaModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [formData, setFormData] = useState<IdeaFormData>({
    title: "",
    description: "",
    stage: "concept",
    lookingFor: [],
    tags: [],
    isDraft: false,
  })
  const [newRole, setNewRole] = useState("")
  const [newTag, setNewTag] = useState("")

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const isEditing = !!editingIdea

  useEffect(() => {
    if (editingIdea) {
      setFormData({
        title: editingIdea.title || "",
        description: editingIdea.description || editingIdea.desc || "",
        stage: editingIdea.stage || "concept",
        lookingFor: editingIdea.lookingFor || [],
        tags: editingIdea.tags || [],
        isDraft: editingIdea.isDraft || false,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        stage: "concept",
        lookingFor: [],
        tags: [],
        isDraft: false,
      })
    }
  }, [editingIdea])

  const handleOpenChange = (open: boolean): void => {
    if (controlledOpen !== undefined) {
      if (!open && onClose) onClose()
    } else {
      setInternalOpen(open)
    }
  }

  const handleSubmit = (isDraft: boolean): void => {
    if (!formData.title.trim() || !formData.description.trim()) return

    onSubmit({
      ...formData,
      isDraft,
    })

    // Reset form
    setFormData({
      title: "",
      description: "",
      stage: "concept",
      lookingFor: [],
      tags: [],
      isDraft: false,
    })

    handleOpenChange(false)
  }

  const handleDelete = (): void => {
    if (editingIdea && onDelete) {
      onDelete()
      setShowDeleteDialog(false)
      handleOpenChange(false)
    }
  }

  const addRole = (role: string): void => {
    if (role.trim() && !formData.lookingFor.includes(role.trim())) {
      setFormData((prev) => ({
        ...prev,
        lookingFor: [...prev.lookingFor, role.trim()],
      }))
    }
    setNewRole("")
  }

  const removeRole = (role: string): void => {
    setFormData((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.filter((r) => r !== role),
    }))
  }

  const addTag = (tag: string): void => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }))
    }
    setNewTag("")
  }

  const removeTag = (tag: string): void => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void): void => {
    if (e.key === "Enter") {
      e.preventDefault()
      action()
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        {!trigger && controlledOpen === undefined && (
          <DialogTrigger asChild>
            <Button className="bg-white text-[#0b0b0c] hover:bg-white/90">
              <Plus className="mr-2 h-4 w-4" />
              Post new idea
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#101113] border-[#1a1b1e] text-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{isEditing ? "Edit Idea" : "Post New Idea"}</DialogTitle>
              {isEditing && onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="What's your idea called?"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="bg-[#1a1b1e] border-[#2a2b2e] text-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your idea, what problem it solves, and your vision..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="bg-[#1a1b1e] border-[#2a2b2e] text-white min-h-[120px]"
              />
            </div>

            {/* Stage */}
            <div className="space-y-2">
              <Label>Current Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(value: Stage) => setFormData((prev) => ({ ...prev, stage: value }))}
              >
                <SelectTrigger className="bg-[#1a1b1e] border-[#2a2b2e] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1b1e] border-[#2a2b2e] text-white">
                  {STAGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Looking For */}
            <div className="space-y-3">
              <Label>Looking For</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add role (e.g., Co-founder, Designer...)"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, () => addRole(newRole))}
                    className="bg-[#1a1b1e] border-[#2a2b2e] text-white"
                  />
                  <Button
                    type="button"
                    onClick={() => addRole(newRole)}
                    disabled={!newRole.trim()}
                    className="bg-white text-[#0b0b0c] hover:bg-white/90"
                  >
                    Add
                  </Button>
                </div>

                {/* Suggested roles */}
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {SUGGESTED_ROLES.filter((role) => !formData.lookingFor.includes(role))
                    .slice(0, 12)
                    .map((role) => (
                      <Button
                        key={role}
                        variant="outline"
                        size="sm"
                        onClick={() => addRole(role)}
                        className="h-7 text-xs border-[#2a2b2e] text-white/80 hover:bg-white/10"
                      >
                        {role}
                      </Button>
                    ))}
                </div>

                {/* Selected roles */}
                {formData.lookingFor.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.lookingFor.map((role) => (
                      <Badge key={role} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {role}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRole(role)}
                          className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag (e.g., AI/ML, Web3...)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, () => addTag(newTag))}
                    className="bg-[#1a1b1e] border-[#2a2b2e] text-white"
                  />
                  <Button
                    type="button"
                    onClick={() => addTag(newTag)}
                    disabled={!newTag.trim()}
                    className="bg-white text-[#0b0b0c] hover:bg-white/90"
                  >
                    Add
                  </Button>
                </div>

                {/* Suggested tags */}
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {SUGGESTED_TAGS.filter((tag) => !formData.tags.includes(tag))
                    .slice(0, 15)
                    .map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        onClick={() => addTag(tag)}
                        className="h-7 text-xs border-[#2a2b2e] text-white/80 hover:bg-white/10"
                      >
                        {tag}
                      </Button>
                    ))}
                </div>

                {/* Selected tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-[#2a2b2e] text-white">
                        {tag}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTag(tag)}
                          className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={!formData.title.trim() || !formData.description.trim()}
                className="flex-1 border-[#2a2b2e] text-white hover:bg-white/10"
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={!formData.title.trim() || !formData.description.trim()}
                className="flex-1 bg-white text-[#0b0b0c] hover:bg-white/90"
              >
                {isEditing ? "Save Changes" : "Post Idea"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#101113] border-[#1a1b1e] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Idea</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete this idea? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#2a2b2e] text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}