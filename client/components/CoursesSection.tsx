import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CoursesSection() {
  const courses = [
    {
      id: 1,
      name: "Análise e Desenvolvimento de Sistemas",
      shortName: "ADS",
      description:
        "Formação completa em desenvolvimento de software, web e mobile com foco em soluções inovadoras. Prepare-se para ser um líder em tecnologia e impactar o futuro digital.",
      tags: ["Tecnologia", "Desenvolvimento"],
      imageUrl:
        "https://s5.static.brasilescola.uol.com.br/vestibular/2020/11/analise-desenvolvimento-sistema.jpg",
    },
  ];

  return (
    <section id="cursos" className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-primary mb-4">Nosso Curso</h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Formação em Análise e Desenvolvimento de Sistemas com foco em
            excelência e inovação
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-2xl mx-auto">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all group"
            >
              {/* Course Image/Background */}
              <div
                className="h-48 w-full relative overflow-hidden bg-cover bg-center"
                style={{
                  backgroundImage: `url('${course.imageUrl}')`,
                }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <span className="text-sm font-bold opacity-90">
                    {course.shortName}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">
                  {course.name}
                </h3>
                <p className="text-sm text-foreground/60 mb-4">
                  {course.description}
                </p>

                {/* Tags */}
                <div className="flex gap-2 mb-6">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 text-xs font-semibold bg-secondary text-primary rounded-full border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <a
                  href="/matriz-ementas"
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all hover:text-primary/70"
                >
                  Ver Grade Curricular
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-12"
        >
          <p className="text-foreground/60 mb-6">
            Quer saber mais sobre admissão e documentação?
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://faeterj-rio.edu.br/central/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            Entre em Contato com a Admissão
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
