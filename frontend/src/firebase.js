import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API,
  authDomain: "speakers-management.firebaseapp.com",
  projectId: "speakers-management",
  storageBucket: "speakers-management.appspot.com",
  messagingSenderId: "486481790553",
  appId: "1:486481790553:web:e4db13b69f34342cc51348",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);
