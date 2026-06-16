import { useState } from 'react';
import { HiStar } from 'react-icons/hi';
export default function StarRating({ value = 0, total = 0, onChange, size = 'md', readonly = false }) {
  const [hover, setHover] = useState(0);
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  const dv = hover || value;
  return <div className="flex items-center gap-1">
    <div className="flex">{[1,2,3,4,5].map((s) => <button key={s} type="button" disabled={readonly} onClick={() => onChange?.(s)} onMouseEnter={() => !readonly && setHover(s)} onMouseLeave={() => !readonly && setHover(0)} className={`${readonly?'cursor-default':'cursor-pointer'} transition-colors p-0.5`}><HiStar className={`${sizes[size]} ${s<=dv?'text-yellow-400':'text-gray-300 dark:text-gray-600'}`} /></button>)}</div>
    {total > 0 && <span className="text-sm text-gray-500 ml-1">({total})</span>}
  </div>;
}
