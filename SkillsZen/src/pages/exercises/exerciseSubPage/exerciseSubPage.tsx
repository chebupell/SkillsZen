import React from "react";
import type { ExerciseSubPageProps } from "../../../types/exerciseTypes";

export const ExerciseSubPage: React.FC<ExerciseSubPageProps> = ({
  topicTitle,
  exercisesProgress,
  exercises
}) => {
  return (
    <div className="p-10 min-h-screen">
      <div className="grid items-center mb-6">
        <div className="flex justify-start">
        </div>
        <div className="text-4xl text-center">{topicTitle}</div>
      <div />
    </div>

    <p className="text-center text-gray-600 mb-8">Progress: {exercisesProgress}</p>

    <div className="grid gap-4 md:grid-cols-1">
      {exercises.map((item) => (
        <div key={item.id} className="p-4 bg-white rounded-xl shadow-lg md:flex gap-8">
          <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}