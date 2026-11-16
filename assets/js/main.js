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
   9. VERIFIKASI HCAPTCHA (SERVER-SIDE)
   ========================================================= */
async function verifyTokenOnServer(token) {
  try {
    var response = await fetch(API_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token }),
    });

    if (!response.ok) {
      return { success: false, message: 'Server verifikasi sedang bermasalah. Coba lagi nanti.' };
    }

    var result = await response.json();

    if (result.success === true) {
      return { success: true };
    }

    var errors = result.errors || [];

    if (errors.indexOf('invalid-input-response') !== -1 ||
        errors.indexOf('expired-input-response') !== -1 ||
        errors.indexOf('timeout-or-duplicate') !== -1) {
      return { success: false, message: 'Captcha sudah kadaluarsa. Silakan selesaikan ulang.' };
    }

    if (errors.indexOf('invalid-input-secret') !== -1 ||
        errors.indexOf('missing-input-secret') !== -1) {
      return { success: false, message: 'Konfigurasi server salah. Hubungi admin.' };
    }

    return { success: false, message: 'Verifikasi captcha gagal. Silakan coba lagi.' };
  } catch (error) {
    console.error('Error verifying hCaptcha token:', error);
    return { success: false, message: 'Koneksi terganggu. Periksa jaringan internet Anda.' };
  }
}


/* =========================================================
   10. VALIDATOR EMAIL — PESAN SPESIFIK PER KASUS
   Mengembalikan { valid: boolean, message: string }
   ========================================================= */
function validateEmailDetailed(email) {
  // 1. Kosong
  if (!email || email.trim() === '') {
    return { valid: false, message: 'Email wajib diisi.' };
  }

  email = email.trim();

  // 2. Ada spasi
  if (/\s/.test(email)) {
    return { valid: false, message: 'Email tidak boleh mengandung spasi.' };
  }

  // 3. Terlalu panjang (RFC 5321)
  if (email.length > 254) {
    return { valid: false, message: 'Email terlalu panjang (maksimal 254 karakter).' };
  }

  // 4. Jumlah simbol @
  var atCount = (email.match(/@/g) || []).length;
  if (atCount === 0) {
    return { valid: false, message: 'Email harus mengandung simbol @. Contoh: nama@contoh.com' };
  }
  if (atCount > 1) {
    return { valid: false, message: 'Email hanya boleh mengandung satu simbol @.' };
  }

  // 5. Pisahkan local part & domain
  var parts = email.split('@');
  var local = parts[0];
  var domain = parts[1];

  if (!local) {
    return { valid: false, message: 'Bagian nama pengguna (sebelum @) tidak boleh kosong.' };
  }
  if (!domain) {
    return { valid: false, message: 'Bagian domain (setelah @) tidak boleh kosong. Contoh: nama@gmail.com' };
  }

  // 6. Local part
  if (local.length > 64) {
    return { valid: false, message: 'Bagian nama pengguna (sebelum @) terlalu panjang (maksimal 64 karakter).' };
  }
  if (!/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(local)) {
    return { valid: false, message: 'Nama pengguna hanya boleh berisi huruf, angka, titik, dan beberapa simbol (!#$%&\'*+/=?^_`{|}~-).' };
  }
  if (local.charAt(0) === '.' || local.charAt(local.length - 1) === '.') {
    return { valid: false, message: 'Nama pengguna tidak boleh diawali atau diakhiri dengan titik.' };
  }
  if (local.indexOf('..') !== -1) {
    return { valid: false, message: 'Nama pengguna tidak boleh mengandung dua titik berurutan (..).' };
  }

  // 7. Domain
  if (domain.indexOf('.') === -1) {
    return { valid: false, message: 'Domain harus mengandung titik. Contoh: nama@gmail.com' };
  }
  if (domain.charAt(0) === '.' || domain.charAt(domain.length - 1) === '.') {
    return { valid: false, message: 'Domain tidak boleh diawali atau diakhiri dengan titik.' };
  }
  if (domain.indexOf('..') !== -1) {
    return { valid: false, message: 'Domain tidak boleh mengandung dua titik berurutan (..).' };
  }
  if (domain.charAt(0) === '-' || domain.charAt(domain.length - 1) === '-') {
    return { valid: false, message: 'Domain tidak boleh diawali atau diakhiri dengan tanda minus.' };
  }

  // 8. TLD (ekstensi setelah titik terakhir)
  var tld = domain.split('.').pop();
  if (tld.length < 2) {
    return { valid: false, message: 'Ekstensi domain terlalu pendek (minimal 2 huruf). Contoh: .com, .id' };
  }
  if (!/^[a-zA-Z]+$/.test(tld)) {
    return { valid: false, message: 'Ekstensi domain hanya boleh berisi huruf (contoh: .com, .id, .net).' };
  }

  // 9. Deteksi typo domain umum
  var domainLower = domain.toLowerCase();
  var typoMap = {
    'gmail.co':   'gmail.com',
    'gmail.cm':   'gmail.com',
    'gmail.con':  'gmail.com',
    'gmial.com':  'gmail.com',
    'gmai.com':   'gmail.com',
    'gmil.com':   'gmail.com',
    'gmail.comm': 'gmail.com',
    'yahoo.co':   'yahoo.com',
    'yahoo.con':  'yahoo.com',
    'yaho.com':   'yahoo.com',
    'yahooo.com': 'yahoo.com',
    'hotmai.com': 'hotmail.com',
    'hotmal.com': 'hotmail.com',
    'hotmail.co': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com',
    'outlook.co': 'outlook.com',
  };

  if (typoMap[domainLower]) {
    return {
      valid: false,
      message: 'Sepertinya ada salah ketik. Maksud Anda @' + typoMap[domainLower] + '?'
    };
  }

  return { valid: true, message: '' };
}


/* =========================================================
   11. INPUT MASK UNTUK NOMOR WHATSAPP
   Menggunakan jQuery Mask Plugin (dimuat dari head.html)
   ========================================================= */
(function initWhatsAppMask() {
  if (typeof jQuery === 'undefined' || typeof jQuery.fn.mask === 'undefined') return;

  var $waInput = jQuery('#no-whatsapp');
  if ($waInput.length) {
    $waInput.mask('+62 899-9999-99999', { placeholder: '+62 8xx-xxxx-xxxx' });
  }
})();


/* =========================================================
   12. FORM KONTAK (EMAIL & WHATSAPP)
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

    // ------------------------------------------------
    // Validasi saat blur & input — NAMA & PESAN (umum)
    // ------------------------------------------------
    [nameInput, messageInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('blur', function () {
        if (!input.checkValidity()) showError(input, input.validationMessage);
        else clearError(input);
      });
      input.addEventListener('input', function () {
        if (input.checkValidity()) clearError(input);
      });
    });

    // ------------------------------------------------
    // Validasi EMAIL (khusus form email) — pakai validator detail
    // ------------------------------------------------
    if (prefix === 'email' && emailOrWaInput) {
      emailOrWaInput.addEventListener('blur', function () {
        var check = validateEmailDetailed(this.value);
        if (!check.valid) showError(this, check.message);
        else clearError(this);
      });
      emailOrWaInput.addEventListener('input', function () {
        if (this.value === '') { clearError(this); return; }
        var check = validateEmailDetailed(this.value);
        if (!check.valid) showError(this, check.message);
        else clearError(this);
      });
    }

    // ------------------------------------------------
    // Validasi WHATSAPP (khusus form WA) — pakai checkValidity standar
    // ------------------------------------------------
    if (prefix === 'wa' && emailOrWaInput) {
      emailOrWaInput.addEventListener('blur', function () {
        if (!this.checkValidity()) showError(this, this.validationMessage);
        else clearError(this);
      });
      emailOrWaInput.addEventListener('input', function () {
        if (this.checkValidity()) clearError(this);
      });
    }

    // ------------------------------------------------
    // Checkbox persetujuan
    // ------------------------------------------------
    if (agreeCheckbox) {
      agreeCheckbox.addEventListener('change', function () {
        var err = document.getElementById(agreeCheckbox.id + '-error');
        if (err) err.textContent = agreeCheckbox.checked ? '' : 'Anda harus menyetujui syarat dan ketentuan.';
      });
    }

    // ------------------------------------------------
    // Submit handler
    // ------------------------------------------------
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var valid = true;

      // A. Validasi field teks umum (nama & pesan)
      [nameInput, messageInput].forEach(function (input) {
        if (!input) return;
        if (!input.checkValidity()) {
          showError(input, input.validationMessage);
          valid = false;
        } else {
          clearError(input);
        }
      });

      // A.2 Validasi email / WA (spesifik per tipe form)
      if (emailOrWaInput) {
        if (prefix === 'email') {
          var emailCheck = validateEmailDetailed(emailOrWaInput.value);
          if (!emailCheck.valid) {
            showError(emailOrWaInput, emailCheck.message);
            valid = false;
          } else {
            clearError(emailOrWaInput);
          }
        } else {
          if (!emailOrWaInput.checkValidity()) {
            showError(emailOrWaInput, emailOrWaInput.validationMessage);
            valid = false;
          } else {
            clearError(emailOrWaInput);
          }
        }
      }

      // B. Validasi checkbox persetujuan
      if (agreeCheckbox && !agreeCheckbox.checked) {
        var agreeErr = document.getElementById(agreeCheckbox.id + '-error');
        if (agreeErr) agreeErr.textContent = 'Anda harus menyetujui syarat dan ketentuan.';
        valid = false;
      }

      // C. Validasi & Verifikasi hCaptcha
      if (!BYPASS_CAPTCHA) {
        var captchaResponse = form.querySelector('[name="h-captcha-response"]');
        var captchaError = document.getElementById('captcha-error-' + prefix);

        if (typeof window.hcaptcha === 'undefined') {
          if (captchaError) captchaError.textContent = 'Captcha gagal dimuat. Refresh halaman lalu coba lagi.';
          valid = false;
        } else if (!captchaResponse || !captchaResponse.value) {
          if (captchaError) captchaError.textContent = 'Silakan selesaikan verifikasi captcha terlebih dahulu.';
          valid = false;
        } else {
          if (captchaError) captchaError.textContent = 'Memverifikasi captcha...';
          if (submitBtn) submitBtn.disabled = true;

          var result = await verifyTokenOnServer(captchaResponse.value);

          if (!result.success) {
            if (captchaError) captchaError.textContent = result.message;
            if (window.hcaptcha) window.hcaptcha.reset();
            if (submitBtn) submitBtn.disabled = false;
            valid = false;
          } else {
            if (captchaError) captchaError.textContent = '';
          }
        }
      }

      if (!valid) return;

      // D. Kirim form berdasarkan tipe
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
   13. FORM KUESIONER
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

    // A. Validasi field teks
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

    // B. Validasi checkbox persetujuan
    var agreeError = document.getElementById('agree-error');
    if (!fields.agree.checked) {
      if (agreeError) agreeError.textContent = 'Anda harus menyetujui syarat dan ketentuan.';
      valid = false;
    } else if (agreeError) {
      agreeError.textContent = '';
    }

    // C. Validasi & Verifikasi hCaptcha
    if (!BYPASS_CAPTCHA) {
      var captchaResponse = form.querySelector('[name="h-captcha-response"]');
      var captchaError = document.getElementById('captcha-error');

      if (typeof window.hcaptcha === 'undefined') {
        if (captchaError) captchaError.textContent = 'Captcha gagal dimuat. Refresh halaman lalu coba lagi.';
        valid = false;
      } else if (!captchaResponse || !captchaResponse.value) {
        if (captchaError) captchaError.textContent = 'Silakan selesaikan verifikasi captcha terlebih dahulu.';
        valid = false;
      } else {
        if (captchaError) captchaError.textContent = 'Memverifikasi captcha...';
        if (submitBtn) submitBtn.disabled = true;

        var result = await verifyTokenOnServer(captchaResponse.value);

        if (!result.success) {
          if (captchaError) captchaError.textContent = result.message;
          if (window.hcaptcha) window.hcaptcha.reset();
          if (submitBtn) submitBtn.disabled = false;
          valid = false;
        } else {
          if (captchaError) captchaError.textContent = '';
        }
      }
    }

    if (!valid) return;

    // D. Kirim data kuesioner ke endpoint backend
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
