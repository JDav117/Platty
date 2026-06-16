import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useUIStore } from '../store/uiStore';
import { recipesAPI } from '../api';
import ProfileLayout from '../components/layout/ProfileLayout';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileRecipes from '../components/profile/ProfileRecipes';
import ProfileFavorites from '../components/profile/ProfileFavorites';
import ProfileSettings from '../components/profile/ProfileSettings';
import FadeIn from '../components/ui/FadeIn';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { userId: paramUserId } = useParams();
  const { user: authUser } = useAuthStore();
  const { profileTab, setProfileTab } = useUIStore();
  const { profile, fetchProfile } = useUserStore();
  const [stats, setStats] = useState(null);

  const profileUserId = paramUserId ? parseInt(paramUserId) : authUser?.id;
  const isOwner = !paramUserId || parseInt(paramUserId) === authUser?.id;

  useEffect(() => {
    if (isOwner) fetchProfile();
    recipesAPI.getByUser(profileUserId, { limit: 1 }).then(({ data }) => setStats({ recetas: data.total||0, favoritos: 0 })).catch(() => toast.error('Error al cargar perfil'));
  }, [profileUserId]);

  const displayUser = isOwner ? profile : null;

  return <FadeIn><ProfileLayout user={{ ...displayUser, isOwner }} activeTab={profileTab} onTabChange={setProfileTab} stats={stats}>
    {profileTab === 'info' && <ProfileInfo user={displayUser} />}
    {profileTab === 'recetas' && <ProfileRecipes userId={profileUserId} />}
    {profileTab === 'favoritos' && isOwner && <ProfileFavorites />}
    {profileTab === 'configuracion' && isOwner && <ProfileSettings />}
  </ProfileLayout></FadeIn>;
}
