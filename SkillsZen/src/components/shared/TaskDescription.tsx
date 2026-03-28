import React from 'react'
import { BookOpen } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface TaskDescriptionProps {
  text: string | undefined | null
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ text }) => (
  <section className="w-[40%] min-w-[350px] h-full overflow-y-auto p-8 border-r border-[#333] bg-[#252526] custom-scrollbar shadow-inner selection:bg-yellow-500/30">
    <div className="flex items-center gap-2 text-gray-500 mb-6 text-[10px] font-black uppercase tracking-[0.2em]">
      <BookOpen size={14} className="text-yellow-600/50" /> Documentation
    </div>
    <article className="prose prose-invert max-w-none prose-yellow prose-sm leading-relaxed">
      <ReactMarkdown>{text || ''}</ReactMarkdown>
    </article>
  </section>
)

export default TaskDescription
