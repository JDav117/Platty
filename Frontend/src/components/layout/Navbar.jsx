import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiSun, HiMoon, HiPlus, HiUser, HiHeart } from 'react-icons/hi';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useUIStore();
  const navigate = useNavigate();

  return (
    <>
      <nav className="glass-strong sticky top-0 z-40 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/Platty-Logo.png" alt="Platty" className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-xl font-extrabold gradient-text">Platty</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {!user && <Link to="/" className="text-sm font-medium hover:text-primary-600 transition-colors">Inicio</Link>}
              {user && <Link to="/explorar" className="text-sm font-medium hover:text-primary-600 transition-colors">Explorar</Link>}
              {user ? (
                <>
                  <Button size="sm" onClick={() => navigate('/crear-receta')}><HiPlus className="w-4 h-4 mr-1" />Nueva Receta</Button>
                  <Link to="/favoritos" className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"><HiHeart className="w-5 h-5" /></Link>
                  <Link to="/perfil" className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                    <Avatar nombre1={user.nombre1} apellido1={user.apellido1} avatar_url={user.avatar_url} size="sm" />
                    <span className="text-sm font-medium">{user.nombre1}</span>
                  </Link>
                  <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition-colors">Salir</button>
                </>
              ) : (
                <><Link to="/login"><Button variant="ghost" size="sm">Iniciar Sesión</Button></Link><Link to="/register"><Button size="sm">Registrarse</Button></Link></>
              )}
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">{theme==='dark'?<HiSun className="w-5 h-5"/>:<HiMoon className="w-5 h-5"/>}</button>
            </div>
            <button className="md:hidden p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all" onClick={() => setSidebarOpen(!sidebarOpen)}><HiMenu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-72 glass-strong shadow-2xl p-6 animate-slide-up">
            <div className="flex flex-col gap-4">
              {user ? <>
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-primary-50/50 dark:bg-primary-900/20"><Avatar nombre1={user.nombre1} apellido1={user.apellido1} avatar_url={user.avatar_url} size="md" /><div><p className="font-semibold">{user.nombre1} {user.apellido1}</p><p className="text-sm text-gray-500">{user.email}</p></div></div>
                <Link to="/perfil" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"><HiUser className="w-5 h-5" />Mi Perfil</Link>
                <Link to="/favoritos" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"><HiHeart className="w-5 h-5" />Favoritos</Link>
                <Link to="/crear-receta" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"><HiPlus className="w-5 h-5" />Nueva Receta</Link>
                {user.rol==='admin' && <Link to="/admin" onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all font-medium">Panel Admin</Link>}
                <hr className="border-gray-200 dark:border-gray-700" />
                <button onClick={()=>{logout();setSidebarOpen(false);}} className="text-left text-red-500 font-medium p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">Cerrar Sesión</button>
              </> : <>
                <Link to="/login" onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">Iniciar Sesión</Link>
                <Link to="/register" onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">Registrarse</Link>
              </>}
              <button onClick={toggleTheme} className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">{theme==='dark'?<HiSun className="w-5 h-5"/>:<HiMoon className="w-5 h-5"/>}{theme==='dark'?'Modo Claro':'Modo Oscuro'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
