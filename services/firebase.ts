import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// 安全獲取環境變數
const firebaseConfigRaw = typeof process !== 'undefined' ? process.env.FIREBASE_CONFIG : null;

const getValidConfig = () => {
  if (!firebaseConfigRaw || firebaseConfigRaw === '{}') return null;
  try {
    const config = JSON.parse(firebaseConfigRaw);
    if (config.apiKey && config.projectId) return config;
    return null;
  } catch {
    return null;
  }
};

const config = getValidConfig();

if (config) {
  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
      auth = getAuth(firebaseApp);
      db = getFirestore(firebaseApp);
    } else {
      firebaseApp = getApps()[0];
      auth = getAuth(firebaseApp);
      db = getFirestore(firebaseApp);
    }
  } catch (error) {
    console.warn("Firebase 初始化失敗，將進入展示模式：", error);
  }
}

export const isFirebaseEnabled = (): boolean => !!auth && !!db;

export { auth, db };