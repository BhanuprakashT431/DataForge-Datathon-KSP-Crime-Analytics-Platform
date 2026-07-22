import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config for project: datathon-eedde (Datathon)
const firebaseConfig = {
  apiKey: "AIzaSyDyOZUNY0jnkEFT3p4E8h3kg5Oj78b7cLc",
  authDomain: "datathon-eedde.firebaseapp.com",
  projectId: "datathon-eedde",
  storageBucket: "datathon-eedde.firebasestorage.app",
  messagingSenderId: "261942891246",
  appId: "1:261942891246:web:c942a17b01725ce79e59ff",
  measurementId: "G-HKYQE85BGB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
