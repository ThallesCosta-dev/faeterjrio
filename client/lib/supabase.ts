import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para o CMS
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image?: string;
  status: 'draft' | 'published';
  author?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostInput {
  title: string;
  slug: string;
  content: string;
  cover_image?: string;
  status: 'draft' | 'published';
  author?: string;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {}

// Tipos para Sistema de Roles
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface Profile {
  id: string;
  full_name?: string;
  cpf?: string;
  institutional_email?: string;
  department?: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileInput {
  full_name?: string;
  cpf?: string;
  institutional_email?: string;
  department?: string;
  phone?: string;
  avatar_url?: string;
  role?: UserRole;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  table_name?: string;
  record_id?: string;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
  created_at: string;
}

// Permissões por role
export const ROLE_PERMISSIONS = {
  admin: {
    canCreatePosts: true,
    canEditPosts: true,
    canDeletePosts: true,
    canPublishPosts: true,
    canManageUsers: true,
    canViewAuditLogs: true,
    canEditOthersPosts: true,
    canDeleteOthersPosts: true,
  },
  editor: {
    canCreatePosts: true,
    canEditPosts: true,
    canDeletePosts: true,
    canPublishPosts: true,
    canManageUsers: false,
    canViewAuditLogs: false,
    canEditOthersPosts: true,
    canDeleteOthersPosts: true,
  },
  viewer: {
    canCreatePosts: false,
    canEditPosts: false,
    canDeletePosts: false,
    canPublishPosts: false,
    canManageUsers: false,
    canViewAuditLogs: false,
    canEditOthersPosts: false,
    canDeleteOthersPosts: false,
  },
} as const;
