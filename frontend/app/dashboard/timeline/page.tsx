'use client'
import { useState } from 'react'
import TimelineChart from '@/components/TimelineChart'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

export default function TimelinePage(){
  const [topic, setTopic] = useState('')
  const [summary, setSummary] = useState('')
  const [items, setItems] = useState<any[]>([])

  async function run(){
    const r = await fetch(`${API_BASE}/timeline`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic }) })
    const data = await r.json()
    setSummary(data.summary || '')
    setItems(data.items || [])
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-bold">Paper Time Travel</h2>
      <div className="flex gap-2">
        <input className="bg-slate-800 rounded px-3 py-2" placeholder="Topic" value={topic} onChange={e=>setTopic(e.target.value)} />
        <button onClick={run} className="bg-accent px-4 py-2 rounded">Generate</button>
      </div>
      {summary && <div className="bg-slate-900/40 border border-slate-800 rounded p-4 whitespace-pre-wrap">{summary}</div>}
      {!!items.length && <TimelineChart items={items} />}
    </div>
  )
}

