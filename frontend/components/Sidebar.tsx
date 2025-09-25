"use client"
import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4">ResearchPal</h2>
      <nav className="grid gap-2">
        <Link href="/dashboard" className="hover:text-accent">Dashboard</Link>
        <button onClick={()=>window.dispatchEvent(new Event('open-auth'))} className="text-left hover:text-accent">Login / Signup</button>
        <Link href="/dashboard/search" className="hover:text-accent" onClick={(e)=>{ if(!localStorage.getItem('token')){ e.preventDefault(); window.dispatchEvent(new Event('open-auth'))}}}>Search</Link>
        <Link href="/dashboard/upload" className="hover:text-accent" onClick={(e)=>{ if(!localStorage.getItem('token')){ e.preventDefault(); window.dispatchEvent(new Event('open-auth'))}}}>Upload</Link>
        <Link href="/dashboard/compare" className="hover:text-accent" onClick={(e)=>{ if(!localStorage.getItem('token')){ e.preventDefault(); window.dispatchEvent(new Event('open-auth'))}}}>Compare</Link>
        <Link href="/dashboard/gaps" className="hover:text-accent" onClick={(e)=>{ if(!localStorage.getItem('token')){ e.preventDefault(); window.dispatchEvent(new Event('open-auth'))}}}>Research Gaps</Link>
        <Link href="/dashboard/graph" className="hover:text-accent" onClick={(e)=>{ if(!localStorage.getItem('token')){ e.preventDefault(); window.dispatchEvent(new Event('open-auth'))}}}>Knowledge Graph</Link>
        <Link href="/dashboard/debate" className="hover:text-accent">Debate</Link>
        <Link href="/dashboard/timeline" className="hover:text-accent">Timeline</Link>
        <Link href="/admin" className="hover:text-accent">Admin</Link>
        <Link href="/dashboard/xp" className="hover:text-accent">My XP</Link>
      </nav>
    </aside>
  )
}

