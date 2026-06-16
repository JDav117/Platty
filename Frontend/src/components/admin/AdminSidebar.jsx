import { Link, useLocation } from 'react-router-dom';
import { HiHome, HiUsers, HiDocumentText, HiTag, HiClipboardList, HiDocumentReport } from 'react-icons/hi';
const links = [
  { label: 'Dashboard', to: '/admin', icon: HiHome },
  { label: 'Usuarios', to: '/admin/usuarios', icon: HiUsers },
  { label: 'Recetas', to: '/admin/recetas', icon: HiDocumentText },
  { label: 'Categorías', to: '/admin/categorias', icon: HiTag },
  { label: 'Auditoría', to: '/admin/auditoria', icon: HiClipboardList },
  { label: 'Reportes', to: '/admin/reportes', icon: HiDocumentReport },
];
export default function AdminSidebar() {
  const { pathname } = useLocation();
  return <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
    <div className="flex items-center gap-2 px-3 mb-6">
      <img src="/Platty-Logo.png" alt="Platty" className="h-7 w-7" />
      <h2 className="text-lg font-bold gradient-text">Panel Admin</h2>
    </div>
    <nav className="space-y-1">{links.map((l) => <Link key={l.to} to={l.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${pathname===l.to?'bg-primary-50 dark:bg-primary-900/30 text-primary-600 shadow-sm':'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}><l.icon className="w-5 h-5" />{l.label}</Link>)}</nav>
  </aside>;
}
