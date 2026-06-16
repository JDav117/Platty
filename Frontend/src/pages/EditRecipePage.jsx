import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { recipesAPI } from '../api';
import RecipeForm from '../components/recipes/RecipeForm';
import Spinner from '../components/ui/Spinner';
import { toast } from 'sonner';

export default function EditRecipePage() {
  const { id } = useParams(); const { user } = useAuthStore(); const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { const load = async () => { try { const { data } = await recipesAPI.getById(id); if (data.data.usuario_id !== user?.id) { toast.error('No autorizado'); navigate('/'); return; } setRecipe(data.data); } catch { toast.error('No encontrada'); navigate('/'); } finally { setLoading(false); } }; load(); }, [id]);
  if (loading) return <Spinner className="py-20" />;
  return <div className="max-w-4xl mx-auto px-4 py-8"><h1 className="text-3xl font-bold mb-8">Editar Receta</h1><RecipeForm initialData={recipe} /></div>;
}
