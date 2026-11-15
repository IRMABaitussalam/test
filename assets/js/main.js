/* =========================================================
   KONFIGURASI TESTING
   Ubah ke false sebelum deploy ke production
   ========================================================= */
var BYPASS_CAPTCHA = true;

/* =========================================================
   LOADER — sembunyi otomatis setelah window.load
   ========================================================= */
(function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  if (document.documentElement.classList.contains('loader-skip')) return;

  const hide = () => {
    loader.classList.add('is-hidden');
    try { sessionStorage.setItem('irma-loader-shown', '1'); } catch (e) {}
    setTimeout(() => { loader.style.display = 'none'; }, 800);
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 900);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 900));
    setTimeout(hide, 5000);
  }
})();

/* =========================================================
   TEMA
   ========================================================= */
(function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

/* =========================================================
   HAMBURGER
   ========================================================= */
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  const overlay = document.getElementById('nav-overlay');
  if (!btn || !nav) return;

  function setOpen(open) {
    btn.classList.toggle('is-active', open);
    nav.classList.toggle('is-active', open);
    if (overlay) overlay.classList.toggle('is-active', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    document.body.classList.toggle('no-scroll', open);
  }

  btn.addEventListener('click', () => setOpen(!nav.classList.contains('is-active')));
  if (overlay) overlay.addEventListener('click', () => setOpen(false));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 768) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
})();

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
/* =========================================================
   SCROLL REVEAL (Anti-FOUC)
   ========================================================= */
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Paksa browser flush layout dulu baru trigger animasi
          void entry.target.offsetHeight;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.01, rootMargin: '0px 0px 50px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();

/* =========================================================
   LIGHTBOX
   ========================================================= */
(function initLightbox() {
  const grid = document.querySelector('.gallery-grid');
  const box = document.getElementById('lightbox');
  if (!grid || !box) return;

  const items = Array.from(grid.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  const imgEl = box.querySelector('.lightbox-img');
  const capEl = box.querySelector('.lightbox-caption');
  const btnClose = box.querySelector('.lightbox-close');
  const btnPrev = box.querySelector('.lightbox-prev');
  const btnNext = box.querySelector('.lightbox-next');
  let current = 0;

  function show(index) {
    current = (index + items.length) % items.length;
    const item = items[current];
    const img = item.querySelector('img');
    imgEl.src = item.dataset.src || img.src;
    imgEl.alt = img.alt || '';
    capEl.textContent = item.dataset.caption || img.alt || '';
    box.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }
  function hide() {
    box.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  items.forEach((item, i) => item.addEventListener('click', () => show(i)));
  btnClose.addEventListener('click', hide);
  btnPrev.addEventListener('click', () => show(current - 1));
  btnNext.addEventListener('click', () => show(current + 1));
  box.addEventListener('click', (e) => { if (e.target === box) hide(); });
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

/* =========================================================
   TAB SWITCHER: EMAIL / WHATSAPP
   ========================================================= */
(function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');
  if (!tabs.length || !panes.length) return;

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
})();

/* =========================================================
   TAB PENGURUS (HALAMAN TENTANG)
   ========================================================= */
(function initPengurusTabs() {
  const tabs = document.querySelectorAll('#pengurus-tabs .tab-btn');
  const panes = document.querySelectorAll('.page-about .tab-pane');
  if (!tabs.length || !panes.length) return;

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.getAttribute('data-target'));
      if (target) target.classList.add('active');
    });
  });
})();

/* =========================================================
   SUCCESS OVERLAY (BARU)
   ========================================================= */
var overlayTimeout;

function showSuccessOverlay(title, message) {
  var overlay = document.getElementById('success-overlay');
  if (!overlay) return;

  var titleEl = overlay.querySelector('h2');
  var msgEl = document.getElementById('success-message');

  if (titleEl) titleEl.textContent = title || 'Pesan Terkirim!';
  if (msgEl) msgEl.textContent = message || 'Terima kasih telah menghubungi kami.';

  overlay.classList.add('is-active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');

  clearTimeout(overlayTimeout);
  overlayTimeout = setTimeout(hideSuccessOverlay, 5000);
}

function hideSuccessOverlay() {
  var overlay = document.getElementById('success-overlay');
  if (!overlay) return;
  overlay.classList.remove('is-active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  clearTimeout(overlayTimeout);
}

document.addEventListener('click', function(e) {
  if (e.target.closest('#close-success')) hideSuccessOverlay();
  if (e.target.id === 'success-overlay') hideSuccessOverlay();
});

/* =========================================================
   VALIDASI FORM KONTAK (EMAIL & WHATSAPP) - VERSI BARU
   ========================================================= */
(function initContactForms() {
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwLkE2nFTCu87gYniSIsPQNUtq0CamRq-ZP8CnIaedvELdG0eELvCN3O5ClwU5uEw4P/exec";
  const WA_TARGET_PHONE = "6285860536014";

  function setupForm(formId, prefix) {
    const form = document.getElementById(formId);
    if (!form) return;

    const nameInput = form.querySelector('input[name="name"]');
    const emailOrWaInput = form.querySelector('input[name="email"], input[name="no-whatsapp"]');
    const subjectInput = form.querySelector('input[name="subject"]');
    const messageInput = form.querySelector('textarea[name="message"]');
    const agreeCheckbox = form.querySelector('input[name="agree"]');
    const statusEl = document.getElementById(`form-status-${prefix}`);
    const submitBtn = document.getElementById(`submit-btn-${prefix}`);

    function showError(input, message) {
      const err = document.getElementById(input.id + '-error');
      if (err) err.textContent = message;
      input.classList.add('invalid');
    }
    function clearError(input) {
      const err = document.getElementById(input.id + '-error');
      if (err) err.textContent = '';
      input.classList.remove('invalid');
    }

    [nameInput, emailOrWaInput, messageInput].forEach(input => {
      if (!input) return;
      input.addEventListener('blur', () => {
        if (!input.checkValidity()) showError(input, input.validationMessage);
        else clearError(input);
      });
      input.addEventListener('input', () => {
        if (input.checkValidity()) clearError(input);
      });
    });

    if (agreeCheckbox) {
      agreeCheckbox.addEventListener('change', () => {
        const err = document.getElementById(agreeCheckbox.id + '-error');
        if (err) err.textContent = agreeCheckbox.checked ? '' : 'Anda harus menyetujui syarat dan ketentuan.';
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;

      [nameInput, emailOrWaInput, messageInput].forEach(input => {
        if (!input) return;
        if (!input.checkValidity()) {
          showError(input, input.validationMessage);
          valid = false;
        } else {
          clearError(input);
        }
      });

      if (agreeCheckbox && !agreeCheckbox.checked) {
        const err = document.getElementById(agreeCheckbox.id + '-error');
        if (err) err.textContent = 'Anda harus menyetujui syarat dan ketentuan.';
        valid = false;
      }

      // Validasi hCaptcha (dengan BYPASS)
      let captchaResponse = null;
      if (!BYPASS_CAPTCHA) {
        captchaResponse = form.querySelector('[name="h-captcha-response"]');
        const captchaError = document.getElementById(`captcha-error-${prefix}`);
        if (!captchaResponse || !captchaResponse.value) {
          if (captchaError) captchaError.textContent = 'Silakan selesaikan verifikasi captcha.';
          valid = false;
        } else if (captchaError) {
          captchaError.textContent = '';
        }
      }

      if (!valid) return;

      // ============ EMAIL ============
      if (prefix === 'email') {
        try {
          if (submitBtn) submitBtn.disabled = true;
          statusEl.textContent = 'Mengirim...';

          const formData = new URLSearchParams();
          formData.append('name', nameInput.value);
          formData.append('email', emailOrWaInput.value);
          formData.append('subject', subjectInput ? subjectInput.value : '');
          formData.append('message', messageInput.value);

          const res = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          });

          if (res.ok) {
            form.reset();
            if (window.hcaptcha) window.hcaptcha.reset();
            statusEl.textContent = '';
            if (submitBtn) submitBtn.disabled = false;
            showSuccessOverlay('Pesan Terkirim!', 'Terima kasih telah menghubungi kami via Email. Kami akan segera membalas pesan Anda.');
          } else {
            statusEl.textContent = 'Gagal mengirim. Silakan coba lagi.';
            if (submitBtn) submitBtn.disabled = false;
          }
        } catch (err) {
          statusEl.textContent = 'Terjadi kesalahan jaringan.';
          if (submitBtn) submitBtn.disabled = false;
        }
      }

      // ============ WHATSAPP ============
      if (prefix === 'wa') {
        let waLink = "https://web.whatsapp.com/send";
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          waLink = "whatsapp://send";
        }

        let message = "Assalamu'alaikum wr. wb.\n" +
          '*Nama*: ' + nameInput.value + '\n' +
          '*Nomor WhatsApp*: ' + emailOrWaInput.value + '\n';
        if (subjectInput && subjectInput.value !== '') {
          message += '*Subjek*: ' + subjectInput.value + '\n';
        }
        message += '*Pesan*: ' + messageInput.value + '\n';

        const finalWaLink = waLink + '?phone=' + WA_TARGET_PHONE + '&text=' + encodeURIComponent(message);
        window.open(finalWaLink, '_blank');
        form.reset();
        if (window.hcaptcha) window.hcaptcha.reset();
        showSuccessOverlay('Membuka WhatsApp!', 'Pesan Anda sedang disiapkan. Silakan lanjutkan percakapan di aplikasi WhatsApp Anda.');
      }
    });
  }

  setupForm('contact-form-email', 'email');
  setupForm('contact-form-wa', 'wa');
})();

/* =========================================================
   VALIDASI FORM KUESIONER - VERSI BARU
   ========================================================= */
(function initKuesionerForm() {
  const form = document.getElementById('kuesioner-form');
  if (!form) return;

  const fields = {
    nama: document.getElementById('nama'),
    kelas: document.getElementById('kelas'),
    instansi: document.getElementById('instansi'),
    noWhatsapp: document.getElementById('no-whatsapp'),
    kesan: document.getElementById('kesan'),
    kritik: document.getElementById('kritik'),
    saran: document.getElementById('saran'),
    agree: document.getElementById('agree'),
  };

  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  function showError(input, message) {
    const err = document.getElementById(input.id + '-error');
    if (err) err.textContent = message;
    input.classList.add('invalid');
  }
  function clearError(input) {
    const err = document.getElementById(input.id + '-error');
    if (err) err.textContent = '';
    input.classList.remove('invalid');
  }

  Object.values(fields).forEach((input) => {
    if (!input) return;
    input.addEventListener('blur', () => {
      if (!input.checkValidity()) showError(input, input.validationMessage);
      else clearError(input);
    });
    input.addEventListener('input', () => {
      if (input.checkValidity()) clearError(input);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    [fields.nama, fields.kelas, fields.instansi, fields.noWhatsapp, fields.kesan, fields.kritik, fields.saran].forEach((input) => {
      if (!input) return;
      if (!input.checkValidity()) {
        showError(input, input.validationMessage);
        valid = false;
      } else {
        clearError(input);
      }
    });

    const agreeError = document.getElementById('agree-error');
    if (!fields.agree.checked) {
      if (agreeError) agreeError.textContent = 'Anda harus menyetujui syarat dan ketentuan.';
      valid = false;
    } else if (agreeError) {
      agreeError.textContent = '';
    }

    // Validasi hCaptcha (dengan BYPASS)
    let captchaResponse = null;
    if (!BYPASS_CAPTCHA) {
      captchaResponse = form.querySelector('[name="h-captcha-response"]');
      const captchaError = document.getElementById('captcha-error');
      if (!captchaResponse || !captchaResponse.value) {
        if (captchaError) captchaError.textContent = 'Silakan selesaikan verifikasi captcha.';
        valid = false;
      } else if (captchaError) {
        captchaError.textContent = '';
      }
    }

    if (!valid) return;

    const payload = {
      nama: fields.nama.value,
      kelas: fields.kelas.value,
      instansi: fields.instansi.value,
      'no-whatsapp': fields.noWhatsapp.value,
      kesan: fields.kesan.value,
      kritik: fields.kritik.value,
      saran: fields.saran.value,
      'h-captcha-response': BYPASS_CAPTCHA ? 'BYPASS_TOKEN' : (captchaResponse ? captchaResponse.value : ''),
    };

    try {
      if (submitBtn) submitBtn.disabled = true;
      statusEl.textContent = 'Mengirim...';

      const res = await fetch('/api/kuesioner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        form.reset();
        if (window.hcaptcha) window.hcaptcha.reset();
        statusEl.textContent = '';
        if (submitBtn) submitBtn.disabled = false;
        showSuccessOverlay('Kuesioner Terkirim!', 'Terima kasih telah mengisi kuesioner ini. Masukan Anda sangat berarti bagi kami.');
      } else {
        statusEl.textContent = 'Gagal mengirim. Silakan coba lagi.';
        if (submitBtn) submitBtn.disabled = false;
      }
    } catch (err) {
      statusEl.textContent = 'Terjadi kesalahan jaringan.';
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
