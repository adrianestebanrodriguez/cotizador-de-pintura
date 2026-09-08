// Seleccionar elementos del DOM
const form = document.getElementById('paintForm');
const calculateButton = document.getElementById('calculateButton');
const totalAreaElement = document.getElementById('totalArea');
const totalCostElement = document.getElementById('totalCost');
const downloadPdfButton = document.getElementById('downloadPdf');

// Constantes de validación para rangos razonables
const VALIDATION_RANGES = {
    wallHeight: { min: 0.5, max: 20, name: 'altura de los muros' },
    wallPerimeter: { min: 1, max: 500, name: 'perímetro de los muros' },
    floorLength: { min: 1, max: 100, name: 'largo del piso' },
    floorWidth: { min: 1, max: 100, name: 'ancho del piso' }
};

// Función para calcular el área total y el costo
calculateButton.addEventListener('click', () => {
    // Aplicar rate limiting
    if (!RateLimiter.canProceed()) {
        return;
    }
    
    const wallHeight = parseFloat(document.getElementById('wallHeight').value);
    const wallPerimeter = parseFloat(document.getElementById('wallPerimeter').value);
    const floorLength = parseFloat(document.getElementById('floorLength').value);
    const floorWidth = parseFloat(document.getElementById('floorWidth').value);

    // Validar que todos los campos tengan valores
    if (isNaN(wallHeight) || isNaN(wallPerimeter) || isNaN(floorLength) || isNaN(floorWidth)) {
        alert('Por favor, complete todos los campos con valores válidos.');
        return;
    }

    // Validar rangos razonables para prevenir datos erróneos o maliciosos
    for (const [field, range] of Object.entries(VALIDATION_RANGES)) {
        const value = field === 'wallHeight' ? wallHeight : 
                      field === 'wallPerimeter' ? wallPerimeter :
                      field === 'floorLength' ? floorLength : floorWidth;
        
        if (!validateNumericRange(value, range.min, range.max, range.name)) {
            return;
        }
    }

    const wallArea = wallHeight * wallPerimeter;
    const ceilingArea = floorLength * floorWidth;
    const totalArea = wallArea + ceilingArea;
    const totalCost = totalArea * 15000;

    // Mostrar resultados sanitizados
    totalAreaElement.textContent = `Área total a pintar: ${totalArea.toFixed(2)} m²`;
    totalCostElement.textContent = `Costo total del servicio: $${totalCost.toLocaleString('es-CO')}`;

    // Obtener y sanitizar datos del cliente
    const clientData = {
        name: sanitizeInput(document.getElementById('name').value),
        email: sanitizeInput(document.getElementById('email').value),
        whatsapp: sanitizeInput(document.getElementById('whatsapp').value),
        totalArea: totalArea.toFixed(2),
        totalCost: totalCost.toLocaleString('es-CO')
    };

    // Enviar correo con la información del cliente y el cálculo
    sendEmail(clientData);
    
    // Registrar el envío para rate limiting
    RateLimiter.recordSend();
});

// Función para enviar correo
function sendEmail(clientData) {
    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, {
        name: clientData.name,
        email: clientData.email,
        whatsapp: clientData.whatsapp,
        totalArea: clientData.totalArea,
        totalCost: clientData.totalCost
    })
    .then(() => {
        console.log('Correo enviado exitosamente.');
    })
    .catch((error) => {
        console.error('Error al enviar el correo:', error);
        alert('Hubo un error al enviar el correo. Por favor, revisa la configuración o intenta de nuevo.');
    });
}


// Función para generar y descargar PDF con datos sanitizados
downloadPdfButton.addEventListener('click', () => {
    // Obtener y sanitizar datos
    const name = sanitizeInput(document.getElementById('name').value);
    const email = sanitizeInput(document.getElementById('email').value);
    const whatsapp = sanitizeInput(document.getElementById('whatsapp').value);
    const totalArea = totalAreaElement.textContent;
    const totalCost = totalCostElement.textContent;

    if (!name || !email || !whatsapp) {
        alert('Por favor, complete la información del cliente antes de generar el PDF.');
        return;
    }

    // Crear un documento PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurar fuente segura
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    // Agregar contenido sanitizado al PDF
    doc.text('Información del cliente:', 10, 10);
    doc.text(`Nombre: ${name}`, 10, 20);
    doc.text(`Email: ${email}`, 10, 30);
    doc.text(`WhatsApp: ${whatsapp}`, 10, 40);
    doc.text(totalArea, 10, 50);
    doc.text(totalCost, 10, 60);
    
    // Agregar nota de seguridad
    doc.setFontSize(8);
    doc.text('Documento generado localmente. Valores aproximados.', 10, 70);

    // Descargar el PDF
    doc.save('Cálculo_Servicio_Pintura.pdf');
});

