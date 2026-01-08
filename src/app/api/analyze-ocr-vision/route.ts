import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

type InputImage = { pageNum?: number; dataUrl: string }

function safeJsonParse(text: string): any {
  const clean = String(text)
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  try {
    return JSON.parse(clean)
  } catch {}

  const start = clean.indexOf('{')
  const end = clean.lastIndexOf('}')
  if (start >= 0 && end > start) {
    return JSON.parse(clean.slice(start, end + 1))
  }
  throw new Error('No se pudo parsear JSON desde la respuesta del modelo')
}

function getApiKey() {
  return (
    process.env.GOOGLE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  )
}

function stripDataUrl(dataUrl: string): { mimeType: string; base64: string } {
  const m = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/)
  if (m) return { mimeType: m[1], base64: m[2] }
  // fallback: asumir PNG
  return { mimeType: 'image/png', base64: dataUrl }
}

export async function POST(request: NextRequest) {
  try {
    const { images, questionsCount, title, topic, subjectName } = (await request.json()) as {
      images: InputImage[]
      questionsCount?: number
      title?: string
      topic?: string
      subjectName?: string
    }

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ success: false, error: 'Se requieren imágenes' }, { status: 400 })
    }

    const apiKey = getApiKey()
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'API key no configurada', fallback: true }, { status: 200 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const qCount = typeof questionsCount === 'number' && questionsCount > 0 ? questionsCount : 0
    const contextLine = [title, subjectName, topic].filter(Boolean).join(' | ')

    const prompt = `ROL: Auditor Forense de Exámenes Escolares (Visión Artificial OMR).

CONTEXTO DE LA PRUEBA: ${contextLine || 'N/D'}
PREGUNTAS ESPERADAS: ${qCount || 'Se detectará automáticamente'}

## TAREA PRINCIPAL:
Analiza VISUALMENTE cada página para detectar TODAS las preguntas visibles.
⚠️ CRÍTICO: DEBES REPORTAR CADA PREGUNTA INDIVIDUALMENTE, del 1 al ${qCount > 0 ? qCount : 'último número visible'}.
NO AGRUPES, NO OMITAS, NO SALTES ninguna pregunta.

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
   - Si la marca está en el PRIMER paréntesis (junto a V) → detected = "V"
   - Si la marca está en el SEGUNDO paréntesis (junto a F) → detected = "F"
   - Si ambos están vacíos → detected = null

🔴 EJEMPLOS VISUALES - MEMORIZA ESTOS PATRONES:
"V(X)  F( )"   → Marca en PRIMER paréntesis → detected = "V"
"V (X) F ( )"  → Marca en PRIMER paréntesis → detected = "V"
"V( X ) F()"   → Marca en PRIMER paréntesis → detected = "V"
"V() F(X)"     → Marca en SEGUNDO paréntesis → detected = "F"
"V ( ) F (X)"  → Marca en SEGUNDO paréntesis → detected = "F"
"V( ) F( X )"  → Marca en SEGUNDO paréntesis → detected = "F"
"V( ) F( )"    → Ambos vacíos → detected = null

⚠️ ERROR COMÚN A EVITAR: NO confundas el orden de los paréntesis.
- El paréntesis de V SIEMPRE aparece ANTES que el de F en la línea
- Si ves "V(X) F( )" la X está en V, no en F

⚠️ CRÍTICO: NO importa si hay espacio entre V y el paréntesis.
⚠️ CRÍTICO: Reporta CADA pregunta V/F individualmente, del 1 al último número.
- Si ves marca DENTRO del paréntesis de V → detected = "V", questionType = "tf"
- Si ves marca DENTRO del paréntesis de F → detected = "F", questionType = "tf"

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
- "(X) 12" en la PRIMERA línea = opción A marcada → detected = "A"
- "(X) 8" en la SEGUNDA línea = opción B marcada → detected = "B"
- La clave es la POSICIÓN (línea), NO el símbolo que ves

🔴 MÉTODO OBLIGATORIO - USA LA POSICIÓN:
1. Las opciones SIEMPRE van en orden vertical: 1ª línea=A, 2ª línea=B, 3ª línea=C, 4ª línea=D
2. Busca cuál línea tiene la marca (X, ✓, tachado, relleno)
3. Si la marca está en la 1ª línea de opciones → detected = "A"
4. Si la marca está en la 2ª línea de opciones → detected = "B"
5. Si la marca está en la 3ª línea de opciones → detected = "C"
6. Si la marca está en la 4ª línea de opciones → detected = "D"

🔴 EJEMPLOS CONCRETOS:
Ejemplo 1 - Pregunta "¿Cuál es el resultado de 7+5?":
  (X) 12    ← PRIMERA línea tiene X → detected = "A" (CORRECTO: 7+5=12)
  (B) 10
  (C) 14
  (D) 11

Ejemplo 2 - Pregunta "¿Qué número resulta de 15-6?":
  (A) 9
  (X) 8     ← SEGUNDA línea tiene X → detected = "B" (INCORRECTO: 15-6=9)
  (C) 7
  (D) 10

🔴 ERROR COMÚN A EVITAR:
- La letra original puede estar tachada o reemplazada por X
- NO busques la letra "A" o "B" - busca la MARCA (X, tachado)
- SÍ reporta según la POSICIÓN VERTICAL (línea 1,2,3,4 = A,B,C,D)

Reglas de detección:
- Primera opción con marca → detected = "A", questionType = "mc"
- Segunda opción con marca → detected = "B", questionType = "mc"
- Tercera opción con marca → detected = "C", questionType = "mc"
- Cuarta opción con marca → detected = "D", questionType = "mc"
- También puede haber E, F si hay más opciones

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
RESULTADO: detected = "B,C,D" (NO incluye A porque su checkbox está vacío)

🔴 OTRO EJEMPLO:
Opción A: ☒ (A) 9 - 4 = 5    → Checkbox con X → INCLUIR A
Opción B: □ (B) 10 - 5 = 6   → Checkbox vacío → NO incluir B
Opción C: ☒ (C) 8 - 3 = 5    → Checkbox con X → INCLUIR C
Opción D: ☒ (D) 12 - 7 = 5   → Checkbox con X → INCLUIR D
RESULTADO: detected = "A,C,D"

🚨 VERIFICACIÓN OBLIGATORIA - ANTES DE RESPONDER:
1. Cuenta cuántos checkboxes tienen marca visible: ___
2. Lista las LETRAS de esos checkboxes marcados: ___
3. Verifica que detected contenga EXACTAMENTE esas letras separadas por coma
4. Si solo 1 checkbox marcado → detected = "X" (una sola letra)
5. Si múltiples marcados → detected = "X,Y,Z" (letras en orden alfabético)

⚠️ ERROR MUY COMÚN A EVITAR: 
- NO asumas que A siempre está marcada
- NO confundas checkbox vacío □ con marcado ☒
- Mira DIRECTAMENTE el cuadro de cada opción, no el texto

### TIPO 4: DESARROLLO / PROBLEMA (Respuesta escrita)
Formato típico: Pregunta con espacio para escribir (líneas, cuadro, espacio en blanco)
- El estudiante escribe texto manuscrito o impreso como respuesta
- EXTRAE el texto completo de la respuesta del estudiante
- questionType = "des"
- detected = "[texto extraído de la respuesta]" (máximo 500 caracteres)
- Si hay operaciones matemáticas, extrae los números y resultados
- Si no hay respuesta escrita → detected = null
- ⚠️ MUY IMPORTANTE: NO omitas las preguntas de desarrollo, siempre inclúyelas
- evidence = "TEXTO manuscrito" o "TEXTO impreso" según corresponda
- Ejemplo de respuesta: "El resultado es 42 pasajeros. 38-12+9=35, 35-8+15=42"

## 📋 PROTOCOLO DE DETECCIÓN SECUENCIAL:

### PASO 1: ESCANEO VISUAL COMPLETO
- Localiza TODAS las preguntas numeradas en el documento
- Identifica el TIPO de cada pregunta (V/F, alternativas, selección múltiple)
- Cuenta cuántas preguntas hay en total

### PASO 2: ANÁLISIS PREGUNTA POR PREGUNTA
Para CADA pregunta del 1 al último número:

**Si es V/F:**
a) Localiza "V (" y "F (" en la misma línea
b) REGLA: V siempre aparece PRIMERO, F siempre aparece DESPUÉS
c) Examina el contenido DENTRO de cada paréntesis:
   - V ( X ) F ( ) → La X está en el paréntesis de V → detected = "V"
   - V ( ) F ( X ) → La X está en el paréntesis de F → detected = "F"
   - V ( ) F ( ) → Ambos vacíos → detected = null
d) ⚠️ NO CONFUNDAS: Si ves "V(X) F( )" la marca está en V, NO en F

**Si es ALTERNATIVAS (A,B,C,D):**
⚠️ MUY IMPORTANTE:
a) Localiza TODAS las opciones (pueden estar en formato A), a), (A), etc.)
b) Para CADA opción, identifica la LETRA (A, B, C, D)
c) Busca cuál tiene marca (X, círculo, check, relleno)
d) REPORTA la LETRA de la opción marcada, NO la posición visual
e) ¿Ninguna marcada? → detected = null
f) ¿Más de una marcada? → detected = null (invalidado) para opción múltiple simple

**Si es SELECCIÓN MÚLTIPLE:**
⚠️ CRÍTICO - Examina CADA opción individualmente:
a) Para la opción A: ¿tiene checkbox relleno/marcado? (■, ☑, ☒, X) → SÍ/NO
b) Para la opción B: ¿tiene checkbox relleno/marcado? → SÍ/NO
c) Para la opción C: ¿tiene checkbox relleno/marcado? → SÍ/NO
d) Para la opción D: ¿tiene checkbox relleno/marcado? → SÍ/NO
e) Reporta TODAS las letras con SÍ, separadas por coma, en orden alfabético
f) Ejemplo: Si C=SÍ y D=SÍ → detected = "C,D"
g) ¿Ninguna marcada? → detected = null

**Si es DESARROLLO/PROBLEMA:**
a) Busca el área de respuesta (líneas, cuadro, espacio bajo la pregunta)
b) LEE TODO el texto manuscrito o impreso que el estudiante escribió
c) Extrae números, operaciones matemáticas, pasos y conclusiones
d) detected = texto completo de la respuesta (máx 500 chars)
e) Si está vacío o ilegible → detected = null
f) questionType = "des"

### PASO 3: CLASIFICACIÓN DE MARCAS:
- "STRONG_X": Una X clara y fuerte → VÁLIDA
- "CHECK": Un check/palomita ✓ → VÁLIDA  
- "CIRCLE": Círculo alrededor de la opción → VÁLIDA
- "FILL": Opción rellenada/sombreada → VÁLIDA
- "EMPTY": Sin marca → detected = null
- "WEAK_MARK": Garabato dudoso → detected = null

### DETECCIÓN DE ESTUDIANTE:
- Busca "Nombre:", "Estudiante:" en el encabezado
- Busca "RUT:" seguido de números

## FORMATO DE RESPUESTA (JSON PURO):

{
  "questionsFoundInDocument": número_total_de_preguntas_detectadas,
  "pages": [
    {
      "pageIndex": 0,
      "pageNum": 1,
      "student": {
        "name": "Nombre del estudiante o null",
        "rut": "RUT o null"
      },
      "answers": [
        {"questionNum": 1, "questionType": "tf", "evidence": "STRONG_X en V", "detected": "V", "points": 5},
        {"questionNum": 2, "questionType": "tf", "evidence": "STRONG_X en F", "detected": "F", "points": 5},
        {"questionNum": 3, "questionType": "mc", "evidence": "CIRCLE en opción B", "detected": "B", "points": 5},
        {"questionNum": 4, "questionType": "mc", "evidence": "STRONG_X en opción A", "detected": "A", "points": 5},
        {"questionNum": 5, "questionType": "ms", "evidence": "STRONG_X en A y C", "detected": "A,C", "points": 5},
        {"questionNum": 6, "questionType": "mc", "evidence": "EMPTY - sin marca", "detected": null, "points": null},
        {"questionNum": 7, "questionType": "des", "evidence": "TEXTO manuscrito", "detected": "El resultado es 42 pasajeros. Primero 38-12+9=35, luego 35-8+15=42", "points": 25}
      ]
    }
  ]
}

## ⚠️ CHECKLIST FINAL ANTES DE RESPONDER:
1. ¿Incluí TODAS las preguntas del 1 al último número? ✓
   ⚠️ NO OMITAS NINGUNA PREGUNTA - Si ves pregunta 1, 2 y 3, DEBES reportar las 3
2. ¿Identifiqué correctamente el TIPO de cada pregunta (tf/mc/ms/des)? ✓
3. ¿Las alternativas están en MAYÚSCULA (A, B, C, D)? ✓
4. ¿Las selecciones múltiples están separadas por coma (A,C,D)? ✓
5. ¿Las preguntas sin marca/respuesta tienen detected = null? ✓
6. ¿La letra reportada corresponde a la OPCIÓN con marca, no a la posición visual? ✓
7. ¿Extraje el TEXTO COMPLETO de las respuestas de desarrollo? ✓
8. ¿El JSON es válido, sin texto adicional? ✓
9. Para V/F: ¿Verifiqué cuál paréntesis (V o F) tiene la X/marca dentro? ✓

⚠️ REGLA DE ORO PARA V/F:
- Si ves "V(X)" o "V (X)" o "V ( X )" → detected = "V", evidence = "STRONG_X en V"
- Si ves "F(X)" o "F (X)" o "F ( X )" → detected = "F", evidence = "STRONG_X en F"
- Si ves marca en V (cualquier símbolo visible) → detected = "V"
- Si ves marca en F (cualquier símbolo visible) → detected = "F"
- Si ambos están vacíos V() F() → detected = null, evidence = "EMPTY - ambos paréntesis vacíos"
- ⚠️ NUNCA uses evidence="EMPTY" si hay una marca en V o F
- NUNCA omitas una pregunta V/F solo porque no estás seguro

🔴 SI TIENES DUDA EN V/F: Reporta lo que ves (V o F) con evidence="MARCA VISIBLE en V/F"

Devuelve SOLO JSON válido, sin markdown ni explicaciones.
`

    const parts: any[] = [{ text: prompt }]
    for (const img of images) {
      const { mimeType, base64 } = stripDataUrl(img.dataUrl)
      parts.push({
        inlineData: {
          mimeType,
          data: base64,
        },
      })
    }

    const result = await model.generateContent(parts)
    const response = await result.response
    const text = response.text()

    try {
      const analysis = safeJsonParse(text)
      return NextResponse.json({ success: true, analysis, rawResponse: text })
    } catch (parseError) {
      console.error('Error parseando respuesta de Gemini (visión):', parseError)
      return NextResponse.json({ success: false, error: 'Error parseando respuesta de IA', rawResponse: text }, { status: 200 })
    }
  } catch (error: any) {
    console.error('Error en análisis OCR visión:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al analizar OCR', fallback: true },
      { status: 500 }
    )
  }
}
