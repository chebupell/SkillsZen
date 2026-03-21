import React from "react";

const StartTag: React.FC = () => {
  return (
    <div className="relative inline-flex rounded-full items-center bg-yellow-100 py-2 px-6 min-w-40">
      <div className="pointer-events-none absolute inset-1 rounded-full border-2 border-yellow-300" />
      <div className="flex items-center justify-center gap-3 text-black-900 text-center">
        <div className="rounded-full border-2 border-yellow-300 w-4 h-4"></div>
        <span>Not Started</span>
      </div>
    </div>
  )
}

export default StartTag;