import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './style.css';

gsap.registerPlugin(ScrollToPlugin);

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
// MOBILE HAMBURGER MENU
// ============================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Create mobile menu
const mobileMenu = document.createElement('div');
mobileMenu.className = 'mobile-menu';
mobileMenu.innerHTML = navLinks.innerHTML;
document.body.appendChild(mobileMenu);

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks_ = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks_.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

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
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: targetPosition, autoKill: true },
        ease: 'power3.inOut',
      });
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
// INIT LOG
// ============================================
console.log('%c Nomads Cipher ', 'background: linear-gradient(135deg, #6c5ce7, #00cec9); color: white; font-size: 1.5rem; font-weight: bold; padding: 0.5rem 1rem; border-radius: 4px;');
console.log('%c Engineered with precision. Built for impact. ', 'color: #a29bfe; font-size: 0.9rem;');
