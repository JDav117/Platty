import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { commentsAPI } from '../../api';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Button from '../ui/Button';
import { toast } from 'sonner';

export default function CommentSection({ recetaId }) {
  const { user } = useAuthStore();
  const [comentarios, setComentarios] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetch = async (p = 1) => {
    setLoading(true);
    try { const { data } = await commentsAPI.getByRecipe(recetaId, { page: p, limit: 10 }); setComentarios((prev) => p === 1 ? data.data : [...prev, ...data.data]); setTotal(data.total); setPage(p); }
    catch { toast.error('Error al cargar comentarios'); } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, [recetaId]);

  const add = async (c, pid = null) => { try { await commentsAPI.create({ receta_id: recetaId, contenido: c, parent_id: pid }); toast.success('Comentario publicado'); fetch(1); } catch { toast.error('Error al publicar'); } };
  const del = async (id) => { try { await commentsAPI.delete(id); toast.success('Eliminado'); fetch(1); } catch { toast.error('Error al eliminar'); } };
  const upd = async (id, c) => { try { await commentsAPI.update(id, { contenido: c }); toast.success('Actualizado'); fetch(1); } catch { toast.error('Error al actualizar'); } };

  return <div className="card p-6">
    <h2 className="text-lg font-bold mb-4">Comentarios ({total})</h2>
    {user && <CommentForm onSubmit={(c) => add(c)} placeholder="Escribe un comentario..." />}
    <div className="space-y-4 mt-6">{comentarios.map((co) => <CommentItem key={co.id} comment={co} currentUser={user} onReply={(content) => add(content, co.id)} onDelete={del} onUpdate={upd} />)}</div>
    {comentarios.length < total && <div className="text-center mt-4"><Button variant="ghost" size="sm" onClick={() => fetch(page + 1)} loading={loading}>Ver más</Button></div>}
    {!user && <p className="text-sm text-gray-500 text-center mt-4">Inicia sesión para comentar</p>}
  </div>;
}
