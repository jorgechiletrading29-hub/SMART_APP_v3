import { NextRequest, NextResponse } from 'next/server';
import { generateSummary, type GenerateSummaryInput } from '@/ai/flows/generate-summary';
import { bookPDFs } from '@/lib/books-data';

// Helper function to get PDF content for a book and topic
async function extractPDFContent(bookTitle: string, topic: string, course?: string): Promise<string | null> {
  try {
    // Import the content generation logic from extract-pdf-content
    const { generateTopicContent } = await import('@/lib/pdf-content-generator');
    
    // Find the book
    const normalize = (s: string) => (s || '').trim().toLowerCase();
    let book = bookPDFs.find(b => normalize(b.title) === normalize(bookTitle));
    
    if (!book) {
      // Try to find by subject name
      book = bookPDFs.find(b => normalize(b.subject) === normalize(bookTitle));
    }
    
    if (!book && course) {
      // Try to find by course and subject
      book = bookPDFs.find(b => 
        normalize(b.course) === normalize(course) && 
        (normalize(b.subject) === normalize(bookTitle) || normalize(b.subject).includes(normalize(bookTitle)))
      );
    }
    
    if (!book) {
      // Fallback: find any book that contains the subject name
      book = bookPDFs.find(b => normalize(b.subject).includes(normalize(bookTitle)) || normalize(bookTitle).includes(normalize(b.subject)));
    }
    
    if (book) {
      const content = generateTopicContent(book.subject, topic, book.course);
      
      // IMPORTANTE: Verificar si el contenido es genérico
      // Si es genérico (empieza con "CONTENIDO EDUCATIVO:" y contiene frases genéricas),
      // NO lo usamos, para que la IA genere el contenido basado en sus conocimientos
      if (content && content.includes('CONTENIDO EDUCATIVO:') && 
          content.includes('se define como un conjunto de conocimientos y habilidades')) {
        console.log('[generate-summary] Detected generic content, will let AI generate from its knowledge');
        return null;
      }
      
      return content;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.bookTitle || !body.topic) {
      return NextResponse.json(
        { error: 'Missing required fields: bookTitle and topic are required' },
        { status: 400 }
      );
    }

    // Extract PDF content for the topic first
    const pdfContent = await extractPDFContent(body.bookTitle, body.topic, body.course);
    
    console.log('[generate-summary] PDF content extracted:', pdfContent ? `${pdfContent.length} chars` : 'No content');

    // Validate the input with PDF content
    const input: GenerateSummaryInput = {
      bookTitle: body.bookTitle,
      topic: body.topic,
      topicDescription: body.topicDescription, // Pass the topic description for orientation
      includeKeyPoints: body.includeKeyPoints,
      language: body.language,
      pdfContent: pdfContent || undefined, // Pass the extracted PDF content
      course: body.course, // Pass the course for age-appropriate content
    };

    // Generate the summary with the PDF content as context
    const result = await generateSummary(input);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate-summary API route:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
