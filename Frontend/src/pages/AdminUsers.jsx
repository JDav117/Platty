import { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import AdminSidebar from '../components/admin/AdminSidebar';
import Button from '../components/ui/Button';
import ConfirmModal from '../components/ui/ConfirmModal';
import Pagination from '../components/ui/Pagination';
import FadeIn from '../components/ui/FadeIn';
import { adminAPI } from '../api';
import { toast } from 'sonner';

export default function AdminUsers() {
  const { users, usersTotal, fetchUsers } = useAdminStore();
  const [page, setPage] = useState(1); const [search, setSearch] = useState(''); const [delId, setDelId] = useState(null);
  useEffect(() => { fetchUsers({ page, search }); }, [page, search]);
  const roleChange = async (id, rol) => { try { await adminAPI.updateUserRole(id, rol); toast.success('Rol actualizado'); fetchUsers({ page, search }); } catch { toast.error('Error al actualizar rol'); } };
  const del = async () => { try { await adminAPI.deleteUser(delId); toast.success('Usuario eliminado'); setDelId(null); fetchUsers({ page, search }); } catch { toast.error('Error al eliminar'); } };
  return <div className="flex min-h-[calc(100vh-4rem)]"><AdminSidebar /><div className="flex-1 p-6 overflow-y-auto">
    <FadeIn><h1 className="text-2xl font-bold mb-6">Usuarios</h1></FadeIn>
    <input type="text" value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1);}} placeholder="Buscar..." className="input-field max-w-md mb-4" />
    <div className="glass-strong overflow-x-auto rounded-2xl"><table className="w-full text-sm"><thead className="bg-gray-50/50 dark:bg-gray-800/50"><tr><th className="text-left p-3 font-semibold">Nombre</th><th className="text-left p-3 font-semibold">Email</th><th className="text-left p-3 font-semibold">Rol</th><th className="text-left p-3 font-semibold">Estado</th><th className="text-left p-3 font-semibold">Fecha</th><th className="text-left p-3 font-semibold">Acción</th></tr></thead>
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{users.map((u) => <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="p-3 font-medium">{u.nombre1} {u.apellido1}</td><td className="p-3 text-gray-500">{u.email}</td>
      <td className="p-3"><select value={u.rol} onChange={(e)=>roleChange(u.id, e.target.value)} className="input-field text-xs py-1 w-24"><option value="usuario">Usuario</option><option value="admin">Admin</option></select></td>
      <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.is_active?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{u.is_active?'Activo':'Inactivo'}</span></td>
      <td className="p-3 text-xs text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
      <td className="p-3"><Button variant="danger" size="sm" onClick={()=>setDelId(u.id)}>Eliminar</Button></td>
    </tr>)}</tbody></table></div>
    <Pagination page={page} total={usersTotal} limit={20} onChange={setPage} />
    <ConfirmModal isOpen={!!delId} onClose={()=>setDelId(null)} onConfirm={del} title="Eliminar Usuario" message="¿Estás seguro? Esta acción es irreversible." />
  </div></div>;
}
