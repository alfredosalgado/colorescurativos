// Colores Curativos - JavaScript Principal

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del navbar
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // Variables para el control del scroll
    let lastScrollTop = 0;
    let scrollTimeout;
    
    // Navbar scroll effect - mantener transparente en hero, agregar fondo después y ocultar/mostrar
    window.addEventListener('scroll', function() {
        const heroHeight = document.querySelector('.hero').offsetHeight;
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Lógica para ocultar/mostrar navbar
        if (currentScroll > 100) { // Solo aplicar después de 100px de scroll
            if (currentScroll > lastScrollTop && !navMenu.classList.contains('active')) {
                // Scrolling down - ocultar navbar
                navbar.classList.add('hidden');
                navbar.classList.remove('visible');
            } else {
                // Scrolling up - mostrar navbar
                navbar.classList.remove('hidden');
                navbar.classList.add('visible');
            }
        } else {
            // En la parte superior, siempre mostrar
            navbar.classList.remove('hidden');
            navbar.classList.add('visible');
        }
        
        // Cambio de estilo según posición
        if (currentScroll > heroHeight - 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            // Cambiar color de texto cuando hay fondo
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.style.color = '#5d4e37';
                link.style.textShadow = 'none';
            });
            const hamburgerSpans = document.querySelectorAll('.hamburger span');
            hamburgerSpans.forEach(span => {
                span.style.background = '#5d4e37';
                span.style.boxShadow = 'none';
            });
        } else {
            navbar.style.background = 'transparent';
            navbar.style.boxShadow = 'none';
            // Restaurar color de texto transparente
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.style.color = '#ffffff';
                link.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';
            });
            const hamburgerSpans = document.querySelectorAll('.hamburger span');
            hamburgerSpans.forEach(span => {
                span.style.background = '#ffffff';
                span.style.boxShadow = '1px 1px 2px rgba(0, 0, 0, 0.3)';
            });
        }
        
        // Ocultar hamburguesa en vista móvil cuando se hace scroll (hacia abajo o arriba)
        if (window.innerWidth <= 768 && !navMenu.classList.contains('active')) {
            if (currentScroll > 0) {
                navbar.style.display = 'none';
            } else {
                navbar.style.display = 'flex';
            }
        } else if (window.innerWidth <= 768) {
            // Mantener visible si el menú móvil está activo para permitir cerrarlo
            navbar.style.display = 'flex';
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Para Mobile o negative scrolling
    });
    
    // Funcionalidad del menú hamburguesa
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Funcionalidad del carrusel de terapias
class TherapyCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 8;
        this.track = document.querySelector('.carousel-track');
        this.prevBtn = document.querySelector('.carousel-btn-prev');
        this.nextBtn = document.querySelector('.carousel-btn-next');
        this.indicators = document.querySelectorAll('.indicator');
        this.autoPlayInterval = null;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
        this.handleResize();
    }
    
    init() {
        if (!this.track) return;
        
        // Event listeners para botones
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Event listeners para indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Inicializar primer slide
        this.updateCarousel();
        
        // Auto-play
        this.startAutoPlay();
        
        // Pausar auto-play al hover (solo en desktop)
        if (!this.isMobile) {
            const carouselContainer = document.querySelector('.carousel-container');
            carouselContainer?.addEventListener('mouseenter', () => this.stopAutoPlay());
            carouselContainer?.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // Touch events para móvil
        if (this.isMobile) {
            this.addTouchEvents();
        }
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (wasMobile !== this.isMobile) {
                this.updateCarousel();
            }
        });
    }
    
    addTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Mínimo 50px de swipe
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (!this.track) return;
        
        let translateX;
        if (this.isMobile) {
            // En móvil: mostrar una tarjeta a la vez
            translateX = -this.currentSlide * 100;
        } else {
            // En desktop: mostrar múltiples tarjetas
            translateX = -this.currentSlide * 12.5; // 12.5% por slide
        }
        
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Actualizar indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.isMobile ? 3000 : 4000); // Más rápido en móvil
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}
    
    // Inicializar carrusel
    new TherapyCarousel();
    
    // Smooth scrolling para los enlaces del navbar
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Cerrar menú móvil si está abierto
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Ajuste para el navbar fijo
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Cerrar menú móvil al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Animación de entrada para elementos cuando entran en viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos de la sección historia
    const historiaElements = document.querySelectorAll('.historia-content, .historia-image');
    historiaElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Funcionalidad para los botones del hero
    const btnPrimary = document.querySelector('.btn-primary');
    const btnSecondary = document.querySelector('.btn-secondary');
    
    if (btnPrimary) {
        btnPrimary.addEventListener('click', function() {
            // Scroll a la sección de terapias (cuando esté disponible)
            const terapiasSection = document.querySelector('#terapias');
            if (terapiasSection) {
                terapiasSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Por ahora, mostrar un mensaje
                alert('La sección de terapias estará disponible próximamente.');
            }
        });
    }
    
    if (btnSecondary) {
        btnSecondary.addEventListener('click', function() {
            // Scroll a la sección de contacto (cuando esté disponible)
            const contactoSection = document.querySelector('#contacto');
            if (contactoSection) {
                contactoSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Por ahora, mostrar un mensaje
                alert('La sección de contacto estará disponible próximamente.');
            }
        });
    }
    
    // Efecto parallax removido para evitar espacios en blanco
    
    // Funcionalidad de la flecha de scroll down
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', function() {
            const historiaSection = document.querySelector('#historia');
            if (historiaSection) {
                historiaSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Responsive navbar para móviles (preparación para futuras mejoras)
    function handleResize() {
        const navMenu = document.querySelector('.nav-menu');
        // Restablecer visibilidad del botón hamburguesa según tamaño de pantalla
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'flex';
        } else {
            hamburger.style.display = 'none';
            // Asegurar que el menú móvil se cierre al volver a desktop
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Ejecutar al cargar
    
    console.log('Colores Curativos - Website cargado correctamente');
});

// Función para mostrar/ocultar elementos con animación
function fadeInElement(element, delay = 0) {
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

// Función para validar formularios (para uso futuro)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Exportar funciones para uso global si es necesario
window.ColoresCurativos = {
    fadeInElement,
    validateForm
};