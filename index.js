(function () {
  'use strict';

  // --- Coordinates & Custom Cursor Variables ---
  const cursor = document.getElementById('custom-cursor');
  const glow = document.getElementById('cursor-glow');
  const coords = document.getElementById('cursor-coords');
  const compass = document.getElementById('blueprint-compass-svg');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;

  // --- 1. Mouse Move Interactive Tracking ---
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // A. Update Coordinates Text
    if (coords) {
      const normX = (e.clientX / window.innerWidth).toFixed(2);
      const normY = (e.clientY / window.innerHeight).toFixed(2);
      coords.textContent = `[${normX}, ${normY}]`;
    }

    // B. Set variables on Root for CSS mesh gradient
    const pctX = (e.clientX / window.innerWidth) * 100;
    const pctY = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mx', `${pctX}%`);
    document.documentElement.style.setProperty('--my', `${pctY}%`);

    // C. Rotate technical compass relative to mouse
    if (compass) {
      const rect = compass.getBoundingClientRect();
      const compassCenterX = rect.left + rect.width / 2;
      const compassCenterY = rect.top + rect.height / 2;
      // Calculate angle in degrees
      const angle = Math.atan2(e.clientY - compassCenterY, e.clientX - compassCenterX) * (180 / Math.PI);
      compass.style.transform = `rotate(${angle + 90}deg)`; // +90 to offset pointing direction
    }
  });

  // --- 2. Lerp (Linear Interpolation) for Smooth Custom Cursor Follow ---
  function updateCursorPosition() {
    // Custom cursor instantly follows
    if (cursor) {
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    }

    // Outer glow follows with a small delay (lerp factor 0.15)
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;

    if (glow) {
      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;
    }

    requestAnimationFrame(updateCursorPosition);
  }
  requestAnimationFrame(updateCursorPosition);

  // --- 3. Cursor Hover Effects ---
  const hoverables = document.querySelectorAll('a, button, input, textarea, .service-card, .project-item');
  hoverables.forEach((element) => {
    element.addEventListener('mouseenter', () => {
      if (cursor) cursor.classList.add('hovered');
      if (glow) glow.classList.add('hovered');
    });
    element.addEventListener('mouseleave', () => {
      if (cursor) cursor.classList.remove('hovered');
      if (glow) glow.classList.remove('hovered');
    });
  });

  // --- 4. Lenis Smooth Scroll Setup ---
  let lenisInstance;
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Power 4 out style ease
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1.0,
      smoothTouch: false,
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // --- 5. GSAP ScrollTrigger Animations ---
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Entry Animation
    const heroTimeline = gsap.timeline();
    
    heroTimeline.from('.hero-metadata .mono-meta', {
      opacity: 0,
      y: -15,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    heroTimeline.from('.hero-title', {
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: 'power4.out'
    }, '-=0.5');
    
    heroTimeline.from('.hero-description', {
      opacity: 0,
      y: 20,
      duration: 1.0,
      ease: 'power3.out'
    }, '-=0.8');
    
    heroTimeline.from('.hero-cta-group .btn', {
      opacity: 0,
      y: 15,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.8');

    heroTimeline.from('.hero-blueprint-indicator', {
      opacity: 0,
      x: 30,
      duration: 1.0,
      ease: 'power3.out'
    }, '-=0.8');

    // Services Card Reveals
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '.services-section',
        start: 'top 80%',
      },
      opacity: 0,
      y: 40,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Process Steps Reveals
    gsap.from('.process-step', {
      scrollTrigger: {
        trigger: '.process-section',
        start: 'top 80%',
      },
      opacity: 0,
      y: 40,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Why Choose Us Reveals
    gsap.from('.why-us-item', {
      scrollTrigger: {
        trigger: '.why-us-section',
        start: 'top 80%',
      },
      opacity: 0,
      y: 40,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Portfolio Items Reveals
    gsap.from('.project-item', {
      scrollTrigger: {
        trigger: '.portfolio-section',
        start: 'top 75%',
      },
      opacity: 0,
      y: 50,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Manifesto Section Pillars Reveals
    gsap.from('.manifesto-lead', {
      scrollTrigger: {
        trigger: '.manifesto-section',
        start: 'top 80%',
      },
      opacity: 0,
      y: 30,
      duration: 1.0,
      ease: 'power3.out'
    });

    gsap.from('.pillar', {
      scrollTrigger: {
        trigger: '.manifesto-pillars',
        start: 'top 85%',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Contact Form Panel Reveals
    gsap.from('.contact-info-panel', {
      scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%',
      },
      opacity: 0,
      x: -40,
      duration: 1.0,
      ease: 'power3.out'
    });

    gsap.from('.contact-form-panel', {
      scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%',
      },
      opacity: 0,
      x: 40,
      duration: 1.0,
      ease: 'power3.out'
    }, '-=0.8');
  }

  // --- 6. Active Nav Link Tracking on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');

  function trackActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // Offsetting header height
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', trackActiveNav);

  // --- 7. Contact Form Simulation & Redirection ---
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const whatsapp = document.getElementById('whatsapp').value;
      const message = document.getElementById('message').value;

      statusEl.className = 'form-status';
      statusEl.textContent = 'Procesando plano de contacto...';
      submitBtn.disabled = true;

      // Simulate network request
      setTimeout(() => {
        // Preformatted Message for WhatsApp
        const waText = `Hola Planos Studio, mi nombre es ${name}.\nQuiero cotizar un proyecto web.\n\n*Email:* ${email}\n*WhatsApp:* ${whatsapp || 'No especificado'}\n*Mensaje:* ${message}`;
        const waEncoded = encodeURIComponent(waText);
        const whatsappLink = `https://wa.me/5492612742818?text=${waEncoded}`; // Replace with actual number

        // Mailto Link
        const mailSubject = encodeURIComponent(`Cotización de Proyecto Web - ${name}`);
        const mailBody = encodeURIComponent(`Nombre/Empresa: ${name}\nEmail: ${email}\nWhatsApp: ${whatsapp || 'N/A'}\n\nMensaje:\n${message}`);
        const mailtoLink = `mailto:planoswebdesign@gmail.com?subject=${mailSubject}&body=${mailBody}`;

        // Reset and feedback
        statusEl.className = 'form-status success';
        statusEl.innerHTML = `✓ ¡Datos procesados! Puedes abrir el contacto directo en <a href="${whatsappLink}" target="_blank" style="color: var(--accent); text-decoration: underline; font-weight: 500;">WhatsApp</a> o por <a href="${mailtoLink}" style="color: var(--gold); text-decoration: underline; font-weight: 500;">Correo Electrónico</a> para cotizar.`;
        
        form.reset();
        submitBtn.disabled = false;
        
        // Auto trigger mailto after small delay to help user
        setTimeout(() => {
          window.location.href = mailtoLink;
        }, 800);

      }, 1200);
    });
  }

})();
