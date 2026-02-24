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
import { StatsGrid } from './StatsCards';
import { PostsChart } from './PostsChart';

const POSTS_PER_PAGE = 10;

export default function AdminDashboard() {
  const { canCreatePosts, canEditPosts, canDeletePosts, canPublishPosts } = useRole();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [draftsCount, setDraftsCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
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
    fetchStats();
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

  const fetchStats = async () => {
    try {
      // Fetch drafts count
      const { count: drafts } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      // Fetch published count
      const { count: published } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // Fetch active users count (users who created posts)
      const { count: activeUsers } = await supabase
        .from('posts')
        .select('author', { count: 'exact', head: true })
        .not('author', 'is', null);

      setDraftsCount(drafts || 0);
      setPublishedCount(published || 0);
      setActiveUsersCount(activeUsers || 0);
    } catch (err: any) {
      console.error('AdminDashboard - Erro no fetchStats:', err);
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
      {/* Stats Grid */}
      <StatsGrid drafts={draftsCount} published={publishedCount} activeUsers={activeUsersCount} />

      {/* Chart and Posts Total */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PostsChart total={totalCount} />
        </div>
      </div>

      {/* Gerenciar Posts Section */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Posts</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {totalCount} post{totalCount !== 1 ? 's' : ''}
            </p>
          </div>

          {(canCreatePosts || canPublishPosts) && (
            <Button
              onClick={() => navigate('/admin/editor')}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Novo Post
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por título..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(0);
              }}
              className="pl-10 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50">
                <TableHead className="text-gray-900">Título</TableHead>
                <TableHead className="text-gray-900">Status</TableHead>
                <TableHead className="text-gray-900">Autor</TableHead>
                <TableHead className="text-gray-900">Data</TableHead>
                <TableHead className="text-right text-gray-900">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-600">
                    Nenhum post encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell className="font-medium max-w-xs truncate text-gray-900">
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
                    <TableCell className="text-gray-700">{post.author || '-'}</TableCell>
                    <TableCell className="text-gray-700">
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
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
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
      </div>

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
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
