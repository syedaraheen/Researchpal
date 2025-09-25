export default function XPBar({ xp, level }: { xp: number; level: number }) {
  const next = (level + 1) * 100
  const pct = Math.min(100, Math.round((xp % next) / next * 100))
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1"><span>Level {level}</span><span>{pct}%</span></div>
      <div className="h-3 bg-slate-800 rounded">
        <div className="h-3 bg-accent rounded" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

