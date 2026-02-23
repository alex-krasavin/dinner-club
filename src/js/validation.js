/**
 * Form Validation Module - The Global Table by KG
 * Валидация полей формы бронирования
 */

// ===== Regular Expressions =====
const PATTERNS = {
  // Только латинские буквы, пробелы и дефисы
  name: /^[A-Za-z\s\-]+$/,
  // Телефон: +, цифры, пробелы, дефисы, скобки (8-20 символов после очистки)
  phone: /^[\+\d\s\-\(\)]{8,20}$/,
  // Email
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// ===== Validation Functions =====

/**
 * Валидация имени
 * @param {string} value - значение поля
 * @returns {boolean} - результат валидации
 */
export function validateName(value) {
  if (!value || !value.trim()) return false;
  return PATTERNS.name.test(value.trim());
}

/**
 * Валидация телефона
 * @param {string} value - значение поля
 * @returns {boolean} - результат валидации
 */
export function validatePhone(value) {
  if (!value || !value.trim()) return false;
  // Очищаем телефон от лишних символов, оставляем только цифры и +
  const cleaned = value.replace(/[^\d+]/g, '');
  // Проверяем длину (минимум 8 цифр)
  return cleaned.length >= 8 && PATTERNS.phone.test(value.trim());
}

/**
 * Валидация email
 * @param {string} value - значение поля
 * @returns {boolean} - результат валидации
 */
export function validateEmail(value) {
  // Email не обязателен, но если заполнен - проверяем
  if (!value || !value.trim()) return true;
  return PATTERNS.email.test(value.trim());
}

/**
 * Очистка телефона (оставляем только цифры и +)
 * @param {string} value - значение поля
 * @returns {string} - очищенное значение
 */
export function sanitizePhone(value) {
  if (!value) return '';
  // Оставляем только цифры и +
  return value.replace(/[^\d+]/g, '');
}

/**
 * Санитизация имени (удаляем недопустимые символы)
 * @param {string} value - значение поля
 * @returns {string} - очищенное значение
 */
export function sanitizeName(value) {
  if (!value) return '';
  // Оставляем только буквы, пробелы и дефисы
  return value.replace(/[^A-Za-z\s\-]/g, '');
}

/**
 * Показать ошибку валидации
 * @param {HTMLElement} input - поле ввода
 * @param {HTMLElement} errorElement - элемент ошибки
 */
export function showError(input, errorElement) {
  if (input) input.classList.add('form__input--error');
  if (errorElement) errorElement.classList.remove('form__error--hidden');
}

/**
 * Скрыть ошибку валидации
 * @param {HTMLElement} input - поле ввода
 * @param {HTMLElement} errorElement - элемент ошибки
 */
export function hideError(input, errorElement) {
  if (input) input.classList.remove('form__input--error');
  if (errorElement) errorElement.classList.add('form__error--hidden');
}

/**
 * Валидировать поле и показать/скрыть ошибку
 * @param {HTMLElement} input - поле ввода
 * @param {HTMLElement} errorElement - элемент ошибки
 * @param {Function} validator - функция валидации
 * @returns {boolean} - результат валидации
 */
export function validateField(input, errorElement, validator) {
  const isValid = validator(input.value);
  if (isValid) {
    hideError(input, errorElement);
  } else {
    showError(input, errorElement);
  }
  return isValid;
}

/**
 * Валидировать все поля контакта
 * @returns {boolean} - результат валидации всех полей
 */
export function validateContactFields() {
  const nameInput = document.getElementById('quiz-name');
  const nameError = document.getElementById('name-error');
  const phoneInput = document.getElementById('quiz-phone');
  const phoneError = document.getElementById('phone-error');
  const emailInput = document.getElementById('quiz-email');
  const emailError = document.getElementById('email-error');

  let isValid = true;

  // Валидация имени
  if (nameInput && nameError) {
    if (!validateField(nameInput, nameError, validateName)) {
      isValid = false;
    }
  }

  // Валидация телефона
  if (phoneInput && phoneError) {
    if (!validateField(phoneInput, phoneError, validatePhone)) {
      isValid = false;
    }
  }

  // Валидация email (не обязательный)
  if (emailInput && emailError) {
    if (!validateField(emailInput, emailError, validateEmail)) {
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Инициализация валидации полей
 */
export function initFormValidation() {
  const nameInput = document.getElementById('quiz-name');
  const phoneInput = document.getElementById('quiz-phone');
  const emailInput = document.getElementById('quiz-email');

  // Обработчик для имени - санитизация при вводе
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      const sanitized = sanitizeName(e.target.value);
      if (sanitized !== e.target.value) {
        e.target.value = sanitized;
      }
    });

    nameInput.addEventListener('blur', () => {
      const nameError = document.getElementById('name-error');
      validateField(nameInput, nameError, validateName);
    });
  }

  // Обработчик для телефона - автоматический + и санитизация
  if (phoneInput) {
    // Добавляем + при фокусе, если поле пустое
    phoneInput.addEventListener('focus', (e) => {
      if (!e.target.value || !e.target.value.startsWith('+')) {
        e.target.value = '+' + e.target.value.replace(/^\+/, '');
      }
    });

    // Санитизация при вводе
    phoneInput.addEventListener('input', (e) => {
      const sanitized = sanitizePhone(e.target.value);
      // Добавляем пробелы для форматирования
      if (sanitized.length > 1) {
        const formatted = sanitized.slice(0, 1) + ' ' + 
          sanitized.slice(1, 4) + (sanitized.length > 4 ? ' ' : '') +
          sanitized.slice(4, 7) + (sanitized.length > 7 ? ' ' : '') +
          sanitized.slice(7, 11);
        e.target.value = formatted.trim();
      } else {
        e.target.value = sanitized;
      }
    });

    phoneInput.addEventListener('blur', () => {
      const phoneError = document.getElementById('phone-error');
      validateField(phoneInput, phoneError, validatePhone);
    });
  }

  // Обработчик для email
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const emailError = document.getElementById('email-error');
      validateField(emailInput, emailError, validateEmail);
    });
  }
}
