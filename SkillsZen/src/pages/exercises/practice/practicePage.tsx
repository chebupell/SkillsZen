import React from "react";
import PageLayout from "../../../components/shared/PageLayout/PageLayout";
import PracticeSubPage from "./practiceSubPage";

const PracticePage: React.FC = () => {
  return (
    <PageLayout backgroundImage="/background-images/practice-background.png">
      <PracticeSubPage
      />
    </PageLayout>
  )
};

export default PracticePage;