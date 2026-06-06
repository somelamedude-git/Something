"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import apiClient from "@/lib/axios"

type User = { id?: string; name?: string; email?: string; demo?: boolean } | null

type AuthContextShape = {
  user: User
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  demoLogin: () => void
}

const AuthContext = createContext<AuthContextShape | undefined>(undefined)

export function useAuth() {
  const c = useContext(AuthContext)
  if (!c) throw new Error("useAuth must be used within AuthProvider")
  return c
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await apiClient.get("/auth/me")
        setUser(res.data || null)
      } catch (err) {
        console.warn("Auth check failed", err)
        localStorage.removeItem("token")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    init()
    // Listen for cross-component login events (signup or demo) so we can revalidate
    const handler = () => {
      ;(async () => {
        setLoading(true)
        try {
          const res = await apiClient.get("/auth/me")
          setUser(res.data || null)
        } catch (err) {
          setUser(null)
        } finally {
          setLoading(false)
        }
      })()
    }
    window.addEventListener("auth:login", handler)

    return () => {
      window.removeEventListener("auth:login", handler)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await apiClient.post("/auth/login", { email, password })
    if (res?.data?.token) {
      localStorage.setItem("token", res.data.token)
      const me = await apiClient.get("/auth/me")
      setUser(me.data || null)
    } else {
      throw new Error("No token returned from login")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    // optional: tell server to logout if endpoint exists
  }

  const demoLogin = () => {
    // Only enable demo behavior in non-production
    if (process.env.NODE_ENV === "production") return
    const demoToken = "demo-token"
    localStorage.setItem("token", demoToken)
    setUser({ name: "Demo User", email: "demo@mutiny.local", demo: true })
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, demoLogin }}>{children}</AuthContext.Provider>
}

export default AuthContext
