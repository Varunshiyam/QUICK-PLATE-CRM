import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchRestaurants } from '../restaurantService';

describe('restaurantService unit tests', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch restaurants successfully', async () => {
    const mockData = [
      { id: '1', name: 'Restaurant A', city: 'Bangalore' },
      { id: '2', name: 'Restaurant B', city: 'Mumbai' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const result = await fetchRestaurants();

    expect(fetch).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('should throw an error if the response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(fetchRestaurants()).rejects.toThrow('HTTP error! status: 500');
    expect(console.error).toHaveBeenCalled();
  });

  it('should throw and log if fetch throws network/connection error', async () => {
    const networkError = new Error('Network failure');
    fetch.mockRejectedValueOnce(networkError);

    await expect(fetchRestaurants()).rejects.toThrow('Network failure');
    expect(console.error).toHaveBeenCalledWith('Failed to fetch restaurants:', networkError);
  });
});
