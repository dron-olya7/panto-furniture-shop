window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (window.scrollY > 1000) {  // после 50px прокрутки
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        let isOpen = false;
        
        // Наведение на триггер
        trigger.addEventListener('mouseenter', function() {
            isOpen = true;
            trigger.style.color = '#E58411'; // Оранжевый цвет
            const svgPath = trigger.querySelector('svg path');
            if (svgPath) {
                svgPath.style.fill = '#E58411';
            }
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
        });
        
        // Уход с триггера
        trigger.addEventListener('mouseleave', function() {
            isOpen = false;
            setTimeout(() => {
                if (!isOpen) {
                    trigger.style.color = ''; // Возвращаем цвет
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
        
        // Наведение на меню
        menu.addEventListener('mouseenter', function() {
            isOpen = true;
            trigger.style.color = '#E58411'; // Оранжевый цвет
            const svgPath = trigger.querySelector('svg path');
            if (svgPath) {
                svgPath.style.fill = '#E58411';
            }
        });
        
        // Уход с меню
        menu.addEventListener('mouseleave', function() {
            isOpen = false;
            trigger.style.color = ''; // Возвращаем цвет
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

/*Табы в products */
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

/*Слайдер*/
class Carousel {
    constructor(selector, options = {}) {
        this.slider = document.querySelector(selector);
        this.track = this.slider.querySelector('.slider-track');
        this.slides = this.slider.querySelectorAll('.slide');
        this.prevBtn = this.slider.querySelector('.prev');
        this.nextBtn = this.slider.querySelector('.next');
        
        this.currentIndex = 0;
        this.slidesCount = this.slides.length;
        this.slidesToShow = options.slidesToShow || 4;  // сколько показываем
        this.autoplay = options.autoplay || false;
        this.interval = options.interval || 4000;
        this.autoplayTimer = null;
        
        this.init();
    }
    
    init() {
        // Проверка: если слайдов меньше или равно количеству показываемых
        if (this.slidesCount <= this.slidesToShow) {
            this.disableSlider();
            return;
        }
        
        // Рассчитываем максимальный индекс
        this.maxIndex = this.slidesCount - this.slidesToShow;
        
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());
        
        if (this.autoplay) {
            this.startAutoplay();
            this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
            this.slider.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        this.update();
    }
    
    disableSlider() {
        // Скрываем кнопки
        if (this.prevBtn) this.prevBtn.style.display = 'none';
        if (this.nextBtn) this.nextBtn.style.display = 'none';
        
        // Убираем transition у трека
        this.track.style.transform = 'translateX(0)';
        
        console.log('⚠️ Слайдер отключен: слайдов меньше или равно', this.slidesToShow);
    }
    
    goTo(index) {
        if (index < 0) {
            index = 0;
        } else if (index > this.maxIndex) {
            index = this.maxIndex;
        }
        
        this.currentIndex = index;
        this.update();
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.goTo(this.currentIndex + 1);
        } else {
            this.goTo(0);
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.goTo(this.currentIndex - 1);
        } else {
            this.goTo(this.maxIndex);
        }
    }
    
    update() {
        const offset = -(this.currentIndex * 100) / this.slidesToShow;
        this.track.style.transform = `translateX(${offset}%)`;
    }
    
    startAutoplay() {
        if (this.autoplayTimer) clearInterval(this.autoplayTimer);
        this.autoplayTimer = setInterval(() => this.next(), this.interval);
    }
    
    stopAutoplay() {
        if (this.autoplayTimer) clearInterval(this.autoplayTimer);
    }
}

// Запуск
new Carousel('.slider', {
    slidesToShow: 4,
    autoplay: false,
    interval: 4000
});

// слайдер с отзывами
class TestimonialSlider {
    constructor(selector) {
        this.slider = document.querySelector(selector);
        this.container = this.slider.querySelector('.testimonials-container');
        this.track = this.slider.querySelector('.testimonials-track');
        this.slides = this.slider.querySelectorAll('.testimonial-slide');
        this.prevBtn = this.slider.querySelector('.prev');
        this.nextBtn = this.slider.querySelector('.next');
        
        this.currentIndex = 0;
        this.slidesCount = this.slides.length;  // 4
        this.slidesToShow = 3;  // показываем 3
        this.step = 400;  // 370 + 30
        
        this.maxIndex = this.slidesCount - this.slidesToShow;  // 1
        
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        this.update();
    }
    
    goTo(index) {
        if (index < 0) index = this.maxIndex;
        if (index > this.maxIndex) index = 0;
        this.currentIndex = index;
        this.update();
    }
    
    next() { this.goTo(this.currentIndex + 1); }
    prev() { this.goTo(this.currentIndex - 1); }
    
    update() {
        const offset = this.currentIndex * this.step;
        this.track.style.transform = `translateX(-${offset}px)`;
    }
}

new TestimonialSlider('.testimonials-slider');


const scrollBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', function() {
    if (window.scrollY > 400) {
        scrollBtn.classList.add('visible');
    } else {
        scrollBtn.classList.remove('visible');
    }
});

scrollBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const parent = this.closest('.choose-card, .provide-info, .materials-info');
            if (!parent) return;
            
            const target = parent.querySelector('.card-text-full');
            if (!target) return;
            
            const isOpen = target.classList.contains('open');
            
            // Закрываем другие открытые
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
            
            // Переключаем
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