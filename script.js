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

  const modal = document.querySelector('.discovery-modal');
  const modalTitle = document.querySelector('#discoveryTitle');
  const modalText = document.querySelector('#discoveryText');
  const modalLink = document.querySelector('#discoveryLink');
  const modalClose = modal?.querySelector('.modal-close');
  let lastTrigger = null;
  const content = {
    crackers: {
      title: 'Burst the Crackers',
      text: 'A little Diwali moment, made brighter by Mia. Discover jewellery that brings the sparkle.',
      url: '#diwali-shop'
    },
    mithai: {
      title: 'Catch the Mithai',
      text: 'Sweeten the celebration with a Mia gifting edit for everyone who lights up your life.',
      url: '#gifting'
    }
  };
  const closeModal = () => {
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden', 'true');
    body.classList.remove('no-scroll');
    lastTrigger?.focus();
  };
  document.querySelectorAll('[data-discovery]').forEach(button => button.addEventListener('click', () => {
    lastTrigger = button;
    const item = content[button.dataset.discovery];
    modalTitle.textContent = item.title;
    modalText.textContent = item.text;
    modalLink.href = item.url;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('no-scroll');
    modalClose.focus();
  }));
  modalClose?.addEventListener('click', closeModal);
  modal?.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeSearch();
      if (modal?.classList.contains('open')) closeModal();
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
