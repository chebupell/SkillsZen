import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowLeft } from 'lucide-react';

export default function ToMenuButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    const lastCategory = localStorage.getItem('lastCategory') || '/';
    navigate(lastCategory);
  };

  return (
    <Button
      variant="back"
      onClick={handleBack}
    >
      <ArrowLeft size={20} />
      <span>Back to Topics</span>
    </Button>
  )
}