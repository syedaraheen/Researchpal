'use client'
import { useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

export default function ComparePage(){
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [out, setOut] = useState('')

  async function compare(){
    const form = new FormData()
    form.set('a_abstract', a)
    form.set('b_abstract', b)
    const r = await fetch(`/api/compare-papers`, { method: 'POST', body: form })
    const data = await r.json()
    setOut(data.comparison || '')
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-bold">Compare Papers</h2>
      <div className="grid md:grid-cols-2 gap-3">
        <textarea className="bg-slate-800 rounded p-3 h-48" placeholder="Abstract A" value={a} onChange={e=>setA(e.target.value)} />
        <textarea className="bg-slate-800 rounded p-3 h-48" placeholder="Abstract B" value={b} onChange={e=>setB(e.target.value)} />
      </div>
      <button onClick={compare} className="bg-primary px-4 py-2 rounded w-fit">Compare</button>
      {out && (
        <div className="bg-slate-900/40 border border-slate-800 rounded p-4 whitespace-pre-wrap">{out}</div>
      )}
    </div>
  )
}

