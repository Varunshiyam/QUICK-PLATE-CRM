// src/firebase.js

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import axios from 'axios';

// ─────────────────────────────────────────────
// Firebase Initialization
// ─────────────────────────────────────────────

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ─────────────────────────────────────────────
// Salesforce Backend Base URL
// ─────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─────────────────────────────────────────────
// Login + Sync With Salesforce
// ─────────────────────────────────────────────

export const signInWithGoogleAndSync = async () => {
  try {
    // 1️⃣ Login with Firebase
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (!user) {
      throw new Error('Firebase login failed.');
    }

    // 2️⃣ Get Firebase ID Token
    const idToken = await user.getIdToken();

    // 3️⃣ Send token to Salesforce for verification & upsert
    const response = await axios.post(
      `${API_BASE_URL}/services/apexrest/auth/firebase`,
      { idToken },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data || !response.data.customerId) {
      throw new Error('Salesforce authentication failed.');
    }

    // 4️⃣ Return normalized user object
    return {
      customerId: response.data.customerId,
      name: response.data.name,
      email: response.data.email,
      firebaseUid: user.uid,
      photoURL: user.photoURL
    };

  } catch (error) {
    console.error('Login & Sync Error:', error);
    throw error;
  }
};

// ─────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};