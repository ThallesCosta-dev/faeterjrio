import { useState } from "react";
import {
  Search,
  MessageCircle,
  FileText,
  Clock,
  MapPin,
  AlertCircle,
  GraduationCap,
  DollarSign,
  Award,
  Heart,
} from "lucide-react";

interface FAQItem {
  category: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export default function CentralAtendimento() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isOfficeHours = (() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const dayOfWeek = now.getDay();

    // Open Monday-Friday, 09:00-17:00
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      return hours >= 9 && (hours < 17 || (hours === 16 && minutes < 60));
    }
    return false;
  })();

  const categories = [
    {
      id: "matricula",
      name: "Matrícula",
      icon: GraduationCap,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "diploma",
      name: "Diploma",
      icon: Award,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "financeiro",
      name: "Financeiro",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "suporte",
      name: "Suporte Acadêmico",
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const faqs: FAQItem[] = [
    {
      category: "matricula",
      question: "Qual é o processo de matrícula?",
      answer:
        "A matrícula ocorre ao final do processo de admissão. Você receberá instruções por e-mail com todos os documentos necessários.",
      icon: "📋",
    },
    {
      category: "matricula",
      question: "Preciso fazer algum teste para ingressar?",
      answer:
        "Todos os candidatos participam de uma prova de conhecimentos gerais. Consulte o edital de admissão para datas e horários.",
      icon: "📝",
    },
    {
      category: "diploma",
      question: "Como solicitar meu diploma?",
      answer:
        "Após conclusão do curso, dirija-se à secretaria acadêmica com seus documentos originais para solicitação do diploma.",
      icon: "🎓",
    },
    {
      category: "diploma",
      question: "Quanto tempo leva para emitir o diploma?",
      answer:
        "O processo leva aproximadamente 30 dias após a conclusão de todos os requisitos acadêmicos.",
      icon: "⏱️",
    },
    {
      category: "financeiro",
      question: "A FAETERJ-Rio oferece bolsas de estudo?",
      answer:
        "Sim! Oferecemos diversas bolsas e auxílios. Consulte a secretaria para conhecer os programas disponíveis.",
      icon: "💰",
    },
    {
      category: "suporte",
      question: "Como acessar o portal do aluno?",
      answer:
        "Acesse https://faeterj-rio.edu.br/coruja/ com seu login de aluno (geralmente seu CPF ou matrícula).",
      icon: "🔐",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-br from-secondary to-secondary/80 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-primary text-center mb-6">
            Como Podemos Ajudar Você Hoje?
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Procure por respostas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-border focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Status Card */}
          <div
            className={`max-w-2xl mx-auto p-4 rounded-lg flex items-center gap-3 ${
              isOfficeHours
                ? "bg-green-100 border border-green-300 text-green-800"
                : "bg-amber-100 border border-amber-300 text-amber-800"
            }`}
          >
            <Clock className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">
                {isOfficeHours ? "Estamos Abertos Agora" : "Estamos Fechados"}
              </p>
              <p className="text-sm">
                Horário de atendimento: Seg-Sex, 09:00 - 17:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-primary font-bold mb-8">Categorias Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id,
                  )
                }
                className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all ${
                  selectedCategory === category.id
                    ? `${category.color} border-2 border-current shadow-soft`
                    : "bg-secondary hover:bg-secondary/80 text-foreground/60"
                }`}
              >
                <IconComponent className="w-8 h-8" />
                <span className="font-semibold text-sm text-center">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="container mx-auto px-4 py-12">
        {filteredFaqs.length > 0 ? (
          <div>
            <h2 className="text-primary font-bold mb-8">
              {selectedCategory
                ? "Respostas Encontradas"
                : "Perguntas Frequentes"}
            </h2>
            <div className="grid gap-4 max-w-3xl">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-6 bg-secondary rounded-xl border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex gap-4">
                    <span className="text-2xl flex-shrink-0">{faq.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-primary mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-foreground/60 text-sm">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground/60 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-foreground/40">
              Tente uma busca diferente ou categorize sua pergunta
            </p>
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ainda tem dúvidas?</h2>
          <p className="mb-8 text-white/80">
            Fale com nossa equipe de atendimento para suporte personalizado
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://faeterj-rio.edu.br/central/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-primary rounded-lg font-bold hover:bg-white/95 transition-colors inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Abrir um Chamado
            </a>
            <a
              href="https://wa.me/5521999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
            >
              💬 Conversar no WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Contact Info Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl">
          <div className="flex gap-3">
            <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-bold text-primary mb-1">Localização</h3>
              <p className="text-sm text-foreground/60">
                Rua Clarimundo de Melo, 847
                <br />
                Quintino Bocaiuva, Rio de Janeiro
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-bold text-primary mb-1">Horário</h3>
              <p className="text-sm text-foreground/60">
                Seg-Sex: 09:00 - 17:00
                <br />
                Sábado e Domingo: Fechado
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <FileText className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-bold text-primary mb-1">Telefone</h3>
              <p className="text-sm text-foreground/60">
                <a href="tel:+552123324048" className="hover:text-primary">
                  (21) 2332-4048
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
