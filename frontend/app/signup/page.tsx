"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import apiClient from "@/lib/axios"
import { Input } from "@/components/ui/input"
import { WaveLogo } from "@/components/mutiny-logo"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [role, setRole] = useState("founder")
  const [experience, setExperience] = useState("")
  const [phone, setPhone] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [github, setGithub] = useState("")
  const [twitter, setTwitter] = useState("")
  const [firm, setFirm] = useState("")
  const [expertise, setExpertise] = useState<string[]>([])
  const [expertiseOther, setExpertiseOther] = useState("")
  const [newExpertise, setNewExpertise] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [interestsOther, setInterestsOther] = useState("")
  const [newInterest, setNewInterest] = useState("")
  const [age, setAge] = useState<number | "">("")
  const [occupation, setOccupation] = useState("")
  const [occupationOther, setOccupationOther] = useState("")
  const [terms, setTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())
  const passwordValid = password.length >= 8
  const passwordsMatch = password === confirm
  const ageValid = age === "" || (typeof age === "number" && age >= 13 && age <= 120)
  const occupationValid = occupation !== "" || occupationOther.trim().length > 0
  const roleSpecificValid = role === "founder" ? (expertise.length > 0 || expertiseOther.trim().length > 0) : true
  const formValid = emailValid && passwordValid && passwordsMatch && name.trim().length > 0 && terms && ageValid && occupationValid && roleSpecificValid

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formValid || loading) return
    setLoading(true)
    setError(null)
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        experience: experience || undefined,
        phone: phone || undefined,
        linkedin: linkedin || undefined,
        github: github || undefined,
        twitter: twitter || undefined,
        firm: role === "investor" && firm ? firm : undefined,
        expertise: role === "founder" ? (expertise.length ? expertise : expertiseOther ? [expertiseOther] : undefined) : undefined,
        interests: role === "investor" ? (interests.length ? interests : interestsOther ? [interestsOther] : undefined) : undefined,
        age: age === "" ? undefined : age,
        occupation: occupation !== "" ? occupation : occupationOther || undefined,
        accepted_terms: terms,
      }

      const res = await apiClient.post("/auth/signup", payload)
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token)
        // notify AuthProvider to refresh user state
        window.dispatchEvent(new Event("auth:login"))
      }
      router.push("/founder")
    } catch (err) {
      setError("Signup failed. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="relative w-full max-w-2xl z-10 bg-white/5 border border-white/6 rounded-lg p-8 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1 rounded-md bg-transparent"><WaveLogo /></div>
        </div>

        <div className="border-t border-white/6 mb-6" />

        {/* Decorative orb removed per design preference */}

          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70">Full name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="mt-2" />
              </div>
              <div>
                <label className="text-sm text-white/70">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-2 block w-full rounded-lg bg-white/6 border border-white/8 p-3 text-white h-12">
                  <option value="founder">Founder</option>
                  <option value="investor">Investor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" required className="mt-2" />
                {!emailValid && email.length > 0 && <p className="text-xs text-red-400">Please enter a valid email</p>}
              </div>
              <div>
                <label className="text-sm text-white/70">Phone (optional)</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 555 5555" className="mt-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required className="mt-2" />
                {!passwordValid && password.length > 0 && <p className="text-xs text-red-400">Password too short</p>}
              </div>
              <div>
                <label className="text-sm text-white/70">Confirm</label>
                <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" required className="mt-2" />
                {!passwordsMatch && confirm.length > 0 && <p className="text-xs text-red-400">Passwords do not match</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70">Experience</label>
                <select value={experience} onChange={(e) => setExperience(e.target.value)} className="mt-2 block w-full rounded-lg bg-white/6 border border-white/8 p-3 text-white h-12">
                  <option value="">Select…</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="founder">Founder</option>
                  <option value="executive">Executive</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-white/70">Age</label>
                <Input type="number" min={13} max={120} value={age === "" ? "" : String(age)} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 32" className="mt-2" />
                {!ageValid && <p className="text-xs text-red-400">Please enter a valid age (13–120)</p>}
              </div>
            </div>

            {/* Role specific fields */}
            {role === "founder" ? (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/70">Area of expertise (select all that apply)</label>
                <div className="mt-2 p-3 bg-black/20 border border-white/6 rounded-md">
                  <div className="grid grid-cols-3 gap-2">
                  {[
                    "Product",
                    "Engineering",
                    "Design",
                    "Growth/Marketing",
                    "Finance",
                    "Legal",
                    "Operations",
                    "Hardware",
                    "AI/ML",
                    "Other",
                  ].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-3 text-sm cursor-pointer py-1 px-2 rounded-sm hover:bg-white/6">
                      <Checkbox
                        checked={expertise.includes(opt)}
                        onCheckedChange={(v) => {
                          const checked = Boolean(v)
                          if (checked) setExpertise((s) => (s.includes(opt) ? s : [...s, opt]))
                          else setExpertise((s) => s.filter((x) => x !== opt))
                        }}
                      />
                      <span className="text-white font-medium select-none">{opt}</span>
                    </label>
                  ))}
                </div>
                {expertise.includes("Other") && (
                  <Input placeholder="Describe other expertise" value={expertiseOther} onChange={(e) => setExpertiseOther(e.target.value)} className="mt-2" />
                )}
              </div>

                {/* Add custom expertise */}
                <div className="mt-3">
                  <label className="sr-only">Add custom expertise</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add your own expertise"
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          const v = newExpertise.trim()
                          if (v && !expertise.map((s) => s.toLowerCase()).includes(v.toLowerCase())) {
                            setExpertise((s) => [...s, v])
                          }
                          setNewExpertise("")
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const v = newExpertise.trim()
                        if (v && !expertise.map((s) => s.toLowerCase()).includes(v.toLowerCase())) {
                          setExpertise((s) => [...s, v])
                        }
                        setNewExpertise("")
                      }}
                      className="px-3 py-2 rounded-md bg-white text-black text-sm"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {expertise.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-2 bg-white/6 text-white/90 rounded-full px-3 py-1 text-sm">
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => setExpertise((s) => s.filter((x) => x !== tag))}
                          className="text-xs text-white/60 hover:text-white"
                          aria-label={`Remove ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/70">Firm / Organization (optional)</label>
                <Input placeholder="Firm name" value={firm} onChange={(e) => setFirm(e.target.value)} className="mt-2" />

                <label className="text-sm text-white/70 mt-2">Area of interest (select all that apply)</label>
                <div className="mt-2 p-3 bg-black/20 border border-white/6 rounded-md">
                  <div className="grid grid-cols-3 gap-2">
                  {[
                    "Seed",
                    "Series A",
                    "Web3",
                    "AI/ML",
                    "Climate",
                    "Health",
                    "Fintech",
                    "Consumer",
                    "Other",
                  ].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-3 text-sm cursor-pointer py-1 px-2 rounded-sm hover:bg-white/6">
                      <Checkbox
                        checked={interests.includes(opt)}
                        onCheckedChange={(v) => {
                          const checked = Boolean(v)
                          if (checked) setInterests((s) => (s.includes(opt) ? s : [...s, opt]))
                          else setInterests((s) => s.filter((x) => x !== opt))
                        }}
                      />
                      <span className="text-white font-medium select-none">{opt}</span>
                    </label>
                  ))}
                </div>
                {interests.includes("Other") && (
                  <Input placeholder="Describe other interest" value={interestsOther} onChange={(e) => setInterestsOther(e.target.value)} className="mt-2" />
                )}
              </div>

                {/* Add custom interest */}
                <div className="mt-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add your own interest"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          const v = newInterest.trim()
                          if (v && !interests.map((s) => s.toLowerCase()).includes(v.toLowerCase())) {
                            setInterests((s) => [...s, v])
                          }
                          setNewInterest("")
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const v = newInterest.trim()
                        if (v && !interests.map((s) => s.toLowerCase()).includes(v.toLowerCase())) {
                          setInterests((s) => [...s, v])
                        }
                        setNewInterest("")
                      }}
                      className="px-3 py-2 rounded-md bg-white text-black text-sm"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {interests.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-2 bg-white/6 text-white/90 rounded-full px-3 py-1 text-sm">
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => setInterests((s) => s.filter((x) => x !== tag))}
                          className="text-xs text-white/60 hover:text-white"
                          aria-label={`Remove ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70">Current occupation</label>
                <select value={occupation} onChange={(e) => setOccupation(e.target.value)} className="mt-2 block w-full rounded-lg bg-white/6 border border-white/8 p-3 text-white h-12">
                  <option value="">Select…</option>
                  <option value="student">Student</option>
                  <option value="software_engineer">Software Engineer</option>
                  <option value="product_manager">Product Manager</option>
                  <option value="designer">Designer</option>
                  <option value="data_scientist">Data Scientist</option>
                  <option value="business_owner">Business Owner</option>
                  <option value="researcher">Researcher</option>
                  <option value="executive">Executive</option>
                  <option value="other">Other</option>
                </select>
                {occupation === "other" && <Input placeholder="Describe occupation" value={occupationOther} onChange={(e) => setOccupationOther(e.target.value)} className="mt-2" />}
              </div>

              <div>
                <label className="text-sm text-white/70">LinkedIn (optional)</label>
                <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/your-profile" className="mt-2" />
                <label className="text-sm text-white/70 mt-2">GitHub (optional)</label>
                <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/your-profile" className="mt-2" />
              </div>
            </div>

            <div>
              <label className="text-sm text-white/70">Twitter (optional)</label>
              <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/your-handle" className="mt-2" />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Checkbox checked={terms} onCheckedChange={(v) => setTerms(Boolean(v))} />
              <label className="text-sm text-white/70">I agree to the <a href="/terms" className="underline">Terms & Conditions</a></label>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex items-center justify-between gap-4">
              <Button type="submit" size="lg" disabled={!formValid || loading} className="flex-1">
                {loading ? "Creating…" : "Create account"}
              </Button>
              <button type="button" onClick={() => {
                setEmail(""); setName(""); setPassword(""); setConfirm(""); setExperience(""); setPhone(""); setLinkedin(""); setGithub(""); setTwitter(""); setFirm(""); setExpertise([]); setInterests([]); setAge(""); setOccupation(""); setTerms(false)
              }} className="text-sm text-white/70 hover:text-white">
                Reset
              </button>
            </div>
          </form>
      </div>
    </div>

  )
}
