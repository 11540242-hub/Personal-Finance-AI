import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Firebase Config 處理
const firebaseConfigRaw = (process.env.FIREBASE_CONFIG as string) || '{}';

const getValidConfig = () => {
  if (!firebaseConfigRaw || firebaseConfigRaw === '{}') return null;
  try {
    const config = JSON.parse(firebaseConfigRaw);
    // 基本檢查，確保必要欄位存在
    if (config.apiKey && config.authDomain && config.projectId) return config;
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
    } else {
      firebaseApp = getApps()[0];
    }
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
  } catch (error) {
    console.warn("Firebase 初始化失敗，系統將維持展示模式：", error);
  }
}

export const isFirebaseEnabled = (): boolean => !!auth && !!db;

export { auth, db };