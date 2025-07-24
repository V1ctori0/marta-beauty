/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

/*===== MENU SHOW =====*/
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

/*===== MENU HIDDEN =====*/
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
    const header = document.getElementById('header');
    if (this.scrollY >= 80) header.classList.add('scroll-header');
    else header.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);

/*==================== SHOW SCROLL UP ====================*/
function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');
    if (this.scrollY >= 560) scrollUp.classList.add('show-scroll');
    else scrollUp.classList.remove('show-scroll');
}
window.addEventListener('scroll', scrollUp);

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
        } else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
        }
    });
}
window.addEventListener('scroll', scrollActive);

/*==================== GALLERY CAROUSEL ====================*/
class GalleryCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.gallery__slide');
        this.dots = document.querySelectorAll('.gallery__dot');
        this.prevBtn = document.getElementById('gallery-prev');
        this.nextBtn = document.getElementById('gallery-next');

        this.init();
    }

    init() {
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Auto play
        this.autoPlay();
    }

    showSlide(index) {
        // Remove active class from all slides and dots
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');

        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    autoPlay() {
        setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryCarousel();
});

/*==================== FORM HANDLING ====================*/
class FormHandler {
    constructor() {
        this.form = document.getElementById('agendamento-form');
        this.successMessage = document.getElementById('form-success');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Set minimum date to today
        const dateInput = document.getElementById('data');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        // Format phone number
        const phoneInput = document.getElementById('telefone');
        if (phoneInput) {
            phoneInput.addEventListener('input', this.formatPhone);
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!this.validateForm(data)) {
            return;
        }

        // Simulate form submission
        this.submitForm(data);
    }

    validateForm(data) {
        const requiredFields = ['nome', 'telefone', 'servico', 'data', 'horario'];

        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                this.showError(`Por favor, preencha o campo ${this.getFieldLabel(field)}.`);
                return false;
            }
        }

        // Validate phone number
        if (!this.isValidPhone(data.telefone)) {
            this.showError('Por favor, insira um número de telefone válido.');
            return false;
        }

        // Validate date
        if (!this.isValidDate(data.data)) {
            this.showError('Por favor, selecione uma data válida.');
            return false;
        }

        return true;
    }

    isValidPhone(phone) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return phoneRegex.test(phone) || phone.length >= 10;
    }

    isValidDate(date) {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return selectedDate >= today;
    }

    formatPhone(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length >= 11) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 6) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length >= 2) {
            value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        }

        e.target.value = value;
    }

    submitForm(data) {
        // Show loading state
        const submitBtn = this.form.querySelector('.form__button');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Create WhatsApp message
            const message = this.createWhatsAppMessage(data);

            // Open WhatsApp
            const whatsappUrl = `https://wa.me/5566996566406?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            // Show success message
            this.showSuccess();

            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    createWhatsAppMessage(data) {
        return `🌟 *Novo Agendamento - Marta Beauty*

👤 *Nome:* ${data.nome}
📱 *Telefone:* ${data.telefone}
💅 *Serviço:* ${data.servico}
📅 *Data:* ${this.formatDate(data.data)}
⏰ *Horário:* ${data.horario}
${data.observacoes ? `📝 *Observações:* ${data.observacoes}` : ''}

Olá! Gostaria de agendar um horário. Aguardo confirmação! ✨`;
    }

    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showSuccess() {
        this.successMessage.classList.add('show');

        // Hide success message after 5 seconds
        setTimeout(() => {
            this.successMessage.classList.remove('show');
            this.form.reset();
        }, 5000);
    }

    showError(message) {
        alert(message); // In a real app, you'd use a proper notification system
    }

    getFieldLabel(field) {
        const labels = {
            nome: 'Nome',
            telefone: 'Telefone',
            servico: 'Serviço',
            data: 'Data',
            horario: 'Horário'
        };
        return labels[field] || field;
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
});

/*==================== PLANOS BUTTONS ====================*/
document.addEventListener('DOMContentLoaded', () => {
    const planoButtons = document.querySelectorAll('.plano__button');

    planoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const planoCard = button.closest('.plano__card');
            const planoName = planoCard.querySelector('.plano__name').textContent;
            const planoPrice = planoCard.querySelector('.plano__amount').textContent;

            const message = `🌟 *Interesse em Plano - Marta Beauty*

💅 *Plano:* ${planoName}
💰 *Valor:* R$ ${planoPrice}

Olá! Tenho interesse no plano ${planoName}. Gostaria de mais informações! ✨`;

            const whatsappUrl = `https://wa.me/5566996566406?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });
});

/*==================== SMOOTH SCROLLING ====================*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/*==================== ANIMATIONS ON SCROLL ====================*/
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.section__title, .section__description, .home__content, .gallery__container, .agendamento__form-container, .planos__grid, .contato__content');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

/*==================== LOADING ANIMATION ====================*/
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

/*==================== CONTACT BUTTONS ====================*/
document.addEventListener('DOMContentLoaded', () => {
    // WhatsApp button
    const whatsappButtons = document.querySelectorAll('.contato__button--whatsapp');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const message = `🌟 *Contato - Marta Beauty*

Olá! Vim através do site e gostaria de conversar sobre os serviços. ✨`;
            const whatsappUrl = `https://wa.me/5566996566406?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });

    // Location button
    const locationButtons = document.querySelectorAll('.contato__button--location');
    locationButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Replace with actual location coordinates
            const mapsUrl = 'https://maps.google.com/?q=-16.4564827,-54.6112287';
            window.open(mapsUrl, '_blank');
        });
    });
});

/*==================== PERFORMANCE OPTIMIZATIONS ====================*/
// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
window.addEventListener('scroll', debounce(() => {
    scrollHeader();
    scrollUp();
    scrollActive();
}, 10));



/*==================== FAQ FUNCTIONALITY ====================*/
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const faqContent = faqItem.querySelector('.faq__content');
    const faqIcon = element.querySelector('.faq__icon');

    // Close all other FAQs
    const allFaqItems = document.querySelectorAll('.faq__item');
    allFaqItems.forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            item.querySelector('.faq__content').classList.remove('active');
        }
    });

    // Toggle current FAQ
    faqItem.classList.toggle('active');
    faqContent.classList.toggle('active');
}


/*==================== ROTATE DEPOIMENTOS AUTOMATICAMENTE ====================*/
document.addEventListener('DOMContentLoaded', () => {
    const galleryImages = document.querySelectorAll('.gallery__slide img');
    let currentIndex = 0;

    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    Object.assign(lightbox.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        cursor: 'pointer',
    });

    const img = document.createElement('img');
    Object.assign(img.style, {
        maxWidth: '90%',
        maxHeight: '90%',
        borderRadius: '10px',
        boxShadow: '0 0 20px rgba(255,255,255,0.3)',
    });
    lightbox.appendChild(img);

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '30px',
        right: '50px',
        fontSize: '3rem',
        color: '#fff',
        cursor: 'pointer',
        zIndex: 10000,
    });
    lightbox.appendChild(closeBtn);

    document.body.appendChild(lightbox);

    function showImage(index) {
        currentIndex = (index + galleryImages.length) % galleryImages.length;
        img.src = galleryImages[currentIndex].src;
        lightbox.style.display = 'flex';
    }

    galleryImages.forEach((image, index) => {
        image.style.cursor = 'zoom-in';
        image.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(index);
        });
    });

    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = lightbox.getBoundingClientRect();
        const clickX = e.clientX - rect.left;

        if (clickX > rect.width / 2) {
            // Próxima imagem com loop
            showImage(currentIndex + 1);
        } else {
            // Imagem anterior com loop
            showImage(currentIndex - 1);
        }
    });

    // ====================
    // SLIDESHOW AUTOMÁTICO
    // ====================
    const gallerySlides = document.querySelectorAll('.gallery__slide');
    let autoIndex = 0;

    function autoSlideShow() {
        gallerySlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === autoIndex);
        });

        autoIndex = (autoIndex + 1) % gallerySlides.length;
    }

    // Inicia o slideshow automático
    setInterval(autoSlideShow, 3000); // Troca a cada 3 segundos
});


