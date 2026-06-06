"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { WaveLogo } from "@/components/mutiny-logo"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const valid = email.trim().length > 3 && password.length >= 6
  const { login, demoLogin } = useAuth()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid || loading) return
    setLoading(true)
    setError(null)
    try {
      await login(email.trim(), password)
      router.push("/founder")
    } catch (err: unknown) {
      setError("Invalid credentials or server error")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="relative w-full max-w-lg">
        <div className="relative rounded-2xl p-10 bg-white/5 border border-white/6 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-400">
          <div className="flex items-center gap-4 mb-6">
                <div className="p-1 rounded-md bg-transparent">
              <WaveLogo />
            </div>
          </div>

          <div className="border-t border-white/6 mt-2 mb-6" />

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm text-white/70">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              className="mt-3"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-white/70">Password</label>
              <Link href="/forgot" className="text-sm text-white/60 hover:underline">Forgot password?</Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-3"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

            <div>
              <Button type="submit" disabled={!valid || loading} className="w-full" size="lg">
                {loading ? "Signing in…" : "Sign in"}
              </Button>

              {process.env.NODE_ENV !== "production" && (
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      demoLogin()
                      router.push('/founder')
                    }}
                  >
                    Use demo account
                  </Button>
                </div>
              )}

              <div className="mt-4 text-center text-sm text-white/70">
                Not having an account? <Link href="/signup" className="text-white hover:underline">Create</Link>
              </div>
            </div>
        </form>
      </div>
    </div>
    </div>
  )
}
