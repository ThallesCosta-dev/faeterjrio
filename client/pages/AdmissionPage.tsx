import { motion } from "framer-motion";
import {
  FileCheck,
  GraduationCap,
  Users,
  ArrowRight,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AdmissionPage() {
  const steps = [
    {
      number: "01",
      title: "O Desafio (ENEM)",
      description:
        "Tudo começa com o Exame Nacional do Ensino Médio. Realize a prova do ENEM e garanta o melhor desempenho possível. Sua pontuação média é o único critério de classificação.",
      note: "Nota mínima recomendada: Consulte o histórico de notas de corte.",
      icon: BookOpen,
    },
    {
      number: "02",
      title: "A Seleção (SISU)",
      description:
        "Fique atento ao calendário do MEC. Quando as inscrições do Sistema de Seleção Unificada (SISU) abrirem, acesse o portal oficial, procure por FAETERJ-Rio e selecione o curso desejado (Análise de Sistemas ou I.S.T.) como sua opção prioritária.",
      icon: Users,
    },
    {
      number: "03",
      title: "O Onboarding (Matrícula)",
      description:
        "Após a divulgação da chamada regular (ou lista de espera), os candidatos aprovados devem comparecer à Secretaria Acadêmica para a validação documental e efetivação da matrícula.",
      note: "Documentação: Identidade, CPF, Certificado de Reservista (homens), Título de Eleitor, Comprovante de Residência e Certificado de Conclusão do Ensino Médio.",
      icon: FileCheck,
    },
  ];

  const faqs = [
    {
      question: "Existe vestibular agendado ou prova própria?",
      answer:
        "Não. Diferente de outras instituições, a FAETERJ-Rio não aplica provas internas. Seu ingresso depende 100% da sua nota no ENEM vigente utilizada no SISU.",
    },
    {
      question: "A faculdade é realmente gratuita?",
      answer:
        "Sim. Somos uma autarquia do Governo do Estado do Rio de Janeiro. Não há cobrança de mensalidades, taxas de matrícula ou custos ocultos.",
    },
    {
      question: "Posso usar nota de anos anteriores?",
      answer:
        "O SISU geralmente utiliza a nota da edição mais recente do ENEM. Consulte sempre o edital vigente do MEC para verificar as regras de aproveitamento de notas passadas.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sua nota do ENEM é o seu passaporte.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              Sem vestibular interno. Sem mensalidades. Apenas mérito.
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              A FAETERJ-Rio é uma instituição de ensino superior pública e
              gratuita, vinculada à rede FAETEC. Acreditamos na democratização do
              acesso à tecnologia de ponta. Por isso, nosso processo seletivo é
              unificado, transparente e utiliza exclusivamente o SISU.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-primary mb-4">
              O Caminho para a FAETERJ-Rio
            </h2>
            <p className="text-foreground/60">
              Passo a passo para garantir sua vaga
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-primary/10 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-8xl text-primary select-none group-hover:scale-110 transition-transform duration-500">
                    {step.number}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                      <span className="text-primary/60 text-sm font-mono">{step.number}.</span>
                      {step.title}
                    </h3>
                    
                    <p className="text-foreground/70 mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {step.note && (
                      <div className="bg-secondary p-4 rounded-lg border border-primary/10">
                        <p className="text-sm text-primary/80 font-medium">
                          {step.note}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-4">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">
              Dúvidas Frequentes
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-6 data-[state=open]:border-primary/50 data-[state=open]:bg-secondary/20 transition-all"
                >
                  <AccordionTrigger className="text-left font-semibold text-lg text-primary hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 text-base pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <a
              href="https://acessounico.mec.gov.br/sisu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#304a83] text-white rounded-lg font-bold text-lg hover:bg-[#304a83]/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Consultar Edital e Cronograma SISU
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
