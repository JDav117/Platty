import { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import AdminSidebar from '../components/admin/AdminSidebar';
import Button from '../components/ui/Button';
import ConfirmModal from '../components/ui/ConfirmModal';
import Pagination from '../components/ui/Pagination';
import FadeIn from '../components/ui/FadeIn';
import { adminAPI } from '../api';
import { toast } from 'sonner';

export default function AdminRecipes() {
  const { recipes, recipesTotal, fetchRecipes } = useAdminStore();
  const [page, setPage] = useState(1); const [search, setSearch] = useState(''); const [delId, setDelId] = useState(null);
  useEffect(() => { fetchRecipes({ page, search }); }, [page, search]);
  const del = async () => { try { await adminAPI.deleteRecipe(delId); toast.success('Receta eliminada'); setDelId(null); fetchRecipes({ page, search }); } catch { toast.error('Error al eliminar'); } };
  return <div className="flex min-h-[calc(100vh-4rem)]"><AdminSidebar /><div className="flex-1 p-6 overflow-y-auto">
    <FadeIn><h1 className="text-2xl font-bold mb-6">Recetas</h1></FadeIn>
    <input type="text" value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1);}} placeholder="Buscar..." className="input-field max-w-md mb-4" />
    <div className="glass-strong overflow-x-auto rounded-2xl"><table className="w-full text-sm"><thead className="bg-gray-50/50 dark:bg-gray-800/50"><tr><th className="text-left p-3 font-semibold">Título</th><th className="text-left p-3 font-semibold">Autor</th><th className="text-left p-3 font-semibold">Rating</th><th className="text-left p-3 font-semibold">Fecha</th><th className="text-left p-3 font-semibold">Acción</th></tr></thead>
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{recipes.map((r) => <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="p-3 font-medium">{r.titulo}</td><td className="p-3 text-gray-500">{r.creador_nombre}</td><td className="p-3">{r.avg_rating?`${r.avg_rating}⭐`:'—'}</td><td className="p-3 text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
      <td className="p-3"><Button variant="danger" size="sm" onClick={()=>setDelId(r.id)}>Eliminar</Button></td>
    </tr>)}</tbody></table></div>
    <Pagination page={page} total={recipesTotal} limit={20} onChange={setPage} />
    <ConfirmModal isOpen={!!delId} onClose={()=>setDelId(null)} onConfirm={del} title="Eliminar Receta" message="¿Estás seguro?" />
  </div></div>;
}
