import { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import RecipeCard from '../recipes/RecipeCard';
import EmptyState from '../ui/EmptyState';
import { HiOutlineHeart } from 'react-icons/hi';

export default function ProfileFavorites() {
  const { favorites, fetchFavorites } = useUserStore();
  useEffect(() => { fetchFavorites(); }, []);
  if (!favorites?.length) return <EmptyState icon={HiOutlineHeart} title="Sin favoritos" message="No has guardado recetas en favoritos" />;
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{favorites.map((r) => <RecipeCard key={r.id} recipe={r} />)}</div>;
}
