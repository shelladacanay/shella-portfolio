/* ==========================================================
   Shella Dacanay — Virtual Assistant Portfolio
   Main JS: nav, particles, glow, reveal animations, modals,
   lightbox, back-to-top, and contact form (EmailJS)
========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------
       1. MOBILE NAV TOGGLE
    --------------------------------------------------- */
    const mobileToggle = document.getElementById('mobileToggle');
    const navList = document.getElementById('navList');

    if (mobileToggle && navList) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navList.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
            mobileToggle.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        // Close menu after tapping a link (mobile)
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', false);
                mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    /* ---------------------------------------------------
       2. ACTIVE NAV LINK ON SCROLL
    --------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const setActiveLink = () => {
        let currentId = '';
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            if (scrollPos >= section.offsetTop) {
                currentId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    };

    window.addEventListener('scroll', setActiveLink);
    setActiveLink();

    /* ---------------------------------------------------
       3. SCROLL REVEAL ANIMATIONS
    --------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && revealEls.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: show everything immediately
        revealEls.forEach(el => el.classList.add('show'));
    }

    /* ---------------------------------------------------
       4. BACK TO TOP BUTTON
    --------------------------------------------------- */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------------------------------------------------
       5. PROJECT MODAL (reads content straight from the card)
    --------------------------------------------------- */
    const projectModal = document.getElementById('projectModal');
    const modalImage = document.getElementById('modalImage');
    const modalTag = document.getElementById('modalTag');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalTools = document.getElementById('modalTools');
    const closeProjectModalBtn = document.getElementById('closeProjectModal');

    function openProjectModal(card) {
        const img = card.querySelector('.project-link img');
        const tag = card.querySelector('.project-tag');
        const title = card.querySelector('h3');
        const desc = card.querySelector('.project-content > p');
        const tools = card.querySelectorAll('.project-tools span');

        if (img) { modalImage.src = img.src; modalImage.alt = img.alt; }
        if (tag) modalTag.textContent = tag.textContent;
        if (title) modalTitle.textContent = title.textContent;
        if (desc) modalDescription.textContent = desc.textContent.trim();

        modalTools.innerHTML = '';
        tools.forEach(tool => {
            const span = document.createElement('span');
            span.textContent = tool.textContent;
            modalTools.appendChild(span);
        });

        projectModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        projectModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.project-card').forEach(card => {
        const link = card.querySelector('.project-link');
        if (!link) return; // certificate-only cards use the lightbox instead
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openProjectModal(card);
        });
    });

    if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModal);
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeProjectModal();
        });
    }

    /* ---------------------------------------------------
       6. IMAGE LIGHTBOX (certificates)
    --------------------------------------------------- */
    const imageModal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeImageModalBtn = document.getElementById('closeImageModal');

    function openImageModal(src, alt) {
        modalImg.src = src;
        modalImg.alt = alt || '';
        imageModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeImageModal() {
        imageModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.certificate-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const img = link.querySelector('img');
            if (img) openImageModal(img.src, img.alt);
        });
    });

    if (closeImageModalBtn) closeImageModalBtn.addEventListener('click', closeImageModal);
    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) closeImageModal();
        });
    }

    // Shared: close either modal with Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectModal();
            closeImageModal();
        }
    });

    /* ---------------------------------------------------
       7. AMBIENT MOUSE GLOW
    --------------------------------------------------- */
    const mouseGlow = document.getElementById('mouseGlow');
    if (mouseGlow) {
        window.addEventListener('mousemove', (e) => {
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        });
        window.addEventListener('mouseleave', () => { mouseGlow.style.opacity = '0'; });
        window.addEventListener('mouseenter', () => { mouseGlow.style.opacity = '1'; });
    }

    /* ---------------------------------------------------
       8. PARTICLES CANVAS (subtle floating dots in the hero)
    --------------------------------------------------- */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let width, height, animationId;

        const heroSection = document.getElementById('home');

        function resizeCanvas() {
            width = canvas.width = heroSection.offsetWidth;
            height = canvas.height = heroSection.offsetHeight;
        }

        function createParticles() {
            const count = Math.min(60, Math.floor((width * height) / 18000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.8 + 0.6,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                alpha: Math.random() * 0.5 + 0.2
            }));
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
                ctx.fill();
            });
            animationId = requestAnimationFrame(draw);
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function init() {
            resizeCanvas();
            createParticles();
            if (!prefersReducedMotion) {
                if (animationId) cancelAnimationFrame(animationId);
                draw();
            }
        }

        init();
        window.addEventListener('resize', () => {
            if (animationId) cancelAnimationFrame(animationId);
            init();
        });
    }

    /* ---------------------------------------------------
       9. CONTACT FORM (EmailJS)
       ---------------------------------------------------
       To make this form actually send emails:
       1. Create a free account at https://www.emailjs.com/
       2. Add an Email Service and an Email Template
       3. Replace the three placeholder values below with
          your own Public Key, Service ID, and Template ID.
       The template's variable names should match the input
       "name" attributes used in the form (from_name,
       from_email, subject, message).
    --------------------------------------------------- */
    const EMAILJS_PUBLIC_KEY = 'HWsMogp_dZy3X2T5g';
    const EMAILJS_SERVICE_ID = 'service_stp06kr';
    const EMAILJS_TEMPLATE_ID = 'template_1u3m2k5';

    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && window.emailjs) {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isConfigured = EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
                && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID'
                && EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';

            if (!isConfigured) {
                formStatus.textContent = 'Form is not connected to an email service yet. Add your EmailJS keys in js/script.js.';
                formStatus.className = 'form-status error';
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;

            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
                .then(() => {
                    formStatus.textContent = 'Message sent! I\u2019ll get back to you soon.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                })
                .catch(() => {
                    formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
                    formStatus.className = 'form-status error';
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    btnText.textContent = originalText;
                });
        });
    } else if (contactForm) {
        // EmailJS script failed to load (e.g. offline) — degrade gracefully
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.textContent = 'Could not reach the email service. Please email me directly instead.';
            formStatus.className = 'form-status error';
        });
    }

});