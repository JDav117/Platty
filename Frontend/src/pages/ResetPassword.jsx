import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import Button from '../components/ui/Button';
import FadeIn from '../components/ui/FadeIn';
import { toast } from 'sonner';
export default function ResetPassword() {
  const [sp] = useSearchParams(); const token = sp.get('token'); const navigate = useNavigate();
  const [pw, setPw] = useState(''); const [loading, setLoading] = useState(false);
  if (!token) return <FadeIn><div className="min-h-[80vh] flex items-center justify-center px-4"><div className="glass-strong p-8 text-center max-w-md rounded-2xl"><h2 className="text-2xl font-bold mb-4">Enlace inválido</h2><p className="text-gray-500 mb-4">El enlace ha expirado o no es válido.</p><Button onClick={()=>navigate('/forgot-password')}>Solicitar nuevo</Button></div></div></FadeIn>;
  const submit = async (e) => { e.preventDefault(); if (pw.length < 8) { toast.error('Mínimo 8 caracteres'); return; } setLoading(true); try { await authAPI.resetPassword({ token, contraseña: pw }); toast.success('Contraseña restablecida'); navigate('/login'); } catch (err) { toast.error(err.response?.data?.message||'Error'); } finally { setLoading(false); } };
  return <FadeIn><div className="min-h-[80vh] flex items-center justify-center px-4"><div className="w-full max-w-sm"><div className="flex items-center justify-center gap-2 mb-8"><img src="/Platty-Logo.png" alt="Platty" className="h-10 w-10" /><h1 className="text-3xl font-bold gradient-text">Platty</h1></div><form onSubmit={submit} className="glass-strong p-8 rounded-2xl space-y-4"><h2 className="text-xl font-bold text-center">Nueva Contraseña</h2><div><label className="block text-sm font-medium mb-1">Nueva Contraseña</label><input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} className="input-field" placeholder="Mín. 8 caracteres" required minLength={8} /></div><Button type="submit" className="w-full" loading={loading}>Restablecer</Button></form></div></div></FadeIn>;
}
