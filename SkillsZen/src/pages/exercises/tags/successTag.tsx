import React from "react";

const SuccessTag: React.FC = () => {
  return (
    <div className="relative inline-flex bg-lime-100 rounded-full h-10 px-6 items-center justify-center gap-3 min-w-40 transition-all duration-300">
      <div className="pointer-events-none absolute inset-1 rounded-full border-2 border-lime-300" />
      <img src="/icons/ok-icon.png" alt="Ok icon" className="h-5 relative z-10" />
      <div className="text-green-900 text-sm font-medium leading-tight relative z-10">
        Completed
      </div>
    </div>
  )
}

export default SuccessTag;