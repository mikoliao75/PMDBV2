
// src/firebase/index.ts

// 將 Promise 宣告在 globalThis 上，以在 Next.js 開發環境的熱重載之間保持狀態
declare global {
  var _firebasePromise: Promise<any> | null;
}

// 匯出一個函式，它會返回一個確保 Firebase 初始化的 Promise
export function initializeFirebase() {
  // 如果 globalThis 上已經有 Promise，表示初始化已開始或已完成，直接返回它
  if (globalThis._firebasePromise) {
    return globalThis._firebasePromise;
  }

  // 否則，建立一個新的 Promise 來處理初始化流程，並將其賦值給 globalThis._firebasePromise
  globalThis._firebasePromise = (async () => {
    // 動態載入 Firebase 模組
    const { initializeApp, getApps, getApp } = await import('firebase/app');
    const { getAuth, signInAnonymously } = await import('firebase/auth');
    const { getFirestore } = await import('firebase/firestore');

    // 從環境變數讀取 Firebase 設定
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // 初始化 Firebase app (如果尚未初始化的話)
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);

    // 只有在沒有當前使用者的情況下，才執行匿名登入
    if (!auth.currentUser) {
      try {
        await signInAnonymously(auth);
        console.log('Signed in anonymously successfully!');
      } catch (error) {
        console.error('Anonymous sign-in failed:', error);
        // 不要重設 Promise，讓它保持在 rejected 狀態以阻止重試
        throw error;
      }
    }

    // 返回初始化後的 Firebase 服務實例
    return { app, auth, db };
  })();

  // 返回這個 Promise
  return globalThis._firebasePromise;
}

// 保持其他匯出不變
export { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
