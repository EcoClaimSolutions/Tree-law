import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "tree-law-secret-key-change-in-production")
const USERS = [
  {
    email: "therman@ecoclaim.ca",
    password: "Jakarta3",
    name: "Tom Herman",
    avatar: "/professional-avatar.png",
  },
]

export async function createToken(email: string) {
  return await new SignJWT({ email }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(SECRET_KEY)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload
  } catch {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  if (!token) return null
  return await verifyToken(token)
}

export async function login(email: string, password: string) {
  const user = USERS.find((u) => u.email === email && u.password === password)
  if (!user) return null
  return user
}

export function getUserByEmail(email: string) {
  return USERS.find((u) => u.email === email)
}

export function updateUserProfile(email: string, updates: { name?: string; email?: string; avatar?: string }) {
  const user = USERS.find((u) => u.email === email)
  if (!user) return null

  if (updates.name) user.name = updates.name
  if (updates.email) user.email = updates.email
  if (updates.avatar) user.avatar = updates.avatar

  return user
}
