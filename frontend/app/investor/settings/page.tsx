"use client"

import { useState } from "react"
import { useAvatar } from "@/components/avatar-context"
import { AvatarUploader } from "@/components/avatar-uploader"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Bell, Shield, CreditCard, Trash2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "notifications" | "privacy" | "account" | "danger"

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "notifications", label: "Notifications",    icon: Bell       },
  { key: "privacy",       label: "Privacy",          icon: Shield     },
  { key: "account",       label: "Account",          icon: CreditCard },
  { key: "danger",        label: "Danger Zone",      icon: Trash2     },
]

export default function InvestorSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("notifications")
  const { avatarUrl, setAvatarUrl, userName, setUserName } = useAvatar()

  const uploadAvatar = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("avatar", file)
      const response = await axios.post<{ url: string }>("#/api/investor/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setAvatarUrl(response.data.url)
    } catch (err) {
      console.error("Error uploading avatar:", err)
    }
  }

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications,  setPushNotifications]  = useState(true)
  const [weeklyDigest,       setWeeklyDigest]        = useState(true)
  const [fundingUpdates,     setFundingUpdates]      = useState(true)
  const [teamUpdates,        setTeamUpdates]         = useState(true)

  // Privacy state
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [showEmail,         setShowEmail]         = useState(false)
  const [allowMessages,     setAllowMessages]     = useState(true)

  // Account state
  const [email,           setEmail]           = useState("alex@edgevisionlabs.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword,     setNewPassword]     = useState("")

  const handleUpdateNotifications = () => {
    console.log("Update notifications:", { emailNotifications, pushNotifications, weeklyDigest, fundingUpdates, teamUpdates })
  }
  const handleUpdatePrivacy = () => {
    console.log("Update privacy:", { profileVisibility, showEmail, allowMessages })
  }
  const handleUpdateEmail = () => {
    console.log("Update email:", { email })
  }
  const handleUpdatePassword = () => {
    console.log("Update password:", { currentPassword, newPassword })
  }
  const handleDeleteAccount = () => {
    if (confirm("Are you sure? This cannot be undone.")) {
      console.log("Delete account")
    }
  }

  return (
    <div className="mx-auto max-w-[900px] pb-16">
      {/* Page header */}
      <div className="space-y-1 pt-2 mb-10">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-accent)" }} />
          Investor Settings
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-foreground leading-tight">
          Preferences
        </h1>
        <p className="text-sm text-muted-foreground font-sans max-w-lg mt-1">
          Control your notifications, privacy, and account details.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Left sidebar tabs */}
        <div className="w-48 shrink-0 space-y-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              id={`tab-${key}`}
              onClick={() => setActiveTab(key)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg text-left transition-all",
                activeTab === key
                  ? "bg-accent font-medium text-foreground"
                  : "text-foreground/50 hover:text-foreground hover:bg-accent/50",
                key === "danger" && activeTab === key && "text-rose-500",
                key === "danger" && activeTab !== key && "text-rose-500/50 hover:text-rose-500"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {label}
              {activeTab === key && (
                <ChevronRight className="h-3 w-3 ml-auto text-muted-foreground" />
              )}
            </button>
          ))}
        </div>

        {/* Right content panel */}
        <div className="flex-1 min-w-0 space-y-8">

          {/* ── Notifications ── */}
          {activeTab === "notifications" && (
            <div className="space-y-6" id="notifications-section">
              <SectionTitle
                icon={Bell}
                title="Notification Preferences"
                desc="Choose what you want to hear about and how."
              />
              <div className="space-y-0 border border-border rounded-xl overflow-hidden">
                <SettingRow
                  id="email-notifications"
                  label="Email notifications"
                  desc="Receive important updates via email"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
                <SettingRow
                  id="push-notifications"
                  label="Push notifications"
                  desc="Get notified about messages and updates"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
                <SettingRow
                  id="weekly-digest"
                  label="Weekly digest"
                  desc="Summary of your activity and opportunities"
                  checked={weeklyDigest}
                  onCheckedChange={setWeeklyDigest}
                />
                <SettingRow
                  id="funding-updates"
                  label="Funding updates"
                  desc="Milestone events and capital release alerts"
                  checked={fundingUpdates}
                  onCheckedChange={setFundingUpdates}
                />
                <SettingRow
                  id="team-updates"
                  label="Team updates"
                  desc="Messages and updates from portfolio teams"
                  checked={teamUpdates}
                  onCheckedChange={setTeamUpdates}
                  last
                />
              </div>
              <Button
                onClick={handleUpdateNotifications}
                className="bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-sm font-medium"
                id="save-notifications-btn"
              >
                Save preferences
              </Button>
            </div>
          )}

          {/* ── Privacy ── */}
          {activeTab === "privacy" && (
            <div className="space-y-6" id="privacy-section">
              <SectionTitle
                icon={Shield}
                title="Privacy Settings"
                desc="Control who can see your profile and contact you."
              />

              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Profile visibility</p>
                <div className="flex gap-2" id="profile-visibility-group">
                  {[
                    { value: "public",  label: "Public"       },
                    { value: "network", label: "Network only" },
                    { value: "private", label: "Private"      },
                  ].map(option => (
                    <button
                      key={option.value}
                      id={`profile-visibility-${option.value}`}
                      onClick={() => setProfileVisibility(option.value)}
                      className={cn(
                        "text-xs rounded-full px-4 py-2 border transition-all font-medium",
                        profileVisibility === option.value
                          ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]/10 text-foreground"
                          : "border-border/60 text-foreground/50 hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">Public profiles are discoverable by all users.</p>
              </div>

              <div className="border border-border rounded-xl overflow-hidden">
                <SettingRow
                  id="show-email"
                  label="Show email address"
                  desc="Display your email on your public profile"
                  checked={showEmail}
                  onCheckedChange={setShowEmail}
                />
                <SettingRow
                  id="allow-messages"
                  label="Allow direct messages"
                  desc="Let other verified users contact you"
                  checked={allowMessages}
                  onCheckedChange={setAllowMessages}
                  last
                />
              </div>

              <Button
                onClick={handleUpdatePrivacy}
                className="bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-sm font-medium"
                id="save-privacy-btn"
              >
                Save privacy settings
              </Button>
            </div>
          )}

          {/* ── Account ── */}
          {activeTab === "account" && (
            <div className="space-y-8" id="account-section">
              <SectionTitle
                icon={CreditCard}
                title="Account Details"
                desc="Update your email address and change your password."
              />
              <div className="space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Profile photo</p>
                <div className="p-4 rounded-xl border border-border/60 bg-accent/20 flex items-center justify-between">
                  <AvatarUploader
                    name={userName}
                    src={avatarUrl}
                    onChange={(file, url) => {
                      if (file) uploadAvatar(file)
                      else setAvatarUrl(url)
                    }}
                    size={64}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Investor Name</p>
                <Input
                  id="username-input"
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="bg-accent/30 border-border/60 text-foreground"
                />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Email address</p>
                <div className="flex gap-2">
                  <Input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-accent/30 border-border/60 text-foreground"
                  />
                  <Button
                    onClick={handleUpdateEmail}
                    variant="outline"
                    className="border-border/60 text-foreground/60 hover:bg-accent hover:text-foreground bg-transparent shrink-0"
                    id="update-email-btn"
                  >
                    Update
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Change password</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    id="current-password-input"
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="bg-accent/30 border-border/60 text-foreground"
                  />
                  <Input
                    id="new-password-input"
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="bg-accent/30 border-border/60 text-foreground"
                  />
                </div>
                <Button
                  onClick={handleUpdatePassword}
                  variant="outline"
                  className="border-border/60 text-foreground/60 hover:bg-accent hover:text-foreground bg-transparent"
                  disabled={!currentPassword || !newPassword}
                  id="update-password-btn"
                >
                  Update password
                </Button>
              </div>

              <div className="pt-2 border-t border-border" id="account-status">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Account status</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-mono">
                    Verified
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">· Joined December 2023</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Danger Zone ── */}
          {activeTab === "danger" && (
            <div className="space-y-6" id="danger-zone">
              <SectionTitle
                icon={Trash2}
                title="Danger Zone"
                desc="Irreversible and destructive account actions."
                danger
              />
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-3">
                <p className="text-sm font-medium text-rose-500">Delete account</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Permanently delete your account and all associated data — portfolio records, conversations, and settings. This action cannot be undone.
                </p>
                <Button
                  onClick={handleDeleteAccount}
                  variant="outline"
                  className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10 bg-transparent"
                  id="delete-account-btn"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete account
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Section title ────────────────────────────────────────────────────────────
function SectionTitle({
  icon: Icon,
  title,
  desc,
  danger = false,
}: {
  icon: React.ElementType
  title: string
  desc: string
  danger?: boolean
}) {
  return (
    <div className="space-y-0.5 pb-2 border-b border-border">
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", danger ? "text-rose-500" : "text-muted-foreground")} />
        <h2 className={cn("text-base font-semibold tracking-tight", danger && "text-rose-500")}>{title}</h2>
      </div>
      <p className="text-xs text-muted-foreground font-mono pl-6">{desc}</p>
    </div>
  )
}

// ── Setting row ──────────────────────────────────────────────────────────────
function SettingRow({
  id,
  label,
  desc,
  checked,
  onCheckedChange,
  last = false,
}: {
  id: string
  label: string
  desc?: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  last?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 px-4 py-4 hover:bg-accent/20 transition-colors",
        !last && "border-b border-border/60"
      )}
      id={`${id}-row`}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{label}</div>
        {desc && <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">{desc}</div>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
        id={`${id}-switch`}
        className="shrink-0"
      />
    </div>
  )
}