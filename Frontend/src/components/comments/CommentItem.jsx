import { useState } from 'react';
import Avatar from '../ui/Avatar';
import CommentForm from './CommentForm';
import { formatDateRelative } from '../../utils/formatters';
import { HiPencil, HiTrash, HiReply } from 'react-icons/hi';

export default function CommentItem({ comment, currentUser, onReply, onDelete, onUpdate }) {
  const [showReply, setShowReply] = useState(false);
  const [editing, setEditing] = useState(false);
  const [edit, setEdit] = useState(comment.contenido);
  const isOwner = currentUser?.id === comment.usuario?.id;

  return <div className="space-y-3">
    <div className="flex gap-3">
      <Avatar nombre1={comment.usuario?.nombre1} apellido1={comment.usuario?.apellido1} avatar_url={comment.usuario?.avatar_url} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <div><span className="text-sm font-semibold">{comment.usuario?.nombre1} {comment.usuario?.apellido1}</span><span className="text-xs text-gray-400 ml-2">{formatDateRelative(comment.created_at)}</span></div>
            {isOwner && <div className="flex gap-1"><button onClick={() => setEditing(!editing)} className="p-1 text-gray-400 hover:text-gray-600"><HiPencil className="w-3.5 h-3.5" /></button><button onClick={() => onDelete(comment.id)} className="p-1 text-gray-400 hover:text-red-500"><HiTrash className="w-3.5 h-3.5" /></button></div>}
          </div>
          {editing ? <div className="flex gap-2"><input type="text" value={edit} onChange={(e) => setEdit(e.target.value)} className="input-field text-sm" autoFocus /><button onClick={()=>{onUpdate(comment.id, edit);setEditing(false);}} className="text-primary-600 text-sm font-medium">Guardar</button><button onClick={()=>setEditing(false)} className="text-gray-500 text-sm">Cancelar</button></div>
          : <p className="text-sm text-gray-700 dark:text-gray-300">{comment.contenido}</p>}
        </div>
        {currentUser && !editing && <button onClick={() => setShowReply(!showReply)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 mt-1 ml-2"><HiReply className="w-3 h-3" />Responder</button>}
        {showReply && <div className="mt-2 ml-2"><CommentForm onSubmit={(c) => { onReply(c); setShowReply(false); }} placeholder="Escribe una respuesta..." autoFocus /></div>}
      </div>
    </div>
    {comment.respuestas?.map((r) => <div key={r.id} className="ml-12"><CommentItem comment={r} currentUser={currentUser} onDelete={onDelete} onUpdate={onUpdate} /></div>)}
  </div>;
}
