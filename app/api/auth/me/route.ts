import { NextResponse } from "next/server"
import { getSession, getUserByEmail } from "@/lib/auth"

export async function GET() {
  const session = await getSession()

  if (!session || typeof session.email !== "string") {
    return NextResponse.json({ user: null })
  }

  const user = getUserByEmail(session.email)
  if (!user) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({ user: { email: user.email, name: user.name, avatar: user.avatar } })
}
