// main.js - Interactive navigation and smooth scroll

document.addEventListener('DOMContentLoaded', function() {
  // Mobile navbar toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      // Optional: toggle aria-expanded
      const expanded = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', expanded);
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return; // ignore empty hash
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
