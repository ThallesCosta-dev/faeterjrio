import { useState } from "react";
import { ChevronDown, Download, BookOpen } from "lucide-react";

interface Discipline {
  id: string;
  name: string;
  period: number;
  credits: number;
  hours: number;
  description: string;
  prerequisites: string[];
  pdfUrl: string;
}

interface Course {
  id: string;
  name: string;
  shortName: string;
  disciplines: Discipline[];
}

const courses: Course[] = [
  {
    id: "ads",
    name: "Análise e Desenvolvimento de Sistemas",
    shortName: "ADS",
    disciplines: [
      // 1º Período
      {
        id: "1ORG",
        name: "Org. de Computadores",
        period: 1,
        credits: 4,
        hours: 60,
        description:
          "Arquitetura Von Neumann, sistemas de numeração, hierarquia de memória (Cache/RAM), registradores e linguagem de montagem.",
        prerequisites: [],
        pdfUrl: "#",
      },
      {
        id: "1MAC",
        name: "Mat. para Computação",
        period: 1,
        credits: 4,
        hours: 60,
        description:
          "Lógica proposicional, tabelas-verdade, álgebra das proposições, análise combinatória e teoria de grafos.",
        prerequisites: [],
        pdfUrl: "#",
      },
      {
        id: "1FAC",
        name: "Fund. de Algoritmos",
        period: 1,
        credits: 4,
        hours: 60,
        description:
          "Lógica de programação em C, estruturas de controle, funções (valor e referência), matrizes e complexidade básica.",
        prerequisites: [],
        pdfUrl: "#",
      },
      {
        id: "1MAB",
        name: "Matemática Básica",
        period: 1,
        credits: 4,
        hours: 60,
        description:
          "Conjuntos numéricos, funções (afim, quadrática, exponencial, logarítmica) e séries finitas.",
        prerequisites: [],
        pdfUrl: "#",
      },
      {
        id: "1IAS",
        name: "Introd. à Análise de Sistemas",
        period: 1,
        credits: 4,
        hours: 60,
        description:
          "Elicitação de requisitos, regras de negócio, introdução à UML e modelos de domínio.",
        prerequisites: [],
        pdfUrl: "#",
      },
      {
        id: "1LPO",
        name: "Língua Portuguesa",
        period: 1,
        credits: 2,
        hours: 40,
        description:
          "Redação técnica, interpretação de texto, gramática aplicada e elaboração de relatórios.",
        prerequisites: [],
        pdfUrl: "#",
      },
      {
        id: "1IHM",
        name: "Interface Homem-Máquina",
        period: 1,
        credits: 2,
        hours: 40,
        description:
          "Usabilidade, semiótica, Gestalt, psicologia das cores, tipografia e prototipagem de testes.",
        prerequisites: [],
        pdfUrl: "#",
      },
      // 2º Período
      {
        id: "2REQ",
        name: "Eng. de Requisitos",
        period: 2,
        credits: 4,
        hours: 60,
        description:
          "Processos de requisitos, técnicas de identificação, diagramas de atividades, BPMN e gerência (MoSCoW).",
        prerequisites: ["1IAS"],
        pdfUrl: "#",
      },
      {
        id: "2CAW",
        name: "Const. de Aplicações Web",
        period: 2,
        credits: 4,
        hours: 60,
        description:
          "HTML5 semântico, CSS3 (layout responsivo), JavaScript básico e manipulação de objetos HTML.",
        prerequisites: ["1IHM"],
        pdfUrl: "#",
      },
      {
        id: "2FPR",
        name: "Fund. de Programação",
        period: 2,
        credits: 4,
        hours: 60,
        description:
          "C avançado, tipos abstratos de dados (TAD), arquivos, alocação dinâmica, recursão e algoritmos de busca/ordenação.",
        prerequisites: ["1FAC"],
        pdfUrl: "#",
      },
      {
        id: "2LES",
        name: "Língua Estrangeira",
        period: 2,
        credits: 2,
        hours: 40,
        description:
          "Inglês técnico, estratégias de leitura, tradução e interpretação de textos de computação.",
        prerequisites: ["1LPO"],
        pdfUrl: "#",
      },
      {
        id: "2SOP",
        name: "Sistemas Operacionais",
        period: 2,
        credits: 4,
        hours: 60,
        description:
          "Chamadas de sistema, gerência de processos/threads, memória virtual e sistemas de arquivos.",
        prerequisites: ["1ORG"],
        pdfUrl: "#",
      },
      {
        id: "2CAL",
        name: "Cálculo",
        period: 2,
        credits: 4,
        hours: 60,
        description:
          "Limites, derivadas (regras e aplicações), integrais (técnicas e áreas) e funções de várias variáveis.",
        prerequisites: ["1MAB"],
        pdfUrl: "#",
      },
      {
        id: "2MPA",
        name: "Métodos Administrativos",
        period: 2,
        credits: 2,
        hours: 40,
        description:
          "Teoria geral da administração, planejamento estratégico, liderança e comportamento organizacional.",
        prerequisites: [],
        pdfUrl: "#",
      },
      {
        id: "2TPH",
        name: "Técnicas e Paradigmas Humanos",
        period: 2,
        credits: 2,
        hours: 40,
        description:
          "Ética, diversidade social, sustentabilidade e relacionamento interpessoal no trabalho.",
        prerequisites: [],
        pdfUrl: "#",
      },
      // 3º Período
      {
        id: "3POB",
        name: "POO Básica",
        period: 3,
        credits: 4,
        hours: 60,
        description:
          "Paradigma orientado a objetos em Java, tratamento de exceções, coleções (List, Set, Map) e Generics.",
        prerequisites: ["2FPR"],
        pdfUrl: "#",
      },
      {
        id: "3PBD",
        name: "Proj. de Banco de Dados",
        period: 3,
        credits: 4,
        hours: 60,
        description:
          "Modelagem conceitual/lógica (ER), álgebra relacional, SQL (DDL/DML) e normalização.",
        prerequisites: ["2FPR"],
        pdfUrl: "#",
      },
      {
        id: "3DAW",
        name: "Desenv. Tecnologias Web",
        period: 3,
        credits: 4,
        hours: 60,
        description:
          "Servidores web, CMS, PHP, integração Front-end/Back-end e frameworks web.",
        prerequisites: ["2CAW"],
        pdfUrl: "#",
      },
      {
        id: "3ALG",
        name: "Álgebra",
        period: 3,
        credits: 4,
        hours: 60,
        description:
          "Vetores, equações lineares, transformações lineares, determinantes, autovalores e autovetores.",
        prerequisites: ["1MAC"],
        pdfUrl: "#",
      },
      {
        id: "3ESD",
        name: "Estrutura de Dados",
        period: 3,
        credits: 4,
        hours: 60,
        description:
          "Listas, pilhas, filas, árvores, pesquisa digital e análise de complexidade.",
        prerequisites: ["2FPR"],
        pdfUrl: "#",
      },
      {
        id: "3RSD",
        name: "Redes e Sist. Distribuídos",
        period: 3,
        credits: 4,
        hours: 60,
        description:
          "Modelo OSI e TCP/IP, protocolos (UDP, IP, roteamento), sub-redes e aplicações de rede.",
        prerequisites: ["2SOP"],
        pdfUrl: "#",
      },
      // 4º Período
      {
        id: "4POA",
        name: "POO Avançada",
        period: 4,
        credits: 4,
        hours: 60,
        description:
          "Java Web (JSP/Servlet), threads, serialização de objetos, JDBC, padrão MVC e introdução a Design Patterns.",
        prerequisites: ["3POB"],
        pdfUrl: "#",
      },
      {
        id: "4UBD",
        name: "Utiliz. de Banco de Dados",
        period: 4,
        credits: 4,
        hours: 60,
        description:
          "SQL avançado, indexação, otimização de consultas, controle de concorrência e NoSQL.",
        prerequisites: ["3PBD"],
        pdfUrl: "#",
      },
      {
        id: "4MOD",
        name: "Modelagem de Sistemas",
        period: 4,
        credits: 4,
        hours: 60,
        description:
          "Mapeamento objeto-relacional, diagramas de classe/interação/estados e ferramentas CASE.",
        prerequisites: ["2REQ", "3PBD"],
        pdfUrl: "#",
      },
      {
        id: "4SEG",
        name: "Segurança da Informação",
        period: 4,
        credits: 4,
        hours: 60,
        description:
          "Criptografia (simétrica/assimétrica), certificados digitais, firewalls, ameaças e governança de TI.",
        prerequisites: ["3RSD"],
        pdfUrl: "#",
      },
      {
        id: "4EST",
        name: "Estatística",
        period: 4,
        credits: 4,
        hours: 60,
        description:
          "Variáveis estatísticas, medidas de tendência central/dispersão, assimetria e probabilidade.",
        prerequisites: ["2CAL", "3ALG"],
        pdfUrl: "#",
      },
      {
        id: "4ADS",
        name: "Tópicos em ADS",
        period: 4,
        credits: 4,
        hours: 60,
        description:
          "Projeto lógico de software, qualidade e testes de software, integração para o ENADE.",
        prerequisites: ["2REQ", "3POB", "3PBD"],
        pdfUrl: "#",
      },
      {
        id: "4MET",
        name: "Metodologia",
        period: 4,
        credits: 2,
        hours: 40,
        description:
          "Tipos de pesquisa, normas ABNT, planejamento de anteprojeto e redação acadêmica.",
        prerequisites: ["3PBD"],
        pdfUrl: "#",
      },
      {
        id: "4EMP",
        name: "Empreendedorismo",
        period: 4,
        credits: 2,
        hours: 40,
        description:
          "Plano de negócios, identificação de oportunidades, e-commerce e gestão de recursos.",
        prerequisites: ["2MPA"],
        pdfUrl: "#",
      },
      // 5º Período
      {
        id: "5SBD",
        name: "Scripts de Banco de Dados",
        period: 5,
        credits: 4,
        hours: 60,
        description:
          "Prática avançada de comandos SQL e construção de scripts complexos em SGBDs.",
        prerequisites: ["4UBD"],
        pdfUrl: "#",
      },
      {
        id: "5PJS",
        name: "Projeto de Sistemas",
        period: 5,
        credits: 4,
        hours: 60,
        description:
          "Metodologias ágeis vs tradicionais, frameworks (Spring, Hibernate, Bootstrap) e ciclo de vida de software.",
        prerequisites: ["4MOD"],
        pdfUrl: "#",
      },
      {
        id: "5PDM",
        name: "Prog. Dispositivos Móveis",
        period: 5,
        credits: 4,
        hours: 60,
        description:
          "Desenvolvimento nativo vs híbrido, Kotlin/Android, UX/UI mobile e persistência de dados.",
        prerequisites: ["4POA"],
        pdfUrl: "#",
      },
      {
        id: "5GPS",
        name: "Gerência de Projetos",
        period: 5,
        credits: 4,
        hours: 60,
        description:
          "Softwares de gestão, monitoramento de desempenho e estudos de caso de projetos de sistemas.",
        prerequisites: ["4EMP"],
        pdfUrl: "#",
      },
      {
        id: "5TAV",
        name: "Tópicos Avançados",
        period: 5,
        credits: 4,
        hours: 60,
        description:
          "Novas tendências do mercado de TI e técnicas atualizadas de processamento de dados.",
        prerequisites: ["4EST", "4MOD"],
        pdfUrl: "#",
      },
    ],
  },
];

export default function MatrizEmentas() {
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);
  const [expandedPeriods, setExpandedPeriods] = useState<number[]>([]);

  const togglePeriod = (period: number) => {
    setExpandedPeriods((prev) =>
      prev.includes(period)
      ? prev.filter((p) => p !== period)
      : [...prev, period],
    );
  };

  const periods = [
    ...new Set(selectedCourse.disciplines.map((d) => d.period)),
  ].sort();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative pt-32 pb-20 bg-primary text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sua Jornada de Aprendizado</h1>
          <p className="text-xl text-white/90 max-w-2xl leading-relaxed mb-8">
            Explore a grade curricular de {selectedCourse.shortName} e entenda o que você vai
            aprender em cada semestre.
          </p>
          <a
            href="https://drive.google.com/uc?export=download&id=1LI0KL1h7xC646dxxD7IoqnA6x5XbPab0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            Baixar Ementário Completo
          </a>
        </div>
      </section>

      {/* Course Tabs (Removed since there is only one course now, but kept structure if we want to add more later) */}
      {/* 
      <div className="sticky top-20 bg-white border-b border-border z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto py-4">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course);
                  setExpandedPeriods([]);
                }}
                className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedCourse.id === course.id
                    ? "bg-primary text-white"
                    : "bg-secondary text-primary hover:bg-secondary/80"
                }`}
              >
                {course.shortName}
              </button>
            ))}
          </div>
        </div>
      </div>
      */}

      {/* Timeline Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Timeline */}
          <div className="space-y-4">
            {periods.map((period, index) => {
              const isExpanded = expandedPeriods.includes(period);
              const periodDisciplines = selectedCourse.disciplines.filter(
                (d) => d.period === period,
              );

              return (
                <div
                  key={period}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  {/* Period Header */}
                  <button
                    onClick={() => togglePeriod(period)}
                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {period}º
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-lg">{period}º Período</h3>
                        <p className="text-sm text-muted-foreground">
                          {periodDisciplines.length} Disciplinas
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Disciplines List */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "max-h-[2000px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="border-t border-border bg-gray-50/50">
                      {periodDisciplines.map((discipline) => (
                        <div
                          key={discipline.id}
                          className="p-6 border-b border-border last:border-0 hover:bg-white transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                                  {discipline.id}
                                </span>
                                <h4 className="font-bold text-lg">
                                  {discipline.name}
                                </h4>
                              </div>
                              <p className="text-foreground/70 mb-4 leading-relaxed">
                                {discipline.description}
                              </p>
                              
                              {/* Prerequisites */}
                              {discipline.prerequisites.length > 0 && (
                                <div className="mb-4 text-sm text-muted-foreground">
                                  <span className="font-semibold text-primary">Pré-requisitos: </span>
                                  {discipline.prerequisites.map((prereqId, index) => {
                                      // Find the prerequisite discipline name
                                      const prereq = selectedCourse.disciplines.find(d => d.id === prereqId);
                                      return (
                                        <span key={prereqId}>
                                          {prereq ? `${prereq.id} (${prereq.name})` : prereqId}
                                          {index < discipline.prerequisites.length - 1 ? ", " : ""}
                                        </span>
                                      );
                                  })}
                                </div>
                              )}

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4" />
                                  <span>{discipline.credits * 20}h</span>
                                </div>
                                {/* 
                                {discipline.credits > 0 && (
                                  <div className="px-2 py-0.5 bg-gray-200 rounded text-xs font-medium">
                                    {discipline.credits} Créditos
                                  </div>
                                )}
                                */}
                              </div>
                            </div>
                            {/* 
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                              Ementa
                            </button>
                            */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
