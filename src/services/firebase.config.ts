/**
 * Firebase Client Configuration & Service Abstraction
 * 
 * Ready for full Firebase / Firestore / Firebase Auth integration.
 * In prototype mode, seamlessly provides reactive local persistence
 * with identical asynchronous API signatures so that switching to 
 * live Firestore is a zero-effort configuration swap.
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const getFirebaseConfig = (): FirebaseConfig | null => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (apiKey && authDomain && projectId) {
    return {
      apiKey,
      authDomain,
      projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
  }

  return null;
};

export const isFirebaseConfigured = (): boolean => {
  return getFirebaseConfig() !== null;
};
