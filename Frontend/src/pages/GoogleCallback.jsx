import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Spinner from '../components/ui/Spinner';

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    const userData = params.get('user');

    if (token && refreshToken && userData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userData));
        setAuth(parsed, token, refreshToken);
        navigate('/explorar', { replace: true });
      } catch {
        navigate('/login?error=invalid_data', { replace: true });
      }
    } else {
      navigate('/login?error=no_tokens', { replace: true });
    }
  }, []);

  if (user) { navigate('/explorar', { replace: true }); return null; }
  return <div className="min-h-screen flex items-center justify-center"><Spinner className="py-20" /></div>;
}
