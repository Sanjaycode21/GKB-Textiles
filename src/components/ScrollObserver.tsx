'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Fade-in Animations
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    const threadDividers = document.querySelectorAll('.thread-divider');
    const counterElements = document.querySelectorAll('[data-count]');

    if (prefersReducedMotion) {
      // If reduced motion, show everything immediately
      animatedElements.forEach(el => el.classList.add('visible'));
      threadDividers.forEach(el => el.classList.add('animated'));
      counterElements.forEach(el => {
        const target = el.getAttribute('data-count') || '0';
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const num = parseInt(target, 10);
        el.textContent = prefix + num.toLocaleString() + suffix;
      });
      return;
    }

    // Scroll Observer for Fade-ins
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // Scroll Observer for Thread Dividers
    const threadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          threadObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    threadDividers.forEach(divider => threadObserver.observe(divider));

    // Counter Count-up animation function
    function animateCounter(el: Element) {
      const targetAttr = el.getAttribute('data-count');
      if (!targetAttr) return;
      
      const target = parseInt(targetAttr, 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2000;
      let start: number | null = null;
      let lastVal = -1;

      function update(currentTime: number) {
        if (start === null) start = currentTime;
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        if (current !== lastVal) {
          el.textContent = prefix + current.toLocaleString() + suffix;
          lastVal = current;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }

    // Scroll Observer for Counters
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    // Smooth scrolling for hash links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        const href = anchor.hash;
        if (href === '#') return;

        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          const nav = document.querySelector('.main-nav') as HTMLElement;
          const navHeight = nav ? nav.offsetHeight : 0;
          const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      scrollObserver.disconnect();
      threadObserver.disconnect();
      counterObserver.disconnect();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [pathname]);

  return null;
}
