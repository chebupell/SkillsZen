// Import the functions you need from the SDKs you need
import { FirebaseError, initializeApp } from 'firebase/app'
import {
  getAuth,
  type UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
} from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import type { ProfileValues } from '../types/types'
import type { ExerciseCardProps } from '../types/menuTypes'
import type { ExerciseItem, ExerciseStatus, ExerciseSubPageProps } from '../types/exerciseTypes'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export async function signupService(
  email: string,
  password: string,
  username?: string,
): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, {
      displayName: username,
    })

    return userCredential
  } catch (error) {
    const firebaseError = error as FirebaseError
    switch (firebaseError.code) {
      case 'auth/email-already-in-use':
        throw new Error('This email is already registered.')
      case 'auth/weak-password':
        throw new Error('The password is too weak.')
      default:
        throw new Error('Failed to create account. Please try again.')
    }
  }
}

export const signinService = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    console.error('Signin error:', error)
    throw error
  }
}

export const logout = async (): Promise<void> => {
  try {
    return await signOut(auth)
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

export const updateFirebaseUser = async (uid: string, data: ProfileValues): Promise<void> => {
  const user = auth.currentUser
  if (!user) throw new Error('No authenticated user found')

  await updateProfile(user, { displayName: data.name })

  const userRef = doc(db, 'users', uid)
  await setDoc(
    userRef,
    {
      ...data,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  )
}

export const fetchFirestoreUserData = async (uid: string) => {
  const userRef = doc(db, 'users', uid)
  const docSnap = await getDoc(userRef)
  return docSnap.exists() ? docSnap.data() : null
}

export const deleteFirebaseUser = async (uid: string): Promise<void> => {
  const user = auth.currentUser
  if (!user || user.uid !== uid) throw new Error('No authenticated user found')

  const userRef = doc(db, 'users', uid)
  await deleteDoc(userRef)
  await deleteUser(user)
}

export async function getAllCoursesWithProgress(userId: string): Promise<ExerciseCardProps[]> {
  try {
    const coursesSnap = await getDocs(collection(db, 'courses'))
    const progressSnap = await getDocs(
      query(collection(db, 'user_progress'), where('user_id', '==', userId)),
    )

    const progressMap: Record<string, string> = {}
    progressSnap.forEach((doc) => {
      progressMap[doc.data().block_id] = doc.data().status
    })

    const results: ExerciseCardProps[] = []

    for (const courseDoc of coursesSnap.docs) {
      const courseData = courseDoc.data()

      const blocksSnap = await getDocs(collection(db, 'courses', courseDoc.id, 'blocks'))
      const totalBlocks = blocksSnap.size

      let completedBlocks = 0
      blocksSnap.forEach((block) => {
        if (progressMap[block.id] === 'completed') {
          completedBlocks++
        }
      })
      console.log(courseDoc.id)
      results.push({
        id: courseDoc.id,
        name: courseData.name,
        icon: courseData.icon,
        description: courseData.description,
        total_blocks: totalBlocks,
        completed_blocks: completedBlocks,
      })
    }

    return results
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export async function getExerciseSubPage(
  courseId: string,
  userId: string,
): Promise<ExerciseSubPageProps | null> {
  try {
    const courseSnap = await getDoc(doc(db, 'courses', courseId))
    if (!courseSnap.exists()) return null
    const courseData = courseSnap.data()

    const blocksSnap = await getDocs(
      query(collection(db, 'courses', courseId, 'blocks'), orderBy('order')),
    )
    console.log(blocksSnap)

    const progressSnap = await getDocs(
      query(
        collection(db, 'user_progress'),
        where('user_id', '==', userId),
        where('course_id', '==', courseId),
      ),
    )

    const progressMap: Record<string, ExerciseStatus> = {}
    progressSnap.forEach((doc) => {
      const data = doc.data()
      progressMap[data.block_id] = data.status as ExerciseStatus
    })

    const exercises: ExerciseItem[] = await Promise.all(
      blocksSnap.docs.map(async (blockDoc) => {
        const questionsRef = collection(db, 'courses', courseId, 'blocks', blockDoc.id, 'questions')

        const countSnapshot = await getCountFromServer(questionsRef)
        const totalQuestions = countSnapshot.data().count

        return {
          id: blockDoc.id,
          title: blockDoc.data().name,
          status: progressMap[blockDoc.id] || 'not_started',
          totalQuestions: totalQuestions,
        }
      }),
    )

    const completedCount = exercises.filter((e) => e.status === 'completed').length

    return {
      topicTitle: courseData.name,
      topicImg: courseData.icon,
      statusText: completedCount === exercises.length ? 'All done!' : 'Keep going',
      exercisesProgress: `${completedCount}/${exercises.length}`,
      exercises: exercises,
    }
  } catch (error) {
    console.error('Error fetching subpage data:', error)
    return null
  }
}
