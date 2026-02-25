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
      imageUrl: "/coruja.svg",
      url: "https://faeterj-rio.edu.br/coruja/autenticar/login_controle.php",
    },
    {
      title: "Matriz e Ementas",
      description: "O que você vai aprender",
      icon: Code2,
      svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <path d="M 30,15 L 55,15 L 75,35 L 75,80 C 75,85.5 70.5,90 65,90 L 30,90 C 24.5,90 20,85.5 20,80 L 20,25 C 20,19.5 24.5,15 30,15 Z" 
        fill="none" stroke="#304a83" stroke-width="6" stroke-linejoin="round" />
        
  <path d="M 55,15 L 55,30 C 55,32.5 57.5,35 60,35 L 75,35" 
        fill="none" stroke="#304a83" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />

  <line x1="45" y1="50" x2="63" y2="50" stroke="#304a83" stroke-width="5" stroke-linecap="round" />
  <circle cx="33" cy="50" r="3.5" fill="#304a83" />
  
  <line x1="45" y1="62" x2="63" y2="62" stroke="#304a83" stroke-width="5" stroke-linecap="round" />
  <circle cx="33" cy="62" r="3.5" fill="#304a83" />
  
  <line x1="45" y1="74" x2="56" y2="74" stroke="#304a83" stroke-width="5" stroke-linecap="round" />
  <circle cx="33" cy="74" r="3.5" fill="#304a83" />
</svg>`,
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
                    {card.imageUrl ? (
                      <img 
                        src={card.imageUrl} 
                        alt={card.title}
                        className="w-6 h-6"
                      />
                    ) : card.svgContent ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: card.svgContent }}
                        className="w-6 h-6"
                      />
                    ) : (
                      <IconComponent className="w-6 h-6 text-primary" />
                    )}
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
