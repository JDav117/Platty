const express = require('express');
const router = express.Router();
const isAdmin = require('../../middlewares/isAdmin');
const { getClient } = require('../../config/db');

router.get('/', isAdmin, async (req, res) => {
  try {
    const supabase = getClient();

    const { count: totalUsuarios } = await supabase
      .from('usuarios').select('*', { count: 'exact', head: true });
    const { count: totalRecetas } = await supabase
      .from('recetas').select('*', { count: 'exact', head: true });
    const { count: totalComentarios } = await supabase
      .from('comentarios').select('*', { count: 'exact', head: true });
    const { count: totalCategorias } = await supabase
      .from('categorias').select('*', { count: 'exact', head: true });

    const { data: usuariosPorMes } = await supabase
      .rpc('get_monthly_counts', { tabla: 'usuarios' });

    const { data: recetasPorMes } = await supabase
      .rpc('get_monthly_counts', { tabla: 'recetas' });

    const { data: topRecetas } = await supabase
      .from('recetas_stats')
      .select('id, titulo, slug, avg_rating, total_ratings')
      .order('avg_rating', { ascending: false })
      .limit(10);

    const { data: topUsuarios } = await supabase
      .from('usuarios')
      .select('id, nombre1, apellido1, avatar_url');

    const usuariosConRecetas = await Promise.all(
      (topUsuarios || []).map(async (u) => {
        const { count } = await supabase
          .from('recetas')
          .select('*', { count: 'exact', head: true })
          .eq('usuario_id', u.id);
        return { ...u, total_recetas: count || 0 };
      })
    );

    res.json({
      success: true,
      data: {
        resumen: {
          totalUsuarios: totalUsuarios || 0,
          totalRecetas: totalRecetas || 0,
          totalComentarios: totalComentarios || 0,
          totalCategorias: totalCategorias || 0,
        },
        graficas: {
          usuariosPorMes: usuariosPorMes || [],
          recetasPorMes: recetasPorMes || [],
        },
        topRecetas: topRecetas || [],
        topUsuarios: usuariosConRecetas.sort((a, b) => b.total_recetas - a.total_recetas).slice(0, 5),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener datos del dashboard', error: error.message });
  }
});

module.exports = router;
