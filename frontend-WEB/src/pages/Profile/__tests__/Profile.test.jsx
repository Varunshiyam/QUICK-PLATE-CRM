import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../Profile';
import useAppStore from '../../../store/useAppStore';
import { logoutUser } from '../../../services/firebase';

vi.mock('axios');

vi.mock('framer-motion', () => ({
  motion: {
    section: React.forwardRef(({ children, ...props }, ref) => <section ref={ref} {...props}>{children}</section>),
  },
}));

vi.mock('../../../services/firebase', () => ({
  logoutUser: vi.fn().mockResolvedValue(true),
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

describe('Profile Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAppStore.setState({
      user: {
        displayName: 'Foodie Pro',
        email: 'pro@quickplate.com',
        photoURL: 'profile_pic.png',
      },
    });
  });

  it('renders user credentials and logout actions', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText('Foodie Pro')).toBeInTheDocument();
    expect(screen.getByText('pro@quickplate.com')).toBeInTheDocument();
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });

  it('handles user logout successfully and redirects to landing page', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByText('Log Out');
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
