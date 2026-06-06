"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, Shield, CreditCard, Trash2 } from "lucide-react"

export default function FounderSettingsPage() {
  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [fundingUpdates, setFundingUpdates] = useState(true)
  const [teamUpdates, setTeamUpdates] = useState(true)

  // Privacy
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [showEmail, setShowEmail] = useState(false)
  const [allowMessages, setAllowMessages] = useState(true)

  // Account
  const [email, setEmail] = useState("alex@edgevisionlabs.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  // Handler functions for backend integration
  const handleUpdateNotifications = async () => {
    // Backend: POST /api/settings/notifications
    const payload = {
      emailNotifications,
      pushNotifications,
      weeklyDigest,
      fundingUpdates,
      teamUpdates
    }
    console.log("Update notifications:", payload)
    // TODO: API call here
  }

  const handleUpdatePrivacy = async () => {
    // Backend: POST /api/settings/privacy
    const payload = {
      profileVisibility,
      showEmail,
      allowMessages
    }
    console.log("Update privacy:", payload)
    // TODO: API call here
  }

  const handleUpdateEmail = async () => {
    // Backend: POST /api/settings/email
    const payload = { email }
    console.log("Update email:", payload)
    // TODO: API call here
  }

  const handleUpdatePassword = async () => {
    // Backend: POST /api/settings/password
    const payload = {
      currentPassword,
      newPassword
    }
    console.log("Update password:", payload)
    // TODO: API call here
  }

  const handleDeleteAccount = async () => {
    // Backend: DELETE /api/settings/account
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      console.log("Delete account")
      // TODO: API call here
    }
  }

  return (
    <div className="mx-auto max-w-[800px] space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-[#101113] p-5" id="settings-header">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-white/60" />
          <div>
            <h1 className="text-xl font-semibold">Settings</h1>
            <p className="text-sm text-white/70 mt-1">Manage your account, notifications, and privacy.</p>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <Card className="bg-[#101113] border-[#1a1b1e]" id="notifications-section">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <SettingRow
            id="email-notifications"
            label="Email notifications"
            desc="Receive important updates via email."
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
          <SettingRow
            id="push-notifications"
            label="Push notifications"
            desc="Get notified about messages and updates."
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
          />
          <SettingRow
            id="weekly-digest"
            label="Weekly digest"
            desc="Summary of your activity and opportunities."
            checked={weeklyDigest}
            onCheckedChange={setWeeklyDigest}
          />
          <SettingRow
            id="funding-updates"
            label="Funding updates"
            desc="Notifications about funding milestones and releases."
            checked={fundingUpdates}
            onCheckedChange={setFundingUpdates}
          />
          <SettingRow
            id="team-updates"
            label="Team updates"
            desc="Messages and updates from team members."
            checked={teamUpdates}
            onCheckedChange={setTeamUpdates}
          />
          <Button
            onClick={handleUpdateNotifications}
            className="w-full bg-white/10 hover:bg-white/[0.15] text-white mt-2"
            id="save-notifications-btn"
          >
            Save notification preferences
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Section */}
      <Card className="bg-[#101113] border-[#1a1b1e]" id="privacy-section">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div className="text-sm font-medium">Profile visibility</div>
            <div className="flex gap-2" id="profile-visibility-group">
              {[
                { value: "public", label: "Public" },
                { value: "network", label: "Network only" },
                { value: "private", label: "Private" },
              ].map((option) => (
                <button
                  key={option.value}
                  id={`profile-visibility-${option.value}`}
                  onClick={() => setProfileVisibility(option.value)}
                  className={`text-xs rounded-md px-3 py-1.5 border transition ${
                    profileVisibility === option.value
                      ? "border-white/30 bg-white/[0.06]"
                      : "border-[#1a1b1e] text-white/80 hover:bg-white/[0.03]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="text-xs text-white/60">
              Public profiles can be found by anyone. Network only shows to verified users.
            </div>
          </div>

          <SettingRow
            id="show-email"
            label="Show email address"
            desc="Display your email on your public profile."
            checked={showEmail}
            onCheckedChange={setShowEmail}
          />
          <SettingRow
            id="allow-messages"
            label="Allow direct messages"
            desc="Let other users message you directly."
            checked={allowMessages}
            onCheckedChange={setAllowMessages}
          />
          <Button
            onClick={handleUpdatePrivacy}
            className="w-full bg-white/10 hover:bg-white/[0.15] text-white mt-2"
            id="save-privacy-btn"
          >
            Save privacy settings
          </Button>
        </CardContent>
      </Card>

      {/* Account Section */}
      <Card className="bg-[#101113] border-[#1a1b1e]" id="account-section">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-xs text-white/60" htmlFor="email-input">
              Email address
            </label>
            <div className="flex gap-2">
              <Input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0f1012] border-[#1a1b1e]"
              />
              <Button
                onClick={handleUpdateEmail}
                variant="outline"
                className="border-[#1a1b1e] text-white hover:bg-white/[0.06] bg-transparent"
                id="update-email-btn"
              >
                Update
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-white/60">Change password</label>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                id="current-password-input"
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-[#0f1012] border-[#1a1b1e]"
              />
              <Input
                id="new-password-input"
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[#0f1012] border-[#1a1b1e]"
              />
            </div>
            <Button
              onClick={handleUpdatePassword}
              variant="outline"
              className="w-fit border-[#1a1b1e] text-white hover:bg-white/[0.06] bg-transparent"
              disabled={!currentPassword || !newPassword}
              id="update-password-btn"
            >
              Update password
            </Button>
          </div>

          <div className="pt-2" id="account-status">
            <div className="text-sm font-medium mb-2">Account status</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
                Verified
              </Badge>
              <span className="text-xs text-white/60">• Joined December 2023</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-[#101113] border-red-500/20" id="danger-zone">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-red-300">
            <Trash2 className="h-4 w-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-md border border-red-500/20 bg-red-500/5 p-3">
            <div className="text-sm font-medium text-red-300">Delete account</div>
            <div className="text-xs text-white/60 mt-1">
              Permanently delete your account and all associated data. This cannot be undone.
            </div>
            <Button
              onClick={handleDeleteAccount}
              variant="outline"
              className="mt-3 border-red-500/30 text-red-300 hover:bg-red-500/10 bg-transparent"
              id="delete-account-btn"
            >
              Delete account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingRow({
  id,
  label,
  desc,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  desc?: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border border-[#1a1b1e] bg-[#0f1012] p-3" id={`${id}-row`}>
      <div className="min-w-0">
        <div className="font-medium text-sm">{label}</div>
        {desc && <div className="text-xs text-white/60">{desc}</div>}
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange} 
        aria-label={label}
        id={`${id}-switch`}
      />
    </div>
  )
}