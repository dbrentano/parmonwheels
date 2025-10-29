// ------------------- LOAD HEADER & FOOTER -------------------
async function loadPartials() {
    try {
        const [headerRes, footerRes] = await Promise.all([
            fetch("/templates/header.html"),
            fetch("/templates/footer.html")
        ]);

        if (!headerRes.ok || !footerRes.ok) throw new Error("Missing partials");

        const [headerHTML, footerHTML] = await Promise.all([
            headerRes.text(),
            footerRes.text()
        ]);

        document.body.insertAdjacentHTML("afterbegin", headerHTML);
        document.body.insertAdjacentHTML("beforeend", footerHTML);

        initHeaderScripts(); // reinit header once loaded
    } catch (err) {
        console.error("Error loading partials:", err);
    }
}

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

document.addEventListener('DOMContentLoaded', loadPartials);

// ------------------- VIDEO CONTROLS -------------------
// ------------------- VIDEO CONTROLS (always hide on play, show on pause) -------------------
(function initVideoOverlay() {
    const containers = document.querySelectorAll('.video-container');
    if (!containers.length) return;

    const pauseOthers = (except) => {
        document.querySelectorAll('.video-player').forEach(v => {
            if (v !== except) {
                v.pause();
                const b = v.closest('.video-container')?.querySelector('.play-btn');
                if (b) b.classList.remove('hidden');
            }
        });
    };

    containers.forEach(container => {
        const video = container.querySelector('.video-player');
        const btn = container.querySelector('.play-btn');
        if (!video || !btn) return;

        // Clicking play button starts video
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            pauseOthers(video);
            video.play().then(() => btn.classList.add('hidden'));
        });

        // When video starts playing (no matter how)
        video.addEventListener('play', () => {
            pauseOthers(video);
            btn.classList.add('hidden');
        });

        // When paused or ended (no matter how)
        video.addEventListener('pause', () => btn.classList.remove('hidden'));
        video.addEventListener('ended', () => btn.classList.remove('hidden'));
    });
})();


