import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
export default function Pagination({ page, total, limit, onChange }) {
  const tp = Math.ceil(total / limit);
  if (tp <= 1) return null;
  const pages = []; for (let i = Math.max(1, page-2); i <= Math.min(tp, page+2); i++) pages.push(i);
  return <div className="flex items-center justify-center gap-1 mt-6">
    <button onClick={() => onChange(page-1)} disabled={page<=1} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"><HiChevronLeft className="w-5 h-5" /></button>
    {pages.map((p) => <button key={p} onClick={() => onChange(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p===page?'bg-primary-600 text-white':'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{p}</button>)}
    <button onClick={() => onChange(page+1)} disabled={page>=tp} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"><HiChevronRight className="w-5 h-5" /></button>
  </div>;
}
