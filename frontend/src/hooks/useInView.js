import { useEffect, useRef, useState } from 'react';

/**
 * Returns a [ref, isInView] pair.
 * Once the element enters the viewport it stays "in view" (no re-trigger on scroll back).
 *
 * @param {IntersectionObserverInit} options - standard IntersectionObserver options
 */
export default function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el); 
        }
      },
      { threshold: 0.12, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}
