import { useState } from 'react';
import { HiPaperAirplane } from 'react-icons/hi';
export default function CommentForm({ onSubmit, placeholder = 'Escribe...', autoFocus = false }) {
  const [v, setV] = useState('');
  return <form onSubmit={(e) => { e.preventDefault(); if (!v.trim()) return; onSubmit(v.trim()); setV(''); }} className="flex gap-2">
    <input type="text" value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} className="input-field flex-1" autoFocus={autoFocus} />
    <button type="submit" disabled={!v.trim()} className="p-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"><HiPaperAirplane className="w-4 h-4" /></button>
  </form>;
}
