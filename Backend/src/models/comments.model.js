const { getClient } = require('../config/db');

const CommentsModel = {
  findByReceta: async (recetaId, { page = 1, limit = 10 }) => {
    const supabase = getClient();
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('comentarios')
      .select('*', { count: 'exact' })
      .eq('receta_id', recetaId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;

    const comentarioIds = data.map((c) => c.id);
    let respuestas = [];
    if (comentarioIds.length > 0) {
      const { data: replies, error: repliesError } = await supabase
        .from('comentarios')
        .select('*')
        .in('parent_id', comentarioIds)
        .order('created_at', { ascending: true });
      if (repliesError) throw repliesError;
      respuestas = replies || [];
    }

    const userIds = new Set();
    data.forEach((c) => userIds.add(c.usuario_id));
    respuestas.forEach((r) => userIds.add(r.usuario_id));

    const { data: usuarios, error: userError } = await supabase
      .from('usuarios')
      .select('id, nombre1, apellido1, avatar_url')
      .in('id', [...userIds]);
    if (userError) throw userError;

    const userMap = {};
    (usuarios || []).forEach((u) => { userMap[u.id] = u; });

    const mapComment = (c) => ({
      id: c.id,
      contenido: c.contenido,
      created_at: c.created_at,
      updated_at: c.updated_at,
      usuario: userMap[c.usuario_id] || { id: c.usuario_id },
      respuestas: respuestas.filter((r) => r.parent_id === c.id).map((r) => ({
        id: r.id,
        contenido: r.contenido,
        created_at: r.created_at,
        updated_at: r.updated_at,
        usuario: userMap[r.usuario_id] || { id: r.usuario_id },
        parent_id: r.parent_id,
      })),
    });

    return { data: data.map(mapComment), total: count || 0, page, limit };
  },

  create: async (data) => {
    const supabase = getClient();
    const { data: result, error } = await supabase
      .from('comentarios')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  update: async (id, contenido) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('comentarios')
      .update({ contenido, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const supabase = getClient();
    const { error } = await supabase
      .from('comentarios')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  findById: async (id) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('comentarios')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  },

  isOwner: async (id, usuarioId) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('comentarios')
      .select('usuario_id')
      .eq('id', id)
      .single();
    if (error || !data) return false;
    return data.usuario_id === usuarioId;
  },
};

module.exports = CommentsModel;
