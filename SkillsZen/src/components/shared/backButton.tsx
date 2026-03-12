import { Button } from "../ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="back"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft size={20} />
      <span>Back</span>
    </Button>
  )
}