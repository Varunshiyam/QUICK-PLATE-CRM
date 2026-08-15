import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useHaptic from '../useHaptic';

describe('useHaptic hook unit tests', () => {
  let originalVibrate;

  beforeEach(() => {
    originalVibrate = navigator.vibrate;
  });

  afterEach(() => {
    if (originalVibrate !== undefined) {
      navigator.vibrate = originalVibrate;
    } else {
      delete navigator.vibrate;
    }
  });

  it('should detect when vibrate is not supported', () => {
    if ('vibrate' in navigator) {
      delete navigator.vibrate;
    }
    
    const { isSupported, lightTap } = useHaptic();
    expect(isSupported).toBe(false);

    expect(() => lightTap()).not.toThrow();
  });

  it('should detect when vibrate is supported and invoke navigator.vibrate', () => {
    navigator.vibrate = vi.fn();
    
    const { isSupported, lightTap, mediumTap, heavyTap, success, error, notification } = useHaptic();
    expect(isSupported).toBe(true);

    lightTap();
    expect(navigator.vibrate).toHaveBeenCalledWith(10);

    mediumTap();
    expect(navigator.vibrate).toHaveBeenCalledWith(25);

    heavyTap();
    expect(navigator.vibrate).toHaveBeenCalledWith(50);

    success();
    expect(navigator.vibrate).toHaveBeenCalledWith([10, 50, 20, 50, 10]);

    error();
    expect(navigator.vibrate).toHaveBeenCalledWith([50, 100, 50]);

    notification();
    expect(navigator.vibrate).toHaveBeenCalledWith([15, 30, 15]);
  });
});
