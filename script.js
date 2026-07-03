/* ==========================================================================
   PDI Achievers Mentorship Association — script.js
   Modular vanilla JS: nav, reveal animations, counters, accordion,
   gallery + lightbox, testimonials, forms, footer utilities.
   ========================================================================== */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ *
   * Page loader
   * ------------------------------------------------------------------ */
  const PageLoader = {
    init() {
      const loader = document.getElementById('pageLoader');
      if (!loader) return;
      const hide = () => loader.classList.add('is-hidden');
      if (document.readyState === 'complete') {
        setTimeout(hide, 150);
      } else {
        window.addEventListener('load', () => setTimeout(hide, 150));
      }
      // Safety net so the loader never blocks content indefinitely.
      setTimeout(hide, 2500);
    }
  };

  /* ------------------------------------------------------------------ *
   * Sticky navigation + scroll progress + active link tracking
   * ------------------------------------------------------------------ */
  const Nav = {
    init() {
      this.header = document.getElementById('siteHeader');
      this.progress = document.getElementById('scrollProgress');
      this.links = document.querySelectorAll('.nav-link');
      this.sections = [...this.links]
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();

      this.initMobileMenu();
      this.initSmoothAnchors();
    },

    onScroll() {
      const y = window.scrollY;
      this.header.classList.toggle('is-scrolled', y > 40);

      const doc = document.documentElement;
      const scrollableHeight = doc.scrollHeight - doc.clientHeight;
      const pct = scrollableHeight > 0 ? (y / scrollableHeight) * 100 : 0;
      if (this.progress) this.progress.style.width = pct + '%';

      this.updateActiveLink();
      this.toggleBackToTop(y);
    },

    updateActiveLink() {
      const fromTop = window.scrollY + window.innerHeight * 0.35;
      let current = this.sections[0];
      for (const sec of this.sections) {
        if (sec.offsetTop <= fromTop) current = sec;
      }
      this.links.forEach(link => {
        const match = document.querySelector(link.getAttribute('href')) === current;
        link.classList.toggle('is-active', match);
      });
    },

    toggleBackToTop(y) {
      const btn = document.getElementById('backToTop');
      if (btn) btn.classList.toggle('is-visible', y > 600);
    },

    initSmoothAnchors() {
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          const id = a.getAttribute('href');
          if (id.length < 2) return;
          const target = document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          const navHeight = this.header.offsetHeight;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
          window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          history.pushState(null, '', id);
          MobileMenu.close();
        });
      });
    },

    initMobileMenu() {
      MobileMenu.init();
    }
  };

  /* ------------------------------------------------------------------ *
   * Mobile menu: slide-in, overlay, focus trap, Escape to close
   * ------------------------------------------------------------------ */
  const MobileMenu = {
    init() {
      this.toggle = document.getElementById('navToggle');
      this.menu = document.getElementById('mobileMenu');
      this.overlay = document.getElementById('mobileMenuOverlay');
      if (!this.toggle || !this.menu) return;

      this.toggle.addEventListener('click', () => this.isOpen() ? this.close() : this.open());
      this.overlay.addEventListener('click', () => this.close());
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && this.isOpen()) this.close();
        if (e.key === 'Tab' && this.isOpen()) this.trapFocus(e);
      });
    },
    isOpen() { return document.body.classList.contains('nav-open'); },
    open() {
      document.body.classList.add('nav-open', 'no-scroll');
      this.toggle.setAttribute('aria-expanded', 'true');
      this.toggle.setAttribute('aria-label', 'Close menu');
      const firstLink = this.menu.querySelector('.nav-link');
      if (firstLink) firstLink.focus({ preventScroll: true });
    },
    close() {
      document.body.classList.remove('nav-open', 'no-scroll');
      this.toggle.setAttribute('aria-expanded', 'false');
      this.toggle.setAttribute('aria-label', 'Open menu');
    },
    trapFocus(e) {
      const focusables = this.menu.querySelectorAll('a, button');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  };

  /* ------------------------------------------------------------------ *
   * Scroll-reveal via IntersectionObserver (animate once)
   * ------------------------------------------------------------------ */
  const Reveal = {
    init() {
      const targets = document.querySelectorAll('[data-reveal]');
      if (!targets.length) return;
      if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        targets.forEach(t => t.classList.add('is-visible'));
        return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      targets.forEach(t => io.observe(t));
    }
  };

  /* ------------------------------------------------------------------ *
   * Count-up statistics
   * ------------------------------------------------------------------ */
  const Counters = {
    init() {
      const nodes = document.querySelectorAll('[data-count]');
      if (!nodes.length) return;
      if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        nodes.forEach(n => n.textContent = n.dataset.count);
        return;
      }
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      nodes.forEach(n => io.observe(n));
    },
    animate(node) {
      const target = parseInt(node.dataset.count, 10) || 0;
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else node.textContent = target;
      };
      requestAnimationFrame(step);
    }
  };

  /* ------------------------------------------------------------------ *
   * Programmes accordion
   * ------------------------------------------------------------------ */
  const Accordion = {
    init() {
      const list = document.getElementById('programmesList');
      if (!list) return;
      const items = list.querySelectorAll('.programme-item');
      items.forEach(item => {
        const trigger = item.querySelector('.programme-trigger');
        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');
          items.forEach(i => {
            i.classList.remove('is-open');
            i.querySelector('.programme-trigger').setAttribute('aria-expanded', 'false');
          });
          if (!isOpen) {
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      });
      // Open the first item by default for a populated first impression.
      const first = items[0];
      if (first) {
        first.classList.add('is-open');
        first.querySelector('.programme-trigger').setAttribute('aria-expanded', 'true');
      }
    }
  };

  /* ------------------------------------------------------------------ *
   * Gallery grid population + lightbox
   * ------------------------------------------------------------------ */
  const Gallery = {
    images: [
      { src: 'https://www.pdimentorshipassociation.org/WhatsApp Image 2025-08-12 at 13.27.29 (3).jpeg', tall: true },
      { src: 'https://www.pdimentorshipassociation.org/WhatsApp Image 2025-08-12 at 13.27.29.jpeg' },
      { src: 'https://www.pdimentorshipassociation.org/WhatsApp Image 2025-08-12 at 13.27.30 (1).jpeg' },
      { src: 'https://www.pdimentorshipassociation.org/WhatsApp Image 2025-08-12 at 13.27.30 (2).jpeg', tall: true },
      { src: 'https://www.pdimentorshipassociation.org/WhatsApp Image 2025-08-12 at 13.27.30 (3).jpeg' },
      { src: 'https://www.pdimentorshipassociation.org/WhatsApp Image 2025-08-12 at 13.27.30.jpeg' },
      { src: 'https://www.pdimentorshipassociation.org/WhatsApp Image 2025-08-12 at 13.27.31 (1).jpeg' },
      { src: 'https://www.pdimentorshipassociation.org/WhatsApp Image 2025-08-12 at 13.27.31 (2).jpeg', tall: true },
    ],
    init() {
      this.grid = document.getElementById('galleryGrid');
      if (!this.grid) return;
      this.render();
      this.initLightbox();
    },
    render() {
      const frag = document.createDocumentFragment();
      this.images.forEach((img, idx) => {
        const item = document.createElement('div');
        item.className = 'gallery-item' + (img.tall ? ' tall' : '');
        item.dataset.index = idx;
        item.innerHTML = `
          <img src="${img.src}" alt="PDI Achievers gallery photo ${idx + 1}" loading="lazy">
          <span class="gallery-zoom" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>
          </span>`;
        frag.appendChild(item);
      });
      this.grid.appendChild(frag);
    },
    initLightbox() {
      const lightbox = document.getElementById('lightbox');
      const img = document.getElementById('lightboxImg');
      const counter = document.getElementById('lightboxCounter');
      const closeBtn = document.getElementById('lightboxClose');
      const prevBtn = document.getElementById('lightboxPrev');
      const nextBtn = document.getElementById('lightboxNext');
      if (!lightbox) return;
      let currentIndex = 0;

      const open = (index) => {
        currentIndex = index;
        show();
        lightbox.classList.add('is-open');
        document.body.classList.add('no-scroll');
        closeBtn.focus();
      };
      const show = () => {
        const data = this.images[currentIndex];
        img.src = data.src;
        img.alt = `PDI Achievers gallery photo ${currentIndex + 1}`;
        counter.textContent = `${currentIndex + 1} / ${this.images.length}`;
      };
      const close = () => {
        lightbox.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
      };
      const next = () => { currentIndex = (currentIndex + 1) % this.images.length; show(); };
      const prev = () => { currentIndex = (currentIndex - 1 + this.images.length) % this.images.length; show(); };

      this.grid.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) open(parseInt(item.dataset.index, 10));
      });
      closeBtn.addEventListener('click', close);
      nextBtn.addEventListener('click', next);
      prevBtn.addEventListener('click', prev);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      });
    }
  };

  /* ------------------------------------------------------------------ *
   * Testimonial carousel (native scroll-snap + button controls)
   * ------------------------------------------------------------------ */
  const Testimonials = {
    init() {
      this.track = document.getElementById('testimonialTrack');
      if (!this.track) return;
      const prev = document.getElementById('testimonialPrev');
      const next = document.getElementById('testimonialNext');
      const scrollByCard = (dir) => {
        const card = this.track.querySelector('.testimonial-card');
        if (!card) return;
        const amount = card.getBoundingClientRect().width + 24;
        this.track.scrollBy({ left: dir * amount, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      };
      prev.addEventListener('click', () => scrollByCard(-1));
      next.addEventListener('click', () => scrollByCard(1));
    }
  };

  /* ------------------------------------------------------------------ *
   * Contact form: live validation, states, simulated submission
   * ------------------------------------------------------------------ */
  const ContactForm = {
    init() {
      this.form = document.getElementById('contactForm');
      if (!this.form) return;
      this.status = document.getElementById('cfStatus');
      this.submitBtn = document.getElementById('cfSubmit');

      this.form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => {
          if (field.closest('.field').classList.contains('is-invalid')) this.validateField(field);
        });
      });

      this.form.addEventListener('submit', (e) => this.onSubmit(e));
    },
    validateField(field) {
      const wrap = field.closest('.field');
      let valid = field.checkValidity();
      if (field.id === 'cf-email' && field.value) {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      }
      wrap.classList.toggle('is-invalid', !valid && field.value !== '');
      wrap.classList.toggle('is-valid', valid && field.value !== '');
      // select field needs manual "has-value" state for floating label since :not(:placeholder-shown) doesn't apply
      if (field.tagName === 'SELECT') {
        wrap.classList.toggle('has-value', field.value !== '');
      }
      return valid;
    },
    onSubmit(e) {
      e.preventDefault();
      const fields = [...this.form.querySelectorAll('input[required], textarea[required], select[required]')];
      const allValid = fields.map(f => this.validateField(f)).every(Boolean);

      if (!allValid) {
        this.showStatus('Please fix the highlighted fields before sending.', 'error');
        return;
      }

      this.submitBtn.classList.add('is-loading');
      this.submitBtn.setAttribute('disabled', 'true');

      // Simulated submission (no backend wired up) — swap for a real endpoint
      // (e.g. Formspree, Netlify Forms, or a custom API) at deployment time.
      setTimeout(() => {
        this.submitBtn.classList.remove('is-loading');
        this.submitBtn.removeAttribute('disabled');
        this.showStatus('Thank you — your message has been sent. We will be in touch soon.', 'success');
        this.form.reset();
        this.form.querySelectorAll('.field').forEach(f => f.classList.remove('is-valid', 'is-invalid', 'has-value'));
      }, 900);
    },
    showStatus(message, type) {
      this.status.textContent = message;
      this.status.className = 'form-status is-' + type;
    }
  };

  /* ------------------------------------------------------------------ *
   * Newsletter form (footer)
   * ------------------------------------------------------------------ */
  const Newsletter = {
    init() {
      const form = document.getElementById('newsletterForm');
      if (!form) return;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        const btn = form.querySelector('button');
        if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          input.style.borderColor = 'var(--color-error)';
          return;
        }
        btn.textContent = 'Subscribed ✓';
        input.value = '';
        input.style.borderColor = '';
        setTimeout(() => { btn.textContent = 'Subscribe'; }, 3000);
      });
    }
  };

  /* ------------------------------------------------------------------ *
   * Back to top
   * ------------------------------------------------------------------ */
  const BackToTop = {
    init() {
      const btn = document.getElementById('backToTop');
      if (!btn) return;
      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    }
  };

  /* ------------------------------------------------------------------ *
   * Subtle hero parallax (desktop only, respects reduced motion)
   * ------------------------------------------------------------------ */
  const Parallax = {
    init() {
      const media = document.querySelector('[data-parallax]');
      if (!media || prefersReducedMotion || window.matchMedia('(max-width: 768px)').matches) return;
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight * 1.2) {
            media.style.transform = `translateY(${y * 0.15}px)`;
          }
          ticking = false;
        });
      }, { passive: true });
    }
  };

  /* ------------------------------------------------------------------ *
   * Subtle custom cursor (desktop, pointer:fine only)
   * ------------------------------------------------------------------ */
  const CustomCursor = {
    init() {
      if (window.matchMedia('(hover: none), (pointer: coarse)').matches || prefersReducedMotion) return;
      this.dot = document.getElementById('cursorDot');
      this.ring = document.getElementById('cursorRing');
      if (!this.dot || !this.ring) return;

      let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        this.dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      });
      const animateRing = () => {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        this.ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
      };
      requestAnimationFrame(animateRing);

      document.querySelectorAll('a, button, .gallery-item').forEach(el => {
        el.addEventListener('mouseenter', () => this.ring.classList.add('is-active'));
        el.addEventListener('mouseleave', () => this.ring.classList.remove('is-active'));
      });
    }
  };

  /* ------------------------------------------------------------------ *
   * Footer year
   * ------------------------------------------------------------------ */
  const FooterYear = {
    init() {
      const el = document.getElementById('footerYear');
      if (el) el.textContent = new Date().getFullYear();
    }
  };

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    PageLoader.init();
    Nav.init();
    Reveal.init();
    Counters.init();
    Accordion.init();
    Gallery.init();
    Testimonials.init();
    ContactForm.init();
    Newsletter.init();
    BackToTop.init();
    Parallax.init();
    CustomCursor.init();
    FooterYear.init();
  });
})();
