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
      {
        id: "ads-1-1",
        name: "Fundamentos de Programação",
        period: 1,
        credits: 4,
        hours: 80,
        description:
          "Introdução aos conceitos de programação, estruturas de dados básicas e algoritmos fundamentais usando Python.",
        prerequisites: [],
        pdfUrl: "#",
      },
      {
        id: "ads-1-2",
        name: "Matemática Discreta",
        period: 1,
        credits: 3,
        hours: 60,
        description:
          "Lógica, conjuntos, relações, funções e introdução à teoria dos grafos.",
        prerequisites: [],
        pdfUrl: "#",
      },
      {
        id: "ads-1-3",
        name: "Arquitetura de Computadores",
        period: 1,
        credits: 3,
        hours: 60,
        description:
          "Conceitos de processadores, memória, sistemas de entrada/saída e organização de computadores.",
        prerequisites: [],
        pdfUrl: "#",
      },
      {
        id: "ads-2-1",
        name: "Programação Orientada a Objetos",
        period: 2,
        credits: 4,
        hours: 80,
        description:
          "Princípios de POO, encapsulamento, herança, polimorfismo em Java e C++.",
        prerequisites: ["ads-1-1"],
        pdfUrl: "#",
      },
      {
        id: "ads-2-2",
        name: "Banco de Dados",
        period: 2,
        credits: 4,
        hours: 80,
        description:
          "Modelagem de dados, SQL, normalização e administração de bancos de dados relacionais.",
        prerequisites: ["ads-1-1"],
        pdfUrl: "#",
      },
      {
        id: "ads-3-1",
        name: "Desenvolvimento Web",
        period: 3,
        credits: 4,
        hours: 80,
        description:
          "HTML, CSS, JavaScript, React e frameworks modernos para desenvolvimento front-end e back-end.",
        prerequisites: ["ads-1-1", "ads-2-1"],
        pdfUrl: "#",
      },
    ],
  },
  {
    id: "gti",
    name: "Gestão da Tecnologia da Informação",
    shortName: "GTI",
    disciplines: [
      {
        id: "gti-1-1",
        name: "Fundamentos de TI",
        period: 1,
        credits: 3,
        hours: 60,
        description:
          "Introdução a redes, sistemas operacionais, hardware e infraestrutura de TI.",
        prerequisites: [],
        pdfUrl: "#",
      },
      {
        id: "gti-1-2",
        name: "Gestão de Projetos",
        period: 1,
        credits: 3,
        hours: 60,
        description:
          "Metodologias ágeis, planejamento, execução e monitoramento de projetos tecnológicos.",
        prerequisites: [],
        pdfUrl: "#",
      },
    ],
  },
];

export default function MatrizEmentas() {
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);
  const [selectedDiscipline, setSelectedDiscipline] =
    useState<Discipline | null>(null);
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
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-primary mb-4">Sua Jornada de Aprendizado</h1>
          <p className="text-foreground/60 text-lg">
            Explore a grade curricular de cada curso e entenda o que você vai
            aprender em cada semestre.
          </p>
        </div>
      </div>

      {/* Course Tabs */}
      <div className="sticky top-20 bg-white border-b border-border z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto py-4">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course);
                  setSelectedDiscipline(null);
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
                    className="w-full px-6 py-4 bg-secondary hover:bg-secondary/80 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                        {period}º
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-primary">
                          {period}º Semestre
                        </h3>
                        <p className="text-sm text-foreground/60">
                          {periodDisciplines.length} disciplinas
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-primary transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Period Content */}
                  {isExpanded && (
                    <div className="px-6 py-4 bg-white space-y-3">
                      {periodDisciplines.map((discipline) => (
                        <button
                          key={discipline.id}
                          onClick={() => setSelectedDiscipline(discipline)}
                          className="w-full p-4 bg-secondary hover:bg-secondary/80 rounded-lg text-left transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-primary mb-1 group-hover:text-primary/80">
                                {discipline.name}
                              </h4>
                              <p className="text-xs text-foreground/60">
                                {discipline.credits} créditos •{" "}
                                {discipline.hours} horas
                              </p>
                            </div>
                            <BookOpen className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Discipline Modal */}
      {selectedDiscipline && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDiscipline(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-96 overflow-y-auto shadow-soft-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-primary text-white p-6 border-b">
              <h2 className="text-xl font-bold mb-1">
                {selectedDiscipline.name}
              </h2>
              <p className="text-white/80 text-sm">
                {selectedDiscipline.credits} créditos •{" "}
                {selectedDiscipline.hours} horas
              </p>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-bold text-primary mb-2">Descrição</h3>
                <p className="text-sm text-foreground/60">
                  {selectedDiscipline.description}
                </p>
              </div>

              {selectedDiscipline.prerequisites.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-primary mb-2">
                    Pré-requisitos
                  </h3>
                  <ul className="text-sm text-foreground/60 space-y-1">
                    {selectedDiscipline.prerequisites.map((prereq) => (
                      <li key={prereq} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a
                href={selectedDiscipline.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Baixar Ementa PDF
              </a>
            </div>

            <button
              onClick={() => setSelectedDiscipline(null)}
              className="w-full px-4 py-3 text-foreground/60 hover:text-foreground transition-colors border-t"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
