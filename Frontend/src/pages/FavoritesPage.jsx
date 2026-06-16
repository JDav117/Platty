import { useEffect, useState } from 'react';
import { favoritesAPI } from '../api';
import RecipeCard from '../components/recipes/RecipeCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import FadeIn from '../components/ui/FadeIn';
import { HiOutlineHeart } from 'react-icons/hi';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const [favs, setFavs] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { favoritesAPI.getAll({ limit: 50 }).then(({ data }) => setFavs(data.data||[])).catch(() => toast.error('Error al cargar favoritos')).finally(()=>setLoading(false)); }, []);
  if (loading) return <Spinner className="py-20" />;
  return <FadeIn><div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-3xl font-bold mb-8">Mis Favoritos</h1>
    {favs.length===0 ? <EmptyState icon={HiOutlineHeart} title="Sin favoritos" message="Las recetas que marques aparecerán aquí" />
    : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{favs.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}</div>}
  </div></FadeIn>;
}
