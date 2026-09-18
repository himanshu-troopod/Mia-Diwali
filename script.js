(() => {
  const body = document.body;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeMenu = () => {
    mobileNav?.classList.remove('open');
    mobileNav?.setAttribute('aria-hidden', 'true');
    menuButton?.setAttribute('aria-expanded', 'false');
  };
  menuButton?.addEventListener('click', () => {
    const open = !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', open);
    mobileNav.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-expanded', String(open));
  });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  const searchPanel = document.querySelector('.search-panel');
  const searchToggle = document.querySelector('.search-toggle');
  const searchClose = document.querySelector('.search-close');
  const closeSearch = () => {
    searchPanel?.classList.remove('open');
    searchPanel?.setAttribute('aria-hidden', 'true');
  };
  searchToggle?.addEventListener('click', () => {
    searchPanel.classList.add('open');
    searchPanel.setAttribute('aria-hidden', 'false');
    setTimeout(() => document.querySelector('#siteSearch')?.focus(), 50);
  });
  searchClose?.addEventListener('click', closeSearch);

  const reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(element => element.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .09, rootMargin: '0px 0px -45px' });
    reveals.forEach(element => observer.observe(element));
  }

  document.querySelectorAll('.wish').forEach(button => button.addEventListener('click', () => {
    const active = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!active));
    button.textContent = active ? '♡' : '♥';
    button.setAttribute('aria-label', `${active ? 'Add' : 'Remove'} ${button.getAttribute('aria-label').replace(/^(Add|Remove) /, '')}`);
  }));

  // Play & Win modal: ported from the GIVA Diwali build.
  const modal = document.getElementById('gameModal');
  const gameTitle = document.getElementById('gameTitle');
  const gameText = document.getElementById('gameText');
  const gameAction = document.getElementById('gameAction');
  const reward = document.getElementById('rewardMessage');
  let game = 'crackers';
  let lastTrigger = null;
  const openGame = (type, trigger) => {
    game = type;
    lastTrigger = trigger || null;
    gameTitle.textContent = type === 'crackers' ? 'Burst the Crackers' : 'Catch the Mithai';
    gameText.textContent = type === 'crackers'
      ? 'Tap the button and enjoy a small web-native firework moment.'
      : 'Tap the button for a festive demo reward moment.';
    gameAction.textContent = type === 'crackers' ? 'Burst now' : 'Catch now';
    reward.textContent = '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('no-scroll');
    modal.querySelector('.modal-close')?.focus();
  };
  const closeGame = () => {
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden', 'true');
    body.classList.remove('no-scroll');
    lastTrigger?.focus();
  };
  document.querySelectorAll('[data-discovery]').forEach(btn =>
    btn.addEventListener('click', () => openGame(btn.dataset.discovery, btn)));
  document.querySelectorAll('[data-close-game]').forEach(btn =>
    btn.addEventListener('click', closeGame));
  gameAction?.addEventListener('click', () => {
    reward.textContent = game === 'crackers' ? 'Festive sparkle unlocked!' : 'Festive treat unlocked!';
    burstParticles(modal.querySelector('.modal-card'), 42);
  });

  function burstParticles(container, count) {
    if (reduced || !container) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('i');
      const angle = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 120;
      p.style.cssText = `position:absolute;left:50%;top:38%;width:${2 + Math.random() * 4}px;height:${2 + Math.random() * 4}px;border-radius:50%;background:${Math.random() > .45 ? '#f7d382' : '#dd4576'};pointer-events:none;z-index:8;transition:transform .8s ease-out,opacity .8s ease-out;`;
      container.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${Math.cos(angle) * dist}px,${Math.sin(angle) * dist}px)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 850);
    }
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeSearch();
      if (modal?.classList.contains('open')) closeGame();
    }
    if (event.key === 'Tab' && modal?.classList.contains('open')) {
      const focusable = [...modal.querySelectorAll('button, a[href]')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  document.querySelector('.newsletter form')?.addEventListener('submit', event => {
    event.preventDefault();
    event.currentTarget.reset();
    document.querySelector('.newsletter-message').textContent = 'Thank you — this concept form is not connected to a mailing list.';
  });
})();

// ===== Closing CTA firework canvas (ported from GIVA Diwali build) =====
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('closingCanvas');
  if (!canvas || reduced) return;
  const intensity = 1.15;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, particles = [];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const launch = () => {
    const x = Math.random() * w * .85 + w * .075;
    const y = Math.random() * h * .42 + h * .06;
    const count = Math.round(18 * intensity);
    const hue = Math.random() > .45 ? '#f7d382' : '#dd4576';
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i / count) + Math.random() * .16;
      const s = 1 + Math.random() * 2.2;
      particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, r: 1 + Math.random() * 1.4, c: hue });
    }
  };
  let last = 0;
  const draw = t => {
    ctx.clearRect(0, 0, w, h);
    if (t - last > 2200 / intensity) { launch(); last = t; }
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += .008; p.vx *= .995; p.life -= .012;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    particles = particles.filter(p => p.life > 0);
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });
  requestAnimationFrame(draw);
})();
