import React from "react";
import type { ExerciseSubPageProps } from "../../../types/exerciseTypes";
import SuccessTag from "../tags/successTag";
import RetryTag from "../tags/retryTag";
import InProgressTag from "../tags/inProgressTag";
import StartTag from "../tags/startTag";
import BackButton from "../../../components/shared/backButton";

export const ExerciseSubPage: React.FC<ExerciseSubPageProps> = ({
  topicImg,
  topicTitle,
  statusText,
  exercisesProgress,
  exercises
}) => {
  return (
    <div className="p-4 sm:p-10 min-h-screen">
      <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-2 mb-6">
        <div className="flex justify-start">
          <BackButton />
        </div>
        <div className="text-2xl sm:text-4xl text-center">{topicTitle}</div>
        <div className="hidden sm:block w-25" aria-hidden="true"></div>
      </div>

      <p className="text-center text-gray-600 mb-8">{exercisesProgress}</p>

      <div className="grid gap-4 md:grid-cols-1 cursor-pointer">
        {exercises.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-xl shadow-lg md:flex items-center gap-8 hover:bg-gray-100">
            <div className="flex items-center gap-4 mb-1">
              <img src={topicImg} alt="Topic Image" className="max-h-10 rounded-lg" />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <div className="ml-auto">
                  <p className="text-sm text-gray-500">{statusText}</p>
                </div>
              </div>
            </div>
            <div className="ml-auto">
              {item.status === 'completed'
                ? <SuccessTag />
                : (item.status === 'try_again')
                  ? <RetryTag />
                  : (item.status === 'in_progress')
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