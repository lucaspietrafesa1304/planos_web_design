(function () {
  'use strict';

  // --- Coordinates & Custom Cursor Elements ---
  const cursor = document.getElementById('custom-cursor');
  const glow = document.getElementById('cursor-glow');
  const coords = document.getElementById('cursor-coords');
  const compass = document.getElementById('blueprint-compass-svg');

  // --- Background Glow Balls (GPU Accelerated Mesh) ---
  const glowBall1 = document.getElementById('glow-ball-1');
  const glowBall2 = document.getElementById('glow-ball-2');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  
  // Custom cursor smooth follow (Lerp variables)
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;

  // Background glow smooth follow (Lerp variables)
  let ball1X = window.innerWidth / 2;
  let ball1Y = window.innerHeight / 2;
  let ball2X = window.innerWidth / 2;
  let ball2Y = window.innerHeight / 2;

  // --- 1. Mouse Move Tracking ---
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // A. Update Coordinates Text
    if (coords) {
      const normX = (e.clientX / window.innerWidth).toFixed(2);
      const normY = (e.clientY / window.innerHeight).toFixed(2);
      coords.textContent = `[${normX}, ${normY}]`;
    }

    // B. Rotate technical compass relative to mouse
    if (compass) {
      const rect = compass.getBoundingClientRect();
      const compassCenterX = rect.left + rect.width / 2;
      const compassCenterY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - compassCenterY, e.clientX - compassCenterX) * (180 / Math.PI);
      compass.style.transform = `rotate(${angle + 90}deg)`;
    }
  });

  // --- 2. GPU Accelerated Animation Loop (RequestAnimationFrame) ---
  function updateAnimationFrame() {
    // A. Custom Cursor (instant translate3d)
    if (cursor) {
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }

    // B. Cursor Outer Glow (smooth delay lerp 0.15)
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    if (glow) {
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
    }

    // C. Background Glow Ball 1 (Amber, medium delay lerp 0.08)
    ball1X += (mouseX - ball1X) * 0.08;
    ball1Y += (mouseY - ball1Y) * 0.08;
    if (glowBall1) {
      glowBall1.style.transform = `translate3d(${ball1X}px, ${ball1Y}px, 0) translate(-50%, -50%)`;
    }

    // D. Background Glow Ball 2 (Gold, slow delay lerp 0.04)
    ball2X += (mouseX - ball2X) * 0.04;
    ball2Y += (mouseY - ball2Y) * 0.04;
    if (glowBall2) {
      glowBall2.style.transform = `translate3d(${ball2X}px, ${ball2Y}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(updateAnimationFrame);
  }
  requestAnimationFrame(updateAnimationFrame);

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

  // --- 4. Progressive Web Scroll Reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal-el');
  
  // Set initial hidden styles dynamically (progressive enhancement)
  revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translate3d(0, 35px, 0)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    // Stagger slightly if elements are adjacent cards in a grid
    let delay = 0;
    if (el.classList.contains('service-card') || el.classList.contains('process-step') || el.classList.contains('why-us-item') || el.classList.contains('project-item') || el.classList.contains('pillar')) {
      delay = (index % 4) * 0.1;
    }
    el.style.transitionDelay = `${delay}s`;
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translate3d(0, 0, 0)';
          // Stop observing once animated to avoid recalculating
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null, // relative to viewport
      threshold: 0.05, // trigger early (when 5% of element is visible)
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach((el) => {
      observer.observe(el);
    });
  } else {
    // Fallback for extremely old browsers
    revealElements.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'translate3d(0, 0, 0)';
    });
  }

  // --- 5. Active Nav Link Tracking on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');

  function trackActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
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

  // --- 6. Contact Form Simulation & Redirection ---
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
        const whatsappLink = `https://wa.me/5492612742818?text=${waEncoded}`;

        // Mailto Link
        const mailSubject = encodeURIComponent(`Cotización de Proyecto Web - ${name}`);
        const mailBody = encodeURIComponent(`Nombre/Empresa: ${name}\nEmail: ${email}\nWhatsApp: ${whatsapp || 'N/A'}\n\nMensaje:\n${message}`);
        const mailtoLink = `mailto:planoswebdesign@gmail.com?subject=${mailSubject}&body=${mailBody}`;

        // Reset and feedback
        statusEl.className = 'form-status success';
        statusEl.innerHTML = `✓ ¡Datos procesados! Puedes abrir el contacto directo en <a href="${whatsappLink}" target="_blank" style="color: var(--accent); text-decoration: underline; font-weight: 500;">WhatsApp</a> o por <a href="${mailtoLink}" style="color: var(--accent); text-decoration: underline; font-weight: 500;">Correo Electrónico</a> para cotizar.`;
        
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
