// Import the functions you need from the SDKs you need
import { FirebaseError, initializeApp } from 'firebase/app'
import { getAuth, type UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

console.log(import.meta.env.VITE_FIREBASE_API_KEY, 125)
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
export const database = getDatabase(app)

export async function signupService(email: string, password: string): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
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
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
};


export const logout = async (): Promise<void> => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

