import React from "react";
import PageLayout from "../../../components/shared/PageLayout/PageLayout";
import ToMenuButton from "../../../components/shared/toMenuButton";
const BlockResultPage: React.FC = () => {
  return (
    <PageLayout backgroundImage='main-page-background.png'>
      <ToMenuButton />
      <h2>Your results</h2>
    </PageLayout>
  )
}

export default BlockResultPage;