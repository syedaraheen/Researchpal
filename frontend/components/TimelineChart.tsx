'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function TimelineChart({ items }:{ items: { title:string; year?:number }[] }){
  const data = items.map((it, i)=> ({ idx: i, year: it.year || i, label: it.title }))
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="year" stroke="#94a3b8"/>
          <YAxis stroke="#94a3b8"/>
          <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', color: '#f9fafb' }}/>
          <Line type="monotone" dataKey="year" stroke="#1D4ED8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

