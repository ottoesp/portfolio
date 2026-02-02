// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

document.body.style.display = 'block';

// Prevent card transition flicker on page load
window.addEventListener('load', () => {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('loaded');
    });
});