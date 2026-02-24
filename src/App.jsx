import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Lazy-loaded pages (will be created as mockups arrive)
// const Home = lazy(() => import('./pages/Home/Home'));
// const Restaurant = lazy(() => import('./pages/Restaurant/Restaurant'));
// const Cart = lazy(() => import('./pages/Cart/Cart'));
// const Orders = lazy(() => import('./pages/Orders/Orders'));
// const Profile = lazy(() => import('./pages/Profile/Profile'));
// const Search = lazy(() => import('./pages/Search/Search'));
// const Tracking = lazy(() => import('./pages/Tracking/Tracking'));

/** Loading fallback */
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100dvh',
    gap: '1rem',
  }}>
    <div style={{
      width: 48,
      height: 48,
      border: '3px solid #f1f3f5',
      borderTopColor: '#FF6B35',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontWeight: 600,
      color: '#343A40',
      fontSize: '0.875rem',
    }}>
      Loading Quick Plate...
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#2D3436',
            color: '#fff',
            fontSize: '0.875rem',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 500,
            padding: '12px 20px',
          },
          success: {
            iconTheme: { primary: '#00B894', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#FF7675', secondary: '#fff' },
          },
        }}
      />
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Routes will be added as pages are built from mockups */}
            <Route
              path="/"
              element={
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100dvh',
                  textAlign: 'center',
                  padding: '2rem',
                  gap: '1rem',
                }}>
                  <h1 style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 800,
                    fontSize: '2.25rem',
                    color: '#FF6B35',
                  }}>
                    🍽️ Quick Plate
                  </h1>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#868E96',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  }}>
                    Project initialized successfully!<br />
                    Awaiting design mockups to build screens.
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #FF6B35, #E55A2B)',
                    color: '#fff',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}>
                    ✅ React + Vite Ready
                  </div>
                </div>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
