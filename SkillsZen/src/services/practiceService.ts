import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './login'
import type { Task, BlockProgress } from '../types/practiceTypes'

const COURSES = ['js_course', 'ts_course', 'algo_course'];

export const practiceService = {
  async findCourseIdForBlock(blockId: string): Promise<{ courseId: string, realBlockId: string } | null> {
    for (const courseId of COURSES) {
      const blockRef = doc(db, 'courses', courseId, 'blocks', blockId);
      const blockSnap = await getDoc(blockRef);
      if (blockSnap.exists()) {
        return { courseId, realBlockId: blockId };
      }

      const blocksSnap = await getDocs(collection(db, 'courses', courseId, 'blocks'));
      for (const blockDoc of blocksSnap.docs) {
        if (blockDoc.id.toLowerCase() === blockId.toLowerCase()) {
          return { courseId, realBlockId: blockDoc.id };
        }
      }
    }
    return null;
  },

  async getPracticeData(blockId: string, userId: string): Promise<{ block: unknown, progress: BlockProgress, questions: Task[] } | null> {
    const searchResult = await this.findCourseIdForBlock(blockId);
    if (!searchResult) return null;

    const { courseId, realBlockId } = searchResult;

    const blockRef = doc(db, 'courses', courseId, 'blocks', realBlockId);
    const blockSnap = await getDoc(blockRef);
    if (!blockSnap.exists()) return null;
    const blockData = blockSnap.data();

    const courseSnap = await getDoc(doc(db, 'courses', courseId));
    const courseData = courseSnap.data();

    // user progress
    const progressRef = doc(db, 'user_progress', `${userId}_${realBlockId}`);
    const progressSnap = await getDoc(progressRef);

    let progress: BlockProgress;
    if (progressSnap.exists()) {
      const data = progressSnap.data();
      progress = {
        block_id: realBlockId,
        block_name: blockData.name,
        course_name: courseData?.name || '',
        status: data.status,
        current_question: data.current_question || 0,
        total_questions: blockData.total_questions,
        correct_count: data.correct_count || 0,
      };
    } else {
      progress = {
        block_id: realBlockId,
        block_name: blockData.name,
        course_name: courseData?.name || '',
        status: 'in_progress',
        current_question: 0,
        total_questions: blockData.total_questions,
        correct_count: 0,
      };

      // set progress in Firebase
      await setDoc(progressRef, {
        user_id: userId,
        course_id: courseId,
        block_id: realBlockId,
        status: 'in_progress',
        current_question: 0,
        correct_count: 0,
        updatedAt: new Date().toISOString()
      });
    }

    // Get questions
    const questionsRef = collection(db, 'courses', courseId, 'blocks', realBlockId, 'questions');

    const questionsSnap = await getDocs(questionsRef);

    const questions: Task[] = questionsSnap.docs.map(doc => {
      const data = doc.data();
      const normalizedAnswers = (data.answers || []).map((ans: string | { id?: string | number; text?: string; is_correct?: boolean }, idx: number) => {
        if (typeof ans === 'string') return { id: String(idx), text: ans };
        return { ...ans, id: ans.id !== undefined ? String(ans.id) : String(idx) };
      });

      const correctAnsObj = normalizedAnswers.find((a: { is_correct?: boolean; text?: string }) => a.is_correct === true);
      const computedCorrectAnswer = correctAnsObj ? correctAnsObj.text : data.correct_answer;

      return {
        id: doc.id,
        text: data.text,
        question_type: data.question_type,
        answers: normalizedAnswers,
        correct_answer: computedCorrectAnswer,
        explanation: data.explanation
      } as Task;
    });

    questions.sort((a, b) => String(a.id).localeCompare(String(b.id)));

    return { block: blockData, progress, questions };
  },

  async updateProgress(userId: string, blockId: string, data: Partial<unknown>): Promise<void> {
    const progressRef = doc(db, 'user_progress', `${userId}_${blockId}`);
    await updateDoc(progressRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  },

  async restartBlock(userId: string, blockId: string, courseId: string): Promise<void> {
    const progressRef = doc(db, 'user_progress', `${userId}_${blockId}`);
    await setDoc(progressRef, {
      user_id: userId,
      course_id: courseId,
      block_id: blockId,
      status: 'in_progress',
      current_question: 0,
      correct_count: 0,
      updatedAt: new Date().toISOString()
    });
  }
}