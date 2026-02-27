import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { supabase, Post } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RichTextViewer } from '@/components/RichTextViewer';
import { 
  Loader2, 
  Calendar, 
  User, 
  ArrowLeft,
  Share2,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts or slug changes
    window.scrollTo(0, 0);
    
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', postSlug)
        .eq('status', 'published')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setNotFound(true);
        } else {
          throw error;
        }
      } else {
        setPost(data);
      }
    } catch (err: any) {
      console.error('Erro ao carregar post:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title || 'Comunicado FAETERJ-Rio',
          text: post?.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Compartilhamento cancelado');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !post) {
    return <Navigate to="/comunicados" replace />;
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Hero with Cover Image */}
      {post.cover_image && (
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="container mx-auto">
              <Link to="/comunicados">
                <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm cursor-pointer">
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  Voltar para Comunicados
                </Badge>
              </Link>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-4xl font-bold text-white max-w-4xl"
              >
                {post.title}
              </motion.h1>
            </div>
          </div>
        </div>
      )}

      {/* Header (when no cover image) */}
      {!post.cover_image && (
        <section className="relative pt-32 pb-20 bg-primary text-white overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <Link to="/comunicados">
              <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm cursor-pointer">
                <ArrowLeft className="w-3 h-3 mr-1" />
                Voltar para Comunicados
              </Badge>
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold text-white max-w-4xl"
            >
              {post.title}
            </motion.h1>
          </div>
        </section>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white rounded-lg border border-border"
          >
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Calendar className="w-4 h-4" />
              <span>
                Publicado em {format(new Date(post.created_at), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
              </span>
            </div>
            {post.author && (
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <User className="w-4 h-4" />
                <span>Por {post.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Clock className="w-4 h-4" />
              <span>
                Atualizado em {format(new Date(post.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="ml-auto gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
          </motion.div>

          {/* Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg border border-border p-6 md:p-10"
          >
            <RichTextViewer
              html={post.content}
              className="prose prose-slate max-w-none prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80 prose-p:whitespace-pre-wrap prose-li:whitespace-pre-wrap"
            />
          </motion.article>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex items-center justify-between"
          >
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Link to="/comunicados">
              <Button variant="ghost" className="text-primary">
                Ver todos os comunicados
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
