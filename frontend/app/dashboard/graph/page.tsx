'use client'
import { useEffect, useRef, useState } from 'react'

const cytoscape = typeof window !== 'undefined' ? require('cytoscape') : null
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

export default function GraphPage(){
  const ref = useRef<HTMLDivElement|null>(null)
  const [paperId, setPaperId] = useState('')

  async function load(){
    if(!ref.current || !cytoscape || !paperId) return
    const r = await fetch(`/api/graph/${encodeURIComponent(paperId)}`)
    const data = await r.json()
    const cy = cytoscape({
      container: ref.current,
      style: [
        { selector: 'node', style: { 'background-color': '#1D4ED8', label: 'data(label)', color: '#F9FAFB', 'font-size': 10 }},
        { selector: 'edge', style: { width: 2, 'line-color': '#10B981' }}
      ],
      layout: { name: 'cose' },
      elements: data.elements
    })
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Research DNA</h2>
      <div className="flex gap-2 mb-3">
        <input className="bg-slate-800 rounded px-3 py-2" placeholder="Semantic Scholar Paper ID" value={paperId} onChange={e=>setPaperId(e.target.value)} />
        <button onClick={load} className="bg-primary px-4 py-2 rounded">Load Graph</button>
      </div>
      <div ref={ref} className="h-[500px] bg-slate-900/40 border border-slate-800 rounded" />
    </div>
  )
}

