import { Link } from 'react-router-dom';
import { HiClock, HiStar, HiHeart } from 'react-icons/hi';
import Avatar from '../ui/Avatar';
import { formatDateRelative } from '../../utils/formatters';
import FadeIn from '../ui/FadeIn';

export default function RecipeCard({ recipe, index = 0 }) {
  if (!recipe) return null;
  return (
    <FadeIn delay={index * 0.05}>
      <Link to={`/recipes/${recipe.slug||recipe.id}`} className="card-hover overflow-hidden group block">
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
          <img src={recipe.imagenes?.[0]?.url||'/placeholder.jpg'} alt={recipe.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-base mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">{recipe.titulo}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{recipe.descripcion}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5" />{recipe.tiempo_preparacion} min</span>
            <span className="flex items-center gap-1"><HiStar className="w-3.5 h-3.5 text-yellow-400" />{recipe.avg_rating||'0.0'}</span>
            <span className="flex items-center gap-1"><HiHeart className="w-3.5 h-3.5" />{recipe.total_favoritos||0}</span>
          </div>
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Avatar nombre1={recipe.creador_nombre?.split(' ')[0]} apellido1="" avatar_url={recipe.creador_avatar} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{recipe.creador_nombre || 'Usuario'}</p>
              <p className="text-[10px] text-gray-400">{formatDateRelative(recipe.created_at)}</p>
            </div>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}
