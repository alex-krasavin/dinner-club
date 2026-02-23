/**
 * API Module - The Global Table by KG
 * Загрузка данных с бэкенда для hero-слайдера и других секций
 */

// ===== API Configuration =====
const API_BASE_URL = '/api'; // Заменить на реальный URL бэкенда

// ===== Mock Data (для разработки, пока нет бэкенда) =====
const HERO_SLIDES_MOCK = [
  {
    id: 1,
    image: './assets/images/hero/hero-1.jpg',
    title: 'A Journey of Flavors',
    subtitle: 'International dinners in one place',
    active: true
  },
  {
    id: 2,
    image: './assets/images/hero/hero-2.jpg',
    title: 'New Cuisine Every Week',
    subtitle: 'From South Africa to India',
    active: true
  },
  {
    id: 3,
    image: './assets/images/hero/hero-3.jpg',
    title: 'Up to 15 Guests',
    subtitle: 'Intimate atmosphere and new connections',
    active: true
  }
];

const DINNERS_MOCK = [
  {
    id: 1,
    country: 'italy',
    flag: '🇮🇹',
    title: 'Italian Night',
    date: '2026-03-07',
    menu: ['Bruschetta with tomatoes and basil', 'Pasta Carbonara', 'Tiramisu'],
    available: true
  },
  {
    id: 2,
    country: 'india',
    flag: '🇮🇳',
    title: 'Indian Spice Journey',
    date: '2026-03-08',
    menu: ['Samosa with mint chutney', 'Butter Chicken with naan', 'Gulab Jamun'],
    available: true
  },
  {
    id: 3,
    country: 'thailand',
    flag: '🇹🇭',
    title: 'Thai Flavors',
    date: '2026-03-14',
    menu: ['Tom Yum soup', 'Pad Thai with shrimp', 'Mango with sticky rice'],
    available: true
  },
  {
    id: 4,
    country: 'georgia',
    flag: '🇬🇪',
    title: 'Georgian Feast',
    date: '2026-03-15',
    menu: ['Khachapuri Adjaruli', 'Khinkali with meat', 'Badrijani with walnut paste'],
    available: true
  }
];

// ===== API Functions =====

/**
 * Получить данные hero-слайдов
 * @returns {Promise<Array>} - массив слайдов
 */
export async function getHeroSlides() {
  try {
    // Раскомментировать, когда будет реальный API
    // const response = await fetch(`${API_BASE_URL}/hero-slides`);
    // if (!response.ok) throw new Error('Failed to fetch hero slides');
    // return await response.json();

    // Mock data для разработки
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HERO_SLIDES_MOCK);
      }, 100);
    });
  } catch (error) {
    console.error('Error loading hero slides:', error);
    return HERO_SLIDES_MOCK; // Fallback к mock данным
  }
}

/**
 * Получить ужин по дате
 * @param {string} date - дата в формате YYYY-MM-DD
 * @returns {Promise<Object>} - данные ужина
 */
export async function getDinnerByDate(date) {
  try {
    // Раскомментировать, когда будет реальный API
    // const response = await fetch(`${API_BASE_URL}/dinners?date=${date}`);
    // if (!response.ok) throw new Error('Failed to fetch dinner');
    // return await response.json();

    // Mock data для разработки
    return new Promise((resolve) => {
      setTimeout(() => {
        // Простая логика: выбираем ужин по номеру недели
        const dateObj = new Date(date);
        const weekNumber = Math.floor(dateObj.getDate() / 7);
        const dinnerIndex = weekNumber % DINNERS_MOCK.length;
        resolve(DINNERS_MOCK[dinnerIndex]);
      }, 100);
    });
  } catch (error) {
    console.error('Error loading dinner:', error);
    return null;
  }
}

/**
 * Получить все ужины
 * @returns {Promise<Array>} - массив ужинов
 */
export async function getAllDinners() {
  try {
    // Раскомментировать, когда будет реальный API
    // const response = await fetch(`${API_BASE_URL}/dinners`);
    // if (!response.ok) throw new Error('Failed to fetch dinners');
    // return await response.json();

    // Mock data для разработки
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DINNERS_MOCK);
      }, 100);
    });
  } catch (error) {
    console.error('Error loading dinners:', error);
    return DINNERS_MOCK; // Fallback к mock данным
  }
}

/**
 * Отправить заявку на бронирование
 * @param {Object} bookingData - данные бронирования
 * @returns {Promise<Object>} - ответ сервера
 */
export async function submitBooking(bookingData) {
  try {
    // Раскомментировать, когда будет реальный API
    // const response = await fetch(`${API_BASE_URL}/bookings`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(bookingData)
    // });
    // if (!response.ok) throw new Error('Failed to submit booking');
    // return await response.json();

    // Mock data для разработки
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Booking submitted successfully',
          bookingId: Date.now()
        });
      }, 500);
    });
  } catch (error) {
    console.error('Error submitting booking:', error);
    return { success: false, message: error.message };
  }
}
