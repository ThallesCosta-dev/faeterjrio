import { MessageCircle, Lock, Code2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function AccessDock() {
  const cards = [
    {
      title: "Central de Atendimento",
      description: "Resolva sua vida acadêmica",
      icon: MessageCircle,
      url: "https://faeterj-rio.edu.br/central/",
    },
    {
      title: "Portal Coruja",
      description: "Acesso a notas e pautas",
      icon: Lock,
      url: "https://faeterj-rio.edu.br/coruja/autenticar/login_controle.php",
    },
    {
      title: "Matriz e Ementas",
      description: "O que você vai aprender",
      icon: Code2,
      url: "https://www.faeterj-rio.edu.br/matriz-ementas.html",
    },
  ];

  return (
    <section className="relative -mt-16 pb-20 md:pb-32 px-4 z-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.a
                key={index}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-xl p-6 md:p-8 border border-border shadow-soft transition-all duration-300 hover:shadow-soft-lg"
              >
                <div className="flex items-start gap-4 h-full flex-col">
                  <div className="p-4 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-primary mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-foreground/60 mb-4">
                      {card.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all mt-auto">
                    Acessar
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
