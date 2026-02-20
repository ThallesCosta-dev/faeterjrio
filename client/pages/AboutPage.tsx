import { motion } from "framer-motion";
import { User, BookOpen, Code, Cpu, Users } from "lucide-react";

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
                        <p className="text-sm text-foreground/60 leading-relaxed mb-4">
                          {member.description}
                        </p>

                        {member.lattes && (
                          <div className="mt-auto pt-4 border-t border-border/50">
                            <a
                              href={member.lattes}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors py-1 px-3 bg-primary/5 rounded-full hover:bg-primary/10"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                className="w-3 h-3"
                                fill="currentColor"
                                style={{ opacity: 1 }}
                                aria-hidden="true"
                                focusable="false"
                              >
                                <path d="M97.872 434.733c-46.338-94.949-73.906-152.29-73.906-153.713c0-2.322 2.831-2 30.672 3.46c48.965 9.614 75.126 12.326 118.735 12.342c57.697.016 104.68-9.122 141.185-27.484c19.311-9.715 30.925-18.327 40.437-29.993c11.716-14.378 15.48-24.28 15.615-40.947c.118-15.852-2.018-24.211-11.19-43.608c-3.63-7.665-6.817-16.463-7.122-19.55c-.475-4.968-.068-5.68 3.595-6.104c8.003-.948 47.507 37.403 62.055 60.241c25.076 39.386 27.111 81.993 5.884 123.195c-13.04 25.314-27.45 42.828-51.577 62.734c-40.099 33.062-86.708 56.086-151.069 74.635c-34.57 9.97-90.471 22.059-101.984 22.059c-2.44 0-7.02-8.003-21.296-37.283l-.034.015zm12.904-153.121c-45.016-5.832-82.79-10.903-83.96-11.275c-2-.644-9.155-24.516-13.191-43.947c-1.017-4.917-2.51-17.939-3.323-28.958c-3.63-49.17 7.069-83.166 35.74-113.735C94.583 31.985 198.516 25.694 315.777 67.37c20.582 7.325 28.755 12.411 24.975 15.581c-2.797 2.34-21.753 2.306-54.51-.102c-51.204-3.764-90.183 3.357-110.274 20.176c-30.588 25.602-25.924 81.724 13.53 162.682c4.273 8.766 8.58 17.345 9.563 19.09c2.29 4.019.628 7.75-3.357 7.563c-1.697-.081-39.915-4.912-84.929-10.746zm151.016-44.047c-35.928-6.46-68.227-28.74-78.654-54.222c-5.002-12.241-4.765-28.213.576-37.774c4.832-8.648 17.31-18.65 28.484-22.839c18.6-6.968 51.17-4.188 74.907 6.41c22.533 10.055 42.507 27.738 49.932 44.184c9.53 21.109 1.593 44.66-18.82 55.901c-13.531 7.443-39.827 11.326-56.443 8.341z" />
                              </svg>
                              Currículo Lattes
                            </a>
                          </div>
                        )}
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