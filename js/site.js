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

// ------------------- CONTACT FORM -------------------
function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;

    // Send form data to Netlify
    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
    })
        .then(() => {
            document.getElementById("form-content").style.display = "none";
            document.getElementById("thank-you").style.display = "block";
        })
        .catch(() => alert("Something went wrong. Please try again."));
}

document.addEventListener('DOMContentLoaded', loadPartials);


