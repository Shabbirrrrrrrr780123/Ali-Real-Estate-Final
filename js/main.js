/* ============================================
   ZAKIR'S REALTY — MAIN JS
   ============================================ */

// ── SLOW FOLLOW CURSOR ──
(function initCursor() {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reducedMotion) return;

  const dot = document.createElement('div');
  dot.className = 'custom-cursor cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  const ring = document.createElement('div');
  ring.className = 'custom-cursor cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);
  document.body.classList.add('custom-cursor-enabled');

  let targetX = -100;
  let targetY = -100;
  let ringX = targetX;
  let ringY = targetY;

  window.addEventListener('pointermove', event => {
    targetX = event.clientX;
    targetY = event.clientY;
    dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
    document.body.classList.add('custom-cursor-visible');
    ring.classList.toggle('is-hovering', Boolean(event.target.closest('a, button, input, select, textarea, [role="button"]')));
  });

  document.documentElement.addEventListener('mouseleave', () => {
    document.body.classList.remove('custom-cursor-visible');
  });

  function followPointer() {
    ringX += (targetX - ringX) * 0.12;
    ringY += (targetY - ringY) * 0.12;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(followPointer);
  }
  followPointer();
})();

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
const scrollThreshold = 60;

window.addEventListener('scroll', () => {
  if (window.scrollY > scrollThreshold) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// ── MOBILE NAV ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');

hamburger?.addEventListener('click', () => {
  mobileNav?.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileNavClose?.focus();
  document.body.style.overflow = 'hidden';
});
mobileNavClose?.addEventListener('click', closeMobileNav);
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileNav?.classList.contains('open')) closeMobileNav();
});

function closeMobileNav() {
  mobileNav?.classList.remove('open');
  hamburger?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  hamburger?.focus();
}

// ── HERO PARTICLE CANVAS ──
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -1000, y: -1000 };
  const PARTICLE_COUNT = 120;
  const CONNECTION_DIST = 130;
  const MOUSE_RADIUS = 140;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      vx: randomBetween(-0.25, 0.25),
      vy: randomBetween(-0.25, 0.25),
      size: randomBetween(1, 2.5),
      alpha: randomBetween(0.2, 0.7),
      color: Math.random() > 0.75 ? '#FF6A00' : '#4a4a4a'
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,106,0,${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      // Mouse repulsion
      const mx = p.x - mouse.x;
      const my = p.y - mouse.y;
      const md = Math.sqrt(mx * mx + my * my);
      if (md < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - md) / MOUSE_RADIUS;
        p.vx += (mx / md) * force * 0.5;
        p.vy += (my / md) * force * 0.5;
      }

      // Dampen velocity
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color === '#FF6A00'
        ? `rgba(255,106,0,${p.alpha})`
        : `rgba(74,74,74,${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

  window.addEventListener('resize', init);
  init();
  draw();
})();

// ── REVEAL ON SCROLL ──
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

// ── PARALLAX HERO ──
window.addEventListener('scroll', () => {
  const heroContent = document.querySelector('.hero-content');
  const glow = document.querySelector('.hero-glow');
  if (heroContent) {
    heroContent.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    heroContent.style.opacity = 1 - window.scrollY / 500;
  }
  if (glow) {
    glow.style.transform = `translate(-50%, calc(-50% + ${window.scrollY * 0.15}px))`;
  }
});

// ── LEAD FORM SUBMISSION ──
const leadForm = document.getElementById('leadForm');
leadForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = leadForm.querySelector('[type="submit"]');
  const status = document.getElementById('leadFormStatus');
  if (!btn) return;
  const originalText = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;
  if (status) status.textContent = '';

  const data = Object.fromEntries(new FormData(leadForm).entries());
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPD0EuZ6zFXfpMqCXSRctc-KtoPk6qaK-vqTg0cQtpNhwGN_szsy9O3kbQ9G4ooSNqLA/exec';

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        ...data,
        propertyType: data.type || 'Not specified',
        visitDate: '',
        timeSlot: '',
        notes: data.message ? `Contact form: ${data.message}` : 'Contact form enquiry',
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    if (status) status.textContent = 'We could not send your enquiry. Please try again.';
    btn.textContent = originalText;
    btn.disabled = false;
    return;
  }

  leadForm.style.display = 'none';
  const success = document.getElementById('formSuccess');
  if (success) success.classList.add('show');
});

// ── PROPERTY FILTER ──
const filterBudget = document.getElementById('filterBudget');
const filterLocation = document.getElementById('filterLocation');
const filterType = document.getElementById('filterType');
const propertyCards = document.querySelectorAll('.property-card[data-budget][data-location]');

function applyFilters() {
  const budget = filterBudget?.value || 'all';
  const location = filterLocation?.value || 'all';
  const type = filterType?.value || 'all';

  propertyCards.forEach(card => {
    const matchBudget = budget === 'all' || card.dataset.budget === budget;
    const matchLocation = location === 'all' || card.dataset.location === location;
    const matchType = type === 'all' || card.dataset.type === type;
    card.style.display = (matchBudget && matchLocation && matchType) ? '' : 'none';
  });
}

filterBudget?.addEventListener('change', applyFilters);
filterLocation?.addEventListener('change', applyFilters);
filterType?.addEventListener('change', applyFilters);

// ── ACTIVE NAV LINK ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ── COUNTER ANIMATION ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + (el.dataset.suffix || '');
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));
