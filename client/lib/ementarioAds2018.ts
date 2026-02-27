export type EmentarioSubject = {
  id: string;
  period: number;
  name: string;
  hours: number;
  pre?: string;
  content: string;
  basic: string[];
  comp: string[];
};

export const ementarioAds2018: EmentarioSubject[] = [
  {
    id: "1ORG",
    period: 1,
    name: "Organização de Computadores",
    hours: 80,
    content:
      "Histórico; Sistemas de numeração. Bases Numéricas. Conversão de Bases. Aritmética Binária e Hexadecimal. Tipos e representação de dados. Modelo de John von Neumann. Estrutura interna de memória. Hierarquia de Memória. Memória Principal, Cache e Secundária. Barramentos. Fundamentos de unidade central de processamento. Registradores. Conjunto de Instruções. Tipos de instrução. Formatos de instrução. Modos de endereçamento. Linguagens de montagem. O processo de montagem de código - objeto e executável.",
    basic: [
      "Monteiro, Mário A.; Introdução à Organização de Computadores; LTC Editora, Rio de Janeiro, 5ª edição, 2007",
      "Hennessy, J. L.; Patterson, D. A.; Organização e Projeto de Computadores - Interface Hardware/Software; Editora Campus; 4a. Edição, 2014",
    ],
    comp: [
      "Tanenbaum, A. S.; Organização Estruturada de Computadores, Pearson Education do Brasil, São Paulo; 5ª edição, 2007",
      "Stallings, Williams; Arquitetura e Organização de Computadores; Prentice Hall, São Paulo; 8ª edição, 2010",
    ],
  },
  {
    id: "1MAC",
    period: 1,
    name: "Matemática para Computação",
    hours: 80,
    content:
      "Conjuntos e suas Operações; Princípio da Inclusão e Exclusão; Argumentos, proposições, proposições compostas. Proposições e valores-verdade. Equivalência lógica. Proposição condicional e linguagem natural. Tautologia, contradição, contingência, implicação lógica, álgebra das proposições. Teoremas de Morgan. Análise Combinatória. Conceitos Básicos de Teoria de Grafos.",
    basic: [
      "ROSEN, Kenneth H. Matemática Discreta e suas Aplicações. Editora Bookman, 6ª edição. 2009.",
      "LIPSCHUTZ, S.; LIPSON, M. Matemática Discreta. Coleção Schaum, Bookman, 2004.",
      "MORGADO, A. C. O.; CARVALHO, J. B. P. C.; CARVALHO, P. C. P.; FERNANDEZ, P., Análise Combinatória e Probabilidade, 344 páginas, 6ª Edição, Publicação SBM, 2004.",
      "SANTOS, J. P. de O. Introdução à análise combinatória. Campinas: Editora da UNICAMP, 1995.",
    ],
    comp: [],
  },
  {
    id: "1FAC",
    period: 1,
    name: "Fundamentos de Algoritmos de Computação",
    hours: 80,
    content:
      "Conceito de Algoritmos; Construção de algoritmos utilizando estruturas básicas de programação; Manipulação de dados; Programação modular em linguagem C: construção de sub-rotinas; variáveis locais e globais; Parâmetros formais; Passagem de parâmetros por valor e por Referência; Solução de Problemas de Forma Modular; Manipulação de Matrizes; Noções de Complexidade de Algoritmos.",
    basic: [
      "ASCENCIO, A. F. G. e CAMPOS, E. A V., Fundamentos da Programação de Computadores - algoritmos, Pascal, C/C++ e Java. São Paulo: Pearson Education – Prentice Hall.",
      "DEITEL, P. e DEITEL, H. C Como Programar. Ed. Pearson, 2011.",
      "SCHILDT, H., C Completo e Total. São Paulo: Pearson Education – Makron Books.",
    ],
    comp: [
      "CORMEN, T. H., LEISERSON, C. E, RIVEST, R. L e STEIN, C., Algoritmos - teoria e prática, Rio de Janeiro: Campus.",
      "PIVA Jr., Engelbrecht, Angela, Nakamiti, Gilberto e Bianchi, Francisco. Algoritmos e Programação de Computadores. Ed. Campus, 2012.",
      "PREISS, Bruno R., Estruturas de Dados e Algoritmos, Rio de Janeiro: Campus, 2000.",
      "SZWARCFITER, Jayme L. e MARKENSON, Lílian, Estruturas de Dados e seus Algoritmos. São Paulo: LTC, 2010.",
      "DAMAS, L. M. D., Linguagem C, São Paulo: LTC, 2007.",
    ],
  },
  {
    id: "1MAB",
    period: 1,
    name: "Matemática Básica",
    hours: 80,
    content:
      "Conjuntos numéricos e suas operações.\nFunções: Conceitos; Função Afim; Função Quadrática; Função Exponencial; Função Logarítmica, Função definida por mais de uma sentença; Função Inversa. Aplicações de Funções. Estudo de Séries Finitas.",
    basic: ["Acervo do Curso"],
    comp: [],
  },
  {
    id: "1IAS",
    period: 1,
    name: "Introdução à Análise de Sistemas",
    hours: 80,
    content:
      "Introdução à Análise de Sistemas; Análise Essencial; Análise Estruturada; Análise Orientada a Objetos; Elicitação de requisitos. Regras de Negócios. Requisitos do sistema – Especificação. Introdução à UML; Breve Histórico; Ferramentas CASE baseadas em UML; Casos de Uso. Modelo do sistema. Modelo de domínio, conceitos, atributos, associações.",
    basic: [
      "BEZERRA, Eduardo. Princípios de análise e projeto de sistemas com UML. Rio de Janeiro: Elsevier, 2007.",
      "BOOCH, Grady; RUMBAUGH, James; JACOBSON, Ivar. UML guia do usuário. Rio de Janeiro: Elsevier, 2005.",
      "LARMAN, Craig. Utilizando UML e padrões: uma introdução à análise e ao projeto orientado a objeto. Porto Alegre: Bookman, 2004.",
    ],
    comp: [
      "FOWLER, Martim. UML essencial. Porto Alegre: BOOKMAN, 2006",
      "KRUCHTEN, P. Introdução ao RUP - Rational Unified Process. Rio de Janeiro: Ciência Moderna, 2003.",
      "MELO, Ana Cristina. Desenvolvendo aplicações com UML 2.0: do conceitual à implementação. Rio de Janeiro: Editora Brasport, 2004.",
      "SOMMERVILLE, Ian. Engenharia de Software. São Paulo: Editora Person Addison Wesley, 2007.",
    ],
  },
  {
    id: "1LPO",
    period: 1,
    name: "Língua Portuguesa",
    hours: 80,
    content:
      "Fundamentos linguísticos básicos: ortografia; sintaxe; redação; expressão oral; estrutura e organização do pensamento; elaboração de textos a partir de temas específicos; meios de expressão; argumentação; língua; linguagem e leitura; interpretação de textos; qualidade da linguagem técnica; funções da linguagem; vícios da linguagem; resumos, comunicações, apresentações e relatórios.",
    basic: [
      "BECHARA, E. Moderna gramática portuguesa. 37. ed. Rev. e ampl. Rio de Janeiro: Lucerna, 2009.",
      "FIORIN; PLATÃO. Lições de texto: leitura e redação. 4. ed. São Paulo: Ática, 2007.",
      "GARCIA, O. M. Comunicação em prosa moderna. 17. ed. Rio de Janeiro: Fundação Getúlio Vargas, 2006.",
    ],
    comp: [
      "BAGNO, Marcos. Preconceito linguístico. Rio de Janeiro: Loyola, 2003.",
      "CUNHA, C. e CINTRA, L. F. L. Nova Gramática do Português Contemporâneo, 2ª edição. Rio de Janeiro, Nova Fronteira, 2002.",
      "CARNEIRO, A. D. Redação em Construção. São Paulo, Editora Moderna, 1994.",
      "KOCH,Ingedore Grunfeld Villaça. Argumentação e linguagem. São Paulo, Cortez, 2000.",
    ],
  },
  {
    id: "1IHM",
    period: 1,
    name: "Interface Homem-Máquina",
    hours: 40,
    content:
      "Análise dos sistemas de interface nos processos de interação homem-máquina: Conceitos e elementos básicos de estudo; Fatores de influência nos processos de interação; Aspectos de Usabilidade e Comunicabilidade dos sistemas; Semiótica; Características da percepção humana; GESTALT; Tipografia e estudo das cores; Modelagem de usuários e tarefas; Prototipagem e elaboração de testes de interação.",
    basic: [
      "NIELSEN, Jakob. Usability Engineering. 1 ed. Boston: Academic Press, 1993. 1 vol.",
      "WILLIAMS, Robin. Design Para Quem Não É Designer: Princípios de Design e Tipografia para iniciantes. 5ª Ed. São Paulo: Callis, 2013.",
      "HELLER, Eva. A Psicologia das Cores: Como as Cores Afetam a Emoção e a Razão. 1ª Ed. São Paulo: GG, 2012.",
    ],
    comp: [
      "FARINA, Modesto. Psicodinâmica Das Cores Em Comunicação. 6ª Ed. São Paulo: Blucher, 2011.",
      "NEVES, Nasson. Comunicação Mediada Por Interface - A Importância Criativa e Social do Design de Interface. 1ª Ed. Alagoas: Edufal, 2006.",
      "LORANGER, Hoa; NIELSEN, Jakob. Usabilidade na Web - Projetando Websites com Qualidade. 1ª Ed. Alagoas: Rio de Janeiro, 2007.",
    ],
  },
  {
    id: "2TPH",
    period: 2,
    name: "Técnicas e Paradigmas Humanos",
    hours: 80,
    content:
      "Diversidade humana e social, preconceito, estética e ética na contemporaneidade. O trabalho e seus significados. A Instituição, A Organização e os Grupos de trabalho. O Relacionamento interpessoal, o meio ambiente, a saúde e a vida saudável no mundo corporativo. Sustentabilidade, ecologia, aspectos étnico-raciais da população brasileira. A arte e a cultura no Brasil.",
    basic: [
      "BARCELLOS, F. A psicologia aplicada a administração de empresas. Rio de Janeiro, Ediouro, 2001.",
      "BLEGER, José. Temas de psicologia entrevista e grupos. São Paulo, Martins Fontes, 2001.",
      "CANDAU, V. L. Direitos humanos, educação e interculturalidade: as tensões entre igualdade e diferença. PUC-RJ. Rev. Bras. Educação,2008.",
    ],
    comp: [
      "GDE: Gênero e Diversidade na Escola. Módulo 2, Gênero, Unidade 1, Texto 2: Gênero e outras formas de classificação social, Ministério da Educação, UFPA, 2009.",
      "GOFFMAN, E. . Estigma: notas sobre a manipulação da identidade deteriorada. 3. Ed. Rio de Janeiro: LTC Editora,1980.",
      "MINISTERIO DA EDUCAÇÃO E CULTURA. A base nacional comum curricular. Brasília, disponível em http://basenacionalcomum.mec.gov.br/a-base visualizado em: 18/12/2017",
      "SPECTOR.P. E. Psicologia nas Organizações. São Paulo, Saraiva, 2002.",
      "WAGNERIII.J.A.,HOLLENBEC K, J. R. Comportamento Organizacional. Criando Vantagem Competitiva. São Paulo, Saraiva, 2000",
    ],
  },
  {
    id: "2REQ",
    period: 2,
    name: "Engenharia de Requisitos",
    hours: 80,
    pre: "1IAS",
    content:
      "Engenharia de Software: conceitos básicos. Requisitos de Software. Processos de engenharia de requisitos. Requisitos, Técnicas para Identificação de Requisitos, Modelagem de Requisitos, Critérios de Qualidade para a Especificação de Requisitos. Regras de Negócio.\nModelo de Casos de Uso. Diagrama de atividades. Gerência de Requisitos (MoSCoW/TimeBoxing/Budgeting/Votação). BPMN, Diagramas de Transição de Estados.",
    basic: [
      "BEZERRA, Eduardo. Princípios de análise e projeto de sistemas com UML. Rio de Janeiro: Elsevier, 2007.",
      "BOOCH, Grady; RUMBAUGH, James; JACOBSON, Ivar. UML guia do usuário. Rio de Janeiro: Elsevier, 2005.",
      "LARMAN, Craig. Utilizando UML e padrões: uma introdução à análise e ao projeto orientado a objeto. Porto Alegre: Bookman, 2004.",
    ],
    comp: [
      "FOWLER, Martim. UML essencial. Porto Alegre: BOOKMAN, 2006",
      "KRUCHTEN, P. Introdução ao RUP - Rational Unified Process. Rio de Janeiro: Ciência Moderna, 2003.",
      "MELO, Ana Cristina. Desenvolvendo aplicações com UML 2.0: do conceitual à implementação. Rio de Janeiro: Editora Brasport, 2004.",
      "SOMMERVILLE, Ian. Engenharia de Software. São Paulo: Editora Person Addison Wesley, 2007.",
    ],
  },
  {
    id: "2CAW",
    period: 2,
    name: "Construção de Aplicações WEB",
    hours: 80,
    pre: "1IHM",
    content:
      "Criação de sites páginas na Internet dentro dos padrões da Web semântica; Utilização de tags semânticas; Estilização e Layout responsivo; Utilização de recursos multimídia; Validação e manipulação de objetos HTML com Javascript; Utilização de efeitos de transição e animações; Folhas de estilo em cascata e padronização de recursos visuais para diferentes browsers.",
    basic: [
      "ABREU, Luís. HTML 5. 3ª Ed. Lisboa: FCA, 2013.",
      "CLARK, Richard ; MURPHY, Chistopher; STUDHOLME, Oil. Introdução ao Html5 e Css3. 1 ed. Rio de Janeiro: Alta Books, 2014.",
      "MCFARLAND, David. Css3 - o Manual Que Faltava - o Livro Que Devia Vir na Caixa. 3ª Ed. Rio de Janeiro: Alta Books, 2015.",
    ],
    comp: [
      "SILVA, Maurício. Css3 - Desenvolva Aplicações Web Profissionais Com o Uso Dos Poderosos Recursos de Estilização Das Css3 . 1ª Ed. São Paulo: Novatec, 2012.",
      "SILVA, Maurício. Html5 - A Linguagem da Marcação Que Revolucionou A Web. 2ª Ed. São Paulo: Novatec, 2014.",
      "CHICOLI, Milton. Guia Prático de Criação de Sites - Html Css Javascript Dreamweaver Hospedagem e Publicação de Sites. 1ª Ed. São Paulo: Digerati, 2008.",
    ],
  },
  {
    id: "2FPR",
    period: 2,
    name: "Fundamentos de Programação",
    hours: 80,
    pre: "1FAC",
    content:
      "Uso da linguagem C; Tipos abstratos de dados; Uso de arquivos textuais e binários; manipulação de matrizes uni e multidimensionais, strings; alocação dinâmica de memória; recursão. Criação de projetos e aplicações. Backtraking. Algoritmos de busca e ordenação. Complexidade de algoritmos.",
    basic: [
      "ASCENCIO, A. F. G. e CAMPOS, E. A V., Fundamentos da Programação de Computadores - algoritmos, Pascal, C/C++ e Java. São Paulo: Pearson Education – Prentice Hall.",
      "DEITEL, P. e DEITEL, H. C Como Programar. Ed. Pearson, 2011.",
      "SCHILDT, H., C Completo e Total. São Paulo: Pearson Education – Makron Books.",
    ],
    comp: [
      "CORMEN, T. H., LEISERSON, C. E, RIVEST, R. L e STEIN, C., Algoritmos - teoria e prática, Rio de Janeiro: Campus.",
      "PIVA Jr., Engelbrecht, Angela, Nakamiti, Gilberto e Bianchi, Francisco. Algoritmos e Programação de Computadores. Ed. Campus, 2012.",
      "PREISS, Bruno R., Estruturas de Dados e Algoritmos, Rio de Janeiro: Campus, 2000.",
      "SZWARCFITER, Jayme L. e MARKENSON, Lílian, Estruturas de Dados e seus Algoritmos. São Paulo: LTC, 2010.",
      "DAMAS, L. M. D., Linguagem C, São Paulo: LTC, 2007",
    ],
  },
  {
    id: "2LES",
    period: 2,
    name: "Língua Estrangeira",
    hours: 40,
    pre: "1LPO",
    content:
      "Classes de palavras. O Sistema verbal. Morfologia. Estrutura da língua inglesa. Uso do dicionário. Estratégias de Leitura na Língua Inglesa. Interpretação de textos técnicos de computação. Textos práticos com conteúdos a referentes à computação. Tipos e técnicas de tradução. Introdução à prática das habilidades gerais de leitura.",
    basic: [
      "GALANTE, T. P. Inglês Básico Para Informática. São Paulo, Editora Atlas,1997.",
      "OLIVEIRA, S.R.F. Estratégias de Leitura para Inglês Instrumental. Brasília, Editora UNB, 1994.",
      "SUCESU Dicionário de Informática Inglês-Português Rio de Janeiro, Sucesu, 1990.",
      "COLLINS. Dicionário Escolar Ing.-Port./Port.- Ingl. SP: Disal, 2002.",
      "CRUZ, Décio Torres et alli. Inglês com Textos para Informática. SP: Disal, 2003.",
      "Dicionário de Informática Multimídia e Realidade. Editora Melhoramentos, 2001.",
      "MULVEY, Dan. Grammar - the easy way. Ed. Barron ´s, 2002.",
      "OLIVEIRA, S. R. F. Estratégias de Leitura para Inglês Instrumental. Brasília: UNB, 1994.",
      "OLIVEIRA, R. S. Minidicionário compacto de Informática. São Paulo: Rideel, 1999, 2. ed.",
      "SAWAYA, Márcia R. Dicionário de Informática e Internet. Nobel, 1999.",
      "VELLOSO, Monica S. Inglês para Concursos. Brasília, DF: VESTCON, 2002.",
    ],
    comp: [],
  },
  {
    id: "2MPA",
    period: 2,
    name: "Métodos e Processos Administrativos",
    hours: 40,
    content:
      "Conceitos básicos. Evolução histórica. Introdução à teoria geral da administração. Organização e Estruturas. Ambiente interno e externo. Funções administrativas. Estratégia e planejamento. Estrutura empresarial. Modernas técnicas de gerenciamento. Análise das funções administrativas. Administrando a mudança e a inovação nas Organizações. Coordenação e projeto. Motivação, desempenho e satisfação no trabalho. Liderança. Equipes de trabalho. Comunicação e negociação. Administração da carreira individual. Planejamento estratégico. Sistemas de Informação na empresa.",
    basic: [
      "CHIAVENATTO, I. Iniciação à Administração Geral. São Paulo, McGraw-Hill, 1997.",
      "CHIAVENATTO, I. Teoria Geral da Administração. São Paulo, McGraw-Hill, 1996.",
      "CHIAVENATTO, I. Administração: Teoria e Prática. São Paulo, McGraw-Hill, 1995.",
      "CHINELATO FILHO, J. O & M Integrado à Informática. Rio de Janeiro, LTC, 1998.",
      "DRUCKER, P.F. A Administração na Próxima Sociedade. São Paulo: Nobel, 2003.",
      "DRUCKER, P. F. A Prática de Administração de Empresas. Pioneira, 1998.",
      "DRUCKER, P. F. A Nova Era da Administração. Pioneira, 1992.",
      "FARIA, A. N. Organização e Métodos. São Paulo, LTC Editora, 1993.",
      "LERNER, W. Organização, Sistemas e Métodos. 5 ed. São Paulo, Editora Atlas, 1992.",
    ],
    comp: [],
  },
  {
    id: "2SOP",
    period: 2,
    name: "Fundamentos de Sistemas Operacionais",
    hours: 80,
    pre: "1ORG",
    content:
      "Introdução e Histórico dos Sistemas Operacionais. Chamadas ao Sistema Operacional. Gerência de Processos e Threads. Gerência de Memória Virtual. Gerenciamento de dispositivos de entrada e saída.\nSistemas de arquivos. Estudo de Sistemas Operacionais comerciais.",
    basic: [
      "MACHADO, Francis B.; MAIA, Luiz P. Arquitetura de Sistemas Operacionais - 4a edição - Rio deJaneiro: LTC",
      "TANENBAUM, Andrew S. Sistemas Operacionais Modernos – 2ª edição – São Paulo: Prentice- Hall, 2003.",
    ],
    comp: [
      "SILBERSCHATZ, Abraham; GAGNE, Greg.; GALVIN, Peter Baer. Sistemas Operacionais conceitos. São Paulo: Prentice Hall, 2000.",
      "STARLIN, Gorki; ALCÂNTARA, Izaías. Windows 2000 Server – Curso Completo. Rio de Janeiro: Alta Books, 2002",
      "DaSILVA, Gleydson M. Guia Foca Linux Iniciante, versão 3.99. Disponível on-line em www.guiafoca.org, 2005",
      "DaSILVA, Gleydson M. Guia Foca Linux Intermediário, versão 5.45. Disponível on-line em www.guiafoca.org, 2005",
      "DaSILVA, Gleydson M. Guia Foca Linux Avançado, versão 6.40. Disponível on-line em www.guiafoca.org, 2005",
    ],
  },
  {
    id: "2CAL",
    period: 2,
    name: "Cálculo",
    hours: 80,
    pre: "1MAB",
    content:
      "LIMITES E CONTINUIDADE. Conceito e noção intuitiva de limite. Propriedades básicas. Limites Laterais. Teorema do Confronto. Limites infinitos e limites no infinito. Operações com o símbolo. DERIVADAS: CONCEITO E REGRAS. Conceito e interpretação geométrica. Regras básicas de derivação. Derivadas das funções elementares. Derivada da função composta. Derivada da função inversa. Derivadas das funções trigonométricas inversas. Problemas de Taxa de Variação. DERIVADAS: APLICAÇÕES. Máximos e Mínimos. Teoremas de Rolle e do Valor Médio. Regra de L’Hôpital no cálculo de limites. Região de crescimento e concavidade. Esboço de gráficos. INTEGRAL. Primitivas e o Conceito de Integral. O Teorema Fundamental do Cálculo. Técnicas de Integração. Integrais Impróprias. . Cálculo de áreas por integração. Cálculo de volumes. Funções de várias variáveis. Máximos e mínimos de funções de várias variáveis. Séries.",
    basic: [
      "Ávila, G. S.; Cálculo, vol. 1; Ed. LTC",
      "Munem M. & Foulis D.; Cálculo, vol. 1; Guanabara Dois",
      "Swokowski, E.; Cálculo com Geometria Analítica; Makron",
      "Stewart, J.; Cálculo, vol. 1,Cengage 5. Thomas, G. B.; Cálculo, vol. 1; Ed. MakronBooks",
    ],
    comp: [
      "Ruggiero, Márcia A. Gomes e Lopes, Vera Lucia Rocha; Cálculo Numérico, Aspectos Teóricos e Computacional",
      "Burden, Richard L. e Faires, J. Douglas: Análise Numérica.",
    ],
  },
  {
    id: "3POB",
    period: 3,
    name: "Programação Orientada a Objetos Básica",
    hours: 80,
    pre: "2FPR",
    content:
      "Paradigmas Procedural x Orientado a Objetos; Ambiente de Programação; Comandos Básicos; Visibilidade; Escopo das Variáveis; Conceitos da Orientação a Objetos e da Linguagem Java; Tratamento de Exceções; Erro de Compilação e Erro de Execução; Exceções checked e unchecked; Blocos (try, catch e finally); Cláusula throw; Cláusula throws; Coleções; Interfaces List, Set e Map; Classes ArrayList, LinkedList, HashSet, TreeSet, HashMap e Hashtable;Ordenação de coleções; For each; Iterator; Generics; enum; varags; Introdução as Anotações; Javadoc; Lambda; Method Reference.",
    basic: [
      "SIERRA,K.;BATES,B. Use a Cabeça! Java 2ª edição. Editora. Alta Books, 2005",
      "DEITEL. Java: como programar, 10ª edição, Editora Pearson Hall, 2005",
      "ORACLE. Java Tutorial. Disponível em: https://docs.oracle.com/javase/tutorial/",
    ],
    comp: [
      "KATHY SIERRA,K.;BATES,B. Certificação Sun para Programador Java 6 - Guia de Estudos. Editora: Alta Books, 2009",
      "OAKS,S. Segurança de Dados em Java Rio de Janeiro, Ciência Moderna, 1999.",
      "ASCENCIO, Ana Fernanda; CAMPOS, Edilene de. Fundamentos da Programação de Computadores – Algoritmos, Pascal C/C++ e Java. Editora Pearson, 2007.",
    ],
  },
  {
    id: "3PBD",
    period: 3,
    name: "Projeto de Banco de Dados",
    hours: 80,
    pre: "2FPR",
    content:
      "Sistemas de gerenciamento de banco de dados relacional. Modelos de banco e dados. Modelos conceitual e lógico. Arquitetura Banco de Dados: nível interno, conceitual e externo. Independência de dados. Modelo de dados relacional. Álgebra relacional. Modelo entidade-relacionamento. Mapeamento do modelo E-R para o modelo relacional. Linguagem SQL de definição e manipulação de dados. Conceito de transação. Dependência funcional e normalização no modelo de dados relacional.",
    basic: [
      "DATE, C. J. Introdução a Sistemas de Banco de Dados. 8.ed. Campus, 2004.",
      "ELMASRI, Ramez, NAVATHE, Shamkant, SOUZA, Teresa Cristina Padilha de. Sistemas de banco de dados: fundamentos e aplicações. 3.ed. Rio de Janeiro: LTC, 2002.",
    ],
    comp: [
      "KORTH, Henry F., SILBERSCHATZ, Abraham & SUDARSHAN, S. Sistema de banco de dados. 5 ed., Rio de Janeiro: Editora Elsevier, 2006.",
      "HEUSER, Carlos Alberto. Projeto de Banco de Dados. 6.ed. Porto Alegre: Bookman, 2009.",
    ],
  },
  {
    id: "3DAW",
    period: 3,
    name: "Desenvolvimento de Tecnologias WEB",
    hours: 80,
    pre: "2CAW",
    content:
      "Criação e configurações de servidores WEB para construção de aplicações WEB. Administração e configuração de Dashboard web. Aplicação e configuração de CMS para construção de aplicações WEB. Desenvolvimento de front-end, Interfaces com HTML, PHP, JAVASCRIPT e CSS, Interação Humano-Computador para Desenvolvimento Front-end Web, utilização e configuração de Frameworks Front-end com Conexão com Back-end.",
    basic: [
      "SILVA, Maurício. Css3 - Desenvolva Aplicações Web Profissionais Com o Uso Dos Poderosos Recursos de Estilização Das Css3 . 1ª Ed. São Paulo: Novatec, 2012.",
      "SILVA, Maurício. Html5 - A Linguagem da Marcação Que Revolucionou A Web. 2ª Ed. São Paulo: Novatec, 2014.",
      "CHICOLI, Milton. Guia Prático de Criação de Sites - Html Css Javascript Dreamweaver Hospedagem e Publicação de Sites. 1ª Ed. São Paulo: Digerati, 2008.",
    ],
    comp: [
      "ABREU, Luís. HTML 5. 3ª Ed. Lisboa: FCA, 2013.",
      "CLARK, Richard ; MURPHY, Chistopher; STUDHOLME, Oil. Introdução ao Html5 e Css3. 1 ed. Rio de Janeiro: Alta Books, 2014.",
      "MCFARLAND, David. Css3 - o Manual Que Faltava - o Livro Que Devia Vir na Caixa. 3ª Ed. Rio de Janeiro: Alta Books, 2015.",
    ],
  },
  {
    id: "3ALG",
    period: 3,
    name: "Álgebra",
    hours: 80,
    pre: "1MAC",
    content:
      "Introdução ao estudo de vetores; Estudo de equações lineares; Conceitos de transformações e operações lineares; Cálculos de determinantes; Auto valor; Auto vetor; Aplicações práticas.",
    basic: [
      "ANTON, Howard, Rorres, Álgebra Linear com Aplicações, 2010",
      "LANG. Serge, Linear Algebra",
    ],
    comp: [
      "MURDOCH, A., Álgebra Linear, Blucher 1882",
      "GELFAND, I., Lectures on Linear Algebra, 1995",
      "LIPSCHUTZ, S. Álgebra Linear. São Paulo: McGraw Hill, 1981.",
      "STREINBRUCH, A. Álgebra Linear. São Paulo: Makron Books, 1985.",
      "BOLDRINI, J.L. Álgebra Linear. Florisnópolis: Harbra, 1988.",
    ],
  },
  {
    id: "3ESD",
    period: 3,
    name: "Estrutura de Dados",
    hours: 80,
    pre: "2FPR",
    content:
      "Tipos Abstratos de Dados; Estruturas de Dados Lineares; Árvores; Pesquisa Digital; Análise de Complexidade de Algoritmos.",
    basic: [
      "TENEBAUM, A. LANGSAM, Y. AUGENSTEIN, M. Estruturas de Dados usando C , Makron Books do Brasil/McGraw-Hill, 1995, 2ª edição",
      "SCHILDT, H. C Completo e Total, 3a edição São Paulo. Makron Books. 1997.",
      "HOROWITZ, E. SAHNI, S. Fundamentos de Estruturas de Dados -6ª Edição. Editora Campus. 2006.",
    ],
    comp: [
      "SCHILDT, H. C Avançado – Guia do Usuário São Paulo. Makron Books. 1990.",
      "DEITEL, Harvey M.; DEITEL, Paul J.. Como programar em C. Rio de Janeiro: LTC, 1999.",
      "DAMAS, Luis Manuel Dias. Linguagem C. 10ª. ed. Novatec, 2007.",
      "FEOFILOFF, Paulo. Algoritmos em Linguagem C. Elsevier, 2008",
      "ASCENCIO, A.F. & CAMPOS, E.A. Fundamentos de programação de computadores Algoritmos, Pascal, C/C++ e Java. 2ed. São Paulo:Pearson Prentice-Hall, 2007.",
    ],
  },
  {
    id: "3RSD",
    period: 3,
    name: "Fundamentos de Redes e Sistemas Distribuídos",
    hours: 80,
    pre: "2SOP",
    content:
      "Introdução as redes de computadores e Internet. Apresentação das camadas do modelo de referência OSI e arquitetura TCP/IP. Padrões estabelecidos. Protocolos de aplicação. Modelos de arquitetura de aplicação. Protocolos TCP e UDP. Protocolo IP nas versões correntes. Endereçamento IP. Roteamento IP. Cálculo de endereçamento IP. Identificando redes e sub-redes. Máscaras de rede.",
    basic: [
      "KUROSE, J. Redes de computadores e a Internet: uma abordagem top-down. James F. Kurose, Keith W. Ross; tradução Daniel Vieira; revisão técnica Wagner Luiz Zucchi. – 6a. Edição – São Paulo: Pearson Education do Brasil, 2013",
      "TANENBAUM, A. S. Sistemas operacionais modernos. 3.ed. São Paulo: Pearson, 2009.",
      "COULOURIS,G.; DOLLIMORE, J.; KINDBERG, T. Sistemas Distribuídos: Conceitos e Projeto. 5. ed. Rio de Janeiro: Bookman, 2013.",
    ],
    comp: [
      "COMER, D. E. Redes de computadores e internet: abrange transmissão de dados, ligações interredes, web e aplicações. 4.ed. Porto Alegre, Bookman, 2007",
      "TANENBAUM, A. S. Redes de Computadores 3a edição Rio de Janeiro, Campus, 1997.",
      "CARVALHO, J. E. M. Introdução às Redes de Micros São Paulo, Makron Books, 1998.",
    ],
  },
  {
    id: "4POA",
    period: 4,
    name: "Programação Orientada a Objetos Avançada",
    hours: 80,
    pre: "3POB",
    content:
      "UML X Java; Codificação a partir de diagramas; Implementação de relacionamentos; Leitura e Escrita de Arquivos; Classe File, FileReader, FileWriter, BufferedWriter, BufferedReader; Threads, Classe Thread, Interface Runnable, Synchronized; Serialização de Objetos, Classes: FileOutputStream, ObjectOutputStream, FileInputStream, ObjectInputStream; Java para Web, modelos, componentes de uma aplicação web, Página estática x Página dinâmica, JSP, Servlet; Padrão MVC; Banco de dados X Java, JDBC, DAO; Introdução aos Padrões de Projeto, PIs.",
    basic: [
      "SIERRA,K.;BATES,B. Use a Cabeça! Java 2ª edição. Editora. Alta Books, 2005",
      "DEITEL. Java: como programar, 10ª edição, Editora Pearson Hall, 2005",
      "ORACLE. Java Tutorial. Disponível em: https://docs.oracle.com/javase/tutorial/",
    ],
    comp: [
      "KATHY SIERRA,K.;BATES,B. Certificação Sun para Programador Java 6 - Guia de Estudos. Editora: Alta Books, 2009",
      "OAKS,S. Segurança de Dados em Java Rio de Janeiro, Ciência Moderna, 1999.",
      "ASCENCIO, Ana Fernanda; CAMPOS, Edilene de. Fundamentos da Programação de Computadores – Algoritmos, Pascal C/C++ e Java. Editora Pearson, 2007.",
    ],
  },
  {
    id: "4UBD",
    period: 4,
    name: "Utilização de Banco de Dados e SQL",
    hours: 80,
    pre: "3PBD",
    content:
      "Indexação e otimização em banco de dados. Processamento e otimização de consultas. Recuperação de falhas. Segurança e integridade de dados. Controle de concorrência. Gerenciamento de transações. Tópicos avançados em banco de dados. Banco de dados não convencionais. Novas aplicações de banco de dados.",
    basic: [
      "DATE, C. J. Introdução a Sistemas de Banco de Dados. 8.ed. Campus, 2004.",
      "ELMASRI, Ramez, NAVATHE, Shamkant, SOUZA, Teresa Cristina Padilha de. Sistemas de banco de dados: fundamentos e aplicações. 3.ed. Rio de Janeiro: LTC, 2002.",
    ],
    comp: [
      "KORTH, Henry F., SILBERSCHATZ, Abraham & SUDARSHAN, S. Sistema de banco de dados. 5 ed., Rio de Janeiro: Editora Elsevier, 2006.",
      "HEUSER, Carlos Alberto. Projeto de Banco de Dados. 6.ed. Porto Alegre: Bookman, 2009.",
    ],
  },
  {
    id: "4MOD",
    period: 4,
    name: "Modelagem de Sistemas",
    hours: 80,
    pre: "2REQ, 3PBD",
    content:
      "Definição de Modelo, o processo de modelagem, níveis de modelagem; Modelo entidade-relacionamento. Diagrama de casos de uso (revisão). Diagrama de classes do domínio e objetos, Diagrama de interações Diagrama de máquina de estados. Mapeamento de objetos para o modelo relacional. Fundamentos de projeto de padrões. Aplicações. Utilização de Ferramentas CASE.",
    basic: [
      "FOWLER, Martim. UML essencial. Porto Alegre: BOOKMAN, 2006",
      "KRUCHTEN, P. Introdução ao RUP - Rational Unified Process. Rio de Janeiro: Ciência Moderna, 2003.",
      "LARMAN, Craig. Utilizando UML e padrões: uma introdução à análise e ao projeto orientado a objeto. Porto Alegre: Bookman, 2004.",
    ],
    comp: [
      "BEZERRA, Eduardo. Princípios de análise e projeto de sistemas com UML. Rio de Janeiro: Elsevier, 2007.",
      "BOOCH, Grady; RUMBAUGH, James; JACOBSON, Ivar. UML guia do usuário. Rio de Janeiro: Elsevier, 2005.",
      "MELO, Ana Cristina. Desenvolvendo aplicações com UML 2.0: do conceitual à implementação. Rio de Janeiro: Editora Brasport, 2004.",
      "SOMMERVILLE, Ian. Engenharia de Software. São Paulo: Editora Person Addison Wesley, 2007.",
    ],
  },
  {
    id: "4SEG",
    period: 4,
    name: "Segurança da Informação",
    hours: 80,
    pre: "3RSD",
    content:
      "Frameworks de Governança e Gestão de TI (ITIL, COBIT, PMI, etc), ISO 27000 e SGSI. Criptografia, Chaves simétricas e assimétricas, objetivos, características e algoritmos, certificado e assinatura digital, autoridades certificadoras. Ameaças e tipos de ataques. Soluções existentes para proteção/prevenção: firewall, proxy, DMZ, antivírus, antispyware, IDS/IPS, HoneyPot/HoneyNet, DLP, controle de acesso físico e lógico, documentação, backup, VPN, etc. Tópicos de desenvolvimento e segurança.",
    basic: [
      "STALLINGS, W. Criptografia e Segurança de Redes. ; tradução Daniel Vieira; revisão técnica Graça Bressan, Ákio Barbosa e Marcelo Succi. - 4a Edição - São Paulo: Pearson Prentice Hall, 2008.",
      "Site CERT.br - Práticas de Segurança para Administradores de Redes Internet. NIC BR Security Office -http://www.nbso.nic.br/",
      "KUROSE, J. Redes de computadores e a Internet: uma abordagem top-down/ James F. Kurose, Keith W. Ross; tradução Daniel Vieira; revisão técnica Wagner Luiz Zucchi. – 6a. Edição – São Paulo: Pearson Education do Brasil, 2013.",
    ],
    comp: [],
  },
  {
    id: "4EST",
    period: 4,
    name: "Estatística e Probabilidade",
    hours: 80,
    pre: "2CAL, 3ALG",
    content:
      "Introdução aos Estudos da Estatística: definição; divisão da estatística; variáveis; fases dos métodos estatísticos; Representação de Dados Estatísticos: séries estatísticas; gráficos estatísticos; Estudos de Distribuições e Frequência: medidas e tendência central; separatrizes; medidas de dispersão; assimetria e curtose .",
    basic: [
      "BUNCHAFT, G. Estatística sem Mistérios - Vol. 1, Vozes, 2001.",
      "COSTA NETO, P.L.O. Estatística, Edgard Blucher, 1999.",
      "CRESPO, A. Estatística Fácil São Paulo, Atlas, 1996.",
    ],
    comp: [
      "FONSECA, J.S. Curso de Estatística, Atlas, 1999.",
      "FREUND, J.E. Estatística Aplicada, Makron, 2000.",
      "MOORE, D. Estatística Básica e sua Prática, LTC, 1998.",
      "OLIVEIRA, F.E.M. Estatística e Probabilidade, Atlas, 2000.",
      "TOLEDO, G.L. Estatística Básica, Atlas, 1999.",
      "TRIOLA, M.F. Introdução à Estatística, LTC, 2000.",
    ],
  },
  {
    id: "4ADS",
    period: 4,
    name: "Tópicos em ADS",
    hours: 80,
    pre: "2REQ, 3POB, 3PBD",
    content:
      "Projeto Lógico de Software: Conceitos. Projeto de Arquitetura. Projeto de Componentes. Projeto de Interfaces. Padrões de Projeto. Qualidade de Software. Testes de Software. Visões. Tipos. Níveis. Abrangência. Verificação e Validação. Plano e casos. Técnicas. Revisões. Integração dos conteúdos abordados nas disciplinas com foco em análise de sistemas baseado em Estudos de Casos, especialmente questões de ENADE na segunda parte do curso, que devem ir além de projeto lógico: questões de requisitos, de banco de dados, de estruturas de dados, de algoritmos e até algumas de redes e organização de computadores, passando por – Algoritmos e Programação, Análise e Projeto de Sistemas, Engenharia de Software, Bancos de Dados, Gerenciamento de Projetos, Testes e Qualidade de Software e Novas Tendências Tecnológicas.",
    basic: [
      "PRESSMAN, R. et al. Engenharia de Software – uma abordagem profissional.",
      "BOOCH, Grady; RUMBAUGH, James; JACOBSON, Ivar. UML guia do usuário. Rio de Janeiro: Elsevier, 2005.",
      "LARMAN, Craig. Utilizando UML e padrões: uma introdução à análise e ao projeto orientado a objeto. Porto Alegre: Bookman, 2004.",
    ],
    comp: [
      "BEZERRA, Eduardo. Princípios de análise e projeto de sistemas com UML. Rio de Janeiro: Elsevier, 2007.",
      "FOWLER, Martim. UML essencial. Porto Alegre: BOOKMAN, 2006",
      "SOMMERVILLE, Ian. Engenharia de Software. São Paulo: Editora Person Addison Wesley, 2007.",
    ],
  },
  {
    id: "4MET",
    period: 4,
    name: "Metodologia da Pesquisa",
    hours: 40,
    pre: "3PBD",
    content:
      "Discussão e avaliação das características essenciais da ciência e do conhecimento. Teoria do conhecimento. Diferenças entre tipos de pesquisa e trabalhos acadêmicos. Planejamento da pesquisa. Coleta de Dados e Informações. Problema e Hipótese. Construção de pré-texto, texto e pós-texto. Anteprojeto. Uso de pesquisas bibliográficas. O estudo do processo de investigação e da metodologia científica serão adotados conforme a norma técnica ABNT/vigente.",
    basic: [
      "ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS - ABNT. Referências: Elaboração: NBR14724. São Paulo, Ago/2002.",
      "BASTOS, Lilia da R. Ciências Humanas e Complexidades: projetos métodos e técnicas de pesquisa. Juiz de Fora: EDUFJF, Londrina CEFIL, 1999.",
      "BASTOS, Lilia da R.; PAIXÃO, Lyra; FERNANDES, Lúcia M. & DELUIZ, Neise. Manual para a elaboração de projetos e relatórios de pesquisa, teses, dissertações e monografias. RJ: LTC, 1985.",
      "BOENTE, A.N.P. & BRAGA, G.P. Metodologia Científica Contemporânea para Univeritários e Pesquisadores. Rio de Janeiro: Brasport, 2004.",
      "CERVO, Amado Luiz & BERVIAN, Pedro Alcino. Metodologia científica:para uso dos estudantes universitários. Rio de Janeiro: Pioneira, 1985.",
      "COSTA, Marco Antonio F. e COSTA, Maria de Fátima Barrozo. Metodologia da Pesquisa Conceitos e Técnicas. Rio de Janeiro: Interciência,2001.",
    ],
    comp: [
      "ECO, Umberto. Como se faz uma tese.São Paulo: Perspectiva, 1996.",
      "GIL, A. C. Métodos e Técnicas de Pesquisa Social. 5a Ed. São Paulo: Atlas,1999.",
      "LAKATOS, Eva Maria. & MARCONI M. de A. Fundamentos de Metodologia Científica, 4a Ed. São Paulo: Atlas, 2001.",
      "LOPES, Gertrudes Teixeira (org). Manual para elaboração de monografias, dissertações e teses. Rio de Janeiro: EPU, 2002.",
      "MINAYO, Maria Cecília de Souza et al. Pesquisa Social: teoria, método e criatividade. 14ª ed. Petrópolis: Vozes, 1999.",
      "MINAYO, M. C. de S. Desafio do Conhecimento. São Paulo: ABRASCO, 1994.",
      "RUDIO, Franz Victor. Introdução ao projeto de pesquisa científico. Petrópolis: Vozes, 1995.",
      "SALOMON, Décio Vieira.Como fazer uma monografia. Belo Horizonte: Interlivros, 1974.",
      "SEVERINO, Antônio Joaquim. Metodologia do trabalho científico. 21ª ed. São Paulo: Cortez, 1996.",
    ],
  },
  {
    id: "4EMP",
    period: 4,
    name: "Empreendedorismo e Inovação",
    hours: 40,
    pre: "2MPA",
    content:
      "Gestão empreendedora na área de informática, com ênfase no estudo do perfil do empreendedor, nas técnicas de identificação e aproveitamento de oportunidades, na aquisição e gerenciamento dos recursos necessários ao negócio. Utilizar metodologias que priorizam técnicas de criatividade e da aprendizagem pró-ativa, assim como os métodos para a elaboração de planos de negócios empresariais. Ferramentas da qualidade direcionadas para software. Palestras proferidas por empresários e/ou professores membros de Fundações, universidades e Parques Tecnológicos e Incubadoras, sobre temas de interesse para o desenvolvimento do programa de negócio de Software. \"Business Plan\" e \"E-Commerce/Business\". Resultados na empresa, os números da empresa, estudos de casos bem sucedidos na área de informática.",
    basic: [
      "CULLINANE, J. J. Manual de Sobrevivência do Empreendedor, Berkeley do Brasil, 1993.",
      "DEGEN, R. O Empreendedor - Fundamentos da Iniciativa Empresarial, McGraw-Hill, São Paulo, 1989.",
      "DORNELAS, J. C. A. Empreendedorismo Transformando Idéias em Negócios. Rio de Janeiro, Campus, 2001.",
      "LODOSH, L. Empreendedorismo e Marketing. Rio de Janeiro: Campus, 2002.",
      "MALFERRARI, C. J., Drucker, P. F. Inovação e Espírito Empreendedor: Prática e Princípios, 5ª edição, Pioneira, 1998.",
      "PAVANI, C. Plano de Negócios, Lexikon, 1998.",
    ],
    comp: [
      "RESNIK, P. A Bíblia Da Pequena Empresa, Makron Books, São Paulo, 1990.",
      "SHEEDY, E. Guia do Empreendedor para Fazer a Empresa Crescer, Nobel, 1996.",
      "Programa SoftStart de Formação para o Empreendedorismo, Softex, 1998.",
    ],
  },
  {
    id: "5SBD",
    period: 5,
    name: "Programação de Scripts de Banco de Dados",
    hours: 80,
    pre: "4UBD",
    content:
      "Praticar os principais comando e funções do SQL disponíveis no SGBD. Construir scripts para estudar e conhecer na prática os principais comandos SQL utilizados em um SGBD.",
    basic: [
      "DATE, C. J. Introdução a Sistemas de Banco de Dados. 8.ed. Campus, 2004.",
      "ELMASRI, Ramez, NAVATHE, Shamkant, SOUZA, Teresa Cristina Padilha de. Sistemas de banco de dados: fundamentos e aplicações. 3.ed. Rio de Janeiro: LTC, 2002.",
    ],
    comp: [
      "KORTH, Henry F., SILBERSCHATZ, Abraham & SUDARSHAN, S. Sistema de banco de dados. 5 ed., Rio de Janeiro: Editora Elsevier, 2006.",
      "HEUSER, Carlos Alberto. Projeto de Banco de Dados. 6.ed. Porto Alegre: Bookman, 2009.",
    ],
  },
  {
    id: "5PJS",
    period: 5,
    name: "Projeto de Sistemas",
    hours: 80,
    pre: "4MOD",
    content:
      "Definição de Conceitos básicos referentes ao processo de produção de software. Definição de Conceitos básicos referentes ao processo de produção de software; Principais fases de um processo de produção de software; Uso de Diagramas da UML (caso de uso e classes, atividades e sequência). Processo de software. Métodos de desenvolvimento de software, tradicionais e ágeis. Frameworks Front-end e Conexão com Back-end (JSF, JPA, Spring e VRaptor) jQuery , Bootstrap, Yii, zend.",
    basic: [
      "BEZERRA, Eduardo. Princípios de análise e projeto de sistemas com UML. Rio de Janeiro: Elsevier, 2007.",
    ],
    comp: [],
  },
  {
    id: "5PDM",
    period: 5,
    name: "Programação de Dispositivos Móveis",
    hours: 80,
    pre: "4POA",
    content:
      "Características de dispositivos móveis; Características da programação móvel; Comparação entre dispositivos móveis; Principais plataformas e tecnologias; Aplicações Mobile Nativas x Híbridas x Web Mobile; Design e Layouts; UX /UI Design; Prototipagem para aplicações móveis; Criação de aplicações; Recursos para programação em dispositivos móveis; Persistência de dados para aplicações móveis; Segurança em plataformas móveis.",
    basic: [
      "LECHETA, R. R. Android Essencial com Kotlin. São Paulo : Novatec Editora, 2017.",
      "TERUEL,C.E. Web Mobile: Desenvolva Sites para Dispositivos Móveis com Tecnologias de Uso Livre. Rio de Janeiro:Ciência Moderna, 2010.",
      "ALCOCER, Ricardo. Build Native Cross-Platform Apps with Appcelerator: A beginner's guide for Web Developers. J.B. Orion, 2015.",
      "COPE, Darren. Appcelerator Titanium Application Development by Example Beginner's Guide. Packt Publishing Ltd, 2013.",
      "ADOBE PHONEGAP. Tutorial Phonegap. Disponível em: http://docs.phonegap.com/tutorials",
      "ORACLE. Java Tutorial. Disponível em: https://docs.oracle.com/javase/tutorial/",
      "ASCENCIO, Ana Fernanda; CAMPOS, Edilene de. Fundamentos da Programação de Computadores – Algoritmos, Pascal C/C++ e Java. Editora Pearson, 2007.",
    ],
    comp: [
      "DEITEL, H. M.; DEITEL, P. J. Java: Como Programar. São Paulo: Prentice-Hall, 2010.",
      "LECHETA, R. R. Google Android: Aprenda a criar aplicações para dispositivos móveis com o Android SDK. São Paulo : Novatec Editora, 2010.",
      "SIERRA,K.;BATES,B. Use a Cabeça! Java 2ª edição. Editora. Alta Books, 2005",
      "OAKS,S. Segurança de Dados em Java Rio de Janeiro, Ciência Moderna, 1999.",
    ],
  },
  {
    id: "5GPS",
    period: 5,
    name: "Gerência e Projeto de Sistemas",
    hours: 40,
    pre: "4EMP",
    content:
      "Gerenciamento de projetos. Monitoramento de desempenho. Softwares. Introdução a softwares de gerencia de projetos. Introdução ao Projeto de Sistemas assistido por computador. Casos.",
    basic: [
      "BOENTE, A.N.P. Gerenciamento e Controle de Projetos. Axcel Books do Brasil, Rio de Janeiro, 2003.",
      "BRUZZI, D. G. Gerência de Projetos: Uma Visão Prática, Editora Érica, São Paulo, 2002.",
      "CLELAND, D. I. E IRELAND, L. R. Gerência de Projetos, Reichmann & Affonso Editores, Rio de Janeiro, 2002.",
      "VARGAS, R. V. Gerenciamento de Projetos 5º edição, Editora Brasport, Rio de Janeiro, 2003.",
    ],
    comp: [
      "HELDMAN, K. Gerência de Projetos, Editora Campus, Rio de Janeiro, 2003.",
      "OLIVEIRA, J. F. Cases: Os mais famosos estudos de casos internacionais indicados para cursos de sistemas de informações e administração de empresas, Editora Érica, São Paulo, 2000.",
      "FIGUEIREDO, F.C.; FIGUEIREDO, H.C.M. Dominando Gerenciamento de Projetos com MS Project 2002. Ciência Moderna, Rio de Janeiro, 2002.",
      "LINHARES, J.; QUARTAROLI, C.M.; CORDEIRO, J.V. Gerenciando Projetos Via Web com o Microsoft Project Server 2002. Ciência Moderna, Rio de Janeiro, 2002.",
    ],
  },
  {
    id: "5TAV",
    period: 5,
    name: "Tópicos Avançados",
    hours: 80,
    pre: "4EST, 4MOD",
    content:
      "Introduzir ao aluno tópicos e técnicas avançadas e atualizadas de Informática e Processamento de Dados com ênfase na formação de Analista de Sistemas de Informação, de acordo com o contexto atual do mercado computacional no Brasil e no mundo.",
    basic: ["Acervo do Curso."],
    comp: [],
  },
];
