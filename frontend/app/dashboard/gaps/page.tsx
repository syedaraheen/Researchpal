'use client'
import { useState } from 'react'
import BubbleMap from '@/components/BubbleMap'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

export default function GapsPage(){
  const [topic, setTopic] = useState('')
  const [abstracts, setAbstracts] = useState('')
  const [out, setOut] = useState('')
  const [gaps, setGaps] = useState<any[]>([])

  async function run(){
    const form = new FormData()
    form.set('topic', topic)
    // allow user to paste abstracts separated by \n\n
    abstracts.split(/\n\n+/).forEach(a => form.append('abstracts', a))
    const r = await fetch(`/api/find-research-gaps`, { method: 'POST', body: form })
    const data = await r.json()
    setOut(data.gaps || '')
    try {
      const parsed = JSON.parse(data.gaps || '{}')
      setGaps(parsed.gaps || [])
    } catch {}
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-bold">Research Gap Finder</h2>
      <input className="bg-slate-800 rounded px-3 py-2" placeholder="Topic" value={topic} onChange={e=>setTopic(e.target.value)} />
      <textarea className="bg-slate-800 rounded p-3 h-48" placeholder="Paste abstracts separated by blank lines" value={abstracts} onChange={e=>setAbstracts(e.target.value)} />
      <button onClick={run} className="bg-accent px-4 py-2 rounded w-fit">Analyze</button>
      {out && <div className="bg-slate-900/40 border border-slate-800 rounded p-4 whitespace-pre-wrap">{out}</div>}
      {!!gaps.length && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Gap Map</h3>
          <BubbleMap data={gaps.map((g:any)=> ({ label: g.label, importance: Number(g.importance)||5, field: g.field }))} />
        </div>
      )}
    </div>
  )
}

