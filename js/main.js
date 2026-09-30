/**
 * Dr. Mahua — Festive Landing Page
 * Main JavaScript File
 */

'use strict';

/* ============================================================
   HEADER — STICKY / SCROLL BEHAVIOUR
   ============================================================ */
(function initHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    function onScroll() {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
})();

/* ============================================================
   MOBILE NAV — HAMBURGER TOGGLE
   ============================================================ */
(function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function () {
        const isOpen = mobileNav.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
})();

/** Close mobile nav (called from inline onclick in HTML) */
function closeMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    if (hamburger) hamburger.classList.remove('open');
    if (mobileNav) mobileNav.classList.remove('open');
    document.body.style.overflow = '';
}

/* ============================================================
   OCCASION CARD SELECTOR
   ============================================================ */
(function initOccasionCards() {
    const cards = document.querySelectorAll('.occasion-card');
    cards.forEach(card => {
        card.addEventListener('click', function () {
            // Remove active from all
            cards.forEach(c => {
                c.classList.remove('active');
                const chk = c.querySelector('.occasion-check');
                if (chk) chk.style.display = 'none';
            });
            // Activate clicked
            card.classList.add('active');
            const check = card.querySelector('.occasion-check');
            if (check) check.style.display = 'flex';
        });
    });
})();

/* ============================================================
   CONSULTATION FORM — VALIDATION & SUBMISSION
   ============================================================ */
(function initConsultForm() {
    const form = document.getElementById('consult-form');
    const successEl = document.getElementById('form-success');
    if (!form) return;

    function showError(field, message) {
        const wrap = field.closest('.form-field');
        if (!wrap) return;
        wrap.classList.add('error');
        // Remove any existing error
        const existing = wrap.querySelector('.field-error');
        if (existing) existing.remove();
        // Add new error
        const errEl = document.createElement('span');
        errEl.className = 'field-error';
        errEl.textContent = message;
        wrap.appendChild(errEl);
    }

    function clearErrors() {
        form.querySelectorAll('.form-field').forEach(f => {
            f.classList.remove('error');
            const err = f.querySelector('.field-error');
            if (err) err.remove();
        });
    }

    function validateIndianPhone(phone) {
        // Accept 10 digit numbers, optionally prefixed with +91, 91, 0
        return /^(\+91|91|0)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
    }

    function validateForm() {
        clearErrors();
        let valid = true;

        const name = document.getElementById('form-name');
        const phone = document.getElementById('form-phone');
        const concern = document.getElementById('form-concern');
        const date = document.getElementById('form-date');

        if (!name.value.trim()) {
            showError(name, 'Please enter your name');
            valid = false;
        }

        if (!phone.value.trim()) {
            showError(phone, 'Please enter your phone number');
            valid = false;
        } else if (!validateIndianPhone(phone.value.trim())) {
            showError(phone, 'Please enter a valid Indian phone number');
            valid = false;
        }

        if (!concern.value) {
            showError(concern, 'Please select your concern');
            valid = false;
        }

        if (!date.value) {
            showError(date, 'Please select a preferred month');
            valid = false;
        }

        return valid;
    }

    // Mock API submit — replace with real backend call later
    async function mockSubmit(data) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 900));
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!validateForm()) return;

        const submitBtn = form.querySelector('.btn-form-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const formData = {
            name: document.getElementById('form-name').value.trim(),
            phone: document.getElementById('form-phone').value.trim(),
            concern: document.getElementById('form-concern').value,
            date: document.getElementById('form-date').value,
            submittedAt: new Date().toISOString(),
        };

        try {
            // TODO: Replace mockSubmit with real API call, e.g.:
            // const res = await fetch('/api/consultation', { method: 'POST', body: JSON.stringify(formData) });
            const res = await mockSubmit(formData);

            if (res.success) {
                form.style.display = 'none';
                if (successEl) successEl.style.display = 'block';
                console.info('Form submitted:', formData);
            }
        } catch (err) {
            console.error('Form submission error:', err);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Clear error on input
    form.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', function () {
            const wrap = this.closest('.form-field');
            if (wrap) {
                wrap.classList.remove('error');
                const err = wrap.querySelector('.field-error');
                if (err) err.remove();
            }
        });
    });
})();

/* ============================================================
   RESULTS CAROUSEL
   ============================================================ */
(function initResultsCarousel() {
    const carousel = document.getElementById('results-carousel');
    const prevBtn = document.getElementById('results-prev');
    const nextBtn = document.getElementById('results-next');
    if (!carousel) return;

    let currentIndex = 0;
    const cards = carousel.querySelectorAll('.before-after-card');
    const total = cards.length;

    function getVisibleCount() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    }

    function update() {
        const visible = getVisibleCount();
        const maxIndex = Math.max(0, total - visible);
        currentIndex = Math.min(currentIndex, maxIndex);

        const cardWidth = carousel.offsetWidth / visible;
        carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        carousel.style.transition = 'transform 0.45s ease';

        if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
        if (nextBtn) nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) { currentIndex--; update(); }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const visible = getVisibleCount();
            if (currentIndex < total - visible) { currentIndex++; update(); }
        });
    }

    // Set carousel display to flex and overflow hidden on parent
    carousel.style.display = 'flex';
    carousel.style.overflow = 'visible';

    window.addEventListener('resize', update);
    update();

    // Touch/swipe support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                const visible = getVisibleCount();
                if (currentIndex < total - visible) { currentIndex++; update(); }
            } else {
                if (currentIndex > 0) { currentIndex--; update(); }
            }
        }
    }, { passive: true });
})();

/* ============================================================
   BEFORE / AFTER COMPARISON SLIDER — drag, touch & keyboard
   ============================================================ */
(function initBeforeAfter() {
    const sliders = document.querySelectorAll('[data-ba]');
    if (!sliders.length) return;

    const reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    sliders.forEach(slider => {
        const handle = slider.querySelector('.ba-handle');
        let pos = 50;
        let dragging = false;
        let touched = false;
        let rafId = null;

        function setPos(v) {
            pos = Math.max(0, Math.min(100, v));
            slider.style.setProperty('--ba', pos.toFixed(2) + '%');
            if (handle) handle.setAttribute('aria-valuenow', Math.round(pos));
        }

        function posFrom(e) {
            const rect = slider.getBoundingClientRect();
            if (!rect.width) return pos;
            return ((e.clientX - rect.left) / rect.width) * 100;
        }

        function markTouched() {
            if (touched) return;
            touched = true;
            cancelAnimationFrame(rafId);
            slider.classList.add('is-touched');
        }

        slider.addEventListener('pointerdown', e => {
            markTouched();
            dragging = true;
            slider.classList.add('is-dragging');
            if (slider.setPointerCapture) {
                try { slider.setPointerCapture(e.pointerId); } catch (err) {}
            }
            setPos(posFrom(e));
            if (e.cancelable) e.preventDefault();
        });

        slider.addEventListener('pointermove', e => {
            if (!dragging) return;
            setPos(posFrom(e));
            if (e.cancelable) e.preventDefault();
        });

        ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => {
            slider.addEventListener(ev, () => {
                dragging = false;
                slider.classList.remove('is-dragging');
            });
        });

        /* Keep the results carousel swipe from firing while comparing */
        ['touchstart', 'touchmove', 'touchend'].forEach(ev => {
            slider.addEventListener(ev, e => e.stopPropagation(), { passive: true });
        });

        if (handle) {
            handle.addEventListener('keydown', e => {
                const step = e.shiftKey ? 10 : 5;
                let next = null;
                if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = pos - step;
                else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = pos + step;
                else if (e.key === 'Home') next = 0;
                else if (e.key === 'End') next = 100;
                if (next === null) return;
                e.preventDefault();
                markTouched();
                setPos(next);
            });
        }

        if (reduceMotion) { setPos(50); return; }

        /* Reveal sweep: starts fully "before", eases to the split */
        function sweep() {
            const from = 100, to = 50, dur = 1200;
            const started = performance.now();
            setPos(from);
            (function frame(now) {
                if (touched) return;
                const p = Math.min(1, (now - started) / dur);
                const eased = 1 - Math.pow(1 - p, 3);
                setPos(from + (to - from) * eased);
                if (p < 1) rafId = requestAnimationFrame(frame);
            })(started);
        }

        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    io.unobserve(entry.target);
                    sweep();
                });
            }, { threshold: 0.45 });
            io.observe(slider);
        }
    });
})();

/* ============================================================
   TESTIMONIALS CAROUSEL
   ============================================================ */
(function initTestimonialsCarousel() {
    const carousel = document.getElementById('testimonials-carousel');
    const prevBtn = document.getElementById('testi-prev');
    const nextBtn = document.getElementById('testi-next');
    if (!carousel) return;

    let currentIndex = 0;
    const cards = carousel.querySelectorAll('.testimonial-card');
    const total = cards.length;

    function getVisibleCount() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    }

    function update() {
        const visible = getVisibleCount();
        const maxIndex = Math.max(0, total - visible);
        currentIndex = Math.min(currentIndex, maxIndex);

        const cardWidth = carousel.offsetWidth / visible;
        carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        carousel.style.transition = 'transform 0.45s ease';

        if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
        if (nextBtn) nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) { currentIndex--; update(); }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const visible = getVisibleCount();
            if (currentIndex < total - visible) { currentIndex++; update(); }
        });
    }

    carousel.style.display = 'flex';
    carousel.style.overflow = 'visible';

    window.addEventListener('resize', update);
    update();

    // Touch support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                const visible = getVisibleCount();
                if (currentIndex < total - visible) { currentIndex++; update(); }
            } else {
                if (currentIndex > 0) { currentIndex--; update(); }
            }
        }
    }, { passive: true });
})();

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
(function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;

        btn.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            // Close all
            items.forEach(i => {
                i.classList.remove('active');
                const q = i.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            // Open clicked (toggle)
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
})();

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').slice(1);
            if (!targetId) return;
            const target = document.getElementById(targetId);
            if (!target) return;
            e.preventDefault();
            const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
            const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();

/* ============================================================
   ACTIVE NAV LINK on scroll
   ============================================================ */
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header-nav a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    function updateActive() {
        let current = '';
        const scrollY = window.scrollY + 100;
        sections.forEach(s => {
            if (scrollY >= s.offsetTop) current = s.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
})();

/* ============================================================
   FULL-WIDTH FORM — VALIDATION & SUBMISSION
   ============================================================ */
(function initFullwidthForm() {
    const form = document.getElementById('fullwidth-consult-form');
    const successEl = document.getElementById('fw-form-success');
    if (!form) return;

    function showError(field, message) {
        const wrap = field.closest('.form-field');
        if (!wrap) return;
        wrap.classList.add('error');
        const existing = wrap.querySelector('.field-error');
        if (existing) existing.remove();
        const errEl = document.createElement('span');
        errEl.className = 'field-error';
        errEl.textContent = message;
        wrap.appendChild(errEl);
    }

    function clearErrors() {
        form.querySelectorAll('.form-field').forEach(f => {
            f.classList.remove('error');
            const err = f.querySelector('.field-error');
            if (err) err.remove();
        });
    }

    function validateIndianPhone(phone) {
        return /^(\+91|91|0)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }

    function validateForm() {
        clearErrors();
        let valid = true;

        const name      = document.getElementById('fw-form-name');
        const email     = document.getElementById('fw-form-email');
        const phone     = document.getElementById('fw-form-phone');
        const treatment = document.getElementById('fw-form-treatment');
        const date      = document.getElementById('fw-form-date');

        if (!name.value.trim()) {
            showError(name, 'Please enter your name');
            valid = false;
        }
        if (!email.value.trim()) {
            showError(email, 'Please enter your email address');
            valid = false;
        } else if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            valid = false;
        }
        if (!phone.value.trim()) {
            showError(phone, 'Please enter your phone number');
            valid = false;
        } else if (!validateIndianPhone(phone.value.trim())) {
            showError(phone, 'Please enter a valid 10-digit Indian phone number');
            valid = false;
        }
        if (!treatment.value) {
            showError(treatment, 'Please select a treatment');
            valid = false;
        }
        if (!date.value) {
            showError(date, 'Please select a preferred date');
            valid = false;
        }

        return valid;
    }

    const GAS_URL = 'https://script.google.com/macros/s/AKfycbw3WgkQqgRRnzgAEsD8-IAUrwGsAWdNddvgrdwjm9rMi3uonbzn0kT_Xqoq8ap_aLZX/exec';

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!validateForm()) return;

        const submitBtn = form.querySelector('.btn-form-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        const payload = new URLSearchParams({
            name:        document.getElementById('fw-form-name').value.trim(),
            email:       document.getElementById('fw-form-email').value.trim(),
            phone:       document.getElementById('fw-form-phone').value.trim(),
            treatment:   document.getElementById('fw-form-treatment').value,
            date:        document.getElementById('fw-form-date').value,
            message:     'Submitted from Footer Form'
        });

        try {
            await fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: payload.toString()
            });

            form.style.display = 'none';
            if (successEl) successEl.style.display = 'block';

        } catch (err) {
            console.error('Footer form submission error:', err);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            alert('Something went wrong. Please try again or call us directly.');
        }
    });

    // Clear individual field error on input
    form.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', function () {
            const wrap = this.closest('.form-field');
            if (wrap) {
                wrap.classList.remove('error');
                const err = wrap.querySelector('.field-error');
                if (err) err.remove();
            }
        });
    });
})();

/* ============================================================
   POPUP MODAL — OPEN / CLOSE / GOOGLE APPS SCRIPT SUBMISSION
   ============================================================ */
(function initConsultModal() {

    const GAS_URL = 'https://script.google.com/macros/s/AKfycbw3WgkQqgRRnzgAEsD8-IAUrwGsAWdNddvgrdwjm9rMi3uonbzn0kT_Xqoq8ap_aLZX/exec';

    const modal       = document.getElementById('consult-modal');
    const openBtns    = document.querySelectorAll('#open-modal-btn, .open-modal-trigger');
    const closeBtn    = document.getElementById('modal-close');
    const form        = document.getElementById('modal-consult-form');
    const successEl   = document.getElementById('modal-success');
    const closeSucBtn = document.getElementById('modal-close-success');

    if (!modal) return;

    /* ---- Open / Close ---- */
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const first = modal.querySelector('input, select');
            if (first) first.focus();
        }, 120);
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function resetModal() {
        if (form) {
            form.reset();
            form.style.display = '';
            form.querySelectorAll('.form-field').forEach(f => {
                f.classList.remove('error');
                const err = f.querySelector('.field-error');
                if (err) err.remove();
            });
        }
        const header = modal.querySelector('.modal-card-header');
        if (header) header.style.display = '';
        if (successEl) successEl.classList.remove('visible');
    }

    openBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            resetModal();
            openModal();
        });
    });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeSucBtn) closeSucBtn.addEventListener('click', () => { closeModal(); setTimeout(resetModal, 350); });

    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });

    /* ---- Validation helpers ---- */
    if (!form) return;

    function showError(field, msg) {
        const wrap = field.closest('.form-field');
        if (!wrap) return;
        wrap.classList.add('error');
        const old = wrap.querySelector('.field-error');
        if (old) old.remove();
        const el = document.createElement('span');
        el.className = 'field-error';
        el.textContent = msg;
        wrap.appendChild(el);
    }

    function clearErrors() {
        form.querySelectorAll('.form-field').forEach(f => {
            f.classList.remove('error');
            const e = f.querySelector('.field-error');
            if (e) e.remove();
        });
    }

    function validPhone(p) {
        return /^(\+91|91|0)?[6-9]\d{9}$/.test(p.replace(/\s/g, ''));
    }

    function validate() {
        clearErrors();
        let ok = true;
        const name      = document.getElementById('modal-name');
        const email     = document.getElementById('modal-email');
        const phone     = document.getElementById('modal-phone');
        const treatment = document.getElementById('modal-treatment');
        const date      = document.getElementById('modal-date');

        if (!name.value.trim())
            { showError(name, 'Please enter your name'); ok = false; }

        if (!email.value.trim())
            { showError(email, 'Please enter your email'); ok = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))
            { showError(email, 'Please enter a valid email address'); ok = false; }

        if (!phone.value.trim())
            { showError(phone, 'Please enter your phone number'); ok = false; }
        else if (!validPhone(phone.value))
            { showError(phone, 'Please enter a valid 10-digit number'); ok = false; }

        if (!treatment.value)
            { showError(treatment, 'Please select a treatment'); ok = false; }

        if (!date.value)
            { showError(date, 'Please select a preferred date'); ok = false; }

        return ok;
    }

    /* ---- Google Apps Script Submission ---- */
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!validate()) return;

        const submitBtn = document.getElementById('modal-submit-btn');
        const original  = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
        submitBtn.disabled  = true;

        /* Keys MUST match e.parameter.xxx in your GAS doPost() exactly */
        const payload = {
            name:      document.getElementById('modal-name').value.trim(),
            email:     document.getElementById('modal-email').value.trim(),
            phone:     document.getElementById('modal-phone').value.trim(),
            treatment: document.getElementById('modal-treatment').value,
            date:      document.getElementById('modal-date').value,
            message:   (document.getElementById('modal-message') ? document.getElementById('modal-message').value.trim() : ''),
        };


        try {
            /* Google Apps Script requires no-cors for cross-origin POST.
               The response will be opaque (can't read it), but data reaches the sheet. */
            await fetch(GAS_URL, {
                method:  'POST',
                mode:    'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body:    new URLSearchParams(payload).toString(),
            });

            /* Since response is opaque we assume success after send */
            form.style.display = 'none';
            const header = modal.querySelector('.modal-card-header');
            if (header) header.style.display = 'none';
            if (successEl) successEl.classList.add('visible');

        } catch (err) {
            console.error('Modal submission error:', err);
            submitBtn.innerHTML = original;
            submitBtn.disabled  = false;
            alert('Something went wrong. Please try again or call us directly.');
        }
    });

    /* ---- Clear field errors on input ---- */
    form.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', function () {
            const wrap = this.closest('.form-field');
            if (wrap) {
                wrap.classList.remove('error');
                const err = wrap.querySelector('.field-error');
                if (err) err.remove();
            }
        });
    });

})();

/* ============================================================
   SMOOTH SCROLL REVEAL — fade-left / fade-right / fade-up / zoom-in
   data-anim="fade-right|fade-left|fade-up|zoom-in|fade-in|fade-down"
   data-delay="0|100|200..." per-element delay in ms
   data-anim-group on parent = auto stagger direct children
   ============================================================ */
(function initScrollAnimations() {
    'use strict';

    function start() {
        var els = Array.prototype.slice.call(document.querySelectorAll('[data-anim]'));
        if (!els.length) return;

        // 1. Explicit per-element delays win
        els.forEach(function (el) {
            var d = el.getAttribute('data-delay');
            if (d !== null && d !== '') {
                var ms = parseInt(d, 10);
                if (!isNaN(ms)) el.style.setProperty('--anim-delay', ms + 'ms');
            }
        });

        // 2. Auto-stagger inside [data-anim-group] (only children WITHOUT data-delay)
        Array.prototype.forEach.call(document.querySelectorAll('[data-anim-group]'), function (group) {
            var step = 0;
            Array.prototype.forEach.call(group.children, function (child) {
                if (child.hasAttribute('data-anim') && !child.hasAttribute('data-delay')) {
                    child.style.setProperty('--anim-delay', (step * 120) + 'ms');
                    step++;
                }
            });
        });

        // 3. Reduced motion OR no Observer support -> show everything
        var prefersReduced = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced || !('IntersectionObserver' in window)) {
            els.forEach(function (el) { el.classList.add('anim-active'); });
            return;
        }

        // 4. One observer per element — no section force-reveal,
        //    so each fade-left / fade-right triggers on its own position
        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('anim-active');
                obs.unobserve(entry.target);
            });
        }, {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.12
        });

        els.forEach(function (el) {
            observer.observe(el);
            // Hero / above-the-fold: reveal on next frame even before scroll
            var r = el.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) {
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        el.classList.add('anim-active');
                        observer.unobserve(el);
                    });
                });
            }
        });

        // 5. Safety net: if anything is still hidden after 4s
        //    (e.g. fast scroll, dynamic content), reveal it
        setTimeout(function () {
            els.forEach(function (el) {
                if (!el.classList.contains('anim-active')) {
                    var r = el.getBoundingClientRect();
                    if (r.top < window.innerHeight * 0.95) el.classList.add('anim-active');
                }
            });
        }, 4000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();

