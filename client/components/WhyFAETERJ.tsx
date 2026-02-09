import { BookOpen, Briefcase, Users, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  size: string;
  featured?: boolean;
}

export function WhyFAETERJ() {
  const features: Feature[] = [
    {
      icon: BookOpen,
      title: "Ensino Gratuito de Qualidade",
      description:
        "Educação superior de excelência sem custo para você. Financiada pelo Estado do Rio de Janeiro.",
      size: "col-span-1 md:col-span-1 row-span-1",
    },
    {
      icon: Briefcase,
      title: "Foco no Mercado de Trabalho",
      description:
        "Currículo desenvolvido com indústria tech. Disciplinas práticas e relevantes.",
      size: "col-span-1 md:col-span-1 row-span-1",
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description:
        "Rede de alunos, professores e profissionais do mercado tech.",
      size: "col-span-1 md:col-span-1 row-span-1",
    },
    {
      icon: TrendingUp,
      title: "Índice IGC 4.0",
      description:
        "Avaliação máxima do MEC em 2023. Reconhecimento de excelência nacional.",
      size: "col-span-1 md:col-span-1 row-span-1",
    },
    {
      icon: Award,
      title: "Professores Capacitados",
      description: "Docentes com experiência em mercado e pesquisa acadêmica.",
      size: "col-span-1 md:col-span-1 row-span-1",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-primary mb-4">Por Que FAETERJ-Rio?</h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Uma instituição comprometida com sua formação e futuro profissional
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${feature.size} bg-secondary rounded-2xl p-6 md:p-8 border border-border hover:border-primary/30 transition-all group cursor-pointer hover:shadow-soft`}
              >
                <div
                  className={`${
                    feature.featured ? "w-16 h-16" : "w-12 h-12"
                  } bg-white rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors`}
                >
                  <IconComponent
                    className={`${
                      feature.featured ? "w-8 h-8" : "w-6 h-6"
                    } text-primary`}
                  />
                </div>
                <h3
                  className={`${
                    feature.featured ? "text-2xl" : "text-lg"
                  } font-bold text-primary mb-2`}
                >
                  {feature.title}
                </h3>
                <p className="text-foreground/60 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
