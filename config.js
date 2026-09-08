// Configuración de EmailJS
// NOTA: Para uso local, las credenciales están aquí. 
// En producción deberían estar en un servidor backend
const EMAILJS_CONFIG = {
    USER_ID: "rqV0bIDtzcmEdSuok",
    SERVICE_ID: "service_kgg6sj2",
    TEMPLATE_ID: "template_tp4l4j1"
};

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.USER_ID);

// Función de sanitización para prevenir XSS
function sanitizeInput(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Validar que los datos numéricos estén en rangos razonables
function validateNumericRange(value, min, max, fieldName) {
    if (value < min || value > max) {
        alert(`El valor de ${fieldName} debe estar entre ${min} y ${max}.`);
        return false;
    }
    return true;
}

// Rate limiting simple para prevenir abuso
const RateLimiter = {
    lastSendTime: 0,
    minInterval: 30000, // 30 segundos entre envíos
    clickCount: 0,
    clickWindow: 60000, // Ventana de 1 minuto
    maxClicks: 5, // Máximo 5 clicks por minuto
    
    canProceed() {
        const now = Date.now();
        
        // Resetear contador si pasó la ventana de tiempo
        if (now - this.clickWindowStart > this.clickWindow) {
            this.clickCount = 0;
            this.clickWindowStart = now;
        }
        
        // Verificar límite de clicks
        if (this.clickCount >= this.maxClicks) {
            alert('Demasiadas solicitudes. Por favor espere un momento.');
            return false;
        }
        
        // Verificar intervalo mínimo entre envíos
        if (now - this.lastSendTime < this.minInterval) {
            const remaining = Math.ceil((this.minInterval - (now - this.lastSendTime)) / 1000);
            alert(`Por favor espere ${remaining} segundos antes de enviar otro cálculo.`);
            return false;
        }
        
        this.clickCount++;
        if (!this.clickWindowStart) this.clickWindowStart = now;
        return true;
    },
    
    recordSend() {
        this.lastSendTime = Date.now();
    }
};
