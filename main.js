// ============================================
// EDUFORD UNIVERSITY - MAIN JAVASCRIPT
// ============================================

// 1. DARK/LIGHT THEME TOGGLE
// ============================================
const themeToggle = document.createElement('button');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
themeToggle.setAttribute('aria-label', 'Toggle dark mode');
document.body.appendChild(themeToggle);

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'dark' 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
});

// 2. PAGE LOAD PROGRESS BAR
// ============================================
const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';
progressBar.style.width = '0%';
document.body.insertBefore(progressBar, document.body.firstChild);

window.addEventListener('load', () => {
    progressBar.style.width = '100%';
    setTimeout(() => {
        progressBar.style.opacity = '0';
    }, 500);
});

// 3. BACK TO TOP BUTTON
// ============================================
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTop.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 4. STICKY NAVIGATION
// ============================================
const nav = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
        nav.classList.add('sticky');
    } else {
        nav.classList.remove('sticky');
    }
    
    lastScroll = currentScroll;
});

// 5. TOAST NOTIFICATION SYSTEM
// ============================================
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    };
    
    toast.innerHTML = `${icons[type]} <span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// 6. MODAL SYSTEM
// ============================================
function createModal(title, content) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Trigger animation
    setTimeout(() => overlay.classList.add('active'), 10);
    
    // Close handlers
    const closeModal = () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    };
    
    overlay.querySelector('.modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// 7. IMAGE CAROUSEL/SLIDER
// ============================================
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    const inner = carousel.querySelector('.carousel-inner');
    const items = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    
    let currentIndex = 0;
    let autoplayInterval;
    
    function goToSlide(index) {
        currentIndex = index;
        inner.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentIndex);
        });
    }
    
    function nextSlide() {
        goToSlide((currentIndex + 1) % items.length);
    }
    
    function prevSlide() {
        goToSlide((currentIndex - 1 + items.length) % items.length);
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); prevSlide(); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); nextSlide(); startAutoplay(); });
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoplay();
            goToSlide(index);
            startAutoplay();
        });
    });
    
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    startAutoplay();
}

// 8. ACCORDION
// ============================================
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            accordionItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// 9. REAL-TIME FORM VALIDATION
// ============================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });
        
        form.addEventListener('submit', (e) => {
            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) isValid = false;
            });
            
            if (!isValid) {
                e.preventDefault();
                showToast('Please fix the errors in the form', 'error');
            }
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
    input.classList.remove('error');
    
    // Validation rules
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (input.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        input.classList.add('error');
        const error = document.createElement('span');
        error.className = 'error-message';
        error.style.cssText = 'color: #f44336; font-size: 12px; display: block; margin-top: 5px;';
        error.textContent = errorMessage;
        input.parentElement.appendChild(error);
    }
    
    return isValid;
}

// 10. SEARCH WITH AUTOCOMPLETE
// ============================================
function initSearchAutocomplete() {
    const searchInput = document.querySelector('.search-input');
    const autocompleteList = document.querySelector('.autocomplete-list');
    
    if (!searchInput) return;
    
    const courses = [
        'Computer Science',
        'Business Administration',
        'Data Science',
        'Artificial Intelligence',
        'Cybersecurity',
        'Digital Marketing',
        'Mechanical Engineering',
        'Psychology',
        'Medicine',
        'Law',
        'Economics',
        'Graphic Design'
    ];
    
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        autocompleteList.innerHTML = '';
        
        if (value.length < 1) {
            autocompleteList.classList.remove('active');
            return;
        }
        
        const filtered = courses.filter(course => 
            course.toLowerCase().includes(value)
        );
        
        if (filtered.length > 0) {
            filtered.forEach(course => {
                const div = document.createElement('div');
                div.className = 'autocomplete-item';
                div.textContent = course;
                div.addEventListener('click', () => {
                    searchInput.value = course;
                    autocompleteList.classList.remove('active');
                    showToast(`Searching for ${course}...`, 'info');
                });
                autocompleteList.appendChild(div);
            });
            autocompleteList.classList.add('active');
        } else {
            autocompleteList.classList.remove('active');
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            autocompleteList.classList.remove('active');
        }
    });
}

// 11. TESTIMONIALS SLIDER
// ============================================
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    const track = slider.querySelector('.testimonials-track');
    const slides = slider.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;
    
    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    setInterval(() => {
        goToSlide((currentSlide + 1) % slides.length);
    }, 6000);
}

// 12. COUNT-UP STATISTICS
// ============================================
function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target'));
                animateCount(target, endValue);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCount(element, endValue) {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// 13. LAZY LOADING WITH BLUR EFFECT
// ============================================
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('lazy-image');
                
                img.onload = () => {
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                };
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// 14. NEWSLETTER SUBSCRIPTION
// ============================================
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Simulate API call
        showToast('Subscribing...', 'info');
        
        setTimeout(() => {
            showToast('Successfully subscribed to newsletter!', 'success');
            newsletterForm.reset();
        }, 1500);
    });
}

// 15. MULTI-LANGUAGE SUPPORT
// ============================================
const translations = {
    en: {
        home: 'HOME',
        about: 'ABOUT',
        course: 'COURSE',
        blog: 'BLOG',
        contact: 'CONTACT',
        exploreCourses: 'Explore Our Courses',
        whatStudentsSay: 'What Our Students Say'
    },
    es: {
        home: 'INICIO',
        about: 'NOSOTROS',
        course: 'CURSOS',
        blog: 'BLOG',
        contact: 'CONTACTO',
        exploreCourses: 'Explorar Cursos',
        whatStudentsSay: 'Lo Que Dicen Nuestros Estudiantes'
    },
    fr: {
        home: 'ACCUEIL',
        about: 'À PROPOS',
        course: 'COURS',
        blog: 'BLOG',
        contact: 'CONTACT',
        exploreCourses: 'Explorer les Cours',
        whatStudentsSay: 'Ce Que Disent Nos Étudiants'
    }
};

function initLanguageSwitcher() {
    const langSwitcher = document.querySelector('.lang-switcher select');
    if (!langSwitcher) return;
    
    // Set saved language
    const savedLang = localStorage.getItem('language') || 'en';
    langSwitcher.value = savedLang;
    applyLanguage(savedLang);
    
    langSwitcher.addEventListener('change', (e) => {
        const lang = e.target.value;
        localStorage.setItem('language', lang);
        applyLanguage(lang);
        showToast(`Language changed to ${lang.toUpperCase()}`, 'info');
    });
}

function applyLanguage(lang) {
    const texts = translations[lang];
    if (!texts) return;
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const key = link.getAttribute('href').replace('.html', '') || 'home';
        if (texts[key]) link.textContent = texts[key];
    });
}

// 16. PWA INSTALL PROMPT
// ============================================
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const installBtn = document.getElementById('install-pwa');
    if (installBtn) {
        installBtn.classList.add('visible');
    }
});

const installPwaBtn = document.createElement('button');
installPwaBtn.id = 'install-pwa';
installPwaBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
document.body.appendChild(installPwaBtn);

installPwaBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        showToast('App installed successfully!', 'success');
    }
    
    deferredPrompt = null;
    installPwaBtn.classList.remove('visible');
});

// 17. DYNAMIC COURSE DATA
// ============================================
const coursesData = [
    {
        id: 1,
        title: 'Computer Science',
        level: 'Undergraduate',
        duration: '4 Years',
        description: 'Learn programming, algorithms, and software engineering.',
        image: 'images/course-cs.jpg'
    },
    {
        id: 2,
        title: 'Business Administration',
        level: 'Undergraduate',
        duration: '4 Years',
        description: 'Master management, finance, and entrepreneurship.',
        image: 'images/course-business.jpg'
    },
    {
        id: 3,
        title: 'Data Science',
        level: 'Post Graduate',
        duration: '2 Years',
        description: 'Analyze big data and build predictive models.',
        image: 'images/course-data.jpg'
    },
    {
        id: 4,
        title: 'Artificial Intelligence',
        level: 'Post Graduate',
        duration: '2 Years',
        description: 'Explore machine learning and neural networks.',
        image: 'images/course-ai.jpg'
    }
];

function renderCourses() {
    const container = document.querySelector('.courses-dynamic');
    if (!container) return;
    
    container.innerHTML = coursesData.map(course => `
        <div class="course-col" data-course-id="${course.id}">
            <img data-src="${course.image}" alt="${course.title}" class="lazy-image">
            <h3>${course.title}</h3>
            <p><strong>Level:</strong> ${course.level} | <strong>Duration:</strong> ${course.duration}</p>
            <p>${course.description}</p>
            <button class="hero-btn" onclick="showCourseDetails(${course.id})">Learn More</button>
        </div>
    `).join('');
    
    initLazyLoading();
}

function showCourseDetails(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    
    createModal(course.title, `
        <p><strong>Level:</strong> ${course.level}</p>
        <p><strong>Duration:</strong> ${course.duration}</p>
        <p>${course.description}</p>
        <p>This comprehensive program covers all aspects of ${course.title.toLowerCase()}, 
        preparing you for a successful career in the industry.</p>
        <button class="hero-btn" onclick="showToast('Application coming soon!', 'info')">Apply Now</button>
    `);
}

// 18. MOBILE MENU (Enhanced)
// ============================================
function initMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    
    window.showMenu = function() {
        navLinks.style.right = '0';
        document.body.style.overflow = 'hidden';
    };
    
    window.hideMenu = function() {
        navLinks.style.right = '-200px';
        document.body.style.overflow = 'auto';
    };
}

// 19. SKELETON LOADING
// ============================================
function showSkeleton(container, count = 3) {
    container.innerHTML = Array(count).fill(0).map(() => `
        <div class="course-col">
            <div class="skeleton" style="height: 200px; margin-bottom: 15px;"></div>
            <div class="skeleton" style="height: 24px; width: 70%; margin-bottom: 10px;"></div>
            <div class="skeleton" style="height: 60px;"></div>
        </div>
    `).join('');
}

// ============================================
// INITIALIZE ALL FEATURES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initCarousel();
    initAccordion();
    initFormValidation();
    initSearchAutocomplete();
    initTestimonialsSlider();
    initCountUp();
    initLazyLoading();
    initNewsletter();
    initLanguageSwitcher();
    renderCourses();
    
    // Show welcome toast
    setTimeout(() => {
        showToast('Welcome to Eduford University!', 'success');
    }, 1000);
});

// Handle online/offline status
window.addEventListener('online', () => {
    showToast('You are back online', 'success');
});

window.addEventListener('offline', () => {
    showToast('You are offline. Some features may not work.', 'error');
});
