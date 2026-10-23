document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const yearSpan = document.getElementById('current-year');

    // Aktuális év beállítása a láblécben
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Mobil hamburgermenü nyitása és csukása
    const closeMenu = () => {
        menuToggle.classList.remove('is-active');
        primaryNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = primaryNav.classList.toggle('is-open');
            menuToggle.classList.toggle('is-active', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Menü bezárása navigációs linkre kattintáskor
        navLinks.forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        // Menü bezárása Escape billentyűre
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // Sticky fejléc árnyékolás görgetéskor
    const handleScroll = () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Aktív szekció kiemelése a navigációban
    const sections = document.querySelectorAll('main section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-link').forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));

    // Formspree űrlap beküldés kezelése
    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            const actionUrl = contactForm.getAttribute('action');

            // Ha még a helyőrző Formspree URL szerepel a kódban, demó visszajelzést adunk
            if (actionUrl.includes('YOUR_FORMSPREE_ID')) {
                event.preventDefault();
                formStatus.textContent = 'Köszönjük! Az űrlap élesítéséhez adja meg a Formspree azonosítóját az index.html fájlban.';
                contactForm.reset();
                return;
            }

            event.preventDefault();
            formStatus.textContent = 'Küldés folyamatban...';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(actionUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Köszönjük megkeresését! Hamarosan felvesszük Önnel a kapcsolatot.';
                    contactForm.reset();
                } else {
                    formStatus.textContent = 'Hiba történt az üzenet küldésekor. Kérjük, próbálja újra vagy hívjon minket telefonon.';
                }
            } catch (error) {
                formStatus.textContent = 'Hálózati hiba történt. Kérjük, ellenőrizze az internetkapcsolatot.';
            }
        });
    }
});