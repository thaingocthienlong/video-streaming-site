// pages/api/verify-access.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import rawAllowed from '../../../data/allowed_emails.json'

// Treat our JSON import as a generic map from string→string[]
const allowed = rawAllowed as Record<string, string[]>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // 1) Validate session
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  const email = session.user.email

  // 2) Extract & validate code
  const { code } = req.body as { code?: string }
  if (!code) {
    return res.status(401).json({ error: 'Missing course code' })
  }

  // 3) Safely look up the allowed list
  const allowedList = allowed[code]
  if (!allowedList) {
    return res.status(401).json({ error: 'Invalid course code' })
  }

  // 4) Check if this email is in that list
  if (!allowedList.includes(email)) {
    return res.status(401).json({ error: 'Access denied' })
  }

  // 5) All good!
  res.status(200).json({ ok: true })
}
