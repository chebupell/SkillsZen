import React from "react";

const StartTag: React.FC = () => {
  return (
    <div className="gap-4 rounded-xl items-center border-2 border-yellow-200 bg-yellow-100 p-2 px-6 min-w-40">
      <div className="flex items-center gap-3 text-black-900 text-center">
        <div className="rounded-full border-3 border-yellow-200 w-4 h-4"></div>
        Not Started
      </div>
    </div>
  )
}

export default StartTag;