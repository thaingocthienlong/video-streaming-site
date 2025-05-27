// pages/_app.tsx
import { SessionProvider } from 'next-auth/react'
import CssBaseline from '@mui/material/CssBaseline'
import '@/styles/globals.css'

export default function App({ Component, pageProps: { session, ...rest } }) {
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
