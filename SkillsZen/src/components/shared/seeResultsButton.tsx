import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface SeeResultsProps {
  onClick?: () => void;
}

const SeeResultsButton: React.FC<SeeResultsProps> = ({ onClick }) => {
  const navigate = useNavigate();
  return (
    <Button
      className="flex justify-self-center bg-blue-500 text-black transition-all gap-2 rounded-xl shadow-lg border-none m-4 "
      onClick={() => (onClick ? onClick() : navigate(+1))}
    >
      <span>See Results</span>
      <ArrowRight size={20} />
    </Button>
  );
};

export default SeeResultsButton;