import React from "react";

const RetryTag: React.FC = () => {
  return (
    <div className="relative inline-flex bg-blue-100 rounded-full h-10 px-6 items-center justify-center gap-3 min-w-40 transition-all duration-300">
      <div className="pointer-events-none absolute inset-1 rounded-full border-2 border-blue-300" />
      <div className="rounded-full border-2 border-blue-300 w-4 h-4"></div>
      <div className="text-blue-900 text-sm font-medium leading-tight">
        Try Again
      </div>
    </div>
  )
}

export default RetryTag;