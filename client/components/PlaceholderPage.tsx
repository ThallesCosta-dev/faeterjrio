import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-16 h-16 bg-secondary rounded-lg mx-auto flex items-center justify-center mb-6">
            <div className="text-3xl">🚀</div>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-4">{title}</h1>
          <p className="text-foreground/60 mb-6">
            {description ||
              "Esta página está em desenvolvimento. Continue acompanhando para conteúdo em breve!"}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Quer que a gente preench esse conteúdo? Nos avise! Estamos sempre
            melhorando a plataforma.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}
