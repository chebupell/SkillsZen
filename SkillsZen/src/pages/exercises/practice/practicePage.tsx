import React, { useEffect, useState } from "react";
import PageLayout from "../../../components/shared/PageLayout/PageLayout";
import PracticeSubPage from "./practiceSubPage";
import type { PracticePageProps, ProgressOut, Task, BlockProgress } from "../../../types/practiceTypes";
import { auth } from "../../../services/login";
import { onAuthStateChanged } from 'firebase/auth';
import { apiFetch } from "../../../api/api";
import { useParams } from "react-router-dom";

const PracticePage: React.FC = () => {
  const { blockId } = useParams<{ blockId: string }>();
  const [practice, setPractice] = useState<PracticePageProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const loadData = async () => {
          try {
            if (!blockId) return;

            const [questionData, progressData] = await Promise.all([
              apiFetch(`/api/blocks/${blockId}/next-question`) as Promise<Task>,
              apiFetch(`/api/progress`) as Promise<ProgressOut>
            ]);

            const blockProgress = progressData?.blocks?.find(
              (b: BlockProgress) => b.block_id === Number(blockId)
            );

            if (blockProgress) {
              setPractice({
                ...blockProgress,
                question: questionData
              });
            } else {
              setPractice({
                block_id: Number(blockId),
                block_name: "Loading...",
                course_name: "Loading...",
                status: "in_progress",
                current_question: 0,
                total_questions: 0,
                correct_count: 0,
                question: questionData
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
  }, [blockId])

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
      <PracticeSubPage {...practice} />
    </PageLayout>
  )
};

export default PracticePage;