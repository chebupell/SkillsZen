import React, { useState } from "react";
import { Card } from "../../../components/ui/card";
import ContinueButton from "../../../components/shared/nextQuestionButton";
import type { PracticePageProps } from "../../../types/practiceTypes";
import BackButton from "../../../components/shared/backButton";
import { ProgressBar } from "../../../components/shared/ProgressBar";
import { apiFetch } from "../../../api/api";
import SeeResultsButton from "../../../components/shared/seeResultsButton";

export interface AnswerResponse {
  correct: boolean;
  correct_answer: string;
  explanation: string;
}

export const PracticeSubPage: React.FC<PracticePageProps> = ({
  current_question,
  total_questions,
  question,
  onNext
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AnswerResponse | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setSelectedId(null);
    setFeedback(null);
  }, [question?.id]);

  if (!question) {
    return (
      <div className="p-4 sm:p-10 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading question...</div>
      </div>
    );
  }

  const handleAnswerClick = async (answerId: number) => {
    if (selectedId !== null || loading) return;

    setSelectedId(answerId);
    setLoading(true);

    try {
      const response = await apiFetch(`/api/questions/${question.id}/answer`, {
        method: "POST",
        body: JSON.stringify({ answer_id: answerId })
      }) as AnswerResponse;

      setFeedback(response);
    } catch (error) {
      console.error("Failed to check answer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-10 min-h-screen">
      <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-2 mb-1">
        <div className="flex justify-start">
          <BackButton />
        </div>
      </div>
      <div className="text-2xl sm:text-4xl text-center"> Question {current_question + 1} / {total_questions}</div>
      <div className="hidden sm:block w-25" aria-hidden="true"></div>

      <div className="text-center text-gray-600 mb-8"><ProgressBar current={current_question} total={total_questions} /></div>

      <Card className="px-4 sm:px-6">
        <div className="flex justify-center bg-gray-50 p-2 mx-auto rounded-md text-xl font-medium text-center"> {question.text} </div>
        <hr className="border-t border-gray-100" />
        <div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 m-2'>
            {Array.isArray(question.answers) && question.answers.map((item) => {
              const isSelected = selectedId === item.id;
              const isCorrect = feedback?.correct;

              let bgColor = "bg-gray-50 hover:bg-blue-200 active:bg-blue-400";
              if (isSelected) {
                if (feedback) {
                  bgColor = isCorrect ? "bg-green-200" : "bg-red-200";
                } else {
                  bgColor = "bg-blue-400";
                }
              }

              return (
                <div
                  key={item.id}
                  onClick={() => handleAnswerClick(item.id)}
                  className={`p-4 rounded-md ${bgColor} cursor-pointer text-center transition-colors`}
                >
                  {item.text}
                </div>
              );
            })}
          </div>
        </div>

        <div className={`flex justify-center p-3 mx-auto rounded-md ${feedback ? (feedback.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800') : 'bg-gray-50'}`}>
          {feedback ? (
            <div className="text-center">
              <div className="font-bold">{feedback.correct ? "Correct!" : "Incorrect"}</div>
              <div>{feedback.explanation}</div>
            </div>
          ) : (
            "Choose the correct answer"
          )}
        </div>
      </Card>
      {total_questions > 0 && current_question === total_questions - 1 ? (
        <SeeResultsButton onClick={onNext} />
      ) : (
        <ContinueButton onClick={onNext} />
      )}
    </div>
  );
};

export default PracticeSubPage;