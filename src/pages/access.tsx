// pages/access.tsx
import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  Stack,
  IconButton,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import GoogleIcon from '@mui/icons-material/Google'

export default function AccessPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/verify-access', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.toUpperCase() }),
    })
    if (res.ok) {
      router.push(`/course/${code.toUpperCase()}`)
    } else {
      const body = await res.json()
      setError(body.error ?? 'Access denied')
    }
  }

  // If not signed in, show login modal just like landing
  if (status === 'loading') return null
  if (!session) {
    return (
      <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <AppBar position="absolute" color="transparent" elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.7)' }}>
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <Button color="inherit" onClick={() => signIn('google', { callbackUrl: '/access' })}>
              <GoogleIcon sx={{ mr: 1 }} /> Login
            </Button>
          </Toolbar>
        </AppBar>
        {/* Hero background only */}
        <Box
          sx={{
            height: '100%',
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1900&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* AppBar with email + logout */}
      <AppBar position="absolute" color="transparent" elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.7)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography color="white">{session.user?.email}</Typography>
          <IconButton color="error" onClick={() => signOut()}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Hero background */}
      <Box
        sx={{
          height: '100%',
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1900&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Semi-transparent form overlay */}
      <Box
        component="form"
        onSubmit={handleAccess}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'rgba(255,255,255,0.85)',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" textAlign="center">
            Enter Course Code
          </Typography>
          <TextField
            label="Course Code"
            variant="outlined"
            fullWidth
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <Button type="submit" variant="contained" fullWidth>
            Access Course
          </Button>
          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  )
}
