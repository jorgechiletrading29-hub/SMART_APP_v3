
"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image'; 
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Network, Sparkles, Download, Newspaper as SummaryIcon, FileQuestion, ClipboardList, BookOpen, Loader2, RefreshCw } from 'lucide-react'; 
import { BookCourseSelector } from '@/components/common/book-course-selector';
import { createMindMapAction } from '@/actions/mind-map-actions';
import { useToast } from "@/hooks/use-toast";
import { useAIProgress } from "@/hooks/use-ai-progress";
import { cn } from '@/lib/utils';
import { contentDB } from '@/lib/sql-content';
import { useAuth } from '@/contexts/auth-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { analyzeSubjectTopics } from '@/ai/flows/analyze-subject-topics';
import { TopicDescription } from '@/lib/topic-descriptions';

export default function MapaMentalPage() {
  const { translate, language: currentUiLanguage } = useLanguage();
  const { toast } = useToast();
  const { progress, progressText, isLoading, startProgress, stopProgress } = useAIProgress();
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [centralTheme, setCentralTheme] = useState('');
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [mindMapResult, setMindMapResult] = useState<string | null>(null);
  const [currentCentralThemeForDisplay, setCurrentCentralThemeForDisplay] = useState('');
  
  // Estados para análisis automático de temas (igual que en resumen)
  const [subjectTopics, setSubjectTopics] = useState<string[]>([]);
  const [selectedSubjectTopic, setSelectedSubjectTopic] = useState<string>('');
  const [isAnalyzingSubject, setIsAnalyzingSubject] = useState(false);
  const [subjectBookTitle, setSubjectBookTitle] = useState<string>('');
  const [topicDescriptions, setTopicDescriptions] = useState<Record<string, TopicDescription>>({});
  
  // Ref para evitar llamadas duplicadas
  const hasAnalyzedRef = useRef<string>('');

  // Detectar el tipo de asignatura para mostrar icono apropiado
  const subjectIcon = useMemo(() => {
    const s = `${selectedBook || ''} ${selectedSubject || ''}`.toLowerCase();
    if (/matem|math|algebra|geometr/i.test(s)) return '🔢';
    if (/lenguaje|comunicacion|language|literatura/i.test(s)) return '📚';
    if (/ciencia|natural|science|biolog/i.test(s)) return '🔬';
    if (/historia|geography|social|civica/i.test(s)) return '🌍';
    return '📖';
  }, [selectedBook, selectedSubject]);

  // Limpiar el mapa cuando cambia el curso o la asignatura
  useEffect(() => {
    setMindMapResult(null);
    setCurrentCentralThemeForDisplay('');
    setCentralTheme('');
  }, [selectedCourse, selectedSubject]);

  // Analizar automáticamente los temas cuando se selecciona cualquier asignatura
  useEffect(() => {
    const analyzeKey = `${selectedCourse}_${selectedSubject}`;
    
    if (selectedCourse && selectedSubject && hasAnalyzedRef.current !== analyzeKey) {
      hasAnalyzedRef.current = analyzeKey;
      setIsAnalyzingSubject(true);
      setSubjectTopics([]);
      setSelectedSubjectTopic('');
      setSubjectBookTitle('');
      
      console.log('[MapaMental] Starting subject analysis for:', selectedCourse, selectedSubject);
      
      analyzeSubjectTopics({
        courseName: selectedCourse,
        subjectName: selectedSubject,
        language: currentUiLanguage,
      }).then((res) => {
        console.log('[MapaMental] Subject analysis result:', res);
        if (res.topics && res.topics.length > 0) {
          setSubjectTopics(res.topics);
          setSubjectBookTitle(res.bookTitle || '');
          // Guardar las descripciones de temas si existen
          if (res.topicDescriptions) {
            setTopicDescriptions(res.topicDescriptions);
          } else {
            setTopicDescriptions({});
          }
          toast({
            title: translate('quizPdfAnalyzeDone') || 'Análisis completado',
            description: `${translate('quizPdfTopicsFound') || 'Temas detectados'}: ${res.topics.length}`,
            variant: 'default',
          });
        }
      }).catch((e) => {
        console.error('[MapaMental] Error analizando asignatura:', e);
      }).finally(() => {
        setIsAnalyzingSubject(false);
      });
    } else if (!selectedSubject) {
      // Limpiar cuando no hay asignatura
      setSubjectTopics([]);
      setSelectedSubjectTopic('');
      setSubjectBookTitle('');
      setTopicDescriptions({});
    }
  }, [selectedCourse, selectedSubject, currentUiLanguage, toast, translate]);

  // Cuando se selecciona un tema de la asignatura, actualizar el campo de tema central
  const handleSubjectTopicSelect = useCallback((value: string) => {
    setSelectedSubjectTopic(value);
    if (value) setCentralTheme(value);
  }, []);

  // Función para resetear todos los filtros a su estado inicial
  const resetFilters = useCallback(() => {
    setSelectedCourse('');
    setSelectedBook('');
    setSelectedSubject('');
    setCentralTheme('');
    setSelectedSubjectTopic('');
    setSubjectTopics([]);
    setSubjectBookTitle('');
    setTopicDescriptions({});
    setIsHorizontal(false);
    hasAnalyzedRef.current = '';
    setMindMapResult(null);
  }, []);


  const handleGenerateMap = async () => {
     if (!selectedBook && !selectedSubject) {
      toast({ title: translate('errorGenerating'), description: translate('noBookSelected'), variant: 'destructive'});
      return;
    }
    if (!centralTheme.trim()) {
      toast({ title: translate('errorGenerating'), description: translate('noTopicProvided'), variant: 'destructive'});
      return;
    }

    setMindMapResult(null);
    setCurrentCentralThemeForDisplay(centralTheme.trim());
    
    // Start progress simulation
    const progressInterval = startProgress('mindmap', 10000);
    
    // Obtener la descripción del tema si existe
    const themeDesc = selectedSubjectTopic && topicDescriptions[selectedSubjectTopic] 
      ? topicDescriptions[selectedSubjectTopic].description 
      : undefined;
    
    try {
      // Intentar Server Action primero
      try {
        const result = await createMindMapAction({
          centralTheme: centralTheme.trim(),
          themeDescription: themeDesc, // Pasar la descripción del tema para orientación
          bookTitle: selectedBook || selectedSubject,
          courseName: selectedCourse, // Pasar el curso para contenido apropiado a la edad
          language: currentUiLanguage,
          isHorizontal: isHorizontal,
        });
        setMindMapResult(result.imageDataUri);
        try {
          await contentDB.saveMindMap({
            id: crypto.randomUUID(),
            userId: (user as any)?.id || null,
            username: user?.username || null,
            courseId: selectedCourse || null,
            sectionId: null,
            subjectName: selectedBook || selectedSubject || null,
            centralTheme: centralTheme.trim(),
            imageDataUri: result.imageDataUri,
            language: currentUiLanguage,
            createdAt: new Date().toISOString()
          });
        } catch (e) { console.warn('[MapaMental] No se pudo persistir en BD', e); }
      } catch (err: any) {
        const msg = String(err?.message || err || '');
        const looksLikeInvalidServerActions = msg.includes('Invalid Server Actions request');
        if (!looksLikeInvalidServerActions) throw err;

        // Fallback a API cuando Server Actions no es válido (p.ej., origen no permitido)
        const resp = await fetch('/api/create-mindmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            centralTheme: centralTheme.trim(),
            themeDescription: themeDesc, // Pasar la descripción del tema
            bookTitle: selectedBook || selectedSubject,
            courseName: selectedCourse, // Pasar el curso
            language: currentUiLanguage,
            isHorizontal: isHorizontal,
          })
        });
        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          throw new Error(data.error || `HTTP ${resp.status}`);
        }
        const data = await resp.json();
        if (!data?.imageDataUri) throw new Error('Respuesta inválida del generador de mapas');
        setMindMapResult(data.imageDataUri);
        try {
          await contentDB.saveMindMap({
            id: crypto.randomUUID(),
            userId: (user as any)?.id || null,
            username: user?.username || null,
            courseId: selectedCourse || null,
            sectionId: null,
            subjectName: selectedBook || selectedSubject || null,
            centralTheme: centralTheme.trim(),
            imageDataUri: data.imageDataUri,
            language: currentUiLanguage,
            createdAt: new Date().toISOString()
          });
        } catch (e) { console.warn('[MapaMental] No se pudo persistir en BD', e); }
      }
      
      // Show success notification
      toast({ 
        title: translate('mapGeneratedTitle'), 
        description: translate('mapGeneratedDesc'),
        variant: 'default'
      });
      
      // Increment maps count
  const currentCount = parseInt(localStorage.getItem('mapsCreatedCount') || '0', 10);
  localStorage.setItem('mapsCreatedCount', (currentCount + 1).toString());
  try { window.dispatchEvent(new Event('localStorageUpdate')); } catch {}
  try { window.dispatchEvent(new Event('toolCountersUpdated')); } catch {}
  } catch (error) {
      console.error("Error generating mind map:", error);
      toast({ title: translate('errorGenerating'), description: (error as Error).message, variant: 'destructive'});
      setMindMapResult(null);
    } finally {
      stopProgress(progressInterval);
    }
  };

  const handleDownloadPdf = () => {
    if (!mindMapResult) return;

    const title = `${translate('mindMapResultTitle').toUpperCase()} - ${currentCentralThemeForDisplay.toUpperCase()}`;
    
    const contentHtml = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
            body { font-family: 'Space Grotesk', sans-serif; margin: 20px; text-align: center; }
            img { max-width: 100%; height: auto; border: 1px solid #eee; }
            h1 { font-size: 1.5em; margin-bottom: 1em; font-family: 'Space Grotesk', sans-serif; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <img src="${mindMapResult}" alt="${title}" />
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(contentHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
          printWindow.print();
      }, 500); 
    } else {
       toast({
        title: translate('errorGenerating'),
        description: translate('mapDownloadErrorPopupBlocked', {defaultValue: "Could not open print window. Please check your pop-up blocker settings."}),
        variant: 'destructive',
      });
    }
  };


  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="items-center">
          <Network className="w-10 h-10 text-yellow-500 dark:text-yellow-400 mb-3" />
          <CardTitle className="text-3xl font-bold font-headline">{translate('mapPageTitle')}</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground max-w-2xl">
            {translate('mapPageSub')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <BookCourseSelector
            selectedCourse={selectedCourse}
            selectedBook={selectedBook}
            selectedSubject={selectedSubject}
            onCourseChange={(course) => {
              // Cuando cambia el curso, resetear también la asignatura y tema
              setSelectedCourse(course);
              setSelectedSubject('');
              setSelectedBook('');
              setCentralTheme('');
              setSelectedSubjectTopic('');
              setSubjectTopics([]);
              setSubjectBookTitle('');
              hasAnalyzedRef.current = '';
              setMindMapResult(null);
            }}
            onBookChange={(book) => {
              setSelectedBook(book);
            }}
            onSubjectChange={(subject) => {
              // Cuando cambia la asignatura, resetear el tema
              setSelectedSubject(subject);
              setCentralTheme('');
              setSelectedSubjectTopic('');
              setMindMapResult(null);
            }}
            showSubjectSelector={true}
            showBookSelector={false}
            accentColor="yellow"
          />

          {/* Sección automática de temas de cualquier asignatura desde la biblioteca */}
          {selectedSubject && (
            <div className="space-y-3 p-4 border border-yellow-500/30 rounded-lg bg-yellow-500/5">
              <div className="space-y-1">
                <Label className="text-left block font-semibold text-yellow-600 dark:text-yellow-400">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  {subjectIcon} {translate('mapSubjectTopicsTitle') || `Temas de ${selectedSubject}`}
                </Label>
                {subjectBookTitle && (
                  <p className="text-left text-xs text-muted-foreground">
                    📚 {subjectBookTitle}
                  </p>
                )}
              </div>

              {isAnalyzingSubject ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {translate('mapAnalyzingSubject') || 'Analizando temas de la asignatura...'}
                </div>
              ) : subjectTopics.length > 0 ? (
                <div className="space-y-2">
                  <Label className="text-left block text-sm">
                    {translate('mapSelectTopic') || 'Selecciona un tema para crear el mapa mental:'}
                  </Label>
                  <Select value={selectedSubjectTopic} onValueChange={handleSubjectTopicSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder={translate('mapChooseTopic') || 'Elige un tema…'} />
                    </SelectTrigger>
                    <SelectContent className="select-accent-yellow">
                      {subjectTopics.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Mostrar descripción del tema seleccionado */}
                  {selectedSubjectTopic && topicDescriptions[selectedSubjectTopic] && (
                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-500">📖</span>
                        <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 text-sm">
                          Descripción:
                        </h4>
                      </div>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        {topicDescriptions[selectedSubjectTopic].description}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-left text-xs text-muted-foreground">
                    💡 {translate('mapTopicHint') || 'El mapa mental mostrará los conceptos principales y sus relaciones.'}
                  </p>
                </div>
              ) : (
                <p className="text-left text-xs text-muted-foreground">
                  {translate('mapNoTopics') || 'Selecciona un curso y asignatura para ver los temas disponibles.'}
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="central-theme-input" className="text-left block">{translate('mapCentralThemePlaceholder')}</Label>
            <Textarea
              id="central-theme-input"
              rows={2}
              value={centralTheme}
              onChange={(e) => setCentralTheme(e.target.value)}
              placeholder={!selectedCourse ? (translate('mapSelectCourseFirst') || 'Primero selecciona un curso...') : !selectedSubject ? (translate('mapSelectSubjectFirst') || 'Primero selecciona una asignatura...') : translate('mapCentralThemePlaceholder')}
              className="text-base md:text-sm"
              disabled={!selectedCourse || !selectedSubject}
            />
          </div>
          <div className="flex items-center space-x-2 justify-start"> 
            <Checkbox
              id="horizontal-orientation"
              checked={isHorizontal}
              onCheckedChange={(checked) => setIsHorizontal(Boolean(checked))}
              disabled={!selectedCourse || !selectedSubject}
            />
            <Label htmlFor="horizontal-orientation" className={cn("text-sm font-medium", (!selectedCourse || !selectedSubject) && "text-muted-foreground")}>
              {translate('mapHorizontalOrientation')}
            </Label>
          </div>
          <Button
            onClick={handleGenerateMap}
            disabled={isLoading || !selectedCourse || !selectedSubject || !centralTheme.trim()}
            className={cn(
              "w-full font-semibold py-3 text-base md:text-sm home-card-button-yellow",
              "hover:brightness-110 hover:shadow-lg transition-all duration-200"
            )}
          >
            {isLoading ? (
              <>{translate('loading')} {progress}%</>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                {translate('mapGenerateBtn')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {mindMapResult && !isLoading && (
        <Card className="w-full max-w-3xl text-left shadow-md">
           <CardHeader>
            <CardTitle className="font-headline text-center mind-map-title">
              {translate('mindMapResultTitle').toUpperCase()} - {currentCentralThemeForDisplay.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <img 
                src={mindMapResult} 
                alt={translate('mindMapResultTitle')} 
                className="w-full h-auto rounded-md border object-contain"
              />
            </div>
            
            {/* Botón para crear nuevo mapa mental */}
            <div className="mt-6 mb-4">
              <Button
                onClick={resetFilters}
                variant="outline"
                className="w-full font-semibold py-2 px-6 rounded-lg transition-colors border-yellow-500 text-yellow-600 hover:bg-yellow-500/10 text-xs sm:text-sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> {translate('mapNewMap') || 'Generar Nuevo Mapa Mental'}
              </Button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Button
                onClick={handleDownloadPdf}
                className="font-semibold py-2 px-6 rounded-lg transition-colors home-card-button-yellow text-xs sm:text-sm"
              >
                <Download className="mr-2 h-4 w-4" /> {translate('mapActionDownloadPdf', {defaultValue: "Download PDF"})}
              </Button>
              <Button asChild className="font-semibold py-2 px-6 rounded-lg transition-colors home-card-button-blue text-xs sm:text-sm">
                <Link href="/dashboard/resumen">
                  <SummaryIcon className="mr-2 h-4 w-4" /> {translate('mapActionCreateSummary', {defaultValue: "Create Summary"})}
                </Link>
              </Button>
              <Button asChild className="font-semibold py-2 px-6 rounded-lg transition-colors home-card-button-cyan text-xs sm:text-sm">
                <Link href="/dashboard/cuestionario">
                  <FileQuestion className="mr-2 h-4 w-4" /> {translate('mapActionCreateQuiz', {defaultValue: "Create Quiz"})}
                </Link>
              </Button>
              <Button asChild className="font-semibold py-2 px-6 rounded-lg transition-colors home-card-button-purple text-xs sm:text-sm">
                <Link href="/dashboard/evaluacion">
                  <ClipboardList className="mr-2 h-4 w-4" /> {translate('mapActionCreateEval', {defaultValue: "Create Evaluation"})}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
