import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { recipesAPI, categoriesAPI } from '../../api';
import Button from '../ui/Button';
import { UNIDADES_MEDIDA, DIFICULTADES, MAX_IMAGENES } from '../../utils/constants';
import { HiPlus, HiTrash, HiArrowUp, HiArrowDown } from 'react-icons/hi';
import { toast } from 'sonner';

export default function RecipeForm({ initialData }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!initialData;

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: '', descripcion: '', tiempo_preparacion: 30, dificultad: 'media', categoria_id: '', video_url: '', video_tipo: '',
    ingredientes: [{ nombre: '', cantidad: '', unidad: 'g' }],
    pasos: [{ descripcion: '', orden: 1 }],
  });
  const [imagenes, setImagenes] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => { categoriesAPI.getAll().then(({ data }) => setCategorias(data.data||[])); }, []);
  useEffect(() => {
    if (initialData) {
      setForm({
        titulo: initialData.titulo||'', descripcion: initialData.descripcion||'', tiempo_preparacion: initialData.tiempo_preparacion||30,
        dificultad: initialData.dificultad||'media', categoria_id: initialData.categoria_id||'', video_url: initialData.video_url||'', video_tipo: initialData.video_tipo||'',
        ingredientes: (initialData.ingredientes||[]).map((i) => ({ nombre: i.nombre, cantidad: String(i.cantidad), unidad: i.unidad })),
        pasos: (initialData.pasos||[]).map((p) => ({ descripcion: p.descripcion, orden: p.orden })),
      });
      if (initialData.imagenes) setPreviews(initialData.imagenes.map((i) => i.url));
    }
  }, [initialData]);

  const ch = (f, v) => setForm((s) => ({ ...s, [f]: v }));
  const ingCh = (i, f, v) => { const n = [...form.ingredientes]; n[i] = { ...n[i], [f]: v }; setForm((s) => ({ ...s, ingredientes: n })); };
  const pasoCh = (i, v) => { const n = [...form.pasos]; n[i] = { ...n[i], descripcion: v }; setForm((s) => ({ ...s, pasos: n })); };

  const handleImgs = (e) => {
    const files = Array.from(e.target.files);
    const total = previews.length + files.length;
    if (total > MAX_IMAGENES) { toast.error(`Máximo ${MAX_IMAGENES} imágenes`); return; }
    const valid = files.filter((f) => f.size <= 10*1024*1024);
    if (valid.length !== files.length) toast.error('Algunas imágenes superan los 10MB');
    setImagenes((p) => [...p, ...valid]);
    setPreviews((p) => [...p, ...valid.map((f) => URL.createObjectURL(f))]);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.descripcion || !form.categoria_id) { toast.error('Completa los campos requeridos'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('titulo', form.titulo); fd.append('descripcion', form.descripcion);
      fd.append('tiempo_preparacion', form.tiempo_preparacion); fd.append('dificultad', form.dificultad);
      fd.append('categoria_id', form.categoria_id);
      fd.append('ingredientes', JSON.stringify(form.ingredientes));
      fd.append('pasos', JSON.stringify(form.pasos));
      if (form.video_url) { fd.append('video_url', form.video_url); fd.append('video_tipo', form.video_tipo||'youtube'); }
      imagenes.forEach((img) => fd.append('imagenes', img));
      if (isEditing) { await recipesAPI.update(id, fd); toast.success('Receta actualizada'); } else { const { data } = await recipesAPI.create(fd); toast.success('Receta creada'); navigate(`/recipes/${data.data.slug}`); }
    } catch (err) { toast.error(err.response?.data?.message||'Error'); } finally { setLoading(false); }
  };

  return <form onSubmit={submit} className="max-w-3xl mx-auto space-y-8">
    <div className="card p-6 space-y-4">
      <h2 className="text-xl font-bold">Información Básica</h2>
      <div><label className="block text-sm font-medium mb-1">Título *</label><input type="text" value={form.titulo} onChange={(e)=>ch('titulo',e.target.value)} className="input-field" required /></div>
      <div><label className="block text-sm font-medium mb-1">Descripción *</label><textarea value={form.descripcion} onChange={(e)=>ch('descripcion',e.target.value)} className="input-field" rows={3} required /></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-1">Tiempo (min) *</label><input type="number" value={form.tiempo_preparacion} onChange={(e)=>ch('tiempo_preparacion',parseInt(e.target.value))} className="input-field" min={1} required /></div>
        <div><label className="block text-sm font-medium mb-1">Dificultad *</label><select value={form.dificultad} onChange={(e)=>ch('dificultad',e.target.value)} className="input-field">{DIFICULTADES.map((d)=><option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-1">Categoría *</label><select value={form.categoria_id} onChange={(e)=>ch('categoria_id',e.target.value)} className="input-field" required><option value="">Seleccionar</option>{categorias.map((c)=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div>
      </div>
    </div>

    <div className="card p-6 space-y-4">
      <h2 className="text-xl font-bold">Ingredientes</h2>
      {form.ingredientes.map((ing, i) => <div key={i} className="flex gap-2 items-start">
        <input type="text" value={ing.nombre} onChange={(e)=>ingCh(i,'nombre',e.target.value)} className="input-field flex-1" placeholder="Ingrediente" />
        <input type="number" value={ing.cantidad} onChange={(e)=>ingCh(i,'cantidad',e.target.value)} className="input-field w-24" placeholder="Cant." step="0.01" />
        <select value={ing.unidad} onChange={(e)=>ingCh(i,'unidad',e.target.value)} className="input-field w-36">{UNIDADES_MEDIDA.map((u)=><option key={u.value} value={u.value}>{u.label}</option>)}</select>
        <button type="button" onClick={() => { if (form.ingredientes.length>1) setForm((s)=>({...s, ingredientes: s.ingredientes.filter((_,j)=>j!==i)})); }} className="p-2 text-red-500"><HiTrash className="w-5 h-5" /></button>
      </div>)}
      <Button type="button" variant="outline" size="sm" onClick={() => setForm((s)=>({...s, ingredientes: [...s.ingredientes, {nombre:'',cantidad:'',unidad:'g'}]}))}><HiPlus className="w-4 h-4 mr-1" />Añadir</Button>
    </div>

    <div className="card p-6 space-y-4">
      <h2 className="text-xl font-bold">Pasos</h2>
      {form.pasos.map((p, i) => <div key={i} className="flex gap-2 items-start">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 flex items-center justify-center font-bold text-sm mt-2">{p.orden}</span>
        <textarea value={p.descripcion} onChange={(e)=>pasoCh(i,e.target.value)} className="input-field flex-1" rows={2} placeholder={`Paso ${p.orden}`} />
        <div className="flex flex-col gap-1 mt-2">
          <button type="button" onClick={() => { if (i===0) return; const n=[...form.pasos]; [n[i],n[i-1]]=[n[i-1],n[i]]; setForm((s)=>({...s, pasos: n.map((x,j)=>({...x,orden:j+1}))})); }} disabled={i===0} className="p-1 text-gray-400 disabled:opacity-30"><HiArrowUp className="w-4 h-4" /></button>
          <button type="button" onClick={() => { if (i===form.pasos.length-1) return; const n=[...form.pasos]; [n[i],n[i+1]]=[n[i+1],n[i]]; setForm((s)=>({...s, pasos: n.map((x,j)=>({...x,orden:j+1}))})); }} disabled={i===form.pasos.length-1} className="p-1 text-gray-400 disabled:opacity-30"><HiArrowDown className="w-4 h-4" /></button>
        </div>
        <button type="button" onClick={() => { if (form.pasos.length>1) setForm((s)=>({...s, pasos: s.pasos.filter((_,j)=>j!==i).map((x,j)=>({...x,orden:j+1}))})); }} className="p-2 mt-1 text-red-500"><HiTrash className="w-5 h-5" /></button>
      </div>)}
      <Button type="button" variant="outline" size="sm" onClick={() => setForm((s)=>({...s, pasos: [...s.pasos, {descripcion:'',orden:s.pasos.length+1}]}))}><HiPlus className="w-4 h-4 mr-1" />Añadir paso</Button>
    </div>

    <div className="card p-6 space-y-4">
      <h2 className="text-xl font-bold">Imágenes</h2>
      <p className="text-sm text-gray-500">Máximo {MAX_IMAGENES} imágenes (10MB, JPG/PNG/WebP)</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {previews.map((p, i) => <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"><img src={p} alt="" className="w-full h-full object-cover" /><button type="button" onClick={() => { setPreviews((prev)=>prev.filter((_,j)=>j!==i)); setImagenes((prev)=>prev.filter((_,j)=>j!==i)); }} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><HiTrash className="w-3 h-3" /></button></div>)}
        {previews.length < MAX_IMAGENES && <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-primary-500"><HiPlus className="w-8 h-8 text-gray-400" /><input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleImgs} /></label>}
      </div>
    </div>

    <div className="card p-6 space-y-4">
      <h2 className="text-xl font-bold">Video (Opcional)</h2>
      <div className="flex gap-2">
        <select value={form.video_tipo} onChange={(e)=>ch('video_tipo',e.target.value)} className="input-field w-36"><option value="">Sin video</option><option value="youtube">YouTube</option><option value="cloudinary">Cloudinary</option></select>
        <input type="text" value={form.video_url} onChange={(e)=>ch('video_url',e.target.value)} className="input-field flex-1" placeholder={form.video_tipo==='youtube'?'URL de YouTube':'URL del video'} />
      </div>
    </div>

    <div className="flex justify-end gap-3 pb-8">
      <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
      <Button type="submit" loading={loading}>{isEditing?'Actualizar':'Publicar'}</Button>
    </div>
  </form>;
}
