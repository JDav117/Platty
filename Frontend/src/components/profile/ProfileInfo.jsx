import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import Button from '../ui/Button';
import { toast } from 'sonner';

export default function ProfileInfo({ user }) {
  const { updateUser } = useAuthStore();
  const { updateProfile, updateAvatar } = useUserStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nombre1: '', nombre2: '', apellido1: '', apellido2: '', bio: '' });

  const startEdit = () => { setForm({ nombre1: user?.nombre1||'', nombre2: user?.nombre2||'', apellido1: user?.apellido1||'', apellido2: user?.apellido2||'', bio: user?.bio||'' }); setEditing(true); };
  const save = async () => { setLoading(true); try { const { data } = await updateProfile(form); updateUser(data.data); toast.success('Perfil actualizado'); setEditing(false); } catch (err) { toast.error(err.response?.data?.message||'Error'); } finally { setLoading(false); } };
  const [loading, setLoading] = useState(false);

  const handleAvatar = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 10*1024*1024) { toast.error('La imagen no puede superar los 10MB'); return; }
    try { const { data } = await updateAvatar(f); updateUser(data.data); toast.success('Avatar actualizado'); } catch { toast.error('Error al subir avatar'); }
  };

  if (!user) return null;
  return <div className="glass-strong p-6 rounded-2xl">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold flex items-center gap-2"><span className="w-1.5 h-5 bg-primary-500 rounded-full" />Información Personal</h3>
      {!editing && <Button size="sm" variant="outline" onClick={startEdit}>Editar</Button>}
    </div>
    <label className="block mb-6 cursor-pointer group">
      <div className="flex items-center gap-3"><img src={user.avatar_url||'/Platty-Logo.png'} alt="Avatar" className="w-16 h-16 rounded-xl object-cover group-hover:ring-2 ring-primary-500 transition-all" /><span className="text-sm text-primary-600 hover:underline">Cambiar foto</span></div>
      <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
    </label>
    {editing ? (
      <div className="space-y-3 max-w-lg">
        <div className="grid grid-cols-2 gap-3"><input value={form.nombre1} onChange={(e)=>setForm({...form, nombre1: e.target.value})} className="input-field" placeholder="Nombre" /><input value={form.apellido1} onChange={(e)=>setForm({...form, apellido1: e.target.value})} className="input-field" placeholder="Apellido" /></div>
        <div className="grid grid-cols-2 gap-3"><input value={form.nombre2} onChange={(e)=>setForm({...form, nombre2: e.target.value})} className="input-field" placeholder="Segundo nombre" /><input value={form.apellido2} onChange={(e)=>setForm({...form, apellido2: e.target.value})} className="input-field" placeholder="Segundo apellido" /></div>
        <textarea value={form.bio} onChange={(e)=>setForm({...form, bio: e.target.value})} className="input-field" placeholder="Biografía" rows={3} maxLength={500} />
        <div className="flex gap-2"><Button onClick={save} loading={loading}>Guardar</Button><Button variant="secondary" onClick={()=>setEditing(false)}>Cancelar</Button></div>
      </div>
    ) : (
      <div className="space-y-2 max-w-lg"><p className="text-sm"><span className="text-gray-500">Nombre:</span> <strong>{user.nombre1} {user.nombre2} {user.apellido1} {user.apellido2}</strong></p><p className="text-sm"><span className="text-gray-500">Email:</span> <strong>{user.email}</strong></p><p className="text-sm"><span className="text-gray-500">Bio:</span> {user.bio||'—'}</p></div>
    )}
  </div>;
}
