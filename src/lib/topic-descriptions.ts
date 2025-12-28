// src/lib/topic-descriptions.ts
// Descripciones detalladas de temas por curso y asignatura

export interface TopicDescription {
  topic: string;
  unit: string;
  description: string;
}

export interface SubjectTopicsWithDescriptions {
  topics: string[];
  descriptions: Record<string, TopicDescription>;
}

// Estructura: curso -> asignatura -> descripciones de temas
export const topicDescriptionsByGrade: Record<string, Record<string, SubjectTopicsWithDescriptions>> = {
  '1ro basico': {
    'matematicas': {
      topics: [
        // Unidad 1: Mi colegio
        'Números hasta el 10',
        'Componer y descomponer',
        'Patrones',
        'El Tiempo',
        // Unidad 2: Cuido mi cuerpo
        'Sumas y restas iniciales',
        'Resolución de problemas',
        'Longitud',
        'Geometría',
        // Unidad 3: Nuestro rincón
        'Números del 11 al 20',
        'Decenas y unidades',
        'Patrones numéricos',
        'Igualdad y desigualdad',
        // Unidad 4: ¡Qué divertido!
        'Cálculo mental y escrito'
      ],
      descriptions: {
        'Números hasta el 10': {
          topic: 'Números hasta el 10',
          unit: 'Unidad 1: Mi colegio',
          description: 'Conteo, lectura, escritura y comparación (mayor, menor, igual) de cantidades pequeñas.'
        },
        'Componer y descomponer': {
          topic: 'Componer y descomponer',
          unit: 'Unidad 1: Mi colegio',
          description: 'Formación de números a partir de la suma de otros dos (ejemplo: el 5 se forma con 2 y 3).'
        },
        'Patrones': {
          topic: 'Patrones',
          unit: 'Unidad 1: Mi colegio',
          description: 'Identificación y continuación de secuencias repetitivas usando colores, formas o ritmos.'
        },
        'El Tiempo': {
          topic: 'El Tiempo',
          unit: 'Unidad 1: Mi colegio',
          description: 'Uso de conceptos temporales como antes/después, mañana/tarde/noche y ubicación en el calendario.'
        },
        'Sumas y restas iniciales': {
          topic: 'Sumas y restas iniciales',
          unit: 'Unidad 2: Cuido mi cuerpo',
          description: 'Introducción al concepto de sumar como "agregar/juntar" y restar como "quitar/separar" en el ámbito del 0 al 10.'
        },
        'Resolución de problemas': {
          topic: 'Resolución de problemas',
          unit: 'Unidad 2: Cuido mi cuerpo',
          description: 'Planteamiento y solución de historias matemáticas simples relacionadas con la vida diaria.'
        },
        'Longitud': {
          topic: 'Longitud',
          unit: 'Unidad 2: Cuido mi cuerpo',
          description: 'Comparación directa de objetos (largo/corto, alto/bajo) y medición utilizando unidades informales (como clips o lápices).'
        },
        'Geometría': {
          topic: 'Geometría',
          unit: 'Unidad 2: Cuido mi cuerpo',
          description: 'Diferenciación entre líneas rectas y curvas. Identificación de figuras planas (cuadrado, triángulo) y cuerpos 3D (cubo, esfera).'
        },
        'Números del 11 al 20': {
          topic: 'Números del 11 al 20',
          unit: 'Unidad 3: Nuestro rincón',
          description: 'Ampliación del ámbito numérico, incluyendo lectura y representación.'
        },
        'Decenas y unidades': {
          topic: 'Decenas y unidades',
          unit: 'Unidad 3: Nuestro rincón',
          description: 'Introducción al valor posicional, agrupando elementos de a 10 (Decena) y elementos sueltos (Unidades).'
        },
        'Patrones numéricos': {
          topic: 'Patrones numéricos',
          unit: 'Unidad 3: Nuestro rincón',
          description: 'Creación de secuencias numéricas (contar de 2 en 2, de 5 en 5).'
        },
        'Igualdad y desigualdad': {
          topic: 'Igualdad y desigualdad',
          unit: 'Unidad 3: Nuestro rincón',
          description: 'Comparación de cantidades utilizando balanzas para entender el equilibrio (igualdad) y desequilibrio (mayor/menor).'
        },
        'Cálculo mental y escrito': {
          topic: 'Cálculo mental y escrito',
          unit: 'Unidad 4: ¡Qué divertido!',
          description: 'Práctica de sumas y restas con números hasta el 20, aplicando estrategias mentales.'
        }
      }
    },
    'lenguaje y comunicacion': {
      topics: [
        // Unidad 1: ¿Qué sorpresas encontrarás en la escuela?
        'Comprensión de cuentos',
        'Vocales y primeras consonantes',
        'Escritura personal',
        'Textos informativos',
        'Consonantes L, S, T, D',
        // Unidad 2: ¿Por qué es importante la amistad?
        'Cartas y poemas',
        'Consonantes N, F, H, B',
        'Escritura de mensajes',
        'Consonante R y sílabas complejas',
        // Unidad 3: ¿Por qué son importantes los animales?
        'Fábulas',
        'Consonantes V, Ñ',
        'Adivinanzas',
        'Textos instructivos',
        'Consonantes J, Ll',
        // Unidad 4: ¿Por qué todos somos especiales?
        'La Noticia',
        'Consonantes Z, Ch',
        'Derechos y deberes',
        'Consonantes Y, X, K, W'
      ],
      descriptions: {
        'Comprensión de cuentos': {
          topic: 'Comprensión de cuentos',
          unit: 'Unidad 1: ¿Qué sorpresas encontrarás en la escuela?',
          description: 'Escucha activa y comprensión de relatos sobre la escuela.'
        },
        'Vocales y primeras consonantes': {
          topic: 'Vocales y primeras consonantes',
          unit: 'Unidad 1: ¿Qué sorpresas encontrarás en la escuela?',
          description: 'Lectura y escritura de las vocales (A, E, I, O, U) y las letras M y P.'
        },
        'Escritura personal': {
          topic: 'Escritura personal',
          unit: 'Unidad 1: ¿Qué sorpresas encontrarás en la escuela?',
          description: 'Redacción de datos propios y presentación oral ante el curso.'
        },
        'Textos informativos': {
          topic: 'Textos informativos',
          unit: 'Unidad 1: ¿Qué sorpresas encontrarás en la escuela?',
          description: 'Lectura de carteles y textos breves del entorno escolar.'
        },
        'Consonantes L, S, T, D': {
          topic: 'Consonantes L, S, T, D',
          unit: 'Unidad 1: ¿Qué sorpresas encontrarás en la escuela?',
          description: 'Ampliación del vocabulario lector y uso de artículos (el, la, los, las).'
        },
        'Cartas y poemas': {
          topic: 'Cartas y poemas',
          unit: 'Unidad 2: ¿Por qué es importante la amistad?',
          description: 'Lectura de textos que expresan sentimientos y comunicación personal.'
        },
        'Consonantes N, F, H, B': {
          topic: 'Consonantes N, F, H, B',
          unit: 'Unidad 2: ¿Por qué es importante la amistad?',
          description: 'Incorporación de nuevas letras y el uso de la "H" muda.'
        },
        'Escritura de mensajes': {
          topic: 'Escritura de mensajes',
          unit: 'Unidad 2: ¿Por qué es importante la amistad?',
          description: 'Redacción de saludos breves y notas para amigos.'
        },
        'Consonante R y sílabas complejas': {
          topic: 'Consonante R y sílabas complejas',
          unit: 'Unidad 2: ¿Por qué es importante la amistad?',
          description: 'Diferenciación del sonido suave y fuerte de la R, y aprendizaje de sílabas como que, qui, gue, gui.'
        },
        'Fábulas': {
          topic: 'Fábulas',
          unit: 'Unidad 3: ¿Por qué son importantes los animales?',
          description: 'Lectura de historias de animales que dejan una enseñanza.'
        },
        'Consonantes V, Ñ': {
          topic: 'Consonantes V, Ñ',
          unit: 'Unidad 3: ¿Por qué son importantes los animales?',
          description: 'Lectura y escritura de palabras con estas letras.'
        },
        'Adivinanzas': {
          topic: 'Adivinanzas',
          unit: 'Unidad 3: ¿Por qué son importantes los animales?',
          description: 'Creación y escritura de juegos de palabras para describir animales.'
        },
        'Textos instructivos': {
          topic: 'Textos instructivos',
          unit: 'Unidad 3: ¿Por qué son importantes los animales?',
          description: 'Comprensión de instrucciones paso a paso para realizar actividades.'
        },
        'Consonantes J, Ll': {
          topic: 'Consonantes J, Ll',
          unit: 'Unidad 3: ¿Por qué son importantes los animales?',
          description: 'Práctica de dígrafos y sonidos guturales.'
        },
        'La Noticia': {
          topic: 'La Noticia',
          unit: 'Unidad 4: ¿Por qué todos somos especiales?',
          description: 'Lectura de textos informativos sobre hechos reales.'
        },
        'Consonantes Z, Ch': {
          topic: 'Consonantes Z, Ch',
          unit: 'Unidad 4: ¿Por qué todos somos especiales?',
          description: 'Incorporación de sonidos finales del abecedario.'
        },
        'Derechos y deberes': {
          topic: 'Derechos y deberes',
          unit: 'Unidad 4: ¿Por qué todos somos especiales?',
          description: 'Escritura de textos breves sobre normas y respeto.'
        },
        'Consonantes Y, X, K, W': {
          topic: 'Consonantes Y, X, K, W',
          unit: 'Unidad 4: ¿Por qué todos somos especiales?',
          description: 'Finalización del aprendizaje del alfabeto con las letras menos frecuentes.'
        }
      }
    },
    'ciencias naturales': {
      topics: [
        // Unidad 1: Conozco y cuido mi cuerpo
        'Los sentidos',
        'Vida saludable',
        // Unidad 2: Los seres vivos de mi entorno
        'Seres vivos vs. no vivos',
        'Necesidades de los animales',
        // Unidad 3: Animales y plantas de la naturaleza
        'Cubierta corporal y desplazamiento',
        'Partes de la planta',
        // Unidad 4: El mundo de los materiales
        'Propiedades de los materiales',
        'Cambios en los materiales',
        // Unidad 5: El Sol y nuestro planeta
        'Ciclo diario',
        'Las estaciones'
      ],
      descriptions: {
        'Los sentidos': {
          topic: 'Los sentidos',
          unit: 'Unidad 1: Conozco y cuido mi cuerpo',
          description: 'Función y ubicación de la visión, audición, olfato, gusto y tacto.'
        },
        'Vida saludable': {
          topic: 'Vida saludable',
          unit: 'Unidad 1: Conozco y cuido mi cuerpo',
          description: 'Distinción entre alimentos saludables y no saludables; importancia de la higiene y el ejercicio.'
        },
        'Seres vivos vs. no vivos': {
          topic: 'Seres vivos vs. no vivos',
          unit: 'Unidad 2: Los seres vivos de mi entorno',
          description: 'Identificación de características de la vida (nacer, crecer, responder a estímulos) frente a la materia inerte.'
        },
        'Necesidades de los animales': {
          topic: 'Necesidades de los animales',
          unit: 'Unidad 2: Los seres vivos de mi entorno',
          description: 'Requerimientos básicos para la supervivencia (agua, alimento, aire, refugio).'
        },
        'Cubierta corporal y desplazamiento': {
          topic: 'Cubierta corporal y desplazamiento',
          unit: 'Unidad 3: Animales y plantas de la naturaleza',
          description: 'Clasificación de animales según tengan pelos, plumas o escamas, y si caminan, vuelan o nadan.'
        },
        'Partes de la planta': {
          topic: 'Partes de la planta',
          unit: 'Unidad 3: Animales y plantas de la naturaleza',
          description: 'Identificación de raíz, tallo, hoja, flor y fruto, con énfasis en la flora chilena.'
        },
        'Propiedades de los materiales': {
          topic: 'Propiedades de los materiales',
          unit: 'Unidad 4: El mundo de los materiales',
          description: 'Exploración de características como fragilidad, flexibilidad y transparencia en objetos cotidianos.'
        },
        'Cambios en los materiales': {
          topic: 'Cambios en los materiales',
          unit: 'Unidad 4: El mundo de los materiales',
          description: 'Observación de cómo el agua, el calor o la fuerza afectan a los distintos materiales.'
        },
        'Ciclo diario': {
          topic: 'Ciclo diario',
          unit: 'Unidad 5: El Sol y nuestro planeta',
          description: 'Diferenciación entre día y noche, y observación del Sol, la Luna y las estrellas.'
        },
        'Las estaciones': {
          topic: 'Las estaciones',
          unit: 'Unidad 5: El Sol y nuestro planeta',
          description: 'Características climáticas y del paisaje en otoño, invierno, primavera y verano.'
        }
      }
    },
    'historia, geografia y ciencias sociales': {
      topics: [
        // Unidad 1: Contamos historias
        'Orden temporal',
        'Identidad personal y familiar',
        // Unidad 2: Vivimos en comunidad
        'Normas de convivencia',
        'Instituciones y trabajos',
        // Unidad 3: Chile y sus paisajes
        'Ubicación de Chile',
        'Paisajes',
        // Unidad 4: Diversidad cultural
        'Aporte cultural'
      ],
      descriptions: {
        'Orden temporal': {
          topic: 'Orden temporal',
          unit: 'Unidad 1: Contamos historias',
          description: 'Secuenciación de eventos (ayer/hoy/mañana) y uso de categorías de tiempo (días de la semana, meses).'
        },
        'Identidad personal y familiar': {
          topic: 'Identidad personal y familiar',
          unit: 'Unidad 1: Contamos historias',
          description: 'Reconocimiento de la propia historia, árbol genealógico y costumbres familiares.'
        },
        'Normas de convivencia': {
          topic: 'Normas de convivencia',
          unit: 'Unidad 2: Vivimos en comunidad',
          description: 'Importancia de las reglas para la seguridad y el respeto en el hogar, la escuela y la calle.'
        },
        'Instituciones y trabajos': {
          topic: 'Instituciones y trabajos',
          unit: 'Unidad 2: Vivimos en comunidad',
          description: 'Funciones de organismos como Bomberos o Carabineros, y la distinción entre trabajos remunerados y voluntarios.'
        },
        'Ubicación de Chile': {
          topic: 'Ubicación de Chile',
          unit: 'Unidad 3: Chile y sus paisajes',
          description: 'Identificación del país en el globo terráqueo y mapas de América del Sur.'
        },
        'Paisajes': {
          topic: 'Paisajes',
          unit: 'Unidad 3: Chile y sus paisajes',
          description: 'Diferenciación de elementos naturales (ríos, montañas) y culturales (ciudades, caminos) en las distintas zonas del país.'
        },
        'Aporte cultural': {
          topic: 'Aporte cultural',
          unit: 'Unidad 4: Diversidad cultural',
          description: 'Reconocimiento de la diversidad de orígenes en la sociedad chilena (pueblos originarios e inmigrantes).'
        }
      }
    }
  },
  '2do basico': {
    'matematicas': {
      topics: [
        // Unidad 1: ¿Cómo uso los números?
        'Números hasta el 50',
        'Operaciones (Suma y Resta)',
        'El Tiempo y el Calendario',
        // Unidad 2: ¿Dónde más hay matemática?
        'Números hasta el 100 y 1.000',
        'Valor Posicional (Unidad y Decena)',
        'Estimación'
      ],
      descriptions: {
        'Números hasta el 50': {
          topic: 'Números hasta el 50',
          unit: 'Unidad 1 - ¿Cómo uso los números?',
          description: 'Lectura, escritura, conteo (de 2 en 2, 5 en 5, 10 en 10) y orden de números del 0 al 50.'
        },
        'Operaciones (Suma y Resta)': {
          topic: 'Operaciones (Suma y Resta)',
          unit: 'Unidad 1 - ¿Cómo uso los números?',
          description: 'Resolución de problemas de adición (agregar/avanzar) y sustracción (quitar/retroceder) y cálculo mental.'
        },
        'El Tiempo y el Calendario': {
          topic: 'El Tiempo y el Calendario',
          unit: 'Unidad 1 - ¿Cómo uso los números?',
          description: 'Ubicación temporal usando días de la semana y meses del año para ordenar fechas y eventos.'
        },
        'Números hasta el 100 y 1.000': {
          topic: 'Números hasta el 100 y 1.000',
          unit: 'Unidad 2 - ¿Dónde más hay matemática?',
          description: 'Ampliación del ámbito numérico hasta el 100 y conteo de 100 en 100 hasta el 1.000.'
        },
        'Valor Posicional (Unidad y Decena)': {
          topic: 'Valor Posicional (Unidad y Decena)',
          unit: 'Unidad 2 - ¿Dónde más hay matemática?',
          description: 'Agrupación de elementos en Decenas y Unidades para comprender el valor de cada dígito en un número.'
        },
        'Estimación': {
          topic: 'Estimación',
          unit: 'Unidad 2 - ¿Dónde más hay matemática?',
          description: 'Uso de referentes (como grupos de 10) para estimar cantidades sin contar uno a uno.'
        }
      }
    },
    'lenguaje y comunicacion': {
      topics: [
        // Unidad 1: ¿Para qué sirve la imaginación?
        'Cuentos e Imaginación',
        'Escritura Descriptiva',
        // Unidad 2: ¿Cómo miramos el mundo?
        'Fábulas y Moralejas',
        'Artículos Informativos',
        // Unidad 3: ¿Cómo nos relacionamos con los demás?
        'Leyendas y Tradiciones',
        'Gramática y Ortografía'
      ],
      descriptions: {
        'Cuentos e Imaginación': {
          topic: 'Cuentos e Imaginación',
          unit: 'Unidad 1 - ¿Para qué sirve la imaginación?',
          description: 'Lectura comprensiva de cuentos ("El niño más bueno del mundo") y caracterización física y psicológica de personajes.'
        },
        'Escritura Descriptiva': {
          topic: 'Escritura Descriptiva',
          unit: 'Unidad 1 - ¿Para qué sirve la imaginación?',
          description: 'Redacción de párrafos breves usando adjetivos calificativos para describir animales o personajes.'
        },
        'Fábulas y Moralejas': {
          topic: 'Fábulas y Moralejas',
          unit: 'Unidad 2 - ¿Cómo miramos el mundo?',
          description: 'Lectura de fábulas ("La rana y el león") para extraer enseñanzas y recrear el ambiente de una historia.'
        },
        'Artículos Informativos': {
          topic: 'Artículos Informativos',
          unit: 'Unidad 2 - ¿Cómo miramos el mundo?',
          description: 'Comprensión de textos reales sobre animales (camuflaje) y temas de cuidado ambiental (reciclaje).'
        },
        'Leyendas y Tradiciones': {
          topic: 'Leyendas y Tradiciones',
          unit: 'Unidad 3 - ¿Cómo nos relacionamos con los demás?',
          description: 'Lectura de leyendas chilenas ("El pastorcito de llamas", "Añañuca") y textos sobre juegos de pueblos originarios.'
        },
        'Gramática y Ortografía': {
          topic: 'Gramática y Ortografía',
          unit: 'Unidad 3 - ¿Cómo nos relacionamos con los demás?',
          description: 'Uso correcto de mayúsculas al inicio y punto al final de las oraciones.'
        }
      }
    },
    'ciencias naturales': {
      topics: [
        // Unidad 1: ¿Cómo funciona nuestro cuerpo?
        'Órganos del Cuerpo Humano',
        'Sistema Locomotor y Actividad Física',
        // Unidad 2: Vertebrados e invertebrados
        'Vertebrados e Invertebrados',
        // Unidad 3: Protejamos el hogar de los animales
        'Hábitats y Animales en Peligro',
        'Ciclos de Vida',
        // Unidad 4: El agua en nuestra vida
        'El Agua y sus Estados'
      ],
      descriptions: {
        'Órganos del Cuerpo Humano': {
          topic: 'Órganos del Cuerpo Humano',
          unit: 'Unidad 1 - ¿Cómo funciona nuestro cuerpo?',
          description: 'Ubicación y función de órganos vitales: corazón (bombea sangre), pulmones (respiración) y estómago (digestión).'
        },
        'Sistema Locomotor y Actividad Física': {
          topic: 'Sistema Locomotor y Actividad Física',
          unit: 'Unidad 1 - ¿Cómo funciona nuestro cuerpo?',
          description: 'Función de huesos (sostén), músculos (movimiento) y la importancia del ejercicio para la salud.'
        },
        'Vertebrados e Invertebrados': {
          topic: 'Vertebrados e Invertebrados',
          unit: 'Unidad 2 - Vertebrados e invertebrados',
          description: 'Clasificación de animales en vertebrados (mamíferos, aves, reptiles, anfibios, peces) e invertebrados (insectos, arácnidos, crustáceos).'
        },
        'Hábitats y Animales en Peligro': {
          topic: 'Hábitats y Animales en Peligro',
          unit: 'Unidad 3 - Protejamos el hogar de los animales',
          description: 'Relación entre animales y su entorno (hábitat), y cuidado de especies chilenas en peligro de extinción.'
        },
        'Ciclos de Vida': {
          topic: 'Ciclos de Vida',
          unit: 'Unidad 3 - Protejamos el hogar de los animales',
          description: 'Observación de las etapas de vida de diversos animales (ej. mariposa, rana, aves).'
        },
        'El Agua y sus Estados': {
          topic: 'El Agua y sus Estados',
          unit: 'Unidad 4 - El agua en nuestra vida',
          description: 'Características del agua (inodora, incolora, escurre) y sus estados físicos: sólido (hielo), líquido y gaseoso (vapor).'
        }
      }
    },
    'historia, geografia y ciencias sociales': {
      topics: [
        // Unidad 1: ¿Cómo es el lugar donde vivimos?
        'Planos y Orientación',
        'Paisajes de Chile',
        'Medios de Transporte y Comunicación',
        'Normas y Espacios Públicos',
        // Unidad 2: ¿Quiénes fueron los primeros habitantes en Chile?
        'Pueblos Originarios',
        // Unidad 3: ¿Por qué Chile es diverso?
        'Diversidad y Herencia'
      ],
      descriptions: {
        'Planos y Orientación': {
          topic: 'Planos y Orientación',
          unit: 'Unidad 1 - ¿Cómo es el lugar donde vivimos?',
          description: 'Uso de puntos cardinales (Norte, Sur, Este, Oeste) y lectura de planos simples para ubicarse en el entorno.'
        },
        'Paisajes de Chile': {
          topic: 'Paisajes de Chile',
          unit: 'Unidad 1 - ¿Cómo es el lugar donde vivimos?',
          description: 'Caracterización de los paisajes de las zonas Norte, Central, Sur y Austral (clima, vegetación y relieve).'
        },
        'Medios de Transporte y Comunicación': {
          topic: 'Medios de Transporte y Comunicación',
          unit: 'Unidad 1 - ¿Cómo es el lugar donde vivimos?',
          description: 'Identificación de medios que conectan el país y permiten la comunicación entre personas.'
        },
        'Normas y Espacios Públicos': {
          topic: 'Normas y Espacios Públicos',
          unit: 'Unidad 1 - ¿Cómo es el lugar donde vivimos?',
          description: 'Cuidado de los espacios comunes (plazas, playas) y normas de autocuidado en la vía pública.'
        },
        'Pueblos Originarios': {
          topic: 'Pueblos Originarios',
          unit: 'Unidad 2 - ¿Quiénes fueron los primeros habitantes en Chile?',
          description: 'Distinción entre modos de vida nómada y sedentaria. Estudio de pueblos como Mapuche, Aymara, Rapa Nui, Changos, etc.'
        },
        'Diversidad y Herencia': {
          topic: 'Diversidad y Herencia',
          unit: 'Unidad 3 - ¿Por qué Chile es diverso?',
          description: 'Reconocimiento del aporte de los pueblos originarios y de los inmigrantes (pasados y actuales) a la cultura chilena (comidas, palabras, costumbres).'
        }
      }
    }
  },
  '3ro basico': {
    'matematicas': {
      topics: [
        // Unidad 1: Nuestro barrio
        'Números hasta el 1.000',
        'Orden y Comparación',
        'Adición y Sustracción',
        // Unidad 2: Nuestro colegio
        'Patrones y Ecuaciones',
        'Figuras 3D y Perímetro',
        // Unidad 2/3: Nuestro colegio / Vida saludable
        'Multiplicación y División',
        // Unidad 3: Vida saludable
        'El Tiempo',
        'Gráficos y Probabilidades',
        // Unidad 4: Medios de comunicación
        'Fracciones',
        'Geometría y Ubicación'
      ],
      descriptions: {
        'Números hasta el 1.000': {
          topic: 'Números hasta el 1.000',
          unit: 'Unidad 1 - Nuestro barrio',
          description: 'Lectura, escritura, conteo y representación de números hasta el 1.000, identificando centenas, decenas y unidades.'
        },
        'Orden y Comparación': {
          topic: 'Orden y Comparación',
          unit: 'Unidad 1 - Nuestro barrio',
          description: 'Uso de la tabla posicional y la recta numérica para comparar y ordenar cantidades.'
        },
        'Adición y Sustracción': {
          topic: 'Adición y Sustracción',
          unit: 'Unidad 1 - Nuestro barrio',
          description: 'Resolución de sumas y restas (con y sin canje/reserva), propiedades y cálculo mental.'
        },
        'Patrones y Ecuaciones': {
          topic: 'Patrones y Ecuaciones',
          unit: 'Unidad 2 - Nuestro colegio',
          description: 'Identificación de reglas en secuencias numéricas y resolución de igualdades (ecuaciones) simples usando balanzas.'
        },
        'Multiplicación y División': {
          topic: 'Multiplicación y División',
          unit: 'Unidad 2 - Nuestro colegio / Unidad 3 - Vida saludable',
          description: 'Relación entre la suma repetida y la multiplicación. Tablas de multiplicar (incluyendo 7 y 9). Reparto equitativo y relación con la sustracción.'
        },
        'Figuras 3D y Perímetro': {
          topic: 'Figuras 3D y Perímetro',
          unit: 'Unidad 2 - Nuestro colegio',
          description: 'Identificación de caras, aristas y vértices en cuerpos geométricos y relación con figuras 2D (redes). Cálculo del contorno de figuras.'
        },
        'El Tiempo': {
          topic: 'El Tiempo',
          unit: 'Unidad 3 - Vida saludable',
          description: 'Lectura de horas en relojes análogos y digitales, uso de calendarios y líneas de tiempo.'
        },
        'Gráficos y Probabilidades': {
          topic: 'Gráficos y Probabilidades',
          unit: 'Unidad 3 - Vida saludable',
          description: 'Lectura y construcción de pictogramas y gráficos de barras. Registro de resultados en juegos aleatorios.'
        },
        'Fracciones': {
          topic: 'Fracciones',
          unit: 'Unidad 4 - Medios de comunicación',
          description: 'Representación y comparación de fracciones como partes de un todo.'
        },
        'Geometría y Ubicación': {
          topic: 'Geometría y Ubicación',
          unit: 'Unidad 4 - Medios de comunicación',
          description: 'Ubicación en cuadrículas y mapas. Ángulos y transformaciones isométricas (rotación, traslación, reflexión).'
        }
      }
    },
    'lenguaje y comunicacion': {
      topics: [
        // Unidad 1: Un abrazo a la infancia
        'Derechos de la Infancia y Cuentos',
        // Unidad 2: ¡Salgamos a jugar!
        'Poesía e Instrucciones',
        // Unidad 3: Lo mejor de mí
        'Novelas y Cartas',
        // Unidad 4: La experiencia me enseña
        'Fábulas y Artículos Informativos',
        // Unidad 5: Voces de niñas
        'Leyendas y Biografías'
      ],
      descriptions: {
        'Derechos de la Infancia y Cuentos': {
          topic: 'Derechos de la Infancia y Cuentos',
          unit: 'Unidad 1 - Un abrazo a la infancia',
          description: 'Lectura de cuentos ("Pequeña Masai") y noticias. Escritura de afiches sobre derechos. Uso de sustantivos y artículos.'
        },
        'Poesía e Instrucciones': {
          topic: 'Poesía e Instrucciones',
          unit: 'Unidad 2 - ¡Salgamos a jugar!',
          description: 'Lectura de poemas ("Columpios") y textos instructivos. Uso de adjetivos calificativos para describir.'
        },
        'Novelas y Cartas': {
          topic: 'Novelas y Cartas',
          unit: 'Unidad 3 - Lo mejor de mí',
          description: 'Comprensión de fragmentos de novelas infantiles y cartas personales. Uso de pronombres y morfología (raíz y sufijos).'
        },
        'Fábulas y Artículos Informativos': {
          topic: 'Fábulas y Artículos Informativos',
          unit: 'Unidad 4 - La experiencia me enseña',
          description: 'Lectura de fábulas para extraer moralejas y artículos informativos sobre la naturaleza. Uso de prefijos.'
        },
        'Leyendas y Biografías': {
          topic: 'Leyendas y Biografías',
          unit: 'Unidad 5 - Voces de niñas',
          description: 'Lectura de leyendas tradicionales y biografías de mujeres destacadas. Escritura creativa de historias.'
        }
      }
    },
    'ciencias naturales': {
      topics: [
        // Unidad 1: Investigando la luz y el sonido
        'La Luz',
        'El Sonido',
        // Unidad 2: ¿Cómo es el Sistema Solar?
        'El Sistema Solar',
        // Unidad 3: ¿Por qué las plantas son importantes?
        'Las Plantas',
        // Unidad 4: ¿Cómo alimentarnos de manera saludable?
        'Alimentación Saludable'
      ],
      descriptions: {
        'La Luz': {
          topic: 'La Luz',
          unit: 'Unidad 1 - Investigando la luz y el sonido',
          description: 'Fuentes luminosas (naturales/artificiales), propagación en línea recta, reflexión y descomposición de la luz (colores).'
        },
        'El Sonido': {
          topic: 'El Sonido',
          unit: 'Unidad 1 - Investigando la luz y el sonido',
          description: 'Cómo se produce (vibración) y sus cualidades: intensidad (fuerte/débil), tono (agudo/grave) y timbre.'
        },
        'El Sistema Solar': {
          topic: 'El Sistema Solar',
          unit: 'Unidad 2 - ¿Cómo es el Sistema Solar?',
          description: 'Componentes (Sol, planetas, lunas, cometas). Movimientos de la Tierra (rotación y traslación) y sus efectos (día/noche, estaciones).'
        },
        'Las Plantas': {
          topic: 'Las Plantas',
          unit: 'Unidad 3 - ¿Por qué las plantas son importantes?',
          description: 'Partes de la planta y sus funciones. Ciclo de vida, polinización y dispersión de semillas. Importancia para los seres vivos.'
        },
        'Alimentación Saludable': {
          topic: 'Alimentación Saludable',
          unit: 'Unidad 4 - ¿Cómo alimentarnos de manera saludable?',
          description: 'Clasificación de alimentos (estructurales, energéticos, reguladores) y medidas de higiene en su manipulación.'
        }
      }
    },
    'historia, geografia y ciencias sociales': {
      topics: [
        // Unidad 1: ¿Cómo podemos conocer el planeta Tierra?
        'Ubicación Espacial y Zonas Climáticas',
        // Unidad 2: ¿Cómo vivían los antiguos griegos y qué nos legaron?
        'La Civilización Griega',
        // Unidad 3: ¿Cómo vivían los antiguos romanos y cuál es su legado?
        'La Civilización Romana',
        // Unidad 4: ¿Cómo aportamos a la vida en comunidad?
        'Vida en Comunidad y Derechos'
      ],
      descriptions: {
        'Ubicación Espacial y Zonas Climáticas': {
          topic: 'Ubicación Espacial y Zonas Climáticas',
          unit: 'Unidad 1 - ¿Cómo podemos conocer el planeta Tierra?',
          description: 'Uso de cuadrículas y líneas imaginarias (Ecuador, Trópicos). Características de las zonas climáticas (cálida, templada, fría) y sus paisajes.'
        },
        'La Civilización Griega': {
          topic: 'La Civilización Griega',
          unit: 'Unidad 2 - ¿Cómo vivían los antiguos griegos y qué nos legaron?',
          description: 'Entorno geográfico, vida cotidiana, educación y sus legados (democracia, teatro, juegos olímpicos, mitología).'
        },
        'La Civilización Romana': {
          topic: 'La Civilización Romana',
          unit: 'Unidad 3 - ¿Cómo vivían los antiguos romanos y cuál es su legado?',
          description: 'Ubicación, vida en la ciudad, familia y sus legados (idioma latín, leyes, arquitectura, cristianismo).'
        },
        'Vida en Comunidad y Derechos': {
          topic: 'Vida en Comunidad y Derechos',
          unit: 'Unidad 4 - ¿Cómo aportamos a la vida en comunidad?',
          description: 'Derechos y deberes de los niños. Participación ciudadana y el rol de instituciones públicas y privadas.'
        }
      }
    }
  },
  '4to basico': {
    'matematicas': {
      topics: [
        // Unidad 1: Matemática en el día a día
        'Números hasta el 10.000',
        'Multiplicación y División',
        'Patrones y Ecuaciones',
        // Unidad 2: ¿Existe geometría en nuestro entorno?
        'Ángulos y Vistas',
        'Transformaciones Isométricas',
        // Unidad 3: ¿Es saludable tu alimentación?
        'Fracciones y Números Mixtos',
        'Números Decimales',
        // Unidad 4: ¿Y si practicamos deportes?
        'Área y Volumen',
        // Unidad 5: Y tú, ¿proteges el medio ambiente?
        'Datos y Probabilidades'
      ],
      descriptions: {
        'Números hasta el 10.000': {
          topic: 'Números hasta el 10.000',
          unit: 'Unidad 1 - Matemática en el día a día',
          description: 'Lectura, escritura, representación, conteo (de 10 en 10, 100 en 100, etc.), valor posicional y redondeo de números hasta 10.000.'
        },
        'Multiplicación y División': {
          topic: 'Multiplicación y División',
          unit: 'Unidad 1 - Matemática en el día a día',
          description: 'Uso del algoritmo de la multiplicación (por un dígito) y de la división. Relación inversa entre ambas y estrategias de cálculo mental.'
        },
        'Patrones y Ecuaciones': {
          topic: 'Patrones y Ecuaciones',
          unit: 'Unidad 1 - Matemática en el día a día',
          description: 'Identificación de patrones numéricos en tablas y resolución de ecuaciones (igualdades) e inecuaciones (desigualdades) de un paso.'
        },
        'Ángulos y Vistas': {
          topic: 'Ángulos y Vistas',
          unit: 'Unidad 2 - ¿Existe geometría en nuestro entorno?',
          description: 'Medición y construcción de ángulos con transportador. Identificación de vistas (frente, lado, arriba) de cuerpos geométricos (prismas, pirámides).'
        },
        'Transformaciones Isométricas': {
          topic: 'Transformaciones Isométricas',
          unit: 'Unidad 2 - ¿Existe geometría en nuestro entorno?',
          description: 'Reconocimiento y dibujo de movimientos de figuras: traslación (deslizar), reflexión (espejo/simetría) y rotación (girar).'
        },
        'Fracciones y Números Mixtos': {
          topic: 'Fracciones y Números Mixtos',
          unit: 'Unidad 3 - ¿Es saludable tu alimentación?',
          description: 'Concepto de fracciones propias e impropias, y su transformación a números mixtos. Adición y sustracción de fracciones con igual denominador.'
        },
        'Números Decimales': {
          topic: 'Números Decimales',
          unit: 'Unidad 3 - ¿Es saludable tu alimentación?',
          description: 'Lectura, escritura y representación de décimos y centésimos. Operaciones de suma y resta con números decimales.'
        },
        'Área y Volumen': {
          topic: 'Área y Volumen',
          unit: 'Unidad 4 - ¿Y si practicamos deportes?',
          description: 'Cálculo de área en figuras 2D (conteo de cuadrículas) y medición de volumen en figuras 3D (conteo de cubitos unitarios).'
        },
        'Datos y Probabilidades': {
          topic: 'Datos y Probabilidades',
          unit: 'Unidad 5 - Y tú, ¿proteges el medio ambiente?',
          description: 'Realización de encuestas, lectura de gráficos de barras y pictogramas. Experimentos aleatorios (seguro, posible, imposible).'
        }
      }
    },
    'lenguaje y comunicacion': {
      topics: [
        // Unidad 1: El poder de los libros
        'Cuentos y Novelas (Narrativa)',
        'La Infografía',
        // Unidad 2: Cada uno es especial
        'Poesía y Lenguaje Figurado',
        'Artículos Informativos',
        // Unidad 3: Hay lugar para todos
        'La Noticia',
        // Unidad 4: Voces de los pueblos
        'Mitos y Leyendas',
        // Unidad 5: Y ahora... ¿qué hago?
        'Biografía y Autobiografía'
      ],
      descriptions: {
        'Cuentos y Novelas (Narrativa)': {
          topic: 'Cuentos y Novelas (Narrativa)',
          unit: 'Unidad 1 - El poder de los libros / Unidad 5',
          description: 'Lectura de cuentos ("El hombre que contaba historias") y novelas ("Matilda"). Análisis de personajes (físico/sicológico) y secuencia narrativa.'
        },
        'La Infografía': {
          topic: 'La Infografía',
          unit: 'Unidad 1 - El poder de los libros',
          description: 'Comprensión de textos que combinan imagen y texto ("La lectura en la era móvil") y creación de una infografía propia.'
        },
        'Poesía y Lenguaje Figurado': {
          topic: 'Poesía y Lenguaje Figurado',
          unit: 'Unidad 2 - Cada uno es especial',
          description: 'Lectura de poemas. Reconocimiento de estructura (verso, estrofa) y figuras literarias.'
        },
        'Artículos Informativos': {
          topic: 'Artículos Informativos',
          unit: 'Unidad 2 - Cada uno es especial',
          description: 'Lectura de textos expositivos sobre animales (ej. ornitorrinco) para extraer información explícita e implícita.'
        },
        'La Noticia': {
          topic: 'La Noticia',
          unit: 'Unidad 3 - Hay lugar para todos',
          description: 'Comprensión de la estructura de la noticia (epígrafe, titular, bajada, cuerpo) y escritura de reportes sobre hechos de interés.'
        },
        'Mitos y Leyendas': {
          topic: 'Mitos y Leyendas',
          unit: 'Unidad 4 - Voces de los pueblos',
          description: 'Lectura de relatos de tradición oral ("Make-Make", "Las campanas de Rere") para conocer la visión de mundo de distintos pueblos.'
        },
        'Biografía y Autobiografía': {
          topic: 'Biografía y Autobiografía',
          unit: 'Unidad 5 - Y ahora... ¿qué hago?',
          description: 'Lectura de vidas de personas destacadas (Frida Kahlo, Ada Lovelace) y escritura de la propia historia de vida.'
        }
      }
    },
    'ciencias naturales': {
      topics: [
        // Unidad 1: Exploro la materia y las fuerzas
        'Materia y Fuerza',
        // Unidad 2: Descubro la estructura de la Tierra
        'La Tierra y sus Capas',
        // Unidad 3: Muevo y cuido mi cuerpo
        'Sistema Esquelético y Nervioso',
        // Unidad 4: Analizo a los seres vivos en su ambiente
        'Ecosistemas'
      ],
      descriptions: {
        'Materia y Fuerza': {
          topic: 'Materia y Fuerza',
          unit: 'Unidad 1 - Exploro la materia y las fuerzas',
          description: 'Medición de masa y volumen. Estados de la materia (sólido, líquido, gas). Efectos de las fuerzas (roce, magnética, peso) en los objetos.'
        },
        'La Tierra y sus Capas': {
          topic: 'La Tierra y sus Capas',
          unit: 'Unidad 2 - Descubro la estructura de la Tierra',
          description: 'Modelo de las capas de la Tierra (corteza, manto, núcleo). Placas tectónicas y sus movimientos (sismos, tsunamis, volcanes).'
        },
        'Sistema Esquelético y Nervioso': {
          topic: 'Sistema Esquelético y Nervioso',
          unit: 'Unidad 3 - Muevo y cuido mi cuerpo',
          description: 'Función de huesos, músculos y articulaciones en el movimiento. El sistema nervioso (cerebro, nervios) y los efectos del alcohol en el organismo.'
        },
        'Ecosistemas': {
          topic: 'Ecosistemas',
          unit: 'Unidad 4 - Analizo a los seres vivos en su ambiente',
          description: 'Relación entre seres vivos (bióticos) y no vivos (abióticos). Cadenas alimentarias y adaptaciones de plantas y animales al entorno.'
        }
      }
    },
    'historia, geografia y ciencias sociales': {
      topics: [
        // Unidad 1: ¿Cómo es el continente americano?
        'Coordenadas Geográficas',
        'Recursos y Paisajes de América',
        // Unidad 2: Mayas y Aztecas
        'Civilización Maya',
        'Civilización Azteca',
        // Unidad 3: Los Incas
        'Civilización Inca',
        // Unidad 4: Participación en la comunidad
        'Derechos y Democracia'
      ],
      descriptions: {
        'Coordenadas Geográficas': {
          topic: 'Coordenadas Geográficas',
          unit: 'Unidad 1 - ¿Cómo es el continente americano?',
          description: 'Ubicación absoluta usando latitud y longitud. Uso de la cuadrícula y puntos cardinales en el mapa.'
        },
        'Recursos y Paisajes de América': {
          topic: 'Recursos y Paisajes de América',
          unit: 'Unidad 1 - ¿Cómo es el continente americano?',
          description: 'Diversidad de climas y paisajes de América. Recursos naturales renovables y no renovables, y desarrollo sostenible.'
        },
        'Civilización Maya': {
          topic: 'Civilización Maya',
          unit: 'Unidad 2 - Mayas y Aztecas',
          description: 'Ubicación en Mesoamérica, organización en ciudades-estado, sociedad jerárquica, religión y grandes logros (astronomía, matemáticas).'
        },
        'Civilización Azteca': {
          topic: 'Civilización Azteca',
          unit: 'Unidad 2 - Mayas y Aztecas',
          description: 'Ubicación en el lago Texcoco, formación del imperio, técnica de cultivo (chinampas), guerra y rituales.'
        },
        'Civilización Inca': {
          topic: 'Civilización Inca',
          unit: 'Unidad 3 - Los Incas',
          description: 'Ubicación en los Andes, el Tahuantinsuyo, sistema de caminos, cultivo en terrazas y sistema de trabajo (mita).'
        },
        'Derechos y Democracia': {
          topic: 'Derechos y Democracia',
          unit: 'Unidad 4 - Participación en la comunidad',
          description: 'Derechos de los niños y deberes. Organización democrática de Chile (Presidente, Alcaldes, Senadores) y participación ciudadana.'
        }
      }
    }
  },
  '5to basico': {
    'matematicas': {
      topics: [
        // Unidad 1: Números naturales, operaciones y patrones
        'Grandes Números',
        'Multiplicación y División',
        'Estrategias de Cálculo',
        'Patrones y Secuencias',
        // Unidad 2: Geometría y medición
        'Unidades de Medida',
        'Figuras Geométricas y Congruencia',
        'Área y Perímetro',
        'Plano Cartesiano',
        // Unidad 3: Fracciones, números decimales y álgebra
        'Fracciones y Números Mixtos',
        'Operaciones con Fracciones',
        'Números Decimales',
        'Álgebra (Ecuaciones)',
        // Unidad 4: Datos y probabilidades
        'Datos y Probabilidades'
      ],
      descriptions: {
        'Grandes Números': {
          topic: 'Grandes Números',
          unit: 'Unidad 1 - Números naturales, operaciones y patrones',
          description: 'Lectura, escritura, representación y orden de números hasta los mil millones (1.000.000.000).'
        },
        'Multiplicación y División': {
          topic: 'Multiplicación y División',
          unit: 'Unidad 1 - Números naturales, operaciones y patrones',
          description: 'Estrategias de cálculo mental y escrito para multiplicar números grandes y dividir por un dígito.'
        },
        'Estrategias de Cálculo': {
          topic: 'Estrategias de Cálculo',
          unit: 'Unidad 1 - Números naturales, operaciones y patrones',
          description: 'Resolución de operaciones combinadas respetando la prioridad de las operaciones y uso de la calculadora.'
        },
        'Patrones y Secuencias': {
          topic: 'Patrones y Secuencias',
          unit: 'Unidad 1 - Números naturales, operaciones y patrones',
          description: 'Identificación de reglas o patrones de formación en secuencias numéricas y predicción de términos.'
        },
        'Unidades de Medida': {
          topic: 'Unidades de Medida',
          unit: 'Unidad 2 - Geometría y medición',
          description: 'Medición de longitudes y conversión entre milímetros, centímetros, metros y kilómetros.'
        },
        'Figuras Geométricas y Congruencia': {
          topic: 'Figuras Geométricas y Congruencia',
          unit: 'Unidad 2 - Geometría y medición',
          description: 'Identificación de líneas paralelas y perpendiculares, y reconocimiento de figuras congruentes (igual forma y tamaño).'
        },
        'Área y Perímetro': {
          topic: 'Área y Perímetro',
          unit: 'Unidad 2 - Geometría y medición',
          description: 'Cálculo de áreas de rectángulos, cuadrados, triángulos y figuras compuestas.'
        },
        'Plano Cartesiano': {
          topic: 'Plano Cartesiano',
          unit: 'Unidad 2 - Geometría y medición',
          description: 'Ubicación de puntos y figuras utilizando coordenadas en el primer cuadrante.'
        },
        'Fracciones y Números Mixtos': {
          topic: 'Fracciones y Números Mixtos',
          unit: 'Unidad 3 - Fracciones, números decimales y álgebra',
          description: 'Concepto de fracción impropia, equivalencia y transformación a números mixtos.'
        },
        'Operaciones con Fracciones': {
          topic: 'Operaciones con Fracciones',
          unit: 'Unidad 3 - Fracciones, números decimales y álgebra',
          description: 'Adición y sustracción de fracciones con distinto denominador.'
        },
        'Números Decimales': {
          topic: 'Números Decimales',
          unit: 'Unidad 3 - Fracciones, números decimales y álgebra',
          description: 'Lectura y operatoria (suma y resta) con décimos, centésimos y milésimos.'
        },
        'Álgebra (Ecuaciones)': {
          topic: 'Álgebra (Ecuaciones)',
          unit: 'Unidad 3 - Fracciones, números decimales y álgebra',
          description: 'Introducción a las expresiones algebraicas y resolución de ecuaciones e inecuaciones simples.'
        },
        'Datos y Probabilidades': {
          topic: 'Datos y Probabilidades',
          unit: 'Unidad 4 - Datos y probabilidades',
          description: 'Interpretación de gráficos de barras y líneas; cálculo de promedios y diagrama de tallo y hojas.'
        }
      }
    },
    'lenguaje y comunicacion': {
      topics: [
        // Unidad 1: ¿Pueden las palabras cambiar el mundo?
        'El Arte de Contar Historias',
        'Textos Informativos y Noticias',
        // Unidad 2: ¿Qué podemos hacer con la imaginación y la creatividad?
        'Mitos y Leyendas',
        'Biografías y Creatividad',
        // Unidad 3: ¿Nos gusta viajar de un lugar a otro?
        'La Novela y el Viaje',
        // Unidad 4: ¿Cómo nos relacionamos con la naturaleza?
        'Poesía y Naturaleza',
        'Texto Dramático'
      ],
      descriptions: {
        'El Arte de Contar Historias': {
          topic: 'El Arte de Contar Historias',
          unit: 'Unidad 1 - ¿Pueden las palabras cambiar el mundo?',
          description: 'Lectura de cuentos y microcuentos, enfocándose en la secuencia narrativa y las consecuencias de las acciones de los personajes.'
        },
        'Textos Informativos y Noticias': {
          topic: 'Textos Informativos y Noticias',
          unit: 'Unidad 1 - ¿Pueden las palabras cambiar el mundo?',
          description: 'Análisis de artículos informativos y noticias sobre temas actuales (ej. medioambiente) para distinguir hechos de opiniones.'
        },
        'Mitos y Leyendas': {
          topic: 'Mitos y Leyendas',
          unit: 'Unidad 2 - ¿Qué podemos hacer con la imaginación y la creatividad?',
          description: 'Lectura de relatos de tradición oral para comprender la visión de mundo de diferentes culturas.'
        },
        'Biografías y Creatividad': {
          topic: 'Biografías y Creatividad',
          unit: 'Unidad 2 - ¿Qué podemos hacer con la imaginación y la creatividad?',
          description: 'Lectura sobre vidas de inventores y creadores, y escritura de textos para expresar opiniones fundamentadas.'
        },
        'La Novela y el Viaje': {
          topic: 'La Novela y el Viaje',
          unit: 'Unidad 3 - ¿Nos gusta viajar de un lugar a otro?',
          description: 'Lectura de fragmentos de novelas (ej. "Viaje al centro de la Tierra", "Charlie y la fábrica de chocolate") analizando el conflicto y el ambiente.'
        },
        'Poesía y Naturaleza': {
          topic: 'Poesía y Naturaleza',
          unit: 'Unidad 4 - ¿Cómo nos relacionamos con la naturaleza?',
          description: 'Interpretación del lenguaje figurado en poemas y caligramas.'
        },
        'Texto Dramático': {
          topic: 'Texto Dramático',
          unit: 'Unidad 4 - ¿Cómo nos relacionamos con la naturaleza?',
          description: 'Lectura de obras de teatro, reconociendo el conflicto dramático, el diálogo y las acotaciones.'
        }
      }
    },
    'ciencias naturales': {
      topics: [
        // Unidad 1: El agua en el planeta
        'El Agua en el Planeta',
        'Usos y Cuidado del Agua',
        // Unidad 2: ¿Cómo funciona nuestro cuerpo?
        'Sistemas del Cuerpo Humano',
        'Nutrición y Alimentación',
        // Unidad 3: Vida saludable
        'Salud y Microorganismos',
        // Unidad 4: La energía eléctrica
        'La Energía Eléctrica'
      ],
      descriptions: {
        'El Agua en el Planeta': {
          topic: 'El Agua en el Planeta',
          unit: 'Unidad 1 - El agua en el planeta',
          description: 'Distribución de agua dulce y salada; características de océanos y lagos (profundidad, presión, luminosidad).'
        },
        'Usos y Cuidado del Agua': {
          topic: 'Usos y Cuidado del Agua',
          unit: 'Unidad 1 - El agua en el planeta',
          description: 'Importancia de las reservas de agua dulce y efectos de la actividad humana (contaminación).'
        },
        'Sistemas del Cuerpo Humano': {
          topic: 'Sistemas del Cuerpo Humano',
          unit: 'Unidad 2 - ¿Cómo funciona nuestro cuerpo?',
          description: 'Niveles de organización biológica (célula a organismo). Función de los sistemas digestivo, circulatorio y respiratorio.'
        },
        'Nutrición y Alimentación': {
          topic: 'Nutrición y Alimentación',
          unit: 'Unidad 2 - ¿Cómo funciona nuestro cuerpo?',
          description: 'Clasificación de alimentos según nutrientes y análisis del etiquetado nutricional para una dieta balanceada.'
        },
        'Salud y Microorganismos': {
          topic: 'Salud y Microorganismos',
          unit: 'Unidad 3 - Vida saludable',
          description: 'Efectos del consumo de tabaco. Características de bacterias y virus; enfermedades y prevención.'
        },
        'La Energía Eléctrica': {
          topic: 'La Energía Eléctrica',
          unit: 'Unidad 4 - La energía eléctrica',
          description: 'Importancia de la electricidad, funcionamiento de circuitos eléctricos (serie y paralelo) y materiales conductores vs. aislantes.'
        }
      }
    },
    'historia, geografia y ciencias sociales': {
      topics: [
        // Unidad 1: ¿En qué consiste la diversidad del territorio chileno?
        'Zonas Naturales de Chile',
        'Recursos Naturales',
        'Riesgos Naturales',
        // Unidad 2: ¿Qué impacto tuvo en América el proceso de expansión europea?
        'La Expansión Europea',
        'Conquista de América y Chile',
        // Unidad 3: ¿Qué tipo de sociedad se formó durante la Colonia?
        'La Colonia',
        'Guerra de Arauco y Vida Fronteriza',
        // Unidad 4: ¿Cómo podemos aportar a la comunidad?
        'Derechos y Deberes'
      ],
      descriptions: {
        'Zonas Naturales de Chile': {
          topic: 'Zonas Naturales de Chile',
          unit: 'Unidad 1 - ¿En qué consiste la diversidad del territorio chileno?',
          description: 'Caracterización del Norte Grande, Norte Chico, Zona Central, Zona Sur y Zona Austral (relieve, clima, biodiversidad).'
        },
        'Recursos Naturales': {
          topic: 'Recursos Naturales',
          unit: 'Unidad 1 - ¿En qué consiste la diversidad del territorio chileno?',
          description: 'Identificación de recursos renovables y no renovables; actividades económicas y desarrollo sustentable.'
        },
        'Riesgos Naturales': {
          topic: 'Riesgos Naturales',
          unit: 'Unidad 1 - ¿En qué consiste la diversidad del territorio chileno?',
          description: 'Desastres naturales en Chile (sismos, tsunamis, erupciones) y medidas de prevención y seguridad.'
        },
        'La Expansión Europea': {
          topic: 'La Expansión Europea',
          unit: 'Unidad 2 - ¿Qué impacto tuvo en América el proceso de expansión europea?',
          description: 'Contexto de los viajes de exploración (Colón, Magallanes) y el reparto del "Nuevo Mundo".'
        },
        'Conquista de América y Chile': {
          topic: 'Conquista de América y Chile',
          unit: 'Unidad 2 - ¿Qué impacto tuvo en América el proceso de expansión europea?',
          description: 'Caída de los imperios Azteca e Inca. Exploración y conquista de Chile (Almagro y Valdivia) y fundación de ciudades.'
        },
        'La Colonia': {
          topic: 'La Colonia',
          unit: 'Unidad 3 - ¿Qué tipo de sociedad se formó durante la Colonia?',
          description: 'Organización política y social (castas), rol de la Iglesia Católica y la economía colonial.'
        },
        'Guerra de Arauco y Vida Fronteriza': {
          topic: 'Guerra de Arauco y Vida Fronteriza',
          unit: 'Unidad 3 - ¿Qué tipo de sociedad se formó durante la Colonia?',
          description: 'Relación entre españoles y mapuches: conflicto, parlamentos, mestizaje y comercio.'
        },
        'Derechos y Deberes': {
          topic: 'Derechos y Deberes',
          unit: 'Unidad 4 - ¿Cómo podemos aportar a la comunidad?',
          description: 'Declaración Universal de Derechos Humanos, derechos del niño y actitudes cívicas para la convivencia democrática.'
        }
      }
    }
  },
  '6to basico': {
    'matematicas': {
      topics: [
        // Unidad 1: Nuestro planeta
        'Operaciones y Números Naturales',
        'Fracciones y Números Mixtos',
        'Números Decimales',
        'Razones y Porcentajes',
        // Unidad 2: La tecnología
        'Patrones y Álgebra',
        'Ecuaciones',
        // Unidad 3: El arte
        'Ángulos y Construcciones Geométricas',
        'Teselaciones',
        'Área y Volumen',
        // Unidad 4: La salud
        'Datos y Probabilidades'
      ],
      descriptions: {
        'Operaciones y Números Naturales': {
          topic: 'Operaciones y Números Naturales',
          unit: 'Unidad 1 - Nuestro planeta',
          description: 'Resolución de operaciones combinadas, cálculo de múltiplos, factores y divisores, e identificación de números primos y compuestos.'
        },
        'Fracciones y Números Mixtos': {
          topic: 'Fracciones y Números Mixtos',
          unit: 'Unidad 1 - Nuestro planeta',
          description: 'Representación de fracciones impropias y números mixtos en la recta numérica; resolución de adiciones y sustracciones con distinto denominador.'
        },
        'Números Decimales': {
          topic: 'Números Decimales',
          unit: 'Unidad 1 - Nuestro planeta',
          description: 'Resolución de multiplicaciones y divisiones con números decimales en contextos cotidianos.'
        },
        'Razones y Porcentajes': {
          topic: 'Razones y Porcentajes',
          unit: 'Unidad 1 - Nuestro planeta',
          description: 'Concepto de razón como comparación entre cantidades y cálculo de porcentajes como parte de un todo (ej. descuentos, IVA).'
        },
        'Patrones y Álgebra': {
          topic: 'Patrones y Álgebra',
          unit: 'Unidad 2 - La tecnología',
          description: 'Identificación de reglas en secuencias numéricas y uso del lenguaje algebraico para generalizar patrones.'
        },
        'Ecuaciones': {
          topic: 'Ecuaciones',
          unit: 'Unidad 2 - La tecnología',
          description: 'Representación y resolución de ecuaciones de primer grado utilizando balanzas y descomposición.'
        },
        'Ángulos y Construcciones Geométricas': {
          topic: 'Ángulos y Construcciones Geométricas',
          unit: 'Unidad 3 - El arte',
          description: 'Medición y construcción de ángulos con transportador; construcción de triángulos y propiedades de sus ángulos interiores y exteriores.'
        },
        'Teselaciones': {
          topic: 'Teselaciones',
          unit: 'Unidad 3 - El arte',
          description: 'Creación y análisis de patrones geométricos que cubren una superficie plana sin dejar huecos (teselados regulares y semirregulares).'
        },
        'Área y Volumen': {
          topic: 'Área y Volumen',
          unit: 'Unidad 3 - El arte',
          description: 'Cálculo del área de superficies de cubos y paralelepípedos (redes) y cálculo de su volumen.'
        },
        'Datos y Probabilidades': {
          topic: 'Datos y Probabilidades',
          unit: 'Unidad 4 - La salud',
          description: 'Interpretación de gráficos de barras dobles y circulares. Realización de experimentos aleatorios y análisis de tendencias.'
        }
      }
    },
    'lenguaje y comunicacion': {
      topics: [
        // Unidad 1: ¿Qué relación tiene el ser humano con la naturaleza?
        'Narrativa y Mundo Natural',
        'Mitos y Leyendas',
        // Unidad 2: ¿Qué te hace especial y diferente?
        'Poesía y Autobiografía',
        // Unidad 3: ¿Cuál es la aventura de tu vida?
        'Novelas y Motivaciones',
        'Comentario Literario',
        // Unidad 4: Y tú, ¿cómo quieres cambiar el mundo?
        'Texto Dramático y Opinión',
        'Textos Informativos'
      ],
      descriptions: {
        'Narrativa y Mundo Natural': {
          topic: 'Narrativa y Mundo Natural',
          unit: 'Unidad 1 - ¿Qué relación tiene el ser humano con la naturaleza?',
          description: 'Lectura de cuentos (ej. "El libro de la selva") para analizar el narrador, los personajes y el ambiente.'
        },
        'Mitos y Leyendas': {
          topic: 'Mitos y Leyendas',
          unit: 'Unidad 1 - ¿Qué relación tiene el ser humano con la naturaleza?',
          description: 'Lectura de relatos de origen para comprender la visión de mundo de diferentes culturas y escritura creativa de mitos.'
        },
        'Poesía y Autobiografía': {
          topic: 'Poesía y Autobiografía',
          unit: 'Unidad 2 - ¿Qué te hace especial y diferente?',
          description: 'Interpretación del lenguaje figurado en poemas (décimas) y análisis de textos autobiográficos para reconocer la voz del autor.'
        },
        'Novelas y Motivaciones': {
          topic: 'Novelas y Motivaciones',
          unit: 'Unidad 3 - ¿Cuál es la aventura de tu vida?',
          description: 'Lectura de novelas de aventuras; análisis de las motivaciones y actitudes de los personajes principales y secundarios.'
        },
        'Comentario Literario': {
          topic: 'Comentario Literario',
          unit: 'Unidad 3 - ¿Cuál es la aventura de tu vida?',
          description: 'Escritura de textos de opinión fundamentada sobre las lecturas realizadas (comentarios literarios).'
        },
        'Texto Dramático y Opinión': {
          topic: 'Texto Dramático y Opinión',
          unit: 'Unidad 4 - Y tú, ¿cómo quieres cambiar el mundo?',
          description: 'Lectura de obras dramáticas (teatro) reconociendo el conflicto y el diálogo. Análisis de textos de opinión y propaganda.'
        },
        'Textos Informativos': {
          topic: 'Textos Informativos',
          unit: 'Unidad 4 - Y tú, ¿cómo quieres cambiar el mundo?',
          description: 'Evaluación crítica de la información en reportajes y artículos; escritura de artículos informativos bien estructurados.'
        }
      }
    },
    'ciencias naturales': {
      topics: [
        // Unidad 1: Reproducción y salud
        'Reproducción y Pubertad',
        'Vida Saludable y Drogas',
        // Unidad 2: Interacciones en los ecosistemas
        'Fotosíntesis y Cadenas Tróficas',
        // Unidad 3: La materia y sus cambios
        'Materia y Cambios de Estado',
        // Unidad 4: La energía
        'Energía y Recursos',
        // Unidad 5: Las capas de la Tierra
        'Capas de la Tierra y Suelo'
      ],
      descriptions: {
        'Reproducción y Pubertad': {
          topic: 'Reproducción y Pubertad',
          unit: 'Unidad 1 - Reproducción y salud',
          description: 'Cambios físicos y hormonales en la pubertad (caracteres sexuales secundarios). Estructura y función de los sistemas reproductores masculino y femenino.'
        },
        'Vida Saludable y Drogas': {
          topic: 'Vida Saludable y Drogas',
          unit: 'Unidad 1 - Reproducción y salud',
          description: 'Importancia de la higiene y actividad física. Efectos nocivos del consumo de drogas (alcohol, tabaco, marihuana) en el organismo.'
        },
        'Fotosíntesis y Cadenas Tróficas': {
          topic: 'Fotosíntesis y Cadenas Tróficas',
          unit: 'Unidad 2 - Interacciones en los ecosistemas',
          description: 'Requerimientos de las plantas (agua, luz, CO2) para producir alimento. Flujo de energía en cadenas y tramas alimentarias (productores, consumidores, descomponedores).'
        },
        'Materia y Cambios de Estado': {
          topic: 'Materia y Cambios de Estado',
          unit: 'Unidad 3 - La materia y sus cambios',
          description: 'Modelo corpuscular para explicar los estados de la materia (sólido, líquido, gas) y sus cambios por efecto de la temperatura (calor).'
        },
        'Energía y Recursos': {
          topic: 'Energía y Recursos',
          unit: 'Unidad 4 - La energía',
          description: 'Diferentes formas de energía (cinética, potencial, térmica, lumínica) y sus transformaciones. Recursos energéticos renovables y no renovables en Chile.'
        },
        'Capas de la Tierra y Suelo': {
          topic: 'Capas de la Tierra y Suelo',
          unit: 'Unidad 5 - Las capas de la Tierra',
          description: 'Características de la atmósfera, hidrosfera y litosfera. Formación del suelo, tipos de suelo y la erosión provocada por agentes naturales y humanos.'
        }
      }
    },
    'historia, geografia y ciencias sociales': {
      topics: [
        // Unidad 1: Chile, un país democrático
        'Democracia y Constitución',
        'Derechos y Deberes',
        // Unidad 2: La construcción de la república en Chile
        'Independencia de Chile',
        'Organización de la República y Siglo XIX',
        'Expansión Territorial',
        // Unidad 3: Chile en el siglo XX
        'Chile en el Siglo XX',
        // Unidad 4: Geografía de Chile
        'Geografía Regional y Desastres'
      ],
      descriptions: {
        'Democracia y Constitución': {
          topic: 'Democracia y Constitución',
          unit: 'Unidad 1 - Chile, un país democrático',
          description: 'Concepto de república democrática, división de poderes del Estado y la importancia de la Constitución Política como ley fundamental.'
        },
        'Derechos y Deberes': {
          topic: 'Derechos y Deberes',
          unit: 'Unidad 1 - Chile, un país democrático',
          description: 'Relación entre los derechos de las personas (DD.HH.) y los deberes ciudadanos y del Estado para garantizarlos.'
        },
        'Independencia de Chile': {
          topic: 'Independencia de Chile',
          unit: 'Unidad 2 - La construcción de la república en Chile',
          description: 'Causas del proceso de Independencia, bandos en disputa (Realistas vs. Patriotas) y personajes destacados (hombres y mujeres).'
        },
        'Organización de la República y Siglo XIX': {
          topic: 'Organización de la República y Siglo XIX',
          unit: 'Unidad 2 - La construcción de la república en Chile',
          description: 'Ensayos constitucionales, gobiernos conservadores y liberales, expansión de la educación y secularización del Estado (leyes laicas).'
        },
        'Expansión Territorial': {
          topic: 'Expansión Territorial',
          unit: 'Unidad 2 - La construcción de la república en Chile',
          description: 'Cambios en el territorio chileno durante el siglo XIX: Guerra del Pacífico, Ocupación de la Araucanía, colonización del sur y anexión de Rapa Nui.'
        },
        'Chile en el Siglo XX': {
          topic: 'Chile en el Siglo XX',
          unit: 'Unidad 3 - Chile en el siglo XX',
          description: 'La riqueza del salitre, la "Cuestión Social", democratización de la sociedad (voto femenino), Golpe de Estado de 1973, Dictadura Militar y retorno a la democracia.'
        },
        'Geografía Regional y Desastres': {
          topic: 'Geografía Regional y Desastres',
          unit: 'Unidad 4 - Geografía de Chile',
          description: 'Características físicas, humanas y económicas de las regiones de Chile. Ambientes naturales y riesgos de desastres (terremotos, tsunamis).'
        }
      }
    }
  },
  '7mo basico': {
    'matematicas': {
      topics: [
        // Unidad 1: Números
        'Números Enteros (Z)',
        'Porcentajes y Potencias',
        // Unidad 2: Álgebra y funciones
        'Álgebra y Ecuaciones',
        'Proporcionalidad',
        // Unidad 3: Geometría
        'Geometría (Polígonos y Círculos)',
        'Plano Cartesiano y Vectores',
        // Unidad 4: Probabilidad y estadística
        'Estadística y Probabilidad'
      ],
      descriptions: {
        'Números Enteros (Z)': {
          topic: 'Números Enteros (Z)',
          unit: 'Unidad 1 - Números',
          description: 'Uso de números positivos y negativos para representar situaciones (temperatura, profundidad). Adición, sustracción y resolución de problemas en Z.'
        },
        'Porcentajes y Potencias': {
          topic: 'Porcentajes y Potencias',
          unit: 'Unidad 1 - Números',
          description: 'Cálculo de porcentajes en contextos reales. Uso de potencias de base 10 y notación científica para escribir números muy grandes o pequeños.'
        },
        'Álgebra y Ecuaciones': {
          topic: 'Álgebra y Ecuaciones',
          unit: 'Unidad 2 - Álgebra y funciones',
          description: 'Introducción al lenguaje algebraico (usar letras para números). Resolución de ecuaciones e inecuaciones de primer grado.'
        },
        'Proporcionalidad': {
          topic: 'Proporcionalidad',
          unit: 'Unidad 2 - Álgebra y funciones',
          description: 'Diferenciación entre proporcionalidad directa (si una sube, la otra sube) e inversa (si una sube, la otra baja) y sus gráficos.'
        },
        'Geometría (Polígonos y Círculos)': {
          topic: 'Geometría (Polígonos y Círculos)',
          unit: 'Unidad 3 - Geometría',
          description: 'Suma de ángulos interiores en polígonos. Cálculo del perímetro y área del círculo.'
        },
        'Plano Cartesiano y Vectores': {
          topic: 'Plano Cartesiano y Vectores',
          unit: 'Unidad 3 - Geometría',
          description: 'Ubicación de puntos en los cuatro cuadrantes del plano cartesiano y noción de vector como desplazamiento.'
        },
        'Estadística y Probabilidad': {
          topic: 'Estadística y Probabilidad',
          unit: 'Unidad 4 - Probabilidad y estadística',
          description: 'Construcción de tablas de frecuencia y gráficos. Medidas de tendencia central (media, moda, mediana). Cálculo de probabilidades (Regla de Laplace).'
        }
      }
    },
    'lenguaje y comunicacion': {
      topics: [
        // Unidad 1: ¿Qué necesitamos para lograr nuestros objetivos?
        'El Héroe y el Viaje',
        // Unidad 2: ¿En qué gestos encontrar la amistad?
        'La Amistad en la Literatura',
        'Textos Argumentativos (Opinión)',
        // Unidad 3: ¿Qué viaje nos ofrece una lectura?
        'Mitología y Cultura Popular',
        // Unidad 4: ¿Qué nos atrae del miedo?
        'Literatura de Terror y Miedo'
      ],
      descriptions: {
        'El Héroe y el Viaje': {
          topic: 'El Héroe y el Viaje',
          unit: 'Unidad 1 - ¿Qué necesitamos para lograr nuestros objetivos?',
          description: 'Lectura de mitos (ej. "Teseo") y relatos sobre héroes clásicos y contemporáneos. El conflicto narrativo y la motivación de los personajes.'
        },
        'La Amistad en la Literatura': {
          topic: 'La Amistad en la Literatura',
          unit: 'Unidad 2 - ¿En qué gestos encontrar la amistad?',
          description: 'Análisis de novelas y cuentos que tratan sobre vínculos afectivos. Diferenciación entre la voz del narrador y la de los personajes.'
        },
        'Textos Argumentativos (Opinión)': {
          topic: 'Textos Argumentativos (Opinión)',
          unit: 'Unidad 2 - ¿En qué gestos encontrar la amistad?',
          description: 'Lectura y escritura de columnas de opinión y cartas al director. Participación en debates para defender puntos de vista.'
        },
        'Mitología y Cultura Popular': {
          topic: 'Mitología y Cultura Popular',
          unit: 'Unidad 3 - ¿Qué viaje nos ofrece una lectura?',
          description: 'Visión de mundo en los mitos. Investigación sobre la "Lira Popular" y la poesía (décimas). Análisis de estereotipos en la publicidad.'
        },
        'Literatura de Terror y Miedo': {
          topic: 'Literatura de Terror y Miedo',
          unit: 'Unidad 4 - ¿Qué nos atrae del miedo?',
          description: 'Lectura de cuentos de terror ("El corazón delator") y análisis de los recursos para crear suspenso. Evaluación de noticias falsas (fake news) en internet.'
        }
      }
    },
    'ciencias naturales': {
      topics: [
        // Unidad 1: ¡Rodeados de materia en constante cambio!
        'La Materia y sus Cambios',
        'Los Gases y sus Leyes',
        // Unidad 2: ¡Que la fuerza te acompañe!
        'Fuerza y Presión',
        'Dinámica Terrestre',
        // Unidad 3: ¡Un mundo microscópico!
        'Microorganismos y Barreras Defensivas',
        // Unidad 4: ¡Creciendo responsablemente!
        'Sexualidad y Autocuidado'
      ],
      descriptions: {
        'La Materia y sus Cambios': {
          topic: 'La Materia y sus Cambios',
          unit: 'Unidad 1 - ¡Rodeados de materia en constante cambio!',
          description: 'Clasificación en sustancias puras y mezclas. Métodos de separación (filtración, decantación, tamizado, destilación).'
        },
        'Los Gases y sus Leyes': {
          topic: 'Los Gases y sus Leyes',
          unit: 'Unidad 1 - ¡Rodeados de materia en constante cambio!',
          description: 'Comportamiento de los gases y teoría cinético-molecular. Leyes de los gases ideales (Boyle, Charles, Gay-Lussac).'
        },
        'Fuerza y Presión': {
          topic: 'Fuerza y Presión',
          unit: 'Unidad 2 - ¡Que la fuerza te acompañe!',
          description: 'Efectos de las fuerzas (cambio de forma o movimiento). Tipos de fuerza: roce, gravitacional, elástica. Concepto de presión en sólidos, líquidos y gases.'
        },
        'Dinámica Terrestre': {
          topic: 'Dinámica Terrestre',
          unit: 'Unidad 2 - ¡Que la fuerza te acompañe!',
          description: 'Modelo de placas tectónicas para explicar sismos, tsunamis y erupciones volcánicas. El ciclo de las rocas.'
        },
        'Microorganismos y Barreras Defensivas': {
          topic: 'Microorganismos y Barreras Defensivas',
          unit: 'Unidad 3 - ¡Un mundo microscópico!',
          description: 'Tipos de microorganismos (bacterias, virus, hongos) y sus efectos en la salud. Sistema inmune y uso de vacunas.'
        },
        'Sexualidad y Autocuidado': {
          topic: 'Sexualidad y Autocuidado',
          unit: 'Unidad 4 - ¡Creciendo responsablemente!',
          description: 'Ciclo menstrual, fecundación y métodos de control de natalidad. Prevención de Infecciones de Transmisión Sexual (ITS).'
        }
      }
    },
    'historia, geografia y ciencias sociales': {
      topics: [
        // Unidad 1: Orígenes del ser humano
        'Evolución y Hominización',
        'Revolución del Neolítico',
        // Unidad 2: Civilizaciones clásicas
        'Civilizaciones Clásicas: Grecia',
        'Civilizaciones Clásicas: Roma',
        // Unidad 3: Civilización europea occidental
        'La Edad Media',
        // Unidad 4: Civilizaciones americanas
        'Civilizaciones de América'
      ],
      descriptions: {
        'Evolución y Hominización': {
          topic: 'Evolución y Hominización',
          unit: 'Unidad 1 - Orígenes del ser humano',
          description: 'Proceso de evolución biológica y cultural (Paleolítico). Dispersión del Homo sapiens por el planeta y teorías del poblamiento americano.'
        },
        'Revolución del Neolítico': {
          topic: 'Revolución del Neolítico',
          unit: 'Unidad 1 - Orígenes del ser humano',
          description: 'Descubrimiento de la agricultura y la ganadería. Paso del nomadismo al sedentarismo y surgimiento de las primeras ciudades y civilizaciones.'
        },
        'Civilizaciones Clásicas: Grecia': {
          topic: 'Civilizaciones Clásicas: Grecia',
          unit: 'Unidad 2 - Civilizaciones clásicas',
          description: 'El mar Mediterráneo como espacio de intercambio. La polis griega y el desarrollo de la Democracia en Atenas.'
        },
        'Civilizaciones Clásicas: Roma': {
          topic: 'Civilizaciones Clásicas: Roma',
          unit: 'Unidad 2 - Civilizaciones clásicas',
          description: 'La República y el Imperio Romano. La romanización, el derecho romano y la expansión del cristianismo.'
        },
        'La Edad Media': {
          topic: 'La Edad Media',
          unit: 'Unidad 3 - Civilización europea occidental',
          description: 'Conformación de Europa: fusión de tradiciones grecorromana, judeocristiana y germana. Feudalismo y rol de la Iglesia Católica.'
        },
        'Civilizaciones de América': {
          topic: 'Civilizaciones de América',
          unit: 'Unidad 4 - Civilizaciones americanas',
          description: 'Organización política, social y económica de Mayas, Aztecas e Incas. Su legado cultural y tecnológico.'
        }
      }
    }
  },
  '8vo basico': {
    'matematicas': {
      topics: [
        // Unidad 1: Números
        'Números Enteros (Z)',
        'Números Racionales (Q)',
        'Potencias y Raíces',
        'Variaciones Porcentuales',
        // Unidad 2: Álgebra y funciones
        'Álgebra y Ecuaciones',
        'Funciones',
        // Unidad 3: Geometría
        'Teorema de Pitágoras',
        'Transformaciones Isométricas',
        'Área y Volumen de Cuerpos Redondos',
        // Unidad 4: Probabilidad y estadística
        'Estadística Descriptiva',
        'Probabilidades'
      ],
      descriptions: {
        'Números Enteros (Z)': {
          topic: 'Números Enteros (Z)',
          unit: 'Unidad 1 - Números',
          description: 'Multiplicación y división de números positivos y negativos aplicando la regla de los signos.'
        },
        'Números Racionales (Q)': {
          topic: 'Números Racionales (Q)',
          unit: 'Unidad 1 - Números',
          description: 'Operatoria (adición, sustracción, multiplicación y división) combinando fracciones y decimales.'
        },
        'Potencias y Raíces': {
          topic: 'Potencias y Raíces',
          unit: 'Unidad 1 - Números',
          description: 'Propiedades de la multiplicación y división de potencias; cálculo de raíces cuadradas exactas e inexactas.'
        },
        'Variaciones Porcentuales': {
          topic: 'Variaciones Porcentuales',
          unit: 'Unidad 1 - Números',
          description: 'Resolución de problemas que involucren aumento o disminución de porcentajes (ej. IVA, índices económicos).'
        },
        'Álgebra y Ecuaciones': {
          topic: 'Álgebra y Ecuaciones',
          unit: 'Unidad 2 - Álgebra y funciones',
          description: 'Operatoria con expresiones algebraicas y resolución de ecuaciones e inecuaciones lineales.'
        },
        'Funciones': {
          topic: 'Funciones',
          unit: 'Unidad 2 - Álgebra y funciones',
          description: 'Concepto de función y distinción entre función lineal (y=mx) y función afín (y=mx+n).'
        },
        'Teorema de Pitágoras': {
          topic: 'Teorema de Pitágoras',
          unit: 'Unidad 3 - Geometría',
          description: 'Relación entre los catetos y la hipotenusa en triángulos rectángulos y su aplicación en problemas cotidianos.'
        },
        'Transformaciones Isométricas': {
          topic: 'Transformaciones Isométricas',
          unit: 'Unidad 3 - Geometría',
          description: 'Traslación, rotación y reflexión de figuras en el plano y en el espacio; composición de movimientos.'
        },
        'Área y Volumen de Cuerpos Redondos': {
          topic: 'Área y Volumen de Cuerpos Redondos',
          unit: 'Unidad 3 - Geometría',
          description: 'Cálculo de superficie y volumen en prismas y cilindros.'
        },
        'Estadística Descriptiva': {
          topic: 'Estadística Descriptiva',
          unit: 'Unidad 4 - Probabilidad y estadística',
          description: 'Medidas de posición (cuartiles y percentiles) y diagramas de cajón para analizar dispersión de datos.'
        },
        'Probabilidades': {
          topic: 'Probabilidades',
          unit: 'Unidad 4 - Probabilidad y estadística',
          description: 'Uso del principio multiplicativo y cálculo de probabilidades (Regla de Laplace).'
        }
      }
    },
    'lenguaje y comunicacion': {
      topics: [
        // Unidad 1: ¿Dónde empieza el amor?
        'El Amor en la Literatura',
        'La Entrevista',
        // Unidad 2: ¿Es todo como parece?
        'Misterio y Comedia',
        'Argumentación y Medios',
        // Unidad 3: ¿Qué queda del pasado?
        'La Épica y el Héroe',
        'Poesía y Naturaleza',
        // Unidad 4: ¿Hacia dónde va el futuro?
        'Ciencia Ficción y Distopía',
        'Discurso Público'
      ],
      descriptions: {
        'El Amor en la Literatura': {
          topic: 'El Amor en la Literatura',
          unit: 'Unidad 1 - ¿Dónde empieza el amor?',
          description: 'Lectura de obras clásicas (ej. "Tristán e Isolda") y contemporáneas; análisis del conflicto y los personajes.'
        },
        'La Entrevista': {
          topic: 'La Entrevista',
          unit: 'Unidad 1 - ¿Dónde empieza el amor?',
          description: 'Diferenciación entre hechos y opiniones en textos periodísticos dialogados.'
        },
        'Misterio y Comedia': {
          topic: 'Misterio y Comedia',
          unit: 'Unidad 2 - ¿Es todo como parece?',
          description: 'Lectura de relatos policiales y obras dramáticas (comedias) que presentan crítica social.'
        },
        'Argumentación y Medios': {
          topic: 'Argumentación y Medios',
          unit: 'Unidad 2 - ¿Es todo como parece?',
          description: 'Análisis de noticias falsas (fake news) y textos argumentativos; identificación de tesis y argumentos.'
        },
        'La Épica y el Héroe': {
          topic: 'La Épica y el Héroe',
          unit: 'Unidad 3 - ¿Qué queda del pasado?',
          description: 'Lectura de epopeyas (como La Odisea o La Ilíada) y reconocimiento de los valores del héroe clásico.'
        },
        'Poesía y Naturaleza': {
          topic: 'Poesía y Naturaleza',
          unit: 'Unidad 3 - ¿Qué queda del pasado?',
          description: 'Interpretación de poemas que abordan el paso del tiempo y la relación con la tierra.'
        },
        'Ciencia Ficción y Distopía': {
          topic: 'Ciencia Ficción y Distopía',
          unit: 'Unidad 4 - ¿Hacia dónde va el futuro?',
          description: 'Lectura de relatos futuristas que cuestionan el rol de la tecnología y la sociedad.'
        },
        'Discurso Público': {
          topic: 'Discurso Público',
          unit: 'Unidad 4 - ¿Hacia dónde va el futuro?',
          description: 'Análisis de situaciones de enunciación pública y recursos de persuasión en discursos sobre temas globales.'
        }
      }
    },
    'ciencias naturales': {
      topics: [
        // Unidad 1: Nutrición y salud
        'Nutrición y Sistemas del Cuerpo',
        'Salud y Alimentación',
        // Unidad 2: Célula: unidad de vida
        'La Célula',
        // Unidad 3: La energía en nuestro planeta
        'Electricidad y Circuitos',
        'Calor y Temperatura',
        // Unidad 4: La materia más allá de lo visible
        'Modelos Atómicos',
        'Tabla Periódica'
      ],
      descriptions: {
        'Nutrición y Sistemas del Cuerpo': {
          topic: 'Nutrición y Sistemas del Cuerpo',
          unit: 'Unidad 1 - Nutrición y salud',
          description: 'Integración de los sistemas digestivo, respiratorio, circulatorio y excretor para la nutrición celular.'
        },
        'Salud y Alimentación': {
          topic: 'Salud y Alimentación',
          unit: 'Unidad 1 - Nutrición y salud',
          description: 'Análisis de dietas equilibradas, etiquetado nutricional (sellos) y prevención del consumo de drogas.'
        },
        'La Célula': {
          topic: 'La Célula',
          unit: 'Unidad 2 - Célula: unidad de vida',
          description: 'Teoría celular. Diferencias entre células procariontes y eucariontes, y entre célula animal y vegetal. Organelos (mitocondria, cloroplasto, núcleo).'
        },
        'Electricidad y Circuitos': {
          topic: 'Electricidad y Circuitos',
          unit: 'Unidad 3 - La energía en nuestro planeta',
          description: 'Conceptos de corriente, voltaje y resistencia. Circuitos en serie y paralelo. Ley de Ohm básica.'
        },
        'Calor y Temperatura': {
          topic: 'Calor y Temperatura',
          unit: 'Unidad 3 - La energía en nuestro planeta',
          description: 'Diferencia entre calor (energía) y temperatura (medición). Formas de propagación del calor y equilibrio térmico.'
        },
        'Modelos Atómicos': {
          topic: 'Modelos Atómicos',
          unit: 'Unidad 4 - La materia más allá de lo visible',
          description: 'Evolución histórica del átomo (Dalton, Thomson, Rutherford, Bohr) y partículas subatómicas (protones, neutrones, electrones).'
        },
        'Tabla Periódica': {
          topic: 'Tabla Periódica',
          unit: 'Unidad 4 - La materia más allá de lo visible',
          description: 'Organización de los elementos químicos y propiedades periódicas.'
        }
      }
    },
    'historia, geografia y ciencias sociales': {
      topics: [
        // Unidad 1: La Edad Moderna
        'Edad Moderna y Humanismo',
        'Estado Moderno y Mercantilismo',
        // Unidad 2: Sociedad colonial
        'Sociedad Colonial',
        'Relación Hispano-Indígena',
        // Unidad 3: Ideas ilustradas y revoluciones
        'Ilustración y Revoluciones',
        'Independencia de Chile',
        // Unidad 4: La región en América y Chile
        'Regiones de Chile'
      ],
      descriptions: {
        'Edad Moderna y Humanismo': {
          topic: 'Edad Moderna y Humanismo',
          unit: 'Unidad 1 - La Edad Moderna',
          description: 'Cambio de mentalidad del Teocentrismo al Antropocentrismo. Renacimiento artístico, Revolución Científica y Reforma Religiosa.'
        },
        'Estado Moderno y Mercantilismo': {
          topic: 'Estado Moderno y Mercantilismo',
          unit: 'Unidad 1 - La Edad Moderna',
          description: 'Surgimiento de monarquías absolutas, centralización del poder y expansión comercial europea (viajes de exploración).'
        },
        'Sociedad Colonial': {
          topic: 'Sociedad Colonial',
          unit: 'Unidad 2 - Sociedad colonial',
          description: 'Organización social (sistema de castas), rol de la Iglesia, evangelización y vida cotidiana en la colonia.'
        },
        'Relación Hispano-Indígena': {
          topic: 'Relación Hispano-Indígena',
          unit: 'Unidad 2 - Sociedad colonial',
          description: 'Vida fronteriza, Guerra de Arauco (malones y malocas), parlamentos y mestizaje cultural y biológico.'
        },
        'Ilustración y Revoluciones': {
          topic: 'Ilustración y Revoluciones',
          unit: 'Unidad 3 - Ideas ilustradas y revoluciones',
          description: 'Pensamiento ilustrado (razón, libertad, igualdad) y su influencia en la Independencia de EE.UU. y la Revolución Francesa.'
        },
        'Independencia de Chile': {
          topic: 'Independencia de Chile',
          unit: 'Unidad 3 - Ideas ilustradas y revoluciones',
          description: 'Multicausalidad del proceso (externas e internas), etapas de la independencia y primeros desafíos republicanos.'
        },
        'Regiones de Chile': {
          topic: 'Regiones de Chile',
          unit: 'Unidad 4 - La región en América y Chile',
          description: 'Concepto de región (natural, cultural, económica). Diversidad productiva y desafíos de conectividad y desarrollo regional.'
        }
      }
    }
  },
  '1ro medio': {
    'matematicas': {
      topics: [
        // Unidad 1: Números
        'Números Racionales y Potencias',
        // Unidad 2: Álgebra y funciones
        'Productos Notables y Factorización',
        'Sistemas de Ecuaciones Lineales',
        // Unidad 3: Geometría
        'Homotecia y Semejanza',
        // Unidad 4: Probabilidad y estadística
        'Estadística y Probabilidad'
      ],
      descriptions: {
        'Números Racionales y Potencias': {
          topic: 'Números Racionales y Potencias',
          unit: 'Unidad 1 - Números',
          description: 'Operatoria con números racionales (fracciones y decimales), propiedades de las potencias y notación científica. Crecimiento y decrecimiento exponencial (ej. interés compuesto, bacterias).'
        },
        'Productos Notables y Factorización': {
          topic: 'Productos Notables y Factorización',
          unit: 'Unidad 2 - Álgebra y funciones',
          description: 'Reducción de expresiones algebraicas y uso de productos notables (cuadrado de binomio, suma por su diferencia). Factorización de expresiones algebraicas.'
        },
        'Sistemas de Ecuaciones Lineales': {
          topic: 'Sistemas de Ecuaciones Lineales',
          unit: 'Unidad 2 - Álgebra y funciones',
          description: 'Resolución de sistemas de ecuaciones de dos incógnitas mediante métodos gráficos y algebraicos (sustitución, igualación, reducción).'
        },
        'Homotecia y Semejanza': {
          topic: 'Homotecia y Semejanza',
          unit: 'Unidad 3 - Geometría',
          description: 'Concepto de homotecia (ampliación o reducción de figuras) y propiedades de la semejanza de triángulos (criterios LLL, LAL, AA). Teorema de Tales y sus aplicaciones.'
        },
        'Estadística y Probabilidad': {
          topic: 'Estadística y Probabilidad',
          unit: 'Unidad 4 - Probabilidad y estadística',
          description: 'Comparación de muestras poblacionales y análisis de gráficos. Reglas de probabilidad (aditiva y multiplicativa) y experimentos aleatorios (uso de diagrama de árbol y Paseos Aleatorios).'
        }
      }
    },
    'lenguaje y comunicacion': {
      topics: [
        // Unidad 1: Héroes y villanos
        'Héroes y Narrativa',
        // Unidad 2: Astucia y sabiduría
        'Argumentación y Sociedad',
        // Unidad 3: Lazos de familia
        'Teatro y Conflicto',
        // Unidad 4: La libertad
        'Poesía y Romanticismo',
        // Unidad 5: Literatura y contexto
        'Literatura y Contexto',
        // Unidad 6: Identidades colectivas
        'Identidad y Medios'
      ],
      descriptions: {
        'Héroes y Narrativa': {
          topic: 'Héroes y Narrativa',
          unit: 'Unidad 1 - Héroes y villanos',
          description: 'Lectura de novelas (ej. El lazarillo de Tormes) y cuentos. Análisis del narrador, las acciones y la evolución de los personajes. El relato policial y de detectives.'
        },
        'Argumentación y Sociedad': {
          topic: 'Argumentación y Sociedad',
          unit: 'Unidad 2 - Astucia y sabiduría',
          description: 'Análisis de textos argumentativos (columnas, ensayos) identificando tesis y argumentos. Evaluación de la veracidad y calidad de la información (Fake news vs. fuentes confiables).'
        },
        'Teatro y Conflicto': {
          topic: 'Teatro y Conflicto',
          unit: 'Unidad 3 - Lazos de familia',
          description: 'Lectura de obras dramáticas (tragedia y comedia). Análisis del conflicto dramático, personajes y puesta en escena (ej. Antígona, La Nona).'
        },
        'Poesía y Romanticismo': {
          topic: 'Poesía y Romanticismo',
          unit: 'Unidad 4 - La libertad',
          description: 'Interpretación de textos líricos, lenguaje figurado (metáforas, símbolos) y contexto del Romanticismo literario (libertad, sentimientos).'
        },
        'Literatura y Contexto': {
          topic: 'Literatura y Contexto',
          unit: 'Unidad 5 - Literatura y contexto',
          description: 'Relación entre las obras literarias y su contexto de producción (ej. Frankenstein y la ciencia del s. XIX). Intertextualidad.'
        },
        'Identidad y Medios': {
          topic: 'Identidad y Medios',
          unit: 'Unidad 6 - Identidades colectivas',
          description: 'Análisis de la propaganda y la publicidad. Reflexión sobre identidad personal y colectiva (latinoamericana, nacional).'
        }
      }
    },
    'biologia': {
      topics: [
        // Unidad 1: ¿Cómo ha evolucionado la vida en la Tierra?
        'Evolución y Biodiversidad',
        // Unidad 2: ¿Cómo interactúan los organismos?
        'Ecología: Interacciones',
        // Unidad 3: ¿Qué ocurre con la materia y la energía?
        'Materia y Energía en Ecosistemas'
      ],
      descriptions: {
        'Evolución y Biodiversidad': {
          topic: 'Evolución y Biodiversidad',
          unit: 'Unidad 1 - ¿Cómo ha evolucionado la vida en la Tierra?',
          description: 'Evidencias de la evolución (fósiles, anatomía comparada, ADN). Teoría de la Selección Natural de Darwin y Wallace. Clasificación de los seres vivos (Taxonomía) y filogenia humana.'
        },
        'Ecología: Interacciones': {
          topic: 'Ecología: Interacciones',
          unit: 'Unidad 2 - ¿Cómo interactúan los organismos?',
          description: 'Niveles de organización (población, comunidad, ecosistema). Interacciones biológicas (depredación, competencia, mutualismo). Dinámica de poblaciones (tamaño, densidad, crecimiento).'
        },
        'Materia y Energía en Ecosistemas': {
          topic: 'Materia y Energía en Ecosistemas',
          unit: 'Unidad 3 - ¿Qué ocurre con la materia y la energía?',
          description: 'Flujo de energía (cadenas y tramas tróficas). Ciclos biogeoquímicos (Carbono, Nitrógeno, Agua). Fotosíntesis y respiración celular como procesos complementarios. Impacto humano en los ecosistemas.'
        }
      }
    },
    'fisica': {
      topics: [
        // Unidad 1: Ondas y sonido
        'Ondas y Sonido',
        // Unidad 2: Ondas y luz
        'La Luz y Óptica',
        // Unidad 3: Ondas y sismos
        'Sismos y Tierra',
        // Unidad 4: Estructuras del universo
        'Universo'
      ],
      descriptions: {
        'Ondas y Sonido': {
          topic: 'Ondas y Sonido',
          unit: 'Unidad 1 - Ondas y sonido',
          description: 'Naturaleza de las ondas (frecuencia, periodo, longitud, amplitud). Clasificación (mecánicas/electromagnéticas). Fenómenos del sonido: reflexión (eco), difracción, efecto Doppler y contaminación acústica.'
        },
        'La Luz y Óptica': {
          topic: 'La Luz y Óptica',
          unit: 'Unidad 2 - Ondas y luz',
          description: 'Propagación de la luz, espectro electromagnético y colores. Formación de imágenes en espejos (planos, curvos) y lentes (convergentes, divergentes). El ojo humano y la visión.'
        },
        'Sismos y Tierra': {
          topic: 'Sismos y Tierra',
          unit: 'Unidad 3 - Ondas y sismos',
          description: 'Estructura interna de la Tierra (modelo estático y dinámico). Tectónica de placas. Origen y propagación de ondas sísmicas (P, S, L, R). Medición de sismos (magnitud e intensidad).'
        },
        'Universo': {
          topic: 'Universo',
          unit: 'Unidad 4 - Estructuras del universo',
          description: 'Origen y evolución del universo (Big Bang). Estructuras cósmicas (galaxias, estrellas, sistemas planetarios). Observación astronómica en Chile.'
        }
      }
    },
    'quimica': {
      topics: [
        // Unidad 1: Reacciones químicas cotidianas
        'Reacciones Químicas',
        // Unidad 2: Reacciones químicas y estequiometría
        'Estequiometría',
        // Unidad 3: Nomenclatura inorgánica
        'Nomenclatura Inorgánica'
      ],
      descriptions: {
        'Reacciones Químicas': {
          topic: 'Reacciones Químicas',
          unit: 'Unidad 1 - Reacciones químicas cotidianas',
          description: 'Diferencia entre cambios físicos y químicos. Evidencias de una reacción. Teoría de las colisiones y factores que afectan la velocidad de reacción. Ley de conservación de la materia.'
        },
        'Estequiometría': {
          topic: 'Estequiometría',
          unit: 'Unidad 2 - Reacciones químicas y estequiometría',
          description: 'Balance de ecuaciones químicas. Concepto de Mol y masa molar. Cálculos estequiométricos simples y reactivo limitante.'
        },
        'Nomenclatura Inorgánica': {
          topic: 'Nomenclatura Inorgánica',
          unit: 'Unidad 3 - Nomenclatura inorgánica',
          description: 'Formación y nomenclatura de compuestos binarios (óxidos, hidruros, sales) y ternarios (hidróxidos, ácidos). Uso de estados de oxidación y reglas IUPAC (Sistemática y Stock).'
        }
      }
    },
    'historia, geografia y ciencias sociales': {
      topics: [
        // Unidad 1: Economía y sociedad
        'Economía y Mercado',
        // Unidad 2: La construcción del Estado-nación
        'Estado-Nación y Sociedad Burguesa',
        // Unidad 3: El progreso indefinido
        'Progreso e Industrialización',
        // Unidad 4: Configuración del territorio
        'Territorio Chileno',
        // Unidad 5: El cambio de siglo en Chile y el mundo
        'El Cambio de Siglo'
      ],
      descriptions: {
        'Economía y Mercado': {
          topic: 'Economía y Mercado',
          unit: 'Unidad 1 - Economía y sociedad',
          description: 'El problema económico (escasez vs. necesidades ilimitadas). Funcionamiento del mercado (oferta, demanda, fijación de precios). Instrumentos financieros, ahorro y consumo responsable.'
        },
        'Estado-Nación y Sociedad Burguesa': {
          topic: 'Estado-Nación y Sociedad Burguesa',
          unit: 'Unidad 2 - La construcción del Estado-nación',
          description: 'Ideario liberal y republicano en Europa y América. Cultura burguesa. Conformación del Estado-nación en Chile: organización de la República y debate político del siglo XIX.'
        },
        'Progreso e Industrialización': {
          topic: 'Progreso e Industrialización',
          unit: 'Unidad 3 - El progreso indefinido',
          description: 'Revolución Industrial y sus impactos económicos y sociales. Imperialismo europeo del siglo XIX y la idea de progreso indefinido.'
        },
        'Territorio Chileno': {
          topic: 'Territorio Chileno',
          unit: 'Unidad 4 - Configuración del territorio',
          description: 'Expansión territorial de Chile en el siglo XIX: Guerra del Pacífico (causas y consecuencias). Ocupación de la Araucanía y colonización del sur. Relación con los pueblos originarios.'
        },
        'El Cambio de Siglo': {
          topic: 'El Cambio de Siglo',
          unit: 'Unidad 5 - El cambio de siglo en Chile y el mundo',
          description: 'La "Cuestión Social" en Chile y la crisis del parlamentarismo. La Primera Guerra Mundial y el nuevo orden geopolítico global.'
        }
      }
    }
  },
  '2do medio': {
    'matematicas': {
      topics: [
        // Unidad 1: Números
        'Números Reales (Raíces y Logaritmos)',
        // Unidad 2: Álgebra y funciones
        'Ecuación Cuadrática',
        'Función Cuadrática',
        'Función Inversa',
        // Unidad 3: Geometría
        'Trigonometría',
        // Unidad 4: Probabilidad y estadística
        'Probabilidad Condicionada'
      ],
      descriptions: {
        'Números Reales (Raíces y Logaritmos)': {
          topic: 'Números Reales (Raíces y Logaritmos)',
          unit: 'Unidad 1 - Números',
          description: 'Operatoria con raíces enésimas y definición de logaritmo. Relación entre potencias, raíces y logaritmos.'
        },
        'Ecuación Cuadrática': {
          topic: 'Ecuación Cuadrática',
          unit: 'Unidad 2 - Álgebra y funciones',
          description: 'Resolución de ecuaciones de segundo grado mediante factorización, completación de cuadrados y fórmula general.'
        },
        'Función Cuadrática': {
          topic: 'Función Cuadrática',
          unit: 'Unidad 2 - Álgebra y funciones',
          description: 'Análisis de la parábola (concavidad, vértice, eje de simetría) y modelamiento de situaciones de cambio cuadrático.'
        },
        'Función Inversa': {
          topic: 'Función Inversa',
          unit: 'Unidad 2 - Álgebra y funciones',
          description: 'Concepto de biyectividad y determinación de la función inversa en casos lineales y cuadráticos (con restricción de dominio).'
        },
        'Trigonometría': {
          topic: 'Trigonometría',
          unit: 'Unidad 3 - Geometría',
          description: 'Razones trigonométricas en triángulos rectángulos (seno, coseno, tangente) y resolución de problemas de altura y distancia.'
        },
        'Probabilidad Condicionada': {
          topic: 'Probabilidad Condicionada',
          unit: 'Unidad 4 - Probabilidad y estadística',
          description: 'Cálculo de probabilidades cuando un evento afecta la ocurrencia de otro. Uso de diagramas de árbol y tablas de contingencia.'
        }
      }
    },
    'lenguaje y comunicacion': {
      topics: [
        // Unidad 1: Sobre la ausencia: el exilio y la migración
        'Narrativa y Migración',
        // Unidad 2: Ciudadanía y trabajo
        'Medios Masivos y Ciudadanía',
        // Unidad 3: El poder y la ambición
        'Género Dramático y Poder',
        // Unidad 4: Lo femenino
        'Lírica y Perspectiva de Género',
        // Unidad 2/4
        'Investigación y Comunicación Oral'
      ],
      descriptions: {
        'Narrativa y Migración': {
          topic: 'Narrativa y Migración',
          unit: 'Unidad 1 - Sobre la ausencia: el exilio y la migración',
          description: 'Lectura de obras narrativas que abordan el desplazamiento humano. Análisis de anacronías (saltos temporales) y conflicto.'
        },
        'Medios Masivos y Ciudadanía': {
          topic: 'Medios Masivos y Ciudadanía',
          unit: 'Unidad 2 - Ciudadanía y trabajo',
          description: 'Análisis crítico de la prensa, la publicidad y la propaganda. Identificación de estereotipos de género y estrategias de persuasión.'
        },
        'Género Dramático y Poder': {
          topic: 'Género Dramático y Poder',
          unit: 'Unidad 3 - El poder y la ambición',
          description: 'Lectura de tragedias clásicas (como Macbeth) para analizar cómo el poder y la ambición movilizan a los personajes.'
        },
        'Lírica y Perspectiva de Género': {
          topic: 'Lírica y Perspectiva de Género',
          unit: 'Unidad 4 - Lo femenino',
          description: 'Interpretación de poemas escritos por mujeres o sobre mujeres. Análisis de símbolos y visión de mundo en la poesía.'
        },
        'Investigación y Comunicación Oral': {
          topic: 'Investigación y Comunicación Oral',
          unit: 'Unidad 2 / Unidad 4',
          description: 'Técnicas de discusión (panel, debate) y elaboración de investigaciones literarias con uso de normas de citación.'
        }
      }
    },
    'biologia': {
      topics: [
        // Unidad 1: ¿Cómo se coordinan y regulan nuestros cuerpos?
        'Coordinación y Regulación (Sistema Nervioso)',
        'Sistema Endocrino',
        // Unidad 2: Sexualidad y reproducción
        'Sexualidad y Reproducción',
        // Unidad 3: ¿Cómo se hereda el material genético?
        'Genética y Herencia'
      ],
      descriptions: {
        'Coordinación y Regulación (Sistema Nervioso)': {
          topic: 'Coordinación y Regulación (Sistema Nervioso)',
          unit: 'Unidad 1 - ¿Cómo se coordinan y regulan nuestros cuerpos?',
          description: 'Estructura de la neurona, sinapsis y transmisión del impulso nervioso. Efecto de drogas en el cerebro.'
        },
        'Sistema Endocrino': {
          topic: 'Sistema Endocrino',
          unit: 'Unidad 1 - ¿Cómo se coordinan y regulan nuestros cuerpos?',
          description: 'Acción de las hormonas, control de la glicemia (insulina/glucagón) y respuesta al estrés.'
        },
        'Sexualidad y Reproducción': {
          topic: 'Sexualidad y Reproducción',
          unit: 'Unidad 2 - Sexualidad y reproducción',
          description: 'Hormonas sexuales, ciclo ovárico y uterino. Fecundación, desarrollo embrionario y parto. Métodos de control de natalidad.'
        },
        'Genética y Herencia': {
          topic: 'Genética y Herencia',
          unit: 'Unidad 3 - ¿Cómo se hereda el material genético?',
          description: 'Ciclo celular (Mitosis y Meiosis). Leyes de Mendel, genotipo, fenotipo y manipulación genética.'
        }
      }
    },
    'fisica': {
      topics: [
        // Unidad 1: El movimiento
        'Movimiento Rectilíneo',
        // Unidad 2: Las fuerzas
        'Fuerza y Leyes de Newton',
        // Unidad 3: Energía mecánica
        'Trabajo y Energía Mecánica',
        // Unidad 4: El universo
        'El Universo y el Big Bang'
      ],
      descriptions: {
        'Movimiento Rectilíneo': {
          topic: 'Movimiento Rectilíneo',
          unit: 'Unidad 1 - El movimiento',
          description: 'Descripción del movimiento: posición, desplazamiento, velocidad y aceleración. Gráficos de MRU y MRUA.'
        },
        'Fuerza y Leyes de Newton': {
          topic: 'Fuerza y Leyes de Newton',
          unit: 'Unidad 2 - Las fuerzas',
          description: 'Principios de inercia, masa y acción-reacción. Diagramas de cuerpo libre y fuerza de roce.'
        },
        'Trabajo y Energía Mecánica': {
          topic: 'Trabajo y Energía Mecánica',
          unit: 'Unidad 3 - Energía mecánica',
          description: 'Concepto de trabajo mecánico y potencia. Conservación de la energía mecánica (cinética y potencial gravitatoria/elástica).'
        },
        'El Universo y el Big Bang': {
          topic: 'El Universo y el Big Bang',
          unit: 'Unidad 4 - El universo',
          description: 'Teorías sobre el origen del universo (Big Bang), expansión cósmica y formación de estructuras (galaxias, estrellas).'
        }
      }
    },
    'quimica': {
      topics: [
        // Unidad 1: Disoluciones químicas
        'Disoluciones Químicas',
        // Unidad 2: Propiedades coligativas
        'Propiedades Coligativas',
        // Unidad 3: Química orgánica
        'Química Orgánica (El Carbono)',
        'Isomería y Polímeros'
      ],
      descriptions: {
        'Disoluciones Químicas': {
          topic: 'Disoluciones Químicas',
          unit: 'Unidad 1 - Disoluciones químicas',
          description: 'Componentes (soluto/solvente), solubilidad y factores que la afectan. Unidades de concentración físicas (%m/m) y químicas (Molaridad).'
        },
        'Propiedades Coligativas': {
          topic: 'Propiedades Coligativas',
          unit: 'Unidad 2 - Propiedades coligativas',
          description: 'Cambios en las propiedades del solvente al agregar soluto: descenso de la presión de vapor, aumento de ebullición, descenso crioscópico y ósmosis.'
        },
        'Química Orgánica (El Carbono)': {
          topic: 'Química Orgánica (El Carbono)',
          unit: 'Unidad 3 - Química orgánica',
          description: 'Propiedades del átomo de carbono. Hidrocarburos (alcanos, alquenos, alquinos) y grupos funcionales (alcoholes, ácidos, etc.).'
        },
        'Isomería y Polímeros': {
          topic: 'Isomería y Polímeros',
          unit: 'Unidad 3 - Química orgánica',
          description: 'Compuestos con misma fórmula molecular pero distinta estructura. Polímeros naturales y sintéticos.'
        }
      }
    },
    'historia, geografia y ciencias sociales': {
      topics: [
        // Unidad 1: Crisis, totalitarismo y guerra
        'Crisis del Parlamentarismo y Anarquía',
        'Totalitarismos y Segunda Guerra Mundial',
        // Unidad 2: Un mundo bipolar
        'La Guerra Fría',
        // Unidad 3: Chile a mediados del siglo XX
        'Chile a mediados del Siglo XX',
        // Unidad 4: Reformas estructurales y quiebre de la democracia
        'Reformas Estructurales y Quiebre Democrático'
      ],
      descriptions: {
        'Crisis del Parlamentarismo y Anarquía': {
          topic: 'Crisis del Parlamentarismo y Anarquía',
          unit: 'Unidad 1 - Crisis, totalitarismo y guerra',
          description: 'Fin del ciclo salitrero en Chile, Constitución de 1925 y la irrupción de la clase media y el movimiento obrero.'
        },
        'Totalitarismos y Segunda Guerra Mundial': {
          topic: 'Totalitarismos y Segunda Guerra Mundial',
          unit: 'Unidad 1 - Crisis, totalitarismo y guerra',
          description: 'Surgimiento del fascismo y nazismo. Desarrollo y consecuencias de la II Guerra Mundial y el Holocausto.'
        },
        'La Guerra Fría': {
          topic: 'La Guerra Fría',
          unit: 'Unidad 2 - Un mundo bipolar',
          description: 'Enfrentamiento ideológico EE.UU.-URSS. Revolución Cubana y su influencia en América Latina.'
        },
        'Chile a mediados del Siglo XX': {
          topic: 'Chile a mediados del Siglo XX',
          unit: 'Unidad 3 - Chile a mediados del siglo XX',
          description: 'Modelo ISI (Industrialización), expansión del sufragio (voto femenino) y el Estado de Bienestar en Chile.'
        },
        'Reformas Estructurales y Quiebre Democrático': {
          topic: 'Reformas Estructurales y Quiebre Democrático',
          unit: 'Unidad 4 - Reformas estructurales y quiebre de la democracia',
          description: 'Reforma Agraria y la "Vía Chilena al Socialismo". Polarización política, Golpe de Estado de 1973, Dictadura Militar y recuperación de la democracia.'
        }
      }
    }
  },
  '3ro medio': {
    'matematicas': {
      topics: [
        // Unidad 1: La toma de decisiones en situaciones de incerteza
        'Estadística y Probabilidades',
        // Unidad 2: Modelamiento matemático para describir y predecir
        'Álgebra y Funciones (Modelamiento)',
        // Unidad 3: Relaciones métricas en la circunferencia
        'Geometría (Circunferencia)',
        // Unidad 4: Los números complejos
        'Números (Complejos)'
      ],
      descriptions: {
        'Estadística y Probabilidades': {
          topic: 'Estadística y Probabilidades',
          unit: 'Unidad 1 - La toma de decisiones en situaciones de incerteza',
          description: 'Medidas de dispersión: Rango, varianza y desviación estándar para comparar conjuntos de datos y tomar decisiones. Probabilidades: Uso de la probabilidad condicionada y probabilidad total para analizar situaciones de incertidumbre.'
        },
        'Álgebra y Funciones (Modelamiento)': {
          topic: 'Álgebra y Funciones (Modelamiento)',
          unit: 'Unidad 2 - Modelamiento matemático para describir y predecir',
          description: 'Función Exponencial: Análisis del crecimiento y decrecimiento exponencial en fenómenos reales (población, interés compuesto). Función Logarítmica: Relación con la función exponencial, propiedades y su uso en escalas (pH, Richter).'
        },
        'Geometría (Circunferencia)': {
          topic: 'Geometría (Circunferencia)',
          unit: 'Unidad 3 - Relaciones métricas en la circunferencia',
          description: 'Ángulos: Relación entre ángulos del centro e inscritos; ángulos interiores y exteriores. Segmentos: Propiedades métricas de las cuerdas, secantes y tangentes (Teoremas de las cuerdas y las secantes).'
        },
        'Números (Complejos)': {
          topic: 'Números (Complejos)',
          unit: 'Unidad 4 - Los números complejos',
          description: 'El Conjunto ℂ: Definición de unidad imaginaria i, representación binomial y par ordenado, módulo y conjugado. Operatoria: Adición, sustracción, multiplicación y división de números complejos.'
        }
      }
    },
    'lenguaje y comunicacion': {
      topics: [
        // Unidad 1: Desafíos y oportunidades
        'Lectura e Interpretación (Sociedad)',
        // Unidad 2: Identidad personal
        'Identidad y Cultura',
        // Unidad 3: Hechos y emociones
        'Emociones y Realidad',
        // Unidad 4: Identidad y transformaciones
        'Identidad y Sociedad'
      ],
      descriptions: {
        'Lectura e Interpretación (Sociedad)': {
          topic: 'Lectura e Interpretación (Sociedad)',
          unit: 'Unidad 1 - Desafíos y oportunidades',
          description: 'El hogar: Interpretación de obras que simbolizan el espacio habitado (ej. Casa tomada de Cortázar) y la convivencia. Problemáticas sociales: Lectura crítica sobre la empatía, la marginación y la solidaridad en la sociedad actual.'
        },
        'Identidad y Cultura': {
          topic: 'Identidad y Cultura',
          unit: 'Unidad 2 - Identidad personal',
          description: 'Transformaciones: Análisis de cambios personales a través de obras como La metamorfosis de Kafka. Cultura y Medios: Influencia de los fenómenos culturales masivos (memes, novelas gráficas) en la construcción de la identidad.'
        },
        'Emociones y Realidad': {
          topic: 'Emociones y Realidad',
          unit: 'Unidad 3 - Hechos y emociones',
          description: 'Expresión lírica: Análisis de cómo la poesía comunica sentimientos y visiones de mundo (Gabriela Mistral). Estereotipos: Lectura crítica de textos que rompen prejuicios de género y roles sociales (ej. mujeres en la ciencia).'
        },
        'Identidad y Sociedad': {
          topic: 'Identidad y Sociedad',
          unit: 'Unidad 4 - Identidad y transformaciones',
          description: 'Orígenes: Reflexión sobre la identidad cultural, pueblos originarios y mestizaje (Recado confidencial a los chilenos). Consumo: Análisis crítico de la sociedad de consumo y cómo esta influye en quiénes somos.'
        }
      }
    },
    'ciencias para la ciudadania': {
      topics: [
        // Módulo: Bienestar y Salud
        'Salud y Enfermedad',
        'Prevención de Infecciones',
        // Módulo: Seguridad, Prevención y Autocuidado
        'Riesgos Socionaturales',
        'Riesgos en el Entorno',
        // Módulo: Ambiente y Sostenibilidad
        'Cambio Climático',
        'Consumo Sostenible',
        // Módulo: Tecnología y Sociedad
        'Innovación Tecnológica',
        'Proyectos Tecnológicos'
      ],
      descriptions: {
        'Salud y Enfermedad': {
          topic: 'Salud y Enfermedad',
          unit: 'Módulo: Bienestar y Salud',
          description: 'Factores biopsicosociales que influyen en la salud. Medicina convencional, tradicional y complementaria.'
        },
        'Prevención de Infecciones': {
          topic: 'Prevención de Infecciones',
          unit: 'Módulo: Bienestar y Salud',
          description: 'Funcionamiento de patógenos (virus, bacterias), sistema inmune, vacunas y prevención de ITS.'
        },
        'Riesgos Socionaturales': {
          topic: 'Riesgos Socionaturales',
          unit: 'Módulo: Seguridad, Prevención y Autocuidado',
          description: 'Prevención y reacción ante sismos, tsunamis, erupciones volcánicas e incendios forestales.'
        },
        'Riesgos en el Entorno': {
          topic: 'Riesgos en el Entorno',
          unit: 'Módulo: Seguridad, Prevención y Autocuidado',
          description: 'Manejo seguro de sustancias químicas en el hogar y prevención de accidentes cotidianos.'
        },
        'Cambio Climático': {
          topic: 'Cambio Climático',
          unit: 'Módulo: Ambiente y Sostenibilidad',
          description: 'Evidencias, efectos locales y globales, y huella de carbono.'
        },
        'Consumo Sostenible': {
          topic: 'Consumo Sostenible',
          unit: 'Módulo: Ambiente y Sostenibilidad',
          description: 'Estrategias para reducir el impacto ambiental, gestión de residuos y eficiencia energética.'
        },
        'Innovación Tecnológica': {
          topic: 'Innovación Tecnológica',
          unit: 'Módulo: Tecnología y Sociedad',
          description: 'Impacto de la robótica, inteligencia artificial y biotecnología en la vida diaria.'
        },
        'Proyectos Tecnológicos': {
          topic: 'Proyectos Tecnológicos',
          unit: 'Módulo: Tecnología y Sociedad',
          description: 'Diseño y aplicación de soluciones tecnológicas para problemas locales.'
        }
      }
    }
  },
  '4to medio': {
    'matematicas': {
      topics: [
        // Unidad 1: La toma de decisiones en situaciones financieras y económicas
        'Decisiones Financieras',
        // Unidad 2: Modelamiento matemático (Funciones)
        'Funciones Trigonométricas y Modelamiento',
        // Unidad 3: La toma de decisiones en situaciones de incerteza
        'Probabilidades y Distribuciones',
        // Unidad 4: Geometría con coordenadas
        'Geometría Analítica'
      ],
      descriptions: {
        'Decisiones Financieras': {
          topic: 'Decisiones Financieras',
          unit: 'Unidad 1 - La toma de decisiones en situaciones financieras y económicas',
          description: 'Uso de porcentajes para analizar ofertas, créditos, tasas de interés y el costo real de endeudamiento (CAE).'
        },
        'Funciones Trigonométricas y Modelamiento': {
          topic: 'Funciones Trigonométricas y Modelamiento',
          unit: 'Unidad 2 - Modelamiento matemático (Funciones)',
          description: 'Análisis y gráfico de la función seno (f(x) = a·sen(bx + c)) para modelar fenómenos periódicos (como las horas de luz o el sonido).'
        },
        'Probabilidades y Distribuciones': {
          topic: 'Probabilidades y Distribuciones',
          unit: 'Unidad 3 - La toma de decisiones en situaciones de incerteza',
          description: 'Estudio de la variable aleatoria, Distribución Binomial (éxito/fracaso) y Distribución Normal para predecir comportamientos de datos.'
        },
        'Geometría Analítica': {
          topic: 'Geometría Analítica',
          unit: 'Unidad 4 - Geometría con coordenadas',
          description: 'Ecuación de la recta en el espacio (3D), ecuación del plano y posiciones relativas de rectas y planos (ej. cobertura de antenas).'
        }
      }
    },
    'lenguaje y comunicacion': {
      topics: [
        // Unidad 1: Decisiones humanas: ¿pasionales o racionales?
        'Razón y Pasión',
        // Unidad 2: Individuos y estructuras
        'Individuo y Sociedad',
        // Unidad 3: Desplazamientos y migraciones
        'Migración e Identidad'
      ],
      descriptions: {
        'Razón y Pasión': {
          topic: 'Razón y Pasión',
          unit: 'Unidad 1 - Decisiones humanas: ¿pasionales o racionales?',
          description: 'Lectura de obras que plantean dilemas éticos y psicológicos (ej. Crimen y Castigo, La señora Dalloway).'
        },
        'Individuo y Sociedad': {
          topic: 'Individuo y Sociedad',
          unit: 'Unidad 2 - Individuos y estructuras',
          description: 'Análisis de textos que cuestionan el control social y el totalitarismo (ej. 1984 de Orwell, El cepillo de dientes).'
        },
        'Migración e Identidad': {
          topic: 'Migración e Identidad',
          unit: 'Unidad 3 - Desplazamientos y migraciones',
          description: 'Reflexión sobre la experiencia de migrar y el choque cultural a través de novelas contemporáneas (ej. Americanah, La nieta del señor Linh).'
        }
      }
    },
    'educacion ciudadana': {
      topics: [
        // Unidad 1: ¿Por qué es importante participar para resolver problemas sociales?
        'Participación Activa',
        // Unidad 2: ¿Cómo se relacionan los medios de comunicación con la democracia?
        'Medios de Comunicación',
        // Unidad 3: ¿Cómo construir una democracia más inclusiva?
        'Inclusión y Democracia',
        // Unidad 4: Derechos laborales y modelos de desarrollo
        'Trabajo y Desarrollo'
      ],
      descriptions: {
        'Participación Activa': {
          topic: 'Participación Activa',
          unit: 'Unidad 1 - ¿Por qué es importante participar para resolver problemas sociales?',
          description: 'Formas de participación más allá del voto (organizaciones, movimientos) y brechas que dificultan la participación (género, desigualdad).'
        },
        'Medios de Comunicación': {
          topic: 'Medios de Comunicación',
          unit: 'Unidad 2 - ¿Cómo se relacionan los medios de comunicación con la democracia?',
          description: 'Rol de la prensa, riesgos de la desinformación (fake news), uso de redes sociales y TIC en la democracia.'
        },
        'Inclusión y Democracia': {
          topic: 'Inclusión y Democracia',
          unit: 'Unidad 3 - ¿Cómo construir una democracia más inclusiva?',
          description: 'Principios de igualdad y no discriminación; desafíos para integrar a grupos excluidos y diversidad en el territorio.'
        },
        'Trabajo y Desarrollo': {
          topic: 'Trabajo y Desarrollo',
          unit: 'Unidad 4 - Derechos laborales y modelos de desarrollo',
          description: 'Legislación laboral en Chile (contratos, derechos), sindicatos y el impacto de los modelos económicos en el medioambiente (cambio climático).'
        }
      }
    },
    'filosofia': {
      topics: [
        // Unidad 1 y 2: Temática General
        'Ética y Política',
        // Unidad 3: Temática General
        'Estética',
        // Unidad 4: El impacto de la filosofía en la sociedad
        'Filosofía y Sociedad Actual'
      ],
      descriptions: {
        'Ética y Política': {
          topic: 'Ética y Política',
          unit: 'Unidad 1 y 2 - Temática General',
          description: 'Reflexión sobre el fundamento de la moral (¿por qué actuar bien?), la libertad, la justicia y el poder político en la sociedad.'
        },
        'Estética': {
          topic: 'Estética',
          unit: 'Unidad 3 - Temática General',
          description: 'Análisis filosófico sobre la belleza, el arte y la experiencia estética en la vida cotidiana.'
        },
        'Filosofía y Sociedad Actual': {
          topic: 'Filosofía y Sociedad Actual',
          unit: 'Unidad 4 - El impacto de la filosofía en la sociedad',
          description: 'Influencia del pensamiento filosófico en la ciencia, la tecnología, la perspectiva de género y la comprensión del mundo actual.'
        }
      }
    },
    'ciencias para la ciudadania': {
      topics: [
        // Módulo: Bienestar y Salud
        'Bienestar y Salud',
        // Módulo: Seguridad, Prevención y Autocuidado
        'Seguridad y Autocuidado',
        // Módulo: Ambiente y Sostenibilidad
        'Ambiente y Sostenibilidad',
        // Módulo: Tecnología y Sociedad
        'Tecnología y Sociedad'
      ],
      descriptions: {
        'Bienestar y Salud': {
          topic: 'Bienestar y Salud',
          unit: 'Módulo: Bienestar y Salud',
          description: 'Factores que influyen en la salud humana, medicina integrativa y prevención de infecciones.'
        },
        'Seguridad y Autocuidado': {
          topic: 'Seguridad y Autocuidado',
          unit: 'Módulo: Seguridad, Prevención y Autocuidado',
          description: 'Riesgos naturales (sismos) y antrópicos; manejo de sustancias peligrosas en el hogar y seguridad laboral.'
        },
        'Ambiente y Sostenibilidad': {
          topic: 'Ambiente y Sostenibilidad',
          unit: 'Módulo: Ambiente y Sostenibilidad',
          description: 'Cambio climático, huella de carbono y estrategias de consumo responsable y sostenible.'
        },
        'Tecnología y Sociedad': {
          topic: 'Tecnología y Sociedad',
          unit: 'Módulo: Tecnología y Sociedad',
          description: 'Innovación tecnológica (robótica, biotecnología), sus beneficios y dilemas éticos; diseño de proyectos tecnológicos locales.'
        }
      }
    }
  }
};

// Función auxiliar para normalizar nombres
function normalize(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Función auxiliar para normalizar nombre de curso
function normalizeCourseName(course: string): string {
  const normalized = normalize(course);
  
  // Detectar si es enseñanza media
  const isMedio = normalized.includes('medio');
  
  if (isMedio) {
    if (normalized.includes('4to') || normalized.includes('4°') || normalized.includes('cuarto')) return '4to medio';
    if (normalized.includes('3ro') || normalized.includes('3°') || normalized.includes('tercero')) return '3ro medio';
    if (normalized.includes('2do') || normalized.includes('2°') || normalized.includes('segundo')) return '2do medio';
    if (normalized.includes('1ro') || normalized.includes('1°') || normalized.includes('primero')) return '1ro medio';
  }
  
  // Enseñanza básica
  if (normalized.includes('8vo') || normalized.includes('8°') || normalized.includes('octavo')) return '8vo basico';
  if (normalized.includes('7mo') || normalized.includes('7°') || normalized.includes('septimo')) return '7mo basico';
  if (normalized.includes('6to') || normalized.includes('6°') || normalized.includes('sexto')) return '6to basico';
  if (normalized.includes('5to') || normalized.includes('5°') || normalized.includes('quinto')) return '5to basico';
  if (normalized.includes('4to') || normalized.includes('4°') || normalized.includes('cuarto')) return '4to basico';
  if (normalized.includes('3ro') || normalized.includes('3°') || normalized.includes('tercero')) return '3ro basico';
  if (normalized.includes('2do') || normalized.includes('2°') || normalized.includes('segundo')) return '2do basico';
  if (normalized.includes('1ro') || normalized.includes('1°') || normalized.includes('primero')) return '1ro basico';
  
  return normalized;
}

// Función auxiliar para normalizar nombre de asignatura
function normalizeSubjectName(subject: string): string {
  const normalized = normalize(subject);
  
  if (normalized.includes('matematica')) return 'matematicas';
  if (normalized.includes('lenguaje') || normalized.includes('comunicacion') || normalized.includes('literatura')) return 'lenguaje y comunicacion';
  if (normalized.includes('ciencia') && normalized.includes('natural')) return 'ciencias naturales';
  if (normalized.includes('ciencia') && normalized.includes('ciudadania')) return 'ciencias para la ciudadania';
  if (normalized.includes('educacion') && normalized.includes('ciudadana')) return 'educacion ciudadana';
  if (normalized.includes('filosofia')) return 'filosofia';
  if (normalized.includes('historia') || normalized.includes('geografia') || normalized.includes('social')) return 'historia, geografia y ciencias sociales';
  if (normalized.includes('biologia')) return 'biologia';
  if (normalized.includes('fisica')) return 'fisica';
  if (normalized.includes('quimica')) return 'quimica';
  
  return normalized;
}

/**
 * Obtiene los temas con descripciones para un curso y asignatura específicos
 */
export function getTopicsWithDescriptions(courseName: string, subjectName: string): SubjectTopicsWithDescriptions | null {
  const normalizedCourse = normalizeCourseName(courseName);
  const normalizedSubject = normalizeSubjectName(subjectName);
  
  const courseData = topicDescriptionsByGrade[normalizedCourse];
  if (!courseData) return null;
  
  const subjectData = courseData[normalizedSubject];
  if (!subjectData) return null;
  
  return subjectData;
}

/**
 * Obtiene la descripción de un tema específico
 */
export function getTopicDescription(courseName: string, subjectName: string, topicName: string): TopicDescription | null {
  const subjectData = getTopicsWithDescriptions(courseName, subjectName);
  if (!subjectData) return null;
  
  return subjectData.descriptions[topicName] || null;
}

/**
 * Formatea la descripción de un tema para mostrar en la UI
 */
export function formatTopicDescription(description: TopicDescription): string {
  let formatted = `**${description.topic}**\n`;
  formatted += `📚 ${description.unit}\n\n`;
  formatted += `${description.description}`;
  
  return formatted;
}

/**
 * Interfaz para el contexto de generación de contenido
 */
export interface ContentGenerationContext {
  courseName: string;
  courseLevel: 'basico_inicial' | 'basico_intermedio' | 'basico_avanzado' | 'media';
  approximateAge: number;
  complexityLevel: 'muy_simple' | 'simple' | 'intermedio' | 'avanzado' | 'tecnico';
  languageStyle: string;
  examplesStyle: string;
  contentGuidelines: string;
}

/**
 * Determina el contexto de generación de contenido según el curso
 * Adapta la complejidad, lenguaje y ejemplos según la edad del estudiante
 */
export function getContentGenerationContext(courseName: string): ContentGenerationContext {
  const normalized = normalizeCourseName(courseName);
  
  // 1ro - 2do Básico (6-7 años)
  if (normalized === '1ro basico' || normalized === '2do basico') {
    return {
      courseName: normalized,
      courseLevel: 'basico_inicial',
      approximateAge: normalized === '1ro basico' ? 6 : 7,
      complexityLevel: 'muy_simple',
      languageStyle: 'Usa oraciones cortas y simples. Vocabulario muy básico, cotidiano y familiar para niños pequeños. Evita tecnicismos.',
      examplesStyle: 'Ejemplos con juguetes, mascotas, familia, colores, frutas, números pequeños y situaciones del hogar o escuela.',
      contentGuidelines: 'Contenido muy visual y concreto. Usa analogías con cosas que los niños conocen. Incluye elementos lúdicos y divertidos. Máximo 3-4 conceptos por sección.'
    };
  }
  
  // 3ro - 4to Básico (8-9 años)
  if (normalized === '3ro basico' || normalized === '4to basico') {
    return {
      courseName: normalized,
      courseLevel: 'basico_intermedio',
      approximateAge: normalized === '3ro basico' ? 8 : 9,
      complexityLevel: 'simple',
      languageStyle: 'Oraciones simples pero pueden ser más largas. Introduce algunos términos nuevos explicándolos siempre.',
      examplesStyle: 'Ejemplos con situaciones escolares, deportes, naturaleza, animales, y vida cotidiana. Puede incluir números más grandes.',
      contentGuidelines: 'Contenido accesible pero más estructurado. Introduce conceptos gradualmente. Usa comparaciones y relaciones simples. Máximo 4-5 conceptos por sección.'
    };
  }
  
  // 5to - 6to Básico (10-11 años)
  if (normalized === '5to basico' || normalized === '6to basico') {
    return {
      courseName: normalized,
      courseLevel: 'basico_avanzado',
      approximateAge: normalized === '5to basico' ? 10 : 11,
      complexityLevel: 'intermedio',
      languageStyle: 'Lenguaje más formal. Puede usar terminología específica del área con explicaciones. Oraciones compuestas.',
      examplesStyle: 'Ejemplos con situaciones reales, historia, geografía, fenómenos naturales, tecnología básica y problemas matemáticos más complejos.',
      contentGuidelines: 'Contenido más profundo y analítico. Introduce relaciones causa-efecto. Puede incluir datos numéricos y estadísticas simples. 5-6 conceptos por sección.'
    };
  }
  
  // 7mo - 8vo Básico (12-13 años)
  if (normalized === '7mo basico' || normalized === '8vo basico') {
    return {
      courseName: normalized,
      courseLevel: 'basico_avanzado',
      approximateAge: normalized === '7mo basico' ? 12 : 13,
      complexityLevel: 'avanzado',
      languageStyle: 'Lenguaje formal y técnico cuando corresponda. Vocabulario amplio con terminología específica de cada disciplina.',
      examplesStyle: 'Ejemplos con fenómenos científicos, procesos históricos, análisis literarios, problemas matemáticos abstractos y situaciones de la vida real.',
      contentGuidelines: 'Contenido analítico y crítico. Introduce múltiples perspectivas. Incluye datos, fechas, fórmulas básicas. Puede tener 6-7 conceptos por sección.'
    };
  }
  
  // 1ro - 2do Medio (14-15 años)
  if (normalized === '1ro medio' || normalized === '2do medio') {
    return {
      courseName: normalized,
      courseLevel: 'media',
      approximateAge: normalized === '1ro medio' ? 14 : 15,
      complexityLevel: 'avanzado',
      languageStyle: 'Lenguaje académico y técnico. Terminología especializada sin necesidad de explicar cada término básico.',
      examplesStyle: 'Ejemplos científicos, históricos complejos, análisis de textos, problemas matemáticos con variables, aplicaciones tecnológicas.',
      contentGuidelines: 'Contenido profundo y especializado. Análisis crítico y comparativo. Incluye fórmulas, teorías, contexto histórico detallado. 7-8 conceptos por sección.'
    };
  }
  
  // 3ro - 4to Medio (16-17 años)
  if (normalized === '3ro medio' || normalized === '4to medio') {
    return {
      courseName: normalized,
      courseLevel: 'media',
      approximateAge: normalized === '3ro medio' ? 16 : 17,
      complexityLevel: 'tecnico',
      languageStyle: 'Lenguaje académico avanzado y especializado. Terminología técnica y científica. Registro formal.',
      examplesStyle: 'Ejemplos universitarios/preuniversitarios, investigaciones científicas, análisis de obras complejas, problemas matemáticos avanzados, casos de estudio.',
      contentGuidelines: 'Contenido de nivel preuniversitario. Pensamiento crítico y abstracto. Incluye teorías, demostraciones, análisis profundos. Sin límite de conceptos, priorizar profundidad.'
    };
  }
  
  // Por defecto: nivel intermedio
  return {
    courseName: normalized,
    courseLevel: 'basico_intermedio',
    approximateAge: 10,
    complexityLevel: 'intermedio',
    languageStyle: 'Lenguaje claro y accesible con terminología apropiada.',
    examplesStyle: 'Ejemplos variados y relacionados con la vida cotidiana.',
    contentGuidelines: 'Contenido equilibrado entre accesibilidad y profundidad.'
  };
}

/**
 * Genera instrucciones para la IA según el contexto del curso
 */
export function generateAIPromptInstructions(context: ContentGenerationContext, language: 'es' | 'en' = 'es'): string {
  if (language === 'es') {
    return `
CONTEXTO DEL ESTUDIANTE:
- Curso: ${context.courseName}
- Edad aproximada: ${context.approximateAge} años
- Nivel de complejidad requerido: ${context.complexityLevel}

INSTRUCCIONES DE ADAPTACIÓN:
1. LENGUAJE: ${context.languageStyle}
2. EJEMPLOS: ${context.examplesStyle}
3. CONTENIDO: ${context.contentGuidelines}

⚠️ IMPORTANTE: Adapta TODO el contenido al nivel cognitivo de un estudiante de ${context.approximateAge} años. 
- Si el curso es básico inicial (1ro-2do): usa lenguaje muy simple, muchos ejemplos concretos y visuales.
- Si el curso es básico intermedio (3ro-4to): introduce conceptos gradualmente con ejemplos cotidianos.
- Si el curso es básico avanzado (5to-8vo): usa terminología apropiada con explicaciones cuando sea necesario.
- Si el curso es de enseñanza media (1ro-4to medio): usa lenguaje académico y técnico apropiado.
`;
  } else {
    return `
STUDENT CONTEXT:
- Grade: ${context.courseName}
- Approximate age: ${context.approximateAge} years
- Required complexity level: ${context.complexityLevel}

ADAPTATION INSTRUCTIONS:
1. LANGUAGE: ${context.languageStyle}
2. EXAMPLES: ${context.examplesStyle}
3. CONTENT: ${context.contentGuidelines}

⚠️ IMPORTANT: Adapt ALL content to the cognitive level of a ${context.approximateAge}-year-old student.
- If elementary initial (1st-2nd grade): use very simple language, many concrete and visual examples.
- If elementary intermediate (3rd-4th grade): introduce concepts gradually with everyday examples.
- If elementary advanced (5th-8th grade): use appropriate terminology with explanations when necessary.
- If high school (9th-12th grade): use appropriate academic and technical language.
`;
  }
}
