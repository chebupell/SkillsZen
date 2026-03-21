import { Button } from "../ui/button";
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const lastCategory = localStorage.getItem('lastCategory') || '/';

    if (location.pathname === lastCategory) {
      navigate('/');
    } else {
      navigate(lastCategory);
    }
  };

  return (
    <Button
      variant="back"
      onClick={handleBack}
    >
      <ArrowLeft size={20} />
      <span>Back</span>
    </Button>
  )
}