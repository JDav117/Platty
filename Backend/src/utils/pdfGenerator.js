const PDFDocument = require('pdfkit');

const generateMonthlyReportPDF = async ({ mes, anio, usuarios, recetas, comentarios }) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    doc.fontSize(22).font('Helvetica-Bold').text('Platty', { align: 'center' });
    doc.fontSize(14).font('Helvetica').text(`Reporte Mensual - ${meses[mes - 1]} ${anio}`, { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(14).font('Helvetica-Bold').text('Resumen General');
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total de usuarios registrados: ${usuarios.total}`);
    doc.text(`Nuevos usuarios en el mes: ${usuarios.nuevos}`);
    doc.text(`Total de recetas publicadas: ${recetas.total}`);
    doc.text(`Nuevas recetas en el mes: ${recetas.nuevas}`);
    doc.text(`Total de comentarios: ${comentarios.total}`);
    doc.text(`Nuevos comentarios en el mes: ${comentarios.nuevos}`);
    doc.moveDown(2);

    doc.fontSize(14).font('Helvetica-Bold').text('Top 5 Recetas Mejor Calificadas');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    if (recetas.topRecetas && recetas.topRecetas.length > 0) {
      recetas.topRecetas.forEach((r, i) => {
        doc.text(`${i + 1}. ${r.titulo} - ${r.avg_rating} estrellas (${r.total_ratings} votos)`);
      });
    } else {
      doc.text('No hay recetas con calificaciones este mes.');
    }
    doc.moveDown(2);

    doc.fontSize(14).font('Helvetica-Bold').text('Top 5 Usuarios Más Activos');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    if (usuarios.topUsuarios && usuarios.topUsuarios.length > 0) {
      usuarios.topUsuarios.forEach((u, i) => {
        doc.text(`${i + 1}. ${u.nombre_completo} - ${u.total_recetas} recetas`);
      });
    } else {
      doc.text('No hay datos de actividad este mes.');
    }

    doc.moveDown(3);
    doc.fontSize(8).font('Helvetica').fillColor('#999');
    doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });

    doc.end();
  });
};

module.exports = { generateMonthlyReportPDF };
