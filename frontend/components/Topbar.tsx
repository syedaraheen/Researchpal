'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Topbar(){
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [error, setError] = useState('')
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(()=>{
    function handler(){ setOpen(true) }
    window.addEventListener('open-auth', handler as any)
    return ()=> window.removeEventListener('open-auth', handler as any)
  },[])

  useEffect(()=>{
    try {
      const token = localStorage.getItem('token')
      setIsAuthed(!!token)
    } catch {}
  }, [])

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setError('')
    try{
      if(mode==='signup'){
        const r = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
        const isJson = (r.headers.get('content-type') || '').includes('application/json')
        const data: any = isJson ? await r.json() : await r.text()
        if(!r.ok) throw new Error((isJson ? data?.detail : data) || 'Signup failed')
        localStorage.setItem('token', data.access_token || '')
        setOpen(false)
        window.location.reload()
      } else {
        const form = new URLSearchParams()
        form.set('username', email)
        form.set('password', password)
        const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form.toString() })
        const isJson = (r.headers.get('content-type') || '').includes('application/json')
        const data: any = isJson ? await r.json() : await r.text()
        if(!r.ok) throw new Error((isJson ? data?.detail : data) || 'Login failed')
        localStorage.setItem('token', data.access_token || '')
        setOpen(false)
        window.location.reload()
      }
    }catch(err:any){ setError(err.message) }
  }

  const [mounted, setMounted] = useState(false)
  useEffect(()=>{ setMounted(true) },[])

  return (
    <div className="sticky top-0 z-40 bg-slate-900/60 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-bold">ResearchPal</div>
        <div className="flex items-center gap-3">
          {isAuthed ? (
            <button onClick={()=>{localStorage.removeItem('token'); window.location.reload()}} className="text-sm text-slate-300">Logout</button>
          ) : (
            <button onClick={()=>setOpen(true)} className="bg-primary px-4 py-2 rounded">Login / Signup</button>
          )}
        </div>
      </div>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-full max-w-lg mx-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              aria-label="Close"
              onClick={()=>setOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-offwhite"
            >×</button>
            <h3 className="text-2xl font-semibold mb-2 text-center">{mode==='login'?'Welcome back':'Create your account'}</h3>
            <p className="text-center text-slate-400 mb-4">{mode==='login'?'Log in to continue your research journey.':'Sign up to unlock quests and AI tools.'}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input className="w-full bg-slate-800 rounded-lg px-4 py-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              <input type="password" className="w-full bg-slate-800 rounded-lg px-4 py-3" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button className="w-full bg-offwhite text-slatebg font-semibold px-4 py-3 rounded-lg hover:opacity-90" type="submit">{mode==='login'?'Log in':'Create account'}</button>
              <button onClick={()=>setMode(mode==='login'?'signup':'login')} type="button" className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg text-slate-100 hover:bg-slate-700">
                {mode==='login'? 'Sign up for free' : 'Back to login'}
              </button>
            </form>
          </div>
        </div>, document.body)
      }
    </div>
  )
}

