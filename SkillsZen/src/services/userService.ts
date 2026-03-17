import { type UserCredential } from "firebase/auth";
import { type UserSession } from '../types/types';

const STORAGE_KEY = 'auth_user_session';

export const userStorageService = {
  async saveSession(credential: UserCredential): Promise<void> {
    const token = await credential.user.getIdToken();
    const session: UserSession = {
      uid: credential.user.uid,
      email: credential.user.email,
      accessToken: token || '',
      lastLogin: new Date().toISOString(),
      name: credential.user.displayName,
      photo: credential.user.photoURL
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },

  getSession(): UserSession | null {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as UserSession) : null;
  },

  syncLocalSession(updatedName: string): UserSession | null {
    const session = this.getSession();
    if (session) {
      const updated = { ...session, name: updatedName };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }
    return null;
  },

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEY);
  }
};
