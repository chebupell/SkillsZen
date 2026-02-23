import React from "react";

import type { ExerciseSubPageProps } from "../../../types/exerciseTypes";

export const ExerciseSubPage: React.FC<ExerciseSubPageProps> = ({
  topicTitle,
  exercisesProgress,
  exercises
}) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-2">{topicTitle}</h1>
      <p className="text-gray-600 mb-8">Progress: {exercisesProgress}</p>

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