const { getClient } = require('../config/db');

const RecipesModel = {
  findAll: async ({ page = 1, limit = 10, categoria_id, search, ordenar }) => {
    const supabase = getClient();
    const offset = (page - 1) * limit;

    let query = supabase
      .from('recetas_stats')
      .select('*', { count: 'exact' });

    if (categoria_id) {
      query = query.eq('categoria_id', categoria_id);
    }

    if (search) {
      query = query.or(`titulo.ilike.%${search}%,descripcion.ilike.%${search}%`);
    }

    if (ordenar === 'rating') {
      query = query.order('avg_rating', { ascending: false });
    } else if (ordenar === 'populares') {
      query = query.order('total_favoritos', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    let { data, error, count } = await query.range(offset, offset + limit - 1);
    if (error) throw error;

    if (data && data.length > 0) {
      const ids = data.map(r => r.id);
      const { data: imagenes, error: imgErr } = await supabase
        .from('recetas_imagenes')
        .select('receta_id, url, orden')
        .in('receta_id', ids)
        .order('orden', { ascending: true });
      if (!imgErr && imagenes) {
        const imgMap = {};
        imagenes.forEach(img => {
          if (!imgMap[img.receta_id]) imgMap[img.receta_id] = [];
          imgMap[img.receta_id].push({ url: img.url, orden: img.orden });
        });
        data = data.map(r => ({ ...r, imagenes: imgMap[r.id] || [] }));
      }
    }

    return { data, total: count || 0, page, limit };
  },

  findById: async (id) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('recetas_stats')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    const { data: imagenes } = await supabase
      .from('recetas_imagenes')
      .select('*')
      .eq('receta_id', id)
      .order('orden', { ascending: true });
    return { ...data, imagenes: imagenes || [] };
  },

  findBySlug: async (slug) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('recetas_stats')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    const { data: imagenes } = await supabase
      .from('recetas_imagenes')
      .select('*')
      .eq('receta_id', data.id)
      .order('orden', { ascending: true });
    return { ...data, imagenes: imagenes || [] };
  },

  findByUserId: async (userId, { page = 1, limit = 10 }) => {
    const supabase = getClient();
    const offset = (page - 1) * limit;

    let { data, error, count } = await supabase
      .from('recetas_stats')
      .select('*', { count: 'exact' })
      .eq('usuario_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;

    if (data && data.length > 0) {
      const ids = data.map(r => r.id);
      const { data: imagenes, error: imgErr } = await supabase
        .from('recetas_imagenes')
        .select('receta_id, url, orden')
        .in('receta_id', ids)
        .order('orden', { ascending: true });
      if (!imgErr && imagenes) {
        const imgMap = {};
        imagenes.forEach(img => {
          if (!imgMap[img.receta_id]) imgMap[img.receta_id] = [];
          imgMap[img.receta_id].push({ url: img.url, orden: img.orden });
        });
        data = data.map(r => ({ ...r, imagenes: imgMap[r.id] || [] }));
      }
    }

    return { data, total: count || 0, page, limit };
  },

  create: async (recetaData) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('recetas')
      .insert(recetaData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, data) => {
    const supabase = getClient();
    const { data: result, error } = await supabase
      .from('recetas')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  delete: async (id) => {
    const supabase = getClient();
    const { error } = await supabase
      .from('recetas')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Imágenes de galería
  getImagenes: async (recetaId) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('recetas_imagenes')
      .select('*')
      .eq('receta_id', recetaId)
      .order('orden', { ascending: true });
    if (error) throw error;
    return data;
  },

  addImagen: async (imagenData) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('recetas_imagenes')
      .insert(imagenData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteImagenes: async (recetaId) => {
    const supabase = getClient();
    const { error } = await supabase
      .from('recetas_imagenes')
      .delete()
      .eq('receta_id', recetaId);
    if (error) throw error;
  },

  // Pasos
  getPasos: async (recetaId) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('recetas_pasos')
      .select('*')
      .eq('receta_id', recetaId)
      .order('orden', { ascending: true });
    if (error) throw error;
    return data;
  },

  setPasos: async (recetaId, pasos) => {
    const supabase = getClient();
    await supabase.from('recetas_pasos').delete().eq('receta_id', recetaId);
    if (pasos && pasos.length > 0) {
      const { error } = await supabase
        .from('recetas_pasos')
        .insert(pasos.map((p) => ({ ...p, receta_id: recetaId })));
      if (error) throw error;
    }
  },

  // Ingredientes
  getIngredientes: async (recetaId) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('recetas_ingredientes')
      .select('*')
      .eq('receta_id', recetaId)
      .order('orden', { ascending: true });
    if (error) throw error;
    return data;
  },

  setIngredientes: async (recetaId, ingredientes) => {
    const supabase = getClient();
    await supabase.from('recetas_ingredientes').delete().eq('receta_id', recetaId);
    if (ingredientes && ingredientes.length > 0) {
      const { error } = await supabase
        .from('recetas_ingredientes')
        .insert(ingredientes.map((ing, i) => ({ ...ing, receta_id: recetaId, orden: i + 1 })));
      if (error) throw error;
    }
  },

  isOwner: async (recetaId, usuarioId) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('recetas')
      .select('usuario_id')
      .eq('id', recetaId)
      .single();
    if (error || !data) return false;
    return data.usuario_id === usuarioId;
  },
};

module.exports = RecipesModel;
