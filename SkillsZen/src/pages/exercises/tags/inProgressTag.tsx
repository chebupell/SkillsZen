import React from "react";

interface InProgressTagProps {
  current?: number;
  total?: number;
}

const InProgressTag: React.FC<InProgressTagProps> = ({ current = 0, total = 0 }) => {
  const widthPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="relative inline-flex bg-purple-100 rounded-full h-10 px-6 items-center gap-4 min-w-40 transition-all duration-300">
      <div className="pointer-events-none absolute inset-1 rounded-full border-2 border-purple-300" />
      <div className="text-purple-900 text-sm leading-tight font-medium whitespace-nowrap z-10">
        In Progress
      </div>
      <div className="w-20 bg-purple-200 h-1 rounded-full overflow-hidden z-10">
        <div
          className="bg-purple-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${widthPercentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default InProgressTag;