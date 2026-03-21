import React from "react";

const RetryTag: React.FC = () => {
  return (
    <div className="group relative inline-flex bg-blue-100 rounded-full h-10 px-6 items-center justify-center gap-3 min-w-40 transition-all duration-300 cursor-pointer">
      <div className="pointer-events-none absolute inset-1 rounded-full border-2 border-blue-300" />
      <div className="rounded-full border-2 border-blue-300 w-4 h-4"></div>
      <div className="text-blue-900 text-sm font-medium leading-tight">
        Try Again
      </div>

      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-max px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
        Less than 70% correct answers in previous attempt

        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
      </div>
    </div>
  )
}

export default RetryTag;