/**
 * Eduford University - Main JavaScript
 * Enterprise-grade functionality with modern ES6+ features
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

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

// ============================================
// THEME MANAGEMENT
// ============================================

class ThemeManager {
    constructor() {
        this.toggle = $('#themeToggle');
        this.icon = this.toggle?.querySelector('i');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateIcon();
        
        this.toggle?.addEventListener('click', () => this.toggleTheme());
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateIcon();
        Toast.show(`Switched to ${this.currentTheme} mode`, 'info');
    }
    
    updateIcon() {
        if (this.icon) {
            this.icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// ============================================
// NAVIGATION
// ============================================

class Navigation {
    constructor() {
        this.navbar = $('#navbar');
        this.mobileBtn = $('#mobileMenuBtn');
        this.navLinks = $('#navLinks');
        
        this.init();
    }
    
    init() {
        // Sticky navigation
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));
        
        // Mobile menu
        this.mobileBtn?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu on link click
        this.navLinks?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Active link highlighting
        this.highlightActiveLink();
    }
    
    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar?.classList.add('sticky');
        } else {
            this.navbar?.classList.remove('sticky');
        }
    }
    
    toggleMobileMenu() {
        this.navLinks?.classList.toggle('active');
        const icon = this.mobileBtn?.querySelector('i');
        if (icon) {
            icon.className = this.navLinks?.classList.contains('active') 
                ? 'fas fa-times' 
                : 'fas fa-bars';
        }
    }
    
    closeMobileMenu() {
        this.navLinks?.classList.remove('active');
        const icon = this.mobileBtn?.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
    }
    
    highlightActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.navLinks?.querySelectorAll('a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
}

// ============================================
// PROGRESS BAR
// ============================================

class ProgressBar {
    constructor() {
        this.bar = $('#progressBar');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.update());
        window.addEventListener('load', () => {
            setTimeout(() => this.bar.style.width = '100%', 100);
            setTimeout(() => this.bar.style.opacity = '0', 500);
        });
    }
    
    update() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (this.bar) this.bar.style.width = scrolled + '%';
    }
}

// ============================================
// BACK TO TOP
// ============================================

class BackToTop {
    constructor() {
        this.button = $('#backToTop');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', debounce(() => this.toggle(), 100));
        this.button?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    toggle() {
        if (window.scrollY > 500) {
            this.button?.classList.add('visible');
        } else {
            this.button?.classList.remove('visible');
        }
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

class Toast {
    static container = $('#toastContainer');
    
    static show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        this.container?.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// ============================================
// COUNTER ANIMATION
// ============================================

class Counter {
    constructor() {
        this.counters = $$('[data-count]');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animate(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }
}

// ============================================
// FAQ ACCORDION
// ============================================

class Accordion {
    constructor() {
        this.items = $$('.faq-item');
        this.init();
    }
    
    init() {
        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');
            question?.addEventListener('click', () => this.toggle(item));
        });
    }
    
    toggle(item) {
        const isActive = item.classList.contains('active');
        
        // Close all
        this.items.forEach(i => i.classList.remove('active'));
        
        // Open clicked if wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// ============================================
// NEWSLETTER FORM
// ============================================

class NewsletterForm {
    constructor() {
        this.form = $('#newsletterForm');
        this.init();
    }
    
    init() {
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = this.form.querySelector('input[type="email"]')?.value;
            
            if (email) {
                Toast.show('Subscribing...', 'info');
                
                // Simulate API call
                setTimeout(() => {
                    Toast.show('Successfully subscribed to newsletter!', 'success');
                    this.form.reset();
                }, 1500);
            }
        });
    }
}

// ============================================
// ANIMATION ON SCROLL
// ============================================

class ScrollAnimations {
    constructor() {
        this.elements = $$('.course-card, .campus-card, .facility-card, .testimonial-card');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        this.elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }
}

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================

class ServiceWorkerManager {
    constructor() {
        this.init();
    }
    
    init() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(registration => {
                        console.log('SW registered:', registration.scope);
                    })
                    .catch(error => {
                        console.log('SW registration failed:', error);
                    });
            });
        }
    }
}

// ============================================
// PWA INSTALL PROMPT
// ============================================

class PWAInstall {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }
    
    init() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
    }
    
    showInstallButton() {
        // Could show an install button here
        console.log('PWA install available');
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    new ThemeManager();
    new Navigation();
    new ProgressBar();
    new BackToTop();
    new Counter();
    new Accordion();
    new NewsletterForm();
    new ScrollAnimations();
    new ServiceWorkerManager();
    new PWAInstall();
    
    // Welcome toast
    setTimeout(() => {
        Toast.show('Welcome to Eduford University!', 'success');
    }, 1000);
});

// Handle online/offline
window.addEventListener('online', () => {
    Toast.show('You are back online', 'success');
});

window.addEventListener('offline', () => {
    Toast.show('You are offline. Some features may not work.', 'error');
});
