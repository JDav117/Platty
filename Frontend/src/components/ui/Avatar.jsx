import { getInitials, generateAvatarColor } from '../../utils/formatters';
export default function Avatar({ nombre1, apellido1, avatar_url, size = 'md', className = '' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-lg', xl: 'w-24 h-24 text-2xl' };
  if (avatar_url) return <img src={avatar_url} alt={`${nombre1} ${apellido1}`} className={`${sizes[size]} rounded-full object-cover ${className}`} />;
  return <div className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-semibold ${className}`} style={{ backgroundColor: generateAvatarColor(`${nombre1}${apellido1}`) }}>{getInitials(nombre1, apellido1)}</div>;
}
