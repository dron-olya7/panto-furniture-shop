// ==========================================
// ХЕДЕР ПРИ СКРОЛЛЕ
// ==========================================
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    if (window.scrollY > 1000) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==========================================
// БУРГЕР-МЕНЮ
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.nav-overlay');

    if (!burger || !nav) return;

    function toggleMenu() {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
        if (overlay) {
            overlay.classList.toggle('active');
        }
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    }

    function closeMenu() {
        burger.classList.remove('active');
        nav.classList.remove('open');
        if (overlay) {
            overlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    burger.addEventListener('click', toggleMenu);

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 992 && nav.classList.contains('open')) {
            closeMenu();
        }
    });
});

// ==========================================
// ДРОПДАУН
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        let isOpen = false;

        trigger.addEventListener('mouseenter', function () {
            isOpen = true;
            trigger.style.color = '#E58411';
            const svgPath = trigger.querySelector('svg path');
            if (svgPath) {
                svgPath.style.fill = '#E58411';
            }
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
        });

        trigger.addEventListener('mouseleave', function () {
            isOpen = false;
            setTimeout(() => {
                if (!isOpen) {
                    trigger.style.color = '';
                    const svgPath = trigger.querySelector('svg path');
                    if (svgPath) {
                        svgPath.style.fill = '';
                    }
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-10px)';
                }
            }, 100);
        });

        menu.addEventListener('mouseenter', function () {
            isOpen = true;
            trigger.style.color = '#E58411';
            const svgPath = trigger.querySelector('svg path');
            if (svgPath) {
                svgPath.style.fill = '#E58411';
            }
        });

        menu.addEventListener('mouseleave', function () {
            isOpen = false;
            trigger.style.color = '';
            const svgPath = trigger.querySelector('svg path');
            if (svgPath) {
                svgPath.style.fill = '';
            }
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateY(-10px)';
        });
    });
});

// ==========================================
// ТАБЫ В PRODUCTS
// ==========================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

class UniversalSlider {
    constructor(options) {
        this.container = options.container;
        this.track = options.track;
        this.slides = options.slides;
        this.prevBtn = options.prevBtn;
        this.nextBtn = options.nextBtn;
        this.gap = options.gap || 0;
        this.breakpoints = options.breakpoints || {
            1200: 4,
            992: 3,
            768: 2,
            576: 1
        };
        this.defaultSlides = options.defaultSlides || 1;

        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.slidesPerView = this.getSlidesPerView();

        this.init();
    }

    getSlidesPerView() {
        const width = window.innerWidth;
        const breakpoints = Object.keys(this.breakpoints).map(Number).sort((a, b) => b - a);

        for (let bp of breakpoints) {
            if (width > bp) {
                return this.breakpoints[bp];
            }
        }
        return this.defaultSlides;
    }

    setSlideWidths() {
        const slideWidth = 100 / this.slidesPerView;
        this.slides.forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}%`;
            slide.style.maxWidth = `${slideWidth}%`;
        });
    }

    updateButtons() {
        const maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        const show = this.totalSlides > this.slidesPerView;

        if (this.prevBtn) {
            this.prevBtn.classList.toggle('hidden', !show);
        }
        if (this.nextBtn) {
            this.nextBtn.classList.toggle('hidden', !show);
        }

        return maxIndex;
    }

    update() {
        this.slidesPerView = this.getSlidesPerView();
        this.setSlideWidths();

        const maxIndex = this.updateButtons();
        if (this.currentIndex > maxIndex) {
            this.currentIndex = 0;
        }

        if (this.totalSlides <= this.slidesPerView) {
            this.track.style.transform = 'translateX(0)';
            return;
        }

        const slideWidth = 100 / this.slidesPerView;
        const offset = -(this.currentIndex * slideWidth);
        this.track.style.transform = `translateX(${offset}%)`;
    }

    goTo(index) {
        const maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        if (index < 0) index = 0;
        if (index > maxIndex) index = maxIndex;
        this.currentIndex = index;
        this.update();
    }

    next() {
        const maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        this.goTo(this.currentIndex < maxIndex ? this.currentIndex + 1 : 0);
    }

    prev() {
        const maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        this.goTo(this.currentIndex > 0 ? this.currentIndex - 1 : maxIndex);
    }

    init() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.currentIndex = 0;
                this.update();
            }, 200);
        });

        this.update();
    }
}

// ==========================================
// ЗАПУСК ВСЕХ СЛАЙДЕРОВ ПРОДУКТОВ
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    // Находим ВСЕ слайдеры на странице
    const productSliders = document.querySelectorAll('.slider');

    if (productSliders.length > 0) {
        productSliders.forEach((slider, index) => {
            new UniversalSlider({
                container: slider,
                track: slider.querySelector('.slider-track'),
                slides: slider.querySelectorAll('.slide'),
                prevBtn: slider.querySelector('.prev'),
                nextBtn: slider.querySelector('.next'),
                breakpoints: {
                    1200: 4,  // >1200px - 4 слайда
                    992: 3,   // 992-1200px - 3 слайда
                    768: 2,   // 768-992px - 2 слайда
                    576: 1    // <768px - 1 слайд
                },
                defaultSlides: 1
            });
        });
        console.log(`✅ Запущено ${productSliders.length} слайдеров продуктов`);
    }
});

// ==========================================
// СЛАЙДЕР ОТЗЫВОВ
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonials-btn.prev');
    const nextBtn = document.querySelector('.testimonials-btn.next');

    if (!track || slides.length === 0) {
        console.log('❌ Слайдер отзывов не найден');
        return;
    }

    console.log(`✅ Найдено ${slides.length} отзывов`);

    let currentIndex = 0;
    let slidesPerView = 3;
    const gap = 30;

    function getSlidesPerView() {
        const width = window.innerWidth;
        if (width > 1200) return 3;
        if (width > 700) return 2;
        return 1;
    }

    function updateSlider() {
        slidesPerView = getSlidesPerView();
        const maxIndex = Math.max(0, slides.length - slidesPerView);

        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        if (slides.length <= slidesPerView) {
            if (prevBtn) prevBtn.classList.add('hidden');
            if (nextBtn) nextBtn.classList.add('hidden');
            track.style.transform = 'translateX(0)';
            return;
        } else {
            if (prevBtn) prevBtn.classList.remove('hidden');
            if (nextBtn) nextBtn.classList.remove('hidden');
        }

        const slideWidth = slides[0].offsetWidth;
        const offset = -(currentIndex * (slideWidth + gap));
        track.style.transform = `translateX(${offset}px)`;
    }

    function nextSlide() {
        slidesPerView = getSlidesPerView();
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
        updateSlider();
    }

    function prevSlide() {
        slidesPerView = getSlidesPerView();
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
        updateSlider();
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            currentIndex = 0;
            updateSlider();
        }, 200);
    });

    setTimeout(updateSlider, 100);
    console.log('✅ Слайдер отзывов работает!');
});

// ==========================================
// КНОПКА СКРОЛЛА НАВЕРХ
// ==========================================
const scrollBtn = document.getElementById('scrollTopBtn');

if (scrollBtn) {
    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// READ MORE
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            const parent = this.closest('.choose-card, .provide-info, .materials-info');
            if (!parent) return;

            const target = parent.querySelector('.card-text-full');
            if (!target) return;

            const isOpen = target.classList.contains('open');

            document.querySelectorAll('.card-text-full.open').forEach(el => {
                if (el !== target) {
                    el.classList.remove('open');
                    const siblingBtn = el.closest('.choose-card, .provide-info, .materials-info')
                        ?.querySelector('.read-more-btn');
                    if (siblingBtn) {
                        siblingBtn.classList.remove('active');
                        siblingBtn.innerHTML = 'More Info <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 12.4002H42M36.6 17.8002C38.0324 15.1736 42 12.4002 42 12.4002C42 12.4002 37.5119 9.44867 36.6 7.00024" stroke="#E58411" stroke-linecap="square"/></svg>';
                    }
                }
            });

            target.classList.toggle('open');
            this.classList.toggle('active');

            if (isOpen) {
                this.innerHTML = 'More Info <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 12.4002H42M36.6 17.8002C38.0324 15.1736 42 12.4002 42 12.4002C42 12.4002 37.5119 9.44867 36.6 7.00024" stroke="#E58411" stroke-linecap="square"/></svg>';
            } else {
                this.innerHTML = 'Less Info <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 12.4002H42M36.6 17.8002C38.0324 15.1736 42 12.4002 42 12.4002C42 12.4002 37.5119 9.44867 36.6 7.00024" stroke="#E58411" stroke-linecap="square"/></svg>';
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const colorButtons = document.querySelectorAll('.color-btn');

    colorButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            
            // Находим родительский тултип
            const tooltip = this.closest('.tooltip');
            if (!tooltip) return;

            // ВЫВОДИМ ЛОГИ В КОНСОЛЬ (нажмите F12, чтобы увидеть)
            console.log('=== КЛИК ===');
            console.log('На какую кнопку нажали:', this.className);
            console.log('В каком тултипе (по индексу):', Array.from(tooltip.parentElement.children).indexOf(tooltip));
            console.log('Сколько всего кнопок в этом тултипе:', tooltip.querySelectorAll('.color-btn').length);

            // Убираем active у всех в этом тултипе
            tooltip.querySelectorAll('.color-btn').forEach(b => {
                b.classList.remove('active');
            });

            // Ставим active на нажатую
            this.classList.add('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('copyright').textContent = new Date().getFullYear();
});
