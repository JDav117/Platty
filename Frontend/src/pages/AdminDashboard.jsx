import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import AdminSidebar from '../components/admin/AdminSidebar';
import { Link } from 'react-router-dom';
import { HiUsers, HiDocumentText, HiChat, HiTag } from 'react-icons/hi';
import FadeIn from '../components/ui/FadeIn';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { dashboardData, fetchDashboard } = useAdminStore();
  useEffect(() => { fetchDashboard().catch(() => toast.error('Error al cargar dashboard')); }, []);

  const cards = [
    { label: 'Usuarios', value: dashboardData?.resumen?.totalUsuarios||0, icon: HiUsers, color: 'from-blue-500 to-blue-600', link: '/admin/usuarios' },
    { label: 'Recetas', value: dashboardData?.resumen?.totalRecetas||0, icon: HiDocumentText, color: 'from-green-500 to-green-600', link: '/admin/recetas' },
    { label: 'Comentarios', value: dashboardData?.resumen?.totalComentarios||0, icon: HiChat, color: 'from-purple-500 to-purple-600', link: '#' },
    { label: 'Categorías', value: dashboardData?.resumen?.totalCategorias||0, icon: HiTag, color: 'from-orange-500 to-orange-600', link: '/admin/categorias' },
  ];

  return <div className="flex min-h-[calc(100vh-4rem)]"><AdminSidebar /><div className="flex-1 p-6 overflow-y-auto">
    <FadeIn><h1 className="text-2xl font-bold mb-6">Dashboard</h1></FadeIn>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{cards.map((c) => <Link key={c.label} to={c.link} className="card-hover p-5"><div className="flex items-center gap-3"><div className={`bg-gradient-to-br ${c.color} p-3 rounded-xl shadow-lg`}><c.icon className="w-6 h-6 text-white" /></div><div><p className="text-2xl font-bold">{c.value}</p><p className="text-sm text-gray-500">{c.label}</p></div></div></Link>)}</div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FadeIn delay={0.1}><div className="glass-strong p-6 rounded-2xl"><h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-primary-500 rounded-full" />Top Recetas</h2>{(dashboardData?.topRecetas||[]).length===0?<p className="text-gray-500">Sin datos</p>:<div className="space-y-3">{dashboardData?.topRecetas?.map((r,i) => <div key={r.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"><span className="text-gray-400 w-5 font-bold">{i+1}.</span><span className="font-medium truncate max-w-[200px]">{r.titulo}</span><span className="text-yellow-500 font-medium">{r.avg_rating} ⭐</span></div>)}</div>}</div></FadeIn>
      <FadeIn delay={0.2}><div className="glass-strong p-6 rounded-2xl"><h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-primary-500 rounded-full" />Top Usuarios</h2>{(dashboardData?.topUsuarios||[]).length===0?<p className="text-gray-500">Sin datos</p>:<div className="space-y-3">{dashboardData?.topUsuarios?.map((u,i) => <div key={u.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"><span className="text-gray-400 w-5 font-bold">{i+1}.</span><span className="font-medium">{u.nombre1} {u.apellido1}</span><span className="text-gray-500">{u.total_recetas} recetas</span></div>)}</div>}</div></FadeIn>
    </div>
  </div></div>;
}
