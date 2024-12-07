// script.js
document.getElementById("calcularBtn").addEventListener("click", calcularAreaYCosto);

function calcularAreaYCosto() {
    const altura = parseFloat(document.getElementById("altura").value);
    const perimetro = parseFloat(document.getElementById("perimetro").value);
    const largo = parseFloat(document.getElementById("largo").value);
    const ancho = parseFloat(document.getElementById("ancho").value);

    if (altura && perimetro && largo && ancho) {
        const areaMuros = altura * perimetro;
        const areaTecho = largo * ancho;
        const areaTotal = areaMuros + areaTecho;
        const costo = areaTotal * 15000;

        // Mostrar resultados
        const resultadosDiv = document.getElementById("areasCalculadas");
        resultadosDiv.innerHTML = `
            <p>Área de Muros: ${areaMuros.toFixed(2)} m²</p>
            <p>Área de Techo: ${areaTecho.toFixed(2)} m²</p>
            <p>Área Total: ${areaTotal.toFixed(2)} m²</p>
        `;
        document.getElementById("costoTotal").innerHTML = `<p>Costo Total con pintura tipo 1: $${costo.toFixed(2)}</p>`;
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

document.getElementById("generarPDF").addEventListener("click", generarPDF);

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Obtener información ingresada por el usuario
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const whatsapp = document.getElementById("whatsapp").value;
    const resultadosDiv = document.getElementById("areasCalculadas").innerText;
    const costoTotal = document.getElementById("costoTotal").innerText;

    if (!nombre || !email || !whatsapp || !resultadosDiv || !costoTotal) {
        alert("Por favor, completa todos los campos y calcula el área antes de generar el PDF.");
        return;
    }

    // Agregar contenido al PDF
    pdf.text("Cotización de Servicios de Pintura", 10, 10);
    pdf.text(`Nombre: ${nombre}`, 10, 20);
    pdf.text(`Email: ${email}`, 10, 30);
    pdf.text(`WhatsApp: ${whatsapp}`, 10, 40);
    pdf.text("Detalles de la Cotización:", 10, 50);
    pdf.text(resultadosDiv, 10, 60);
    pdf.text(costoTotal, 10, 70);

    // Guardar el PDF en el navegador
    pdf.save("Cotizacion_Servicio_Pintura.pdf");
}
