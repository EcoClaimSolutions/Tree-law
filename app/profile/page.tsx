"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Upload, Trash2, Eye } from "lucide-react"
import { TopNav } from "@/components/navigation/top-nav"
import type { SavedCalculation } from "@/lib/calculator"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; name: string; avatar?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", avatar: "" })
  const [saving, setSaving] = useState(false)
  const [reports, setReports] = useState<SavedCalculation[]>([])
  const [loadingReports, setLoadingReports] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const response = await fetch("/api/auth/me")
      const data = await response.json()

      if (!data.user) {
        router.push("/")
        return
      }

      const storedAvatar = localStorage.getItem(`avatar_${data.user.email}`)
      const userWithAvatar = {
        ...data.user,
        avatar: storedAvatar || data.user.avatar || "/professional-avatar.png",
      }

      setUser(userWithAvatar)
      setFormData({
        name: userWithAvatar.name,
        email: userWithAvatar.email,
        avatar: userWithAvatar.avatar,
      })
      setLoading(false)

      await loadReports()
    }

    checkAuth()
  }, [router])

  const loadReports = async () => {
    try {
      const response = await fetch("/api/reports/list")
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
      }
    } catch (error) {
      console.error("Error loading reports:", error)
    } finally {
      setLoadingReports(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()

        if (formData.avatar) {
          localStorage.setItem(`avatar_${data.user.email}`, formData.avatar)
        }

        const updatedUser = {
          ...data.user,
          avatar: formData.avatar,
        }

        setUser(updatedUser)
        setFormData({
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
        })
        setIsEditing(false)
        router.push("/")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const newAvatar = reader.result as string
      setFormData((prev) => ({ ...prev, avatar: newAvatar }))
      setUser((prev) => (prev ? { ...prev, avatar: newAvatar } : null))
    }
    reader.readAsDataURL(file)
  }

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return

    try {
      const response = await fetch("/api/reports/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId }),
      })

      if (response.ok) {
        setReports((prev) => prev.filter((r) => r.id !== reportId))
      }
    } catch (error) {
      alert("Error deleting report")
    }
  }

  const handleViewReport = (reportId: string) => {
    router.push(`/report/${reportId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#9bfee9" }}>
        <p className="text-xl" style={{ color: "#003c46" }}>
          Loading...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#9bfee9" }}>
      <div className="max-w-4xl mx-auto">
        <TopNav />

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6" style={{ color: "#003c46" }}>
            My Profile
          </h1>

          <div className="flex items-start gap-8 mb-8">
            <div className="flex-shrink-0">
              <div className="relative">
                <Image
                  key={formData.avatar}
                  src={formData.avatar || user?.avatar || "/professional-avatar.png"}
                  alt="Profile Avatar"
                  width={100}
                  height={100}
                  className="rounded-full border-4"
                  style={{ borderColor: "#6bb6c4" }}
                />
                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-60 transition-all"
                  >
                    <Upload className="text-white" size={24} />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {!isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-lg font-semibold" style={{ color: "#003c46" }}>
                      {user?.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-lg font-semibold" style={{ color: "#003c46" }}>
                      {user?.email}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-2"
                      style={{ borderColor: "#6bb6c4" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-2"
                      style={{ borderColor: "#6bb6c4" }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 font-semibold rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: "#ffbe0b", color: "#003c46" }}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-2 font-semibold rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: "#6bb6c4", color: "white" }}
                >
                  Back to Calculator
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 font-semibold rounded-lg border-2 transition-all hover:bg-gray-100"
                  style={{ borderColor: "#003c46", color: "#003c46" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2 font-semibold rounded-lg transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#6bb6c4", color: "white" }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      name: user?.name || "",
                      email: user?.email || "",
                      avatar: user?.avatar || "/professional-avatar.png",
                    })
                  }}
                  className="px-6 py-2 font-semibold rounded-lg border-2 transition-all hover:bg-gray-100"
                  style={{ borderColor: "#003c46", color: "#003c46" }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mt-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#003c46" }}>
            Saved Reports
          </h2>

          {loadingReports ? (
            <p className="text-gray-600">Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="text-gray-600">No saved reports yet. Create a calculation and save it to see it here.</p>
          ) : (
            <div className="space-y-4">
              {reports
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#6bb6c4" }}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg" style={{ color: "#003c46" }}>
                        {report.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(report.timestamp).toLocaleDateString()} at{" "}
                        {new Date(report.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {report.scenarios.length} scenario{report.scenarios.length !== 1 ? "s" : ""} •{" "}
                        {report.scenarios.reduce((sum, s) => sum + s.co2Tonnes, 0).toFixed(2)} kg CO₂e
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewReport(report.id)}
                        className="p-2 rounded-lg transition-all hover:bg-gray-200"
                        title="View Report"
                      >
                        <Eye size={20} style={{ color: "#003c46" }} />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-2 rounded-lg transition-all hover:bg-red-100"
                        title="Delete Report"
                      >
                        <Trash2 size={20} style={{ color: "#dc2626" }} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
