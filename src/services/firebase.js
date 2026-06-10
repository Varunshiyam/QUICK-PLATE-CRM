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

const isConfigValid = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your_firebase_api_key' &&
  !firebaseConfig.apiKey.startsWith('your_') &&
  firebaseConfig.apiKey !== 'undefined' &&
  firebaseConfig.apiKey.trim() !== '';

let app;
let realAuth;
let isFirebaseMocked = false;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    realAuth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization failed, enabling Mock Auth mode:", error);
    isFirebaseMocked = true;
  }
} else {
  console.warn("⚠️ Firebase credentials missing or invalid in environment. Enabling Auth Mock Mode.");
  isFirebaseMocked = true;
}

export const auth = isFirebaseMocked ? {
  currentUser: {
    uid: 'mock_uid_123',
    displayName: 'John Doe (Demo)',
    email: 'john.doe@example.com',
    photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxxnLZB4L4bLxchHeLZCCq3Lvq6vr4bzfPUp8VTZQ1gAfTTrCvF9aS3hIvFSSIw1ic8QXQ2xlKR4XrB3_rDYjHaPQvjTucWE22lkmXd2OIWXGGXANk5z4j6JKEmQRuP0sZcYHjAafhHfbgJqaB2Lcf-zQ4llzoKpkxiGMr_37Edrqf2chGZ-yfZXcy-5sUl1L_VLZA549jFBmkyUmR80Jr8fsLJRAMBLMq1fBZh9ADsDTa-fAYcZH-HEnjfUnfBHuWcxT6QaCUniXf',
    getIdToken: async () => 'mock_firebase_id_token'
  }
} : realAuth;

export const googleProvider = isFirebaseMocked ? {
  setCustomParameters: () => {}
} : new GoogleAuthProvider();

if (!isFirebaseMocked) {
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

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
  if (isFirebaseMocked) {
    console.log('Sign in triggered in Mock Auth mode');
    const sessionUser = {
      customerId: 'mock_customer_id',
      name: 'John Doe (Demo)',
      email: 'john.doe@example.com',
      profileComplete: true,
      firebaseUid: 'mock_uid_123',
      photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxxnLZB4L4bLxchHeLZCCq3Lvq6vr4bzfPUp8VTZQ1gAfTTrCvF9aS3hIvFSSIw1ic8QXQ2xlKR4XrB3_rDYjHaPQvjTucWE22lkmXd2OIWXGGXANk5z4j6JKEmQRuP0sZcYHjAafhHfbgJqaB2Lcf-zQ4llzoKpkxiGMr_37Edrqf2chGZ-yfZXcy-5sUl1L_VLZA549jFBmkyUmR80Jr8fsLJRAMBLMq1fBZh9ADsDTa-fAYcZH-HEnjfUnfBHuWcxT6QaCUniXf'
    };
    localStorage.setItem('quickplate_user', JSON.stringify(sessionUser));
    return sessionUser;
  }

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
    if (!isFirebaseMocked) {
      await signOut(auth);
    } else {
      console.log('Mock user logged out');
    }
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