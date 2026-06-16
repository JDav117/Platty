import { useState, useEffect } from 'react';
import { recipesAPI, categoriesAPI } from '../api';
import RecipeCard from '../components/recipes/RecipeCard';
import SearchBar from '../components/ui/SearchBar';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import FadeIn from '../components/ui/FadeIn';
import { HiOutlineHome, HiFilter } from 'react-icons/hi';
import { toast } from 'sonner';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');
  const [orden, setOrden] = useState('recientes');

  useEffect(() => { categoriesAPI.getAll().then(({ data }) => setCategorias(data.data||[])).catch(() => toast.error('Error al cargar categorías')); }, []);
  useEffect(() => { fetchRecipes(); }, [page, search, cat, orden]);

  const fetchRecipes = async () => {
    setLoading(true);
    try { const params = { page, limit: 12 }; if (search) params.search = search; if (cat) params.categoria_id = cat; if (orden !== 'recientes') params.ordenar = orden; const { data } = await recipesAPI.getAll(params); setRecipes(data.data||[]); setTotal(data.total||0); } catch { toast.error('Error al cargar recetas'); setRecipes([]); } finally { setLoading(false); }
  };

  return <FadeIn><div className="max-w-7xl mx-auto px-4 py-8">
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">Descubre Recetas</h1>
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <SearchBar onSearch={(v) => { setSearch(v); setPage(1); }} className="flex-1 md:w-64" />
        <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} className="input-field w-auto"><option value="">Todas</option>{categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select>
        <select value={orden} onChange={(e) => { setOrden(e.target.value); setPage(1); }} className="input-field w-auto"><option value="recientes">Más recientes</option><option value="rating">Mejor calificadas</option><option value="populares">Más populares</option></select>
      </div>
    </div>
    {loading ? <Spinner className="py-20" /> : recipes.length === 0 ? <EmptyState icon={HiOutlineHome} title="No hay recetas" message={search?`No se encontraron "${search}"`:'Aún no hay recetas'} /> : <><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{recipes.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}</div><Pagination page={page} total={total} limit={12} onChange={setPage} /></>}
  </div></FadeIn>;
}
