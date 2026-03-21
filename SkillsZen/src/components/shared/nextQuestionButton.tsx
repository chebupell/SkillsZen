import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from 'lucide-react';

interface ContinueButtonProps {
  onClick?: () => void;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ onClick }) => {
  const navigate = useNavigate();
  return (
    <Button
      className="group flex justify-self-center bg-blue-500 text-white transition-all duration-200 gap-2 rounded-xl shadow-lg border-none m-4 hover:bg-blue-600 hover:scale-[1.02] active:bg-blue-700 active:scale-100 active:shadow-inner"
      onClick={() => (onClick ? onClick() : navigate(+1))}
    >
      <span>Next Question</span>
      <span className="group-hover:translate-x-1 transition-transform duration-200">
        <ArrowRight size={20} />
      </span>
    </Button>
  );
};

export default ContinueButton;