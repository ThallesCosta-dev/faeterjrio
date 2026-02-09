import { HomeHero } from "@/components/HomeHero";
import { AccessDock } from "@/components/AccessDock";
import { SelectionProcess } from "@/components/SelectionProcess";
import { WhyFAETERJ } from "@/components/WhyFAETERJ";
import { CoursesSection } from "@/components/CoursesSection";
import { SocialProof } from "@/components/SocialProof";
import { ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <HomeHero />

      {/* Quick Access Dock */}
      <AccessDock />

      {/* Selection Process 2026 */}
      <SelectionProcess />

      {/* Why FAETERJ-Rio Bento Grid */}
      <WhyFAETERJ />

      {/* Courses Section */}
      <CoursesSection />

      {/* Social Proof - Alumni/Careers */}
      <SocialProof />

      {/* Final CTA Section */}
      <section className="py-10 md:py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white mb-6">Transforme Seu Futuro Hoje</h2>
          <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
            Agende uma conversa com nossa equipe de admissão e descubra como
            FAETERJ-Rio pode ser o próximo passo em sua jornada profissional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://faeterj-rio.edu.br/central/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-primary rounded-lg font-bold hover:bg-white/95 transition-all shadow-soft inline-flex items-center justify-center gap-2 group"
            >
              Falar com Admissão
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/coruja"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
            >
              Acessar Portal do Aluno
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
