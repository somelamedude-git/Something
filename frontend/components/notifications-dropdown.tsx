"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell, Check, Loader2 } from "lucide-react"
import { Badge } from "./ui/badge"

// #TODO: Backend - Update this with your actual API base URL
const API_BASE_URL = "#"

interface Notification {
  id: string
  text: string
  read: boolean
}

// API Service Layer
const notificationsAPI = {
  // #TODO: Backend - GET /api/notifications - Fetch user's notifications
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching notifications:", error)
      // Return empty array on error to prevent crashing
      return []
    }
  },

  // #TODO: Backend - POST /api/notifications/mark-all-read - Mark all as read
  async markAllAsRead(): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/notifications/mark-all-read`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
    } catch (error) {
      console.error("Error marking notifications as read:", error)
      throw new Error("Failed to mark notifications as read.")
    }
  },
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    setIsLoading(true)
    const data = await notificationsAPI.getNotifications()
    setNotifications(data)
    setIsLoading(false)
  }

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (error) {
      // Optionally show a toast notification on failure
      console.error(error)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative border-[#1a1b1e] text-white/80 hover:bg-white/10"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-[#101113] border-[#1a1b1e] text-white">
        <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-white/60" />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-2 focus:bg-white/10">
              <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${notification.read ? "bg-transparent" : "bg-white"}`} />
              <span className="flex-1 text-sm text-white/90">{notification.text}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <p className="p-4 text-center text-sm text-white/70">No new notifications.</p>
        )}
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          className="flex items-center justify-center gap-2 p-2 text-sm text-white/70 focus:bg-white/10 focus:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="h-4 w-4" /> Mark all as read
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}