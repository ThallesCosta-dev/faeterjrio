import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase, Profile, UserRole, ROLE_PERMISSIONS } from '@/lib/supabase';

// Debug para verificar se ROLE_PERMISSIONS está definido
console.log('useRole - ROLE_PERMISSIONS disponível:', typeof ROLE_PERMISSIONS, ROLE_PERMISSIONS);

type Permission = typeof ROLE_PERMISSIONS[UserRole];

interface UseRoleReturn {
  profile: Profile | null;
  role: UserRole | null;
  permissions: Permission;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;
  canCreatePosts: boolean;
  canEditPosts: boolean;
  canDeletePosts: boolean;
  canPublishPosts: boolean;
  canManageUsers: boolean;
  canViewAuditLogs: boolean;
  canEditOthersPosts: boolean;
  canDeleteOthersPosts: boolean;
  checkPermission: (permission: keyof Permission) => boolean;
  hasRole: (requiredRole: UserRole | UserRole[]) => boolean;
  refreshProfile: () => Promise<void>;
}

export function useRole(): UseRoleReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (isFetching) return; // Evitar múltiplas chamadas
    
    setIsFetching(true);
    try {
      console.log('useRole - Buscando usuário atual...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('useRole - Nenhum usuário logado');
        setProfile(null);
        setLoading(false);
        setIsFetching(false);
        return;
      }

      console.log('useRole - Usuário encontrado:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('useRole - Erro ao buscar profile:', error);
        setProfile(null);
      } else {
        console.log('useRole - Profile encontrado:', data);
        setProfile(data);
      }
    } catch (err) {
      console.error('useRole - Erro no fetchProfile:', err);
      setProfile(null);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [isFetching]);

  useEffect(() => {
    fetchProfile();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Removido fetchProfile das dependências

  const role = profile?.role || null;
  const permissions = useMemo(() => {
    if (!profile || !role) {
      console.log('useRole - Profile/role ainda não carregado:', { profile, role });
      return ROLE_PERMISSIONS.viewer;
    }
    const perms = ROLE_PERMISSIONS[role];
    console.log('useRole - Memo calc:', { role, perms, hasRole: !!role });
    return perms;
  }, [role, profile]);

  const checkPermission = useCallback((permission: keyof Permission) => {
    return permissions[permission] || false;
  }, [permissions]);

  const hasRole = useCallback((requiredRole: UserRole | UserRole[]) => {
    if (!role) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    return role === requiredRole;
  }, [role]);

  return {
    profile,
    role,
    permissions,
    loading,
    isAdmin: role === 'admin',
    isEditor: role === 'editor',
    isViewer: role === 'viewer',
    canCreatePosts: checkPermission('canCreatePosts'),
    canEditPosts: checkPermission('canEditPosts'),
    canDeletePosts: checkPermission('canDeletePosts'),
    canPublishPosts: checkPermission('canPublishPosts'),
    canManageUsers: checkPermission('canManageUsers'),
    canViewAuditLogs: checkPermission('canViewAuditLogs'),
    canEditOthersPosts: checkPermission('canEditOthersPosts'),
    canDeleteOthersPosts: checkPermission('canDeleteOthersPosts'),
    checkPermission,
    hasRole,
    refreshProfile: fetchProfile,
  };
}
