import React from "react";

interface InProgressTagProps {
  current?: number;
  total?: number;
}

const InProgressTag: React.FC<InProgressTagProps> = ({ current = 0, total = 0 }) => {
  const widthPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="relative bg-blue-100 rounded-full py-2 px-6 flex flex-col gap-1 min-w-40 transition-all duration-300">
      <div className="pointer-events-none absolute inset-1 rounded-full border-2 border-blue-300" />
      <div className="text-right text-blue-900 pr-1 text-sm leading-tight font-medium">
        In Progress
      </div>
      <div className="w-full bg-blue-200 h-1 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${widthPercentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default InProgressTag;