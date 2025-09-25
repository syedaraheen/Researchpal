'use client'
import { useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'signup') {
        const r = await fetch(`/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        const data = await r.json()
        if (!r.ok) throw new Error(data.detail || 'Signup failed')
        localStorage.setItem('token', data.access_token)
        window.location.href = '/dashboard'
      } else {
        const form = new URLSearchParams()
        form.set('username', email)
        form.set('password', password)
        const r = await fetch(`/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: form.toString()
        })
        const data = await r.json()
        if (!r.ok) throw new Error(data.detail || 'Login failed')
        localStorage.setItem('token', data.access_token)
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <main className="max-w-md mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-6">{mode === 'login' ? 'Login' : 'Signup'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full rounded bg-slate-800 px-4 py-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full rounded bg-slate-800 px-4 py-3" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="w-full bg-primary py-3 rounded">{mode === 'login' ? 'Login' : 'Create Account'}</button>
      </form>
      <button className="mt-4 text-sm text-slate-300" onClick={()=>setMode(mode==='login'?'signup':'login')}>
        {mode==='login' ? "Need an account? Sign up" : "Have an account? Log in"}
      </button>
    </main>
  )
}

