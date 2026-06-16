import ImageCarousel from '../ui/ImageCarousel';
import Avatar from '../ui/Avatar';
import StarRating from '../ui/StarRating';
import Button from '../ui/Button';
import { HiClock, HiHeart, HiShare, HiPencil, HiTrash } from 'react-icons/hi';
import { DIFICULTADES, UNIDADES_MEDIDA } from '../../utils/constants';
import { formatDateRelative } from '../../utils/formatters';
import FadeIn from '../ui/FadeIn';

export default function RecipeDetail({ recipe, onRate, onFavorite, isFavorito, isOwner, onEdit, onDelete }) {
  if (!recipe) return null;
  const getUnidad = (v) => UNIDADES_MEDIDA.find((u) => u.value === v)?.label.split(' (')[0] || v;
  const videoSrc = recipe?.video_url && recipe?.video_tipo === 'youtube' ? recipe.video_url.replace('watch?v=', 'embed/') : recipe?.video_url;

  return <div className="max-w-4xl mx-auto">
    <ImageCarousel images={recipe.imagenes} className="mb-8" />
    <FadeIn>
      <div className="glass-strong p-6 md:p-8 mb-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{recipe.titulo}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full"><Avatar nombre1={recipe.creador_nombre?.split(' ')[0]} apellido1="" avatar_url={recipe.creador_avatar} size="sm" /><span>{recipe.creador_nombre}</span></div>
              <span className="flex items-center gap-1"><HiClock className="w-4 h-4" />{recipe.tiempo_preparacion} min</span>
              <span className="glass px-3 py-1.5 rounded-full">{recipe.categoria}</span>
              <span className="glass px-3 py-1.5 rounded-full">{DIFICULTADES.find((d) => d.value === recipe.dificultad)?.label}</span>
              <span>{formatDateRelative(recipe.created_at)}</span>
            </div>
          </div>
          {isOwner && <div className="flex gap-2"><Button variant="outline" size="sm" onClick={onEdit}><HiPencil className="w-4 h-4 mr-1" />Editar</Button><Button variant="danger" size="sm" onClick={onDelete}><HiTrash className="w-4 h-4 mr-1" />Eliminar</Button></div>}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{recipe.descripcion}</p>
        <div className="flex items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <StarRating value={recipe.avg_rating} total={recipe.total_ratings} onChange={onRate} />
          <button onClick={onFavorite} className={`flex items-center gap-1 text-sm transition-all ${isFavorito?'text-red-500 scale-110':'text-gray-500 hover:text-red-400'}`}><HiHeart className={`w-5 h-5 ${isFavorito?'fill-current':''}`} />{recipe.total_favoritos||0}</button>
          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"><HiShare className="w-5 h-5" />Compartir</button>
        </div>
      </div>
    </FadeIn>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <FadeIn delay={0.1}>
        <div className="glass-strong p-6 rounded-2xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-primary-500 rounded-full" />Ingredientes</h2>
          <ul className="space-y-2">{(recipe.ingredientes||[]).map((ing, i) => <li key={i} className="flex items-start gap-2 text-sm"><span className="text-primary-600 mt-1">•</span><span><strong>{ing.cantidad}</strong> {getUnidad(ing.unidad)} {ing.nombre}</span></li>)}</ul>
        </div>
      </FadeIn>
      <FadeIn delay={0.2} className="md:col-span-2">
        <div className="glass-strong p-6 rounded-2xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-primary-500 rounded-full" />Preparación</h2>
          <ol className="space-y-4">{(recipe.pasos||[]).map((p, i) => <li key={i} className="flex gap-4 group"><span className="flex-shrink-0 w-8 h-8 rounded-full gradient-bg text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform">{p.orden}</span><div><p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{p.descripcion}</p>{p.imagen_url && <img src={p.imagen_url} alt={`Paso ${p.orden}`} className="mt-2 rounded-lg max-w-xs shadow-md" />}</div></li>)}</ol>
        </div>
      </FadeIn>
    </div>

    {recipe.video_url && <FadeIn delay={0.3}><div className="glass-strong p-6 mb-6 rounded-2xl"><h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-primary-500 rounded-full" />Video</h2><div className="aspect-video rounded-xl overflow-hidden bg-black shadow-xl">{recipe.video_tipo==='youtube'?<iframe src={videoSrc} className="w-full h-full" allowFullScreen />:<video src={videoSrc} controls className="w-full h-full" />}</div></div></FadeIn>}
  </div>;
}
