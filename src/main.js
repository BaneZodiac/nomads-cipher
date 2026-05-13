import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// LOADER
// ============================================
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 2200);
});

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
    cursorFollower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
  });

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .service-card, .work-card, .tech-item, .filter-btn, .testimonial-btn, .social-link, input, textarea'
  );
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
  });
}

// ============================================
// THREE.JS — 3D PARTICLE BACKGROUND
// ============================================
const canvas = document.getElementById('heroCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

const color1 = new THREE.Color('#6c5ce7');
const color2 = new THREE.Color('#a29bfe');
const color3 = new THREE.Color('#00cec9');

for (let i = 0; i < particlesCount * 3; i += 3) {
  // Distribute in a sphere
  const radius = 8 + Math.random() * 4;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
  posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
  posArray[i + 2] = radius * Math.cos(phi);

  // Random colors
  const choice = Math.random();
  let col;
  if (choice < 0.4) col = color1;
  else if (choice < 0.7) col = color2;
  else col = color3;

  colorsArray[i] = col.r;
  colorsArray[i + 1] = col.g;
  colorsArray[i + 2] = col.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.04,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Connection lines
const lineGeometry = new THREE.BufferGeometry();
const linePositions = [];
const lineColors = [];

for (let i = 0; i < Math.min(400, posArray.length / 3); i += 2) {
  const idx1 = i * 3;
  const idx2 = (i + 1) * 3;
  if (idx2 >= posArray.length) break;

  linePositions.push(posArray[idx1], posArray[idx1 + 1], posArray[idx1 + 2]);
  linePositions.push(posArray[idx2], posArray[idx2 + 1], posArray[idx2 + 2]);

  const c1 = new THREE.Color(colorsArray[idx1], colorsArray[idx1 + 1], colorsArray[idx1 + 2]);
  const c2 = new THREE.Color(colorsArray[idx2], colorsArray[idx2 + 1], colorsArray[idx2 + 2]);
  lineColors.push(c1.r, c1.g, c1.b, c2.r, c2.g, c2.b);
}

lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

const lineMaterial = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.15,
});

const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lines);

camera.position.z = 10;

// Mouse interaction for particles
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation
function animateParticles() {
  requestAnimationFrame(animateParticles);

  particlesMesh.rotation.y += 0.0005;
  particlesMesh.rotation.x += 0.0003;
  lines.rotation.y += 0.0005;
  lines.rotation.x += 0.0003;

  // Follow mouse
  particlesMesh.rotation.y += mouseX * 0.0003;
  particlesMesh.rotation.x += mouseY * 0.0003;
  lines.rotation.y += mouseX * 0.0003;
  lines.rotation.x += mouseY * 0.0003;

  renderer.render(scene, camera);
}

animateParticles();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ============================================
// MOBILE HAMBURGER MENU — GSAP Enhanced
// ============================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Create mobile menu with GSAP animations
const mobileMenu = document.createElement('div');
mobileMenu.className = 'mobile-menu';
document.body.appendChild(mobileMenu);

// Build mobile nav links with staggered delay support
const mobileLinkTexts = [
  { text: 'Home', href: '#hero' },
  { text: 'About', href: '#about' },
  { text: 'Services', href: '#services' },
  { text: 'Work', href: '#work' },
  { text: 'Clients', href: '#testimonials' },
  { text: 'Contact', href: '#contact' },
];

mobileLinkTexts.forEach((item) => {
  const a = document.createElement('a');
  a.href = item.href;
  a.className = 'nav-link mobile-nav-link';
  a.textContent = item.text;
  mobileMenu.appendChild(a);
});

let mobileTimeline = null;

hamburger.addEventListener('click', () => {
  const isOpening = !hamburger.classList.contains('active');
  
  hamburger.classList.toggle('active');
  
  if (isOpening) {
    // Open menu with GSAP
    if (mobileTimeline) mobileTimeline.kill();
    mobileTimeline = gsap.timeline();
    
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    // Reset state
    gsap.set(mobileLinks, { opacity: 0, y: 20 });
    
    mobileTimeline
      .to(mobileMenu, { opacity: 1, visibility: 'visible', duration: 0.3, ease: 'power2.out' })
      .to(mobileLinks, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.7)',
      }, '-=0.1');
  } else {
    // Close menu with GSAP
    if (mobileTimeline) mobileTimeline.kill();
    mobileTimeline = gsap.timeline({
      onComplete: () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
    
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    
    mobileTimeline
      .to(mobileLinks, {
        opacity: 0,
        y: 20,
        duration: 0.25,
        stagger: 0.03,
        ease: 'power2.in',
      })
      .to(mobileMenu, { opacity: 0, visibility: 'hidden', duration: 0.2 }, '-=0.1');
  }
});

mobileMenu.addEventListener('click', (e) => {
  if (e.target.classList.contains('mobile-nav-link')) {
    hamburger.classList.remove('active');
    if (mobileTimeline) mobileTimeline.kill();
    gsap.set(mobileMenu, { opacity: 0, visibility: 'hidden' });
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ============================================
// ACTIVE NAV LINK — IntersectionObserver
// ============================================
const navLinks_ = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

const observerOptions = {
  rootMargin: '-50% 0px -50% 0px', // triggers when section is in the middle of viewport
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks_.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach((section) => sectionObserver.observe(section));

// ============================================
// GSAP SCROLL ANIMATIONS
// ============================================
// Reveal animations
const revealElements = document.querySelectorAll('[data-reveal]');

revealElements.forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    onEnter: () => el.classList.add('revealed'),
    once: true,
  });
});

// Hero content animation
const heroTimeline = gsap.timeline({ delay: 2.4 });

heroTimeline
  .from('.hero-badge', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
  .from('.hero-title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.4')
  .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
  .from('.hero-actions', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
  .from('.hero-stats', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
  .from('.scroll-indicator', { opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2');

// Counter animation
function animateCounters() {
  const counters = document.querySelectorAll('.hero-stat-number, .stat-number');

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-count') || counter.getAttribute('data-target'));
    const isPercent = counter.closest('.hero-stat')?.querySelector('.hero-stat-plus')?.textContent === '%';
    const duration = 2;
    const start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (isPercent) {
        counter.textContent = current;
      } else {
        counter.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    }

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => requestAnimationFrame(updateCounter),
    });
  });
}

animateCounters();

// ============================================
// SERVICE CARDS — PARALLAX GLOW
// ============================================
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

// ============================================
// PORTFOLIO FILTER
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    workCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        gsap.to(card, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
          clearProps: 'position',
        });
        card.style.display = 'block';
      } else {
        gsap.to(card, {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            card.style.display = 'none';
          },
        });
      }
    });
  });
});

// ============================================
// TESTIMONIALS CAROUSEL
// ============================================
const track = document.getElementById('testimonialsTrack');
const cards = track.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.testimonial-btn.prev');
const nextBtn = document.querySelector('.testimonial-btn.next');
const dotsContainer = document.querySelector('.testimonial-dots');

let currentIndex = 0;
const totalSlides = cards.length;

// Create dots
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('button');
  dot.className = `testimonial-dot ${i === 0 ? 'active' : ''}`;
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
}

const dots = dotsContainer.querySelectorAll('.testimonial-dot');

function goToSlide(index) {
  currentIndex = index;  const cardWidth = cards[0].offsetWidth;
  const gap = 24; // 1.5rem in pixels
  const offset = -index * (cardWidth + gap);
track.style.transform = `translateX(${offset}px)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

prevBtn.addEventListener('click', () => {
  currentIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
  goToSlide(currentIndex);
});

nextBtn.addEventListener('click', () => {
  currentIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
  goToSlide(currentIndex);
});

// Auto-play
let autoplayInterval = setInterval(() => {
  currentIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
  goToSlide(currentIndex);
}, 5000);

const carousel = document.querySelector('.testimonials-carousel');
carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
carousel.addEventListener('mouseleave', () => {
  autoplayInterval = setInterval(() => {
    currentIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
    goToSlide(currentIndex);
  }, 5000);
});

// ============================================
// KEYBOARD NAVIGATION — Testimonials
// ============================================
document.addEventListener('keydown', (e) => {
  // Only when testimonials are in view
  const testimonialsSection = document.getElementById('testimonials');
  if (!testimonialsSection) return;
  const rect = testimonialsSection.getBoundingClientRect();
  const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
  if (!isVisible) return;

  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    clearInterval(autoplayInterval);
    currentIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    goToSlide(currentIndex);
    // Restart autoplay
    autoplayInterval = setInterval(() => {
      currentIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
      goToSlide(currentIndex);
    }, 5000);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    clearInterval(autoplayInterval);
    currentIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
    goToSlide(currentIndex);
    autoplayInterval = setInterval(() => {
      currentIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
      goToSlide(currentIndex);
    }, 5000);
  }
});

// ============================================
// CONTACT FORM
// ============================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = 'Sending...';
  submitBtn.disabled = true;

  // Simulate send
  setTimeout(() => {
    submitBtn.innerHTML = '✓ Message Sent!';
    submitBtn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
      contactForm.reset();
    }, 3000);
  }, 1500);
});

// ============================================
// SMOOTH ANCHOR SCROLLING
// ============================================
// Smooth scroll with custom easing using native browser APIs
function smoothScrollTo(targetElement, offset = 80) {
  const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 1000;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    // Cubic ease in-out
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return; // skip empty/top links
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      // Update URL hash without jumping
      history.pushState(null, '', href);
      smoothScrollTo(target, 80);
    }
  });
});

// ============================================
// PARALLAX ON SCROLL
// ============================================
gsap.to('.hero-content', {
  y: 100,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
});

gsap.to('#heroCanvas', {
  scale: 1.1,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
});

// ============================================
// MODAL SYSTEM — Footer Links
// ============================================
const modalOverlay = document.getElementById('modalOverlay');
const modalContainer = document.getElementById('modalContainer');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

const modalData = {
  careers: {
    title: 'Join Our Team',
    body: `
      <p>At Nomads Cipher, we're always looking for talented individuals who share our passion for technology and innovation.</p>
      <h3>Open Positions</h3>
      <ul>
        <li><strong>Senior Software Engineer</strong> — Build scalable cloud-native applications</li>
        <li><strong>AI/ML Engineer</strong> — Develop cutting-edge machine learning models</li>
        <li><strong>UX Designer</strong> — Craft beautiful, intuitive user experiences</li>
        <li><strong>DevOps Engineer</strong> — Architect and manage cloud infrastructure</li>
        <li><strong>Cybersecurity Analyst</strong> — Protect enterprise systems and data</li>
      </ul>
      <p style="margin-top:1rem;">Email your resume to <strong>careers@nomadscipher.io</strong> with the subject line of the role you're applying for.</p>
      <div style="margin-top:1.5rem;padding:1rem;background:rgba(108,99,255,0.08);border-radius:12px;border:1px solid rgba(108,99,255,0.15);">
        <p style="margin:0;font-size:0.9rem;color:var(--color-text-secondary);">✨ Remote-first culture · Competitive compensation · Growth opportunities</p>
      </div>
    `,
  },
  blog: {
    title: 'Latest Insights',
    body: `
      <p>Explore our collection of articles, tutorials, and insights on technology, engineering, and digital innovation.</p>
      <h3>Recent Posts</h3>
      <ul>
        <li><strong>Building Resilient Microservices</strong> — A guide to fault-tolerant distributed systems</li>
        <li><strong>The Future of AI in Enterprise</strong> — How machine learning is reshaping business</li>
        <li><strong>Cloud Migration Best Practices</strong> — Lessons from 50+ successful migrations</li>
        <li><strong>Zero Trust Security Model</strong> — Implementing modern security architecture</li>
        <li><strong>Designing for Scale</strong> — Frontend patterns for high-traffic applications</li>
      </ul>
      <p style="margin-top:1rem;">Subscribe to our newsletter for the latest updates delivered to your inbox.</p>
    `,
  },
  'press-kit': {
    title: 'Press Kit',
    body: `
      <p>Welcome to the Nomads Cipher press kit. Here you'll find resources for featuring our company in your publication.</p>
      <h3>Company Overview</h3>
      <p>Nomads Cipher is a leading IT solutions provider specializing in software engineering, cloud infrastructure, AI/ML, cybersecurity, and digital consulting.</p>
      <h3>Key Facts</h3>
      <ul>
        <li>Founded: 2020</li>
        <li>Team Size: 50+ experts</li>
        <li>Projects Delivered: 150+</li>
        <li>Global Reach: 15+ countries</li>
      </ul>
      <h3>Brand Assets</h3>
      <p>Our brand colors: <span class="modal-tag">#6c5ce7 (Primary)</span> <span class="modal-tag">#00cec9 (Secondary)</span> <span class="modal-tag">#a29bfe (Accent)</span></p>
      <p>For press inquiries, contact <strong>press@nomadscipher.io</strong></p>
    `,
  },
  'help-center': {
    title: 'Help Center',
    body: `
      <p>Need assistance? We're here to help. Browse our frequently asked questions or reach out to our support team.</p>
      <h3>Frequently Asked Questions</h3>
      <ul>
        <li><strong>How do I start a project?</strong> — Reach out via our contact form or email us at hello@nomadscipher.io</li>
        <li><strong>What technologies do you use?</strong> — We work with React, Node.js, Python, Go, AWS, Kubernetes, and more</li>
        <li><strong>What is your typical project timeline?</strong> — Most projects range from 4-12 weeks depending on scope</li>
        <li><strong>Do you offer ongoing support?</strong> — Yes, we provide maintenance and support packages for all projects</li>
        <li><strong>Can you work with our existing team?</strong> — Absolutely, we integrate seamlessly with your engineering team</li>
      </ul>
      <p style="margin-top:1rem;">Still have questions? Reach out at <strong>support@nomadscipher.io</strong></p>
    `,
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    body: `
      <p><strong>Last Updated:</strong> January 2025</p>
      <p>Nomads Cipher respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information.</p>
      <h3>Information We Collect</h3>
      <p>We collect information you provide directly: name, email address, company name, and project details when you contact us through our website.</p>
      <h3>How We Use Your Information</h3>
      <ul>
        <li>To respond to your inquiries and project requests</li>
        <li>To improve our services and website experience</li>
        <li>To send relevant updates about our services (with your consent)</li>
        <li>To comply with legal obligations</li>
      </ul>
      <h3>Data Protection</h3>
      <p>We implement appropriate security measures to protect your personal information. We do not sell or share your data with third parties for marketing purposes.</p>
      <p>Contact us at <strong>privacy@nomadscipher.io</strong> for any privacy-related questions.</p>
    `,
  },
  'terms-of-service': {
    title: 'Terms of Service',
    body: `
      <p><strong>Last Updated:</strong> January 2025</p>
      <p>By accessing or using the Nomads Cipher website and services, you agree to be bound by these terms.</p>
      <h3>Services</h3>
      <p>Nomads Cipher provides IT consulting, software development, cloud services, and related technology solutions. All services are delivered in accordance with the agreed scope of work.</p>
      <h3>Intellectual Property</h3>
      <p>Upon full payment, clients retain ownership of all custom code and deliverables created specifically for their projects. Nomads Cipher retains the right to use generalized methodologies and tools.</p>
      <h3>Limitation of Liability</h3>
      <p>Nomads Cipher's liability is limited to the value of the services provided. We are not liable for indirect damages or loss of business opportunities.</p>
      <h3>Contact</h3>
      <p>For questions about these terms, contact <strong>legal@nomadscipher.io</strong></p>
    `,
  },
};

function openModal(key) {
  const data = modalData[key];
  if (!data) return;
  
  modalContent.innerHTML = `
    <h2>${data.title}</h2>
    ${data.body}
  `;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

// Hook up footer links
const footerLinkMap = {
  'Software Engineering': '#services',
  'Cloud & DevOps': '#services',
  'AI & Machine Learning': '#services',
  'Cybersecurity': '#services',
  'UI/UX Design': '#services',
  'About Us': '#about',
  'Careers': 'modal:careers',
  'Blog': 'modal:blog',
  'Press Kit': 'modal:press-kit',
  'Help Center': 'modal:help-center',
  'Privacy Policy': 'modal:privacy-policy',
  'Terms of Service': 'modal:terms-of-service',
  'Sitemap': '#',
  'Cookie Policy': 'modal:privacy-policy',
};

document.querySelectorAll('.footer-col a, .footer-bottom-links a').forEach((link) => {
  const text = link.textContent.trim();
  const target = footerLinkMap[text];
  
  if (target) {
    if (target.startsWith('modal:')) {
      const modalKey = target.replace('modal:', '');
      link.removeAttribute('href');
      link.style.cursor = 'pointer';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(modalKey);
      });
    } else if (target === '#') {
      // Keep as is
    } else {
      link.setAttribute('href', target);
    }
  }
});

// ============================================
// INIT LOG
// ============================================
console.log('%c Nomads Cipher ', 'background: linear-gradient(135deg, #6c5ce7, #00cec9); color: white; font-size: 1.5rem; font-weight: bold; padding: 0.5rem 1rem; border-radius: 4px;');
console.log('%c Engineered with precision. Built for impact. ', 'color: #a29bfe; font-size: 0.9rem;');
