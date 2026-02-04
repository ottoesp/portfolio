// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

const DEBUG = false; // Set to false to submit normally

document.body.style.display = 'block';

// Prevent card transition flicker on page load
window.addEventListener('load', () => {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('loaded');
    });
});

grecaptcha.ready(function () {
    grecaptcha.execute('6Ld9EmAsAAAAAE1EBVBBiivRAp_zafR83JYcc7y_', { action: 'homepage' }).then(function (token) {
        document.getElementById('g-recaptcha-response').value = token;
    });
});

document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const successMessage = document.getElementById('success-message');

    if (DEBUG) {
        console.log('DEBUG MODE - Form data:', Object.fromEntries(formData));
        successMessage.classList.remove('d-none');
        successMessage.classList.add('show');
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
            successMessage.classList.remove('d-none');
            successMessage.classList.add('show');
            form.reset();
        } else {
            const data = await response.json();
            if (data.errors) {
                console.error(data.errors.map(error => error.message).join(", "));
            }
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});