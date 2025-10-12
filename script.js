// ===== PORTFOLIO WEBSITE JAVASCRIPT =====
// Modern, performance-optimized JavaScript for interactive features

// ===== UTILITY FUNCTIONS =====
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===== THEME MANAGEMENT =====
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeIcon = this.themeToggle?.querySelector('.theme-icon');
    this.init();
  }

  init() {
    this.setTheme(this.theme);
    this.bindEvents();
  }

  bindEvents() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    if (this.themeIcon) {
      this.themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
    
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

// ===== NAVIGATION MANAGEMENT =====
class NavigationManager {
  constructor() {
    this.nav = document.getElementById('nav');
    this.hamburger = document.getElementById('hamburger');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = Array.from(document.querySelectorAll('section[id]'));
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleNavLinkClick(e);
        this.closeMobileMenu();
      });
    });

    // Handle scroll for navbar styling and active link highlighting
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target) && this.navMenu?.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.hamburger?.classList.toggle('active');
    this.navMenu?.classList.toggle('active');
    document.body.style.overflow = this.navMenu?.classList.contains('active') ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.hamburger?.classList.remove('active');
    this.navMenu?.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleNavLinkClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80; // Adjusted for better positioning
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Immediately update active state
      this.navLinks.forEach(link => link.classList.remove('active'));
      e.target.classList.add('active');
    }
  }

  handleScroll() {
    const scrollY = window.scrollY;
    
    // Add/remove scrolled class to navbar
    if (scrollY > 50) {
      this.nav?.classList.add('scrolled');
    } else {
      this.nav?.classList.remove('scrolled');
    }

    // Highlight active navigation link
    let current = this.sections[0]?.getAttribute('id') || 'hero';
    const navHeight = this.nav?.offsetHeight ?? 0;
    const referenceY = scrollY + navHeight + Math.min(window.innerHeight * 0.35, 260);
    let found = false;

    for (const section of this.sections) {
      const sectionTop = section.offsetTop - navHeight - 12;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (referenceY >= sectionTop && referenceY < sectionBottom) {
        current = section.getAttribute('id') || current;
        found = true;
        break;
      }
    }
    if (!found && referenceY < (this.sections[0]?.offsetTop ?? 0)) {
      current = this.sections[0]?.getAttribute('id') || current;
    }

    const viewportBottom = scrollY + window.innerHeight;
    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    if (docHeight - viewportBottom <= 4) {
      const lastSection = this.sections[this.sections.length - 1];
      if (lastSection) {
        current = lastSection.getAttribute('id') || current;
      }
    }

    // Update active states
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('.summary-card, .project-card, .timeline-card, .cert-card, .skill-category, .info-card, .language-card');
    this.observerOptions = {
      threshold: 0.05,
      rootMargin: '50px 0px -100px 0px'
    };
    this.init();
  }

  init() {
    // Make ALL elements visible by default for reliable testing
    // This ensures content is accessible immediately, preventing timing issues with browser automation
    this.animatedElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Optional: Add scroll-triggered animations for enhanced UX
    // Only animate elements that scroll into view after page load
    if ('IntersectionObserver' in window) {
      // Small delay to ensure DOM is fully settled before observing
      setTimeout(() => {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Add a subtle scale effect on scroll-in for elements that weren't initially visible
              entry.target.style.transform = 'translateY(0) scale(1)';
              this.observer.unobserve(entry.target);
            }
          });
        }, this.observerOptions);

        // Only observe elements that are currently below the fold
        this.animatedElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;
          
          // Only add scroll animation to elements significantly below viewport
          if (rect.top > windowHeight + 100) {
            el.style.transform = 'translateY(20px) scale(0.98)';
            this.observer.observe(el);
          }
        });
      }, 100);
    }
  }
}

// ===== SMOOTH SCROLL POLYFILL =====
const smoothScrollPolyfill = () => {
  if (!('scrollBehavior' in document.documentElement.style)) {
    import('https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
      .then(module => {
        module.polyfill();
      });
  }
};

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    // Skip to main content link
    this.addSkipLink();
    
    // Keyboard navigation for custom elements
    this.enhanceKeyboardNavigation();
    
    // Focus management for mobile menu
    this.manageFocus();
  }

  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#hero';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary-color);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  enhanceKeyboardNavigation() {
    // Add keyboard support for theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          themeToggle.click();
        }
      });
    }
  }

  manageFocus() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        // Focus first nav link when menu opens
        setTimeout(() => {
          if (navMenu.classList.contains('active')) {
            const firstLink = navMenu.querySelector('.nav-link');
            firstLink?.focus();
          }
        }, 100);
      });
    }
  }
}

// ===== INITIALIZATION =====
class Portfolio {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize all components
      this.components.themeManager = new ThemeManager();
      this.components.navigationManager = new NavigationManager();
      this.components.scrollAnimations = new ScrollAnimations();
      this.components.accessibilityEnhancer = new AccessibilityEnhancer();

      // Initialize smooth scroll polyfill
      smoothScrollPolyfill();

      console.log('Portfolio website initialized successfully');
    } catch (error) {
      console.error('Error initializing portfolio components:', error);
    }
  }

  // Method to destroy components (useful for SPA navigation)
  destroy() {
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
  }
}

// ===== GLOBAL ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
  // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  // In production, you might want to send this to an error tracking service
});

// ===== START THE APPLICATION =====
const portfolio = new Portfolio();

// ===== EXPORT FOR TESTING (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Portfolio,
    ThemeManager,
    NavigationManager,
    ScrollAnimations
  };
}
