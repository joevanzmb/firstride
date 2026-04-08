/* ============================================
   FIRST RIDE 2026 – JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {


  // ==========================================
  // COUNTDOWN TIMER
  // ==========================================
  const targetDate = new Date('2026-05-09T05:30:00+07:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysEl = document.getElementById('days');
    if (!daysEl) return;

    if (distance < 0) {
      daysEl.textContent = '00 Hari';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    daysEl.textContent = String(days).padStart(2, '0') + ' Hari';
  }

  updateCountdown();
  setInterval(updateCountdown, 1000 * 60 * 60); // Update every hour is enough now

  // ==========================================
  // NAVBAR SCROLL EFFECT
  // ==========================================
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavbarScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile nav when link clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ==========================================
  // SMOOTH SCROLL
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ==========================================
  // LIGHT PARALLAX ON HERO
  // ==========================================
  const heroBg = document.querySelector('.hero-bg img');

  function handleParallax() {
    const scrolled = window.pageYOffset;
    const heroHeight = document.querySelector('.hero').offsetHeight;
    
    if (scrolled < heroHeight) {
      const translateY = scrolled * 0.3;
      heroBg.style.transform = `scale(1) translateY(${translateY}px)`;
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // ==========================================
  // STAT COUNTER ANIMATION
  // ==========================================
  const statValues = document.querySelectorAll('.stat-value');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.textContent;
        
        // Only animate numeric values
        if (/^\d+/.test(target)) {
          const numericPart = parseInt(target);
          const suffix = target.replace(/\d+/, '');
          let current = 0;
          const increment = Math.ceil(numericPart / 60);
          const duration = 1200;
          const stepTime = duration / (numericPart / increment);

          const timer = setInterval(() => {
            current += increment;
            if (current >= numericPart) {
              current = numericPart;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, stepTime);
        }
        
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(el => counterObserver.observe(el));

  // ==========================================
  // COUNTDOWN FLIP ANIMATION
  // ==========================================
  const countdownValues = document.querySelectorAll('.countdown-value');
  
  // Store previous values for flip detection
  const prevValues = {};
  countdownValues.forEach(el => {
    prevValues[el.id] = el.textContent;
  });

  // Add subtle pulse when value changes
  setInterval(() => {
    countdownValues.forEach(el => {
      if (prevValues[el.id] !== el.textContent) {
        el.style.transform = 'scale(1.08)';
        setTimeout(() => {
          el.style.transform = 'scale(1)';
        }, 150);
        prevValues[el.id] = el.textContent;
      }
    });
  }, 250);

  // ==========================================
  // ACTIVE NAV LINK HIGHLIGHT
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.querySelectorAll('a').forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.style.color = 'var(--color-text)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ==========================================
  // HIDE SCROLL INDICATOR ON SCROLL
  // ==========================================
  const heroScroll = document.querySelector('.hero-scroll');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 200 && heroScroll) {
      heroScroll.style.opacity = '0';
      heroScroll.style.transform = 'translateX(-50%) translateY(20px)';
    } else if (heroScroll) {
      heroScroll.style.opacity = '1';
      heroScroll.style.transform = 'translateX(-50%) translateY(0)';
    }
  }, { passive: true });

  // ==========================================
  // LOAD REGISTERED PARTICIPANTS FROM LOCALSTORAGE
  // ==========================================
  function loadRegisteredParticipants() {
    const marquee = document.getElementById('participantsMarquee');
    if (!marquee) return;

    let participants = [];
    try {
      participants = JSON.parse(localStorage.getItem('firstride_participants') || '[]');
    } catch (e) {
      return;
    }

    if (participants.length === 0) return;

    // Find "Kamu?" placeholder cards to insert before them
    const allCards = marquee.querySelectorAll('.participant-card');
    const placeholderCards = [];
    allCards.forEach(card => {
      const nameEl = card.querySelector('.participant-name');
      if (nameEl && nameEl.textContent.trim() === 'Kamu?') {
        placeholderCards.push(card);
      }
    });

    // Create participant cards for each registered participant
    function createParticipantCard(p) {
      const card = document.createElement('div');
      card.className = 'participant-card';

      const initials = p.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

      let avatarContent = '';
      if (p.photo) {
        avatarContent = `<img src="${p.photo}" alt="${p.name}">`;
      } else {
        avatarContent = `<div class="initials">${initials}</div>`;
      }

      card.innerHTML = `
        <div class="participant-avatar">
          ${avatarContent}
        </div>
        <div class="participant-name">${p.name}</div>
        <div class="participant-role">Rider</div>
      `;
      return card;
    }

    // Insert before each placeholder card (both sets in marquee)
    placeholderCards.forEach(placeholder => {
      participants.forEach(p => {
        const card = createParticipantCard(p);
        placeholder.parentNode.insertBefore(card, placeholder);
      });
    });
  }

  loadRegisteredParticipants();

});

