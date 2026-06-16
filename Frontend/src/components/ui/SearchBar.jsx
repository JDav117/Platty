import { useState, useEffect, useRef } from 'react';
import { HiSearch } from 'react-icons/hi';

export default function SearchBar({ onSearch, placeholder = 'Buscar...', className = '' }) {
  const [value, setValue] = useState('');
  const timer = useRef(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(timer.current);
  }, [value]);

  return <div className={`relative ${className}`}>
    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} className="input-field pl-10 pr-4" />
  </div>;
}
