import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', variant = 'danger', requireText = '', loading }) {
  const [v, setV] = useState('');
  return <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
    {requireText && <div className="mb-4"><p className="text-sm text-gray-500 mb-2">Escribe <strong>{requireText}</strong> para confirmar:</p><input type="text" value={v} onChange={(e) => setV(e.target.value)} className="input-field" placeholder={requireText} /></div>}
    <div className="flex justify-end gap-3">
      <Button variant="secondary" onClick={onClose}>Cancelar</Button>
      <Button variant={variant} onClick={onConfirm} disabled={requireText ? v !== requireText : false} loading={loading}>{confirmText}</Button>
    </div>
  </Modal>;
}
