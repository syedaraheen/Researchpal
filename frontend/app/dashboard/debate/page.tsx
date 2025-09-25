'use client'
import { useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

export default function DebatePage(){
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [out, setOut] = useState('')
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  async function run(){
    const r = await fetch(`/api/debate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token? { 'Authorization': `Bearer ${token}` } : {}) },
      body: JSON.stringify({ a_abstract: a, b_abstract: b })
    })
    const data = await r.json()
    setOut(data.transcript || '')
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-bold">Academic Debate Simulator</h2>
      <div className="grid md:grid-cols-2 gap-3">
        <textarea className="bg-slate-800 rounded p-3 h-48" placeholder="Paper A abstract" value={a} onChange={e=>setA(e.target.value)} />
        <textarea className="bg-slate-800 rounded p-3 h-48" placeholder="Paper B abstract" value={b} onChange={e=>setB(e.target.value)} />
      </div>
      <button onClick={run} className="bg-primary px-4 py-2 rounded w-fit">Simulate Debate</button>
      {out && <div className="bg-slate-900/40 border border-slate-800 rounded p-4 whitespace-pre-wrap">{out}</div>}
    </div>
  )
}

