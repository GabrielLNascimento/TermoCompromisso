async function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const elemento = document.getElementById('areaParaExportar');

    // Captura a área como canvas
    const canvas = await html2canvas(elemento, { scale: 2 }); // Melhor qualidade
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Dimensões da imagem (em pixels) convertidas para milímetros
    const imgWidth = pageWidth;
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Adiciona a primeira página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Adiciona páginas se necessário
    while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    // Salva o PDF
    pdf.save('termo-de-compromisso.pdf');
}
