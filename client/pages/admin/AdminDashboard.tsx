import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, Post } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
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

const POSTS_PER_PAGE = 10;

export default function AdminDashboard() {
  const { canCreatePosts, canEditPosts, canDeletePosts, canPublishPosts } = useRole();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log('AdminDashboard - Permissões recebidas:', {
    canCreatePosts,
    canEditPosts,
    canDeletePosts,
    canPublishPosts
  });

  useEffect(() => {
    console.log('AdminDashboard - Carregando posts...');
    fetchPosts();
  }, [currentPage, search]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      console.log('AdminDashboard - Buscando posts...');
      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(currentPage * POSTS_PER_PAGE, (currentPage + 1) * POSTS_PER_PAGE - 1);

      if (search) {
        console.log('AdminDashboard - Aplicando filtro:', search);
        query = query.ilike('title', `%${search}%`);
      }

      console.log('AdminDashboard - Executando query...');
      const { data, error, count } = await query;

      if (error) {
        console.error('AdminDashboard - Erro na query:', error);
        throw error;
      }

      console.log('AdminDashboard - Posts recebidos:', data?.length || 0);
      console.log('AdminDashboard - Total count:', count);
      setPosts(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('AdminDashboard - Erro no fetchPosts:', err);
      toast.error('Erro ao carregar posts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast.success('Post excluído com sucesso!');
      fetchPosts();
    } catch (err: any) {
      toast.error('Erro ao excluir post: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gerenciar Posts</h2>
          <p className="text-foreground/60">
            Total: {totalCount} post{totalCount !== 1 ? 's' : ''}
          </p>
        </div>

        {(canCreatePosts || canPublishPosts) && (
          <Button
            onClick={() => navigate('/admin/editor')}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Novo Post
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input
            placeholder="Buscar por título..."
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
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-foreground/60">
                  Nenhum post encontrado.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={post.status === 'published' ? 'default' : 'secondary'}
                      className="gap-1"
                    >
                      {post.status === 'published' ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.author || '-'}</TableCell>
                  <TableCell>
                    {format(new Date(post.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(canEditPosts || canPublishPosts) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/editor?id=${post.id}`)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                      {canDeletePosts && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(post.id)}
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

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
