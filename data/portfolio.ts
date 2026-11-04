// Portfolio content. Source of truth for experience is public/Jorge_Garay_CV.pdf.
// Every claim here must map to the CV or to a real repository / live site.

export type Locale = "en" | "es" | "ko";
export type Localized = Record<Locale, string>;

export type LineId = "ai" | "product" | "play";

export interface Line {
  id: LineId;
  letter: string;
  color: string;
  name: Localized;
  blurb: Localized;
}

export interface Project {
  code: string;
  line: LineId;
  title: string;
  period: string;
  summary: Localized;
  stack: string[];
  live?: string;
  repo?: string;
  image?: string;
  /** Short facts shown on the station plate when there is no screenshot. */
  facts?: Localized;
  /** Shown on the hero line, in this order. */
  featured?: number;
}

export interface Role {
  company: string;
  role: Localized;
  start: string;
  end?: string;
  current?: boolean;
  kind: Localized;
  points: Localized[];
}

export interface Study {
  title: Localized;
  place: string;
  year: string;
}

export const LINES: Line[] = [
  {
    id: "ai",
    letter: "A",
    color: "#ef7c1c",
    name: {
      en: "Applied AI & automation",
      es: "IA aplicada y automatización",
      ko: "응용 AI · 자동화",
    },
    blurb: {
      en: "Products where speech and language models do real work.",
      es: "Productos donde los modelos de voz y lenguaje hacen trabajo real.",
      ko: "음성·언어 모델이 실제로 일을 하는 제품.",
    },
  },
  {
    id: "product",
    letter: "P",
    color: "#00a84d",
    name: {
      en: "Product & client work",
      es: "Producto y clientes",
      ko: "프로덕트 · 클라이언트",
    },
    blurb: {
      en: "Shipped apps for companies in healthcare, logistics and edtech.",
      es: "Apps en producción para empresas de salud, logística y educación.",
      ko: "헬스케어·물류·에듀테크 기업을 위해 출시한 앱.",
    },
  },
  {
    id: "play",
    letter: "X",
    color: "#996cac",
    name: {
      en: "Playground",
      es: "Playground",
      ko: "플레이그라운드",
    },
    blurb: {
      en: "Games, landings and experiments built to learn and to teach.",
      es: "Juegos, landings y experimentos para aprender y enseñar.",
      ko: "배우고 가르치기 위해 만든 게임, 랜딩, 실험.",
    },
  },
];

export const PROJECTS: Project[] = [
  // ── Applied AI ──────────────────────────────────────────────
  {
    code: "A03",
    line: "ai",
    title: "LendLoop",
    period: "2026",
    featured: 6,
    summary: {
      en: "A neighborhood tool-lending board. Neighbors list tools, request date ranges, approve and return loans. n8n sends signed notification emails and daily overdue reminders, and every failed automation surfaces in an admin health panel.",
      es: "Un tablero vecinal para prestar herramientas. Los vecinos publican, piden rangos de fechas, aprueban y devuelven préstamos. n8n envía correos firmados y recordatorios diarios de atrasos, y cada automatización fallida aparece en un panel de salud para el admin.",
      ko: "이웃끼리 공구를 빌려주는 게시판. 공구 등록, 기간 지정 대여 요청, 승인과 반납까지. n8n이 서명된 알림 메일과 매일 연체 알림을 보내고, 실패한 자동화는 모두 관리자 상태 패널에 표시됩니다.",
    },
    stack: ["Next.js 16", "TypeScript", "Convex", "Clerk", "n8n"],
    repo: "https://github.com/Viozhu/lendloop",
    image: "/work/lendloop.webp",
  },
  {
    code: "A02",
    line: "ai",
    title: "MeetingNotes",
    period: "2026",
    featured: 5,
    summary: {
      en: "A menu-bar meeting recorder for macOS. It captures system audio and microphone, transcribes on-device with whisper.cpp, labels who said what, and writes a Markdown note with summary, decisions and action items using Claude, OpenAI, Groq or a local Ollama model.",
      es: "Una grabadora de reuniones en la barra de menú de macOS. Captura el audio del sistema y el micrófono, transcribe en el equipo con whisper.cpp, identifica quién habló y escribe una nota en Markdown con resumen, decisiones y tareas usando Claude, OpenAI, Groq o un modelo local de Ollama.",
      ko: "macOS 메뉴 막대 회의 녹음기. 시스템 오디오와 마이크를 녹음하고, whisper.cpp로 기기에서 바로 전사하며, 화자를 구분한 뒤 Claude·OpenAI·Groq 또는 로컬 Ollama 모델로 요약, 결정 사항, 할 일을 담은 마크다운 노트를 만듭니다.",
    },
    facts: { en: "macOS · on-device transcription · speaker labels", es: "macOS · transcripción en el equipo · hablantes", ko: "macOS · 기기 내 전사 · 화자 구분" },
    stack: ["Swift", "ScreenCaptureKit", "whisper.cpp", "sherpa-onnx", "LLM APIs"],
  },
  {
    code: "A01",
    line: "ai",
    title: "OPIc Simulator",
    period: "2026",
    featured: 4,
    summary: {
      en: "A full simulation of the OPIc speaking exam. Answers are recorded and transcribed locally with Whisper; Claude grades each transcript per dimension, and the report quotes the candidate's own mistakes, corrects them, and shows the arithmetic behind the final band.",
      es: "Una simulación completa del examen oral OPIc. Las respuestas se graban y transcriben localmente con Whisper; Claude califica cada transcripción por dimensión, y el informe cita los errores del candidato, los corrige y muestra el cálculo detrás de la nota final.",
      ko: "OPIc 말하기 시험 전체 시뮬레이터. 답변은 Whisper로 로컬에서 녹음·전사하고, Claude가 항목별로 채점합니다. 리포트는 응시자의 실제 실수를 인용해 교정하고 최종 등급의 산출 과정을 보여줍니다.",
    },
    stack: ["Python", "Whisper", "Claude API", "HTML reports"],
    repo: "https://github.com/Viozhu/OPIC-simulation",
    image: "/work/opic.webp",
  },

  // ── Product & client work ──────────────────────────────────
  {
    code: "P04",
    line: "product",
    title: "Utomata app",
    period: "2023 – now",
    featured: 2,
    summary: {
      en: "A cross-platform Flutter app for iOS and Android, owned end to end: architecture, API integration and state management. Also built and maintains the company website in Next.js and TypeScript.",
      es: "Una app multiplataforma en Flutter para iOS y Android, de punta a punta: arquitectura, integración de APIs y manejo de estado. También construí y mantengo el sitio de la empresa en Next.js y TypeScript.",
      ko: "iOS·Android용 Flutter 크로스플랫폼 앱을 아키텍처, API 연동, 상태 관리까지 전담했습니다. 회사 웹사이트도 Next.js와 TypeScript로 구축하고 운영합니다.",
    },
    facts: { en: "iOS · Android · web · owned end to end", es: "iOS · Android · web · de punta a punta", ko: "iOS · Android · 웹 · 전담 개발" },
    stack: ["Flutter", "Dart", "Next.js", "TypeScript"],
  },
  {
    code: "P05",
    line: "product",
    title: "OpenHelp",
    period: "2023 – now",
    summary: {
      en: "A Flutter app built from scratch that lets people reach support services on iOS and Android, with REST integration and provider-based state.",
      es: "Una app en Flutter construida desde cero para acceder a servicios de apoyo en iOS y Android, con integración REST y estado basado en Provider.",
      ko: "iOS·Android에서 지원 서비스를 이용할 수 있도록 처음부터 만든 Flutter 앱. REST 연동과 Provider 기반 상태 관리.",
    },
    facts: { en: "iOS · Android · built from scratch", es: "iOS · Android · desde cero", ko: "iOS · Android · 처음부터 개발" },
    stack: ["Flutter", "Dart", "REST", "Provider"],
  },
  {
    code: "P02",
    line: "product",
    title: "Numen platform",
    period: "2022 – 2024",
    featured: 1,
    summary: {
      en: "A full student management platform: authentication, interactive calendar, real-time internal chat, push notifications and on-demand recorded classes.",
      es: "Una plataforma completa de gestión de estudiantes: autenticación, calendario interactivo, chat interno en tiempo real, notificaciones push y clases grabadas bajo demanda.",
      ko: "학생 관리 플랫폼 전체를 설계·구축: 로그인/인증, 인터랙티브 캘린더, 실시간 내부 채팅, 푸시 알림, 녹화 강의 VOD.",
    },
    facts: { en: "Edtech · auth · chat · video on demand", es: "Educación · auth · chat · video on demand", ko: "에듀테크 · 인증 · 채팅 · VOD" },
    stack: ["React", "Node.js", "Express", "PostgreSQL"],
  },
  {
    code: "P06",
    line: "product",
    title: "Forest Crafts",
    period: "2025",
    featured: 3,
    summary: {
      en: "An e-commerce site for handmade accessories, with a browsable catalog, full English and Korean support, and dark mode.",
      es: "Un e-commerce de accesorios hechos a mano, con catálogo navegable, inglés y coreano completos y modo oscuro.",
      ko: "수공예 액세서리 이커머스. 탐색하기 쉬운 카탈로그, 영어·한국어 완전 지원, 다크 모드.",
    },
    stack: ["Next.js 15", "TypeScript", "Tailwind", "i18n"],
    live: "https://forest-crafts-alpha.vercel.app/en",
    image: "/work/forest-crafts.webp",
  },
  {
    code: "P01",
    line: "product",
    title: "Ivoy delivery tracking",
    period: "2021 – 2023",
    summary: {
      en: "Real-time delivery tracking across 3+ responsive web apps, with Google Maps geolocation, Strapi CMS and Google Cloud, plus API and front-end performance work for delivery operators.",
      es: "Seguimiento de entregas en tiempo real en 3+ apps web responsivas, con geolocalización de Google Maps, Strapi CMS y Google Cloud, además de optimizar APIs y front-end para los operadores.",
      ko: "3개 이상의 반응형 웹앱에서 실시간 배송 추적. Google Maps 위치 정보, Strapi CMS, Google Cloud, 배송 기사 경험을 위한 API·프론트엔드 성능 개선.",
    },
    facts: { en: "Logistics · real-time maps · 3+ apps", es: "Logística · mapas en tiempo real · 3+ apps", ko: "물류 · 실시간 지도 · 앱 3개 이상" },
    stack: ["React", "Strapi", "Google Maps API", "Google Cloud"],
  },
  {
    code: "P03",
    line: "product",
    title: "SOFI",
    period: "2022",
    summary: {
      en: "Freelance: three projects delivered on schedule, a marketing landing page, an appointment booking app with calendar integration, and a real-time voting app.",
      es: "Freelance: tres proyectos entregados a tiempo, una landing de marketing, una app de reservas con calendario y una app de votación en tiempo real.",
      ko: "프리랜스: 마케팅 랜딩 페이지, 캘린더 연동 예약 앱, 실시간 투표 앱 세 프로젝트를 일정대로 납품.",
    },
    stack: ["React", "Node.js", "Real-time"],
    image: "/work/sofi.webp",
  },

  // ── Playground ─────────────────────────────────────────────
  {
    code: "X01",
    line: "play",
    title: "Cookies Code",
    period: "",
    summary: {
      en: "Learn programming logic through puzzles and gamified challenges, earning cookies as you unlock a Python path step by step.",
      es: "Aprende lógica de programación con rompecabezas y desafíos gamificados. Gana cookies mientras desbloqueas tu camino en Python.",
      ko: "퍼즐과 게임형 도전으로 프로그래밍 논리를 배우고, 쿠키를 모으며 Python 과정을 하나씩 열어 갑니다.",
    },
    stack: ["React", "Gamification"],
    live: "https://code-cookies.vercel.app/",
    image: "/work/cookies-code.webp",
  },
  {
    code: "X02",
    line: "play",
    title: "Frog Jump",
    period: "",
    summary: {
      en: "A modern take on the classic jumping game: guide a frog across obstacles and platforms as difficulty ramps up.",
      es: "Una versión moderna del clásico de saltos: guía a una rana entre obstáculos y plataformas con dificultad creciente.",
      ko: "고전 점프 게임의 현대적 재해석. 점점 어려워지는 장애물과 발판 사이로 개구리를 안내하세요.",
    },
    stack: ["JavaScript", "Canvas"],
    live: "https://frog-jump-five.vercel.app/",
    image: "/work/frog-jump.webp",
  },
  {
    code: "X03",
    line: "play",
    title: "Click the Monster",
    period: "",
    summary: {
      en: "A casual clicker: drain the monster's health, collect rewards and work up to tougher enemies.",
      es: "Un clicker casual: baja la vida del monstruo, gana recompensas y avanza a enemigos más duros.",
      ko: "캐주얼 클리커. 몬스터 체력을 깎고 보상을 모아 더 강한 적에게 도전하세요.",
    },
    stack: ["React"],
    live: "https://click-the-monster.vercel.app/",
    image: "/work/click-the-monster.webp",
  },
  {
    code: "X04",
    line: "play",
    title: "Academy IT",
    period: "",
    summary: {
      en: "A platform to manage students, classes and courses for schools and tech academies.",
      es: "Una plataforma para gestionar estudiantes, clases y cursos en instituciones y academias tecnológicas.",
      ko: "교육 기관과 테크 아카데미를 위한 학생·수업·코스 관리 플랫폼.",
    },
    stack: ["React", "Node.js"],
    image: "/work/academy-it.webp",
  },
  {
    code: "X05",
    line: "play",
    title: "Movie Night",
    period: "",
    summary: {
      en: "Search films, check ratings and browse details in a movie discovery site.",
      es: "Busca películas, revisa calificaciones y explora detalles en un sitio de descubrimiento de cine.",
      ko: "영화를 검색하고 평점과 상세 정보를 살펴보는 영화 탐색 사이트.",
    },
    stack: ["React", "REST API"],
    image: "/work/movie-night.webp",
  },
  {
    code: "X06",
    line: "play",
    title: "Quiero Programar",
    period: "",
    summary: {
      en: "A front-end quiz that teaches programming basics through dynamic questions.",
      es: "Un quiz de front-end que enseña lo básico de programación con preguntas dinámicas.",
      ko: "동적인 질문으로 프로그래밍 기초를 알려 주는 프론트엔드 퀴즈.",
    },
    stack: ["JavaScript"],
    image: "/work/quiero-programar.webp",
  },
  {
    code: "X07",
    line: "play",
    title: "Patio",
    period: "",
    summary: {
      en: "A bold landing page that presents a project and invites the community to take part.",
      es: "Una landing llamativa que presenta un proyecto e invita a la comunidad a participar.",
      ko: "프로젝트를 소개하고 지역 주민의 참여를 이끄는 강렬한 랜딩 페이지.",
    },
    stack: ["HTML", "CSS"],
    image: "/work/patio.webp",
  },
];

export const ROLES: Role[] = [
  {
    company: "Utomata",
    role: { en: "Full Stack Developer", es: "Full Stack Developer", ko: "풀스택 개발자" },
    start: "Sep 2023",
    current: true,
    kind: { en: "Remote", es: "Remoto", ko: "원격" },
    points: [
      {
        en: "Built and shipped a cross-platform Flutter app for iOS and Android, owning architecture, API integration and state management.",
        es: "Construí y publiqué una app multiplataforma en Flutter para iOS y Android, a cargo de arquitectura, APIs y manejo de estado.",
        ko: "iOS·Android용 Flutter 앱을 구축·출시하며 아키텍처, API 연동, 상태 관리를 담당.",
      },
      {
        en: "Develop the company website in Next.js and TypeScript, improving load performance and search visibility.",
        es: "Desarrollo el sitio de la empresa en Next.js y TypeScript, mejorando rendimiento de carga y visibilidad en buscadores.",
        ko: "Next.js·TypeScript로 회사 웹사이트를 개발해 로딩 성능과 검색 노출을 개선.",
      },
      {
        en: "Ship on schedule in two-week sprints with product and design.",
        es: "Entrego a tiempo en sprints de dos semanas junto a producto y diseño.",
        ko: "프로덕트·디자인 팀과 2주 스프린트로 일정에 맞춰 출시.",
      },
    ],
  },
  {
    company: "OpenHelp",
    role: { en: "Mobile Developer", es: "Mobile Developer", ko: "모바일 개발자" },
    start: "Sep 2023",
    current: true,
    kind: { en: "Remote", es: "Remoto", ko: "원격" },
    points: [
      {
        en: "Built a Flutter app from scratch that gives users access to support services on iOS and Android.",
        es: "Construí desde cero una app en Flutter que da acceso a servicios de apoyo en iOS y Android.",
        ko: "iOS·Android에서 지원 서비스를 이용할 수 있는 Flutter 앱을 처음부터 개발.",
      },
      {
        en: "Integrated REST APIs with provider-based state management and a consistent UX across devices.",
        es: "Integré APIs REST con estado basado en Provider y una UX consistente entre dispositivos.",
        ko: "REST API 연동, Provider 기반 상태 관리, 기기 간 일관된 UX 구현.",
      },
    ],
  },
  {
    company: "SOFI",
    role: { en: "Freelance Full Stack Developer", es: "Full Stack freelance", ko: "프리랜스 풀스택 개발자" },
    start: "Jul 2022",
    kind: { en: "Freelance", es: "Freelance", ko: "프리랜스" },
    points: [
      {
        en: "Delivered a marketing landing page, an appointment booking app and a real-time voting app, all on schedule.",
        es: "Entregué una landing de marketing, una app de reservas y una app de votación en tiempo real, todo a tiempo.",
        ko: "마케팅 랜딩 페이지, 예약 앱, 실시간 투표 앱을 모두 일정대로 납품.",
      },
    ],
  },
  {
    company: "Numen Academy",
    role: { en: "Full Stack Dev Mentor", es: "Mentor Full Stack", ko: "풀스택 개발 멘토" },
    start: "Mar 2022",
    end: "Dec 2024",
    kind: { en: "Part-time", es: "Medio tiempo", ko: "파트타임" },
    points: [
      {
        en: "Designed and built the student platform: auth, calendar, real-time chat, push notifications and recorded classes.",
        es: "Diseñé y construí la plataforma de estudiantes: autenticación, calendario, chat en tiempo real, notificaciones push y clases grabadas.",
        ko: "학생 플랫폼 설계·구축: 인증, 캘린더, 실시간 채팅, 푸시 알림, 녹화 강의.",
      },
      {
        en: "Mentored 20+ junior developers in React, Node.js and API practices through weekly sessions and code review.",
        es: "Mentoreé a más de 20 developers junior en React, Node.js y buenas prácticas de APIs con sesiones semanales y code review.",
        ko: "주간 세션과 코드 리뷰로 주니어 개발자 20명 이상에게 React, Node.js, API 모범 사례를 멘토링.",
      },
      {
        en: "Led architecture decisions for scalability, maintainability and consistent code quality.",
        es: "Lideré decisiones de arquitectura para escalabilidad, mantenibilidad y calidad de código.",
        ko: "확장성·유지보수성·코드 품질을 위한 아키텍처 의사결정을 주도.",
      },
    ],
  },
  {
    company: "Ivoy",
    role: { en: "Full Stack Developer", es: "Full Stack Developer", ko: "풀스택 개발자" },
    start: "Dec 2021",
    end: "Jun 2023",
    kind: { en: "Full-time", es: "Tiempo completo", ko: "정규직" },
    points: [
      {
        en: "Built and maintained 3+ responsive web apps with Strapi, Google Cloud and Google Maps for real-time delivery tracking.",
        es: "Construí y mantuve 3+ apps web responsivas con Strapi, Google Cloud y Google Maps para seguimiento de entregas en tiempo real.",
        ko: "Strapi, Google Cloud, Google Maps로 실시간 배송 추적 반응형 웹앱 3개 이상을 구축·운영.",
      },
      {
        en: "Optimized API performance and front-end responsiveness for delivery operators.",
        es: "Optimicé el rendimiento de APIs y la respuesta del front-end para los operadores de entrega.",
        ko: "배송 기사를 위해 API 성능과 프론트엔드 반응성을 최적화.",
      },
    ],
  },
  {
    company: "LiLab",
    role: { en: "Front-end Developer", es: "Front-end Developer", ko: "프론트엔드 개발자" },
    start: "Jul 2021",
    end: "Dec 2021",
    kind: { en: "Full-time", es: "Tiempo completo", ko: "정규직" },
    points: [
      {
        en: "Built the React front-end that replaced paper workflows in a medical office.",
        es: "Construí el front-end en React que reemplazó los procesos en papel de un consultorio médico.",
        ko: "의료 기관의 종이 업무를 대체하는 React 프론트엔드를 구축.",
      },
      {
        en: "Created a reusable, responsive component library.",
        es: "Creé una librería de componentes reutilizable y responsiva.",
        ko: "재사용 가능한 반응형 컴포넌트 라이브러리를 제작.",
      },
    ],
  },
];

export const STUDIES: Study[] = [
  {
    title: { en: "Assoc. Degree, Software Development", es: "Tecnicatura en Desarrollo de Software", ko: "소프트웨어 개발 전문학위" },
    place: "Ministry of Education, AR",
    year: "2022",
  },
  {
    title: { en: "Full Stack Bootcamp, 700+ hrs", es: "Bootcamp Full Stack, 700+ hs", ko: "풀스택 부트캠프 700시간 이상" },
    place: "Henry",
    year: "2021",
  },
  {
    title: { en: "General English B2", es: "Inglés general B2", ko: "일반 영어 B2" },
    place: "AFS, Cardiff UK",
    year: "2019",
  },
];

export const SKILLS: { group: Localized; color: string; items: string[] }[] = [
  { group: { en: "Front-end", es: "Front-end", ko: "프론트엔드" }, color: "#4a5163", items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind", "Redux"] },
  { group: { en: "Mobile", es: "Mobile", ko: "모바일" }, color: "#4a5163", items: ["Flutter", "Dart", "Swift"] },
  { group: { en: "Back-end", es: "Back-end", ko: "백엔드" }, color: "#4a5163", items: ["Node.js", "Express", "NestJS", "GraphQL", "REST", "Prisma", "PostgreSQL", "Convex"] },
  { group: { en: "AI & automation", es: "IA y automatización", ko: "AI · 자동화" }, color: "#ef7c1c", items: ["Claude API", "OpenAI", "Whisper", "Ollama", "n8n", "Python"] },
  { group: { en: "Cloud & craft", es: "Cloud y oficio", ko: "클라우드 · 협업" }, color: "#4a5163", items: ["Google Cloud", "Vercel", "Netlify", "Git", "CI/CD", "Figma", "Agile / Scrum"] },
];

export const CONTACT = {
  email: "garayjorgeignacio@gmail.com",
  whatsapp: "https://wa.me/821030409735?text=Hi%20Jorge!%20I%20saw%20your%20portfolio",
  linkedin: "https://www.linkedin.com/in/jorgeignaciogaray/",
  github: "https://github.com/Viozhu",
  cv: "/Jorge_Garay_CV.pdf",
};

export const featuredProjects = () =>
  PROJECTS.filter((p) => p.featured).sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));

export const lineOf = (id: LineId) => LINES.find((l) => l.id === id)!;
