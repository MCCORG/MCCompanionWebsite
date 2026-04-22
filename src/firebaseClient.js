import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDagxbLCjjUSnEG-KpiPyrXVKSb9i6cxXQ",
  authDomain: "netherlinkadmin.firebaseapp.com",
  projectId: "netherlinkadmin",
  storageBucket: "netherlinkadmin.firebasestorage.app",
  messagingSenderId: "670852401318",
  appId: "1:670852401318:web:2ad57d7d34847b03004c67",
};

let auth = null;

if (typeof window !== "undefined") {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn("Failed to set Firebase persistence:", err);
  });
}

export { auth };
export default auth;