import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usersAPI } from '../../api';
import Button from '../ui/Button';
import ConfirmModal from '../ui/ConfirmModal';
import Modal from '../ui/Modal';
import { toast } from 'sonner';

export default function ProfileSettings() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [pw, setPw] = useState({ actual: '', nueva: '' });
  const [loading, setLoading] = useState(false);
  const [showDeact, setShowDeact] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [delPw, setDelPw] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const changePw = async (e) => {
    e.preventDefault();
    if (pw.nueva.length < 8) { toast.error('Mín. 8 caracteres'); return; }
    setLoading(true);
    try { await usersAPI.changePassword({ contraseñaActual: pw.actual, nuevaContraseña: pw.nueva }); toast.success('Contraseña actualizada'); setPw({ actual: '', nueva: '' }); }
    catch (err) { toast.error(err.response?.data?.message||'Error'); } finally { setLoading(false); }
  };
  const closeSess = async () => { try { await usersAPI.closeSessions(); toast.success('Sesiones cerradas'); setShowClose(false); } catch { toast.error('Error'); } };
  const deactivate = async () => { try { await usersAPI.deactivateAccount(); toast.success('Cuenta desactivada'); logout(); navigate('/'); } catch { toast.error('Error'); } };
  const deleteAcc = async () => { try { await usersAPI.deleteAccount(delPw); toast.success('Cuenta eliminada'); logout(); navigate('/'); } catch (err) { toast.error(err.response?.data?.message||'Error'); } };

  return <div className="space-y-6">
    <div className="card p-6">
      <h3 className="text-lg font-bold mb-4">Cambiar Contraseña</h3>
      <form onSubmit={changePw} className="space-y-3 max-w-md">
        <input type="password" value={pw.actual} onChange={(e)=>setPw({...pw, actual: e.target.value})} className="input-field" placeholder="Contraseña actual" required />
        <input type="password" value={pw.nueva} onChange={(e)=>setPw({...pw, nueva: e.target.value})} className="input-field" placeholder="Nueva contraseña (mín. 8 caracteres)" required />
        <Button type="submit" loading={loading}>Actualizar</Button>
      </form>
    </div>

    <div className="card p-6">
      <h3 className="text-lg font-bold mb-4">Sesiones</h3>
      <Button variant="outline" size="sm" onClick={()=>setShowClose(true)}>Cerrar sesiones en otros dispositivos</Button>
    </div>

    <div className="card p-6 border-red-200 dark:border-red-900">
      <h3 className="text-lg font-bold text-red-600 mb-2">Zona de Peligro</h3>
      <p className="text-sm text-gray-500 mb-4">Estas acciones son irreversibles</p>
      <div className="flex gap-3">
        <Button variant="secondary" size="sm" onClick={()=>setShowDeact(true)}>Desactivar Cuenta</Button>
        <Button variant="danger" size="sm" onClick={()=>setShowDel(true)}>Eliminar Cuenta</Button>
      </div>
    </div>

    <ConfirmModal isOpen={showClose} onClose={()=>setShowClose(false)} onConfirm={closeSess} title="Cerrar sesiones" message="Se cerrarán todas las sesiones activas en otros dispositivos." confirmText="Cerrar" variant="primary" />
    <ConfirmModal isOpen={showDeact} onClose={()=>setShowDeact(false)} onConfirm={deactivate} title="Desactivar Cuenta" message="Tu cuenta será desactivada y no podrás iniciar sesión." confirmText="Desactivar" variant="danger" />

    <Modal isOpen={showDel} onClose={()=>setShowDel(false)} title="Eliminar Cuenta" size="sm">
      <p className="text-gray-600 dark:text-gray-400 mb-4">Esta acción es irreversible. Se eliminarán todos tus datos, recetas, comentarios y favoritos.</p>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Confirma tu contraseña</label>
        <input type="password" value={delPw} onChange={(e)=>setDelPw(e.target.value)} className="input-field" placeholder="Tu contraseña actual" />
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Escribe <strong>ELIMINAR</strong> para confirmar:</p>
        <input type="text" value={confirmText} onChange={(e)=>setConfirmText(e.target.value)} className="input-field" placeholder="ELIMINAR" />
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={()=>setShowDel(false)}>Cancelar</Button>
        <Button variant="danger" onClick={deleteAcc} disabled={confirmText!=='ELIMINAR'}>Eliminar cuenta</Button>
      </div>
    </Modal>
  </div>;
}
