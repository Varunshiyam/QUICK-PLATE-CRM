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

if (!API_BASE_URL) {
  console.warn('⚠️ Missing VITE_API_BASE_URL in environment variables.');
}

// ─────────────────────────────────────────────
// Utility: Clean Error Message
// ─────────────────────────────────────────────

const formatError = (error) => {
  if (error?.response?.data) {
    return typeof error.response.data === 'string'
      ? error.response.data
      : error.response.data.message ||
        error.response.data.error ||
        JSON.stringify(error.response.data);
  }

  return error.message || 'Authentication failed.';
};

// ─────────────────────────────────────────────
// Login + Sync With Salesforce
// ─────────────────────────────────────────────

export const signInWithGoogleAndSync = async () => {
  try {
    if (!API_BASE_URL) {
      throw new Error('API base URL not configured.');
    }

    // 1️⃣ Firebase Login
    const result = await signInWithPopup(auth, googleProvider);
    const user = result?.user;

    if (!user) {
      throw new Error('Firebase login failed.');
    }

    // 2️⃣ Get Firebase ID Token
    const idToken = await user.getIdToken(true);

    if (!idToken) {
      throw new Error('Failed to retrieve Firebase ID token.');
    }

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

    const data = response?.data;

    if (!data || !data.success || !data.customerId) {
      throw new Error(
        data?.message || 'Salesforce authentication failed.'
      );
    }

    // 4️⃣ Build normalized user session object
    const sessionUser = {
      customerId: data.customerId,
      name: data.name,
      email: data.email,
      profileComplete: data.profileComplete,
      firebaseUid: user.uid,
      photoURL: user.photoURL
    };

    // 5️⃣ Store in localStorage
    localStorage.setItem(
      'quickplate_user',
      JSON.stringify(sessionUser)
    );

    return sessionUser;

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

// ─────────────────────────────────────────────
// Get Current Stored User
// ─────────────────────────────────────────────

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('quickplate_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};