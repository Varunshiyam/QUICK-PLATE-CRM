import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import apiClient, { restaurantService, orderService, authService } from '../api';

describe('API Service unit tests', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    localStorage.clear();
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  describe('interceptors', () => {
    it('request interceptor attaches Bearer token if present in localStorage', () => {
      localStorage.setItem('sf_access_token', 'test-token');
      const handlers = apiClient.interceptors.request.handlers[0];
      const config = { headers: {} };
      const resultConfig = handlers.fulfilled(config);
      
      expect(resultConfig.headers.Authorization).toBe('Bearer test-token');
    });

    it('request interceptor does not attach token if absent', () => {
      const handlers = apiClient.interceptors.request.handlers[0];
      const config = { headers: {} };
      const resultConfig = handlers.fulfilled(config);
      
      expect(resultConfig.headers.Authorization).toBeUndefined();
    });

    it('response interceptor unwraps data', () => {
      const handlers = apiClient.interceptors.response.handlers[0];
      const response = { data: { success: true, count: 5 } };
      const result = handlers.fulfilled(response);
      
      expect(result).toEqual({ success: true, count: 5 });
    });

    it('response error interceptor handles 401 error and redirects to login', async () => {
      localStorage.setItem('sf_access_token', 'expired-token');
      const handlers = apiClient.interceptors.response.handlers[0];
      const error = {
        response: {
          status: 401,
        },
      };

      await expect(handlers.rejected(error)).rejects.toThrow();
      expect(localStorage.getItem('sf_access_token')).toBeNull();
      expect(window.location.href).toBe('/login');
    });

    it('response error interceptor passes through other errors', async () => {
      const handlers = apiClient.interceptors.response.handlers[0];
      const error = {
        response: {
          status: 500,
        },
        message: 'Internal Server Error',
      };

      await expect(handlers.rejected(error)).rejects.toEqual(error);
    });
  });

  describe('service modules placeholder implementations', () => {
    it('restaurantService methods return correct defaults', async () => {
      const all = await restaurantService.getAll();
      const one = await restaurantService.getById('123');
      expect(all).toEqual([]);
      expect(one).toBeNull();
    });

    it('orderService methods return correct defaults', async () => {
      const createRes = await orderService.create({});
      const all = await orderService.getAll();
      const one = await orderService.getById('123');
      expect(createRes).toBeNull();
      expect(all).toEqual([]);
      expect(one).toBeNull();
    });

    it('authService methods return correct defaults and clear token on logout', async () => {
      localStorage.setItem('sf_access_token', 'token-to-clear');
      const loginRes = await authService.login({});
      expect(loginRes).toBeNull();
      
      await authService.logout();
      expect(localStorage.getItem('sf_access_token')).toBeNull();
    });
  });
});
