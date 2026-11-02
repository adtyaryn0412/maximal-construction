import useInView from '../../hooks/useInView';

/**
 * Wraps children with a scroll-triggered reveal animation.
 *
 * Props:
 *  - variant: 'up' | 'left' | 'right' | 'fade'  (default: 'up')
 *  - delay:   tailwind delay class e.g. 'delay-100' (default: '')
 *  - className: extra classes on the wrapper div
 *  - threshold: IntersectionObserver threshold (default: 0.12)
 */
export default function ScrollReveal({
  children,
  variant = 'up',
  delay = '',
  className = '',
  threshold,
}) {
  const [ref, inView] = useInView(threshold ? { threshold } : {});

  const base = 'transition-all duration-700 ease-out';

  const variants = {
    up:    `${base} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`,
    left:  `${base} ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`,
    right: `${base} ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`,
    fade:  `${base} ${inView ? 'opacity-100'               : 'opacity-0'}`,
  };

  return (
    <div ref={ref} className={`${variants[variant]} ${delay} ${className}`}>
      {children}
    </div>
  );
}
