import { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import AdminSidebar from '../components/admin/AdminSidebar';
import Button from '../components/ui/Button';
import ConfirmModal from '../components/ui/ConfirmModal';
import FadeIn from '../components/ui/FadeIn';
import { adminAPI } from '../api';
import { toast } from 'sonner';

export default function AdminCategories() {
  const { categories, fetchCategories } = useAdminStore();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [delId, setDelId] = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  const save = async () => { try { if (editing) { await adminAPI.updateCategory(editing, form); toast.success('Categoría actualizada'); } else { await adminAPI.createCategory(form); toast.success('Categoría creada'); } setEditing(null); setForm({ nombre: '', descripcion: '' }); fetchCategories(); } catch (err) { toast.error(err.response?.data?.message||'Error'); } };
  const del = async () => { try { await adminAPI.deleteCategory(delId); toast.success('Categoría eliminada'); setDelId(null); fetchCategories(); } catch { toast.error('Error'); } };

  return <div className="flex min-h-[calc(100vh-4rem)]"><AdminSidebar /><div className="flex-1 p-6 overflow-y-auto">
    <FadeIn><h1 className="text-2xl font-bold mb-6">Categorías</h1></FadeIn>
    <div className="glass-strong p-6 mb-6 max-w-md rounded-2xl"><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-primary-500 rounded-full" />{editing?'Editar':'Nueva'} Categoría</h3><div className="space-y-3">
      <input type="text" value={form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} className="input-field" placeholder="Nombre" />
      <textarea value={form.descripcion} onChange={(e)=>setForm({...form, descripcion: e.target.value})} className="input-field" placeholder="Descripción" rows={2} />
      <div className="flex gap-2"><Button onClick={save}>{editing?'Actualizar':'Crear'}</Button>{editing&&<Button variant="secondary" onClick={()=>{setEditing(null);setForm({nombre:'',descripcion:''});}}>Cancelar</Button>}</div>
    </div></div>
    <div className="glass-strong overflow-x-auto rounded-2xl"><table className="w-full text-sm"><thead className="bg-gray-50/50 dark:bg-gray-800/50"><tr><th className="text-left p-3 font-semibold">Nombre</th><th className="text-left p-3 font-semibold">Descripción</th><th className="text-left p-3 font-semibold">Slug</th><th className="text-left p-3 font-semibold">Acciones</th></tr></thead>
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{categories.map((c) => <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="p-3 font-medium">{c.nombre}</td><td className="p-3 text-gray-500">{c.descripcion||'—'}</td><td className="p-3 text-xs text-gray-400">{c.slug}</td>
      <td className="p-3 flex gap-2"><Button variant="outline" size="sm" onClick={()=>{setEditing(c.id);setForm({nombre:c.nombre,descripcion:c.descripcion||''});}}>Editar</Button><Button variant="danger" size="sm" onClick={()=>setDelId(c.id)}>Eliminar</Button></td>
    </tr>)}</tbody></table></div>
    <ConfirmModal isOpen={!!delId} onClose={()=>setDelId(null)} onConfirm={del} title="Eliminar Categoría" message="Las recetas quedarán sin categoría." />
  </div></div>;
}
