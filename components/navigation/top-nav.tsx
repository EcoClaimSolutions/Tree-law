"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LoginModal } from "@/components/auth/login-modal"

interface TopNavProps {
  scenariosCount?: number
  onViewReport?: () => void
}

export function TopNav({ scenariosCount = 0, onViewReport }: TopNavProps) {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; name: string; avatar?: string } | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const response = await fetch("/api/auth/me")
      const data = await response.json()
      if (data.user) {
        const storedAvatar = localStorage.getItem(`avatar_${data.user.email}`)
        setUser({
          ...data.user,
          avatar: storedAvatar || data.user.avatar || "/professional-avatar.png",
        })
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/")
  }

  return (
    <>
      <div className="mb-2 flex justify-between items-center">
        <Link href="/" className="cursor-pointer flex-shrink-0">
          <Image
            src="/tree-law-logo.png"
            alt="Tree Law Logo"
            width={700}
            height={240}
            className="w-auto"
            style={{ height: "200px", objectFit: "contain" }}
          />
        </Link>

        <h1 className="text-2xl font-bold text-center flex-1 mx-4" style={{ color: "#003c46" }}>
          Tree Law's Subsidence Calculator<sup className="text-sm">®</sup>
        </h1>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/profile"
            className="px-4 py-2 text-sm font-semibold hover:underline transition-colors"
            style={{ color: "#003c46" }}
          >
            Reports
          </Link>
          {!user ? (
            <>
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2 text-white font-bold rounded-lg transition-all hover:scale-105 shadow-xl"
                style={{ backgroundColor: "#003c46" }}
              >
                Login
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/profile")} className="flex-shrink-0">
                <Image
                  src={user.avatar || "/professional-avatar.png"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full border-2 hover:opacity-80 transition-opacity cursor-pointer"
                  style={{ borderColor: "#6bb6c4" }}
                />
              </button>
            </>
          )}
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLoginSuccess={setUser} />
    </>
  )
}
