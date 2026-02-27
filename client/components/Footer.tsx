import {
  Mail,
  MapPin,
  Clock,
  Linkedin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Links Rápidos */}
          <div>
            <h4 className="font-bold text-lg mb-6">Links Rápidos</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://faeterj-rio.edu.br/central/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Central de Atendimento
                </a>
              </li>
              <li>
                <a
                  href="https://faeterj-rio.edu.br/coruja/autenticar/login_controle.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Portal do Aluno
                </a>
              </li>
              <li>
                <a
                  href="/matriz-ementas"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Matriz e Ementas
                </a>
              </li>
              <li>
                <a
                  href="/admin/login"
                  className="text-white/50 hover:text-white/80 transition-colors text-xs"
                >
                  Área Administrativa
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-white/80">
                  Rua Clarimundo de Melo, 847
                  <br />
                  Quintino Bocaiuva
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:sec_acad@faeterj-rio.edu.br"
                  className="text-white/80 hover:text-white transition-colors text-xs"
                >
                  sec_acad@faeterj-rio.edu.br
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="font-bold text-lg mb-6">Redes Sociais</h4>
            <p className="text-white/80 text-sm mb-4">
              Siga-nos para atualizações e novidades
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/school/faeterj-rio/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
            <p>
              &copy; 2026 FAETERJ-Rio - Faculdade de Educação Tecnológica do Estado
              do Rio de Janeiro.
            </p>
            <p className="text-xs">
              Desenvolvido por Thalles Costa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
