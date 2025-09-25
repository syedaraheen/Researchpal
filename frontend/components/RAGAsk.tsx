'use client'
import { useState } from 'react'

export default function RAGAsk(){
  const [q, setQ] = useState('')
  const [a, setA] = useState('')
  const [loading, setLoading] = useState(false)

  async function ask(){
    setLoading(true)
    const r = await fetch('/api/analyze-rag', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ question: q }) })
    const data = await r.json()
    setA(data.answer || '')
    setLoading(false)
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded p-4">
      <h3 className="font-semibold mb-2">Ask RAG (Grounded by your ingested papers)</h3>
      <div className="flex gap-2">
        <input className="flex-1 bg-slate-800 rounded px-3 py-2" placeholder="Ask a question" value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={ask} className="bg-primary px-4 py-2 rounded">Ask</button>
      </div>
      <div className="mt-3 whitespace-pre-wrap text-sm text-slate-200">
        {loading ? 'Thinking...' : a}
      </div>
    </div>
  )
}

