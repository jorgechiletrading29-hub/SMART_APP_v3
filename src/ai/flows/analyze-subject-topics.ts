// src/ai/flows/analyze-subject-topics.ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { bookPDFs } from '@/lib/books-data';
import { getTopicsWithDescriptions, TopicDescription } from '@/lib/topic-descriptions';

// Mapeo de traducciones de temas y descripciones español -> inglés
const topicTranslations: Record<string, { topic: string; unit: string; description: string }> = {
  // 1ro Básico - Matemáticas
  'Números hasta el 10': { topic: 'Numbers up to 10', unit: 'Unit 1: My School', description: 'Counting, reading, writing, and comparing (greater, less, equal) small quantities.' },
  'Componer y descomponer': { topic: 'Composing and Decomposing', unit: 'Unit 1: My School', description: 'Forming numbers from the sum of two others (example: 5 is formed with 2 and 3).' },
  'Patrones': { topic: 'Patterns', unit: 'Unit 1: My School', description: 'Identification and continuation of repetitive sequences using colors, shapes, or rhythms.' },
  'El Tiempo': { topic: 'Time', unit: 'Unit 1: My School', description: 'Use of temporal concepts such as before/after, morning/afternoon/night and calendar orientation.' },
  'Sumas y restas iniciales': { topic: 'Initial Addition and Subtraction', unit: 'Unit 2: Taking Care of My Body', description: 'Introduction to the concept of adding as "joining/grouping" and subtracting as "taking away/separating" in the range of 0 to 10.' },
  'Resolución de problemas': { topic: 'Problem Solving', unit: 'Unit 2: Taking Care of My Body', description: 'Posing and solving simple math stories related to daily life.' },
  'Longitud': { topic: 'Length', unit: 'Unit 2: Taking Care of My Body', description: 'Direct comparison of objects (long/short, tall/short) and measurement using informal units (like paper clips or pencils).' },
  'Geometría': { topic: 'Geometry', unit: 'Unit 2: Taking Care of My Body', description: 'Distinguishing between straight and curved lines. Identification of flat shapes (square, triangle) and 3D bodies (cube, sphere).' },
  'Números del 11 al 20': { topic: 'Numbers from 11 to 20', unit: 'Unit 3: Our Corner', description: 'Expanding the numerical range, including reading and representation.' },
  'Decenas y unidades': { topic: 'Tens and Units', unit: 'Unit 3: Our Corner', description: 'Introduction to place value, grouping elements by 10 (Tens) and single elements (Units).' },
  'Patrones numéricos': { topic: 'Number Patterns', unit: 'Unit 3: Our Corner', description: 'Creating numerical sequences (counting by 2s, by 5s).' },
  'Igualdad y desigualdad': { topic: 'Equality and Inequality', unit: 'Unit 3: Our Corner', description: 'Comparing quantities using balances to understand equilibrium (equality) and imbalance (greater/less).' },
  'Cálculo mental y escrito': { topic: 'Mental and Written Calculation', unit: 'Unit 4: How Fun!', description: 'Mental addition and subtraction strategies within 20.' },
  
  // 1ro Básico - Lenguaje
  'Derechos de la Infancia y Cuentos': { topic: 'Children\'s Rights and Stories', unit: 'Unit 1 - A Hug for Childhood', description: 'Reading and understanding stories about children\'s rights. Values and emotions in narratives.' },
  'Poesía e Instrucciones': { topic: 'Poetry and Instructions', unit: 'Unit 2 - Let\'s Go Play!', description: 'Recitation and appreciation of simple poems. Following instructional texts step by step.' },
  'Novelas y Cartas': { topic: 'Novels and Letters', unit: 'Unit 3 - The Best of Me', description: 'Reading short novels. Writing personal letters expressing feelings and ideas.' },
  'Fábulas y Artículos Informativos': { topic: 'Fables and Informative Articles', unit: 'Unit 4 - Experience Teaches Me', description: 'Reading fables with morals. Extracting information from simple articles.' },
  'Leyendas y Biografías': { topic: 'Legends and Biographies', unit: 'Unit 5 - Girls\' Voices', description: 'Reading legends and traditional narratives. Brief biographies of notable characters.' },
  
  // 2do Básico - Matemáticas
  'Números hasta el 50': { topic: 'Numbers up to 50', unit: 'Unit 1: My Territory', description: 'Counting, reading, and writing numbers in the range of 0 to 50. Number comparison.' },
  'Adición y sustracción con dos dígitos': { topic: 'Two-digit Addition and Subtraction', unit: 'Unit 1: My Territory', description: 'Adding and subtracting with regrouping (carrying/borrowing) in the range up to 50.' },
  'Orientación espacial': { topic: 'Spatial Orientation', unit: 'Unit 1: My Territory', description: 'Positions such as above/below, left/right. Describing paths and routes.' },
  'Dinero': { topic: 'Money', unit: 'Unit 1: My Territory', description: 'Recognizing coins and bills. Solving problems with monetary amounts.' },
  'Números hasta el 100': { topic: 'Numbers up to 100', unit: 'Unit 2: Water in Our Lives', description: 'Expanding the range to 100 including reading, writing, and ordering.' },
  'Patrones y secuencias': { topic: 'Patterns and Sequences', unit: 'Unit 2: Water in Our Lives', description: 'Continuing, creating, and completing numerical and geometric patterns.' },
  'Medición del tiempo': { topic: 'Time Measurement', unit: 'Unit 2: Water in Our Lives', description: 'Reading clocks (hours and half hours). Days, weeks, and months.' },
  'Figuras 2D y 3D': { topic: '2D and 3D Shapes', unit: 'Unit 2: Water in Our Lives', description: 'Identifying and classifying shapes by number of sides, faces, and edges.' },
  'Multiplicación como suma repetida': { topic: 'Multiplication as Repeated Addition', unit: 'Unit 3: Active and Healthy Life', description: 'Understanding multiplication as equal groups or repeated sums.' },
  'División en partes iguales': { topic: 'Division into Equal Parts', unit: 'Unit 3: Active and Healthy Life', description: 'Distributing objects fairly. Introduction to fractions.' },
  'Pictogramas y gráficos': { topic: 'Pictograms and Graphs', unit: 'Unit 3: Active and Healthy Life', description: 'Reading data from pictograms and bar graphs. Simple interpretation.' },
  
  // 3ro Básico - Matemáticas
  'Números hasta el 1000': { topic: 'Numbers up to 1000', unit: 'Unit 1: Diversity in Nature', description: 'Reading, writing, composing, and decomposing numbers up to 1000.' },
  'Adición y sustracción con reagrupación': { topic: 'Addition and Subtraction with Regrouping', unit: 'Unit 1: Diversity in Nature', description: 'Operations with two and three-digit numbers, including carrying and borrowing.' },
  'Multiplicación (tablas del 2 al 10)': { topic: 'Multiplication (2 to 10 tables)', unit: 'Unit 2: Friends Forever', description: 'Memorizing and applying multiplication tables from 2 to 10.' },
  'División exacta': { topic: 'Exact Division', unit: 'Unit 2: Friends Forever', description: 'Division as distribution and grouping. Relationship with multiplication.' },
  'Fracciones': { topic: 'Fractions', unit: 'Unit 3: Healthy Living', description: 'Concept of fraction as part of a whole. Reading, writing, and representing fractions.' },
  'Perímetro': { topic: 'Perimeter', unit: 'Unit 3: Healthy Living', description: 'Calculating perimeter by adding all sides. Regular and irregular shapes.' },
  'Ángulos': { topic: 'Angles', unit: 'Unit 4: Life in Community', description: 'Identification and classification of angles: acute, right, and obtuse.' },
  'Gráficos de barras': { topic: 'Bar Graphs', unit: 'Unit 4: Life in Community', description: 'Creating, reading, and interpreting bar graphs.' },
  
  // 4to Básico - Matemáticas
  'Números hasta el 10000': { topic: 'Numbers up to 10000', unit: 'Mathematics', description: 'Reading, writing, and comparing numbers up to 10,000. Place value.' },
  'Estrategias de cálculo': { topic: 'Calculation Strategies', unit: 'Mathematics', description: 'Mental and written strategies for addition, subtraction, multiplication, and division.' },
  'Fracciones equivalentes': { topic: 'Equivalent Fractions', unit: 'Mathematics', description: 'Understanding and identifying fractions representing the same amount.' },
  'Decimales': { topic: 'Decimals', unit: 'Mathematics', description: 'Introduction to decimal numbers. Reading, writing, and comparing decimals.' },
  'Área': { topic: 'Area', unit: 'Mathematics', description: 'Concept and calculation of area for squares and rectangles.' },
  'Unidades de medida': { topic: 'Units of Measurement', unit: 'Mathematics', description: 'Using standard units: meters, liters, kilograms, and their fractions.' },
  'Tablas de frecuencia': { topic: 'Frequency Tables', unit: 'Mathematics', description: 'Organizing data in frequency tables. Basic interpretation.' },
  
  // 5to - 6to Básico - Matemáticas
  'Números enteros': { topic: 'Integers', unit: 'Mathematics', description: 'Positive and negative numbers. Number line and ordering.' },
  'Operaciones con fracciones': { topic: 'Operations with Fractions', unit: 'Mathematics', description: 'Addition, subtraction, multiplication, and division of fractions.' },
  'Porcentajes': { topic: 'Percentages', unit: 'Mathematics', description: 'Concept of percentage. Calculating percentages in practical situations.' },
  'Razones y proporciones': { topic: 'Ratios and Proportions', unit: 'Mathematics', description: 'Understanding ratios. Direct and inverse proportionality.' },
  'Expresiones algebraicas': { topic: 'Algebraic Expressions', unit: 'Mathematics', description: 'Introduction to algebra. Variables and simple equations.' },
  'Geometría: transformaciones': { topic: 'Geometry: Transformations', unit: 'Mathematics', description: 'Translations, rotations, and reflections of shapes.' },
  'Probabilidad': { topic: 'Probability', unit: 'Mathematics', description: 'Probability experiments. Certain, possible, and impossible events.' },
  'Media y moda': { topic: 'Mean and Mode', unit: 'Mathematics', description: 'Calculating and interpreting mean and mode in data sets.' },
  
  // Traducciones genéricas para ciencias
  'Los seres vivos y su entorno': { topic: 'Living Things and Their Environment', unit: 'Natural Sciences', description: 'Characteristics of living things and their interaction with the environment.' },
  'Partes del cuerpo humano': { topic: 'Human Body Parts', unit: 'Natural Sciences', description: 'Main parts of the body and their basic functions.' },
  'Los cinco sentidos': { topic: 'The Five Senses', unit: 'Natural Sciences', description: 'Sight, hearing, touch, taste, and smell. Their importance in daily life.' },
  'Animales y sus hábitats': { topic: 'Animals and Their Habitats', unit: 'Natural Sciences', description: 'Classification of animals according to their habitat and characteristics.' },
  'Plantas y sus partes': { topic: 'Plants and Their Parts', unit: 'Natural Sciences', description: 'Roots, stem, leaves, flowers, and fruits. Basic functions.' },
  'El ciclo del agua': { topic: 'The Water Cycle', unit: 'Natural Sciences', description: 'Evaporation, condensation, and precipitation. Importance of water.' },
  'Estados de la materia': { topic: 'States of Matter', unit: 'Natural Sciences', description: 'Solid, liquid, and gas. State changes.' },
  'Luz y sombras': { topic: 'Light and Shadows', unit: 'Natural Sciences', description: 'Light sources and shadow formation.' },
  'El día y la noche': { topic: 'Day and Night', unit: 'Natural Sciences', description: 'Earth\'s rotation and the day-night cycle.' },
  'La célula': { topic: 'The Cell', unit: 'Natural Sciences', description: 'Cell structure and functions. Plant and animal cells.' },
  'Sistema digestivo': { topic: 'Digestive System', unit: 'Natural Sciences', description: 'Organs of digestion and the process of nutrient absorption.' },
  'Sistema respiratorio': { topic: 'Respiratory System', unit: 'Natural Sciences', description: 'Organs involved in breathing and gas exchange.' },
  'Sistema circulatorio': { topic: 'Circulatory System', unit: 'Natural Sciences', description: 'Heart, blood vessels, and blood circulation.' },
  'Ecosistemas': { topic: 'Ecosystems', unit: 'Natural Sciences', description: 'Types of ecosystems and the relationships between organisms.' },
  'Cadenas alimentarias': { topic: 'Food Chains', unit: 'Natural Sciences', description: 'Producers, consumers, and decomposers. Energy flow.' },
  
  // 2do Básico - Ciencias Naturales (TEMAS ESPECÍFICOS)
  'Órganos del Cuerpo Humano': { topic: 'Human Body Organs', unit: 'Unit 1 - How Does Our Body Work?', description: 'Location and function of vital organs: heart (pumps blood), lungs (breathing), and stomach (digestion).' },
  'Sistema Locomotor y Actividad Física': { topic: 'Locomotor System and Physical Activity', unit: 'Unit 1 - How Does Our Body Work?', description: 'Function of bones (support), muscles (movement), and the importance of exercise for health.' },
  'Vertebrados e Invertebrados': { topic: 'Vertebrates and Invertebrates', unit: 'Unit 2 - Vertebrates and Invertebrates', description: 'Classification of animals into vertebrates (mammals, birds, reptiles, amphibians, fish) and invertebrates (insects, arachnids, crustaceans).' },
  'Hábitats y Animales en Peligro': { topic: 'Habitats and Endangered Animals', unit: 'Unit 3 - Let\'s Protect Animal Homes', description: 'Relationship between animals and their environment (habitat), and protection of endangered Chilean species.' },
  'Ciclos de Vida': { topic: 'Life Cycles', unit: 'Unit 3 - Let\'s Protect Animal Homes', description: 'Observation of life stages of various animals (e.g., butterfly, frog, birds).' },
  'El Agua y sus Estados': { topic: 'Water and Its States', unit: 'Unit 4 - Water in Our Lives', description: 'Characteristics of water (odorless, colorless, flows) and its physical states: solid (ice), liquid, and gas (vapor).' },
  
  // 1ro Básico - Ciencias Naturales
  'Los sentidos': { topic: 'The Senses', unit: 'Unit 1: Getting to Know and Taking Care of My Body', description: 'Function and location of sight, hearing, smell, taste, and touch.' },
  'Vida saludable': { topic: 'Healthy Living', unit: 'Unit 1: Getting to Know and Taking Care of My Body', description: 'Distinguishing between healthy and unhealthy foods; importance of hygiene and exercise.' },
  'Seres vivos vs. no vivos': { topic: 'Living vs. Non-living Things', unit: 'Unit 2: Living Things in My Environment', description: 'Identifying characteristics of life (being born, growing, responding to stimuli) versus inert matter.' },
  'Necesidades de los animales': { topic: 'Animal Needs', unit: 'Unit 2: Living Things in My Environment', description: 'Basic requirements for survival (water, food, air, shelter).' },
  'Cubierta corporal y desplazamiento': { topic: 'Body Covering and Movement', unit: 'Unit 3: Animals and Plants in Nature', description: 'Classification of animals by fur, feathers, or scales, and whether they walk, fly, or swim.' },
  'Partes de la planta': { topic: 'Plant Parts', unit: 'Unit 3: Animals and Plants in Nature', description: 'Identification of root, stem, leaf, flower, and fruit, with emphasis on Chilean flora.' },
  'Propiedades de los materiales': { topic: 'Properties of Materials', unit: 'Unit 4: The World of Materials', description: 'Exploring characteristics like fragility, flexibility, and transparency in everyday objects.' },
  'Cambios en los materiales': { topic: 'Changes in Materials', unit: 'Unit 4: The World of Materials', description: 'Observing how water, heat, or force affect different materials.' },
  'Ciclo diario': { topic: 'Daily Cycle', unit: 'Unit 5: The Sun and Our Planet', description: 'Differentiating between day and night, and observing the Sun, Moon, and stars.' },
  'Las estaciones': { topic: 'The Seasons', unit: 'Unit 5: The Sun and Our Planet', description: 'Climate and landscape characteristics in autumn, winter, spring, and summer.' },
  
  // 3ro - 6to Básico - Ciencias Naturales
  'Sistema nervioso': { topic: 'Nervous System', unit: 'Natural Sciences', description: 'Brain, spinal cord, and nerves. How the body responds to stimuli.' },
  'Sistema óseo y muscular': { topic: 'Skeletal and Muscular System', unit: 'Natural Sciences', description: 'Bones, muscles, joints, and their functions in movement and support.' },
  'Nutrición y alimentación': { topic: 'Nutrition and Diet', unit: 'Natural Sciences', description: 'Food groups, balanced diet, and healthy eating habits.' },
  'Reproducción': { topic: 'Reproduction', unit: 'Natural Sciences', description: 'Reproduction in plants and animals. Human reproduction basics.' },
  'Energía': { topic: 'Energy', unit: 'Natural Sciences', description: 'Types of energy, energy transformations, and conservation.' },
  'Electricidad': { topic: 'Electricity', unit: 'Natural Sciences', description: 'Electric circuits, conductors, insulators, and electrical safety.' },
  'Fuerza y movimiento': { topic: 'Force and Motion', unit: 'Natural Sciences', description: 'Types of forces and their effects on objects. Simple machines.' },
  'La Tierra': { topic: 'The Earth', unit: 'Natural Sciences', description: 'Earth\'s layers, rocks, minerals, and geological processes.' },
  'El universo': { topic: 'The Universe', unit: 'Natural Sciences', description: 'Solar system, planets, stars, and space exploration.' },
  
  // Traducciones genéricas para historia
  'Mi familia y yo': { topic: 'My Family and Me', unit: 'History and Geography', description: 'Family structure, roles, and relationships.' },
  'Normas de convivencia': { topic: 'Rules of Coexistence', unit: 'History and Geography', description: 'Importance of rules at home and school. Respect and responsibility.' },
  'Derechos de los niños': { topic: 'Children\'s Rights', unit: 'History and Geography', description: 'Basic rights of children. Protection and well-being.' },
  'Símbolos patrios': { topic: 'National Symbols', unit: 'History and Geography', description: 'Flag, coat of arms, and national anthem. Their meaning.' },
  'Pueblos originarios': { topic: 'Indigenous Peoples', unit: 'History and Geography', description: 'Native cultures and their traditions.' },
  'Fiestas y tradiciones': { topic: 'Holidays and Traditions', unit: 'History and Geography', description: 'National and local celebrations. Cultural customs.' },
  'Civilizaciones antiguas': { topic: 'Ancient Civilizations', unit: 'History and Geography', description: 'Egypt, Greece, Rome. Their contributions to humanity.' },
  'Edad Media': { topic: 'Middle Ages', unit: 'History and Geography', description: 'Feudalism, castles, and medieval life.' },
  'Descubrimiento de América': { topic: 'Discovery of America', unit: 'History and Geography', description: 'Christopher Columbus and the exploration of the New World.' },
  'Independencia': { topic: 'Independence', unit: 'History and Geography', description: 'Independence movements and formation of republics.' },
  
  // 2do Básico - Lenguaje
  'Cuentos Tradicionales': { topic: 'Traditional Tales', unit: 'Language Arts', description: 'Classic fairy tales and traditional stories. Narrative elements.' },
  'Textos Instructivos': { topic: 'Instructional Texts', unit: 'Language Arts', description: 'Following and writing step-by-step instructions.' },
  'Poemas y Canciones': { topic: 'Poems and Songs', unit: 'Language Arts', description: 'Rhythm, rhyme, and poetic language appreciation.' },
  'Textos Informativos': { topic: 'Informative Texts', unit: 'Language Arts', description: 'Reading and understanding non-fiction texts.' },
  
  // 2do Básico - Historia, Geografía y Ciencias Sociales
  'Planos y Orientación': { topic: 'Maps and Orientation', unit: 'Unit 1 - What is our place like?', description: 'Using cardinal points (North, South, East, West) and reading simple maps to locate places in the environment.' },
  'Paisajes de Chile': { topic: 'Landscapes of Chile', unit: 'Unit 1 - What is our place like?', description: 'Identifying geographic zones of Chile: North, Central, and South. Their characteristics.' },
  'Medios de Transporte y Comunicación': { topic: 'Transportation and Communication', unit: 'Unit 1 - What is our place like?', description: 'Evolution of transportation and communication means. Their importance in daily life.' },
  'Normas y Espacios Públicos': { topic: 'Rules and Public Spaces', unit: 'Unit 1 - What is our place like?', description: 'Importance of following rules in public spaces. Citizenship and responsibility.' },
  'Pueblos Originarios': { topic: 'Indigenous Peoples', unit: 'Unit 2 - Who were the first inhabitants of Chile?', description: 'Native peoples of Chile: Mapuche, Aymara, Rapa Nui, and others. Their traditions and contributions.' },
  'Diversidad y Herencia': { topic: 'Diversity and Heritage', unit: 'Unit 3 - Why is Chile diverse?', description: 'Cultural diversity in Chile. Heritage from indigenous peoples and immigrants.' },
  
  // 2do Básico - Lenguaje (temas específicos del currículo)
  'Lectura de Cuentos': { topic: 'Reading Stories', unit: 'Unit 1 - Playing is a Right', description: 'Reading and understanding children\'s stories. Identifying characters and events.' },
  'Cartas y Mensajes': { topic: 'Letters and Messages', unit: 'Unit 2 - With My Friends', description: 'Writing personal letters and messages to communicate with others.' },
  'Historietas y Cómics': { topic: 'Comics and Graphic Stories', unit: 'Unit 3 - A Gift of Nature', description: 'Reading and creating comic strips. Visual narrative and dialogue.' },
  'Textos Descriptivos': { topic: 'Descriptive Texts', unit: 'Unit 4 - A Beautiful Place to Live', description: 'Writing texts that describe people, places, and objects in detail.' },
  
  // 1ro Básico - Historia
  'Orden temporal': { topic: 'Temporal Order', unit: 'Unit 1: We Tell Stories', description: 'Sequencing events (yesterday/today/tomorrow) and using time categories (days of the week, months).' },
  'Identidad personal y familiar': { topic: 'Personal and Family Identity', unit: 'Unit 1: We Tell Stories', description: 'Recognizing one\'s own history, family tree, and family customs.' },
  'Instituciones y trabajos': { topic: 'Institutions and Jobs', unit: 'Unit 2: Living in Community', description: 'Functions of organizations like Fire Departments or Police, and the distinction between paid and volunteer work.' },
  'Ubicación de Chile': { topic: 'Location of Chile', unit: 'Unit 3: Chile and Its Landscapes', description: 'Identifying the country on the globe and maps of South America.' },
  'Paisajes': { topic: 'Landscapes', unit: 'Unit 3: Chile and Its Landscapes', description: 'Differentiating between natural elements (rivers, mountains) and cultural elements (cities, roads) in different regions of the country.' },
  'Aporte cultural': { topic: 'Cultural Contribution', unit: 'Unit 4: Cultural Diversity', description: 'Recognizing the diversity of origins in Chilean society (indigenous peoples and immigrants).' },
  
  // 1ro Básico - Lenguaje
  'Vocales y primeras letras': { topic: 'Vowels and First Letters', unit: 'Unit 1: Let\'s Read!', description: 'Learning vowels and initial consonants. Letter-sound correspondence.' },
  'Palabras y oraciones': { topic: 'Words and Sentences', unit: 'Unit 2: My World', description: 'Forming simple words and sentences. Basic reading.' },
  'Cuentos cortos': { topic: 'Short Stories', unit: 'Unit 3: Stories', description: 'Reading and understanding short stories. Main characters and events.' },
  'Rimas y trabalenguas': { topic: 'Rhymes and Tongue Twisters', unit: 'Unit 4: Playing with Words', description: 'Playing with language sounds through rhymes and tongue twisters.' },
  
  // 3ro Básico - Lenguaje
  'Narrativa y Mundo Natural': { topic: 'Narrative and Natural World', unit: 'Unit 1 - What is humanity\'s relationship with nature?', description: 'Stories exploring the connection between humans and nature.' },
  'Mitos y Leyendas': { topic: 'Myths and Legends', unit: 'Unit 1', description: 'Traditional stories explaining natural phenomena and origins.' },
  'Poesía y Autobiografía': { topic: 'Poetry and Autobiography', unit: 'Unit 2 - What makes you special and different?', description: 'Personal expression through poetry and life writing.' },
  'Comentario Literario': { topic: 'Literary Commentary', unit: 'Unit 3', description: 'Analyzing and commenting on literary works.' },
  'Texto Dramático y Opinión': { topic: 'Drama and Opinion', unit: 'Unit 4 - How do you want to change the world?', description: 'Dramatic texts and expressing opinions through writing.' },
  
  // Más temas de Física y Química (Enseñanza Media)
  'Cinemática': { topic: 'Kinematics', unit: 'Physics', description: 'Study of motion: position, velocity, and acceleration.' },
  'Dinámica': { topic: 'Dynamics', unit: 'Physics', description: 'Forces and Newton\'s laws of motion.' },
  'Trabajo y energía': { topic: 'Work and Energy', unit: 'Physics', description: 'Mechanical work, kinetic and potential energy.' },
  'Ondas': { topic: 'Waves', unit: 'Physics', description: 'Wave properties, types, and behavior.' },
  'Electricidad': { topic: 'Electricity', unit: 'Physics', description: 'Electric charge, current, and circuits.' },
  'Magnetismo': { topic: 'Magnetism', unit: 'Physics', description: 'Magnetic fields and electromagnetic phenomena.' },
  'Estructura atómica': { topic: 'Atomic Structure', unit: 'Chemistry', description: 'Atoms, electrons, protons, and neutrons.' },
  'Tabla periódica': { topic: 'Periodic Table', unit: 'Chemistry', description: 'Organization of elements and periodic properties.' },
  'Enlaces químicos': { topic: 'Chemical Bonds', unit: 'Chemistry', description: 'Ionic, covalent, and metallic bonds.' },
  'Reacciones químicas': { topic: 'Chemical Reactions', unit: 'Chemistry', description: 'Types of reactions and balancing equations.' },
  'Ácidos y bases': { topic: 'Acids and Bases', unit: 'Chemistry', description: 'pH scale, neutralization, and acid-base reactions.' },
  'Química orgánica': { topic: 'Organic Chemistry', unit: 'Chemistry', description: 'Carbon compounds and functional groups.' },
  
  // Biología 1ro Medio - Traducciones completas
  'Evolución y Biodiversidad': { topic: 'Evolution and Biodiversity', unit: 'Unit 1 - How has life evolved on Earth?', description: 'Evidence of evolution (fossils, comparative anatomy, DNA). Theory of Natural Selection by Darwin and Wallace. Classification of living things (Taxonomy) and human phylogeny.' },
  'Ecología: Interacciones': { topic: 'Ecology: Interactions', unit: 'Unit 2 - How do organisms interact?', description: 'Levels of organization (population, community, ecosystem). Biological interactions (predation, competition, mutualism). Population dynamics (size, density, growth).' },
  'Materia y Energía en Ecosistemas': { topic: 'Matter and Energy in Ecosystems', unit: 'Unit 3 - What happens with matter and energy?', description: 'Energy flow (food chains and food webs). Biogeochemical cycles (Carbon, Nitrogen, Water). Photosynthesis and cellular respiration as complementary processes. Human impact on ecosystems.' },
  
  // Lenguaje 1ro Medio - Traducciones completas
  'Héroes y Narrativa': { topic: 'Heroes and Narrative', unit: 'Unit 1 - Heroes and villains', description: 'Reading novels (e.g., Lazarillo de Tormes) and short stories. Analysis of narrator, actions and character development. Detective and crime fiction.' },
  'Argumentación y Sociedad': { topic: 'Argumentation and Society', unit: 'Unit 2 - Cunning and wisdom', description: 'Analysis of argumentative texts (columns, essays) identifying thesis and arguments. Evaluating veracity and quality of information (Fake news vs. reliable sources).' },
  'Teatro y Conflicto': { topic: 'Theater and Conflict', unit: 'Unit 3 - Family ties', description: 'Reading dramatic works (tragedy and comedy). Analysis of dramatic conflict, characters and staging (e.g., Antigone, La Nona).' },
  'Poesía y Romanticismo': { topic: 'Poetry and Romanticism', unit: 'Unit 4 - Freedom', description: 'Interpretation of lyric texts, figurative language (metaphors, symbols) and context of literary Romanticism (freedom, feelings).' },
  'Literatura y Contexto': { topic: 'Literature and Context', unit: 'Unit 5 - Literature and context', description: 'Relationship between literary works and their production context (e.g., Frankenstein and 19th century science). Intertextuality.' },
  'Identidad y Medios': { topic: 'Identity and Media', unit: 'Unit 6 - Collective identities', description: 'Analysis of propaganda and advertising. Reflection on personal and collective identity (Latin American, national).' },
  
  // 2do Medio - Matemáticas
  'Números Reales (Raíces y Logaritmos)': { topic: 'Real Numbers (Roots and Logarithms)', unit: 'Unit 1 - Numbers', description: 'Operations with nth roots and logarithm definition. Relationship between powers, roots and logarithms.' },
  'Ecuación Cuadrática': { topic: 'Quadratic Equation', unit: 'Unit 2 - Algebra and functions', description: 'Solving second degree equations through factoring, completing the square and general formula.' },
  'Función Cuadrática': { topic: 'Quadratic Function', unit: 'Unit 2 - Algebra and functions', description: 'Parabola analysis (concavity, vertex, axis of symmetry) and modeling of quadratic change situations.' },
  'Función Inversa': { topic: 'Inverse Function', unit: 'Unit 2 - Algebra and functions', description: 'Concept of bijectivity and determining inverse function in linear and quadratic cases (with domain restriction).' },
  'Trigonometría': { topic: 'Trigonometry', unit: 'Unit 3 - Geometry', description: 'Trigonometric ratios in right triangles (sine, cosine, tangent) and solving height and distance problems.' },
  'Probabilidad Condicionada': { topic: 'Conditional Probability', unit: 'Unit 4 - Probability and statistics', description: 'Calculating probabilities when one event affects another\'s occurrence. Using tree diagrams and contingency tables.' },
  
  // 1ro Medio - Matemáticas
  'Números Racionales y Potencias': { topic: 'Rational Numbers and Powers', unit: 'Unit 1 - Numbers', description: 'Operations with rational numbers (fractions and decimals), properties of powers and scientific notation. Exponential growth and decay (e.g., compound interest, bacteria).' },
  'Productos Notables y Factorización': { topic: 'Notable Products and Factoring', unit: 'Unit 2 - Algebra and functions', description: 'Reduction of algebraic expressions and use of notable products (binomial square, sum times difference). Factoring algebraic expressions.' },
  'Sistemas de Ecuaciones Lineales': { topic: 'Systems of Linear Equations', unit: 'Unit 2 - Algebra and functions', description: 'Solving systems of two-variable equations using graphical and algebraic methods (substitution, equalization, reduction).' },
  'Homotecia y Semejanza': { topic: 'Homothety and Similarity', unit: 'Unit 3 - Geometry', description: 'Concept of homothety (enlarging or reducing figures) and properties of similar triangles (LLL, LAL, AA criteria). Thales theorem and its applications.' },
  'Estadística y Probabilidad': { topic: 'Statistics and Probability', unit: 'Unit 4 - Probability and statistics', description: 'Comparison of population samples and graph analysis. Probability rules (additive and multiplicative) and random experiments (tree diagrams and Random Walks).' },
  
  // Biología 2do Medio - Traducciones completas
  'Coordinación y Regulación (Sistema Nervioso)': { topic: 'Coordination and Regulation (Nervous System)', unit: 'Unit 1 - How are our bodies coordinated and regulated?', description: 'Neuron structure, synapse and nerve impulse transmission. Effect of drugs on the brain.' },
  'Sistema Endocrino': { topic: 'Endocrine System', unit: 'Unit 1 - How are our bodies coordinated and regulated?', description: 'Hormone action, blood sugar control (insulin/glucagon) and stress response.' },
  'Sexualidad y Reproducción': { topic: 'Sexuality and Reproduction', unit: 'Unit 2 - Sexuality and reproduction', description: 'Sex hormones, ovarian and uterine cycle. Fertilization, embryonic development and birth. Birth control methods.' },
  'Genética y Herencia': { topic: 'Genetics and Heredity', unit: 'Unit 3 - How is genetic material inherited?', description: 'Cell cycle (Mitosis and Meiosis). Mendel\'s laws, genotype, phenotype and genetic manipulation.' },
  
  // Física 1ro Medio - Traducciones completas
  'Ondas y Sonido': { topic: 'Waves and Sound', unit: 'Unit 1 - Waves and sound', description: 'Nature of waves (frequency, period, wavelength, amplitude). Classification (mechanical/electromagnetic). Sound phenomena: reflection (echo), diffraction, Doppler effect and noise pollution.' },
  'La Luz y Óptica': { topic: 'Light and Optics', unit: 'Unit 2 - Waves and light', description: 'Light propagation, electromagnetic spectrum and colors. Image formation in mirrors (plane, curved) and lenses (converging, diverging). The human eye and vision.' },
  'Sismos y Tierra': { topic: 'Earthquakes and Earth', unit: 'Unit 3 - Waves and earthquakes', description: 'Internal structure of the Earth (static and dynamic model). Plate tectonics. Origin and propagation of seismic waves (P, S, L, R). Earthquake measurement (magnitude and intensity).' },
  'Universo': { topic: 'Universe', unit: 'Unit 4 - Structures of the universe', description: 'Origin and evolution of the universe (Big Bang). Cosmic structures (galaxies, stars, planetary systems). Astronomical observation in Chile.' },
  
  // Química 1ro Medio - Traducciones completas
  'Reacciones Químicas': { topic: 'Chemical Reactions', unit: 'Unit 1 - Everyday chemical reactions', description: 'Difference between physical and chemical changes. Evidence of a reaction. Collision theory and factors affecting reaction rate. Law of conservation of matter.' },
  'Estequiometría': { topic: 'Stoichiometry', unit: 'Unit 2 - Chemical reactions and stoichiometry', description: 'Balancing chemical equations. Concept of Mole and molar mass. Simple stoichiometric calculations and limiting reagent.' },
  'Nomenclatura Inorgánica': { topic: 'Inorganic Nomenclature', unit: 'Unit 3 - Inorganic nomenclature', description: 'Formation and nomenclature of binary compounds (oxides, hydrides, salts) and ternary compounds (hydroxides, acids). Use of oxidation states and IUPAC rules (Systematic and Stock).' },
  
  // Física 2do Medio - Traducciones completas
  'Movimiento Rectilíneo': { topic: 'Rectilinear Motion', unit: 'Unit 1 - Motion', description: 'Description of motion: position, displacement, velocity and acceleration. Graphs of uniform and uniformly accelerated motion.' },
  'Fuerza y Leyes de Newton': { topic: 'Force and Newton\'s Laws', unit: 'Unit 2 - Forces', description: 'Principles of inertia, mass and action-reaction. Free body diagrams and friction force.' },
  'Trabajo y Energía Mecánica': { topic: 'Work and Mechanical Energy', unit: 'Unit 3 - Mechanical energy', description: 'Concept of mechanical work and power. Conservation of mechanical energy (kinetic and gravitational/elastic potential).' },
  'El Universo y el Big Bang': { topic: 'The Universe and the Big Bang', unit: 'Unit 4 - The universe', description: 'Theories about the origin of the universe (Big Bang), cosmic expansion and formation of structures (galaxies, stars).' },
  
  // Química 2do Medio - Traducciones completas
  'Disoluciones Químicas': { topic: 'Chemical Solutions', unit: 'Unit 1 - Chemical solutions', description: 'Components (solute/solvent), solubility and affecting factors. Physical (%m/m) and chemical (Molarity) concentration units.' },
  'Propiedades Coligativas': { topic: 'Colligative Properties', unit: 'Unit 2 - Colligative properties', description: 'Changes in solvent properties when adding solute: vapor pressure lowering, boiling point elevation, freezing point depression and osmosis.' },
  'Química Orgánica (El Carbono)': { topic: 'Organic Chemistry (Carbon)', unit: 'Unit 3 - Organic chemistry', description: 'Properties of the carbon atom. Hydrocarbons (alkanes, alkenes, alkynes) and functional groups (alcohols, acids, etc.).' },
  'Isomería y Polímeros': { topic: 'Isomerism and Polymers', unit: 'Unit 3 - Organic chemistry', description: 'Compounds with same molecular formula but different structure. Natural and synthetic polymers.' },
  
  // 3ro y 4to Medio - Matemáticas
  'Estadística y Probabilidades': { topic: 'Statistics and Probabilities', unit: 'Unit 1 - Decision making in uncertain situations', description: 'Dispersion measures: Range, variance and standard deviation to compare data sets. Conditional probability and total probability for analyzing uncertainty.' },
  'Álgebra y Funciones (Modelamiento)': { topic: 'Algebra and Functions (Modeling)', unit: 'Unit 2 - Mathematical modeling', description: 'Exponential Function: Analysis of exponential growth and decay in real phenomena. Logarithmic Function: Relationship with exponential, properties and use in scales (pH, Richter).' },
  'Geometría (Circunferencia)': { topic: 'Geometry (Circumference)', unit: 'Unit 3 - Metric relations in the circle', description: 'Angles: Relationship between central and inscribed angles; interior and exterior angles. Segments: Metric properties of chords, secants and tangents.' },
  'Números (Complejos)': { topic: 'Numbers (Complex)', unit: 'Unit 4 - Complex numbers', description: 'The set ℂ: Definition of imaginary unit i, binomial and ordered pair representation, modulus and conjugate. Operations with complex numbers.' },
  'Decisiones Financieras': { topic: 'Financial Decisions', unit: 'Unit 1 - Financial decision making', description: 'Personal finance, compound interest, loans and investments analysis.' },
  'Funciones Trigonométricas y Modelamiento': { topic: 'Trigonometric Functions and Modeling', unit: 'Unit 2 - Mathematical modeling', description: 'Sine, cosine and tangent functions. Periodic behavior modeling and applications.' },
  'Probabilidades y Distribuciones': { topic: 'Probabilities and Distributions', unit: 'Unit 3 - Decision making in uncertainty', description: 'Probability distributions, expected value and decision analysis.' },
  'Geometría Analítica': { topic: 'Analytic Geometry', unit: 'Unit 4 - Coordinate geometry', description: 'Equations of lines, circles and conic sections. Distance and midpoint formulas.' },
  
  // Historia 1ro Medio - Traducciones completas
  'Economía y Mercado': { topic: 'Economy and Market', unit: 'Unit 1 - Economy and society', description: 'The economic problem (scarcity vs. unlimited needs). Market functioning (supply, demand, price setting). Financial instruments, savings and responsible consumption.' },
  'Estado-Nación y Sociedad Burguesa': { topic: 'Nation-State and Bourgeois Society', unit: 'Unit 2 - Building the nation-state', description: 'Liberal and republican ideals in Europe and America. Bourgeois culture. Formation of the nation-state in Chile: Republic organization and 19th century political debate.' },
  'Progreso e Industrialización': { topic: 'Progress and Industrialization', unit: 'Unit 3 - Unlimited progress', description: 'Industrial Revolution and its economic and social impacts. 19th century European imperialism and the idea of unlimited progress.' },
  'Territorio Chileno': { topic: 'Chilean Territory', unit: 'Unit 4 - Territory configuration', description: 'Chile\'s territorial expansion in the 19th century: War of the Pacific (causes and consequences). Occupation of Araucanía and southern colonization. Relationship with indigenous peoples.' },
  'El Cambio de Siglo': { topic: 'The Turn of the Century', unit: 'Unit 5 - The turn of the century', description: 'The "Social Question" in Chile and the crisis of parliamentarism. World War I and the new global geopolitical order.' },
  
  // Historia 2do Medio - Traducciones completas
  'Crisis del Parlamentarismo y Anarquía': { topic: 'Crisis of Parliamentarism and Anarchy', unit: 'Unit 1 - Crisis, totalitarianism and war', description: 'End of the nitrate cycle in Chile, 1925 Constitution and the emergence of the middle class and labor movement.' },
  'Totalitarismos y Segunda Guerra Mundial': { topic: 'Totalitarianism and World War II', unit: 'Unit 1 - Crisis, totalitarianism and war', description: 'Rise of fascism and Nazism. Development and consequences of WWII and the Holocaust.' },
  'La Guerra Fría': { topic: 'The Cold War', unit: 'Unit 2 - A bipolar world', description: 'USA-USSR ideological confrontation. Cuban Revolution and its influence in Latin America.' },
  'Chile a mediados del Siglo XX': { topic: 'Chile in the Mid-20th Century', unit: 'Unit 3 - Chile in mid-20th century', description: 'ISI model (Industrialization), suffrage expansion (women\'s vote) and Welfare State in Chile.' },
  'Reformas Estructurales y Quiebre Democrático': { topic: 'Structural Reforms and Democratic Breakdown', unit: 'Unit 4 - Structural reforms and democratic breakdown', description: 'Agrarian Reform and the "Chilean Road to Socialism". Political polarization, 1973 Coup, Military Dictatorship and restoration of democracy.' },
  
  // Lenguaje 2do Medio - Traducciones completas
  'Narrativa y Migración': { topic: 'Narrative and Migration', unit: 'Unit 1 - About absence: exile and migration', description: 'Reading narrative works addressing human displacement. Analysis of anachronies (time jumps) and conflict.' },
  'Medios Masivos y Ciudadanía': { topic: 'Mass Media and Citizenship', unit: 'Unit 2 - Citizenship and work', description: 'Critical analysis of press, advertising and propaganda. Identification of gender stereotypes and persuasion strategies.' },
  'Género Dramático y Poder': { topic: 'Dramatic Genre and Power', unit: 'Unit 3 - Power and ambition', description: 'Reading classic tragedies (like Macbeth) to analyze how power and ambition drive characters.' },
  'Lírica y Perspectiva de Género': { topic: 'Poetry and Gender Perspective', unit: 'Unit 4 - The feminine', description: 'Interpretation of poems written by or about women. Analysis of symbols and worldview in poetry.' },
  'Investigación y Comunicación Oral': { topic: 'Research and Oral Communication', unit: 'Unit 2/4', description: 'Discussion techniques (panel, debate) and literary research preparation with citation standards.' },
  
  // Lenguaje 3ro Medio - Traducciones completas
  'Lectura e Interpretación (Sociedad)': { topic: 'Reading and Interpretation (Society)', unit: 'Unit 1 - Challenges and opportunities', description: 'The home: Interpretation of works symbolizing inhabited space and coexistence. Social issues: Critical reading on empathy, marginalization and solidarity.' },
  'Identidad y Cultura': { topic: 'Identity and Culture', unit: 'Unit 2 - Personal identity', description: 'Transformations: Analysis of personal changes through works like Kafka\'s Metamorphosis. Culture and Media: Influence of mass cultural phenomena on identity construction.' },
  'Emociones y Realidad': { topic: 'Emotions and Reality', unit: 'Unit 3 - Facts and emotions', description: 'Lyrical expression: Analysis of how poetry communicates feelings and worldviews (Gabriela Mistral). Stereotypes: Critical reading of texts breaking gender prejudices and social roles.' },
  'Identidad y Sociedad': { topic: 'Identity and Society', unit: 'Unit 4 - Identity and transformations', description: 'Origins: Reflection on cultural identity, indigenous peoples and mestizaje. Consumption: Critical analysis of consumer society and its influence on who we are.' },
  
  // Ciencias para la Ciudadanía 3ro Medio - Traducciones completas
  'Salud y Enfermedad': { topic: 'Health and Disease', unit: 'Module: Wellness and Health', description: 'Biopsychosocial factors influencing health. Conventional, traditional and complementary medicine.' },
  'Prevención de Infecciones': { topic: 'Infection Prevention', unit: 'Module: Wellness and Health', description: 'How pathogens work (viruses, bacteria), immune system, vaccines and STI prevention.' },
  'Riesgos Socionaturales': { topic: 'Socionatural Risks', unit: 'Module: Safety, Prevention and Self-care', description: 'Prevention and response to earthquakes, tsunamis, volcanic eruptions and forest fires.' },
  'Riesgos en el Entorno': { topic: 'Environmental Risks', unit: 'Module: Safety, Prevention and Self-care', description: 'Safe handling of chemical substances at home and prevention of everyday accidents.' },
  'Cambio Climático': { topic: 'Climate Change', unit: 'Module: Environment and Sustainability', description: 'Evidence, local and global effects, and carbon footprint.' },
  'Consumo Sostenible': { topic: 'Sustainable Consumption', unit: 'Module: Environment and Sustainability', description: 'Strategies to reduce environmental impact, waste management and energy efficiency.' },
  'Innovación Tecnológica': { topic: 'Technological Innovation', unit: 'Module: Technology and Society', description: 'Impact of robotics, artificial intelligence and biotechnology in daily life.' },
  'Proyectos Tecnológicos': { topic: 'Technological Projects', unit: 'Module: Technology and Society', description: 'Design and application of technological solutions for local problems.' },
  
  // Historia 3ro Básico - Traducciones completas
  'Ubicación Espacial y Zonas Climáticas': { topic: 'Spatial Location and Climate Zones', unit: 'Unit 1 - How can we know planet Earth?', description: 'Use of grids and imaginary lines (Equator, Tropics). Characteristics of climate zones (warm, temperate, cold) and their landscapes.' },
  'La Civilización Griega': { topic: 'Greek Civilization', unit: 'Unit 2 - How did ancient Greeks live and what did they leave us?', description: 'Geographic environment, daily life, education and their legacies (democracy, theater, Olympic Games, mythology).' },
  'La Civilización Romana': { topic: 'Roman Civilization', unit: 'Unit 3 - How did ancient Romans live and what is their legacy?', description: 'Location, city life, family and their legacies (Latin language, laws, architecture, Christianity).' },
  'Vida en Comunidad y Derechos': { topic: 'Community Life and Rights', unit: 'Unit 4 - How do we contribute to community life?', description: 'Children\'s rights and duties. Citizen participation and the role of public and private institutions.' },
  
  // Ciencias 3ro Básico - Traducciones completas
  'La Luz': { topic: 'Light', unit: 'Unit 1 - How does light affect our lives?', description: 'Light sources, light propagation, shadows, opaque and transparent objects.' },
  'El Sonido': { topic: 'Sound', unit: 'Unit 2 - How do we perceive sounds?', description: 'Sound vibrations, how sound travels, pitch and volume. Musical instruments.' },
  'El Sistema Solar': { topic: 'The Solar System', unit: 'Unit 3 - What do we know about space?', description: 'The Sun, planets, moons, and other celestial bodies. Earth\'s movement and seasons.' },
  'Las Plantas': { topic: 'Plants', unit: 'Unit 4 - How do plants live?', description: 'Plant structure, photosynthesis, plant life cycle, and importance of plants.' },
  'Alimentación Saludable': { topic: 'Healthy Eating', unit: 'Unit 5 - How can we eat healthy?', description: 'Food groups, balanced diet, nutritional pyramid, and healthy eating habits.' },
  
  // Lenguaje 3ro Básico - Traducciones completas
  'Narrativa y Mundo Natural': { topic: 'Narrative and Natural World', unit: 'Unit 1 - What is humanity\'s relationship with nature?', description: 'Stories exploring the connection between humans and nature. Reading comprehension and vocabulary.' },
  'Mitos y Leyendas': { topic: 'Myths and Legends', unit: 'Unit 1 - What is humanity\'s relationship with nature?', description: 'Traditional stories explaining natural phenomena and origins. Cultural heritage through storytelling.' },
  'Poesía y Autobiografía': { topic: 'Poetry and Autobiography', unit: 'Unit 2 - What makes you special and different?', description: 'Personal expression through poetry and life writing. Self-reflection and creative writing.' },
  'Comentario Literario': { topic: 'Literary Commentary', unit: 'Unit 3 - Our community heritage', description: 'Analyzing and commenting on literary works. Expressing opinions about texts.' },
  'Texto Dramático y Opinión': { topic: 'Drama and Opinion', unit: 'Unit 4 - How do you want to change the world?', description: 'Dramatic texts and expressing opinions through writing. Theater and persuasive writing.' },
  
  // Matemáticas 3ro Básico - Traducciones completas
  'Números hasta el 1.000': { topic: 'Numbers up to 1,000', unit: 'Unit 1 - Diversity in Nature', description: 'Reading, writing, composing, and decomposing numbers up to 1,000. Place value understanding.' },
  'Orden y Comparación': { topic: 'Order and Comparison', unit: 'Unit 1 - Diversity in Nature', description: 'Ordering and comparing numbers using greater than, less than, and equal to.' },
  'Adición y Sustracción': { topic: 'Addition and Subtraction', unit: 'Unit 1 - Diversity in Nature', description: 'Operations with two and three-digit numbers, including carrying and borrowing.' },
  'Patrones y Ecuaciones': { topic: 'Patterns and Equations', unit: 'Unit 2 - Friends Forever', description: 'Identifying numerical patterns and solving simple equations with unknowns.' },
  'Figuras 3D y Perímetro': { topic: '3D Shapes and Perimeter', unit: 'Unit 2 - Friends Forever', description: 'Recognizing 3D shapes and calculating perimeter of 2D figures.' },
  'Multiplicación y División': { topic: 'Multiplication and Division', unit: 'Unit 3 - Healthy Living', description: 'Memorizing and applying multiplication tables from 2 to 10. Division as inverse operation.' },
  'Gráficos y Probabilidades': { topic: 'Graphs and Probabilities', unit: 'Unit 4 - Life in Community', description: 'Creating, reading, and interpreting bar graphs. Introduction to probability concepts.' },
  'Geometría y Ubicación': { topic: 'Geometry and Location', unit: 'Unit 4 - Life in Community', description: 'Geometric shapes, spatial orientation, and location on grids.' },
  
  // Historia 4to Básico - Traducciones completas
  'La Civilización Maya': { topic: 'Mayan Civilization', unit: 'Unit 1 - Ancient American Civilizations', description: 'Location in Mesoamerica, city-states, writing system, calendar, and mathematical achievements.' },
  'La Civilización Azteca': { topic: 'Aztec Civilization', unit: 'Unit 2 - Ancient American Civilizations', description: 'The Aztec Empire, Tenochtitlan, social organization, religion, and daily life.' },
  'La Civilización Inca': { topic: 'Inca Civilization', unit: 'Unit 3 - Ancient American Civilizations', description: 'The Inca Empire, Cusco, road system, agriculture, and quipu record-keeping.' },
  'Geografía de América': { topic: 'Geography of America', unit: 'Unit 4 - American Geography', description: 'Physical features, climate zones, natural resources, and human geography of the Americas.' },
  
  // Ciencias 4to Básico - Traducciones completas
  'Ecosistemas de Chile': { topic: 'Ecosystems of Chile', unit: 'Unit 1 - Chilean Ecosystems', description: 'Biodiversity, food chains, adaptation of organisms, and Chilean natural environments.' },
  'El Cuerpo Humano: Sistema Locomotor': { topic: 'Human Body: Locomotor System', unit: 'Unit 2 - Human Body', description: 'Bones, muscles, joints, and how the body moves. Importance of physical activity.' },
  'Materia y sus Cambios': { topic: 'Matter and Its Changes', unit: 'Unit 3 - Matter', description: 'Properties of matter, physical and chemical changes, mixtures and solutions.' },
  'La Fuerza': { topic: 'Force', unit: 'Unit 4 - Force and Motion', description: 'Types of forces, effects on objects, simple machines, and motion.' },
  
  // Matemáticas 4to Básico - Traducciones completas
  'Números hasta el 10.000': { topic: 'Numbers up to 10,000', unit: 'Unit 1 - Math in Daily Life', description: 'Reading, writing, and comparing numbers up to 10,000. Place value and number representation.' },
  'Ángulos y Vistas': { topic: 'Angles and Views', unit: 'Unit 2 - Is there geometry in our environment?', description: 'Types of angles, measuring angles, and different views of 3D objects.' },
  'Transformaciones Isométricas': { topic: 'Isometric Transformations', unit: 'Unit 2 - Is there geometry in our environment?', description: 'Translations, rotations, and reflections of geometric figures.' },
  'Fracciones y Números Mixtos': { topic: 'Fractions and Mixed Numbers', unit: 'Unit 3 - Is your diet healthy?', description: 'Understanding fractions, equivalent fractions, and mixed numbers. Comparing fractions.' },
  'Números Decimales': { topic: 'Decimal Numbers', unit: 'Unit 3 - Is your diet healthy?', description: 'Introduction to decimals, reading and writing decimals, comparing decimals.' },
  
  // 5to Básico - Traducciones completas
  'Grandes Números': { topic: 'Large Numbers', unit: 'Unit 1 - Natural numbers, operations and patterns', description: 'Reading, writing, representing and ordering numbers up to one billion (1,000,000,000).' },
  'Estrategias de Cálculo': { topic: 'Calculation Strategies', unit: 'Unit 1 - Natural numbers, operations and patterns', description: 'Solving combined operations respecting order of operations and using calculator.' },
  'Patrones y Secuencias': { topic: 'Patterns and Sequences', unit: 'Unit 1 - Natural numbers, operations and patterns', description: 'Identifying formation rules in numerical sequences and predicting terms.' },
  'Unidades de Medida': { topic: 'Units of Measurement', unit: 'Unit 2 - Geometry and measurement', description: 'Measuring lengths and converting between millimeters, centimeters, meters and kilometers.' },
  'Figuras Geométricas y Congruencia': { topic: 'Geometric Shapes and Congruence', unit: 'Unit 2 - Geometry and measurement', description: 'Identifying parallel and perpendicular lines, and recognizing congruent figures (same shape and size).' },
  'Área y Perímetro': { topic: 'Area and Perimeter', unit: 'Unit 2 - Geometry and measurement', description: 'Calculating areas of rectangles, squares, triangles and composite figures.' },
  'Plano Cartesiano': { topic: 'Cartesian Plane', unit: 'Unit 2 - Geometry and measurement', description: 'Locating points and figures using coordinates in the first quadrant.' },
  'Operaciones con Fracciones': { topic: 'Operations with Fractions', unit: 'Unit 3 - Fractions, decimals and algebra', description: 'Addition and subtraction of fractions with different denominators.' },
  'Álgebra (Ecuaciones)': { topic: 'Algebra (Equations)', unit: 'Unit 3 - Fractions, decimals and algebra', description: 'Introduction to algebraic expressions and solving simple equations and inequalities.' },
  'Datos y Probabilidades': { topic: 'Data and Probabilities', unit: 'Unit 4 - Data and probabilities', description: 'Interpreting bar and line graphs; calculating averages and stem-and-leaf diagrams.' },
  
  // 5to Básico - Lenguaje
  'El Arte de Contar Historias': { topic: 'The Art of Storytelling', unit: 'Unit 1 - Can words change the world?', description: 'Reading stories and short stories, focusing on narrative sequence and consequences of character actions.' },
  'Textos Informativos y Noticias': { topic: 'Informative Texts and News', unit: 'Unit 1 - Can words change the world?', description: 'Analyzing informative articles and news on current topics (e.g., environment) to distinguish facts from opinions.' },
  'Biografías y Creatividad': { topic: 'Biographies and Creativity', unit: 'Unit 2 - What can we do with imagination and creativity?', description: 'Reading about lives of inventors and creators, and writing texts to express well-founded opinions.' },
  'La Novela y el Viaje': { topic: 'The Novel and the Journey', unit: 'Unit 3 - Do we like to travel?', description: 'Reading novel excerpts (e.g., "Journey to the Center of the Earth", "Charlie and the Chocolate Factory") analyzing conflict and setting.' },
  'Poesía y Naturaleza': { topic: 'Poetry and Nature', unit: 'Unit 4 - How do we relate to nature?', description: 'Interpreting figurative language in poems and calligrams.' },
  'Texto Dramático': { topic: 'Dramatic Text', unit: 'Unit 4 - How do we relate to nature?', description: 'Reading plays, recognizing dramatic conflict, dialogue and stage directions.' },
  
  // 5to Básico - Ciencias
  'El Agua en el Planeta': { topic: 'Water on the Planet', unit: 'Unit 1 - Water on the planet', description: 'Distribution of fresh and salt water; characteristics of oceans and lakes (depth, pressure, luminosity).' },
  'Usos y Cuidado del Agua': { topic: 'Uses and Water Conservation', unit: 'Unit 1 - Water on the planet', description: 'Importance of freshwater reserves and effects of human activity (pollution).' },
  'Sistemas del Cuerpo Humano': { topic: 'Human Body Systems', unit: 'Unit 2 - How does our body work?', description: 'Levels of biological organization (cell to organism). Function of digestive, circulatory and respiratory systems.' },
  'Nutrición y Alimentación': { topic: 'Nutrition and Diet', unit: 'Unit 2 - How does our body work?', description: 'Classifying foods by nutrients and analyzing nutritional labeling for a balanced diet.' },
  'Salud y Microorganismos': { topic: 'Health and Microorganisms', unit: 'Unit 3 - Healthy living', description: 'Effects of tobacco use. Characteristics of bacteria and viruses; diseases and prevention.' },
  'La Energía Eléctrica': { topic: 'Electrical Energy', unit: 'Unit 4 - Electrical energy', description: 'Circuits, conductors, insulators, energy sources and electrical safety.' },
  
  // 5to Básico - Historia
  'Conquista y Exploración': { topic: 'Conquest and Exploration', unit: 'Unit 1 - Discovery and Conquest', description: 'European expeditions, conquest of America, encounter between cultures.' },
  'Chile Colonial': { topic: 'Colonial Chile', unit: 'Unit 2 - Colonial Period', description: 'Colonial society, institutions, daily life during Spanish rule.' },
  'Proceso de Independencia': { topic: 'Independence Process', unit: 'Unit 3 - Independence', description: 'Causes, key figures, and events leading to Chilean independence.' },
  
  // 6to Básico - Traducciones completas
  'La Célula': { topic: 'The Cell', unit: 'Unit 1 - The Cell', description: 'Cell structure, organelles, functions, and differences between plant and animal cells.' },
  'Pubertad y Reproducción': { topic: 'Puberty and Reproduction', unit: 'Unit 2 - Human Reproduction', description: 'Physical and emotional changes during puberty, reproductive system, and healthy development.' },
  'Energía': { topic: 'Energy', unit: 'Unit 3 - Energy', description: 'Types of energy, transformations, sources, and conservation.' },
  'Transferencia de Energía': { topic: 'Energy Transfer', unit: 'Unit 3 - Energy', description: 'Heat transfer, conduction, convection, radiation, and thermal equilibrium.' },
  'Capas de la Tierra': { topic: 'Earth Layers', unit: 'Unit 4 - Planet Earth', description: 'Internal structure of Earth, tectonic plates, earthquakes and volcanoes.' },
  
  // 7mo Básico - Traducciones completas
  'Números Racionales': { topic: 'Rational Numbers', unit: 'Unit 1 - Numbers', description: 'Fractions, decimals, negative numbers, and operations with rational numbers.' },
  'Expresiones Algebraicas': { topic: 'Algebraic Expressions', unit: 'Unit 2 - Algebra', description: 'Variables, terms, simplifying expressions, and evaluating algebraic expressions.' },
  'Ecuaciones e Inecuaciones': { topic: 'Equations and Inequalities', unit: 'Unit 2 - Algebra', description: 'Solving linear equations and inequalities, word problems.' },
  'Proporcionalidad': { topic: 'Proportionality', unit: 'Unit 3 - Proportions', description: 'Direct and inverse proportionality, percentages, and applications.' },
  'Transformaciones Geométricas': { topic: 'Geometric Transformations', unit: 'Unit 4 - Geometry', description: 'Translations, rotations, reflections, and dilations of figures.' },
  'Volumen': { topic: 'Volume', unit: 'Unit 4 - Geometry', description: 'Calculating volume of prisms, cylinders, and composite solids.' },
  
  // 8vo Básico - Traducciones completas
  'Potencias': { topic: 'Powers', unit: 'Unit 1 - Numbers', description: 'Exponents, properties of powers, scientific notation.' },
  'Raíces': { topic: 'Roots', unit: 'Unit 1 - Numbers', description: 'Square roots, cube roots, and operations with roots.' },
  'Funciones': { topic: 'Functions', unit: 'Unit 2 - Algebra', description: 'Function concept, domain, range, linear functions, and graphing.' },
  'Teorema de Pitágoras': { topic: 'Pythagorean Theorem', unit: 'Unit 3 - Geometry', description: 'Pythagorean theorem, applications, and distance calculations.' },
  'Transformaciones y Congruencia': { topic: 'Transformations and Congruence', unit: 'Unit 3 - Geometry', description: 'Congruent figures, transformations, and similarity.' },
  
  // Enseñanza Media - Ciencias adicionales
  'Estructura Celular': { topic: 'Cell Structure', unit: 'Biology', description: 'Cell organelles, membrane, nucleus, and cellular processes.' },
  'Metabolismo': { topic: 'Metabolism', unit: 'Biology', description: 'Energy production, enzymes, photosynthesis, and cellular respiration.' },
  'División Celular': { topic: 'Cell Division', unit: 'Biology', description: 'Mitosis, meiosis, cell cycle, and chromosome behavior.' },
  'Genética Molecular': { topic: 'Molecular Genetics', unit: 'Biology', description: 'DNA structure, replication, transcription, and translation.' },
  
  // 7mo Básico - Traducciones completas adicionales
  'Los Gases y sus Leyes': { topic: 'Gases and Their Laws', unit: 'Unit 1 - Surrounded by ever-changing matter!', description: 'Gas behavior and kinetic molecular theory. Ideal gas laws (Boyle, Charles, Gay-Lussac).' },
  'Fuerza y Presión': { topic: 'Force and Pressure', unit: 'Unit 2 - May the force be with you!', description: 'Effects of forces (change in shape or motion). Types of forces: friction, gravitational, elastic. Concept of pressure in solids, liquids and gases.' },
  'Dinámica Terrestre': { topic: 'Earth Dynamics', unit: 'Unit 2 - May the force be with you!', description: 'Tectonic plate model to explain earthquakes, tsunamis and volcanic eruptions. The rock cycle.' },
  'Microorganismos y Barreras Defensivas': { topic: 'Microorganisms and Defensive Barriers', unit: 'Unit 3 - A microscopic world!', description: 'Types of microorganisms (bacteria, viruses, fungi) and their effects on health. Immune system and use of vaccines.' },
  'Sexualidad y Autocuidado': { topic: 'Sexuality and Self-care', unit: 'Unit 4 - Growing responsibly!', description: 'Menstrual cycle, fertilization and birth control methods. Prevention of Sexually Transmitted Infections (STIs).' },
  
  // 7mo Básico - Historia
  'Evolución y Hominización': { topic: 'Evolution and Hominization', unit: 'Unit 1 - Origins of the human being', description: 'Process of biological and cultural evolution (Paleolithic). Dispersal of Homo sapiens across the planet and theories of American settlement.' },
  'Revolución del Neolítico': { topic: 'Neolithic Revolution', unit: 'Unit 1 - Origins of the human being', description: 'Discovery of agriculture and livestock. Transition from nomadism to sedentarism and emergence of the first cities and civilizations.' },
  'Civilizaciones Clásicas: Grecia': { topic: 'Classical Civilizations: Greece', unit: 'Unit 2 - Classical civilizations', description: 'The Mediterranean Sea as a space for exchange. The Greek polis and the development of Democracy in Athens.' },
  'Civilizaciones Clásicas: Roma': { topic: 'Classical Civilizations: Rome', unit: 'Unit 2 - Classical civilizations', description: 'The Roman Republic and Empire. Romanization, Roman law and the spread of Christianity.' },
  'La Edad Media': { topic: 'The Middle Ages', unit: 'Unit 3 - Western European civilization', description: 'Formation of Europe: fusion of Greco-Roman, Judeo-Christian and Germanic traditions. Feudalism and the role of the Catholic Church.' },
  'Civilizaciones de América': { topic: 'American Civilizations', unit: 'Unit 4 - American civilizations', description: 'Political, social and economic organization of Mayans, Aztecs and Incas. Their cultural and technological legacy.' },
  
  // 8vo Básico - Matemáticas
  'Números Enteros (Z)': { topic: 'Integers (Z)', unit: 'Unit 1 - Numbers', description: 'Multiplication and division of positive and negative numbers applying the rule of signs.' },
  'Números Racionales (Q)': { topic: 'Rational Numbers (Q)', unit: 'Unit 1 - Numbers', description: 'Operations with fractions and decimal numbers. Conversion between fractions and decimals.' },
  'Potencias y Raíces': { topic: 'Powers and Roots', unit: 'Unit 1 - Numbers', description: 'Properties of powers with integer exponents. Square roots and cube roots.' },
  'Variaciones Porcentuales': { topic: 'Percentage Variations', unit: 'Unit 1 - Numbers', description: 'Calculating percentage increases and decreases. Applications to discounts, interest and taxes.' },
  'Álgebra y Ecuaciones': { topic: 'Algebra and Equations', unit: 'Unit 2 - Algebra and functions', description: 'Solving linear equations with one unknown and simple systems of equations.' },
  'Estadística Descriptiva': { topic: 'Descriptive Statistics', unit: 'Unit 4 - Probability and statistics', description: 'Measures of central tendency (mean, median, mode) and dispersion (range). Histograms and frequency tables.' },
  'Probabilidades': { topic: 'Probabilities', unit: 'Unit 4 - Probability and statistics', description: 'Classic probability. Compound events (addition and multiplication rules).' },
  'Área y Volumen de Cuerpos Redondos': { topic: 'Area and Volume of Round Bodies', unit: 'Unit 3 - Geometry', description: 'Calculating the area and volume of cylinders, cones and spheres.' },
  
  // 4to Básico - Lenguaje adicionales
  'Cuentos y Novelas (Narrativa)': { topic: 'Stories and Novels (Narrative)', unit: 'Unit 1 - The power of books', description: 'Reading novels and stories for children, analyzing characters, setting and plot.' },
  'La Infografía': { topic: 'Infographics', unit: 'Unit 1 - The power of books', description: 'Reading and creating infographics to present information visually.' },
  'Poesía y Lenguaje Figurado': { topic: 'Poetry and Figurative Language', unit: 'Unit 2 - Everyone is special', description: 'Interpreting metaphors, comparisons and personifications in poems.' },
  'Artículos Informativos': { topic: 'Informative Articles', unit: 'Unit 2 - Everyone is special', description: 'Reading articles to extract main and secondary ideas. Text structure.' },
  'La Noticia': { topic: 'The News', unit: 'Unit 3 - There\'s room for everyone', description: 'News structure (headline, lead, body). Distinguishing facts from opinions.' },
  'Biografía y Autobiografía': { topic: 'Biography and Autobiography', unit: 'Unit 5 - And now... what do I do?', description: 'Reading lives of notable people. Writing about one\'s own life.' },
  
  // 4to Básico - Ciencias Naturales (temas exactos del currículo)
  'Materia y Fuerza': { topic: 'Matter and Force', unit: 'Unit 1 - Exploring Matter and Forces', description: 'Measurement of mass and volume. States of matter (solid, liquid, gas). Effects of forces (friction, magnetic, weight) on objects.' },
  'La Tierra y sus Capas': { topic: 'The Earth and Its Layers', unit: 'Unit 2 - Discovering Earth\'s Structure', description: 'Model of Earth\'s layers (crust, mantle, core). Tectonic plates and their movements (earthquakes, tsunamis, volcanoes).' },
  'Sistema Esquelético y Nervioso': { topic: 'Skeletal and Nervous System', unit: 'Unit 3 - Moving and Caring for My Body', description: 'Function of bones, muscles and joints in movement. The nervous system (brain, nerves) and effects of alcohol on the body.' },
  'Ecosistemas': { topic: 'Ecosystems', unit: 'Unit 4 - Analyzing Living Beings in Their Environment', description: 'Relationship between living beings (biotic) and non-living (abiotic) factors. Food chains and adaptations of plants and animals to their environment.' },
  // 4to Básico - Ciencias (adicionales)
  'Ecosistemas Chilenos': { topic: 'Chilean Ecosystems', unit: 'Unit 1 - Living beings and their environment', description: 'Identifying ecosystems of Chile (desert, Mediterranean, rainy). Adaptations of organisms.' },
  'Cuerpo Humano: Sistemas': { topic: 'Human Body: Systems', unit: 'Unit 2 - How does our body work?', description: 'Function and structure of skeletal, muscular, nervous and locomotor systems.' },
  'La Materia': { topic: 'Matter', unit: 'Unit 3 - What is matter?', description: 'Physical and chemical properties of matter. State changes, mass and volume. Mixtures and pure substances.' },
  'Fuerza y Movimiento': { topic: 'Force and Motion', unit: 'Unit 4 - Forces in nature', description: 'Contact and distance forces. Friction and its effects on objects in motion.' },
  
  // 4to Básico - Historia
  'Civilización Maya': { topic: 'Mayan Civilization', unit: 'Unit 1 - Ancient American Civilizations', description: 'Location and organization of Mayan cities. Writing (glyphs), calendar and mathematical system (zero).' },
  'Civilización Azteca': { topic: 'Aztec Civilization', unit: 'Unit 2 - Mayans and Aztecs', description: 'Location on Lake Texcoco, empire formation, farming technique (chinampas), war and rituals.' },
  'Civilización Inca': { topic: 'Inca Civilization', unit: 'Unit 3 - The Incas', description: 'Location in the Andes, the Tahuantinsuyo, road system, terrace farming and work system (mita).' },
  'Derechos y Democracia': { topic: 'Rights and Democracy', unit: 'Unit 4 - Community participation', description: 'Children\'s rights and duties. Democratic organization of Chile (President, Mayors, Senators) and citizen participation.' },
  
  // 8vo Básico - Historia completas
  'Edad Moderna y Humanismo': { topic: 'Modern Age and Humanism', unit: 'Unit 1 - The Modern Age', description: 'Change of mentality from Theocentrism to Anthropocentrism. Artistic Renaissance, Scientific Revolution and Religious Reformation.' },
  'Estado Moderno y Mercantilismo': { topic: 'Modern State and Mercantilism', unit: 'Unit 1 - The Modern Age', description: 'Rise of absolute monarchies, centralization of power and European commercial expansion (exploration voyages).' },
  'Sociedad Colonial': { topic: 'Colonial Society', unit: 'Unit 2 - Colonial Society', description: 'Social organization (caste system), role of the Church, evangelization and daily life in the colony.' },
  'Relación Hispano-Indígena': { topic: 'Spanish-Indigenous Relations', unit: 'Unit 2 - Colonial Society', description: 'Frontier life, Arauco War (raids and counter-raids), parliaments and cultural and biological mestizaje.' },
  'Ilustración y Revoluciones': { topic: 'Enlightenment and Revolutions', unit: 'Unit 3 - Enlightened ideas and revolutions', description: 'Enlightenment thought (reason, liberty, equality) and its influence on US Independence and the French Revolution.' },
  'Independencia de Chile': { topic: 'Chilean Independence', unit: 'Unit 3 - Enlightened ideas and revolutions', description: 'Multiple causes of the process (external and internal), stages of independence and early republican challenges.' },
  'Regiones de Chile': { topic: 'Regions of Chile', unit: 'Unit 4 - The region in America and Chile', description: 'Concept of region (natural, cultural, economic). Productive diversity and challenges of connectivity and regional development.' },
  
  // 8vo Básico - Ciencias Naturales completas
  'Nutrición y Salud': { topic: 'Nutrition and Health', unit: 'Unit 1 - How does our body obtain energy?', description: 'Digestive system and nutrient absorption. Healthy eating, eating disorders and diseases like obesity and diabetes.' },
  'Circulación y Respiración': { topic: 'Circulation and Respiration', unit: 'Unit 1 - How does our body obtain energy?', description: 'Circulatory system (heart, blood, vessels) and respiratory system (gas exchange). Diseases and healthy habits.' },
  'Sexualidad Humana': { topic: 'Human Sexuality', unit: 'Unit 2 - From gametes to a new organism', description: 'Male and female reproductive systems. Menstrual cycle, fertilization and embryonic development.' },
  'Prevención y Autocuidado Sexual': { topic: 'Prevention and Sexual Self-care', unit: 'Unit 2 - From gametes to a new organism', description: 'Sexually transmitted infections, contraceptive methods and responsible sexuality.' },
  'Electricidad y Circuitos': { topic: 'Electricity and Circuits', unit: 'Unit 3 - Electric energy around us', description: 'Electric current, voltage and resistance. Series and parallel circuits. Electrical safety.' },
  'Electromagnetismo': { topic: 'Electromagnetism', unit: 'Unit 3 - Electric energy around us', description: 'Relationship between electricity and magnetism. Electromagnets and their applications.' },
  'El Universo': { topic: 'The Universe', unit: 'Unit 4 - We are part of the Universe', description: 'Structure of the universe, types of galaxies, stars and their life cycle. Big Bang theory.' },
  'Sistema Solar y Exploración Espacial': { topic: 'Solar System and Space Exploration', unit: 'Unit 4 - We are part of the Universe', description: 'Formation of the solar system, characteristics of planets and space missions.' },
  
  // 8vo Básico - Lenguaje completas
  'Narrativa: La Aventura': { topic: 'Narrative: Adventure', unit: 'Unit 1 - The call of adventure', description: 'Reading adventure novels and stories. Analysis of the hero\'s journey, setting and conflict.' },
  'El Artículo de Opinión': { topic: 'Opinion Articles', unit: 'Unit 2 - What do you believe in?', description: 'Structure of argumentative texts. Identifying thesis, arguments and rhetorical strategies.' },
  'Poesía: Figuras Literarias': { topic: 'Poetry: Literary Figures', unit: 'Unit 3 - Words that transform', description: 'Interpretation of metaphors, hyperboles, personifications and other literary devices in poems.' },
  'Teatro y Dramatización': { topic: 'Theater and Drama', unit: 'Unit 4 - Power of the stage', description: 'Reading plays. Elements of drama: dialogue, stage directions, acts and scenes.' },
  
  // 5to Básico - Historia completas
  'Geografía de América': { topic: 'Geography of the Americas', unit: 'Unit 1 - American diversity', description: 'Physical and political map of America. Natural regions, climates and natural resources.' },
  'Pueblos Originarios de Chile': { topic: 'Indigenous Peoples of Chile', unit: 'Unit 2 - First inhabitants', description: 'Nomadic and sedentary peoples. Culture, customs and current situation of indigenous peoples.' },
  'Descubrimiento y Conquista': { topic: 'Discovery and Conquest', unit: 'Unit 3 - Europeans in America', description: 'Voyages of exploration, Spanish conquest and encounter of cultures.' },
  'La Colonia en Chile': { topic: 'Colonial Chile', unit: 'Unit 4 - Colonial life', description: 'Colonial society, institutions, economy and daily life during Spanish rule.' },
  
  // 5to Básico - Ciencias completas
  'Sistema Digestivo y Nutrición': { topic: 'Digestive System and Nutrition', unit: 'Unit 1 - Nutrition', description: 'Organs of the digestive system, digestion process and importance of a balanced diet.' },
  'Sistema Respiratorio y Circulatorio': { topic: 'Respiratory and Circulatory Systems', unit: 'Unit 2 - Transport in our body', description: 'Oxygen transport, gas exchange and blood circulation.' },
  'Electricidad': { topic: 'Electricity', unit: 'Unit 3 - Electricity', description: 'Electric circuits, conductors and insulators, electrical safety.' },
  'Capas de la Tierra': { topic: 'Layers of the Earth', unit: 'Unit 4 - Our planet', description: 'Internal structure of the Earth, tectonic plates and geological phenomena.' },
  
  // 6to Básico - Historia completas
  'Independencia de América': { topic: 'American Independence', unit: 'Unit 1 - Independence', description: 'Causes and processes of independence in Spanish American colonies.' },
  'República de Chile': { topic: 'Republic of Chile', unit: 'Unit 2 - Building a nation', description: 'Organization of the Republic, early presidents and territorial conflicts.' },
  'Expansión Territorial': { topic: 'Territorial Expansion', unit: 'Unit 3 - Growth', description: 'War of the Pacific, colonization of the south and incorporation of Easter Island.' },
  'Democracia y Ciudadanía': { topic: 'Democracy and Citizenship', unit: 'Unit 4 - Participation', description: 'Democratic institutions, citizen rights and duties, civic participation.' },
  
  // 6to Básico - Ciencias completas
  'Pubertad y Reproducción': { topic: 'Puberty and Reproduction', unit: 'Unit 1 - Changes in puberty', description: 'Physical and emotional changes during puberty, reproductive systems.' },
  'Niveles de Organización': { topic: 'Levels of Organization', unit: 'Unit 2 - Organization of life', description: 'From cells to organisms, tissues, organs and systems.' },
  'Energía y Transformaciones': { topic: 'Energy and Transformations', unit: 'Unit 3 - Energy', description: 'Types of energy, transformations and conservation of energy.' },
  'Formación del Suelo': { topic: 'Soil Formation', unit: 'Unit 4 - The Earth', description: 'Components of soil, erosion and importance of soil conservation.' },
  
  // 1ro Medio - Historia completas
  'Evolución y Poblamiento': { topic: 'Evolution and Settlement', unit: 'Unit 1 - Origins', description: 'Theories of human evolution and settlement of the Americas.' },
  'Primeras Civilizaciones': { topic: 'First Civilizations', unit: 'Unit 2 - Ancient civilizations', description: 'Mesopotamia, Egypt, and river valley civilizations.' },
  'Grecia Clásica': { topic: 'Classical Greece', unit: 'Unit 3 - Mediterranean world', description: 'Greek polis, democracy, philosophy, art and culture.' },
  'Roma Imperial': { topic: 'Imperial Rome', unit: 'Unit 4 - Roman world', description: 'Roman Republic and Empire, law, engineering and expansion.' },
  
  // 1ro Medio - Ciencias completas
  'Evolución y Biodiversidad': { topic: 'Evolution and Biodiversity', unit: 'Unit 1 - Evolution', description: 'Evidence of evolution, natural selection and origin of species.' },
  'Ecología y Ecosistemas': { topic: 'Ecology and Ecosystems', unit: 'Unit 2 - Ecosystems', description: 'Population dynamics, biological interactions and energy flow.' },
  'Flujo de Materia y Energía': { topic: 'Matter and Energy Flow', unit: 'Unit 3 - Biogeochemical cycles', description: 'Carbon, nitrogen and water cycles, photosynthesis and respiration.' },
  
  // 5to Básico - Ciencias Naturales completas
  'Reproducción y Pubertad': { topic: 'Reproduction and Puberty', unit: 'Unit 1 - Reproduction and health', description: 'Physical and hormonal changes during puberty (secondary sexual characteristics). Structure and function of male and female reproductive systems.' },
  'Vida Saludable y Drogas': { topic: 'Healthy Living and Drugs', unit: 'Unit 1 - Reproduction and health', description: 'Importance of hygiene and physical activity. Harmful effects of drug use (alcohol, tobacco, marijuana) on the body.' },
  'Fotosíntesis y Cadenas Tróficas': { topic: 'Photosynthesis and Food Chains', unit: 'Unit 2 - Interactions in ecosystems', description: 'Plant requirements (water, light, CO2) to produce food. Energy flow in food chains and webs (producers, consumers, decomposers).' },
  'Materia y Cambios de Estado': { topic: 'Matter and State Changes', unit: 'Unit 3 - Matter and its changes', description: 'Particle model to explain states of matter (solid, liquid, gas) and their changes due to temperature (heat).' },
  'Energía y Recursos': { topic: 'Energy and Resources', unit: 'Unit 4 - Energy', description: 'Different forms of energy (kinetic, potential, thermal, light) and their transformations. Renewable and non-renewable energy resources in Chile.' },
  'Capas de la Tierra y Suelo': { topic: 'Earth Layers and Soil', unit: 'Unit 5 - Earth layers', description: 'Characteristics of atmosphere, hydrosphere and lithosphere. Soil formation, soil types and erosion caused by natural and human agents.' },
  
  // 5to Básico - Lenguaje completas
  'Narrativa y Mundo Natural': { topic: 'Narrative and Natural World', unit: 'Unit 1 - What is humanity\'s relationship with nature?', description: 'Reading stories (e.g., "The Jungle Book") to analyze narrator, characters and setting.' },
  'Mitos y Leyendas': { topic: 'Myths and Legends', unit: 'Unit 1 - What is humanity\'s relationship with nature?', description: 'Reading origin stories to understand different cultures\' worldviews and creative myth writing.' },
  'Poesía y Autobiografía': { topic: 'Poetry and Autobiography', unit: 'Unit 2 - What makes you special and different?', description: 'Interpreting figurative language in poems (décimas) and analyzing autobiographical texts to recognize the author\'s voice.' },
  'Novelas y Motivaciones': { topic: 'Novels and Motivations', unit: 'Unit 3 - What is your life\'s adventure?', description: 'Reading adventure novels; analyzing motivations and attitudes of main and secondary characters.' },
  'Comentario Literario': { topic: 'Literary Commentary', unit: 'Unit 3 - What is your life\'s adventure?', description: 'Writing well-founded opinion texts about readings (literary commentaries).' },
  'Texto Dramático y Opinión': { topic: 'Drama and Opinion', unit: 'Unit 4 - How do you want to change the world?', description: 'Reading dramatic works (theater) recognizing conflict and dialogue. Analysis of opinion texts and propaganda.' },
  
  // 5to Básico - Historia completas
  'Democracia y Constitución': { topic: 'Democracy and Constitution', unit: 'Unit 1 - Chile, a democratic country', description: 'Democratic system, constitution, powers of the state and citizen participation.' },
  'Derechos y Deberes': { topic: 'Rights and Duties', unit: 'Unit 1 - Chile, a democratic country', description: 'Citizen rights and duties. Human rights and their protection.' },
  'Organización de la República y Siglo XIX': { topic: 'Republic Organization and 19th Century', unit: 'Unit 2 - Building the republic', description: 'Organization of the Chilean republic. Conservative and liberal governments. Expansion and modernization.' },
  'Expansión Territorial': { topic: 'Territorial Expansion', unit: 'Unit 2 - Building the republic', description: 'War of the Pacific, occupation of Araucanía and incorporation of Easter Island.' },
  'Chile en el Siglo XX': { topic: 'Chile in the 20th Century', unit: 'Unit 3 - Chile in the 20th century', description: 'Major social, political and economic transformations of Chile in the 20th century.' },
  'Geografía Regional y Desastres': { topic: 'Regional Geography and Disasters', unit: 'Unit 4 - Geography of Chile', description: 'Regions of Chile, natural resources and natural disasters (earthquakes, tsunamis, volcanoes).' },
  
  // 6to Básico - Ciencias Naturales completas
  'Energía en los Sistemas': { topic: 'Energy in Systems', unit: 'Unit 1 - Energy', description: 'Forms of energy, transformations, and conservation. Renewable and non-renewable energy sources.' },
  'Fuerzas en la Naturaleza': { topic: 'Forces in Nature', unit: 'Unit 2 - Forces', description: 'Types of forces, effects on objects, and simple machines.' },
  'La Tierra y el Universo': { topic: 'Earth and Universe', unit: 'Unit 3 - The universe', description: 'Solar system, Earth movements, moon phases and eclipses.' },
  
  // 6to Básico - Lenguaje completas
  'Narrativa de Ciencia Ficción': { topic: 'Science Fiction Narrative', unit: 'Unit 1 - Other worlds', description: 'Reading science fiction stories. Analysis of setting, technology and social criticism.' },
  'Argumentación': { topic: 'Argumentation', unit: 'Unit 2 - Debating ideas', description: 'Structure of argumentative texts. Thesis, arguments and counterarguments.' },
  'Poesía Lírica': { topic: 'Lyric Poetry', unit: 'Unit 3 - Expressing feelings', description: 'Analysis of poems, metaphors, similes and poetic imagery.' },
  'Teatro y Dramatización': { topic: 'Theater and Drama', unit: 'Unit 4 - Acting', description: 'Reading and performing plays. Dialogue, characters and staging.' },
  
  // 6to Básico - Historia completas
  'Civilizaciones Americanas': { topic: 'American Civilizations', unit: 'Unit 1 - Pre-Columbian America', description: 'Maya, Aztec and Inca civilizations. Their organization, achievements and legacy.' },
  'La Conquista Española': { topic: 'Spanish Conquest', unit: 'Unit 2 - Encounter of worlds', description: 'Spanish conquest of America. Cultural encounter and its consequences.' },
  'La Colonia': { topic: 'The Colony', unit: 'Unit 3 - Colonial life', description: 'Colonial society, economy, culture and daily life.' },
  'Independencia de América': { topic: 'American Independence', unit: 'Unit 4 - Independence', description: 'Causes and processes of independence in Spanish American colonies.' },
  
  // 8vo Básico - Lenguaje y Comunicación completas
  'El Amor en la Literatura': { topic: 'Love in Literature', unit: 'Unit 1 - Where does love begin?', description: 'Reading classic works (e.g., "Tristan and Isolde") and contemporary texts; analysis of conflict and characters.' },
  'La Entrevista': { topic: 'The Interview', unit: 'Unit 1 - Where does love begin?', description: 'Distinguishing between facts and opinions in journalistic dialogue texts.' },
  'Misterio y Comedia': { topic: 'Mystery and Comedy', unit: 'Unit 2 - Is everything as it seems?', description: 'Reading detective stories and dramatic works (comedies) that present social criticism.' },
  'Argumentación y Medios': { topic: 'Argumentation and Media', unit: 'Unit 2 - Is everything as it seems?', description: 'Analysis of fake news and argumentative texts; identifying thesis and arguments.' },
  'La Épica y el Héroe': { topic: 'The Epic and the Hero', unit: 'Unit 3 - What remains of the past?', description: 'Reading epics (like The Odyssey or The Iliad) and recognizing classical hero values.' },
  'Poesía y Naturaleza': { topic: 'Poetry and Nature', unit: 'Unit 3 - What remains of the past?', description: 'Interpreting poems that address the passage of time and relationship with the land.' },
  'Ciencia Ficción y Distopía': { topic: 'Science Fiction and Dystopia', unit: 'Unit 4 - Where does the future go?', description: 'Reading futuristic stories that question the role of technology and society.' },
  'Discurso Público': { topic: 'Public Speech', unit: 'Unit 4 - Where does the future go?', description: 'Analysis of public speaking situations and persuasion resources in speeches about global topics.' },
  
  // 7mo Básico - Lenguaje y Comunicación completas
  'El Héroe en Distintas Épocas': { topic: 'The Hero in Different Eras', unit: 'Unit 1 - Who are the heroes?', description: 'Reading narratives from different time periods to compare hero models and values.' },
  'Artículos Informativos y Noticias': { topic: 'Informative Articles and News', unit: 'Unit 1 - Who are the heroes?', description: 'Reading journalistic texts to identify main ideas and distinguish facts from opinions.' },
  'Relatos de Terror': { topic: 'Horror Stories', unit: 'Unit 2 - What scares us?', description: 'Reading horror narratives analyzing atmosphere, suspense and narrative techniques.' },
  'Textos Publicitarios y Propaganda': { topic: 'Advertising and Propaganda Texts', unit: 'Unit 2 - What scares us?', description: 'Analysis of advertising strategies and propaganda techniques in media.' },
  'Teatro: Orígenes y Comedia': { topic: 'Theater: Origins and Comedy', unit: 'Unit 3 - Who makes us laugh?', description: 'Reading theatrical works from their origins to modern comedy.' },
  'Infografías': { topic: 'Infographics', unit: 'Unit 3 - Who makes us laugh?', description: 'Creating and analyzing infographics to communicate information visually.' },
  'Relatos de Ciencia Ficción': { topic: 'Science Fiction Stories', unit: 'Unit 4 - What do we imagine?', description: 'Reading science fiction to explore future possibilities and social criticism.' },
  'Discursos Orales y Charlas Radiales': { topic: 'Oral Speeches and Radio Talks', unit: 'Unit 4 - What do we imagine?', description: 'Producing and analyzing oral presentations and radio programs.' },
  
  // 8vo Básico - Ciencias Naturales completas
  'Nutrición y Sistemas del Cuerpo': { topic: 'Nutrition and Body Systems', unit: 'Unit 1 - Nutrition and health', description: 'Integration of digestive, respiratory, circulatory and excretory systems for cellular nutrition.' },
  'Salud y Alimentación': { topic: 'Health and Diet', unit: 'Unit 1 - Nutrition and health', description: 'Analysis of balanced diets, nutritional labeling (seals) and drug prevention.' },
  'La Célula': { topic: 'The Cell', unit: 'Unit 2 - Cell: unit of life', description: 'Cell theory. Differences between prokaryotic and eukaryotic cells, and between plant and animal cells. Organelles (mitochondria, chloroplast, nucleus).' },
  'Electricidad y Circuitos': { topic: 'Electricity and Circuits', unit: 'Unit 3 - Energy on our planet', description: 'Concepts of current, voltage and resistance. Series and parallel circuits. Basic Ohm\'s Law.' },
  'Calor y Temperatura': { topic: 'Heat and Temperature', unit: 'Unit 3 - Energy on our planet', description: 'Difference between heat (energy) and temperature (measurement). Forms of heat propagation and thermal equilibrium.' },
  'Modelos Atómicos': { topic: 'Atomic Models', unit: 'Unit 4 - Matter beyond the visible', description: 'Historical evolution of the atom (Dalton, Thomson, Rutherford, Bohr) and subatomic particles (protons, neutrons, electrons).' },
  'Tabla Periódica': { topic: 'Periodic Table', unit: 'Unit 4 - Matter beyond the visible', description: 'Organization of chemical elements and periodic properties.' },
  
  // 8vo Básico - Historia, Geografía y Ciencias Sociales completas
  'Edad Moderna y Humanismo': { topic: 'Modern Age and Humanism', unit: 'Unit 1 - The Modern Age', description: 'Shift from Theocentrism to Anthropocentrism. Artistic Renaissance, Scientific Revolution and Religious Reformation.' },
  'Estado Moderno y Mercantilismo': { topic: 'Modern State and Mercantilism', unit: 'Unit 1 - The Modern Age', description: 'Rise of absolute monarchies, centralization of power and European commercial expansion (voyages of exploration).' },
  'Sociedad Colonial': { topic: 'Colonial Society', unit: 'Unit 2 - Colonial society', description: 'Social organization (caste system), role of the Church, evangelization and daily life in the colony.' },
  'Relación Hispano-Indígena': { topic: 'Spanish-Indigenous Relations', unit: 'Unit 2 - Colonial society', description: 'Frontier life, War of Arauco (raids and counter-raids), parliaments and cultural and biological mestizaje.' },
  'Ilustración y Revoluciones': { topic: 'Enlightenment and Revolutions', unit: 'Unit 3 - Enlightened ideas and revolutions', description: 'Enlightenment thought (reason, liberty, equality) and its influence on US Independence and the French Revolution.' },
  'Independencia de Chile': { topic: 'Chilean Independence', unit: 'Unit 3 - Enlightened ideas and revolutions', description: 'Multiple causes of independence, stages and republican challenges.' },
  'Regiones de Chile': { topic: 'Regions of Chile', unit: 'Unit 4 - The region in America and Chile', description: 'Regional characteristics, productive activities and development challenges.' },
  
  // 7mo Básico - Ciencias Naturales completas
  'Microorganismos y Barreras del Cuerpo': { topic: 'Microorganisms and Body Barriers', unit: 'Unit 1 - Microorganisms', description: 'Types of microorganisms (bacteria, viruses, fungi). Physical and chemical barriers of defense.' },
  'Sistema Inmunitario': { topic: 'Immune System', unit: 'Unit 1 - Microorganisms', description: 'Specific and non-specific immune response. Vaccines and antibiotics.' },
  'Sexualidad Humana': { topic: 'Human Sexuality', unit: 'Unit 2 - Sexuality and reproduction', description: 'Reproductive systems, menstrual cycle, fertilization and responsible sexuality.' },
  'Fecundación y Desarrollo Embrionario': { topic: 'Fertilization and Embryonic Development', unit: 'Unit 2 - Sexuality and reproduction', description: 'Stages of human development from fertilization to birth.' },
  'Fuerza y Presión': { topic: 'Force and Pressure', unit: 'Unit 3 - Forces in nature', description: 'Types of forces, pressure in fluids and atmospheric pressure.' },
  'El Universo y Modelos': { topic: 'Universe and Models', unit: 'Unit 4 - The universe', description: 'Geocentric and heliocentric models. Origin of the universe and solar system.' },
  
  // 7mo Básico - Historia, Geografía y Ciencias Sociales completas
  'Resurgimiento Urbano y Medieval': { topic: 'Urban and Medieval Resurgence', unit: 'Unit 1 - Middle Ages', description: 'Medieval cities, trade, universities and new social groups.' },
  'Legado Medieval': { topic: 'Medieval Legacy', unit: 'Unit 1 - Middle Ages', description: 'Cultural, political and economic heritage of the Middle Ages.' },
  'Encuentro de Culturas': { topic: 'Encounter of Cultures', unit: 'Unit 2 - Conquest and colonization', description: 'Cultural encounter between Europeans, indigenous peoples and Africans.' },
  'Conquista y Colonia en Chile': { topic: 'Conquest and Colony in Chile', unit: 'Unit 2 - Conquest and colonization', description: 'Spanish conquest of Chile and establishment of colonial institutions.' },
  'Diversidad de Paisajes': { topic: 'Diversity of Landscapes', unit: 'Unit 3 - Geography of Chile', description: 'Natural regions of Chile and their characteristics.' },
  'Riesgos Naturales': { topic: 'Natural Risks', unit: 'Unit 3 - Geography of Chile', description: 'Earthquakes, tsunamis, volcanoes and other natural hazards in Chile.' },
  'Democracia y Participación': { topic: 'Democracy and Participation', unit: 'Unit 4 - Civic formation', description: 'Democratic system, citizen participation and fundamental rights.' },
  
  // 1ro Medio - Matemáticas completas
  'Números Racionales y Potencias': { topic: 'Rational Numbers and Powers', unit: 'Unit 1 - Numbers', description: 'Operations with rational numbers (fractions and decimals), properties of powers and scientific notation. Exponential growth and decay.' },
  'Productos Notables y Factorización': { topic: 'Notable Products and Factorization', unit: 'Unit 2 - Algebra and functions', description: 'Reduction of algebraic expressions and use of notable products (square of binomial, sum by its difference). Factorization of algebraic expressions.' },
  'Sistemas de Ecuaciones Lineales': { topic: 'Systems of Linear Equations', unit: 'Unit 2 - Algebra and functions', description: 'Solving systems of two-variable equations using graphical and algebraic methods (substitution, equalization, reduction).' },
  'Homotecia y Semejanza': { topic: 'Homothety and Similarity', unit: 'Unit 3 - Geometry', description: 'Concept of homothety (enlargement or reduction of figures) and properties of triangle similarity (LLL, SAS, AA criteria). Thales theorem and its applications.' },
  
  // 1ro Medio - Lenguaje completas
  'Héroes y Narrativa': { topic: 'Heroes and Narrative', unit: 'Unit 1 - Heroes and villains', description: 'Reading novels (e.g., Lazarillo de Tormes) and stories. Analysis of narrator, actions and character evolution. Detective and crime stories.' },
  'Argumentación y Sociedad': { topic: 'Argumentation and Society', unit: 'Unit 2 - Cunning and wisdom', description: 'Analysis of argumentative texts (columns, essays) identifying thesis and arguments. Evaluating truthfulness and information quality (Fake news vs. reliable sources).' },
  'Teatro y Conflicto': { topic: 'Theater and Conflict', unit: 'Unit 3 - Family ties', description: 'Reading dramatic works (tragedy and comedy). Analysis of dramatic conflict, characters and staging (e.g., Antigone, La Nona).' },
  'Poesía y Romanticismo': { topic: 'Poetry and Romanticism', unit: 'Unit 4 - Freedom', description: 'Interpretation of lyrical texts, figurative language (metaphors, symbols) and context of literary Romanticism (freedom, feelings).' },
  'Literatura y Contexto': { topic: 'Literature and Context', unit: 'Unit 5 - Literature and context', description: 'Relationship between literary works and their production context (e.g., Frankenstein and 19th century science). Intertextuality.' },
  'Identidad y Medios': { topic: 'Identity and Media', unit: 'Unit 6 - Collective identities', description: 'Analysis of propaganda and advertising. Reflection on personal and collective identity (Latin American, national).' },
  
  // 1ro Medio - Biología completas
  'Evolución y Biodiversidad': { topic: 'Evolution and Biodiversity', unit: 'Unit 1 - How has life evolved on Earth?', description: 'Evidence of evolution (fossils, comparative anatomy, DNA). Natural Selection theory by Darwin and Wallace. Classification of living things (Taxonomy) and human phylogeny.' },
  'Ecología: Interacciones': { topic: 'Ecology: Interactions', unit: 'Unit 2 - How do organisms interact?', description: 'Levels of organization (population, community, ecosystem). Biological interactions (predation, competition, mutualism). Population dynamics (size, density, growth).' },
  'Materia y Energía en Ecosistemas': { topic: 'Matter and Energy in Ecosystems', unit: 'Unit 3 - What happens with matter and energy?', description: 'Energy flow (food chains and webs). Biogeochemical cycles (Carbon, Nitrogen, Water). Photosynthesis and cellular respiration as complementary processes.' },
  
  // 1ro Medio - Física completas
  'Ondas y Sonido': { topic: 'Waves and Sound', unit: 'Unit 1 - Waves and sound', description: 'Nature of waves (frequency, period, wavelength, amplitude). Classification (mechanical/electromagnetic). Sound phenomena: reflection (echo), diffraction, Doppler effect and noise pollution.' },
  'La Luz y Óptica': { topic: 'Light and Optics', unit: 'Unit 2 - Waves and light', description: 'Light propagation, electromagnetic spectrum and colors. Image formation in mirrors (flat, curved) and lenses (convergent, divergent). The human eye and vision.' },
  'Sismos y Tierra': { topic: 'Earthquakes and Earth', unit: 'Unit 3 - Waves and earthquakes', description: 'Internal structure of the Earth (static and dynamic model). Plate tectonics. Origin and propagation of seismic waves (P, S, L, R). Earthquake measurement (magnitude and intensity).' },
  'Universo': { topic: 'Universe', unit: 'Unit 4 - Structures of the universe', description: 'Origin and evolution of the universe (Big Bang). Cosmic structures (galaxies, stars, planetary systems). Astronomical observation in Chile.' },
  
  // 1ro Medio - Química completas
  'Reacciones Químicas': { topic: 'Chemical Reactions', unit: 'Unit 1 - Everyday chemical reactions', description: 'Difference between physical and chemical changes. Evidence of a reaction. Collision theory and factors affecting reaction rate. Law of conservation of matter.' },
  'Estequiometría': { topic: 'Stoichiometry', unit: 'Unit 2 - Chemical reactions and stoichiometry', description: 'Balancing chemical equations. Mole concept and molar mass. Simple stoichiometric calculations and limiting reagent.' },
  'Nomenclatura Inorgánica': { topic: 'Inorganic Nomenclature', unit: 'Unit 3 - Inorganic nomenclature', description: 'Formation and nomenclature of binary (oxides, hydrides, salts) and ternary compounds (hydroxides, acids). Use of oxidation states and IUPAC rules.' },
  
  // 1ro Medio - Historia completas
  'Economía y Mercado': { topic: 'Economy and Market', unit: 'Unit 1 - Economy and society', description: 'The economic problem (scarcity vs. unlimited needs). Market functioning (supply, demand, price setting). Financial instruments, savings and responsible consumption.' },
  'Estado-Nación y Sociedad Burguesa': { topic: 'Nation-State and Bourgeois Society', unit: 'Unit 2 - Building the Nation-State', description: 'Liberal and republican ideology in Europe and America. Bourgeois culture. Formation of the Nation-State in Chile: organization of the Republic and 19th century political debate.' },
  'Progreso e Industrialización': { topic: 'Progress and Industrialization', unit: 'Unit 3 - Unlimited progress', description: 'Industrial Revolution and its economic and social impacts. 19th century European imperialism and the idea of unlimited progress.' },
  'Territorio Chileno': { topic: 'Chilean Territory', unit: 'Unit 4 - Territory configuration', description: 'Territorial expansion of Chile in the 19th century: War of the Pacific (causes and consequences). Occupation of Araucanía and southern colonization. Relationship with indigenous peoples.' },
  'El Cambio de Siglo': { topic: 'The Turn of the Century', unit: 'Unit 5 - Turn of the century in Chile and the world', description: 'The "Social Question" in Chile and the crisis of parliamentarism. World War I and the new global geopolitical order.' },
  
  // 2do Medio - Matemáticas completas
  'Números Reales (Raíces y Logaritmos)': { topic: 'Real Numbers (Roots and Logarithms)', unit: 'Unit 1 - Numbers', description: 'Operations with nth roots and logarithm definition. Relationship between powers, roots and logarithms.' },
  'Ecuación Cuadrática': { topic: 'Quadratic Equation', unit: 'Unit 2 - Algebra and functions', description: 'Solving quadratic equations through factorization, completing the square and quadratic formula.' },
  'Función Cuadrática': { topic: 'Quadratic Function', unit: 'Unit 2 - Algebra and functions', description: 'Analysis of the parabola (concavity, vertex, axis of symmetry) and modeling of quadratic change situations.' },
  'Función Inversa': { topic: 'Inverse Function', unit: 'Unit 2 - Algebra and functions', description: 'Concept of bijectivity and determining the inverse function in linear and quadratic cases (with domain restriction).' },
  'Trigonometría': { topic: 'Trigonometry', unit: 'Unit 3 - Geometry', description: 'Trigonometric ratios in right triangles (sine, cosine, tangent) and solving height and distance problems.' },
  'Probabilidad Condicionada': { topic: 'Conditional Probability', unit: 'Unit 4 - Probability and statistics', description: 'Calculating probabilities when one event affects the occurrence of another. Using tree diagrams and contingency tables.' },
  
  // 2do Medio - Lenguaje completas
  'Narrativa y Migración': { topic: 'Narrative and Migration', unit: 'Unit 1 - About absence: exile and migration', description: 'Reading narrative works that address human displacement. Analysis of anachronies (time jumps) and conflict.' },
  'Medios Masivos y Ciudadanía': { topic: 'Mass Media and Citizenship', unit: 'Unit 2 - Citizenship and work', description: 'Analysis of mass media (newspapers, TV, social networks) and their influence on public opinion. Civic participation.' },
  'Género Dramático y Poder': { topic: 'Dramatic Genre and Power', unit: 'Unit 3 - Power and ambition', description: 'Reading dramatic works exploring themes of power and ambition (e.g., Macbeth, classical tragedies).' },
  'Lírica y Perspectiva de Género': { topic: 'Poetry and Gender Perspective', unit: 'Unit 4 - The feminine', description: 'Reading and analyzing poetry from gender perspectives. Female voices in Latin American literature.' },
  'Investigación y Comunicación Oral': { topic: 'Research and Oral Communication', unit: 'Unit 2/4 - Communication', description: 'Academic research skills and oral presentation techniques. Formal debates and public speaking.' },
  
  // 2do Medio - Biología completas
  'Coordinación y Regulación (Sistema Nervioso)': { topic: 'Coordination and Regulation (Nervous System)', unit: 'Unit 1 - How are our bodies coordinated and regulated?', description: 'Neuron structure, synapse and nerve impulse transmission. Effect of drugs on the brain.' },
  'Sistema Endocrino': { topic: 'Endocrine System', unit: 'Unit 1 - How are our bodies coordinated and regulated?', description: 'Hormone action, blood glucose control (insulin/glucagon) and stress response.' },
  'Sexualidad y Reproducción': { topic: 'Sexuality and Reproduction', unit: 'Unit 2 - Sexuality and reproduction', description: 'Sex hormones, ovarian and uterine cycle. Fertilization, embryonic development and childbirth. Birth control methods.' },
  'Genética y Herencia': { topic: 'Genetics and Heredity', unit: 'Unit 3 - How is genetic material inherited?', description: 'Cell cycle (Mitosis and Meiosis). Mendel\'s laws, genotype, phenotype and genetic manipulation.' },
  
  // 2do Medio - Física completas
  'Movimiento Rectilíneo': { topic: 'Rectilinear Motion', unit: 'Unit 1 - Motion', description: 'Motion description: position, displacement, velocity and acceleration. Graphs of uniform and uniformly accelerated motion.' },
  'Fuerza y Leyes de Newton': { topic: 'Force and Newton\'s Laws', unit: 'Unit 2 - Forces', description: 'Principles of inertia, mass and action-reaction. Free body diagrams and friction force.' },
  'Trabajo y Energía Mecánica': { topic: 'Work and Mechanical Energy', unit: 'Unit 3 - Mechanical energy', description: 'Concept of mechanical work and power. Conservation of mechanical energy (kinetic and gravitational/elastic potential).' },
  'El Universo y el Big Bang': { topic: 'The Universe and the Big Bang', unit: 'Unit 4 - The universe', description: 'Theories about the origin of the universe (Big Bang), cosmic expansion and formation of structures (galaxies, stars).' },
  
  // 2do Medio - Química completas
  'Disoluciones Químicas': { topic: 'Chemical Solutions', unit: 'Unit 1 - Chemical solutions', description: 'Components (solute/solvent), solubility and affecting factors. Physical concentration units (%m/m) and chemical units (Molarity).' },
  'Propiedades Coligativas': { topic: 'Colligative Properties', unit: 'Unit 2 - Colligative properties', description: 'Changes in solvent properties when adding solute: vapor pressure decrease, boiling point elevation, freezing point depression and osmosis.' },
  'Química Orgánica (El Carbono)': { topic: 'Organic Chemistry (Carbon)', unit: 'Unit 3 - Organic chemistry', description: 'Properties of the carbon atom. Hydrocarbons (alkanes, alkenes, alkynes) and functional groups (alcohols, acids, etc.).' },
  'Isomería y Polímeros': { topic: 'Isomerism and Polymers', unit: 'Unit 3 - Organic chemistry', description: 'Compounds with the same molecular formula but different structure. Natural and synthetic polymers.' },
  
  // 2do Medio - Historia completas
  'Crisis del Parlamentarismo y Anarquía': { topic: 'Crisis of Parliamentarism and Anarchy', unit: 'Unit 1 - Crisis, totalitarianism and war', description: 'End of the saltpeter cycle in Chile, 1925 Constitution and the emergence of the middle class and labor movement.' },
  'Totalitarismos y Segunda Guerra Mundial': { topic: 'Totalitarianism and World War II', unit: 'Unit 1 - Crisis, totalitarianism and war', description: 'Rise of fascism and nazism. Development and consequences of World War II and the Holocaust.' },
  'La Guerra Fría': { topic: 'The Cold War', unit: 'Unit 2 - A bipolar world', description: 'US-USSR ideological confrontation. Cuban Revolution and its influence in Latin America.' },
  'Chile a mediados del Siglo XX': { topic: 'Chile in the Mid-20th Century', unit: 'Unit 3 - Chile in the mid-20th century', description: 'ISI model (Industrialization), suffrage expansion (women\'s vote) and the Welfare State in Chile.' },
  'Reformas Estructurales y Quiebre Democrático': { topic: 'Structural Reforms and Democratic Breakdown', unit: 'Unit 4 - Structural reforms and breakdown of democracy', description: 'Agrarian Reform and the "Chilean Path to Socialism". Political polarization, 1973 coup, Military Dictatorship and recovery of democracy.' },
  
  // 3ro Medio - Matemáticas completas
  'Estadística y Probabilidades': { topic: 'Statistics and Probabilities', unit: 'Unit 1 - Decision making in uncertainty', description: 'Measures of dispersion: Range, variance and standard deviation for comparing data sets and making decisions. Conditional and total probability.' },
  'Álgebra y Funciones (Modelamiento)': { topic: 'Algebra and Functions (Modeling)', unit: 'Unit 2 - Mathematical modeling to describe and predict', description: 'Exponential function: Analysis of exponential growth and decay in real phenomena (population, compound interest). Logarithmic function and its properties.' },
  'Geometría (Circunferencia)': { topic: 'Geometry (Circumference)', unit: 'Unit 3 - Metric relationships in the circumference', description: 'Central and inscribed angles; interior and exterior angles. Metric properties of chords, secants and tangents.' },
  'Números (Complejos)': { topic: 'Numbers (Complex)', unit: 'Unit 4 - Complex numbers', description: 'Definition of imaginary unit i, binomial representation, modulus and conjugate. Addition, subtraction, multiplication and division of complex numbers.' },
  
  // 3ro Medio - Lenguaje completas
  'Lectura e Interpretación (Sociedad)': { topic: 'Reading and Interpretation (Society)', unit: 'Unit 1 - Challenges and opportunities', description: 'Critical reading of literary and non-literary texts about social challenges and opportunities in contemporary society.' },
  'Identidad y Cultura': { topic: 'Identity and Culture', unit: 'Unit 2 - Personal identity', description: 'Exploration of personal and cultural identity through literature. Latin American and Chilean authors.' },
  'Emociones y Realidad': { topic: 'Emotions and Reality', unit: 'Unit 3 - Emotions', description: 'Literary texts exploring human emotions and their relationship with reality and society.' },
  'Identidad y Sociedad': { topic: 'Identity and Society', unit: 'Unit 4 - Society', description: 'Analysis of how literature reflects and shapes social identity and collective values.' },
  
  // 3ro Medio - Ciencias para la Ciudadanía completas
  'Salud y Enfermedad': { topic: 'Health and Disease', unit: 'Unit 1 - Health', description: 'Concepts of health and disease. Infectious and non-infectious diseases. Public health policies.' },
  'Prevención de Infecciones': { topic: 'Infection Prevention', unit: 'Unit 1 - Health', description: 'Mechanisms of infection and prevention. Vaccines, antibiotics and antimicrobial resistance.' },
  'Riesgos Socionaturales': { topic: 'Socionatural Risks', unit: 'Unit 2 - Natural risks', description: 'Natural hazards and their social impact. Earthquakes, tsunamis, volcanoes and climate events in Chile.' },
  'Riesgos en el Entorno': { topic: 'Environmental Risks', unit: 'Unit 2 - Natural risks', description: 'Environmental risks and their mitigation. Pollution, climate change and sustainability.' },
  'Consumo Sostenible': { topic: 'Sustainable Consumption', unit: 'Unit 3 - Sustainability', description: 'Sustainable consumption patterns. Circular economy and responsible resource use.' },
  'Innovación Tecnológica': { topic: 'Technological Innovation', unit: 'Unit 4 - Technology', description: 'Technological innovation and its impact on society. Ethics in science and technology.' },
  'Proyectos Tecnológicos': { topic: 'Technological Projects', unit: 'Unit 4 - Technology', description: 'Design and implementation of technological projects to solve community problems.' },
  
  // 4to Medio - Matemáticas completas
  'Decisiones Financieras': { topic: 'Financial Decisions', unit: 'Unit 1 - Financial mathematics', description: 'Simple and compound interest, loans, investments and informed financial decision-making.' },
  'Funciones Trigonométricas y Modelamiento': { topic: 'Trigonometric Functions and Modeling', unit: 'Unit 2 - Trigonometric functions', description: 'Sine, cosine and tangent functions. Modeling periodic phenomena.' },
  'Probabilidades y Distribuciones': { topic: 'Probabilities and Distributions', unit: 'Unit 3 - Probability distributions', description: 'Discrete and continuous probability distributions. Normal distribution and its applications.' },
};

// Función para traducir descripciones de temas al inglés
// Las claves del objeto se traducen para que coincidan con los nombres de temas traducidos
function translateTopicDescriptions(
  descriptions: Record<string, TopicDescription>,
  language: 'es' | 'en'
): Record<string, TopicDescription> {
  if (language === 'es') {
    return descriptions;
  }
  
  const translatedDescriptions: Record<string, TopicDescription> = {};
  
  for (const [key, value] of Object.entries(descriptions)) {
    // Primero intentar traducción exacta del mapeo
    const translation = topicTranslations[key];
    if (translation) {
      // Usar la traducción del mapeo
      translatedDescriptions[translation.topic] = {
        topic: translation.topic,
        unit: translation.unit,
        description: translation.description
      };
    } else {
      // Si no hay traducción exacta, usar traducción automática
      const translatedKey = autoTranslateText(key);
      translatedDescriptions[translatedKey] = autoTranslateDescription(value);
    }
  }
  
  return translatedDescriptions;
}

// Diccionario de palabras comunes español -> inglés para traducciones automáticas
const wordTranslations: Record<string, string> = {
  // Palabras comunes en educación
  'números': 'Numbers', 'numero': 'Number', 'suma': 'Addition', 'resta': 'Subtraction',
  'multiplicación': 'Multiplication', 'división': 'Division', 'fracciones': 'Fractions',
  'fracción': 'Fraction', 'decimales': 'Decimals', 'decimal': 'Decimal',
  'geometría': 'Geometry', 'geometria': 'Geometry', 'álgebra': 'Algebra', 'algebra': 'Algebra',
  'ecuaciones': 'Equations', 'ecuación': 'Equation', 'funciones': 'Functions', 'función': 'Function',
  'patrones': 'Patterns', 'patrón': 'Pattern', 'medidas': 'Measurements', 'medida': 'Measurement',
  'longitud': 'Length', 'perímetro': 'Perimeter', 'perimetro': 'Perimeter', 'área': 'Area', 'area': 'Area',
  'volumen': 'Volume', 'ángulos': 'Angles', 'angulos': 'Angles', 'ángulo': 'Angle', 'angulo': 'Angle',
  'triángulo': 'Triangle', 'triangulo': 'Triangle', 'cuadrado': 'Square', 'círculo': 'Circle', 'circulo': 'Circle',
  'rectángulo': 'Rectangle', 'rectangulo': 'Rectangle', 'polígono': 'Polygon', 'poligono': 'Polygon',
  'gráficos': 'Graphs', 'graficos': 'Graphs', 'gráfico': 'Graph', 'grafico': 'Graph',
  'estadística': 'Statistics', 'estadistica': 'Statistics', 'probabilidad': 'Probability',
  'porcentaje': 'Percentage', 'porcentajes': 'Percentages', 'razones': 'Ratios', 'razón': 'Ratio', 'razon': 'Ratio',
  'proporciones': 'Proportions', 'proporción': 'Proportion', 'proporcion': 'Proportion',
  'potencias': 'Powers', 'potencia': 'Power', 'raíces': 'Roots', 'raices': 'Roots', 'raíz': 'Root', 'raiz': 'Root',
  'vectores': 'Vectors', 'vector': 'Vector', 'matrices': 'Matrices', 'matriz': 'Matrix',
  'límites': 'Limits', 'limites': 'Limits', 'límite': 'Limit', 'limite': 'Limit',
  'derivadas': 'Derivatives', 'derivada': 'Derivative', 'integrales': 'Integrals', 'integral': 'Integral',
  
  // Ciencias
  'célula': 'Cell', 'celula': 'Cell', 'células': 'Cells', 'celulas': 'Cells',
  'sistema': 'System', 'sistemas': 'Systems', 'órganos': 'Organs', 'organos': 'Organs', 'órgano': 'Organ', 'organo': 'Organ',
  'cuerpo': 'Body', 'humano': 'Human', 'humana': 'Human', 'sentidos': 'Senses', 'sentido': 'Sense',
  'animales': 'Animals', 'animal': 'Animal', 'plantas': 'Plants', 'planta': 'Plant',
  'seres': 'Living', 'vivos': 'Things', 'vivo': 'Living',
  'ecosistema': 'Ecosystem', 'ecosistemas': 'Ecosystems', 'hábitat': 'Habitat', 'habitat': 'Habitat',
  'hábitats': 'Habitats', 'habitats': 'Habitats',
  'agua': 'Water', 'ciclo': 'Cycle', 'ciclos': 'Cycles', 'vida': 'Life',
  'materia': 'Matter', 'estados': 'States', 'estado': 'State', 'luz': 'Light', 'sombras': 'Shadows', 'sombra': 'Shadow',
  'energía': 'Energy', 'energia': 'Energy', 'fuerza': 'Force', 'fuerzas': 'Forces',
  'movimiento': 'Motion', 'velocidad': 'Velocity', 'aceleración': 'Acceleration', 'aceleracion': 'Acceleration',
  'ondas': 'Waves', 'onda': 'Wave', 'sonido': 'Sound', 'calor': 'Heat', 'temperatura': 'Temperature',
  'electricidad': 'Electricity', 'eléctrica': 'Electric', 'electrica': 'Electric',
  'eléctrico': 'Electric', 'electrico': 'Electric', 'magnético': 'Magnetic', 'magnetico': 'Magnetic',
  'magnetismo': 'Magnetism', 'circuitos': 'Circuits', 'circuito': 'Circuit',
  'átomo': 'Atom', 'atomo': 'Atom', 'átomos': 'Atoms', 'atomos': 'Atoms',
  'molécula': 'Molecule', 'molecula': 'Molecule', 'moléculas': 'Molecules', 'moleculas': 'Molecules',
  'reacciones': 'Reactions', 'reacción': 'Reaction', 'reaccion': 'Reaction',
  'químicas': 'Chemical', 'quimicas': 'Chemical', 'químico': 'Chemical', 'quimico': 'Chemical',
  'tabla': 'Table', 'periódica': 'Periodic', 'periodica': 'Periodic', 'elementos': 'Elements', 'elemento': 'Element',
  'enlaces': 'Bonds', 'enlace': 'Bond', 'iónico': 'Ionic', 'ionico': 'Ionic',
  'covalente': 'Covalent', 'metálico': 'Metallic', 'metalico': 'Metallic',
  'ácidos': 'Acids', 'acidos': 'Acids', 'ácido': 'Acid', 'acido': 'Acid',
  'bases': 'Bases', 'base': 'Base', 'soluciones': 'Solutions', 'solución': 'Solution', 'solucion': 'Solution',
  'digestivo': 'Digestive', 'respiratorio': 'Respiratory', 'circulatorio': 'Circulatory',
  'nervioso': 'Nervous', 'endocrino': 'Endocrine', 'inmunológico': 'Immune', 'inmunologico': 'Immune',
  'reproducción': 'Reproduction', 'reproduccion': 'Reproduction', 'reproductor': 'Reproductive',
  'genética': 'Genetics', 'genetica': 'Genetics', 'ADN': 'DNA', 'ARN': 'RNA', 'Adn': 'DNA',
  'evolución': 'Evolution', 'evolucion': 'Evolution', 'selección': 'Selection', 'seleccion': 'Selection',
  'natural': 'Natural', 'especie': 'Species', 'especies': 'Species',
  'biodiversidad': 'Biodiversity', 'cadenas': 'Chains', 'cadena': 'Chain',
  'alimentarias': 'Food', 'alimentaria': 'Food', 'tróficas': 'Trophic', 'troficas': 'Trophic',
  'vertebrados': 'Vertebrates', 'vertebrado': 'Vertebrate',
  'invertebrados': 'Invertebrates', 'invertebrado': 'Invertebrate',
  'mamíferos': 'Mammals', 'mamiferos': 'Mammals', 'aves': 'Birds', 'reptiles': 'Reptiles',
  'anfibios': 'Amphibians', 'peces': 'Fish', 'insectos': 'Insects',
  'fotosíntesis': 'Photosynthesis', 'fotosintesis': 'Photosynthesis',
  'respiración': 'Respiration', 'respiracion': 'Respiration',
  'mitosis': 'Mitosis', 'meiosis': 'Meiosis', 'cromosomas': 'Chromosomes', 'cromosoma': 'Chromosome',
  'herencia': 'Heredity', 'mutaciones': 'Mutations', 'mutación': 'Mutation', 'mutacion': 'Mutation',
  // Términos adicionales de biología y evolución
  'evidencias': 'Evidence', 'evidencia': 'Evidence', 
  'fósiles': 'Fossils', 'fosiles': 'Fossils', 'fósil': 'Fossil', 'fosil': 'Fossil',
  'anatomía': 'Anatomy', 'anatomia': 'Anatomy', 'comparada': 'Comparative', 'comparado': 'Comparative',
  'teoría': 'Theory', 'teoria': 'Theory', 'teorías': 'Theories', 'teorias': 'Theories',
  'clasificación': 'Classification', 'clasificacion': 'Classification',
  'taxonomía': 'Taxonomy', 'taxonomia': 'Taxonomy',
  'filogenia': 'Phylogeny', 'filogenético': 'Phylogenetic', 'filogenetico': 'Phylogenetic',
  'Darwin': 'Darwin', 'Wallace': 'Wallace',
  'población': 'Population', 'poblacion': 'Population', 'poblaciones': 'Populations',
  'interacciones': 'Interactions', 'interacción': 'Interaction', 'interaccion': 'Interaction',
  'depredación': 'Predation', 'depredacion': 'Predation', 'competencia': 'Competition',
  'mutualismo': 'Mutualism', 'simbiosis': 'Symbiosis',
  'dinámica': 'Dynamics', 'dinamica': 'Dynamics', 'tamaño': 'Size', 'tamano': 'Size',
  'densidad': 'Density', 'crecimiento': 'Growth',
  'flujo': 'Flow', 'tramas': 'Webs', 'trama': 'Web',
  'biogeoquímicos': 'Biogeochemical', 'biogeoquimicos': 'Biogeochemical',
  'carbono': 'Carbon', 'nitrógeno': 'Nitrogen', 'nitrogeno': 'Nitrogen',
  'complementarios': 'Complementary', 'complementario': 'Complementary',
  'impacto': 'Impact', 'impactos': 'Impacts',
  'niveles': 'Levels', 'nivel': 'Level', 'organización': 'Organization', 'organizacion': 'Organization',
  'biológicas': 'Biological', 'biologicas': 'Biological', 'biológico': 'Biological', 'biologico': 'Biological',
  'celular': 'Cellular', 'procesos': 'Processes', 'proceso': 'Process',
  
  // Historia y geografía
  'historia': 'History', 'geografía': 'Geography', 'geografia': 'Geography',
  'civilización': 'Civilization', 'civilizacion': 'Civilization',
  'civilizaciones': 'Civilizations', 'antiguas': 'Ancient', 'antigua': 'Ancient', 'antiguo': 'Ancient',
  'pueblos': 'Peoples', 'pueblo': 'People', 'originarios': 'Indigenous', 'originario': 'Indigenous',
  'indígenas': 'Indigenous', 'indigenas': 'Indigenous',
  'culturas': 'Cultures', 'cultura': 'Culture', 'tradiciones': 'Traditions', 'tradición': 'Tradition', 'tradicion': 'Tradition',
  'símbolos': 'Symbols', 'simbolos': 'Symbols', 'símbolo': 'Symbol', 'simbolo': 'Symbol',
  'patrios': 'National', 'patrio': 'National',
  'derechos': 'Rights', 'derecho': 'Right', 'niños': 'Children', 'ninos': 'Children', 'niño': 'Child', 'nino': 'Child',
  'familia': 'Family', 'comunidad': 'Community', 'sociedad': 'Society',
  'democracia': 'Democracy', 'ciudadanía': 'Citizenship', 'ciudadania': 'Citizenship',
  'gobierno': 'Government', 'república': 'Republic', 'republica': 'Republic',
  'independencia': 'Independence', 'revolución': 'Revolution', 'revolucion': 'Revolution',
  'guerra': 'War', 'mundial': 'World', 'primera': 'First', 'segunda': 'Second',
  'colonial': 'Colonial', 'colonia': 'Colony', 'conquista': 'Conquest',
  'descubrimiento': 'Discovery', 'exploración': 'Exploration', 'exploracion': 'Exploration',
  'mapas': 'Maps', 'mapa': 'Map', 'regiones': 'Regions', 'región': 'Region', 'region': 'Region',
  'clima': 'Climate', 'climas': 'Climates', 'recursos': 'Resources', 'recurso': 'Resource',
  'naturales': 'Natural', 'económicos': 'Economic', 'economicos': 'Economic',
  
  // Lenguaje
  'lectura': 'Reading', 'escritura': 'Writing', 'comprensión': 'Comprehension', 'comprension': 'Comprehension',
  'cuentos': 'Stories', 'cuento': 'Story', 'narrativos': 'Narrative', 'narrativo': 'Narrative',
  'poemas': 'Poems', 'poema': 'Poem', 'poesía': 'Poetry', 'poesia': 'Poetry',
  'fábulas': 'Fables', 'fabulas': 'Fables', 'fábula': 'Fable', 'fabula': 'Fable',
  'leyendas': 'Legends', 'leyenda': 'Legend', 'mitos': 'Myths', 'mito': 'Myth',
  'textos': 'Texts', 'texto': 'Text', 'informativos': 'Informative', 'informativo': 'Informative',
  'descriptivos': 'Descriptive', 'descriptivo': 'Descriptive',
  'argumentativos': 'Argumentative', 'argumentativo': 'Argumentative',
  'instructivos': 'Instructional', 'instructivo': 'Instructional',
  'cartas': 'Letters', 'carta': 'Letter', 'mensajes': 'Messages', 'mensaje': 'Message',
  'oraciones': 'Sentences', 'oración': 'Sentence', 'oracion': 'Sentence',
  'palabras': 'Words', 'palabra': 'Word', 'vocales': 'Vowels', 'vocal': 'Vowel',
  'consonantes': 'Consonants', 'consonante': 'Consonant',
  'sustantivos': 'Nouns', 'sustantivo': 'Noun', 'adjetivos': 'Adjectives', 'adjetivo': 'Adjective',
  'verbos': 'Verbs', 'verbo': 'Verb', 'adverbios': 'Adverbs', 'adverbio': 'Adverb',
  'sinónimos': 'Synonyms', 'sinonimos': 'Synonyms', 'antónimos': 'Antonyms', 'antonimos': 'Antonyms',
  'puntuación': 'Punctuation', 'puntuacion': 'Punctuation',
  'mayúsculas': 'Capital Letters', 'mayusculas': 'Capital Letters',
  'literario': 'Literary', 'literarios': 'Literary', 'literatura': 'Literature',
  'análisis': 'Analysis', 'analisis': 'Analysis', 'crítico': 'Critical', 'critico': 'Critical',
  
  // Conectores y preposiciones
  'del': 'of the', 'de': 'of', 'la': 'the', 'el': 'the', 'los': 'the', 'las': 'the',
  'un': 'a', 'una': 'a', 'y': 'and', 'e': 'and', 'o': 'or', 'u': 'or',
  'en': 'in', 'con': 'with', 'para': 'for', 'por': 'by',
  'hasta': 'up to', 'desde': 'from', 'entre': 'between', 'sobre': 'about',
  'sus': 'their', 'su': 'its', 'sus': 'their',
  'como': 'as', 'más': 'more', 'mas': 'more', 'menos': 'less',
  'inicial': 'Initial', 'iniciales': 'Initial', 'básico': 'Basic', 'basico': 'Basic',
  'avanzado': 'Advanced', 'introductorio': 'Introductory',
  'saludable': 'Healthy', 'actividad': 'Activity', 'física': 'Physical', 'fisica': 'Physical',
  'locomotor': 'Locomotor', 'peligro': 'Danger', 'endangered': 'Endangered',
  
  // Otros términos específicos
  'componer': 'Composing', 'descomponer': 'Decomposing', 'tiempo': 'Time',
  'resolución': 'Solving', 'resolucion': 'Solving', 'problemas': 'Problems', 'problema': 'Problem',
  'decenas': 'Tens', 'unidades': 'Units', 'centenas': 'Hundreds',
  'escrito': 'Written', 'mental': 'Mental', 'cálculo': 'Calculation', 'calculo': 'Calculation',
  'espacial': 'Spatial', 'orientación': 'Orientation', 'orientacion': 'Orientation',
  'dinero': 'Money', 'figuras': 'Shapes', 'figura': 'Shape',
  '2D': '2D', '3D': '3D', 'repetida': 'Repeated', 'partes': 'Parts', 'parte': 'Part',
  'iguales': 'Equal', 'igual': 'Equal', 'pictogramas': 'Pictograms', 'pictograma': 'Pictogram',
  'barras': 'Bar', 'frecuencia': 'Frequency', 'media': 'Mean', 'moda': 'Mode',
  'reagrupación': 'Regrouping', 'reagrupacion': 'Regrouping',
  'tablas': 'Tables', 'exacta': 'Exact', 'equivalentes': 'Equivalent',
  'enteros': 'Integers', 'entero': 'Integer', 'operaciones': 'Operations', 'operación': 'Operation', 'operacion': 'Operation',
  'transformaciones': 'Transformations', 'transformación': 'Transformation', 'transformacion': 'Transformation',
  'expresiones': 'Expressions', 'expresión': 'Expression', 'expresion': 'Expression',
  'algebraicas': 'Algebraic', 'algebraica': 'Algebraic',
  'lineales': 'Linear', 'lineal': 'Linear', 'cuadráticas': 'Quadratic', 'cuadratica': 'Quadratic',
  'trigonometría': 'Trigonometry', 'trigonometria': 'Trigonometry',
  'analítica': 'Analytic', 'analitica': 'Analytic',
  'determinantes': 'Determinants', 'determinante': 'Determinant',
  'logaritmos': 'Logarithms', 'logaritmo': 'Logarithm',
  'exponenciales': 'Exponentials', 'exponencial': 'Exponential',
  'complejos': 'Complex', 'complejo': 'Complex',
  
  // Términos adicionales de Lenguaje
  'adivinanzas': 'Riddles', 'adivinanza': 'Riddle',
  'noticia': 'News', 'noticias': 'News',
  'sílabas': 'Syllables', 'silabas': 'Syllables', 'sílaba': 'Syllable', 'silaba': 'Syllable',
  'primeras': 'First', 'primera': 'First', 'personal': 'Personal',
  'complejas': 'Complex', 'compleja': 'Complex',
  'deberes': 'Duties', 'deber': 'Duty',
  'orden': 'Order', 'temporal': 'Temporal', 'alfabético': 'Alphabetical', 'alfabetico': 'Alphabetical',
  'identidad': 'Identity', 'familiar': 'Family',
  'instituciones': 'Institutions', 'institución': 'Institution', 'institucion': 'Institution',
  'trabajos': 'Jobs', 'trabajo': 'Work', 'oficios': 'Trades', 'oficio': 'Trade',
  'ubicación': 'Location', 'ubicacion': 'Location',
  'paisajes': 'Landscapes', 'paisaje': 'Landscape',
  'aporte': 'Contribution', 'aportes': 'Contributions', 'cultural': 'Cultural',
  'diversidad': 'Diversity', 'diverso': 'Diverse',
  
  // Más términos de Ciencias
  'cubierta': 'Covering', 'corporal': 'Body',
  'desplazamiento': 'Movement', 'locomotion': 'Locomotion',
  'necesidades': 'Needs', 'necesidad': 'Need',
  'propiedades': 'Properties', 'propiedad': 'Property',
  'cambios': 'Changes', 'cambio': 'Change',
  'materiales': 'Materials', 'material': 'Material',
  'diario': 'Daily', 'estaciones': 'Seasons', 'estación': 'Season', 'estacion': 'Season',
  'sol': 'Sun', 'luna': 'Moon', 'estrellas': 'Stars', 'estrella': 'Star',
  'planeta': 'Planet', 'planetas': 'Planets',
  'nuestro': 'Our', 'nuestra': 'Our',
  'mundo': 'World', 'tierra': 'Earth',
  'entorno': 'Environment', 'medio': 'Environment',
  'ambiente': 'Environment', 'ambiental': 'Environmental',
  'inerte': 'Inert', 'inertes': 'Inert',
  'supervivencia': 'Survival', 'sobrevivir': 'Survive',
  'refugio': 'Shelter', 'alimento': 'Food', 'alimentos': 'Food',
  'aire': 'Air', 'oxígeno': 'Oxygen', 'oxigeno': 'Oxygen',
  'pelos': 'Fur', 'pelo': 'Fur', 'plumas': 'Feathers', 'pluma': 'Feather',
  'escamas': 'Scales', 'escama': 'Scale',
  'caminan': 'Walk', 'vuelan': 'Fly', 'nadan': 'Swim',
  'raíz': 'Root', 'raiz': 'Root', 'tallo': 'Stem', 'hoja': 'Leaf', 'hojas': 'Leaves',
  'flor': 'Flower', 'flores': 'Flowers', 'fruto': 'Fruit', 'frutos': 'Fruits',
  'fragilidad': 'Fragility', 'flexibilidad': 'Flexibility', 'transparencia': 'Transparency',
  'cotidianos': 'Everyday', 'cotidiano': 'Everyday',
  'día': 'Day', 'dia': 'Day', 'noche': 'Night',
  'otoño': 'Autumn', 'otono': 'Autumn', 'invierno': 'Winter',
  'primavera': 'Spring', 'verano': 'Summer',
  'climáticas': 'Climate', 'climaticas': 'Climate', 'climático': 'Climate', 'climatico': 'Climate',
  
  // Historia y sociedad
  'vivimos': 'We Live', 'contamos': 'We Tell', 'historias': 'Stories',
  'chile': 'Chile', 'chilena': 'Chilean', 'chileno': 'Chilean',
  'paisajes': 'Landscapes', 'nuestros': 'Our',
  'planos': 'Maps', 'plano': 'Map',
  'medios': 'Means', 'transporte': 'Transportation', 'comunicación': 'Communication', 'comunicacion': 'Communication',
  'normas': 'Rules', 'espacios': 'Spaces', 'públicos': 'Public', 'publicos': 'Public',
  
  // Civilizaciones y legados
  'civilización': 'Civilization', 'civilizacion': 'Civilization',
  'griega': 'Greek', 'griego': 'Greek', 'griegos': 'Greeks',
  'romana': 'Roman', 'romano': 'Roman', 'romanos': 'Romans',
  'maya': 'Mayan', 'mayas': 'Mayans',
  'azteca': 'Aztec', 'aztecas': 'Aztecs',
  'inca': 'Inca', 'incas': 'Incas',
  'legados': 'Legacies', 'legado': 'Legacy',
  'cotidiana': 'Daily', 'cotidiano': 'Daily',
  'educación': 'Education', 'educacion': 'Education',
  'teatro': 'Theater', 'juegos': 'Games',
  'olímpicos': 'Olympic', 'olimpicos': 'Olympic',
  'mitología': 'Mythology', 'mitologia': 'Mythology',
  'arquitectura': 'Architecture', 'leyes': 'Laws',
  'cristianismo': 'Christianity', 'latín': 'Latin', 'latin': 'Latin',
  'geográfico': 'Geographic', 'geografico': 'Geographic',
  'cuadrículas': 'Grids', 'cuadriculas': 'Grids',
  'líneas': 'Lines', 'lineas': 'Lines',
  'imaginarias': 'Imaginary', 'imaginario': 'Imaginary',
  'ecuador': 'Equator', 'trópicos': 'Tropics', 'tropicos': 'Tropics',
  'cálida': 'Warm', 'calida': 'Warm',
  'templada': 'Temperate', 'fría': 'Cold', 'fria': 'Cold',
  'zonas': 'Zones', 'zona': 'Zone',
  'ciudadanos': 'Citizens', 'ciudadano': 'Citizen',
  'participación': 'Participation', 'participacion': 'Participation',
  'instituciones': 'Institutions', 'públicas': 'Public', 'privadas': 'Private',
  
  // Unidades de estudio
  'unidad': 'Unit', 'unidades': 'Units',
  'conozco': 'I Know', 'cuido': 'I Care', 'cuidar': 'Take Care',
  'entorno': 'Environment', 'naturaleza': 'Nature',
  'especiales': 'Special', 'especial': 'Special',
  'importantes': 'Important', 'importante': 'Important',
  'amistad': 'Friendship', 'amigos': 'Friends', 'amigo': 'Friend',
  'escuela': 'School', 'sorpresas': 'Surprises', 'sorpresa': 'Surprise',
  'encontrarás': 'You Will Find', 'encontrar': 'Find',
  
  // Secuencias/números
  'secuencias': 'Sequences', 'secuencia': 'Sequence',
  'numéricos': 'Number', 'numericos': 'Number', 'numérico': 'Numerical', 'numerico': 'Numerical',
  'geométricos': 'Geometric', 'geometricos': 'Geometric', 'geométrico': 'Geometric', 'geometrico': 'Geometric',
  
  // Verbos y palabras de acción
  'practicar': 'Practice', 'práctica': 'Practice', 'practica': 'Practice',
  'aplicando': 'Applying', 'aplicar': 'Apply',
  'estrategias': 'Strategies', 'estrategia': 'Strategy',
  'distinción': 'Distinction', 'distincion': 'Distinction', 'distinguir': 'Distinguish',
  'identificación': 'Identification', 'identificacion': 'Identification', 'identificar': 'Identify',
  'clasificación': 'Classification', 'clasificacion': 'Classification', 'clasificar': 'Classify',
  'comparación': 'Comparison', 'comparacion': 'Comparison', 'comparar': 'Compare',
  'observación': 'Observation', 'observacion': 'Observation', 'observar': 'Observe',
  'exploración': 'Exploration', 'exploracion': 'Exploration', 'explorar': 'Explore',
  'creación': 'Creation', 'creacion': 'Creation', 'crear': 'Create',
  'redacción': 'Writing', 'redaccion': 'Writing', 'redactar': 'Write',
  
  // Más términos
  'vs': 'vs', 'no': 'Non', 'vivo': 'Living', 'inerte': 'Non-living',
  
  // Términos adicionales para traducciones
  'uso': 'Use', 'usos': 'Uses', 'cuidado': 'Care', 'cuidados': 'Care',
  'características': 'Characteristics', 'caracteristicas': 'Characteristics',
  'característica': 'Characteristic', 'caracteristica': 'Characteristic',
  'diferencias': 'Differences', 'diferencia': 'Difference',
  'similitudes': 'Similarities', 'similitud': 'Similarity',
  'conceptos': 'Concepts', 'concepto': 'Concept',
  'básicos': 'Basic', 'basicos': 'Basic',
  'introducción': 'Introduction', 'introduccion': 'Introduction',
  'fundamentos': 'Fundamentals', 'fundamento': 'Foundation',
  'aplicaciones': 'Applications', 'aplicación': 'Application', 'aplicacion': 'Application',
  'ejercicios': 'Exercises', 'ejercicio': 'Exercise',
  'prácticos': 'Practical', 'practicos': 'Practical', 'práctico': 'Practical', 'practico': 'Practical',
  'guiados': 'Guided', 'guiado': 'Guided',
  'repaso': 'Review', 'general': 'General',
  'avanzados': 'Advanced', 'síntesis': 'Synthesis', 'sintesis': 'Synthesis',
  'evaluación': 'Evaluation', 'evaluacion': 'Evaluation',
  'estudios': 'Studies', 'estudio': 'Study',
  'caso': 'Case', 'casos': 'Cases',
  'proyectos': 'Projects', 'proyecto': 'Project',
  'investigación': 'Research', 'investigacion': 'Research',
  'metodología': 'Methodology', 'metodologia': 'Methodology',
  'seminario': 'Seminar', 'seminarios': 'Seminars',
  'tesis': 'Thesis', 'publicaciones': 'Publications',
  'formación': 'Formation', 'formacion': 'Formation',
  'contar': 'Telling', 'historias': 'Stories',
  'arte': 'Art', 'viaje': 'Journey', 'viajes': 'Journeys',
  'novela': 'Novel', 'novelas': 'Novels',
  'imaginación': 'Imagination', 'imaginacion': 'Imagination',
  'creatividad': 'Creativity', 'creativo': 'Creative',
  'dramático': 'Dramatic', 'dramatico': 'Dramatic',
  'opinión': 'Opinion', 'opinion': 'Opinion',
  'autobiografía': 'Autobiography', 'autobiografia': 'Autobiography',
  'comentario': 'Commentary', 'comentarios': 'Comments',
  
  // Historia y época colonial
  'organización': 'Organization', 'organizacion': 'Organization',
  'social': 'Social', 'sociales': 'Social',
  'castas': 'Castes', 'casta': 'Caste',
  'iglesia': 'Church', 'rol': 'Role',
  'evangelización': 'Evangelization', 'evangelizacion': 'Evangelization',
  'colonia': 'Colony', 'colonial': 'Colonial',
  'fronteriza': 'Frontier', 'frontera': 'Border',
  'parlamentos': 'Parliaments', 'parlamento': 'Parliament',
  'mestizaje': 'Mestizaje', 'biológico': 'Biological', 'biologico': 'Biological',
  'ilustración': 'Enlightenment', 'ilustracion': 'Enlightenment',
  'ilustrado': 'Enlightened', 'ilustrados': 'Enlightened',
  'razón': 'Reason', 'razon': 'Reason',
  'libertad': 'Liberty', 'igualdad': 'Equality',
  'influencia': 'Influence', 'francesa': 'French', 'frances': 'French',
  'multicausalidad': 'Multiple Causes', 'multicausas': 'Multiple Causes',
  'externas': 'External', 'externa': 'External',
  'internas': 'Internal', 'interna': 'Internal',
  'etapas': 'Stages', 'etapa': 'Stage',
  'republicanos': 'Republican', 'republicano': 'Republican',
  'desafíos': 'Challenges', 'desafios': 'Challenges', 'desafío': 'Challenge', 'desafio': 'Challenge',
  'región': 'Region', 'regiones': 'Regions',
  'productiva': 'Productive', 'productivo': 'Productive',
  'conectividad': 'Connectivity', 'desarrollo': 'Development',
  'regional': 'Regional', 'económica': 'Economic', 'economica': 'Economic',
  'moderna': 'Modern', 'moderno': 'Modern',
  'humanismo': 'Humanism', 'humanista': 'Humanist',
  'mentalidad': 'Mentality', 'teocentrismo': 'Theocentrism',
  'antropocentrismo': 'Anthropocentrism', 'renacimiento': 'Renaissance',
  'artístico': 'Artistic', 'artistico': 'Artistic',
  'científica': 'Scientific', 'cientifica': 'Scientific',
  'reforma': 'Reformation', 'religiosa': 'Religious', 'religioso': 'Religious',
  'surgimiento': 'Rise', 'monarquías': 'Monarchies', 'monarquias': 'Monarchies',
  'absolutas': 'Absolute', 'absoluto': 'Absolute',
  'centralización': 'Centralization', 'centralizacion': 'Centralization',
  'poder': 'Power', 'comercial': 'Commercial',
  'expansión': 'Expansion', 'expansion': 'Expansion',
  'exploración': 'Exploration', 'exploracion': 'Exploration',
  'hispano': 'Spanish', 'indígena': 'Indigenous', 'indigena': 'Indigenous',
  'malones': 'Raids', 'malocas': 'Counter-raids',
  'arauco': 'Arauco', 'guerra': 'War',
  
  // Términos adicionales para traducciones de temas
  'calendario': 'Calendar', 'valor': 'Value', 'posicional': 'Place',
  'estimación': 'Estimation', 'estimacion': 'Estimation',
  'imaginación': 'Imagination', 'imaginacion': 'Imagination',
  'moralejas': 'Morals', 'moraleja': 'Moral',
  'ortografía': 'Spelling', 'ortografia': 'Spelling',
  'gramática': 'Grammar', 'gramatica': 'Grammar',
  'héroe': 'Hero', 'heroe': 'Hero', 'héroes': 'Heroes', 'heroes': 'Heroes',
  'viaje': 'Journey', 'viajes': 'Journeys',
  'terror': 'Horror', 'miedo': 'Fear',
  'pasión': 'Passion', 'pasion': 'Passion',
  'razón': 'Reason', 'razon': 'Reason',
  'migración': 'Migration', 'migracion': 'Migration',
  'inclusión': 'Inclusion', 'inclusion': 'Inclusion',
  'ética': 'Ethics', 'etica': 'Ethics',
  'política': 'Politics', 'politica': 'Politics',
  'estética': 'Aesthetics', 'estetica': 'Aesthetics',
  'filosofía': 'Philosophy', 'filosofia': 'Philosophy',
  'bienestar': 'Wellness', 'seguridad': 'Safety',
  'autocuidado': 'Self-care', 'sostenibilidad': 'Sustainability',
  'teselaciones': 'Tessellations', 'teselación': 'Tessellation', 'teselacion': 'Tessellation',
  'hominización': 'Hominization', 'hominizacion': 'Hominization',
  'neolítico': 'Neolithic', 'neolitico': 'Neolithic',
  'clásicas': 'Classical', 'clasicas': 'Classical', 'clásico': 'Classical', 'clasico': 'Classical',
};

// Traducciones completas de frases específicas (antes del diccionario de palabras)
const phraseTranslations: Record<string, string> = {
  // Ciencias Naturales 1ro Básico
  'Los sentidos': 'The Senses',
  'Vida saludable': 'Healthy Living',
  'Seres vivos vs. no vivos': 'Living vs. Non-living Things',
  'Necesidades de los animales': 'Animal Needs',
  'Cubierta corporal y desplazamiento': 'Body Covering and Movement',
  'Partes de la planta': 'Plant Parts',
  'Propiedades de los materiales': 'Properties of Materials',
  'Cambios en los materiales': 'Changes in Materials',
  'Ciclo diario': 'Daily Cycle',
  'Las estaciones': 'The Seasons',
  
  // Lenguaje 1ro Básico
  'Comprensión de cuentos': 'Story Comprehension',
  'Vocales y primeras consonantes': 'Vowels and First Consonants',
  'Escritura personal': 'Personal Writing',
  'Textos informativos': 'Informative Texts',
  'Consonantes L, S, T, D': 'Consonants L, S, T, D',
  'Cartas y poemas': 'Letters and Poems',
  'Consonantes N, F, H, B': 'Consonants N, F, H, B',
  'Escritura de mensajes': 'Writing Messages',
  'Consonante R y sílabas complejas': 'Consonant R and Complex Syllables',
  'Fábulas': 'Fables',
  'Consonantes V, Ñ': 'Consonants V, Ñ',
  'Adivinanzas': 'Riddles',
  'Textos instructivos': 'Instructional Texts',
  'Consonantes J, Ll': 'Consonants J, Ll',
  'La Noticia': 'The News',
  'Consonantes Z, Ch': 'Consonants Z, Ch',
  'Derechos y deberes': 'Rights and Duties',
  'Consonantes Y, X, K, W': 'Consonants Y, X, K, W',
  
  // Historia 1ro Básico
  'Orden temporal': 'Temporal Order',
  'Identidad personal y familiar': 'Personal and Family Identity',
  'Instituciones y trabajos': 'Institutions and Jobs',
  'Ubicación de Chile': 'Location of Chile',
  'Paisajes': 'Landscapes',
  'Aporte cultural': 'Cultural Contribution',
  
  // Ciencias 2do Básico
  'Órganos del Cuerpo Humano': 'Human Body Organs',
  'Sistema Locomotor y Actividad Física': 'Locomotor System and Physical Activity',
  'Vertebrados e Invertebrados': 'Vertebrates and Invertebrates',
  'Hábitats y Animales en Peligro': 'Habitats and Endangered Animals',
  'Ciclos de Vida': 'Life Cycles',
  'El Agua y sus Estados': 'Water and Its States',
  
  // Historia 2do Básico
  'Planos y Orientación': 'Maps and Orientation',
  'Paisajes de Chile': 'Landscapes of Chile',
  'Medios de Transporte y Comunicación': 'Transportation and Communication',
  'Normas y Espacios Públicos': 'Rules and Public Spaces',
  'Pueblos Originarios': 'Indigenous Peoples',
  'Diversidad y Herencia': 'Diversity and Heritage',
  
  // Matemáticas 2do Básico
  'Números hasta el 50': 'Numbers up to 50',
  'Operaciones (Suma y Resta)': 'Operations (Addition and Subtraction)',
  'El Tiempo y el Calendario': 'Time and Calendar',
  'Números hasta el 100 y 1.000': 'Numbers up to 100 and 1,000',
  'Valor Posicional (Unidad y Decena)': 'Place Value (Unit and Tens)',
  'Estimación': 'Estimation',
  
  // Lenguaje 2do Básico
  'Lectura de Cuentos': 'Reading Stories',
  'Cartas y Mensajes': 'Letters and Messages',
  'Historietas y Cómics': 'Comics and Graphic Stories',
  'Textos Descriptivos': 'Descriptive Texts',
  'Cuentos e Imaginación': 'Stories and Imagination',
  'Escritura Descriptiva': 'Descriptive Writing',
  'Fábulas y Moralejas': 'Fables and Morals',
  'Artículos Informativos': 'Informative Articles',
  'Leyendas y Tradiciones': 'Legends and Traditions',
  'Gramática y Ortografía': 'Grammar and Spelling',
  
  // Matemáticas 3ro Básico
  'Números hasta el 1.000': 'Numbers up to 1,000',
  'Orden y Comparación': 'Order and Comparison',
  'Adición y Sustracción': 'Addition and Subtraction',
  'Patrones y Ecuaciones': 'Patterns and Equations',
  'Figuras 3D y Perímetro': '3D Shapes and Perimeter',
  'Multiplicación y División': 'Multiplication and Division',
  'El Tiempo': 'Time',
  'Gráficos y Probabilidades': 'Graphs and Probabilities',
  'Geometría y Ubicación': 'Geometry and Location',
  
  // Ciencias 3ro Básico
  'La Luz': 'Light',
  'El Sonido': 'Sound',
  'El Sistema Solar': 'The Solar System',
  'Las Plantas': 'Plants',
  'Alimentación Saludable': 'Healthy Eating',
  
  // Historia 3ro Básico
  'Ubicación Espacial y Zonas Climáticas': 'Spatial Location and Climate Zones',
  'La Civilización Griega': 'Greek Civilization',
  'La Civilización Romana': 'Roman Civilization',
  'Vida en Comunidad y Derechos': 'Community Life and Rights',
  
  // Matemáticas 4to Básico
  'Números hasta 10.000': 'Numbers up to 10,000',
  'Multiplicación Extendida': 'Extended Multiplication',
  'División y Algoritmo': 'Division and Algorithm',
  'Fracciones y Decimales': 'Fractions and Decimals',
  'Geometría: Ángulos y Polígonos': 'Geometry: Angles and Polygons',
  'Perímetro y Área': 'Perimeter and Area',
  'Medición y Datos': 'Measurement and Data',
  
  // Ciencias 4to Básico
  'Ecosistemas de Chile': 'Ecosystems of Chile',
  'El Cuerpo Humano: Sistema Locomotor': 'Human Body: Locomotor System',
  'Materia y sus Cambios': 'Matter and Its Changes',
  'La Fuerza': 'Force',
  
  // Historia 4to Básico
  'La Civilización Maya': 'Mayan Civilization',
  'La Civilización Azteca': 'Aztec Civilization',
  'La Civilización Inca': 'Inca Civilization',
  'Geografía de América': 'Geography of America',
  
  // Matemáticas 5to Básico
  'Sistema de Numeración Decimal': 'Decimal Number System',
  'Operaciones con Números Naturales': 'Operations with Natural Numbers',
  'Fracciones: Conceptos y Operaciones': 'Fractions: Concepts and Operations',
  'Decimales: Operaciones': 'Decimals: Operations',
  'Razones y Porcentajes': 'Ratios and Percentages',
  'Geometría: Transformaciones': 'Geometry: Transformations',
  'Medición': 'Measurement',
  'Datos y Azar': 'Data and Probability',
  
  // Ciencias 5to Básico
  'Agua y Ciclo Hidrológico': 'Water and Hydrological Cycle',
  'Capas de la Tierra': 'Earth Layers',
  'El Sistema Digestivo': 'Digestive System',
  'El Sistema Circulatorio': 'Circulatory System',
  'Electricidad y Magnetismo': 'Electricity and Magnetism',
  
  // Historia 5to Básico
  'Conquista de América': 'Conquest of America',
  'La Colonia en Chile': 'Colonial Chile',
  'Sociedad Colonial': 'Colonial Society',
  'Independencia de Chile': 'Independence of Chile',
  
  // Matemáticas 6to Básico
  'Números Enteros': 'Integers',
  'Operaciones con Fracciones': 'Operations with Fractions',
  'Operaciones con Decimales': 'Operations with Decimals',
  'Proporcionalidad Directa': 'Direct Proportionality',
  'Álgebra Inicial': 'Initial Algebra',
  'Geometría: Cuerpos Geométricos': 'Geometry: Geometric Solids',
  'Estadística y Probabilidad': 'Statistics and Probability',
  
  // Ciencias 6to Básico
  'La Célula': 'The Cell',
  'Sistemas del Cuerpo Humano': 'Human Body Systems',
  'Pubertad y Reproducción': 'Puberty and Reproduction',
  'Energía': 'Energy',
  'Transferencia de Energía': 'Energy Transfer',
  
  // Historia 6to Básico
  'República de Chile': 'Republic of Chile',
  'Expansión Territorial': 'Territorial Expansion',
  'Transformaciones Sociales': 'Social Transformations',
  'Organización Democrática': 'Democratic Organization',
  
  // 7mo y 8vo Básico - Matemáticas
  'Números Racionales': 'Rational Numbers',
  'Expresiones Algebraicas': 'Algebraic Expressions',
  'Ecuaciones e Inecuaciones': 'Equations and Inequalities',
  'Proporcionalidad': 'Proportionality',
  'Geometría: Triángulos': 'Geometry: Triangles',
  'Transformaciones Isométricas': 'Isometric Transformations',
  'Probabilidad y Estadística': 'Probability and Statistics',
  'Potencias y Raíces': 'Powers and Roots',
  'Teorema de Pitágoras': 'Pythagorean Theorem',
  'Funciones Lineales': 'Linear Functions',
  
  // 7mo y 8vo Básico - Ciencias
  'Estructura Atómica': 'Atomic Structure',
  'Tabla Periódica': 'Periodic Table',
  'Fuerza y Movimiento': 'Force and Motion',
  'Ondas y Sonido': 'Waves and Sound',
  'Reproducción Humana': 'Human Reproduction',
  'Sexualidad y Afectividad': 'Sexuality and Affectivity',
  'Microorganismos': 'Microorganisms',
  'Sistema Inmunológico': 'Immune System',
  
  // 1ro Medio - Matemáticas
  'Conjunto de los Números Reales': 'Set of Real Numbers',
  'Potencias de Base Racional': 'Powers with Rational Base',
  'Ecuaciones Lineales': 'Linear Equations',
  'Sistemas de Ecuaciones': 'Systems of Equations',
  'Funciones': 'Functions',
  'Homotecia y Semejanza': 'Homothety and Similarity',
  'Trigonometría': 'Trigonometry',
  
  // 1ro Medio - Física
  'Cinemática': 'Kinematics',
  'Dinámica': 'Dynamics',
  'Trabajo y Energía': 'Work and Energy',
  'Leyes de Newton': 'Newton\'s Laws',
  'Momentum': 'Momentum',
  
  // 1ro Medio - Química
  'Modelo Atómico': 'Atomic Model',
  'Configuración Electrónica': 'Electron Configuration',
  'Enlace Químico': 'Chemical Bonding',
  'Nomenclatura Química': 'Chemical Nomenclature',
  
  // 1ro Medio - Biología
  'Organización Celular': 'Cellular Organization',
  'Metabolismo Celular': 'Cellular Metabolism',
  'ADN y Material Genético': 'DNA and Genetic Material',
  'Evolución y Biodiversidad': 'Evolution and Biodiversity',
  'Ecología: Interacciones': 'Ecology: Interactions',
  'Materia y Energía en Ecosistemas': 'Matter and Energy in Ecosystems',
  
  // 2do Medio - Matemáticas
  'Números Complejos': 'Complex Numbers',
  'Función Cuadrática': 'Quadratic Function',
  'Ecuaciones Cuadráticas': 'Quadratic Equations',
  'Geometría Analítica': 'Analytic Geometry',
  
  // 2do Medio - Física
  'Movimiento Circular': 'Circular Motion',
  'Gravitación': 'Gravitation',
  'Fluidos': 'Fluids',
  'Hidrostática': 'Hydrostatics',
  
  // 2do Medio - Química
  'Reacciones Químicas': 'Chemical Reactions',
  'Estequiometría': 'Stoichiometry',
  'Soluciones': 'Solutions',
  'Ácidos y Bases': 'Acids and Bases',
  
  // 2do Medio - Biología
  'Genética Mendeliana': 'Mendelian Genetics',
  'Herencia y Cromosomas': 'Heredity and Chromosomes',
  'Evolución': 'Evolution',
  'Selección Natural': 'Natural Selection',
  
  // 3ro Medio - Matemáticas
  'Logaritmos': 'Logarithms',
  'Función Exponencial': 'Exponential Function',
  'Funciones Trigonométricas': 'Trigonometric Functions',
  'Vectores': 'Vectors',
  
  // 3ro Medio - Física
  'Ondas': 'Waves',
  'Óptica': 'Optics',
  'Reflexión y Refracción': 'Reflection and Refraction',
  'Espectro Electromagnético': 'Electromagnetic Spectrum',
  
  // 3ro Medio - Química
  'Termoquímica': 'Thermochemistry',
  'Cinética Química': 'Chemical Kinetics',
  'Equilibrio Químico': 'Chemical Equilibrium',
  
  // 3ro Medio - Biología
  'Sistema Nervioso': 'Nervous System',
  'Sistema Endocrino': 'Endocrine System',
  'Homeostasis': 'Homeostasis',
  
  // 4to Medio - Matemáticas
  'Límites': 'Limits',
  'Derivadas': 'Derivatives',
  'Integrales': 'Integrals',
  'Aplicaciones del Cálculo': 'Applications of Calculus',
  
  // 4to Medio - Física
  'Electricidad': 'Electricity',
  'Circuitos Eléctricos': 'Electric Circuits',
  'Magnetismo': 'Magnetism',
  'Inducción Electromagnética': 'Electromagnetic Induction',
  'Física Moderna': 'Modern Physics',
  
  // 4to Medio - Química
  'Química Orgánica': 'Organic Chemistry',
  'Hidrocarburos': 'Hydrocarbons',
  'Grupos Funcionales': 'Functional Groups',
  'Polímeros': 'Polymers',
  'Electroquímica': 'Electrochemistry',
  
  // 4to Medio - Biología
  'Ecología': 'Ecology',
  'Biodiversidad': 'Biodiversity',
  'Cambio Climático': 'Climate Change',
  'Biotecnología': 'Biotechnology',
  
  // 1ro Medio - Física
  'Ondas y Sonido': 'Waves and Sound',
  'La Luz y Óptica': 'Light and Optics',
  'Sismos y Tierra': 'Earthquakes and Earth',
  'Universo': 'Universe',
  
  // 1ro Medio - Química
  'Nomenclatura Inorgánica': 'Inorganic Nomenclature',
  
  // 1ro Medio - Historia
  'Economía y Mercado': 'Economy and Market',
  'Estado-Nación y Sociedad Burguesa': 'Nation-State and Bourgeois Society',
  'Progreso e Industrialización': 'Progress and Industrialization',
  'Territorio Chileno': 'Chilean Territory',
  'El Cambio de Siglo': 'The Turn of the Century',
  
  // 2do Medio - Matemáticas
  'Números Reales (Raíces y Logaritmos)': 'Real Numbers (Roots and Logarithms)',
  'Ecuación Cuadrática': 'Quadratic Equation',
  'Función Inversa': 'Inverse Function',
  'Probabilidad Condicionada': 'Conditional Probability',
  
  // 2do Medio - Lenguaje
  'Narrativa y Migración': 'Narrative and Migration',
  'Medios Masivos y Ciudadanía': 'Mass Media and Citizenship',
  'Género Dramático y Poder': 'Dramatic Genre and Power',
  'Lírica y Perspectiva de Género': 'Poetry and Gender Perspective',
  'Investigación y Comunicación Oral': 'Research and Oral Communication',
  
  // 2do Medio - Biología
  'Coordinación y Regulación (Sistema Nervioso)': 'Coordination and Regulation (Nervous System)',
  'Sexualidad y Reproducción': 'Sexuality and Reproduction',
  'Genética y Herencia': 'Genetics and Heredity',
  
  // 2do Medio - Física
  'Movimiento Rectilíneo': 'Rectilinear Motion',
  'Fuerza y Leyes de Newton': 'Force and Newton\'s Laws',
  'Trabajo y Energía Mecánica': 'Work and Mechanical Energy',
  'El Universo y el Big Bang': 'The Universe and the Big Bang',
  
  // 2do Medio - Química
  'Disoluciones Químicas': 'Chemical Solutions',
  'Propiedades Coligativas': 'Colligative Properties',
  'Química Orgánica (El Carbono)': 'Organic Chemistry (Carbon)',
  'Isomería y Polímeros': 'Isomerism and Polymers',
  
  // 2do Medio - Historia
  'Crisis del Parlamentarismo y Anarquía': 'Crisis of Parliamentarism and Anarchy',
  'Totalitarismos y Segunda Guerra Mundial': 'Totalitarianism and World War II',
  'La Guerra Fría': 'The Cold War',
  'Chile a mediados del Siglo XX': 'Chile in the Mid-20th Century',
  'Reformas Estructurales y Quiebre Democrático': 'Structural Reforms and Democratic Breakdown',
  
  // 3ro Medio - Matemáticas
  'Estadística y Probabilidades': 'Statistics and Probabilities',
  'Álgebra y Funciones (Modelamiento)': 'Algebra and Functions (Modeling)',
  'Geometría (Circunferencia)': 'Geometry (Circumference)',
  'Números (Complejos)': 'Numbers (Complex)',
  
  // 3ro Medio - Lenguaje
  'Lectura e Interpretación (Sociedad)': 'Reading and Interpretation (Society)',
  'Identidad y Cultura': 'Identity and Culture',
  'Emociones y Realidad': 'Emotions and Reality',
  'Identidad y Sociedad': 'Identity and Society',
  
  // 8vo Básico - Lenguaje y Comunicación (NUEVOS)
  'El Amor en la Literatura': 'Love in Literature',
  'La Entrevista': 'The Interview',
  'Misterio y Comedia': 'Mystery and Comedy',
  'Argumentación y Medios': 'Argumentation and Media',
  'La Épica y el Héroe': 'The Epic and the Hero',
  'Poesía y Naturaleza': 'Poetry and Nature',
  'Ciencia Ficción y Distopía': 'Science Fiction and Dystopia',
  'Discurso Público': 'Public Speech',
  
  // 7mo Básico - Lenguaje y Comunicación
  'El Héroe en Distintas Épocas': 'The Hero in Different Eras',
  'Artículos Informativos y Noticias': 'Informative Articles and News',
  'Relatos de Terror': 'Horror Stories',
  'Textos Publicitarios y Propaganda': 'Advertising and Propaganda Texts',
  'Teatro: Orígenes y Comedia': 'Theater: Origins and Comedy',
  'Infografías': 'Infographics',
  'Relatos de Ciencia Ficción': 'Science Fiction Stories',
  'Discursos Orales y Charlas Radiales': 'Oral Speeches and Radio Talks',
  
  // 3ro Medio - Ciencias para la Ciudadanía
  'Salud y Enfermedad': 'Health and Disease',
  'Prevención de Infecciones': 'Infection Prevention',
  'Riesgos Socionaturales': 'Socionatural Risks',
  'Riesgos en el Entorno': 'Environmental Risks',
  'Consumo Sostenible': 'Sustainable Consumption',
  'Innovación Tecnológica': 'Technological Innovation',
  'Proyectos Tecnológicos': 'Technological Projects',
  
  // 4to Medio - Matemáticas
  'Decisiones Financieras': 'Financial Decisions',
  'Funciones Trigonométricas y Modelamiento': 'Trigonometric Functions and Modeling',
  'Probabilidades y Distribuciones': 'Probabilities and Distributions',
  
  // 5to Básico - Historia
  'Zonas Naturales de Chile': 'Natural Zones of Chile',
  'Recursos Naturales': 'Natural Resources',
  'La Expansión Europea': 'European Expansion',
  'Conquista de América y Chile': 'Conquest of America and Chile',
  'Guerra de Arauco y Vida Fronteriza': 'War of Arauco and Frontier Life',
  'La Colonia': 'The Colony',
  'Riesgos Naturales': 'Natural Risks',
  
  // 6to Básico - Lenguaje
  'Novelas y Motivaciones': 'Novels and Motivations',
  'Textos Informativos': 'Informative Texts',
  
  // 6to Básico - Historia
  'Democracia y Constitución': 'Democracy and Constitution',
  'Organización de la República y Siglo XIX': 'Organization of the Republic and 19th Century',
  'Chile en el Siglo XX': 'Chile in the 20th Century',
  'Geografía Regional y Desastres': 'Regional Geography and Disasters',
  
  // 6to Básico - Matemáticas
  'Operaciones y Números Naturales': 'Operations and Natural Numbers',
  'Razones y Porcentajes': 'Ratios and Percentages',
  'Patrones y Álgebra': 'Patterns and Algebra',
  'Ecuaciones': 'Equations',
  'Ángulos y Construcciones Geométricas': 'Angles and Geometric Constructions',
  'Teselaciones': 'Tessellations',
  'Área y Volumen': 'Area and Volume',
  
  // 7mo Básico - Matemáticas
  'Porcentajes y Potencias': 'Percentages and Powers',
  'Geometría (Polígonos y Círculos)': 'Geometry (Polygons and Circles)',
  'Plano Cartesiano y Vectores': 'Cartesian Plane and Vectors',
  'Números Enteros (Z)': 'Integers (Z)',
  
  // 7mo Básico - Lenguaje
  'El Héroe y el Viaje': 'The Hero and the Journey',
  'La Amistad en la Literatura': 'Friendship in Literature',
  'Textos Argumentativos (Opinión)': 'Argumentative Texts (Opinion)',
  'Mitología y Cultura Popular': 'Mythology and Popular Culture',
  'Literatura de Terror y Miedo': 'Horror and Fear Literature',
  
  // 7mo Básico - Ciencias
  'La Materia y sus Cambios': 'Matter and Its Changes',
  'Los Gases y sus Leyes': 'Gases and Their Laws',
  'Fuerza y Presión': 'Force and Pressure',
  'Dinámica Terrestre': 'Earth Dynamics',
  'Microorganismos y Barreras Defensivas': 'Microorganisms and Defense Barriers',
  'Sexualidad y Autocuidado': 'Sexuality and Self-care',
  
  // 7mo Básico - Historia
  'Evolución y Hominización': 'Evolution and Hominization',
  'Revolución del Neolítico': 'Neolithic Revolution',
  'Civilizaciones Clásicas: Grecia': 'Classical Civilizations: Greece',
  'Civilizaciones Clásicas: Roma': 'Classical Civilizations: Rome',
  'La Edad Media': 'The Middle Ages',
  'Civilizaciones de América': 'Civilizations of America',
  
  // 4to Medio - Lenguaje
  'Razón y Pasión': 'Reason and Passion',
  'Individuo y Sociedad': 'Individual and Society',
  'Migración e Identidad': 'Migration and Identity',
  
  // 4to Medio - Educación Ciudadana
  'Participación Activa': 'Active Participation',
  'Medios de Comunicación': 'Media and Communication',
  'Inclusión y Democracia': 'Inclusion and Democracy',
  'Trabajo y Desarrollo': 'Work and Development',
  
  // 4to Medio - Filosofía
  'Ética y Política': 'Ethics and Politics',
  'Estética': 'Aesthetics',
  'Filosofía y Sociedad Actual': 'Philosophy and Current Society',
  
  // 4to Medio - Ciencias para la Ciudadanía
  'Bienestar y Salud': 'Wellness and Health',
  'Seguridad y Autocuidado': 'Safety and Self-care',
  'Ambiente y Sostenibilidad': 'Environment and Sustainability',
  'Tecnología y Sociedad': 'Technology and Society',
  
  // 5to Básico - Ciencias
  'El Agua en el Planeta': 'Water on the Planet',
  'Usos y Cuidado del Agua': 'Uses and Care of Water',
  'Sistemas del Cuerpo Humano': 'Human Body Systems',
  'Nutrición y Alimentación': 'Nutrition and Diet',
  'Salud y Microorganismos': 'Health and Microorganisms',
  'La Energía Eléctrica': 'Electrical Energy',
  
  // 6to Básico - Ciencias
  'Reproducción y Pubertad': 'Reproduction and Puberty',
  'Vida Saludable y Drogas': 'Healthy Living and Drugs',
  'Fotosíntesis y Cadenas Tróficas': 'Photosynthesis and Food Chains',
  'Materia y Cambios de Estado': 'Matter and State Changes',
  'Energía y Recursos': 'Energy and Resources',
  'Capas de la Tierra y Suelo': 'Earth Layers and Soil',
  
  // 5to Básico - Lenguaje
  'El Arte de Contar Historias': 'The Art of Storytelling',
  'Textos Informativos y Noticias': 'Informative Texts and News',
  'Biografías y Creatividad': 'Biographies and Creativity',
  'La Novela y el Viaje': 'The Novel and the Journey',
  'Texto Dramático': 'Dramatic Text',
  
  // 5to Básico - Matemáticas
  'Grandes Números': 'Large Numbers',
  'Estrategias de Cálculo': 'Calculation Strategies',
  'Figuras Geométricas y Congruencia': 'Geometric Figures and Congruence',
  'Área y Perímetro': 'Area and Perimeter',
  'Plano Cartesiano': 'Cartesian Plane',
  'Fracciones y Números Mixtos': 'Fractions and Mixed Numbers',
  'Operaciones con Fracciones': 'Operations with Fractions',
  'Números Decimales': 'Decimal Numbers',
  'Álgebra (Ecuaciones)': 'Algebra (Equations)',
  'Datos y Probabilidades': 'Data and Probabilities',
  
  // 3ro Básico - Matemáticas
  'Orden y Comparación': 'Order and Comparison',
  'Adición y Sustracción': 'Addition and Subtraction',
  'Figuras 3D y Perímetro': '3D Shapes and Perimeter',
  'El Tiempo': 'Time',
  'Gráficos y Probabilidades': 'Graphs and Probabilities',
  'Fracciones': 'Fractions',
  'Geometría y Ubicación': 'Geometry and Location',
  
  // Descripciones de Biología 1ro Medio
  'Evidencias de la evolución (fósiles, anatomía comparada, ADN). Teoría de la Selección Natural de Darwin y Wallace. Clasificación de los seres vivos (Taxonomía) y filogenia humana.': 'Evidence of evolution (fossils, comparative anatomy, DNA). Theory of Natural Selection by Darwin and Wallace. Classification of living things (Taxonomy) and human phylogeny.',
  'Niveles de organización (población, comunidad, ecosistema). Interacciones biológicas (depredación, competencia, mutualismo). Dinámica de poblaciones (tamaño, densidad, crecimiento).': 'Levels of organization (population, community, ecosystem). Biological interactions (predation, competition, mutualism). Population dynamics (size, density, growth).',
  'Flujo de energía (cadenas y tramas tróficas). Ciclos biogeoquímicos (Carbono, Nitrógeno, Agua). Fotosíntesis y respiración celular como procesos complementarios. Impacto humano en los ecosistemas.': 'Energy flow (food chains and food webs). Biogeochemical cycles (Carbon, Nitrogen, Water). Photosynthesis and cellular respiration as complementary processes. Human impact on ecosystems.',
  'Unidad 1 - ¿Cómo ha evolucionado la vida en la Tierra?': 'Unit 1 - How has life evolved on Earth?',
  'Unidad 2 - ¿Cómo interactúan los organismos?': 'Unit 2 - How do organisms interact?',
  'Unidad 3 - ¿Qué ocurre con la materia y la energía?': 'Unit 3 - What happens with matter and energy?',
};

// Función para traducir automáticamente un texto usando el diccionario
function autoTranslateText(text: string): string {
  // Primero intentar traducción exacta del mapeo de temas completo
  const directTranslation = topicTranslations[text];
  if (directTranslation) {
    return directTranslation.topic;
  }
  
  // Segundo, intentar traducción de frase completa
  const phraseTranslation = phraseTranslations[text];
  if (phraseTranslation) {
    return phraseTranslation;
  }
  
  // Si no hay traducción directa, traducir palabra por palabra
  const words = text.split(/\s+/);
  const translatedWords: string[] = [];
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordLower = word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Buscar traducción de la palabra
    let translated = false;
    for (const [es, en] of Object.entries(wordTranslations)) {
      const esNorm = es.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (wordLower === esNorm) {
        translatedWords.push(en);
        translated = true;
        break;
      }
    }
    
    // Si no se encontró traducción, mantener la palabra original pero capitalizada si es la primera
    if (!translated) {
      // Mantener números y símbolos como están
      if (/^\d+/.test(word) || /^[()[\]{}.,;:!?]/.test(word)) {
        translatedWords.push(word);
      } else {
        // Para palabras no traducidas, capitalizar primera letra
        translatedWords.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
      }
    }
  }
  
  // Limpiar resultado: eliminar artículos duplicados y palabras vacías
  let result = translatedWords.join(' ');
  result = result.replace(/\s+(of the|the|of|a|and)\s+(of the|the|of|a|and)\s+/gi, ' $1 ');
  result = result.replace(/^(of the|the|of|a)\s+/i, '');
  result = result.replace(/\s{2,}/g, ' ').trim();
  
  // Capitalizar la primera letra del resultado
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// Función para traducir una descripción automáticamente
function autoTranslateDescription(desc: TopicDescription): TopicDescription {
  return {
    topic: autoTranslateText(desc.topic),
    unit: autoTranslateText(desc.unit),
    description: autoTranslateText(desc.description)
  };
}

// Función para traducir un array de temas al inglés
function translateTopics(topics: string[], language: 'es' | 'en'): string[] {
  if (language === 'es') {
    return topics;
  }
  
  return topics.map(topic => {
    // Primero intentar traducción exacta del mapeo
    const translation = topicTranslations[topic];
    if (translation) {
      return translation.topic;
    }
    // Si no hay traducción exacta, usar traducción automática
    return autoTranslateText(topic);
  });
}

// Función para traducir título de libro al inglés
function translateBookTitle(title: string, language: 'es' | 'en'): string {
  if (language === 'es' || !title) return title;
  
  // Traducciones de nombres de asignaturas para títulos de libros
  const subjectTranslations: Record<string, string> = {
    'Matemáticas': 'Mathematics',
    'Lenguaje y Comunicación': 'Language and Communication',
    'Lengua y Literatura': 'Language and Literature',
    'Ciencias Naturales': 'Natural Sciences',
    'Historia, Geografía y Ciencias Sociales': 'History, Geography and Social Sciences',
    'Biología': 'Biology',
    'Física': 'Physics',
    'Química': 'Chemistry',
    'Ciencias para la Ciudadanía': 'Science for Citizenship',
    'Educación Ciudadana': 'Civic Education',
    'Filosofía': 'Philosophy',
    'Inglés': 'English',
  };
  
  // Traducciones de niveles de cursos
  const courseTranslations: Record<string, string> = {
    '1ro Básico': '1st Grade', '2do Básico': '2nd Grade', '3ro Básico': '3rd Grade',
    '4to Básico': '4th Grade', '5to Básico': '5th Grade', '6to Básico': '6th Grade',
    '7mo Básico': '7th Grade', '8vo Básico': '8th Grade',
    '1ro Medio': '9th Grade', '2do Medio': '10th Grade',
    '3ro Medio': '11th Grade', '4to Medio': '12th Grade',
  };
  
  let translatedTitle = title;
  
  // Traducir nombres de asignaturas
  for (const [es, en] of Object.entries(subjectTranslations)) {
    translatedTitle = translatedTitle.replace(es, en);
  }
  
  // Traducir niveles de cursos
  for (const [es, en] of Object.entries(courseTranslations)) {
    translatedTitle = translatedTitle.replace(es, en);
  }
  
  return translatedTitle;
}

const AnalyzeSubjectTopicsInputSchema = z.object({
  courseName: z.string().describe('Course name (e.g., "1ro Básico", "2do Medio").'),
  subjectName: z.string().describe('Subject name (e.g., "Matemáticas", "Lenguaje y Comunicación").'),
  language: z.enum(['es', 'en']).describe('Output language.'),
});

export type AnalyzeSubjectTopicsInput = z.infer<typeof AnalyzeSubjectTopicsInputSchema>;

const AnalyzeSubjectTopicsOutputSchema = z.object({
  topics: z.array(z.string()).max(40).describe('Distinct topics detected for the subject.'),
  bookTitle: z.string().optional().describe('Title of the book analyzed.'),
  topicDescriptions: z.record(z.any()).optional().describe('Descriptions for each topic.'),
});

export type AnalyzeSubjectTopicsOutput = z.infer<typeof AnalyzeSubjectTopicsOutputSchema> & {
  topicDescriptions?: Record<string, TopicDescription>;
};

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
function detectSubjectType(subjectName: string): 'math' | 'language' | 'science' | 'history' | 'physics' | 'chemistry' | 'biology' | 'other' {
  const s = normalize(subjectName);
  
  if (/matem|math|algebra|geometr|trigonom|calculo|aritmet|matriz|estadistic|probabil/i.test(s)) {
    return 'math';
  }
  if (/lenguaje|comunicacion|language|literature|literatura|gramatica|ortografia|lectura|escritura/i.test(s)) {
    return 'language';
  }
  // Detectar Física específicamente
  if (/^fisica$|^physics$|fisica\s*\d|physics\s*\d/i.test(s)) {
    return 'physics';
  }
  // Detectar Química específicamente
  if (/^quimica$|^chemistry$|quimica\s*\d|chemistry\s*\d/i.test(s)) {
    return 'chemistry';
  }
  // Detectar Biología específicamente
  if (/^biologia$|^biology$|biologia\s*\d|biology\s*\d/i.test(s)) {
    return 'biology';
  }
  // Ciencias Naturales general (básica)
  if (/ciencia|natural|science/i.test(s) && !s.includes('social')) {
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
  subjectType: 'math' | 'language' | 'science' | 'history' | 'physics' | 'chemistry' | 'biology' | 'other',
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
    // FÍSICA - Temas específicos por nivel
    physics: {
      basico: [
        'Fuerza y movimiento', 'Energía', 'Luz y sonido', 'Electricidad básica',
        'Magnetismo', 'Calor y temperatura', 'Máquinas simples'
      ],
      medio: [
        'Cinemática', 'Dinámica', 'Leyes de Newton', 'Trabajo y energía',
        'Momentum y colisiones', 'Movimiento circular', 'Gravitación universal',
        'Fluidos y presión', 'Ondas mecánicas', 'Ondas sonoras',
        'Óptica geométrica', 'Óptica física', 'Electricidad y circuitos',
        'Electromagnetismo', 'Inducción electromagnética', 'Termodinámica',
        'Física moderna', 'Relatividad especial', 'Física cuántica introductoria',
        'Física nuclear', 'Energía nuclear'
      ],
      superior: [
        'Mecánica clásica avanzada', 'Electrodinámica', 'Física cuántica',
        'Mecánica estadística', 'Relatividad general', 'Física de partículas',
        'Física del estado sólido', 'Astrofísica', 'Cosmología'
      ]
    },
    // QUÍMICA - Temas específicos por nivel
    chemistry: {
      basico: [
        'Estados de la materia', 'Mezclas y soluciones', 'Cambios físicos y químicos',
        'Propiedades de la materia', 'Átomos y moléculas básicos'
      ],
      medio: [
        'Estructura atómica', 'Modelos atómicos', 'Tabla periódica',
        'Configuración electrónica', 'Enlaces químicos', 'Enlace iónico',
        'Enlace covalente', 'Enlace metálico', 'Nomenclatura química',
        'Reacciones químicas', 'Estequiometría', 'Soluciones y concentración',
        'Ácidos y bases', 'pH y neutralización', 'Termoquímica',
        'Cinética química', 'Equilibrio químico', 'Química orgánica',
        'Hidrocarburos', 'Grupos funcionales', 'Polímeros',
        'Electroquímica', 'Pilas y baterías'
      ],
      superior: [
        'Química analítica', 'Química física', 'Química inorgánica avanzada',
        'Química orgánica avanzada', 'Bioquímica', 'Espectroscopía',
        'Síntesis orgánica', 'Catálisis', 'Química ambiental'
      ]
    },
    // BIOLOGÍA - Temas específicos por nivel
    biology: {
      basico: [
        'Seres vivos', 'Plantas y animales', 'El cuerpo humano',
        'Alimentación y nutrición', 'Los sentidos', 'Ecosistemas'
      ],
      medio: [
        'La célula', 'Estructura celular', 'Organelos celulares',
        'Membrana celular', 'División celular', 'Mitosis y meiosis',
        'Genética mendeliana', 'ADN y ARN', 'Síntesis de proteínas',
        'Mutaciones', 'Herencia y cromosomas', 'Evolución biológica',
        'Selección natural', 'Origen de las especies', 'Clasificación de los seres vivos',
        'Ecología', 'Flujo de energía', 'Ciclos biogeoquímicos',
        'Biodiversidad', 'Anatomía humana', 'Sistemas del cuerpo humano',
        'Sistema nervioso', 'Sistema endocrino', 'Sistema inmunológico',
        'Reproducción humana', 'Microbiología', 'Virus y bacterias'
      ],
      superior: [
        'Biología molecular', 'Genética molecular', 'Biotecnología',
        'Ingeniería genética', 'Bioinformática', 'Neurobiología',
        'Inmunología avanzada', 'Microbiología avanzada', 'Ecología avanzada'
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
    // PHYSICS - Specific topics by level
    physics: {
      basico: [
        'Force and motion', 'Energy', 'Light and sound', 'Basic electricity',
        'Magnetism', 'Heat and temperature', 'Simple machines'
      ],
      medio: [
        'Kinematics', 'Dynamics', 'Newton\'s Laws', 'Work and energy',
        'Momentum and collisions', 'Circular motion', 'Universal gravitation',
        'Fluids and pressure', 'Mechanical waves', 'Sound waves',
        'Geometric optics', 'Physical optics', 'Electricity and circuits',
        'Electromagnetism', 'Electromagnetic induction', 'Thermodynamics',
        'Modern physics', 'Special relativity', 'Introductory quantum physics',
        'Nuclear physics', 'Nuclear energy'
      ],
      superior: [
        'Advanced classical mechanics', 'Electrodynamics', 'Quantum physics',
        'Statistical mechanics', 'General relativity', 'Particle physics',
        'Solid state physics', 'Astrophysics', 'Cosmology'
      ]
    },
    // CHEMISTRY - Specific topics by level
    chemistry: {
      basico: [
        'States of matter', 'Mixtures and solutions', 'Physical and chemical changes',
        'Properties of matter', 'Basic atoms and molecules'
      ],
      medio: [
        'Atomic structure', 'Atomic models', 'Periodic table',
        'Electron configuration', 'Chemical bonds', 'Ionic bonding',
        'Covalent bonding', 'Metallic bonding', 'Chemical nomenclature',
        'Chemical reactions', 'Stoichiometry', 'Solutions and concentration',
        'Acids and bases', 'pH and neutralization', 'Thermochemistry',
        'Chemical kinetics', 'Chemical equilibrium', 'Organic chemistry',
        'Hydrocarbons', 'Functional groups', 'Polymers',
        'Electrochemistry', 'Batteries and cells'
      ],
      superior: [
        'Analytical chemistry', 'Physical chemistry', 'Advanced inorganic chemistry',
        'Advanced organic chemistry', 'Biochemistry', 'Spectroscopy',
        'Organic synthesis', 'Catalysis', 'Environmental chemistry'
      ]
    },
    // BIOLOGY - Specific topics by level
    biology: {
      basico: [
        'Living things', 'Plants and animals', 'The human body',
        'Food and nutrition', 'The senses', 'Ecosystems'
      ],
      medio: [
        'The cell', 'Cell structure', 'Cell organelles',
        'Cell membrane', 'Cell division', 'Mitosis and meiosis',
        'Mendelian genetics', 'DNA and RNA', 'Protein synthesis',
        'Mutations', 'Heredity and chromosomes', 'Biological evolution',
        'Natural selection', 'Origin of species', 'Classification of living things',
        'Ecology', 'Energy flow', 'Biogeochemical cycles',
        'Biodiversity', 'Human anatomy', 'Human body systems',
        'Nervous system', 'Endocrine system', 'Immune system',
        'Human reproduction', 'Microbiology', 'Viruses and bacteria'
      ],
      superior: [
        'Molecular biology', 'Molecular genetics', 'Biotechnology',
        'Genetic engineering', 'Bioinformatics', 'Neurobiology',
        'Advanced immunology', 'Advanced microbiology', 'Advanced ecology'
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
    ],
    '5to basico': [
      'Sistemas del cuerpo humano', 'Sistema digestivo y nutrición', 'Sistema respiratorio',
      'Sistema circulatorio', 'Ciclos de la materia', 'Fotosíntesis', 'Energía en los ecosistemas',
      'Electricidad y circuitos', 'Propiedades de la luz', 'Capas de la Tierra'
    ],
    '6to basico': [
      'Pubertad y adolescencia', 'Sistema reproductor', 'Células y tejidos',
      'Niveles de organización biológica', 'Transferencia de energía', 'Formación de suelos',
      'Capas de la Tierra', 'Sismos y volcanes', 'Energías renovables', 'Cambio climático'
    ],
    '7mo basico': [
      'Organización celular', 'Microorganismos', 'Virus y bacterias', 'Sistema inmunológico',
      'Fuerza y movimiento', 'Leyes de Newton', 'Ondas y sonido', 'Efectos de la fuerza',
      'Modelos atómicos', 'Tabla periódica', 'Enlaces químicos'
    ],
    '8vo basico': [
      'Nutrición y digestión', 'Sistema circulatorio y respiratorio', 'Excreción y sistema urinario',
      'Sexualidad y reproducción humana', 'Modelo corpuscular de la materia', 'Estructura atómica',
      'Reacciones químicas', 'Electricidad y magnetismo', 'Circuitos eléctricos', 'El universo',
      'Sistema solar', 'Origen del universo', 'Evolución estelar'
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
    ],
    '5to basico': [
      'Grecia antigua', 'Democracia ateniense', 'Roma antigua', 'Legado greco-romano',
      'Civilización medieval', 'Feudalismo', 'El Renacimiento', 'Geografía de Europa',
      'Derechos humanos fundamentales', 'Ciudadanía y participación', 'Trabajo y economía'
    ],
    '6to basico': [
      'Proceso de independencia', 'Formación de América Latina', 'Chile republicano',
      'Organización política de Chile', 'Constitución y derechos', 'Geografía de América',
      'Recursos naturales americanos', 'Integración latinoamericana', 'Problemas ambientales',
      'Economía y comercio', 'Democracia y Estado de derecho'
    ],
    '7mo basico': [
      'Primeras civilizaciones', 'Mesopotamia y Egipto', 'India y China antiguas',
      'Imperio persa', 'Grecia clásica', 'Alejandro Magno', 'República romana',
      'Imperio romano', 'Caída del Imperio romano', 'Edad Media temprana',
      'El Islam y su expansión', 'Feudalismo europeo'
    ],
    '8vo basico': [
      'Renacimiento y Humanismo', 'Reforma protestante', 'Expansión europea',
      'Conquista de América', 'Colonización de América', 'Economía colonial',
      'Ilustración', 'Revoluciones del siglo XVIII', 'Independencia de EE.UU.',
      'Revolución Francesa', 'Revolución Industrial', 'Imperialismo',
      'Formación de los Estados nacionales', 'Chile colonial'
    ]
  };
  
  // Temas específicos por curso para FÍSICA (Enseñanza Media)
  const physicsTopicsEs: Record<string, string[]> = {
    '1ro medio': [
      'Cinemática: posición, desplazamiento y trayectoria', 'Velocidad y rapidez',
      'Movimiento rectilíneo uniforme (MRU)', 'Aceleración', 'Movimiento rectilíneo uniformemente acelerado (MRUA)',
      'Caída libre y lanzamiento vertical', 'Gráficos de movimiento', 'Vectores y escalares',
      'Fuerza y leyes de Newton', 'Primera ley de Newton (inercia)', 'Segunda ley de Newton',
      'Tercera ley de Newton (acción y reacción)', 'Fuerza de rozamiento', 'Fuerza peso y normal',
      'Diagrama de cuerpo libre', 'Trabajo mecánico', 'Potencia mecánica', 'Energía cinética',
      'Energía potencial gravitatoria', 'Conservación de la energía mecánica'
    ],
    '2do medio': [
      'Momentum o cantidad de movimiento', 'Impulso', 'Conservación del momentum',
      'Colisiones elásticas e inelásticas', 'Movimiento circular uniforme', 'Velocidad angular',
      'Aceleración centrípeta', 'Fuerza centrípeta', 'Torque y momento de fuerza',
      'Equilibrio rotacional', 'Gravitación universal', 'Ley de gravitación de Newton',
      'Movimiento de satélites', 'Leyes de Kepler', 'Hidrostática', 'Presión',
      'Presión atmosférica', 'Principio de Pascal', 'Principio de Arquímedes', 'Fluidos en movimiento'
    ],
    '3ro medio': [
      'Ondas mecánicas', 'Características de las ondas', 'Ondas transversales y longitudinales',
      'Longitud de onda, frecuencia y amplitud', 'Velocidad de propagación', 'Reflexión de ondas',
      'Refracción de ondas', 'Difracción', 'Interferencia de ondas', 'Ondas estacionarias',
      'Ondas sonoras', 'Velocidad del sonido', 'Intensidad del sonido', 'Efecto Doppler',
      'Luz y espectro electromagnético', 'Reflexión de la luz', 'Refracción de la luz',
      'Lentes convergentes y divergentes', 'Espejos planos y curvos', 'Óptica del ojo humano'
    ],
    '4to medio': [
      'Electricidad estática', 'Carga eléctrica', 'Ley de Coulomb', 'Campo eléctrico',
      'Potencial eléctrico', 'Corriente eléctrica', 'Ley de Ohm', 'Resistencia eléctrica',
      'Circuitos eléctricos', 'Circuitos en serie y paralelo', 'Potencia eléctrica',
      'Magnetismo', 'Campo magnético', 'Fuerza magnética sobre cargas', 'Inducción electromagnética',
      'Ley de Faraday', 'Transformadores', 'Termodinámica', 'Temperatura y calor',
      'Transferencia de calor', 'Primera ley de la termodinámica', 'Segunda ley de la termodinámica',
      'Física moderna introductoria', 'Efecto fotoeléctrico', 'Dualidad onda-partícula'
    ]
  };
  
  // Temas específicos por curso para QUÍMICA (Enseñanza Media)
  const chemistryTopicsEs: Record<string, string[]> = {
    '1ro medio': [
      'Teoría atómica', 'Modelos atómicos históricos', 'Modelo atómico actual',
      'Estructura del átomo', 'Número atómico y masa atómica', 'Isótopos',
      'Configuración electrónica', 'Niveles y subniveles de energía', 'Tabla periódica',
      'Grupos y períodos', 'Propiedades periódicas', 'Radio atómico',
      'Energía de ionización', 'Electronegatividad', 'Metales, no metales y metaloides',
      'Enlace químico', 'Enlace iónico', 'Enlace covalente', 'Enlace metálico',
      'Estructura de Lewis', 'Polaridad de moléculas'
    ],
    '2do medio': [
      'Nomenclatura química inorgánica', 'Óxidos', 'Hidróxidos', 'Ácidos', 'Sales',
      'Reacciones químicas', 'Tipos de reacciones químicas', 'Balanceo de ecuaciones',
      'Estequiometría', 'Mol y número de Avogadro', 'Masa molar', 'Cálculos estequiométricos',
      'Reactivo limitante', 'Rendimiento de reacciones', 'Soluciones químicas',
      'Concentración de soluciones', 'Molaridad', 'Diluciones', 'Propiedades coligativas',
      'Gases ideales', 'Ley de los gases ideales', 'Presión parcial'
    ],
    '3ro medio': [
      'Termoquímica', 'Entalpía', 'Reacciones exotérmicas y endotérmicas',
      'Energía de enlace', 'Ley de Hess', 'Cinética química', 'Velocidad de reacción',
      'Factores que afectan la velocidad', 'Catalizadores', 'Equilibrio químico',
      'Constante de equilibrio', 'Principio de Le Chatelier', 'Ácidos y bases',
      'Teoría de Arrhenius', 'Teoría de Brønsted-Lowry', 'pH y pOH',
      'Indicadores ácido-base', 'Neutralización', 'Titulación'
    ],
    '4to medio': [
      'Química orgánica', 'El átomo de carbono', 'Hibridación del carbono',
      'Hidrocarburos', 'Alcanos', 'Alquenos', 'Alquinos', 'Hidrocarburos cíclicos',
      'Hidrocarburos aromáticos', 'Isomería', 'Grupos funcionales',
      'Alcoholes', 'Éteres', 'Aldehídos', 'Cetonas', 'Ácidos carboxílicos',
      'Ésteres', 'Aminas', 'Amidas', 'Polímeros', 'Polímeros naturales y sintéticos',
      'Electroquímica', 'Reacciones redox', 'Pilas y baterías', 'Electrólisis'
    ]
  };
  
  // Temas específicos por curso para BIOLOGÍA (Enseñanza Media)
  const biologyTopicsEs: Record<string, string[]> = {
    '1ro medio': [
      'La célula como unidad de vida', 'Teoría celular', 'Célula procarionte y eucarionte',
      'Organelos celulares', 'Membrana plasmática', 'Transporte celular',
      'Difusión y ósmosis', 'Núcleo celular', 'ADN y cromosomas', 'Ciclo celular',
      'Mitosis', 'Meiosis', 'Diferencias entre mitosis y meiosis', 'Reproducción celular',
      'Metabolismo celular', 'Respiración celular', 'Fotosíntesis', 'ATP y energía celular',
      'Enzimas', 'Fermentación'
    ],
    '2do medio': [
      'Genética mendeliana', 'Leyes de Mendel', 'Herencia dominante y recesiva',
      'Cuadro de Punnett', 'Herencia ligada al sexo', 'Cromosomas sexuales',
      'Mutaciones genéticas', 'Estructura del ADN', 'Replicación del ADN',
      'Transcripción', 'Traducción', 'Síntesis de proteínas', 'Código genético',
      'Ingeniería genética', 'Biotecnología', 'Organismos transgénicos',
      'Clonación', 'Bioética', 'Genoma humano', 'Terapia génica'
    ],
    '3ro medio': [
      'Sistema nervioso', 'Neurona y sinapsis', 'Sistema nervioso central',
      'Sistema nervioso periférico', 'Sistema nervioso autónomo', 'Receptores sensoriales',
      'Sistema endocrino', 'Hormonas', 'Glándulas endocrinas', 'Homeostasis',
      'Regulación hormonal', 'Sistema inmunológico', 'Inmunidad innata',
      'Inmunidad adquirida', 'Anticuerpos', 'Vacunas', 'Enfermedades autoinmunes',
      'VIH y SIDA', 'Respuesta inflamatoria', 'Alergias'
    ],
    '4to medio': [
      'Evolución biológica', 'Teoría de Darwin', 'Selección natural',
      'Evidencias de la evolución', 'Especiación', 'Origen de la vida',
      'Historia de la vida en la Tierra', 'Eras geológicas', 'Evolución humana',
      'Ecología', 'Ecosistemas', 'Cadenas y redes tróficas', 'Flujo de energía',
      'Ciclos biogeoquímicos', 'Ciclo del carbono', 'Ciclo del nitrógeno',
      'Dinámica de poblaciones', 'Relaciones interespecíficas', 'Biodiversidad',
      'Conservación ambiental', 'Cambio climático', 'Desarrollo sustentable'
    ]
  };
  
  // Función auxiliar para normalizar nombre de curso
  const normalizeCourseName = (course: string): string => {
    const normalized = normalize(course);
    
    // Primero detectar si es enseñanza media
    const isMedio = normalized.includes('medio');
    
    // Mapear variantes de nombres de cursos para ENSEÑANZA MEDIA
    if (isMedio) {
      if (normalized.includes('4to') || normalized.includes('4°') || normalized.includes('cuarto')) {
        return '4to medio';
      }
      if (normalized.includes('3ro') || normalized.includes('3°') || normalized.includes('tercero')) {
        return '3ro medio';
      }
      if (normalized.includes('2do') || normalized.includes('2°') || normalized.includes('segundo')) {
        return '2do medio';
      }
      if (normalized.includes('1ro') || normalized.includes('1°') || normalized.includes('primero')) {
        return '1ro medio';
      }
    }
    
    // Mapear variantes de nombres de cursos para ENSEÑANZA BÁSICA
    if (normalized.includes('8vo') || normalized.includes('8°') || normalized.includes('octavo')) {
      return '8vo basico';
    }
    if (normalized.includes('7mo') || normalized.includes('7°') || normalized.includes('septimo')) {
      return '7mo basico';
    }
    if (normalized.includes('6to') || normalized.includes('6°') || normalized.includes('sexto')) {
      return '6to basico';
    }
    if (normalized.includes('5to') || normalized.includes('5°') || normalized.includes('quinto')) {
      return '5to basico';
    }
    if (normalized.includes('4to') || normalized.includes('4°') || normalized.includes('cuarto')) {
      return '4to basico';
    }
    if (normalized.includes('3ro') || normalized.includes('3°') || normalized.includes('tercero')) {
      return '3ro basico';
    }
    if (normalized.includes('2do') || normalized.includes('2°') || normalized.includes('segundo')) {
      return '2do basico';
    }
    if (normalized.includes('1ro') || normalized.includes('1°') || normalized.includes('primero')) {
      return '1ro basico';
    }
    return normalized;
  };

  const normalizedCourse = normalizeCourseName(course);
  
  console.log('[getSpecificTopics] Checking subject:', subject, 'course:', normalizedCourse);
  
  // IMPORTANTE: El orden de detección importa!
  // Historia DEBE ir ANTES de Ciencias porque "Historia, Geografía y Ciencias Sociales" contiene "ciencia"
  // Física, Química y Biología DEBEN ir ANTES de Ciencias Naturales genérico
  
  // Buscar temas específicos para Historia (detectar primero por "historia" o "social")
  if (subject.includes('historia') || subject.includes('social') || subject.includes('geografia')) {
    console.log('[getSpecificTopics] Detected as HISTORY');
    const topics = historyTopicsEs[normalizedCourse];
    if (topics) {
      return language === 'es' ? topics : topics;
    }
  }
  
  // FÍSICA - Detectar específicamente antes de ciencias genéricas
  if (subject.includes('fisica') || subject.includes('physics')) {
    console.log('[getSpecificTopics] Detected as PHYSICS');
    const topics = physicsTopicsEs[normalizedCourse];
    if (topics) {
      return language === 'es' ? topics : topics;
    }
  }
  
  // QUÍMICA - Detectar específicamente antes de ciencias genéricas
  if (subject.includes('quimica') || subject.includes('chemistry')) {
    console.log('[getSpecificTopics] Detected as CHEMISTRY');
    const topics = chemistryTopicsEs[normalizedCourse];
    if (topics) {
      return language === 'es' ? topics : topics;
    }
  }
  
  // BIOLOGÍA - Detectar específicamente antes de ciencias genéricas
  if (subject.includes('biologia') || subject.includes('biology')) {
    console.log('[getSpecificTopics] Detected as BIOLOGY');
    const topics = biologyTopicsEs[normalizedCourse];
    if (topics) {
      return language === 'es' ? topics : topics;
    }
  }
  
  // Buscar temas específicos para Ciencias Naturales (solo si contiene "natural" o es exactamente "ciencias")
  if (subject.includes('natural') || (subject.includes('ciencia') && !subject.includes('social'))) {
    console.log('[getSpecificTopics] Detected as SCIENCE');
    const topics = scienceTopicsEs[normalizedCourse];
    if (topics) {
      return language === 'es' ? topics : topics;
    }
  }
  
  // Buscar temas específicos para Lenguaje
  if (subject.includes('lenguaje') || subject.includes('comunicacion')) {
    console.log('[getSpecificTopics] Detected as LANGUAGE');
    const topics = languageTopicsEs[normalizedCourse];
    if (topics) {
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
      console.log('[analyze-subject] Using cached topics for language:', input.language);
      // Intentar obtener descripciones si existen
      const descriptionsData = getTopicsWithDescriptions(input.courseName, input.subjectName);
      // Traducir las descripciones si el idioma es inglés
      const translatedDescriptions = descriptionsData?.descriptions 
        ? translateTopicDescriptions(descriptionsData.descriptions, input.language)
        : undefined;
      return { 
        topics: cached.topics, 
        bookTitle: cached.bookTitle,
        topicDescriptions: translatedDescriptions
      };
    }

    const subjectType = detectSubjectType(input.subjectName);
    const level = getCourseLevel(input.courseName);
    
    console.log('[analyze-subject] Subject type:', subjectType, 'Level:', level, 'Language:', input.language);
    
    // Buscar el libro correspondiente en la biblioteca
    const book = bookPDFs.find(b => 
      b.course === input.courseName && 
      normalize(b.subject).includes(normalize(input.subjectName).split(' ')[0])
    );

    // PRIMERO: Intentar obtener temas con descripciones detalladas (nuevos datos educativos)
    const descriptionsData = getTopicsWithDescriptions(input.courseName, input.subjectName);
    if (descriptionsData && descriptionsData.topics.length > 0) {
      console.log('[analyze-subject] Using detailed topic descriptions for:', input.courseName, input.subjectName, 'Language:', input.language);
      
      // Traducir temas y descripciones según el idioma
      const translatedTopics = translateTopics(descriptionsData.topics, input.language);
      const translatedDescriptions = translateTopicDescriptions(descriptionsData.descriptions, input.language);
      
      const rawBookTitle = book?.title || `${input.subjectName} - ${input.courseName}`;
      const result = {
        topics: translatedTopics,
        bookTitle: translateBookTitle(rawBookTitle, input.language),
        topicDescriptions: translatedDescriptions
      };
      topicsCache.set(cacheKey, { topics: result.topics, bookTitle: result.bookTitle, timestamp: Date.now() });
      return result;
    }

    // Luego intentar obtener temas específicos por curso (sin descripciones)
    const specificTopics = getSpecificTopics(input.courseName, input.subjectName, input.language);
    if (specificTopics && specificTopics.length > 0) {
      const rawBookTitle = book?.title || `${input.subjectName} - ${input.courseName}`;
      const result = {
        topics: specificTopics,
        bookTitle: translateBookTitle(rawBookTitle, input.language)
      };
      topicsCache.set(cacheKey, { ...result, timestamp: Date.now() });
      return result;
    }

    // Usar temas heurísticos basados en tipo de asignatura y nivel
    const heuristicTopics = getHeuristicTopics(subjectType, level, input.language);
    
    const rawBookTitle = book?.title || `${input.subjectName} (${input.courseName})`;
    const result = {
      topics: heuristicTopics,
      bookTitle: translateBookTitle(rawBookTitle, input.language)
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
      bookTitle: translateBookTitle(input.subjectName, input.language)
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
