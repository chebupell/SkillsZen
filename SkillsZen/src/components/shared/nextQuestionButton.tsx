import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from 'lucide-react';

const ContinueButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Button
      className="flex justify-self-center bg-blue-500 text-black hover:bg-gray-100 transition-all gap-2 rounded-xl shadow-lg border-none m-4 "
      onClick={() => navigate(+1)}
    >
      <span>Next Question</span>
      <ArrowRight size={20} />
    </Button>
  )
}

export default ContinueButton;