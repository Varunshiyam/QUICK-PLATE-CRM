import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Onboarding from '../Onboarding';
import useAppStore from '../../../store/useAppStore';

vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const mockSignInGoogle = vi.fn();
vi.mock('../../../services/firebase', () => ({
  signInWithGoogleAndSync: () => mockSignInGoogle(),
}));

vi.mock('../../../hooks/useHaptic', () => ({
  default: () => ({
    lightTap: vi.fn(),
    mediumTap: vi.fn(),
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Onboarding Component Tests', () => {
  it('renders onboarding titles and Google login button', () => {
    render(
      <MemoryRouter>
        <Onboarding />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick Plate/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In with Google/i)).toBeInTheDocument();
  });

  it('triggers authentication flow and navigates to onboarding-details if profile is incomplete', async () => {
    mockSignInGoogle.mockResolvedValueOnce({
      firebaseUid: '123',
      customerId: 'CUST-01',
      name: 'John Doe',
      email: 'john@example.com',
      photoURL: 'pic.jpg',
      profileComplete: false,
    });

    render(
      <MemoryRouter>
        <Onboarding />
      </MemoryRouter>
    );

    const googleBtn = screen.getByRole('button', { name: /Sign In with Google/i });
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(mockSignInGoogle).toHaveBeenCalled();
      expect(useAppStore.getState().user).toEqual({
        uid: '123',
        customerId: 'CUST-01',
        displayName: 'John Doe',
        email: 'john@example.com',
        photoURL: 'pic.jpg',
        method: 'google',
        profileComplete: false,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding-details');
    });
  });

  it('navigates directly to home if profile is complete', async () => {
    mockSignInGoogle.mockResolvedValueOnce({
      firebaseUid: '123',
      customerId: 'CUST-01',
      name: 'John Doe',
      email: 'john@example.com',
      photoURL: 'pic.jpg',
      profileComplete: true,
    });

    render(
      <MemoryRouter>
        <Onboarding />
      </MemoryRouter>
    );

    const googleBtn = screen.getByRole('button', { name: /Sign In with Google/i });
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });
});
