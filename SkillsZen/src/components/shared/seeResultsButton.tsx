import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface SeeResultsProps {
  onClick?: () => void;
}

const SeeResultsButton: React.FC<SeeResultsProps> = () => {
  return (
    <Link to={`/results`}>
      <Button
        className="flex justify-self-center bg-blue-500 text-black transition-all gap-2 rounded-xl shadow-lg border-none m-4 "
      >
        <span>See Results</span>
        <ArrowRight size={20} />
      </Button>
    </Link>
  );
};

export default SeeResultsButton;