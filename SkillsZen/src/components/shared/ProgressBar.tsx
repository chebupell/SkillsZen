import React from "react"

interface InProgressTagProps {
  current?: number;
  total?: number;
}

export const ProgressBar: React.FC<InProgressTagProps> = ({ current = 0, total = 0 }) => {
  const widthPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="flex justify-self-center gap-2 min-w-2xs bg-blue-50 h-1 rounded-full m-4">
      <div
        className="bg-blue-400 h-1 rounded-full"
        style={{ width: `${widthPercentage}%` }}
      ></div>
    </div>
  )
}