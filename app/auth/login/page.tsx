'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    const res = await fetch('/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
    } else {
      router.push('/')
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Connexion CampusUL</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: '0.5rem 1rem', backgroundColor: '#006400', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </div>
  )
}