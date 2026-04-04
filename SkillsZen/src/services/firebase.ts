import { FirebaseError, initializeApp } from 'firebase/app'
import {
  getAuth,
  type UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
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
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import type { ProfileValues, SigninResponse } from '../types/UserTypes'
import type { ExerciseCardProps } from '../types/menuTypes'
import type { ExerciseItem, ExerciseStatus, CourseSubPageProps } from '../types/exerciseTypes'
import { toast } from 'sonner'
import type { ChatMessage } from '../types/chatTypes'
import type { CodingTask, UserProgressMap } from '../types/codingTasksTypes'

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

export const signinService = async (email: string, password: string): Promise<SigninResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const { user } = userCredential

    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    const profile = userDoc.exists() ? (userDoc.data() as ProfileValues) : undefined

    return {
      user,
      profile,
      credential: userCredential,
    }
  } catch (error: unknown) {
    let message = 'An unexpected error occurred'

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          message = 'Invalid email or password'
          break
        case 'auth/network-request-failed':
          message = 'Network error, please check your connection'
          break
        default:
          message = error.message
      }
    } else if (error instanceof Error) {
      message = error.message
    }

    toast.error(message)
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

export const reauthenticateUser = async (password: string) => {
  const auth = getAuth()
  const user = auth.currentUser

  if (user && user.email) {
    const credential = EmailAuthProvider.credential(user.email, password)
    return await reauthenticateWithCredential(user, credential)
  }
  throw new Error('No user found')
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

export const uploadUserAvatar = async (uid: string, file: File): Promise<string> => {
  const currentUser = auth.currentUser
  if (!currentUser) throw new Error('No authenticated user')
  const base64String = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    photo: base64String,
    updatedAt: new Date().toISOString(),
  })
  await updateProfile(currentUser, { photoURL: base64String })

  return base64String
}

export const updateTaskStatusFirebase = async (
  uid: string,
  taskId: string,
  status: 'passed' | 'failed',
) => {
  const userRef = doc(db, 'users', uid)
  await setDoc(
    userRef,
    {
      completedTasks: {
        [taskId]: status,
      },
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
  const currentUser = auth.currentUser

  if (!currentUser || currentUser.uid !== uid) {
    throw new Error('No authenticated user found or UID mismatch')
  }
  const userRef = doc(db, 'users', uid)
  await deleteDoc(userRef)

  await deleteUser(currentUser)
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

export async function getCourseSubPage(
  courseId: string,
  userId: string,
): Promise<CourseSubPageProps | null> {
  try {
    const courseSnap = await getDoc(doc(db, 'courses', courseId))
    if (!courseSnap.exists()) return null
    const courseData = courseSnap.data()

    const blocksSnap = await getDocs(
      query(collection(db, 'courses', courseId, 'blocks'), orderBy('order')),
    )
    const progressSnap = await getDocs(
      query(
        collection(db, 'user_progress'),
        where('user_id', '==', userId),
        where('course_id', '==', courseId),
      ),
    )

    const progressMap: Record<string, { status: ExerciseStatus; currentQuestion: number }> = {}
    progressSnap.forEach((doc) => {
      const data = doc.data()
      progressMap[data.block_id] = {
        status: data.status as ExerciseStatus,
        currentQuestion: data.current_question || 0,
      }
    })

    const exercises: ExerciseItem[] = await Promise.all(
      blocksSnap.docs.map(async (blockDoc) => {
        const questionsRef = collection(db, 'courses', courseId, 'blocks', blockDoc.id, 'questions')

        const countSnapshot = await getCountFromServer(questionsRef)
        const totalQuestions = countSnapshot.data().count
        const userProgress = progressMap[blockDoc.id]

        return {
          id: blockDoc.id,
          title: blockDoc.data().name,
          status: userProgress?.status || 'not_started',
          totalQuestions: totalQuestions,
          currentQuestion: userProgress?.currentQuestion || 0,
        }
      }),
    )

    const completedCount = exercises.filter((e) => e.status === 'completed').length

    return {
      courseId,
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

export const saveUserCodeDraft = async (uid: string, taskId: string, code: string) => {
  const draftRef = doc(db, 'users', uid)
  await updateDoc(draftRef, {
    [`drafts.${taskId}`]: code,
  })
}

export const getCodingTasksAndProgress = async (
  userId?: string,
): Promise<{
  tasks: CodingTask[]
  progress: UserProgressMap
}> => {
  try {
    const jsBlocksRef = collection(db, 'coding', 'js', 'blocks')
    const tasksQuery = query(jsBlocksRef, orderBy('order', 'asc'))

    const tasksSnap = await getDocs(tasksQuery)
    const tasks = tasksSnap.docs.map(
      (d) =>
        ({
          id: d.id,
          ...d.data(),
        }) as CodingTask,
    )

    let progress: UserProgressMap = {}

    if (userId) {
      const progressDocRef = doc(db, 'users', userId, 'progress', 'js')
      const progressSnap = await getDoc(progressDocRef)

      if (progressSnap.exists()) {
        progress = progressSnap.data() as UserProgressMap
      }
    }

    return { tasks, progress }
  } catch (err) {
    console.error('[getCodingTasksAndProgress] Failed to fetch data:', err)
    throw new Error('Could not retrieve tasks. Please check your connection.')
  }
}

export const getTaskData = async (taskId: string) => {
  try {
    const taskDocRef = doc(db, 'coding', 'js', 'blocks', taskId, 'questions', 'task_data')
    const taskSnap = await getDoc(taskDocRef)

    if (taskSnap.exists()) {
      return taskSnap.data()
    }
    throw new Error('Task not found')
  } catch (err) {
    console.error('Error fetching task data:', err)
    throw err
  }
}

export const runCodeInBrowser = (
  code: string,
  tests: string,
): Promise<{ output: string; error?: string; success: boolean }> => {
  return new Promise((resolve) => {
    const worker = new Worker('/worker/js-worker.js')

    const timeout = setTimeout(() => {
      worker.terminate()
      resolve({
        success: false,
        error: 'Execution Timeout: Possible infinite loop detected.',
        output: '',
      })
    }, 5000)

    worker.onmessage = (e) => {
      clearTimeout(timeout)
      worker.terminate()
      resolve(e.data)
    }

    worker.postMessage({ code, tests })
  })
}

export const saveChatHistoryFirebase = async (
  uid: string,
  messages: ChatMessage[],
): Promise<void> => {
  if (!uid) return

  try {
    const chatRef = doc(db, 'users', uid, 'data', 'chat')
    const truncatedMessages = messages.slice(-100)

    await setDoc(
      chatRef,
      {
        messages: truncatedMessages,
        lastUpdate: serverTimestamp(),
      },
      { merge: true },
    )
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    toast.error(`Cloud sync failed: ${msg}`)
    throw error
  }
}

export const getChatHistoryFirebase = async (uid: string): Promise<ChatMessage[]> => {
  if (!uid) return []

  try {
    const chatRef = doc(db, 'users', uid, 'data', 'chat')
    const snap = await getDoc(chatRef)

    if (snap.exists()) {
      const data = snap.data()
      return (data.messages as ChatMessage[]) || []
    }

    return []
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    toast.error(`Failed to load history: ${msg}`)
    return []
  }
}
