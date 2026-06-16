import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import FadeIn from '../components/ui/FadeIn';
import { toast } from 'sonner';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const { login, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/explorar';
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', contraseña: '' });
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const err = searchParams.get('error');
    if (err === 'google_auth_failed') toast.error('Error al autenticar con Google');
    else if (err === 'no_tokens') toast.error('Error al iniciar sesión con Google');
  }, []);
  if (user) { navigate(from, { replace: true }); return null; }
  const submit = async (e) => { e.preventDefault(); setLoading(true); try { await login(form); toast.success('Bienvenido a Platty'); navigate(from, { replace: true }); } catch (err) { const msg = err.response?.data; if (msg?.code === 'EMAIL_NOT_VERIFIED') { navigate(`/verify-email?email=${encodeURIComponent(form.email)}`); toast.error('Debes verificar tu correo primero'); } else { toast.error(msg?.message||'Credenciales inválidas'); } } finally { setLoading(false); } };
  return <FadeIn><div className="min-h-[80vh] flex items-center justify-center px-4"><div className="w-full max-w-sm"><div className="flex items-center justify-center gap-2 mb-8"><img src="/Platty-Logo.png" alt="Platty" className="h-10 w-10" /><h1 className="text-3xl font-bold gradient-text">Platty</h1></div><form onSubmit={submit} className="glass-strong p-8 rounded-2xl space-y-4">
    <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="input-field" placeholder="tu@email.com" required /></div>
    <div><label className="block text-sm font-medium mb-1">Contraseña</label><input type="password" value={form.contraseña} onChange={(e)=>setForm({...form, contraseña: e.target.value})} className="input-field" placeholder="••••••••" required /></div>
    <div className="text-right"><Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">¿Olvidaste tu contraseña?</Link></div>
    <Button type="submit" className="w-full" loading={loading}>Entrar</Button>
    <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div><div className="relative flex justify-center"><span className="bg-white dark:bg-gray-900 px-3 text-sm text-gray-500">o continúa con</span></div></div>
    <button type="button" onClick={() => window.location.href = '/api/auth/google'} className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"><FcGoogle className="w-5 h-5" /><span className="text-sm font-medium">Google</span></button>
    <p className="text-center text-sm text-gray-500">¿No tienes cuenta? <Link to="/register" className="text-primary-600 hover:underline">Regístrate</Link></p>
  </form></div></div></FadeIn>;
}
