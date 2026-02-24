import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FileText, Users, Settings, LogOut, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdminSidebarProps {
  profile: any;
  role: string;
  canManageUsers: boolean;
  onLogout: () => void;
}

export default function AdminSidebar({ profile, role, canManageUsers, onLogout }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-8 h-8" />
          <div>
            <h1 className="font-bold text-white">FAETERJ-Rio CMS</h1>
            <p className="text-xs text-white/60">Content Management</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {profile?.full_name?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'Admin'}</p>
            <Badge variant={role === 'admin' ? 'default' : 'secondary'} className="text-xs mt-1">
              {role === 'admin' ? 'Admin' : role === 'editor' ? 'Editor' : 'Usuário'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <NavItem
          icon={<LayoutDashboard className="w-5 h-5" />}
          label="Dashboard"
          onClick={() => navigate('/admin/dashboard')}
          active={isActive('/admin/dashboard')}
        />

        {(role === 'admin' || role === 'editor') && (
          <NavItem
            icon={<FileText className="w-5 h-5" />}
            label="Novo Post"
            onClick={() => navigate('/admin/editor')}
            active={isActive('/admin/editor')}
          />
        )}

        {canManageUsers && (
          <NavItem
            icon={<Users className="w-5 h-5" />}
            label="Usuários"
            onClick={() => navigate('/admin/users')}
            active={isActive('/admin/users')}
          />
        )}

        <NavItem
          icon={<Settings className="w-5 h-5" />}
          label="Configurações"
          onClick={() => {}}
          active={false}
          disabled
        />
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={onLogout}
          className="w-full gap-2 bg-white/10 hover:bg-white/20 text-white"
          variant="ghost"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  onClick,
  active,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
        active
          ? 'bg-primary text-white'
          : disabled
            ? 'text-white/40 cursor-not-allowed'
            : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
