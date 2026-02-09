import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function HomeHero() {
  const scrollToCourses = () => {
    const coursesSection = document.getElementById("cursos");
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden pt-20 md:pt-32">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        {/* Duotone gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80" />

        {/* Abstract network/code elements overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="w-full h-full"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Network nodes and connections */}
            <circle cx="150" cy="100" r="8" fill="white" opacity="0.6" />
            <circle cx="300" cy="180" r="6" fill="white" opacity="0.5" />
            <circle cx="450" cy="120" r="7" fill="white" opacity="0.6" />
            <circle cx="600" cy="200" r="5" fill="white" opacity="0.4" />
            <circle cx="750" cy="150" r="8" fill="white" opacity="0.6" />
            <circle cx="900" cy="220" r="6" fill="white" opacity="0.5" />

            {/* Connection lines */}
            <line
              x1="150"
              y1="100"
              x2="300"
              y2="180"
              stroke="white"
              strokeWidth="1"
              opacity="0.4"
            />
            <line
              x1="300"
              y1="180"
              x2="450"
              y2="120"
              stroke="white"
              strokeWidth="1"
              opacity="0.4"
            />
            <line
              x1="450"
              y1="120"
              x2="600"
              y2="200"
              stroke="white"
              strokeWidth="1"
              opacity="0.4"
            />
            <line
              x1="600"
              y1="200"
              x2="750"
              y2="150"
              stroke="white"
              strokeWidth="1"
              opacity="0.4"
            />
            <line
              x1="750"
              y1="150"
              x2="900"
              y2="220"
              stroke="white"
              strokeWidth="1"
              opacity="0.4"
            />

            {/* Code-like elements */}
            <text
              x="200"
              y="350"
              fontSize="12"
              fill="white"
              opacity="0.3"
              fontFamily="monospace"
            >
              const future = tech.learning();
            </text>
            <text
              x="650"
              y="450"
              fontSize="12"
              fill="white"
              opacity="0.3"
              fontFamily="monospace"
            >
              {"{ innovation: true }"}
            </text>

            {/* Geometric shapes */}
            <rect
              x="50"
              y="400"
              width="60"
              height="60"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.3"
              transform="rotate(45 80 430)"
            />
            <circle
              cx="850"
              cy="350"
              r="40"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Subtle gradient circles for depth */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -ml-36 -mb-36" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-10 pb-20 md:pt-20 md:pb-40">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white font-bold leading-tight mb-6"
          >
            Formando a Próxima Geração de Líderes em Tecnologia no Rio
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/90 text-lg md:text-xl mb-10 leading-relaxed"
          >
            Na FAETERJ-Rio, você não apenas aprende a programar. Você se prepara
            para liderar transformações digitais, resolver problemas reais e
            impactar o mercado de tecnologia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToCourses}
              className="bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-white/95 transition-all shadow-soft flex items-center justify-center gap-2 group"
            >
              Conheça nosso curso
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-all"
            >
              Solicitar Informações
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white" />
    </section>
  );
}
