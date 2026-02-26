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
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// ─────────────────────────────────────────────
// Salesforce Public API Base URL
// ─────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');

// ─────────────────────────────────────────────
// Utility: Clean Error Message
// ─────────────────────────────────────────────

const formatError = (error) => {
  if (error?.response?.data) {
    return typeof error.response.data === 'string'
      ? error.response.data
      : error.response.data.message || JSON.stringify(error.response.data);
  }

  return error.message || 'Authentication failed.';
};

// ─────────────────────────────────────────────
// Login + Sync With Salesforce
// ─────────────────────────────────────────────

export const signInWithGoogleAndSync = async () => {
  try {
    if (!API_BASE_URL) {
      throw new Error('Missing VITE_API_BASE_URL.');
    }

    // 1️⃣ Firebase Login
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (!user) {
      throw new Error('Firebase login failed.');
    }

    // 2️⃣ Get Firebase ID Token
    const idToken = await user.getIdToken(true);

    // 3️⃣ Send token to Salesforce Public Site
    const response = await axios.post(
      `${API_BASE_URL}/services/apexrest/auth/firebase`,
      { idToken },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    if (!response.data || !response.data.customerId) {
      throw new Error('Salesforce authentication failed.');
    }

    // 4️⃣ Store minimal session info (optional)
    localStorage.setItem(
      'quickplate_user',
      JSON.stringify({
        customerId: response.data.customerId,
        name: response.data.name,
        email: response.data.email
      })
    );

    // 5️⃣ Return normalized user object
    return {
      customerId: response.data.customerId,
      name: response.data.name,
      email: response.data.email,
      firebaseUid: user.uid,
      photoURL: user.photoURL
    };

  } catch (error) {
    console.error('Login & Sync Error:', error);
    throw new Error(formatError(error));
  }
};

// ─────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────

export const logoutUser = async () => {
  try {
    localStorage.removeItem('quickplate_user');
    await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};