/**
 * Основной JavaScript файл для сайта отеля "Комфорт"
 * Обрабатывает интерактивность и улучшает пользовательский опыт
 */

// Дожидаемся полной загрузки DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    // Получаем ссылки на основные элементы интерфейса
    const menuToggle = document.querySelector('.header__menu-toggle');
    const mainNav = document.querySelector('.header__nav');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav__link');
    const scrollToTopBtn = document.getElementById('scrollToTop');

    // Обработчик открытия/закрытия мобильного меню
    menuToggle.addEventListener('click', function() {
        // Получаем текущее состояние меню
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        // Инвертируем состояние
        this.setAttribute('aria-expanded', !expanded);
        // Переключаем класс active для отображения/скрытия навигации
        mainNav.classList.toggle('active');
    });

    // Закрываем мобильное меню при клике на ссылку (только на мобильных устройствах)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Добавляем класс к шапке при прокрутке для визуального эффекта
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Плавная прокрутка для всех якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Проверяем, что это не просто "#" ссылка
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                // Если целевой элемент существует, прокручиваем к нему
                if (targetElement) {
                    // Учитываем высоту шапки для правильного позиционирования
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Функция для проверки, находится ли элемент в видимой области экрана
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            // Проверяем, что элемент виден на 80% высоты экрана и не ушел выше
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }

    // Элементы, которые будут анимироваться при появлении в области видимости
    const animateElements = document.querySelectorAll('.feature-card, .room-card, .service-card, .gallery__item, .review-card');

    // Функция проверки элементов для анимации
    function checkAnimations() {
        animateElements.forEach(element => {
            // Если элемент в области видимости и еще не анимирован
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                // Добавляем класс и анимации
                element.classList.add('animated');
                element.style.animation = 'fadeIn 0.5s ease-in-out forwards, slideUp 0.5s ease-in-out forwards';
            }
        });
    }

    // Первоначальная проверка для элементов, которые уже видны при загрузке
    checkAnimations();
    // Добавляем проверку при прокрутке страницы
    window.addEventListener('scroll', checkAnimations);

    // Обработка формы бронирования
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Получаем данные формы
            const formData = new FormData(this);
            const bookingData = {};

            // Преобразуем FormData в обычный объект
            formData.forEach((value, key) => {
                bookingData[key] = value;
            });

            // Здесь будет отправка данных на сервер в реальном приложении
            // ...

            // Временная реализация: просто показываем сообщение об успехе
            alert('Спасибо за бронирование! Мы свяжемся с вами в ближайшее время.');
            this.reset(); // Сбрасываем форму
        });
    }

    // Валидация полей формы
    const formInputs = document.querySelectorAll('.form-input');

    // Проверяем поля при потере фокуса
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });

    // Функция валидации поля ввода
    function validateInput(input) {
        if (input.hasAttribute('required') && input.value.trim() === '') {
            input.classList.add('error');
            return false;
        } else {
            input.classList.remove('error');
            return true;
        }
    }

    // Дополнительная валидация при отправке формы
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            let isValid = true;

            // Проверяем все поля на валидность
            formInputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            // Если есть невалидные поля, отменяем отправку формы
            if (!isValid) {
                e.preventDefault();
                alert('Пожалуйста, заполните все обязательные поля.');
            }
        });
    }

    // Обработка изменения размера окна для корректной работы меню
    function handleResize() {
        // Если достигли десктопного размера и меню открыто, закрываем его
        if (window.innerWidth >= 992 && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    window.addEventListener('resize', handleResize);

    // Настройка полей даты заезда и выезда в форме бронирования
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');

    if (checkInInput && checkOutInput) {
        // Получаем текущую дату и дату завтрашнего дня
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Функция для форматирования даты в YYYY-MM-DD (для атрибута value)
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Устанавливаем минимальные значения и значения по умолчанию
        checkInInput.min = formatDate(today);
        checkInInput.value = formatDate(today);

        checkOutInput.min = formatDate(tomorrow);
        checkOutInput.value = formatDate(tomorrow);

        // При изменении даты заезда обновляем минимальную дату выезда
        checkInInput.addEventListener('change', function() {
            const newMinCheckOut = new Date(this.value);
            newMinCheckOut.setDate(newMinCheckOut.getDate() + 1);

            checkOutInput.min = formatDate(newMinCheckOut);

            // Если текущая дата выезда меньше или равна новой дате заезда, 
            // устанавливаем дату выезда на следующий день после заезда
            if (new Date(checkOutInput.value) <= new Date(this.value)) {
                checkOutInput.value = formatDate(newMinCheckOut);
            }
        });
    }
});