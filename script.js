// Gestion du carousel moderne avec transitions fluides
class ModernCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.image-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.autoPlayInterval = null;
        this.isTransitioning = false;
        
        // Éléments de texte pour les descriptions dynamiques
        this.badgeText = document.querySelector('.badge-text');
        this.heroTitle = document.querySelector('.hero-title');
        this.heroDescription = document.querySelector('.hero-description');
        
        // Charger les données du carousel
        this.carouselData = this.loadCarouselData();
        
        // Initialiser l'effet de typing text
        this.typingEffect = new TypingTextEffect();
        
        this.init();
    }
    
    loadCarouselData() {
        try {
            const dataElement = document.getElementById('carousel-data');
            if (dataElement) {
                return JSON.parse(dataElement.textContent);
            }
        } catch (error) {
            console.warn('Erreur lors du chargement des données du carousel:', error);
        }
        
        // Données par défaut si le chargement échoue
        return {
            slides: [
                {
                    badge: "🚀 Équipe Créative",
                    title: "Nous créons des expériences digitales exceptionnelles",
                    description: "Une équipe de 5 passionnés spécialisés en design, développement et innovation. Nous transformons vos idées en réalité."
                },
                {
                    badge: "💡 Innovation Continue",
                    title: "Design & Développement de pointe",
                    description: "Nous combinons créativité et technologie pour créer des solutions innovantes qui transforment votre vision en réalité digitale."
                },
                {
                    badge: "🎯 Excellence Technique",
                    title: "Solutions sur mesure pour votre succès",
                    description: "Chaque projet est une opportunité d'exceller. Notre expertise technique et notre approche créative garantissent des résultats exceptionnels."
                }
            ]
        };
    }
    
    init() {
        // Ajouter les événements
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Ajouter les événements pour les indicateurs
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Démarrer l'autoplay
        this.startAutoPlay();
        
        // Pause sur hover avec délai
        const carouselContainer = document.querySelector('.carousel-container');
        let hoverTimeout;
        
        carouselContainer.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            this.stopAutoPlay();
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => this.startAutoPlay(), 1000);
        });
        
        // Navigation au clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
    
    async goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.isTransitioning = true;
        
        // Masquer la slide actuelle
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');
        
        // Mettre à jour l'index
        this.currentSlide = index;
        
        // Mettre à jour le texte de la description
        this.updateSlideText(index);
        
        // Afficher la nouvelle slide avec délai pour l'animation
        await this.delay(100);
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
        
        // Réinitialiser le flag après l'animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }
    
    updateSlideText(index) {
        if (this.carouselData && this.carouselData.slides && this.carouselData.slides[index]) {
            const slideData = this.carouselData.slides[index];
            
            // Mettre à jour le badge avec animation
            if (this.badgeText) {
                this.badgeText.style.opacity = '0';
                setTimeout(() => {
                    this.badgeText.textContent = slideData.badge;
                    this.badgeText.style.opacity = '1';
                }, 150);
            }
            
            // Mettre à jour le titre avec effet de typing text
            if (this.heroTitle && this.typingEffect) {
                this.typingEffect.typeText(this.heroTitle, slideData.title, 50);
            }
            
            // Mettre à jour la description avec animation
            if (this.heroDescription) {
                this.heroDescription.style.opacity = '0';
                setTimeout(() => {
                    this.heroDescription.textContent = slideData.description;
                    this.heroDescription.style.opacity = '1';
                }, 450);
            }
        }
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 6000); // Change de slide toutes les 6 secondes
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Effet de typing text pour les titres du carousel
class TypingTextEffect {
    constructor() {
        this.isTyping = false;
        this.currentInterval = null;
    }
    
    typeText(element, text, speed = 50) {
        if (this.isTyping) {
            // Si déjà en train de taper, arrêter et recommencer
            this.stopTyping();
            setTimeout(() => this.startTyping(element, text, speed), 100);
        } else {
            this.startTyping(element, text, speed);
        }
    }
    
    startTyping(element, text, speed) {
        this.isTyping = true;
        element.style.opacity = '1';
        element.textContent = '';
        
        // Ajouter la classe pour le curseur
        element.classList.add('typing');
        
        let i = 0;
        this.currentInterval = setInterval(() => {
            if (!this.isTyping) {
                clearInterval(this.currentInterval);
                return;
            }
            
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(this.currentInterval);
                this.isTyping = false;
                // Retirer la classe pour masquer le curseur
                setTimeout(() => {
                    element.classList.remove('typing');
                }, 1000);
            }
        }, speed);
    }
    
    stopTyping() {
        this.isTyping = false;
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = null;
        }
    }
}

// Animations au scroll avancées avec Intersection Observer
class AdvancedScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);
        
        // Observer tous les éléments à animer
        const elementsToAnimate = document.querySelectorAll('.team-member, .project-card, .skill-item, .contact-item');
        elementsToAnimate.forEach((el, index) => {
            observer.observe(el);
            // Ajouter un délai progressif
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    }
    
    animateElement(element) {
        element.classList.add('animate-in');
        
        // Ajouter des animations spécifiques selon le type d'élément
        if (element.classList.contains('team-member')) {
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        } else if (element.classList.contains('project-card')) {
            element.style.animation = 'slideInLeft 0.8s ease-out forwards';
        } else if (element.classList.contains('skill-item')) {
            element.style.animation = 'slideInRight 0.8s ease-out forwards';
        }
    }
}

// Navigation fluide et moderne
class ModernNavigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }
    
    init() {
        // Navigation fluide
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Fermer le menu mobile si ouvert
                    this.closeMobileMenu();
                }
            });
        });
        
        // Menu mobile
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Effet de scroll sur la navbar
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Fermer le menu au clic en dehors
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
    }
    
    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
    }
    
    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
}

// Formulaire de contact moderne avec validation avancée
class ModernContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.submitBtn = this.form.querySelector('.submit-btn');
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validation en temps réel
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Supprimer les erreurs précédentes
        this.clearFieldError(field);
        
        // Validation spécifique selon le type
        switch (field.type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Veuillez entrer une adresse email valide';
                }
                break;
            case 'text':
                if (field.id === 'name' && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Le nom doit contenir au moins 2 caractères';
                }
                if (field.id === 'subject' && value.length < 5) {
                    isValid = false;
                    errorMessage = 'Le sujet doit contenir au moins 5 caractères';
                }
                break;
            case 'textarea':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Le message doit contenir au moins 10 caractères';
                }
                break;
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #dc2626;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            font-weight: 500;
        `;
        
        field.parentNode.appendChild(errorElement);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Valider tous les champs
        const inputs = this.form.querySelectorAll('input, textarea');
        let allValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });
        
        if (!allValid) return;
        
        // Désactiver le bouton et montrer le chargement
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        
        try {
            // Simulation d'envoi avec délai
            await this.delay(2000);
            
            this.showMessage('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
            this.form.reset();
            
        } catch (error) {
            this.showMessage('Une erreur est survenue. Veuillez réessayer.', 'error');
        } finally {
            // Réactiver le bouton
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<span>Envoyer le message</span><i class="fas fa-paper-plane"></i>';
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showMessage(text, type) {
        // Supprimer les messages existants
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Créer le nouveau message
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${text}</span>
        `;
        
        // Ajouter les styles
        message.style.cssText = `
            padding: 1rem 1.5rem;
            margin-top: 1rem;
            border-radius: 12px;
            font-weight: 500;
            text-align: center;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: fadeInUp 0.3s ease-out;
            ${type === 'success' ? 
                'background: #dcfce7; color: #166534; border: 1px solid #22c55e;' : 
                'background: #fef2f2; color: #991b1b; border: 1px solid #ef4444;'
            }
        `;
        
        this.form.appendChild(message);
        
        // Supprimer le message après 6 secondes
        setTimeout(() => {
            message.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => message.remove(), 300);
        }, 6000);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Animation des statistiques avec compteur progressif
class StatsCounter {
    constructor() {
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStats();
                }
            });
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }
    
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 secondes
            const increment = target / (duration / 16); // 60 FPS
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }
}

// Effet de parallaxe moderne
class ModernParallax {
    constructor() {
        this.init();
    }
    
    init() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-section, .team-member, .project-card');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.3 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick);
    }
}

// Gestionnaire de thème et préférences
class ThemeManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Détecter la préférence de thème système
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        }
        
        // Écouter les changements de thème système
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        });
    }
}

// Gestionnaire de performance et lazy loading
class PerformanceManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy loading des images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
        
        // Préchargement des ressources critiques
        this.preloadCriticalResources();
    }
    
    preloadCriticalResources() {
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser toutes les classes
    new ModernCarousel();
    new AdvancedScrollAnimations();
    new ModernNavigation();
    new ModernContactForm();
    new StatsCounter();
    new ModernParallax();
    new ThemeManager();
    new PerformanceManager();
    
    // Ajouter des classes CSS pour les animations
    document.body.classList.add('loaded');
    
    // Animation d'entrée de la page
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);
});

// Ajouter des styles CSS pour les animations et états
const modernStyles = `
    /* États de chargement */
    body:not(.loaded) .hero-section {
        opacity: 0;
    }
    
    body.loaded .hero-section {
        animation: fadeInUp 1s ease-out;
    }
    
    /* Animations des éléments */
    .team-member, .project-card, .skill-item, .contact-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .team-member.animate-in, .project-card.animate-in, .skill-item.animate-in, .contact-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Délais progressifs */
    .team-member:nth-child(1) { transition-delay: 0.1s; }
    .team-member:nth-child(2) { transition-delay: 0.2s; }
    .team-member:nth-child(3) { transition-delay: 0.3s; }
    .team-member:nth-child(4) { transition-delay: 0.4s; }
    .team-member:nth-child(5) { transition-delay: 0.5s; }
    
    .project-card:nth-child(1) { transition-delay: 0.1s; }
    .project-card:nth-child(2) { transition-delay: 0.2s; }
    .project-card:nth-child(3) { transition-delay: 0.3s; }
    
    /* Navigation mobile */
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        padding: 1rem;
        box-shadow: var(--shadow-lg);
        border-radius: 0 0 16px 16px;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    /* États de la navbar */
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: var(--shadow-md);
    }
    
    /* Animations des boutons */
    .cta-button {
        position: relative;
        overflow: hidden;
    }
    
    .cta-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }
    
    .cta-button:hover::before {
        left: 100%;
    }
    
    /* États des formulaires */
    .contact-form input.error,
    .contact-form textarea.error {
        border-color: #dc2626;
        background: #fef2f2;
    }
    
    /* Animations des cartes */
    .team-member:hover .member-photo img {
        transform: scale(1.05) rotate(1deg);
    }
    
    .project-card:hover .project-image img {
        transform: scale(1.05) rotate(-1deg);
    }
    
    /* Effet de grain sur le hero */
    .hero-section::before {
        animation: grain 20s linear infinite;
    }
    
    @keyframes grain {
        0%, 100% { transform: translate(0, 0); }
        10% { transform: translate(-5%, -5%); }
        20% { transform: translate(-10%, 5%); }
        30% { transform: translate(5%, -10%); }
        40% { transform: translate(-5%, 15%); }
        50% { transform: translate(-10%, 5%); }
        60% { transform: translate(15%, 0%); }
        70% { transform: translate(0%, 10%); }
        80% { transform: translate(3%, 15%); }
        90% { transform: translate(-10%, 10%); }
    }
    
    /* Animations d'entrée */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
    
    /* Responsive pour mobile */
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
        
        .nav-menu.active {
            display: flex;
        }
    }
`;

// Injecter les styles modernes
const styleSheet = document.createElement('style');
styleSheet.textContent = modernStyles;
document.head.appendChild(styleSheet);
