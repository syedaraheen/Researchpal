'use client'
import { scaleLinear, scaleOrdinal } from 'd3-scale'

type Bubble = { label: string; importance: number; field?: string }

export default function BubbleMap({ data }: { data: Bubble[] }){
  const size = scaleLinear().domain([1,10]).range([16,80])
  const color = scaleOrdinal<string,string>().domain(Array.from(new Set(data.map(d=>d.field||'General')))).range([
    '#10B981','#1D4ED8','#EAB308','#F97316','#A855F7','#EC4899'
  ])
  return (
    <div className="flex flex-wrap gap-3">
      {data.map((d,i)=> (
        <div key={i} className="rounded-full border border-slate-700 flex items-center justify-center"
          style={{ width: size(d.importance), height: size(d.importance), background: (color(d.field||'General') as string) + '22' }}>
          <span className="text-xs text-center px-2">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

