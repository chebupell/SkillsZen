import { Button } from "../ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      className="bg-white text-black hover:bg-gray-100 transition-all gap-2 rounded-xl shadow-lg border-none"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft size={20} />
      <span>Back</span>
    </Button>
  )
}