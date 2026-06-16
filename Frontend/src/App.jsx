import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import FadeIn from './components/ui/FadeIn';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import GoogleCallback from './pages/GoogleCallback';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminRecipes from './pages/AdminRecipes';
import AdminCategories from './pages/AdminCategories';
import AdminAudit from './pages/AdminAudit';
import AdminReports from './pages/AdminReports';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

export default function App() {
  const { checkAuth, loading } = useAuthStore();
  const { theme } = useUIStore();
  const location = useLocation();
  useEffect(() => { checkAuth(); }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" /></div>;
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" duration={2000} toastOptions={{ style: { background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }, className: 'dark:bg-gray-800/90 dark:border-gray-700' }} />
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <div key={location.pathname} className="animate-fade-in">
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/explorar" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/recipes/:slug" element={<ProtectedRoute><RecipeDetailPage /></ProtectedRoute>} />
            <Route path="/crear-receta" element={<ProtectedRoute><CreateRecipePage /></ProtectedRoute>} />
            <Route path="/editar-receta/:id" element={<ProtectedRoute><EditRecipePage /></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/perfil/:userId" element={<ProfilePage />} />
            <Route path="/favoritos" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/usuarios" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/recetas" element={<AdminRoute><AdminRecipes /></AdminRoute>} />
            <Route path="/admin/categorias" element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/auditoria" element={<AdminRoute><AdminAudit /></AdminRoute>} />
            <Route path="/admin/reportes" element={<AdminRoute><AdminReports /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
