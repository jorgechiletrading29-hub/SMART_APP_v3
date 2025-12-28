
"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper, Download, Network, FileQuestion, ClipboardList, BookOpen, Loader2, RefreshCw } from 'lucide-react';
import { BookCourseSelector } from '@/components/common/book-course-selector';
import { useToast } from "@/hooks/use-toast";
import { useAIProgress } from "@/hooks/use-ai-progress";
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { contentDB } from '@/lib/sql-content';
import { useAuth } from '@/contexts/auth-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { analyzeSubjectTopics } from '@/ai/flows/analyze-subject-topics';
import { TopicDescription } from '@/lib/topic-descriptions';

// Types for API response
interface GenerateSummaryResponse {
  summary: string;
  keyPoints?: string[];
  progress: string;
}

// Helper function to convert basic Markdown to HTML for the main summary
function simpleMarkdownToHtml(mdText: string): string {
  if (!mdText) return '';

  let html = mdText;

  // Normalize line endings
  html = html.replace(/\r\n?/g, '\n');

  // Headings (##, ###) - Add proper spacing
  html = html.replace(/^### +(.*?) *(\n|$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>\n');
  html = html.replace(/^## +(.*?) *(\n|$)/gm, '<h2 class="text-xl font-bold mt-8 mb-4">$1</h2>\n');
  html = html.replace(/^# +(.*?) *(\n|$)/gm, '<h1 class="text-2xl font-bold mt-10 mb-6">$1</h1>\n');

  // Bold (**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italics (*)
  html = html.replace(/(?<!\*)\*(?!\s)(.*?[^\s\*])\*(?!\*)/g, '<em>$1</em>');


  // Paragraphs from blocks separated by one or more blank lines
  // Blocks that are already Hx tags are preserved.
  // Single newlines within a paragraph block are converted to <br />.
  html = html
    .split(/\n\s*\n/) // Split by one or more blank lines
    .map((block) => {
      const trimmedBlock = block.trim();
      if (trimmedBlock === '') {
        return ''; // Skip empty blocks
      }
      // If it's already an Hx tag (from our conversion above)
      if (trimmedBlock.match(/^<(h[1-6])[^>]*>.*?<\/\1>/i)) {
        return trimmedBlock; 
      }
      // Otherwise, wrap in <p> and convert internal single newlines to <br>
      return `<p class="mb-4">${trimmedBlock.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');

  return html;
}

// Helper function for inline Markdown formatting (e.g., for key points)
function formatInlineMarkdown(text: string): string {
  if (!text) return '';
  let html = text;
  // Normalize line endings (though less critical for single lines)
  html = html.replace(/\r\n?/g, '\n');
  // Bold (**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italics (*) - careful not to match bold's asterisks
  html = html.replace(/(?<!\*)\*(?!\s)(.*?[^\s\*])\*(?!\*)/g, '<em>$1</em>');
  // Convert any literal newlines within a key point to <br /> (AI should ideally provide single lines for points)
  html = html.replace(/\n/g, '<br />');
  return html;
}


export default function ResumenPage() {
  const { translate, language: currentUiLanguage } = useLanguage();
  const { toast } = useToast();
  const { progress, progressText, isLoading, startProgress, stopProgress } = useAIProgress();
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [includeKeyPoints, setIncludeKeyPoints] = useState(false);
  const [summaryResult, setSummaryResult] = useState<{ summary: string; keyPoints?: string[] } | null>(null);
  const [keyPointsRequested, setKeyPointsRequested] = useState(false);
  const [currentTopicForDisplay, setCurrentTopicForDisplay] = useState('');
  
  // Estados para análisis automático de temas de cualquier asignatura
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

  // Limpiar el resumen cuando cambia el curso o la asignatura
  useEffect(() => {
    // Limpiar el resumen anterior cuando cambia el curso o asignatura
    setSummaryResult(null);
    setCurrentTopicForDisplay('');
    setTopic('');
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
      
      console.log('[Resumen] Starting subject analysis for:', selectedCourse, selectedSubject);
      
      analyzeSubjectTopics({
        courseName: selectedCourse,
        subjectName: selectedSubject,
        language: currentUiLanguage,
      }).then((res) => {
        console.log('[Resumen] Subject analysis result:', res);
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
        console.error('[Resumen] Error analizando asignatura:', e);
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

  // Cuando se selecciona un tema de la asignatura, actualizar el campo de tema
  const handleSubjectTopicSelect = useCallback((value: string) => {
    setSelectedSubjectTopic(value);
    if (value) setTopic(value);
  }, []);

  // Función para resetear todos los filtros a su estado inicial
  const resetFilters = useCallback(() => {
    setSelectedCourse('');
    setSelectedBook('');
    setSelectedSubject('');
    setTopic('');
    setSelectedSubjectTopic('');
    setSubjectTopics([]);
    setSubjectBookTitle('');
    setTopicDescriptions({});
    setIncludeKeyPoints(false);
    hasAnalyzedRef.current = '';
  }, []);

  const handleGenerateSummary = async () => {
    // IMPORTANTE: Limpiar el resumen anterior antes de generar uno nuevo
    setSummaryResult(null);
    
    if (!selectedSubject) {
      toast({ 
        title: translate('errorGenerating'), 
        description: translate('noSubjectSelected'), 
        variant: 'destructive'
      });
      return;
    }
    if (!topic.trim()) {
      toast({ 
        title: translate('errorGenerating'), 
        description: translate('noTopicProvided'), 
        variant: 'destructive'
      });
      return;
    }

    setSummaryResult(null);
    setKeyPointsRequested(includeKeyPoints); 
    const topicForSummary = topic.trim() || "General Summary";
    setCurrentTopicForDisplay(topicForSummary); 

    // Start progress simulation with a longer duration to better match API response time
    const progressInterval = startProgress('summary', 15000);

    try {
      // Obtener la descripción del tema si existe
      const topicDesc = selectedSubjectTopic && topicDescriptions[selectedSubjectTopic] 
        ? topicDescriptions[selectedSubjectTopic].description 
        : undefined;
      
      const requestBody = {
        bookTitle: selectedSubject,
        topic: topicForSummary,
        topicDescription: topicDesc, // Pasar la descripción del tema para orientación
        includeKeyPoints: includeKeyPoints,
        language: currentUiLanguage,
        course: selectedCourse, // Include course for age-appropriate content
      };
      
      console.log('Sending request to API:', requestBody);
      
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result: GenerateSummaryResponse = await response.json();
      
      if (result && result.summary) {
        setSummaryResult({
          summary: result.summary, 
          keyPoints: result.keyPoints
        });

        // Persistir en BD (Supabase/IDB)
        try {
          await contentDB.saveSummary({
            id: crypto.randomUUID(),
            userId: (user as any)?.id || null,
            username: user?.username || null,
            courseId: selectedCourse || null,
            sectionId: null,
            subjectName: selectedBook || selectedSubject || null,
            topic: topicForSummary,
            content: result.summary,
            keyPoints: result.keyPoints || null,
            language: currentUiLanguage,
            createdAt: new Date().toISOString()
          });
        } catch (e) {
          console.warn('[Resumen] No se pudo persistir en BD, se continuará con contador LS.', e);
        }
        
        // Show success notification
        toast({ 
          title: translate('summaryGeneratedTitle'), 
          description: translate('summaryGeneratedDesc'),
          variant: 'default'
        });
        
        // Increment summaries count
        const currentCount = parseInt(localStorage.getItem('summariesCreatedCount') || '0', 10);
        try {
          localStorage.setItem('summariesCreatedCount', (currentCount + 1).toString());
          try { window.dispatchEvent(new Event('localStorageUpdate')); } catch {}
          try { window.dispatchEvent(new Event('toolCountersUpdated')); } catch {}
        } catch (e: any) {
          if (e?.name === 'QuotaExceededError' || e?.message?.includes('quota')) {
            // Limpiar algunas claves grandes e intentar nuevamente
            const keysToRemove = [
              'smart-student-tasks',
              'smart-student-task-comments',
              'smart-student-evaluations',
              'smart-student-evaluation-results',
              'smart-student-users',
              'smart-student-courses',
              'smart-student-sections',
              'smart-student-student-assignments'
            ];
            keysToRemove.forEach(key => localStorage.removeItem(key));
            try {
              localStorage.setItem('summariesCreatedCount', (currentCount + 1).toString());
              try { window.dispatchEvent(new Event('localStorageUpdate')); } catch {}
              try { window.dispatchEvent(new Event('toolCountersUpdated')); } catch {}
            } catch (err) {
              toast({ title: translate('errorGenerating'), description: 'No se pudo guardar el contador de resúmenes. Libera espacio en tu navegador.', variant: 'destructive'});
            }
          } else {
            throw e;
          }
        }
      } else {
        throw new Error('No summary content received');
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({ 
        title: translate('errorGenerating'), 
        description: errorMessage, 
        variant: 'destructive'
      });
    } finally {
      stopProgress(progressInterval);
    }
  };

  const handleDownloadPdf = () => {
    if (!summaryResult?.summary) return;

    const title = `${translate('summaryTitlePrefix')} - ${currentTopicForDisplay.toUpperCase()}`;
    // Use the same Markdown to HTML conversion for PDF content
    const summaryHtmlForPdf = simpleMarkdownToHtml(summaryResult.summary);

    let contentHtml = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
            body { 
              font-family: 'Space Grotesk', Arial, sans-serif; 
              margin: 40px 50px; 
              line-height: 1.7; 
              text-align: justify; 
              color: #1a1a1a;
              font-size: 12pt;
            }
            h1, h2, h3 { font-family: 'Space Grotesk', Arial, sans-serif; color: #2c3e50; }
            h1 { 
              text-align: center; 
              font-size: 20pt; 
              margin-bottom: 30px; 
              font-weight: 700; 
              border-bottom: 3px solid #3498db;
              padding-bottom: 15px;
            }
            h2 { 
              font-size: 14pt; 
              margin-top: 25px; 
              margin-bottom: 12px; 
              font-weight: 600; 
              border-bottom: 1px solid #bdc3c7; 
              padding-bottom: 8px; 
            }
            h3 { 
              font-size: 12pt; 
              margin-top: 18px; 
              margin-bottom: 8px; 
              font-weight: 500; 
            }
            p { margin-bottom: 12px; text-indent: 0; }
            strong { font-weight: 600; }
            em { font-style: italic; }
            ul { list-style-type: disc; padding-left: 25px; margin-bottom: 15px; }
            ol { padding-left: 25px; margin-bottom: 15px; }
            li { margin-bottom: 6px; line-height: 1.5; }
            .mb-4 { margin-bottom: 12px; }
            @media print {
              body { margin: 20px 30px; }
              h1 { font-size: 18pt; }
              h2 { font-size: 13pt; }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div>${summaryHtmlForPdf}</div>
    `;

    if (keyPointsRequested && summaryResult.keyPoints && summaryResult.keyPoints.length > 0) {
      contentHtml += `<h2>${translate('summaryKeyPointsTitle')}</h2><ul>`;
      summaryResult.keyPoints.forEach(point => {
        // Use formatInlineMarkdown for key points in PDF too
        contentHtml += `<li>${formatInlineMarkdown(point)}</li>`;
      });
      contentHtml += `</ul>`;
    }

    contentHtml += `
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
        description: translate('pdfDownloadErrorPopupBlocked'),
        variant: 'destructive',
      });
    }
  };

  const formattedSummaryHtml = summaryResult?.summary ? simpleMarkdownToHtml(summaryResult.summary) : '';

  return (
    <div className="flex flex-col items-center text-center">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="items-center">
          <Newspaper className="w-10 h-10 text-blue-500 dark:text-blue-400 mb-3" />
          <CardTitle className="text-3xl font-bold font-headline text-center">
            {translate('summaryPageTitleLine1')}
            <br />
            {translate('summaryPageTitleLine2')}
          </CardTitle>
          <CardDescription className="mt-2 text-muted-foreground max-w-2xl text-center">
            {translate('summaryPageSub')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <BookCourseSelector
            selectedCourse={selectedCourse}
            selectedBook={selectedBook}
            selectedSubject={selectedSubject}
            showSubjectSelector={true}
            showBookSelector={false}
            accentColor="blue"
            onCourseChange={(course) => {
              // Cuando cambia el curso, resetear también la asignatura y tema
              setSelectedCourse(course);
              setSelectedSubject('');
              setSelectedBook('');
              setTopic('');
              setSelectedSubjectTopic('');
              setSubjectTopics([]);
              setSubjectBookTitle('');
              hasAnalyzedRef.current = '';
              setSummaryResult(null);
            }}
            onBookChange={(book) => {
              setSelectedBook(book);
            }}
            onSubjectChange={(subject) => {
              // Cuando cambia la asignatura, resetear el tema
              setSelectedSubject(subject);
              setTopic('');
              setSelectedSubjectTopic('');
              setSummaryResult(null);
            }}
          />

          {/* Sección automática de temas de cualquier asignatura desde la biblioteca */}
          {selectedSubject && (
            <div className="space-y-3 p-4 border border-blue-500/30 rounded-lg bg-blue-500/5">
              <div className="space-y-1">
                <Label className="text-left block font-semibold text-blue-600 dark:text-blue-400">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  {subjectIcon} {translate('summarySubjectTopicsTitle') || `Temas de ${selectedSubject}`}
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
                  {translate('summaryAnalyzingSubject') || 'Analizando temas de la asignatura...'}
                </div>
              ) : subjectTopics.length > 0 ? (
                <div className="space-y-2">
                  <Label className="text-left block text-sm">
                    {translate('summarySelectTopic') || 'Selecciona un tema para generar el resumen:'}
                  </Label>
                  <Select value={selectedSubjectTopic} onValueChange={handleSubjectTopicSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder={translate('summaryChooseTopic') || 'Elige un tema…'} />
                    </SelectTrigger>
                    <SelectContent className="select-accent-blue">
                      {subjectTopics.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Mostrar descripción del tema seleccionado */}
                  {selectedSubjectTopic && topicDescriptions[selectedSubjectTopic] && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-500">📖</span>
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
                          Descripción:
                        </h4>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {topicDescriptions[selectedSubjectTopic].description}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-left text-xs text-muted-foreground">
                    💡 {translate('summaryTopicHint') || 'El resumen incluirá definiciones, ejemplos y ejercicios.'}
                  </p>
                </div>
              ) : (
                <p className="text-left text-xs text-muted-foreground">
                  {translate('summaryNoTopics') || 'Selecciona un curso y asignatura para ver los temas disponibles.'}
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="summary-topic-input" className="text-left block">{translate('summaryTopicPlaceholder')}</Label>
            <Textarea
              id="summary-topic-input"
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={!selectedCourse ? (translate('summarySelectCourseFirst') || 'Primero selecciona un curso...') : !selectedSubject ? (translate('summarySelectSubjectFirst') || 'Primero selecciona una asignatura...') : translate('summaryTopicPlaceholder')}
              className="text-base md:text-sm"
              disabled={!selectedCourse || !selectedSubject}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-key-points"
              checked={includeKeyPoints}
              onCheckedChange={(checked) => setIncludeKeyPoints(Boolean(checked))}
              disabled={!selectedCourse || !selectedSubject}
            />
            <Label htmlFor="include-key-points" className={cn("text-sm font-medium", (!selectedCourse || !selectedSubject) && "text-muted-foreground")}>
              {translate('summaryIncludeKeyPointsShort')}
            </Label>
          </div>
          <Button
            onClick={handleGenerateSummary}
            disabled={isLoading || !selectedCourse || !selectedSubject || !topic.trim()}
            className={cn(
              "w-full font-semibold py-3 text-base md:text-sm home-card-button-blue",
              "hover:brightness-110 hover:shadow-lg hover:scale-105 transition-all duration-200"
            )}
          >
            {isLoading ? (
              progress >= 100 ? 
                <>{translate('loading')} Finalizando...</> :
                <>{translate('loading')} {progress}%</>
            ) : (
              <>{translate('summaryGenerateBtn')}</>
            )}
          </Button>
        </CardContent>
      </Card>

      {summaryResult && !isLoading && (
        <Card className="mt-6 w-full max-w-lg text-left shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-center">
              {translate('summaryTitlePrefix').toUpperCase()} - {currentTopicForDisplay.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              dangerouslySetInnerHTML={{ __html: formattedSummaryHtml }} 
              className="prose dark:prose-invert max-w-none text-sm leading-relaxed font-headline text-justify" 
            />
            {keyPointsRequested && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 font-headline text-left">{translate('summaryKeyPointsTitle')}</h3>
                {summaryResult.keyPoints && summaryResult.keyPoints.length > 0 ? (
                  <ul className="list-disc list-inside space-y-3 text-sm font-headline text-left">
                    {summaryResult.keyPoints.map((point, index) => {
                      const formattedPoint = formatInlineMarkdown(point);
                      return <li key={index} dangerouslySetInnerHTML={{ __html: formattedPoint }} className="mb-2" />;
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground font-headline text-left">{translate('summaryNoKeyPointsGenerated')}</p>
                )}
              </div>
            )}
             {/* Botón para crear nuevo resumen */}
              <div className="mt-6 mb-4">
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="w-full font-semibold py-2 px-6 rounded-lg transition-colors border-primary text-primary hover:bg-primary/10 text-xs sm:text-sm"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> {translate('summaryNewSummary') || 'Generar Nuevo Resumen'}
                </Button>
              </div>
              
             <div className="mt-4 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Button
                onClick={handleDownloadPdf}
                className="font-semibold py-2 px-6 rounded-lg transition-colors home-card-button-blue text-xs sm:text-sm"
              >
                <Download className="mr-2 h-4 w-4" /> {translate('summaryActionDownloadPdf')}
              </Button>
              <Button asChild className="font-semibold py-2 px-6 rounded-lg transition-colors home-card-button-yellow text-xs sm:text-sm">
                <Link href="/dashboard/mapa-mental">
                  <Network className="mr-2 h-4 w-4" /> {translate('summaryActionCreateMap')}
                </Link>
              </Button>
              <Button asChild className="font-semibold py-2 px-6 rounded-lg transition-colors home-card-button-cyan text-xs sm:text-sm">
                <Link href="/dashboard/cuestionario">
                  <FileQuestion className="mr-2 h-4 w-4" /> {translate('summaryActionCreateQuiz')}
                </Link>
              </Button>
              <Button asChild className="font-semibold py-2 px-6 rounded-lg transition-colors home-card-button-purple text-xs sm:text-sm">
                <Link href="/dashboard/evaluacion">
                  <ClipboardList className="mr-2 h-4 w-4" /> {translate('summaryActionCreateEval')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
    

    
