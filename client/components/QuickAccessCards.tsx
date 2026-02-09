import { Headphones, User, FileText, ArrowRight } from "lucide-react";

export function QuickAccessCards() {
  const cards = [
    {
      title: "Central de Atendimento",
      description:
        "Fale conosco e tire suas dúvidas sobre admissão e vida acadêmica",
      icon: Headphones,
      url: "https://faeterj-rio.edu.br/central/",
      color: "bg-blue-50 hover:bg-blue-100 text-primary",
      borderColor: "border-blue-200",
    },
    {
      title: "Portal do Aluno (Coruja)",
      description: "Acesse notas, horários e informações acadêmicas pessoais",
      icon: User,
      url: "https://faeterj-rio.edu.br/coruja/autenticar/login_controle.php",
      color: "bg-indigo-50 hover:bg-indigo-100 text-primary",
      borderColor: "border-indigo-200",
    },
    {
      title: "Matriz e Ementas",
      description: "Consulte a grade curricular e ementas de todos os cursos",
      icon: FileText,
      url: "https://www.faeterj-rio.edu.br/matriz-ementas.html",
      color: "bg-slate-50 hover:bg-slate-100 text-primary",
      borderColor: "border-slate-200",
    },
  ];

  return (
    <section className="relative -mt-24 pb-20 md:pb-32 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <a
                key={index}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block p-6 md:p-8 rounded-xl border-2 ${card.borderColor} ${card.color} transition-all duration-300 hover:shadow-soft-lg hover:border-primary/50`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/50 rounded-lg group-hover:bg-white transition-colors">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base md:text-lg mb-2 text-primary">
                      {card.title}
                    </h3>
                    <p className="text-sm md:text-base text-primary/70 mb-4">
                      {card.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                      Acessar
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
