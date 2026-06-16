import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
export const formatDateRelative = (date) => date ? formatDistanceToNow(new Date(date), { addSuffix: true, locale: es }) : '';
export const formatDate = (date) => date ? new Date(date).toLocaleDateString('es-ES') : '';
export const getInitials = (n1, a1) => `${(n1||'?')[0]}${(a1||'?')[0]}`.toUpperCase();
export const generateAvatarColor = (name) => {
  const colors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f43f5e','#a855f7'];
  let hash = 0; for (let i = 0; i < (name||'').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};
