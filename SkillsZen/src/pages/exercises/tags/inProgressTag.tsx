import React from "react";

interface InProgressTagProps {
  current?: number;
  total?: number;
}

const InProgressTag: React.FC<InProgressTagProps> = ({ current = 0, total = 0 }) => {
  const widthPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="rounded-2xl p-2 flex flex-col gap-2 min-w-40">
      <div className="text-right text-blue-900 pr-1">
        In Progress
      </div>
      <div className="w-full bg-blue-50 h-1 rounded-full">
        <div
          className="bg-blue-400 h-1 rounded-full"
          style={{ width: `${widthPercentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default InProgressTag;