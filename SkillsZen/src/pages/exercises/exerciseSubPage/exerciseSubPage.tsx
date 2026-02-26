import React from "react";
import type { ExerciseSubPageProps } from "../../../types/exerciseTypes";
import SuccessTag from "../tags/successTag";
import RetryTag from "../tags/retryTag";
import InProgressTag from "../tags/inProgressTag";
import StartTag from "../tags/startTag";

export const ExerciseSubPage: React.FC<ExerciseSubPageProps> = ({
  topicImg,
  topicTitle,
  statusText,
  exercisesProgress,
  exercises
}) => {
  return (
    <div className="p-10 min-h-screen">
      <div className="grid items-center mb-6">
        <div className="text-4xl text-center">{topicTitle}</div>
      </div>

      <p className="text-center text-gray-600 mb-8">Progress: {exercisesProgress}</p>

      <div className="grid gap-4 md:grid-cols-1 cursor-pointer">
        {exercises.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-xl shadow-lg md:flex items-center gap-8 hover:bg-gray-100">
            <div className="flex items-center gap-4">
              <img src={topicImg} alt="Topic Image" className="max-h-10 rounded-lg" />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <div className="ml-auto">
                   <p className="text-sm text-gray-500">{statusText}</p>
                </div>
              </div>
            </div>
            <div className="ml-auto">
              { item.status === 'completed'
                ? <SuccessTag />
                : (item.status === 'try-again')
                  ? <RetryTag />
                  : (item.status === 'in-progress')
                  ? <InProgressTag />
                  : <StartTag />
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};