import React from "react";
import PageLayout from "../../../components/shared/PageLayout/PageLayout";
import PracticeSubPage from "./practiceSubPage";
import type { PracticePageProps } from "../../../types/practiceTypes";

const mockData: PracticePageProps = {
  block_id: 1,
  block_name: "JS",
  course_name: "JavaScript",
  status: "in_progress",
  current_question: 1,
  total_questions: 10,
  correct_count: 0,
  question: {
    id: 1,
    text: "What will be result of console.log(typeof [])?",
    question_type: "single_choice",
    answers: [
      { id: 1, text: "object" },
      { id: 2, text: "array" },
      { id: 3, text: "list" },
      { id: 4, text: "undefined" }
    ]
  }
};

const PracticePage: React.FC = () => {
  return (
    <PageLayout backgroundImage="/background-images/practice-background.png">
      <PracticeSubPage {...mockData} />
    </PageLayout>
  )
};

export default PracticePage;