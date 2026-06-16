import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
export default function ImageCarousel({ images, className = '' }) {
  const [c, setC] = useState(0);
  if (!images?.length) return <div className={`bg-gray-200 dark:bg-gray-700 rounded-xl h-64 md:h-96 flex items-center justify-center ${className}`}><span className="text-gray-400">Sin imágenes</span></div>;
  return <div className={`relative group ${className}`}>
    <img src={images[c].url} alt={`Img ${c+1}`} className="w-full h-64 md:h-96 object-cover rounded-xl" />
    {images.length > 1 && <>
      <button onClick={() => setC(c===0?images.length-1:c-1)} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100"><HiChevronLeft className="w-5 h-5" /></button>
      <button onClick={() => setC(c===images.length-1?0:c+1)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100"><HiChevronRight className="w-5 h-5" /></button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">{images.map((_,i) => <button key={i} onClick={() => setC(i)} className={`w-2 h-2 rounded-full transition-all ${i===c?'bg-white w-4':'bg-white/50'}`} />)}</div>
    </>}
  </div>;
}
