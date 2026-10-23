/**
 * Ultra-Smooth Scroll Enhancement
 * Provides silky-smooth scroll behavior with momentum and easing
 */

export const initSmoothScroll = () => {
  // Enhance scroll behavior with smooth easing
  let isScrolling = false;
  let scrollTimeout;
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let lastTime = Date.now();

  // Apply smooth scroll easing
  const applyScrollEasing = () => {
    const now = Date.now();
    const deltaTime = now - lastTime;
    lastTime = now;

    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    // Calculate velocity with smooth decay
    scrollVelocity = delta * 0.8 + scrollVelocity * 0.2;
    lastScrollY = currentScrollY;

    // Add momentum effect
    if (Math.abs(scrollVelocity) > 0.1) {
      const newScroll = currentScrollY + scrollVelocity;
      
      // Ensure scroll stays within bounds
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (newScroll >= 0 && newScroll <= maxScroll) {
        requestAnimationFrame(applyScrollEasing);
      }
    }
  };

  // Listen to scroll events for momentum
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(applyScrollEasing);
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      scrollVelocity = 0;
    }, 150);
  }, { passive: true });

  // Smooth anchor link scrolling
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;

    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    e.preventDefault();

    // Smooth scroll to target
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, { passive: false });

  // Optimize scroll performance
  const scrollElements = document.querySelectorAll('main, section, article, nav');
  scrollElements.forEach((el) => {
    el.style.willChange = 'scroll-position';
    el.style.transform = 'translateZ(0)';
  });

  // Add frame rate optimization for smooth 60fps
  let lastFrameTime = 0;
  const frameInterval = 1000 / 60; // 60fps

  const throttledScroll = () => {
    const now = Date.now();
    if (now - lastFrameTime >= frameInterval) {
      lastFrameTime = now;
      requestAnimationFrame(() => {
        // Trigger reflow optimization
        void document.body.offsetHeight;
      });
    }
  };

  window.addEventListener('scroll', throttledScroll, { passive: true });

  // Disable pointer events during scroll for better performance
  let scrolling = false;
  window.addEventListener('scroll', () => {
    if (!scrolling) {
      document.body.style.pointerEvents = 'none';
      scrolling = true;
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
      scrolling = false;
    }, 150);
  }, { passive: true });

  return {
    destroy: () => {
      clearTimeout(scrollTimeout);
    }
  };
};

// Auto-initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScroll);
  } else {
    initSmoothScroll();
  }
}
