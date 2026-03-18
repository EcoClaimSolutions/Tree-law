import { type NextRequest, NextResponse } from "next/server"
import { getSession, updateUserProfile } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { name, email, avatar } = body

  const updatedUser = updateUserProfile(session.email as string, { name, email, avatar })

  if (!updatedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ user: updatedUser })
}
