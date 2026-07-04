import { cookies } from "next/headers"
import { getIronSession } from "iron-session"

export interface SessionData {
  adminId?: string
  email?: string
  isLoggedIn?: boolean
}

const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required")
}

const sessionOptions = {
  password: SESSION_SECRET,
  cookieName: "deeray-admin",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24,
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  return session
}
