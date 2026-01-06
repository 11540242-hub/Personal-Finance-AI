import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const firebaseConfigRaw = process.env.FIREBASE_CONFIG;

// 技術規範：若環境變數未設定，應讓程式優雅地進入「離線/展示模式」而非報錯崩潰。
const hasValidConfig = (() => {
  if (!firebaseConfigRaw || firebaseConfigRaw === '{}') return false;
  try {
    const config = JSON.parse(firebaseConfigRaw);
    return !!(config.apiKey && config.projectId);
  } catch {
    return false;
  }
})();

if (hasValidConfig) {
  try {
    const config = JSON.parse(firebaseConfigRaw as string);
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
      auth = getAuth(firebaseApp);
      db = getFirestore(firebaseApp);
    }
  } catch (error) {
    console.warn("Firebase 自動連線失敗，將切換至展示模式：", error);
  }
}

export const isFirebaseEnabled = () => !!auth && !!db;

export { auth, db };