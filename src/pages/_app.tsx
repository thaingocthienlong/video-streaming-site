// pages/_app.tsx
import { SessionProvider } from 'next-auth/react'
import CssBaseline from '@mui/material/CssBaseline'
import '@/styles/globals.css'

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const { session, ...rest } = pageProps as any;
  return (
   <>
     <CssBaseline />
      <SessionProvider session={session}>
        <div className="min-h-screen flex flex-col">
          {/* … your header / main / footer … */}
          <Component {...rest} />
        </div>
      </SessionProvider>
   </>
  )
}
