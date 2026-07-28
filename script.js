// ============================================
// GUSTI PORTFOLIO — SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
    }, 400);
  });
  // Fallback jika event load lambat/tidak terpicu
  setTimeout(() => loader.classList.add('loaded'), 2500);

  /* ---------- Tahun otomatis di footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar sticky saat scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScrollNavbar = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  };
  onScrollNavbar();
  window.addEventListener('scroll', onScrollNavbar, { passive: true });

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!navLinksEl.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  /* ---------- Active navbar link saat scroll ---------- */
  const sections = document.querySelectorAll('main section[id], main#home');
  const navLinks = document.querySelectorAll('.nav-link');

  const setActiveLink = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active-link', link.dataset.section === id);
    });
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

  /* ---------- Scroll reveal animation ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Animasi progress bar skill saat terlihat ---------- */
  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const level = card.dataset.level || 0;
        const fill = card.querySelector('.progress-fill');
        requestAnimationFrame(() => { fill.style.width = level + '%'; });
        skillObserver.unobserve(card);
      }
    });
  }, { threshold: 0.4 });

  skillCards.forEach(card => skillObserver.observe(card));

  /* ---------- Animasi typing text pada hero ---------- */
  const typingEl = document.getElementById('typingText');
  const headline = 'Junior Web Developer & Siswa RPL';

  if (typingEl) {
    if (prefersReducedMotion) {
      typingEl.textContent = headline;
    } else {
      let charIndex = 0;
      const typeStep = () => {
        charIndex++;
        typingEl.textContent = headline.slice(0, charIndex);
        if (charIndex < headline.length) {
          setTimeout(typeStep, 45);
        }
      };
      typeStep();
    }
  }

  /* ---------- Tombol kembali ke atas ---------- */
  const backToTop = document.getElementById('backToTop');
  const onScrollTopBtn = () => {
    backToTop.classList.toggle('show', window.scrollY > 480);
  };
  onScrollTopBtn();
  window.addEventListener('scroll', onScrollTopBtn, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Contact form: validasi & pengiriman Formspree ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setFieldError = (input, errorEl, message) => {
      if (message) {
        input.classList.add('invalid');
        errorEl.textContent = message;
      } else {
        input.classList.remove('invalid');
        errorEl.textContent = '';
      }
    };

    const validateName = () => {
      const value = nameInput.value.trim();
      if (!value) {
        setFieldError(nameInput, nameError, 'Nama wajib diisi.');
        return false;
      }
      setFieldError(nameInput, nameError, '');
      return true;
    };

    const validateEmail = () => {
      const value = emailInput.value.trim();
      if (!value) {
        setFieldError(emailInput, emailError, 'Email wajib diisi.');
        return false;
      }
      if (!emailPattern.test(value)) {
        setFieldError(emailInput, emailError, 'Format email tidak valid.');
        return false;
      }
      setFieldError(emailInput, emailError, '');
      return true;
    };

    const validateMessage = () => {
      const value = messageInput.value.trim();
      if (!value) {
        setFieldError(messageInput, messageError, 'Pesan wajib diisi.');
        return false;
      }
      if (value.length < 10) {
        setFieldError(messageInput, messageError, 'Pesan minimal 10 karakter.');
        return false;
      }
      setFieldError(messageInput, messageError, '');
      return true;
    };

    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    messageInput.addEventListener('blur', validateMessage);

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        formStatus.textContent = 'Mohon periksa kembali kolom yang belum sesuai.';
        formStatus.style.color = '#f87171';
        return;
      }

      formStatus.textContent = 'Mengirim pesan...';
      formStatus.style.color = '#22d3ee';

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method,
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const name = nameInput.value.trim();
          formStatus.textContent = `Terima kasih, ${name}! Pesan kamu berhasil terkirim.`;
          formStatus.style.color = '#22d3ee';
          contactForm.reset();
        } else {
          const data = await response.json();
          if (Object.hasOwn(data, 'errors')) {
            formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
          } else {
            formStatus.textContent = "Gagal mengirim pesan. Silakan coba lagi.";
          }
          formStatus.style.color = '#f87171';
        }
      } catch (error) {
        formStatus.textContent = "Terjadi gangguan koneksi. Silakan coba lagi nanti.";
        formStatus.style.color = '#f87171';
      }
    });
  }

  /* ---------- Smooth scroll fallback untuk anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }
    });
  });
});