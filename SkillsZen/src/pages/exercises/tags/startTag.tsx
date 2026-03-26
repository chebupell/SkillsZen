import React from 'react'

const StartTag: React.FC = () => {
  return (
    <div className="group relative inline-flex rounded-full items-center bg-yellow-100 px-6 h-10 min-w-40 cursor-pointer">
      <div className="pointer-events-none absolute inset-1 rounded-full border-2 border-yellow-300" />
      <div className="flex items-center justify-center gap-3 text-yellow-900 text-center">
        <div className="rounded-full border-2 border-yellow-300 w-4 h-4"></div>
        <span>Not Started</span>
      </div>

      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-max px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
        Give It a Go

        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
      </div>
    </div>
  )
}

export default StartTag
