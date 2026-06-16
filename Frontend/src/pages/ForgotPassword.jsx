import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api';
import Button from '../components/ui/Button';
import FadeIn from '../components/ui/FadeIn';
import { toast } from 'sonner';
export default function ForgotPassword() {
  const [email, setEmail] = useState(''); const [sent, setSent] = useState(false); const [loading, setLoading] = useState(false);
  const submit = async (e) => { e.preventDefault(); setLoading(true); try { await authAPI.forgotPassword(email); setSent(true); toast.success('Revisa tu correo'); } catch { toast.error('Error al enviar'); } finally { setLoading(false); } };
  if (sent) return <FadeIn><div className="min-h-[80vh] flex items-center justify-center px-4"><div className="card p-8 text-center max-w-md"><h2 className="text-2xl font-bold mb-4">Revisa tu correo</h2><p className="text-gray-500">Si el email está registrado, recibirás un enlace.</p><Link to="/login" className="text-primary-600 hover:underline text-sm mt-4 block">Volver</Link></div></div></FadeIn>;
  return <FadeIn><div className="min-h-[80vh] flex items-center justify-center px-4"><div className="w-full max-w-sm"><h1 className="text-3xl font-bold text-center mb-8">Recuperar Contraseña</h1><form onSubmit={submit} className="card p-6 space-y-4"><p className="text-sm text-gray-500">Ingresa tu email y te enviaremos un enlace.</p><div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="input-field" placeholder="tu@email.com" required /></div><Button type="submit" className="w-full" loading={loading}>Enviar</Button><Link to="/login" className="block text-center text-sm text-primary-600 hover:underline">Volver</Link></form></div></div></FadeIn>;
}
