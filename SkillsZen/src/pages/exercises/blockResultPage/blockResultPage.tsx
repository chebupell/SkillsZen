import React from 'react'
import PageLayout from '../../../components/shared/PageLayout.tsx'
import ToMenuButton from '../../../components/shared/toMenuButton'
import { useLocation } from 'react-router-dom'
import { Card } from '../../../components/ui/card.tsx'

interface ResultProps {
  block_id: string
  total_questions: number
  correct_count: number
}

const BlockResultPage: React.FC = () => {
  const { state } = useLocation()
  const { block_id, total_questions, correct_count } = (state || {}) as ResultProps

  const getFeedback = (score: number) => {
    if (score >= 90) return "You're a legend! 🏆"
    if (score >= 70) return 'Brilliant! 🔥'
    if (score >= 50) return 'Not bad for a start 👍'
    return 'Room for improvement 🌱'
  }

  return (
    <PageLayout backgroundImage="main-page-background.webp">
      <ToMenuButton />
      <Card className="mt-20 flex items-center justify-center">
        <div className="text-3xl text-secondary-foreground mb-10 max-w-100">Your results</div>
        <div className="text-3xl text-secondary-foreground mb-10 max-w-100">Topic: {block_id}</div>
        <div className="text-3xl text-secondary-foreground mb-10 max-w-100">
          {Math.floor((correct_count / total_questions) * 100)}%
        </div>
        <div className="text-3xl text-secondary-foreground mb-10 max-w-100 text-center">
          {getFeedback(Math.floor((correct_count / total_questions) * 100))}
        </div>
      </Card>
    </PageLayout>
  )
}

export default BlockResultPage
