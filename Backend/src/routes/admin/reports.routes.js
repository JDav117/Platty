const express = require('express');
const router = express.Router();
const isAdmin = require('../../middlewares/isAdmin');
const { getClient } = require('../../config/db');
const { generateMonthlyReportPDF } = require('../../utils/pdfGenerator');
const { generateMonthlyReportExcel } = require('../../utils/excelGenerator');

router.get('/:mes/:anio', isAdmin, async (req, res) => {
  try {
    const { mes, anio } = req.params;
    const supabase = getClient();

    const inicio = new Date(anio, mes - 1, 1).toISOString();
    const fin = new Date(anio, mes, 0, 23, 59, 59).toISOString();

    const { count: totalUsuarios } = await supabase
      .from('usuarios').select('*', { count: 'exact', head: true });
    const { count: totalRecetas } = await supabase
      .from('recetas').select('*', { count: 'exact', head: true });
    const { count: totalComentarios } = await supabase
      .from('comentarios').select('*', { count: 'exact', head: true });

    const { count: nuevosUsuarios } = await supabase
      .from('usuarios').select('*', { count: 'exact', head: true })
      .gte('created_at', inicio).lte('created_at', fin);
    const { count: nuevasRecetas } = await supabase
      .from('recetas').select('*', { count: 'exact', head: true })
      .gte('created_at', inicio).lte('created_at', fin);
    const { count: nuevosComentarios } = await supabase
      .from('comentarios').select('*', { count: 'exact', head: true })
      .gte('created_at', inicio).lte('created_at', fin);

    const { data: topRecetas } = await supabase
      .from('recetas_stats')
      .select('titulo, avg_rating, total_ratings')
      .order('avg_rating', { ascending: false })
      .limit(5);

    const { data: topUsuariosData } = await supabase
      .from('usuarios')
      .select('id, nombre1, apellido1');

    const topUsuarios = await Promise.all(
      (topUsuariosData || []).map(async (u) => {
        const { count } = await supabase
          .from('recetas')
          .select('*', { count: 'exact', head: true })
          .eq('usuario_id', u.id);
        return { nombre_completo: `${u.nombre1} ${u.apellido1}`, total_recetas: count || 0 };
      })
    );

    const reportData = {
      mes: parseInt(mes),
      anio: parseInt(anio),
      usuarios: {
        total: totalUsuarios || 0,
        nuevos: nuevosUsuarios || 0,
        topUsuarios: topUsuarios.sort((a, b) => b.total_recetas - a.total_recetas).slice(0, 5),
      },
      recetas: {
        total: totalRecetas || 0,
        nuevas: nuevasRecetas || 0,
        topRecetas: topRecetas || [],
      },
      comentarios: {
        total: totalComentarios || 0,
        nuevos: nuevosComentarios || 0,
      },
    };

    const format = req.query.format || 'json';

    if (format === 'pdf') {
      const pdfBuffer = await generateMonthlyReportPDF(reportData);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-${mes}-${anio}.pdf`);
      return res.send(pdfBuffer);
    }

    if (format === 'excel') {
      const excelBuffer = await generateMonthlyReportExcel(reportData);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-${mes}-${anio}.xlsx`);
      return res.send(Buffer.from(excelBuffer));
    }

    res.json({ success: true, data: reportData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al generar reporte', error: error.message });
  }
});

module.exports = router;
