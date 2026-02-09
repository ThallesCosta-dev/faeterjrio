import { motion } from "framer-motion";
import { User, BookOpen, Code, Cpu, Users, ExternalLink } from "lucide-react";

export default function AboutPage() {
  // Dados atualizados (Fonte: Lattes/CNPq)
  const faculty = [
    {
      area: "Gestão, Inovação e Ciência de Dados",
      icon: <Users className="w-8 h-8 text-primary" />,
      members: [
        {
          name: "Prof. Alfredo Nazareno Pereira Boente",
          subjects: ["ADS", "UBD", "SEG"],
          role: "Gestão de TI & Segurança",
          description:
            "Doutor em Engenharia de Produção (COPPE/UFRJ). Especialista em administração de dados, segurança da informação e lógica fuzzy aplicada à gestão.",
          lattes: "http://lattes.cnpq.br/7741044822342404",
        },
        {
          name: "Prof. Ricardo Marciano dos Santos",
          subjects: ["IAS", "CAW", "PJS"],
          role: "Análise de Sistemas",
          description:
            "Pós-doutorando em Aprendizado de Máquina na Fiocruz. Foca em construção de algoritmos web e projetos de sistemas inteligentes.",
          lattes: "http://lattes.cnpq.br/6329550960331880",
        },
        {
          name: "Prof. Nelson Luis Soares Bezerra",
          subjects: ["MPA", "GPS", "EMP"],
          role: "Gestão Ágil de Projetos",
          description:
            "Foco em Metodologias Ágeis (Scrum/Kanban), Gerência de Projetos de Software e Empreendedorismo Tecnológico.",
          lattes: "http://lattes.cnpq.br/9574913471960359",
        },
      ],
    },
    {
      area: "Engenharia de Software e Desenvolvimento",
      icon: <Code className="w-8 h-8 text-primary" />,
      members: [
        {
          name: "Prof. André Henrique Pedrosa Neves",
          subjects: ["DAW", "IHM", "SBD"],
          role: "Full Stack & Frontend",
          description:
            "Especialista em Desenvolvimento Web, Interfaces (UI/UX) e Scripts de Banco de Dados.",
          lattes: "http://lattes.cnpq.br/9609477928978984",
        },
        {
          name: "Prof. Marcio Belo Rodrigues da Silva",
          subjects: ["REQ", "MOD", "POB"],
          role: "Arquitetura de Software",
          description:
            "Especialista em Análise e Modelagem. Ensina os fundamentos da Orientação a Objetos e estruturas de requisitos.",
          lattes: "http://lattes.cnpq.br/4659414483766533",
        },
        {
          name: "Prof(a). Claudia Ferlin",
          subjects: ["ESD", "FAC"],
          role: "Estruturas & Algoritmos",
          description:
            "Atua no ensino de Estruturas de Dados complexas e nos Fundamentos de Algoritmos computacionais.",
          lattes: "http://lattes.cnpq.br/4781864789335595",
        },
        {
          name: "Prof. Leonardo Soares Vianna",
          subjects: ["FAC", "FPR"],
          role: "Lógica de Programação",
          description:
            "Responsável pela base técnica dos alunos, focando em Fundamentos de Algoritmos e Programação Estruturada.",
          lattes: "http://lattes.cnpq.br/3678346219962811",
        },
        {
          name: "Prof. Paulo Massillon Martins",
          subjects: ["DEV", "ENG"],
          role: "Desenvolvimento de Sistemas",
          description:
            "Professor atuante na área de desenvolvimento de software e tecnologias aplicadas.",
          lattes: "http://lattes.cnpq.br/3176613789527496",
        },
      ],
    },
    {
      area: "Infraestrutura e Matemática Aplicada",
      icon: <Cpu className="w-8 h-8 text-primary" />,
      members: [
        {
          name: "Prof. Paulo Ricardo Galhanone",
          subjects: ["ORG", "SOP"],
          role: "Hardware & S.O.",
          description:
            "Especialista em Arquitetura de Computadores (Von Neumann) e funcionamento interno de Sistemas Operacionais.",
          lattes: "http://lattes.cnpq.br/9169990426085895",
        },
        {
          name: "Prof. Maria Cláudia Roenick Guimarães",
          subjects: ["RSD", "SEG", "PBD"],
          role: "Redes & CyberSec",
          description:
            "Foca em Redes de Computadores, protocolos de comunicação e Segurança da Informação corporativa.",
          lattes: "http://lattes.cnpq.br/9020338574975132",
        },
        {
          name: "Prof. Cláudio Bispo de Jesus da Costa",
          subjects: ["MAC", "ALG", "EST"],
          role: "Matemática Computacional",
          description:
            "Mestre em Ensino de Matemática. Atua com Estatística aplicada a dados e Álgebra Linear.",
          lattes: "http://lattes.cnpq.br/3412930630193167",
        },
      ],
    },
    {
      area: "Humanidades e Metodologia",
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      members: [
        {
          name: "Prof. Eduardo José Paz Ferreira Barreto",
          subjects: ["LPO", "LES"],
          role: "Comunicação Técnica",
          description:
            "Foca em Língua Portuguesa para relatórios técnicos e Inglês Instrumental (Leitura e Escrita Técnica).",
          lattes: "http://lattes.cnpq.br/2645169295668249",
        },
        {
          name: "Prof(a). Rute Candida de Freitas",
          subjects: ["TPH", "MET"],
          role: "Soft Skills & Pesquisa",
          description:
            "Responsável por Técnicas e Paradigmas Humanos (Ética/Comportamento) e Metodologia da Pesquisa Científica.",
          lattes: "http://lattes.cnpq.br/6650697754677674",
        },
        {
          name: "Prof(a). Rosangela de Sena Almeida",
          subjects: ["TPH", "MET"],
          role: "Soft Skills & Pesquisa",
          description:
            "Responsável por Técnicas e Paradigmas Humanos e Coordenação de Atividades Complementares.",
          lattes: "http://lattes.cnpq.br/4932401660106541",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/gps-cs-s/AHVAwepKvHPjZEfd8_HAfG8GRqQasucUikt_F-y79wx9HizIyy3ZWRAQnj_HQQV2vphp7mAoYflBtxUon65HRXa3J70_BJaA8IVK-toW0ijqVLOTSBSOMQgcajz7uQHRYUPZV42zC42VNQ=s680-w680-h510-rw')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Sobre a FAETERJ-Rio
            </h1>
            <h2 className="text-xl md:text-2xl text-white/90 font-light mb-0">
              Tradição Pública. Inovação Tecnológica.
              <br />
              <span className="text-white/80 text-lg">
                Desde 2000, formando a elite técnica do Rio de Janeiro.
              </span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Institutional Section - Estrutura Original mantida */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-12 text-lg text-foreground/80 leading-relaxed text-left">
              <h2 className="text-3xl font-bold text-primary text-center">
                De IST-Rio a Referência em Tecnologia: Nossa Jornada
              </h2>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">A Origem</h3>
                <p>
                  A história da FAETERJ Rio (Faculdade de Educação Tecnológica do Estado do Rio de Janeiro) começa com um propósito claro: suprir a demanda urgente por mão de obra qualificada em tecnologia no estado. Nascida como IST-Rio (Instituto Superior de Tecnologia), a instituição foi desenhada desde o primeiro dia para ser diferente das universidades tradicionais. Aqui, a teoria sempre serviu à prática.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">A Evolução</h3>
                <p>
                  Vinculada à FAETEC e à Secretaria de Ciência, Tecnologia e Inovação (SECTI), a faculdade evoluiu sua grade e infraestrutura para acompanhar a velocidade exponencial da computação. Do mainframe ao Cloud Computing, da lógica estruturada à Inteligência Artificial, a FAETERJ Rio adaptou-se a cada era tecnológica sem perder sua essência: o ensino público, gratuito e meritocrático.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">O Diferencial: Sala de Aula ou Mercado?</h3>
                <p>
                  Nosso maior orgulho não é apenas o diploma, mas a empregabilidade. Com um corpo docente formado por Mestres e Doutores que atuam ativamente no mercado (em Big Techs, órgãos públicos e centros de pesquisa como a Fiocruz), o aluno não aprende apenas a programar — aprende a resolver problemas reais.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">Hoje</h3>
                <p>
                  Atualmente, a FAETERJ Rio é sinônimo de excelência no curso de Análise e Desenvolvimento de Sistemas. Somos uma comunidade vibrante de desenvolvedores, gestores e cientistas de dados. Nossos egressos (Alumni) ocupam posições de liderança em multinacionais e startups, provando que o ensino técnico público do Rio de Janeiro é uma potência de inovação.
                </p>
              </div>

              <div className="bg-secondary/30 p-8 rounded-2xl border border-primary/10 my-8">
                <p className="text-sm text-foreground/70 italic border-l-4 border-primary pl-4">
                  Grade curricular ativa referente ao semestre letivo <strong>2026.1</strong>. As siglas das disciplinas seguem o Ementário Oficial 2018 (ex: <strong>PJS</strong> = Projeto de Sistemas).
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Faculty Section - Design Original com Dados Novos */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-primary mb-4">
              Docentes 2026.1
            </h2>
            <p className="text-foreground/60 text-lg">
              Excelência acadêmica e prática de mercado
            </p>
          </motion.div>

          <div className="space-y-16 max-w-7xl mx-auto">
            {faculty.map((area, areaIndex) => (
              <div key={areaIndex}>
                {/* Título da Área com Ícone (Melhoria Híbrida) */}
                <div className="flex items-center gap-3 mb-8 border-l-4 border-primary pl-4">
                   <div className="p-1 bg-white rounded-lg shadow-sm">
                      {area.icon}
                   </div>
                   <h3 className="text-2xl font-bold text-primary">
                    {area.area}
                  </h3>
                </div>
               
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {area.members.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-border h-full flex flex-col"
                    >
                      <div className="text-center mb-4 flex-grow">
                        <h4 className="font-bold text-lg text-primary mb-1">
                          {member.name}
                        </h4>

                        {member.lattes && (
                          <a
                            href={member.lattes}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 text-xs text-primary/70 hover:text-primary mb-2 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Currículo Lattes
                          </a>
                        )}
                        
                        {/* Tags de Matérias */}
                        <div className="flex flex-wrap justify-center gap-2 mb-3">
                          {member.subjects.map((subject) => (
                            <span
                              key={subject}
                              className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>

                        <p className="text-sm font-semibold text-foreground/80 mb-3 uppercase tracking-wide">
                          {member.role}
                        </p>
                        <p className="text-sm text-foreground/60 leading-relaxed">
                          {member.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 pt-8 border-t border-primary/10">
            <p className="text-xs text-foreground/40 max-w-3xl mx-auto">
              * Dados baseados na Grade de Horário 2026.1 e Ementário 2018. A
              titulação e os currículos são de responsabilidade dos docentes na
              Plataforma Lattes/CNPq.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}