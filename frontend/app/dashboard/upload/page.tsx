'use client'
import { useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

export default function UploadPage(){
  const [file, setFile] = useState<File|null>(null)
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ingested, setIngested] = useState<number|undefined>(undefined)
  const [paperId, setPaperId] = useState<number|undefined>(undefined)
  const [askQ, setAskQ] = useState('')
  const [askA, setAskA] = useState('')
  const [askLoading, setAskLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<Array<{q:string,a:string}>>([])
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  async function upload(){
    if(!file) return
    if(!token){
      setError('Please login first to upload a paper.')
      return
    }
    setLoading(true)
    setError('')
    const fd = new FormData()
    fd.set('file', file)
    const r = await fetch(`${API_BASE}/upload-paper`, { method: 'POST', body: fd, headers: { 'Authorization': `Bearer ${token}` } })
    const data = await r.json()
    setSummary(data.summary || '')
    setPaperId(data.paper_id)
    // also ingest into RAG index
    const fd2 = new FormData()
    fd2.set('file', file)
    const r2 = await fetch(`${API_BASE}/ingest-paper`, { method:'POST', body: fd2, headers: { 'Authorization': `Bearer ${token}` } })
    const d2 = await r2.json()
    setIngested(d2.chunks)
    setLoading(false)
  }

  async function ask(){
    if(!askQ) return
    setAskLoading(true)
    setAskA('')
    try{
      console.log('Asking question:', askQ, 'for paper:', paperId)
      console.log('API_BASE:', API_BASE)
      console.log('Token exists:', !!token)
      const r = await fetch(`${API_BASE}/analyze-rag`, { 
        method:'POST', 
        headers:{ 
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify({ question: askQ, doc_id: paperId ? String(paperId) : null }) 
      })
      console.log('Response status:', r.status)
      const isJson = (r.headers.get('content-type')||'').includes('application/json')
      const data = isJson ? await r.json() : { answer: await r.text() }
      console.log('Response data:', data)
      if(!r.ok) throw new Error(data.answer || 'Request failed')
      setAskA(data.answer || '')
      setChatHistory(prev => [...prev, { q: askQ, a: data.answer || '' }])
    }catch(e:any){
      console.error('Ask error:', e)
      setAskA(`Error: ${e.message}`)
      setChatHistory(prev => [...prev, { q: askQ, a: `Error: ${e.message}` }])
    } finally {
      setAskLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload Paper</h2>
      <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0]||null)} />
      <button onClick={upload} className="ml-3 bg-accent px-4 py-2 rounded">Analyze</button>
      <div className="mt-6">
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        {loading && <p>Analyzing...</p>}
        {summary && (
          <div className="bg-slate-900/40 border border-slate-800 rounded p-4 whitespace-pre-wrap">{summary}</div>
        )}
        {ingested !== undefined && <p className="text-sm text-slate-300 mt-2">Ingested chunks: {ingested}</p>}
        <div className="mt-6 bg-slate-900/40 border border-slate-800 rounded p-4">
          <h3 className="font-semibold mb-2">Ask about this paper</h3>
          <div className="h-64 overflow-y-auto border border-slate-700 rounded p-3 mb-3">
            {chatHistory.length === 0 ? (
              <p className="text-slate-400 text-sm">No questions asked yet. Start a conversation below.</p>
            ) : (
              chatHistory.map((item, i) => (
                <div key={i} className="mb-4">
                  <div className="text-blue-300 text-sm mb-1">Q: {item.q}</div>
                  <div className="text-slate-200 text-sm whitespace-pre-wrap">{item.a}</div>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input className="flex-1 bg-slate-800 rounded px-3 py-2" placeholder="Ask a question about the uploaded paper" value={askQ} onChange={e=>setAskQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask()} />
            <button onClick={ask} disabled={askLoading || !paperId} className="bg-primary disabled:opacity-50 px-4 py-2 rounded">{askLoading? 'Asking...' : 'Ask'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

