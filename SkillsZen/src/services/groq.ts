import Groq from 'groq-sdk';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from './firebase'; 
import { toast } from 'sonner';
import { FirebaseError } from 'firebase/app';
import type { ChatMessage, GroqResponse } from '../types/chatTypes';


const db = getFirestore(app);

async function fetchApiKey(): Promise<string | null> {
  try {
    const docRef = doc(db, 'secrets', 'groq');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      toast.error('AI Configuration Error: Secret document not found.');
      return null;
    }

    const data = docSnap.data();
    const key = data?.apiKey as string | undefined;

    if (!key) {
      toast.error('AI Configuration Error: apiKey field is missing.');
      return null;
    }

    return key;
  } catch (error: unknown) {
    const message = error instanceof FirebaseError ? error.message : 'Database connection failed';
    toast.error(`Firestore Error: ${message}`);
    return null;
  }
}
export async function getGroqChatCompletion(messages: ChatMessage[]): Promise<GroqResponse | null> {
  const apiKey = await fetchApiKey();

  if (!apiKey) return null;

  const groq = new Groq({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful developer assistant. Use markdown.' },
        ...messages,
      ],
      model: 'llama-3.3-70b-versatile',
    });

    return response as unknown as GroqResponse;
  } catch (error: unknown) {
    let errorMessage = 'An error occurred while generating response';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    toast.error(`Groq AI Error: ${errorMessage}`);
    return null;
  }
}

