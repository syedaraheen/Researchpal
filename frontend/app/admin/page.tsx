'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

export default function AdminPage(){
  const [stats, setStats] = useState<any>(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(()=>{
    async function load(){
      const r = await fetch(`${API_BASE}/analytics/stats`, { headers: token? { 'Authorization': `Bearer ${token}` } : {} })
      const data = await r.json()
      setStats(data)
    }
    load()
  },[])

  const usageData = [
    { day: 'Mon', uploads: 2, searches: 5 },
    { day: 'Tue', uploads: 3, searches: 7 },
    { day: 'Wed', uploads: 1, searches: 6 },
    { day: 'Thu', uploads: 4, searches: 8 },
    { day: 'Fri', uploads: 2, searches: 4 },
  ]

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {stats && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded p-4">Users: {stats.users}</div>
          <div className="bg-slate-900/40 border border-slate-800 rounded p-4">Papers: {stats.papers}</div>
          <div className="bg-slate-900/40 border border-slate-800 rounded p-4">Comparisons: {stats.comparisons}</div>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 rounded p-4">
          <h3 className="font-semibold mb-2">Daily Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <XAxis dataKey="day" stroke="#94a3b8"/>
                <YAxis stroke="#94a3b8"/>
                <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', color: '#f9fafb' }}/>
                <Bar dataKey="uploads" fill="#1D4ED8"/>
                <Bar dataKey="searches" fill="#10B981"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded p-4">
          <h3 className="font-semibold mb-2">API Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <XAxis dataKey="day" stroke="#94a3b8"/>
                <YAxis stroke="#94a3b8"/>
                <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', color: '#f9fafb' }}/>
                <Line dataKey="searches" stroke="#eab308" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

