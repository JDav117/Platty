import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import FadeIn from '../components/ui/FadeIn';
import { toast } from 'sonner';

export default function Register() {
  const { register, user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre1: '', apellido1: '', email: '', contraseña: '' });
  if (user) { navigate('/'); return null; }
  const submit = async (e) => { e.preventDefault(); if (form.contraseña.length < 8) { toast.error('La contraseña debe tener al menos 8 caracteres'); return; } setLoading(true); try { const u = await register(form); navigate(`/verify-email?email=${encodeURIComponent(u.email)}`); toast.success('Revisa tu correo para verificar tu cuenta'); } catch (err) { toast.error(err.response?.data?.message||'Error al registrarse'); } finally { setLoading(false); } };
  return <FadeIn><div className="min-h-[80vh] flex items-center justify-center px-4 py-8"><div className="w-full max-w-sm"><div className="flex items-center justify-center gap-2 mb-8"><img src="/Platty-Logo.png" alt="Platty" className="h-10 w-10" /><h1 className="text-3xl font-bold gradient-text">Platty</h1></div><form onSubmit={submit} className="glass-strong p-8 rounded-2xl space-y-4">
    <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1">Nombre *</label><input type="text" value={form.nombre1} onChange={(e)=>setForm({...form, nombre1: e.target.value})} className="input-field" placeholder="Juan" required /></div><div><label className="block text-sm font-medium mb-1">Apellido *</label><input type="text" value={form.apellido1} onChange={(e)=>setForm({...form, apellido1: e.target.value})} className="input-field" placeholder="Pérez" required /></div></div>
    <div><label className="block text-sm font-medium mb-1">Email *</label><input type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="input-field" placeholder="tu@email.com" required /></div>
    <div><label className="block text-sm font-medium mb-1">Contraseña *</label><input type="password" value={form.contraseña} onChange={(e)=>setForm({...form, contraseña: e.target.value})} className="input-field" placeholder="Mín. 8 caracteres" required minLength={8} /></div>
    <Button type="submit" className="w-full" loading={loading}>Crear Cuenta</Button>
    <p className="text-center text-sm text-gray-500">¿Ya tienes cuenta? <Link to="/login" className="text-primary-600 hover:underline">Inicia sesión</Link></p>
  </form></div></div></FadeIn>;
}
