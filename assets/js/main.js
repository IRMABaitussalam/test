/* =========================================================
   KONFIGURASI GLOBAL
   ---------------------------------------------------------
   BYPASS_CAPTCHA:
   - true  → Lewati verifikasi captcha (untuk testing lokal)
   - false → Wajib verifikasi captcha (untuk production)

   API_VERIFY_URL:
   - Endpoint Vercel untuk memverifikasi token hCaptcha
   ========================================================= */
var BYPASS_CAPTCHA = false;
var API_VERIFY_URL = 'https://irmabaitussalam.vercel.app/api/verify';


/* =========================================================
   1. LOADER
   Sembunyikan loading screen setelah halaman siap
   ========================================================= */
(function initLoader() {
  var loader = document.getElementById('page-loader');
  if (!loader) return;
  if (document.documentElement.classList.contains('loader-skip')) return;

  function hide() {
    loader.classList.add('is-hidden');
    try { sessionStorage.setItem('irma-loader-shown', '1'); } catch (e) {}
    setTimeout(function () { loader.style.display = 'none'; }, 800);
  }

  if (document.readyState === 'complete') {
    setTimeout(hide, 900);
  } else {
    window.addEventListener('load', function () { setTimeout(hide, 900); });
    setTimeout(hide, 5000);
  }
})();


/* =========================================================
   2. TEMA GELAP / TERANG
   ========================================================= */
(function initTheme() {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();


/* =========================================================
   3. HAMBURGER MENU (MOBILE)
   ========================================================= */
(function initHamburger() {
  var btn = document.getElementById('hamburger');
  var nav = document.getElementById('main-nav');
  var overlay = document.getElementById('nav-overlay');
  if (!btn || !nav) return;

  function setOpen(open) {
    btn.classList.toggle('is-active', open);
    nav.classList.toggle('is-active', open);
    if (overlay) overlay.classList.toggle('is-active', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    document.body.classList.toggle('no-scroll', open);
  }

  btn.addEventListener('click', function () {
    setOpen(!nav.classList.contains('is-active'));
  });
  if (overlay) overlay.addEventListener('click', function () { setOpen(false); });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();


/* =========================================================
   4. SCROLL REVEAL (Anti-FOUC)
   Animasi muncul saat elemen masuk viewport
   ========================================================= */
(function initScrollReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
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

  els.forEach(function (el) { observer.observe(el); });
})();


/* =========================================================
   5. LIGHTBOX GALERI
   ========================================================= */
(function initLightbox() {
  var grid = document.querySelector('.gallery-grid');
  var box = document.getElementById('lightbox');
  if (!grid || !box) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  var imgEl = box.querySelector('.lightbox-img');
  var capEl = box.querySelector('.lightbox-caption');
  var btnClose = box.querySelector('.lightbox-close');
  var btnPrev = box.querySelector('.lightbox-prev');
  var btnNext = box.querySelector('.lightbox-next');
  var current = 0;

  function show(index) {
    current = (index + items.length) % items.length;
    var item = items[current];
    var img = item.querySelector('img');
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

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { show(i); });
  });
  btnClose.addEventListener('click', hide);
  btnPrev.addEventListener('click', function () { show(current - 1); });
  btnNext.addEventListener('click', function () { show(current + 1); });
  box.addEventListener('click', function (e) {
    if (e.target === box) hide();
  });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();


/* =========================================================
   6. TAB SWITCHER (EMAIL / WHATSAPP)
   ========================================================= */
(function initTabs() {
  var tabs = document.querySelectorAll('.tab-btn');
  var panes = document.querySelectorAll('.tab-pane');
  if (!tabs.length || !panes.length) return;

  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      panes.forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var targetId = btn.getAttribute('data-target');
      var targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
})();


/* =========================================================
   7. TAB PENGURUS (HALAMAN TENTANG)
   ========================================================= */
(function initPengurusTabs() {
  var tabs = document.querySelectorAll('#pengurus-tabs .tab-btn');
  var panes = document.querySelectorAll('.page-about .tab-pane');
  if (!tabs.length || !panes.length) return;

  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      panes.forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var target = document.getElementById(btn.getAttribute('data-target'));
      if (target) target.classList.add('active');
    });
  });
})();


/* =========================================================
   8. SUCCESS OVERLAY
   Tampilan sukses full-screen setelah form terkirim
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

document.addEventListener('click', function (e) {
  if (e.target.closest('#close-success')) hideSuccessOverlay();
  if (e.target.id === 'success-overlay') hideSuccessOverlay();
});


/* =========================================================
   9. FUNGSI VERIFIKASI HCAPTCHA (SERVER-SIDE)
   Mengirim token ke Vercel untuk diverifikasi
   ========================================================= */
async function verifyTokenOnServer(token) {
  try {
    var response = await fetch(API_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token }),
    });

    var result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error verifying hCaptcha token:', error);
    return false;
  }
}


/* =========================================================
   10. FORM KONTAK (EMAIL & WHATSAPP)
   ========================================================= */
(function initContactForms() {
  var GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwLkE2nFTCu87gYniSIsPQNUtq0CamRq-ZP8CnIaedvELdG0eELvCN3O5ClwU5uEw4P/exec";
  var WA_TARGET_PHONE = "6285860536014";

  function setupForm(formId, prefix) {
    var form = document.getElementById(formId);
    if (!form) return;

    var nameInput = form.querySelector('input[name="name"]');
    var emailOrWaInput = form.querySelector('input[name="email"], input[name="no-whatsapp"]');
    var subjectInput = form.querySelector('input[name="subject"]');
    var messageInput = form.querySelector('textarea[name="message"]');
    var agreeCheckbox = form.querySelector('input[name="agree"]');
    var statusEl = document.getElementById('form-status-' + prefix);
    var submitBtn = document.getElementById('submit-btn-' + prefix);

    function showError(input, message) {
      var err = document.getElementById(input.id + '-error');
      if (err) err.textContent = message;
      input.classList.add('invalid');
    }
    function clearError(input) {
      var err = document.getElementById(input.id + '-error');
      if (err) err.textContent = '';
      input.classList.remove('invalid');
    }

    // Validasi saat blur & input
    [nameInput, emailOrWaInput, messageInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('blur', function () {
        if (!input.checkValidity()) showError(input, input.validationMessage);
        else clearError(input);
      });
      input.addEventListener('input', function () {
        if (input.checkValidity()) clearError(input);
      });
    });

    if (agreeCheckbox) {
      agreeCheckbox.addEventListener('change', function () {
        var err = document.getElementById(agreeCheckbox.id + '-error');
        if (err) err.textContent = agreeCheckbox.checked ? '' : 'Anda harus menyetujui syarat dan ketentuan.';
      });
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var valid = true;

      // ------------------------------------------------
      // A. Validasi field teks
      // ------------------------------------------------
      [nameInput, emailOrWaInput, messageInput].forEach(function (input) {
        if (!input) return;
        if (!input.checkValidity()) {
          showError(input, input.validationMessage);
          valid = false;
        } else {
          clearError(input);
        }
      });

      // ------------------------------------------------
      // B. Validasi checkbox persetujuan
      // ------------------------------------------------
      if (agreeCheckbox && !agreeCheckbox.checked) {
        var agreeErr = document.getElementById(agreeCheckbox.id + '-error');
        if (agreeErr) agreeErr.textContent = 'Anda harus menyetujui syarat dan ketentuan.';
        valid = false;
      }

      // ------------------------------------------------
      // C. Validasi & Verifikasi hCaptcha
      // ------------------------------------------------
      if (!BYPASS_CAPTCHA) {
        var captchaResponse = form.querySelector('[name="h-captcha-response"]');
        var captchaError = document.getElementById('captcha-error-' + prefix);

        if (!captchaResponse || !captchaResponse.value) {
          if (captchaError) captchaError.textContent = 'Silakan selesaikan verifikasi captcha.';
          valid = false;
        } else {
          if (captchaError) captchaError.textContent = 'Memverifikasi captcha...';
          if (submitBtn) submitBtn.disabled = true;

          var isVerified = await verifyTokenOnServer(captchaResponse.value);

          if (!isVerified) {
            if (captchaError) captchaError.textContent = 'Verifikasi captcha gagal. Silakan coba lagi.';
            if (window.hcaptcha) window.hcaptcha.reset();
            if (submitBtn) submitBtn.disabled = false;
            valid = false;
          } else if (captchaError) {
            captchaError.textContent = '';
          }
        }
      }

      if (!valid) return;

      // ------------------------------------------------
      // D. Kirim form berdasarkan tipe
      // ------------------------------------------------

      // D.1 EMAIL — kirim ke Google Apps Script
      if (prefix === 'email') {
        try {
          if (submitBtn) submitBtn.disabled = true;
          statusEl.textContent = 'Mengirim...';

          var formData = new URLSearchParams();
          formData.append('name', nameInput.value);
          formData.append('email', emailOrWaInput.value);
          formData.append('subject', subjectInput ? subjectInput.value : '');
          formData.append('message', messageInput.value);

          var res = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          });

          if (res.ok) {
            form.reset();
            if (window.hcaptcha) window.hcaptcha.reset();
            statusEl.textContent = '';
            if (submitBtn) submitBtn.disabled = false;
            showSuccessOverlay(
              'Pesan Terkirim!',
              'Terima kasih telah menghubungi kami via Email. Kami akan segera membalas pesan Anda.'
            );
          } else {
            statusEl.textContent = 'Gagal mengirim. Silakan coba lagi.';
            if (submitBtn) submitBtn.disabled = false;
          }
        } catch (err) {
          statusEl.textContent = 'Terjadi kesalahan jaringan.';
          if (submitBtn) submitBtn.disabled = false;
        }
      }

      // D.2 WHATSAPP — buka aplikasi WhatsApp
      if (prefix === 'wa') {
        var waLink = "https://web.whatsapp.com/send";
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          waLink = "whatsapp://send";
        }

        var message = "Assalamu'alaikum wr. wb.\n" +
          '*Nama*: ' + nameInput.value + '\n' +
          '*Nomor WhatsApp*: ' + emailOrWaInput.value + '\n';
        if (subjectInput && subjectInput.value !== '') {
          message += '*Subjek*: ' + subjectInput.value + '\n';
        }
        message += '*Pesan*: ' + messageInput.value + '\n';

        var finalWaLink = waLink + '?phone=' + WA_TARGET_PHONE + '&text=' + encodeURIComponent(message);

        window.open(finalWaLink, '_blank');
        form.reset();
        if (window.hcaptcha) window.hcaptcha.reset();
        showSuccessOverlay(
          'Membuka WhatsApp!',
          'Pesan Anda sedang disiapkan. Silakan lanjutkan percakapan di aplikasi WhatsApp Anda.'
        );
      }
    });
  }

  setupForm('contact-form-email', 'email');
  setupForm('contact-form-wa', 'wa');
})();


/* =========================================================
   11. FORM KUESIONER
   ========================================================= */
(function initKuesionerForm() {
  var form = document.getElementById('kuesioner-form');
  if (!form) return;

  var fields = {
    nama: document.getElementById('nama'),
    kelas: document.getElementById('kelas'),
    instansi: document.getElementById('instansi'),
    noWhatsapp: document.getElementById('no-whatsapp'),
    kesan: document.getElementById('kesan'),
    kritik: document.getElementById('kritik'),
    saran: document.getElementById('saran'),
    agree: document.getElementById('agree'),
  };

  var statusEl = document.getElementById('form-status');
  var submitBtn = document.getElementById('submit-btn');

  function showError(input, message) {
    var err = document.getElementById(input.id + '-error');
    if (err) err.textContent = message;
    input.classList.add('invalid');
  }
  function clearError(input) {
    var err = document.getElementById(input.id + '-error');
    if (err) err.textContent = '';
    input.classList.remove('invalid');
  }

  // Validasi saat blur & input
  Object.keys(fields).forEach(function (key) {
    var input = fields[key];
    if (!input) return;
    input.addEventListener('blur', function () {
      if (!input.checkValidity()) showError(input, input.validationMessage);
      else clearError(input);
    });
    input.addEventListener('input', function () {
      if (input.checkValidity()) clearError(input);
    });
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var valid = true;

    // ------------------------------------------------
    // A. Validasi field teks
    // ------------------------------------------------
    [fields.nama, fields.kelas, fields.instansi, fields.noWhatsapp,
     fields.kesan, fields.kritik, fields.saran].forEach(function (input) {
      if (!input) return;
      if (!input.checkValidity()) {
        showError(input, input.validationMessage);
        valid = false;
      } else {
        clearError(input);
      }
    });

    // ------------------------------------------------
    // B. Validasi checkbox persetujuan
    // ------------------------------------------------
    var agreeError = document.getElementById('agree-error');
    if (!fields.agree.checked) {
      if (agreeError) agreeError.textContent = 'Anda harus menyetujui syarat dan ketentuan.';
      valid = false;
    } else if (agreeError) {
      agreeError.textContent = '';
    }

    // ------------------------------------------------
    // C. Validasi & Verifikasi hCaptcha
    // ------------------------------------------------
    if (!BYPASS_CAPTCHA) {
      var captchaResponse = form.querySelector('[name="h-captcha-response"]');
      var captchaError = document.getElementById('captcha-error');

      if (!captchaResponse || !captchaResponse.value) {
        if (captchaError) captchaError.textContent = 'Silakan selesaikan verifikasi captcha.';
        valid = false;
      } else {
        if (captchaError) captchaError.textContent = 'Memverifikasi captcha...';
        if (submitBtn) submitBtn.disabled = true;

        var isVerified = await verifyTokenOnServer(captchaResponse.value);

        if (!isVerified) {
          if (captchaError) captchaError.textContent = 'Verifikasi captcha gagal. Silakan coba lagi.';
          if (window.hcaptcha) window.hcaptcha.reset();
          if (submitBtn) submitBtn.disabled = false;
          valid = false;
        } else if (captchaError) {
          captchaError.textContent = '';
        }
      }
    }

    if (!valid) return;

    // ------------------------------------------------
    // D. Kirim data kuesioner ke endpoint backend
    // ------------------------------------------------
    var payload = {
      nama: fields.nama.value,
      kelas: fields.kelas.value,
      instansi: fields.instansi.value,
      'no-whatsapp': fields.noWhatsapp.value,
      kesan: fields.kesan.value,
      kritik: fields.kritik.value,
      saran: fields.saran.value,
      'h-captcha-response': BYPASS_CAPTCHA
        ? 'BYPASS_TOKEN'
        : (captchaResponse ? captchaResponse.value : ''),
    };

    try {
      if (submitBtn) submitBtn.disabled = true;
      statusEl.textContent = 'Mengirim...';

      var res = await fetch('/api/kuesioner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        form.reset();
        if (window.hcaptcha) window.hcaptcha.reset();
        statusEl.textContent = '';
        if (submitBtn) submitBtn.disabled = false;
        showSuccessOverlay(
          'Kuesioner Terkirim!',
          'Terima kasih telah mengisi kuesioner ini. Masukan Anda sangat berarti bagi kami.'
        );
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
