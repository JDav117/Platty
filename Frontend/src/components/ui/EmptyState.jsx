import { HiOutlineInbox } from 'react-icons/hi';
export default function EmptyState({ icon: Icon = HiOutlineInbox, title, message, action }) {
  return <div className="flex flex-col items-center justify-center py-16 text-center">
    <Icon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
    {message && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-sm">{message}</p>}
    {action}
  </div>;
}
