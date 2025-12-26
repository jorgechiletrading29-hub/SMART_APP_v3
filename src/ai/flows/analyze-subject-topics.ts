// src/ai/flows/analyze-subject-topics.ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { bookPDFs } from '@/lib/books-data';

const AnalyzeSubjectTopicsInputSchema = z.object({
  courseName: z.string().describe('Course name (e.g., "1ro Básico", "2do Medio").'),
  subjectName: z.string().describe('Subject name (e.g., "Matemáticas", "Lenguaje y Comunicación").'),
  language: z.enum(['es', 'en']).describe('Output language.'),
});

export type AnalyzeSubjectTopicsInput = z.infer<typeof AnalyzeSubjectTopicsInputSchema>;

const AnalyzeSubjectTopicsOutputSchema = z.object({
  topics: z.array(z.string()).max(40).describe('Distinct topics detected for the subject.'),
  bookTitle: z.string().optional().describe('Title of the book analyzed.'),
});

export type AnalyzeSubjectTopicsOutput = z.infer<typeof AnalyzeSubjectTopicsOutputSchema>;

// Cache para evitar re-procesar
const topicsCache = new Map<string, { topics: string[]; timestamp: number; bookTitle?: string }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

function normalize(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Detectar qué asignatura es
function detectSubjectType(subjectName: string): 'math' | 'language' | 'science' | 'history' | 'other' {
  const s = normalize(subjectName);
  
  if (/matem|math|algebra|geometr|trigonom|calculo|aritmet|matriz|estadistic|probabil/i.test(s)) {
    return 'math';
  }
  if (/lenguaje|comunicacion|language|literature|literatura|gramatica|ortografia|lectura|escritura/i.test(s)) {
    return 'language';
  }
  if (/ciencia|natural|science|biolog|quimic|fisic|anatomia|ecologia|medio ambiente/i.test(s)) {
    return 'science';
  }
  if (/historia|geography|geografia|social|civica|educacion civica|sociedad/i.test(s)) {
    return 'history';
  }
  
  return 'other';
}

// Determinar el nivel del curso
function getCourseLevel(courseName: string): 'basico' | 'medio' | 'superior' {
  const course = normalize(courseName);
  
  if (course.includes('medio') || course.includes('secundaria') || course.includes('high')) {
    return 'medio';
  }
  if (course.includes('superior') || course.includes('universitario') || course.includes('university')) {
    return 'superior';
  }
  return 'basico';
}

// Temas heurísticos por asignatura y nivel
function getHeuristicTopics(
  subjectType: 'math' | 'language' | 'science' | 'history' | 'other',
  level: 'basico' | 'medio' | 'superior',
  language: 'es' | 'en'
): string[] {
  
  const topicsEs: Record<string, Record<string, string[]>> = {
    math: {
      basico: [
        'Números naturales', 'Suma y resta', 'Multiplicación', 'División',
        'Fracciones', 'Decimales', 'Geometría básica', 'Medidas', 'Patrones numéricos',
        'Valor posicional', 'Comparación de números', 'Problemas de lógica',
        'Perímetro y área', 'Figuras 2D y 3D', 'Gráficos de barras'
      ],
      medio: [
        'Álgebra', 'Ecuaciones lineales', 'Sistemas de ecuaciones', 'Funciones',
        'Funciones cuadráticas', 'Trigonometría', 'Geometría analítica', 'Vectores',
        'Matrices', 'Determinantes', 'Probabilidad', 'Estadística', 'Logaritmos',
        'Exponenciales', 'Límites', 'Derivadas', 'Integrales', 'Números complejos'
      ],
      superior: [
        'Cálculo diferencial', 'Cálculo integral', 'Ecuaciones diferenciales',
        'Álgebra lineal', 'Análisis matemático', 'Topología', 'Probabilidad avanzada',
        'Estadística inferencial', 'Métodos numéricos', 'Optimización'
      ]
    },
    language: {
      basico: [
        'Comprensión lectora', 'Escritura de oraciones', 'Vocales y consonantes',
        'Lectura de cuentos', 'Sustantivos y adjetivos', 'Verbos y tiempos verbales',
        'Signos de puntuación', 'Sinónimos y antónimos', 'Textos narrativos',
        'Textos descriptivos', 'Poemas y rimas', 'Fábulas y leyendas',
        'Uso de mayúsculas', 'Orden alfabético', 'Escritura creativa'
      ],
      medio: [
        'Análisis literario', 'Figuras retóricas', 'Géneros literarios',
        'Textos argumentativos', 'Ensayos', 'Crónicas', 'Reseñas literarias',
        'Movimientos literarios', 'Narrativa contemporánea', 'Poesía lírica',
        'Teatro y dramaturgia', 'Oratoria', 'Redacción formal', 'Investigación',
        'Medios de comunicación', 'Análisis crítico', 'Coherencia y cohesión'
      ],
      superior: [
        'Teoría literaria', 'Semiótica', 'Lingüística', 'Morfosintaxis',
        'Fonética y fonología', 'Dialectología', 'Literatura universal',
        'Crítica literaria', 'Estilística', 'Análisis del discurso'
      ]
    },
    science: {
      basico: [
        'Los seres vivos', 'Partes del cuerpo humano', 'Los cinco sentidos',
        'Animales y sus hábitats', 'Plantas y sus partes', 'El ciclo del agua',
        'Estados de la materia', 'Luz y sombras', 'El sistema solar',
        'Cadenas alimentarias', 'Ecosistemas', 'Energía y movimiento',
        'Clasificación de animales', 'El medio ambiente', 'Recursos naturales'
      ],
      medio: [
        'Célula y organismos', 'Genética', 'Evolución', 'Ecología',
        'Anatomía humana', 'Fisiología', 'Química orgánica', 'Química inorgánica',
        'Reacciones químicas', 'Termodinámica', 'Mecánica', 'Ondas',
        'Electricidad y magnetismo', 'Óptica', 'Física moderna', 'Biología molecular'
      ],
      superior: [
        'Bioquímica', 'Microbiología', 'Inmunología', 'Biotecnología',
        'Física cuántica', 'Relatividad', 'Astrofísica', 'Química analítica',
        'Nanotecnología', 'Genómica', 'Neurociencia'
      ]
    },
    history: {
      basico: [
        'Mi familia y comunidad', 'Normas de convivencia', 'Derechos de los niños',
        'Símbolos patrios', 'Pueblos originarios', 'Fiestas y tradiciones',
        'Ubicación geográfica', 'Regiones de Chile', 'Zonas climáticas',
        'Recursos naturales', 'Trabajos y oficios', 'Historia personal',
        'Civilizaciones antiguas', 'Descubrimiento de América', 'Colonia'
      ],
      medio: [
        'Historia universal', 'Revolución Francesa', 'Revolución Industrial',
        'Primera Guerra Mundial', 'Segunda Guerra Mundial', 'Guerra Fría',
        'Independencia de América', 'Historia de Chile', 'Geografía física',
        'Geografía humana', 'Economía', 'Globalización', 'Derechos humanos',
        'Democracia y ciudadanía', 'Problemas ambientales', 'Geopolítica'
      ],
      superior: [
        'Historiografía', 'Filosofía política', 'Economía internacional',
        'Relaciones internacionales', 'Antropología', 'Sociología',
        'Pensamiento político', 'Historia del arte', 'Patrimonio cultural'
      ]
    },
    other: {
      basico: [
        'Conceptos básicos', 'Fundamentos', 'Introducción al tema',
        'Aplicaciones prácticas', 'Ejercicios guiados', 'Repaso general'
      ],
      medio: [
        'Teoría', 'Práctica', 'Análisis', 'Síntesis', 'Evaluación',
        'Aplicaciones', 'Estudios de caso', 'Proyectos'
      ],
      superior: [
        'Investigación', 'Metodología', 'Análisis avanzado', 'Seminario',
        'Tesis', 'Publicaciones'
      ]
    }
  };
  
  const topicsEn: Record<string, Record<string, string[]>> = {
    math: {
      basico: [
        'Natural numbers', 'Addition and subtraction', 'Multiplication', 'Division',
        'Fractions', 'Decimals', 'Basic geometry', 'Measurements', 'Number patterns',
        'Place value', 'Number comparison', 'Logic problems',
        'Perimeter and area', '2D and 3D shapes', 'Bar graphs'
      ],
      medio: [
        'Algebra', 'Linear equations', 'Systems of equations', 'Functions',
        'Quadratic functions', 'Trigonometry', 'Analytic geometry', 'Vectors',
        'Matrices', 'Determinants', 'Probability', 'Statistics', 'Logarithms',
        'Exponentials', 'Limits', 'Derivatives', 'Integrals', 'Complex numbers'
      ],
      superior: [
        'Differential calculus', 'Integral calculus', 'Differential equations',
        'Linear algebra', 'Mathematical analysis', 'Topology', 'Advanced probability',
        'Inferential statistics', 'Numerical methods', 'Optimization'
      ]
    },
    language: {
      basico: [
        'Reading comprehension', 'Sentence writing', 'Vowels and consonants',
        'Story reading', 'Nouns and adjectives', 'Verbs and tenses',
        'Punctuation marks', 'Synonyms and antonyms', 'Narrative texts',
        'Descriptive texts', 'Poems and rhymes', 'Fables and legends',
        'Capital letters', 'Alphabetical order', 'Creative writing'
      ],
      medio: [
        'Literary analysis', 'Rhetorical figures', 'Literary genres',
        'Argumentative texts', 'Essays', 'Chronicles', 'Book reviews',
        'Literary movements', 'Contemporary narrative', 'Lyric poetry',
        'Theater and drama', 'Public speaking', 'Formal writing', 'Research',
        'Mass media', 'Critical analysis', 'Coherence and cohesion'
      ],
      superior: [
        'Literary theory', 'Semiotics', 'Linguistics', 'Morphosyntax',
        'Phonetics and phonology', 'Dialectology', 'World literature',
        'Literary criticism', 'Stylistics', 'Discourse analysis'
      ]
    },
    science: {
      basico: [
        'Living things', 'Human body parts', 'The five senses',
        'Animals and habitats', 'Plants and their parts', 'The water cycle',
        'States of matter', 'Light and shadows', 'The solar system',
        'Food chains', 'Ecosystems', 'Energy and motion',
        'Animal classification', 'The environment', 'Natural resources'
      ],
      medio: [
        'Cell and organisms', 'Genetics', 'Evolution', 'Ecology',
        'Human anatomy', 'Physiology', 'Organic chemistry', 'Inorganic chemistry',
        'Chemical reactions', 'Thermodynamics', 'Mechanics', 'Waves',
        'Electricity and magnetism', 'Optics', 'Modern physics', 'Molecular biology'
      ],
      superior: [
        'Biochemistry', 'Microbiology', 'Immunology', 'Biotechnology',
        'Quantum physics', 'Relativity', 'Astrophysics', 'Analytical chemistry',
        'Nanotechnology', 'Genomics', 'Neuroscience'
      ]
    },
    history: {
      basico: [
        'My family and community', 'Rules of coexistence', 'Children\'s rights',
        'National symbols', 'Indigenous peoples', 'Holidays and traditions',
        'Geographic location', 'Regions', 'Climate zones',
        'Natural resources', 'Jobs and occupations', 'Personal history',
        'Ancient civilizations', 'Discovery of America', 'Colonial period'
      ],
      medio: [
        'World history', 'French Revolution', 'Industrial Revolution',
        'World War I', 'World War II', 'Cold War',
        'American independence', 'National history', 'Physical geography',
        'Human geography', 'Economics', 'Globalization', 'Human rights',
        'Democracy and citizenship', 'Environmental issues', 'Geopolitics'
      ],
      superior: [
        'Historiography', 'Political philosophy', 'International economics',
        'International relations', 'Anthropology', 'Sociology',
        'Political thought', 'Art history', 'Cultural heritage'
      ]
    },
    other: {
      basico: [
        'Basic concepts', 'Fundamentals', 'Topic introduction',
        'Practical applications', 'Guided exercises', 'General review'
      ],
      medio: [
        'Theory', 'Practice', 'Analysis', 'Synthesis', 'Evaluation',
        'Applications', 'Case studies', 'Projects'
      ],
      superior: [
        'Research', 'Methodology', 'Advanced analysis', 'Seminar',
        'Thesis', 'Publications'
      ]
    }
  };
  
  const topics = language === 'es' ? topicsEs : topicsEn;
  return topics[subjectType]?.[level] || topics['other'][level];
}

// Temas específicos por curso y asignatura (datos más precisos)
function getSpecificTopics(courseName: string, subjectName: string, language: 'es' | 'en'): string[] | null {
  const course = normalize(courseName);
  const subject = normalize(subjectName);
  
  // Temas específicos por curso para Lenguaje
  const languageTopicsEs: Record<string, string[]> = {
    '1ro basico': [
      'Comprensión lectora de cuentos infantiles', 'Reconocimiento de letras', 
      'Escritura de oraciones simples', 'Vocales y consonantes', 'Sonidos iniciales y finales',
      'Lectura de sílabas', 'Palabras frecuentes', 'Textos narrativos cortos',
      'Uso de mayúsculas', 'Signos de interrogación', 'Rimas y trabalenguas'
    ],
    '2do basico': [
      'Lectura comprensiva de fábulas', 'Escritura de cartas', 'Sustantivos y adjetivos',
      'Verbos y tiempos verbales', 'Uso de la coma', 'Textos descriptivos',
      'Sinónimos y antónimos', 'Poemas simples', 'Historietas', 'Producción de cuentos'
    ],
    '3ro basico': [
      'Lectura de novelas cortas', 'Uso de conectores', 'Sujeto y predicado',
      'Leyendas chilenas', 'Uso de b y v', 'Textos argumentativos simples',
      'Adverbios', 'Lectura crítica', 'Obras teatrales', 'Escritura de resúmenes'
    ],
    '4to basico': [
      'Análisis de textos literarios', 'Figuras literarias', 'Textos argumentativos',
      'Ensayos simples', 'Textos periodísticos', 'Verbos irregulares',
      'Análisis de personajes', 'Crónicas', 'Metáfora y comparación', 'Reportajes'
    ]
  };
  
  // Temas específicos por curso para Ciencias Naturales
  const scienceTopicsEs: Record<string, string[]> = {
    '1ro basico': [
      'Los seres vivos y su entorno', 'Partes del cuerpo humano', 'Los cinco sentidos',
      'Animales y sus hábitats', 'Plantas y sus partes', 'El ciclo del agua',
      'Estados de la materia', 'Luz y sombras', 'El día y la noche',
      'Cuidado del medio ambiente', 'Clasificación de animales'
    ],
    '2do basico': [
      'Sistemas del cuerpo humano', 'Alimentación saludable', 'Vertebrados e invertebrados',
      'Reproducción de plantas', 'Ecosistemas terrestres', 'Mezclas y separaciones',
      'Fuerza y movimiento', 'Recursos naturales', 'Cadenas alimentarias', 'Magnetismo'
    ],
    '3ro basico': [
      'Sistema digestivo', 'Nutrientes y alimentos', 'Clasificación de vertebrados',
      'Polinización', 'Biomas de Chile', 'Propiedades de la materia',
      'Energía cinética y potencial', 'Rocas y minerales', 'Sistema respiratorio', 'Sistema circulatorio'
    ],
    '4to basico': [
      'Sistema nervioso', 'Sistema óseo y muscular', 'Microorganismos',
      'Relaciones tróficas', 'Reacciones químicas', 'Circuitos eléctricos',
      'Estructura de la Tierra', 'Clima y tiempo', 'Desarrollo sustentable', 'Placas tectónicas'
    ]
  };
  
  // Temas específicos por curso para Historia
  const historyTopicsEs: Record<string, string[]> = {
    '1ro basico': [
      'Mi familia y yo', 'Normas de convivencia', 'Derechos de los niños',
      'Mi escuela y comunidad', 'Trabajos y oficios', 'Ubicación espacial',
      'Celebraciones y tradiciones', 'Símbolos patrios', 'Historia personal',
      'Pueblos originarios de Chile', 'Fiestas Patrias'
    ],
    '2do basico': [
      'Cultura de Chile', 'Regiones naturales de Chile', 'Ubicación de Chile en el mundo',
      'Zonas climáticas', 'Recursos naturales de Chile', 'Civilizaciones antiguas',
      'Griegos y romanos', 'Instituciones del país', 'Democracia y participación',
      'Comercio y moneda', 'Grandes exploradores'
    ],
    '3ro basico': [
      'Pueblos originarios de América', 'Mayas, Aztecas e Incas', 'Conquista de América',
      'Geografía de América', 'Climas de América', 'Recursos de América',
      'Colonización española', 'Vida colonial', 'Mestizaje cultural', 'Independencia de América'
    ],
    '4to basico': [
      'Chile en el siglo XIX', 'Independencia de Chile', 'Organización de la República',
      'Expansión territorial', 'Guerra del Pacífico', 'Sociedad chilena del siglo XIX',
      'Economía del salitre', 'Geografía de Chile', 'Democracia en Chile', 'Derechos ciudadanos'
    ]
  };
  
  // Buscar temas específicos
  for (const [key, topics] of Object.entries(languageTopicsEs)) {
    if (course.includes(key.split(' ')[0]) && course.includes('basico') && 
        (subject.includes('lenguaje') || subject.includes('comunicacion'))) {
      return language === 'es' ? topics : topics; // TODO: Agregar versión en inglés
    }
  }
  
  for (const [key, topics] of Object.entries(scienceTopicsEs)) {
    if (course.includes(key.split(' ')[0]) && course.includes('basico') && 
        (subject.includes('ciencia') || subject.includes('natural'))) {
      return language === 'es' ? topics : topics;
    }
  }
  
  for (const [key, topics] of Object.entries(historyTopicsEs)) {
    if (course.includes(key.split(' ')[0]) && course.includes('basico') && 
        (subject.includes('historia') || subject.includes('social') || subject.includes('geografia'))) {
      return language === 'es' ? topics : topics;
    }
  }
  
  return null;
}

export async function analyzeSubjectTopics(input: AnalyzeSubjectTopicsInput): Promise<AnalyzeSubjectTopicsOutput> {
  try {
    const cacheKey = `${input.courseName}_${input.subjectName}_${input.language}`;
    
    // Verificar caché
    const cached = topicsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[analyze-subject] Using cached topics');
      return { topics: cached.topics, bookTitle: cached.bookTitle };
    }

    const subjectType = detectSubjectType(input.subjectName);
    const level = getCourseLevel(input.courseName);
    
    console.log('[analyze-subject] Subject type:', subjectType, 'Level:', level);
    
    // Buscar el libro correspondiente en la biblioteca
    const book = bookPDFs.find(b => 
      b.course === input.courseName && 
      normalize(b.subject).includes(normalize(input.subjectName).split(' ')[0])
    );

    // Primero intentar obtener temas específicos por curso
    const specificTopics = getSpecificTopics(input.courseName, input.subjectName, input.language);
    if (specificTopics && specificTopics.length > 0) {
      const result = {
        topics: specificTopics,
        bookTitle: book?.title || `${input.subjectName} - ${input.courseName}`
      };
      topicsCache.set(cacheKey, { ...result, timestamp: Date.now() });
      return result;
    }

    // Usar temas heurísticos basados en tipo de asignatura y nivel
    const heuristicTopics = getHeuristicTopics(subjectType, level, input.language);
    
    const result = {
      topics: heuristicTopics,
      bookTitle: book?.title || (input.language === 'es' 
        ? `${input.subjectName} (${input.courseName})` 
        : `${input.subjectName} (${input.courseName})`)
    };
    
    // Guardar en caché
    topicsCache.set(cacheKey, { ...result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error('[analyze-subject-topics] Error:', error);
    
    const subjectType = detectSubjectType(input.subjectName);
    const level = getCourseLevel(input.courseName);
    
    return { 
      topics: getHeuristicTopics(subjectType, level, input.language),
      bookTitle: input.language === 'es' ? input.subjectName : input.subjectName
    };
  }
}

// Función de conveniencia para mantener compatibilidad con el código existente de matemáticas
export async function analyzeMathPdfTopicsCompatible(input: { courseName: string; language: 'es' | 'en' }): Promise<AnalyzeSubjectTopicsOutput> {
  return analyzeSubjectTopics({
    ...input,
    subjectName: 'Matemáticas'
  });
}
