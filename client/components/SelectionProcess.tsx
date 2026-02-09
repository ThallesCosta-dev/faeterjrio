import {
  GraduationCap,
  ClipboardList,
  Globe,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  Sun,
  Moon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function SelectionProcess() {
  return (
    <section className="py-8 md:py-16 bg-secondary/30" id="processo-seletivo">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="max-w-4xl mx-auto border-primary/20 shadow-lg overflow-hidden">
            <div className="bg-primary/5 p-8 md:p-10 flex flex-col items-center text-center border-b border-primary/10">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <GraduationCap className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                Processo Seletivo 2026
              </h2>
              <p className="text-xl text-primary/80 font-semibold">
                Venha estudar conosco em 2026!
              </p>
            </div>

            <CardContent className="p-6 md:p-10 space-y-8">
            {/* Info Box */}
            <div className="bg-white rounded-xl border border-border p-6 md:p-8 shadow-sm">
              <div className="grid gap-5 text-foreground/80">
                <div className="flex items-start gap-4">
                  <ClipboardList className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <p>
                    <strong className="text-foreground">Como se inscrever:</strong> O Processo
                    Seletivo 2026 para a FAETERJ-Rio é através do SISU.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Globe className="w-5 h-5 text-primary shrink-0" />
                  <p>
                    <strong className="text-foreground">Inscrições:</strong> Exclusivamente no Site do SISU
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <p>
                    <strong className="text-foreground">Chamada Regular:</strong> 19/01 a 23/01/2026
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <p>
                    <strong className="text-foreground">Lista de Espera:</strong> 29/01 a 02/02/2026
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <p>
                    <strong className="text-foreground">Matrícula da Chamada Regular:</strong> A
                    partir de 02/02/2026
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <p>
                    <strong className="text-foreground">Matrícula da 1ª Lista de Espera:</strong>{" "}
                    24/02/2026
                  </p>
                </div>
              </div>
            </div>

            {/* Important Alert */}
            <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-lg">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg text-primary mb-3">
                    IMPORTANTE:
                  </h4>
                  <div className="text-primary/90 space-y-2">
                    <p className="font-medium">
                      Chamada Regular do SISU/2026 - 1º e 2º Semestre:
                    </p>
                    <ul className="space-y-1 ml-1">
                      <li>
                        <strong>Período de Matrícula:</strong> 02/02 a
                        06/02/2026
                      </li>
                      <li>
                        <strong>Horário:</strong> das 10 às 18h
                      </li>
                      <li>
                        <strong>Local:</strong> Secretaria da FAETERJ-Rio.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Attention Note */}
            <div className="flex items-start md:items-center gap-3 text-primary/80 bg-primary/5 p-4 rounded-lg border border-primary/10">
              <AlertCircle className="w-5 h-5 mt-0.5 md:mt-0 shrink-0" />
              <p className="text-sm md:text-base font-medium">
                <strong>Atenção:</strong> Confira abaixo as{" "}
                <strong>Chamadas do SISU 2026</strong> (1º e 2º semestre –
                Matutino e Noturno) para a FAETERJ-Rio.
              </p>
            </div>

            {/* Drive Buttons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://drive.google.com/file/d/1GwCqnsx34SksSZkrvUnjnRaLmBM65LRr/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
              >
                <Sun className="w-5 h-5 text-white/90" />
                <span className="font-medium">1º Semestre 2026 • Matutino</span>
              </a>

              <a
                href="https://drive.google.com/file/d/1MwNbpzUVt21hgA-nMMRBkbnmz8Dcf149/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
              >
                <Moon className="w-5 h-5 text-white/90" />
                <span className="font-medium">1º Semestre 2026 • Noturno</span>
              </a>

              <a
                href="https://drive.google.com/file/d/1x_sWDcDWsLz2PLD0EPGSRkVx2cNDZgbI/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
              >
                <Sun className="w-5 h-5 text-white/90" />
                <span className="font-medium">2º Semestre 2026 • Matutino</span>
              </a>

              <a
                href="https://drive.google.com/file/d/1P-hnB4pMp3NBoo3jmfHbA6sL_fIBbMiV/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
              >
                <Moon className="w-5 h-5 text-white/90" />
                <span className="font-medium">2º Semestre 2026 • Noturno</span>
              </a>
            </div>

            {/* Termo de Adesão Link */}
            <div className="text-center pt-4 border-t border-border">
              <a
                href="https://drive.google.com/file/d/18i1uhRrx2U-WCtoIOg_8Vp4xTtBaBo_-/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors p-2"
              >
                <Download className="w-5 h-5" />
                Clique aqui para baixar o TERMO DE ADESÃO
              </a>
            </div>
          </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
