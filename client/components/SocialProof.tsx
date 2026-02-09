import "./SocialProof.css";
import { motion } from "framer-motion";

export function SocialProof() {
  const companies = [
    {
      name: "Fiocruz",
      logo: "https://www.icict.fiocruz.br/sites/www.icict.fiocruz.br/files/inline-images/logo-fiocruz.png",
    },
    {
      name: "TV Globo",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Globo_logo_and_wordmark.svg",
    },
    {
      name: "IBM",
      logo: "https://images.vexels.com/media/users/3/140583/isolated/preview/905dd25934b7a05516389863f7cb9417-logotipo-da-ibm.png",
    },
    {
      name: "Accenture",
      logo: "https://cfoleadership.com/wp-content/uploads/2022/03/Acc_Logo_Black_Purple_RGB-002.png",
    },
    {
      name: "Stefanini",
      logo: "https://epassword.stefanini.com/images/logos/mobile/Logo_StefaniniGroup_2020_FullColor_1000.png",
    },
    {
      name: "Petrobras",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Petrobras_horizontal_logo.svg/1280px-Petrobras_horizontal_logo.svg.png",
    },
    {
      name: "Mercado Livre",
      logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/0/04/Logotipo_MercadoLivre.png/330px-Logotipo_MercadoLivre.png",
    },
  ];

  // Double array for infinite effect
  const doubledCompanies = [...companies, ...companies];

  return (
    <section className="py-16 md:py-24 bg-white border-y border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-primary mb-4">
            Talentos que transformam o mercado
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Nossos egressos lideram projetos em grandes corporações, startups de
            alto crescimento e institutos de pesquisa globais.
          </p>
        </motion.div>

        {/* Infinite Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="overflow-hidden"
        >
          <div className="ticker">
            <div className="ticker-content">
              {doubledCompanies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center flex-shrink-0 w-48 h-24 md:w-56 md:h-32 px-4"
                >
                  <div className="flex flex-col items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300 h-full">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="max-w-full max-h-12 md:max-h-16 object-contain"
                    />
                    <span className="text-xs font-semibold text-foreground/60 text-center line-clamp-2">
                      {company.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
