import { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Button from '../components/ui/Button';
import FadeIn from '../components/ui/FadeIn';
import { adminAPI } from '../api';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

const meses = [{value:1,label:'Enero'},{value:2,label:'Febrero'},{value:3,label:'Marzo'},{value:4,label:'Abril'},{value:5,label:'Mayo'},{value:6,label:'Junio'},{value:7,label:'Julio'},{value:8,label:'Agosto'},{value:9,label:'Septiembre'},{value:10,label:'Octubre'},{value:11,label:'Noviembre'},{value:12,label:'Diciembre'}];

export default function AdminReports() {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [loading, setLoading] = useState({ pdf: false, xlsx: false });

  const download = async (fmt) => {
    setLoading((p) => ({ ...p, [fmt]: true }));
    try { const r = await adminAPI.getReport(mes, anio, fmt); saveAs(new Blob([r.data]), `reporte-${mes}-${anio}.${fmt}`); toast.success(`Reporte descargado (${fmt.toUpperCase()})`); }
    catch { toast.error('Error al descargar reporte'); } finally { setLoading((p) => ({ ...p, [fmt]: false })); }
  };

  return <div className="flex min-h-[calc(100vh-4rem)]"><AdminSidebar /><div className="flex-1 p-6">
    <FadeIn><h1 className="text-2xl font-bold mb-6">Reportes Mensuales</h1></FadeIn>
    <div className="glass-strong p-6 max-w-md rounded-2xl">
      <div className="flex gap-3 mb-6">
        <div><label className="block text-sm font-medium mb-1">Mes</label><select value={mes} onChange={(e)=>setMes(parseInt(e.target.value))} className="input-field">{meses.map((m)=><option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-1">Año</label><input type="number" value={anio} onChange={(e)=>setAnio(parseInt(e.target.value))} className="input-field w-24" min={2024} max={2030} /></div>
      </div>
      <div className="flex gap-3"><Button onClick={()=>download('pdf')} loading={loading.pdf}>Descargar PDF</Button><Button onClick={()=>download('xlsx')} loading={loading.xlsx} variant="secondary">Descargar Excel</Button></div>
    </div>
  </div></div>;
}
