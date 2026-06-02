import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Orders from '../Orders';
import axios from 'axios';

vi.mock('axios');

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

describe('Orders Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders mock orders when in mock mode (no API base URL)', async () => {
    const { container } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    // Initial loading indicator
    expect(container.querySelector('.orders-spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Joe's Pizza")).toBeInTheDocument();
      expect(screen.getByText("The Burger Joint")).toBeInTheDocument();
    });
  });

  it('toggles tabs between orders and support tickets', async () => {
    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Joe's Pizza")).toBeInTheDocument();
    });

    const ticketsTab = screen.getByText('Support Tickets');
    fireEvent.click(ticketsTab);

    expect(screen.getByText('Active Tickets')).toBeInTheDocument();
    expect(screen.getByText('Past Tickets')).toBeInTheDocument();
  });
});
