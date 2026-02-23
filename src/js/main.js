/**
 * Main JavaScript File - The Global Table by KG
 * Точка входа для всех скриптов
 */

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('The Global Table by KG - Application initialized');

  // Initialize all modules
  initHeaderScroll();
  initMobileMenu();
  initHeroSlider();
  initBookingQuiz();
  initGallery();
  initCurrentYear();
});

// ===== Header Scroll Effect =====
function initHeaderScroll() {
  const header = document.getElementById('header');
  
  if (!header) return;
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initial state
}

// ===== Mobile Menu Toggle =====
function initMobileMenu() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (!navToggle || !navMenu) return;
  
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('nav__menu--active');
    
    // Animate toggle icon
    const icon = navToggle.querySelector('.nav__toggle-icon');
    if (navMenu.classList.contains('nav__menu--active')) {
      icon.style.backgroundColor = 'transparent';
      icon.style.transform = 'rotate(45deg)';
      icon.style.top = '0';
    } else {
      icon.style.backgroundColor = '';
      icon.style.transform = '';
      icon.style.top = '';
    }
  });
  
  // Close menu on link click
  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('nav__menu--active');
      const icon = navToggle.querySelector('.nav__toggle-icon');
      icon.style.backgroundColor = '';
      icon.style.transform = '';
      icon.style.top = '';
    });
  });
}

// ===== Hero Slider =====
function initHeroSlider() {
  const heroSwiper = new Swiper('.hero__swiper', {
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.hero__pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
  });
}

// ===== Booking Quiz =====
function initBookingQuiz() {
  const quizForm = document.getElementById('booking-quiz-form');
  const quizSteps = document.querySelectorAll('.quiz-step');
  const prevBtn = document.getElementById('quiz-prev');
  const nextBtn = document.getElementById('quiz-next');
  const submitBtn = document.getElementById('quiz-submit');
  const quizSuccess = document.getElementById('quiz-success');
  const bookingBg = document.getElementById('booking-bg');
  
  if (!quizForm || !quizSteps.length) return;
  
  let currentStep = 0;
  const totalSteps = quizSteps.length;
  
  function updateStep() {
    // Show/hide steps
    quizSteps.forEach((step, index) => {
      if (index === currentStep) {
        step.classList.add('quiz-step--active');
        // Update background image
        const bgImage = step.dataset.bg;
        if (bgImage && bookingBg) {
          bookingBg.style.backgroundImage = `url('${bgImage}')`;
        }
      } else {
        step.classList.remove('quiz-step--active');
      }
    });
    
    // Update buttons
    prevBtn.disabled = currentStep === 0;
    
    if (currentStep === totalSteps - 1) {
      nextBtn.classList.add('hidden');
      submitBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      submitBtn.classList.add('hidden');
    }
  }
  
  // Validate current step
  function validateStep() {
    const currentStepEl = quizSteps[currentStep];
    const inputs = currentStepEl.querySelectorAll('input[required]');
    
    for (let input of inputs) {
      if (input.type === 'radio') {
        const radioGroup = currentStepEl.querySelectorAll(`input[name="${input.name}"]`);
        const isChecked = Array.from(radioGroup).some(r => r.checked);
        if (!isChecked) {
          return false;
        }
      } else if (!input.value.trim()) {
        return false;
      }
    }
    
    return true;
  }
  
  // Next button click
  nextBtn.addEventListener('click', () => {
    if (validateStep() && currentStep < totalSteps - 1) {
      currentStep++;
      updateStep();
    } else {
      // Visual feedback for validation error
      const currentStepEl = quizSteps[currentStep];
      currentStepEl.style.animation = 'shake 0.4s ease';
      setTimeout(() => {
        currentStepEl.style.animation = '';
      }, 400);
    }
  });
  
  // Previous button click
  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      updateStep();
    }
  });
  
  // Form submission
  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateStep()) {
      // Collect form data
      const formData = new FormData(quizForm);
      const data = Object.fromEntries(formData.entries());
      
      console.log('Booking data:', data);
      
      // Show success message
      quizForm.reset();
      quizSuccess.classList.remove('form__success--hidden');
      
      // Reset to first step after delay
      setTimeout(() => {
        currentStep = 0;
        updateStep();
        quizSuccess.classList.add('form__success--hidden');
      }, 3000);
    }
  });
  
  // Initialize
  updateStep();
}

// ===== Gallery Slider =====
function initGallery() {
  const gallerySwiper = new Swiper('.gallery-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });
  
  // Populate gallery with placeholder images
  const galleryWrapper = document.querySelector('.gallery-swiper .swiper-wrapper');
  
  if (galleryWrapper) {
    const galleryImages = [
      './assets/images/gallery/gallery-1.jpg',
      './assets/images/gallery/gallery-2.jpg',
      './assets/images/gallery/gallery-3.jpg',
      './assets/images/gallery/gallery-4.jpg',
      './assets/images/gallery/gallery-5.jpg',
      './assets/images/gallery/gallery-6.jpg',
    ];
    
    galleryImages.forEach(src => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `<img src="${src}" alt="Gallery image" loading="lazy">`;
      galleryWrapper.appendChild(slide);
    });
  }
}

// ===== Current Year in Footer =====
function initCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
