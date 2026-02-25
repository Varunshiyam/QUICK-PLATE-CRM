import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Pages
import Landing from './pages/Landing/Landing';
import Features from './pages/Features/Features';
import Onboarding from './pages/Onboarding/Onboarding';

// Lazy-loaded pages (will be created as mockups arrive)
const Home = lazy(() => import('./pages/Home/Home'));
const Restaurant = lazy(() => import('./pages/Restaurant/Restaurant'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
// const Orders = lazy(() => import('./pages/Orders/Orders'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
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
    background: '#FDFCFB',
  }}>
    <div style={{
      width: 48,
      height: 48,
      border: '3px solid #f1f3f5',
      borderTopColor: '#fb7e18',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{
      fontFamily: 'Epilogue, sans-serif',
      fontWeight: 700,
      color: '#2D3134',
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
            background: '#2D3134',
            color: '#fff',
            fontSize: '0.875rem',
            fontFamily: 'Outfit, sans-serif',
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
            <Route path="/" element={<Landing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            {/* More routes will be added as pages are built */}
          </Routes>
        </AnimatePresence>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
