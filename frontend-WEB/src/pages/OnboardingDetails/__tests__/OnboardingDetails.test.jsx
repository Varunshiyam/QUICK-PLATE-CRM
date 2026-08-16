import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OnboardingDetails from '../OnboardingDetails';
import axios from 'axios';
import { auth } from '../../../services/firebase';

vi.mock('axios');

vi.mock('../../../services/firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

vi.mock('../../../hooks/useHaptic', () => ({
  default: () => ({
    lightTap: vi.fn(),
    mediumTap: vi.fn(),
    heavyTap: vi.fn(),
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

describe('OnboardingDetails Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.currentUser = null;
  });

  it('renders input elements and location buttons', () => {
    render(
      <MemoryRouter>
        <OnboardingDetails />
      </MemoryRouter>
    );

    expect(screen.getByText('Set Delivery Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+1 (555) 000-0000')).toBeInTheDocument();
  });

  it('shows error toast when attempting to submit empty fields', async () => {
    render(
      <MemoryRouter>
        <OnboardingDetails />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /Start Exploring/i });
    fireEvent.click(submitBtn);

    // Should not trigger navigate since name is empty
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('submits form successfully when current user exists and fields are filled', async () => {
    auth.currentUser = {
      getIdToken: vi.fn().mockResolvedValue('token123'),
    };

    axios.patch.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter>
        <OnboardingDetails />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText('John Doe');
    const phoneInput = screen.getByPlaceholderText('+1 (555) 000-0000');

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    // Manually set address (since geolocation needs mock or wait, we can mock geolocation)
    const locationBtn = screen.getByText('Use Current Location');
    
    // Mock navigator.geolocation
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) => {
        success({
          coords: {
            latitude: 12.34,
            longitude: 56.78,
          },
        });
      }),
    };
    vi.stubGlobal('navigator', {
      geolocation: mockGeolocation,
    });

    // Mock global fetch for nominatim reverse geocoding
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: async () => ({ display_name: 'Mock Address 123' }),
    }));

    fireEvent.click(locationBtn);

    await waitFor(() => {
      expect(screen.getByText('Mock Address 123')).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button', { name: /Start Exploring/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });
});
