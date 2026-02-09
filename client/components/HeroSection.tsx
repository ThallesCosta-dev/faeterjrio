import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Duotone Background with Grid Pattern */}
      <div className="absolute inset-0 duotone-overlay">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.1) 75%, rgba(255, 255, 255, 0.1) 76%, transparent 77%, transparent),
                              linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.1) 75%, rgba(255, 255, 255, 0.1) 76%, transparent 77%, transparent)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Subtle gradient circles for depth */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -ml-36 -mb-36" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-32 flex items-center min-h-screen">
        <div className="max-w-2xl mx-auto text-center md:text-left md:mx-0">
          <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <p className="text-white text-sm font-medium">
              Formando o futuro da tecnologia
            </p>
          </div>

          <h1 className="text-white mb-6 leading-tight">
            Educação Tecnológica de Excelência para o Futuro
          </h1>

          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            FAETERJ-Rio é uma instituição de ensino superior comprometida com a
            formação de profissionais qualificados, combinando rigor acadêmico
            com inovação tecnológica.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto md:mx-0">
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/95 transition-colors shadow-soft flex items-center justify-center gap-2">
              Conheça Nossos Cursos
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Solicitar Informações
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
