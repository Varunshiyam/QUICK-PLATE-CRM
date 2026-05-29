import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import useAppStore from '../store/useAppStore';

/**
 * Route guard component that restricts access to authenticated users.
 * Reads authentication status from Zustand store and verifies Firebase Token.
 * Redirects unauthenticated users to '/onboarding'.
 */
export default function AuthGuard({ children }) {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const logout = useAppStore((state) => state.logout);
  const [isChecking, setIsChecking] = useState(true);
  const [hasValidToken, setHasValidToken] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Authenticate using the Firebase Token
          const token = await user.getIdToken();
          if (token) {
            setHasValidToken(true);
          } else {
            setHasValidToken(false);
            logout();
          }
        } catch (error) {
          console.error('Firebase token verification failed:', error);
          setHasValidToken(false);
          logout();
        }
      } else {
        setHasValidToken(false);
      }
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, [logout]);

  if (isChecking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh' }}>
        <div style={{
          width: 48,
          height: 48,
          border: '3px solid #f1f3f5',
          borderTopColor: '#fb7e18',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated || !hasValidToken) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
