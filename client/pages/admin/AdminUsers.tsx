import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, Profile, UserRole, ROLE_PERMISSIONS } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Shield,
  Eye,
  Mail,
  Phone,
  Building2
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRole } from '@/hooks/useRole';

const USERS_PER_PAGE = 10;

export default function AdminUsers() {
  const navigate = useNavigate();
  const { isAdmin, canManageUsers, loading: roleLoading } = useRole();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    cpf: '',
    institutional_email: '',
    department: '',
    phone: '',
    role: 'viewer' as UserRole,
    is_active: true,
  });

  // Check permission
  useEffect(() => {
    if (roleLoading) return;

    if (!canManageUsers) {
      toast.error('Você não tem permissão para gerenciar usuários');
      navigate('/admin/dashboard');
    }
  }, [canManageUsers, roleLoading, navigate]);

  const fetchUsers = useCallback(async () => {
    if (!canManageUsers || roleLoading) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(currentPage * USERS_PER_PAGE, (currentPage + 1) * USERS_PER_PAGE - 1);

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,institutional_email.ilike.%${search}%,cpf.ilike.%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setUsers(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      toast.error('Erro ao carregar usuários: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, canManageUsers, roleLoading]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async () => {
    try {
      // Normalizar CPF e telefone
      const cpfDigits = formData.cpf.replace(/\D/g, '');
      const formattedCpf =
        cpfDigits.length === 11
          ? cpfDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
          : formData.cpf;

      const phoneDigits = formData.phone.replace(/\D/g, '');
      let formattedPhone = formData.phone;
      if (phoneDigits.length === 10) {
        formattedPhone = phoneDigits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else if (phoneDigits.length === 11) {
        formattedPhone = phoneDigits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }

      // 1. Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            role: formData.role,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Update profile with additional data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            cpf: formattedCpf,
            institutional_email: formData.institutional_email,
            department: formData.department,
            phone: formattedPhone,
            role: formData.role,
            is_active: formData.is_active,
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        toast.success('Usuário criado com sucesso!');
        setIsDialogOpen(false);
        resetForm();
        fetchUsers();
      }
    } catch (err: any) {
      toast.error('Erro ao criar usuário: ' + err.message);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      // Normalizar CPF e telefone
      const cpfDigits = formData.cpf.replace(/\D/g, '');
      const formattedCpf =
        cpfDigits.length === 11
          ? cpfDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
          : formData.cpf;

      const phoneDigits = formData.phone.replace(/\D/g, '');
      let formattedPhone = formData.phone;
      if (phoneDigits.length === 10) {
        formattedPhone = phoneDigits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else if (phoneDigits.length === 11) {
        formattedPhone = phoneDigits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          cpf: formattedCpf,
          institutional_email: formData.institutional_email,
          department: formData.department,
          phone: formattedPhone,
          role: formData.role,
          is_active: formData.is_active,
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      toast.success('Usuário atualizado com sucesso!');
      setIsDialogOpen(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      toast.error('Erro ao atualizar usuário: ' + err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteId) return;

    try {
      // No client podemos apenas desativar o usuário via profile.
      // A exclusão completa em auth.users deve ser feita pelo dashboard do Supabase.
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', deleteId);

      if (updateError) throw updateError;
      
      toast.success('Usuário desativado com sucesso!');
      fetchUsers();
    } catch (err: any) {
      toast.error('Erro ao excluir usuário: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const openEditDialog = (user: Profile) => {
    setEditingUser(user);
    setFormData({
      email: user.institutional_email || '',
      password: '',
      full_name: user.full_name || '',
      cpf: user.cpf || '',
      institutional_email: user.institutional_email || '',
      department: user.department || '',
      phone: user.phone || '',
      role: user.role,
      is_active: user.is_active,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      full_name: '',
      cpf: '',
      institutional_email: '',
      department: '',
      phone: '',
      role: 'viewer',
      is_active: true,
    });
  };

  const getRoleBadge = (role: UserRole) => {
    const variants: Record<UserRole, 'default' | 'secondary' | 'destructive'> = {
      admin: 'default',
      editor: 'secondary',
      viewer: 'destructive',
    };
    return (
      <Badge variant={variants[role]}>
        {role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : 
         role === 'editor' ? <UserCog className="w-3 h-3 mr-1" /> : 
         <Eye className="w-3 h-3 mr-1" />}
        {role === 'admin' ? 'Admin' : role === 'editor' ? 'Editor' : 'Visualizador'}
      </Badge>
    );
  };

  const totalPages = Math.ceil(totalCount / USERS_PER_PAGE);

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!canManageUsers) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gerenciar Usuários</h2>
          <p className="text-foreground/60">
            Total: {totalCount} usuário{totalCount !== 1 ? 's' : ''}
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={openCreateDialog}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Novo Usuário
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(0);
            }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email Institucional</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-foreground/60">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className={!user.is_active ? 'opacity-50' : ''}>
                  <TableCell className="font-medium">
                    {user.full_name || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="w-3 h-3 text-foreground/40" />
                      {user.institutional_email || '-'}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {user.cpf ? user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '-'}
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? 'outline' : 'secondary'}>
                      {user.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground/60">
            Página {currentPage + 1} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? 'Atualize as informações do usuário abaixo.' 
                : 'Preencha as informações para criar um novo usuário.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {!editingUser && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="usuario@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Nome completo do usuário"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, '') })}
                placeholder="000.000.000-00"
                maxLength={11}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutional_email">Email Institucional</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <Input
                  id="institutional_email"
                  className="pl-10"
                  value={formData.institutional_email}
                  onChange={(e) => setFormData({ ...formData, institutional_email: e.target.value })}
                  placeholder="usuario@faeterj-rio.edu.br"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <Input
                  id="department"
                  className="pl-10"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Ex: TI, Administração, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <Input
                  id="phone"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(21) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Função *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Administrador - Acesso total
                    </div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex items-center gap-2">
                      <UserCog className="w-4 h-4" />
                      Editor - Criar e editar posts
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Visualizador - Apenas visualizar
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_active">Status</Label>
              <Select
                value={formData.is_active ? 'true' : 'false'}
                onValueChange={(value) => setFormData({ ...formData, is_active: value === 'true' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={editingUser ? handleUpdateUser : handleCreateUser}
              className="bg-primary hover:bg-primary/90"
              disabled={!editingUser && (!formData.email || !formData.password)}
            >
              {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
