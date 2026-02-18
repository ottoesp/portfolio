// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

const DEBUG = false; // Set to false to submit normally

document.body.style.display = 'block';

function showMessage(element, show = true) {
    if (show) {
        element.classList.remove('d-none');
        element.classList.add('show');
    } else {
        element.classList.add('d-none');
        element.classList.remove('show');
    }
}

function updateMousePosition(overlay, x, y) {
    overlay.style.setProperty('--mouse-x', `${x}%`);
    overlay.style.setProperty('--mouse-y', `${y}%`);
    overlay.style.setProperty('--mouse-x-num', x);
    overlay.style.setProperty('--mouse-y-num', y);
}

function clearMousePosition(overlay) {
    overlay.style.removeProperty('--mouse-x');
    overlay.style.removeProperty('--mouse-y');
    overlay.style.removeProperty('--mouse-x-num');
    overlay.style.removeProperty('--mouse-y-num');
}

function toggleCardOverlay(card, show) {
    const overlay = card.querySelector('.card-img-overlay');
    if (overlay) {
        overlay.classList.toggle('show', show);
    }
}

function calculateVisibleRatio(card) {
    const rect = card.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const cardHeight = rect.height;
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    return visibleHeight / cardHeight;
}

// Prevent card transition flicker on page load
window.addEventListener('load', () => {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('loaded');
    });
});

// reCAPTCHA
grecaptcha.ready(function () {
    grecaptcha.execute('6Ld9EmAsAAAAAE1EBVBBiivRAp_zafR83JYcc7y_', { action: 'homepage' }).then(function (token) {
        document.getElementById('g-recaptcha-response').value = token;
    });
});

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const successMessage = document.getElementById('success-message');
    const failureMessage = document.getElementById('failure-message');

    if (DEBUG) {
        console.log('DEBUG MODE - Form data:', Object.fromEntries(formData));
        showMessage(successMessage);
        return;
    }

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            showMessage(successMessage);
            showMessage(failureMessage, false);
            form.reset();
        } else {
            const data = await response.json();
            showMessage(failureMessage);
            showMessage(successMessage, false);
            if (data.errors) {
                console.error(data.errors.map(error => error.message).join(", "));
            }
        }
    } catch (error) {
        showMessage(failureMessage);
        showMessage(successMessage, false);
        console.error('Error submitting form:', error);
    }
});

// Add mouse tracking on cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const overlay = card.querySelector('.card-img-overlay');
        if (overlay) {
            updateMousePosition(overlay, x, y);
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const overlay = card.querySelector('.card-img-overlay');
        if (overlay) {
            clearMousePosition(overlay);
        }
    });
});

// ScrollSpy for mobile cards
if (window.matchMedia('(max-width: 575px)').matches) {
    const THRESHOLD = 0.8;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            toggleCardOverlay(entry.target, entry.isIntersecting);
        });
    }, {
        threshold: THRESHOLD
    });

    const cards = document.querySelectorAll('.card-project');
    cards.forEach(card => observer.observe(card));
}