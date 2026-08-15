import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Features from '../Features';

// Mock framer-motion to avoid jsdom layout animation warnings/errors
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, whileInView, viewport, custom, variants, ...props }, ref) => (
      <div ref={ref} {...props}>{children}</div>
    )),
    h1: React.forwardRef(({ children, ...props }, ref) => (
      <h1 ref={ref} {...props}>{children}</h1>
    )),
    p: React.forwardRef(({ children, ...props }, ref) => (
      <p ref={ref} {...props}>{children}</p>
    )),
    button: React.forwardRef(({ children, whileTap, ...props }, ref) => (
      <button ref={ref} {...props}>{children}</button>
    )),
  },
}));

// Mock useHaptic hook
const mockLightTap = vi.fn();
vi.mock('../../../hooks/useHaptic', () => ({
  default: () => ({
    lightTap: mockLightTap,
    mediumTap: vi.fn(),
    heavyTap: vi.fn(),
  }),
}));

describe('Features component tests', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Features />
      </MemoryRouter>
    );
  };

  it('renders header, hero and enterprise badge', () => {
    renderComponent();
    
    expect(screen.getByText('QP')).toBeInTheDocument();
    
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    const activeLink = screen.getByRole('link', { name: 'Features' });
    expect(activeLink).toBeInTheDocument();
    expect(activeLink).toHaveClass('active');
    
    expect(screen.getByText(/Enterprise Capabilities/i)).toBeInTheDocument();
    expect(screen.getByText(/Built for/i)).toBeInTheDocument();
    expect(screen.getByText(/Scale/i)).toBeInTheDocument();
    expect(screen.getByText(/12 production-grade features/i)).toBeInTheDocument();
  });

  it('renders all 12 features in the grid', () => {
    renderComponent();
    
    expect(screen.getByText('Refund Governance')).toBeInTheDocument();
    expect(screen.getByText('Stripe Payments')).toBeInTheDocument();
    expect(screen.getByText('Smart Delivery Engine')).toBeInTheDocument();
    expect(screen.getByText('Order State Machine')).toBeInTheDocument();
    expect(screen.getByText('Wallet Credits')).toBeInTheDocument();
    expect(screen.getByText('Queue Routing')).toBeInTheDocument();
    expect(screen.getByText('Refund Timeline')).toBeInTheDocument();
    expect(screen.getByText('Role-Based Access')).toBeInTheDocument();
    expect(screen.getByText('API-First Design')).toBeInTheDocument();
    expect(screen.getByText('Audit Trail')).toBeInTheDocument();
    expect(screen.getByText('SLA & Escalation')).toBeInTheDocument();
    expect(screen.getByText('Production Backend')).toBeInTheDocument();
  });

  it('triggers haptic feedback when clicking navigation links or buttons', () => {
    renderComponent();
    
    const homeLink = screen.getByRole('link', { name: 'Home' });
    fireEvent.click(homeLink);
    expect(mockLightTap).toHaveBeenCalled();

    const backButton = screen.getByRole('button', { name: /Back to Home/i });
    fireEvent.click(backButton);
    expect(mockLightTap).toHaveBeenCalled();
  });
});
