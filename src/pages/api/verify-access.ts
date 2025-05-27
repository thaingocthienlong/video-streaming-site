// pages/api/verify-access.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import allowed from '../../../data/allowed_emails.json'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // <-- getServerSession reads the cookie on req/res
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const email = session.user.email
  const { code } = req.body as { code?: string }

  if (!code || !allowed[code]) {
    return res.status(401).json({ error: 'Invalid course code' })
  }
  if (!allowed[code].includes(email)) {
    return res.status(401).json({ error: 'Access denied' })
  }

  res.status(200).json({ ok: true })
}
