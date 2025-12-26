// PDF Content Generator - Shared module for extracting educational content
// This module provides topic-specific educational content from curriculum books

export interface BookInfo {
  course: string;
  subject: string;
  title: string;
}

// Generate topic-specific educational content based on subject, topic, and course
export function generateTopicContent(subject: string, topic: string, course: string): string {
  const topicNormalized = topic.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const subjectNormalized = subject.toLowerCase();
  
  // Ciencias Naturales topics
  if (subjectNormalized.includes('ciencias naturales') || subjectNormalized.includes('biología') || subjectNormalized.includes('biologia')) {
    const content = generateCienciasNaturalesContent(topicNormalized, topic, course);
    if (content) return content;
  }
  
  // Matemáticas topics
  if (subjectNormalized.includes('matemáticas') || subjectNormalized.includes('matematicas') || subjectNormalized.includes('matemática')) {
    const content = generateMatematicasContent(topicNormalized, topic, course);
    if (content) return content;
  }
  
  // Historia topics
  if (subjectNormalized.includes('historia') || subjectNormalized.includes('sociales') || subjectNormalized.includes('geografía')) {
    const content = generateHistoriaContent(topicNormalized, topic, course);
    if (content) return content;
  }
  
  // Lenguaje topics
  if (subjectNormalized.includes('lenguaje') || subjectNormalized.includes('comunicación') || subjectNormalized.includes('comunicacion')) {
    const content = generateLenguajeContent(topicNormalized, topic, course);
    if (content) return content;
  }
  
  // Fallback - generate generic educational content
  return generateGenericContent(topic, subject, course);
}

function generateCienciasNaturalesContent(topicNormalized: string, topic: string, course: string): string | null {
  // Sistemas del cuerpo humano
  if (topicNormalized.includes('sistemas del cuerpo') || topicNormalized.includes('cuerpo humano') || (topicNormalized.includes('sistemas') && topicNormalized.includes('humano'))) {
    return `
SISTEMAS DEL CUERPO HUMANO - Contenido del Libro de Ciencias Naturales ${course}

CAPÍTULO: LOS SISTEMAS DEL CUERPO HUMANO

1. INTRODUCCIÓN

El cuerpo humano es una máquina perfecta formada por diferentes sistemas que trabajan juntos para mantenernos vivos y saludables. Cada sistema tiene una función específica y todos se relacionan entre sí.

2. SISTEMA DIGESTIVO

FUNCIÓN: Transformar los alimentos en nutrientes que el cuerpo puede usar.

ÓRGANOS PRINCIPALES:
- BOCA: Donde comienza la digestión. Los dientes trituran la comida y la saliva la humedece.
- ESÓFAGO: Tubo que conecta la boca con el estómago.
- ESTÓMAGO: Bolsa muscular donde se mezclan los alimentos con jugos gástricos.
- INTESTINO DELGADO: Tubo largo donde se absorben los nutrientes.
- INTESTINO GRUESO: Donde se absorbe el agua y se forman las heces.

PROCESO:
1. Masticamos la comida en la boca
2. Tragamos y pasa por el esófago
3. El estómago la procesa con ácidos
4. Los nutrientes se absorben en el intestino
5. Los desechos salen del cuerpo

3. SISTEMA RESPIRATORIO

FUNCIÓN: Llevar oxígeno al cuerpo y eliminar dióxido de carbono.

ÓRGANOS PRINCIPALES:
- NARIZ: Entrada del aire, lo filtra y calienta.
- TRÁQUEA: Tubo que lleva el aire a los pulmones.
- PULMONES: Órganos esponjosos donde ocurre el intercambio de gases.
- DIAFRAGMA: Músculo que ayuda a respirar.

PROCESO:
1. Inspiración: El aire entra por la nariz
2. Viaja por la tráquea hasta los pulmones
3. En los alvéolos, el oxígeno pasa a la sangre
4. La sangre entrega CO₂ a los pulmones
5. Espiración: El aire con CO₂ sale del cuerpo

4. SISTEMA CIRCULATORIO

FUNCIÓN: Transportar sangre con oxígeno y nutrientes a todo el cuerpo.

ÓRGANOS PRINCIPALES:
- CORAZÓN: Bomba muscular que impulsa la sangre. Late unas 100,000 veces al día.
- ARTERIAS: Vasos que llevan sangre oxigenada desde el corazón.
- VENAS: Vasos que traen sangre con CO₂ de vuelta al corazón.
- CAPILARES: Vasos muy finos donde ocurre el intercambio con las células.

COMPONENTES DE LA SANGRE:
- Glóbulos rojos: transportan oxígeno
- Glóbulos blancos: defienden contra enfermedades
- Plaquetas: ayudan a cicatrizar heridas
- Plasma: líquido que transporta todo

5. SISTEMA MUSCULAR

FUNCIÓN: Permitir el movimiento del cuerpo.

TIPOS DE MÚSCULOS:
- VOLUNTARIOS: Los controlamos (brazos, piernas). Ejemplo: bíceps.
- INVOLUNTARIOS: No los controlamos (estómago, intestinos).
- CARDÍACO: El corazón, late automáticamente.

DATOS IMPORTANTES:
- Tenemos más de 600 músculos
- Los músculos trabajan en parejas (uno se contrae, otro se relaja)
- Los músculos se unen a los huesos por tendones

6. SISTEMA ÓSEO (ESQUELETO)

FUNCIÓN: Sostener el cuerpo, proteger órganos y permitir el movimiento.

PARTES DEL ESQUELETO:
- CRÁNEO: Protege el cerebro.
- COLUMNA VERTEBRAL: Sostiene el cuerpo, protege la médula espinal.
- COSTILLAS: Protegen corazón y pulmones.
- PELVIS: Sostiene los órganos del abdomen.
- EXTREMIDADES: Brazos y piernas.

DATOS IMPORTANTES:
- Un adulto tiene 206 huesos
- Los huesos están vivos y crecen
- Las articulaciones permiten el movimiento (codo, rodilla)
- El calcio y vitamina D mantienen los huesos fuertes

7. SISTEMA NERVIOSO

FUNCIÓN: Controlar todo el cuerpo, recibir información y enviar órdenes.

ÓRGANOS PRINCIPALES:
- CEREBRO: Centro de control. Piensa, recuerda, siente.
- MÉDULA ESPINAL: Conecta el cerebro con el resto del cuerpo.
- NERVIOS: Cables que llevan mensajes por todo el cuerpo.

FUNCIONES:
- Controla los movimientos voluntarios
- Controla funciones automáticas (respirar, latir)
- Procesa información de los sentidos
- Permite pensar, aprender y recordar

8. SISTEMA EXCRETOR

FUNCIÓN: Eliminar los desechos del cuerpo.

ÓRGANOS PRINCIPALES:
- RIÑONES: Filtran la sangre y producen orina.
- URÉTERES: Tubos que llevan la orina a la vejiga.
- VEJIGA: Almacena la orina.
- URETRA: Por donde sale la orina.
- PIEL: Elimina desechos a través del sudor.

9. CÓMO TRABAJAN JUNTOS LOS SISTEMAS

Todos los sistemas se necesitan mutuamente:
- El digestivo da nutrientes que la sangre transporta
- El respiratorio da oxígeno que la sangre lleva a las células
- El nervioso controla a todos los demás
- El muscular y óseo permiten movernos
- El excretor limpia los desechos

10. CUIDADOS DEL CUERPO

Para mantener sanos todos nuestros sistemas:
- Alimentación equilibrada
- Beber suficiente agua
- Hacer ejercicio regularmente
- Dormir 8-10 horas
- Mantener buena higiene
- Evitar sustancias dañinas

11. ACTIVIDADES DE APRENDIZAJE

ACTIVIDAD 1: Dibuja y rotula los órganos de cada sistema
ACTIVIDAD 2: Investiga qué pasa cuando un sistema no funciona bien
ACTIVIDAD 3: Relaciona cada sistema con su función principal
`;
  }

  // Los seres vivos y su entorno
  if (topicNormalized.includes('seres vivos') || topicNormalized.includes('entorno') || topicNormalized.includes('ecosistema')) {
    return `
LOS SERES VIVOS Y SU ENTORNO - Contenido del Libro de Ciencias Naturales ${course}

CAPÍTULO: LOS SERES VIVOS Y SU AMBIENTE

1. ¿QUÉ SON LOS SERES VIVOS?

Los seres vivos son todos aquellos organismos que tienen vida. Se caracterizan por realizar funciones vitales que los diferencian de los objetos sin vida.

CARACTERÍSTICAS DE LOS SERES VIVOS:

NACEN
- Todos los seres vivos provienen de otros seres vivos
- Pueden nacer de huevos, semillas o del vientre de su madre
- Ejemplos: un pollito nace de un huevo, una planta nace de una semilla

CRECEN
- Los seres vivos aumentan de tamaño con el tiempo
- Necesitan alimento para crecer
- Un cachorro crece hasta convertirse en perro adulto

SE ALIMENTAN
- Necesitan nutrientes para obtener energía
- Los animales comen plantas u otros animales
- Las plantas fabrican su propio alimento usando la luz del sol

RESPIRAN
- Toman oxígeno del aire o del agua
- Los animales respiran por pulmones, branquias o piel
- Las plantas también respiran a través de sus hojas

SE REPRODUCEN
- Pueden crear nuevos seres vivos de su misma especie
- Algunos ponen huevos, otros tienen crías vivas
- Las plantas producen semillas o se reproducen por esquejes

MUEREN
- Todos los seres vivos tienen un ciclo de vida
- Nacen, crecen, se reproducen y mueren

2. CLASIFICACIÓN DE LOS SERES VIVOS

ANIMALES
- Se desplazan de un lugar a otro
- Se alimentan de otros seres vivos
- Pueden ser vertebrados (con columna) o invertebrados (sin columna)
- Ejemplos: perro, mariposa, pez, águila

PLANTAS
- No se desplazan, están fijas al suelo
- Fabrican su propio alimento (fotosíntesis)
- Tienen raíz, tallo y hojas
- Ejemplos: árbol, flor, pasto, helecho

HONGOS
- No son plantas ni animales
- Se alimentan de materia orgánica en descomposición
- Ejemplos: champiñón, moho del pan

MICROORGANISMOS
- Son seres vivos muy pequeños, invisibles a simple vista
- Solo se pueden ver con microscopio
- Ejemplos: bacterias, algunos hongos microscópicos

3. EL ENTORNO O AMBIENTE

El entorno es todo lo que rodea a un ser vivo. Incluye elementos vivos y no vivos.

ELEMENTOS VIVOS (BIÓTICOS):
- Otros animales
- Plantas
- Hongos
- Microorganismos

ELEMENTOS NO VIVOS (ABIÓTICOS):
- Agua
- Aire
- Suelo
- Luz solar
- Temperatura

4. HÁBITAT

El hábitat es el lugar donde vive un ser vivo y encuentra todo lo que necesita para sobrevivir: alimento, agua, refugio y espacio.

TIPOS DE HÁBITAT:

TERRESTRE
- Bosques: árboles, ardillas, pájaros
- Desiertos: cactus, serpientes, escorpiones
- Praderas: pastos, vacas, conejos

ACUÁTICO
- Agua dulce: ríos, lagos (peces de río, ranas)
- Agua salada: mares, océanos (peces, ballenas, pulpos)

AÉREO
- El aire donde vuelan las aves e insectos
- Aunque todos necesitan tierra o agua para descansar

5. ADAPTACIONES DE LOS SERES VIVOS

Los seres vivos tienen características especiales que les permiten sobrevivir en su ambiente.

EJEMPLOS DE ADAPTACIONES:

- El camello tiene jorobas para almacenar grasa y sobrevivir sin agua
- El oso polar tiene pelaje blanco para camuflarse en la nieve
- El cactus almacena agua en su tallo para sobrevivir en el desierto
- Los peces tienen branquias para respirar bajo el agua
- Las aves tienen plumas y alas para volar

6. RELACIONES ENTRE SERES VIVOS

CADENA ALIMENTARIA
- Muestra quién se come a quién
- Productores: plantas (hacen su alimento)
- Consumidores: animales (comen plantas u otros animales)
- Descomponedores: hongos y bacterias (descomponen restos)

Ejemplo de cadena alimentaria:
Pasto → Conejo → Zorro → Bacterias

7. CUIDADO DEL MEDIO AMBIENTE

Los seres humanos debemos cuidar el ambiente para proteger a todos los seres vivos.

ACCIONES PARA CUIDAR EL AMBIENTE:
- No contaminar el agua ni el aire
- No botar basura en la naturaleza
- Reciclar papel, plástico y vidrio
- Cuidar a los animales y plantas
- Ahorrar agua y energía
- Plantar árboles

8. ACTIVIDADES DE APRENDIZAJE

OBSERVACIÓN:
- Identifica 5 seres vivos en tu entorno
- Clasifícalos en animales, plantas u otros

INVESTIGACIÓN:
- Elige un animal y describe su hábitat
- ¿Qué adaptaciones tiene para sobrevivir?

REFLEXIÓN:
- ¿Por qué es importante cuidar a los seres vivos?
- ¿Qué pasaría si desaparecieran las plantas?
`;
  }

  // Sistema Respiratorio
  if (topicNormalized.includes('sistema respiratorio') || topicNormalized.includes('respiratorio') || topicNormalized.includes('respiracion')) {
    return `
SISTEMA RESPIRATORIO - Contenido del Libro de Ciencias Naturales ${course}

CAPÍTULO: EL SISTEMA RESPIRATORIO HUMANO

1. INTRODUCCIÓN AL SISTEMA RESPIRATORIO
El sistema respiratorio es el conjunto de órganos que permite el intercambio de gases entre nuestro cuerpo y el ambiente. Su función principal es incorporar oxígeno (O₂) al organismo y eliminar dióxido de carbono (CO₂), un producto de desecho del metabolismo celular.

2. ÓRGANOS DEL SISTEMA RESPIRATORIO

2.1 Vías Respiratorias Superiores:

FOSAS NASALES
- Son las cavidades de entrada del aire al sistema respiratorio
- Están revestidas por mucosa nasal con cilios y moco
- Funciones: filtrar partículas, calentar y humedecer el aire
- Los vellos nasales atrapan partículas grandes

FARINGE
- Conducto muscular compartido con el sistema digestivo
- Mide aproximadamente 13 cm de longitud
- Conecta las fosas nasales con la laringe
- Contiene las amígdalas que ayudan a combatir infecciones

LARINGE
- Órgano cartilaginoso que contiene las cuerdas vocales
- Permite la producción de la voz (fonación)
- La epiglotis cierra la laringe durante la deglución para evitar que los alimentos entren a las vías respiratorias

2.2 Vías Respiratorias Inferiores:

TRÁQUEA
- Tubo de aproximadamente 12 cm de largo y 2 cm de diámetro
- Formada por anillos cartilaginosos en forma de "C"
- Revestida internamente por células ciliadas que mueven el moco hacia arriba

BRONQUIOS
- La tráquea se divide en dos bronquios principales (derecho e izquierdo)
- Cada bronquio entra a un pulmón
- Se ramifican sucesivamente en bronquios secundarios y terciarios

BRONQUIOLOS
- Son ramificaciones más pequeñas de los bronquios
- Carecen de cartílago en sus paredes
- Terminan en los sacos alveolares

ALVÉOLOS PULMONARES
- Pequeñas bolsas de aire donde ocurre el intercambio gaseoso
- Cada pulmón contiene aproximadamente 300 millones de alvéolos
- Están rodeados por una red de capilares sanguíneos
- Sus paredes son muy delgadas (0.2 micras) para facilitar la difusión de gases

PULMONES
- Son los órganos principales del sistema respiratorio
- El pulmón derecho tiene 3 lóbulos, el izquierdo tiene 2
- Están protegidos por la caja torácica
- Cubiertos por una membrana llamada pleura

DIAFRAGMA
- Músculo en forma de cúpula ubicado debajo de los pulmones
- Principal músculo de la respiración
- Al contraerse, desciende y permite la entrada de aire

3. EL PROCESO DE RESPIRACIÓN

3.1 Mecánica Respiratoria:

INSPIRACIÓN (Inhalación)
- El diafragma se contrae y desciende
- Los músculos intercostales elevan las costillas
- La cavidad torácica aumenta de volumen
- Los pulmones se expanden
- El aire entra por diferencia de presión

ESPIRACIÓN (Exhalación)
- El diafragma se relaja y asciende
- Los músculos intercostales se relajan
- La cavidad torácica disminuye de volumen
- Los pulmones se comprimen
- El aire sale al exterior

3.2 Frecuencia Respiratoria:
- Adulto en reposo: 12-20 respiraciones por minuto
- Niños: 20-30 respiraciones por minuto
- Durante el ejercicio la frecuencia aumenta

4. INTERCAMBIO GASEOSO

4.1 En los Alvéolos Pulmonares (Respiración Externa):
- El oxígeno pasa del aire alveolar a la sangre de los capilares
- El dióxido de carbono pasa de la sangre al aire alveolar
- Este proceso ocurre por difusión simple
- Depende de las diferencias de presión parcial de los gases

4.2 En los Tejidos (Respiración Interna):
- El oxígeno pasa de la sangre a las células
- El dióxido de carbono pasa de las células a la sangre
- Las células usan el oxígeno para la respiración celular

5. CUIDADOS DEL SISTEMA RESPIRATORIO

5.1 Hábitos Saludables:
- Respirar por la nariz para filtrar y calentar el aire
- Evitar ambientes con aire contaminado
- No fumar ni exponerse al humo del tabaco
- Realizar ejercicio físico regularmente
- Mantener una buena postura para facilitar la respiración

5.2 Prevención de Enfermedades:
- Lavarse las manos frecuentemente
- Cubrirse al toser o estornudar
- Ventilar los espacios cerrados
- Evitar cambios bruscos de temperatura
- Vacunarse según el calendario de vacunación

6. ENFERMEDADES DEL SISTEMA RESPIRATORIO

ENFERMEDADES COMUNES:
- Resfriado común: Infección viral leve de las vías superiores
- Gripe: Infección viral más severa con fiebre y malestar general
- Bronquitis: Inflamación de los bronquios
- Neumonía: Infección de los pulmones
- Asma: Inflamación crónica con dificultad para respirar

FACTORES DE RIESGO:
- Tabaquismo (causa principal de enfermedades respiratorias graves)
- Contaminación del aire
- Exposición a sustancias tóxicas
- Falta de actividad física
- Sistema inmune debilitado

7. ACTIVIDADES DE APRENDIZAJE

EXPERIMENTO: La Capacidad Pulmonar
Materiales: Botella grande, manguera, recipiente con agua
Procedimiento: Medir el volumen de aire que puedes exhalar

REFLEXIÓN:
¿Por qué es importante cuidar nuestro sistema respiratorio?
¿Cómo afecta la contaminación a nuestra salud respiratoria?
¿Qué podemos hacer para mantener sanos nuestros pulmones?
`;
  }
  
  // Célula
  if (topicNormalized.includes('celula') || topicNormalized.includes('celular') || topicNormalized.includes('célula')) {
    return `
LA CÉLULA - Contenido del Libro de Ciencias Naturales ${course}

CAPÍTULO: LA CÉLULA - UNIDAD BÁSICA DE LA VIDA

1. INTRODUCCIÓN
La célula es la unidad estructural y funcional de todos los seres vivos. Es la estructura más pequeña capaz de realizar todas las funciones vitales: nutrición, relación y reproducción.

2. TEORÍA CELULAR

La teoría celular, establecida en el siglo XIX, postula que:
1. Todos los seres vivos están formados por células
2. La célula es la unidad funcional de los seres vivos
3. Toda célula proviene de otra célula preexistente

Científicos importantes:
- Robert Hooke (1665): Observó por primera vez las células en el corcho
- Anton van Leeuwenhoek: Observó microorganismos
- Matthias Schleiden y Theodor Schwann: Formularon la teoría celular
- Rudolf Virchow: Estableció que toda célula proviene de otra célula

3. TIPOS DE CÉLULAS

3.1 CÉLULAS PROCARIOTAS
- No poseen núcleo definido (el material genético está libre en el citoplasma)
- Son más pequeñas y simples
- No tienen organelos membranosos
- Ejemplos: bacterias y arqueas

3.2 CÉLULAS EUCARIOTAS
- Poseen núcleo definido con envoltura nuclear
- Son más grandes y complejas
- Tienen organelos membranosos especializados
- Ejemplos: células animales, vegetales, de hongos y protistas

4. PARTES DE LA CÉLULA EUCARIOTA

4.1 MEMBRANA CELULAR (Membrana Plasmática)
- Estructura: Bicapa de fosfolípidos con proteínas
- Función: Controla el paso de sustancias hacia dentro y fuera de la célula
- Es selectivamente permeable
- Participa en la comunicación celular

4.2 CITOPLASMA
- Medio gelatinoso entre la membrana y el núcleo
- Compuesto principalmente por agua, sales y moléculas orgánicas
- Contiene el citoesqueleto que da forma a la célula
- Alberga los organelos celulares

4.3 NÚCLEO
- Centro de control de la célula
- Contiene el material genético (ADN)
- Está rodeado por la envoltura nuclear
- Contiene el nucléolo donde se forman los ribosomas

4.4 ORGANELOS CELULARES

MITOCONDRIAS
- Función: Producen energía (ATP) mediante la respiración celular
- Llamadas "las centrales energéticas de la célula"
- Tienen su propio ADN

RIBOSOMAS
- Función: Síntesis de proteínas
- Pueden estar libres en el citoplasma o adheridos al retículo endoplasmático
- Formados por ARN ribosomal y proteínas

RETÍCULO ENDOPLASMÁTICO
- RE Rugoso: Con ribosomas, sintetiza proteínas
- RE Liso: Sin ribosomas, sintetiza lípidos y desintoxica

APARATO DE GOLGI
- Función: Modifica, empaqueta y distribuye proteínas y lípidos
- Forma vesículas para transporte

LISOSOMAS
- Función: Digestión intracelular
- Contienen enzimas digestivas
- Eliminan desechos y estructuras dañadas

5. ORGANELOS EXCLUSIVOS DE CÉLULAS VEGETALES

PARED CELULAR
- Estructura rígida exterior a la membrana
- Compuesta principalmente de celulosa
- Función: Protección y soporte estructural

CLOROPLASTOS
- Función: Realizan la fotosíntesis
- Contienen clorofila (pigmento verde)
- Producen glucosa usando luz solar

VACUOLA CENTRAL
- Gran vacuola que ocupa la mayor parte de la célula
- Función: Almacena agua, nutrientes, pigmentos y desechos
- Mantiene la presión de turgencia

6. FUNCIONES CELULARES

NUTRICIÓN
- Obtención de nutrientes del medio
- Transformación en energía y materiales para la célula

RELACIÓN
- Respuesta a estímulos del ambiente
- Comunicación con otras células

REPRODUCCIÓN
- División celular para crear nuevas células
- Mitosis (células somáticas)
- Meiosis (células reproductivas)

7. DIFERENCIAS ENTRE CÉLULA ANIMAL Y VEGETAL

CÉLULA ANIMAL:
- No tiene pared celular
- No tiene cloroplastos
- Tiene centriolos
- Vacuolas pequeñas y múltiples
- Forma irregular

CÉLULA VEGETAL:
- Tiene pared celular de celulosa
- Tiene cloroplastos para fotosíntesis
- No tiene centriolos
- Una gran vacuola central
- Forma regular (generalmente rectangular)
`;
  }
  
  // Fotosíntesis
  if (topicNormalized.includes('fotosintesis') || topicNormalized.includes('fotosíntesis')) {
    return `
LA FOTOSÍNTESIS - Contenido del Libro de Ciencias Naturales ${course}

CAPÍTULO: LA FOTOSÍNTESIS - EL PROCESO QUE SOSTIENE LA VIDA

1. DEFINICIÓN
La fotosíntesis es el proceso mediante el cual las plantas, algas y algunas bacterias transforman la energía luminosa del sol en energía química almacenada en forma de glucosa.

2. ECUACIÓN DE LA FOTOSÍNTESIS

6CO₂ + 6H₂O + Luz solar → C₆H₁₂O₆ + 6O₂

Dióxido de carbono + Agua + Energía luminosa → Glucosa + Oxígeno

3. ESTRUCTURAS INVOLUCRADAS

CLOROPLASTOS
- Organelos donde ocurre la fotosíntesis
- Contienen tilacoides (membranas internas) y estroma
- Poseen su propio ADN

CLOROFILA
- Pigmento verde que captura la luz
- Ubicada en los tilacoides
- Absorbe luz roja y azul, refleja verde

ESTOMAS
- Poros en las hojas
- Permiten entrada de CO₂ y salida de O₂
- Regulan la pérdida de agua

4. FASES DE LA FOTOSÍNTESIS

FASE LUMINOSA (Reacciones Dependientes de la Luz)
- Ocurre en los tilacoides
- Requiere luz solar directa
- Proceso:
  1. La clorofila absorbe energía luminosa
  2. El agua se descompone (fotólisis): 2H₂O → 4H⁺ + 4e⁻ + O₂
  3. Se libera oxígeno como subproducto
  4. Se produce ATP y NADPH (moléculas energéticas)

FASE OSCURA (Ciclo de Calvin)
- Ocurre en el estroma del cloroplasto
- No requiere luz directa (pero usa productos de la fase luminosa)
- Proceso:
  1. Fijación del CO₂ (se incorpora carbono)
  2. Reducción usando ATP y NADPH
  3. Síntesis de glucosa (C₆H₁₂O₆)
  4. Regeneración de la molécula receptora

5. FACTORES QUE AFECTAN LA FOTOSÍNTESIS

INTENSIDAD LUMINOSA
- Mayor luz = mayor fotosíntesis (hasta un punto de saturación)
- Muy poca luz reduce significativamente el proceso

CONCENTRACIÓN DE CO₂
- Mayor CO₂ = mayor fotosíntesis (hasta cierto límite)
- Es el factor limitante más común

TEMPERATURA
- Temperatura óptima: 25-35°C para la mayoría de plantas
- Temperaturas extremas reducen la eficiencia

DISPONIBILIDAD DE AGUA
- El agua es reactivo esencial
- La falta de agua cierra los estomas y reduce la fotosíntesis

6. IMPORTANCIA DE LA FOTOSÍNTESIS

PARA LA VIDA EN LA TIERRA:
- Produce el oxígeno que respiramos
- Es la base de las cadenas alimenticias
- Regula el CO₂ atmosférico (efecto invernadero)
- Produce toda la materia orgánica del planeta

PARA EL ECOSISTEMA:
- Las plantas son productores primarios
- Transforman energía solar en energía química
- Sostienen a todos los demás organismos

7. RELACIÓN CON LA RESPIRACIÓN CELULAR

La fotosíntesis y la respiración celular son procesos complementarios:

FOTOSÍNTESIS:
- Consume CO₂ y H₂O
- Libera O₂
- Almacena energía en glucosa
- Ocurre en cloroplastos
- Requiere luz

RESPIRACIÓN CELULAR:
- Consume O₂ y glucosa
- Libera CO₂ y H₂O
- Libera energía (ATP)
- Ocurre en mitocondrias
- No requiere luz
`;
  }
  
  // Sistema digestivo
  if (topicNormalized.includes('sistema digestivo') || topicNormalized.includes('digestivo') || topicNormalized.includes('digestion')) {
    return `
SISTEMA DIGESTIVO - Contenido del Libro de Ciencias Naturales ${course}

CAPÍTULO: EL SISTEMA DIGESTIVO

1. FUNCIÓN DEL SISTEMA DIGESTIVO
El sistema digestivo transforma los alimentos en nutrientes que pueden ser absorbidos y utilizados por las células del cuerpo.

2. ÓRGANOS DEL TUBO DIGESTIVO

BOCA
- Inicia la digestión mecánica (masticación) y química (saliva)
- Contiene dientes, lengua y glándulas salivales
- La saliva contiene amilasa que digiere almidones

FARINGE
- Conecta la boca con el esófago
- Participa en la deglución

ESÓFAGO
- Tubo muscular de aproximadamente 25 cm
- Transporta el bolo alimenticio al estómago
- Movimientos peristálticos impulsan el alimento

ESTÓMAGO
- Órgano en forma de bolsa
- Digiere proteínas con ácido clorhídrico y pepsina
- El quimo es el resultado de la digestión estomacal

INTESTINO DELGADO
- Mide aproximadamente 6-7 metros
- Tres partes: duodeno, yeyuno e íleon
- Ocurre la mayor absorción de nutrientes
- Vellosidades intestinales aumentan la superficie de absorción

INTESTINO GRUESO
- Mide aproximadamente 1.5 metros
- Absorbe agua y sales minerales
- Forma y almacena las heces fecales
- Contiene bacterias beneficiosas (flora intestinal)

3. GLÁNDULAS ANEXAS

GLÁNDULAS SALIVALES
- Producen saliva con enzimas digestivas
- Humedecen el alimento

HÍGADO
- Produce bilis para emulsionar grasas
- Almacena glucosa como glucógeno
- Desintoxica la sangre

PÁNCREAS
- Produce jugo pancreático con enzimas digestivas
- Produce insulina y glucagón (hormonas)

VESÍCULA BILIAR
- Almacena y concentra la bilis
- Libera bilis al duodeno durante la digestión

4. PROCESOS DIGESTIVOS

DIGESTIÓN MECÁNICA
- Fragmentación física del alimento
- Incluye masticación y movimientos peristálticos

DIGESTIÓN QUÍMICA
- Enzimas descomponen moléculas complejas
- Amilasa: digiere almidones
- Proteasas: digieren proteínas
- Lipasas: digieren grasas

ABSORCIÓN
- Paso de nutrientes al torrente sanguíneo
- Ocurre principalmente en el intestino delgado

ELIMINACIÓN
- Expulsión de materiales no digeridos
- Formación de heces fecales

5. CUIDADOS DEL SISTEMA DIGESTIVO

- Masticar bien los alimentos
- Comer despacio y en horarios regulares
- Consumir fibra (frutas, verduras, cereales integrales)
- Beber suficiente agua
- Evitar comidas muy grasas o picantes
- Realizar actividad física
`;
  }
  
  // El Ciclo del Agua
  if (topicNormalized.includes('ciclo del agua') || topicNormalized.includes('ciclo hidrologico') || topicNormalized.includes('ciclo hidrológico') || topicNormalized.includes('agua') && topicNormalized.includes('ciclo')) {
    return `
EL CICLO DEL AGUA - Contenido del Libro de Ciencias Naturales ${course}

CAPÍTULO: EL CICLO DEL AGUA (CICLO HIDROLÓGICO)

1. INTRODUCCIÓN
El ciclo del agua, también llamado ciclo hidrológico, es el proceso continuo de circulación del agua en la Tierra. El agua cambia de estado (líquido, sólido, gaseoso) y se mueve entre la atmósfera, la superficie terrestre y los seres vivos.

2. IMPORTANCIA DEL AGUA

El agua es esencial para la vida:
- Constituye aproximadamente el 70% del cuerpo humano
- Es necesaria para todos los procesos vitales
- Es el hábitat de muchos seres vivos
- Regula la temperatura del planeta
- Es un recurso natural fundamental

DISTRIBUCIÓN DEL AGUA EN LA TIERRA:
- 97.5% es agua salada (océanos y mares)
- 2.5% es agua dulce
- De esa agua dulce: 69% está en glaciares, 30% en aguas subterráneas, 1% es accesible

3. ESTADOS DEL AGUA

ESTADO LÍQUIDO
- Forma: Toma la forma del recipiente
- Ejemplos: Ríos, lagos, mares, lluvia
- Temperatura: Entre 0°C y 100°C a nivel del mar

ESTADO SÓLIDO (HIELO)
- Forma: Tiene forma propia
- Ejemplos: Glaciares, nieve, granizo, escarcha
- Temperatura: Bajo 0°C

ESTADO GASEOSO (VAPOR)
- Forma: No tiene forma definida, se expande
- Ejemplos: Vapor de agua, nubes, neblina
- El vapor de agua es invisible

4. ETAPAS DEL CICLO DEL AGUA

4.1 EVAPORACIÓN
- El Sol calienta el agua de océanos, ríos y lagos
- El agua líquida se transforma en vapor de agua
- El vapor de agua sube a la atmósfera
- También ocurre evaporación desde el suelo húmedo
- La mayor evaporación ocurre en los océanos

4.2 TRANSPIRACIÓN
- Las plantas liberan vapor de agua por sus hojas
- Este proceso se llama transpiración o evapotranspiración
- Es parte importante del ciclo en zonas con vegetación
- Un árbol grande puede liberar cientos de litros de agua al día

4.3 CONDENSACIÓN
- El vapor de agua sube y se enfría en la atmósfera
- Al enfriarse, el vapor se convierte en pequeñas gotas de agua
- Estas gotas forman las nubes y la neblina
- La condensación ocurre alrededor de partículas (polvo, polen)
- También se ve condensación en superficies frías (rocío)

4.4 PRECIPITACIÓN
- Cuando las gotas de agua en las nubes se hacen grandes y pesadas, caen
- Tipos de precipitación:
  * Lluvia: Gotas de agua líquida
  * Nieve: Cristales de hielo (cuando hace frío)
  * Granizo: Bolas de hielo
  * Llovizna: Gotas muy pequeñas

4.5 ESCORRENTÍA
- El agua de lluvia que corre por la superficie terrestre
- Fluye hacia arroyos, ríos y finalmente al mar
- Parte del agua se infiltra en el suelo

4.6 INFILTRACIÓN
- El agua penetra en el suelo
- Se acumula en acuíferos (depósitos subterráneos)
- Las plantas absorben agua con sus raíces
- El agua subterránea puede tardar años en volver a la superficie

4.7 ACUMULACIÓN
- El agua se almacena en diferentes lugares:
  * Océanos y mares
  * Lagos y lagunas
  * Ríos
  * Glaciares y casquetes polares
  * Agua subterránea

5. CAMBIOS DE ESTADO EN EL CICLO

EVAPORACIÓN: Líquido → Gas (necesita calor)
CONDENSACIÓN: Gas → Líquido (libera calor)
SOLIDIFICACIÓN: Líquido → Sólido (libera calor)
FUSIÓN: Sólido → Líquido (necesita calor)
SUBLIMACIÓN: Sólido → Gas (directamente)

6. EL SOL: MOTOR DEL CICLO DEL AGUA

El Sol proporciona la energía que impulsa todo el ciclo:
- Calienta el agua para que se evapore
- Crea las corrientes de aire que mueven las nubes
- Sin el Sol, no habría ciclo del agua

7. IMPORTANCIA DEL CICLO DEL AGUA

- Distribuye el agua dulce por todo el planeta
- Purifica el agua (la evaporación deja atrás las sales y contaminantes)
- Regula el clima y la temperatura
- Permite la vida de plantas y animales
- Renueva constantemente los recursos hídricos

8. CUIDADO DEL AGUA

El agua dulce es un recurso limitado. Debemos cuidarla:

EN EL HOGAR:
- Cerrar el grifo mientras nos cepillamos los dientes
- Tomar duchas cortas en lugar de baños
- Reparar fugas de agua
- Usar lavadora y lavavajillas con carga completa
- Reutilizar agua cuando sea posible

EN LA COMUNIDAD:
- No contaminar ríos ni lagos
- Proteger las fuentes de agua
- Cuidar los bosques (ayudan a mantener el ciclo)
- No desperdiciar agua en jardines

9. EXPERIMENTO: Crear un mini ciclo del agua

MATERIALES:
- Un recipiente transparente grande
- Agua
- Plástico transparente
- Una piedra pequeña
- Sol o lámpara

PROCEDIMIENTO:
1. Poner agua en el fondo del recipiente
2. Cubrir con el plástico
3. Colocar la piedra en el centro del plástico (para que haga una pequeña depresión)
4. Poner al sol
5. Observar cómo el agua se evapora, condensa en el plástico y "llueve" hacia el centro

EXPLICACIÓN:
Este experimento muestra en pequeña escala cómo funciona el ciclo del agua en la naturaleza.

10. ACTIVIDADES

ACTIVIDAD 1: Identificación de etapas
Observa el paisaje y señala dónde ocurre cada etapa del ciclo.

ACTIVIDAD 2: Dibujo del ciclo
Dibuja el ciclo del agua con flechas indicando el movimiento del agua.

ACTIVIDAD 3: Registro del tiempo
Durante una semana, registra si llueve, está nublado o soleado. Relaciona con el ciclo del agua.
`;
  }
  
  // Microorganismos
  if (topicNormalized.includes('microorganism') || topicNormalized.includes('bacteria') || topicNormalized.includes('virus') || topicNormalized.includes('hongo') || topicNormalized.includes('microbio')) {
    return `
MICROORGANISMOS - Contenido del Libro de Ciencias Naturales ${course}

CAPÍTULO: LOS MICROORGANISMOS

1. DEFINICIÓN DE MICROORGANISMOS
Los microorganismos son seres vivos de tamaño microscópico que no pueden observarse a simple vista. También se les llama microbios. Para verlos necesitamos instrumentos de aumento como el microscopio.

2. TIPOS DE MICROORGANISMOS

2.1 BACTERIAS
- Son organismos unicelulares procariotas
- No tienen núcleo definido
- Tienen diversas formas: cocos (esféricas), bacilos (alargadas), espirilos (espiral)
- Algunas son beneficiosas y otras causan enfermedades
- Se reproducen por fisión binaria (división en dos)

Bacterias beneficiosas:
- Lactobacillus: Producen yogur y queso
- Escherichia coli intestinal: Ayudan en la digestión
- Rhizobium: Fijan nitrógeno en las plantas

Bacterias patógenas:
- Salmonella: Causa intoxicaciones alimentarias
- Streptococcus: Causa infecciones de garganta
- Mycobacterium tuberculosis: Causa tuberculosis

2.2 VIRUS
- No son considerados seres vivos por muchos científicos
- Son mucho más pequeños que las bacterias
- Necesitan infectar células para reproducirse
- Están formados por material genético (ADN o ARN) y una cubierta proteica

Enfermedades causadas por virus:
- Gripe e influenza
- Resfriado común
- Varicela
- Sarampión
- COVID-19

2.3 HONGOS MICROSCÓPICOS
- Son eucariotas (tienen núcleo)
- Algunos son unicelulares (levaduras) y otros multicelulares (mohos)
- Se alimentan descomponiendo materia orgánica

Hongos beneficiosos:
- Levadura (Saccharomyces): Para hacer pan y cerveza
- Penicillium: Produce antibiótico penicilina

Hongos perjudiciales:
- Hongos que causan pie de atleta
- Hongos que producen moho en alimentos

2.4 PROTOZOARIOS
- Son eucariotas unicelulares
- Viven en ambientes húmedos o acuáticos
- Algunos son parásitos

Ejemplos:
- Ameba: Se mueve por pseudópodos
- Paramecio: Se mueve por cilios
- Plasmodium: Causa la malaria

3. DÓNDE VIVEN LOS MICROORGANISMOS

Los microorganismos están en todas partes:
- En el aire que respiramos
- En el agua
- En el suelo
- En nuestro cuerpo (piel, intestinos, boca)
- En los alimentos
- En superficies y objetos

4. IMPORTANCIA DE LOS MICROORGANISMOS

4.1 Beneficios para los humanos:
- Producción de alimentos (pan, yogur, queso, vinagre)
- Producción de medicamentos (antibióticos, vacunas)
- Descomposición de materia orgánica (reciclaje de nutrientes)
- Flora intestinal para la digestión
- Producción de oxígeno (cianobacterias)

4.2 Microorganismos perjudiciales:
- Causan enfermedades infecciosas
- Descomponen y dañan alimentos
- Pueden contaminar agua

5. DEFENSA CONTRA MICROORGANISMOS PATÓGENOS

5.1 Barreras naturales del cuerpo:
- La piel (primera línea de defensa)
- Mucosas de nariz y garganta
- Lágrimas y saliva con enzimas
- Ácido del estómago
- Sistema inmunológico

5.2 Hábitos de higiene:
- Lavarse las manos frecuentemente con agua y jabón
- Cubrir boca y nariz al toser o estornudar
- Mantener limpios los alimentos
- Cocinar bien los alimentos
- Beber agua potable
- Vacunarse

6. EL MICROSCOPIO

El microscopio es el instrumento que permite ver microorganismos:

PARTES DEL MICROSCOPIO:
- Ocular: Lente por donde se mira
- Objetivos: Lentes que aumentan la imagen
- Platina: Donde se coloca la muestra
- Fuente de luz: Ilumina la muestra
- Tornillos de enfoque: Macro y micrométrico

7. EXPERIMENTO: Observación de microorganismos

Materiales:
- Microscopio
- Portaobjetos y cubreobjetos
- Agua de charco o infusión de heno
- Gotero

Procedimiento:
1. Colocar una gota de agua en el portaobjetos
2. Cubrir con el cubreobjetos
3. Observar con objetivo de menor a mayor aumento
4. Dibujar lo observado
`;
  }
  
  // Sistema nervioso
  if (topicNormalized.includes('sistema nervioso') || topicNormalized.includes('nervioso') || topicNormalized.includes('cerebro') || topicNormalized.includes('neurona')) {
    return `
SISTEMA NERVIOSO - Contenido del Libro de Ciencias Naturales ${course}

CAPÍTULO: EL SISTEMA NERVIOSO

1. FUNCIÓN DEL SISTEMA NERVIOSO
El sistema nervioso es el centro de control del cuerpo. Recibe información del ambiente y del interior del cuerpo, la procesa y coordina las respuestas apropiadas. Controla todas nuestras funciones voluntarias e involuntarias.

2. ORGANIZACIÓN DEL SISTEMA NERVIOSO

2.1 SISTEMA NERVIOSO CENTRAL (SNC)

ENCÉFALO
- Es el centro de control principal del cuerpo
- Está protegido por el cráneo y las meninges
- Pesa aproximadamente 1.4 kg en adultos
- Consta de tres partes principales:

CEREBRO
- Es la parte más grande del encéfalo (80%)
- Dividido en dos hemisferios (izquierdo y derecho)
- Controla el pensamiento, memoria, lenguaje, emociones
- La corteza cerebral tiene pliegues (circunvoluciones)
- Diferentes áreas controlan diferentes funciones:
  * Lóbulo frontal: Razonamiento, movimiento voluntario
  * Lóbulo parietal: Sensaciones táctiles
  * Lóbulo temporal: Audición, memoria
  * Lóbulo occipital: Visión

CEREBELO
- Ubicado debajo del cerebro, en la parte posterior
- Coordina el equilibrio y los movimientos
- Permite realizar movimientos precisos
- Controla la postura

TRONCO ENCEFÁLICO
- Conecta el cerebro con la médula espinal
- Controla funciones vitales automáticas:
  * Respiración
  * Ritmo cardíaco
  * Presión arterial
  * Deglución

MÉDULA ESPINAL
- Cordón nervioso dentro de la columna vertebral
- Mide aproximadamente 45 cm de largo
- Transmite información entre el cerebro y el cuerpo
- Controla los actos reflejos

2.2 SISTEMA NERVIOSO PERIFÉRICO (SNP)
- Formado por nervios que salen del SNC
- Conecta el SNC con todas las partes del cuerpo

Nervios craneales: 12 pares que salen del encéfalo
Nervios espinales: 31 pares que salen de la médula espinal

3. LA NEURONA - CÉLULA DEL SISTEMA NERVIOSO

Las neuronas son células especializadas en transmitir impulsos nerviosos.

PARTES DE LA NEURONA:
- Cuerpo celular (soma): Contiene el núcleo
- Dendritas: Reciben información de otras neuronas
- Axón: Transmite información a otras células
- Terminales axónicos: Liberan neurotransmisores
- Vaina de mielina: Aísla y acelera la transmisión

TIPOS DE NEURONAS:
- Sensoriales: Llevan información de los sentidos al SNC
- Motoras: Llevan órdenes del SNC a músculos y glándulas
- Interneuronas: Conectan neuronas entre sí

4. SINAPSIS - COMUNICACIÓN ENTRE NEURONAS

La sinapsis es la unión funcional entre dos neuronas.

PROCESO:
1. El impulso llega al terminal axónico
2. Se liberan neurotransmisores al espacio sináptico
3. Los neurotransmisores se unen a receptores de la siguiente neurona
4. Se genera un nuevo impulso nervioso

5. ACTOS VOLUNTARIOS Y REFLEJOS

ACTOS VOLUNTARIOS
- Son controlados conscientemente
- El cerebro participa en la decisión
- Ejemplo: Escribir, hablar, caminar

ACTOS REFLEJOS
- Son respuestas automáticas e involuntarias
- No pasan por el cerebro (solo médula espinal)
- Son muy rápidos
- Ejemplo: Retirar la mano del fuego, reflejo rotuliano

ARCO REFLEJO:
1. Receptor detecta el estímulo
2. Neurona sensorial transmite la información
3. Interneurona en la médula procesa
4. Neurona motora envía la respuesta
5. Efector (músculo) ejecuta la respuesta

6. LOS SENTIDOS

Los órganos de los sentidos captan información del ambiente:

VISTA (Ojos): Detecta luz y colores
AUDICIÓN (Oídos): Detecta sonidos
OLFATO (Nariz): Detecta olores
GUSTO (Lengua): Detecta sabores
TACTO (Piel): Detecta presión, temperatura, dolor

7. CUIDADOS DEL SISTEMA NERVIOSO

- Dormir suficientes horas (8-10 horas en niños)
- Alimentarse bien (ácidos grasos omega-3, vitaminas B)
- Hacer ejercicio regularmente
- Evitar golpes en la cabeza (usar casco)
- No consumir drogas ni alcohol
- Manejar el estrés
- Ejercitar la mente (leer, resolver problemas)
`;
  }
  
  // Sistema óseo y muscular
  if (topicNormalized.includes('sistema oseo') || topicNormalized.includes('sistema óseo') || topicNormalized.includes('hueso') || topicNormalized.includes('esqueleto') || topicNormalized.includes('muscular') || topicNormalized.includes('musculo') || topicNormalized.includes('músculo') || topicNormalized.includes('locomotor')) {
    return `
SISTEMA ÓSEO Y MUSCULAR - Contenido del Libro de Ciencias Naturales ${course}

CAPÍTULO: EL SISTEMA LOCOMOTOR - HUESOS Y MÚSCULOS

1. INTRODUCCIÓN
El sistema locomotor está formado por el sistema óseo (esqueleto) y el sistema muscular. Juntos permiten el movimiento del cuerpo y le dan forma y soporte.

2. EL SISTEMA ÓSEO (ESQUELETO)

2.1 FUNCIONES DEL ESQUELETO
- Sostén: Da forma y soporte al cuerpo
- Protección: Protege órganos vitales (cráneo protege el cerebro, costillas protegen corazón y pulmones)
- Movimiento: Sirve de punto de apoyo para los músculos
- Producción de células sanguíneas: En la médula ósea roja
- Almacenamiento de minerales: Calcio y fósforo

2.2 COMPOSICIÓN DE LOS HUESOS
- Tejido óseo compacto: Denso y resistente (exterior)
- Tejido óseo esponjoso: Con espacios (interior)
- Médula ósea: Roja (produce células sanguíneas) y amarilla (grasa)
- Periostio: Membrana que recubre el hueso

2.3 TIPOS DE HUESOS

HUESOS LARGOS
- Más largos que anchos
- Ejemplo: Fémur, húmero, tibia, peroné, radio, cúbito
- Tienen diáfisis (cuerpo) y epífisis (extremos)

HUESOS CORTOS
- Tienen forma cúbica
- Ejemplo: Huesos de la muñeca (carpos), huesos del tobillo (tarsos)

HUESOS PLANOS
- Delgados y aplanados
- Ejemplo: Cráneo, omóplato, esternón, costillas

HUESOS IRREGULARES
- Formas variadas
- Ejemplo: Vértebras, huesos de la cara

2.4 PRINCIPALES HUESOS DEL CUERPO

CABEZA:
- Cráneo: Protege el cerebro (frontal, parietales, occipital, temporales)
- Huesos de la cara: Maxilares, mandíbula, nasales, pómulos

TRONCO:
- Columna vertebral: 33 vértebras (7 cervicales, 12 torácicas, 5 lumbares, sacro, cóccix)
- Costillas: 12 pares (7 verdaderas, 3 falsas, 2 flotantes)
- Esternón: Hueso plano en el centro del pecho
- Pelvis: Formada por huesos coxales, sacro y cóccix

EXTREMIDADES SUPERIORES:
- Clavícula y omóplato (cintura escapular)
- Húmero (brazo)
- Radio y cúbito (antebrazo)
- Carpos (muñeca), metacarpos (mano), falanges (dedos)

EXTREMIDADES INFERIORES:
- Fémur (muslo) - el hueso más largo del cuerpo
- Rótula (rodilla)
- Tibia y peroné (pierna)
- Tarsos (tobillo), metatarsos (pie), falanges (dedos)

2.5 ARTICULACIONES
Son las uniones entre huesos.

TIPOS DE ARTICULACIONES:
- Fijas (sinartrosis): No permiten movimiento. Ejemplo: Suturas del cráneo
- Semimóviles (anfiartrosis): Movimiento limitado. Ejemplo: Vértebras
- Móviles (diartrosis): Permiten amplio movimiento. Ejemplo: Rodilla, codo, hombro

COMPONENTES DE ARTICULACIONES MÓVILES:
- Cartílago articular: Amortigua y reduce fricción
- Líquido sinovial: Lubrica la articulación
- Ligamentos: Unen hueso con hueso
- Cápsula articular: Envuelve la articulación

3. EL SISTEMA MUSCULAR

3.1 FUNCIONES DE LOS MÚSCULOS
- Movimiento del cuerpo
- Mantenimiento de la postura
- Producción de calor corporal
- Protección de órganos
- Movimiento de sustancias dentro del cuerpo

3.2 TIPOS DE TEJIDO MUSCULAR

MÚSCULO ESQUELÉTICO (ESTRIADO VOLUNTARIO)
- Unido a los huesos por tendones
- Control voluntario (lo movemos cuando queremos)
- Fibras largas con estrías
- Ejemplo: Bíceps, tríceps, cuádriceps

MÚSCULO CARDÍACO (ESTRIADO INVOLUNTARIO)
- Solo en el corazón
- Control involuntario (late automáticamente)
- Nunca se fatiga
- Contracción rítmica

MÚSCULO LISO (INVOLUNTARIO)
- En paredes de órganos internos
- Control involuntario
- Sin estrías
- Ejemplo: Estómago, intestinos, vasos sanguíneos

3.3 PRINCIPALES MÚSCULOS DEL CUERPO

CABEZA Y CUELLO:
- Frontal: Levanta las cejas
- Orbicular de los ojos: Cierra los párpados
- Orbicular de los labios: Cierra la boca
- Masetero: Masticación
- Esternocleidomastoideo: Gira la cabeza

TRONCO:
- Pectorales: Mueven los brazos
- Abdominales: Flexionan el tronco
- Dorsales: Mueven los brazos hacia atrás
- Intercostales: Respiración
- Diafragma: Principal músculo respiratorio

EXTREMIDADES SUPERIORES:
- Deltoides: Levanta el brazo
- Bíceps: Flexiona el antebrazo
- Tríceps: Extiende el antebrazo

EXTREMIDADES INFERIORES:
- Glúteos: Extienden el muslo
- Cuádriceps: Extiende la pierna
- Bíceps femoral: Flexiona la pierna
- Gemelos: Extienden el pie

3.4 CÓMO FUNCIONAN LOS MÚSCULOS

Los músculos trabajan en pares antagónicos:
- Cuando uno se contrae (flexor), el otro se relaja (extensor)
- Ejemplo: Bíceps y tríceps para mover el antebrazo

CONTRACCIÓN MUSCULAR:
1. El cerebro envía señal nerviosa
2. La neurona motora transmite el impulso
3. Se libera calcio en las fibras musculares
4. Las proteínas actina y miosina se deslizan
5. El músculo se acorta (contrae)

4. CUIDADOS DEL SISTEMA LOCOMOTOR

PARA LOS HUESOS:
- Consumir alimentos ricos en calcio (leche, queso, yogur)
- Consumir vitamina D (sol, pescado)
- Hacer ejercicio regular
- Evitar lesiones y golpes
- Mantener buena postura

PARA LOS MÚSCULOS:
- Calentar antes del ejercicio
- Estirar después del ejercicio
- Alimentación con proteínas
- Descansar adecuadamente
- Evitar el sedentarismo
- Mantener buena postura

5. ENFERMEDADES Y LESIONES

HUESOS:
- Fractura: Rotura del hueso
- Osteoporosis: Debilitamiento de los huesos
- Escoliosis: Desviación de la columna

MÚSCULOS Y ARTICULACIONES:
- Esguince: Lesión de ligamentos
- Desgarro: Rotura de fibras musculares
- Tendinitis: Inflamación de tendones
- Artritis: Inflamación de articulaciones
`;
  }

  return null;
}

function generateMatematicasContent(topicNormalized: string, topic: string, course: string): string | null {
  // Sumas y Restas
  if (topicNormalized.includes('suma') || topicNormalized.includes('resta') || topicNormalized.includes('adicion') || topicNormalized.includes('sustraccion')) {
    return `
## SUMAS Y RESTAS - Libro de Matemáticas ${course}

### CAPÍTULO: OPERACIONES BÁSICAS - SUMA Y RESTA

---

## PARTE 1: LA SUMA (ADICIÓN)

### 1. ¿Qué es la suma?

La suma o adición es una operación matemática que consiste en **combinar o añadir** dos o más cantidades para obtener una cantidad total llamada **SUMA** o **TOTAL**.

### 2. Partes de la suma

**Estructura:**
- **25** → Primer sumando
- **+ 18** → Segundo sumando
- **= 43** → Suma, total o resultado

*El símbolo "+" se lee "más"*

### 3. Propiedades de la suma

**PROPIEDAD CONMUTATIVA:** El orden de los sumandos no altera la suma
- Ejemplo: 5 + 3 = 3 + 5 = **8**

**PROPIEDAD ASOCIATIVA:** Se pueden agrupar los sumandos de diferentes formas
- Ejemplo: (2 + 3) + 4 = 2 + (3 + 4) = **9**

**ELEMENTO NEUTRO:** Cualquier número sumado con cero da el mismo número
- Ejemplo: 7 + 0 = **7**

### 4. Pasos para sumar (Método vertical)

1. Escribir los números uno debajo del otro, alineando las unidades
2. Sumar de derecha a izquierda (comenzando por las unidades)
3. Si la suma de una columna es 10 o más, "llevar" la decena a la siguiente columna
4. Escribir el resultado

---

## EJEMPLO RESUELTO #1: Suma sin llevar

**Calcular: 234 + 152**

| Posición | Centenas | Decenas | Unidades |
|----------|----------|---------|----------|
| Número 1 | 2 | 3 | 4 |
| Número 2 | + 1 | + 5 | + 2 |
| **Resultado** | **3** | **8** | **6** |

**Paso a paso:**
- Unidades: 4 + 2 = **6**
- Decenas: 3 + 5 = **8**
- Centenas: 2 + 1 = **3**

**RESULTADO: 234 + 152 = 386**

---

## EJEMPLO RESUELTO #2: Suma con llevada

**Calcular: 567 + 285**

**Paso a paso:**

**PASO 1 - Unidades:** 7 + 5 = 12
- Escribo **2**, llevo **1** a las decenas

**PASO 2 - Decenas:** 6 + 8 = 14, más 1 que llevaba = 15
- Escribo **5**, llevo **1** a las centenas

**PASO 3 - Centenas:** 5 + 2 = 7, más 1 que llevaba = 8
- Escribo **8**

**RESULTADO: 567 + 285 = 852**

---

## PARTE 2: LA RESTA (SUSTRACCIÓN)

### 1. ¿Qué es la resta?

La resta o sustracción es una operación matemática que consiste en **quitar** una cantidad de otra para encontrar la **DIFERENCIA** entre ambas.

### 2. Partes de la resta

**Estructura:**
- **45** → Minuendo (cantidad mayor)
- **- 18** → Sustraendo (lo que quito)
- **= 27** → Diferencia o resultado

*El símbolo "-" se lee "menos"*

### 3. Regla importante

⚠️ El **MINUENDO** siempre debe ser **MAYOR o IGUAL** que el **SUSTRAENDO**
(No podemos quitar más de lo que tenemos en números naturales)

### 4. Pasos para restar (Método vertical)

1. Escribir el minuendo arriba y el sustraendo abajo, alineando las unidades
2. Restar de derecha a izquierda (comenzando por las unidades)
3. Si el dígito de arriba es menor, "pedir prestado" a la posición siguiente
4. Escribir el resultado

---

## EJEMPLO RESUELTO #3: Resta sin prestar

**Calcular: 586 - 243**

| Posición | Centenas | Decenas | Unidades |
|----------|----------|---------|----------|
| Minuendo | 5 | 8 | 6 |
| Sustraendo | - 2 | - 4 | - 3 |
| **Resultado** | **3** | **4** | **3** |

**Paso a paso:**
- Unidades: 6 - 3 = **3**
- Decenas: 8 - 4 = **4**
- Centenas: 5 - 2 = **3**

**RESULTADO: 586 - 243 = 343**

---

## EJEMPLO RESUELTO #4: Resta con préstamo

**Calcular: 523 - 187**

**Paso a paso:**

**PASO 1 - Unidades:** 3 - 7 = ¡No se puede!
- Pido 1 decena prestada (el 2 se convierte en 1)
- Ahora: 13 - 7 = **6**

**PASO 2 - Decenas:** 1 - 8 = ¡No se puede!
- Pido 1 centena prestada (el 5 se convierte en 4)
- Ahora: 11 - 8 = **3**

**PASO 3 - Centenas:** 4 - 1 = **3**

**RESULTADO: 523 - 187 = 336**

---

## PARTE 3: Relación entre suma y resta

La suma y la resta son **OPERACIONES INVERSAS**. Una deshace lo que hace la otra.

**Verificación de resultados:**
- Si 25 + 18 = 43, entonces 43 - 18 = 25 y 43 - 25 = 18
- Si 50 - 23 = 27, entonces 27 + 23 = 50

Esto nos sirve para **COMPROBAR** si nuestros cálculos están correctos.

---

## PARTE 4: PROBLEMAS DE LA VIDA REAL

### PROBLEMA 1: Dinero

**Situación:** María tenía $1.250 ahorrados. Su abuela le regaló $780 por su cumpleaños. ¿Cuánto dinero tiene María ahora?

**Identificación:**
- Dato 1: Tenía $1.250
- Dato 2: Le dieron $780
- Pregunta: ¿Cuánto tiene ahora? → **SUMA** (le dieron más)

**Resolución:**
- 1.250 + 780 = **2.030**

**Respuesta:** María tiene **$2.030**

**Comprobación:** 2.030 - 780 = 1.250 ✓

---

### PROBLEMA 2: Distancia

**Situación:** Un ciclista debe recorrer 2.500 metros. Ya ha recorrido 1.875 metros. ¿Cuántos metros le faltan por recorrer?

**Identificación:**
- Dato 1: Total a recorrer = 2.500 m
- Dato 2: Ya recorrió = 1.875 m
- Pregunta: ¿Cuánto falta? → **RESTA** (quitar lo recorrido)

**Resolución:**
- 2.500 - 1.875 = **625**

**Respuesta:** Le faltan **625 metros**

**Comprobación:** 1.875 + 625 = 2.500 ✓

---

### PROBLEMA 3: Edades

**Situación:** Pedro tiene 12 años y su hermana Ana tiene 8 años. Su papá tiene 35 años más que Ana. ¿Cuántos años tiene el papá? ¿Cuál es la diferencia de edad entre Pedro y Ana?

**Resolución Parte A (Edad del papá):**
- Ana tiene 8 años
- Papá tiene 35 años MÁS que Ana → SUMA
- Edad del papá = 8 + 35 = **43 años**

**Resolución Parte B (Diferencia de edad):**
- Pedro = 12 años, Ana = 8 años
- Diferencia = 12 - 8 = **4 años**

**Respuestas:**
- El papá tiene **43 años**
- La diferencia entre Pedro y Ana es de **4 años**

---

### PROBLEMA 4: Tienda

**Situación:** En una tienda había 456 manzanas. Llegaron 238 manzanas más. Durante el día se vendieron 389 manzanas. ¿Cuántas manzanas quedan en la tienda?

**Paso 1:** Calcular el total después de que llegaron más
- 456 + 238 = **694 manzanas**

**Paso 2:** Restar las que se vendieron
- 694 - 389 = **305 manzanas**

**Respuesta:** Quedan **305 manzanas** en la tienda

**Comprobación:** 305 + 389 = 694 ✓

---

## EJERCICIOS PARA PRACTICAR

**Nivel Básico:**
1. 345 + 231 = ?
2. 567 - 234 = ?
3. 189 + 456 = ?

**Nivel Intermedio:**
4. 678 + 394 = ?
5. 805 - 467 = ?
6. 1.234 + 876 = ?

**Nivel Avanzado:**
7. 3.456 + 2.789 = ?
8. 5.002 - 1.847 = ?
9. 8.765 - 4.987 = ?

**Problemas:**
10. Juan tenía 1.500 figuritas y regaló 875. ¿Cuántas le quedan?
11. Una biblioteca tiene 2.340 libros. Llegan 567 libros nuevos. ¿Cuántos hay ahora?
12. Un estadio tiene 15.000 asientos. Se ocuparon 12.456. ¿Cuántos quedan vacíos?

---

## CONSEJOS PARA NO EQUIVOCARSE

- Siempre alinear bien los números por posición (unidades con unidades)
- Comenzar siempre de derecha a izquierda
- No olvidar lo que llevamos o pedimos prestado
- Comprobar el resultado con la operación inversa
- En problemas, identificar primero qué operación usar
- Leer el problema completo antes de resolver
`;
  }

  // Multiplicación y División
  if (topicNormalized.includes('multiplicacion') || topicNormalized.includes('division') || topicNormalized.includes('multiplicar') || topicNormalized.includes('dividir')) {
    return `
## MULTIPLICACIÓN Y DIVISIÓN - Libro de Matemáticas ${course}

### CAPÍTULO: OPERACIONES - MULTIPLICACIÓN Y DIVISIÓN

---

## PARTE 1: LA MULTIPLICACIÓN

### 1. ¿Qué es la multiplicación?

La multiplicación es una **suma abreviada** de sumandos iguales.

En lugar de sumar: 4 + 4 + 4 + 4 + 4 = 20
Escribimos: **4 × 5 = 20** (4 sumado 5 veces)

### 2. Partes de la multiplicación

**Estructura:**
- **23** → Multiplicando
- **× 4** → Multiplicador
- **= 92** → Producto (resultado)

*Los números que se multiplican también se llaman FACTORES*

### 3. Las tablas de multiplicar

Es fundamental memorizar las tablas del 1 al 10.

**Tabla del 2:** 2, 4, 6, 8, 10, 12, 14, 16, 18, 20
**Tabla del 3:** 3, 6, 9, 12, 15, 18, 21, 24, 27, 30
**Tabla del 4:** 4, 8, 12, 16, 20, 24, 28, 32, 36, 40
**Tabla del 5:** 5, 10, 15, 20, 25, 30, 35, 40, 45, 50
**Tabla del 6:** 6, 12, 18, 24, 30, 36, 42, 48, 54, 60
**Tabla del 7:** 7, 14, 21, 28, 35, 42, 49, 56, 63, 70
**Tabla del 8:** 8, 16, 24, 32, 40, 48, 56, 64, 72, 80
**Tabla del 9:** 9, 18, 27, 36, 45, 54, 63, 72, 81, 90

### 4. Propiedades de la multiplicación

**PROPIEDAD CONMUTATIVA:** El orden no altera el producto
- Ejemplo: 3 × 5 = 5 × 3 = **15**

**PROPIEDAD ASOCIATIVA:** Se pueden agrupar los factores
- Ejemplo: (2 × 3) × 4 = 2 × (3 × 4) = **24**

**ELEMENTO NEUTRO:** Todo número multiplicado por 1 da el mismo número
- Ejemplo: 7 × 1 = **7**

**ELEMENTO ABSORBENTE:** Todo número multiplicado por 0 da 0
- Ejemplo: 8 × 0 = **0**

**PROPIEDAD DISTRIBUTIVA:** a × (b + c) = (a × b) + (a × c)
- Ejemplo: 3 × (4 + 2) = 3×4 + 3×2 = 12 + 6 = **18**

---

## EJEMPLO RESUELTO #1: Multiplicación por una cifra

**Calcular: 347 × 6**

**Paso a paso:**

**PASO 1:** 7 × 6 = 42 → Escribo **2**, llevo **4**

**PASO 2:** 4 × 6 = 24, + 4 = 28 → Escribo **8**, llevo **2**

**PASO 3:** 3 × 6 = 18, + 2 = 20 → Escribo **20**

**RESULTADO: 347 × 6 = 2.082**

---

## EJEMPLO RESUELTO #2: Multiplicación por dos cifras

**Calcular: 234 × 56**

**Paso a paso:**

**PASO 1:** Multiplicar 234 × 6 = **1.404**

**PASO 2:** Multiplicar 234 × 5 = **1.170** (escribir desplazado una posición)

**PASO 3:** Sumar los productos parciales
- 1.404 + 11.700 = **13.104**

**RESULTADO: 234 × 56 = 13.104**

---

## PARTE 2: LA DIVISIÓN

### 1. ¿Qué es la división?

La división es **repartir** una cantidad en partes iguales o averiguar cuántas veces cabe un número en otro.

### 2. Partes de la división

**Estructura:**
- **156** → Dividendo (lo que reparto)
- **÷ 12** → Divisor (en cuántas partes)
- **= 13** → Cociente (resultado)
- **resto 0** → Resto (lo que sobra)

### 3. Tipos de división

**DIVISIÓN EXACTA:** El resto es 0
- Ejemplo: 20 ÷ 4 = 5 (resto 0)

**DIVISIÓN INEXACTA:** El resto es mayor que 0
- Ejemplo: 23 ÷ 4 = 5 (resto 3)

### 4. Relación fundamental

**Dividendo = Divisor × Cociente + Resto**
- Ejemplo: 23 = 4 × 5 + 3 ✓

---

## EJEMPLO RESUELTO #3: División por una cifra

**Calcular: 847 ÷ 7**

**Paso a paso:**

**PASO 1:** ¿Cuántas veces cabe 7 en 8? → **1 vez** (1×7=7)
- 8 - 7 = 1 → Bajo el 4 → Queda 14

**PASO 2:** ¿Cuántas veces cabe 7 en 14? → **2 veces** (2×7=14)
- 14 - 14 = 0 → Bajo el 7 → Queda 7

**PASO 3:** ¿Cuántas veces cabe 7 en 7? → **1 vez** (1×7=7)
- 7 - 7 = 0

**RESULTADO: 847 ÷ 7 = 121** (resto 0) → División exacta

**Comprobación:** 7 × 121 + 0 = 847 ✓

---

## EJEMPLO RESUELTO #4: División con resto

**Calcular: 593 ÷ 8**

**Paso a paso:**

**PASO 1:** ¿Cuántas veces cabe 8 en 5? → 0 veces (tomamos 59)

**PASO 2:** ¿Cuántas veces cabe 8 en 59? → **7 veces** (7×8=56)
- 59 - 56 = 3 → Bajo el 3 → Queda 33

**PASO 3:** ¿Cuántas veces cabe 8 en 33? → **4 veces** (4×8=32)
- 33 - 32 = 1

**RESULTADO: 593 ÷ 8 = 74** (resto 1)

**Comprobación:** 8 × 74 + 1 = 592 + 1 = 593 ✓

---

## PARTE 3: Relación entre multiplicación y división

La multiplicación y la división son **OPERACIONES INVERSAS**.

- Si 6 × 8 = 48, entonces 48 ÷ 8 = 6 y 48 ÷ 6 = 8
- Si 72 ÷ 9 = 8, entonces 8 × 9 = 72

---

## PARTE 4: PROBLEMAS DE LA VIDA REAL

### PROBLEMA 1: Compras

**Situación:** Una caja de galletas cuesta $1.250. Si compras 8 cajas, ¿cuánto pagas en total?

**Identificación:**
- Precio de una caja: $1.250
- Cantidad de cajas: 8
- Pregunta: Total a pagar → **MULTIPLICACIÓN**

**Resolución:**
- 1.250 × 8 = **10.000**

**Respuesta:** Debes pagar **$10.000**

---

### PROBLEMA 2: Repartir

**Situación:** Una profesora tiene 156 lápices para repartir entre 12 estudiantes en partes iguales. ¿Cuántos lápices recibe cada estudiante?

**Identificación:**
- Total de lápices: 156
- Número de estudiantes: 12
- Pregunta: ¿Cuántos para cada uno? → **DIVISIÓN**

**Resolución:**
- 156 ÷ 12 = **13**

**Respuesta:** Cada estudiante recibe **13 lápices**

**Comprobación:** 12 × 13 = 156 ✓

---

### PROBLEMA 3: Transporte

**Situación:** Un bus escolar puede llevar 45 pasajeros. Si hay 320 estudiantes que deben ir a un paseo, ¿cuántos buses se necesitan?

**Resolución:**
- 320 ÷ 45 = 7 (resto 5)
- 7 buses llevan: 7 × 45 = 315 estudiantes
- Quedan: 5 estudiantes sin bus

⚠️ **ATENCIÓN:** Aunque el resto es 5, necesitamos un bus más para esos estudiantes

**Respuesta:** Se necesitan **8 buses** (7 buses completos + 1 bus para los 5 restantes)

---

### PROBLEMA 4: Producción

**Situación:** Una fábrica produce 2.340 botellas por hora. ¿Cuántas botellas produce en 24 horas?

**Resolución:**
- 2.340 × 24 = **56.160**

**Respuesta:** La fábrica produce **56.160 botellas** en 24 horas

---

## CONSEJOS PARA MULTIPLICAR Y DIVIDIR

**Para la multiplicación:**
- Memorizar las tablas de multiplicar
- Alinear bien los productos parciales
- No olvidar lo que llevamos
- Usar la propiedad conmutativa si es más fácil

**Para la división:**
- El divisor siempre debe ser menor que el dividendo parcial
- El resto siempre debe ser menor que el divisor
- Comprobar con la fórmula: D = d × c + r
- Practicar la estimación de cuántas veces cabe
`;
  }

  // Fracciones - nuevo formato Markdown
  if (topicNormalized.includes('fraccion') || topicNormalized.includes('fracciones')) {
    return generateFraccionesContent(topic, course);
  }

  // Ecuaciones - nuevo formato Markdown
  if (topicNormalized.includes('ecuacion') || topicNormalized.includes('ecuaciones') || topicNormalized.includes('algebra') || topicNormalized.includes('despejar')) {
    return generateEcuacionesContent(topic, course);
  }
  
  return null;
}

// Contenido de Fracciones en formato Markdown
function generateFraccionesContent(topic: string, course: string): string {
  return `
## FRACCIONES - Libro de Matemáticas ${course}

### CAPÍTULO: FRACCIONES - CONCEPTOS Y OPERACIONES

---

## PARTE 1: ¿QUÉ ES UNA FRACCIÓN?

Una fracción representa una o más partes iguales de un todo dividido en partes iguales.

### Partes de una fracción

**Estructura:**
- **3** → NUMERADOR (cuántas partes tomamos)
- **―** → Línea divisoria
- **4** → DENOMINADOR (en cuántas partes se divide el todo)

**Se lee:** "tres cuartos" = **3/4**

### Representación visual de 3/4

| Parte 1 | Parte 2 | Parte 3 | Parte 4 |
|---------|---------|---------|---------|
| ✓ | ✓ | ✓ | ○ |

→ 3 partes pintadas de 4 = **3/4**

---

## PARTE 2: TIPOS DE FRACCIONES

### 1. Fracciones PROPIAS (menor que 1)
**Numerador < Denominador**

Ejemplos:
- 1/2 (un medio)
- 3/4 (tres cuartos)
- 5/8 (cinco octavos)

### 2. Fracciones IMPROPIAS (mayor que 1)
**Numerador > Denominador**

Ejemplos:
- 5/4 (cinco cuartos)
- 7/3 (siete tercios)
- 9/2 (nueve medios)

### 3. Números MIXTOS
**Parte entera + fracción propia**

Ejemplos:
- 1 1/2 (uno y medio)
- 2 3/4 (dos y tres cuartos)
- 3 2/5 (tres y dos quintos)

---

## PARTE 3: FRACCIONES EQUIVALENTES

Fracciones equivalentes representan la **MISMA** cantidad aunque tengan diferentes numeradores y denominadores.

**Ejemplos:**
- 1/2 = 2/4 = 3/6 = 4/8 = 5/10

### Cómo obtener fracciones equivalentes

**AMPLIFICAR:** Multiplicar numerador y denominador por el mismo número
- 1/2 × 3/3 = 3/6 ✓

**SIMPLIFICAR:** Dividir numerador y denominador por el mismo número
- 6/8 ÷ 2/2 = 3/4 ✓

---

## PARTE 4: OPERACIONES CON FRACCIONES

### SUMA DE FRACCIONES

**Con igual denominador:**
- 2/5 + 1/5 = 3/5
- (Se suman los numeradores, el denominador queda igual)

**Con diferente denominador:**
1. Encontrar denominador común
2. Convertir las fracciones
3. Sumar los numeradores

**Ejemplo:** 1/3 + 1/4

1. Denominador común: 12 (mínimo común múltiplo de 3 y 4)
2. Convertir: 1/3 = 4/12, 1/4 = 3/12
3. Sumar: 4/12 + 3/12 = **7/12**

---

### RESTA DE FRACCIONES

**Con igual denominador:**
- 5/8 - 2/8 = 3/8

**Con diferente denominador:**
- Mismo procedimiento que la suma

**Ejemplo:** 3/4 - 1/3

1. Denominador común: 12
2. Convertir: 3/4 = 9/12, 1/3 = 4/12
3. Restar: 9/12 - 4/12 = **5/12**

---

### MULTIPLICACIÓN DE FRACCIONES

**Regla:** Numerador × numerador, denominador × denominador

**Ejemplo:** 2/3 × 4/5

- 2 × 4 = 8
- 3 × 5 = 15
- Resultado: **8/15**

---

### DIVISIÓN DE FRACCIONES

**Regla:** Multiplicar por el inverso de la segunda fracción

**Ejemplo:** 3/4 ÷ 2/5

1. Invertir la segunda fracción: 2/5 → 5/2
2. Multiplicar: 3/4 × 5/2 = 15/8
- Resultado: **15/8** o **1 7/8**

---

## PARTE 5: CONVERSIONES

### De fracción impropia a número mixto

**Ejemplo:** 11/4

- Dividir: 11 ÷ 4 = 2 (cociente) resto 3
- Resultado: **2 3/4**

### De número mixto a fracción impropia

**Ejemplo:** 3 2/5

- Calcular: (3 × 5) + 2 = 17
- Resultado: **17/5**

---

## PARTE 6: PROBLEMAS RESUELTOS

### PROBLEMA 1: Pizza

**Situación:** Una pizza se dividió en 8 partes iguales. María comió 3 partes y Juan comió 2 partes. ¿Qué fracción de pizza comieron entre los dos? ¿Cuánta pizza quedó?

**Resolución:**
- María: 3/8
- Juan: 2/8
- Total comido: 3/8 + 2/8 = **5/8**
- Pizza que quedó: 8/8 - 5/8 = **3/8**

---

### PROBLEMA 2: Terreno

**Situación:** Un terreno se divide en partes iguales. Pedro tiene 2/5 del terreno y Ana tiene 1/3. ¿Cuánto tienen entre los dos?

**Resolución:**
1. Denominador común: 15
2. Pedro: 2/5 = 6/15
3. Ana: 1/3 = 5/15
4. Total: 6/15 + 5/15 = **11/15**

**Respuesta:** Entre los dos tienen **11/15** del terreno

---

## CONSEJOS IMPORTANTES

- Siempre simplificar el resultado final
- En suma y resta, necesitas denominador común
- En multiplicación, multiplicar en cruz
- En división, invertir y multiplicar
- Practicar conversiones entre tipos de fracciones
`;
}

// Contenido de Ecuaciones en formato Markdown
function generateEcuacionesContent(topic: string, course: string): string {
  return `
## ECUACIONES - Libro de Matemáticas ${course}

### CAPÍTULO: INTRODUCCIÓN AL ÁLGEBRA - ECUACIONES

---

## PARTE 1: ¿QUÉ ES UNA ECUACIÓN?

Una ecuación es una **igualdad matemática** donde hay al menos un valor desconocido (incógnita) que debemos encontrar.

### Ejemplo básico

**x + 5 = 12**

- **x** → Incógnita (valor desconocido)
- **+5** → Operación
- **=** → Signo igual (indica igualdad)
- **12** → Resultado conocido

**Solución:** x = 7 (porque 7 + 5 = 12)

---

## PARTE 2: PARTES DE UNA ECUACIÓN

| Elemento | Descripción | Ejemplo en: 3x + 2 = 14 |
|----------|-------------|-------------------------|
| Incógnita | Valor a encontrar | x |
| Coeficiente | Número que multiplica | 3 |
| Término independiente | Número solo | 2 y 14 |
| Miembros | Lados de la ecuación | (3x + 2) y (14) |

---

## PARTE 3: REGLAS FUNDAMENTALES

### Regla del equilibrio

Lo que hagas a un lado de la ecuación, **debes hacerlo al otro lado**.

### Operaciones inversas

Para despejar, usamos la operación contraria:

| Operación | Inversa |
|-----------|---------|
| Suma (+) | Resta (-) |
| Resta (-) | Suma (+) |
| Multiplicación (×) | División (÷) |
| División (÷) | Multiplicación (×) |

---

## PARTE 4: PASOS PARA RESOLVER ECUACIONES

### Método general:

1. **Agrupar** términos semejantes
2. **Despejar** la incógnita paso a paso
3. **Verificar** el resultado

---

## EJEMPLO RESUELTO #1: Ecuación de un paso

**Resolver: x + 8 = 15**

**Paso 1:** Identificar qué debemos eliminar → el "+8"

**Paso 2:** Aplicar operación inversa → restar 8 en ambos lados

- x + 8 - 8 = 15 - 8
- x + 0 = 7
- **x = 7**

**Verificación:** 7 + 8 = 15 ✓

---

## EJEMPLO RESUELTO #2: Ecuación de un paso (resta)

**Resolver: x - 12 = 25**

**Paso 1:** Identificar qué debemos eliminar → el "-12"

**Paso 2:** Aplicar operación inversa → sumar 12 en ambos lados

- x - 12 + 12 = 25 + 12
- x = **37**

**Verificación:** 37 - 12 = 25 ✓

---

## EJEMPLO RESUELTO #3: Ecuación con multiplicación

**Resolver: 4x = 28**

**Paso 1:** Identificar → x está multiplicado por 4

**Paso 2:** Aplicar operación inversa → dividir por 4

- 4x ÷ 4 = 28 ÷ 4
- x = **7**

**Verificación:** 4 × 7 = 28 ✓

---

## EJEMPLO RESUELTO #4: Ecuación con división

**Resolver: x/5 = 9**

**Paso 1:** Identificar → x está dividido por 5

**Paso 2:** Aplicar operación inversa → multiplicar por 5

- (x/5) × 5 = 9 × 5
- x = **45**

**Verificación:** 45 ÷ 5 = 9 ✓

---

## EJEMPLO RESUELTO #5: Ecuación de dos pasos

**Resolver: 3x + 5 = 20**

**Paso 1:** Eliminar el término independiente

- 3x + 5 - 5 = 20 - 5
- 3x = 15

**Paso 2:** Eliminar el coeficiente

- 3x ÷ 3 = 15 ÷ 3
- x = **5**

**Verificación:** 3(5) + 5 = 15 + 5 = 20 ✓

---

## EJEMPLO RESUELTO #6: Ecuación más compleja

**Resolver: 2x - 7 = 4x - 15**

**Paso 1:** Agrupar términos con x en un lado

- 2x - 7 - 2x = 4x - 15 - 2x
- -7 = 2x - 15

**Paso 2:** Agrupar números en el otro lado

- -7 + 15 = 2x - 15 + 15
- 8 = 2x

**Paso 3:** Despejar x

- 8 ÷ 2 = 2x ÷ 2
- **x = 4**

**Verificación:**
- Lado izquierdo: 2(4) - 7 = 8 - 7 = 1
- Lado derecho: 4(4) - 15 = 16 - 15 = 1 ✓

---

## PARTE 5: PROBLEMAS DE LA VIDA REAL

### PROBLEMA 1: Compras

**Situación:** Ana compró 3 cuadernos iguales y pagó $2.100. ¿Cuánto cuesta cada cuaderno?

**Planteo:** 3x = 2.100

**Resolución:**
- 3x ÷ 3 = 2.100 ÷ 3
- x = **$700**

**Respuesta:** Cada cuaderno cuesta **$700**

---

### PROBLEMA 2: Edades

**Situación:** La edad de Pedro más 8 años es igual a 25 años. ¿Cuántos años tiene Pedro?

**Planteo:** x + 8 = 25

**Resolución:**
- x + 8 - 8 = 25 - 8
- x = **17**

**Respuesta:** Pedro tiene **17 años**

**Verificación:** 17 + 8 = 25 ✓

---

### PROBLEMA 3: Dinero

**Situación:** María tiene el doble de dinero que Juan más $500. Si María tiene $1.700, ¿cuánto tiene Juan?

**Planteo:** 2x + 500 = 1.700

**Resolución:**
- 2x + 500 - 500 = 1.700 - 500
- 2x = 1.200
- x = **$600**

**Respuesta:** Juan tiene **$600**

**Verificación:** 2(600) + 500 = 1.200 + 500 = 1.700 ✓

---

## ERRORES COMUNES A EVITAR

1. **Olvidar hacer la operación en ambos lados**
2. **Confundir signos al mover términos**
3. **No verificar la solución**
4. **Orden incorrecto de operaciones**

---

## CONSEJOS PARA RESOLVER ECUACIONES

- Siempre verificar el resultado sustituyendo
- Primero eliminar sumas/restas, luego multiplicaciones/divisiones
- Mantener el orden y limpieza en los pasos
- Practicar con problemas de la vida real
`;
}

function generateHistoriaContent(topicNormalized: string, topic: string, course: string): string | null {
  // Independencia de Chile
  if (topicNormalized.includes('independencia') || topicNormalized.includes('emancipacion')) {
    return `
LA INDEPENDENCIA DE CHILE - Contenido del Libro de Historia ${course}

CAPÍTULO: EL PROCESO DE INDEPENDENCIA

1. ANTECEDENTES DE LA INDEPENDENCIA

CAUSAS EXTERNAS:
- Independencia de Estados Unidos (1776)
- Revolución Francesa (1789)
- Invasión napoleónica a España (1808)
- Ideas de la Ilustración (libertad, igualdad, soberanía popular)

CAUSAS INTERNAS:
- Descontento criollo por discriminación en cargos públicos
- Restricciones comerciales impuestas por España
- Deseo de participación política
- Conciencia de identidad americana

2. ETAPAS DE LA INDEPENDENCIA

PATRIA VIEJA (1810-1814)
- 18 de septiembre de 1810: Primera Junta Nacional de Gobierno
- Primer Congreso Nacional (1811)
- Gobierno de José Miguel Carrera
- Primeras reformas: libertad de comercio, libertad de prensa
- Desastre de Rancagua (octubre 1814): Derrota patriota

RECONQUISTA ESPAÑOLA (1814-1817)
- Restauración del dominio español
- Gobierno represivo de Mariano Osorio y Casimiro Marcó del Pont
- Tribunales de Vindicación
- Patriotas exiliados a Argentina
- Resistencia guerrillera (Manuel Rodríguez)

PATRIA NUEVA (1817-1823)
- Cruce de los Andes por el Ejército Libertador
- Batalla de Chacabuco (12 febrero 1817): Victoria patriota
- Bernardo O'Higgins asume como Director Supremo
- Proclamación de la Independencia (12 febrero 1818)
- Batalla de Maipú (5 abril 1818): Victoria decisiva
- Gobierno de O'Higgins hasta 1823

3. PERSONAJES IMPORTANTES

BERNARDO O'HIGGINS (1778-1842)
- "Padre de la Patria"
- Director Supremo de Chile
- Organizó el Ejército patriota
- Proclamó la Independencia

JOSÉ DE SAN MARTÍN (1778-1850)
- Libertador de Argentina, Chile y Perú
- Organizó el Ejército de los Andes
- Estratega del cruce de los Andes

JOSÉ MIGUEL CARRERA (1785-1821)
- Líder de la Patria Vieja
- Impulsó reformas liberales
- Creó los primeros símbolos patrios

MANUEL RODRÍGUEZ (1785-1818)
- Guerrillero patriota
- Símbolo de resistencia durante la Reconquista
- "El guerrillero"

4. OBRAS DEL GOBIERNO DE O'HIGGINS
- Abolición de títulos de nobleza
- Creación del Cementerio General
- Fundación de escuelas
- Apertura del Instituto Nacional
- Organización de la Armada de Chile
- Abolición de las corridas de toros

5. SÍMBOLOS PATRIOS
- Bandera nacional (actual desde 1817)
- Escudo nacional
- Himno nacional
- Escarapela
`;
  }
  
  // Pueblos originarios
  if (topicNormalized.includes('pueblos originarios') || topicNormalized.includes('indigenas') || topicNormalized.includes('mapuche')) {
    return `
PUEBLOS ORIGINARIOS DE CHILE - Contenido del Libro de Historia ${course}

CAPÍTULO: LOS PUEBLOS ORIGINARIOS

1. INTRODUCCIÓN
Chile fue habitado por diversos pueblos originarios antes de la llegada de los españoles. Cada pueblo desarrolló su propia cultura, adaptándose al medio ambiente donde vivía.

2. PUEBLOS DEL NORTE

AYMARAS
- Ubicación: Altiplano (regiones de Arica y Parinacota, Tarapacá)
- Actividades: Agricultura en terrazas, ganadería de llamas y alpacas
- Características: Cultivo de papa, quinoa y maíz
- Organización: Ayllus (comunidades familiares)

ATACAMEÑOS (Lickanantay)
- Ubicación: Desierto de Atacama, oasis
- Actividades: Agricultura de oasis, comercio, metalurgia
- Características: Sistemas de riego, cultivo en terrazas
- Importante centro: San Pedro de Atacama

CHANGOS
- Ubicación: Costa del norte de Chile
- Actividades: Pesca, caza de lobos marinos
- Características: Balsas de cuero de lobo marino inflado

DIAGUITAS
- Ubicación: Valles transversales (Copiapó, Huasco, Elqui)
- Actividades: Agricultura, ganadería, metalurgia
- Características: Cerámica decorada, influencia incaica

3. PUEBLOS DE LA ZONA CENTRAL Y SUR

MAPUCHES
- Ubicación: Desde el río Aconcagua hasta Chiloé
- Organización social: Lof (comunidad), rewe (agrupación de lof)
- Autoridades: Lonko (jefe), machi (sanador/a espiritual)
- Actividades: Agricultura, ganadería, recolección
- Lengua: Mapudungún
- Religión: Creencia en Ngenechen (dios creador)
- Vivienda: Ruka
- Resistencia a la conquista española

4. PUEBLOS DEL SUR Y ZONA AUSTRAL

HUILLICHES
- Ubicación: Sur del río Toltén hasta Chiloé
- Características: Parte del pueblo mapuche, adaptados al clima lluvioso
- Actividades: Agricultura, pesca, recolección de mariscos

CHONOS
- Ubicación: Archipiélago de los Chonos
- Actividades: Pesca, caza de lobos marinos
- Características: Nómades del mar

KAWÉSQAR (Alacalufes)
- Ubicación: Canales patagónicos
- Actividades: Pesca, caza, recolección
- Características: Nómades canoeros, adaptados al frío extremo

SELK'NAM (Onas)
- Ubicación: Tierra del Fuego
- Actividades: Caza de guanacos
- Características: Nómades terrestres, ceremonias de iniciación

YAGANES (Yámanas)
- Ubicación: Extremo sur, Cabo de Hornos
- Actividades: Pesca, caza marina
- Características: El pueblo más austral del mundo

5. LEGADO DE LOS PUEBLOS ORIGINARIOS
- Lenguas y toponimia (nombres de lugares)
- Alimentos: papa, maíz, quinoa, porotos
- Textiles y artesanías
- Conocimientos medicinales
- Tradiciones y ceremonias
- Cosmovisión y relación con la naturaleza
`;
  }
  
  // El Ciclo del Agua (también puede aparecer en Historia/Geografía)
  if (topicNormalized.includes('ciclo del agua') || topicNormalized.includes('ciclo hidrologico') || topicNormalized.includes('agua') && topicNormalized.includes('ciclo')) {
    return `
EL CICLO DEL AGUA - Contenido del Libro de Historia, Geografía y Ciencias Sociales ${course}

CAPÍTULO: EL AGUA EN NUESTRO PLANETA

1. INTRODUCCIÓN AL CICLO DEL AGUA

El ciclo del agua o ciclo hidrológico es el proceso natural mediante el cual el agua circula continuamente por nuestro planeta. Este ciclo es fundamental para la vida en la Tierra y para entender la geografía y el clima de diferentes regiones.

2. ¿QUÉ ES EL AGUA?

El agua es un recurso natural vital para todos los seres vivos. Sin agua no podría existir la vida en nuestro planeta.

CARACTERÍSTICAS DEL AGUA:
- Es incolora (no tiene color)
- Es inodora (no tiene olor)
- Es insípida (no tiene sabor)
- Puede encontrarse en tres estados: líquido, sólido (hielo) y gaseoso (vapor)

3. DISTRIBUCIÓN DEL AGUA EN LA TIERRA

AGUA SALADA (97.5%):
- Océanos: Pacífico, Atlántico, Índico, Ártico, Antártico
- Mares: Mediterráneo, Caribe, del Norte, etc.

AGUA DULCE (2.5%):
- Glaciares y casquetes polares (69%)
- Aguas subterráneas (30%)
- Ríos, lagos y humedad del suelo (1%)

4. LAS ETAPAS DEL CICLO DEL AGUA

EVAPORACIÓN:
- El Sol calienta el agua de océanos, ríos y lagos
- El agua se convierte en vapor y sube a la atmósfera
- Es como cuando hierve agua en una olla y sale vapor

CONDENSACIÓN:
- El vapor de agua sube y se enfría
- Se forman pequeñas gotitas que crean las nubes
- Es como cuando el espejo del baño se empaña

PRECIPITACIÓN:
- Las gotas de las nubes se hacen muy pesadas
- Caen en forma de lluvia, nieve o granizo
- El tipo de precipitación depende de la temperatura

ESCORRENTÍA E INFILTRACIÓN:
- El agua de lluvia corre por la superficie (escorrentía)
- Parte del agua se filtra en la tierra (infiltración)
- El agua llega a ríos, lagos y finalmente al mar

5. EL SOL Y EL CICLO DEL AGUA

El Sol es el motor que hace funcionar todo el ciclo:
- Proporciona el calor necesario para la evaporación
- Sin el Sol, el agua no se evaporaría
- El ciclo se repite una y otra vez sin parar

6. IMPORTANCIA DEL CICLO DEL AGUA

PARA LA NATURALEZA:
- Distribuye el agua por todo el planeta
- Permite que llueva en diferentes lugares
- Mantiene los ríos, lagos y acuíferos con agua
- Hace posible la vida de plantas y animales

PARA LAS PERSONAS:
- Nos proporciona agua para beber
- Permite regar los cultivos
- Genera energía hidroeléctrica
- Es necesaria para la higiene y limpieza

7. LOS CUERPOS DE AGUA

OCÉANOS Y MARES:
- Grandes extensiones de agua salada
- Cubren el 71% de la superficie terrestre
- Son el principal reservorio de agua

RÍOS:
- Corrientes de agua dulce
- Fluyen desde las montañas hacia el mar
- Ejemplos en Chile: Loa, Mapocho, Biobío, Baker

LAGOS Y LAGUNAS:
- Cuerpos de agua dulce
- Pueden ser de origen natural o artificial
- Ejemplos en Chile: Lago Llanquihue, Lago General Carrera

GLACIARES:
- Grandes masas de hielo
- Se forman en zonas muy frías
- Son reservas de agua dulce
- En Chile hay muchos glaciares en la zona sur y en la cordillera

8. EL AGUA Y EL CLIMA

El ciclo del agua influye en el clima:
- Las zonas cerca del mar tienen más humedad
- Las montañas pueden bloquear las nubes
- El agua del mar modera las temperaturas

9. CUIDADO DEL AGUA

El agua dulce es un recurso limitado y debemos cuidarla:

EN TU CASA:
- Cierra la llave mientras te cepillas los dientes
- Toma duchas cortas
- Avisa si hay una llave que gotea
- No juegues con el agua innecesariamente

EN TU COMUNIDAD:
- No tires basura a los ríos o lagos
- Cuida las plantas porque ayudan al ciclo del agua
- Participa en campañas de cuidado del agua

10. ACTIVIDADES DE APRENDIZAJE

ACTIVIDAD 1: Dibuja el ciclo del agua
Haz un dibujo que muestre las etapas del ciclo: evaporación, condensación, precipitación y escorrentía.

ACTIVIDAD 2: Investiga
¿Cuál es el río más importante de tu región? ¿De dónde viene su agua?

ACTIVIDAD 3: Experimento casero
Con ayuda de un adulto, calienta agua en una olla y observa cómo se forma vapor. Pon una tapa fría sobre el vapor y verás cómo se forman gotitas (condensación).

ACTIVIDAD 4: Reflexión
¿Por qué es importante cuidar el agua? ¿Qué acciones puedes hacer tú para no desperdiciarla?
`;
  }
  
  return null;
}

function generateLenguajeContent(topicNormalized: string, topic: string, course: string): string | null {
  // Sujeto y Predicado
  if (topicNormalized.includes('sujeto') && topicNormalized.includes('predicado') || 
      topicNormalized.includes('sujeto y predicado') ||
      topicNormalized.includes('predicado y sujeto')) {
    return `
SUJETO Y PREDICADO - Contenido del Libro de Lenguaje y Comunicación ${course}

CAPÍTULO: LA ORACIÓN - SUJETO Y PREDICADO

1. INTRODUCCIÓN
La oración es un conjunto de palabras que tiene sentido completo. Toda oración se divide en dos partes fundamentales: el sujeto y el predicado.

2. ¿QUÉ ES LA ORACIÓN?

DEFINICIÓN:
Una oración es un grupo de palabras ordenadas que expresan una idea completa. Siempre comienza con mayúscula y termina con un punto.

CARACTERÍSTICAS DE LA ORACIÓN:
- Tiene sentido completo por sí sola
- Contiene un verbo conjugado
- Se divide en sujeto y predicado
- Expresa una idea, pregunta, orden o emoción

3. EL SUJETO

DEFINICIÓN:
El sujeto es la parte de la oración que indica quién realiza la acción o de quién se habla. Responde a las preguntas: ¿Quién? o ¿Qué?

CARACTERÍSTICAS DEL SUJETO:
- Indica quién o qué realiza la acción
- Su núcleo es un sustantivo o pronombre
- Puede estar al inicio, en medio o al final de la oración
- Concuerda en número (singular/plural) con el verbo

NÚCLEO DEL SUJETO:
- El núcleo es la palabra más importante del sujeto
- Generalmente es un sustantivo o pronombre
- El verbo debe concordar con el núcleo del sujeto

EJEMPLOS DE SUJETOS:
- "María canta muy bien" → Sujeto: María
- "El perro negro corre rápido" → Sujeto: El perro negro (núcleo: perro)
- "Mis amigos juegan fútbol" → Sujeto: Mis amigos (núcleo: amigos)
- "Ella estudia mucho" → Sujeto: Ella
- "Los estudiantes del tercero básico participaron" → Sujeto: Los estudiantes del tercero básico (núcleo: estudiantes)

TIPOS DE SUJETO:

SUJETO EXPRESO:
- Aparece escrito en la oración
- Ejemplo: "Juan come manzanas" → Sujeto expreso: Juan

SUJETO TÁCITO (u omitido):
- No aparece escrito, pero se sobreentiende
- Se deduce por la terminación del verbo
- Ejemplo: "Comemos pizza" → Sujeto tácito: Nosotros

4. EL PREDICADO

DEFINICIÓN:
El predicado es la parte de la oración que indica lo que hace el sujeto o lo que se dice de él. Responde a las preguntas: ¿Qué hace? ¿Qué le pasa? ¿Cómo es?

CARACTERÍSTICAS DEL PREDICADO:
- Contiene siempre un verbo conjugado
- Indica la acción, estado o característica del sujeto
- El verbo es el núcleo del predicado
- Puede tener complementos que amplían la información

NÚCLEO DEL PREDICADO:
- El núcleo del predicado SIEMPRE es el verbo
- El verbo expresa la acción o estado
- Debe concordar en persona y número con el sujeto

EJEMPLOS DE PREDICADOS:
- "María canta muy bien" → Predicado: canta muy bien (núcleo: canta)
- "El perro negro corre rápido" → Predicado: corre rápido (núcleo: corre)
- "Mis amigos juegan fútbol" → Predicado: juegan fútbol (núcleo: juegan)
- "La casa es grande y bonita" → Predicado: es grande y bonita (núcleo: es)

5. CÓMO IDENTIFICAR EL SUJETO Y EL PREDICADO

MÉTODO 1: Identificar el verbo primero
1. Busca el verbo de la oración
2. Pregunta ¿Quién + verbo? para encontrar el sujeto
3. El resto de la oración es el predicado

EJEMPLO PRÁCTICO:
Oración: "Los niños del barrio juegan en el parque"

Paso 1: Identificar el verbo → "juegan"
Paso 2: Preguntar ¿Quién juega? → "Los niños del barrio" (SUJETO)
Paso 3: El resto es el predicado → "juegan en el parque" (PREDICADO)

MÉTODO 2: Buscar de quién se habla
1. Identifica de quién o de qué se está hablando → Ese es el sujeto
2. Identifica qué se dice sobre esa persona o cosa → Ese es el predicado

6. CONCORDANCIA SUJETO-VERBO

El sujeto y el verbo deben concordar en:

NÚMERO (singular o plural):
- Sujeto singular = verbo singular: "El niño juega"
- Sujeto plural = verbo plural: "Los niños juegan"

PERSONA (1ª, 2ª o 3ª persona):
- Yo estudio (1ª persona singular)
- Tú estudias (2ª persona singular)
- Él/Ella estudia (3ª persona singular)
- Nosotros estudiamos (1ª persona plural)
- Ustedes estudian (2ª persona plural)
- Ellos/Ellas estudian (3ª persona plural)

7. EJEMPLOS ANALIZADOS

ORACIÓN 1: "La profesora explica la lección con claridad"
- Sujeto: La profesora (núcleo: profesora)
- Predicado: explica la lección con claridad (núcleo: explica)

ORACIÓN 2: "Mis hermanos y yo visitamos a los abuelos"
- Sujeto: Mis hermanos y yo (núcleo: hermanos, yo)
- Predicado: visitamos a los abuelos (núcleo: visitamos)

ORACIÓN 3: "El sol brillante ilumina el campo"
- Sujeto: El sol brillante (núcleo: sol)
- Predicado: ilumina el campo (núcleo: ilumina)

ORACIÓN 4: "Comieron toda la comida"
- Sujeto: Tácito (Ellos/Ellas)
- Predicado: Comieron toda la comida (núcleo: comieron)

8. TIPOS DE ORACIONES SEGÚN SU ESTRUCTURA

ORACIÓN SIMPLE:
- Tiene un solo sujeto y un solo predicado
- Ejemplo: "El gato duerme en el sofá"

ORACIÓN COMPUESTA:
- Tiene más de un sujeto o más de un predicado
- Ejemplo: "María canta y Pedro baila"

9. ACTIVIDADES DE PRÁCTICA

ACTIVIDAD 1: Identificar sujeto y predicado
Subraya el sujeto con azul y el predicado con rojo:
a) Los pájaros cantan en el árbol.
b) Mi mamá prepara el almuerzo.
c) El libro nuevo está sobre la mesa.
d) Corremos en el patio.

ACTIVIDAD 2: Encontrar el núcleo
Identifica el núcleo del sujeto y del predicado:
a) La casa grande tiene un jardín hermoso.
b) Los estudiantes aplicados estudian todos los días.
c) Mi mejor amiga vive cerca de la escuela.

ACTIVIDAD 3: Completar oraciones
Agrega el sujeto o predicado que falta:
a) _____________ juegan en el parque. (agregar sujeto)
b) El cartero _____________ . (agregar predicado)
c) _____________ brillan en el cielo. (agregar sujeto)

10. RESUMEN

RECUERDA:
- La oración se divide en SUJETO y PREDICADO
- El SUJETO indica quién realiza la acción (núcleo: sustantivo)
- El PREDICADO indica qué hace el sujeto (núcleo: verbo)
- Para encontrar el sujeto, pregunta: ¿Quién + verbo?
- El sujeto y el verbo deben concordar en número y persona
- El sujeto puede ser expreso o tácito
`;
  }
  
  // Sustantivos
  if (topicNormalized.includes('sustantivo') || topicNormalized.includes('sustantivos')) {
    return `
EL SUSTANTIVO - Contenido del Libro de Lenguaje ${course}

CAPÍTULO: LAS CLASES DE PALABRAS - EL SUSTANTIVO

1. DEFINICIÓN
El sustantivo es la palabra que sirve para nombrar personas, animales, cosas, lugares, sentimientos o ideas.

2. CLASIFICACIÓN DE SUSTANTIVOS

POR SU SIGNIFICADO:

SUSTANTIVOS COMUNES
- Nombran de forma general
- Se escriben con minúscula
- Ejemplos: perro, ciudad, libro, mesa

SUSTANTIVOS PROPIOS
- Nombran de forma específica y única
- Se escriben con mayúscula inicial
- Ejemplos: Pedro, Chile, Andes, Amazonas

POR SU EXTENSIÓN:

SUSTANTIVOS INDIVIDUALES
- Nombran un solo elemento
- Ejemplos: árbol, abeja, soldado, estrella

SUSTANTIVOS COLECTIVOS
- Nombran un conjunto de elementos
- Ejemplos: bosque (conjunto de árboles), enjambre (conjunto de abejas)

POR SU NATURALEZA:

SUSTANTIVOS CONCRETOS
- Se perciben con los sentidos
- Ejemplos: mesa, flor, música, perfume

SUSTANTIVOS ABSTRACTOS
- No se perciben con los sentidos
- Expresan ideas, sentimientos o cualidades
- Ejemplos: amor, libertad, justicia, belleza

3. GÉNERO DE LOS SUSTANTIVOS

MASCULINO:
- Generalmente terminan en -o
- Usan artículos: el, un, los, unos
- Ejemplos: el niño, el perro, el libro

FEMENINO:
- Generalmente terminan en -a
- Usan artículos: la, una, las, unas
- Ejemplos: la niña, la perra, la casa

EXCEPCIONES IMPORTANTES:
- Masculinos en -a: el día, el mapa, el planeta, el problema
- Femeninos en -o: la mano, la radio, la foto
- Sustantivos invariables: el/la estudiante, el/la artista

4. NÚMERO DE LOS SUSTANTIVOS

SINGULAR: Indica uno solo
- Ejemplos: gato, flor, lápiz

PLURAL: Indica más de uno
- Ejemplos: gatos, flores, lápices

FORMACIÓN DEL PLURAL:
- Palabras terminadas en vocal: +s (casa → casas)
- Palabras terminadas en consonante: +es (pared → paredes)
- Palabras terminadas en -z: cambia a -ces (lápiz → lápices)
- Palabras terminadas en -s (agudas): +es (autobús → autobuses)
- Palabras terminadas en -s (no agudas): no cambian (el lunes → los lunes)

5. FUNCIÓN EN LA ORACIÓN

El sustantivo puede ser:
- SUJETO de la oración: "El perro ladra"
- COMPLEMENTO del verbo: "Compré un libro"
- COMPLEMENTO de otro sustantivo: "La casa de Pedro"

6. ACOMPAÑANTES DEL SUSTANTIVO
- Artículos: el, la, los, las, un, una, unos, unas
- Adjetivos: grande, pequeño, rojo, hermoso
- Determinantes: este, ese, aquel, mi, tu, su
`;
  }
  
  // Verbos
  if (topicNormalized.includes('verbo') || topicNormalized.includes('verbos')) {
    return `
EL VERBO - Contenido del Libro de Lenguaje ${course}

CAPÍTULO: LAS CLASES DE PALABRAS - EL VERBO

1. DEFINICIÓN
El verbo es la palabra que expresa acción, estado o proceso. Es el núcleo del predicado y la palabra más importante de la oración.

2. ACCIDENTES DEL VERBO

PERSONA:
- Primera persona: quien habla (yo, nosotros)
- Segunda persona: a quien se habla (tú, ustedes, vosotros)
- Tercera persona: de quien se habla (él, ella, ellos, ellas)

NÚMERO:
- Singular: una persona (yo canto, tú cantas, él canta)
- Plural: varias personas (nosotros cantamos, ellos cantan)

TIEMPO:
- Presente: acción actual (yo camino)
- Pasado/Pretérito: acción ya realizada (yo caminé)
- Futuro: acción por realizarse (yo caminaré)

MODO:
- Indicativo: expresa hechos reales
- Subjuntivo: expresa deseos, dudas, posibilidades
- Imperativo: expresa órdenes o mandatos

3. CONJUGACIONES VERBALES

PRIMERA CONJUGACIÓN: Verbos terminados en -AR
- Infinitivo: amar, cantar, caminar, saltar
- Modelo: AMAR
  - Presente: amo, amas, ama, amamos, aman
  - Pretérito: amé, amaste, amó, amamos, amaron
  - Futuro: amaré, amarás, amará, amaremos, amarán

SEGUNDA CONJUGACIÓN: Verbos terminados en -ER
- Infinitivo: comer, beber, correr, temer
- Modelo: COMER
  - Presente: como, comes, come, comemos, comen
  - Pretérito: comí, comiste, comió, comimos, comieron
  - Futuro: comeré, comerás, comerá, comeremos, comerán

TERCERA CONJUGACIÓN: Verbos terminados en -IR
- Infinitivo: vivir, partir, escribir, subir
- Modelo: VIVIR
  - Presente: vivo, vives, vive, vivimos, viven
  - Pretérito: viví, viviste, vivió, vivimos, vivieron
  - Futuro: viviré, vivirás, vivirá, viviremos, vivirán

4. TIEMPOS SIMPLES Y COMPUESTOS

TIEMPOS SIMPLES (una sola palabra):
- Presente: canto
- Pretérito imperfecto: cantaba
- Pretérito perfecto simple: canté
- Futuro: cantaré
- Condicional: cantaría

TIEMPOS COMPUESTOS (verbo haber + participio):
- Pretérito perfecto compuesto: he cantado
- Pretérito pluscuamperfecto: había cantado
- Futuro perfecto: habré cantado
- Condicional perfecto: habría cantado

5. VERBOS REGULARES E IRREGULARES

VERBOS REGULARES:
- Siguen el modelo de su conjugación
- Mantienen su raíz sin cambios
- Ejemplos: amar, comer, vivir

VERBOS IRREGULARES:
- Cambian su raíz o sus desinencias
- No siguen completamente el modelo
- Ejemplos: ser, ir, tener, hacer, decir, poder

6. FORMAS NO PERSONALES DEL VERBO

INFINITIVO: Forma básica (termina en -ar, -er, -ir)
- Ejemplo: cantar, comer, vivir

GERUNDIO: Expresa acción en desarrollo
- Termina en -ando (1ª conj.) o -iendo (2ª y 3ª conj.)
- Ejemplo: cantando, comiendo, viviendo

PARTICIPIO: Forma que puede funcionar como adjetivo
- Termina en -ado (1ª conj.) o -ido (2ª y 3ª conj.)
- Ejemplo: cantado, comido, vivido
`;
  }
  
  // Comprensión lectora
  if (topicNormalized.includes('comprension lectora') || topicNormalized.includes('lectura')) {
    return `
COMPRENSIÓN LECTORA - Contenido del Libro de Lenguaje ${course}

CAPÍTULO: ESTRATEGIAS DE COMPRENSIÓN LECTORA

1. ¿QUÉ ES LA COMPRENSIÓN LECTORA?
Es la capacidad de entender lo que se lee, interpretando el significado de las palabras, las ideas del autor y el mensaje del texto.

2. NIVELES DE COMPRENSIÓN

NIVEL LITERAL
- Identificar información explícita en el texto
- Reconocer personajes, lugares, hechos
- Responder: ¿Qué? ¿Quién? ¿Dónde? ¿Cuándo?

NIVEL INFERENCIAL
- Deducir información no explícita
- Interpretar significados implícitos
- Relacionar ideas y sacar conclusiones

NIVEL CRÍTICO
- Evaluar el contenido del texto
- Formar opiniones propias
- Distinguir hechos de opiniones

3. ESTRATEGIAS ANTES DE LEER

ACTIVAR CONOCIMIENTOS PREVIOS
- ¿Qué sé sobre este tema?
- ¿Qué he leído antes sobre esto?

FORMULAR PREDICCIONES
- ¿De qué tratará el texto según el título?
- ¿Qué información espero encontrar?

ESTABLECER UN PROPÓSITO
- ¿Para qué voy a leer este texto?
- ¿Qué quiero aprender?

4. ESTRATEGIAS DURANTE LA LECTURA

SUBRAYAR IDEAS IMPORTANTES
- Identificar ideas principales
- Marcar palabras clave

HACER PREGUNTAS
- ¿Qué significa esta palabra?
- ¿Por qué sucede esto?

VISUALIZAR
- Crear imágenes mentales
- Imaginar la escena descrita

RELEER CUANDO SEA NECESARIO
- Volver a leer partes confusas
- Aclarar significados

5. ESTRATEGIAS DESPUÉS DE LEER

RESUMIR
- Expresar las ideas principales con tus palabras
- Organizar la información

EVALUAR
- ¿Entendí el texto?
- ¿Logré mi propósito de lectura?

RELACIONAR
- Conectar con experiencias personales
- Relacionar con otros textos

6. TIPOS DE TEXTOS

TEXTOS NARRATIVOS
- Cuentan una historia
- Tienen personajes, lugar, tiempo y acontecimientos
- Ejemplos: cuentos, novelas, fábulas

TEXTOS INFORMATIVOS
- Entregan información sobre un tema
- Organización clara de ideas
- Ejemplos: artículos, enciclopedias, noticias

TEXTOS ARGUMENTATIVOS
- Presentan opiniones y las defienden
- Incluyen argumentos y evidencias
- Ejemplos: ensayos, cartas al editor

TEXTOS INSTRUCTIVOS
- Indican cómo hacer algo
- Tienen pasos ordenados
- Ejemplos: recetas, manuales, instrucciones
`;
  }
  
  return null;
}

// IMPORTANTE: Esta función ahora retorna null para que la IA genere contenido real
// En lugar de generar contenido genérico de plantilla que no aporta valor educativo
function generateGenericContent(topic: string, subject: string, course: string): string | null {
  // Retornar null para forzar que la IA genere contenido educativo real
  // basado en sus conocimientos sobre el tema específico
  console.log(`[pdf-content-generator] No hay contenido específico para "${topic}" en ${subject} (${course}). La IA generará el contenido.`);
  return null;
}
