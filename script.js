document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav ul');
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        nav.style.display = nav.classList.contains('active') ? 'flex' : 'none';
    });

    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        if (name && email && phone) {
            alert('Form submitted successfully! (Simulated)');
            contactForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
});
