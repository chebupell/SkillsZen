import React, { useEffect, useState } from "react";
import PageLayout from "../../../components/shared/PageLayout";
import PracticeSubPage from "./practiceSubPage";
import type { PracticePageProps } from "../../../types/practiceTypes";
import { auth } from "../../../services/login";
import { onAuthStateChanged } from 'firebase/auth';
import { practiceService } from "../../../services/practiceService";
import { useParams } from "react-router-dom";

const PracticePage: React.FC = () => {
  const { blockId } = useParams<{ blockId: string }>();
  const [practice, setPractice] = useState<PracticePageProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNext = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const loadData = async () => {
          if (!blockId) return;
          setLoading(true);
          try {
            const data = await practiceService.getPracticeData(blockId, user.uid);

            if (data) {
              if (data.questions.length === 0) {
                console.warn("No questions found for this block!");
              }
              const currentQuestion = data.questions[data.progress.current_question];
              setPractice({
                ...data.progress,
                userId: user.uid,
                question: currentQuestion
              });
            }
          } catch (error) {
            console.error('Failed to fetch practice: ', error);
          } finally {
            setLoading(false);
          };
        }
        loadData()
      } else {
        setLoading(false);
      }
    })
    return () => unsubscribe();
  }, [blockId, refreshTrigger])

  if (loading) {
    return (
      <div className="bg-white text-center p-20 text-2xl">Loading exercises...</div>
    )
  };

  if (!practice) {
    return (
      <div className="bg-white text-center p-20 text-2xl">No exercises found.</div>
    )
  }

  return (
    <PageLayout backgroundImage="practice-background.png">
      <PracticeSubPage {...practice} onNext={handleNext} />
    </PageLayout>
  )
};

export default PracticePage;