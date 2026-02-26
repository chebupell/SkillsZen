import React from "react";

const InProgressTag: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-2 flex flex-col gap-2">
      <div className="text-right text-blue-900 pr-1">
        In Progress
      </div>
      <div className="w-full bg-blue-50 h-1 rounded-full">
        <div
          className="bg-blue-400 h-1 rounded-full"
          style={{ width: '10%' }}
        ></div>
      </div>
    </div>
  )
}

export default InProgressTag;