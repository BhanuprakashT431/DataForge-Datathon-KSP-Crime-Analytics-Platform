import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase config for project: datathon-67fcd
const firebaseConfig = {
  apiKey: "AIzaSyDHmgbSD6jM4jRhhzfPQox1p9v_oM_g6FM",
  authDomain: "datathon-67fcd.firebaseapp.com",
  projectId: "datathon-67fcd",
  storageBucket: "datathon-67fcd.firebasestorage.app",
  messagingSenderId: "531384080992",
  appId: "1:531384080992:web:89d91cca06f497073f4105",
  measurementId: "G-VLK2S86R59"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export default app;
