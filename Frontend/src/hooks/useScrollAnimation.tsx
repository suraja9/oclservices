import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const { threshold = 0.1, triggerOnce = true, delay = 0 } = options;
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  useEffect(() => {
    if (inView) {
      if (delay > 0) {
        setTimeout(() => setShouldAnimate(true), delay);
      } else {
        setShouldAnimate(true);
      }
    }
  }, [inView, delay]);

  return {
    ref,
    inView: shouldAnimate,
    className: shouldAnimate ? 'animate-fade-in' : 'opacity-0 translate-y-8'
  };
};

export const useStaggeredAnimation = (itemCount: number, baseDelay: number = 100) => {
  return Array.from({ length: itemCount }, (_, index) => 
    useScrollAnimation({ delay: index * baseDelay })
  );
};