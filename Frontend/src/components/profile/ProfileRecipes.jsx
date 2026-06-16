import { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import RecipeCard from '../recipes/RecipeCard';
import EmptyState from '../ui/EmptyState';
import Spinner from '../ui/Spinner';
import { HiOutlineDocumentText } from 'react-icons/hi';

export default function ProfileRecipes({ userId }) {
  const { userRecipes, recipesLoading, fetchUserRecipes } = useUserStore();
  useEffect(() => { if (userId) fetchUserRecipes(userId); }, [userId]);
  if (recipesLoading) return <Spinner />;
  if (!userRecipes?.length) return <EmptyState icon={HiOutlineDocumentText} title="Sin recetas" message="Aún no has publicado ninguna receta" />;
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{userRecipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}</div>;
}
