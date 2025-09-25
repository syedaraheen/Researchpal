import XPBar from '@/components/XPBar'
import QuestCard from '@/components/QuestCard'
import RAGAsk from '@/components/RAGAsk'

export default function DashboardHome(){
  return (
    <div className="space-y-6">
      <section className="bg-slate-900/40 border border-slate-800 p-4 rounded">
        <h2 className="text-xl font-bold">Welcome, Researcher</h2>
        <div className="mt-3 max-w-md">
          <XPBar xp={120} level={1} />
        </div>
      </section>
      <section>
        <h3 className="font-semibold mb-3">Quests</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <QuestCard title="Find 3 highly cited papers" desc="On your topic of interest." progress={40} />
          <QuestCard title="Upload a paper and find gaps" desc="Analyze with AI." progress={20} />
          <QuestCard title="Compare two papers" desc="Spot differences." progress={0} />
        </div>
      </section>
      <RAGAsk />
    </div>
  )
}

