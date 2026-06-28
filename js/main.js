/* ============================================================
   CANINES WHO CARE — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── Nav: scroll shadow + active link ── */
  const nav = document.querySelector('.nav');

  function updateNavScroll() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll();

  // Mark active nav link
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Mobile hamburger ── */
  const hamburger = document.querySelector('.nav__hamburger');
  const navMenu   = document.querySelector('.nav__menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', e => {
      if (nav && !nav.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Scroll-triggered fade-in ── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    fadeEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 0.06}s`;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      } else {
        io.observe(el);
      }
    });
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Amount buttons (any page with .amount-grid) ── */
  document.querySelectorAll('.amount-grid').forEach(grid => {
    const btns = grid.querySelectorAll('.amount-btn');
    // Custom-amount field: support both the donate page (#donor-custom) and home (#home-custom)
    const customInput = document.getElementById('donor-custom') || document.getElementById('home-custom') || document.getElementById('custom-amount');
    const hiddenAmount = document.getElementById('home-donation-amount') || document.getElementById('donation-amount');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (customInput) customInput.value = '';
        const val = btn.dataset.amount === 'custom' ? '' : btn.dataset.amount;
        if (hiddenAmount) hiddenAmount.value = val;
      });
    });

    if (customInput) {
      customInput.addEventListener('input', () => {
        btns.forEach(b => b.classList.remove('active'));
        const cleaned = customInput.value.replace(/[^0-9.]/g, '');
        if (hiddenAmount) hiddenAmount.value = cleaned;
      });
    }
  });

  /* ── Gallery lightbox ── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('[data-lightbox]').forEach(item => {
      item.addEventListener('click', () => {
        lightboxImg.src = item.dataset.lightbox;
        lightboxImg.alt = item.dataset.caption || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ── Contact form (Formspree AJAX) ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const successMsg = document.getElementById('form-success');
      const origText = btn.textContent;

      btn.disabled = true;
      btn.textContent = 'Sending…';

      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          contactForm.reset();
          btn.textContent = 'Message Sent ✓';
          if (successMsg) { successMsg.style.display = 'block'; }
        } else {
          throw new Error('server error');
        }
      } catch {
        btn.disabled = false;
        btn.textContent = origText;
        alert('Something went wrong. Please email us directly at info@canineswhocare.org');
      }
    });
  }

  /* ── Team tabs (team-members page) ──
     Wix shows all three filter pills as static cyan buttons with no panels,
     so they are decorative here — only wire up panel switching if panels exist. */
  const hasTabPanels = document.querySelector('[data-tab-panel]');
  if (hasTabPanels) {
    document.querySelectorAll('.team-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.team-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.querySelectorAll('[data-tab-panel]').forEach(panel => {
          panel.style.display = panel.dataset.tabPanel === target ? '' : 'none';
        });
      });
    });
  }

  /* ── Donate card: pre-select an amount passed via ?amount= (e.g. a shared link) ── */
  const payOptions = document.querySelector('.pay-options');
  if (payOptions) {
    const params = new URLSearchParams(window.location.search);
    const incomingAmount = (params.get('amount') || '').replace(/[^0-9.]/g, '');
    if (incomingAmount) {
      const hidden = document.getElementById('donation-amount');
      if (hidden) hidden.value = incomingAmount;
      // Highlight a matching preset, else drop it into the custom field
      const presets = document.querySelectorAll('.amount-grid .amount-btn');
      let matched = false;
      presets.forEach(b => {
        const on = b.dataset.amount === incomingAmount;
        b.classList.toggle('active', on);
        if (on) matched = true;
      });
      if (!matched) {
        const custom = document.getElementById('donor-custom');
        if (custom) custom.value = incomingAmount;
      }
    }
  }

  /* ── Donate page: PayPal / Venmo / Zelle payment buttons ──
     Reads the selected amount (#donation-amount, kept in sync by the amount
     buttons + custom field above) and deep-links to the chosen provider. */
  if (payOptions) {
    // Resolve the current amount: custom field wins, else the hidden field.
    function currentAmount() {
      const custom = document.getElementById('donor-custom');
      const hidden = document.getElementById('donation-amount');
      let raw = (custom && custom.value.trim()) || (hidden && hidden.value) || '';
      raw = raw.replace(/[^0-9.]/g, '');
      const n = parseFloat(raw);
      return isNaN(n) || n <= 0 ? '' : (Math.round(n * 100) / 100).toString();
    }

    const zelleInfo = document.getElementById('zelle-info');

    payOptions.querySelectorAll('.pay-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const provider = btn.dataset.pay;
        const amount = currentAmount();

        // Zelle can't be deep-linked reliably — reveal instructions instead.
        if (provider === 'zelle') {
          if (zelleInfo) {
            zelleInfo.hidden = false;
            zelleInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          return;
        }

        if (zelleInfo) zelleInfo.hidden = true;

        if (provider === 'venmo') {
          const user = btn.dataset.venmoUser;
          if (!user || /YOUR_VENMO/i.test(user)) {
            alert('Venmo is not set up yet. Add the org’s @username in donate.html.');
            return;
          }
          // Venmo deep link: opens app on mobile, profile on desktop.
          const note = 'Donation to Canines Who Care';
          const url = 'https://venmo.com/' + encodeURIComponent(user) +
            '?txn=pay' + (amount ? '&amount=' + amount : '') +
            '&note=' + encodeURIComponent(note);
          window.open(url, '_blank', 'noopener');
          return;
        }

        if (provider === 'paypal') {
          const directUrl = btn.dataset.paypalUrl;     // PayPal Giving Fund / fundraiser link
          const me = btn.dataset.paypalMe;              // PayPal.me handle
          const buttonId = btn.dataset.paypalButton;    // hosted Donate button ID
          let url = '';
          if (directUrl && !/YOUR_PAYPAL/i.test(directUrl)) {
            // Charity fundraiser page handles its own amount selection
            url = directUrl;
          } else if (buttonId && !/YOUR_PAYPAL/i.test(buttonId)) {
            url = 'https://www.paypal.com/donate/?hosted_button_id=' + encodeURIComponent(buttonId);
          } else if (me && !/YOUR_PAYPAL/i.test(me)) {
            url = 'https://www.paypal.com/paypalme/' + encodeURIComponent(me) + (amount ? '/' + amount : '');
          }
          if (!url) {
            alert('PayPal is not set up yet. Add your PayPal link or hosted-button ID in donate.html.');
            return;
          }
          window.open(url, '_blank', 'noopener');
          return;
        }
      });
    });
  }

  /* ── Smart mailto links ──
     mailto: only works if the visitor has a default mail app. To make the
     address always usable, every click also copies it to the clipboard and
     shows a brief "Email copied" toast — the mailto still fires for those
     who do have a mail app. */
  const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (mailLinks.length) {
    let toast;
    function showToast(message) {
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.setAttribute('role', 'status');
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('show');
      clearTimeout(toast._t);
      toast._t = setTimeout(function () { toast.classList.remove('show'); }, 2600);
    }

    function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      // Fallback for older / non-secure contexts
      return new Promise(function (resolve, reject) {
        try {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          resolve();
        } catch (err) { reject(err); }
      });
    }

    mailLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        // Pull the bare address out of the mailto: href (drop ?subject=… etc.)
        const addr = (link.getAttribute('href') || '')
          .replace(/^mailto:/i, '')
          .split('?')[0];
        if (!addr) return;
        // Don't preventDefault — let the mail app open for those who have one.
        copyText(addr)
          .then(function () { showToast('Email copied: ' + addr); })
          .catch(function () { showToast('Email: ' + addr); });
      });
    });
  }

})();
