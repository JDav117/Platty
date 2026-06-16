import { Link, useLocation } from 'react-router-dom';
import { HiHome, HiSearch, HiHeart, HiPlusCircle, HiUser } from 'react-icons/hi';
import { useAuthStore } from '../../store/authStore';

export default function BottomNav() {
  const { user } = useAuthStore();
  const { pathname } = useLocation();
  const links = [
    { to: '/', icon: HiHome, label: 'Inicio' },
    ...(user ? [{ to: '/explorar', icon: HiSearch, label: 'Explorar' }] : []),
    ...(user ? [{ to: '/crear-receta', icon: HiPlusCircle, label: 'Crear' }] : []),
    ...(user ? [{ to: '/favoritos', icon: HiHeart, label: 'Favoritos' }] : []),
    { to: user ? '/perfil' : '/login', icon: HiUser, label: user ? 'Perfil' : 'Entrar' },
  ];
  return <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40">
    <div className="flex items-center justify-around h-16">
      {links.map((l) => <Link key={l.to} to={l.to} className={`flex flex-col items-center gap-0.5 px-3 py-1 ${pathname===l.to?'text-primary-600':'text-gray-500 dark:text-gray-400'}`}><l.icon className="w-6 h-6"/><span className="text-[10px] font-medium">{l.label}</span></Link>)}
    </div>
  </nav>;
}
