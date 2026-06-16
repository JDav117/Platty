import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
export default function NotFound() {
  return <div className="min-h-[80vh] flex flex-col items-center justify-center px-4"><h1 className="text-8xl font-extrabold text-primary-600 mb-4">404</h1><p className="text-xl text-gray-500 mb-8">Página no encontrada</p><Link to="/"><Button>Volver al inicio</Button></Link></div>;
}
