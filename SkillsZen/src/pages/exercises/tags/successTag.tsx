import React from "react";

const SuccessTag: React.FC = () => {
  return (
    <div className="flex gap-4 rounded-xl items-center bg-lime-100 p-2">
        <img src="/icons/ok-icon.png" alt="Ok icon" className="h-5"/>
        <div className="text-green-900 text-center">Successfully Completed</div>
    </div>
  )
}

export default SuccessTag;