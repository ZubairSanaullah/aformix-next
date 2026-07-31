import { useState, useEffect } from 'react';

export type LaunchState = 'countdown' | 'loader' | 'celebration' | 'launched';

export const LAUNCH_DATE = new Date('2026-06-22T00:00:00').getTime();
export const END_CELEBRATION_DATE = new Date('2026-06-25T00:00:00').getTime();

export function useLaunchStatus() {
  const [isBypassed, setIsBypassed] = useState<boolean>(() => {
    return typeof window !== 'undefined' && localStorage.getItem('aformix_launch_bypass') === 'true';
  });
  
  const [launchState, setLaunchState] = useState<LaunchState>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('aformix_launch_bypass') === 'true') {
      return 'launched';
    }
    const now = Date.now();
    if (now >= END_CELEBRATION_DATE) return 'launched';
    return 'countdown';
  });

  useEffect(() => {
    if (isBypassed) return;
    const now = Date.now();
    if (now >= END_CELEBRATION_DATE) {
      if (launchState !== 'launched') setLaunchState('launched');
    } else if (now >= LAUNCH_DATE && now < END_CELEBRATION_DATE) {
      // In the celebration window. Start with loader.
      setLaunchState('loader');
      
      const loaderTimer = setTimeout(() => {
        setLaunchState('celebration');
        
        const celebrationTimer = setTimeout(() => {
          setLaunchState('launched');
        }, 4000); // 4 seconds of celebration
        
        return () => clearTimeout(celebrationTimer);
      }, 2000); // 2 seconds of loader

      return () => clearTimeout(loaderTimer);
    } else {
      // Before launch
      if (launchState !== 'countdown') setLaunchState('countdown');
    }
  }, [isBypassed]);

  useEffect(() => {
    // Keyboard shortcut listener for bypass
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        localStorage.setItem('aformix_launch_bypass', 'true');
        setIsBypassed(true);
        setLaunchState('launched');
        console.log("Bypass activated.");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { launchState, isBypassed };
}
