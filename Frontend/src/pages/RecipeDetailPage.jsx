import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRecipeStore } from '../store/recipeStore';
import { ratingsAPI, favoritesAPI, recipesAPI } from '../api';
import RecipeDetail from '../components/recipes/RecipeDetail';
import CommentSection from '../components/comments/CommentSection';
import Spinner from '../components/ui/Spinner';
import FadeIn from '../components/ui/FadeIn';
import { toast } from 'sonner';

export default function RecipeDetailPage() {
  const { slug } = useParams(); const navigate = useNavigate(); const { user } = useAuthStore();
  const { currentRecipe: recipe, loading, fetchRecipeBySlug } = useRecipeStore();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => { load(); }, [slug]);
  const load = async () => {
    const data = await fetchRecipeBySlug(slug);
    if (!data) { toast.error('Receta no encontrada'); navigate('/'); return; }
    if (user) favoritesAPI.check(data.id).then(({ data: d }) => setIsFav(d.favorito));
  };

  const rate = async (p) => { if (!user) { toast.error('Inicia sesión para calificar'); return; } try { await ratingsAPI.rate({ receta_id: recipe.id, puntaje: p }); load(); toast.success('Calificación registrada'); } catch { toast.error('Error al calificar'); } };
  const favorite = async () => { if (!user) { toast.error('Inicia sesión'); return; } try { const { data } = await favoritesAPI.toggle(recipe.id); setIsFav(data.favorito); toast.success(data.favorito ? 'Añadido a favoritos' : 'Eliminado de favoritos'); load(); } catch { toast.error('Error'); } };
  const del = async () => { if (!confirm('¿Eliminar receta?')) return; try { await recipesAPI.delete(recipe.id); toast.success('Receta eliminada'); navigate('/perfil'); } catch { toast.error('Error al eliminar'); } };

  if (loading || !recipe) return <Spinner className="py-20" />;
  return <FadeIn><div className="max-w-5xl mx-auto px-4 py-8">
    <RecipeDetail recipe={recipe} onRate={rate} onFavorite={favorite} isFavorito={isFav} isOwner={user?.id===recipe.usuario_id} onEdit={()=>navigate(`/editar-receta/${recipe.id}`)} onDelete={del} />
    <div className="mt-6"><CommentSection recetaId={recipe.id} /></div>
  </div></FadeIn>;
}
