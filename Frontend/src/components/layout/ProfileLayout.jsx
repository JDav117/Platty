import Avatar from '../ui/Avatar';
import { formatDate } from '../../utils/formatters';
export default function ProfileLayout({ user, activeTab, onTabChange, stats, children }) {
  const tabs = [
    { key: 'info', label: 'Información' },
    { key: 'recetas', label: 'Mis Recetas' },
    { key: 'favoritos', label: 'Favoritos' },
    ...(user?.isOwner ? [{ key: 'configuracion', label: 'Configuración' }] : []),
  ];
  return <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/5">
        <div className="glass-strong p-6 text-center rounded-2xl">
          <div className="flex justify-center mb-4"><Avatar nombre1={user?.nombre1} apellido1={user?.apellido1} avatar_url={user?.avatar_url} size="xl" /></div>
          <h2 className="text-xl font-bold">{user?.nombre1} {user?.apellido1}</h2>
          <p className="text-sm text-gray-500 mb-2">{user?.bio || 'Sin biografía'}</p>
          <p className="text-xs text-gray-400">Miembro desde {formatDate(user?.created_at)}</p>
          {stats && <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center"><p className="text-lg font-bold gradient-text">{stats.recetas}</p><p className="text-xs text-gray-500">Recetas</p></div>
            <div className="text-center"><p className="text-lg font-bold gradient-text">{stats.favoritos}</p><p className="text-xs text-gray-500">Favoritos</p></div>
          </div>}
        </div>
      </div>
      <div className="lg:w-4/5">
        <div className="glass-strong mb-6 rounded-2xl">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto p-1">
            {tabs.map((t) => <button key={t.key} onClick={() => onTabChange(t.key)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${activeTab===t.key?'border-primary-600 text-primary-600':'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>{t.label}</button>)}
          </div>
        </div>
        {children}
      </div>
    </div>
  </div>;
}
