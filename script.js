document.addEventListener('DOMContentLoaded', () => {
    // Enhanced mobile menu functionality
    initMobileMenu();
    
    // Enhanced form validation with better UX
    initFormValidation();
    
    // Testimonial slider functionality
    initTestimonialSlider();
    
    // Additional improvements
    initSmoothScrolling();
    initAccessibilityFeatures();
});

function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    
    if (!menuToggle || !menuClose || !mobileMenu) return;
    
    // Toggle menu function
    const toggleMenu = () => {
        const isExpanded = mobileMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Prevent background scrolling when menu is open
        if (isExpanded) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };
    
    // Add click events
    menuToggle.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on links
    const navLinks = mobileMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
    
    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}

function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Get form elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const formMessage = document.getElementById('form-message');
    
    // Add input validation
    nameInput.addEventListener('blur', () => validateRequired(nameInput, 'name-error'));
    emailInput.addEventListener('blur', () => validateEmail(emailInput, 'email-error'));
    phoneInput.addEventListener('blur', () => validatePhone(phoneInput, 'phone-error'));
    messageInput.addEventListener('blur', () => validateRequired(messageInput, 'message-error'));
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateRequired(nameInput, 'name-error');
        const isEmailValid = validateEmail(emailInput, 'email-error');
        const isPhoneValid = validatePhone(phoneInput, 'phone-error');
        const isMessageValid = validateRequired(messageInput, 'message-error');
        
        if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
            // Simulate successful form submission
            showMessage(formMessage, 'Form submitted successfully! We will get back to you soon.', 'success');
            contactForm.reset();
            
            // You would typically send data to a server here
            console.log('Form data:', {
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                message: messageInput.value
            });
        } else {
            showMessage(formMessage, 'Please correct the errors in the form.', 'error');
        }
    });
}

function validateRequired(input, errorId) {
    const errorElement = document.getElementById(errorId);
    const isValid = input.value.trim() !== '';
    
    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        if (errorElement) errorElement.classList.add('hidden');
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        if (errorElement) errorElement.classList.remove('hidden');
    }
    
    return isValid;
}

function validateEmail(input, errorId) {
    const errorElement = document.getElementById(errorId);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value.trim());
    
    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        if (errorElement) errorElement.classList.add('hidden');
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        if (errorElement) {
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.classList.remove('hidden');
        }
    }
    
    return isValid;
}

function validatePhone(input, errorId) {
    const errorElement = document.getElementById(errorId);
    // Basic phone validation - allows numbers, spaces, hyphens, parentheses, and plus sign
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    const isValid = phoneRegex.test(input.value.trim());
    
    if (isValid || input.value.trim() === '') {
        input.classList.remove('error');
        input.classList.add('success');
        if (errorElement) errorElement.classList.add('hidden');
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        if (errorElement) {
            errorElement.textContent = 'Please enter a valid phone number';
            errorElement.classList.remove('hidden');
        }
    }
    
    return isValid || input.value.trim() === '';
}

function showMessage(element, text, type) {
    if (!element) return;
    
    element.textContent = text;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function initTestimonialSlider() {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialIndicators = document.querySelectorAll('.testimonial-indicator');
    let currentTestimonial = 0;
    
    if (testimonialSlides.length === 0) return;
    
    function showTestimonial(index) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        testimonialIndicators.forEach(indicator => indicator.classList.remove('bg-teal-300'));
        testimonialIndicators.forEach(indicator => indicator.classList.add('bg-teal-800'));
        
        testimonialSlides[index].classList.add('active');
        testimonialIndicators[index].classList.remove('bg-teal-800');
        testimonialIndicators[index].classList.add('bg-teal-300');
        currentTestimonial = index;
    }
    
    testimonialIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    // Auto-advance testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

function initSmoothScrolling() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initAccessibilityFeatures() {
    // Add keyboard navigation improvements
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('role', 'button');
    }
    
    // Add focus styles for keyboard navigation
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Tab') {
            document.documentElement.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.documentElement.classList.remove('keyboard-nav');
    });
}
