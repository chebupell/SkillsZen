import React from 'react'
import PageLayout from '../../../components/shared/PageLayout'
import ToMenuButton from '../../../components/shared/toMenuButton'
import { useLocation } from 'react-router-dom'

interface ResultProps {
  block_id: string
  total_questions: number
  correct_count: number
}

const BlockResultPage: React.FC = () => {

  const { state } = useLocation()
  const { block_id, total_questions, correct_count } = (state || {}) as ResultProps

  return (
    <PageLayout backgroundImage="main-page-background.png">
      <ToMenuButton />
      <div>Your results</div>
      <div>Topic: {block_id}</div>
      <div>{correct_count}/{total_questions}</div>
    </PageLayout>
  )
}

export default BlockResultPage