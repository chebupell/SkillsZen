import React from "react";
import { BackButton } from "../../shared/BackButton";

import type { ExerciseSubPageProps } from "../../../types/exerciseTypes";

export const ExerciseSubPage: React.FC<ExerciseSubPageProps> = ({
  topicTitle,
  exercisesProgress,
  exercises
}) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-3 items-center mb-6">
        <div className="flex justify-start">
          <BackButton />
        </div>
        <h1 className="text-2xl font-bold text-center">{topicTitle}</h1>
        <div />
      </div>

      <p className="text-center text-gray-600 mb-8">Progress: {exercisesProgress}</p>

      <div className="grid gap-4 md:grid-cols-1">
        {exercises.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-xl shadow-sm border md:flex gap-4">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}