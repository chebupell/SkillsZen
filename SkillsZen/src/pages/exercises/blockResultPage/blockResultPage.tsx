import React from 'react'
import PageLayout from '../../../components/shared/PageLayout.tsx'
import ToMenuButton from '../../../components/shared/toMenuButton'
const BlockResultPage: React.FC = () => {
  return (
    <PageLayout backgroundImage="main-page-background.webp">
      <ToMenuButton />
      <h2 className="text-2xl sm:text-4xl text-center m-4">Your results</h2>
    </PageLayout>
  )
}

export default BlockResultPage
