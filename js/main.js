/* =========================================
   TEDxUniversityofPiraeus — Main JS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll ───────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ─── Active nav link ─────────────────────
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ─── Hamburger menu ──────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── Scroll reveal ───────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${i * 0.08}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => observer.observe(el));

  // ─── Stagger children reveal ─────────────
  const staggerGroups = document.querySelectorAll('.stagger-group');
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('.reveal');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 120);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  staggerGroups.forEach(g => staggerObserver.observe(g));

  // ─── Cursor glow (desktop only) ──────────
  if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed; width: 300px; height: 300px;
      border-radius: 50%; pointer-events: none; z-index: 0;
      background: radial-gradient(circle, rgba(230,43,30,0.06) 0%, transparent 70%);
      transform: translate(-50%, -50%); transition: opacity 0.3s ease;
      will-change: transform;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      curX += (mouseX - curX) * 0.08;
      curY += (mouseY - curY) * 0.08;
      cursor.style.transform = `translate(${curX - 150}px, ${curY - 150}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // ─── Ticker duplicate (seamless) ─────────
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    const items = tickerTrack.innerHTML;
    tickerTrack.innerHTML = items + items; // duplicate for seamless loop
  }

  // ─── Number counter animation ─────────────
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 1500;
        const start = Date.now();
        const tick = () => {
          const progress = Math.min((Date.now() - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(ease * target);
          if (progress < 1) requestAnimationFrame(tick);
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

});
