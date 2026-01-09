"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Eye, ClipboardCheck, FileSearch, Trash2, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

import { Button } from "@/components/ui/button"
import TestViewDialog from "@/components/pruebas/TestViewDialog"
import TestReviewDialog from "@/components/pruebas/TestReviewDialog"
import TestBuilder from "@/components/pruebas/TestBuilder"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Tipos
export type TestItem = {
	id: string
	title: string
	description?: string
	createdAt: number
	courseId?: string
	sectionId?: string
	subjectId?: string
	subjectName?: string
	topic?: string
	counts?: { tf: number; mc: number; ms: number; des?: number }
	weights?: { tf: number; mc: number; ms: number; des: number }
	totalPoints?: number
	total?: number
	questions?: any[]
	status?: "generating" | "ready"
	progress?: number
	ownerId?: string
	ownerUsername?: string
}

const TESTS_BASE_KEY = "smart-student-tests"
const getTestsKey = (user?: { username?: string | null } | null): string => {
	const uname = user?.username ? String(user.username).trim().toLowerCase() : ""
	return uname ? `${TESTS_BASE_KEY}_${uname}` : TESTS_BASE_KEY
}
const getReviewKey = (id: string) => `smart-student-test-reviews_${id}`

export default function PruebasPage() {
	const { translate, language } = useLanguage()
	const { user } = useAuth()

	const [tests, setTests] = useState<TestItem[]>([])
	const [builder, setBuilder] = useState<any>({})

	const [selected, setSelected] = useState<TestItem | null>(null)
	const [openView, setOpenView] = useState(false)
	const [openReview, setOpenReview] = useState(false)

	// Confirmación de borrado
	const [deleteOpen, setDeleteOpen] = useState(false)
	const [deleteTarget, setDeleteTarget] = useState<TestItem | null>(null)

	// Progreso simulado
	const progressIntervalRef = useRef<number | null>(null)

	// Datos base (solo para etiquetas mínimas)
	const [courses, setCourses] = useState<any[]>([])
	const [sections, setSections] = useState<any[]>([])
	const [subjects, setSubjects] = useState<any[]>([])

	// Cargar datasets y pruebas
	useEffect(() => {
		try {
			setCourses(JSON.parse(localStorage.getItem("smart-student-courses") || "[]"))
			setSections(JSON.parse(localStorage.getItem("smart-student-sections") || "[]"))
			setSubjects(JSON.parse(localStorage.getItem("smart-student-subjects") || "[]"))
		} catch {}

		try {
			const key = getTestsKey(user)
			const raw = localStorage.getItem(key)
			if (raw) {
				setTests(JSON.parse(raw))
			} else {
				const globalRaw = localStorage.getItem(TESTS_BASE_KEY)
				if (globalRaw) {
					const globalItems: TestItem[] = JSON.parse(globalRaw)
					const mine = user
						? globalItems.filter(
								(t) => (t.ownerId === (user as any).id) || (t.ownerUsername === (user as any).username)
							)
						: globalItems
					if (mine.length > 0) {
						localStorage.setItem(key, JSON.stringify(mine))
						setTests(mine)
					} else setTests([])
				} else setTests([])
			}
		} catch (e) {
			console.error("[Pruebas] Error cargando/migrando historial:", e)
		}

		const onStorage = (e: StorageEvent) => {
			if (!e.key) return
			const currentKey = getTestsKey(user)
			if (e.key === currentKey) setTests(JSON.parse(e.newValue || "[]"))
			if (e.key === "smart-student-courses") setCourses(JSON.parse(e.newValue || "[]"))
			if (e.key === "smart-student-sections") setSections(JSON.parse(e.newValue || "[]"))
			if (e.key === "smart-student-subjects") setSubjects(JSON.parse(e.newValue || "[]"))
		}
		window.addEventListener("storage", onStorage)
		return () => window.removeEventListener("storage", onStorage)
	}, [user?.username])

	const saveTests = (items: TestItem[]) => {
		const key = getTestsKey(user)
		setTests(items)
		localStorage.setItem(key, JSON.stringify(items))
		window.dispatchEvent(new StorageEvent("storage", { key, newValue: JSON.stringify(items) }))
	}

	const patchTest = (id: string, patch: Partial<TestItem>) => {
		const key = getTestsKey(user)
		setTests((prev) => {
			const updated: TestItem[] = prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
			localStorage.setItem(key, JSON.stringify(updated))
			window.dispatchEvent(new StorageEvent("storage", { key, newValue: JSON.stringify(updated) }))
			return updated
		})
	}

	// Progreso simulado si status === 'generating'
	useEffect(() => {
		const hasGenerating = tests.some((t) => t.status === "generating")
		if (hasGenerating && !progressIntervalRef.current) {
			progressIntervalRef.current = window.setInterval(() => {
				setTests((prev) => {
					const updated: TestItem[] = prev.map((t) => {
						if (t.status === "generating") {
							const inc = Math.floor(Math.random() * 8) + 3
							const next = Math.min(100, (t.progress || 0) + inc)
							return { ...t, progress: next, status: (next >= 100 ? "ready" : "generating") as "ready" | "generating" }
						}
						return t
					})
					const key = getTestsKey(user)
					localStorage.setItem(key, JSON.stringify(updated))
					window.dispatchEvent(new StorageEvent("storage", { key, newValue: JSON.stringify(updated) }))
					if (!updated.some((x) => x.status === "generating") && progressIntervalRef.current) {
						window.clearInterval(progressIntervalRef.current)
						progressIntervalRef.current = null
					}
					return updated
				})
			}, 600) as unknown as number
		}
		if (!hasGenerating && progressIntervalRef.current) {
			window.clearInterval(progressIntervalRef.current)
			progressIntervalRef.current = null
		}
		return () => {
			if (progressIntervalRef.current) {
				window.clearInterval(progressIntervalRef.current)
				progressIntervalRef.current = null
			}
		}
	}, [tests])

	// Obtener la versión más actualizada del test seleccionado desde el array tests
	const selectedTest = useMemo(() => {
		if (!selected) return undefined
		// Buscar el test actualizado en el array para obtener las questions más recientes
		const updated = tests.find(t => t.id === selected.id)
		return updated || selected
	}, [selected, tests])

	const handleOpenView = (t: TestItem) => { setSelected(t); setOpenView(true) }
	const handleOpenReview = (t?: TestItem) => { if (t) setSelected(t); setOpenReview(true) }

	const hasAnyReview = (id: string) => {
		try { const raw = localStorage.getItem(getReviewKey(id)); const arr = raw ? JSON.parse(raw) : []; return Array.isArray(arr) && arr.length > 0 } catch { return false }
	}

	// Generador local mejorado con preguntas variadas y educativas
	const generateLocalQuestions = (topic: string, counts?: { tf?: number; mc?: number; ms?: number; des?: number }, subjectName?: string) => {
		const res: any[] = []
		if (!counts) return res
		const makeId = (p: string) => `${p}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
		const cleanTopic = (topic || 'el tema').trim()
		const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
		
		// Detectar tipo de asignatura para personalizar preguntas
		const isMath = /matem[aá]tica|math|algebra|geometr[ií]a|aritm[eé]tica|c[aá]lculo|ecuacion|fracci[oó]n|porcentaje|trigonometr|suma|resta|multiplic|divisi/i.test(topic + ' ' + (subjectName || ''))
		const isScience = /ciencia|biolog[ií]a|qu[ií]mica|f[ií]sica|naturaleza|ambiente|ecolog|sistema|c[eé]lula|planeta|energ[ií]a/i.test(topic + ' ' + (subjectName || ''))
		const isHistory = /historia|geograf[ií]a|social|civica|ciudadan|gobierno|pa[ií]s|cultura|civilizaci/i.test(topic + ' ' + (subjectName || ''))
		const isLanguage = /lenguaje|literatura|español|gram[aá]tica|ortograf|lectura|escritura|comunicaci/i.test(topic + ' ' + (subjectName || ''))
		
		// Plantillas de preguntas V/F variadas según tipo
		const tfTemplates = isMath ? [
			{ text: `En ${cleanTopic}, el orden de los factores altera el producto.`, answer: false },
			{ text: `Al realizar operaciones de ${cleanTopic}, siempre se debe respetar la jerarquía de operaciones.`, answer: true },
			{ text: `En ${cleanTopic}, cualquier número multiplicado por cero da como resultado cero.`, answer: true },
			{ text: `Las operaciones de ${cleanTopic} siempre dan un resultado mayor que los números originales.`, answer: false },
			{ text: `En ${cleanTopic}, la propiedad conmutativa permite cambiar el orden de los números sin alterar el resultado.`, answer: true },
			{ text: `Al resolver problemas de ${cleanTopic}, es importante identificar primero los datos del problema.`, answer: true },
			{ text: `En ${cleanTopic}, la resta es una operación conmutativa.`, answer: false },
			{ text: `Para verificar un resultado de ${cleanTopic}, podemos usar la operación inversa.`, answer: true },
		] : isScience ? [
			{ text: `${cap(cleanTopic)} es un proceso fundamental que ocurre en todos los seres vivos.`, answer: true },
			{ text: `Los cambios en ${cleanTopic} pueden afectar a otros sistemas relacionados.`, answer: true },
			{ text: `${cap(cleanTopic)} solo puede observarse en condiciones de laboratorio.`, answer: false },
			{ text: `El estudio de ${cleanTopic} ayuda a comprender mejor nuestro entorno.`, answer: true },
			{ text: `${cap(cleanTopic)} es un fenómeno que no tiene relación con la vida cotidiana.`, answer: false },
			{ text: `Los científicos utilizan el método científico para estudiar ${cleanTopic}.`, answer: true },
			{ text: `${cap(cleanTopic)} es un proceso que permanece siempre constante.`, answer: false },
			{ text: `Comprender ${cleanTopic} es importante para el cuidado del medio ambiente.`, answer: true },
		] : isHistory ? [
			{ text: `Los eventos relacionados con ${cleanTopic} tuvieron impacto en la sociedad de su época.`, answer: true },
			{ text: `${cap(cleanTopic)} es un tema que solo interesa a los historiadores profesionales.`, answer: false },
			{ text: `El estudio de ${cleanTopic} nos ayuda a entender el presente.`, answer: true },
			{ text: `Los cambios provocados por ${cleanTopic} fueron inmediatos y sin consecuencias posteriores.`, answer: false },
			{ text: `${cap(cleanTopic)} involucró la participación de diferentes grupos sociales.`, answer: true },
			{ text: `Podemos aprender lecciones valiosas del estudio de ${cleanTopic}.`, answer: true },
			{ text: `${cap(cleanTopic)} no tiene ninguna relevancia para nuestra vida actual.`, answer: false },
			{ text: `El análisis de ${cleanTopic} requiere considerar múltiples perspectivas.`, answer: true },
		] : [
			{ text: `El conocimiento de ${cleanTopic} es aplicable en situaciones de la vida real.`, answer: true },
			{ text: `${cap(cleanTopic)} es un concepto que no tiene relación con otras áreas del conocimiento.`, answer: false },
			{ text: `Comprender ${cleanTopic} requiere práctica y estudio constante.`, answer: true },
			{ text: `${cap(cleanTopic)} puede ser entendido de una sola manera, sin interpretaciones.`, answer: false },
			{ text: `El aprendizaje de ${cleanTopic} contribuye al desarrollo del pensamiento crítico.`, answer: true },
			{ text: `${cap(cleanTopic)} es un tema que solo se estudia en el colegio.`, answer: false },
			{ text: `Existen diferentes formas de aplicar los conceptos de ${cleanTopic}.`, answer: true },
			{ text: `El dominio de ${cleanTopic} se logra únicamente memorizando definiciones.`, answer: false },
		]
		
		// Barajar y seleccionar preguntas V/F
		const shuffledTF = [...tfTemplates].sort(() => Math.random() - 0.5)
		for (let i = 0; i < (counts.tf || 0); i++) {
			const template = shuffledTF[i % shuffledTF.length]
			res.push({ id: makeId('tf'), type: 'tf', text: template.text, answer: template.answer })
		}
		
		// Plantillas de selección múltiple
		const mcTemplates = isMath ? [
			{ text: `¿Cuál es el primer paso recomendado al resolver un problema de ${cleanTopic}?`, options: ['Escribir la respuesta inmediatamente', 'Leer y comprender el problema', 'Usar la calculadora', 'Preguntar al profesor'], correctIndex: 1 },
			{ text: `¿Qué propiedad matemática nos permite cambiar el orden de los números en ${cleanTopic}?`, options: ['Distributiva', 'Asociativa', 'Conmutativa', 'Inversa'], correctIndex: 2 },
			{ text: `En ${cleanTopic}, ¿cuál operación debemos realizar primero según la jerarquía?`, options: ['Suma', 'Resta', 'Multiplicación o división', 'Cualquiera'], correctIndex: 2 },
			{ text: `¿Cuál es la mejor estrategia para verificar un resultado en ${cleanTopic}?`, options: ['Confiar en el primer resultado', 'Realizar la operación inversa', 'No verificar', 'Preguntar a un compañero'], correctIndex: 1 },
		] : isScience ? [
			{ text: `¿Cuál es la importancia principal de estudiar ${cleanTopic}?`, options: ['No tiene importancia', 'Solo para aprobar exámenes', 'Comprender nuestro entorno', 'Es obligatorio'], correctIndex: 2 },
			{ text: `¿Qué método utilizan los científicos para estudiar ${cleanTopic}?`, options: ['Adivinación', 'Método científico', 'Opiniones personales', 'Tradición oral'], correctIndex: 1 },
			{ text: `¿Cómo se relaciona ${cleanTopic} con la vida cotidiana?`, options: ['No se relaciona', 'Solo en el laboratorio', 'En múltiples aspectos diarios', 'Solo en la escuela'], correctIndex: 2 },
			{ text: `¿Qué actitud es más apropiada al estudiar ${cleanTopic}?`, options: ['Memorizar sin entender', 'Curiosidad y observación', 'Solo leer el libro', 'No hacer preguntas'], correctIndex: 1 },
		] : [
			{ text: `¿Por qué es importante aprender sobre ${cleanTopic}?`, options: ['Solo para las notas', 'Para el desarrollo personal', 'No es importante', 'Solo para el examen'], correctIndex: 1 },
			{ text: `¿Cuál es la mejor forma de estudiar ${cleanTopic}?`, options: ['Memorizar todo', 'Comprender y practicar', 'Solo leer una vez', 'Copiar las respuestas'], correctIndex: 1 },
			{ text: `¿Cómo podemos aplicar ${cleanTopic} en la vida real?`, options: ['No se puede aplicar', 'En diversas situaciones', 'Solo en el trabajo', 'Nunca se usa'], correctIndex: 1 },
			{ text: `¿Qué habilidad desarrollamos al estudiar ${cleanTopic}?`, options: ['Ninguna', 'Pensamiento crítico', 'Solo memoria', 'Nada útil'], correctIndex: 1 },
		]
		
		const shuffledMC = [...mcTemplates].sort(() => Math.random() - 0.5)
		for (let i = 0; i < (counts.mc || 0); i++) {
			const template = shuffledMC[i % shuffledMC.length]
			res.push({ id: makeId('mc'), type: 'mc', text: template.text, options: [...template.options], correctIndex: template.correctIndex })
		}
		
		// Selección múltiple (varias correctas)
		const msTemplates = [
			{ text: `Selecciona todas las afirmaciones correctas sobre ${cleanTopic}:`, options: [
				{ text: `Es importante para el aprendizaje`, correct: true },
				{ text: `Se puede aplicar en la vida real`, correct: true },
				{ text: `No tiene ninguna utilidad práctica`, correct: false },
				{ text: `Solo sirve para aprobar exámenes`, correct: false },
			]},
			{ text: `¿Cuáles son características del estudio de ${cleanTopic}?`, options: [
				{ text: `Requiere práctica constante`, correct: true },
				{ text: `Se aprende de un día para otro`, correct: false },
				{ text: `Desarrolla habilidades de pensamiento`, correct: true },
				{ text: `Es completamente innecesario`, correct: false },
			]},
			{ text: `Marca las opciones que describen correctamente ${cleanTopic}:`, options: [
				{ text: `Tiene aplicación en diferentes contextos`, correct: true },
				{ text: `Es un tema aislado sin conexiones`, correct: false },
				{ text: `Contribuye a la formación integral`, correct: true },
				{ text: `Solo interesa a los expertos`, correct: false },
			]},
		]
		
		const shuffledMS = [...msTemplates].sort(() => Math.random() - 0.5)
		for (let i = 0; i < (counts.ms || 0); i++) {
			const template = shuffledMS[i % shuffledMS.length]
			res.push({ id: makeId('ms'), type: 'ms', text: template.text, options: [...template.options].sort(() => Math.random() - 0.5) })
		}
		
		// Preguntas de desarrollo
		for (let i = 0; i < (counts.des || 0); i++) {
			if (isMath) {
				const mathProblems = getMathProblemForTopic(topic, i + 1)
				res.push({ id: makeId('des'), type: 'des', prompt: mathProblems })
			} else {
				const desTemplates = [
					`Explica con tus propias palabras qué es ${cleanTopic} y por qué es importante estudiarlo. Incluye al menos dos ejemplos.`,
					`Describe cómo se relaciona ${cleanTopic} con situaciones de tu vida cotidiana. Fundamenta tu respuesta.`,
					`Analiza las principales características de ${cleanTopic} y explica cómo estas se aplican en la práctica.`,
					`¿Qué aprendiste sobre ${cleanTopic}? Menciona al menos tres aspectos importantes y explica cada uno.`,
					`Compara ${cleanTopic} con otros temas que hayas estudiado. ¿Qué similitudes y diferencias encuentras?`,
				]
				res.push({ id: makeId('des'), type: 'des', prompt: desTemplates[i % desTemplates.length] })
			}
		}
		return res
	}

	// Generador de problemas prácticos de matemáticas según el tema
	const getMathProblemForTopic = (topic: string, num: number): string => {
		const topicLower = topic.toLowerCase()
		
		// Sumas y restas
		if (/suma|resta|adici[oó]n|sustracci[oó]n/.test(topicLower)) {
			const problems = [
				`Problema ${num}: María tiene 45 manzanas. Le regala 18 a su vecino y luego compra 27 más en el mercado. ¿Cuántas manzanas tiene ahora? Muestra el procedimiento completo.`,
				`Problema ${num}: Un bus viaja con 38 pasajeros. En la primera parada bajan 12 y suben 9. En la segunda parada bajan 8 y suben 15. ¿Cuántos pasajeros hay al final? Desarrolla paso a paso.`,
				`Problema ${num}: Pedro ahorra $125 el lunes, $89 el martes y gasta $67 el miércoles. ¿Cuánto dinero tiene? Explica tu procedimiento.`,
				`Problema ${num}: En una biblioteca hay 234 libros de ciencia y 178 de historia. Si donan 95 libros más de literatura, ¿cuántos libros hay en total? Muestra todos los cálculos.`,
				`Problema ${num}: Ana tiene 156 stickers. Le regala 42 a su hermano y 38 a su amiga. Luego su mamá le compra 65 más. ¿Cuántos stickers tiene ahora?`,
			]
			return problems[num % problems.length]
		}
		
		// Multiplicación
		if (/multiplic|producto|veces/.test(topicLower)) {
			const problems = [
				`Problema ${num}: Una caja contiene 24 lápices. Si hay 15 cajas, ¿cuántos lápices hay en total? Muestra tu procedimiento.`,
				`Problema ${num}: Un teatro tiene 28 filas con 32 asientos cada una. ¿Cuál es la capacidad total del teatro? Desarrolla el cálculo.`,
				`Problema ${num}: Si un libro cuesta $45 y se compran 7 libros, ¿cuánto se paga en total? Explica paso a paso.`
			]
			return problems[num % problems.length]
		}
		
		// División
		if (/divisi[oó]n|dividir|cociente|reparto/.test(topicLower)) {
			const problems = [
				`Problema ${num}: Se tienen 156 chocolates para repartir entre 12 niños en partes iguales. ¿Cuántos chocolates recibe cada niño? ¿Sobran chocolates? Muestra el procedimiento.`,
				`Problema ${num}: Un granjero tiene 245 huevos y quiere ponerlos en cajas de 30. ¿Cuántas cajas puede llenar completamente? ¿Cuántos huevos quedan? Desarrolla.`,
				`Problema ${num}: Si un viaje de 728 km se divide en 4 días iguales, ¿cuántos km se recorren cada día? Explica tu cálculo.`
			]
			return problems[num % problems.length]
		}
		
		// Fracciones
		if (/fracci[oó]n|numerador|denominador|quebrado/.test(topicLower)) {
			const problems = [
				`Problema ${num}: Juan comió 2/5 de una pizza y María comió 1/4 de la misma pizza. ¿Qué fracción de la pizza comieron entre los dos? Muestra el procedimiento completo.`,
				`Problema ${num}: Una receta necesita 3/4 de taza de azúcar. Si quiero hacer la mitad de la receta, ¿cuánta azúcar necesito? Desarrolla paso a paso.`,
				`Problema ${num}: De un pastel, Ana come 1/3, Luis come 1/6 y queda el resto. ¿Qué fracción del pastel quedó? Explica.`
			]
			return problems[num % problems.length]
		}
		
		// Porcentajes
		if (/porcentaje|%|descuento|aumento/.test(topicLower)) {
			const problems = [
				`Problema ${num}: Una tienda ofrece 25% de descuento en un producto que cuesta $120. ¿Cuál es el precio final? Muestra todos los cálculos.`,
				`Problema ${num}: Si el precio de un artículo aumentó de $80 a $100, ¿cuál fue el porcentaje de aumento? Desarrolla el procedimiento.`,
				`Problema ${num}: En una clase de 40 estudiantes, el 35% son mujeres. ¿Cuántas mujeres hay en la clase? Explica paso a paso.`
			]
			return problems[num % problems.length]
		}
		
		// Ecuaciones
		if (/ecuaci[oó]n|inc[oó]gnita|variable|despej/.test(topicLower)) {
			const problems = [
				`Problema ${num}: Si el triple de un número más 7 es igual a 25, ¿cuál es el número? Plantea la ecuación y resuélvela paso a paso.`,
				`Problema ${num}: La edad de Pedro es el doble de la edad de Juan más 5 años. Si Pedro tiene 35 años, ¿cuántos años tiene Juan? Desarrolla.`,
				`Problema ${num}: Resuelve: 3x + 12 = 5x - 8. Muestra cada paso de la solución.`
			]
			return problems[num % problems.length]
		}
		
		// Geometría
		if (/geometr|[aá]rea|per[ií]metro|tri[aá]ngulo|rect[aá]ngulo|c[ií]rculo|cuadrado/.test(topicLower)) {
			const problems = [
				`Problema ${num}: Un terreno rectangular mide 45 metros de largo y 28 metros de ancho. Calcula su perímetro y su área. Muestra el procedimiento.`,
				`Problema ${num}: Un triángulo tiene base de 12 cm y altura de 8 cm. ¿Cuál es su área? Explica la fórmula utilizada.`,
				`Problema ${num}: Un círculo tiene radio de 7 cm. Calcula su circunferencia y su área (usa π = 3.14). Desarrolla paso a paso.`
			]
			return problems[num % problems.length]
		}
		
		// Genérico para otros temas de matemáticas
		const genericProblems = [
			`Problema ${num} - ${topic}: Plantea un problema práctico relacionado con el tema, identifica los datos, resuelve paso a paso y verifica tu respuesta.`,
			`Problema ${num} - ${topic}: Aplica los conceptos estudiados para resolver un ejercicio de la vida cotidiana. Muestra todo el procedimiento.`,
			`Problema ${num} - ${topic}: Desarrolla un ejemplo numérico que demuestre tu comprensión del tema. Explica cada paso.`
		]
		return genericProblems[num % genericProblems.length]
	}

	// Organizar preguntas: agrupar por tipo, orden aleatorio de grupos, desarrollo al final
	const organizeQuestions = (questions: any[]) => {
		// Separar por tipo
		const tfQuestions = questions.filter(q => q.type === 'tf')
		const mcQuestions = questions.filter(q => q.type === 'mc')
		const msQuestions = questions.filter(q => q.type === 'ms')
		const desQuestions = questions.filter(q => q.type === 'des')
		
		// Crear grupos (sin desarrollo)
		const groups = [
			{ type: 'tf', questions: tfQuestions },
			{ type: 'mc', questions: mcQuestions },
			{ type: 'ms', questions: msQuestions },
		].filter(g => g.questions.length > 0)
		
		// Ordenar grupos aleatoriamente
		for (let i = groups.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[groups[i], groups[j]] = [groups[j], groups[i]]
		}
		
		// Unir grupos y agregar desarrollo al final
		const organized = groups.flatMap(g => g.questions)
		organized.push(...desQuestions)
		
		console.log('📋 [Pruebas] Orden de grupos:', groups.map(g => g.type).join(' → ') + (desQuestions.length > 0 ? ' → des' : ''))
		
		return organized
	}

	// Crear prueba: guarda item en estado "generating" y dispara SSE; fallback a generador local.
	const handleCreate = () => {
		if (!user) { alert('Usuario no autenticado'); return }
		if (!builder?.courseId || !builder?.sectionId || !builder?.subjectId) { alert(translate('testsSelectAllBeforeCreate')); return }
		const now = Date.now()
		const title = (builder?.topic?.trim() || 'Prueba') as string
		// Resolver nombre de asignatura
		const subjName = (() => {
			try {
				const list = Array.isArray(subjects) ? subjects : JSON.parse(localStorage.getItem('smart-student-subjects') || '[]')
				let found = list.find((x: any) => String(x?.id) === String(builder?.subjectId))
				if (found?.name) return found.name
				found = list.find((x: any) => String(x?.name) === String(builder?.subjectId))
				return found?.name || (builder?.subjectName || String(builder?.subjectId))
			} catch { return builder?.subjectName || String(builder?.subjectId) }
		})()
		const item: TestItem = {
			id: `test_${now}`,
			title,
			description: '',
			createdAt: now,
			courseId: builder.courseId,
			sectionId: builder.sectionId,
			subjectId: builder.subjectId,
			subjectName: subjName,
			topic: builder.topic,
			counts: builder.counts,
			weights: builder.weights,
			totalPoints: builder.totalPoints,
			total: builder.total,
			questions: [],
			status: 'generating',
			progress: 0,
			ownerId: (user as any).id,
			ownerUsername: (user as any).username,
		}
		saveTests([item, ...tests])

		try {
			const id = item.id
			const countTF = Number(builder?.counts?.tf || 0)
			const countMC = Number(builder?.counts?.mc || 0)
			const countMS = Number(builder?.counts?.ms || 0)
			const countDES = Number(builder?.counts?.des || 0)
			const questionCount = Math.max(1, countTF + countMC + countMS)
			const bookTitle = subjName || 'General'
			const topic = String(builder?.topic || title)
			
			console.log('📤 [Pruebas] Sending to API:', {
				countTF, countMC, countMS, countDES,
				questionCount,
				topic,
				bookTitle
			})
			
			const params = new URLSearchParams({ 
				topic, 
				bookTitle, 
				language: language === 'en' ? 'en' : 'es', 
				questionCount: String(questionCount), 
				developmentCount: String(countDES),
				tfCount: String(countTF),
				mcCount: String(countMC),
				msCount: String(countMS),
				timeLimit: '120' 
			})
			const es = new EventSource(`/api/tests/generate/stream?${params.toString()}`)
			es.addEventListener('progress', (evt: MessageEvent) => {
				try { const data = JSON.parse((evt as any).data); const p = Math.min(100, Number(data?.percent ?? 0)); patchTest(id, { progress: p }) } catch {}
			})
			es.addEventListener('done', (evt: MessageEvent) => {
				try {
					const payload = JSON.parse((evt as any).data)
					const aiOut = payload?.data
					
					// Log de las preguntas recibidas
					const typeCounts = {
						tf: (aiOut?.questions || []).filter((q: any) => q.type === 'TRUE_FALSE').length,
						mc: (aiOut?.questions || []).filter((q: any) => q.type === 'MULTIPLE_CHOICE').length,
						ms: (aiOut?.questions || []).filter((q: any) => q.type === 'MULTIPLE_SELECTION').length,
						des: (aiOut?.questions || []).filter((q: any) => q.type === 'DEVELOPMENT').length,
					}
					console.log('📥 [Pruebas] Received from API:', {
						totalQuestions: aiOut?.questions?.length,
						byType: typeCounts
					})
					
					const mapped: any[] = (aiOut?.questions || []).map((q: any, idx: number) => {
						const makeId = (p: string) => `${p}_${now}_${idx}`
						if (q.type === 'TRUE_FALSE') return { id: makeId('tf'), type: 'tf', text: q.questionText || q.text || '', answer: !!q.correctAnswer }
						if (q.type === 'MULTIPLE_CHOICE') {
							const options: string[] = q.options || q.choices || []
							const correctIndex = typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0
							return { id: makeId('mc'), type: 'mc', text: q.questionText || q.text || '', options, correctIndex }
						}
						if (q.type === 'MULTIPLE_SELECTION') {
							const options: string[] = q.options || []
							const corrects: number[] = Array.isArray(q.correctAnswerIndices) ? q.correctAnswerIndices : []
							return { id: makeId('ms'), type: 'ms', text: q.questionText || q.text || '', options: options.map((t, i) => ({ text: String(t), correct: corrects.includes(i) })) }
						}
						if (q.type === 'DEVELOPMENT') {
							// Pregunta de desarrollo generada por IA
							return { 
								id: makeId('des'), 
								type: 'des', 
								prompt: q.questionText || q.text || '',
								rubric: q.rubric || '',
								expectedPoints: q.expectedPoints || []
							}
						}
						return { id: makeId('des'), type: 'des', prompt: q.questionText || q.text || '' }
					})
					
					const organizedQuestions = organizeQuestions(mapped)
					patchTest(id, { questions: organizedQuestions, status: 'ready', progress: 100 })
				} finally { es.close() }
			})
			es.addEventListener('error', () => {
				es.close()
				const fallback = generateLocalQuestions(builder?.topic || title, builder?.counts, subjName)
				const organizedFallback = organizeQuestions(fallback)
				patchTest(item.id, { questions: organizedFallback, status: 'ready', progress: 100 })
			})
		} catch (e) {
			console.error('[Pruebas] SSE error, usando generador local:', e)
			const fallback = generateLocalQuestions(builder?.topic || 'Tema', builder?.counts, builder?.subjectName)
			const organizedFallback = organizeQuestions(fallback)
			patchTest(item.id, { questions: organizedFallback, status: 'ready', progress: 100 })
		}
	}

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold flex items-center gap-2">
						<span className="inline-flex items-center justify-center rounded-md border border-fuchsia-200 bg-fuchsia-100 text-fuchsia-800 dark:border-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-200 p-1">
							<ClipboardCheck className="size-5" />
						</span>
						<span>{translate('testsPageTitle')}</span>
					</h1>
					<p className="text-sm text-muted-foreground">{translate('testsPageSub')}</p>
				</div>
			</div>

			<div className="space-y-4">
				<div className="border rounded-lg p-4">
					<div className="mb-3 text-sm font-medium">{translate('testsCreateTitle')}</div>
					<div className="mb-2 text-xs text-muted-foreground">{translate('testsCreateHint')}</div>
					<TestBuilder value={builder} onChange={setBuilder} onCreate={handleCreate} />
				</div>
			</div>

			<div className="border rounded-lg">
				<div className="px-4 py-3">
					<div className="text-sm font-medium">{translate('testsHistoryTitle')}</div>
				</div>
				<div className="divide-y">
					{tests.length === 0 ? (
						<div className="p-8 text-center text-muted-foreground">{translate('testsHistoryEmpty')}</div>
					) : (
							tests.map((t) => (
							<div key={t.id} className="p-4 flex items-center justify-between gap-4">
								<div className="min-w-0">
										<p className="font-medium truncate">{t.title}</p>
										{/* Curso (Curso + Sección) */}
										<p className="text-xs text-muted-foreground truncate">
											{(() => {
												const sec = sections.find((s:any) => String(s.id) === String(t.sectionId))
												const course = courses.find((c:any) => String(c.id) === String(t.courseId || sec?.courseId))
												const courseLabel = course?.name ? String(course.name) : ''
												const sectionLabel = sec?.name ? String(sec.name) : ''
												const label = [courseLabel, sectionLabel].filter(Boolean).join(' ')
												return label ? `Curso: ${label}` : ''
											})()}
										</p>
										{/* Asignatura */}
										<p className="text-xs text-muted-foreground truncate">
											{(() => {
												const subj = subjects.find((s:any) => String(s.id) === String(t.subjectId)) || subjects.find((s:any) => String(s.name) === String(t.subjectId))
												const name = subj?.name || t.subjectName || (t.subjectId ? String(t.subjectId) : '')
												return name ? `Asignatura: ${name}` : ''
											})()}
										</p>
										{/* Distribución de puntaje por tipo */}
										{(() => {
											const w = t.weights || { tf: 25, mc: 25, ms: 25, des: (t.counts?.des ?? 0) > 0 ? 25 : 0 }
											const parts = [
												`TF ${Number(w.tf ?? 0)}%`,
												`MC ${Number(w.mc ?? 0)}%`,
												`MS ${Number(w.ms ?? 0)}%`,
												`DES ${Number(w.des ?? 0)}%`,
											]
											return (
												<p className="text-xs text-muted-foreground truncate">{`Distribución: ${parts.join(' · ')}`}</p>
											)
										})()}

										{/* Totales */}
										<p className="text-xs text-muted-foreground truncate">
											{`Total de preguntas: ${t.questions?.length ?? ((t.counts?.tf||0)+(t.counts?.mc||0)+(t.counts?.ms||0)+(t.counts?.des||0))}`}
										</p>
										{typeof t.totalPoints === 'number' && (
											<p className="text-xs text-muted-foreground truncate">{`Puntaje total: ${t.totalPoints} pts`}</p>
										)}
								</div>
								<div className="flex items-center gap-2">
									{t.status === 'generating' ? (
										<div className="flex items-center gap-2 mr-1 min-w-[100px]">
											<div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded" aria-label={`${Math.min(100, t.progress || 0)}%`}>
												<div className="h-2 bg-fuchsia-600 rounded" style={{ width: `${Math.min(100, t.progress || 0)}%` }} />
											</div>
											<span className="text-xs text-muted-foreground w-8 text-right">{Math.min(100, t.progress || 0)}%</span>
										</div>
									) : (
										<span className="inline-flex items-center text-green-600 dark:text-green-400 mr-1" title={translate('testsReady')} aria-label={translate('testsReady')}>
											<CheckCircle className="size-4" />
										</span>
									)}

									<Button 
										variant="outline" 
										onClick={() => handleOpenView(t)} 
										disabled={t.status === 'generating'}
										className={`p-2 text-fuchsia-800 border-fuchsia-200 hover:bg-fuchsia-600 hover:text-white dark:border-fuchsia-800 ${t.status === 'generating' ? 'opacity-50 cursor-not-allowed' : ''}`} 
										aria-label={translate('testsBtnView')} 
										title={t.status === 'generating' ? 'Generando prueba...' : translate('testsBtnView')}
									>
										<Eye className="size-4" />
									</Button>
									<Button 
										variant="outline" 
										onClick={() => handleOpenReview(t)} 
										disabled={t.status === 'generating'}
										className={`p-2 text-fuchsia-800 border-fuchsia-200 hover:bg-fuchsia-600 hover:text-white dark:border-fuchsia-800 ${t.status === 'generating' ? 'opacity-50 cursor-not-allowed' : ''}`} 
										aria-label={translate('testsReviewBtn')} 
										title={t.status === 'generating' ? 'Generando prueba...' : translate('testsReviewBtn')}
									>
										<FileSearch className="size-4" />
									</Button>
									<Button variant="outline" onClick={() => { setDeleteTarget(t); setDeleteOpen(true) }} className="p-2 text-fuchsia-800 border-fuchsia-200 hover:bg-fuchsia-600 hover:text-white dark:border-fuchsia-800" aria-label={translate('testsBtnDelete')} title={translate('testsBtnDelete')}>
										<Trash2 className="size-4" />
									</Button>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			{/* Modales */}
			<TestViewDialog open={openView} onOpenChange={setOpenView} test={selectedTest} onReview={() => handleOpenReview()} />
			<TestReviewDialog open={openReview} onOpenChange={setOpenReview} test={selectedTest} />

			{/* Popup de confirmación de borrado */}
			<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{language === 'en' ? 'Delete test?' : '¿Eliminar prueba?'}</AlertDialogTitle>
						<AlertDialogDescription>
							{language === 'en' ? 'This action will remove the test, its review history and associated grades. You can’t undo this.' : 'Esta acción eliminará la prueba, su historial de revisión y las notas asociadas. No se puede deshacer.'}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							className="border-fuchsia-200 text-fuchsia-800 hover:bg-fuchsia-600 hover:text-white dark:border-fuchsia-800 focus-visible:ring-fuchsia-500"
						>
							{language === 'en' ? 'Cancel' : 'Cancelar'}
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white focus-visible:ring-fuchsia-500"
							onClick={() => {
							if (!deleteTarget) return
							// Ejecutar borrado definitivo
							saveTests(tests.filter(x => x.id !== deleteTarget.id))
							try {
								const rkey = getReviewKey(deleteTarget.id)
								localStorage.setItem(rkey, '[]')
								window.dispatchEvent(new StorageEvent('storage', { key: rkey, newValue: '[]' }))
							} catch {}
							try {
								const { LocalStorageManager } = require('@/lib/education-utils')
								const saved = Number(localStorage.getItem('admin-selected-year') || '')
								const year = Number.isFinite(saved) && saved > 0 ? saved : new Date().getFullYear()
								const key = LocalStorageManager.keyForTestGrades(year)
								const raw = localStorage.getItem(key) || localStorage.getItem('smart-student-test-grades')
								if (raw) {
									const arr = JSON.parse(raw)
									const filtered = Array.isArray(arr) ? arr.filter((g: any) => g?.testId !== deleteTarget.id) : []
									LocalStorageManager.setTestGradesForYear(year, filtered, { preferSession: true })
									window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(filtered) }))
								}
							} catch {}
							setDeleteOpen(false)
							setDeleteTarget(null)
						}}>
							{language === 'en' ? 'Delete' : 'Eliminar'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}


