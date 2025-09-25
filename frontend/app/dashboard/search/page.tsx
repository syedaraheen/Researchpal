'use client'
import { useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

export default function SearchPage(){
  const [q, setQ] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function search(){
    setLoading(true)
    setError('')
    try {
      // route via Next.js rewrite to avoid CORS/base URL issues
      const r = await fetch(`/api/search-papers?query=${encodeURIComponent(q)}`)
      if (!r.ok) {
        const txt = await r.text()
        throw new Error(`HTTP ${r.status}: ${txt}`)
      }
      const data = await r.json()
      setResults(data.results || [])
    } catch (e: any) {
      setError(e.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Search Papers</h2>
      <div className="flex gap-2">
        <input className="flex-1 bg-slate-800 rounded px-3 py-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="Enter topic or keywords"/>
        <button onClick={search} className="bg-primary rounded px-4">Search</button>
      </div>
      <div className="mt-6 grid gap-3">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-400 text-sm">{error} — Is backend running?</p>}
        {!loading && results.map((r,i)=> (
          <div key={i} className="bg-slate-900/40 border border-slate-800 rounded p-3">
            <div className="font-semibold">{r.title}</div>
            {r.year && <div className="text-sm text-slate-400">{r.year}</div>}
            {r.abstract && <p className="text-sm text-slate-300 mt-1 line-clamp-3">{r.abstract}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

