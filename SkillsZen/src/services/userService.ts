import { type UserCredential } from "firebase/auth";


export interface UserSession {
  uid: string;
  email: string | null;
  accessToken: string;
  lastLogin: string;
}

const STORAGE_KEY = 'auth_user_session';

export const userStorageService = {
  async saveSession(credential: UserCredential): Promise<void> {
    const token = await credential.user.getIdToken();
    const session: UserSession = {
      uid: credential.user.uid,
      email: credential.user.email,
      accessToken: token || '',
      lastLogin: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },

  getSession(): UserSession | null {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    try {
      return JSON.parse(data) as UserSession;
    } catch {
      return null;
    }
  },

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  isAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
};
