import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';

// Replace the placeholder values with your actual Firebase configuration from the Firebase Console
// You can find this in Project Settings > General > Your apps (Web app)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// To add data to Firebase:
// 1. Log in to https://console.firebase.google.com/
// 2. Select your project.
// 3. Go to "Firestore Database" in the left menu.
// 4. Click "Create Database" (select a region near you).
// 5. Select "Start in test mode" (but remember to update your rules later for security!).
// 6. You can now add collections (e.g., 'posts', 'users') and documents directly from the UI.

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Example function to add a post to Firestore
export const addPostToFirebase = async (postData: any) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: new Date().toISOString()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
