import { describe, it, expect, vi } from 'vitest';
import {
  formatPrice,
  formatDistance,
  formatDeliveryTime,
  truncateText,
  debounce,
  generateId,
  isMobile
} from '../helpers';

describe('helpers.js unit tests', () => {
  describe('formatPrice', () => {
    it('should format amount as INR currency', () => {
      const result = formatPrice(500);
      expect(result).toContain('500');
      expect(result).toMatch(/₹/);
    });
  });

  describe('formatDistance', () => {
    it('should format meters when distance is less than 1 km', () => {
      expect(formatDistance(0.5)).toBe('500m');
      expect(formatDistance(0.125)).toBe('125m');
    });

    it('should format km with one decimal place when distance is 1 km or more', () => {
      expect(formatDistance(1.5)).toBe('1.5 km');
      expect(formatDistance(5)).toBe('5.0 km');
      expect(formatDistance(12.345)).toBe('12.3 km');
    });
  });

  describe('formatDeliveryTime', () => {
    it('should format minutes only if less than 60 minutes', () => {
      expect(formatDeliveryTime(45)).toBe('45 min');
      expect(formatDeliveryTime(59)).toBe('59 min');
    });

    it('should format hours only if exactly divisible by 60', () => {
      expect(formatDeliveryTime(60)).toBe('1h');
      expect(formatDeliveryTime(120)).toBe('2h');
    });

    it('should format hours and minutes if greater than 60 and not exact hour', () => {
      expect(formatDeliveryTime(75)).toBe('1h 15m');
      expect(formatDeliveryTime(130)).toBe('2h 10m');
    });
  });

  describe('truncateText', () => {
    it('should return original text if length is within limit', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
      expect(truncateText('', 10)).toBe('');
      expect(truncateText(null)).toBeNull();
    });

    it('should truncate and add ellipsis if text exceeds limit', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
    });

    it('should use default maxLength of 50 if not specified', () => {
      const longText = 'a'.repeat(60);
      expect(truncateText(longText).length).toBe(53); // 50 chars + 3 dots
      expect(truncateText(longText)).toMatch(/\.\.\.$/);
    });
  });

  describe('debounce', () => {
    it('should delay the execution of the function', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 300);

      debouncedFn('test');
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(299);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledWith('test');
      vi.useRealTimers();
    });

    it('should only execute once for multiple fast calls', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 300);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      vi.advanceTimersByTime(300);
      expect(fn).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });
  });

  describe('generateId', () => {
    it('should return a unique string ID containing a dash', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1).toContain('-');
    });
  });

  describe('isMobile', () => {
    it('should return true for mobile user agents', () => {
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        writable: true,
        configurable: true
      });
      expect(isMobile()).toBe(true);

      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        writable: true,
        configurable: true
      });
    });

    it('should return false for desktop user agents', () => {
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.83 Safari/537.36',
        writable: true,
        configurable: true
      });
      expect(isMobile()).toBe(false);

      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        writable: true,
        configurable: true
      });
    });
  });
});
