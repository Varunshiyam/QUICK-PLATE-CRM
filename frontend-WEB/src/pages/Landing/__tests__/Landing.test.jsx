import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from '../Landing';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    nav: React.forwardRef(({ children, ...props }, ref) => <nav ref={ref} {...props}>{children}</nav>),
    h1: React.forwardRef(({ children, ...props }, ref) => <h1 ref={ref} {...props}>{children}</h1>),
    p: React.forwardRef(({ children, ...props }, ref) => <p ref={ref} {...props}>{children}</p>),
    div: React.forwardRef(({ children, whileInView, viewport, custom, variants, ...props }, ref) => (
      <div ref={ref} {...props}>{children}</div>
    )),
    button: React.forwardRef(({ children, whileTap, whileHover, ...props }, ref) => (
      <button ref={ref} {...props}>{children}</button>
    )),
  },
  useInView: () => true,
}));

// Mock useHaptic
const mockLightTap = vi.fn();
const mockMediumTap = vi.fn();
vi.mock('../../../hooks/useHaptic', () => ({
  default: () => ({
    lightTap: mockLightTap,
    mediumTap: mockMediumTap,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Landing Component Tests', () => {
  it('renders header, title, and cta buttons', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    expect(screen.getByText('QP')).toBeInTheDocument();
    expect(screen.getByText('QUICK')).toBeInTheDocument();
    expect(screen.getByText('PLATE')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Download App')).toBeInTheDocument();
  });

  it('navigates to onboarding on Get Started click', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    const getStartedBtn = screen.getByRole('button', { name: 'Get Started' });
    fireEvent.click(getStartedBtn);
    
    expect(mockMediumTap).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
  });

  it('triggers haptic feedback on download app click', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    const downloadBtn = screen.getByRole('button', { name: 'Download App' });
    fireEvent.click(downloadBtn);
    
    expect(mockLightTap).toHaveBeenCalled();
  });
});
