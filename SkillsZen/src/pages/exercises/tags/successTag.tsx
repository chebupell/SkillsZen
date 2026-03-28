import React from 'react'

const SuccessTag: React.FC = () => {
  return (
    <div className="group relative inline-flex bg-lime-100 rounded-full h-10 px-6 items-center justify-center gap-3 min-w-40 transition-all duration-300 cursor-pointer">
      <div className="pointer-events-none absolute inset-1 rounded-full border-2 border-lime-300" />
      <img src="/icons/ok-icon.png" alt="Ok icon" className="h-5 relative z-10" />
      <div className="text-green-900 text-sm font-medium leading-tight relative z-10">
        Completed
      </div>

      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-max px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
        More than 70% correct answers
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
      </div>
    </div>
  )
}

export default SuccessTag
