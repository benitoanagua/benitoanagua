/** Editorial skill narratives grounded in the November 2026 CVs.
 * Keys use the same slug convention as skill-profiles.ts.
 * Add a story here when a skill needs a more personal explanation than the automatic CV-based summary.
 */
export const skillStories: Record<string, { es: string; en: string }> = {
  figma: {
    es: 'Mi experiencia con Figma combina diseño de producto y colaboración con desarrollo. En ITGroup Systems trabajé como Product Designer / UI Lead y construí un sistema de diseño con componentes, tokens, documentación y guías de estilo. En SSUT Tarija diseñé flujos y prototipos de aplicaciones móviles y preparé bibliotecas de componentes y especificaciones para el equipo Flutter. En mi trabajo independiente continué con prototipado UX y handoff técnico.',
    en: 'My Figma practice combines product design and collaboration with engineering. At ITGroup Systems, as Product Designer / UI Lead, I built a design system with components, tokens, documentation and style guides. At SSUT Tarija, I designed flows and prototypes for mobile applications and prepared component libraries and specifications for the Flutter team. In independent work, I continued with UX prototyping and technical handoff.'
  },
  'design-systems': {
    es: 'He trabajado los sistemas de diseño como una herramienta de consistencia y colaboración, no solo como una biblioteca visual. En ITGroup Systems definí componentes reutilizables, tokens, documentación y guías de estilo para los productos digitales. En proyectos independientes reforcé el proceso de handoff para que las decisiones de diseño pudieran trasladarse con claridad a la implementación.',
    en: 'I approach design systems as a tool for consistency and collaboration, not simply as a visual library. At ITGroup Systems, I defined reusable components, tokens, documentation and style guides for digital products. In independent work, I strengthened the handoff process so design decisions could be carried into implementation clearly.'
  },
  svelte: {
    es: 'En ITGroup Systems lideré el desarrollo frontend de aplicaciones web empresariales utilizando Svelte junto con Vue.js y Blazor. Mi trabajo se centró en interfaces escalables, componentes reutilizables y optimización del rendimiento mediante prácticas como lazy loading y code splitting, coordinando el trabajo frontend con servicios backend y necesidades del producto.',
    en: 'At ITGroup Systems, I led frontend development for enterprise web applications using Svelte alongside Vue.js and Blazor. My work focused on scalable interfaces, reusable components and performance optimization through practices such as lazy loading and code splitting, coordinating frontend work with backend services and product needs.'
  },
  kotlin: {
    es: 'En trabajo independiente desarrollé aplicaciones financieras nativas para Android con Kotlin y Jetpack Compose. El alcance descrito en mi CV incluye arquitecturas MVVM/MVI, integración con Firebase, despliegues en Google Cloud Run y Firebase App Distribution, autenticación segura y flujos reactivos con Coroutines y Flow para dashboards y transacciones.',
    en: 'In independent work, I developed native Android financial applications with Kotlin and Jetpack Compose. The scope described in my CV includes MVVM/MVI architecture, Firebase integration, deployments through Google Cloud Run and Firebase App Distribution, secure authentication, and reactive Coroutines/Flow workflows for dashboards and transactions.'
  },
  'elixir-otp': {
    es: 'En trabajo independiente desarrollé chatbots interactivos de alta concurrencia con Elixir/OTP y Phoenix Framework, integrados con WhatsApp Business API. El trabajo incluyó arquitectura de mensajería tolerante a fallos basada en el modelo de actores, despliegue en Fly.io, pipelines CI/CD y monitoreo de disponibilidad.',
    en: 'In independent work, I developed high-concurrency interactive chatbots with Elixir/OTP and Phoenix Framework, integrated with the WhatsApp Business API. The work included fault-tolerant messaging architecture based on the actor model, Fly.io deployment, CI/CD pipelines and availability monitoring.'
  },
  'analisis-funcional': {
    es: 'Mi análisis funcional conecta necesidades de usuarios con decisiones técnicas. En MAMAYATECH relevo y documento requerimientos, analizo impactos, gestiono incidentes y valido cambios funcionales, coordinando con áreas usuarias y equipos de Base de Datos, Redes, Infraestructura y Desarrollo. En ITGroup Systems trabajé con relevamiento de requerimientos y modelado AS-IS/TO-BE, además de soporte post-implantación y documentación.',
    en: 'My functional analysis work connects user needs with technical decisions. At MAMAYATECH, I gather and document requirements, analyze impacts, manage incidents and validate functional changes, coordinating with user departments and Database, Networks, Infrastructure and Development teams. At ITGroup Systems, I worked on requirements gathering and AS-IS/TO-BE modeling, as well as post-implementation support and documentation.'
  },
  'oracle-ebs': {
    es: 'En MAMAYATECH brindo soporte funcional a Oracle EBS dentro de la operación de aplicaciones de negocio. Mi responsabilidad incluye diagnóstico y seguimiento de incidentes, análisis de impacto, validación de cambios, documentación de soluciones y coordinación con equipos técnicos cuando un caso requiere escalamiento. Mantengo los ejemplos deliberadamente generales para no exponer datos operativos.',
    en: 'At MAMAYATECH, I provide functional support for Oracle EBS within business application operations. My responsibilities include incident diagnosis and follow-up, impact analysis, change validation, solution documentation and coordination with technical teams when a case needs escalation. Examples are intentionally general to avoid exposing operational data.'
  },
  'gestion-de-incidentes': {
    es: 'En mi puesto actual en MAMAYATECH gestiono incidentes desde la recepción y el diagnóstico inicial hasta el seguimiento y cierre con el usuario. Identifico si el caso corresponde a soporte funcional, infraestructura, redes, base de datos o desarrollo; documento diagnósticos y soluciones en Aranda y coordino con los equipos responsables para mantener la continuidad operativa.',
    en: 'In my current role at MAMAYATECH, I manage incidents from intake and initial diagnosis through follow-up and user-confirmed closure. I identify whether a case belongs to functional support, infrastructure, networks, database or development; document diagnostics and solutions in Aranda; and coordinate with the responsible teams to maintain operational continuity.'
  },
  'incident-management': {
    es: 'En mi puesto actual en MAMAYATECH gestiono incidentes desde la recepción y el diagnóstico inicial hasta el seguimiento y cierre con el usuario. Identifico si el caso corresponde a soporte funcional, infraestructura, redes, base de datos o desarrollo; documento diagnósticos y soluciones en Aranda y coordino con los equipos responsables para mantener la continuidad operativa.',
    en: 'In my current role at MAMAYATECH, I manage incidents from intake and initial diagnosis through follow-up and user-confirmed closure. I identify whether a case belongs to functional support, infrastructure, networks, database or development; document diagnostics and solutions in Aranda; and coordinate with the responsible teams to maintain operational continuity.'
  },
  'preprensa': {
    es: 'Mi experiencia en preprensa se desarrolló en trabajos de diseño gráfico y producción impresa, especialmente en GRAPHICART y EL NACIONAL. Preparé archivos para offset y serigrafía considerando sangrado, separación de colores, registro y gestión CMYK/Pantone, y coordiné con proveedores para que las piezas cumplieran las especificaciones de producción.',
    en: 'My prepress experience comes from graphic design and print production work, especially at GRAPHICART and EL NACIONAL. I prepared offset and screen-printing files with bleed, color separation, registration and CMYK/Pantone management in mind, and coordinated with suppliers to meet production specifications.'
  },
  'wordpress': {
    es: 'He trabajado con WordPress en desarrollo web institucional y en implementación de tiendas digitales. En mi experiencia independiente incorporé WooCommerce, Elementor y WP-CLI para personalizar sitios, automatizar tareas de instalación y mantenimiento y atender rendimiento, SEO técnico y experiencia adaptable a distintos dispositivos.',
    en: 'I have worked with WordPress in institutional web development and digital store implementation. In independent work, I used WooCommerce, Elementor and WP-CLI to customize sites, automate setup and maintenance tasks, and address performance, technical SEO and cross-device experience.'
  }
};
