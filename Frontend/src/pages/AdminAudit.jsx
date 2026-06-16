import { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import AdminSidebar from '../components/admin/AdminSidebar';
import Pagination from '../components/ui/Pagination';
import FadeIn from '../components/ui/FadeIn';

export default function AdminAudit() {
  const { auditLog, auditTotal, fetchAuditLog } = useAdminStore();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ accion: '', entidad: '' });
  useEffect(() => { fetchAuditLog({ page, ...filters }); }, [page, filters]);

  return <div className="flex min-h-[calc(100vh-4rem)]"><AdminSidebar /><div className="flex-1 p-6 overflow-y-auto">
    <FadeIn><h1 className="text-2xl font-bold mb-6">Auditoría</h1></FadeIn>
    <div className="flex gap-3 mb-4">
      <select value={filters.accion} onChange={(e)=>{setFilters({...filters, accion: e.target.value});setPage(1);}} className="input-field w-auto"><option value="">Todas</option><option value="CREATE">CREATE</option><option value="UPDATE">UPDATE</option><option value="DELETE">DELETE</option></select>
      <select value={filters.entidad} onChange={(e)=>{setFilters({...filters, entidad: e.target.value});setPage(1);}} className="input-field w-auto"><option value="">Todas</option><option value="usuarios">Usuarios</option><option value="recetas">Recetas</option><option value="categorias">Categorías</option></select>
    </div>
    <div className="glass-strong overflow-x-auto rounded-2xl"><table className="w-full text-sm"><thead className="bg-gray-50/50 dark:bg-gray-800/50"><tr><th className="text-left p-3 font-semibold">Fecha</th><th className="text-left p-3 font-semibold">Usuario</th><th className="text-left p-3 font-semibold">Acción</th><th className="text-left p-3 font-semibold">Entidad</th><th className="text-left p-3 font-semibold">ID</th><th className="text-left p-3 font-semibold">IP</th></tr></thead>
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 font-mono text-xs">{auditLog.map((a) => <tr key={a.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="p-3">{new Date(a.created_at).toLocaleString()}</td><td className="p-3">{a.usuario_nombre||'—'}</td>
      <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.accion==='DELETE'?'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400':a.accion==='CREATE'?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{a.accion}</span></td>
      <td className="p-3">{a.entidad}</td><td className="p-3 text-gray-500">{a.entidad_id||'—'}</td><td className="p-3 text-gray-400">{a.ip||'—'}</td>
    </tr>)}</tbody></table></div>
    <Pagination page={page} total={auditTotal} limit={30} onChange={setPage} />
  </div></div>;
}
