document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const mainNav = document.querySelector('.header__nav');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav__link');

    // Меню и навигация
    menuToggle.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded);
        mainNav.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Фиксирование хедера при скролле
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Плавная прокрутка с учетом высоты хедера
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    // Учет предпочтений пользователя по уменьшенной анимации
                    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        window.scrollTo(0, targetPosition);
                    } else {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                    
                    // Добавление фокуса на целевой элемент для доступности
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus({ preventScroll: true });
                }
            }
        });
    });

    // Проверка элементов в поле зрения
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }

    const animateElements = document.querySelectorAll('.feature-card, .room-card, .service-card, .gallery__item, .review-card');

    function checkAnimations() {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            animateElements.forEach(element => {
                if (isElementInViewport(element) && !element.classList.contains('animated')) {
                    element.classList.add('animated');
                    element.style.animation = 'fadeIn 0.5s ease-in-out forwards, slideUp 0.5s ease-in-out forwards';
                }
            });
        }
    }

    checkAnimations();
    window.addEventListener('scroll', checkAnimations);

    // Валидация формы бронирования
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Валидация формы
            if (validateForm(this)) {
                const formData = new FormData(this);
                const bookingData = {};

                formData.forEach((value, key) => {
                    bookingData[key] = value;
                });

                // Сообщение об успешной отправке с доступной ролью alert
                const successMessage = document.createElement('div');
                successMessage.setAttribute('role', 'alert');
                successMessage.setAttribute('aria-live', 'assertive');
                successMessage.className = 'form-success-message';
                successMessage.textContent = 'Спасибо за бронирование! Мы свяжемся с вами в ближайшее время.';
                
                this.appendChild(successMessage);
                
                setTimeout(() => {
                    successMessage.remove();
                    this.reset();
                }, 4000);
            }
        });
    }

    const formInputs = document.querySelectorAll('.form-input');

    // Улучшенная валидация инпутов
    formInputs.forEach(input => {
        // Создаем элемент для сообщений об ошибках
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.setAttribute('aria-live', 'polite');
        input.insertAdjacentElement('afterend', errorMessage);
        
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            // Удаляем ошибку при начале ввода
            this.classList.remove('error');
            errorMessage.textContent = '';
        });
    });

    function validateInput(input) {
        const errorMessage = input.nextElementSibling;
        
        if (input.hasAttribute('required') && input.value.trim() === '') {
            input.classList.add('error');
            errorMessage.textContent = 'Это поле обязательно для заполнения';
            return false;
        } else if (input.type === 'email' && input.value.trim() !== '') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value)) {
                input.classList.add('error');
                errorMessage.textContent = 'Пожалуйста, введите корректный email';
                return false;
            }
        } else if (input.type === 'tel' && input.value.trim() !== '') {
            const phonePattern = /[0-9+\-\s]{10,}/;
            if (!phonePattern.test(input.value)) {
                input.classList.add('error');
                errorMessage.textContent = 'Пожалуйста, введите корректный номер телефона';
                return false;
            }
        }
        
        input.classList.remove('error');
        errorMessage.textContent = '';
        return true;
    }

    function validateForm(form) {
        let isValid = true;
        
        const inputs = form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Обработка изменения размера экрана
    function handleResize() {
        if (window.innerWidth >= 992 && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    window.addEventListener('resize', handleResize);

    // Улучшенная форма бронирования - установка минимальных дат
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');

    if (checkInInput && checkOutInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        checkInInput.min = formatDate(today);
        checkInInput.value = formatDate(today);
        
        // Доступное описание с aria-describedby можно добавить
        const checkInDescription = document.createElement('div');
        checkInDescription.id = 'check-in-description';
        checkInDescription.className = 'visually-hidden';
        checkInDescription.textContent = 'Выберите дату заезда, начиная с сегодняшнего дня';
        checkInInput.setAttribute('aria-describedby', 'check-in-description');
        checkInInput.parentNode.appendChild(checkInDescription);

        checkOutInput.min = formatDate(tomorrow);
        checkOutInput.value = formatDate(tomorrow);

        // Доступное описание с aria-describedby
        const checkOutDescription = document.createElement('div');
        checkOutDescription.id = 'check-out-description';
        checkOutDescription.className = 'visually-hidden';
        checkOutDescription.textContent = 'Выберите дату выезда, не ранее следующего дня после заезда';
        checkOutInput.setAttribute('aria-describedby', 'check-out-description');
        checkOutInput.parentNode.appendChild(checkOutDescription);

        checkInInput.addEventListener('change', function() {
            const newMinCheckOut = new Date(this.value);
            newMinCheckOut.setDate(newMinCheckOut.getDate() + 1);

            const formattedNewMin = formatDate(newMinCheckOut);
            checkOutInput.min = formattedNewMin;

            if (new Date(checkOutInput.value) <= new Date(this.value)) {
                checkOutInput.value = formattedNewMin;
            }
        });
    }

    // Управление фокусом с клавиатуры
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Закрытие модальных окон или меню при нажатии Escape
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus(); // Возврат фокуса к кнопке меню
            }
        }
    });
});