const ExcelJS = require('exceljs');

const generateMonthlyReportExcel = async ({ mes, anio, usuarios, recetas, comentarios }) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Platty';
  workbook.created = new Date();

  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  const sheet = workbook.addWorksheet(`Reporte ${meses[mes - 1]} ${anio}`);

  sheet.columns = [
    { header: 'Métrica', key: 'metrica', width: 35 },
    { header: 'Total', key: 'total', width: 15 },
    { header: 'Nuevos este mes', key: 'nuevos', width: 18 },
  ];

  sheet.addRow({ metrica: 'Usuarios', total: usuarios.total, nuevos: usuarios.nuevos });
  sheet.addRow({ metrica: 'Recetas', total: recetas.total, nuevos: recetas.nuevas });
  sheet.addRow({ metrica: 'Comentarios', total: comentarios.total, nuevos: comentarios.nuevos });

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEC021' } };

  if (recetas.topRecetas && recetas.topRecetas.length > 0) {
    const sheetRecetas = workbook.addWorksheet('Top Recetas');
    sheetRecetas.columns = [
      { header: '#', key: 'pos', width: 5 },
      { header: 'Título', key: 'titulo', width: 40 },
      { header: 'Calificación', key: 'rating', width: 15 },
      { header: 'Votos', key: 'votos', width: 10 },
    ];

    recetas.topRecetas.forEach((r, i) => {
      sheetRecetas.addRow({ pos: i + 1, titulo: r.titulo, rating: r.avg_rating, votos: r.total_ratings });
    });

    sheetRecetas.getRow(1).font = { bold: true };
  }

  if (usuarios.topUsuarios && usuarios.topUsuarios.length > 0) {
    const sheetUsuarios = workbook.addWorksheet('Top Usuarios');
    sheetUsuarios.columns = [
      { header: '#', key: 'pos', width: 5 },
      { header: 'Nombre', key: 'nombre', width: 40 },
      { header: 'Recetas', key: 'recetas', width: 12 },
    ];

    usuarios.topUsuarios.forEach((u, i) => {
      sheetUsuarios.addRow({ pos: i + 1, nombre: u.nombre_completo, recetas: u.total_recetas });
    });

    sheetUsuarios.getRow(1).font = { bold: true };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = { generateMonthlyReportExcel };
