import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuración del Route Segment para App Router
export const maxDuration = 60; // Máximo tiempo de ejecución en segundos
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, questions, pageNumber, focusQuestionNums } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'La imagen es requerida' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ Clave de Gemini no configurada para análisis OMR');
      return NextResponse.json({ success: false, error: 'API key no configurada', fallback: true });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // 1. LIMPIEZA CRÍTICA DEL BASE64
    // Si el string viene con "data:image/png;base64,..." hay que quitarlo.
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    // 2. CONSTRUCCIÓN DEL CONTEXTO (PREGUNTAS)
    const questionsContext = Array.isArray(questions) && questions.length > 0
      ? `ESTRUCTURA ESPERADA DE LA PRUEBA (Úsala como guía - las opciones están en orden A, B, C, D de arriba a abajo):
         ${questions.map((q: any, i: number) => {
           if (q.type === 'tf') {
             return `P${i+1}: [Verdadero/Falso] - "${q.text?.substring(0, 50)}..."`
           } else if (q.type === 'mc') {
             const opts = (q.options || []).map((o: string, j: number) => `${String.fromCharCode(65+j)}=${o?.substring(0, 20)}`).join(' | ')
             return `P${i+1}: [MC - Opciones: ${opts}] "${q.text?.substring(0, 30)}..."`
           } else if (q.type === 'ms') {
             const opts = (q.options || []).map((o: any, j: number) => `${String.fromCharCode(65+j)}=${(typeof o === 'string' ? o : o?.text)?.substring(0, 15)}`).join(' | ')
             return `P${i+1}: [MS - Múltiples: ${opts}] "${q.text?.substring(0, 30)}..."`
           } else if (q.type === 'des') {
             return `P${i+1}: [DESARROLLO - Extraer TEXTO MANUSCRITO completo] "${q.text?.substring(0, 50)}..."`
           }
           return `P${i+1}: [Otro tipo]`
         }).join('\n         ')}`
      : 'Estructura genérica: Busca preguntas numeradas.';

    const focusNums: number[] = Array.isArray(focusQuestionNums)
      ? focusQuestionNums.map((n: any) => Number(n)).filter((n: number) => Number.isFinite(n) && n > 0)
      : [];
    const focusLine = focusNums.length > 0
      ? `\n\nMODO RE-CHEQUEO (FOCO): Analiza SOLO estas preguntas: ${focusNums.join(', ')}.\n- Ignora el resto del documento.\n- NO devuelvas preguntas fuera del foco.\n- Devuelve exactamente esas preguntas en "answers" (una entrada por cada número solicitado).\n`
      : '';

    const totalQuestions = Array.isArray(questions) ? questions.length : 0;

    // 3. PROMPT MEJORADO - SOPORTA V/F, ALTERNATIVAS Y SELECCIÓN MÚLTIPLE
    const prompt = `
ROL: Auditor Forense de Exámenes Escolares (Visión Artificial OMR).

TAREA: Analizar la imagen y extraer TODAS las preguntas visibles.
⚠️ CRÍTICO: DEBES REPORTAR CADA PREGUNTA DEL 1 AL ${totalQuestions > 0 ? totalQuestions : 'ÚLTIMO NÚMERO VISIBLE'}.

${focusLine}

${questionsContext}

## 📋 TIPOS DE PREGUNTAS A DETECTAR:

### TIPO 1: VERDADERO/FALSO (V/F)
Formatos comunes (CON O SIN espacios):
- "V ( ) F ( )" o "V() F()" o "V( ) F( )"
- "V(X) F( )" o "V (X) F ( )" o "V( X ) F( )"
- "Verdadero ( ) Falso ( )"

🔴 MÉTODO OBLIGATORIO PARA V/F - LEE CON CUIDADO:

⚠️ REGLA FUNDAMENTAL: En cada línea V/F, hay DOS paréntesis:
- El PRIMER paréntesis está asociado a la letra V (Verdadero)
- El SEGUNDO paréntesis está asociado a la letra F (Falso)

PASO A PASO:
1. Localiza "V" seguido de su paréntesis (el PRIMERO que aparece)
2. Localiza "F" seguido de su paréntesis (el SEGUNDO que aparece)
3. Determina cuál paréntesis contiene la marca (X, ✓, etc.):
   - Si la marca está en el PRIMER paréntesis (junto a V) → val = "V"
   - Si la marca está en el SEGUNDO paréntesis (junto a F) → val = "F"
   - Si ambos están vacíos → val = null

🔴 EJEMPLOS VISUALES - MEMORIZA ESTOS PATRONES:
"V(X)  F( )"   → Marca en PRIMER paréntesis → val = "V"
"V (X) F ( )"  → Marca en PRIMER paréntesis → val = "V"
"V( X ) F()"   → Marca en PRIMER paréntesis → val = "V"
"V() F(X)"     → Marca en SEGUNDO paréntesis → val = "F"
"V ( ) F (X)"  → Marca en SEGUNDO paréntesis → val = "F"
"V( ) F( X )"  → Marca en SEGUNDO paréntesis → val = "F"
"V( ) F( )"    → Ambos vacíos → val = null

⚠️ ERROR COMÚN A EVITAR: NO confundas el orden de los paréntesis.
- El paréntesis de V SIEMPRE aparece ANTES que el de F en la línea
- Si ves "V(X) F( )" la X está en V, no en F

⚠️ CRÍTICO: Reporta CADA pregunta V/F individualmente, del 1 al último número.
- Marca en V (primer paréntesis) → val = "V", type = "tf"
- Marca en F (segundo paréntesis) → val = "F", type = "tf"

### TIPO 2: ALTERNATIVAS / OPCIÓN MÚLTIPLE (A, B, C, D)
FORMATOS COMUNES (todos válidos):
- Formato 1: "a) ( ) b) ( ) c) ( ) d) ( )" con paréntesis después
- Formato 2: "A. B. C. D." con punto después
- Formato 3: "(A) (B) (C) (D)" con paréntesis ALREDEDOR de la letra ← COMÚN EN CHILE
- Formato 4: "( ) A  ( ) B  ( ) C  ( ) D" con paréntesis antes

⚠️ REGLA CRÍTICA PARA DETECTAR LA OPCIÓN MARCADA:

🔴 FORMATO CHILENO COMÚN - PARÉNTESIS CON LETRA:
En formato "(A) texto, (B) texto, (C) texto, (D) texto":
- Cuando el estudiante marca, la X REEMPLAZA la letra dentro del paréntesis
- "(X) 12" en la PRIMERA línea = opción A marcada → val = "A"
- "(X) 8" en la SEGUNDA línea = opción B marcada → val = "B"
- La clave es la POSICIÓN (línea), NO el símbolo que ves

🔴 MÉTODO OBLIGATORIO - USA LA POSICIÓN:
1. Las opciones SIEMPRE van en orden vertical: 1ª línea=A, 2ª línea=B, 3ª línea=C, 4ª línea=D
2. Busca cuál línea tiene la marca (X, ✓, tachado, relleno)
3. Si la marca está en la 1ª línea de opciones → val = "A"
4. Si la marca está en la 2ª línea de opciones → val = "B"
5. Si la marca está en la 3ª línea de opciones → val = "C"
6. Si la marca está en la 4ª línea de opciones → val = "D"

🔴 EJEMPLOS CONCRETOS:
Ejemplo 1 - Pregunta "¿Cuál es el resultado de 7+5?":
  (X) 12    ← PRIMERA línea tiene X → val = "A" (CORRECTO: 7+5=12)
  (B) 10
  (C) 14
  (D) 11

Ejemplo 2 - Pregunta "¿Qué número resulta de 15-6?":
  (A) 9
  (X) 8     ← SEGUNDA línea tiene X → val = "B" (INCORRECTO: 15-6=9)
  (C) 7
  (D) 10

🔴 ERROR COMÚN A EVITAR:
- La letra original puede estar tachada o reemplazada por X
- NO busques la letra "A" o "B" - busca la MARCA (X, tachado)
- SÍ reporta según la POSICIÓN VERTICAL (línea 1,2,3,4 = A,B,C,D)

Reglas de detección:
- Marca en 1ª opción → val = "A", type = "mc"
- Marca en 2ª opción → val = "B", type = "mc"
- Marca en 3ª opción → val = "C", type = "mc"
- Marca en 4ª opción → val = "D", type = "mc"

### TIPO 3: SELECCIÓN MÚLTIPLE (varias correctas)
⚠️ CRÍTICO: Revisa CADA opción individualmente para detectar TODAS las marcas.

🔴 PASO 1 - IDENTIFICA VISUALMENTE CADA CHECKBOX:
- Checkbox VACÍO: □ ☐ - Cuadro con INTERIOR BLANCO/LIMPIO, SIN NADA dentro
- Checkbox MARCADO: ☒ ☑ ■ ✗ ✓ - Tiene X, check, relleno o tachado DENTRO

🔴 PASO 2 - ANALIZA CADA OPCIÓN POR SEPARADO:
Para CADA línea pregúntate: "¿El cuadro antes de esta letra tiene ALGO dentro?"
- Si tiene CUALQUIER marca (X, relleno, check) → INCLUIR la letra
- Si está completamente vacío/blanco → NO incluir

🔴 PASO 3 - EJEMPLO DETALLADO (caso típico):
Pregunta: "¿Cuáles son correctas?"
Opción A: □ (A) La suma de dos números negativos es positiva
   → El cuadro □ está VACÍO (interior blanco) → A NO se incluye
Opción B: ☒ (B) Restar un número negativo es lo mismo que sumar su valor positivo  
   → El cuadro ☒ tiene una X dentro → B SÍ se incluye
Opción C: ☒ (C) La suma es conmutativa
   → El cuadro ☒ tiene una X dentro → C SÍ se incluye
Opción D: ☒ (D) Restar cero no cambia el número
   → El cuadro ☒ tiene una X dentro → D SÍ se incluye
RESULTADO: val = "B,C,D" (NO incluye A porque su checkbox está vacío)

🔴 OTRO EJEMPLO:
Opción A: ☒ (A) 9 - 4 = 5    → Checkbox con X → INCLUIR A
Opción B: □ (B) 10 - 5 = 6   → Checkbox vacío → NO incluir B
Opción C: ☒ (C) 8 - 3 = 5    → Checkbox con X → INCLUIR C
Opción D: ☒ (D) 12 - 7 = 5   → Checkbox con X → INCLUIR D
RESULTADO: val = "A,C,D"

🚨 VERIFICACIÓN OBLIGATORIA - ANTES DE RESPONDER:
1. Cuenta cuántos checkboxes tienen marca visible: ___
2. Lista las LETRAS de esos checkboxes marcados: ___
3. Verifica que val contenga EXACTAMENTE esas letras separadas por coma
4. Si solo 1 checkbox marcado → val = "X" (una sola letra)
5. Si múltiples marcados → val = "X,Y,Z" (letras en orden alfabético)

⚠️ ERROR MUY COMÚN A EVITAR: 
- NO asumas que A siempre está marcada
- NO confundas checkbox vacío □ con marcado ☒
- Mira DIRECTAMENTE el cuadro de cada opción, no el texto

### TIPO 4: DESARROLLO / PROBLEMA (Respuesta escrita)
Formato: Pregunta con espacio para escribir respuesta (líneas, cuadro, espacio en blanco)
- El estudiante escribe texto manuscrito o impreso como respuesta
- EXTRAE el texto completo de la respuesta del estudiante
- type = "des"
- val = "[texto extraído de la respuesta]" (máximo 500 caracteres)
- Si hay operaciones matemáticas, extrae los números y resultados
- Si no hay respuesta escrita → val = null
- ⚠️ MUY IMPORTANTE: NO omitas las preguntas de desarrollo, siempre inclúyelas
- evidence = "TEXTO manuscrito" o "TEXTO impreso" según corresponda

## 📋 PROTOCOLO DE DETECCIÓN:

### PASO 1: LOCALIZAR Y CLASIFICAR PREGUNTAS
- Escanea el documento de arriba a abajo
- Identifica CADA pregunta numerada (1, 2, 3, 4, 5, ...)
- Determina el TIPO: ¿Es V/F o tiene alternativas A,B,C,D?

### PASO 2: ANALIZAR CADA PREGUNTA DE ALTERNATIVAS
⚠️ MUY IMPORTANTE: Para cada pregunta de alternativas:
1. IDENTIFICA TODAS las opciones (A, B, C, D, etc.)
2. Para CADA opción, verifica si tiene marca (X, círculo, check, relleno)
3. La marca puede estar:
   - Dentro de un paréntesis: (X) B → opción B marcada
   - Al lado de la letra: X B) → opción B marcada
   - Sobre la letra o texto de la opción
4. REPORTA la LETRA de la opción que tiene la marca, NO la posición visual

**Si es V/F:**
- Localiza "V (" y "F (" en la misma línea
- REGLA: V siempre aparece PRIMERO, F siempre aparece DESPUÉS
- Examina el contenido DENTRO de cada paréntesis:
  - V ( X ) F ( ) → La X está en el paréntesis de V → val = "V"
  - V ( ) F ( X ) → La X está en el paréntesis de F → val = "F"
  - V ( ) F ( ) → Ambos vacíos → val = null
- ⚠️ NO CONFUNDAS: Si ves "V(X) F( )" la marca está en V, NO en F
- La marca puede ser X, ✓, /, cualquier símbolo visible
- ¿Cuál tiene la marca DENTRO del paréntesis? → val = "V" o "F"

**Si es ALTERNATIVAS:**
- Lee CADA línea de opción de arriba a abajo
- Identifica la LETRA (A, B, C, D) de cada opción
- Busca la marca (X, círculo, check) en cada opción
- REPORTA la letra de la opción marcada
- ¿Más de una marcada en opción simple? → val = null (invalidado)

**Si es SELECCIÓN MÚLTIPLE:**
⚠️ CRÍTICO - Examina CADA opción individualmente:
1. Opción A: ¿tiene checkbox relleno/marcado? (■, ☑, ☒, X) → SÍ/NO
2. Opción B: ¿tiene checkbox relleno/marcado? → SÍ/NO
3. Opción C: ¿tiene checkbox relleno/marcado? → SÍ/NO
4. Opción D: ¿tiene checkbox relleno/marcado? → SÍ/NO
5. Reporta TODAS las letras con SÍ, separadas por coma
Ejemplo: Si C=SÍ y D=SÍ → val = "C,D"

**Si es DESARROLLO/PROBLEMA:**
- Busca el área de respuesta (líneas, cuadro, espacio bajo la pregunta)
- LEE TODO el texto manuscrito o impreso que el estudiante escribió
- Extrae números, operaciones matemáticas, y conclusiones
- val = texto completo de la respuesta (máx 500 chars)
- Si está vacío o ilegible → val = null

### PASO 3: CLASIFICAR LA MARCA
- "STRONG_X": X clara → VÁLIDA
- "CHECK": Check/palomita ✓ → VÁLIDA
- "CIRCLE": Círculo alrededor → VÁLIDA
- "FILL": Rellenado/sombreado → VÁLIDA
- "EMPTY": Sin marca → val = null

### DETECCIÓN DE ESTUDIANTE:
- Busca "Nombre:", "Estudiante:" seguido de texto
- Busca "RUT:" seguido de números

## FORMATO DE SALIDA (JSON PURO):
{
  "studentName": "Nombre detectado o null",
  "rut": "RUT detectado o null",
  "questionsFound": número_total_de_preguntas,
  "answers": [
    { "q": 1, "type": "tf", "evidence": "STRONG_X en V", "val": "V" },
    { "q": 2, "type": "tf", "evidence": "STRONG_X en F", "val": "F" },
    { "q": 3, "type": "mc", "evidence": "CIRCLE en opción B", "val": "B" },
    { "q": 4, "type": "mc", "evidence": "STRONG_X en opción A", "val": "A" },
    { "q": 5, "type": "ms", "evidence": "STRONG_X en A y C", "val": "A,C" },
    { "q": 6, "type": "mc", "evidence": "EMPTY - sin marca", "val": null },
    { "q": 7, "type": "des", "evidence": "TEXTO manuscrito detectado", "val": "El resultado es 42 pasajeros porque 38-12+9=35, luego 35-8+15=42" }
  ],
  "confidence": "High"
}

## ⚠️ CHECKLIST ANTES DE RESPONDER:
1. ¿Incluí TODAS las preguntas del 1 al ${totalQuestions > 0 ? totalQuestions : 'último'}? ✓
   ⚠️ NO OMITAS NINGUNA PREGUNTA - Si ves pregunta 1, 2 y 3, DEBES reportar las 3
2. ¿Identifiqué el TIPO correcto (tf/mc/ms/des)? ✓
3. ¿Las alternativas están en MAYÚSCULA (A, B, C, D)? ✓
4. ¿Las preguntas sin marca/respuesta tienen val = null? ✓
5. ¿La letra reportada corresponde a la OPCIÓN con marca, no a la posición visual? ✓
6. ¿Extraje el TEXTO COMPLETO de las respuestas de desarrollo? ✓
7. Para V/F: ¿Verifiqué cuál paréntesis (V o F) tiene la X/marca dentro? ✓

⚠️ REGLA DE ORO PARA V/F:
- Si ves "V(X)" o "V (X)" o "V ( X )" → val = "V", evidence = "STRONG_X en V"
- Si ves "F(X)" o "F (X)" o "F ( X )" → val = "F", evidence = "STRONG_X en F"
- Si ves marca en V (cualquier símbolo visible) → val = "V"
- Si ves marca en F (cualquier símbolo visible) → val = "F"
- Si ambos están vacíos V() F() → val = null, evidence = "EMPTY - ambos paréntesis vacíos"
- ⚠️ NUNCA uses evidence="EMPTY" si hay una marca en V o F
- NUNCA omitas una pregunta V/F solo porque no estás seguro

🔴 SI TIENES DUDA EN V/F: Reporta lo que ves (V o F) con evidence="MARCA VISIBLE en V/F"

Devuelve SOLO JSON válido.
`;

    // 4. PREPARACIÓN MULTIMODAL
    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: 'image/jpeg',
      },
    };

    // 5. GENERACIÓN
    console.log(`[OMR] 🔍 Analizando página ${pageNumber || 'N/A'} con Gemini Vision...`);
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    console.log(`[OMR] 📝 Respuesta raw:`, text.substring(0, 500));

    // 6. PARSEO SEGURO
    try {
      const jsonString = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const analysis = JSON.parse(jsonString);
      
      console.log(`[OMR] ✅ Página ${pageNumber}: ${analysis.questionsFound || 0} preguntas, ${analysis.answers?.filter((a: any) => a.val !== null).length || 0} respondidas`);
      
      return NextResponse.json({
        success: true,
        analysis,
        pageNumber
      });
    } catch (parseError: any) {
      console.error('[OMR] ❌ Error parseando JSON:', parseError.message);
      console.error('[OMR] Texto recibido:', text);
      return NextResponse.json({
        success: false,
        error: 'Error parseando respuesta de IA',
        rawResponse: text
      });
    }

  } catch (error: any) {
    console.error('[OMR] ❌ Error general:', error);
    return NextResponse.json(
      { success: false, error: error.message, fallback: true },
      { status: 500 }
    );
  }
}
