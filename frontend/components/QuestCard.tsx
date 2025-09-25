"use client"
import { motion } from 'framer-motion'

export default function QuestCard({ title, desc, progress }:{ title:string; desc:string; progress:number }){
  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="bg-slate-900/50 border border-slate-800 rounded p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-slate-300 mt-1">{desc}</p>
      <div className="mt-3 h-2 bg-slate-800 rounded">
        <div className="h-2 bg-primary rounded" style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  )
}

