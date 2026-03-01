/**
 * Main JavaScript File - The Global Table by KG
 * Точка входа для всех скриптов
 */

// ===== Import Modules =====
import { initFormValidation, validateContactFields, validateName, validatePhone, validateEmail, sanitizePhone, sanitizeName, sanitizeTextarea, validateTextarea } from './validation.js';
import { getHeroSlides, getDinnerByDate } from './api.js';

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('The Global Table by KG - Application initialized');

  // Initialize all modules
  initHeaderScroll();
  initMobileMenu();
  initHeroSlider();
  loadHeroSlides();
  initFormValidation();
  initBookingQuiz();
  initDinnerTabs();
  initGallery();
  initCurrentYear();
  initDatePicker();
});

// ===== Date Picker (Flatpickr) =====
function initDatePicker() {
  const dateInput = document.getElementById('quiz-date');
  if (!dateInput || !window.flatpickr) return;

  flatpickr(dateInput, {
    locale: 'en',
    minDate: 'today',
    dateFormat: 'Y-m-d',
    disable: [
      function(date) {
        // Disable weekdays (allow only Saturday=6 and Sunday=0)
        return date.getDay() !== 0 && date.getDay() !== 6;
      }
    ],
    onChange: function(selectedDates, dateStr, instance) {
      // Trigger change event for handleDateChange
      dateInput.dispatchEvent(new Event('change'));
    }
  });
}

// ===== Load Hero Slides from API =====
async function loadHeroSlides() {
  const slidesWrapper = document.getElementById('hero-slides-wrapper');
  if (!slidesWrapper) return;

  try {
    const slides = await getHeroSlides();
    
    // Clear existing slides
    slidesWrapper.innerHTML = '';
    
    // Create slides from API data
    slides.forEach((slide, index) => {
      const slideEl = document.createElement('div');
      slideEl.className = 'swiper-slide hero__slide';
      slideEl.setAttribute('data-image', slide.image);
      slideEl.style.backgroundImage = `url('${slide.image}')`;
      
      slideEl.innerHTML = `
        <div class="hero__overlay"></div>
        <div class="hero__content container">
          <h1 class="hero__title">${slide.title}</h1>
          <p class="hero__subtitle">${slide.subtitle}</p>
          <a href="#booking-quiz" class="btn btn--primary btn--large">Book a Table</a>
        </div>
      `;
      
      slidesWrapper.appendChild(slideEl);
    });
    
    // Re-initialize Swiper after loading slides
    if (window.heroSwiperInstance) {
      window.heroSwiperInstance.update();
    }
  } catch (error) {
    console.error('Failed to load hero slides:', error);
  }
}

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
  
  // Save instance for later updates
  window.heroSwiperInstance = heroSwiper;
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
  const allergiesYes = document.getElementById('allergies-yes');
  const allergiesNo = document.getElementById('allergies-no');
  const allergyDetailsGroup = document.getElementById('allergy-details-group');
  const quizDateInput = document.getElementById('quiz-date');
  const dinnerInfo = document.getElementById('dinner-info');
  const dinnerTitle = document.getElementById('dinner-title');
  const dinnerDateDisplay = document.getElementById('dinner-date-display');
  const dinnerMenuList = document.getElementById('dinner-menu-list');
  const dinnerIdInput = document.getElementById('dinner-id');

  if (!quizForm || !quizSteps.length) return;

  let currentStep = 0;
  const totalSteps = quizSteps.length;
  let selectedDinner = null;

  // Static dinner data (will be replaced by backend API)
  const dinnersData = [
    {
      id: 1,
      country: 'italy',
      flag: '🇮🇹',
      title: 'Italian Night',
      menu: ['Bruschetta with tomatoes and basil', 'Pasta Carbonara', 'Tiramisu']
    },
    {
      id: 2,
      country: 'india',
      flag: '🇮🇳',
      title: 'Indian Spice Journey',
      menu: ['Samosa with mint chutney', 'Butter Chicken with naan', 'Gulab Jamun']
    },
    {
      id: 3,
      country: 'thailand',
      flag: '🇹🇭',
      title: 'Thai Flavors',
      menu: ['Tom Yum soup', 'Pad Thai with shrimp', 'Mango with sticky rice']
    },
    {
      id: 4,
      country: 'georgia',
      flag: '🇬🇪',
      title: 'Georgian Feast',
      menu: ['Khachapuri Adjaruli', 'Khinkali with meat', 'Badrijani with walnut paste']
    }
  ];

  // Sanitize input - allow only safe characters
  function sanitizeInput(value) {
    if (!value) return '';
    return value.replace(/[<>\"'&]/g, '').trim();
  }

  // Check if date is weekend (Saturday=6, Sunday=0)
  function isWeekend(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  // Get dinner by date from API
  async function fetchDinnerByDate(dateString) {
    return await getDinnerByDate(dateString);
  }

  // Format date for display
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  // Render dinner info
  function renderDinnerInfo(dinner) {
    if (!dinner || !quizDateInput.value) return;

    dinnerTitle.textContent = dinner.title;
    dinnerDateDisplay.textContent = formatDate(quizDateInput.value);
    dinnerMenuList.innerHTML = dinner.menu
      .map(item => `<li>${item}</li>`)
      .join('');
    dinnerIdInput.value = dinner.id;

    dinnerInfo.classList.remove('hidden');

    // Update preview panel
    updateDinnerPreview(dinner);
  }

  // Update dinner preview panel
  function updateDinnerPreview(dinner) {
    const previewPanel = document.getElementById('booking-preview');
    const previewMenu = document.getElementById('dinner-preview-menu');
    const placeholder = document.getElementById('booking-placeholder');
    if (!previewPanel || !previewMenu) return;

    // Show preview panel and hide placeholder
    previewPanel.classList.add('active');
    if (placeholder) {
      placeholder.style.display = 'none';
    }

    const menuItems = [
      { name: dinner.menu[0], type: 'Starter', image: `./assets/images/dishes/${dinner.country}-1.jpg` },
      { name: dinner.menu[1], type: 'Main Course', image: `./assets/images/dishes/${dinner.country}-2.jpg` },
      { name: dinner.menu[2], type: 'Dessert', image: `./assets/images/dishes/${dinner.country}-3.jpg` }
    ];

    previewMenu.innerHTML = menuItems.map(item => `
      <div class="dinner-preview__item">
        <div class="dinner-preview__item-image">
          <img src="${item.image}" alt="${item.type}" loading="lazy" onerror="this.style.display='none'">
        </div>
        <div class="dinner-preview__item-info">
          <h4>${item.name}</h4>
          <p>${item.type}</p>
        </div>
      </div>
    `).join('');
  }

  // Date input change handler
  async function handleDateChange() {
    const dateValue = quizDateInput.value;

    if (!dateValue) {
      dinnerInfo.classList.add('hidden');
      selectedDinner = null;
      resetDinnerPreview();
      return;
    }

    // Validate weekend
    if (!isWeekend(dateValue)) {
      dinnerInfo.classList.add('hidden');
      selectedDinner = null;
      resetDinnerPreview();
      // Show error animation on input
      quizDateInput.style.animation = 'shake 0.4s ease';
      setTimeout(() => {
        quizDateInput.style.animation = '';
      }, 400);
      return;
    }

    // Load dinner data from API
    selectedDinner = await fetchDinnerByDate(dateValue);
    if (selectedDinner) {
      renderDinnerInfo(selectedDinner);
    }
  }

  // Reset dinner preview to placeholder
  function resetDinnerPreview() {
    const previewPanel = document.getElementById('booking-preview');
    const placeholder = document.getElementById('booking-placeholder');
    const previewMenu = document.getElementById('dinner-preview-menu');
    
    if (previewPanel) {
      previewPanel.classList.remove('active');
    }
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
    if (previewMenu) {
      previewMenu.innerHTML = '';
    }
  }

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

    // Step 1: Validate date is weekend and dinner is selected
    if (currentStep === 0) {
      if (!quizDateInput.value) {
        return false;
      }
      if (!isWeekend(quizDateInput.value)) {
        return false;
      }
      if (!selectedDinner) {
        return false;
      }
    }

    // Step 2: Validate contact fields using validation module
    if (currentStep === 1) {
      return validateContactFields();
    }

    // Step 3: Validate allergies details if yes is selected
    if (currentStep === 2) {
      const allergiesYes = document.getElementById('allergies-yes');
      const allergyDetails = document.getElementById('allergy-details');
      
      if (allergiesYes && allergiesYes.checked) {
        if (!allergyDetails || !allergyDetails.value.trim()) {
          // Show error
          if (allergyDetails) {
            allergyDetails.classList.add('form__input--error');
          }
          return false;
        }
        allergyDetails.classList.remove('form__input--error');
      }
    }

    // Step 4: Validate consent checkbox
    if (currentStep === 3) {
      const consentCheckbox = quizForm.querySelector('input[name="consent"]');
      if (consentCheckbox && !consentCheckbox.checked) {
        return false;
      }
    }

    return true;
  }

  // Show error animation
  function showErrorAnimation(element) {
    const target = element || quizSteps[currentStep];
    target.style.animation = 'shake 0.4s ease';
    setTimeout(() => {
      target.style.animation = '';
    }, 400);
  }

  // Next button click
  nextBtn.addEventListener('click', () => {
    if (validateStep() && currentStep < totalSteps - 1) {
      currentStep++;
      updateStep();
    } else {
      showErrorAnimation();
    }
  });

  // Previous button click
  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      updateStep();
    }
  });

  // Handle allergies toggle
  if (allergiesYes && allergiesNo && allergyDetailsGroup) {
    const allergyDetails = document.getElementById('allergy-details');
    
    allergiesYes.addEventListener('change', () => {
      if (allergiesYes.checked) {
        allergyDetailsGroup.style.display = 'block';
        if (allergyDetails) {
          allergyDetails.setAttribute('required', 'required');
        }
      }
    });

    allergiesNo.addEventListener('change', () => {
      if (allergiesNo.checked) {
        allergyDetailsGroup.style.display = 'none';
        if (allergyDetails) {
          allergyDetails.value = '';
          allergyDetails.removeAttribute('required');
          allergyDetails.classList.remove('form__input--error');
        }
      }
    });

    // Clear error on input
    if (allergyDetails) {
      allergyDetails.addEventListener('input', () => {
        if (allergyDetails.value.trim()) {
          allergyDetails.classList.remove('form__input--error');
        }
      });
    }
  }

  // Handle date change (Flatpickr triggers change event)
  if (quizDateInput) {
    quizDateInput.addEventListener('change', handleDateChange);
  }

  // Form submission
  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate contact fields before submit
    validateContactFields();

    if (validateStep()) {
      // Collect and sanitize form data
      const formData = new FormData(quizForm);
      const data = {};

      for (let [key, value] of formData.entries()) {
        // Use specific sanitizers for specific fields
        if (key === 'phone') {
          data[key] = sanitizePhone(value);
        } else if (key === 'name') {
          data[key] = sanitizeName(value);
        } else if (key === 'about' || key === 'allergy_details') {
          // Sanitize textarea fields with extra security
          if (!validateTextarea(value)) {
            showErrorAnimation();
            return;
          }
          data[key] = sanitizeTextarea(value);
        } else {
          data[key] = sanitizeInput(value);
        }
      }

      console.log('Booking data:', data);

      // Show success message
      quizForm.reset();
      quizSuccess.classList.remove('form__success--hidden');

      // Reset to first step after delay
      setTimeout(() => {
        currentStep = 0;
        selectedDinner = null;
        updateStep();
        quizSuccess.classList.add('form__success--hidden');
        if (allergyDetailsGroup) {
          allergyDetailsGroup.style.display = 'none';
        }
        if (dinnerInfo) {
          dinnerInfo.classList.add('hidden');
        }
      }, 3000);
    } else {
      showErrorAnimation();
    }
  });

  // Initialize
  updateStep();
}

// ===== Dinner Tabs =====
function initDinnerTabs() {
  const tabsContainer = document.getElementById('menu-tabs');
  const menuContent = document.getElementById('menu-content');
  if (!tabsContainer || !menuContent) return;

  // Dinner data
  const dinners = [
    { id: 1, country: 'italy', flag: '🇮🇹', name: 'Italy', menu: [
      { name: 'Bruschetta', desc: 'Sun-ripened tomatoes, fresh basil from the garden, and cold-pressed extra virgin olive oil on sourdough.', image: 'bruschetta.jpg' },
      { name: 'Pasta Carbonara', desc: 'Guanciale, Pecorino Romano, organic egg yolks, and freshly cracked black pepper. No cream allowed.', image: 'pasta.jpg' },
      { name: 'Tiramisu', desc: 'Mascarpone clouds layered with espresso-soaked savoiardi and dusted with premium dark cocoa.', image: 'tiramisu.jpg' }
    ]},
    { id: 2, country: 'india', flag: '🇮🇳', name: 'India', menu: [
      { name: 'Samosa', desc: 'Crispy pastry filled with spiced potatoes, peas, and aromatic herbs. Served with mint chutney.', image: 'samosa.jpg' },
      { name: 'Butter Chicken', desc: 'Tender tandoor-grilled chicken simmered in a velvety tomato-cream sauce with fenugreek.', image: 'butter-chicken.jpg' },
      { name: 'Gulab Jamun', desc: 'Warm milk-solid dumplings soaked in rose-scented sugar syrup. A royal ending.', image: 'gulab-jamun.jpg' }
    ]},
    { id: 3, country: 'thailand', flag: '🇹🇭', name: 'Thailand', menu: [
      { name: 'Tom Yum', desc: 'Fiery and fragrant soup with prawns, lemongrass, galangal, and kaffir lime leaves.', image: 'tom-yum.jpg' },
      { name: 'Pad Thai', desc: 'Stir-fried rice noodles with tamarind, fish sauce, crushed peanuts, and fresh lime.', image: 'pad-thai.jpg' },
      { name: 'Mango Sticky Rice', desc: 'Sweet coconut-infused glutinous rice crowned with ripe golden mango.', image: 'mango-sticky-rice.jpg' }
    ]},
    { id: 4, country: 'georgia', flag: '🇬🇪', name: 'Georgia', menu: [
      { name: 'Khachapuri', desc: 'Boat-shaped bread filled with molten sulguni cheese and a golden egg yolk. Pure comfort.', image: 'khachapuri.jpg' },
      { name: 'Khinkali', desc: 'Hand-twisted dumplings bursting with seasoned meat and aromatic broth. Eat with your hands.', image: 'khinkali.jpg' },
      { name: 'Badrijani', desc: 'Silky fried eggplant rolls stuffed with spiced walnut paste and pomegranate seeds.', image: 'badrijani.jpg' }
    ]}
  ];

  // Create tabs
  dinners.forEach((dinner, index) => {
    const tabBtn = document.createElement('button');
    tabBtn.className = `menu__tab ${index === 0 ? 'menu__tab--active' : ''}`;
    tabBtn.dataset.country = dinner.country;
    tabBtn.innerHTML = `<span class="menu__tab-name">${dinner.name}</span>`;
    tabBtn.addEventListener('click', () => switchDinnerTab(dinner, tabBtn));
    tabsContainer.appendChild(tabBtn);
  });

  // Switch dinner tab function
  function switchDinnerTab(dinner, activeTab) {
    // Update tab classes
    document.querySelectorAll('.menu__tab').forEach(tab => tab.classList.remove('menu__tab--active'));
    activeTab.classList.add('menu__tab--active');

    // Create menu panel
    menuContent.innerHTML = '';
    const panel = document.createElement('div');
    panel.className = 'menu__panel menu__panel--active';

    dinner.menu.forEach((dish, index) => {
      // Определяем тип блюда по индексу
      const dishTypes = ['Appetizer', 'Main Course', 'Dessert'];
      const dishType = dishTypes[index] || 'Dish';
      
      const card = document.createElement('div');
      card.className = 'dish-card';
      card.innerHTML = `
        <div class="dish-card__image">
          <img src="./assets/images/dishes/${dish.image}" alt="${dish.name}" loading="lazy" onerror="this.src='./assets/images/dishes/placeholder.jpg'">
          <span class="dish-card__badge">${dishType}</span>
        </div>
        <div class="dish-card__content">
          <h3 class="dish-card__title">${dish.name}</h3>
          <p class="dish-card__description">${dish.desc}</p>
        </div>
      `;
      panel.appendChild(card);
    });

    menuContent.appendChild(panel);
  }

  // Initialize first tab (Italy)
  const firstTab = tabsContainer.querySelector('.menu__tab');
  if (firstTab) {
    switchDinnerTab(dinners[0], firstTab);
  }
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
