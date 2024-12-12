// Seleccionar elementos del DOM
const form = document.getElementById('paintForm');
const calculateButton = document.getElementById('calculateButton');
const totalAreaElement = document.getElementById('totalArea');
const totalCostElement = document.getElementById('totalCost');
const downloadPdfButton = document.getElementById('downloadPdf');

// Función para calcular el área total y el costo
calculateButton.addEventListener('click', () => {
    const wallHeight = parseFloat(document.getElementById('wallHeight').value);
    const wallPerimeter = parseFloat(document.getElementById('wallPerimeter').value);
    const floorLength = parseFloat(document.getElementById('floorLength').value);
    const floorWidth = parseFloat(document.getElementById('floorWidth').value);

    // Validar datos
    if (isNaN(wallHeight) || isNaN(wallPerimeter) || isNaN(floorLength) || isNaN(floorWidth)) {
        alert('Por favor, complete todos los campos con valores válidos.');
        return;
    }

    const wallArea = wallHeight * wallPerimeter;
    const ceilingArea = floorLength * floorWidth;
    const totalArea = wallArea + ceilingArea;
    const totalCost = totalArea * 15000;

    // Mostrar resultados
    totalAreaElement.textContent = `Área total a pintar: ${totalArea.toFixed(2)} m²`;
    totalCostElement.textContent = `Costo total del servicio: $${totalCost.toLocaleString('es-CO')}`;

    // Enviar correo con la información del cliente y el cálculo
    sendEmail({
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        whatsapp: document.getElementById('whatsapp').value,
        totalArea: totalArea.toFixed(2),
        totalCost: totalCost.toLocaleString('es-CO')
    });
});

// Función para enviar correo
// Inicializar EmailJS con tu User ID
emailjs.init("rqV0bIDtzcmEdSuok"); // Reemplaza 'your_user_id' por tu ID de usuario de EmailJS

function sendEmail(clientData) {
    emailjs.send("service_kgg6sj2", "template_tp4l4j1", {
        name: clientData.name,
        email: clientData.email,
        whatsapp: clientData.whatsapp,
        totalArea: clientData.totalArea,
        totalCost: clientData.totalCost
    })
    .then(() => {
        alert('Correo enviado exitosamente.');
    })
    .catch((error) => {
        console.error('Error al enviar el correo:', error);
        alert('Hubo un error al enviar el correo. Por favor, revisa la configuración o intenta de nuevo.');
    });
}


// Función para generar y descargar PDF
downloadPdfButton.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const totalArea = totalAreaElement.textContent;
    const totalCost = totalCostElement.textContent;

    if (!name || !email || !whatsapp) {
        alert('Por favor, complete la información del cliente antes de generar el PDF.');
        return;
    }

    // Crear un documento PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text('Información del cliente:', 10, 10);
    doc.text(`Nombre: ${name}`, 10, 20);
    doc.text(`Email: ${email}`, 10, 30);
    doc.text(`WhatsApp: ${whatsapp}`, 10, 40);
    doc.text(totalArea, 10, 50);
    doc.text(totalCost, 10, 60);

    // Descargar el PDF
    doc.save('Cálculo_Servicio_Pintura.pdf');
});

