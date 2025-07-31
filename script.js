// DOM Elements
const loader = document.getElementById('loader');
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const heroSlider = document.querySelector('.hero-slider');
const slides = document.querySelectorAll('.slide');
const heroPrev = document.getElementById('hero-prev');
const heroNext = document.getElementById('hero-next');
const heroDots = document.querySelectorAll('.dot');
const backToTop = document.getElementById('back-to-top');
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const navLinks = document.querySelectorAll('.nav-link');

// Variables
let currentSlide = 0;
let slideInterval;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader after page load
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1000);

    // Initialize components
    initNavigation();
    initHeroSlider();
    initScrollEffects();
    initGalleryFilter();
    initAOS();
    initNewsletterForm();
});

// Navigation Functions
function initNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop;
            const offsetHeight = targetSection.offsetHeight;
            
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// Hero Slider Functions
function initHeroSlider() {
    // Start auto-slide
    startAutoSlide();
    
    // Navigation arrows
    heroPrev.addEventListener('click', () => {
        changeSlide(currentSlide - 1);
        resetAutoSlide();
    });
    
    heroNext.addEventListener('click', () => {
        changeSlide(currentSlide + 1);
        resetAutoSlide();
    });
    
    // Dot navigation
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            changeSlide(index);
            resetAutoSlide();
        });
    });

    // Pause auto-slide on hover
    heroSlider.addEventListener('mouseenter', stopAutoSlide);
    heroSlider.addEventListener('mouseleave', startAutoSlide);
}

function changeSlide(index) {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    heroDots[currentSlide].classList.remove('active');
    
    // Calculate new slide index
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    heroDots[currentSlide].classList.add('active');
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        changeSlide(currentSlide + 1);
    }, 5000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// Scroll Effects
function initScrollEffects() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        // Header background on scroll
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top button
        if (scrollTop > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Back to top functionality
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Gallery Filter Functions
function initGalleryFilter() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter gallery items
            filterGalleryItems(filter);
        });
    });
}

function filterGalleryItems(filter) {
    galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            item.classList.remove('hidden');
            // Re-trigger AOS animation
            setTimeout(() => {
                item.classList.add('aos-animate');
            }, 100);
        } else {
            item.style.display = 'none';
            item.classList.add('hidden');
            item.classList.remove('aos-animate');
        }
    });
}

// Animate On Scroll (AOS) Implementation
function initAOS() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (email) {
                // Simulate form submission
                showNotification('Thank you for subscribing!');
                newsletterForm.reset();
            }
        });
    }
}

// Cart Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-cart')) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        
        // Add to cart animation
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 150);
        
        showNotification(`${productTitle} added to cart!`);
    }
});

// Notification System
function showNotification(message) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Product Card Animations
function animateProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in');
    });
}

// Smooth scroll for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
}, 100));

// Preload images for better performance
function preloadImages() {
    const images = [
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
        'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg',
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
        'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

// Add loading states for interactive elements
document.addEventListener('click', (e) => {
    if (e.target.matches('button:not(.no-loading)')) {
        const button = e.target;
        const originalText = button.textContent;
        
        // Add loading state
        button.style.opacity = '0.7';
        button.style.pointerEvents = 'none';
        
        // Remove loading state after a short delay
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        }, 500);
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Arrow keys for hero slider
    if (e.key === 'ArrowLeft') {
        changeSlide(currentSlide - 1);
        resetAutoSlide();
    } else if (e.key === 'ArrowRight') {
        changeSlide(currentSlide + 1);
        resetAutoSlide();
    }
});

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateProductCards);
} else {
    animateProductCards();
}