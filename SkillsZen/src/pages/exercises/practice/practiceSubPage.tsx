import React from "react";
import { Card } from "../../../components/ui/card";
import ContinueButton from "../../../components/shared/nextQuestionButton";
import type { PracticePageProps } from "../../../types/practiceTypes";
import BackButton from "../../../components/shared/backButton";

export const PracticeSubPage: React.FC<PracticePageProps> = ({
  current_question,
  total_questions,
  question
}) => {
  if (!question) {
    return (
      <div className="p-4 sm:p-10 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-10 min-h-screen">
      <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-2 mb-6">
        <div className="flex justify-start">
          <BackButton />
        </div>
      </div>
      <div className="text-2xl sm:text-4xl text-center"> Question {current_question + 1} / {total_questions}</div>
      <div className="hidden sm:block w-25" aria-hidden="true"></div>

      <p className="text-center text-gray-600 mb-8">Progress Bar</p>

      <Card>
        <div className="flex justify-center bg-gray-50 p-2 mx-auto rounded-md text-xl font-medium text-center"> {question.text} </div>
        <hr className="border-t border-gray-100" />
        <div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 m-2'>
            {Array.isArray(question.answers) && question.answers.map((item) => (
              <div key={item.id} className="p-4 rounded-md bg-gray-50 hover:bg-blue-200 active:bg-blue-400 cursor-pointer text-center"> {item.text} </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center bg-gray-50 p-3 mx-auto rounded-md"> Correct or incorrect feedback line</div>
      </Card>
      <ContinueButton />
    </div>
  );
};

export default PracticeSubPage;