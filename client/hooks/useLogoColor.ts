import { useState, useEffect } from 'react';

interface UseLogoColorReturn {
  scrolled: boolean;
  logoColor: string;
}

export function useLogoColor(): UseLogoColorReturn {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    scrolled,
    logoColor: scrolled ? '#425381' : '#FFFFFF',
  };
}
