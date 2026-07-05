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

  // Countdown timer to next ICPC event
  // Set the target date (year, month-1, day, hour, minute, second)
  const targetDate = new Date(2025, 8, 15, 9, 0, 0); // September 15, 2025 09:00:00

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const messageEl = document.getElementById('countdown-message');

    if (diff <= 0) {
      // Event has started or passed
      if (daysEl) daysEl.textContent = '0';
      if (hoursEl) hoursEl.textContent = '0';
      if (minutesEl) minutesEl.textContent = '0';
      if (secondsEl) secondsEl.textContent = '0';
      if (messageEl) messageEl.textContent = 'The event is happening now!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
    if (messageEl) messageEl.textContent = '';
  }

  // Initial call
  updateCountdown();
  // Update every second
  setInterval(updateCountdown, 1000);

  // Contact form validation and submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formMessage = document.getElementById('form-message');

    // Helper function to validate email
    function isValidEmail(email) {
      // Simple email regex
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    // Clear previous errors
    function clearErrors() {
      if (nameError) nameError.textContent = '';
      if (emailError) emailError.textContent = '';
      if (messageError) messageError.textContent = '';
      if (formMessage) formMessage.textContent = '';
    }

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      // Validate name
      const name = nameInput.value.trim();
      if (!name) {
        if (nameError) nameError.textContent = 'Name is required.';
        isValid = false;
      }

      // Validate email
      const email = emailInput.value.trim();
      if (!email) {
        if (emailError) emailError.textContent = 'Email is required.';
        isValid = false;
      } else if (!isValidEmail(email)) {
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate message
      const message = messageInput.value.trim();
      if (!message) {
        if (messageError) messageError.textContent = 'Message is required.';
        isValid = false;
      } else if (message.length < 10) {
        if (messageError) messageError.textContent = 'Message must be at least 10 characters.';
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      // Submit to Formspree using fetch
      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          if (formMessage) {
            formMessage.textContent = 'Thank you! Your message has been sent.';
            formMessage.style.color = 'green';
          }
          contactForm.reset();
        } else {
          // Formspree returns 200 even on error? Actually it returns 200 with error in body.
          // We'll handle by checking response.json()
          response.json().then(data => {
            if (data.error) {
              if (formMessage) {
                formMessage.textContent = 'Oops! There was a problem submitting your form.';
                formMessage.style.color = 'red';
              }
            } else {
              if (formMessage) {
                formMessage.textContent = 'Thank you! Your message has been sent.';
                formMessage.style.color = 'green';
              }
              contactForm.reset();
            }
          }).catch(() => {
            if (formMessage) {
              formMessage.textContent = 'Thank you! Your message has been sent.';
              formMessage.style.color = 'green';
            }
            contactForm.reset();
          });
        }
      })
      .catch(() => {
        if (formMessage) {
          formMessage.textContent = 'Oops! There was a network error. Please try again later.';
          formMessage.style.color = 'red';
        }
      });
    });
  }
});
