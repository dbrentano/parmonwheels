// ------------------- HEADER SCROLL BEHAVIOR -------------------
function initHeaderScripts() {
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header.nav');
    let ticking = false;
    const scrollThreshold = 150; // amount to scroll before header starts hiding/showing

    function updateHeader() {
        const currentY = window.scrollY;

        if (currentY > lastScrollY && currentY > scrollThreshold) {
            // Scrolling down past threshold → hide header
            header.classList.add('hide-header');
        } else if (currentY + 15 < lastScrollY && currentY > scrollThreshold) {
            // Scrolling up after threshold → show header
            header.classList.remove('hide-header');
        } else if (currentY <= scrollThreshold) {
            // Always show header near the top
            header.classList.remove('hide-header');
        }

        lastScrollY = currentY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // ------------------- MOBILE MENU -------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('open');
            navLinks.classList.toggle('show', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navLinks.classList.remove('show');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', initHeaderScripts);