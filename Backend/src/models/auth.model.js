const { getClient } = require('../config/db');

const AuthModel = {
  findByEmail: async (email) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  },

  findById: async (id) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre1, nombre2, apellido1, apellido2, email, bio, avatar_url, rol, is_active, email_verified, created_at')
      .eq('id', id)
      .single();
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  },

  create: async (userData) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('usuarios')
      .insert({ ...userData, email_verified: false })
      .select('id, nombre1, apellido1, email, rol, created_at')
      .single();
    if (error) throw error;
    return data;
  },

  setOtp: async (id, code, expiresAt) => {
    const supabase = getClient();
    const { error } = await supabase
      .from('usuarios')
      .update({ otp_code: code, otp_expires: expiresAt })
      .eq('id', id);
    if (error) throw error;
  },

  clearOtp: async (id) => {
    const supabase = getClient();
    const { error } = await supabase
      .from('usuarios')
      .update({ otp_code: null, otp_expires: null })
      .eq('id', id);
    if (error) throw error;
  },

  verifyOtp: async (id, code) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('usuarios')
      .select('otp_code, otp_expires')
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) return { valid: false, reason: 'Usuario no encontrado' };
    if (data.otp_code !== code) return { valid: false, reason: 'Código incorrecto' };
    if (!data.otp_expires || new Date(data.otp_expires) < new Date()) return { valid: false, reason: 'Código expirado' };
    return { valid: true };
  },

  markEmailVerified: async (id) => {
    const supabase = getClient();
    const { error } = await supabase
      .from('usuarios')
      .update({ email_verified: true, otp_code: null, otp_expires: null, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },

  update: async (id, data) => {
    const supabase = getClient();
    const { data: result, error } = await supabase
      .from('usuarios')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  updatePassword: async (id, hashedPassword) => {
    const supabase = getClient();
    const { error } = await supabase
      .from('usuarios')
      .update({ contraseña: hashedPassword, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },

  incrementTokenVersion: async (id) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .rpc('increment_token_version', { user_id: id });
    if (error) throw error;
    return data;
  },

  deactivate: async (id) => {
    const supabase = getClient();
    const { error } = await supabase
      .from('usuarios')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },

  hardDelete: async (id) => {
    const supabase = getClient();
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  setResetToken: async (email, token, expiresAt) => {
    const supabase = getClient();
    const { error } = await supabase
      .from('usuarios')
      .update({ reset_token: token, reset_expires: expiresAt })
      .eq('email', email);
    if (error) throw error;
  },

  findByResetToken: async (token) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('reset_token', token)
      .single();
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  },

  clearResetToken: async (id) => {
    const supabase = getClient();
    const { error } = await supabase
      .from('usuarios')
      .update({ reset_token: null, reset_expires: null })
      .eq('id', id);
    if (error) throw error;
  },
};

module.exports = AuthModel;
