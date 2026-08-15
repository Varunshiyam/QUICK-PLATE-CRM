// src/services/firebase.js

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import axios from 'axios';

// ─────────────────────────────────────────────
// Firebase Initialization (Safe — handles missing env vars)
// ─────────────────────────────────────────────

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app = null;
let auth = null;
let googleProvider = null;

const isFirebaseConfigured = !!firebaseConfig.apiKey;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  } catch (error) {
    console.warn('⚠️ Firebase initialization failed:', error.message);
  }
} else {
  console.warn('⚠️ Firebase not configured — missing VITE_FIREBASE_API_KEY. Auth features disabled.');
}

export { auth, googleProvider, isFirebaseConfigured };

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
  // ── Phase 1: Firebase Google Authentication ──
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error(
      'Firebase is not configured. Create a .env file with your Firebase credentials.'
    );
  }

  let user;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    user = result?.user;
  } catch (firebaseError) {
    // Translate Firebase error codes into user-friendly messages
    const code = firebaseError?.code || '';
    if (code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled — you closed the popup.');
    } else if (code === 'auth/popup-blocked') {
      throw new Error('Popup blocked by your browser. Please allow popups for this site.');
    } else if (code === 'auth/network-request-failed') {
      throw new Error('Network error — check your internet connection.');
    } else if (code === 'auth/unauthorized-domain') {
      throw new Error(
        `This domain is not authorized in Firebase. Add "${window.location.hostname}" to your Firebase Console → Authentication → Settings → Authorized domains.`
      );
    } else if (code === 'auth/invalid-api-key') {
      throw new Error('Invalid Firebase API key. Check VITE_FIREBASE_API_KEY in your .env file.');
    }
    console.error('Firebase Auth Error:', firebaseError);
    throw new Error(`Google sign-in failed: ${firebaseError.message}`);
  }

  if (!user) {
    throw new Error('Firebase returned no user data.');
  }

  // ── Phase 2: Get Firebase ID Token ──
  let idToken;
  try {
    idToken = await user.getIdToken(true);
  } catch (tokenError) {
    console.error('Token Error:', tokenError);
    throw new Error('Failed to retrieve authentication token.');
  }

  if (!idToken) {
    throw new Error('Authentication token is empty.');
  }

  // ── Phase 3: Sync with Salesforce Backend ──
  if (!API_BASE_URL) {
    // No Salesforce backend configured — return Firebase-only session
    console.warn('⚠️ No VITE_API_BASE_URL configured. Skipping Salesforce sync.');
    const firebaseOnlyUser = {
      customerId: null,
      name: user.displayName,
      email: user.email,
      profileComplete: false,
      firebaseUid: user.uid,
      photoURL: user.photoURL
    };
    localStorage.setItem('quickplate_user', JSON.stringify(firebaseOnlyUser));
    return firebaseOnlyUser;
  }

  try {
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

    // Build normalized user session object
    const sessionUser = {
      customerId: data.customerId,
      name: data.name,
      email: data.email,
      profileComplete: data.profileComplete,
      address: data.address,
      phone: data.phone,
      firebaseUid: user.uid,
      photoURL: user.photoURL,
      firebaseIdToken: idToken
    };

    localStorage.setItem(
      'quickplate_user',
      JSON.stringify(sessionUser)
    );

    return sessionUser;

  } catch (sfError) {
    // Salesforce sync failed — but Firebase auth succeeded.
    // Provide a graceful fallback so user isn't stuck.
    console.error('Salesforce Sync Error:', sfError);

    if (sfError.code === 'ECONNABORTED' || sfError.message?.includes('timeout')) {
      throw new Error('Salesforce server timed out. Please try again.');
    }
    if (sfError.code === 'ERR_NETWORK' || sfError.message?.includes('Network Error')) {
      throw new Error('Cannot reach the server. Check if Salesforce site URL is correct.');
    }
    if (sfError.response?.status === 404) {
      throw new Error('Salesforce endpoint not found. Check VITE_API_BASE_URL in .env.');
    }
    if (sfError.response?.status === 500) {
      throw new Error('Server error during authentication. Contact admin.');
    }

    throw new Error(formatError(sfError));
  }
};

// ─────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────

export const logoutUser = async () => {
  try {
    localStorage.removeItem('quickplate_user');
    if (auth) {
      await signOut(auth);
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