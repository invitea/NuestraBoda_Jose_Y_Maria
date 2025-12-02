// =============================================
// CONFIGURACIÓN Y DATOS
// =============================================
const firebaseConfig = {
  apiKey: "AIzaSyCTh8kPdvu-6Z5_cckNts22VrhdUTLVspM",
  authDomain: "invitea-f7331.firebaseapp.com",
  projectId: "invitea-f7331",
  storageBucket: "invitea-f7331.firebasestorage.app",
  messagingSenderId: "145115727672",
  appId: "1:145115727672:web:d1d89c20bf946b9e2663cd",
  measurementId: "G-8JS1MDZVGQ"
};

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    caption: "Nuestra primera cita"
  },
  {
    url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    caption: "Viaje a la playa"
  },
  {
    url: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    caption: "Celebrando nuestro compromiso"
  },
  {
    url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    caption: "Celebrando con amigos"
  },
  {
    url: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    caption: "Nuestro lugar favorito"
  }
];

// =============================================
// FUNCIONES UTILITARIAS
// =============================================
const utils = {
  // Pre-cargar imágenes
  preloadImage(url) {
    const img = new Image();
    img.src = url;
  },
  
  // Obtener fecha de mañana
  getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0); // 10:00 AM
    return tomorrow;
  },
  
  // Formatear fecha en español
  formatDateSpanish(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let formatted = date.toLocaleDateString('es-ES', options);
    return formatted.replace(/\b\w/g, l => l.toUpperCase());
  },
  
  // Validar email
  isValidEmail(email) {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Validar teléfono
  isValidPhone(phone) {
    if (!phone) return true;
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10;
  },
  
  // Formatear número de teléfono
  formatPhoneNumber(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
  },
  
  // Verificar si el email ya existe en la base de datos
  async checkEmailExists(email) {
    if (!email || !this.isValidEmail(email)) return false;
    try {
      const snapshot = await window.db.collection('mariayjose_boda')
        .where('email', '==', email.toLowerCase().trim()).get();
      return !snapshot.empty;
    } catch (error) {
      console.error('Error al verificar correo:', error);
      return false;
    }
  }
};

// =============================================
// CUENTA REGRESIVA
// =============================================
const countdown = {
  start() {
    const weddingDate = utils.getTomorrowDate();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      
      // Si ya pasó la fecha
      if (distance < 0) {
        clearInterval(timer);
        ['days','hours','minutes','seconds'].forEach(id => 
          document.getElementById(id).textContent = "00");
        document.getElementById("countdown-message").textContent = "¡El gran día ha llegado!";
        return;
      }
      
      // Calcular días, horas, minutos y segundos
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Actualizar elementos del DOM
      document.getElementById("days").textContent = days.toString().padStart(2, '0');
      document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
      document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
      document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
      
      // Actualizar mensaje según la proximidad del evento
      const messageElement = document.getElementById("countdown-message");
      if (days === 0 && hours < 24) {
        messageElement.textContent = "¡Hoy es el gran día!";
      } else if (days === 0) {
        messageElement.textContent = "¡Falta menos de un día!";
      } else if (days === 1) {
        messageElement.textContent = "¡Mañana es el gran día!";
      } else if (days < 7) {
        messageElement.textContent = "¡Ya casi es el gran día!";
      } else {
        messageElement.textContent = "¡Nos vemos pronto!";
      }
    }, 1000);
  }
};

// =============================================
// GALERÍA COVER FLOW
// =============================================
const gallery = {
  init() {
    this.track = document.getElementById('coverflowTrack');
    this.prevBtn = document.getElementById('coverflowPrev');
    this.nextBtn = document.getElementById('coverflowNext');
    this.dotsContainer = document.getElementById('coverflowDots');
    this.counter = document.getElementById('coverflowCounter');
    
    this.currentIndex = 0;
    this.totalItems = galleryImages.length;
    this.itemWidth = 200;
    this.itemSpacing = 80;
    
    this.createGalleryItems();
    this.setupEventListeners();
    this.updateCoverflow();
  },
  
  // Crear elementos de la galería
  createGalleryItems() {
    galleryImages.forEach((image, index) => {
      // Crear elemento de imagen
      const item = document.createElement('div');
      item.className = 'coverflow-item';
      item.setAttribute('data-index', index);
      
      const img = document.createElement('img');
      img.src = image.url;
      img.alt = image.caption;
      img.className = 'coverflow-image';
      img.loading = 'lazy';
      
      item.appendChild(img);
      this.track.appendChild(item);
      
      // Crear puntos de navegación
      const dot = document.createElement('div');
      dot.className = 'coverflow-dot';
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('data-index', index);
      this.dotsContainer.appendChild(dot);
      
      // Pre-cargar imagen
      utils.preloadImage(image.url);
    });
  },
  
  // Configurar event listeners
  setupEventListeners() {
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    this.dotsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('coverflow-dot')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        this.goToSlide(index);
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });
    
    // Soporte para dispositivos táctiles
    let startX = 0;
    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    this.track.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.nextSlide() : this.prevSlide();
      }
    });
  },
  
  // Actualizar la visualización del coverflow
  updateCoverflow() {
    const items = this.track.querySelectorAll('.coverflow-item');
    const dots = this.dotsContainer.querySelectorAll('.coverflow-dot');
    
    items.forEach((item, index) => {
      const position = index - this.currentIndex;
      const distance = Math.abs(position);
      
      let x = position * (this.itemWidth + this.itemSpacing);
      let scale = 1, zIndex = 1, opacity = 1, rotation = 0;
      
      // Aplicar transformaciones según la posición
      if (position === 0) {
        // Elemento central
        scale = 1.1;
        zIndex = 10;
        opacity = 1;
        rotation = 0;
        item.classList.add('active');
      } else if (distance === 1) {
        // Elementos adyacentes
        scale = 0.9;
        zIndex = 5;
        opacity = 0.8;
        rotation = position * 5;
      } else if (distance === 2) {
        // Elementos más lejanos
        scale = 0.7;
        zIndex = 3;
        opacity = 0.5;
        rotation = position * 10;
      } else {
        // Elementos más distantes
        scale = 0.5;
        zIndex = 1;
        opacity = 0.3;
        rotation = position * 15;
      }
      
      // Aplicar transformaciones
      item.style.transform = `translateX(${x}px) scale(${scale}) rotateY(${rotation}deg)`;
      item.style.zIndex = zIndex;
      item.style.opacity = opacity;
      
      if (position !== 0) item.classList.remove('active');
    });
    
    // Actualizar puntos de navegación
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
    
    // Actualizar contador
    this.counter.textContent = `${this.currentIndex + 1} / ${this.totalItems}`;
    
    // Actualizar estado de botones
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex === this.totalItems - 1;
  },
  
  // Ir a una diapositiva específica
  goToSlide(index) {
    this.currentIndex = index;
    this.updateCoverflow();
  },
  
  // Siguiente diapositiva
  nextSlide() {
    if (this.currentIndex < this.totalItems - 1) {
      this.currentIndex++;
      this.updateCoverflow();
    }
  },
  
  // Diapositiva anterior
  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCoverflow();
    }
  }
};

// =============================================
// MODAL DE GALERÍA
// =============================================
const modalGallery = {
  init(coverflow) {
    this.modal = document.getElementById('galleryModal');
    this.modalImage = document.getElementById('galleryModalImage');
    this.modalCaption = document.getElementById('galleryModalCaption');
    this.closeBtn = document.getElementById('closeGalleryModal');
    this.prevBtn = document.getElementById('modalPrev');
    this.nextBtn = document.getElementById('modalNext');
    
    this.coverflow = coverflow;
    this.currentIndex = 0;
    this.setupEventListeners();
  },
  
  // Configurar event listeners
  setupEventListeners() {
    // Abrir modal al hacer clic en una imagen
    document.addEventListener('click', (e) => {
      const coverflowItem = e.target.closest('.coverflow-item');
      if (coverflowItem) {
        const index = parseInt(coverflowItem.getAttribute('data-index'));
        this.coverflow.goToSlide(index);
        this.open(index);
      }
    });
    
    // Eventos de cierre y navegación
    this.closeBtn.addEventListener('click', () => this.close());
    this.prevBtn.addEventListener('click', () => this.prevImage());
    this.nextBtn.addEventListener('click', () => this.nextImage());
    
    // Cerrar al hacer clic fuera de la imagen
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
      if (this.modal.classList.contains('active')) {
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowLeft') this.prevImage();
        if (e.key === 'ArrowRight') this.nextImage();
      }
    });
  },
  
  // Abrir modal
  open(index) {
    const imageData = galleryImages[index];
    this.modalImage.src = imageData.url;
    this.modalCaption.textContent = imageData.caption;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.currentIndex = index;
  },
  
  // Cerrar modal
  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  },
  
  // Siguiente imagen
  nextImage() {
    if (this.currentIndex < galleryImages.length - 1) {
      this.currentIndex++;
      this.open(this.currentIndex);
      this.coverflow.goToSlide(this.currentIndex);
    }
  },
  
  // Imagen anterior
  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.open(this.currentIndex);
      this.coverflow.goToSlide(this.currentIndex);
    }
  }
};

// =============================================
// MODAL DE CONFIRMACIÓN (RSVP)
// =============================================
const rsvpModal = {
  init() {
    this.openBtn = document.getElementById('openRsvp');
    this.modal = document.getElementById('rsvpModal');
    this.closeBtn = document.getElementById('closeModalBtn');
    this.form = document.getElementById('rsvpForm');
    this.submitBtn = document.getElementById('submitBtn');
    this.loadingSpinner = document.getElementById('loadingSpinner');
    this.thankYou = document.getElementById('thankYouMessage');
    
    // Elementos de formulario
    this.nameInput = document.getElementById('name');
    this.emailInput = document.getElementById('email');
    this.phoneInput = document.getElementById('phone');
    this.adultsInput = document.getElementById('adults');
    this.childrenInput = document.getElementById('children');
    
    // Elementos de error
    this.nameError = document.getElementById('nameError');
    this.emailError = document.getElementById('emailError');
    this.emailDuplicateError = document.getElementById('emailDuplicateError');
    this.phoneError = document.getElementById('phoneError');
    this.adultsError = document.getElementById('adultsError');
    this.childrenError = document.getElementById('childrenError');
    
    this.setupEventListeners();
  },
  
  // Configurar event listeners
  setupEventListeners() {
    this.openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.open();
    });
    
    this.closeBtn.addEventListener('click', () => this.close());
    
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Validación en tiempo real
    this.phoneInput.addEventListener('input', (e) => {
      e.target.value = utils.formatPhoneNumber(e.target.value);
      this.validatePhone(e.target.value);
    });
    
    this.emailInput.addEventListener('blur', () => this.validateEmail());
    this.nameInput.addEventListener('blur', () => this.validateName());
    this.adultsInput.addEventListener('blur', () => this.validateAdults());
    this.childrenInput.addEventListener('blur', () => this.validateChildren());
  },
  
  // Abrir modal
  open() {
    this.previousFocus = document.activeElement;
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    
    // Enfocar en el primer campo después de un pequeño retraso
    setTimeout(() => {
      this.nameInput.focus();
    }, 50);
    
    document.addEventListener('keydown', this.handleKey.bind(this));
  },
  
  // Cerrar modal
  close() {
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleKey.bind(this));
    
    // Restablecer formulario después de cerrar
    setTimeout(() => {
      this.thankYou.style.display = 'none';
      this.form.style.display = '';
      this.form.reset();
      this.adultsInput.value = 1;
      this.childrenInput.value = 0;
      
      // Limpiar errores
      [this.nameError, this.emailError, this.emailDuplicateError, this.phoneError, this.adultsError, this.childrenError]
        .forEach(error => error.style.display = 'none');
      
      [this.nameInput, this.emailInput, this.phoneInput, this.adultsInput, this.childrenInput]
        .forEach(input => input.classList.remove('error', 'warning'));
      
      // Restablecer botón de envío
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = 'Enviar confirmación';
      this.loadingSpinner.style.display = 'none';
      
      // Restaurar foco
      this.previousFocus?.focus?.();
    }, 200);
  },
  
  // Manejar eventos de teclado
  handleKey(e) {
    // Cerrar con Escape
    if (e.key === 'Escape') this.close();
    
    // Manejar navegación por tabulación dentro del modal
    if (e.key === 'Tab' && this.modal.classList.contains('active')) {
      const focusableElements = this.modal.querySelectorAll('button, input, textarea, select, a[href]');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  },
  
  // Mostrar error
  showError(input, errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    input.classList.add('error');
    input.focus();
  },
  
  // Limpiar error
  clearError(input, errorElement) {
    errorElement.style.display = 'none';
    input.classList.remove('error', 'warning');
  },
  
  // Validar nombre
  validateName() {
    if (this.nameInput.value.length < 3) {
      this.showError(this.nameInput, this.nameError, 'Por favor ingresa tu nombre completo (mínimo 3 caracteres)');
      return false;
    }
    this.clearError(this.nameInput, this.nameError);
    return true;
  },
  
  // Validar email
  async validateEmail() {
    const email = this.emailInput.value.trim();
    
    if (email && !utils.isValidEmail(email)) {
      this.showError(this.emailInput, this.emailError, 'Por favor ingresa un correo electrónico válido');
      this.emailDuplicateError.style.display = 'none';
      return false;
    }
    
    if (email && utils.isValidEmail(email)) {
      const emailExists = await utils.checkEmailExists(email);
      if (emailExists) {
        this.emailDuplicateError.style.display = 'block';
        this.emailError.style.display = 'none';
        this.emailInput.classList.add('warning');
        this.emailInput.classList.remove('error');
        return false;
      } else {
        this.clearError(this.emailInput, this.emailError);
        this.emailDuplicateError.style.display = 'none';
      }
    } else {
      this.clearError(this.emailInput, this.emailError);
      this.emailDuplicateError.style.display = 'none';
    }
    return true;
  },
  
  // Validar teléfono
  validatePhone(phone) {
    if (phone && !utils.isValidPhone(phone)) {
      this.showError(this.phoneInput, this.phoneError, 'Por favor ingresa un número telefónico válido (10 dígitos)');
      return false;
    }
    this.clearError(this.phoneInput, this.phoneError);
    return true;
  },
  
  // Validar número de adultos
  validateAdults() {
    if (this.adultsInput.value < 1) {
      this.showError(this.adultsInput, this.adultsError, 'Debe haber al menos 1 adulto');
      return false;
    }
    this.clearError(this.adultsInput, this.adultsError);
    return true;
  },
  
  // Validar número de niños
  validateChildren() {
    if (this.childrenInput.value < 0) {
      this.showError(this.childrenInput, this.childrenError, 'El número de niños no puede ser negativo');
      return false;
    }
    this.clearError(this.childrenInput, this.childrenError);
    return true;
  },
  
  // Manejar envío del formulario
  async handleSubmit(e) {
    e.preventDefault();
    
    // Verificar disponibilidad de base de datos
    if (!window.db) {
      alert('Base de datos no disponible. Por favor, intenta más tarde.');
      return;
    }
    
    // Ejecutar todas las validaciones
    const validations = [
      this.validateName(),
      await this.validateEmail(),
      this.validatePhone(this.phoneInput.value),
      this.validateAdults(),
      this.validateChildren()
    ];
    
    // Si hay errores, mostrar el primero
    if (!validations.every(v => v)) {
      const firstError = this.form.querySelector('.error, .warning');
      if (firstError) firstError.focus();
      return;
    }
    
    // Preparar envío
    this.submitBtn.disabled = true;
    this.submitBtn.textContent = 'Enviando...';
    this.loadingSpinner.style.display = "block";

    // Recopilar datos del formulario
    const name = this.nameInput.value.trim();
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value;
    const adults = Number(this.adultsInput.value) || 0;
    const children = Number(this.childrenInput.value) || 0;
    const userAgent = navigator.userAgent || '';
    const screenSize = `${window.innerWidth}x${window.innerHeight}`;

    try {
      // Guardar en Firebase
      await window.db.collection('mariayjose_boda').add({
        nombre: name,
        email: email || 'No proporcionado',
        telefono: phone || 'No proporcionado',
        adultos: adults,
        ninos: children,
        dispositivo: userAgent,
        pantalla: screenSize,
        fecha: new Date().toLocaleString('es-MX'),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      // Mostrar mensaje de éxito
      this.form.style.display = 'none';
      this.thankYou.style.display = 'block';
      this.loadingSpinner.style.display = 'none';
      
      // Cerrar automáticamente después de un tiempo
      setTimeout(() => this.close(), 1800);
    } catch(err) {
      console.error('Error al guardar en Firebase:', err);
      alert('Ocurrió un error al guardar. Por favor, intenta nuevamente.');
      
      // Restablecer botón de envío
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = 'Enviar confirmación';
      this.loadingSpinner.style.display = 'none';
    }
  }
};

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Pre-cargar imagen principal
  utils.preloadImage('https://images.unsplash.com/photo-1519225421984-5157d7f14cac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80');
  
  // Configurar fecha del evento (mañana)
  const weddingDate = utils.getTomorrowDate();
  document.getElementById('dynamicDate').textContent = utils.formatDateSpanish(weddingDate);
  
  // Inicializar componentes
  countdown.start();
  gallery.init();
  modalGallery.init(gallery);
  rsvpModal.init();
  
  // Inicializar Firebase
  if (typeof firebase !== 'undefined' && firebase.initializeApp) {
    try {
      firebase.initializeApp(firebaseConfig);
      window.db = firebase.firestore();
      console.log('Firebase inicializado correctamente');
    } catch(e) {
      console.warn('Error al inicializar Firebase:', e);
    }
  } else {
    console.warn('Firebase no está disponible');
  }
});
