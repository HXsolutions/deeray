import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import type { SessionOptions } from "iron-session"

export interface SessionData {
  adminId?: string
  email?: string
  isLoggedIn?: boolean
}

function getSessionOptions(): SessionOptions {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error("SESSION_SECRET environment variable is required")
  return {
    password: secret,
    cookieName: "deeray-admin",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict" as const,
      maxAge: 60 * 60 * 24,
    },
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, getSessionOptions())
  return session
}
