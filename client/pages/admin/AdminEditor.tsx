import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Save, 
  ArrowLeft, 
  Image as ImageIcon,
  X,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { slugify } from '@/lib/utils';
import { useRole } from '@/hooks/useRole';
import { RichTextEditor } from '@/components/RichTextEditor';
import { RichTextViewer } from '@/components/RichTextViewer';

export default function AdminEditor() {
  const { canCreatePosts, canEditPosts, canPublishPosts, profile, loading: roleLoading } = useRole();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(!!postId);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    cover_image: '',
    status: 'draft' as 'draft' | 'published',
    author: '',
  });

  useEffect(() => {
    // Esperar o carregamento das roles antes de validar permissões
    if (roleLoading) return;

    if (postId) {
      if (!canEditPosts) {
        toast.error('Você não tem permissão para editar posts');
        navigate('/admin/dashboard');
        return;
      }
      fetchPost(postId);
    } else {
      if (!canCreatePosts) {
        toast.error('Você não tem permissão para criar posts');
        navigate('/admin/dashboard');
        return;
      }
    }
  }, [postId, roleLoading, canCreatePosts, canEditPosts, navigate]);

  const fetchPost = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title,
          slug: data.slug,
          content: data.content,
          cover_image: data.cover_image || '',
          status: data.status,
          author: data.author || '',
        });
      }
    } catch (err: any) {
      toast.error('Erro ao carregar post: ' + err.message);
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || slugify(title),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Iniciando upload:', file.name, file.size, file.type);
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      console.log('Fazendo upload para:', filePath);

      const { data, error: uploadError } = await supabase.storage
        .from('cms-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      console.log('Resultado upload:', { data, error: uploadError });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cms-images')
        .getPublicUrl(filePath);

      console.log('URL pública:', publicUrl);

      setFormData(prev => ({ ...prev, cover_image: publicUrl }));
      toast.success('Imagem carregada com sucesso!');
    } catch (err: any) {
      console.error('Erro no upload:', err);
      toast.error('Erro ao fazer upload: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('O slug é obrigatório');
      return;
    }

    setSaving(true);
    try {
      const postData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        cover_image: formData.cover_image || null,
        status: formData.status,
        author: formData.author || profile?.full_name || null,
      };

      if (postId) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', postId);

        if (error) throw error;
        toast.success('Post atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('posts')
          .insert(postData);

        if (error) throw error;
        toast.success('Post criado com sucesso!');
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      if (err.message?.includes('unique constraint')) {
        toast.error('Já existe um post com este slug. Use um slug diferente.');
      } else {
        toast.error('Erro ao salvar: ' + err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/dashboard')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => window.open(`/comunicados/${formData.slug}`, '_blank')}
            disabled={!postId}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Visualizar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || (formData.status === 'published' && !canPublishPosts)}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-primary">
        {postId ? 'Editar Post' : 'Novo Post'}
      </h2>

      {/* Form */}
      <div className="space-y-6">
        {/* Title and Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Digite o título do post"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: slugify(e.target.value) }))}
              placeholder="ex: meu-post-exemplo"
            />
          </div>
        </div>

        {/* Status and Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'draft' | 'published') => {
                if (value === 'published' && !canPublishPosts) {
                  toast.error('Você não tem permissão para publicar posts');
                  return;
                }
                setFormData(prev => ({ ...prev, status: value }));
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Autor</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Nome do autor"
            />
          </div>
        </div>

        {/* Cover Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Imagem de Capa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.cover_image ? (
              <div className="relative w-full max-w-md">
                <img
                  src={formData.cover_image}
                  alt="Cover"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, cover_image: '' }))}
                  className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                {uploadingImage ? (
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 mx-auto text-foreground/40 mb-2" />
                    <p className="text-foreground/60">Clique para fazer upload da imagem</p>
                    <p className="text-xs text-foreground/40 mt-1">PNG, JPG ou WebP</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="write">Escrever</TabsTrigger>
            <TabsTrigger value="preview">Pré-visualizar</TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="space-y-4">
            <div className="space-y-2">
              <Label>Conteúdo</Label>

              <RichTextEditor
                value={formData.content}
                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
              />
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="border border-border rounded-lg p-6 min-h-[400px]">
              {formData.content ? (
                <RichTextViewer
                  html={formData.content}
                  className="prose prose-slate max-w-none prose-p:whitespace-pre-wrap prose-li:whitespace-pre-wrap"
                />
              ) : (
                <p className="text-foreground/40 italic">Nenhum conteúdo para preview...</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
