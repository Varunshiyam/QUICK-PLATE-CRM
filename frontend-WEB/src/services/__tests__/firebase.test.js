import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn().mockReturnValue({}),
}));

const mockSignInWithPopup = vi.fn();
const mockSignOut = vi.fn();

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn().mockReturnValue({ currentUser: null }),
  GoogleAuthProvider: class {
    setCustomParameters = vi.fn();
  },
  signInWithPopup: mockSignInWithPopup,
  signOut: mockSignOut,
}));

// Set environment variables BEFORE importing firebase.js
import.meta.env.VITE_FIREBASE_API_KEY = 'mock-api-key';
import.meta.env.VITE_API_BASE_URL = 'https://api.quickplate.com';

import { signInWithGoogleAndSync, logoutUser, getStoredUser } from '../firebase';
import axiosMock from 'axios';

describe('Firebase Service unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('signInWithGoogleAndSync', () => {
    it('successfully signs in with Google and syncs with Salesforce', async () => {
      const mockIdToken = 'mock-firebase-token';
      const mockFirebaseUser = {
        displayName: 'John Doe',
        email: 'john@example.com',
        uid: 'firebase-uid-123',
        photoURL: 'photo.png',
        getIdToken: vi.fn().mockResolvedValue(mockIdToken),
      };

      mockSignInWithPopup.mockResolvedValueOnce({ user: mockFirebaseUser });

      axiosMock.post.mockResolvedValueOnce({
        data: {
          success: true,
          customerId: 'CUST-007',
          name: 'John Doe',
          email: 'john@example.com',
          profileComplete: true,
        },
      });

      const result = await signInWithGoogleAndSync();

      expect(mockSignInWithPopup).toHaveBeenCalled();
      expect(mockFirebaseUser.getIdToken).toHaveBeenCalledWith(true);
      expect(axiosMock.post).toHaveBeenCalledWith(
        'https://api.quickplate.com/services/apexrest/auth/firebase',
        { idToken: mockIdToken },
        expect.any(Object)
      );
      expect(result).toEqual({
        customerId: 'CUST-007',
        name: 'John Doe',
        email: 'john@example.com',
        profileComplete: true,
        firebaseUid: 'firebase-uid-123',
        photoURL: 'photo.png',
        firebaseIdToken: mockIdToken,
      });

      expect(JSON.parse(localStorage.getItem('quickplate_user'))).toEqual(result);
    });

    it('handles Firebase popup-closed error user-friendly translation', async () => {
      const authError = new Error('Sign-in cancelled');
      authError.code = 'auth/popup-closed-by-user';
      mockSignInWithPopup.mockRejectedValueOnce(authError);

      await expect(signInWithGoogleAndSync()).rejects.toThrow('Sign-in cancelled — you closed the popup.');
    });

    it('handles Firebase popup-blocked error user-friendly translation', async () => {
      const authError = new Error('Popup blocked');
      authError.code = 'auth/popup-blocked';
      mockSignInWithPopup.mockRejectedValueOnce(authError);

      await expect(signInWithGoogleAndSync()).rejects.toThrow('Popup blocked by your browser. Please allow popups for this site.');
    });

    it('handles generic Firebase errors gracefully', async () => {
      const authError = new Error('Some Firebase failure');
      mockSignInWithPopup.mockRejectedValueOnce(authError);

      await expect(signInWithGoogleAndSync()).rejects.toThrow('Google sign-in failed: Some Firebase failure');
    });

    it('throws error if Salesforce auth sync returns failure', async () => {
      const mockIdToken = 'mock-firebase-token';
      const mockFirebaseUser = {
        displayName: 'John Doe',
        email: 'john@example.com',
        uid: 'firebase-uid-123',
        photoURL: 'photo.png',
        getIdToken: vi.fn().mockResolvedValue(mockIdToken),
      };

      mockSignInWithPopup.mockResolvedValueOnce({ user: mockFirebaseUser });

      axiosMock.post.mockResolvedValueOnce({
        data: {
          success: false,
          message: 'Account not active',
        },
      });

      await expect(signInWithGoogleAndSync()).rejects.toThrow('Account not active');
    });
  });

  describe('logoutUser', () => {
    it('clears local storage user and signs out from auth service', async () => {
      localStorage.setItem('quickplate_user', JSON.stringify({ customerId: 'CUST-123' }));
      await logoutUser();

      expect(localStorage.getItem('quickplate_user')).toBeNull();
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('getStoredUser', () => {
    it('returns parsed user from localStorage', () => {
      const userObj = { name: 'Alice', customerId: 'CUST-999' };
      localStorage.setItem('quickplate_user', JSON.stringify(userObj));

      expect(getStoredUser()).toEqual(userObj);
    });

    it('returns null if no user is stored', () => {
      expect(getStoredUser()).toBeNull();
    });
  });
});
