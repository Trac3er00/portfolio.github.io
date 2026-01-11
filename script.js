// ===== MODERN MINIMAL PORTFOLIO JS =====

// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
  }
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);

themeToggle?.addEventListener('click', toggleTheme);

// Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu with scroll lock
function toggleMobileMenu(open) {
  const isOpen = open ?? !navMenu?.classList.contains('active');

  hamburger?.classList.toggle('active', isOpen);
  navMenu?.classList.toggle('active', isOpen);

  // Scroll lock
  document.body.style.overflow = isOpen ? 'hidden' : '';

  // Focus trap setup
  if (isOpen) {
    setupFocusTrap();
  } else {
    removeFocusTrap();
  }
}

hamburger?.addEventListener('click', () => toggleMobileMenu());

// Focus trap for mobile menu
let focusTrapHandler = null;

function setupFocusTrap() {
  if (!navMenu) return;

  const focusableElements = navMenu.querySelectorAll(
    'a, button, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  focusTrapHandler = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  document.addEventListener('keydown', focusTrapHandler);

  // Close on Escape
  document.addEventListener('keydown', handleEscapeKey);

  // Focus first item
  firstFocusable?.focus();
}

function handleEscapeKey(e) {
  if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
    toggleMobileMenu(false);
    hamburger?.focus();
  }
}

function removeFocusTrap() {
  if (focusTrapHandler) {
    document.removeEventListener('keydown', focusTrapHandler);
    focusTrapHandler = null;
  }
  document.removeEventListener('keydown', handleEscapeKey);
}

// Smooth scroll and active link
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    
    // Close mobile menu
    toggleMobileMenu(false);

    // Update active state
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// Update active link on scroll (with debouncing for performance)
const sections = document.querySelectorAll('section[id]');
let scrollTimeout;

function updateActiveLink() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

function debouncedUpdateActiveLink() {
  if (scrollTimeout) {
    cancelAnimationFrame(scrollTimeout);
  }
  scrollTimeout = requestAnimationFrame(updateActiveLink);
}

window.addEventListener('scroll', debouncedUpdateActiveLink, { passive: true });
updateActiveLink();

// Scroll-triggered fade-in animations (with feature detection)
if ('IntersectionObserver' in window) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('section:not(#hero)').forEach(section => {
    section.classList.add('fade-in-section');
    fadeObserver.observe(section);
  });
} else {
  // Fallback: show all sections immediately if IntersectionObserver not supported
  document.querySelectorAll('section:not(#hero)').forEach(section => {
    section.classList.add('visible');
  });
}
